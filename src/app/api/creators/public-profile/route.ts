import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";

export async function GET() {
  if (isDemoMode()) {
    const creator = demoStore.creators[0];
    const profile = demoStore.publicProfiles.find(
      (p) => p.creator_account_id === creator.id,
    );
    return NextResponse.json({
      profile,
      defaultSlug: creator.username,
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
  if (!creator) return NextResponse.json({ profile: null });
  const { data: profile } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("creator_account_id", creator.id)
    .maybeSingle();
  return NextResponse.json({ profile, defaultSlug: creator.username });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (isDemoMode()) {
    const creator = demoStore.creators[0];
    let profile = demoStore.publicProfiles.find(
      (p) => p.creator_account_id === creator.id,
    );
    if (!profile) {
      profile = {
        id: crypto.randomUUID(),
        creator_account_id: creator.id,
        slug: body.slug,
        is_published: Boolean(body.is_published),
        visibility_settings: body.visibility_settings,
        public_bio: body.public_bio,
        category: body.category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      demoStore.publicProfiles.push(profile);
    } else {
      Object.assign(profile, {
        slug: body.slug,
        is_published: Boolean(body.is_published),
        visibility_settings: body.visibility_settings,
        public_bio: body.public_bio,
        category: body.category,
        updated_at: new Date().toISOString(),
      });
    }
    return NextResponse.json({ ok: true, profile });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: creator } = await supabase
    .from("creator_accounts")
    .select("id,username")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!creator) return NextResponse.json({ error: "No creator" }, { status: 400 });

  const payload = {
    creator_account_id: creator.id,
    slug: body.slug || creator.username,
    is_published: Boolean(body.is_published),
    visibility_settings: body.visibility_settings,
    public_bio: body.public_bio,
    category: body.category,
  };

  const { data, error } = await supabase
    .from("public_profiles")
    .upsert(payload, { onConflict: "creator_account_id" })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, profile: data });
}
