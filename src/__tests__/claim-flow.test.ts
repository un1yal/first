import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  bioContainsCode,
  generateVerificationCode,
  hashVerificationCode,
} from "@/lib/sync/creator-sync";
import { verifyClaimChallenge } from "@/lib/claim/verification";

describe("claim challenge persistence contract", () => {
  it("uses stable hashes so DB-backed challenges can verify client-submitted codes", async () => {
    const code = generateVerificationCode();
    const hash = await hashVerificationCode(code);
    expect(await hashVerificationCode(code)).toBe(hash);
    expect(await hashVerificationCode(code.toLowerCase())).toBe(hash);
    expect(await hashVerificationCode("AX-WRONG111")).not.toBe(hash);
  });

  it("detects the code in a creator bio", () => {
    const code = "AX-TESTCODE";
    expect(bioContainsCode(`Building stuff ${code} · DMs open`, code)).toBe(true);
    expect(bioContainsCode("no code here", code)).toBe(false);
  });
});

describe("verifyClaimChallenge auth-independent checks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects expired challenges before any network call matters", async () => {
    const code = "AX-ABCDEF12";
    const result = await verifyClaimChallenge({
      username: "someone",
      expectedCode: code,
      expectedHash: await hashVerificationCode(code),
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
      expectedXUserId: "1",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("expired");
  });

  it("rejects invalid code hashes", async () => {
    const result = await verifyClaimChallenge({
      username: "someone",
      expectedCode: "AX-ABCDEF12",
      expectedHash: await hashVerificationCode("AX-OTHERCODE"),
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      expectedXUserId: "1",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("invalid_code");
  });
});
