import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HomepageSearchBar } from "@/components/homepage/search-bar";
import { HomepageAuthActions } from "@/components/homepage/auth-actions";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getHomepageData, visitorLabel } from "@/lib/data/homepage";
import { formatNumber } from "@/lib/utils";
import { isDemoMode } from "@/lib/data/mode";
import { ArrowRight, BarChart3, Search, ShoppingBag } from "lucide-react";

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

function MockDashboardPreview() {
  const points = [42, 48, 45, 62, 58, 71, 68, 84, 79, 92, 88, 96];
  const max = Math.max(...points);
  const width = 520;
  const height = 160;
  const step = width / (points.length - 1);
  const path = points
    .map((v, i) => {
      const x = i * step;
      const y = height - (v / max) * (height - 16) - 8;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
  const area = `${path} L${width},${height} L0,${height} Z`;

  return (
    <div className="animate-fade-up-delay-2 overflow-hidden rounded-[24px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Balance trend</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
            96.4k
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            24h engagement across tracked posts
          </p>
        </div>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          +12.4%
        </span>
      </div>
      <div className="mt-6 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-40 w-full"
          role="img"
          aria-label="Example engagement trend chart"
        >
          <defs>
            <linearGradient id="previewFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8F169" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#C8F169" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#previewFill)" />
          <path
            d={path}
            fill="none"
            stroke="#111111"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "Followers", value: "128k" },
          { label: "Impressions", value: "2.1M" },
          { label: "Eng. rate", value: "4.8%" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-secondary/60 px-3 py-3 sm:px-4"
          >
            <p className="text-[11px] text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [data, isAuthenticated] = await Promise.all([
    getHomepageData(),
    getAuthState(),
  ]);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader isAuthenticated={isAuthenticated} />

      <main className="flex-1">
        {data.isDemo ? (
          <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
            <Badge variant="warning">
              Demo data — connect Supabase & TwitterAPI.io for live mode
            </Badge>
          </div>
        ) : null}

        <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-8 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-16">
          <div>
            <p className="animate-fade-up text-sm font-medium text-muted-foreground">
              StatisticX
            </p>
            <h1 className="animate-fade-up mt-4 max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
              Discover creators. Measure influence.
            </h1>
            <p className="animate-fade-up-delay mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
              Claim your X profile, track honest 24-hour deltas, and find your
              next promotion — without the noise.
            </p>
            <div className="mt-8 max-w-md">
              <HomepageSearchBar />
            </div>
            <div className="mt-5">
              <HomepageAuthActions isAuthenticated={isAuthenticated} />
            </div>
            <p className="mt-8 text-xs text-muted-foreground">
              {visitorLabel(data.visitors)}
            </p>
          </div>
          <MockDashboardPreview />
        </section>

        <section className="border-y border-border/70 bg-card/40 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="max-w-lg text-3xl font-semibold tracking-tight">
              Built for creators and brands who want clarity
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              One clean workspace for discovery, analytics, and marketplace
              outreach.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Search,
                  title: "Discover",
                  body: "Search X usernames, browse niches, and compare claimed creators with transparent coverage.",
                },
                {
                  icon: BarChart3,
                  title: "Measure",
                  body: "24h engagement and impressions from timestamped snapshots — never lifetime totals dressed as daily.",
                },
                {
                  icon: ShoppingBag,
                  title: "Promote",
                  body: "Publish packages, receive offers, and run outreach without locking payments into the platform.",
                },
              ].map((feature) => (
                <div key={feature.title} className="max-w-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent">
                    <feature.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Top creators this window
              </h2>
              <p className="mt-2 text-muted-foreground">
                Ranked from claimed accounts with valid snapshot coverage.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/leaderboards/engagement">
                View leaderboards
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Highest engagement
              </p>
              <div className="mt-5 space-y-4">
                {data.engagementTop.slice(0, 5).map((entry) => (
                  <Link
                    key={entry.creator.id}
                    href={`/creator/${entry.creator.username}`}
                    className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-secondary/60"
                  >
                    <span className="w-6 text-sm tabular-nums text-muted-foreground">
                      {entry.rank}
                    </span>
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={entry.creator.profile_image_url ?? undefined}
                      />
                      <AvatarFallback>
                        {(entry.creator.display_name ?? entry.creator.username)
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {entry.creator.display_name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        @{entry.creator.username}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatNumber(entry.metric_value)}
                    </span>
                  </Link>
                ))}
                {data.engagementTop.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No eligible creators yet.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-[24px] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Highest impressions
              </p>
              <div className="mt-5 space-y-4">
                {data.impressionsTop.slice(0, 5).map((entry) => (
                  <Link
                    key={entry.creator.id}
                    href={`/creator/${entry.creator.username}`}
                    className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-secondary/60"
                  >
                    <span className="w-6 text-sm tabular-nums text-muted-foreground">
                      {entry.rank}
                    </span>
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={entry.creator.profile_image_url ?? undefined}
                      />
                      <AvatarFallback>
                        {(entry.creator.display_name ?? entry.creator.username)
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {entry.creator.display_name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        @{entry.creator.username}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatNumber(entry.metric_value)}
                    </span>
                  </Link>
                ))}
                {data.impressionsTop.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No eligible creators yet.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Recently claimed
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Creators who verified ownership on StatisticX.
              </p>
            </div>
            <Link
              href="/discover"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Discover →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.recentlyClaimed.map((creator) => (
              <Link
                key={creator.id}
                href={`/creator/${creator.username}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-colors hover:bg-secondary/40"
              >
                <Avatar>
                  <AvatarImage src={creator.profile_image_url ?? undefined} />
                  <AvatarFallback>
                    {(creator.display_name ?? creator.username)
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {creator.display_name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    @{creator.username}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">
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
