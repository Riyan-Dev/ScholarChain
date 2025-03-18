"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CreditCard, AlertTriangle } from "lucide-react"

export function KeyMetrics() {
  const metrics = [
    {
      title: "Total Donations",
      value: "$1,245,678",
      icon: DollarSign,
      change: "+20.1%",
      changeType: "positive",
    },
    {
      title: "Available Funds",
      value: "$845,392",
      icon: DollarSign,
      change: "+4.3%",
      changeType: "positive",
    },
    {
      title: "Active Loans",
      value: "2,345",
      icon: CreditCard,
      change: "+12.5%",
      changeType: "positive",
    },
    {
      title: "Default Rate",
      value: "3.2%",
      icon: AlertTriangle,
      change: "-0.5%",
      changeType: "positive",
    },
  ]

  return (
    <>
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${metric.changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}

