"use client";

import { useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";

type Template = "minimal" | "dark" | "light" | "analytics";

export function FlexCardGenerator({
  creator,
  metrics,
}: {
  creator: {
    display_name: string | null;
    username: string;
    profile_image_url: string | null;
    followers_count: number;
  };
  metrics: {
    engagement24h: number | null;
    impressions24h: number | null;
    engagementRate: number | null;
  };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<Template>("dark");
  const [busy, setBusy] = useState(false);

  const templates: Template[] = ["dark", "minimal", "analytics", "light"];

  async function renderJpeg() {
    if (!ref.current) throw new Error("Card not ready");
    return toJpeg(ref.current, {
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: true,
    });
  }

  async function download() {
    setBusy(true);
    try {
      const dataUrl = await renderJpeg();
      const link = document.createElement("a");
      link.download = `statisticx-${creator.username}-flex.jpg`;
      link.href = dataUrl;
      link.click();
      toast.success("JPG downloaded");
      await fetch("/api/flex-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, metrics }),
      }).catch(() => undefined);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }

  async function copyImage() {
    setBusy(true);
    try {
      const dataUrl = await renderJpeg();
      const blob = await (await fetch(dataUrl)).blob();
      if (!("clipboard" in navigator) || !("ClipboardItem" in window)) {
        toast.message("Clipboard image unsupported — downloading instead");
        await download();
        return;
      }
      const clipboardBlob =
        blob.type === "image/jpeg"
          ? blob
          : new Blob([blob], { type: "image/png" });
      const type = clipboardBlob.type || "image/png";
      await navigator.clipboard.write([
        new ClipboardItem({ [type]: clipboardBlob }),
      ]);
      toast.success("Image copied to clipboard");
    } catch {
      toast.message("Copy failed — downloading JPG fallback");
      await download();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="overflow-auto rounded-xl border border-border bg-[rgba(255,255,255,0.02)] p-6">
        <div
          ref={ref}
          className={cn(
            "mx-auto flex h-[420px] w-[680px] flex-col justify-between rounded-xl p-8",
            template === "dark" && "bg-[#0b0b0b] text-[#ededed]",
            template === "minimal" && "bg-[#131313] text-[#ededed]",
            template === "light" && "bg-[#ededed] text-[#0b0b0b]",
            template === "analytics" &&
              "bg-[linear-gradient(160deg,#0b0b0b,#131313)] text-[#ededed]",
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  creator.profile_image_url ||
                  "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"
                }
                alt=""
                className="h-16 w-16 rounded-full border border-white/10 object-cover"
              />
              <div>
                <p className="text-xl font-light tracking-tight">{creator.display_name}</p>
                <p className="text-sm opacity-60">@{creator.username}</p>
              </div>
            </div>
            <p className="font-display text-[10px] tracking-[0.22em] opacity-70">
              StatisticX
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MetricBlock label="Followers" value={creator.followers_count} />
            <MetricBlock label="24h engagement" value={metrics.engagement24h} />
            <MetricBlock label="24h impressions" value={metrics.impressions24h} />
            <MetricBlock
              label="Engagement rate"
              value={
                metrics.engagementRate != null
                  ? `${metrics.engagementRate.toFixed(2)}%`
                  : null
              }
            />
          </div>

          <p className="text-[11px] opacity-50">
            Metrics from StatisticX · Only values with valid coverage are shown
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">Template</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {templates.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={template === t ? "default" : "outline"}
                onClick={() => setTemplate(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
        <Badge variant="outline">Browser-side JPG rendering</Badge>
        <div className="flex flex-col gap-2">
          <Button onClick={copyImage} disabled={busy}>
            Copy Image
          </Button>
          <Button variant="secondary" onClick={download} disabled={busy}>
            Download JPG
          </Button>
        </div>
      </div>
    </div>
  );
}

function MetricBlock({
  label,
  value,
}: {
  label: string;
  value: number | string | null;
}) {
  return (
    <div className="rounded-xl border border-current/15 bg-black/10 p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] opacity-60">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">
        {typeof value === "number" ? formatNumber(value) : value ?? "—"}
      </p>
    </div>
  );
}
