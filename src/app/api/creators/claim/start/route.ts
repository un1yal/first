import { NextResponse } from "next/server";
import { createClaimChallenge } from "@/lib/claim/verification";
import { isDemoMode } from "@/lib/data/mode";
import { normalizeUsername } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string };
    const username = normalizeUsername(body.username ?? "");
    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    if (isDemoMode()) {
      const challenge = await createClaimChallenge(username);
      if (!challenge.ok) {
        return NextResponse.json({ error: challenge.error }, { status: 400 });
      }
      return NextResponse.json({
        challengeId: crypto.randomUUID(),
        code: challenge.code,
        expiresAt: challenge.expiresAt,
        instructions: challenge.instructions,
        mode: "demo",
        notice:
          "Demo mode: challenges are not persisted. Connect Supabase for production claims.",
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
        { error: "Unauthorized — sign in again, then retry claiming." },
        { status: 401 },
      );
    }

    // Ensure profile row exists (FK for claim_verifications).
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email ?? `${user.id}@users.local`,
        display_name:
          (user.user_metadata?.display_name as string | undefined) ??
          user.email?.split("@")[0] ??
          "Creator",
      });
      if (profileError) {
        return NextResponse.json(
          {
            error:
              "Could not create profile for claim. Run the latest Supabase migration SQL, then retry.",
            detail: profileError.message,
          },
          { status: 500 },
        );
      }
    }

    const challenge = await createClaimChallenge(username);
    if (!challenge.ok) {
      return NextResponse.json({ error: challenge.error }, { status: 400 });
    }

    // Invalidate prior open challenges for this user+account.
    await supabase
      .from("claim_verifications")
      .update({ expires_at: new Date(0).toISOString() })
      .eq("user_id", user.id)
      .eq("x_user_id", challenge.user.id)
      .is("verified_at", null);

    const { data: row, error: insertError } = await supabase
      .from("claim_verifications")
      .insert({
        user_id: user.id,
        x_user_id: challenge.user.id,
        username,
        verification_code_hash: challenge.codeHash,
        expires_at: challenge.expiresAt,
      })
      .select("id, expires_at")
      .single();

    if (insertError || !row) {
      return NextResponse.json(
        {
          error: "Could not persist verification challenge",
          detail: insertError?.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      challengeId: row.id,
      code: challenge.code,
      expiresAt: row.expires_at,
      instructions: challenge.instructions,
      notice:
        "Bio-code verification proves ownership for AnalyticX claiming. It is not X OAuth authorization.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start claim" },
      { status: 500 },
    );
  }
}
