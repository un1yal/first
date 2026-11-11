import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";

/** Simple monochrome crescent mark, Lunor-style. */
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
 className={cn("h-5 w-5", className)}
 aria-hidden="true"
 >
 <path
 d="M20.5 6.2A11 11 0 1 0 25.8 20.5 9 9 0 0 1 20.5 6.2Z"
 fill="currentColor"
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
 <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
 {showMark ? <StatisticXMark className={markClassName} /> : null}
 <span className="font-brand text-[15px] font-medium">StatisticX</span>
 </span>
 );
}

/** Workspace-switcher style pill used at the top of the app sidebar. */
export function StatisticXWorkspacePill({
 className,
 href = "/",
}: {
 className?: string;
 href?: string;
}) {
 const Comp = href ? "a" : "div";
 return (
 <Comp
 {...(href ? { href } : {})}
 className={cn(
 "flex h-11 items-center justify-between gap-2 border border-border bg-card px-3 text-foreground transition-colors hover:bg-hover",
 className,
 )}
 aria-label="StatisticX workspace"
 >
 <span className="inline-flex items-center gap-2.5">
 <span className="flex h-6 w-6 items-center justify-center bg-nested">
 <StatisticXMark className="h-3.5 w-3.5" />
 </span>
 <span className="font-brand text-sm font-medium">StatisticX</span>
 </span>
 <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
 </Comp>
 );
}
