import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { VisitorTracker } from "@/components/analytics/visitor-tracker";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StatisticX — Creator Analytics & Marketplace",
    template: "%s · StatisticX",
  },
  description:
    "Discover creators. Measure influence. Find your next promotion. X creator analytics, discovery, and advertising marketplace.",
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (systemDark ? 'dark' : 'light');
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans">
        <AppProviders>
          <VisitorTracker />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
