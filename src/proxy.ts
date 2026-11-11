import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16 renamed middleware → proxy. Keep session refresh on app + API
 * routes so route handlers can read the auth cookies.
 */
export async function proxy(request: NextRequest) {
 return updateSession(request);
}

export const config = {
 matcher: [
 /*
 * Include /api (needed for claim/verify session cookies).
 * Exclude static assets only.
 */
 "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2)$).*)",
 ],
};
