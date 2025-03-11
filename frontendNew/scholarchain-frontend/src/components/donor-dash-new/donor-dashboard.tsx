/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import { CreditCard, DollarSign, History, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonateTokens } from "./donate-tokens";
import { TokenOverview } from "./token-overview";
import { TransactionHistory } from "./transaction-history";
import { fetchDash } from "@/services/user.service";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

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
    return <div>Loading...</div>;
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
            <TransactionHistory transactions={userData.transactions} />
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