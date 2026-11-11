import Link from "next/link";
import { Metric } from "@/components/ui/metric";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { getDashboardOverview } from "@/lib/data/dashboard";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const data = await getDashboardOverview();

  if (!data || ("needsOnboarding" in data && data.needsOnboarding)) {
    return (
      <div className="corner-brackets mx-auto max-w-lg rounded-xl border border-border bg-card p-10 text-center">
        <h1 className="text-2xl font-light tracking-tight">
          Connect your X account
        </h1>
        <p className="mt-3 text-sm font-light text-muted-foreground">
          Claim and verify ownership to unlock analytics.
        </p>
        <Button asChild className="mt-7">
          <Link href="/onboarding">Start onboarding</Link>
        </Button>
      </div>
    );
  }

  const { creator, metrics, posts } = data;
  if (!creator) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Overview</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            @{creator.username} · last sync{" "}
            {creator.last_synced_at
              ? new Date(creator.last_synced_at).toLocaleString()
              : "not synced yet"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {data.isDemo ? <Badge variant="warning">Demo data</Badge> : null}
          <Badge variant="success">{creator.claimed_status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Followers" value={creator.followers_count} />
        <Metric label="Following" value={creator.following_count} />
        <Metric label="Posts" value={creator.posts_count} />
        <Metric
          label="Engagement rate"
          value={
            metrics.engagementRate != null
              ? `${metrics.engagementRate.toFixed(2)}%`
              : null
          }
          hint="Based on available impressions or followers"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="font-light">Engagement trend</CardTitle>
            <p className="text-sm font-light text-muted-foreground">
              Follower growth from stored snapshots
            </p>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={data.growth.map((g) => ({
                date: g.date.slice(5),
                value: g.followers,
              }))}
              dataKey="value"
              label="Followers"
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Metric
            label="24h engagement"
            value={metrics.engagement24h}
            hint={
              metrics.coverageValid
                ? `Coverage across ${metrics.postsCovered} posts`
                : "Awaiting sufficient snapshot coverage"
            }
            trend={metrics.engagement24h ? "up" : "neutral"}
          />
          <Metric
            label="24h impressions"
            value={metrics.impressions24h}
            hint="Difference between timestamped view snapshots — not lifetime views"
            trend={metrics.impressions24h ? "up" : "neutral"}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-light">Best-performing tracked posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs text-[#5a5a5a]">
                <tr className="border-b border-border">
                  <th className="pb-4 font-normal">Post</th>
                  <th className="pb-4 font-normal">Impressions</th>
                  <th className="pb-4 font-normal">Likes</th>
                  <th className="pb-4 font-normal">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {[...posts]
                  .sort((a, b) => (b.engagement ?? -1) - (a.engagement ?? -1))
                  .slice(0, 5)
                  .map((post) => (
                    <tr key={post.id} className="border-b border-border/70">
                      <td className="py-4 pr-4 font-light">
                        <p className="line-clamp-2 max-w-md">{post.post_text}</p>
                      </td>
                      <td className="py-4 font-light tabular-nums">
                        {formatNumber(post.views)}
                      </td>
                      <td className="py-4 font-light tabular-nums">
                        {formatNumber(post.likes)}
                      </td>
                      <td className="py-4 font-light tabular-nums">
                        {formatNumber(post.engagement)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
