/* eslint-disable prettier/prettier */
"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  HelpCircle,
  Info,
  Layers,
  Loader2,
  Pencil,
  Shield,
  ThumbsUp,
  User,
  XCircle,
} from "lucide-react"
import { format, differenceInMonths, differenceInWeeks, differenceInQuarters } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MonthYearPicker } from "@/components/ui/month-year-picker"

// Import the service functions and types
import {
  getApplicationDetailsById,
  type ApplicationDetails,
  fetchApplicationDetails,
  type RiskAssessment,
  type RiskCategory,
  type RepaymentPlan,
  verifyApplication,
  updateRepaymentPlan,
} from "@/services/application.service"
import config from "@/config/config"

interface RiskData {
  risk_assessment: RiskAssessment | null
  plan: RepaymentPlan | null
  total_score: number | null
}

const calculateInstallmentAmount = (values: {
  total_loan_amount: number;
  start_date: Date; // Change to Date
  end_date: Date;   // Change to Date
  repayment_frequency: string;
}) => {
  const { total_loan_amount, start_date, end_date, repayment_frequency } = values;

  // No need to check for empty strings, as Date objects will be handled below
  if (!total_loan_amount || !repayment_frequency) {
    return 0;
  }

  // Check if start_date and end_date are valid Date objects
  if (!(start_date instanceof Date) || !(end_date instanceof Date) || isNaN(start_date.getTime()) || isNaN(end_date.getTime())) {
    return 0;
  }

  let numberOfPayments = 0;
  switch (repayment_frequency) {
    case "annually":
      numberOfPayments = differenceInMonths(end_date, start_date) / 12; // Number of years
      break;
    case "biannually":
      numberOfPayments = differenceInMonths(end_date, start_date) / 6; // Number of 6-month periods
      break;
    case "monthly":
      numberOfPayments = differenceInMonths(end_date, start_date);
      break;
    case "quarterly":
      numberOfPayments = differenceInQuarters(end_date, start_date);
      break;
    default:
      numberOfPayments = 0;
  }
  return numberOfPayments > 0 ? total_loan_amount / numberOfPayments : 0;
};

const handleUpdatePlan = async (
  values: z.infer<typeof formSchema>,
  applicationId: string,
  riskData: RiskData,
  setRiskData: React.Dispatch<React.SetStateAction<RiskData>>,
  setIsUpdatingPlan: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!applicationId) {
    toast.error("Application ID is missing.");
    return;
  }

  setIsUpdatingPlan(true);

  try {
    // No need for formatting here; use the Date objects directly
    const updatedPlan: RepaymentPlan = {
      ...values,
      start_date: format(values.start_date, "MMM-yyyy"), // Format *after* calculation
      end_date: format(values.end_date, "MMM-yyyy"),     // Format *after* calculation
      application_id: applicationId,
      _id: riskData.plan?._id || "",
      created_at: riskData.plan?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      installment_amount: calculateInstallmentAmount(values as any), // Pass the values directly
    };

    await updateRepaymentPlan(updatedPlan);
    toast.success("Repayment plan updated successfully!");

    setRiskData((prev) => ({
      ...prev,
      plan: {
        ...prev.plan,
        ...updatedPlan,
      },
    }));
  } catch (error: any) {
    toast.error(`Error updating repayment plan: ${error.message}`);
    console.error("Error updating repayment plan:", error);
  } finally {
    setIsUpdatingPlan(false);
  }
};

type UserDocument = {
  id: string;
  label: string;
  description: string;
  url?: string | null; // Optional url property
};

