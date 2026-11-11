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
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
        Not enough historical data yet.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sxFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8F169" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#C8F169" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#ECECE8" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#6B6B6B", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6B6B6B", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #E8E8E3",
              borderRadius: 14,
              boxShadow: "0 8px 30px rgba(17,17,17,0.06)",
              fontSize: 12,
            }}
            labelStyle={{ color: "#6B6B6B" }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            name={label}
            stroke="#111111"
            fill="url(#sxFill)"
            strokeWidth={1.75}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
