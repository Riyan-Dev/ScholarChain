"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Loan } from "@/lib/types";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface LoanTimelineProps {
  loan: Loan;
}

export function LoanTimeline({ loan }: LoanTimelineProps) {
  // Get the current date for comparison
  const currentDate = new Date();

  // Sort installments by date
  const sortedInstallments = [...loan.installments].sort(
    (a, b) =>
      new Date(a.installment_date).getTime() -
      new Date(b.installment_date).getTime()
  );

  // Find the next upcoming installment
  const nextInstallment = sortedInstallments.find(
    (installment) =>
      new Date(installment.installment_date) > currentDate &&
      installment.installment_status === "pending"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {nextInstallment && (
            <div className="bg-muted/30 mb-6 rounded-lg border p-4">
              <h3 className="mb-1 font-semibold">Next Payment</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Due on {formatDate(nextInstallment.installment_date)}
                  </p>
                  <p className="font-medium">
                    {formatCurrency(nextInstallment.amount_due)}
                  </p>
                </div>
                <Clock className="text-muted-foreground h-10 w-10" />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {sortedInstallments.slice(0, 5).map((installment) => {
              const installmentDate = new Date(installment.installment_date);
              const isPast = installmentDate < currentDate;
              const isOverdue =
                isPast && installment.installment_status === "pending";

              return (
                <div
                  key={installment.installment_id}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1">
                    {installment.installment_status === "paid" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : isOverdue ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="text-muted-foreground h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        Installment #{installment.installment_id}
                      </p>
                      <span className="text-muted-foreground text-sm">
                        {formatCurrency(installment.amount_due)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {formatDate(installment.installment_date)}
                    </p>
                  </div>
                </div>
              );
            })}

            {loan.installments.length > 5 && (
              <p className="text-muted-foreground pt-2 text-center text-sm">
                + {loan.installments.length - 5} more installments
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
