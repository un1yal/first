import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
 getSupabasePublishableKey,
 getSupabaseUrl,
 isSupabaseConfigured,
} from "@/lib/supabase/config";

/**
 * Copy refreshed auth cookies + cache headers onto a new response.
 * Dropping them on redirects is a common cause of random logouts
 * (refresh-token reuse detection).
 */
function applySessionCookies(
 from: NextResponse,
 to: NextResponse,
) {
 from.cookies.getAll().forEach((cookie) => {
 to.cookies.set(cookie.name, cookie.value);
 });
 for (const header of ["cache-control", "expires", "pragma"] as const) {
 const value = from.headers.get(header);
 if (value) to.headers.set(header, value);
 }
 return to;
}

export async function updateSession(request: NextRequest) {
 let supabaseResponse = NextResponse.next({ request });

 if (!isSupabaseConfigured()) {
 return supabaseResponse;
 }

 const url = getSupabaseUrl();
 const key = getSupabasePublishableKey();

 const supabase = createServerClient(url, key, {
 cookies: {
 getAll() {
 return request.cookies.getAll();
 },
 setAll(cookiesToSet, headers) {
 cookiesToSet.forEach(({ name, value }) => {
 request.cookies.set(name, value);
 });
 supabaseResponse = NextResponse.next({ request });
 cookiesToSet.forEach(({ name, value, options }) => {
 supabaseResponse.cookies.set(name, value, {
 ...options,
 path: options?.path ?? "/",
 sameSite: (options?.sameSite as "lax" | "strict" | "none" | undefined) ?? "lax",
 // Keep session cookies available to the whole app.
 httpOnly: options?.httpOnly,
 secure: options?.secure ?? process.env.NODE_ENV === "production",
 });
 });
 // Prevent CDNs/shared caches from storing Set-Cookie + HTML together.
 if (headers) {
 Object.entries(headers).forEach(([headerKey, headerValue]) => {
 if (headerValue) supabaseResponse.headers.set(headerKey, String(headerValue));
 });
 } else {
 supabaseResponse.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
 }
 },
 },
 });

 // Always refresh/validate the session on every matched request.
 // Prefer getClaims() when available (verifies JWT + refreshes near expiry).
 let userId: string | null = null;
 try {
 if (typeof supabase.auth.getClaims === "function") {
 const { data } = await supabase.auth.getClaims();
 userId = data?.claims?.sub ? String(data.claims.sub) : null;
 } else {
 const {
 data: { user },
 } = await supabase.auth.getUser();
 userId = user?.id ?? null;
 }
 } catch {
 userId = null;
 }

 const path = request.nextUrl.pathname;
 const isProtected =
 path.startsWith("/dashboard") ||
 path.startsWith("/onboarding") ||
 path.startsWith("/admin");

 if (isProtected && !userId) {
 const redirectUrl = request.nextUrl.clone();
 redirectUrl.pathname = "/login";
 redirectUrl.searchParams.set("next", path);
 const redirectResponse = NextResponse.redirect(redirectUrl);
 return applySessionCookies(supabaseResponse, redirectResponse);
 }

 if (userId && (path === "/login" || path === "/signup")) {
 const redirectUrl = request.nextUrl.clone();
 redirectUrl.pathname = "/dashboard";
 const redirectResponse = NextResponse.redirect(redirectUrl);
 return applySessionCookies(supabaseResponse, redirectResponse);
 }

 // Must return the response that carries any refreshed Set-Cookie headers.
 return supabaseResponse;
}
