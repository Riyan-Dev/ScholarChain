"use client";

import { format } from "date-fns";
import {
  CheckCircle,
  ArrowRight,
  Receipt,
  Calendar,
  CreditCard,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentDetails: {
    amount: number;
    installmentNumber: number;
    paymentDate: string;
    remainingInstallments: number;
    totalInstallments: number;
    nextDueDate: string | undefined;
  };
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
  paymentDetails,
}: PaymentSuccessModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="mt-4 text-center text-xl">
            Payment Successful
          </DialogTitle>
          <DialogDescription className="text-center">
            Your installment payment has been processed successfully
          </DialogDescription>
        </DialogHeader>

        {/* Success indicator bar */}
        <div className="my-2 h-2 w-full rounded-full bg-green-500"></div>

        <div className="space-y-4 py-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Receipt className="text-muted-foreground mr-2 h-5 w-5" />
                    <span className="text-muted-foreground text-sm">
                      Amount Paid
                    </span>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(paymentDetails.amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="text-muted-foreground mr-2 h-5 w-5" />
                    <span className="text-muted-foreground text-sm">
                      Installment
                    </span>
                  </div>
                  <span className="font-semibold">
                    #{paymentDetails.installmentNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="text-muted-foreground mr-2 h-5 w-5" />
                    <span className="text-muted-foreground text-sm">
                      Payment Date
                    </span>
                  </div>
                  <span className="font-semibold">
                    {formatDate(paymentDetails.paymentDate)}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Installments Remaining
                  </span>
                  <span className="font-semibold">
                    {paymentDetails.remainingInstallments} of{" "}
                    {paymentDetails.totalInstallments}
                  </span>
                </div>

                {paymentDetails.nextDueDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Next Due Date
                    </span>
                    <span className="font-semibold">
                      {formatDate(paymentDetails.nextDueDate)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/30 rounded-lg border p-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Transaction Complete</p>
                <p className="text-muted-foreground text-xs">
                  A receipt has been sent to your email address. Thank you for
                  your payment.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            <span className="flex items-center gap-2">
              Return to Loan Details
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
