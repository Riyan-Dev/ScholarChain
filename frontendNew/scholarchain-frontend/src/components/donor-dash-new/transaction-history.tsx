"use client"

import { useState } from "react"
import { ArrowDownUp, ArrowUpDown, ChevronDown, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  username: string
  amount: number
  action: string
  timestamp: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(
      (tx) =>
        (filterAction ? tx.action === filterAction : true) &&
        (searchTerm
          ? tx.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.amount.toString().includes(searchTerm)
          : true),
    )
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View all your token transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Search transactions..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto flex items-center gap-1">
                  Filter
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem checked={filterAction === null} onCheckedChange={() => setFilterAction(null)}>
                  All Actions
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterAction === "buy"}
                  onCheckedChange={() => setFilterAction(filterAction === "buy" ? null : "buy")}
                >
                  Buy
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterAction === "debit"}
                  onCheckedChange={() => setFilterAction(filterAction === "debit" ? null : "debit")}
                >
                  Donation
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={toggleSortOrder} className="flex items-center gap-1">
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === "desc" ? "Newest" : "Oldest"}
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.action === "buy" ? "outline" : "default"}>
                        {tx.action === "buy" ? "Purchase" : "Donation"}
                      </Badge>
                    </TableCell>
                    <TableCell>{tx.username || "Self"}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`flex items-center justify-end gap-1 ${tx.action === "debit" ? "text-red-500" : "text-green-500"}`}
                      >
                        {tx.action === "debit" ? <ArrowDownUp className="h-4 w-4" /> : null}
                        {tx.amount.toLocaleString()} Tokens
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

