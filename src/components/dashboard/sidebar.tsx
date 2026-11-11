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
  PanelLeftClose,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
        "corner-brackets flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-light text-muted-foreground transition-colors hover:text-foreground",
        active && "is-active bg-[rgba(255,255,255,0.04)] text-foreground",
      )}
    >
      <Icon className="h-4 w-4 stroke-[1.5]" />
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
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-border bg-sidebar px-3 py-4">
      <div className="mb-5 flex items-center justify-between px-2">
        <Link href="/" aria-label="StatisticX home">
          <StatisticXWordmark />
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/search"
            className="corner-brackets flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4 stroke-[1.5]" />
          </Link>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5a5a5a]"
            aria-hidden
          >
            <PanelLeftClose className="h-4 w-4 stroke-[1.5]" />
          </span>
        </div>
      </div>

      <Link
        href="/onboarding"
        className="corner-brackets is-active mb-6 mx-1 flex h-11 items-center justify-between rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-3.5 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        <span className="inline-flex items-center gap-2.5 font-light">
          <Plus className="h-4 w-4 stroke-[1.5]" />
          New claim
        </span>
        <span className="kbd-chip">⌘N</span>
      </Link>

      <nav className="flex-1 space-y-7 overflow-y-auto px-1">
        <div>
          <p className="mb-3 px-3 text-[12px] font-light text-[#5a5a5a]">
            Platform
          </p>
          <div className="space-y-1.5">
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
          <p className="mb-3 px-3 text-[12px] font-light text-[#5a5a5a]">
            Tools
          </p>
          <div className="space-y-1.5">
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
        <button
          type="button"
          className="corner-brackets flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => void signOut()}
        >
          <LogOut className="h-4 w-4 stroke-[1.5]" />
          Log out
        </button>
      </div>
    </aside>
  );
}
