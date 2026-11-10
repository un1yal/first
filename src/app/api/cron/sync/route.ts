import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/data/mode";
import { demoStore } from "@/lib/demo/store";
import {
  DEFAULT_SYNC_LIMITS,
  syncCreatorPosts,
  syncCreatorProfile,
} from "@/lib/sync/creator-sync";
import { calculateCreatorWindowMetrics, rankCreators } from "@/lib/analytics/engagement";

/**
 * Vercel Cron / manual trigger for sync + leaderboard recalculation.
 * Protect with CRON_SECRET. Free-tier Vercel allows limited cron jobs.
 */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDemoMode()) {
    const boards = demoStore.getLeaderboards();
    return NextResponse.json({
      ok: true,
      mode: "demo",
      message:
        "Demo mode recalculated in-memory leaderboards. Configure Supabase + TwitterAPI.io for production sync.",
      leaderboardRows: boards.length,
      note: "Scheduled jobs are not active until deployed with credentials and Vercel Cron configured.",
    });
  }

  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = createServiceClient();

  const { data: creators } = await supabase
    .from("creator_accounts")
    .select("*")
    .eq("claimed_status", "claimed")
    .limit(100);

  const results = [];
  for (const creator of creators ?? []) {
    const profile = await syncCreatorProfile(creator.username);
    if (profile.ok) {
      await supabase
        .from("creator_accounts")
        .update({ ...profile.fields, last_synced_at: new Date().toISOString() })
        .eq("id", creator.id);
      await supabase.from("creator_snapshots").insert({
        creator_account_id: creator.id,
        followers_count: profile.fields.followers_count,
        following_count: profile.fields.following_count,
        posts_count: profile.fields.posts_count,
      });
      await supabase.from("api_usage").insert({
        creator_account_id: creator.id,
        endpoint: profile.meta.endpoint,
        request_count: 1,
        items_returned: profile.meta.itemsReturned,
        estimated_cost_credits: profile.meta.estimatedCostCredits,
        estimated_cost_usd: profile.meta.estimatedCostUsd,
      });
    }

    const postsSync = await syncCreatorPosts(
      creator.x_user_id,
      creator.id,
      DEFAULT_SYNC_LIMITS,
    );

    for (const post of postsSync.posts) {
      const { data: upserted } = await supabase
        .from("posts")
        .upsert(post, { onConflict: "creator_account_id,x_post_id" })
        .select("id,x_post_id")
        .single();
      const metric = postsSync.metrics.find((m) => m.x_post_id === post.x_post_id);
      if (upserted && metric) {
        await supabase.from("post_metric_snapshots").insert({
          post_id: upserted.id,
          views: metric.views,
          likes: metric.likes,
          replies: metric.replies,
          reposts: metric.reposts,
          quotes: metric.quotes,
          bookmarks: metric.bookmarks,
          recorded_at: metric.recorded_at,
        });
      }
    }

    results.push({
      creatorId: creator.id,
      posts: postsSync.count,
      pages: postsSync.pages,
    });
  }

  // Recalculate leaderboards from latest vs ~24h snapshots
  const rankingInputs = [];
  for (const creator of creators ?? []) {
    const { data: posts } = await supabase
      .from("posts")
      .select("id")
      .eq("creator_account_id", creator.id);
    const byPost: Record<string, Array<Record<string, unknown>>> = {};
    for (const post of posts ?? []) {
      const { data: snaps } = await supabase
        .from("post_metric_snapshots")
        .select("*")
        .eq("post_id", post.id)
        .order("recorded_at", { ascending: true });
      byPost[post.id] = snaps ?? [];
    }
    const metrics = calculateCreatorWindowMetrics(
      byPost as never,
      { followers: creator.followers_count },
    );
    rankingInputs.push({ creator, metrics });
  }

  const now = new Date().toISOString();
  const start = new Date(Date.now() - 24 * 3600_000).toISOString();
  const engagement = rankCreators(
    rankingInputs.map((r) => ({
      creatorAccountId: r.creator.id,
      metric: r.metrics.engagement24h,
      coverageValid: r.metrics.coverageValid,
    })),
  );
  const impressions = rankCreators(
    rankingInputs.map((r) => ({
      creatorAccountId: r.creator.id,
      metric: r.metrics.impressions24h,
      coverageValid: r.metrics.coverageValid,
    })),
  );

  const rows = [
    ...engagement.map((r) => ({
      creator_account_id: r.creatorAccountId,
      leaderboard_type: "engagement",
      metric_value: r.metric_value,
      window_start: start,
      window_end: now,
      rank: r.rank,
      coverage_valid: true,
    })),
    ...impressions.map((r) => ({
      creator_account_id: r.creatorAccountId,
      leaderboard_type: "impressions",
      metric_value: r.metric_value,
      window_start: start,
      window_end: now,
      rank: r.rank,
      coverage_valid: true,
    })),
  ];

  if (rows.length) {
    await supabase.from("leaderboard_snapshots").insert(rows);
  }

  return NextResponse.json({
    ok: true,
    synced: results.length,
    leaderboardRows: rows.length,
    results,
  });
}
