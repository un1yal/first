import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
 getSupabasePublishableKey,
 getSupabaseUrl,
} from "@/lib/supabase/config";

const COOKIE_OPTIONS = {
 path: "/",
 sameSite: "lax" as const,
 maxAge: 60 * 60 * 24 * 400,
};

/** Server Supabase client for user sessions (publishable key only). */
export async function createClient() {
 const cookieStore = await cookies();
 const url = getSupabaseUrl();
 const key = getSupabasePublishableKey();

 return createServerClient(url, key, {
 cookieOptions: COOKIE_OPTIONS,
 cookies: {
 getAll() {
 return cookieStore.getAll();
 },
 setAll(cookiesToSet) {
 try {
 cookiesToSet.forEach(({ name, value, options }) => {
 cookieStore.set(name, value, {
 ...COOKIE_OPTIONS,
 ...options,
 });
 });
 } catch {
 // Server Components cannot always write cookies; proxy refreshes them.
 }
 },
 },
 });
}
