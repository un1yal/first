"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
 const pathname = usePathname();

 useEffect(() => {
 if (!pathname) return;
 const key = `ax_track:${pathname}`;
 const last = sessionStorage.getItem(key);
 const now = Date.now();
 if (last && now - Number(last) < 30_000) return;
 sessionStorage.setItem(key, String(now));

 void fetch("/api/analytics/visit", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ path: pathname }),
 keepalive: true,
 }).catch(() => undefined);
 }, [pathname]);

 return null;
}
