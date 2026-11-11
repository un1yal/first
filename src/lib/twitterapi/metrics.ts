import type { PostMetricSnapshot } from "@/types/database";

export interface MetricDelta {
 likes: number | null;
 replies: number | null;
 reposts: number | null;
 quotes: number | null;
 bookmarks: number | null;
 views: number | null;
 engagement: number | null;
 coverageValid: boolean;
 reason?: string;
}

const WINDOW_TOLERANCE_MS = 6 * 60 * 60 * 1000; // ±6h around 24h for daily snapshot strategies
const TARGET_WINDOW_MS = 24 * 60 * 60 * 1000;

function delta(latest: number | null | undefined, earlier: number | null | undefined) {
 if (latest === null || latest === undefined || earlier === null || earlier === undefined) {
 return null;
 }
 return Math.max(0, latest - earlier);
}

/**
 * Compute 24h deltas between two timestamped metric snapshots.
 * Missing values are treated as unavailable (null), never as zero.
 */
export function calculateMetricDelta(
 latest: Pick<PostMetricSnapshot, "views" | "likes" | "replies" | "reposts" | "quotes" | "bookmarks" | "recorded_at"> | null,
 earlier: Pick<PostMetricSnapshot, "views" | "likes" | "replies" | "reposts" | "quotes" | "bookmarks" | "recorded_at"> | null,
 options: { requireCoverage?: boolean } = {},
): MetricDelta {
 if (!latest || !earlier) {
 return {
 likes: null,
 replies: null,
 reposts: null,
 quotes: null,
 bookmarks: null,
 views: null,
 engagement: null,
 coverageValid: false,
 reason: "insufficient_snapshots",
 };
 }

 const latestTs = new Date(latest.recorded_at).getTime();
 const earlierTs = new Date(earlier.recorded_at).getTime();
 const gap = latestTs - earlierTs;

 const coverageValid =
 gap >= TARGET_WINDOW_MS - WINDOW_TOLERANCE_MS &&
 gap <= TARGET_WINDOW_MS + WINDOW_TOLERANCE_MS + 12 * 60 * 60 * 1000;

 if (options.requireCoverage !== false && !coverageValid) {
 return {
 likes: null,
 replies: null,
 reposts: null,
 quotes: null,
 bookmarks: null,
 views: null,
 engagement: null,
 coverageValid: false,
 reason: "window_out_of_range",
 };
 }

 const likes = delta(latest.likes, earlier.likes);
 const replies = delta(latest.replies, earlier.replies);
 const reposts = delta(latest.reposts, earlier.reposts);
 const quotes = delta(latest.quotes, earlier.quotes);
 const bookmarks = delta(latest.bookmarks, earlier.bookmarks);
 const views = delta(latest.views, earlier.views);

 const engagementParts = [likes, replies, reposts, quotes];
 const engagement =
 engagementParts.every((v) => v !== null)
 ? (likes as number) + (replies as number) + (reposts as number) + (quotes as number)
 : null;

 return {
 likes,
 replies,
 reposts,
 quotes,
 bookmarks,
 views,
 engagement,
 coverageValid,
 };
}

export function findSnapshotNear(
 snapshots: Array<Pick<PostMetricSnapshot, "recorded_at"> & Record<string, unknown>>,
 targetIso: string,
 toleranceMs = WINDOW_TOLERANCE_MS,
) {
 const target = new Date(targetIso).getTime();
 let best: (typeof snapshots)[number] | null = null;
 let bestDistance = Number.POSITIVE_INFINITY;

 for (const snap of snapshots) {
 const distance = Math.abs(new Date(snap.recorded_at).getTime() - target);
 if (distance < bestDistance) {
 best = snap;
 bestDistance = distance;
 }
 }

 if (!best || bestDistance > toleranceMs + 12 * 60 * 60 * 1000) {
 return null;
 }

 return best;
}

export function engagementRate(options: {
 engagement: number | null;
 impressions: number | null;
 followers?: number | null;
}) {
 if (options.impressions && options.impressions > 0 && options.engagement !== null) {
 return (options.engagement / options.impressions) * 100;
 }
 if (options.followers && options.followers > 0 && options.engagement !== null) {
 return (options.engagement / options.followers) * 100;
 }
 return null;
}
