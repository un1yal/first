import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";

export async function GET() {
  if (isDemoMode()) {
    const creator = demoStore.creators[0];
    return NextResponse.json({
      marketplace_enabled: creator?.marketplace_enabled ?? false,
      packages: demoStore.packages.filter((p) => p.creator_account_id === creator?.id),
      offers: demoStore.offers,
    });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: creator } = await supabase
    .from("creator_accounts")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!creator) return NextResponse.json({ packages: [], offers: [] });

  const { data: packages } = await supabase
    .from("creator_packages")
    .select("*")
    .eq("creator_account_id", creator.id)
    .order("created_at", { ascending: false });
  const { data: offers } = await supabase
    .from("promotion_offers")
    .select("*")
    .eq("creator_user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    marketplace_enabled: creator.marketplace_enabled,
    packages: packages ?? [],
    offers: offers ?? [],
  });
}
