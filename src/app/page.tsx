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
    <div className="animate-fade-up-delay-2 perspective-[1400px]">
      <div className="corner-brackets origin-center rotate-y-[-8deg] rotate-x-[4deg] overflow-hidden rounded-xl border border-border bg-[#131313] p-5 shadow-[var(--shadow-soft)] sm:p-7 [transform:rotateY(-8deg)_rotateX(4deg)]">
        <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
          <p className="font-display text-[11px] tracking-[0.2em] text-muted-foreground">
            StatisticX
          </p>
          <p className="text-xs italic text-[#5a5a5a]">Home</p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Engagement trend</p>
            <p className="mt-1 text-3xl font-light tracking-tight tabular-nums">
              96.4k
            </p>
            <p className="mt-1 text-xs text-[#5a5a5a]">
              24h engagement across tracked posts
            </p>
          </div>
          <span className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground">
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
                <stop offset="0%" stopColor="#ededed" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#ededed" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#previewFill)" />
            <path
              d={path}
              fill="none"
              stroke="#ededed"
              strokeWidth="1.5"
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
              className="corner-brackets rounded-xl border border-border bg-[rgba(255,255,255,0.02)] px-3 py-3"
            >
              <p className="text-[11px] text-[#5a5a5a]">{item.label}</p>
              <p className="mt-1 text-lg font-light tabular-nums">{item.value}</p>
            </div>
          ))}
        </div>
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

        <section className="mx-auto grid max-w-6xl gap-14 px-4 pb-10 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-20">
          <div>
            <p className="animate-fade-up font-display text-[12px] tracking-[0.28em] text-muted-foreground">
              StatisticX
            </p>
            <h1 className="animate-fade-up mt-6 max-w-xl text-4xl font-light tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
              Discover creators.
              <br />
              Measure influence.
            </h1>
            <p className="animate-fade-up-delay mt-6 max-w-md text-base font-light text-muted-foreground sm:text-lg">
              Claim your X profile, track honest 24-hour deltas, and find your
              next promotion — without the noise.
            </p>
            <div className="mt-9 max-w-md">
              <HomepageSearchBar />
            </div>
            <div className="mt-5">
              <HomepageAuthActions isAuthenticated={isAuthenticated} />
            </div>
            <p className="mt-10 text-xs text-[#5a5a5a]">
              {visitorLabel(data.visitors)}
            </p>
          </div>
          <MockDashboardPreview />
        </section>

        <section className="border-y border-border py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="max-w-lg text-3xl font-light tracking-tight">
              Built for creators and brands who want clarity
            </h2>
            <p className="mt-3 max-w-xl font-light text-muted-foreground">
              One clean workspace for discovery, analytics, and marketplace
              outreach.
            </p>
            <div className="mt-14 grid gap-10 md:grid-cols-3">
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
                <div
                  key={feature.title}
                  className="corner-brackets max-w-sm rounded-xl border border-transparent p-1"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-[rgba(255,255,255,0.03)]">
                    <feature.icon className="h-4 w-4 stroke-[1.5] text-foreground" />
                  </div>
                  <h3 className="mt-5 text-lg font-light tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
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
              <h2 className="text-3xl font-light tracking-tight">
                Top creators this window
              </h2>
              <p className="mt-2 font-light text-muted-foreground">
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
            {[
              {
                title: "Highest engagement",
                entries: data.engagementTop,
              },
              {
                title: "Highest impressions",
                entries: data.impressionsTop,
              },
            ].map((board) => (
              <div
                key={board.title}
                className="corner-brackets rounded-xl border border-border bg-card p-6"
              >
                <p className="text-xs font-light text-[#5a5a5a]">{board.title}</p>
                <div className="mt-5 space-y-3">
                  {board.entries.slice(0, 5).map((entry) => (
                    <Link
                      key={entry.creator.id}
                      href={`/creator/${entry.creator.username}`}
                      className="corner-brackets flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[rgba(255,255,255,0.03)]"
                    >
                      <span className="w-6 text-sm tabular-nums text-[#5a5a5a]">
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
                        <p className="truncate text-sm font-light">
                          {entry.creator.display_name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          @{entry.creator.username}
                        </p>
                      </div>
                      <span className="text-sm font-light tabular-nums">
                        {formatNumber(entry.metric_value)}
                      </span>
                    </Link>
                  ))}
                  {board.entries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No eligible creators yet.
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-light tracking-tight">
                Recently claimed
              </h2>
              <p className="mt-1 text-sm font-light text-muted-foreground">
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
                className="corner-brackets flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-[rgba(255,255,255,0.03)]"
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
                  <p className="truncate text-sm font-light">
                    {creator.display_name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    @{creator.username}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-light tabular-nums">
                    {formatNumber(creator.followers_count)}
                  </p>
                  <p className="text-[11px] text-[#5a5a5a]">followers</p>
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
