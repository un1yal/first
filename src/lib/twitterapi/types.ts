/** Documented TwitterAPI.io response shapes */

export interface TwitterApiUserInfo {
  type?: "user";
  id: string;
  userName: string;
  name?: string;
  url?: string;
  isBlueVerified?: boolean;
  protected?: boolean;
  verifiedType?: string;
  profilePicture?: string;
  coverPicture?: string;
  description?: string;
  location?: string;
  followers?: number;
  following?: number;
  canDm?: boolean;
  createdAt?: string;
  favouritesCount?: number;
  mediaCount?: number;
  statusesCount?: number;
  pinnedTweetIds?: string[];
  unavailable?: boolean;
  message?: string;
  unavailableReason?: string;
  profile_bio?: {
    description?: string;
    entities?: {
      url?: {
        urls?: Array<{
          display_url?: string;
          expanded_url?: string;
          url?: string;
        }>;
      };
    };
  };
}

export interface TwitterApiTweetEntities {
  hashtags?: Array<{ text?: string; indices?: number[] }>;
  urls?: Array<{
    display_url?: string;
    expanded_url?: string;
    url?: string;
    indices?: number[];
  }>;
  user_mentions?: Array<{
    id_str?: string;
    name?: string;
    screen_name?: string;
  }>;
}

export interface TwitterApiTweet {
  type?: "tweet";
  id: string;
  url?: string;
  text?: string;
  source?: string;
  retweetCount?: number;
  replyCount?: number;
  likeCount?: number;
  quoteCount?: number;
  viewCount?: number;
  bookmarkCount?: number;
  createdAt?: string;
  lang?: string;
  isReply?: boolean;
  inReplyToId?: string;
  conversationId?: string;
  author?: TwitterApiUserInfo;
  entities?: TwitterApiTweetEntities;
  quoted_tweet?: TwitterApiTweet | null;
  retweeted_tweet?: TwitterApiTweet | null;
  isLimitedReply?: boolean;
}

export interface UserInfoResponse {
  status: "success" | "error";
  msg?: string;
  data?: TwitterApiUserInfo;
}

export interface TimelineResponse {
  status: "success" | "error";
  message?: string;
  tweets: TwitterApiTweet[];
  has_next_page: boolean;
  next_cursor: string;
}

export interface UserSearchResponse {
  status?: "success" | "error";
  message?: string;
  users?: TwitterApiUserInfo[];
  has_next_page?: boolean;
  next_cursor?: string;
}

export interface MyAccountInfoResponse {
  status?: "success" | "error";
  message?: string;
  credit_balance?: number;
  data?: { credit_balance?: number };
}

export type TwitterApiEndpoint =
  | "/twitter/user/info"
  | "/twitter/user/tweet_timeline"
  | "/twitter/user/last_tweets"
  | "/twitter/user/search"
  | "/twitter/user/batch_info_by_ids"
  | "/oapi/my/info";

export const ENDPOINT_CREDITS = {
  user_info: 18,
  tweet: 15,
  minimum: 15,
} as const;

export const CREDITS_PER_USD = 100_000;
