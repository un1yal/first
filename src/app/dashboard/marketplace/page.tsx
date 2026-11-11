"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PackageRow {
  id: string;
  package_name: string;
  description: string | null;
  package_type: string;
  price: number;
  duration_days: number | null;
  is_active: boolean;
}

interface OfferRow {
  id: string;
  offer_amount: number;
  status: string;
  campaign_description: string | null;
  campaign_url: string | null;
}

export default function MarketplaceDashboardPage() {
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [form, setForm] = useState({
    package_name: "Sponsored post",
    description: "",
    package_type: "sponsored_post",
    price: "250",
    duration_days: "1",
  });

  async function load() {
    const res = await fetch("/api/marketplace/mine");
    const data = await res.json();
    setPackages(data.packages ?? []);
    setOffers(data.offers ?? []);
    setEnabled(Boolean(data.marketplace_enabled ?? true));
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch("/api/marketplace/mine");
      const data = await res.json();
      if (cancelled) return;
      setPackages(data.packages ?? []);
      setOffers(data.offers ?? []);
      setEnabled(Boolean(data.marketplace_enabled ?? true));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function createPackage(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/marketplace/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        duration_days: Number(form.duration_days),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed");
      return;
    }
    toast.success("Package created");
    await load();
  }

  async function updateOffer(id: string, status: string) {
    const res = await fetch("/api/marketplace/offers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      toast.error("Could not update offer");
      return;
    }
    toast.success(`Offer ${status.replace("_", " ")}`);
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Marketplace</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Publish promotional packages and manage offers. Payments are handled outside StatisticX in this release.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Advertising availability is currently{" "}
            <span className="text-foreground">{enabled ? "enabled" : "disabled"}</span>.
          </p>
          <Badge variant={enabled ? "success" : "muted"}>
            {enabled ? "Open to offers" : "Closed"}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create package</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createPackage} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.package_name}
                onChange={(e) => setForm({ ...form, package_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Input
                value={form.package_type}
                onChange={(e) => setForm({ ...form, package_type: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Price (USD)</Label>
              <Input
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration days</Label>
              <Input
                value={form.duration_days}
                onChange={(e) => setForm({ ...form, duration_days: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <Button type="submit" className="sm:col-span-2">
              Save package
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your packages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
            >
              <div>
                <p className="font-medium">{pkg.package_name}</p>
                <p className="text-sm text-muted-foreground">
                  ${pkg.price} · {pkg.duration_days ?? "custom"} days · {pkg.package_type}
                </p>
              </div>
              <Badge variant={pkg.is_active ? "success" : "muted"}>
                {pkg.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Incoming offers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {offers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No offers yet.</p>
          ) : (
            offers.map((offer) => (
              <div key={offer.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">${offer.offer_amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {offer.campaign_description}
                    </p>
                  </div>
                  <Badge>{offer.status}</Badge>
                </div>
                {offer.status === "pending" || offer.status === "counter_offered" ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => updateOffer(offer.id, "accepted")}>
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOffer(offer.id, "rejected")}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateOffer(offer.id, "counter_offered")}
                    >
                      Counter
                    </Button>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
