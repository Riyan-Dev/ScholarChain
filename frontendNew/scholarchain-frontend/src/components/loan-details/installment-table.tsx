import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Installment } from "@/lib/types";

interface InstallmentTableProps {
  installments: Installment[];
}

export function InstallmentTable({ installments }: InstallmentTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount Due</TableHead>
            <TableHead>Amount Paid</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {installments.map((installment) => (
            <TableRow key={installment.installment_id}>
              <TableCell className="font-medium">
                {installment.installment_id}
              </TableCell>
              <TableCell>{formatDate(installment.installment_date)}</TableCell>
              <TableCell>{formatCurrency(installment.amount_due)}</TableCell>
              <TableCell>{formatCurrency(installment.amount_paid)}</TableCell>
              <TableCell>
                <InstallmentStatusBadge
                  status={installment.installment_status}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface InstallmentStatusBadgeProps {
  status: Installment["installment_status"];
}

function InstallmentStatusBadge({ status }: InstallmentStatusBadgeProps) {
  const statusConfig = {
    pending: { label: "Pending", variant: "outline" as const },
    paid: { label: "Paid", variant: "default" as const },
    overdue: { label: "Overdue", variant: "destructive" as const },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
