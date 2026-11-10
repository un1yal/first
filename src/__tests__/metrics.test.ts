import { describe, expect, it } from "vitest";
import { calculateMetricDelta } from "@/lib/twitterapi/metrics";
import {
  calculateCreatorWindowMetrics,
  rankCreators,
} from "@/lib/analytics/engagement";
import { computeWeeklyStats } from "@/lib/analytics/visitors";
import {
  bioContainsCode,
  generateVerificationCode,
  hashVerificationCode,
} from "@/lib/sync/creator-sync";

describe("24h metric deltas", () => {
  it("computes engagement from snapshot differences", () => {
    const earlier = {
      views: 1000,
      likes: 10,
      replies: 2,
      reposts: 3,
      quotes: 1,
      bookmarks: 4,
      recorded_at: new Date(Date.now() - 24 * 3600_000).toISOString(),
    };
    const latest = {
      views: 1500,
      likes: 25,
      replies: 5,
      reposts: 7,
      quotes: 2,
      bookmarks: 6,
      recorded_at: new Date().toISOString(),
    };
    const delta = calculateMetricDelta(latest, earlier);
    expect(delta.coverageValid).toBe(true);
    expect(delta.views).toBe(500);
    expect(delta.engagement).toBe(15 + 3 + 4 + 1);
  });

  it("does not treat missing metrics as zero", () => {
    const earlier = {
      views: null,
      likes: 10,
      replies: 2,
      reposts: 3,
      quotes: 1,
      bookmarks: null,
      recorded_at: new Date(Date.now() - 24 * 3600_000).toISOString(),
    };
    const latest = {
      views: 1500,
      likes: 25,
      replies: 5,
      reposts: 7,
      quotes: 2,
      bookmarks: 6,
      recorded_at: new Date().toISOString(),
    };
    const delta = calculateMetricDelta(latest, earlier);
    expect(delta.views).toBeNull();
    expect(delta.engagement).toBe(15 + 3 + 4 + 1);
  });

  it("excludes insufficient coverage", () => {
    const earlier = {
      views: 1000,
      likes: 10,
      replies: 2,
      reposts: 3,
      quotes: 1,
      bookmarks: 4,
      recorded_at: new Date(Date.now() - 2 * 3600_000).toISOString(),
    };
    const latest = {
      views: 1500,
      likes: 25,
      replies: 5,
      reposts: 7,
      quotes: 2,
      bookmarks: 6,
      recorded_at: new Date().toISOString(),
    };
    const delta = calculateMetricDelta(latest, earlier);
    expect(delta.coverageValid).toBe(false);
    expect(delta.engagement).toBeNull();
  });
});

describe("creator window aggregation", () => {
  it("ranks only covered creators and excludes null metrics", () => {
    const now = new Date();
    const earlier = new Date(now.getTime() - 24 * 3600_000).toISOString();
    const latest = now.toISOString();
    const metrics = calculateCreatorWindowMetrics({
      post1: [
        {
          post_id: "post1",
          views: 100,
          likes: 1,
          replies: 1,
          reposts: 1,
          quotes: 1,
          bookmarks: 1,
          recorded_at: earlier,
        },
        {
          post_id: "post1",
          views: 200,
          likes: 5,
          replies: 2,
          reposts: 2,
          quotes: 2,
          bookmarks: 2,
          recorded_at: latest,
        },
      ],
    });
    expect(metrics.coverageValid).toBe(true);
    expect(metrics.engagement24h).toBe(4 + 1 + 1 + 1);
    expect(metrics.impressions24h).toBe(100);

    const ranked = rankCreators([
      { creatorAccountId: "a", metric: metrics.engagement24h, coverageValid: true },
      { creatorAccountId: "b", metric: null, coverageValid: false },
      { creatorAccountId: "c", metric: 10, coverageValid: true },
    ]);
    expect(ranked.map((r) => r.creatorAccountId)).toEqual(["c", "a"]);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[0].metric_value).toBe(10);
  });
});

describe("claim verification helpers", () => {
  it("hashes and detects bio codes", async () => {
    const code = generateVerificationCode();
    expect(code.startsWith("AX-")).toBe(true);
    const hash = await hashVerificationCode(code);
    expect(hash).toHaveLength(64);
    expect(bioContainsCode(`hello ${code} world`, code)).toBe(true);
    expect(bioContainsCode("nope", code)).toBe(false);
  });

  it("rejects expired and invalid challenges via verify helper contracts", async () => {
    const { verifyClaimChallenge } = await import("@/lib/claim/verification");
    const expired = await verifyClaimChallenge({
      username: "analyticx",
      expectedCode: "AX-TESTCODE",
      expectedHash: await hashVerificationCode("AX-TESTCODE"),
      expiresAt: new Date(Date.now() - 1000).toISOString(),
      expectedXUserId: "1000000001",
    });
    expect(expired.ok).toBe(false);
    if (!expired.ok) expect(expired.reason).toBe("expired");
  });
});

describe("visitor analytics", () => {
  it("counts unique visitors once per week and excludes admins", () => {
    const now = new Date();
    const stats = computeWeeklyStats(
      [
        {
          anonymous_visitor_id: "v1",
          is_admin: false,
          visited_at: now.toISOString(),
        },
        {
          anonymous_visitor_id: "v1",
          is_admin: false,
          visited_at: new Date(now.getTime() - 3600_000).toISOString(),
        },
        {
          anonymous_visitor_id: "v2",
          is_admin: false,
          visited_at: now.toISOString(),
        },
        {
          anonymous_visitor_id: "admin",
          is_admin: true,
          visited_at: now.toISOString(),
        },
      ],
      now,
    );
    expect(stats.unique_visitors).toBe(2);
    expect(stats.page_views).toBe(3);
  });
});
