import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/data/mode";

/** Explicit POST only — never GET (Next.js Link prefetch would log users out). */
export async function POST(request: Request) {
  const url = new URL("/", request.url);
  const response = NextResponse.redirect(url, { status: 303 });

  if (!isDemoMode()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  return response;
}

export async function GET() {
  return NextResponse.json(
    { error: "Use POST /api/auth/signout — GET is disabled to prevent prefetch logouts." },
    { status: 405 },
  );
}
