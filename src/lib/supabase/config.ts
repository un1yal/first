/**
 * Public Supabase config for AnalyticX → project "statisticx".
 * Uses only the publishable (client-safe) key. Never read or ship a service-role key here.
 */

export const SUPABASE_URL_ENV = "NEXT_PUBLIC_SUPABASE_URL";
export const SUPABASE_PUBLISHABLE_KEY_ENV = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";

/** Build-time defaults when env vars are unset (public values only). */
const DEFAULT_SUPABASE_URL = "https://acyzomxqrxhdthtthnvd.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_NEfkuEeP3-1At0KOXnwwpw_F5KhZk_o";

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;
}

/**
 * Prefer the modern publishable key; fall back to legacy anon env name if present.
 */
export function getSupabasePublishableKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    DEFAULT_SUPABASE_PUBLISHABLE_KEY
  );
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  return Boolean(
    url &&
      key &&
      !url.includes("YOUR_PROJECT") &&
      !key.includes("YOUR_SUPABASE"),
  );
}
