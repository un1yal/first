import { cn } from "@/lib/utils";

/** Minimal geometric StatisticX mark — monochrome bar mark. */
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
      className={cn("h-7 w-7", className)}
      aria-hidden="true"
    >
      <rect x="3" y="18" width="5" height="11" rx="1.5" fill="currentColor" />
      <rect x="11" y="11" width="5" height="18" rx="1.5" fill="currentColor" />
      <rect x="19" y="6" width="5" height="23" rx="1.5" fill="currentColor" />
      <rect x="27" y="14" width="2.5" height="15" rx="1.25" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function StatisticXWordmark({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-foreground", className)}>
      <StatisticXMark className={markClassName} />
      <span className="text-[15px] font-semibold tracking-tight">StatisticX</span>
    </span>
  );
}
