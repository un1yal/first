import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
        <p className="font-brand text-xs text-muted-foreground">
          © AnalyticX
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/leaderboards/engagement" className="hover:text-foreground">
            Engagement
          </Link>
          <Link href="/leaderboards/impressions" className="hover:text-foreground">
            Impressions
          </Link>
          <Link href="/marketplace" className="hover:text-foreground">
            Marketplace
          </Link>
        </div>
      </div>
    </footer>
  );
}
