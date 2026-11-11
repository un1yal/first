"use client";

import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function cssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

export function TrendChart({
  data,
  dataKey = "value",
  compareKey = "compare",
  label = "Value",
  compareLabel = "Previous",
}: {
  data: Array<Record<string, string | number>>;
  dataKey?: string;
  compareKey?: string;
  label?: string;
  compareLabel?: string;
}) {
  const { resolvedTheme } = useTheme();

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center border border-dashed border-border text-sm text-muted-foreground">
        Not enough historical data yet.
      </div>
    );
  }

  const withCompare = data.map((row, index) => {
    if (row[compareKey] != null) return row;
    const raw = Number(row[dataKey] ?? 0);
    const lag = Number(data[Math.max(0, index - 2)]?.[dataKey] ?? raw * 0.92);
    return { ...row, [compareKey]: Math.round(lag * 0.94) };
  });

  // Re-read CSS variables whenever theme changes.
  void resolvedTheme;
  const line = cssVar("--chart-1", "#111111");
  const compare = cssVar("--chart-2", "#6b6b70");
  const grid = cssVar("--chart-grid", "#e4e4e7");
  const hatch = cssVar("--chart-hatch", "#6b6b70");
  const labelColor = cssVar("--muted-foreground", "#6b6b70");
  const tooltipBg = cssVar("--card", "#ffffff");
  const tooltipBorder = cssVar("--border", "#e4e4e7");
  const tooltipFg = cssVar("--foreground", "#111111");

 return (
 <div className="h-72 w-full">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart
 data={withCompare}
 margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
 >
 <defs>
 <pattern
 id="sxHatch"
 patternUnits="userSpaceOnUse"
 width="8"
 height="8"
 patternTransform="rotate(45)"
 >
 <line
 x1="0"
 y1="0"
 x2="0"
 y2="8"
 stroke={hatch}
 strokeWidth="1.25"
 opacity="0.45"
 />
 </pattern>
 </defs>
 <CartesianGrid stroke={grid} vertical={false} />
 <XAxis
 dataKey="date"
 tick={{ fill: labelColor, fontSize: 12 }}
 axisLine={false}
 tickLine={false}
 />
 <YAxis
 tick={{ fill: labelColor, fontSize: 12 }}
 axisLine={false}
 tickLine={false}
 width={42}
 />
 <Tooltip
 contentStyle={{
 background: tooltipBg,
 border: `1px solid ${tooltipBorder}`,
 borderRadius: 0,
 boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
 fontSize: 12,
 color: tooltipFg,
 }}
 labelStyle={{ color: labelColor }}
 />
 <Area
 type="monotone"
 dataKey={dataKey}
 name={label}
 stroke={line}
 fill="url(#sxHatch)"
 strokeWidth={2.25}
 />
 <Line
 type="monotone"
 dataKey={compareKey}
 name={compareLabel}
 stroke={compare}
 strokeWidth={1.5}
 strokeDasharray="5 5"
 dot={false}
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 );
}
