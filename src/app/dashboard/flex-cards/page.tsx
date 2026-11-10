import { Badge } from "@/components/ui/badge";
import { FlexCardGenerator } from "@/components/flex-cards/generator";
import { getDashboardOverview } from "@/lib/data/dashboard";

export const dynamic = "force-dynamic";

export default async function FlexCardsPage() {
  const data = await getDashboardOverview();
  if (!data || !data.creator) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Flex Cards</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate shareable JPG cards from real stored metrics.
          </p>
        </div>
        {data.isDemo ? <Badge variant="warning">Demo data</Badge> : null}
      </div>
      <FlexCardGenerator creator={data.creator} metrics={data.metrics} />
    </div>
  );
}
