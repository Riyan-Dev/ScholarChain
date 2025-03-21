"use client";

import { DashboardHeader } from "@/components/admin/dashboard-header";
import DashboardShell from "@/components/admin/dashboard-shell";
import { FundDistribution } from "@/components/admin/fund-distribution";
import { KeyMetrics } from "@/components/admin/key-metrics";
import { MonthlyTrends } from "@/components/admin/monthly-trends";
import { PendingApplicationsComponent } from "@/components/admin/pending-applications";
import { UpcomingRepaymentsComponent } from "@/components/admin/upcoming-repayments";
import { RecentTransactionsComponent } from "@/components/admin/recent-transactions";
import { getAdminDash, AdminDash } from "@/services/admin.service";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [adminDashData, setAdminDashData] = useState<AdminDash | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAdminDash();
        setAdminDashData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
        console.error("Error fetching admin dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading={<Skeleton className="h-6 w-32" />}
          text={<Skeleton className="h-4 w-64" />}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Key Metrics Skeletons */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="mt-2 h-4 w-16" />
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            {/* Monthly Trends Skeleton */}
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="col-span-3">
            {/* Fund Distribution Skeleton */}
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            {/* Recent Transactions Skeleton */}
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="col-span-3">
            <div className="grid gap-4">
              {/* Upcoming Repayments Skeleton */}
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="h-[150px] w-full" />

              {/* Pending Applications Skeleton */}
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="h-[150px] w-full" />
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <div>Error: {error}</div>
      </DashboardShell>
    );
  }

  if (!adminDashData) {
    return (
      <DashboardShell>
        <div>No data available.</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Overview of your student loan management system."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KeyMetrics
          totalDonations={adminDashData.total_donations}
          availableFunds={adminDashData.available_funds}
          activeLoans={adminDashData.active_loans}
          totalApplications={adminDashData.total_applications}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <MonthlyTrends
            monthlyTransactions={adminDashData.monthly_transactions}
          />
        </div>
        <div className="col-span-3">
          <FundDistribution
            applicationCount={adminDashData.application_count}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentTransactionsComponent
            transactions={adminDashData.transactions}
          />
        </div>
        <div className="col-span-3">
          <div className="grid gap-4">
            <UpcomingRepaymentsComponent
              upcomingRepayments={adminDashData.upcoming_repayments}
            />
            <PendingApplicationsComponent
              pendingApplications={adminDashData.pending_application}
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
