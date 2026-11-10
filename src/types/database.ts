export type UserRole = "user" | "creator" | "admin";
export type ClaimedStatus =
  | "unclaimed"
  | "pending_verification"
  | "claimed"
  | "unavailable";
export type LeaderboardType = "engagement" | "impressions";
export type SyncJobType =
  | "profile"
  | "posts"
  | "metrics"
  | "leaderboard"
  | "visitors";
export type SyncJobStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";
export type OfferStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "counter_offered"
  | "cancelled"
  | "completed";
export type PackageType =
  | "sponsored_post"
  | "pinned_post"
  | "product_announcement"
  | "product_review"
  | "brand_mention"
  | "campaign_promotion"
  | "custom";

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_suspended: boolean;
  theme_preference: "dark" | "light" | "system";
  created_at: string;
  updated_at: string;
}

export interface CreatorAccount {
  id: string;
  user_id: string | null;
  x_user_id: string;
  username: string;
  display_name: string | null;
  profile_image_url: string | null;
  banner_url: string | null;
  biography: string | null;
  location: string | null;
  website: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  media_count: number | null;
  favourites_count: number | null;
  is_blue_verified: boolean;
  verified_type: string | null;
  account_created_at: string | null;
  claimed_status: ClaimedStatus;
  marketplace_enabled: boolean;
  connected_at: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClaimVerification {
  id: string;
  user_id: string;
  x_user_id: string;
  username: string;
  verification_code_hash: string;
  expires_at: string;
  verified_at: string | null;
  created_at: string;
}

export interface CreatorSnapshot {
  id: string;
  creator_account_id: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  recorded_at: string;
}

export interface Post {
  id: string;
  creator_account_id: string;
  x_post_id: string;
  post_text: string | null;
  post_url: string | null;
  published_at: string | null;
  lang: string | null;
  is_reply: boolean;
  media_type: string | null;
  hashtags: string[] | null;
  mentions: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface PostMetricSnapshot {
  id: string;
  post_id: string;
  views: number | null;
  likes: number | null;
  replies: number | null;
  reposts: number | null;
  quotes: number | null;
  bookmarks: number | null;
  recorded_at: string;
}

export interface PublicProfileVisibility {
  show_followers: boolean;
  show_following: boolean;
  show_engagement: boolean;
  show_impressions: boolean;
  show_growth: boolean;
  show_posts: boolean;
  show_biography: boolean;
}

export interface PublicProfile {
  id: string;
  creator_account_id: string;
  slug: string;
  is_published: boolean;
  visibility_settings: PublicProfileVisibility;
  public_bio: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardSnapshot {
  id: string;
  creator_account_id: string;
  leaderboard_type: LeaderboardType;
  metric_value: number;
  window_start: string;
  window_end: string;
  rank: number;
  calculated_at: string;
  coverage_valid: boolean;
}

export interface SyncJob {
  id: string;
  creator_account_id: string | null;
  job_type: SyncJobType;
  status: SyncJobStatus;
  records_processed: number;
  pages_processed: number;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  created_at: string;
}

export interface ApiUsage {
  id: string;
  creator_account_id: string | null;
  endpoint: string;
  request_count: number;
  items_returned: number;
  estimated_cost_credits: number;
  estimated_cost_usd: number;
  created_at: string;
}

export interface FlexCard {
  id: string;
  creator_account_id: string;
  template: "minimal" | "dark" | "light" | "analytics";
  metrics_snapshot: Record<string, number | string | null>;
  generated_at: string;
}

export interface VisitorEvent {
  id: string;
  anonymous_visitor_id: string;
  page_path: string;
  event_type: "page_view";
  is_admin: boolean;
  visited_at: string;
}

export interface FeaturedPlacement {
  id: string;
  slot_index: number;
  creator_account_id: string | null;
  title: string | null;
  image_url: string | null;
  destination_url: string | null;
  is_sponsored: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatorPackage {
  id: string;
  creator_account_id: string;
  package_name: string;
  description: string | null;
  package_type: PackageType;
  price: number;
  currency: string;
  duration_days: number | null;
  deliverables: string | null;
  terms: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromotionOffer {
  id: string;
  creator_package_id: string;
  buyer_user_id: string;
  creator_user_id: string;
  offer_amount: number;
  currency: string;
  duration_days: number | null;
  campaign_description: string | null;
  campaign_url: string | null;
  status: OfferStatus;
  counter_amount: number | null;
  counter_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export interface PlatformConfig {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface WeeklyVisitorStats {
  unique_visitors: number;
  page_views: number;
  window_start: string;
  window_end: string;
}
