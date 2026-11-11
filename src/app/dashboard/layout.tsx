import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Badge } from "@/components/ui/badge";
import { isDemoMode } from "@/lib/data/mode";
import { StatisticXWordmark } from "@/components/brand/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demo = isDemoMode();

  return (
    <div className="flex min-h-dvh bg-background">
      <div className="hidden md:block">
        <DashboardSidebar isAdmin={demo} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 items-center justify-between border-b border-border px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <StatisticXWordmark markClassName="h-5 w-5" />
            </div>
            <p className="text-sm font-light italic text-muted-foreground">
              Home
            </p>
          </div>
          {demo ? <Badge variant="warning">Demo</Badge> : null}
        </div>
        <div className="flex-1 overflow-auto p-5 sm:p-8 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
