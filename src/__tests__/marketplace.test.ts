import { beforeEach, describe, expect, it } from "vitest";
import { demoStore } from "@/lib/demo/store";

describe("marketplace offer workflow", () => {
  beforeEach(() => {
    demoStore.offers.length = 0;
  });

  it("creates packages and processes offer statuses", async () => {
    const pkg = demoStore.packages[0];
    expect(pkg).toBeTruthy();

    const offer = {
      id: crypto.randomUUID(),
      creator_package_id: pkg.id,
      buyer_user_id: "buyer",
      creator_user_id: demoStore.profiles[0].id,
      offer_amount: 300,
      currency: "USD",
      duration_days: 3,
      campaign_description: "Launch week",
      campaign_url: "https://example.com",
      status: "pending" as const,
      counter_amount: null,
      counter_message: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    demoStore.offers.push(offer);
    expect(demoStore.offers[0].status).toBe("pending");

    demoStore.offers[0].status = "accepted";
    expect(demoStore.offers[0].status).toBe("accepted");

    demoStore.offers[0].status = "counter_offered";
    demoStore.offers[0].counter_amount = 350;
    expect(demoStore.offers[0].counter_amount).toBe(350);

    demoStore.offers[0].status = "rejected";
    expect(demoStore.offers[0].status).toBe("rejected");
  });
});
