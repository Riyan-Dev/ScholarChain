"use client";

import { useState, useEffect } from "react";
import { Loan } from "@/lib/types";
import { LoanDetailsSkeleton } from "./skeletons/loan-details-skeleton";
import { LoanSummaryCard } from "./loan-summary-card";
import { LoanProgress } from "./loan-progress";
import { LoanTimeline } from "./loan-timeline";
import { InstallmentTable } from "./installment-table";
import { getLoanData } from "@/services/loan.services";

export default function LoanDetails() {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // In a real app, you might get the loan ID from the URL or context

    const fetchLoan = async () => {
      try {
        setIsLoading(true);
        const data = await getLoanData();
        setLoan(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch loan data")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoan();
  }, []);

  if (isLoading) return <LoanDetailsSkeleton />;

  if (error)
    return (
      <div className="text-red-500">
        Error loading loan details: {error.message}
      </div>
    );

  if (!loan) return <div className="text-red-500">No loan data found</div>;

  return (
    <div className="space-y-8">
      <LoanSummaryCard loan={loan} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <LoanProgress loan={loan} />
        <LoanTimeline loan={loan} />
      </div>

      <InstallmentTable installments={loan.installments} />
    </div>
  );
}
