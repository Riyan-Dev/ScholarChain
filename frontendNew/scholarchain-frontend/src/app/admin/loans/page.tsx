"use client";

import { DashboardHeader } from "@/components/admin/dashboard-header";
import DashboardShell from "@/components/admin/dashboard-shell";
import { LoanStatusFilter } from "@/components/admin/loan-status-filter";
import { LoansTable } from "@/components/admin/loans-table";
import { Loan } from "@/lib/types";
import { getAllLoans } from "@/services/loan.services";
import { useEffect, useState } from "react";

export default function LoansPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _dashData = await getAllLoans();
        setLoans(_dashData);
        setFilteredLoans(_dashData);
      } catch (error) {
        console.error("Error while fetching admin dashboard:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const _filteredLoans =
      statusFilter == "all"
        ? loans
        : loans.filter((loan) => loan.status === statusFilter);
    setFilteredLoans(_filteredLoans);
  }, [statusFilter]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Loans Management"
        text="View and manage all loans in the system."
      />
      <div className="mb-4">
        <LoanStatusFilter
          filterStatus={statusFilter}
          setFilterStatus={setStatusFilter}
        />
      </div>
      <LoansTable loans={filteredLoans} />
    </DashboardShell>
  );
}
