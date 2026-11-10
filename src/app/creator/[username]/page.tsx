import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric } from "@/components/ui/metric";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";
import { formatNumber, xProfileUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getCreatorPage(username: string) {
  if (isDemoMode()) {
    const creator = demoStore.creators.find(
      (c) => c.username.toLowerCase() === username.toLowerCase(),
    );
    if (!creator || creator.claimed_status !== "claimed") return null;
    const profile = demoStore.publicProfiles.find(
      (p) => p.creator_account_id === creator.id && p.is_published,
    );
    if (!profile) return null;
    const metrics = demoStore.getCreatorMetrics(creator.id);
    const posts = demoStore.posts
      .filter((p) => p.creator_account_id === creator.id)
      .slice(0, 5);
    const packages = demoStore.packages.filter(
      (p) => p.creator_account_id === creator.id && p.is_active,
    );
    return { creator, profile, metrics, posts, packages, isDemo: true };
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: creator } = await supabase
    .from("creator_accounts")
    .select("*")
    .ilike("username", username)
    .eq("claimed_status", "claimed")
    .maybeSingle();
  if (!creator) return null;
  const { data: profile } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("creator_account_id", creator.id)
    .eq("is_published", true)
    .maybeSingle();
  if (!profile) return null;
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("creator_account_id", creator.id)
    .order("published_at", { ascending: false })
    .limit(5);
  const { data: packages } = await supabase
    .from("creator_packages")
    .select("*")
    .eq("creator_account_id", creator.id)
    .eq("is_active", true);

  return {
    creator,
    profile,
    metrics: {
      engagement24h: null,
      impressions24h: null,
      engagementRate: null,
    },
    posts: posts ?? [],
    packages: packages ?? [],
    isDemo: false,
  };
}

export default async function CreatorPublicPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await getCreatorPage(username);
  if (!data) notFound();

  const { creator, profile, metrics, posts, packages } = data;
  const visibility = profile.visibility_settings;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={creator.profile_image_url ?? undefined} />
              <AvatarFallback>
                {(creator.display_name ?? creator.username).slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {creator.display_name}
                </h1>
                {creator.is_blue_verified ? (
                  <Badge variant="outline">X verified</Badge>
                ) : null}
                <Badge variant="success">AnalyticX claimed</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">@{creator.username}</p>
              {visibility.show_biography ? (
                <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                  {profile.public_bio || creator.biography}
                </p>
              ) : null}
              {profile.category ? (
                <p className="mt-2 text-xs text-muted-foreground">{profile.category}</p>
              ) : null}
            </div>
          </div>
          <Button asChild>
            <a
              href={xProfileUrl(creator.username)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in X
            </a>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {visibility.show_followers ? (
            <Metric label="Followers" value={creator.followers_count} />
          ) : null}
          {visibility.show_following ? (
            <Metric label="Following" value={creator.following_count} />
          ) : null}
          {visibility.show_engagement ? (
            <Metric label="24h engagement" value={metrics.engagement24h} />
          ) : null}
          {visibility.show_impressions ? (
            <Metric label="24h impressions" value={metrics.impressions24h} />
          ) : null}
        </div>

        {visibility.show_posts ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent tracked posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="rounded-xl border border-border p-4">
                  <p className="text-sm">{post.post_text}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleString()
                      : "Unknown date"}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {packages.length ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Promotional packages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
                >
                  <div>
                    <p className="font-medium">{pkg.package_name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${pkg.price} · {pkg.package_type}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/marketplace/${pkg.id}`}>Enquire</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        <p className="mt-8 text-xs text-muted-foreground">
          Last synced{" "}
          {creator.last_synced_at
            ? new Date(creator.last_synced_at).toLocaleString()
            : "unavailable"}
          {data.isDemo ? " · Demo data" : null}
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
