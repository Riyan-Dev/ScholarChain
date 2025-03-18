import { DashboardHeader } from "@/components/admin/dashboard-header";
import DashboardShell from "@/components/admin/dashboard-shell";
import { UserFilter } from "@/components/admin/user-filter";
import { UsersTable } from "@/components/admin/users-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage system users",
};

export default function UsersPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="User Management"
        text="Manage donors, borrowers, and administrators."
      />
      <div className="mb-4">
        <UserFilter />
      </div>
      <UsersTable />
    </DashboardShell>
  );
}
