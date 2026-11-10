import { cn, formatNumber } from "@/lib/utils";

export function Metric({
  label,
  value,
  hint,
  trend,
  className,
}: {
  label: string;
  value: number | string | null | undefined;
  hint?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}) {
  const display =
    typeof value === "number" ? formatNumber(value) : value ?? "Unavailable";

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {trend ? (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              trend === "up" && "bg-success",
              trend === "down" && "bg-destructive",
              trend === "neutral" && "bg-muted-foreground",
            )}
          />
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{display}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
