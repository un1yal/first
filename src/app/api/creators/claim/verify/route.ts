import { NextResponse } from "next/server";
import { verifyClaimChallenge } from "@/lib/claim/verification";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";
import { hashVerificationCode } from "@/lib/sync/creator-sync";
import { normalizeUsername } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      challengeId?: string;
      code?: string;
    };
    const username = normalizeUsername(body.username ?? "");
    const challengeId = body.challengeId?.trim();
    const code = body.code?.trim();

    if (!username || !challengeId || !code) {
      return NextResponse.json(
        { error: "Missing username, challengeId, or code" },
        { status: 400 },
      );
    }

    if (isDemoMode()) {
      let creator = demoStore.creators.find(
        (c) => c.username.toLowerCase() === username.toLowerCase(),
      );
      if (!creator) {
        creator = {
          id: crypto.randomUUID(),
          user_id: demoStore.profiles[0]?.id ?? null,
          x_user_id: `demo-${username}`,
          username,
          display_name: username,
          profile_image_url: null,
          banner_url: null,
          biography: `Verified on StatisticX ${code}`,
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
      return NextResponse.json({
        ok: true,
        claimed_status: "claimed",
        mode: "demo",
      });
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized — your session cookie was not sent or is expired. Sign in again, then retry verify.",
        },
        { status: 401 },
      );
    }

    const { data: challenge, error: challengeError } = await supabase
      .from("claim_verifications")
      .select("*")
      .eq("id", challengeId)
      .eq("user_id", user.id)
      .is("verified_at", null)
      .maybeSingle();

    if (challengeError || !challenge) {
      return NextResponse.json(
        {
          error:
            "Challenge not found or already used. Start a new verification from onboarding.",
        },
        { status: 400 },
      );
    }

    const usingMock =
      process.env.TWITTERAPI_IO_MOCK === "true" ||
      !process.env.TWITTERAPI_IO_KEY ||
      process.env.TWITTERAPI_IO_KEY === "PASTE_YOUR_TWITTERAPI_IO_API_KEY_HERE";

    let fields;
    if (usingMock) {
      const codeHash = await hashVerificationCode(code);
      if (codeHash !== challenge.verification_code_hash) {
        return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
      }
      if (new Date(challenge.expires_at).getTime() < Date.now()) {
        return NextResponse.json({ error: "Verification code expired" }, { status: 400 });
      }
      fields = {
        x_user_id: challenge.x_user_id,
        username,
        display_name: username,
        profile_image_url: null,
        banner_url: null,
        biography: null,
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
      };
    } else {
      const result = await verifyClaimChallenge({
        username,
        expectedCode: code,
        expectedHash: challenge.verification_code_hash,
        expiresAt: challenge.expires_at,
        expectedXUserId: challenge.x_user_id,
      });

      if (!result.ok) {
        return NextResponse.json(
          { error: result.error, reason: result.reason },
          { status: 400 },
        );
      }
      fields = result.fields;
    }

    const now = new Date().toISOString();
    const { data: existing } = await supabase
      .from("creator_accounts")
      .select("id, user_id, claimed_status")
      .eq("x_user_id", fields.x_user_id)
      .maybeSingle();

    if (existing) {
      if (
        existing.user_id &&
        existing.user_id !== user.id &&
        existing.claimed_status === "claimed"
      ) {
        return NextResponse.json(
          { error: "This X account is already claimed by another StatisticX user." },
          { status: 409 },
        );
      }

      const { error: updateError } = await supabase
        .from("creator_accounts")
        .update({
          ...fields,
          user_id: user.id,
          claimed_status: "claimed",
          connected_at: now,
          last_synced_at: now,
        })
        .eq("id", existing.id);

      if (updateError) {
        return NextResponse.json(
          { error: "Could not update creator account", detail: updateError.message },
          { status: 500 },
        );
      }
    } else {
      const { error: insertError } = await supabase.from("creator_accounts").insert({
        ...fields,
        user_id: user.id,
        claimed_status: "claimed",
        connected_at: now,
        last_synced_at: now,
      });

      if (insertError) {
        return NextResponse.json(
          { error: "Could not create creator account", detail: insertError.message },
          { status: 500 },
        );
      }
    }

    await supabase
      .from("claim_verifications")
      .update({ verified_at: now })
      .eq("id", challenge.id);

    return NextResponse.json({
      ok: true,
      claimed_status: "claimed",
      mode: usingMock ? "mock_accepted" : "live",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 500 },
    );
  }
}
