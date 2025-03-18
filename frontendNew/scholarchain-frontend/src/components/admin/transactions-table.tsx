"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function TransactionsTable() {
  const [page, setPage] = useState(1)

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
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>From/To</TableHead>
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
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
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
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

