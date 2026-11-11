import Link from "next/link";
import {
  FileText,
  Pencil,
  Share2,
  Users,
  Eye,
  Activity,
} from "lucide-react";
import { Metric } from "@/components/ui/metric";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { getDashboardOverview } from "@/lib/data/dashboard";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const data = await getDashboardOverview();

  if (!data || ("needsOnboarding" in data && data.needsOnboarding)) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-10 text-center">
        <h1 className="text-2xl font-medium tracking-tight">
          Connect your X account
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
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

  const welcomeName =
    creator.display_name?.split(" ")[0] || creator.username || "there";
  const topPosts = [...posts]
    .sort((a, b) => (b.engagement ?? -1) - (a.engagement ?? -1))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">
            Welcome back {welcomeName}!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
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
        <Metric
          label="Followers"
          value={creator.followers_count}
          icon={<Users className="h-4 w-4" strokeWidth={1.6} />}
        />
        <Metric
          label="Following"
          value={creator.following_count}
          icon={<Users className="h-4 w-4" strokeWidth={1.6} />}
        />
        <Metric
          label="Posts"
          value={creator.posts_count}
          icon={<FileText className="h-4 w-4" strokeWidth={1.6} />}
        />
        <Metric
          label="Engagement rate"
          value={
            metrics.engagementRate != null
              ? `${metrics.engagementRate.toFixed(2)}%`
              : null
          }
          hint="Based on available impressions or followers"
          icon={<Activity className="h-4 w-4" strokeWidth={1.6} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.45fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Followers over time</CardTitle>
            <p className="text-sm text-muted-foreground">
              Solid line is current window; dashed line is a lagged comparison.
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
              compareLabel="Previous"
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
            icon={<Activity className="h-4 w-4" strokeWidth={1.6} />}
          />
          <Metric
            label="24h impressions"
            value={metrics.impressions24h}
            hint="Difference between timestamped view snapshots — not lifetime views"
            icon={<Eye className="h-4 w-4" strokeWidth={1.6} />}
          />
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium tracking-tight">Your posts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Best-performing tracked posts with quick actions.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start gap-3">
                  <div className="nested-tile flex h-12 w-12 shrink-0 items-center justify-center text-muted-foreground">
                    <FileText className="h-4 w-4" strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <Avatar
                          key={i}
                          className="-ml-2 h-7 w-7 border border-border first:ml-0"
                        >
                          <AvatarImage
                            src={creator.profile_image_url ?? undefined}
                          />
                          <AvatarFallback>
                            {(creator.display_name ?? creator.username)
                              .slice(0, 1)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      <span className="ml-2 text-xs text-muted-foreground">
                        240+
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="line-clamp-2 text-sm font-medium text-foreground">
                    {post.post_text || "Untitled post"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatNumber(post.views)} impressions ·{" "}
                    {formatNumber(post.engagement)} engagement
                  </p>
                </div>
                <div className="flex gap-2 border-t border-border pt-4">
                  <Button asChild variant="secondary" size="sm" className="flex-1">
                    <a
                      href={post.post_url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Share
                    </a>
                  </Button>
                  <Button asChild variant="secondary" size="sm" className="flex-1">
                    <Link href="/dashboard/posts">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
