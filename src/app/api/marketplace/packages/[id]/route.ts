import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";

export async function GET(
 _request: Request,
 context: { params: Promise<{ id: string }> },
) {
 const { id } = await context.params;
 if (isDemoMode()) {
 const pkg = demoStore.packages.find((p) => p.id === id);
 if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });
 const creator = demoStore.creators.find((c) => c.id === pkg.creator_account_id);
 return NextResponse.json({ package: pkg, creator });
 }

 const { createClient } = await import("@/lib/supabase/server");
 const supabase = await createClient();
 const { data, error } = await supabase
 .from("creator_packages")
 .select("*, creator_accounts(*)")
 .eq("id", id)
 .maybeSingle();
 if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
 return NextResponse.json({
 package: data,
 creator: data.creator_accounts,
 });
}
