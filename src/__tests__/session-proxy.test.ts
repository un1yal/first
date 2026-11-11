import { describe, expect, it } from "vitest";
import { NextResponse } from "next/server";

/**
 * Contract test: redirects must carry refreshed auth cookies.
 * Losing Set-Cookie on redirect causes refresh-token reuse logouts.
 */
function applySessionCookies(from: NextResponse, to: NextResponse) {
 from.cookies.getAll().forEach((cookie) => {
 to.cookies.set(cookie.name, cookie.value);
 });
 for (const header of ["cache-control", "expires", "pragma"] as const) {
 const value = from.headers.get(header);
 if (value) to.headers.set(header, value);
 }
 return to;
}

describe("session cookie propagation", () => {
 it("copies refreshed auth cookies onto redirect responses", () => {
 const refreshed = NextResponse.next();
 refreshed.cookies.set("sb-acyzomxqrxhdthtthnvd-auth-token", "refreshed-value", {
 path: "/",
 sameSite: "lax",
 });
 refreshed.headers.set("Cache-Control", "private, no-cache");

 const redirect = NextResponse.redirect("https://analyticx-nine.vercel.app/dashboard");
 applySessionCookies(refreshed, redirect);

 expect(redirect.cookies.get("sb-acyzomxqrxhdthtthnvd-auth-token")?.value).toBe(
 "refreshed-value",
 );
 expect(redirect.headers.get("Cache-Control")).toBe("private, no-cache");
 });
});
