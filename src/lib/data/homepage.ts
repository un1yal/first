import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";
import { formatNumber } from "@/lib/utils";
import type {
  CreatorAccount,
  FeaturedPlacement,
  LeaderboardSnapshot,
  WeeklyVisitorStats,
} from "@/types/database";

export interface LeaderboardEntry {
  rank: number;
  creator: CreatorAccount;
  metric_value: number;
  calculated_at: string;
  window_end: string;
}

export interface HomepageData {
  featured: FeaturedPlacement[];
  engagementTop: LeaderboardEntry[];
  impressionsTop: LeaderboardEntry[];
  recentlyClaimed: CreatorAccount[];
  visitors: WeeklyVisitorStats;
  isDemo: boolean;
  commercialBenchmarkingEnabled: boolean;
}

function mapLeaderboard(
  snapshots: LeaderboardSnapshot[],
  creators: CreatorAccount[],
  type: "engagement" | "impressions",
  limit = 3,
): LeaderboardEntry[] {
  return snapshots
    .filter((s) => s.leaderboard_type === type && s.coverage_valid)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((s) => {
      const creator = creators.find((c) => c.id === s.creator_account_id)!;
      return {
        rank: s.rank,
        creator,
        metric_value: Number(s.metric_value),
        calculated_at: s.calculated_at,
        window_end: s.window_end,
      };
    })
    .filter((e) => e.creator && e.creator.claimed_status === "claimed");
}

export async function getHomepageData(): Promise<HomepageData> {
  if (isDemoMode()) {
    const leaderboards = demoStore.getLeaderboards();
    return {
      featured: demoStore.featured,
      engagementTop: mapLeaderboard(leaderboards, demoStore.creators, "engagement"),
      impressionsTop: mapLeaderboard(leaderboards, demoStore.creators, "impressions"),
      recentlyClaimed: [...demoStore.creators]
        .filter((c) => c.claimed_status === "claimed")
        .sort(
          (a, b) =>
            new Date(b.connected_at ?? b.created_at).getTime() -
            new Date(a.connected_at ?? a.created_at).getTime(),
        )
        .slice(0, 6),
      visitors: demoStore.getWeeklyVisitors(),
      isDemo: true,
      commercialBenchmarkingEnabled: false,
    };
  }

  // Live Supabase path — imported dynamically to avoid client bundling issues
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const [
    { data: featured },
    { data: leaderboardRows },
    { data: creators },
    { data: visitorView },
    { data: config },
  ] = await Promise.all([
    supabase.from("featured_placements").select("*").order("slot_index"),
    supabase
      .from("leaderboard_snapshots")
      .select("*")
      .eq("coverage_valid", true)
      .order("calculated_at", { ascending: false })
      .limit(100),
    supabase
      .from("creator_accounts")
      .select("*")
      .eq("claimed_status", "claimed")
      .order("connected_at", { ascending: false })
      .limit(50),
    supabase.from("weekly_unique_visitors").select("*").maybeSingle(),
    supabase.from("platform_config").select("*").eq("key", "api_limits").maybeSingle(),
  ]);

  const latestByType = (type: "engagement" | "impressions") => {
    const rows = (leaderboardRows ?? []) as LeaderboardSnapshot[];
    if (!rows.length) return [];
    const latest = rows
      .filter((r) => r.leaderboard_type === type)
      .sort((a, b) => new Date(b.calculated_at).getTime() - new Date(a.calculated_at).getTime())[0]
      ?.calculated_at;
    return rows.filter((r) => r.leaderboard_type === type && r.calculated_at === latest);
  };

  const creatorList = (creators ?? []) as CreatorAccount[];
  const limits = (config?.value ?? {}) as { commercial_benchmarking_enabled?: boolean };

  return {
    featured: (featured as FeaturedPlacement[]) ?? [],
    engagementTop: mapLeaderboard(latestByType("engagement"), creatorList, "engagement"),
    impressionsTop: mapLeaderboard(latestByType("impressions"), creatorList, "impressions"),
    recentlyClaimed: creatorList.slice(0, 6),
    visitors: {
      unique_visitors: Number(visitorView?.unique_visitors ?? 0),
      page_views: Number(visitorView?.page_views ?? 0),
      window_start: visitorView?.window_start ?? new Date().toISOString(),
      window_end: visitorView?.window_end ?? new Date().toISOString(),
    },
    isDemo: false,
    commercialBenchmarkingEnabled: Boolean(limits.commercial_benchmarking_enabled),
  };
}

export function visitorLabel(stats: WeeklyVisitorStats) {
  if (!stats.unique_visitors) {
    return "Unique visitor data is being collected.";
  }
  return `AnalyticX reached ${formatNumber(stats.unique_visitors)} unique visitors this week.`;
}
