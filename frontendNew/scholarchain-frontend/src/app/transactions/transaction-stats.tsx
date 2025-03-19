"use client";

import { useLocalTransactions } from "@/hooks/use-local-transactions";
import { useBlockchainTransactions } from "@/hooks/use-blockchain-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  BarChart3,
  Activity,
} from "lucide-react";

export function TransactionStats() {
  const { transactions: localTransactions } = useLocalTransactions();
  const { transactions: blockchainTransactions } = useBlockchainTransactions();

  // Calculate stats for local transactions
  const totalBuys = localTransactions
    .filter((t) => t.action === "buy")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBurns = localTransactions
    .filter((t) => t.action === "burn")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate stats for blockchain transactions
  const totalValue = blockchainTransactions.reduce(
    (sum, t) => sum + Number.parseInt(t.value),
    0
  );
  const totalGas = blockchainTransactions.reduce(
    (sum, t) => sum + t.gas_used,
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Tokens Bought
          </CardTitle>
          <Coins className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBuys}</div>
          <p className="text-muted-foreground text-xs">
            <span className="flex items-center text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />+
              {Math.round((totalBuys / (totalBuys + totalBurns || 1)) * 100)}%
            </span>{" "}
            of total token activity
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Tokens Burned
          </CardTitle>
          <BarChart3 className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBurns}</div>
          <p className="text-muted-foreground text-xs">
            <span className="flex items-center text-red-500">
              <ArrowDownRight className="mr-1 h-4 w-4" />
              {Math.round((totalBurns / (totalBuys + totalBurns || 1)) * 100)}%
            </span>{" "}
            of total token activity
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total ETH Transferred
          </CardTitle>
          <Activity className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalValue} ETH</div>
          <p className="text-muted-foreground text-xs">
            Across {blockchainTransactions.length} blockchain transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gas Used</CardTitle>
          <Activity className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(totalGas / 1000000).toFixed(2)}M
          </div>
          <p className="text-muted-foreground text-xs">
            Average{" "}
            {Math.round(
              totalGas / (blockchainTransactions.length || 1)
            ).toLocaleString()}{" "}
            per transaction
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
