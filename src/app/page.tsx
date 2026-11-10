import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FeaturedPlacements } from "@/components/homepage/featured-placements";
import { LeaderboardColumn } from "@/components/homepage/leaderboard-column";
import { HomepageSearchBar } from "@/components/homepage/search-bar";
import { HomepageAuthActions } from "@/components/homepage/auth-actions";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getHomepageData, visitorLabel } from "@/lib/data/homepage";
import { formatNumber } from "@/lib/utils";
import { isDemoMode } from "@/lib/data/mode";

export const dynamic = "force-dynamic";

async function getAuthState() {
  if (isDemoMode()) return false;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return Boolean(user);
  } catch {
    return false;
  }
}

export default async function HomePage() {
  const [data, isAuthenticated] = await Promise.all([
    getHomepageData(),
    getAuthState(),
  ]);

  const leaderboardDisabled = !data.commercialBenchmarkingEnabled
    ? "Public commercial benchmarking is disabled until data-use policy review is complete. Rankings still compute for claimed accounts with valid coverage."
    : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader isAuthenticated={isAuthenticated} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {data.isDemo ? (
          <div className="mb-4 flex justify-center">
            <Badge variant="warning">Demo data — connect Supabase & TwitterAPI.io for live mode</Badge>
          </div>
        ) : null}

        <FeaturedPlacements placements={data.featured} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)_240px] xl:grid-cols-[280px_minmax(0,1fr)_280px]">
          <LeaderboardColumn
            title="Highest Engagement — Last 24 Hours"
            entries={data.engagementTop}
            metricLabel="24h engagement"
            seeAllHref="/leaderboards/engagement"
            disabledReason={null}
          />

          <section className="flex flex-col items-center text-center">
            <h1 className="font-brand animate-fade-up text-3xl tracking-[0.22em] sm:text-4xl md:text-5xl">
              Analytic-X
            </h1>
            <p className="animate-fade-up-delay mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
              Discover creators. Measure influence. Find your next promotion.
            </p>

            <div className="mt-8 w-full max-w-xl">
              <HomepageSearchBar />
            </div>

            <div className="animate-fade-up-delay-2 mt-5 w-full max-w-xl">
              <HomepageAuthActions isAuthenticated={isAuthenticated} />
            </div>

            <div className="mt-10 grid w-full max-w-xl grid-cols-1 gap-6 text-left sm:grid-cols-2">
              <div>
                <h3 className="font-brand text-[11px] text-muted-foreground">
                  For creators
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Claim your X account</li>
                  <li>Track 24h engagement</li>
                  <li>Generate Flex Cards</li>
                  <li>Offer promo packages</li>
                </ul>
              </div>
              <div>
                <h3 className="font-brand text-[11px] text-muted-foreground">
                  For brands
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Search by username</li>
                  <li>Browse niches</li>
                  <li>Compare influence</li>
                  <li>Send promo offers</li>
                </ul>
              </div>
            </div>

            <p className="mt-8 text-xs text-muted-foreground">
              {visitorLabel(data.visitors)}
            </p>
            {leaderboardDisabled ? (
              <p className="mt-3 max-w-lg text-[11px] leading-relaxed text-muted-foreground/80">
                {leaderboardDisabled}
              </p>
            ) : null}
          </section>

          <LeaderboardColumn
            title="Highest Impressions — Last 24 Hours"
            entries={data.impressionsTop}
            metricLabel="24h impressions"
            seeAllHref="/leaderboards/impressions"
            disabledReason={null}
          />
        </div>

        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Recently claimed creators
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Creators who verified ownership on AnalyticX.
              </p>
            </div>
            <Link
              href="/discover"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Discover →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.recentlyClaimed.map((creator) => (
              <Link
                key={creator.id}
                href={`/creator/${creator.username}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent"
              >
                <Avatar>
                  <AvatarImage src={creator.profile_image_url ?? undefined} />
                  <AvatarFallback>
                    {(creator.display_name ?? creator.username).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{creator.display_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    @{creator.username}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium tabular-nums">
                    {formatNumber(creator.followers_count)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">followers</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
