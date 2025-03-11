"use client";
import { Calendar, CreditCard, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import List01 from "./list-01";
import List02 from "./list-02";
import { LoanApplicationFlow } from "../dash-application/loan-application-flow";
import { fetchDash } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { TransactionsCard } from "../crpto-dash/transactions-card";
import { WalletCard } from "../crpto-dash/wallet-card";

export default function Content() {
  // Get data, error, loading states DIRECTLY from useQuery
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["dashboardData"], // Good, unique key
    queryFn: fetchDash,
    refetchOnWindowFocus: false,
    staleTime: 0, // Or whatever staleTime is appropriate
  });

  const handleViewAllTransactions = () => {
    // This would typically navigate to a transactions page
    console.log("View all transactions");
  };

  // Handle loading state
  if (isLoading || isFetching) {
    return (
      <div className="space-y-4 p-4">
        <div className="w-full">
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="-mx-2 flex flex-wrap">
          <div className="mb-4 w-full px-2 sm:mb-0 sm:w-1/2">
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="w-full px-2 sm:w-1/2">
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // ONLY render the UI when data is available (and not loading/error)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <WalletCard data={data.wallet_data} onBuyToken={() => {}} />
        <TransactionsCard
          transactions={data.wallet_data.transactions}
          onViewAll={handleViewAllTransactions}
        />
      </div>
      <div className="w-full">
        {/* Correct conditional rendering: */}
        {data && (
          <LoanApplicationFlow
            stage={data.application_stage}
            isUploaded={data.is_uploaded}
            application_id={data.app_id}
            loan={data.loan}
          />
        )}
      </div>
      {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 dark:border-[#1F1F23] dark:bg-[#0F0F12]">
          <h2 className="mb-4 flex items-center gap-2 text-left text-lg font-bold text-gray-900 dark:text-white">
            <Wallet className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-50" />
            Accounts
          </h2>
          <div className="flex-1">
            <List01 className="h-full" />
          </div>
        </div>
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 dark:border-[#1F1F23] dark:bg-[#0F0F12]">
          <h2 className="mb-4 flex items-center gap-2 text-left text-lg font-bold text-gray-900 dark:text-white">
            <CreditCard className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-50" />
            Recent Transactions
          </h2>
          <div className="flex-1">
            <List02 className="h-full" />
          </div>
        </div>
      </div> */}

      {/* <div className="flex flex-col items-start justify-start rounded-xl border border-gray-200 bg-white p-6 dark:border-[#1F1F23] dark:bg-[#0F0F12]">
        <h2 className="mb-4 flex items-center gap-2 text-left text-lg font-bold text-gray-900 dark:text-white">
          <Calendar className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-50" />
          Upcoming Events
        </h2>
        <List03 />
      </div> */}
    </div>
  );
}
