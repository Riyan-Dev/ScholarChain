"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  HelpCircle,
  Info,
  Layers,
  LineChart,
  Loader2,
  Shield,
  ThumbsUp,
  User,
  XCircle,
} from "lucide-react"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for the application
const applicationData = {
  id: "APP-2023-1234",
  status: "Approved", // "Pending", "Approved", "Rejected"
  totalRiskScore: 72,
  riskAssessment: [
    {
      type: "credit_risk",
      score: 65,
      weight: 0.4,
      factors: [
        { name: "Credit History", value: "Limited", impact: "negative" },
        { name: "Outstanding Debts", value: "Low", impact: "positive" },
        { name: "Payment History", value: "Good", impact: "positive" },
      ],
    },
    {
      type: "income_stability",
      score: 80,
      weight: 0.3,
      factors: [
        { name: "Employment Duration", value: "2 years", impact: "neutral" },
        { name: "Income Source", value: "Stable", impact: "positive" },
        { name: "Income Level", value: "Adequate", impact: "positive" },
      ],
    },
    {
      type: "education_profile",
      score: 85,
      weight: 0.2,
      factors: [
        { name: "Academic Performance", value: "3.8 GPA", impact: "positive" },
        { name: "Program Relevance", value: "High", impact: "positive" },
        { name: "Institution Ranking", value: "Top 50", impact: "positive" },
      ],
    },
    {
      type: "repayment_capacity",
      score: 60,
      weight: 0.1,
      factors: [
        { name: "Debt-to-Income Ratio", value: "45%", impact: "negative" },
        { name: "Disposable Income", value: "Limited", impact: "negative" },
        { name: "Financial Dependents", value: "None", impact: "positive" },
      ],
    },
  ],
  repaymentPlan: {
    loanAmount: 15000,
    startDate: "2023-09-01",
    endDate: "2025-09-01",
    frequency: "Monthly",
    installmentAmount: 750,
    totalPayments: 24,
    interestRate: 5.5,
    reasoning:
      "Based on the applicant's income stability and academic performance, a 24-month repayment plan with monthly installments of $750 is recommended. This represents approximately 25% of the reported monthly income, which is within acceptable limits for financial sustainability.",
  },
  applicationDate: "2023-07-15",
  reviewDate: "2023-07-20",
  reviewedBy: "Jane Smith",
  personal_info: {
    full_name: "John Doe",
    dob: "1998-05-12",
    gender: "male",
    nationality: "United States",
    marital_status: "single",
    phone_number: "+1 (555) 123-4567",
    email_address: "john.doe@example.com",
    residential_address: "123 College Ave, Apt 4B, Boston, MA 02115",
    permanent_address: "456 Main St, Springfield, IL 62701",
  },
  financial_info: {
    total_family_income: "$85,000",
    other_income_sources: "Part-time job: $12,000/year",
    outstanding_loans_or_debts: "Student loan: $5,000, Credit card: $1,200",
  },
  academic_info: {
    current_education_level: "bachelors",
    college_or_university: "Boston University",
    student_id: "BU20201234",
    program_name_degree: "Computer Science",
    duration_of_course: "4 years",
    year_or_semester: "3rd year, 2nd semester",
    gpa: "3.8/4.0",
    achievements_or_awards: "Dean's List (2021, 2022), Hackathon Winner (2022)",
  },
  loan_details: {
    loan_amount_requested: "$15,000",
    purpose_of_loan: "Tuition fees and educational materials",
    proposed_repayment_period: "24 months",
    preferred_repayment_frequency: "monthly",
  },
  references: [
    {
      name: "Dr. Sarah Johnson",
      designation: "Associate Professor, Computer Science",
      contact_details: "sarah.johnson@bu.edu, (555) 987-6543",
      comments: "John is an exceptional student with great potential.",
    },
    {
      name: "Michael Brown",
      designation: "Tech Internship Supervisor",
      contact_details: "m.brown@techcorp.com, (555) 456-7890",
      comments: "John demonstrated excellent problem-solving skills during his internship.",
    },
  ],
}

