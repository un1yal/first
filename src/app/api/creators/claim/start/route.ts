import { NextResponse } from "next/server";
import { createClaimChallenge } from "@/lib/claim/verification";
import { isDemoMode } from "@/lib/data/mode";
import { normalizeUsername } from "@/lib/utils";

const memoryChallenges = new Map<
  string,
  {
    code: string;
    codeHash: string;
    expiresAt: string;
    xUserId: string;
    username: string;
  }
>();

export function getMemoryChallenge(id: string) {
  return memoryChallenges.get(id);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string };
    const username = normalizeUsername(body.username ?? "");
    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    const challenge = await createClaimChallenge(username);
    if (!challenge.ok) {
      return NextResponse.json({ error: challenge.error }, { status: 400 });
    }

    const challengeId = crypto.randomUUID();
    memoryChallenges.set(challengeId, {
      code: challenge.code,
      codeHash: challenge.codeHash,
      expiresAt: challenge.expiresAt,
      xUserId: challenge.user.id,
      username,
    });

    // Persist when Supabase is configured
    if (!isDemoMode()) {
      try {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("claim_verifications").insert({
            user_id: user.id,
            x_user_id: challenge.user.id,
            username,
            verification_code_hash: challenge.codeHash,
            expires_at: challenge.expiresAt,
          });
        }
      } catch {
        // Fall through to memory challenge for local verification flow
      }
    }

    return NextResponse.json({
      challengeId,
      code: challenge.code,
      expiresAt: challenge.expiresAt,
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
