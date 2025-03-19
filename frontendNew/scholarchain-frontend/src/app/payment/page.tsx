"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { buyTokens } from "@/services/donor.service";
import { AuthService } from "@/services/auth.service";

// Type definitions added here
export type Installment = {
  installment_id: string;
  installment_date: string;
  amount_due: number;
  installment_status: "pending" | "paid";
};

export type LoanData = {
  id: string;
  borrower: string;
  loan_amount: number;
  interest_rate: number;
  loan_term: number;
  start_date: string;
  no_of_installments: number;
  installments: Installment[];
};

export type TokenPurchase = {
  type: "token";
  package?: { value: string; label: string; price: string; tokens: number };
  tokens: number;
  price: number;
  description: string;
};

// Define a type that can represent either a Loan Installment or Token Purchase
type PaymentDetails =
  | { type: "loan"; installment: Installment; loanData: LoanData }
  | {
      type: "token";
      package?: { value: string; label: string; price: string; tokens: number };
      tokens: number;
      price: number;
      description: string;
    };

type PaymentStep =
  | "summary"
  | "method"
  | "details"
  | "confirmation"
  | "success"
  | "processing"; // Add a "processing" step

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<PaymentStep>("summary");
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  ); // Add state for payment details
  const [isLoading, setIsLoading] = useState(false);

  const paymentType = searchParams.get("type");
  const paymentDetailsParam = searchParams.get("paymentDetails");

  const loanData = getLoanData();

  // Find the next pending installment
  const nextInstallment = loanData.installments.find(
    (installment) => installment.installment_status === "pending"
  );

  // Parse paymentDetails from query params on initial load
  useEffect(() => {
    if (paymentDetailsParam) {
      try {
        const decodedPaymentDetails = JSON.parse(
          decodeURIComponent(paymentDetailsParam)
        );
        setPaymentDetails(decodedPaymentDetails as PaymentDetails); // Type assertion
      } catch (error) {
        console.error("Error parsing paymentDetails:", error);
      }
    }
  }, [paymentDetailsParam]);

  const processTokenPurchase = async (amount: number) => {
    setIsLoading(true); // Set loading state to true
    setCurrentStep("processing"); // Update the step to "processing"

    try {
      const data = await buyTokens(amount);
      console.log("Token purchase response:", data);
    } catch (error) {
      console.error("Error buying tokens:", error);
    } finally {
      setIsLoading(false);
      setCurrentStep("success");
    }
  };

  const handleContinue = () => {
    const role = AuthService.getUserRole();

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
        // If it's a token purchase, call the endpoint and redirect
        if (
          paymentType === "token" &&
          paymentDetails &&
          "tokens" in paymentDetails
        ) {
          processTokenPurchase(paymentDetails.tokens);
        } else {
          setCurrentStep("success");
        }
        break;
      case "success":
        if (role) {
          if (role === "donator") {
            router.push("/donor");
            router.replace("/donor");
          } else if (role === "applicant") {
            router.push("/dashboard");
            router.replace("/dashboard");
          }
        }
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
        router.push("/purchase");
        router.replace("/purchase");
    }
  };

  // Dynamically determine the CardTitle and CardDescription based on paymentType
  let cardTitle = "";
  let cardDescription = "";

  if (paymentType === "token") {
    cardTitle = "Purchase Tokens";
    cardDescription = "Complete your token purchase";
  } else {
    cardTitle = "Make Payment";
    cardDescription = "Review your installment details";
  }

  // Conditionally render the content of the CardContent based on the currentStep and paymentType
  let cardContent;

  if (currentStep === "summary") {
    cardContent = (
      <>
        {paymentType === "loan" && paymentDetails?.type === "loan" && (
          <PaymentSummary installment={nextInstallment} loanData={loanData} />
        )}
        {paymentType === "token" && paymentDetails?.type === "token" && (
          <div>
            <p>Description: {paymentDetails.description}</p>
            <p>Tokens: {paymentDetails.tokens}</p>
            <p>Price: {paymentDetails.price}</p>
          </div>
        )}
      </>
    );
  } else if (currentStep === "method") {
    cardContent = (
      <PaymentMethod
        selectedMethod={selectedMethod}
        onSelectMethod={setSelectedMethod}
      />
    );
  } else if (currentStep === "details") {
    cardContent = <PaymentForm paymentMethod={selectedMethod} />;
  } else if (currentStep === "confirmation") {
    cardContent = (
      <PaymentConfirmation
        installment={nextInstallment}
        paymentMethod={selectedMethod}
        paymentDetails={paymentDetails}
      />
    );
  } else if (currentStep === "success") {
    cardContent = (
      <div className="py-6 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="mb-2 text-lg font-medium">Payment Successful</h3>
        <p className="text-muted-foreground mb-4">
          {paymentType === "loan"
            ? `Your payment of ${nextInstallment?.amount_due} has been processed
          successfully.`
            : `Your token purchase of ${paymentDetails?.tokens} tokens has been processed successfully.`}
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
    );
  } else if (currentStep === "processing") {
    // Add a case for the processing step
    cardContent = (
      <div className="py-6 text-center">
        <p>Processing payment...</p>
        {/* Add a loading spinner or any other visual indicator here */}
      </div>
    );
  } else {
    cardContent = null; // Or some default content
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <Card className="border-t-primary border-t-4">
        <CardHeader>
          <div className="mb-2 flex items-center">
            {currentStep !== "success" && currentStep !== "processing" && (
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
            <CardTitle>{cardTitle}</CardTitle>
          </div>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>

        <CardContent>{cardContent}</CardContent>

        <CardFooter>
          <Button
            className="w-full"
            onClick={handleContinue}
            disabled={isLoading}
          >
            {currentStep === "summary" && "Continue"}
            {currentStep === "method" && "Continue"}
            {currentStep === "details" && "Review Payment"}
            {currentStep === "confirmation" && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {paymentType === "loan"
                  ? `Pay ${nextInstallment?.amount_due}`
                  : isLoading
                    ? "Processing..."
                    : `Purchase ${paymentDetails?.tokens} tokens`}
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
