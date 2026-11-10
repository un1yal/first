import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";

export async function POST(request: Request) {
  const body = await request.json();
  if (isDemoMode()) {
    const pkg = demoStore.packages.find((p) => p.id === body.creator_package_id);
    if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });
    const offer = {
      id: crypto.randomUUID(),
      creator_package_id: pkg.id,
      buyer_user_id: "buyer-demo",
      creator_user_id: demoStore.profiles[0].id,
      offer_amount: Number(body.offer_amount),
      currency: "USD",
      duration_days: body.duration_days ? Number(body.duration_days) : null,
      campaign_description: body.campaign_description ?? null,
      campaign_url: body.campaign_url ?? null,
      status: "pending" as const,
      counter_amount: null,
      counter_message: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    demoStore.offers.push(offer);
    demoStore.notifications.push({
      id: crypto.randomUUID(),
      user_id: demoStore.profiles[0].id,
      title: "New promotion offer",
      message: `You received a $${offer.offer_amount} offer.`,
      type: "offer",
      link: "/dashboard/marketplace",
      read_at: null,
      created_at: new Date().toISOString(),
    });
    return NextResponse.json({
      ok: true,
      offer,
      notice: "Payment settlement is handled outside AnalyticX in this release.",
    });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: pkg } = await supabase
    .from("creator_packages")
    .select("*, creator_accounts(user_id)")
    .eq("id", body.creator_package_id)
    .maybeSingle();
  if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });

  const creatorUserId = (pkg.creator_accounts as { user_id: string | null })?.user_id;
  if (!creatorUserId) {
    return NextResponse.json({ error: "Creator unavailable" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("promotion_offers")
    .insert({
      creator_package_id: pkg.id,
      buyer_user_id: user.id,
      creator_user_id: creatorUserId,
      offer_amount: Number(body.offer_amount),
      duration_days: body.duration_days ? Number(body.duration_days) : null,
      campaign_description: body.campaign_description,
      campaign_url: body.campaign_url,
      status: "pending",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.from("notifications").insert({
    user_id: creatorUserId,
    title: "New promotion offer",
    message: `You received a $${data.offer_amount} offer.`,
    type: "offer",
    link: "/dashboard/marketplace",
  });

  return NextResponse.json({
    ok: true,
    offer: data,
    notice: "Payment settlement is handled outside AnalyticX in this release.",
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const allowed = [
    "pending",
    "accepted",
    "rejected",
    "counter_offered",
    "cancelled",
    "completed",
  ];
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (isDemoMode()) {
    const offer = demoStore.offers.find((o) => o.id === body.id);
    if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });
    offer.status = body.status;
    offer.updated_at = new Date().toISOString();
    if (body.counter_amount) offer.counter_amount = Number(body.counter_amount);
    if (body.counter_message) offer.counter_message = body.counter_message;
    return NextResponse.json({ ok: true, offer });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("promotion_offers")
    .update({
      status: body.status,
      counter_amount: body.counter_amount ?? null,
      counter_message: body.counter_message ?? null,
    })
    .eq("id", body.id)
    .or(`buyer_user_id.eq.${user.id},creator_user_id.eq.${user.id}`)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, offer: data });
}
