"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

export function UpcomingRepayments() {
  // Sample repayment data
  const repayments = [
    {
      id: "LN78901",
      borrower: "Michael Smith",
      amount: "$750.00",
      dueDate: "2023-03-20",
      status: "On Time",
    },
    {
      id: "LN78902",
      borrower: "Jessica Brown",
      amount: "$500.00",
      dueDate: "2023-03-22",
      status: "On Time",
    },
    {
      id: "LN78903",
      borrower: "Robert Johnson",
      amount: "$1,200.00",
      dueDate: "2023-03-25",
      status: "At Risk",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Repayments</CardTitle>
          <CardDescription>Repayments due in the next 7 days</CardDescription>
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
              <TableHead>Loan ID</TableHead>
              <TableHead>Borrower</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repayments.map((repayment) => (
              <TableRow key={repayment.id}>
                <TableCell className="font-medium">{repayment.id}</TableCell>
                <TableCell>{repayment.borrower}</TableCell>
                <TableCell>{repayment.amount}</TableCell>
                <TableCell>{repayment.dueDate}</TableCell>
                <TableCell>
                  <Badge variant={repayment.status === "On Time" ? "success" : "destructive"}>{repayment.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

