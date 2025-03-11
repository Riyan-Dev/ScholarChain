"use client";

import { Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Transaction } from "@/types";
import { TransactionItem } from "./transaction-item";

interface TransactionsCardProps {
  transactions: Transaction[];
  onViewAll: () => void;
}

export function TransactionsCard({
  transactions,
  onViewAll,
}: TransactionsCardProps) {
  // Show only the 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
        <Clock className="text-primary h-6 w-6" />
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Recent Activity</span>
            <span className="text-muted-foreground">
              ({transactions.length} transactions)
            </span>
          </div>
          <Separator className="my-2" />
          {recentTransactions.length > 0 ? (
            <div className="space-y-0 divide-y">
              {recentTransactions.map((transaction, index) => (
                <TransactionItem key={index} transaction={transaction} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-6 text-center">
              No transactions found
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onViewAll} className="w-full" variant="outline">
          View All Transactions
        </Button>
      </CardFooter>
    </Card>
  );
}
