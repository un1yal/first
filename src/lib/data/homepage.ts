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
 post_snippet: string | null;
}

export interface HomepageHighlights {
 creatorsTracked: number;
 topPostToday: {
 text: string | null;
 username: string | null;
 engagement: number | null;
 };
 totalImpressionsToday: number;
}

export interface HomepageData {
 featured: FeaturedPlacement[];
 engagementTop: LeaderboardEntry[];
 impressionsTop: LeaderboardEntry[];
 recentlyClaimed: CreatorAccount[];
 trendingCreators: CreatorAccount[];
 highlights: HomepageHighlights;
 visitors: WeeklyVisitorStats;
 isDemo: boolean;
 commercialBenchmarkingEnabled: boolean;
}

function snippetForCreator(
 creatorId: string,
 posts: Array<{ creator_account_id: string; post_text: string | null }>,
): string | null {
 const post = posts.find((p) => p.creator_account_id === creatorId);
 if (!post?.post_text) return null;
 return post.post_text.length > 90
 ? `${post.post_text.slice(0, 87)}…`
 : post.post_text;
}

function mapLeaderboard(
 snapshots: LeaderboardSnapshot[],
 creators: CreatorAccount[],
 posts: Array<{ creator_account_id: string; post_text: string | null }>,
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
 post_snippet: creator ? snippetForCreator(creator.id, posts) : null,
 };
 })
 .filter((e) => e.creator && e.creator.claimed_status === "claimed");
}

function buildHighlights(
 creators: CreatorAccount[],
 engagementTop: LeaderboardEntry[],
 impressionsTop: LeaderboardEntry[],
 posts: Array<{
 creator_account_id: string;
 post_text: string | null;
 }>,
): HomepageHighlights {
 const topEngagement = engagementTop[0];
 const totalImpressionsToday = impressionsTop.reduce(
 (sum, entry) => sum + (Number.isFinite(entry.metric_value) ? entry.metric_value : 0),
 0,
 );

 return {
 creatorsTracked: creators.filter((c) => c.claimed_status === "claimed").length,
 topPostToday: {
 text: topEngagement?.post_snippet ?? posts[0]?.post_text ?? null,
 username: topEngagement?.creator.username ?? null,
 engagement: topEngagement?.metric_value ?? null,
 },
 totalImpressionsToday,
 };
}

export async function getHomepageData(): Promise<HomepageData> {
 if (isDemoMode()) {
 const leaderboards = demoStore.getLeaderboards();
 const posts = demoStore.posts.map((p) => ({
 creator_account_id: p.creator_account_id,
 post_text: p.post_text,
 }));
 const engagementTop = mapLeaderboard(
 leaderboards,
 demoStore.creators,
 posts,
 "engagement",
 );
 const impressionsTop = mapLeaderboard(
 leaderboards,
 demoStore.creators,
 posts,
 "impressions",
 );
 const claimed = [...demoStore.creators].filter(
 (c) => c.claimed_status === "claimed",
 );
 const recentlyClaimed = [...claimed]
 .sort(
 (a, b) =>
 new Date(b.connected_at ?? b.created_at).getTime() -
 new Date(a.connected_at ?? a.created_at).getTime(),
 )
 .slice(0, 4);
 const trendingCreators = [...claimed]
 .sort((a, b) => b.followers_count - a.followers_count)
 .slice(0, 4);

 return {
 featured: demoStore.featured,
 engagementTop,
 impressionsTop,
 recentlyClaimed,
 trendingCreators,
 highlights: buildHighlights(claimed, engagementTop, impressionsTop, posts),
 visitors: demoStore.getWeeklyVisitors(),
 isDemo: true,
 commercialBenchmarkingEnabled: false,
 };
 }

 const { createClient } = await import("@/lib/supabase/server");
 const supabase = await createClient();

 const [
 { data: featured },
 { data: leaderboardRows },
 { data: creators },
 { data: visitorView },
 { data: config },
 { data: posts },
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
 supabase
 .from("posts")
 .select("creator_account_id, post_text, published_at")
 .order("published_at", { ascending: false })
 .limit(80),
 ]);

 const latestByType = (type: "engagement" | "impressions") => {
 const rows = (leaderboardRows ?? []) as LeaderboardSnapshot[];
 if (!rows.length) return [];
 const latest = rows
 .filter((r) => r.leaderboard_type === type)
 .sort(
 (a, b) =>
 new Date(b.calculated_at).getTime() - new Date(a.calculated_at).getTime(),
 )[0]?.calculated_at;
 return rows.filter(
 (r) => r.leaderboard_type === type && r.calculated_at === latest,
 );
 };

 const creatorList = (creators ?? []) as CreatorAccount[];
 const postList = (posts ?? []) as Array<{
 creator_account_id: string;
 post_text: string | null;
 }>;
 const limits = (config?.value ?? {}) as {
 commercial_benchmarking_enabled?: boolean;
 };
 const engagementTop = mapLeaderboard(
 latestByType("engagement"),
 creatorList,
 postList,
 "engagement",
 );
 const impressionsTop = mapLeaderboard(
 latestByType("impressions"),
 creatorList,
 postList,
 "impressions",
 );

 return {
 featured: (featured as FeaturedPlacement[]) ?? [],
 engagementTop,
 impressionsTop,
 recentlyClaimed: creatorList.slice(0, 4),
 trendingCreators: [...creatorList]
 .sort((a, b) => b.followers_count - a.followers_count)
 .slice(0, 4),
 highlights: buildHighlights(
 creatorList,
 engagementTop,
 impressionsTop,
 postList,
 ),
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
 return `StatisticX reached ${formatNumber(stats.unique_visitors)} unique visitors this week.`;
}
