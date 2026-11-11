/**
 * In-memory demo store used when Supabase credentials are not configured.
 * All demo metrics are clearly labelled in the UI. Real deployments use Supabase.
 */

import { calculateCreatorWindowMetrics, rankCreators } from "@/lib/analytics/engagement";
import { computeWeeklyStats } from "@/lib/analytics/visitors";
import { listMockUsers } from "@/lib/twitterapi";
import type {
  CreatorAccount,
  CreatorPackage,
  FeaturedPlacement,
  FlexCard,
  LeaderboardSnapshot,
  Notification,
  Post,
  PostMetricSnapshot,
  Profile,
  PromotionOffer,
  PublicProfile,
  WeeklyVisitorStats,
} from "@/types/database";

function id() {
  return crypto.randomUUID();
}

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

const demoProfiles: Profile[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    email: "admin@statisticx.app",
    display_name: "Admin",
    avatar_url: null,
    role: "admin",
    is_suspended: false,
    theme_preference: "light",
    created_at: hoursAgo(240),
    updated_at: hoursAgo(1),
  },
];

const mockUsers = listMockUsers().filter((u) => u.userName !== "elonmusk");

const demoCreators: CreatorAccount[] = mockUsers.map((u, index) => ({
  id: `creator-${u.id}`,
  user_id: index === 0 ? "00000000-0000-4000-8000-000000000001" : null,
  x_user_id: u.id,
  username: u.userName,
  display_name: u.name ?? u.userName,
  profile_image_url: u.profilePicture ?? null,
  banner_url: u.coverPicture || null,
  biography: u.description ?? null,
  location: u.location || null,
  website: null,
  followers_count: u.followers ?? 0,
  following_count: u.following ?? 0,
  posts_count: u.statusesCount ?? 0,
  media_count: u.mediaCount ?? null,
  favourites_count: u.favouritesCount ?? null,
  is_blue_verified: Boolean(u.isBlueVerified),
  verified_type: u.verifiedType ?? null,
  account_created_at: u.createdAt ?? null,
  claimed_status: "claimed",
  marketplace_enabled: index < 2,
  connected_at: hoursAgo(72),
  last_synced_at: hoursAgo(1),
  created_at: hoursAgo(72),
  updated_at: hoursAgo(1),
}));

const demoPosts: Post[] = [];
const demoMetrics: PostMetricSnapshot[] = [];

for (const creator of demoCreators) {
  for (let i = 0; i < 8; i++) {
    const postId = id();
    const xPostId = `${creator.x_user_id}${String(i).padStart(4, "0")}`;
    demoPosts.push({
      id: postId,
      creator_account_id: creator.id,
      x_post_id: xPostId,
      post_text: `Demo post #${i + 1} from @${creator.username}`,
      post_url: `https://x.com/${creator.username}/status/${xPostId}`,
      published_at: hoursAgo(i * 8 + 4),
      lang: "en",
      is_reply: false,
      media_type: null,
      hashtags: ["statisticx"],
      mentions: [],
      created_at: hoursAgo(i * 8 + 4),
      updated_at: hoursAgo(1),
    });

    const baseViews = 4000 + i * 700 + demoCreators.indexOf(creator) * 1200;
    const baseLikes = 80 + i * 12;
    const baseReplies = 12 + i * 2;
    const baseReposts = 18 + i * 3;
    const baseQuotes = 4 + i;
    const baseBookmarks = 6 + i;

    // Earlier snapshot (~24h ago)
    demoMetrics.push({
      id: id(),
      post_id: postId,
      views: baseViews,
      likes: baseLikes,
      replies: baseReplies,
      reposts: baseReposts,
      quotes: baseQuotes,
      bookmarks: baseBookmarks,
      recorded_at: hoursAgo(24),
    });

    // Latest snapshot
    demoMetrics.push({
      id: id(),
      post_id: postId,
      views: baseViews + 900 + i * 40,
      likes: baseLikes + 25 + i * 3,
      replies: baseReplies + 6 + i,
      reposts: baseReposts + 8 + i,
      quotes: baseQuotes + 2,
      bookmarks: baseBookmarks + 3,
      recorded_at: hoursAgo(0.5),
    });
  }
}

const demoPublicProfiles: PublicProfile[] = demoCreators.map((c) => ({
  id: id(),
  creator_account_id: c.id,
  slug: c.username,
  is_published: true,
  visibility_settings: {
    show_followers: true,
    show_following: true,
    show_engagement: true,
    show_impressions: true,
    show_growth: true,
    show_posts: true,
    show_biography: true,
  },
  public_bio: c.biography,
  category: c.username.includes("one")
    ? "SaaS"
    : c.username.includes("two")
      ? "Design"
      : "Growth",
  created_at: hoursAgo(70),
  updated_at: hoursAgo(1),
}));

