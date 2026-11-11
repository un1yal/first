import { cn, formatNumber } from "@/lib/utils";

export function Metric({
 label,
 value,
 hint,
 trend,
 icon,
 className,
}: {
 label: string;
 value: number | string | null | undefined;
 hint?: string;
 trend?: "up" | "down" | "neutral";
 icon?: React.ReactNode;
 className?: string;
}) {
 const display =
 typeof value === "number" ? formatNumber(value) : value ?? "Unavailable";

 return (
 <div
 className={cn(
 "border border-border bg-card p-5 sm:p-6",
 className,
 )}
 >
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0 flex-1">
 <p className="text-sm text-muted-foreground">{label}</p>
 <p className="mt-3 text-3xl font-medium tracking-tight tabular-nums text-foreground">
 {display}
 </p>
 {hint ? (
 <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
 ) : null}
 </div>
 {icon ? (
 <div className="nested-tile flex h-12 w-12 shrink-0 items-center justify-center text-muted-foreground">
 {icon}
 </div>
 ) : trend ? (
 <span
 className={cn(
 "mt-1 h-1.5 w-1.5",
 trend === "up" && "bg-foreground",
 trend === "down" && "bg-destructive",
 trend === "neutral" && "bg-muted-foreground",
 )}
 />
 ) : null}
 </div>
 </div>
 );
}
