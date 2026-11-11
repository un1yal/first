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
        "corner-brackets rounded-xl border border-border bg-card p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        {trend ? (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              trend === "up" && "bg-[#ededed]",
              trend === "down" && "bg-destructive",
              trend === "neutral" && "bg-[#5a5a5a]",
            )}
          />
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-light tracking-tight tabular-nums text-foreground">
        {display}
      </p>
      {hint ? <p className="mt-2 text-xs text-[#5a5a5a]">{hint}</p> : null}
    </div>
  );
}
