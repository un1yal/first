import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardOverview } from "@/lib/data/dashboard";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const data = await getDashboardOverview();
  if (!data || !data.creator) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Incremental sync stores posts by stable X post ID.
          </p>
        </div>
        {data.isDemo ? <Badge variant="warning">Demo data</Badge> : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tracked posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="pb-3 font-medium">Post</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Impressions</th>
                  <th className="pb-3 font-medium">Likes</th>
                  <th className="pb-3 font-medium">Replies</th>
                  <th className="pb-3 font-medium">Reposts</th>
                  <th className="pb-3 font-medium">Quotes</th>
                  <th className="pb-3 font-medium">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {data.posts.map((post) => (
                  <tr key={post.id} className="border-b border-border/70 align-top">
                    <td className="py-3 pr-4">
                      <p className="line-clamp-2 max-w-sm">{post.post_text}</p>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3 tabular-nums">{formatNumber(post.views)}</td>
                    <td className="py-3 tabular-nums">{formatNumber(post.likes)}</td>
                    <td className="py-3 tabular-nums">{formatNumber(post.replies)}</td>
                    <td className="py-3 tabular-nums">{formatNumber(post.reposts)}</td>
                    <td className="py-3 tabular-nums">{formatNumber(post.quotes)}</td>
                    <td className="py-3 tabular-nums">
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
