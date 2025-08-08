"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LinkIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useBlockchain } from "@/context/blockchain-context";

export default function RecentTransactions() {
  const { getRecentTransactions, isLoading, error } = useBlockchain();
  const transactions = getRecentTransactions(5);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
        <CardDescription>
          The most recent transactions on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.hash}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      Block #{tx.blockNumber}
                    </span>
                  </div>
                  <div className="text-muted-foreground max-w-[250px] truncate font-mono text-xs">
                    {tx.hash}
                  </div>
                </div>
              </div>
            ))}

            {/* <Button variant="outline" className="w-full" asChild>
              <Link href="#transactions">
                View All Transactions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
