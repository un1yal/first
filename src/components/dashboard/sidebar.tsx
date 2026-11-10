"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  LineChart,
  Settings,
  ShoppingBag,
  ImageIcon,
  UserRound,
  Shield,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/posts", label: "Posts", icon: FileText },
  { href: "/dashboard/growth", label: "Growth", icon: LineChart },
  { href: "/dashboard/flex-cards", label: "Flex Cards", icon: ImageIcon },
  { href: "/dashboard/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/dashboard/profile", label: "Public Profile", icon: UserRound },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center border-b border-border px-5">
        <Link href="/" className="font-brand text-sm tracking-[0.18em]">
          AnalyticX
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                active && "bg-accent text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
        {isAdmin ? (
          <Link
            href="/admin"
            className={cn(
              "mt-3 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              pathname.startsWith("/admin") && "bg-accent text-foreground",
            )}
          >
            <Shield className="h-4 w-4" />
            Admin
          </Link>
        ) : null}
      </nav>
      <div className="border-t border-border p-3">
        <Button asChild variant="ghost" className="w-full justify-start gap-2">
          <Link href="/api/auth/signout">
            <LogOut className="h-4 w-4" />
            Log out
          </Link>
        </Button>
      </div>
    </aside>
  );
}
