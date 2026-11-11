import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomepageAuthActions({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  if (isAuthenticated) {
    return (
      <div className="flex w-full justify-center gap-3">
        <Button asChild className="min-w-32">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center gap-3">
      <Button asChild variant="outline" className="min-w-28">
        <Link href="/login">Log in</Link>
      </Button>
      <Button asChild className="min-w-28">
        <Link href="/signup">Sign up</Link>
      </Button>
    </div>
  );
}
