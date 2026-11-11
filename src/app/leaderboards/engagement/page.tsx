import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getHomepageData } from "@/lib/data/homepage";
import { demoStore } from "@/lib/demo/store";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EngagementLeaderboardPage() {
  const home = await getHomepageData();
  const all = demoStore
    .getLeaderboards()
    .filter((l) => l.leaderboard_type === "engagement")
    .sort((a, b) => a.rank - b.rank)
    .map((row) => ({
      ...row,
      creator: demoStore.creators.find((c) => c.id === row.creator_account_id)!,
    }));

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Highest engagement — last 24 hours
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ranked by measured engagement deltas across timestamped post snapshots.
              Only claimed creators with valid coverage are eligible. Lifetime totals are never used as daily values.
            </p>
          </div>
          {home.isDemo ? <Badge variant="warning">Demo data</Badge> : null}
        </div>

        <div className="mt-10 space-y-3">
          {all.map((entry) => (
            <Link
              key={entry.id}
              href={`/creator/${entry.creator.username}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 hover:bg-[#242426]"
            >
              <span className="w-8 text-sm font-medium tabular-nums text-muted-foreground">
                #{entry.rank}
              </span>
              <Avatar>
                <AvatarImage src={entry.creator.profile_image_url ?? undefined} />
                <AvatarFallback>
                  {(entry.creator.display_name ?? entry.creator.username)
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{entry.creator.display_name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  @{entry.creator.username}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium tabular-nums">
                  {formatNumber(Number(entry.metric_value))}
                </p>
                <p className="text-[11px] text-muted-foreground">24h engagement</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
