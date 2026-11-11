import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { HomepageSearchBar } from "@/components/homepage/search-bar";
import { HomepageAuthActions } from "@/components/homepage/auth-actions";
import { RankCard } from "@/components/homepage/rank-card";
import { Badge } from "@/components/ui/badge";
import { StatisticXMark } from "@/components/brand/logo";
import { getHomepageData, visitorLabel } from "@/lib/data/homepage";
import { formatNumber } from "@/lib/utils";
import { isDemoMode } from "@/lib/data/mode";
import { ArrowDown } from "lucide-react";

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

function HighlightCard({
  label,
  value,
  detail,
  wide = false,
}: {
  label: string;
  value: string;
  detail?: string | null;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-5 sm:p-6 ${
        wide ? "lg:col-span-2" : ""
      }`}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums text-foreground sm:text-3xl">
        {value}
      </p>
      {detail ? (
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{detail}</p>
      ) : null}
    </div>
  );
}

function LeaderboardColumn({
  title,
  entries,
  metricLabel,
  seeAllHref,
  className,
}: {
  title: string;
  entries: Awaited<ReturnType<typeof getHomepageData>>["engagementTop"];
  metricLabel: string;
  seeAllHref: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mb-5 flex items-center gap-2">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
      </div>
      <div className="space-y-3">
        {entries.length ? (
          entries.slice(0, 3).map((entry) => (
            <RankCard
              key={`${title}-${entry.creator.id}`}
              entry={entry}
              metricLabel={metricLabel}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No eligible creators yet.
          </div>
        )}
      </div>
      <Link
        href={seeAllHref}
        className="mt-5 inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        See all →
      </Link>
    </section>
  );
}

export default async function HomePage() {
  const [data, isAuthenticated] = await Promise.all([
    getHomepageData(),
    getAuthState(),
  ]);

  const topPostValue =
    data.highlights.topPostToday.engagement != null
      ? formatNumber(data.highlights.topPostToday.engagement)
      : "—";
  const topPostDetail = data.highlights.topPostToday.username
    ? `@${data.highlights.topPostToday.username}${
        data.highlights.topPostToday.text
          ? ` · ${data.highlights.topPostToday.text}`
          : ""
      }`
    : data.highlights.topPostToday.text;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader isAuthenticated={isAuthenticated} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        {data.isDemo ? (
          <div className="mb-6">
            <Badge variant="warning">
              Demo data — connect Supabase & TwitterAPI.io for live mode
            </Badge>
          </div>
        ) : null}

        <section className="order-4 mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:order-1 lg:mb-12 lg:grid-cols-4">
          <HighlightCard
            label="Creators tracked"
            value={formatNumber(data.highlights.creatorsTracked)}
            detail={visitorLabel(data.visitors)}
          />
          <HighlightCard
            label="Top post today"
            value={topPostValue}
            detail={topPostDetail}
            wide
          />
          <HighlightCard
            label="Total impressions today"
            value={formatNumber(data.highlights.totalImpressionsToday)}
            detail="Sum of ranked 24h impression deltas"
          />
        </section>

        <div className="order-1 grid flex-1 grid-cols-1 gap-10 lg:order-2 lg:grid-cols-[240px_minmax(0,1fr)_240px] lg:gap-8 xl:grid-cols-[280px_minmax(0,1fr)_280px] xl:gap-10">
          <LeaderboardColumn
            className="order-2 lg:order-1"
            title="Highest engagement today"
            entries={data.engagementTop}
            metricLabel="24h engagement"
            seeAllHref="/leaderboards/engagement"
          />

          <section className="order-1 flex flex-col items-center text-center lg:order-2 lg:px-4">
            <div className="animate-fade-up inline-flex items-center gap-3">
              <span className="nested-tile flex h-10 w-10 items-center justify-center">
                <StatisticXMark className="h-5 w-5" />
              </span>
              <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                StatisticX
              </h1>
            </div>
            <p className="animate-fade-up-delay mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              Discover creators. Measure influence. Find your next promotion.
            </p>

            <div className="mt-8 w-full max-w-xl">
              <HomepageSearchBar />
            </div>

            <div className="mt-5 w-full max-w-xl">
              <HomepageAuthActions isAuthenticated={isAuthenticated} />
            </div>

            <div className="mt-10 grid w-full max-w-xl grid-cols-1 gap-8 text-left sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="mb-3 text-sm text-muted-foreground">
                  Trending creators
                </p>
                <ul className="space-y-2.5">
                  {data.trendingCreators.map((creator) => (
                    <li key={creator.id}>
                      <Link
                        href={`/creator/${creator.username}`}
                        className="block truncate text-sm text-foreground transition-colors hover:text-muted-foreground"
                      >
                        @{creator.username}
                        <span className="ml-2 text-muted-foreground">
                          {formatNumber(creator.followers_count)}
                        </span>
                      </Link>
                    </li>
                  ))}
                  {!data.trendingCreators.length ? (
                    <li className="text-sm text-muted-foreground">No creators yet</li>
                  ) : null}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="mb-3 text-sm text-muted-foreground">
                  Recently claimed
                </p>
                <ul className="space-y-2.5">
                  {data.recentlyClaimed.map((creator) => (
                    <li key={creator.id}>
                      <Link
                        href={`/creator/${creator.username}`}
                        className="block truncate text-sm text-foreground transition-colors hover:text-muted-foreground"
                      >
                        @{creator.username}
                      </Link>
                    </li>
                  ))}
                  {!data.recentlyClaimed.length ? (
                    <li className="text-sm text-muted-foreground">No claims yet</li>
                  ) : null}
                </ul>
              </div>
            </div>
          </section>

          <LeaderboardColumn
            className="order-3"
            title="Highest impressions today"
            entries={data.impressionsTop}
            metricLabel="24h impressions"
            seeAllHref="/leaderboards/impressions"
          />
        </div>
      </main>

      <footer className="border-t border-border py-10 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} StatisticX
        </p>
      </footer>
    </div>
  );
}
