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
          "rounded-xl border border-[#2a2a2d] bg-[#2a2a2d] text-foreground hover:bg-[#323236]",
        secondary:
          "rounded-xl border border-border bg-[#202022] text-foreground hover:bg-[#242426]",
        outline:
          "rounded-xl border border-border bg-transparent text-foreground hover:bg-[#202022]",
        ghost:
          "rounded-xl text-muted-foreground hover:bg-[#202022] hover:text-foreground",
        destructive:
          "rounded-xl bg-destructive/15 text-destructive hover:bg-destructive/25",
        link: "text-foreground underline-offset-4 hover:underline",
        accent:
          "rounded-xl border border-border bg-[#2a2a2d] text-foreground hover:bg-[#323236]",
        glass:
          "rounded-xl border border-border bg-[#2a2a2d] text-foreground hover:bg-[#323236]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-xl px-3.5 text-xs",
        lg: "h-11 rounded-xl px-6 text-[15px]",
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
