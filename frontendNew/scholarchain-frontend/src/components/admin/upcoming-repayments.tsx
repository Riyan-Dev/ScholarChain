"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { UpcomingRepaymentAPI } from "@/services/admin.service";
import { useRouter } from "next/navigation";

interface UpcomingRepaymentsComponentProps {
    upcomingRepayments: UpcomingRepaymentAPI[];
}

interface UpcomingRepayments {
    id: string;         // Loan ID
    borrower: string;    // Username of the borrower
    amount: number;      // Amount due (installment amount)
    dueDate: string;     // Due date (installment date)
    status: string;      // Status (e.g., "pending", "paid", "overdue")
}

export function UpcomingRepaymentsComponent({ upcomingRepayments }: UpcomingRepaymentsComponentProps) {

  const router = useRouter();

    const repayments: UpcomingRepayments[] = upcomingRepayments.map(repayment => ({
        id: repayment.id,
        borrower: repayment.username,
        amount: repayment.installments.amount_paid,
        dueDate: repayment.installments.installment_date,
        status: repayment.installments.installment_status === "pending" ? "Pending" : "Paid", //Example
    }));

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Upcoming Repayments</CardTitle>
                    <CardDescription>Repayments due in the next 7 days</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push("/admin/loans")}>
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
                                    <Badge variant={repayment.status === "Pending" ? "outline" : "destructive"}>{repayment.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}