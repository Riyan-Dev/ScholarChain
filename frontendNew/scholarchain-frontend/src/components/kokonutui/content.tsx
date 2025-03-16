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
import { useEffect, useState } from "react";
import { RepaymentData } from "@/app/loan-details/repayment-types";
import { PaymentReviewModal } from "@/app/loan-details/payment-review-modal";
import { PaymentSuccessModal } from "@/app/loan-details/payment-success-modal";
import { fetchRepay } from "@/services/application.service";
import { makeRepayment } from "@/services/loan.services";
import { useRouter } from "next/navigation";

const mockRepaymentData: RepaymentData = {
  _id: "riyan4",
  loanDetails: {
    id: "67cf6594b6e88e5e0c1b221c",
    username: "riyan4",
    loan_amount: 50000,
    contract_address: "",
    loan_amount_repaid: 5126,
    no_of_installments: 24,
    installments_completed: 6,
    total_discounted_amount: null,
    status: "ongoing",
    created_at: "2025-03-10T22:20:04.089000",
    updated_at: "2025-03-11T19:08:28.176000",
  },
  nextInstallment: {
    installment_id: 7,
    installment_date: "2025-05-01T00:00:00",
    installment_paid_date: null,
    installment_status: "pending",
    amount_paid: 0,
    computedDue: 2804.625,
  },
  balance: 20000,
};

export default function Content() {
  const router = useRouter();

  // Get data, error, loading states DIRECTLY from useQuery
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["dashboardData"], // Good, unique key
    queryFn: fetchDash,
    refetchOnWindowFocus: false,
    staleTime: 0, // Or whatever staleTime is appropriate
  });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [repaymentData, setRepaymentData] =
    useState<RepaymentData>(mockRepaymentData);
  const [isLoadingg, setIsLoadingg] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0,
    installmentNumber: 0,
    paymentDate: new Date().toISOString(),
    remainingInstallments: 0,
    totalInstallments: 0,
    nextDueDate: undefined,
  });

  const fetchData = async () => {
    setIsLoadingg(true);

    try {
      const repaymentData = await fetchRepay();

      setRepaymentData(repaymentData);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoadingg(false);
    }
  };

  // Simulate fetching data
  useEffect(() => {
    fetchData();
  }, [isReviewModalOpen]);

  const handleMakePayment = () => {
    setIsReviewModalOpen(true);
  };

  const getNextMonthDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 1);
    return date.toISOString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleConfirmPayment = async () => {
    // This would be your actual payment logic
    // For example, calling a smart contract function
    await makeRepayment();
    return new Promise<void>((resolve) => {
      setIsLoadingg(true);

      // Simulate API call delay
      setTimeout(() => {
        const paymentDate = new Date().toISOString();

        // Update the repayment data after successful payment
        setRepaymentData((prev) => {
          const updatedData = { ...prev };

          // Mark the next installment as paid
          updatedData.nextInstallment = {
            ...updatedData.nextInstallment,
            installment_status: "paid",
            installment_paid_date: paymentDate,
            amount_paid: updatedData.nextInstallment.computedDue,
          };

          // Update loan details
          updatedData.loanDetails = {
            ...updatedData.loanDetails,
            installments_completed:
              updatedData.loanDetails.installments_completed + 1,
            loan_amount_repaid:
              updatedData.loanDetails.loan_amount_repaid +
              updatedData.nextInstallment.computedDue,
          };

          // Deduct the payment from the balance
          updatedData.balance =
            updatedData.balance - updatedData.nextInstallment.computedDue;

          return updatedData;
        });

        // Set payment details for success modal
        setPaymentDetails({
          amount: repaymentData.nextInstallment.computedDue,
          installmentNumber: repaymentData.nextInstallment.installment_id,
          paymentDate: paymentDate,
          remainingInstallments:
            repaymentData.loanDetails.no_of_installments -
            (repaymentData.loanDetails.installments_completed + 1),
          totalInstallments: repaymentData.loanDetails.no_of_installments,
          nextDueDate:
            repaymentData.nextInstallment.installment_id <
            repaymentData.loanDetails.no_of_installments
              ? getNextMonthDate(repaymentData.nextInstallment.installment_date)
              : undefined,
        });

        setIsReviewModalOpen(false);
        setIsLoadingg(false);
        setIsSuccessModalOpen(true);
        resolve();
      }, 2000);
    });
  };

  const handlePurchaseTokens = () => {
    // Close the review modal
    setIsReviewModalOpen(false);

    // Navigate to token purchase page or open token purchase modal
    console.log("Navigating to token purchase page");

    // For demo purposes, let's simulate adding tokens to the wallet
    setTimeout(() => {
      setRepaymentData((prev) => ({
        ...prev,
        balance: prev.balance + 5000,
      }));
    }, 1000);
  };

  const handleViewAllTransactions = () => {
    // This would typically navigate to a transactions page
    console.log("View all transactions");
  };

  // if (isLoadingg) {
  //   return (
  //     <div className="container mx-auto p-4 flex items-center justify-center h-64">
  //       <div className="flex flex-col items-center gap-4">
  //         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  //         <p className="text-muted-foreground">Processing payment...</p>
  //       </div>
  //     </div>
  //   )
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
            handlePayInstallment={handleMakePayment}
          />
        )}
      </div>
      {/* Payment Review Modal */}
      <PaymentReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        repaymentData={repaymentData}
        onConfirmPayment={handleConfirmPayment}
        onPurchaseTokens={handlePurchaseTokens}
      />

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push("/dashboard");
        }}
        paymentDetails={paymentDetails}
      />
    </div>
  );
}
