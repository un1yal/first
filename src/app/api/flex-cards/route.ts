import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";

export async function POST(request: Request) {
  const body = await request.json();
  if (isDemoMode()) {
    demoStore.flexCards.push({
      id: crypto.randomUUID(),
      creator_account_id: demoStore.creators[0]?.id ?? "demo",
      template: body.template ?? "dark",
      metrics_snapshot: body.metrics ?? {},
      generated_at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: creator } = await supabase
    .from("creator_accounts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!creator) return NextResponse.json({ error: "No creator account" }, { status: 400 });

  await supabase.from("flex_cards").insert({
    creator_account_id: creator.id,
    template: body.template ?? "dark",
    metrics_snapshot: body.metrics ?? {},
  });

  return NextResponse.json({ ok: true });
}
