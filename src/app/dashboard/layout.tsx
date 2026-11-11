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
        <div className="flex h-16 items-center justify-between border-b border-border px-4 md:hidden">
          <StatisticXWordmark markClassName="h-6 w-6" />
          {demo ? <Badge variant="warning">Demo</Badge> : null}
        </div>
        <div className="flex-1 overflow-auto p-5 sm:p-8 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
