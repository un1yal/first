"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatisticXWordmark } from "@/components/brand/logo";

const primaryLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/posts", label: "Posts", icon: FileText },
  { href: "/dashboard/growth", label: "Growth", icon: LineChart },
];

const toolsLinks = [
  { href: "/dashboard/flex-cards", label: "Flex Cards", icon: ImageIcon },
  { href: "/dashboard/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/dashboard/profile", label: "Public Profile", icon: UserRound },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground",
        active && "bg-[var(--sidebar-active)] font-medium text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export function DashboardSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

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
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-sidebar px-3 py-4">
      <div className="px-3 pb-5">
        <Link href="/" aria-label="StatisticX home">
          <StatisticXWordmark />
        </Link>
      </div>

      <Link
        href="/search"
        className="mx-1 mb-5 flex h-11 items-center gap-2 rounded-full border border-border bg-background px-3.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/50"
      >
        <Search className="h-4 w-4" />
        Search creators…
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-1">
        <div>
          <p className="mb-2 px-3.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Platform
          </p>
          <div className="space-y-1">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                active={isActive(link.href)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 px-3.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Tools
          </p>
          <div className="space-y-1">
            {toolsLinks.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                active={isActive(link.href)}
              />
            ))}
            {isAdmin ? (
              <NavLink
                href="/admin"
                label="Admin"
                icon={Shield}
                active={pathname.startsWith("/admin")}
              />
            ) : null}
          </div>
        </div>
      </nav>

      <div className="mt-4 border-t border-border px-1 pt-3">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => void signOut()}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
