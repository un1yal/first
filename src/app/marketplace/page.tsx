import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getListings() {
  if (isDemoMode()) {
    return demoStore.packages
      .filter((p) => p.is_active)
      .map((pkg) => {
        const creator = demoStore.creators.find((c) => c.id === pkg.creator_account_id)!;
        return { pkg, creator };
      });
  }
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("creator_packages")
    .select("*, creator_accounts(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(48);
  return (data ?? []).map((row) => ({
    pkg: row,
    creator: row.creator_accounts,
  }));
}

export default async function MarketplacePage() {
  const listings = await getListings();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">Marketplace</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Discover creators offering promotional placements. Submit an enquiry or offer.
            Payment arrangements are handled outside AnalyticX in this initial release.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {listings.map(({ pkg, creator }) => (
            <Card key={pkg.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{pkg.package_name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      @{creator.username} · {formatNumber(creator.followers_count)} followers
                    </p>
                  </div>
                  <Badge variant="outline">${pkg.price}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {pkg.description || "Promotional package"}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="muted">{pkg.package_type}</Badge>
                  {pkg.duration_days ? (
                    <Badge variant="muted">{pkg.duration_days} days</Badge>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href={`/marketplace/${pkg.id}`}>View & enquire</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/creator/${creator.username}`}>Creator profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
