import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { getDashboardOverview } from "@/lib/data/dashboard";

export const dynamic = "force-dynamic";

export default async function GrowthPage() {
 const data = await getDashboardOverview();
 if (!data || !data.creator) return null;

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-semibold tracking-tight">Growth</h1>
 <p className="mt-1 text-sm text-muted-foreground">
 Follower history starts when StatisticX begins collecting snapshots.
 Historical data before connection is not invented.
 </p>
 </div>
 {data.isDemo ? <Badge variant="warning">Demo data</Badge> : null}
 </div>

 <Card>
 <CardHeader>
 <CardTitle>Follower growth</CardTitle>
 </CardHeader>
 <CardContent>
 <TrendChart
 data={data.growth.map((g) => ({ date: g.date, value: g.followers }))}
 dataKey="value"
 label="Followers"
 />
 </CardContent>
 </Card>
 </div>
 );
}
