import { getUserByUsername, searchUsers } from "@/lib/twitterapi";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";
import { normalizeUsername } from "@/lib/utils";

export async function searchCreators(rawQuery: string) {
  const q = normalizeUsername(rawQuery);
  if (!q) return null;

  const local = isDemoMode()
    ? demoStore.creators.filter(
        (c) =>
          c.username.toLowerCase().includes(q) ||
          (c.display_name ?? "").toLowerCase().includes(q),
      )
    : [];

  const lookup = await getUserByUsername(q);
  let remote = null;
  if (lookup.data.status === "success" && lookup.data.data && !lookup.data.data.unavailable) {
    const user = lookup.data.data;
    const claimed = local.find((c) => c.x_user_id === user.id);
    remote = {
      x_user_id: user.id,
      username: user.userName,
      display_name: user.name ?? user.userName,
      profile_image_url: user.profilePicture ?? null,
      biography: user.description ?? null,
      followers_count: user.followers ?? 0,
      following_count: user.following ?? 0,
      claimed_status: claimed?.claimed_status ?? "unclaimed",
      is_blue_verified: Boolean(user.isBlueVerified),
      source: claimed ? "analyticx" : "x_unclaimed",
    };
  } else if (lookup.data.status === "success" && lookup.data.data?.unavailable) {
    remote = {
      unavailable: true,
      message: lookup.data.data.message ?? "Account unavailable",
    };
  }

  let suggestions: Array<{ username: string; display_name: string }> = [];
  if (q.length >= 2) {
    const search = await searchUsers(q);
    suggestions = (search.data.users ?? []).slice(0, 5).map((u) => ({
      username: u.userName,
      display_name: u.name ?? u.userName,
    }));
  }

  return {
    query: q,
    local: local.map((c) => ({
      username: c.username,
      display_name: c.display_name,
      profile_image_url: c.profile_image_url,
      followers_count: c.followers_count,
      claimed_status: c.claimed_status,
      source: "analyticx",
    })),
    remote,
    suggestions,
    meta: lookup.meta,
  };
}
