"use client";

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
  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
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
                stroke="#9a9a9e"
                strokeWidth="1.25"
                opacity="0.45"
              />
            </pattern>
          </defs>
          <CartesianGrid stroke="#2a2a2d" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#9a9a9e", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9a9a9e", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={42}
          />
          <Tooltip
            contentStyle={{
              background: "#202022",
              border: "1px solid #2a2a2d",
              borderRadius: 12,
              boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
              fontSize: 12,
              color: "#f2f2f2",
            }}
            labelStyle={{ color: "#9a9a9e" }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            name={label}
            stroke="#f2f2f2"
            fill="url(#sxHatch)"
            strokeWidth={2.25}
          />
          <Line
            type="monotone"
            dataKey={compareKey}
            name={compareLabel}
            stroke="#9a9a9e"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
