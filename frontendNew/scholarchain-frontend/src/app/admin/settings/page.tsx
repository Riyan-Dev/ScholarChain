import { BlockchainSettings } from "@/components/admin/blockchain-settings";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import DashboardShell from "@/components/admin/dashboard-shell";
import { NotificationSettings } from "@/components/admin/notification-settings";
import { SystemSettings } from "@/components/admin/system-settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure system settings",
};

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="System Settings"
        text="Configure and customize the loan management system."
      />
      <div className="grid gap-6">
        <SystemSettings />
        <NotificationSettings />
        <BlockchainSettings />
      </div>
    </DashboardShell>
  );
}
