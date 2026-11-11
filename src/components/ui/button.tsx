import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "corner-brackets inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-normal transition-colors disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "rounded-xl bg-[#ededed] text-[#0b0b0b] hover:bg-white",
        secondary:
          "rounded-xl border border-border bg-[rgba(255,255,255,0.04)] text-foreground hover:bg-[rgba(255,255,255,0.07)]",
        outline:
          "rounded-xl border border-border bg-transparent text-foreground hover:bg-[rgba(255,255,255,0.04)]",
        ghost:
          "rounded-xl text-muted-foreground hover:bg-[rgba(255,255,255,0.04)] hover:text-foreground",
        destructive:
          "rounded-xl bg-destructive/15 text-destructive hover:bg-destructive/25",
        link: "text-foreground underline-offset-4 hover:underline",
        accent:
          "rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-foreground hover:bg-[rgba(255,255,255,0.08)]",
        glass:
          "rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.07)]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-12 rounded-xl px-7 text-[15px]",
        icon: "h-10 w-10 rounded-xl",
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
