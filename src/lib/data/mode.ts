import { isSupabaseConfigured } from "@/lib/supabase/client";

/** True when running without real Supabase credentials (local/demo mode). */
export function isDemoMode() {
 try {
 return !isSupabaseConfigured();
 } catch {
 return true;
 }
}

export function dataModeLabel() {
 return isDemoMode() ? "Demo data" : "Live data";
}
