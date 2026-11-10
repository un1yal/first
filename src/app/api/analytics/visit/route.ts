import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";
import {
  VISITOR_COOKIE,
  VISITOR_COOKIE_MAX_AGE,
  createVisitorId,
} from "@/lib/analytics/visitors";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { path?: string };
    const path = body.path || "/";
    const cookieHeader = request.headers.get("cookie") ?? "";
    const existing = cookieHeader
      .split(";")
      .map((p) => p.trim())
      .find((p) => p.startsWith(`${VISITOR_COOKIE}=`))
      ?.split("=")[1];
    const visitorId = existing && existing.length >= 16 ? existing : createVisitorId();

    // Admin exclusion: if Authorization Bearer admin demo or supabase admin role later.
    const isAdmin = false;

    if (isDemoMode()) {
      demoStore.trackVisit(visitorId, path, isAdmin);
    } else {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      await supabase.from("visitor_events").insert({
        anonymous_visitor_id: visitorId,
        page_path: path,
        event_type: "page_view",
        is_admin: isAdmin,
      });
    }

    const response = NextResponse.json({ ok: true });
    if (!existing) {
      response.cookies.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: VISITOR_COOKIE_MAX_AGE,
        path: "/",
      });
    }
    return response;
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "track failed" },
      { status: 500 },
    );
  }
}
