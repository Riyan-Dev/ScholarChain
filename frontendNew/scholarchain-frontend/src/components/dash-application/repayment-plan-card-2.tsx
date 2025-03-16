import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPlan } from "@/services/user.service";
import { Skeleton } from "../ui/skeleton";
import { acceptApplication } from "@/services/application.service";

interface RepaymentPlanData {
  _id: string;
  total_loan_amount: number;
  start_date: string; // Keep as string, handle parsing inside component
  end_date: string; // Keep as string
  repayment_frequency: "monthly" | "quarterly" | "biannually" | "annually";
  installment_amount: number;
  reasoning: string;
  application_id: string;
  created_at: string;
  updated_at: string;
}

interface RepaymentPlanDisplayProps {
  onNext: () => void;
  application_id: string;
}

export function RepaymentPlanDisplay({
  onNext,
  application_id,
}: RepaymentPlanDisplayProps) {
  const [isInstallmentsOpen, setIsInstallmentsOpen] = useState(false);
  const [installmentDates, setInstallmentDates] = useState<Date[]>([]);

  const { data, error, isLoading } = useQuery<RepaymentPlanData, Error>({
    // Specify data and error types
    queryKey: ["repayment_plan", application_id],
    queryFn: fetchPlan, // Pass application_id to fetchPlan
  });

  const handleAcceptApplication = () => {
    acceptApplication(application_id);

    onNext();
  };
  // Helper function to parse date string (handles "MMM-YYYY" format)
  const parseDate = (dateStr: string): Date => {
    //Handle different Date formats
    console.log(dateStr);
    if (dateStr.includes("-")) {
      const parts = dateStr.split("-");

      if (parts.length === 3) {
        const [day, monthStr, year] = parts;
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const month = monthNames.indexOf(monthStr);
        return new Date(parseInt(year), month, parseInt(day));
      } else {
        const [monthStr, year] = parts;
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const month = monthNames.indexOf(monthStr); // Convert month string to number (0-11)

        return new Date(parseInt(year), month, 1); // Default to 1st of the month
      }
    }
    return new Date(dateStr); // Fallback for other formats
  };

  // Improved installment date generation (always 5th of the month)
  const generateInstallmentDates = (
    startDateStr: string,
    endDateStr: string,
    frequency: "monthly" | "quarterly" | "biannually" | "annually"
  ) => {
    const startDate = parseDate(startDateStr);
    const endDate = parseDate(endDateStr);

    const installmentDatesArray: Date[] = [];
    let currentDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      5
    ); // Start at the 5th

    while (currentDate <= endDate) {
      installmentDatesArray.push(new Date(currentDate)); // Push a *copy*

      // Adjust the date based on the frequency
      switch (frequency) {
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "quarterly":
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
        case "biannually":
          currentDate.setMonth(currentDate.getMonth() + 6);
          break;
        case "annually":
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
    }

    return installmentDatesArray;
  };

  useEffect(() => {
    console.log(data);
    if (data) {
      const newInstallmentDates = generateInstallmentDates(
        data.start_date,
        data.end_date,
        data.repayment_frequency
      );
      setInstallmentDates(newInstallmentDates);
      // No need to modify data.installment_amount here; use the value from the API
    }
  }, [data]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="w-full">
          <Skeleton className="h-48 w-full" />{" "}
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data found.</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Repayment Plan</CardTitle>
        <CardDescription>Your loan repayment schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Total Loan Amount</Label>
              <div className="text-lg font-semibold">
                {data.total_loan_amount.toLocaleString()} PKR
              </div>
            </div>
            <div>
              <Label>Repayment Frequency</Label>
              <div className="text-lg font-semibold">
                {data.repayment_frequency}
              </div>
            </div>
            <div>
              <Label>Start Date</Label>
              <div className="text-base font-semibold">
                {data &&
                  parseDate(data.start_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </div>
            </div>
            <div>
              <Label>End Date</Label>
              <div className="text-base font-semibold">
                {data &&
                  parseDate(data.end_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </div>
            </div>
          </div>

          <div>
            <Label>Installment Amount</Label>
            <div className="text-lg font-semibold">
              {data.installment_amount.toLocaleString()} PKR
            </div>
          </div>

          <div className="mt-4">
            <Collapsible
              open={isInstallmentsOpen}
              onOpenChange={setIsInstallmentsOpen}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="flex w-full items-center justify-between"
                >
                  Installment Dates
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform ${isInstallmentsOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Installment Date</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {installmentDates.map((date, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(date)}</TableCell>
                        <TableCell>
                          {data.installment_amount.toLocaleString()} PKR
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        <Button className="mt-6 w-full" onClick={handleAcceptApplication}>
          Accept Application
        </Button>
      </CardContent>
    </Card>
  );
}