export default function ApplicationReviewPage() {
  const params = useParams()
  const applicationId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [applicationData, setApplicationData] = useState<ApplicationDetails | null>(null)
  const [riskData, setRiskData] = useState<RiskData>({
    risk_assessment: null,
    plan: null,
    total_score: null,
  })
  const [error, setError] = useState<string | null>(null)
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false)


  const USER_DOCUMENTS: UserDocument[] = [
    { id: "CNIC", label: "CNIC", description: "National Identity Card" },
    {
      id: "gaurdian_CNIC",
      label: "Guardian CNIC",
      description: "Guardian's National Identity Card",
    },
    {
      id: "intermediate_result",
      label: "Intermediate Result",
      description: "Intermediate education certificate",
    },
    {
    id: "undergrad_transcript",
    label: "Undergrad Transcript or Enrollment Letter",
    description:
      "Provide with the latest transcript or enrollment letter (incase of first semester)",
    },
    {
      id: "bank_statements",
      label: "Bank Statements",
      description: "Last 3 months bank statements",
    },
    {
      id: "salary_slips",
      label: "Salary Slips",
      description: "Last 3 months salary slips",
    },
    {
      id: "gas_bills",
      label: "Gas Bills",
      description: "Recent gas utility bills",
    },
    {
      id: "electricity_bills",
      label: "Electricity Bills",
      description: "Recent electricity utility bills",
    },
    {
      id: "reference_letter",
      label: "Reference Letter",
      description: "Letter of recommendation",
    },
  ];

  USER_DOCUMENTS.forEach(doc => {
    const matchingDoc = applicationData?.documents.find(d => d.type === doc.id);
    doc.url = matchingDoc ? config.fastApi.baseUrl + matchingDoc.url : null; // Add url directly
  });

  // Moved useCallback BEFORE any conditional returns
  const boundHandleUpdatePlan = useCallback(
    (values: z.infer<typeof formSchema>) =>
      handleUpdatePlan(values, applicationId, riskData, setRiskData, setIsUpdatingPlan),
    [applicationId, riskData, setRiskData, setIsUpdatingPlan]
  )

  // const fetchData = async () => {
  //   setIsLoading(true)
  //   try {
  //     if (applicationId) {
  //       const [appDetails, fetchedRiskData] = await Promise.all([
  //         getApplicationDetailsById(applicationId),
  //         fetchApplicationDetails(applicationId),
  //       ])
  //       setApplicationData(appDetails)
  //       setRiskData({
  //         risk_assessment: fetchedRiskData.risk_assessment,
  //         plan: fetchedRiskData.plan,
  //         total_score: fetchedRiskData.total_score,
  //       })
  //     }
  //   } catch (error: any) {
  //     console.error("Error fetching data:", error)
  //     setError(error.message || "Failed to load data.")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (applicationId) {
          const [appDetails, fetchedRiskData] = await Promise.all([
            getApplicationDetailsById(applicationId),
            fetchApplicationDetails(applicationId),
          ]);
          setApplicationData(appDetails);
          setRiskData({
            risk_assessment: fetchedRiskData.risk_assessment,
            plan: fetchedRiskData.plan,
            total_score: fetchedRiskData.total_score,
          });
  
          // ADD THIS BLOCK HERE
          if (appDetails?.documents) { //Check that appDetails AND documents exist
            USER_DOCUMENTS.forEach(doc => {
              const matchingDoc = appDetails.documents.find(d => d.type === doc.id); //No need for optional chaining
              doc.url = matchingDoc ? config.fastApi.baseUrl + matchingDoc.url : null; // Add url directly
            });
          }
  
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [applicationId]);

  // Helper functions moved after hooks
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
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
      case "accepted":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            <XCircle className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return format(date, "MMMM d, yyyy")
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-green-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getRiskColorForWeighted = (score: number) => {
    if (score >= 17.5) return "text-green-600"
    if (score >= 10) return "text-yellow-600"
    return "text-red-600"
  }

  const getRiskCategories = () => {
    if (!riskData.risk_assessment) return []
    return Object.entries(riskData.risk_assessment)
      .filter(([key]) => key !== "_id" && key !== "application_id" && key !== "created_at")
      .map(([key, value]) => ({
        type: key,
        ...(value as RiskCategory),
      }))
  }

  // Conditional returns moved AFTER all hooks
  if (isLoading && !applicationData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
        <span className="ml-2">Loading Application Data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (!applicationData) {
    return null
  }

  // Rest of the component remains unchanged
  const handleApprove = async () => {
    if (!applicationId) {
      toast.error("Application ID is missing.")
      return
    }

    setIsLoading(true)
    try {
      await verifyApplication(applicationId, true)
      toast.success("Application approved successfully!")
      setApplicationData((prevData) => prevData ? { ...prevData, status: "verified" } : prevData)
    } catch (error: any) {
      toast.error(`Error approving application: ${error.message}`)
      console.error("Error approving application:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    if (!applicationId) {
      toast.error("Application ID is missing.")
      return
    }

    setIsLoading(true)
    try {
      await verifyApplication(applicationId, false)
      toast.success("Application rejected successfully!")
      setApplicationData((prevData) => prevData ? { ...prevData, status: "rejected" } : prevData)
    } catch (error: any) {
      toast.error(`Error rejecting application: ${error.message}`)
      console.error("Error rejecting application:", error)
    } finally {
      setIsLoading(false)
    }
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
              ID: {applicationId} • Submitted on {formatDate(applicationData.application_date.$date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>


      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card
          className={(() => {
            let colorClasses = {
              bgColor: "bg-yellow-100",
              textColor: "text-yellow-800",
              mutedColor: "text-yellow-600",
              borderColor: "border-yellow-200",
            }

            switch (applicationData.status.toLowerCase()) {
              case "verified":
                colorClasses = {
                  bgColor: "bg-green-100",
                  textColor: "text-green-800",
                  mutedColor: "text-green-600",
                  borderColor: "border-green-200",
                }
                break
              case "rejected":
                colorClasses = {
                  bgColor: "bg-red-100",
                  textColor: "text-red-800",
                  mutedColor: "text-red-600",
                  borderColor: "border-red-200",
                }
                break
              case "accepted":
                colorClasses = {
                  bgColor: "bg-purple-100",
                  textColor: "text-purple-800",
                  mutedColor: "text-purple-600",
                  borderColor: "border-purple-200",
                }
                break
              case "pending":
                break
              default:
                colorClasses = {
                  bgColor: "bg-gray-100",
                  textColor: "text-gray-800",
                  mutedColor: "text-gray-600",
                  borderColor: "border-gray-200",
                }
            }

            return `${colorClasses.bgColor} border ${colorClasses.borderColor}`
          })()}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Application Status</span>
              {getStatusBadge(applicationData.status)}
            </CardTitle>
            <CardDescription>Last updated on {formatDate(applicationData.updated_at.$date)}</CardDescription>
          </CardHeader>
          <CardContent>
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
                <p className="text-sm text-muted-foreground">Admin</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Risk Assessment</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="text-muted-foreground h-4 w-4" />
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
              <div className="border-muted relative flex h-36 w-36 items-center justify-center rounded-full border-8 p-2">
                <div className="flex flex-col items-center">
                  <span className={`text-3xl font-bold ${getRiskColor(riskData.total_score || 0)}`}>
                    {riskData.total_score?.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground text-sm">Risk Score</span>
                </div>
                <svg className="absolute -rotate-90" width="150" height="150" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="currentColor"
                    className={getRiskColor(riskData.total_score || 0)}
                    strokeWidth="12"
                    strokeDasharray="339.292"
                    strokeDashoffset={339.292 * (1 - (riskData.total_score || 0) / 100)}
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              {getRiskCategories().map((risk) => (
                <div key={risk.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: `var(--risk-color-${risk.type})`,
                      }}
                    />
                    <span className="text-sm capitalize">{risk.type.replace(/_/g, " ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getRiskColorForWeighted(risk.risk_score)}`}>
                      {risk.risk_score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Repayment Plan</span>
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Update Repayment Plan</SheetTitle>
                      <SheetDescription>Make changes to the repayment plan for this application.</SheetDescription>
                    </SheetHeader>
                    <div className="px-4">
                      {riskData.plan && (
                        <UpdateRepaymentPlanForm
                          plan={riskData.plan}
                          onSubmit={boundHandleUpdatePlan}
                          isLoading={isUpdatingPlan}
                          applicationId={applicationId} // Pass applicationId here
                          riskData={riskData}
                          setRiskData={setRiskData}
                        />
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <HelpCircle className="text-muted-foreground h-4 w-4" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Repayment Reasoning</h4>
                      <p className="text-sm">{riskData.plan?.reasoning}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </CardTitle>
            <CardDescription>Proposed loan repayment schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Loan Amount</span>
                <span className="font-medium">PKR {riskData.plan?.total_loan_amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Installment</span>
                <span className="font-medium">PKR {riskData.plan?.installment_amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Start Date</span>
                <span className="font-medium">{riskData.plan?.start_date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">End Date</span>
                <span className="font-medium">{riskData.plan?.end_date}</span>
              </div>

              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Frequency</span>
                <span className="font-medium">{riskData.plan?.repayment_frequency}</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="bg-muted h-2 flex-1 rounded-full">
                <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }} />
              </div>
              <span className="text-muted-foreground text-xs">0% Complete</span>
            </div>
          </CardContent>
        </Card>
      </div>

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
                  {getRiskCategories().map((risk) => {
                    // Hardcoded weights:
                    const weights: Record<string, number> = {
                      personal_risk: 0.15,
                      academic_risk: 0.25,
                      financial_risk: 0.35,
                      reference_risk: 0.1,
                      repayment_potential: 0.15,
                    }
                    const weight = weights[risk.type] || 0 // Get weight, default to 0

                    // Calculate raw score:
                    const rawScore = weight !== 0 ? risk.risk_score / weight : 0

                    return (
                      <TableRow key={risk.type}>
                        <TableCell className="font-medium capitalize">{risk.type.replace(/_/g, " ")}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={Math.round(rawScore)} className="h-2 w-20" />
                            <span className={getRiskColor(rawScore)}>{Math.round(rawScore)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{(weight * 100).toFixed(0)}%</TableCell>
                        <TableCell>{risk.risk_score.toFixed(1)}</TableCell>
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
                              {risk.calculations.split(";").map((factor, index) => (
                                <DropdownMenuItem key={index} className="flex justify-between">
                                  <span>{factor.trim()}</span>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total Risk Score
                    </TableCell>
                    <TableCell colSpan={1} className={`font-bold ${getRiskColor(riskData.total_score || 0)}`}>
                      {riskData.total_score?.toFixed(1)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

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
                      <span className="font-medium">PKR {riskData.plan?.total_loan_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Frequency</span>
                      <span className="font-medium">{riskData.plan?.repayment_frequency}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Repayment</span>
                      <span className="font-medium">PKR {riskData.plan?.total_loan_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-medium">Payment Schedule</h3>
                  <div className="rounded-lg border">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <span className="font-medium">Timeline</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm">Start Date</p>
                          <p className="font-medium">{riskData.plan?.start_date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground text-sm">End Date</p>
                          <p className="font-medium">{riskData.plan?.end_date}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">Monthly Payment</span>
                          <span className="font-medium">PKR {riskData.plan?.installment_amount.toLocaleString()}</span>
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
                      <div className="bg-primary/10 rounded-full p-2">
                        <Info className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm leading-relaxed">{riskData.plan?.reasoning}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application-details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Form Details</CardTitle>
              <CardDescription>Complete information submitted by the applicant</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="mb-4 grid w-full grid-cols-6">
                  <TabsTrigger value="personal">
                    <User className="h-4 w-3" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="financial">
                    <DollarSign className="h-4 w-3" />
                    Financial
                  </TabsTrigger>
                  <TabsTrigger value="academic">
                    <Layers className="h-4 w-3" />
                    Academic
                  </TabsTrigger>
                  <TabsTrigger value="loan">
                    <CreditCard className="h-4 w-3" />
                    Loan
                  </TabsTrigger>
                  <TabsTrigger value="references">
                    <User className="h-4 w-3" />
                    References
                  </TabsTrigger>
                  <TabsTrigger value="documents">
                    <User className="h-4 w-3" />
                    Documents
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Full Name</p>
                      <p>{applicationData.personal_info.full_name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Date of Birth</p>
                      <p>{formatDate(applicationData.personal_info.dob.$date)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Gender</p>
                      <p className="capitalize">{applicationData.personal_info.gender}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Nationality</p>
                      <p>{applicationData.personal_info.nationality}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Marital Status</p>
                      <p className="capitalize">{applicationData.personal_info.marital_status}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Phone Number</p>
                      <p>{applicationData.personal_info.phone_number}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Email Address</p>
                      <p>{applicationData.personal_info.email_address}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-medium">Residential Address</p>
                    <p>{applicationData.personal_info.residential_address}                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-medium">Permanent Address</p>
                    <p>{applicationData.personal_info.permanent_address}</p>
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Total Family Income</p>
                      <p>PKR {applicationData.financial_info.total_family_income.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Other Income Sources</p>
                      <p>{applicationData.financial_info.other_income_sources.join(", ")}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-medium">Outstanding Loans or Debts</p>
                    <p>{applicationData.financial_info.outstanding_loans_or_debts.join(", ")}</p>
                  </div>
                </TabsContent>

                <TabsContent value="academic" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Current Education Level</p>
                      <p className="capitalize">{applicationData.academic_info.current_education_level}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">College or University</p>
                      <p>{applicationData.academic_info.college_or_university}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Student ID</p>
                      <p>{applicationData.academic_info.student_id}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Program Name/Degree</p>
                      <p>{applicationData.academic_info.program_name_degree}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Duration of Course</p>
                      <p>{applicationData.academic_info.duration_of_course}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Year/Semester</p>
                      <p>{applicationData.academic_info.year_or_semester}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">GPA</p>
                      <p>{applicationData.academic_info.gpa}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Achievements or Awards</p>
                      <p>{applicationData.academic_info.achievements_or_awards.join(", ")}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="loan" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Loan Amount Requested</p>
                      <p>PKR {applicationData.loan_details.loan_amount_requested.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Purpose of Loan</p>
                      <p>{applicationData.loan_details.purpose_of_loan}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Proposed Repayment Period</p>
                      <p>{applicationData.loan_details.proposed_repayment_period}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Preferred Repayment Frequency</p>
                      <p className="capitalize">{applicationData.loan_details.preferred_repayment_frequency}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="references" className="space-y-4">
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-medium">References</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {applicationData.references.map((reference, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <p className="text-muted-foreground text-sm font-medium">Name</p>
                                <p>{reference.name}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-muted-foreground text-sm font-medium">Designation</p>
                                <p>{reference.designation}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-muted-foreground text-sm font-medium">Contact Details</p>
                                <p>{reference.contact_details}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-muted-foreground text-sm font-medium">Comments</p>
                                <p>{reference.comments}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <ScrollArea className="h-[calc(88vh-15rem)] rounded-lg border">
                    <div className="space-y-4 p-4">
                      {USER_DOCUMENTS.map((document) => {
                        return (
                          <Card
                            key={document.id}
                            className={`transition-colors`}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-base">
                                    {document.label}
                                  </CardTitle>
                                  <CardDescription className="mt-1 text-xs">
                                    {document.description}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <Dialog>
                                <DialogTrigger disabled={document.url ? false : true}>
                                  <Button
                                    variant="outline"
                                    className="w-full"
                                    disabled={document.url ? false : true}
                                  >
                                    {document.url ? "Show Document" : "No Document Uploaded"}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogTitle>{document.label}</DialogTitle>
                                  {document.url &&
                                    <object
                                      data={`${document.url}#toolbar=0&navpanes=0&scrollbar=0`}
                                      type="application/pdf"
                                      className="w-full h-[600px] border"
                                    >
                                      <p>Unable to display PDF. <a href={document.url} target="_blank" rel="noopener noreferrer">Download it instead.</a></p>
                                    </object>}
                                </DialogContent>
                              </Dialog>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end gap-4">
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

// Keep the UpdateRepaymentPlanForm component exactly as in original file
interface UpdateRepaymentPlanFormProps {
  plan: RepaymentPlan;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isLoading: boolean;
  applicationId: string;
  riskData: RiskData;
  setRiskData: React.Dispatch<React.SetStateAction<RiskData>>;
}

const formSchema = z.object({
  total_loan_amount: z.number().min(1, "Loan amount must be greater than 0"),
  start_date: z.date({
    required_error: "A start date is required.",
  }),
  end_date: z.date({
    required_error: "An end date is required.",
  }),
  repayment_frequency: z.string().min(1, "Repayment frequency is required"),
  reasoning: z.string().min(1, "Reasoning is required"),
})

function UpdateRepaymentPlanForm({ plan, onSubmit, isLoading, riskData }: UpdateRepaymentPlanFormProps) { // Removed applicationId
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total_loan_amount: plan.total_loan_amount,
      start_date: plan.start_date ? new Date(plan.start_date) : undefined, // Convert to Date object
      end_date: plan.end_date ? new Date(plan.end_date) : undefined,     // Convert to Date object
      repayment_frequency: plan.repayment_frequency || "monthly",
      reasoning: plan.reasoning || "",
    },
  })

  const installmentAmount = calculateInstallmentAmount(form.getValues() as any)

  useEffect(() => {
    //removed this to prevent constant refreshing of values
  }, [
    form.watch("total_loan_amount"),
    form.watch("start_date"),
    form.watch("end_date"),
    form.watch("repayment_frequency"),
    form,
  ])

  // Wrap form.handleSubmit(onSubmit) with an arrow function:
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    // Convert string dates to Date objects before submitting
    const formattedData = {
      ...data,
      start_date: data.start_date,  // No conversion needed
      end_date: data.end_date, // No conversion needed
    };
    await onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={e => { e.preventDefault(); handleSubmit(form.getValues()) }} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="total_loan_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Amount (PKR)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date (Month and Year)</FormLabel>
              <FormControl>
                <MonthYearPicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date (Month and Year)</FormLabel>
              <FormControl>
                <MonthYearPicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repayment_frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repayment Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="biannually">Bi-Annually</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reasoning"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reasoning</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-sm font-medium">
          Installment Amount: PKR {installmentAmount.toFixed(2)}
        </div>

        <SheetFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Plan"
            )}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  )
}