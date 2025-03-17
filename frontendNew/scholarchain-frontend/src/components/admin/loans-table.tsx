"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, MoreHorizontal, Search } from "lucide-react"

export function LoansTable() {
  const [page, setPage] = useState(1)

  // Sample loan data
  const loans = [
    {
      id: "LN78901",
      borrower: "Michael Smith",
      amount: "$3,500.00",
      disbursementDate: "2022-10-15",
      dueDate: "2023-10-15",
      status: "Active",
      repaymentStatus: "On Time",
    },
    {
      id: "LN78902",
      borrower: "Jessica Brown",
      amount: "$2,500.00",
      disbursementDate: "2022-11-01",
      dueDate: "2023-11-01",
      status: "Active",
      repaymentStatus: "On Time",
    },
    {
      id: "LN78903",
      borrower: "Robert Johnson",
      amount: "$4,200.00",
      disbursementDate: "2022-09-20",
      dueDate: "2023-09-20",
      status: "Active",
      repaymentStatus: "Late",
    },
    {
      id: "LN78904",
      borrower: "Sarah Williams",
      amount: "$3,000.00",
      disbursementDate: "2022-12-05",
      dueDate: "2023-12-05",
      status: "Active",
      repaymentStatus: "On Time",
    },
    {
      id: "LN78905",
      borrower: "David Miller",
      amount: "$5,000.00",
      disbursementDate: "2022-08-15",
      dueDate: "2023-08-15",
      status: "Active",
      repaymentStatus: "At Risk",
    },
    {
      id: "LN78906",
      borrower: "Jennifer Davis",
      amount: "$2,800.00",
      disbursementDate: "2022-07-10",
      dueDate: "2023-07-10",
      status: "Completed",
      repaymentStatus: "Paid",
    },
    {
      id: "LN78907",
      borrower: "Thomas Wilson",
      amount: "$3,200.00",
      disbursementDate: "2022-06-20",
      dueDate: "2023-06-20",
      status: "Defaulted",
      repaymentStatus: "Defaulted",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search loans..." className="h-9 w-[250px] md:w-[300px]" />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loan ID</TableHead>
              <TableHead>Borrower</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Disbursement Date</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Repayment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="font-medium">{loan.id}</TableCell>
                <TableCell>{loan.borrower}</TableCell>
                <TableCell>{loan.amount}</TableCell>
                <TableCell className="hidden md:table-cell">{loan.disbursementDate}</TableCell>
                <TableCell className="hidden md:table-cell">{loan.dueDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      loan.status === "Active" ? "default" : loan.status === "Completed" ? "success" : "destructive"
                    }
                  >
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      loan.repaymentStatus === "On Time"
                        ? "success"
                        : loan.repaymentStatus === "Paid"
                          ? "outline"
                          : loan.repaymentStatus === "Late"
                            ? "secondary"
                            : "destructive"
                    }
                  >
                    {loan.repaymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Loan</DropdownMenuItem>
                      <DropdownMenuItem>View Repayments</DropdownMenuItem>
                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

