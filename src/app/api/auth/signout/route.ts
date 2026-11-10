import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/data/mode";

export async function GET(request: Request) {
  const url = new URL("/", request.url);
  if (!isDemoMode()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(url);
}
