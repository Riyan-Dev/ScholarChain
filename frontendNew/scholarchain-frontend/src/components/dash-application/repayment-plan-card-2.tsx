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
import { useState } from "react";

interface RepaymentPlanDisplayProps {
  total_loan_amount: number;
  start_date: string;
  end_date: string;
  repayment_frequency: "monthly"; // Could be extended to other frequencies
  installment_amount: number;
}

export function RepaymentPlanDisplay({
  total_loan_amount,
  start_date,
  end_date,
  repayment_frequency,
  installment_amount,
}: RepaymentPlanDisplayProps) {
  const [isInstallmentsOpen, setIsInstallmentsOpen] = useState(false);

  // Helper function to parse date string (handles "DD-MMM-YYYY" format)
  const parseDate = (dateStr: string): Date => {
    const [day, monthStr, year] = dateStr.split("-");
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

    return new Date(parseInt(year), month, parseInt(day));
  };

  // Improved installment date generation (always 5th of the month)
  const generateInstallmentDates = (
    startDateStr: string,
    endDateStr: string
  ) => {
    const startDate = parseDate(startDateStr);
    const endDate = parseDate(endDateStr);

    const installmentDates = [];
    let currentDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      5
    ); // Start at the 5th

    while (currentDate <= endDate) {
      installmentDates.push(new Date(currentDate)); // Push a *copy* of the date
      currentDate.setMonth(currentDate.getMonth() + 1); // Go to the next month
    }
    return installmentDates;
  };

  const installmentDates = generateInstallmentDates(start_date, end_date);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
                ${total_loan_amount.toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Repayment Frequency</Label>
              <div className="text-lg font-semibold">{repayment_frequency}</div>
            </div>
            <div>
              <Label>Start Date</Label>
              <div className="text-base font-semibold">
                {parseDate(start_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div>
              <Label>End Date</Label>
              <div className="text-base font-semibold">
                {parseDate(end_date).toLocaleDateString("en-US", {
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
              ${installment_amount.toLocaleString()}
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
                          ${installment_amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        <Button className="mt-6 w-full" disabled>
          Submit Application
        </Button>
      </CardContent>
    </Card>
  );
}
