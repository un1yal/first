import { NextResponse } from "next/server";
import { verifyClaimChallenge } from "@/lib/claim/verification";
import { getMemoryChallenge } from "../start/route";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";
import { normalizeUsername } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      challengeId?: string;
      code?: string;
    };
    const username = normalizeUsername(body.username ?? "");
    const challenge = body.challengeId ? getMemoryChallenge(body.challengeId) : null;

    if (!challenge || !body.code) {
      return NextResponse.json({ error: "Missing challenge" }, { status: 400 });
    }

    // Demo shortcut: accept verification without live bio mutation when using mock API
    const usingMock =
      process.env.TWITTERAPI_IO_MOCK === "true" ||
      !process.env.TWITTERAPI_IO_KEY ||
      process.env.TWITTERAPI_IO_KEY === "PASTE_YOUR_TWITTERAPI_IO_API_KEY_HERE";

    if (usingMock) {
      if (isDemoMode()) {
        let creator = demoStore.creators.find(
          (c) => c.username.toLowerCase() === username.toLowerCase(),
        );
        if (!creator) {
          creator = {
            id: crypto.randomUUID(),
            user_id: demoStore.profiles[0]?.id ?? null,
            x_user_id: challenge.xUserId,
            username,
            display_name: username,
            profile_image_url: null,
            banner_url: null,
            biography: `Verified on AnalyticX ${challenge.code}`,
            location: null,
            website: null,
            followers_count: 0,
            following_count: 0,
            posts_count: 0,
            media_count: null,
            favourites_count: null,
            is_blue_verified: false,
            verified_type: null,
            account_created_at: null,
            claimed_status: "claimed",
            marketplace_enabled: false,
            connected_at: new Date().toISOString(),
            last_synced_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          demoStore.creators.push(creator);
        } else {
          creator.claimed_status = "claimed";
          creator.connected_at = new Date().toISOString();
        }
      }

      return NextResponse.json({
        ok: true,
        claimed_status: "claimed",
        mode: "mock_accepted",
        notice:
          "Mock/demo verification accepted because TwitterAPI.io key is not configured. Live bio checks run when a key is present.",
      });
    }

    const result = await verifyClaimChallenge({
      username,
      expectedCode: body.code,
      expectedHash: challenge.codeHash,
      expiresAt: challenge.expiresAt,
      expectedXUserId: challenge.xUserId,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, reason: result.reason },
        { status: 400 },
      );
    }

    if (!isDemoMode()) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const fields = result.fields;
      const { data: existing } = await supabase
        .from("creator_accounts")
        .select("id")
        .eq("x_user_id", fields.x_user_id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("creator_accounts")
          .update({
            ...fields,
            user_id: user.id,
            claimed_status: "claimed",
            connected_at: new Date().toISOString(),
            last_synced_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("creator_accounts").insert({
          ...fields,
          user_id: user.id,
          claimed_status: "claimed",
          connected_at: new Date().toISOString(),
          last_synced_at: new Date().toISOString(),
        });
      }

      await supabase
        .from("claim_verifications")
        .update({ verified_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("x_user_id", fields.x_user_id)
        .is("verified_at", null);
    }

    return NextResponse.json({ ok: true, claimed_status: "claimed" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 500 },
    );
  }
}
