import Link from "next/link";
import { Metric } from "@/components/ui/metric";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const demo = isDemoMode();
  const visitors = demoStore.getWeeklyVisitors();
  const leaderboards = demoStore.getLeaderboards();

  return (
    <div className="flex min-h-dvh bg-background">
      <div className="hidden md:block">
        <DashboardSidebar isAdmin />
      </div>
      <div className="flex-1 space-y-6 overflow-auto p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Platform monitoring, API usage and moderation.
            </p>
          </div>
          {demo ? <Badge variant="warning">Demo mode</Badge> : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Registered users" value={demoStore.profiles.length} />
          <Metric
            label="Claimed creators"
            value={demoStore.creators.filter((c) => c.claimed_status === "claimed").length}
          />
          <Metric
            label="Published profiles"
            value={demoStore.publicProfiles.filter((p) => p.is_published).length}
          />
          <Metric label="Unique visitors (7d)" value={visitors.unique_visitors} />
          <Metric label="Page views (7d)" value={visitors.page_views} />
          <Metric label="Promotional offers" value={demoStore.offers.length} />
          <Metric
            label="Active packages"
            value={demoStore.packages.filter((p) => p.is_active).length}
          />
          <Metric
            label="Leaderboard rows"
            value={leaderboards.length}
            hint="Engagement + impressions"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>API monitoring</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Profile lookup: 18 credits / user</p>
              <p>Timeline tweets: 15 credits / tweet</p>
              <p>Minimum charge: 15 credits / request</p>
              <p>100,000 credits = $1.00</p>
              <p>
                Configure daily/monthly budgets in `platform_config.api_limits`.
              </p>
              <Button asChild size="sm" className="mt-3">
                <Link href="/api/cron/sync">Run sync job (manual)</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured placements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoStore.featured.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span>Slot {slot.slot_index}</span>
                  <Badge variant={slot.is_active ? "success" : "muted"}>
                    {slot.is_active ? "Active" : "Empty"}
                  </Badge>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Assign creators, images and destination URLs from Supabase or a
                forthcoming admin editor. Empty slots stay as neutral placeholders.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
