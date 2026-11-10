import { twitterRequest } from "./client";
import type { TimelineResponse, TwitterApiTweet } from "./types";

export async function getUserTimeline(options: {
  userId: string;
  cursor?: string;
  includeReplies?: boolean;
}) {
  return twitterRequest<TimelineResponse>(
    "/twitter/user/tweet_timeline",
    {
      userId: options.userId,
      cursor: options.cursor ?? "",
      includeReplies: options.includeReplies ?? false,
    },
    { countItems: (data) => data.tweets?.length ?? 0 },
  );
}

export async function getUserLastTweets(options: {
  userName: string;
  cursor?: string;
}) {
  return twitterRequest<TimelineResponse>(
    "/twitter/user/last_tweets",
    {
      userName: options.userName.replace(/^@/, ""),
      cursor: options.cursor ?? "",
    },
    { countItems: (data) => data.tweets?.length ?? 0 },
  );
}

export async function fetchTimelinePages(options: {
  userId: string;
  maxPages: number;
  includeReplies?: boolean;
}) {
  const tweets: TwitterApiTweet[] = [];
  let cursor = "";
  let pages = 0;
  let totalCredits = 0;
  let totalUsd = 0;
  let usedMock = false;

  while (pages < options.maxPages) {
    const result = await getUserTimeline({
      userId: options.userId,
      cursor,
      includeReplies: options.includeReplies,
    });
    pages += 1;
    totalCredits += result.meta.estimatedCostCredits;
    totalUsd += result.meta.estimatedCostUsd;
    usedMock = usedMock || result.meta.usedMock;

    if (result.data.status === "error") {
      break;
    }

    tweets.push(...(result.data.tweets ?? []));
    if (!result.data.has_next_page || !result.data.next_cursor) break;
    cursor = result.data.next_cursor;
  }

  return {
    tweets,
    pages,
    meta: {
      estimatedCostCredits: totalCredits,
      estimatedCostUsd: totalUsd,
      usedMock,
    },
  };
}

export function mapTweetMetrics(tweet: TwitterApiTweet) {
  return {
    views: tweet.viewCount ?? null,
    likes: tweet.likeCount ?? null,
    replies: tweet.replyCount ?? null,
    reposts: tweet.retweetCount ?? null,
    quotes: tweet.quoteCount ?? null,
    bookmarks: tweet.bookmarkCount ?? null,
  };
}
