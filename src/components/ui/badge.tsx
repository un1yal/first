import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-normal transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-[rgba(255,255,255,0.05)] text-foreground",
        outline: "border-border text-muted-foreground",
        success: "border-border bg-[rgba(255,255,255,0.06)] text-foreground",
        warning: "border-border bg-[rgba(255,255,255,0.04)] text-muted-foreground",
        muted: "border-transparent bg-[rgba(255,255,255,0.03)] text-[#5a5a5a]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
