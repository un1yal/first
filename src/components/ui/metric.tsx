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
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        {trend ? (
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              trend === "up" && "bg-success",
              trend === "down" && "bg-destructive",
              trend === "neutral" && "bg-muted-foreground",
            )}
          />
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
        {display}
      </p>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
