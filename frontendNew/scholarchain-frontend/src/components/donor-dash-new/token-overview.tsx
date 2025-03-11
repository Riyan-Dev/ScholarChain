"use client";

import { CreditCard, DollarSign, TrendingUp, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { TransactionsCard } from "../crpto-dash/transactions-card";
import { WalletCard } from "../crpto-dash/wallet-card";

interface TokenOverviewProps {
  userData: {
    username: string;
    public_key: string;
    balance: number;
    transactions: Array<{
      username: string;
      amount: number;
      action: string;
      timestamp: string;
    }>;
  };
}

const mockWalletData: WalletData = {
  username: "meowl",
  public_key:
    "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQE-----",
  encrypted_private_key:
    "aYxjJHqyBNcX8sPs7/ShCVzsgVWr56GneNx/0IUQrdBChQu6p3cpftEIUHsTDD%jmdKd...",
  balance: 350,
  transactions: [
    {
      username: "",
      amount: 1000,
      action: "buy",
      timestamp: "2024-12-10 11:06:52",
      description: "Initial token purchase",
    },
    {
      username: "",
      amount: 1000,
      action: "buy",
      timestamp: "2024-12-11 03:42:43",
      description: "Token purchase",
    },
    {
      username: "scholarchain",
      amount: 1500,
      action: "debit",
      timestamp: "2024-12-11 03:42:43",
      description: "Transfer to scholarchain",
    },
    {
      username: "scholarchain",
      amount: 150,
      action: "debit",
      timestamp: "2024-12-11 03:42:43",
      description: "Transfer to scholarchain",
    },
  ],
};

export function TokenOverview({ userData }: TokenOverviewProps) {
  const [walletData, setWalletData] = useState<WalletData>(mockWalletData);

  // Calculate total donated
  const totalDonated = userData.transactions
    .filter((tx) => tx.action === "debit" && tx.username === "scholarchain")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate total purchased
  const totalPurchased = userData.transactions
    .filter((tx) => tx.action === "buy")
    .reduce((sum, tx) => sum + tx.amount, 0);

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
                value={
                  (userData.balance / (userData.balance + totalDonated)) * 100
                }
                className="h-2"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                {Math.round(
                  (userData.balance / (userData.balance + totalDonated)) * 100
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
              {totalDonated.toLocaleString()} Tokens
            </div>
            <p className="text-muted-foreground text-xs">
              Thank you for your generosity!
            </p>
            <div className="mt-4">
              <Progress
                value={(totalDonated / (userData.balance + totalDonated)) * 100}
                className="h-2"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                {Math.round(
                  (totalDonated / (userData.balance + totalDonated)) * 100
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
              {totalPurchased.toLocaleString()} Tokens
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
              {Math.round(totalDonated / 100)}
            </div>
            <p className="text-muted-foreground text-xs">
              Your contribution is making a difference
            </p>
            <div className="mt-4">
              <Progress
                value={Math.min((totalDonated / 5000) * 100, 100)}
                className="h-2"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                {Math.min(Math.round((totalDonated / 5000) * 100), 100)}% to
                next level
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
        <WalletCard data={walletData} onBuyToken={() => {}} />
        <TransactionsCard
          transactions={walletData.transactions}
          onViewAll={() => {}}
        />
      </div>
    </div>
  );
}
