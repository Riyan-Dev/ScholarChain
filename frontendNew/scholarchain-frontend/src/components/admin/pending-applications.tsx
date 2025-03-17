"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

export function PendingApplications() {
  // Sample application data
  const applications = [
    {
      id: "APP12345",
      applicant: "Emily Davis",
      amount: "$3,000.00",
      date: "2023-03-15",
      status: "Pending Review",
    },
    {
      id: "APP12346",
      applicant: "James Wilson",
      amount: "$2,500.00",
      date: "2023-03-14",
      status: "Pending Review",
    },
    {
      id: "APP12347",
      applicant: "Sophia Martinez",
      amount: "$4,000.00",
      date: "2023-03-13",
      status: "Pending Review",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>Recent loan applications awaiting review</CardDescription>
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
              <TableHead>Applicant</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">{application.id}</TableCell>
                <TableCell>{application.applicant}</TableCell>
                <TableCell>{application.amount}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{application.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

