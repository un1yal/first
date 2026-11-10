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
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="axFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#282828" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#a3a3a3", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#a3a3a3", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "#111",
              border: "1px solid #282828",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#a3a3a3" }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            name={label}
            stroke="#ffffff"
            fill="url(#axFill)"
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
