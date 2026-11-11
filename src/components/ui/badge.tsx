import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
 "inline-flex items-center border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
 {
 variants: {
 variant: {
 default: "border-border bg-button text-foreground",
 outline: "border-border text-muted-foreground",
 success: "border-border bg-button text-foreground",
 warning: "border-border bg-hover text-muted-foreground",
 muted: "border-transparent bg-nested text-muted-foreground",
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
