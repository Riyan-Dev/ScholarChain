/* eslint-disable prettier/prettier */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, LucidePersonStanding } from "lucide-react";
import { formatCurrency } from "@/lib/utils"; // Import the utility function

interface KeyMetricsProps {
    totalDonations: number;
    availableFunds: number;
    activeLoans: number;
    totalApplications: number;
}

export function KeyMetrics({ totalDonations, availableFunds, activeLoans, totalApplications }: KeyMetricsProps) {

    const metrics = [
        {
            title: "Total Donations",
            value: formatCurrency(totalDonations), // Use formatCurrency
            icon: DollarSign,
            change: "+20.1%",
            changeType: "positive",
        },
        {
            title: "Available Funds",
            value: formatCurrency(availableFunds),   // Use formatCurrency
            icon: DollarSign,
            change: "+4.3%",
            changeType: "positive",
        },
        {
            title: "Active Loans",
            value: activeLoans.toString(), // Convert number to string
            icon: CreditCard,
            change: "+12.5%",
            changeType: "positive",
        },
        {
            title: "Total Applications",
            value: totalApplications.toString(), // Convert number to string
            icon: LucidePersonStanding,
            change: "-0.5%",
            changeType: "positive",
        },
    ];

    return (
        <>
            {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {metric.title}
                            </CardTitle>
                            <Icon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <p
                                className={`text-xs ${metric.changeType === "positive" ? "text-green-500" : "text-red-500"}`}
                            >
                                {metric.change} from last month
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </>
    );
}