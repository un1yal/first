"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
  Search,
  Plus,
  ChevronRight,
  Folder,
  Plug,
  Trophy,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatisticXWorkspacePill } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const discoverLinks = [
  { href: "/search", label: "Search", icon: Search, chip: "/" },
  { href: "/leaderboards/engagement", label: "Leaderboards", icon: Trophy },
  { href: "/discover", label: "Reports", icon: FileText },
];

const primaryLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/posts", label: "Creators", icon: UserRound },
  { href: "/dashboard/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/dashboard/flex-cards", label: "Integrations", icon: Plug },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const collections = [
  { label: "Company contracts", color: "#5B8DEF" },
  { label: "Onboarding templates", color: "#9A9A9E" },
  { label: "Extra fees / legal", color: "#E8C547" },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  chip,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  active: boolean;
  chip?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-[#242426] hover:text-foreground",
        active && "border border-border bg-[#242426] text-foreground",
      )}
    >
      <Icon className="h-4 w-4 stroke-[1.6]" />
      <span className="flex-1">{label}</span>
      {chip ? <span className="kbd-chip">{chip}</span> : null}
    </Link>
  );
}

export function DashboardSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showPromo, setShowPromo] = useState(true);

  async function signOut() {
    await fetch("/api/auth/signout", {
      method: "POST",
      credentials: "include",
    });
    router.refresh();
    router.push("/");
  }

  function isActive(href: string) {
    return (
      pathname === href ||
      (href !== "/dashboard" && pathname.startsWith(href))
    );
  }

  return (
    <aside className="flex h-full w-[272px] shrink-0 flex-col border-r border-border bg-sidebar px-3 py-4">
      <div className="px-1 pb-4">
        <StatisticXWorkspacePill />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-1">
        <div className="space-y-1 pb-3">
          {discoverLinks.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              active={isActive(link.href)}
            />
          ))}
        </div>

        <div className="my-2 border-t border-border" />

        <div className="space-y-1 py-2">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              active={isActive(link.href)}
            />
          ))}
          <NavLink
            href="/dashboard/growth"
            label="Growth"
            icon={LineChart}
            active={isActive("/dashboard/growth")}
          />
          <NavLink
            href="/dashboard/profile"
            label="Public profile"
            icon={ImageIcon}
            active={isActive("/dashboard/profile")}
          />
          {isAdmin ? (
            <NavLink
              href="/admin"
              label="Admin"
              icon={Shield}
              active={pathname.startsWith("/admin")}
            />
          ) : null}
        </div>

        <div className="my-2 border-t border-border" />

        <div className="space-y-1 py-2">
          {collections.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-[#242426] hover:text-foreground"
            >
              <Folder
                className="h-4 w-4"
                strokeWidth={1.6}
                style={{ color: item.color }}
              />
              <span className="flex-1 truncate">{item.label}</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </button>
          ))}
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-[#242426] hover:text-foreground"
          >
            <Plus className="h-4 w-4 stroke-[1.6]" />
            Create list
          </button>
        </div>
      </nav>

      {showPromo ? (
        <div className="mx-1 mb-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="nested-tile flex h-8 w-8 items-center justify-center text-sm text-foreground">
              ✦
            </div>
            <button
              type="button"
              aria-label="Dismiss upgrade promo"
              className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPromo(false)}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">
            Upgrade to Premium!
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Unlock deeper analytics windows, more Flex Cards, and priority sync.
          </p>
          <Button className="mt-4 w-full" size="sm">
            Upgrade Now
          </Button>
        </div>
      ) : null}

      <div className="border-t border-border px-1 pt-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-[#242426] hover:text-foreground"
          onClick={() => void signOut()}
        >
          <LogOut className="h-4 w-4 stroke-[1.6]" />
          Log out
        </button>
      </div>
    </aside>
  );
}
