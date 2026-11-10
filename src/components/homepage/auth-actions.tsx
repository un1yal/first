import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomepageAuthActions({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  if (isAuthenticated) {
    return (
      <div className="flex justify-center gap-3">
        <Button asChild className="min-w-28">
          <Link href="/dashboard">Open dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-3">
      <Button asChild variant="outline" className="min-w-28">
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild className="min-w-28">
        <Link href="/signup">Sign Up</Link>
      </Button>
    </div>
  );
}