export default function ApplicationReviewPage() {
  const params = useParams()
  const applicationId = params.id
  const [isLoading, setIsLoading] = useState(false)

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

  // Calculate weighted risk score
  const calculateWeightedScore = (riskItem: any) => {
    return riskItem.score * riskItem.weight
  }

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy")
  }

  // Get risk color
  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  // Get impact badge
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "positive":
        return <Badge className="bg-green-100 text-green-800">Positive</Badge>
      case "negative":
        return <Badge className="bg-red-100 text-red-800">Negative</Badge>
      case "neutral":
      default:
        return <Badge className="bg-gray-100 text-gray-800">Neutral</Badge>
    }
  }

  const handleApprove = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Show success message or redirect
    }, 1500)
  }

  const handleReject = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Show success message or redirect
    }, 1500)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <a href="/admin/applications">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </a>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Application Review</h1>
            <p className="text-muted-foreground">
              ID: {applicationId} • Submitted on {formatDate(applicationData.applicationDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Application Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleApprove}>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                Approve Application
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReject}>
                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                Reject Application
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                View Full Application
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {/* Status Card */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 pb-8 pt-6 text-white">
            <CardTitle className="flex items-center justify-between">
              <span>Application Status</span>
              {getStatusBadge(applicationData.status)}
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Last updated on {formatDate(applicationData.reviewDate)}
            </CardDescription>
          </CardHeader>
          <CardContent className="-mt-6 rounded-t-xl bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt={applicationData.personal_info.full_name}
                  />
                  <AvatarFallback>
                    {applicationData.personal_info.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{applicationData.personal_info.full_name}</p>
                  <p className="text-sm text-muted-foreground">{applicationData.personal_info.email_address}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Reviewed by</p>
                <p className="text-sm text-muted-foreground">{applicationData.reviewedBy}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-white px-6 pb-6 pt-0">
            <Button
              className="w-full"
              variant={applicationData.status.toLowerCase() === "pending" ? "default" : "outline"}
            >
              {applicationData.status.toLowerCase() === "pending" ? "Review Now" : "View Details"}
            </Button>
          </CardFooter>
        </Card>

        {/* Risk Score Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Risk Assessment</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Overall risk score based on weighted factors</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>Overall risk evaluation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-8 border-muted p-2">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">{applicationData.totalRiskScore}</span>
                  <span className="text-sm text-muted-foreground">Risk Score</span>
                </div>
                <svg className="absolute -rotate-90" width="150" height="150" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke={
                      applicationData.totalRiskScore >= 80
                        ? "#10b981"
                        : applicationData.totalRiskScore >= 60
                          ? "#f59e0b"
                          : "#ef4444"
                    }
                    strokeWidth="12"
                    strokeDasharray="339.292"
                    strokeDashoffset={339.292 * (1 - applicationData.totalRiskScore / 100)}
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              {applicationData.riskAssessment.map((risk) => (
                <div key={risk.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: risk.score >= 80 ? "#10b981" : risk.score >= 60 ? "#f59e0b" : "#ef4444",
                      }}
                    />
                    <span className="text-sm capitalize">{risk.type.replace("_", " ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getRiskColor(risk.score)}`}>{risk.score}</span>
                    <span className="text-xs text-muted-foreground">({(risk.weight * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" size="sm">
              <LineChart className="mr-2 h-4 w-4" />
              View Detailed Analysis
            </Button>
          </CardFooter>
        </Card>

        {/* Repayment Plan Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Repayment Plan</span>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Repayment Reasoning</h4>
                    <p className="text-sm">{applicationData.repaymentPlan.reasoning}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardTitle>
            <CardDescription>Proposed loan repayment schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Loan Amount</span>
                <span className="font-medium">${applicationData.repaymentPlan.loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Installment</span>
                <span className="font-medium">${applicationData.repaymentPlan.installmentAmount}/month</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-medium">{applicationData.repaymentPlan.totalPayments} months</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Interest Rate</span>
                <span className="font-medium">{applicationData.repaymentPlan.interestRate}%</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Period</span>
                <span className="font-medium">
                  {formatDate(applicationData.repaymentPlan.startDate)} -{" "}
                  {formatDate(applicationData.repaymentPlan.endDate)}
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: "0%" }} />
              </div>
              <span className="text-xs text-muted-foreground">0% Complete</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              View Payment Schedule
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="risk-assessment" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="risk-assessment">
            <Shield className="mr-2 h-4 w-4" />
            Risk Assessment
          </TabsTrigger>
          <TabsTrigger value="repayment-plan">
            <CreditCard className="mr-2 h-4 w-4" />
            Repayment Plan
          </TabsTrigger>
          <TabsTrigger value="application-details">
            <FileText className="mr-2 h-4 w-4" />
            Application Details
          </TabsTrigger>
        </TabsList>

        {/* Risk Assessment Tab */}
        <TabsContent value="risk-assessment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Risk Assessment</CardTitle>
              <CardDescription>Breakdown of risk factors and their impact on the application decision</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Risk assessment breakdown with weighted scores</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Risk Category</TableHead>
                    <TableHead>Raw Score</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Weighted Score</TableHead>
                    <TableHead className="text-right">Contributing Factors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicationData.riskAssessment.map((risk) => (
                    <TableRow key={risk.type}>
                      <TableCell className="font-medium capitalize">{risk.type.replace("_", " ")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={risk.score} className="h-2 w-20" />
                          <span className={getRiskColor(risk.score)}>{risk.score}</span>
                        </div>
                      </TableCell>
                      <TableCell>{(risk.weight * 100).toFixed(0)}%</TableCell>
                      <TableCell className={getRiskColor(risk.score)}>
                        {calculateWeightedScore(risk).toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              View Factors
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[300px]">
                            <DropdownMenuLabel>Contributing Factors</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {risk.factors.map((factor, index) => (
                              <DropdownMenuItem key={index} className="flex justify-between">
                                <span>
                                  {factor.name}: {factor.value}
                                </span>
                                {getImpactBadge(factor.impact)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total Risk Score
                    </TableCell>
                    <TableCell colSpan={2} className={`font-bold ${getRiskColor(applicationData.totalRiskScore)}`}>
                      {applicationData.totalRiskScore}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Repayment Plan Tab */}
        <TabsContent value="repayment-plan" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Repayment Plan Details</CardTitle>
              <CardDescription>Comprehensive breakdown of the proposed repayment schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Loan Summary</h3>
                  <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Principal Amount</span>
                      <span className="font-medium">${applicationData.repaymentPlan.loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interest Rate</span>
                      <span className="font-medium">{applicationData.repaymentPlan.interestRate}% APR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Payments</span>
                      <span className="font-medium">{applicationData.repaymentPlan.totalPayments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Frequency</span>
                      <span className="font-medium">{applicationData.repaymentPlan.frequency}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Interest</span>
                      <span className="font-medium">
                        $
                        {(
                          applicationData.repaymentPlan.installmentAmount *
                            applicationData.repaymentPlan.totalPayments -
                          applicationData.repaymentPlan.loanAmount
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Repayment</span>
                      <span className="font-medium">
                        $
                        {(
                          applicationData.repaymentPlan.installmentAmount * applicationData.repaymentPlan.totalPayments
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Payment Schedule</h3>
                  <div className="rounded-lg border">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Timeline</span>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {applicationData.repaymentPlan.totalPayments} months
                      </Badge>
                    </div>
                    <div className="p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Start Date</p>
                          <p className="font-medium">{formatDate(applicationData.repaymentPlan.startDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">End Date</p>
                          <p className="font-medium">{formatDate(applicationData.repaymentPlan.endDate)}</p>
                        </div>
                      </div>

                      <div className="relative mb-6 mt-8">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-muted" />
                        <div className="relative flex justify-between">
                          <div className="flex flex-col items-center">
                            <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <span className="text-xs">1</span>
                            </div>
                            <span className="mt-1 text-xs">
                              {format(new Date(applicationData.repaymentPlan.startDate), "MMM yyyy")}
                            </span>
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                              <span className="text-xs">
                                {Math.floor(applicationData.repaymentPlan.totalPayments / 2)}
                              </span>
                            </div>
                            <span className="mt-1 text-xs">
                              {format(
                                new Date(
                                  new Date(applicationData.repaymentPlan.startDate).setMonth(
                                    new Date(applicationData.repaymentPlan.startDate).getMonth() +
                                      Math.floor(applicationData.repaymentPlan.totalPayments / 2),
                                  ),
                                ),
                                "MMM yyyy",
                              )}
                            </span>
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                              <span className="text-xs">{applicationData.repaymentPlan.totalPayments}</span>
                            </div>
                            <span className="mt-1 text-xs">
                              {format(new Date(applicationData.repaymentPlan.endDate), "MMM yyyy")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Monthly Payment</span>
                          <span className="font-medium">${applicationData.repaymentPlan.installmentAmount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">First Payment Due</span>
                          <span className="font-medium">
                            {format(new Date(applicationData.repaymentPlan.startDate), "MMMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-4 text-lg font-medium">Repayment Reasoning</h3>
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm leading-relaxed">{applicationData.repaymentPlan.reasoning}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Application Details Tab */}
        <TabsContent value="application-details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Form Details</CardTitle>
              <CardDescription>Complete information submitted by the applicant</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="mb-4 grid w-full grid-cols-4">
                  <TabsTrigger value="personal">
                    <User className="mr-2 h-4 w-4" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="financial">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Financial
                  </TabsTrigger>
                  <TabsTrigger value="academic">
                    <Layers className="mr-2 h-4 w-4" />
                    Academic
                  </TabsTrigger>
                  <TabsTrigger value="loan">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Loan
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p>{applicationData.personal_info.full_name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <p>{formatDate(applicationData.personal_info.dob)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Gender</p>
                      <p className="capitalize">{applicationData.personal_info.gender}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                      <p>{applicationData.personal_info.nationality}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Marital Status</p>
                      <p className="capitalize">{applicationData.personal_info.marital_status}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                      <p>{applicationData.personal_info.phone_number}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                      <p>{applicationData.personal_info.email_address}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Residential Address</p>
                    <p>{applicationData.personal_info.residential_address}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Permanent Address</p>
                    <p>{applicationData.personal_info.permanent_address}</p>
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Family Income</p>
                      <p>{applicationData.financial_info.total_family_income}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Other Income Sources</p>
                      <p>{applicationData.financial_info.other_income_sources}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Outstanding Loans or Debts</p>
                    <p>{applicationData.financial_info.outstanding_loans_or_debts}</p>
                  </div>
                </TabsContent>

                <TabsContent value="academic" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Current Education Level</p>
                      <p className="capitalize">
                        {applicationData.academic_info.current_education_level.replace("_", " ")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">College or University</p>
                      <p>{applicationData.academic_info.college_or_university}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                      <p>{applicationData.academic_info.student_id}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Program Name/Degree</p>
                      <p>{applicationData.academic_info.program_name_degree}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Duration of Course</p>
                      <p>{applicationData.academic_info.duration_of_course}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Year/Semester</p>
                      <p>{applicationData.academic_info.year_or_semester}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">GPA</p>
                      <p>{applicationData.academic_info.gpa}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Achievements or Awards</p>
                      <p>{applicationData.academic_info.achievements_or_awards}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="loan" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Loan Amount Requested</p>
                      <p>{applicationData.loan_details.loan_amount_requested}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Purpose of Loan</p>
                      <p>{applicationData.loan_details.purpose_of_loan}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Proposed Repayment Period</p>
                      <p>{applicationData.loan_details.proposed_repayment_period}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Preferred Repayment Frequency</p>
                      <p className="capitalize">{applicationData.loan_details.preferred_repayment_frequency}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8">
                <h3 className="mb-4 text-lg font-medium">References</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {applicationData.references.map((reference, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                            <p>{reference.name}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Designation</p>
                            <p>{reference.designation}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Contact Details</p>
                            <p>{reference.contact_details}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Comments</p>
                            <p>{reference.comments}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" disabled={isLoading}>
          Request Additional Information
        </Button>
        <Button variant="destructive" onClick={handleReject} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Reject Application
            </>
          )}
        </Button>
        <Button onClick={handleApprove} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ThumbsUp className="mr-2 h-4 w-4" />
              Approve Application
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

