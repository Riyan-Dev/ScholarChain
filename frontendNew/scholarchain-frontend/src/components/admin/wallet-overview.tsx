"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Download, Upload, Wallet } from "lucide-react"

export function WalletOverview() {
  // Sample wallet data
  const walletData = [
    {
      title: "Total Balance",
      value: "$1,245,678",
      icon: Wallet,
      change: "+20.1%",
      changeType: "positive",
    },
    {
      title: "System Reserve",
      value: "$245,000",
      icon: Wallet,
      change: "+5.3%",
      changeType: "positive",
    },
    {
      title: "Blockchain Balance",
      value: "12.5 ETH",
      icon: Wallet,
      change: "+2.3%",
      changeType: "positive",
    },
  ]

  return (
    <>
      {walletData.map((item, index) => {
        const Icon = item.icon
        return (
          <Card key={index} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-2xl font-bold">{item.value}</div>
              <p className={`text-xs ${item.changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
                {item.change} from last month
              </p>
              <div className="mt-4 flex gap-2">
                {index === 0 && (
                  <>
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                      <Upload className="h-3 w-3" />
                      Deposit
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                      <Download className="h-3 w-3" />
                      Withdraw
                    </Button>
                  </>
                )}
                {index === 2 && (
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    View on Etherscan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}

