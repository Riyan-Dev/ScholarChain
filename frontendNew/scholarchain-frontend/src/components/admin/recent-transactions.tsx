"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { TransactionAPI } from "@/services/admin.service";
import { useRouter } from "next/navigation";

interface RecentTransactionsComponentProps {
  transactions: TransactionAPI[];
}

interface RecentTransactions {
  id: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  from: string;
  to: string;
}

export function RecentTransactionsComponent({
  transactions,
}: RecentTransactionsComponentProps) {
  const router = useRouter();

  const recentTransactions: RecentTransactions[] = transactions.map((tx) => {
    // Determine transaction type and from/to information
    let type = tx.description; // Default
    let from = "";
    let to = "";

    if (tx.action === "credit") {
      type = "Credit";
      from = tx.username;
      to = "System Wallet";
    } else if (tx.action === "debit") {
      type = "Debit";
      from = "System Wallet";
      to = tx.username;
    }

    return {
      id: tx.description, // Use description as ID but consider a better unique key
      type: type,
      amount: tx.amount,
      status: "Completed", // Assuming all transactions are completed in this example.  Adapt based on actual API data.
      date: tx.timestamp,
      from: from,
      to: to,
    };
  });

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest financial activities in the system
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/transactions")}>
          View All
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden lg:table-cell">From/To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.type === "Donation" ||
                      transaction.type === "Credit"
                        ? "default"
                        : transaction.type === "Loan Disbursement" ||
                            transaction.type === "Debit"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === "Completed"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {transaction.date}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {transaction.type === "Donation" ||
                  transaction.type === "Credit"
                    ? `From: ${transaction.from}`
                    : transaction.type === "Loan Disbursement" ||
                        transaction.type === "Debit"
                      ? `To: ${transaction.to}`
                      : `From: ${transaction.from}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
