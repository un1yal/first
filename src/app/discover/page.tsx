import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getCreators() {
  if (isDemoMode()) {
    return demoStore.creators
      .filter((c) => c.claimed_status === "claimed")
      .map((c) => ({
        ...c,
        category:
          demoStore.publicProfiles.find((p) => p.creator_account_id === c.id)?.category ??
          null,
      }));
  }
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("creator_accounts")
    .select("*, public_profiles(category,is_published)")
    .eq("claimed_status", "claimed")
    .order("followers_count", { ascending: false })
    .limit(48);
  return (data ?? []).map((c) => ({
    ...c,
    category: Array.isArray(c.public_profiles)
      ? c.public_profiles[0]?.category
      : c.public_profiles?.category,
  }));
}

export default async function DiscoverPage() {
  const creators = await getCreators();
  const categories = Array.from(
    new Set(creators.map((c) => c.category).filter(Boolean)),
  ) as string[];

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Discover</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse claimed StatisticX creators by audience and niche.
            </p>
          </div>
          {isDemoMode() ? <Badge variant="warning">Demo data</Badge> : null}
        </div>

        {categories.length ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <Link
              key={creator.id}
              href={`/creator/${creator.username}`}
              className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-colors hover:bg-secondary/40"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={creator.profile_image_url ?? undefined} />
                  <AvatarFallback>
                    {(creator.display_name ?? creator.username).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{creator.display_name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    @{creator.username}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {creator.category ?? "Creator"}
                </span>
                <span className="tabular-nums">
                  {formatNumber(creator.followers_count)} followers
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
