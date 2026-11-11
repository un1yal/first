import { fetchTimelinePages, getUserByUsername, mapTweetMetrics } from "@/lib/twitterapi";
import { extractWebsite } from "@/lib/twitterapi/users";
import type { TwitterApiTweet, TwitterApiUserInfo } from "@/lib/twitterapi/types";

export interface SyncLimits {
 max_posts_per_creator: number;
 max_pages_per_sync: number;
 max_metric_snapshots_per_creator: number;
}

export const DEFAULT_SYNC_LIMITS: SyncLimits = {
 max_posts_per_creator: 40,
 max_pages_per_sync: 2,
 max_metric_snapshots_per_creator: 200,
};

export function mapUserToCreatorFields(user: TwitterApiUserInfo) {
 return {
 x_user_id: user.id,
 username: user.userName,
 display_name: user.name ?? user.userName,
 profile_image_url: user.profilePicture ?? null,
 banner_url: user.coverPicture || null,
 biography: user.description ?? null,
 location: user.location || null,
 website: extractWebsite(user),
 followers_count: user.followers ?? 0,
 following_count: user.following ?? 0,
 posts_count: user.statusesCount ?? 0,
 media_count: user.mediaCount ?? null,
 favourites_count: user.favouritesCount ?? null,
 is_blue_verified: Boolean(user.isBlueVerified),
 verified_type: user.verifiedType || null,
 account_created_at: user.createdAt ?? null,
 };
}

export function mapTweetToPostFields(tweet: TwitterApiTweet, creatorAccountId: string) {
 return {
 creator_account_id: creatorAccountId,
 x_post_id: tweet.id,
 post_text: tweet.text ?? null,
 post_url: tweet.url ?? null,
 published_at: tweet.createdAt ? new Date(tweet.createdAt).toISOString() : null,
 lang: tweet.lang ?? null,
 is_reply: Boolean(tweet.isReply),
 media_type: null as string | null,
 hashtags: tweet.entities?.hashtags?.map((h) => h.text).filter(Boolean) as string[],
 mentions: tweet.entities?.user_mentions
 ?.map((m) => m.screen_name)
 .filter(Boolean) as string[],
 };
}

export async function syncCreatorProfile(username: string) {
 const result = await getUserByUsername(username);
 if (result.data.status === "error" || !result.data.data) {
 return {
 ok: false as const,
 error: result.data.msg ?? "User not found",
 meta: result.meta,
 };
 }
 if (result.data.data.unavailable) {
 return {
 ok: false as const,
 error: result.data.data.message ?? "Account unavailable",
 unavailable: true,
 meta: result.meta,
 };
 }
 return {
 ok: true as const,
 user: result.data.data,
 fields: mapUserToCreatorFields(result.data.data),
 meta: result.meta,
 };
}

export async function syncCreatorPosts(
 userId: string,
 creatorAccountId: string,
 limits: SyncLimits = DEFAULT_SYNC_LIMITS,
) {
 const maxPages = Math.max(
 1,
 Math.min(limits.max_pages_per_sync, Math.ceil(limits.max_posts_per_creator / 20)),
 );
 const { tweets, pages, meta } = await fetchTimelinePages({
 userId,
 maxPages,
 });

 const limited = tweets.slice(0, limits.max_posts_per_creator);
 const posts = limited.map((t) => mapTweetToPostFields(t, creatorAccountId));
 const metrics = limited.map((t) => ({
 x_post_id: t.id,
 ...mapTweetMetrics(t),
 recorded_at: new Date().toISOString(),
 }));

 return { posts, metrics, pages, meta, count: limited.length };
}

export function generateVerificationCode() {
 const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
 let code = "AX-";
 for (let i = 0; i < 8; i++) {
 code += alphabet[Math.floor(Math.random() * alphabet.length)];
 }
 return code;
}

export async function hashVerificationCode(code: string) {
 const data = new TextEncoder().encode(code.trim().toUpperCase());
 const digest = await crypto.subtle.digest("SHA-256", data);
 return Array.from(new Uint8Array(digest))
 .map((b) => b.toString(16).padStart(2, "0"))
 .join("");
}

export function bioContainsCode(biography: string | null | undefined, code: string) {
 if (!biography) return false;
 return biography.toUpperCase().includes(code.trim().toUpperCase());
}
