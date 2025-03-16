import LoanDetails from "@/components/loan-details/loan-details";
import { LoanDetailsSkeleton } from "@/components/loan-details/skeletons/loan-details-skeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Loan Details</h1>
      <Suspense fallback={<LoanDetailsSkeleton />}>
        <LoanDetails />
      </Suspense>
    </div>
  );
}
