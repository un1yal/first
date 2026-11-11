import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { LeaderboardEntry } from "@/lib/data/homepage";
import { formatNumber } from "@/lib/utils";

export function RankCard({
  entry,
  metricLabel,
}: {
  entry: LeaderboardEntry;
  metricLabel: string;
}) {
  return (
    <Link
      href={`/creator/${entry.creator.username}`}
      className="block rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-[#242426]"
    >
      <div className="flex items-start gap-3">
        <div className="nested-tile flex h-10 w-10 shrink-0 items-center justify-center text-xs font-medium tabular-nums text-muted-foreground">
          #{entry.rank}
        </div>
        <Avatar className="h-9 w-9">
          <AvatarImage src={entry.creator.profile_image_url ?? undefined} />
          <AvatarFallback>
            {(entry.creator.display_name ?? entry.creator.username)
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            @{entry.creator.username}
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {entry.post_snippet ?? "No recent post snippet available."}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
            <span className="text-[11px] text-muted-foreground">{metricLabel}</span>
            <span className="text-sm font-medium tabular-nums text-foreground">
              {formatNumber(entry.metric_value)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
