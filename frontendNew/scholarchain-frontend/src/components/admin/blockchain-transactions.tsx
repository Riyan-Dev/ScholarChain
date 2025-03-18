"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

export function BlockchainTransactions() {
  const [page, setPage] = useState(1)

  // Sample blockchain transaction data
  const transactions = [
    {
      hash: "0x1a2b...3c4d",
      type: "Donation",
      amount: "0.5 ETH",
      status: "Confirmed",
      date: "2023-03-15",
      block: "16234567",
      from: "0xabc...def",
      to: "0x123...456",
    },
    {
      hash: "0x5e6f...7g8h",
      type: "Loan Disbursement",
      amount: "0.2 ETH",
      status: "Confirmed",
      date: "2023-03-14",
      block: "16234560",
      from: "0x123...456",
      to: "0x789...012",
    },
    {
      hash: "0x9i0j...1k2l",
      type: "Smart Contract Call",
      amount: "0.01 ETH",
      status: "Confirmed",
      date: "2023-03-13",
      block: "16234555",
      from: "0x123...456",
      to: "0xcon...tract",
    },
    {
      hash: "0x3m4n...5o6p",
      type: "Repayment",
      amount: "0.1 ETH",
      status: "Pending",
      date: "2023-03-12",
      block: "Pending",
      from: "0x789...012",
      to: "0x123...456",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hash</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Block</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.hash}>
                <TableCell className="font-medium">{transaction.hash}</TableCell>
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
                  <Badge variant={transaction.status === "Confirmed" ? "success" : "secondary"}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{transaction.block}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Etherscan
                  </Button>
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

