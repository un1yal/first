"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
}: {
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("h-9 w-9", className)}
      aria-label="Toggle light and dark mode"
      onClick={() =>
        setTheme(resolvedTheme === "light" ? "dark" : "light")
      }
    >
      <Sun className="hidden h-4 w-4 dark:block" strokeWidth={1.6} />
      <Moon className="block h-4 w-4 dark:hidden" strokeWidth={1.6} />
    </Button>
  );
}
