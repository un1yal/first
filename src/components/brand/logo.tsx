import { cn } from "@/lib/utils";

/** Minimal geometric StatisticX mark — monochrome bars. */
export function StatisticXMark({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
      aria-hidden="true"
    >
      <rect x="4" y="18" width="4" height="10" rx="0.5" fill="currentColor" />
      <rect x="11" y="12" width="4" height="16" rx="0.5" fill="currentColor" />
      <rect x="18" y="6" width="4" height="22" rx="0.5" fill="currentColor" />
      <rect
        x="25"
        y="14"
        width="3"
        height="14"
        rx="0.5"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

export function StatisticXWordmark({
  className,
  markClassName,
  showMark = true,
}: {
  className?: string;
  markClassName?: string;
  showMark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-foreground", className)}>
      {showMark ? <StatisticXMark className={markClassName} /> : null}
      <span className="font-display text-[13px] tracking-[0.22em]">StatisticX</span>
    </span>
  );
}
