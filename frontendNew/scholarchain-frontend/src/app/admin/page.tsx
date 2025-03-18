import { DashboardHeader } from "@/components/admin/dashboard-header";
import DashboardShell from "@/components/admin/dashboard-shell";
import { FundDistribution } from "@/components/admin/fund-distribution";
import { KeyMetrics } from "@/components/admin/key-metrics";
import { MonthlyTrends } from "@/components/admin/monthly-trends";
import { PendingApplications } from "@/components/admin/pending-applications";
import { UpcomingRepayments } from "@/components/admin/upcoming-repayments";
import { RecentTransactions } from "@/components/admin/recent-transactions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Student Loan Management System Dashboard",
};

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Overview of your student loan management system."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KeyMetrics />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <MonthlyTrends />
        </div>
        <div className="col-span-3">
          <FundDistribution />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentTransactions />
        </div>
        <div className="col-span-3">
          <div className="grid gap-4">
            <UpcomingRepayments />
            <PendingApplications />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
