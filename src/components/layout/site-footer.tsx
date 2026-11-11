import Link from "next/link";
import { StatisticXWordmark } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <StatisticXWordmark />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Discover creators. Measure influence. Find your next promotion.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <Link href="/discover" className="hover:text-foreground">
            Discover
          </Link>
          <Link href="/marketplace" className="hover:text-foreground">
            Marketplace
          </Link>
          <Link href="/leaderboards/engagement" className="hover:text-foreground">
            Engagement
          </Link>
          <Link href="/leaderboards/impressions" className="hover:text-foreground">
            Impressions
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl px-4 text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} StatisticX
      </p>
    </footer>
  );
}
