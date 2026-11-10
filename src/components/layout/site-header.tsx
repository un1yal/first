import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-brand text-sm tracking-[0.18em]">
          AnalyticX
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/discover">Discover</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/marketplace">Marketplace</Link>
          </Button>
          {isAuthenticated ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
