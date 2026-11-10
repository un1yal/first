"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          className: "border border-border bg-card text-foreground",
        }}
      />
    </ThemeProvider>
  );
}
