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
      className="corner-brackets block rounded-xl border border-border bg-card p-4 transition-colors hover:bg-[rgba(255,255,255,0.03)]"
    >
      <div className="flex items-start gap-3">
        <span className="pt-0.5 text-sm font-light tabular-nums text-[#5a5a5a]">
          #{entry.rank}
        </span>
        <Avatar className="h-9 w-9">
          <AvatarImage src={entry.creator.profile_image_url ?? undefined} />
          <AvatarFallback>
            {(entry.creator.display_name ?? entry.creator.username)
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-light text-foreground">
            @{entry.creator.username}
          </p>
          <p className="mt-1 line-clamp-2 text-xs font-light leading-relaxed text-muted-foreground">
            {entry.post_snippet ?? "No recent post snippet available."}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#5a5a5a]">{metricLabel}</span>
            <span className="text-sm font-light tabular-nums text-foreground">
              {formatNumber(entry.metric_value)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
