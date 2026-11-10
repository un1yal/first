import {
  calculateMetricDelta,
  engagementRate,
  findSnapshotNear,
} from "@/lib/twitterapi/metrics";
import type { PostMetricSnapshot } from "@/types/database";

export interface CreatorWindowMetrics {
  engagement24h: number | null;
  impressions24h: number | null;
  likes24h: number | null;
  replies24h: number | null;
  reposts24h: number | null;
  quotes24h: number | null;
  bookmarks24h: number | null;
  engagementRate: number | null;
  coverageValid: boolean;
  windowStart: string | null;
  windowEnd: string | null;
  postsCovered: number;
  postsExcluded: number;
}

type Snap = Pick<
  PostMetricSnapshot,
  "post_id" | "views" | "likes" | "replies" | "reposts" | "quotes" | "bookmarks" | "recorded_at"
>;

/**
 * Aggregate rolling ~24h engagement/impressions across posts using snapshot pairs.
 * Posts without valid coverage are excluded, never treated as zero.
 */
export function calculateCreatorWindowMetrics(
  snapshotsByPost: Record<string, Snap[]>,
  options: { now?: Date; followers?: number | null } = {},
): CreatorWindowMetrics {
  const now = options.now ?? new Date();
  const windowEnd = now.toISOString();
  const windowStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const windowStart = windowStartDate.toISOString();

  let engagementSum = 0;
  let impressionsSum = 0;
  let likesSum = 0;
  let repliesSum = 0;
  let repostsSum = 0;
  let quotesSum = 0;
  let bookmarksSum = 0;
  let postsCovered = 0;
  let postsExcluded = 0;
  let hasEngagement = false;
  let hasImpressions = false;

  for (const snaps of Object.values(snapshotsByPost)) {
    if (!snaps.length) {
      postsExcluded += 1;
      continue;
    }

    const sorted = [...snaps].sort(
      (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime(),
    );
    const latest = sorted[sorted.length - 1];
    const earlier = findSnapshotNear(sorted.slice(0, -1), windowStart);

    const delta = calculateMetricDelta(latest, earlier as Snap | null);
    if (!delta.coverageValid) {
      postsExcluded += 1;
      continue;
    }

    postsCovered += 1;
    if (delta.engagement !== null) {
      engagementSum += delta.engagement;
      hasEngagement = true;
    }
    if (delta.views !== null) {
      impressionsSum += delta.views;
      hasImpressions = true;
    }
    if (delta.likes !== null) likesSum += delta.likes;
    if (delta.replies !== null) repliesSum += delta.replies;
    if (delta.reposts !== null) repostsSum += delta.reposts;
    if (delta.quotes !== null) quotesSum += delta.quotes;
    if (delta.bookmarks !== null) bookmarksSum += delta.bookmarks;
  }

  const engagement24h = hasEngagement ? engagementSum : null;
  const impressions24h = hasImpressions ? impressionsSum : null;

  return {
    engagement24h,
    impressions24h,
    likes24h: hasEngagement ? likesSum : null,
    replies24h: hasEngagement ? repliesSum : null,
    reposts24h: hasEngagement ? repostsSum : null,
    quotes24h: hasEngagement ? quotesSum : null,
    bookmarks24h: hasEngagement ? bookmarksSum : null,
    engagementRate: engagementRate({
      engagement: engagement24h,
      impressions: impressions24h,
      followers: options.followers,
    }),
    coverageValid: postsCovered > 0,
    windowStart,
    windowEnd,
    postsCovered,
    postsExcluded,
  };
}

export function rankCreators(
  rows: Array<{ creatorAccountId: string; metric: number | null; coverageValid: boolean }>,
) {
  return rows
    .filter((r) => r.coverageValid && r.metric !== null)
    .sort((a, b) => (b.metric as number) - (a.metric as number))
    .map((r, index) => ({
      creatorAccountId: r.creatorAccountId,
      metric_value: r.metric as number,
      rank: index + 1,
    }));
}
