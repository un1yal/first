import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Privacy notice</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            StatisticX uses first-party analytics stored in Supabase. We assign an
            anonymous visitor identifier via a first-party cookie to count unique
            visitors over a rolling seven-day window.
          </p>
          <p>
            We do not use Google Analytics, PostHog, Mixpanel or other third-party
            product analytics providers in this application.
          </p>
          <p>
            We avoid collecting raw IP addresses unless legally justified and
            necessary. Logged-in admin traffic can be excluded from public visitor
            statistics.
          </p>
          <p>
            Creators control whether their StatisticX profile is public and which
            statistics are visible. X verification is distinct from StatisticX
            ownership verification.
          </p>
          <p>
            Public display of X-derived data, commercial creator comparisons and
            leaderboard use remain subject to applicable X and provider policy
            requirements before production launch.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
