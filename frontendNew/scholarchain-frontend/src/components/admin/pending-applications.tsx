"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { PendingApplicationAPI } from "@/services/admin.service"; // Import the interface
import { useRouter } from "next/navigation";

interface PendingApplicationsComponentProps {
    pendingApplications: PendingApplicationAPI[];
}

interface PendingApplications {
    username: string;
    applicant: string;
    amount: number;
    status: string;
    application_date: string;
}

export function PendingApplicationsComponent({ pendingApplications }: PendingApplicationsComponentProps) {

  const router = useRouter();

    const applications: PendingApplications[] = pendingApplications.map(app => ({
        username: app.username,
        applicant: app.personal_info.full_name,
        amount: app.loan_details.loan_amount_requested,
        status: app.status,
        application_date: app.application_date,
    }));

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Pending Applications</CardTitle>
                    <CardDescription>Recent loan applications awaiting review</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push("/admin/applications")}>
                    View All
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Application Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((application) => (
                            <TableRow key={application.username}>
                                <TableCell className="font-medium">{application.username}</TableCell>
                                <TableCell>{application.applicant}</TableCell>
                                <TableCell>{application.amount}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{application.status}</Badge>
                                </TableCell>
                                <TableCell>{application.application_date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}