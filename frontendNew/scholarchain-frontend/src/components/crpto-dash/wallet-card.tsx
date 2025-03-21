"use client";

import {
  PlusCircle,
  Send,
  Wallet,
  CreditCard,
  MoreHorizontal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import type { WalletData } from "@/lib/types";

interface WalletCardProps {
  data: any;
  onBuyToken: () => void;
}

export function WalletCard({ data, onBuyToken }: WalletCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Wallet</CardTitle>
        <Wallet className="text-primary h-6 w-6" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm">Total Balance</p>
            <h2 className="text-3xl font-bold tracking-tight">
              {data.balance} Tokens
            </h2>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Username</span>
              <span className="font-medium">{data.username}</span>
            </div>
            <div className="flex flex-col items-start text-sm">
              <span className="text-muted-foreground">Public Key</span>
              <span className="text-md font-mono break-all">
                {data.public_key}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-grow items-center justify-center">
        <Button
          onClick={onBuyToken}
          className="max-w flex h-16 w-64 flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <PlusCircle className="mb-1 h-5 w-5" />
          <span className="text-xs">Buy</span>
        </Button>
        {/* <Button
          variant="outline"
          className="flex h-16 flex-col items-center justify-center"
        >
          <Send className="mb-1 h-5 w-5 text-green-500" />
          <span className="text-xs">Donate</span>
        </Button> */}
        {/* <Button
          variant="outline"
          className="flex h-16 flex-col items-center justify-center"
        >
          <CreditCard className="mb-1 h-5 w-5 text-orange-500" />
          <span className="text-xs">Swap</span>
        </Button>
        <Button
          variant="outline"
          className="flex h-16 flex-col items-center justify-center"
        >
          <MoreHorizontal className="mb-1 h-5 w-5 text-blue-500" />
          <span className="text-xs">More</span>
        </Button> */}
      </CardFooter>
    </Card>
  );
}
