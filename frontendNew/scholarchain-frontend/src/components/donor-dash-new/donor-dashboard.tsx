"use client";

import { useState } from "react";
import { CreditCard, DollarSign, History, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonateTokens } from "./donate-tokens";
import { TokenOverview } from "./token-overview";
import { TransactionHistory } from "./transaction-history";
import { TransactionsCard } from "../crpto-dash/transactions-card";
import { WalletCard } from "../crpto-dash/wallet-card";

// Mock data based on the provided MongoDB document
const mockUserData = {
  _id: "67d083541fc6af0758bc0d90",
  username: "Donor2",
  public_key: "0xFB221727f2Fd0aD1b22E0B0066aF404F6B448CE6",
  encrypted_private_key:
    "0HCmR2Ci5x6C74siv6i7DQ4TyzshhYmFRJrMbEJU0naKcLtpn9XIMFUAeHCOeCKgrkINWMBTgDbP1VCMZfQIhQ==",
  balance: 19100,
  transactions: [
    {
      username: "",
      amount: 1000,
      action: "buy",
      timestamp: "2025-03-11 23:39:06",
    },
    {
      username: "scholarchain",
      amount: 500,
      action: "debit",
      timestamp: "2025-03-11 23:39:06",
    },
    {
      username: "scholarchain",
      amount: 500,
      action: "debit",
      timestamp: "2025-03-11 23:39:06",
    },
    {
      username: "",
      amount: 1000,
      action: "buy",
      timestamp: "2025-03-11 23:42:53",
    },
    {
      username: "scholarchain",
      amount: 500,
      action: "debit",
      timestamp: "2025-03-11 23:42:53",
    },
    {
      username: "",
      amount: 0,
      action: "buy",
      timestamp: "2025-03-11 23:42:53",
    },
    {
      username: "",
      amount: 100,
      action: "buy",
      timestamp: "2025-03-12 00:56:51",
    },
    {
      username: "",
      amount: 15500,
      action: "buy",
      timestamp: "2025-03-12 00:56:51",
    },
    {
      username: "",
      amount: 3000,
      action: "buy",
      timestamp: "2025-03-12 00:56:51",
    },
  ],
};



export function DonorDashboard() {
  const [userData, setUserData] = useState(mockUserData);

  const handleDonation = (amount: number) => {
    // In a real app, this would make an API call to process the donation
    const newTransaction = {
      username: "scholarchain",
      amount: amount,
      action: "debit",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    setUserData({
      ...userData,
      balance: userData.balance - amount,
      transactions: [newTransaction, ...userData.transactions],
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Donor Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>Buy Tokens</Button>
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
            <TransactionHistory transactions={userData.transactions} />
          </TabsContent>
          <TabsContent value="donate" className="space-y-4">
            <DonateTokens
              balance={userData.balance}
              onDonate={handleDonation}
            />
          </TabsContent>
        </Tabs>
      </div>
      
    </div>
  );
}
