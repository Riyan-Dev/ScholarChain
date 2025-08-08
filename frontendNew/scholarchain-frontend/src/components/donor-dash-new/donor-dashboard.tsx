/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, Suspense } from "react";
import { CreditCard, DollarSign, History, LayoutDashboard, EarthLock} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonateTokens } from "./donate-tokens";
import { TokenOverview } from "./token-overview";
import { TransactionHistory } from "./transaction-history";
import { fetchDash } from "@/services/user.service";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { BlockchainTransactionsTable } from "@/app/transactions/blockchain-transactions-table";
import { LocalTransactionsTable } from "@/app/transactions/local-transactions-table";
import { TransactionStats } from "@/app/transactions/transaction-stats";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import DashboardShell from "../admin/dashboard-shell";
import { DashboardHeader } from "./dashboard-header";

interface Transaction {
  username: string;
  amount: number;
  action: string;
  timestamp: string;
}

interface UserData {
  username: string;
  public_key: string;
  balance: number;
  transactions: Transaction[];
  totalCredit?: number;
  totalDebit?: number;
  loan?: any;
  wallet_data?: any;
}


export function DonorDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to fetch and update user data
  const updateUserData = async () => {
    try {
      const data = await fetchDash();
      setUserData(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching data.");
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!AuthService.getToken()) {
          setError("User not authenticated. Please log in.");
          setLoading(false);
          return;
        }
        await updateUserData();

      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
      return (
        <div className="p-8">
        <DashboardShell>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Key Metrics Skeletons */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="mt-2 h-4 w-16" />
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              {/* Monthly Trends Skeleton */}
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="h-[300px] w-full" />
            </div>
            <div className="col-span-3">
              {/* Fund Distribution Skeleton */}
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              {/* Recent Transactions Skeleton */}
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="h-[300px] w-full" />
            </div>
            <div className="col-span-3">
              <div className="grid gap-4">
                {/* Upcoming Repayments Skeleton */}
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-[150px] w-full" />
  
                {/* Pending Applications Skeleton */}
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-[150px] w-full" />
              </div>
            </div>
          </div>
        </DashboardShell>
        </div>
      );
    }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>No data available.</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Donor Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => router.push("/ledger")}> <EarthLock className="h-4 w-4" /> Ledger</Button>
            <Button onClick={() => router.push("/purchase")}>Buy Tokens</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="donate" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Donate
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <TokenOverview userData={userData} />
          </TabsContent>
          <TabsContent value="transactions" className="space-y-4">
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
          </TabsContent>
          <TabsContent value="donate" className="space-y-4">
            {/* Pass updateUserData to DonateTokens */}
            <DonateTokens
              balance={userData.balance}
              onDonate={updateUserData}  // Pass the update function!
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}