import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";
import type { CreatorAccount, CreatorPackage, PublicProfile } from "@/types/database";
import type { CreatorWindowMetrics } from "@/lib/analytics/engagement";

export type DashboardPost = {
 id: string;
 creator_account_id: string;
 x_post_id: string;
 post_text: string | null;
 post_url: string | null;
 published_at: string | null;
 views: number | null;
 likes: number | null;
 replies: number | null;
 reposts: number | null;
 quotes: number | null;
 bookmarks: number | null;
 engagement: number | null;
};

export type DashboardOverview = {
 isDemo: boolean;
 needsOnboarding?: boolean;
 creator: CreatorAccount | null;
 metrics: CreatorWindowMetrics;
 posts: DashboardPost[];
 packages: CreatorPackage[];
 offers: unknown[];
 publicProfile: PublicProfile | null | undefined;
 growth: Array<{ date: string; followers: number }>;
};

const emptyMetrics: CreatorWindowMetrics = {
 engagement24h: null,
 impressions24h: null,
 likes24h: null,
 replies24h: null,
 reposts24h: null,
 quotes24h: null,
 bookmarks24h: null,
 engagementRate: null,
 coverageValid: false,
 windowStart: null,
 windowEnd: null,
 postsCovered: 0,
 postsExcluded: 0,
};

export async function getDashboardOverview(): Promise<DashboardOverview | null> {
 if (isDemoMode()) {
 const creator = demoStore.creators[0];
 const metrics = demoStore.getCreatorMetrics(creator.id);
 const posts: DashboardPost[] = demoStore.posts
 .filter((p) => p.creator_account_id === creator.id)
 .map((post) => {
 const snaps = demoStore.metrics
 .filter((m) => m.post_id === post.id)
 .sort(
 (a, b) =>
 new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime(),
 );
 const latest = snaps[0];
 return {
 id: post.id,
 creator_account_id: post.creator_account_id,
 x_post_id: post.x_post_id,
 post_text: post.post_text,
 post_url: post.post_url,
 published_at: post.published_at,
 views: latest?.views ?? null,
 likes: latest?.likes ?? null,
 replies: latest?.replies ?? null,
 reposts: latest?.reposts ?? null,
 quotes: latest?.quotes ?? null,
 bookmarks: latest?.bookmarks ?? null,
 engagement:
 latest &&
 latest.likes != null &&
 latest.replies != null &&
 latest.reposts != null &&
 latest.quotes != null
 ? latest.likes + latest.replies + latest.reposts + latest.quotes
 : null,
 };
 });

 return {
 isDemo: true,
 creator,
 metrics,
 posts,
 packages: demoStore.packages.filter((p) => p.creator_account_id === creator.id),
 offers: demoStore.offers,
 publicProfile: demoStore.publicProfiles.find(
 (p) => p.creator_account_id === creator.id,
 ),
 growth: Array.from({ length: 14 }).map((_, i) => ({
 date: new Date(Date.now() - (13 - i) * 86400_000).toISOString().slice(0, 10),
 followers: creator.followers_count - (13 - i) * 18,
 })),
 };
 }

 const { createClient } = await import("@/lib/supabase/server");
 const supabase = await createClient();
 const {
 data: { user },
 } = await supabase.auth.getUser();
 if (!user) return null;

 const { data: creator } = await supabase
 .from("creator_accounts")
 .select("*")
 .eq("user_id", user.id)
 .maybeSingle();

 if (!creator) {
 return {
 isDemo: false,
 creator: null,
 needsOnboarding: true,
 metrics: emptyMetrics,
 posts: [],
 packages: [],
 offers: [],
 publicProfile: null,
 growth: [],
 };
 }

 const { data: posts } = await supabase
 .from("posts")
 .select("*, post_metric_snapshots(*)")
 .eq("creator_account_id", creator.id)
 .order("published_at", { ascending: false })
 .limit(50);

 const mappedPosts: DashboardPost[] = (posts ?? []).map((post) => {
 const snaps = ((post.post_metric_snapshots ?? []) as Array<{
 recorded_at: string;
 views: number | null;
 likes: number | null;
 replies: number | null;
 reposts: number | null;
 quotes: number | null;
 bookmarks: number | null;
 }>).sort(
 (a, b) =>
 new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime(),
 );
 const latest = snaps[0];
 return {
 id: post.id,
 creator_account_id: post.creator_account_id,
 x_post_id: post.x_post_id,
 post_text: post.post_text,
 post_url: post.post_url,
 published_at: post.published_at,
 views: latest?.views ?? null,
 likes: latest?.likes ?? null,
 replies: latest?.replies ?? null,
 reposts: latest?.reposts ?? null,
 quotes: latest?.quotes ?? null,
 bookmarks: latest?.bookmarks ?? null,
 engagement:
 latest &&
 latest.likes != null &&
 latest.replies != null &&
 latest.reposts != null &&
 latest.quotes != null
 ? latest.likes + latest.replies + latest.reposts + latest.quotes
 : null,
 };
 });

 const { data: packages } = await supabase
 .from("creator_packages")
 .select("*")
 .eq("creator_account_id", creator.id);
 const { data: publicProfile } = await supabase
 .from("public_profiles")
 .select("*")
 .eq("creator_account_id", creator.id)
 .maybeSingle();
 const { data: snapshots } = await supabase
 .from("creator_snapshots")
 .select("*")
 .eq("creator_account_id", creator.id)
 .order("recorded_at", { ascending: true })
 .limit(90);

 return {
 isDemo: false,
 creator: creator as CreatorAccount,
 metrics: emptyMetrics,
 posts: mappedPosts,
 packages: (packages as CreatorPackage[]) ?? [],
 offers: [],
 publicProfile: publicProfile as PublicProfile | null,
 growth: (snapshots ?? []).map((s) => ({
 date: s.recorded_at.slice(0, 10),
 followers: s.followers_count,
 })),
 };
}
