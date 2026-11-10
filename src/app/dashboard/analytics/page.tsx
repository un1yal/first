import { Metric } from "@/components/ui/metric";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { getDashboardOverview } from "@/lib/data/dashboard";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const data = await getDashboardOverview();
  if (!data || !data.creator) return null;

  const series = data.posts
    .slice()
    .reverse()
    .map((post, index) => ({
      date: post.published_at
        ? new Date(post.published_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })
        : `P${index + 1}`,
      engagement: post.engagement ?? 0,
      impressions: post.views ?? 0,
      likes: post.likes ?? 0,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Trends from stored snapshots. Missing values stay unavailable.
          </p>
        </div>
        {data.isDemo ? <Badge variant="warning">Demo data</Badge> : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="24h engagement" value={data.metrics.engagement24h} />
        <Metric label="24h impressions" value={data.metrics.impressions24h} />
        <Metric label="24h likes" value={data.metrics.likes24h} />
        <Metric label="24h replies" value={data.metrics.replies24h} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Engagement over tracked posts</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={series} dataKey="engagement" label="Engagement" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Impressions over tracked posts</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={series} dataKey="impressions" label="Impressions" />
        </CardContent>
      </Card>
    </div>
  );
}
