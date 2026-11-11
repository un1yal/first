import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
 HTMLInputElement,
 React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
 return (
 <input
 type={type}
 className={cn(
 "flex h-11 w-full border border-border bg-muted px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
 className,
 )}
 ref={ref}
 {...props}
 />
 );
});
Input.displayName = "Input";
