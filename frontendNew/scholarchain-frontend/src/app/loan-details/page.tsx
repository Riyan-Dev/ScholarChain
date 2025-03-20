import LoanDetails from "@/components/loan-details/loan-details";
import { LoanDetailsSkeleton } from "@/components/loan-details/skeletons/loan-details-skeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold p-2 md:p-10">Loan Details</h1>
      <Suspense fallback={<LoanDetailsSkeleton />}>
        <LoanDetails />
      </Suspense>
    </div>
  );
}
