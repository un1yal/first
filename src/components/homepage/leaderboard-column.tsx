import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import type { LeaderboardEntry } from "@/lib/data/homepage";
import { formatNumber } from "@/lib/utils";

export function LeaderboardColumn({
  title,
  entries,
  metricLabel,
  seeAllHref,
  disabledReason,
}: {
  title: string;
  entries: LeaderboardEntry[];
  metricLabel: string;
  seeAllHref: string;
  disabledReason?: string | null;
}) {
  return (
    <section className="animate-fade-up flex h-full flex-col">
      <h2 className="mb-4 text-xs font-light text-[#5a5a5a]">{title}</h2>

      {disabledReason ? (
        <EmptyState
          title="Leaderboard paused"
          description={disabledReason}
          className="flex-1"
        />
      ) : entries.length === 0 ? (
        <EmptyState
          title="No eligible creators yet"
          description="Only claimed creators with valid 24-hour snapshot coverage appear here."
          className="flex-1"
        />
      ) : (
        <div className="flex flex-1 flex-col gap-3">
          {entries.slice(0, 3).map((entry) => (
            <Link
              key={`${entry.rank}-${entry.creator.id}`}
              href={`/creator/${entry.creator.username}`}
              className="group rounded-xl border border-border bg-card p-4 transition-colors hover:bg-[#242426]"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 text-sm font-light text-[#5a5a5a]">
                  #{entry.rank}
                </span>
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={entry.creator.profile_image_url ?? undefined}
                    alt={entry.creator.display_name ?? entry.creator.username}
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
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-[#5a5a5a]">{metricLabel}</span>
                <span className="font-light tabular-nums">
                  {formatNumber(entry.metric_value)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        href={seeAllHref}
        className="mt-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        See all →
      </Link>
    </section>
  );
}
