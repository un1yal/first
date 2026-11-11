import {
 bioContainsCode,
 generateVerificationCode,
 hashVerificationCode,
 syncCreatorProfile,
} from "@/lib/sync/creator-sync";

export const VERIFICATION_TTL_MS = 30 * 60 * 1000;

export async function createClaimChallenge(username: string) {
 const lookup = await syncCreatorProfile(username);
 if (!lookup.ok) {
 return { ok: false as const, error: lookup.error, unavailable: "unavailable" in lookup };
 }

 const code = generateVerificationCode();
 const codeHash = await hashVerificationCode(code);
 const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS).toISOString();

 return {
 ok: true as const,
 code,
 codeHash,
 expiresAt,
 user: lookup.user,
 fields: lookup.fields,
 meta: lookup.meta,
 instructions: `Add this code to your X bio temporarily: ${code}`,
 };
}

export async function verifyClaimChallenge(options: {
 username: string;
 expectedCode: string;
 expectedHash: string;
 expiresAt: string;
 expectedXUserId: string;
}) {
 if (new Date(options.expiresAt).getTime() < Date.now()) {
 return { ok: false as const, error: "Verification code expired", reason: "expired" as const };
 }

 const hash = await hashVerificationCode(options.expectedCode);
 if (hash !== options.expectedHash) {
 return { ok: false as const, error: "Invalid verification code", reason: "invalid_code" as const };
 }

 const lookup = await syncCreatorProfile(options.username);
 if (!lookup.ok) {
 return { ok: false as const, error: lookup.error, reason: "lookup_failed" as const };
 }

 if (lookup.user.id !== options.expectedXUserId) {
 return {
 ok: false as const,
 error: "X account does not match the claim challenge",
 reason: "incorrect_account" as const,
 };
 }

 if (!bioContainsCode(lookup.user.description, options.expectedCode)) {
 return {
 ok: false as const,
 error: "Verification code not found in X bio yet",
 reason: "code_missing" as const,
 biography: lookup.user.description ?? null,
 };
 }

 return {
 ok: true as const,
 user: lookup.user,
 fields: lookup.fields,
 meta: lookup.meta,
 };
}
