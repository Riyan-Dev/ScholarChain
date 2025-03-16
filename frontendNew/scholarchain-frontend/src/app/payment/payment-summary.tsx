import type { Installment, LoanData } from "@/lib/types"
import { formatCurrency, formatDate, getDaysRemaining } from "@/lib/utils"
import { CalendarClock, AlertCircle } from "lucide-react"

interface PaymentSummaryProps {
  installment: Installment
  loanData: LoanData
}

export function PaymentSummary({ installment, loanData }: PaymentSummaryProps) {
  const daysRemaining = getDaysRemaining(installment.installment_date)
  const isUrgent = daysRemaining <= 7

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-full ${
            isUrgent ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400" : "bg-muted"
          }`}
        >
          {isUrgent ? <AlertCircle className="h-6 w-6" /> : <CalendarClock className="h-6 w-6" />}
        </div>
        <div>
          <p className="text-sm font-medium">Due Date</p>
          <p className="text-xl font-bold">{formatDate(installment.installment_date)}</p>
          <p className={`text-sm ${isUrgent ? "text-red-600 dark:text-red-400 font-medium" : "text-muted-foreground"}`}>
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : daysRemaining === 0 ? "Due today" : "Overdue"}
          </p>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Loan ID</span>
          <span className="text-sm font-medium">{loanData.id.substring(0, 8)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Installment</span>
          <span className="text-sm font-medium">
            {installment.installment_id} of {loanData.no_of_installments}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Amount Due</span>
          <span className="text-sm font-medium">{formatCurrency(installment.amount_due)}</span>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-base font-medium">Total Payment</span>
          <span className="text-xl font-bold">{formatCurrency(installment.amount_due)}</span>
        </div>
      </div>
    </div>
  )
}

