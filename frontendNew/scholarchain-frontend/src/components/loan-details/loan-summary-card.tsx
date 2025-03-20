import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loan } from "@/lib/types";

interface LoanSummaryCardProps {
  loan: Loan;
}

export function LoanSummaryCard({ loan }: LoanSummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Loan Summary</CardTitle>
          <StatusBadge status={loan.status} />
        </div>
        <CardDescription>
          Created on {formatDate(loan.created_at)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InfoItem
            label="Loan Amount"
            value={formatCurrency(loan.loan_amount)}
          />
          <InfoItem
            label="Amount Repaid"
            value={formatCurrency(loan.loan_amount_repaid)}
          />
          <InfoItem
            label="Remaining Balance"
            value={formatCurrency(loan.loan_amount - loan.loan_amount_repaid)}
          />
          <InfoItem label="Username" value={loan.username} />
          <InfoItem
            label="Installments"
            value={`${loan.installments_completed} of ${loan.no_of_installments}`}
          />
          {loan.contract_address && (
            <InfoItem
              label="Contract Address"
              value={loan.contract_address}
              isAddress
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  isAddress?: boolean;
}

function InfoItem({ label, value, isAddress = false }: InfoItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm">{label}</p>
      {isAddress ? (
        <p className="truncate font-medium" title={value}>
          {value.slice(0, 6)}...{value.slice(-4)}
        </p>
      ) : (
        <p className="font-medium">{value}</p>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: Loan["status"];
}

function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    ongoing: { label: "Ongoing", variant: "outline" as const },
    completed: { label: "Completed", variant: "default" as const },
    defaulted: { label: "Defaulted", variant: "destructive" as const },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
