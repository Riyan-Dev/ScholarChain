import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionStats } from "./transaction-stats";
import { LocalTransactionsTable } from "./local-transactions-table";
import { BlockchainTransactionsTable } from "./blockchain-transactions-table";

export default function TransactionsPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">Transaction Dashboard</h1>

      <Suspense fallback={<Skeleton className="h-[120px] w-full rounded-lg" />}>
        <TransactionStats />
      </Suspense>

      <Tabs defaultValue="local" className="mt-8">
        <TabsList className="mb-8 grid w-full grid-cols-2">
          <TabsTrigger value="local">Token Transactions</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="local">
          <Card>
            <CardHeader>
              <CardTitle>Token Transactions</CardTitle>
              <CardDescription>
                View all your token purchases and burns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}
              >
                <LocalTransactionsTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Transactions</CardTitle>
              <CardDescription>
                View all transactions recorded on the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}
              >
                <BlockchainTransactionsTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
