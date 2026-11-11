import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
 "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
 {
 variants: {
 variant: {
 default:
 "border border-border bg-button text-foreground hover:bg-button-hover",
 secondary:
 "border border-border bg-card text-foreground hover:bg-hover",
 outline:
 "border border-border bg-transparent text-foreground hover:bg-hover",
 ghost:
 "text-muted-foreground hover:bg-hover hover:text-foreground",
 destructive:
 "bg-destructive/15 text-destructive hover:bg-destructive/25",
 link: "text-foreground underline-offset-4 hover:underline",
 accent:
 "border border-border bg-button text-foreground hover:bg-button-hover",
 glass:
 "border border-border bg-button text-foreground hover:bg-button-hover",
 },
 size: {
 default: "h-10 px-4 py-2",
 sm: "h-9 px-3.5 text-xs",
 lg: "h-11 px-6 text-[15px]",
 icon: "h-10 w-10",
 },
 },
 defaultVariants: {
 variant: "default",
 size: "default",
 },
 },
);

export interface ButtonProps
 extends React.ButtonHTMLAttributes<HTMLButtonElement>,
 VariantProps<typeof buttonVariants> {
 asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, variant, size, asChild = false, ...props }, ref) => {
 const Comp = asChild ? Slot : "button";
 return (
 <Comp
 className={cn(buttonVariants({ variant, size, className }))}
 ref={ref}
 {...props}
 />
 );
 },
);
Button.displayName = "Button";