const demoPackages: CreatorPackage[] = [
  {
    id: id(),
    creator_account_id: demoCreators[0].id,
    package_name: "Sponsored post",
    description: "One original promotional post to my audience.",
    package_type: "sponsored_post",
    price: 450,
    currency: "USD",
    duration_days: 1,
    deliverables: "1 feed post + analytics screenshot",
    terms: "Payment arranged outside StatisticX in this release.",
    is_active: true,
    created_at: hoursAgo(48),
    updated_at: hoursAgo(48),
  },
  {
    id: id(),
    creator_account_id: demoCreators[0].id,
    package_name: "Pinned post — 3 days",
    description: "Pinned placement for three days.",
    package_type: "pinned_post",
    price: 900,
    currency: "USD",
    duration_days: 3,
    deliverables: "Pinned post for 3 days",
    terms: "Payment outside StatisticX.",
    is_active: true,
    created_at: hoursAgo(48),
    updated_at: hoursAgo(48),
  },
];

const demoOffers: PromotionOffer[] = [];
const demoNotifications: Notification[] = [];
const demoFlexCards: FlexCard[] = [];
const demoVisitorEvents: Array<{
  id: string;
  anonymous_visitor_id: string;
  page_path: string;
  event_type: "page_view";
  is_admin: boolean;
  visited_at: string;
}> = Array.from({ length: 86 }).map((_, i) => ({
  id: id(),
  anonymous_visitor_id: `visitor-${(i % 37) + 1}`,
  page_path: i % 3 === 0 ? "/" : i % 3 === 1 ? "/marketplace" : "/discover",
  event_type: "page_view" as const,
  is_admin: false,
  visited_at: hoursAgo(i * 1.5),
}));

const featured: FeaturedPlacement[] = [
  {
    id: id(),
    slot_index: 1,
    creator_account_id: null,
    title: null,
    image_url: null,
    destination_url: null,
    is_sponsored: false,
    is_active: false,
    created_at: hoursAgo(1),
    updated_at: hoursAgo(1),
  },
  {
    id: id(),
    slot_index: 2,
    creator_account_id: null,
    title: null,
    image_url: null,
    destination_url: null,
    is_sponsored: false,
    is_active: false,
    created_at: hoursAgo(1),
    updated_at: hoursAgo(1),
  },
  {
    id: id(),
    slot_index: 3,
    creator_account_id: null,
    title: null,
    image_url: null,
    destination_url: null,
    is_sponsored: false,
    is_active: false,
    created_at: hoursAgo(1),
    updated_at: hoursAgo(1),
  },
];

function buildLeaderboards(): LeaderboardSnapshot[] {
  const rows = demoCreators.map((creator) => {
    const posts = demoPosts.filter((p) => p.creator_account_id === creator.id);
    const byPost: Record<string, PostMetricSnapshot[]> = {};
    for (const post of posts) {
      byPost[post.id] = demoMetrics.filter((m) => m.post_id === post.id);
    }
    const metrics = calculateCreatorWindowMetrics(byPost, {
      followers: creator.followers_count,
    });
    return { creator, metrics };
  });

  const engagementRanks = rankCreators(
    rows.map((r) => ({
      creatorAccountId: r.creator.id,
      metric: r.metrics.engagement24h,
      coverageValid: r.metrics.coverageValid,
    })),
  );
  const impressionRanks = rankCreators(
    rows.map((r) => ({
      creatorAccountId: r.creator.id,
      metric: r.metrics.impressions24h,
      coverageValid: r.metrics.coverageValid,
    })),
  );

  const now = new Date().toISOString();
  const start = hoursAgo(24);

  return [
    ...engagementRanks.map((r) => ({
      id: id(),
      creator_account_id: r.creatorAccountId,
      leaderboard_type: "engagement" as const,
      metric_value: r.metric_value,
      window_start: start,
      window_end: now,
      rank: r.rank,
      calculated_at: now,
      coverage_valid: true,
    })),
    ...impressionRanks.map((r) => ({
      id: id(),
      creator_account_id: r.creatorAccountId,
      leaderboard_type: "impressions" as const,
      metric_value: r.metric_value,
      window_start: start,
      window_end: now,
      rank: r.rank,
      calculated_at: now,
      coverage_valid: true,
    })),
  ];
}

let leaderboards = buildLeaderboards();

export const demoStore = {
  isDemo: true as const,
  profiles: demoProfiles,
  creators: demoCreators,
  posts: demoPosts,
  metrics: demoMetrics,
  publicProfiles: demoPublicProfiles,
  packages: demoPackages,
  offers: demoOffers,
  notifications: demoNotifications,
  flexCards: demoFlexCards,
  visitorEvents: demoVisitorEvents,
  featured,
  getLeaderboards() {
    leaderboards = buildLeaderboards();
    return leaderboards;
  },
  getWeeklyVisitors(): WeeklyVisitorStats {
    return computeWeeklyStats(demoVisitorEvents);
  },
  getCreatorMetrics(creatorId: string) {
    const creator = demoCreators.find((c) => c.id === creatorId);
    const posts = demoPosts.filter((p) => p.creator_account_id === creatorId);
    const byPost: Record<string, PostMetricSnapshot[]> = {};
    for (const post of posts) {
      byPost[post.id] = demoMetrics.filter((m) => m.post_id === post.id);
    }
    return calculateCreatorWindowMetrics(byPost, {
      followers: creator?.followers_count,
    });
  },
  trackVisit(visitorId: string, path: string, isAdmin = false) {
    demoVisitorEvents.push({
      id: id(),
      anonymous_visitor_id: visitorId,
      page_path: path,
      event_type: "page_view",
      is_admin: isAdmin,
      visited_at: new Date().toISOString(),
    });
  },
};
