"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function MarketplaceOfferPage() {
  const params = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<{
    id: string;
    package_name: string;
    description: string | null;
    price: number;
  } | null>(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [duration, setDuration] = useState("1");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/marketplace/packages/${params.id}`);
      const data = await res.json();
      setPkg(data.package ?? null);
      if (data.package) setOfferAmount(String(data.package.price));
    })();
  }, [params.id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pkg) return;
    const res = await fetch("/api/marketplace/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creator_package_id: pkg.id,
        offer_amount: Number(offerAmount),
        duration_days: Number(duration),
        campaign_description: description,
        campaign_url: url,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Offer failed");
      return;
    }
    toast.success("Offer submitted", {
      description: data.notice,
    });
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{pkg?.package_name ?? "Package"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-sm text-muted-foreground">
              {pkg?.description}
            </p>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label>Offer amount (USD)</Label>
                <Input
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Campaign duration (days)</Label>
                <Input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Campaign description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Business / product URL</Label>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} />
              </div>
              <p className="text-xs text-muted-foreground">
                Payment settlement and escrow are not processed by StatisticX in this version.
              </p>
              <Button type="submit" className="w-full">
                Submit offer
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
