import type { Installment } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CreditCard, Landmark, Wallet } from "lucide-react"

interface PaymentConfirmationProps {
  installment: Installment
  paymentMethod: string
}

export function PaymentConfirmation({ installment, paymentMethod }: PaymentConfirmationProps) {
  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case "card":
        return <CreditCard className="h-5 w-5" />
      case "bank":
        return <Landmark className="h-5 w-5" />
      case "wallet":
        return <Wallet className="h-5 w-5" />
      default:
        return null
    }
  }

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case "card":
        return "Credit / Debit Card"
      case "bank":
        return "Bank Transfer"
      case "wallet":
        return "Digital Wallet"
      default:
        return "Unknown"
    }
  }

  const getPaymentMethodDetails = () => {
    switch (paymentMethod) {
      case "card":
        return "•••• •••• •••• 3456"
      case "bank":
        return "Ending in 6789"
      case "wallet":
        return "john@example.com"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-lg space-y-3">
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
          <span className="text-xl font-bold">{formatCurrency(installment.amount_due)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          By proceeding with this payment, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  )
}

