import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { VisitorTracker } from "@/components/analytics/visitor-tracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AnalyticX — Creator Analytics & Marketplace",
    template: "%s · AnalyticX",
  },
  description:
    "Discover creators. Measure influence. Find your next promotion. X creator analytics, discovery, and advertising marketplace.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <AppProviders>
          <div className="noise-overlay" aria-hidden="true" />
          <VisitorTracker />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
