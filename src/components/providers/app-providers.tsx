"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import { ThemeProvider } from "./theme-provider";

function ThemedToaster() {
 const { resolvedTheme } = useTheme();
 return (
 <Toaster
 theme={resolvedTheme === "light" ? "light" : "dark"}
 position="bottom-right"
 toastOptions={{
 className: "border border-border bg-card text-foreground",
 }}
 />
 );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
 return (
 <ThemeProvider>
 {children}
 <ThemedToaster />
 </ThemeProvider>
 );
}
