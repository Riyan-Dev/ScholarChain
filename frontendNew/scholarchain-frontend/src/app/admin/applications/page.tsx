"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  PlusCircle,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for applications list
const applications = [
  {
    id: "APP-2023-1234",
    applicant: "John Doe",
    email: "john.doe@example.com",
    amount: 15000,
    purpose: "Tuition fees",
    status: "Approved",
    riskScore: 72,
    submittedDate: "2023-07-15",
  },
  {
    id: "APP-2023-1235",
    applicant: "Jane Smith",
    email: "jane.smith@example.com",
    amount: 8000,
    purpose: "Educational materials",
    status: "Pending",
    riskScore: 65,
    submittedDate: "2023-07-18",
  },
  {
    id: "APP-2023-1236",
    applicant: "Michael Johnson",
    email: "michael.j@example.com",
    amount: 12000,
    purpose: "Tuition and accommodation",
    status: "Rejected",
    riskScore: 45,
    submittedDate: "2023-07-10",
  },
  {
    id: "APP-2023-1237",
    applicant: "Emily Williams",
    email: "emily.w@example.com",
    amount: 10000,
    purpose: "Semester fees",
    status: "Approved",
    riskScore: 82,
    submittedDate: "2023-07-05",
  },
  {
    id: "APP-2023-1238",
    applicant: "David Brown",
    email: "david.b@example.com",
    amount: 7500,
    purpose: "Course materials",
    status: "Pending",
    riskScore: 68,
    submittedDate: "2023-07-20",
  },
]

export default function ApplicationsListPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get risk color
  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  // Filter applications based on search query
  const filteredApplications = applications.filter(
    (app) =>
      app.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Loan Applications</h1>
          <p className="text-muted-foreground">Manage and review student loan applications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList>
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Date (Newest first)</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Date (Oldest first)</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Amount (High to low)</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Amount (Low to high)</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Risk Score (High to low)</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle>All Applications</CardTitle>
                <CardDescription>{filteredApplications.length} applications found</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">
                      <div className="flex items-center gap-1">
                        Application ID
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Amount
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Status
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Risk Score
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Submitted
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No applications found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={application.applicant} />
                              <AvatarFallback>
                                {application.applicant
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{application.applicant}</p>
                              <p className="text-xs text-muted-foreground">{application.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${application.amount.toLocaleString()}</TableCell>
                        <TableCell>{application.purpose}</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell>
                          <span className={getRiskColor(application.riskScore)}>{application.riskScore}</span>
                        </TableCell>
                        <TableCell>{formatDate(application.submittedDate)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/applications/${application.id}`}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{filteredApplications.length}</strong> of <strong>{applications.length}</strong>{" "}
                applications
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Other tabs would have similar content but filtered by status */}
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Similar table but filtered for pending applications */}
              <p className="text-center text-muted-foreground">Pending applications would be shown here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Approved Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Similar table but filtered for approved applications */}
              <p className="text-center text-muted-foreground">Approved applications would be shown here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Similar table but filtered for rejected applications */}
              <p className="text-center text-muted-foreground">Rejected applications would be shown here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

