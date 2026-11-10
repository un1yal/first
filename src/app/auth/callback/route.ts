import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Exchange the email/OAuth auth code for a cookie-based session.
 * Required for Supabase SSR — never store the session in localStorage.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next") || "/onboarding";
  const next = nextParam.startsWith("/") ? nextParam : "/onboarding";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const login = new URL("/login", url.origin);
      login.searchParams.set("error", "auth_callback_failed");
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
