import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";

export async function POST(request: Request) {
 const body = await request.json();
 if (isDemoMode()) {
 const row = {
 id: crypto.randomUUID(),
 creator_account_id: demoStore.creators[0].id,
 package_name: body.package_name,
 description: body.description ?? null,
 package_type: body.package_type,
 price: Number(body.price),
 currency: "USD",
 duration_days: body.duration_days ? Number(body.duration_days) : null,
 deliverables: body.deliverables ?? null,
 terms: "Payment arrangements are handled outside StatisticX in this release.",
 is_active: true,
 created_at: new Date().toISOString(),
 updated_at: new Date().toISOString(),
 };
 demoStore.packages.push(row);
 return NextResponse.json({ ok: true, package: row });
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

 const { data, error } = await supabase
 .from("creator_packages")
 .insert({
 creator_account_id: creator.id,
 package_name: body.package_name,
 description: body.description,
 package_type: body.package_type,
 price: Number(body.price),
 duration_days: body.duration_days ? Number(body.duration_days) : null,
 deliverables: body.deliverables,
 terms: "Payment arrangements are handled outside StatisticX in this release.",
 })
 .select("*")
 .single();

 if (error) return NextResponse.json({ error: error.message }, { status: 400 });
 return NextResponse.json({ ok: true, package: data });
}
