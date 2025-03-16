"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLoanData } from "@/lib/data";
import { PaymentConfirmation } from "./payment-confirmation";
import { PaymentForm } from "./payment-form";
import { PaymentMethod } from "./payment-method";
import { PaymentSummary } from "./payment-summary";

type PaymentStep =
  | "summary"
  | "method"
  | "details"
  | "confirmation"
  | "success";

export default function PaymentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<PaymentStep>("summary");
  const [selectedMethod, setSelectedMethod] = useState<string>("card");

  const loanData = getLoanData();

  // Find the next pending installment
  const nextInstallment = loanData.installments.find(
    (installment) => installment.installment_status === "pending"
  );

  if (!nextInstallment) {
    return (
      <div className="container mx-auto max-w-md px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>No Payment Due</CardTitle>
            <CardDescription>All installments have been paid</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <p className="text-lg font-medium">No pending installments</p>
              <p className="text-muted-foreground mt-1 text-sm">
                You&apos;ve completed all your scheduled payments
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/")}
            >
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleContinue = () => {
    switch (currentStep) {
      case "summary":
        setCurrentStep("method");
        break;
      case "method":
        setCurrentStep("details");
        break;
      case "details":
        setCurrentStep("confirmation");
        break;
      case "confirmation":
        setCurrentStep("success");
        break;
      case "success":
        router.push("/");
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "method":
        setCurrentStep("summary");
        break;
      case "details":
        setCurrentStep("method");
        break;
      case "confirmation":
        setCurrentStep("details");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <Card className="border-t-primary border-t-4">
        <CardHeader>
          <div className="mb-2 flex items-center">
            {currentStep !== "success" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="mr-2 -ml-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            )}
            <CardTitle>
              {currentStep === "summary" && "Make Payment"}
              {currentStep === "method" && "Select Payment Method"}
              {currentStep === "details" && "Payment Details"}
              {currentStep === "confirmation" && "Confirm Payment"}
              {currentStep === "success" && "Payment Successful"}
            </CardTitle>
          </div>
          <CardDescription>
            {currentStep === "summary" && "Review your installment details"}
            {currentStep === "method" && "Choose how you want to pay"}
            {currentStep === "details" && "Enter your payment information"}
            {currentStep === "confirmation" &&
              "Verify payment details before proceeding"}
            {currentStep === "success" && "Your payment has been processed"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {currentStep === "summary" && (
            <PaymentSummary installment={nextInstallment} loanData={loanData} />
          )}

          {currentStep === "method" && (
            <PaymentMethod
              selectedMethod={selectedMethod}
              onSelectMethod={setSelectedMethod}
            />
          )}

          {currentStep === "details" && (
            <PaymentForm paymentMethod={selectedMethod} />
          )}

          {currentStep === "confirmation" && (
            <PaymentConfirmation
              installment={nextInstallment}
              paymentMethod={selectedMethod}
            />
          )}

          {currentStep === "success" && (
            <div className="py-6 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Payment Successful</h3>
              <p className="text-muted-foreground mb-4">
                Your payment of ${nextInstallment.amount_due} has been processed
                successfully.
              </p>
              <div className="bg-muted mb-4 rounded-lg p-4 text-left">
                <div className="mb-2 flex justify-between">
                  <span className="text-sm">Transaction ID:</span>
                  <span className="text-sm font-medium">
                    TXN
                    {Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Date:</span>
                  <span className="text-sm font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={handleContinue}>
            {currentStep === "summary" && "Continue"}
            {currentStep === "method" && "Continue"}
            {currentStep === "details" && "Review Payment"}
            {currentStep === "confirmation" && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Pay ${nextInstallment.amount_due}</span>
              </div>
            )}
            {currentStep === "success" && "Return to Dashboard"}
          </Button>
        </CardFooter>
      </Card>

      {currentStep !== "success" && (
        <div className="mt-4 text-center">
          <p className="text-muted-foreground text-sm">
            Payment secured by <span className="font-medium">SecurePay</span>
          </p>
        </div>
      )}
    </div>
  );
}
