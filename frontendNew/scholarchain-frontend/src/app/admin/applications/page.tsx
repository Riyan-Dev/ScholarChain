"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAllApplications,
  Application,
} from "@/services/application.service";

export default function ApplicationsListPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Application | null;
    direction: "ascending" | "descending";
  }>({ key: null, direction: "ascending" });
  const [currentTab, setCurrentTab] = useState("all"); // Track current tab
  const applicationsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAllApplications();
        console.log("Fetched data:", data); // Keep for debugging

        const applicationsWithRiskScore = data.filter(
          (app) =>
            app.riskScore !== undefined &&
            app.riskScore !== null &&
            app.riskScore !== "N/A"
        );
        setApplications(applicationsWithRiskScore);
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching applications."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Filtering, Sorting, and Pagination Logic ---

  // 1. Filtering (by search query)
  const filteredApplications = applications.filter((app) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      app.applicant.toLowerCase().includes(searchLower) ||
      app.id.toLowerCase().includes(searchLower) ||
      app.email.toLowerCase().includes(searchLower)
    );
  });

  // 2. Filtering (by tab - "pending", "approved", "rejected")
  const tabFilteredApplications =
    currentTab === "all"
      ? filteredApplications
      : filteredApplications.filter(
          (app) => app.status.toLowerCase() === currentTab
        );

  // 3. Sorting
  const sortedApplications = [...tabFilteredApplications]; // Sort *after* tab filtering
  if (sortConfig.key) {
    sortedApplications.sort((a, b) => {
      const aValue = sortConfig.key ? a[sortConfig.key] : undefined;
      const bValue = sortConfig.key ? b[sortConfig.key] : undefined;

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "ascending"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        return 0;
      }
    });
  }

  // 4. Pagination
  const startIndex = (currentPage - 1) * applicationsPerPage;
  const endIndex = startIndex + applicationsPerPage;
  const paginatedApplications = sortedApplications.slice(startIndex, endIndex);

  // --- Helper Functions ---

  const requestSort = (key: keyof Application) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const getRiskColor = (score: number | null | "N/A" | undefined) => {
    if (typeof score === "number") {
      if (score >= 80) return "text-green-600";
      if (score >= 60) return "text-yellow-600";
    }
    return "text-red-600";
  };

  // --- Event Handlers ---

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(
        prevPage + 1,
        Math.ceil(sortedApplications.length / applicationsPerPage)
      )
    );
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleTabChange = (tabValue: string) => {
    setCurrentTab(tabValue); // Update currentTab
    setCurrentPage(1);
    setSortConfig({ key: null, direction: "ascending" });
  };

  // --- Render ---
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Loan Applications
          </h1>
          <p className="text-muted-foreground">
            Manage and review student loan applications
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        className="mb-6"
        onValueChange={handleTabChange}
        value={currentTab}
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList>
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
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
                <DropdownMenuCheckboxItem
                  checked={
                    sortConfig.key === "submittedDate" &&
                    sortConfig.direction === "descending"
                  }
                  onCheckedChange={() => requestSort("submittedDate")}
                >
                  Date (Newest first)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={
                    sortConfig.key === "submittedDate" &&
                    sortConfig.direction === "ascending"
                  }
                  onCheckedChange={() => requestSort("submittedDate")}
                >
                  Date (Oldest first)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={
                    sortConfig.key === "amount" &&
                    sortConfig.direction === "descending"
                  }
                  onCheckedChange={() => requestSort("amount")}
                >
                  Amount (High to low)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={
                    sortConfig.key === "amount" &&
                    sortConfig.direction === "ascending"
                  }
                  onCheckedChange={() => requestSort("amount")}
                >
                  Amount (Low to high)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={
                    sortConfig.key === "riskScore" &&
                    sortConfig.direction === "descending"
                  }
                  onCheckedChange={() => requestSort("riskScore")}
                >
                  Risk Score (High to low)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={
                    sortConfig.key === "riskScore" &&
                    sortConfig.direction === "ascending"
                  }
                  onCheckedChange={() => requestSort("riskScore")}
                >
                  Risk Score (Low to high)
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* --- All Applications Tab --- */}
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle>All Applications</CardTitle>
                <CardDescription>
                  {isLoading
                    ? "Loading applications..."
                    : error
                      ? `Error: ${error}`
                      : `${tabFilteredApplications.length} applications found`}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-8 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-10" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : error ? (
                <div className="p-4 text-red-500">Error: {error}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer px-2"
                        onClick={() => requestSort("applicant")}
                      >
                        <div className="flex items-center gap-1">
                          Applicant
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer px-2"
                        onClick={() => requestSort("amount")}
                      >
                        <div className="flex items-center gap-1">
                          Amount
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer px-2"
                        onClick={() => requestSort("status")}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer px-2"
                        onClick={() => requestSort("riskScore")}
                      >
                        <div className="flex items-center gap-1">
                          Risk Score
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer px-2"
                        onClick={() => requestSort("submittedDate")}
                      >
                        <div className="flex items-center gap-1">
                          Submitted
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="px-2 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No applications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="pl-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {application.applicant
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {application.applicant}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {application.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-2">
                            ${application.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="px-2">
                            {getStatusBadge(application.status)}
                          </TableCell>
                          <TableCell className="px-2">
                            <span
                              className={getRiskColor(application.riskScore)}
                            >
                              {application.riskScore}
                            </span>
                          </TableCell>
                          <TableCell className="px-2">
                            {formatDate(application.submittedDate)}
                          </TableCell>
                          <TableCell className="px-2 text-right">
                            <Button variant="ghost" size="icon" asChild>
                              <Link
                                href={`/admin/applications/${application.id}`}
                              >
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
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-muted-foreground text-sm">
                Showing <strong>{paginatedApplications.length}</strong> of{" "}
                <strong>{tabFilteredApplications.length}</strong> applications
                (Total: {applications.length})
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={endIndex >= sortedApplications.length}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* --- Pending Applications Tab --- */}
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>
                  {isLoading
                    ? "Loading pending applications..."
                    : error
                      ? `Error: ${error}`
                      : `${
                          tabFilteredApplications.length
                        } pending applications found`}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-8 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-10" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : error ? (
                <div className="p-4 text-red-500">Error: {error}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-2">Applicant</TableHead>
                      <TableHead className="px-2">
                        <div className="flex items-center gap-1">
                          Amount
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="px-2">
                        <div className="flex items-center gap-1">
                          Status
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="px-2">
                        <div className="flex items-center gap-1">
                          Risk Score
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="px-2">
                        <div className="flex items-center gap-1">
                          Submitted
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="px-2 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No pending applications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="pl-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src="/placeholder.svg?height=32&width=32"
                                  alt={application.applicant}
                                />
                                <AvatarFallback>
                                  {application.applicant
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {application.applicant}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {application.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-2">
                            ${application.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="px-2">
                            {getStatusBadge(application.status)}
                          </TableCell>
                          <TableCell className="px-2">
                            <span
                              className={getRiskColor(application.riskScore)}
                            >
                              {application.riskScore}
                            </span>
                          </TableCell>
                          <TableCell className="px-2">
                            {formatDate(application.submittedDate)}
                          </TableCell>
                          <TableCell className="px-2 text-right">
                            <Button variant="ghost" size="icon" asChild>
                              <Link
                                href={`/admin/applications/${application.id}`}
                              >
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
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-muted-foreground text-sm">
                Showing <strong>{paginatedApplications.length}</strong> of{" "}
                <strong>{tabFilteredApplications.length}</strong> pending
                applications (Total:{" "}
                {
                  applications.filter(
                    (app) => app.status.toLowerCase() === "pending"
                  ).length
                }
                )
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={endIndex >= sortedApplications.length}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* --- Approved Applications Tab --- */}
        <TabsContent value="approved" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle>Approved Applications</CardTitle>
                <CardDescription>
                  {isLoading
                    ? "Loading approved applications..."
                    : error
                      ? `Error: ${error}`
                      : `${
                          tabFilteredApplications.length
                        } approved applications found`}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-8 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-10" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : error ? (
                <div className="p-4 text-red-500">Error: {error}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-2">Applicant</TableHead>
                      <TableHead className="px-2">
                        <div className="flex items-center gap-1">
                          Amount
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="px-2">
                        <div className="flex items-center gap-1">
                          Status
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="px-2">
                        <div className="flex items-center gap-1">
                          Risk Score
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="px-2">
                        <div className="flex items-center gap-1">
                          Submitted
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="px-2 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No approved applications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="pl-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src="/placeholder.svg?height=32&width=32"
                                  alt={application.applicant}
                                />
                                <AvatarFallback>
                                  {application.applicant
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {application.applicant}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {application.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-2">
                            ${application.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="px-2">
                            {getStatusBadge(application.status)}
                          </TableCell>
                          <TableCell className="px-2">
                            <span
                              className={getRiskColor(application.riskScore)}
                            >
                              {application.riskScore}
                            </span>
                          </TableCell>
                          <TableCell className="px-2">
                            {formatDate(application.submittedDate)}
                          </TableCell>
                          <TableCell className="px-2 text-right">
                            <Button variant="ghost" size="icon" asChild>
                              <Link
                                href={`/admin/applications/${application.id}`}
                              >
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
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-muted-foreground text-sm">
                Showing <strong>{paginatedApplications.length}</strong> of{" "}
                <strong>{tabFilteredApplications.length}</strong> approved
                applications (Total:{" "}
                {
                  applications.filter(
                    (app) => app.status.toLowerCase() === "approved"
                  ).length
                }
                )
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={endIndex >= sortedApplications.length}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* --- Rejected Applications Tab --- */}
        <TabsContent value="rejected" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle>Rejected Applications</CardTitle>
                <CardDescription>
                  {isLoading
                    ? "Loading rejected applications..."
                    : error
                      ? `Error: ${error}`
                      : `${
                          tabFilteredApplications.length
                        } rejected applications found`}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-8 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-10" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : error ? (
                <div className="p-4 text-red-500">Error: {error}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-2">Applicant</TableHead>
                      <TableHead className="px-2">
                        <div className="flex items-center gap-1">
                          Amount
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="px-2">
                        <div className="flex items-center gap-1">
                          Status
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="px-2">
                        <div className="flex items-center gap-1">
                          Risk Score
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="px-2">
                        <div className="flex items-center gap-1">
                          Submitted
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="px-2 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No rejected applications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="pl-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src="/placeholder.svg?height=32&width=32"
                                  alt={application.applicant}
                                />
                                <AvatarFallback>
                                  {application.applicant
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {application.applicant}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {application.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-2">
                            ${application.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="px-2">
                            {getStatusBadge(application.status)}
                          </TableCell>
                          <TableCell className="px-2">
                            <span
                              className={getRiskColor(application.riskScore)}
                            >
                              {application.riskScore}
                            </span>
                          </TableCell>
                          <TableCell className="px-2">
                            {formatDate(application.submittedDate)}
                          </TableCell>
                          <TableCell className="px-2 text-right">
                            <Button variant="ghost" size="icon" asChild>
                              <Link
                                href={`/admin/applications/${application.id}`}
                              >
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
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-muted-foreground text-sm">
                Showing <strong>{paginatedApplications.length}</strong> of{" "}
                <strong>{tabFilteredApplications.length}</strong> rejected
                applications (Total:{" "}
                {
                  applications.filter(
                    (app) => app.status.toLowerCase() === "rejected"
                  ).length
                }
                )
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={endIndex >= sortedApplications.length}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
