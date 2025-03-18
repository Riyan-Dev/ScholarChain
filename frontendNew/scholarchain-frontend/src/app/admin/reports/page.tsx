import { DashboardHeader } from "@/components/admin/dashboard-header";
import DashboardShell from "@/components/admin/dashboard-shell";
import { ReportGenerator } from "@/components/admin/report-generator";
import { ReportsList } from "@/components/admin/reports-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description: "Generate and view system reports",
};

export default function ReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Reports"
        text="Generate and download system reports."
      />
      <div className="mb-6">
        <ReportGenerator />
      </div>
      <ReportsList />
    </DashboardShell>
  );
}
