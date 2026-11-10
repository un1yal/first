import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Badge } from "@/components/ui/badge";
import { isDemoMode } from "@/lib/data/mode";

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
        <div className="flex h-14 items-center justify-between border-b border-border px-4 md:hidden">
          <span className="font-brand text-sm tracking-[0.18em]">AnalyticX</span>
          {demo ? <Badge variant="warning">Demo</Badge> : null}
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
