import { DashboardNav } from "@/components/admin/dashboard-nav";
import { MainNav } from "@/components/admin/main-nav";
import { UserNav } from "@/components/donor-dash/user-nav";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid flex-1 md:grid-cols-[1fr]">
        <main className="flex flex-1 flex-col p-6">{children}</main>
      </div>
    </div>
  );
}
