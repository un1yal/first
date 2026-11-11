"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function TrendChart({
  data,
  dataKey = "value",
  label = "Value",
}: {
  data: Array<Record<string, string | number>>;
  dataKey?: string;
  label?: string;
}) {
  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
        Not enough historical data yet.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sxMonoFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ededed" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#ededed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#5a5a5a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#5a5a5a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "#131313",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
              fontSize: 12,
              color: "#ededed",
            }}
            labelStyle={{ color: "#8a8a8a" }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            name={label}
            stroke="#ededed"
            fill="url(#sxMonoFill)"
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
