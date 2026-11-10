import { twitterRequest } from "./client";
import type { TwitterApiUserInfo, UserInfoResponse, UserSearchResponse } from "./types";

export async function getUserByUsername(userName: string) {
  const result = await twitterRequest<UserInfoResponse>(
    "/twitter/user/info",
    { userName: userName.replace(/^@/, "") },
    {
      countItems: (data) => (data.status === "success" && data.data && !data.data.unavailable ? 1 : 0),
    },
  );

  return result;
}

export function extractWebsite(user: TwitterApiUserInfo): string | null {
  const urls = user.profile_bio?.entities?.url?.urls;
  if (urls?.[0]?.expanded_url) return urls[0].expanded_url;
  if (urls?.[0]?.url) return urls[0].url;
  return null;
}

export async function searchUsers(query: string) {
  return twitterRequest<UserSearchResponse>(
    "/twitter/user/search",
    { query },
    { countItems: (data) => data.users?.length ?? 0 },
  );
}

export function isUnavailableUser(user?: TwitterApiUserInfo | null) {
  return Boolean(user?.unavailable);
}
