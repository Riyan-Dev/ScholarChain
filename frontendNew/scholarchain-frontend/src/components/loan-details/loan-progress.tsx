"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import type { Loan } from "@/lib/types";
import { useEffect, useState } from "react";

interface LoanProgressProps {
  loan: Loan;
}

export function LoanProgress({ loan }: LoanProgressProps) {
  const [progress, setProgress] = useState(0);

  // Calculate the percentage of loan repaid
  const percentageRepaid = (loan.loan_amount_repaid / loan.loan_amount) * 100;

  // Animate the progress bar
  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentageRepaid), 100);
    return () => clearTimeout(timer);
  }, [percentageRepaid]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Repaid</span>
              <span className="font-medium">
                {formatCurrency(loan.loan_amount_repaid)}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Total</span>
              <span className="font-medium">
                {formatCurrency(loan.loan_amount)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 space-y-2 rounded-lg p-4 text-center">
              <div className="text-4xl font-bold">
                {loan.installments_completed}
              </div>
              <div className="text-muted-foreground text-sm">
                Installments Completed
              </div>
            </div>
            <div className="bg-muted/50 space-y-2 rounded-lg p-4 text-center">
              <div className="text-4xl font-bold">
                {loan.no_of_installments - loan.installments_completed}
              </div>
              <div className="text-muted-foreground text-sm">
                Installments Remaining
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
