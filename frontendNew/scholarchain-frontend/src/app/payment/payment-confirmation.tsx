import { formatCurrency, formatDate } from "@/lib/utils";
import { CreditCard, Landmark, Wallet } from "lucide-react";

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
  type: 'token';
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

interface PaymentConfirmationProps {
  installment?: Installment; // Make installment optional
  paymentMethod: string;
  paymentDetails?: PaymentDetails | null; // Payment details object
}

export function PaymentConfirmation({ installment, paymentMethod, paymentDetails }: PaymentConfirmationProps) {
  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case "card":
        return <CreditCard className="h-5 w-5" />;
      case "bank":
        return <Landmark className="h-5 w-5" />;
      case "wallet":
        return <Wallet className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case "card":
        return "Credit / Debit Card";
      case "bank":
        return "Bank Transfer";
      case "wallet":
        return "Digital Wallet";
      default:
        return "Unknown";
    }
  };

  const getPaymentMethodDetails = () => {
    switch (paymentMethod) {
      case "card":
        return "•••• •••• •••• 3456";
      case "bank":
        return "Ending in 6789";
      case "wallet":
        return "john@example.com";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-lg space-y-3">
        {paymentDetails?.type === 'loan' && installment && (
          <>
            <div className="flex justify-between">
              <span className="text-sm">Installment</span>
              <span className="text-sm font-medium">#{installment.installment_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Due Date</span>
              <span className="text-sm font-medium">{formatDate(installment.installment_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Amount</span>
              <span className="text-sm font-medium">{formatCurrency(installment.amount_due)}</span>
            </div>
          </>
        )}
        {paymentDetails?.type === 'token' && (
          <>
            <div className="flex justify-between">
              <span className="text-sm">Description</span>
              <span className="text-sm font-medium">{paymentDetails.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Tokens</span>
              <span className="text-sm font-medium">{paymentDetails.tokens}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Price</span>
              <span className="text-sm font-medium">{paymentDetails.price}</span>
            </div>
          </>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-3">Payment Method</h3>
        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
          <div className="bg-primary/10 p-2 rounded-md">{getPaymentMethodIcon()}</div>
          <div>
            <p className="font-medium">{getPaymentMethodName()}</p>
            <p className="text-sm text-muted-foreground">{getPaymentMethodDetails()}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-base font-medium">Total Payment</span>
          <span className="text-xl font-bold">{paymentDetails?.type === 'loan' && installment ? formatCurrency(installment.amount_due) : paymentDetails?.type === 'token' ? paymentDetails.price : 0}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          By proceeding with this payment, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
}