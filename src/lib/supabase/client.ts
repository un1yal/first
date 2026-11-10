import { createBrowserClient } from "@supabase/ssr";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

export { isSupabaseConfigured };

const COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax" as const,
  // ~400 days — browser upper bound; refresh tokens renew the session earlier.
  maxAge: 60 * 60 * 24 * 400,
};

/** Browser Supabase client — cookie session only (no localStorage). */
export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookieOptions: COOKIE_OPTIONS,
  });
}
