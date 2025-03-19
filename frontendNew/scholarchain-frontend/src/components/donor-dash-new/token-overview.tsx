/* eslint-disable prettier/prettier */
"use client";

import { CreditCard, DollarSign, TrendingUp, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TransactionsCard } from "@/components/crpto-dash/transactions-card";
import { WalletCard } from "@/components/crpto-dash/wallet-card";
import { useRouter } from "next/navigation";
// No need to import fetchDash here anymore
//import { fetchDash } from "@/services/user.service";

interface Transaction {  // Define the Transaction type
  username: string;
  amount: number;
  action: string;
  timestamp: string;
}


interface TokenOverviewProps {
  userData: {
    username: string;
    public_key: string;
    balance: number;
    transactions: Transaction[];  // Use the Transaction type
    totalCredit?: number;
    totalDebit?: number;
    loan?: any; //  Use a more specific type if you have one
    wallet_data?: any;  // Use a more specific type if you have one
  };
}


export function TokenOverview({ userData }: TokenOverviewProps) {

  // No need for local state, we're receiving data via props
  const { totalCredit = 0, totalDebit = 0 } = userData;
  const router = useRouter()

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <Wallet className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userData.balance.toLocaleString()} Tokens
            </div>
            <p className="text-muted-foreground text-xs">
              Available for donation or transfer
            </p>
            <div className="mt-4">
              <Progress
                value={totalDebit === 0 && userData.balance === 0 ? 0 : (userData.balance / (userData.balance + totalDebit)) * 100}
                className="h-2"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                {totalDebit === 0 && userData.balance === 0 ? 0 : Math.round(
                  (userData.balance / (userData.balance + totalDebit)) * 100
                )}
                % of your total tokens
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDebit.toLocaleString()} Tokens
            </div>
            <p className="text-muted-foreground text-xs">
              Thank you for your generosity!
            </p>
            <div className="mt-4">
              <Progress
                value={totalDebit === 0 && userData.balance === 0 ? 0 : (totalDebit / (userData.balance + totalDebit)) * 100}
                className="h-2"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                {totalDebit === 0 && userData.balance === 0 ? 0 : Math.round(
                  (totalDebit / (userData.balance + totalDebit)) * 100
                )}
                % of your total tokens
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Purchased
            </CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCredit.toLocaleString()} Tokens
            </div>
            <p className="text-muted-foreground text-xs">
              Lifetime token purchases
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalDebit / 100)}
            </div>
            <p className="text-muted-foreground text-xs">
              Your contribution is making a difference
            </p>
            <div className="mt-4">
              <Progress
                value={Math.min((totalDebit / 5000) * 100, 100)}
                className="h-2"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                {Math.min(Math.round((totalDebit / 5000) * 100), 100)}% to
                next level
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
        <WalletCard data={userData.wallet_data} onBuyToken={() => { }} />
        <TransactionsCard
          transactions={userData.transactions}
          onViewAll={() => { router.push("/transactions") }}
        />
      </div>
    </div>
  );
}