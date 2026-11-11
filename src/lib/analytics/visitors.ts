import { cookies, headers } from "next/headers";
import type { WeeklyVisitorStats } from "@/types/database";

export const VISITOR_COOKIE = "ax_vid";
export const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function createVisitorId() {
 return crypto.randomUUID().replace(/-/g, "");
}

export async function getOrCreateVisitorId(): Promise<{
 id: string;
 isNew: boolean;
}> {
 const cookieStore = await cookies();
 const existing = cookieStore.get(VISITOR_COOKIE)?.value;
 if (existing && existing.length >= 16) {
 return { id: existing, isNew: false };
 }
 return { id: createVisitorId(), isNew: true };
}

export function computeWeeklyStats(
 events: Array<{ anonymous_visitor_id: string; is_admin: boolean; visited_at: string }>,
 now = new Date(),
): WeeklyVisitorStats {
 const windowEnd = now;
 const windowStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
 const filtered = events.filter((e) => {
 if (e.is_admin) return false;
 const t = new Date(e.visited_at).getTime();
 return t >= windowStart.getTime() && t <= windowEnd.getTime();
 });

 const unique = new Set(filtered.map((e) => e.anonymous_visitor_id));

 return {
 unique_visitors: unique.size,
 page_views: filtered.length,
 window_start: windowStart.toISOString(),
 window_end: windowEnd.toISOString(),
 };
}

export async function shouldExcludeFromPublicStats() {
 // Best-effort: exclude when an admin session cookie path is used via header marker set by track API.
 const h = await headers();
 return h.get("x-analyticx-admin") === "1";
}
