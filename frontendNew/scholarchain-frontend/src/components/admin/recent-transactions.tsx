"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

export function RecentTransactions() {
  // Sample transaction data
  const transactions = [
    {
      id: "TX123456",
      type: "Donation",
      amount: "$5,000.00",
      status: "Completed",
      date: "2023-03-15",
      from: "John Doe",
      to: "System Wallet",
    },
    {
      id: "TX123457",
      type: "Loan Disbursement",
      amount: "$2,500.00",
      status: "Completed",
      date: "2023-03-14",
      from: "System Wallet",
      to: "Sarah Johnson",
    },
    {
      id: "TX123458",
      type: "Repayment",
      amount: "$750.00",
      status: "Completed",
      date: "2023-03-13",
      from: "Michael Smith",
      to: "System Wallet",
    },
    {
      id: "TX123459",
      type: "Donation",
      amount: "$10,000.00",
      status: "Pending",
      date: "2023-03-12",
      from: "Corporate Donor Inc.",
      to: "System Wallet",
    },
    {
      id: "TX123460",
      type: "Loan Disbursement",
      amount: "$3,000.00",
      status: "Completed",
      date: "2023-03-11",
      from: "System Wallet",
      to: "David Williams",
    },
  ]

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest financial activities in the system</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden lg:table-cell">From/To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.type === "Donation"
                        ? "default"
                        : transaction.type === "Loan Disbursement"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>
                  <Badge variant={transaction.status === "Completed" ? "success" : "secondary"}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{transaction.date}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {transaction.type === "Donation"
                    ? `From: ${transaction.from}`
                    : transaction.type === "Loan Disbursement"
                      ? `To: ${transaction.to}`
                      : `From: ${transaction.from}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

