import type { TwitterApiEndpoint, TwitterApiTweet, TwitterApiUserInfo } from "./types";

const mockUsers: Record<string, TwitterApiUserInfo> = {
  elonmusk: {
    type: "user",
    id: "44196397",
    userName: "elonmusk",
    name: "Elon Musk",
    url: "https://x.com/elonmusk",
    isBlueVerified: true,
    profilePicture: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
    coverPicture: "",
    description: "Mock profile for StatisticX development",
    location: "",
    followers: 200000000,
    following: 700,
    statusesCount: 50000,
    mediaCount: 2000,
    favouritesCount: 1000,
    createdAt: "2009-06-02T20:12:29.000000Z",
  },
  statisticx: {
    type: "user",
    id: "1000000001",
    userName: "statisticx",
    name: "StatisticX",
    url: "https://x.com/statisticx",
    isBlueVerified: false,
    profilePicture: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
    description: "Discover creators. Measure influence. Find your next promotion. [SX-DEMO]",
    followers: 12840,
    following: 210,
    statusesCount: 420,
    mediaCount: 88,
    favouritesCount: 640,
    createdAt: "2024-01-15T10:00:00.000000Z",
  },
  creatorone: {
    type: "user",
    id: "1000000002",
    userName: "creatorone",
    name: "Creator One",
    url: "https://x.com/creatorone",
    isBlueVerified: true,
    profilePicture: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
    description: "SaaS builder & product storyteller",
    followers: 45200,
    following: 890,
    statusesCount: 3100,
    mediaCount: 400,
    createdAt: "2018-04-01T08:00:00.000000Z",
  },
  creatortwo: {
    type: "user",
    id: "1000000003",
    userName: "creatortwo",
    name: "Creator Two",
    url: "https://x.com/creatortwo",
    profilePicture: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
    description: "Design systems & indie tools",
    followers: 22100,
    following: 510,
    statusesCount: 1800,
    mediaCount: 250,
    createdAt: "2019-09-12T12:00:00.000000Z",
  },
  creatorthree: {
    type: "user",
    id: "1000000004",
    userName: "creatorthree",
    name: "Creator Three",
    url: "https://x.com/creatorthree",
    profilePicture: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
    description: "Growth experiments for founders",
    followers: 18750,
    following: 430,
    statusesCount: 1400,
    mediaCount: 190,
    createdAt: "2020-02-20T09:30:00.000000Z",
  },
};

function mockTweets(user: TwitterApiUserInfo): TwitterApiTweet[] {
  const base = Date.now();
  return Array.from({ length: 12 }).map((_, i) => {
    const ageHours = i * 6 + 2;
    return {
      type: "tweet",
      id: `${user.id}${String(i).padStart(4, "0")}`,
      url: `https://x.com/${user.userName}/status/${user.id}${String(i).padStart(4, "0")}`,
      text: `Mock post #${i + 1} from @${user.userName} for StatisticX analytics testing.`,
      retweetCount: 20 + i * 3,
      replyCount: 10 + i * 2,
      likeCount: 100 + i * 17,
      quoteCount: 5 + i,
      viewCount: 5000 + i * 820,
      bookmarkCount: 8 + i,
      createdAt: new Date(base - ageHours * 3600_000).toUTCString(),
      lang: "en",
      isReply: false,
      author: user,
      entities: {
        hashtags: [{ text: "statisticx" }],
        user_mentions: [],
      },
    };
  });
}

export function getMockResponse<T>(
  endpoint: TwitterApiEndpoint,
  params: Record<string, string | number | boolean | undefined>,
): T {
  if (endpoint === "/twitter/user/info") {
    const userName = String(params.userName ?? "").replace(/^@/, "").toLowerCase();
    const user = mockUsers[userName];
    if (!user) {
      return { status: "error", msg: "user not found" } as T;
    }
    return { status: "success", data: user } as T;
  }

  if (endpoint === "/twitter/user/tweet_timeline" || endpoint === "/twitter/user/last_tweets") {
    const userId = String(params.userId ?? "");
    const userName = String(params.userName ?? "").toLowerCase();
    const user =
      Object.values(mockUsers).find((u) => u.id === userId) ||
      mockUsers[userName] ||
      mockUsers.statisticx;
    const tweets = mockTweets(user);
    return {
      status: "success",
      message: "success",
      tweets,
      has_next_page: false,
      next_cursor: "",
    } as T;
  }

  if (endpoint === "/twitter/user/search") {
    const query = String(params.query ?? "").toLowerCase();
    const users = Object.values(mockUsers).filter(
      (u) =>
        u.userName.toLowerCase().includes(query) ||
        (u.name ?? "").toLowerCase().includes(query),
    );
    return {
      status: "success",
      users,
      has_next_page: false,
      next_cursor: "",
    } as T;
  }

  if (endpoint === "/oapi/my/info") {
    return { status: "success", credit_balance: 100000 } as T;
  }

  return { status: "success" } as T;
}

export function listMockUsers() {
  return Object.values(mockUsers);
}
