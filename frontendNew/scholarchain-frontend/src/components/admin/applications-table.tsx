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
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, CheckCircle, XCircle } from "lucide-react"

export function ApplicationsTable() {
  const [page, setPage] = useState(1)

  // Sample application data
  const applications = [
    {
      id: "APP12345",
      applicant: "Emily Davis",
      amount: "$3,000.00",
      purpose: "Tuition",
      university: "Stanford University",
      date: "2023-03-15",
      status: "Pending Review",
      riskScore: "Low",
    },
    {
      id: "APP12346",
      applicant: "James Wilson",
      amount: "$2,500.00",
      purpose: "Books & Supplies",
      university: "MIT",
      date: "2023-03-14",
      status: "Pending Review",
      riskScore: "Medium",
    },
    {
      id: "APP12347",
      applicant: "Sophia Martinez",
      amount: "$4,000.00",
      purpose: "Tuition",
      university: "Harvard University",
      date: "2023-03-13",
      status: "Pending Review",
      riskScore: "Low",
    },
    {
      id: "APP12348",
      applicant: "Daniel Thompson",
      amount: "$3,500.00",
      purpose: "Living Expenses",
      university: "UC Berkeley",
      date: "2023-03-12",
      status: "Under Review",
      riskScore: "Medium",
    },
    {
      id: "APP12349",
      applicant: "Olivia Johnson",
      amount: "$5,000.00",
      purpose: "Tuition",
      university: "Yale University",
      date: "2023-03-11",
      status: "Approved",
      riskScore: "Low",
    },
    {
      id: "APP12350",
      applicant: "William Brown",
      amount: "$2,800.00",
      purpose: "Books & Supplies",
      university: "Princeton University",
      date: "2023-03-10",
      status: "Rejected",
      riskScore: "High",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search applications..." className="h-9 w-[250px] md:w-[300px]" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <CheckCircle className="h-4 w-4" />
            Approve Selected
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <XCircle className="h-4 w-4" />
            Reject Selected
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Input type="checkbox" className="h-4 w-4" />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Purpose</TableHead>
              <TableHead className="hidden md:table-cell">University</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <Input type="checkbox" className="h-4 w-4" />
                </TableCell>
                <TableCell className="font-medium">{application.id}</TableCell>
                <TableCell>{application.applicant}</TableCell>
                <TableCell>{application.amount}</TableCell>
                <TableCell className="hidden md:table-cell">{application.purpose}</TableCell>
                <TableCell className="hidden md:table-cell">{application.university}</TableCell>
                <TableCell className="hidden md:table-cell">{application.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      application.status === "Approved"
                        ? "success"
                        : application.status === "Rejected"
                          ? "destructive"
                          : application.status === "Under Review"
                            ? "default"
                            : "secondary"
                    }
                  >
                    {application.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      application.riskScore === "Low"
                        ? "success"
                        : application.riskScore === "Medium"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {application.riskScore}
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
                      <DropdownMenuItem>Approve</DropdownMenuItem>
                      <DropdownMenuItem>Reject</DropdownMenuItem>
                      <DropdownMenuItem>Request More Info</DropdownMenuItem>
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

