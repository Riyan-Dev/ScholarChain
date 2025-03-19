"use client";

import { useState } from "react";
import { format } from "date-fns";
import { AlertCircle, ArrowRight, Wallet } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RepaymentData } from "./repayment-types";

// Update the PaymentReviewModalProps interface to make repaymentData optional
interface PaymentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  repaymentData?: RepaymentData | null;
  onConfirmPayment: () => Promise<void>;
  onPurchaseTokens: () => void;
}

// Add a check for undefined repaymentData at the beginning of the component
export function PaymentReviewModal({
  isOpen,
  onClose,
  repaymentData,
  onConfirmPayment,
  onPurchaseTokens,
}: PaymentReviewModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Return early if repaymentData is undefined
  if (!repaymentData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loading</DialogTitle>
            <DialogDescription>
              Please wait while we load your payment details
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Destructure the repayment data for easier access
  const { nextInstallment, balance } = repaymentData;

  // Check if wallet balance is sufficient
  const hasInsufficientBalance = balance < nextInstallment.computedDue;

  const handleConfirmPayment = async () => {
    // Don't proceed if balance is insufficient
    if (hasInsufficientBalance) {
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      await onConfirmPayment();
      setIsProcessing(false);
    } catch (err) {
      setError("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Render different content based on balance
  if (hasInsufficientBalance) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insufficient Balance</DialogTitle>
            <DialogDescription>
              You don&apos;t have enough tokens to make this payment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Installment #{nextInstallment.installment_id}
                </CardTitle>
                <CardDescription>
                  Due on {formatDate(nextInstallment.installment_date)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Amount Due
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(nextInstallment.computedDue)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Your Balance
                  </span>
                  <span className="text-destructive font-semibold">
                    {formatCurrency(balance)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Shortfall
                  </span>
                  <span className="text-destructive font-semibold">
                    {formatCurrency(nextInstallment.computedDue - balance)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-lg border bg-amber-50 p-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Insufficient Tokens</p>
                  <p className="text-muted-foreground text-xs">
                    You need to purchase more tokens before you can make this
                    installment payment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onPurchaseTokens} className="w-full sm:w-auto">
              Purchase Tokens
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Review</DialogTitle>
          <DialogDescription>
            Review your installment payment details before confirming
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Installment #{nextInstallment.installment_id}
              </CardTitle>
              <CardDescription>
                Due on {formatDate(nextInstallment.installment_date)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Amount Due
                </span>
                <span className="font-semibold">
                  {formatCurrency(nextInstallment.computedDue)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Payment Method
                </span>
                <div className="flex items-center">
                  <Wallet className="mr-1 h-4 w-4" />
                  <span>Custom Tokens</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Your Balance
                </span>
                <span className="font-semibold">{formatCurrency(balance)}</span>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="pt-4">
              <div className="flex w-full items-center justify-between">
                <span className="font-medium">Total Payment</span>
                <span className="text-xl font-bold">
                  {formatCurrency(nextInstallment.computedDue)}
                </span>
              </div>
            </CardFooter>
          </Card>

          <div className="bg-muted/50 rounded-lg border p-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Payment Confirmation</p>
                <p className="text-muted-foreground text-xs">
                  By confirming this payment, you agree to transfer{" "}
                  {formatCurrency(nextInstallment.computedDue)} worth of tokens
                  from your wallet.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="border-destructive bg-destructive/10 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-destructive h-4 w-4" />
                <p className="text-destructive text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPayment}
            disabled={isProcessing || hasInsufficientBalance}
            className="w-full sm:w-auto"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Confirm Payment
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
