import { DashboardHeader } from "@/components/admin/dashboard-header";
import DashboardShell from "@/components/admin/dashboard-shell";
import { LoanStatusFilter } from "@/components/admin/loan-status-filter";
import { LoansTable } from "@/components/admin/loans-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loans",
  description: "Manage all student loans in the system",
};

export default function LoansPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Loans Management"
        text="View and manage all loans in the system."
      />
      <div className="mb-4">
        <LoanStatusFilter />
      </div>
      <LoansTable />
    </DashboardShell>
  );
}
