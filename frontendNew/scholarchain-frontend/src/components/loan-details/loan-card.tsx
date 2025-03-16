"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Clock,
  DollarSign,
  FileText,
  Loader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { LoanProgressChart } from "./loan-progress-chart";
import { LoanStatusBadge } from "./loan-status-badge";
import { InstallmentSummary } from "./installment-summary";
import { useRouter } from "next/navigation";

interface LoanData {
  _id: string;
  id: string | null;
  username: string;
  loan_amount: number;
  contract_address: string;
  loan_amount_repaid: number;
  no_of_installments: number;
  installments_completed: number;
  total_discounted_amount: number | null;
  status: "ongoing" | "completed" | "defaulted";
  created_at: string;
  pending: number;
  overdue: number;
  paid: number;
}

interface LoanCardProps {
  loan?: LoanData;
  isLoading?: boolean;
  handlePayInstallment: () => void;
}

export function LoanCard({
  loan,
  isLoading = false,
  handlePayInstallment,
}: LoanCardProps) {
  const router = useRouter();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  // const handlePayInstallment = () => {
  //   setIsPaymentLoading(true);
  //   // Simulate API call
  //   setTimeout(() => {
  //     setIsPaymentLoading(false);
  //   }, 2000);
  // };

  if (isLoading) {
    return <LoanCardSkeleton />;
  }

  if (!loan) {
    return null;
  }

  const percentComplete =
    (loan.installments_completed / loan.no_of_installments) * 100;
  const installmentAmount = loan.loan_amount / loan.no_of_installments;
  const remainingAmount = loan.loan_amount - loan.loan_amount_repaid;
  const nextPaymentDue = loan.overdue > 0 ? "Overdue" : "Next month";

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Active Loan</CardTitle>
          <LoanStatusBadge status={loan.status} />
        </div>
        <CardDescription>
          Contract: {loan.contract_address.substring(0, 10)}...
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  Total Loan Amount
                </div>
                <div className="font-semibold">
                  ${loan.loan_amount.toLocaleString()}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  Amount Repaid
                </div>
                <div className="font-medium">
                  ${loan.loan_amount_repaid.toLocaleString()}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  Remaining Balance
                </div>
                <div className="font-medium">
                  ${remainingAmount.toLocaleString()}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  Installment Amount
                </div>
                <div className="font-medium">
                  ${installmentAmount.toLocaleString()}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  Next Payment Due
                </div>
                <div className="flex items-center">
                  {loan.overdue > 0 ? (
                    <Badge variant="destructive" className="font-medium">
                      Overdue
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="font-medium">
                      Next month
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Loan Progress</span>
                <span className="font-medium">
                  {Math.round(percentComplete)}%
                </span>
              </div>
              <Progress value={percentComplete} className="h-2" />
            </div>

            <div className="flex gap-2 pt-2">
              <InstallmentSummary
                label="Paid"
                count={loan.paid}
                icon={<DollarSign className="h-3.5 w-3.5" />}
                variant="success"
              />
              <InstallmentSummary
                label="Pending"
                count={loan.pending}
                icon={<Clock className="h-3.5 w-3.5" />}
                variant="default"
              />
              <InstallmentSummary
                label="Overdue"
                count={loan.overdue}
                icon={<AlertCircle className="h-3.5 w-3.5" />}
                variant="destructive"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <LoanProgressChart
              completed={loan.installments_completed}
              total={loan.no_of_installments}
              overdue={loan.overdue}
            />
            <div className="mt-4 text-center">
              <div className="text-muted-foreground text-sm">Installments</div>
              <div className="text-xl font-semibold">
                {loan.installments_completed} of {loan.no_of_installments}{" "}
                completed
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  router.push("/loan-details");
                }}
                variant="outline"
                size="sm"
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View complete loan details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          onClick={handlePayInstallment}
          disabled={isPaymentLoading || loan.pending === 0}
          size="sm"
        >
          {isPaymentLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            <>
              Pay Next Installment
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function LoanCardSkeleton() {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="mt-1 h-4 w-48" />
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>

            <div className="flex gap-2 pt-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <Skeleton className="h-40 w-40 rounded-full" />
            <Skeleton className="mt-4 h-4 w-32" />
            <Skeleton className="mt-2 h-6 w-48" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-40" />
      </CardFooter>
    </Card>
  );
}
