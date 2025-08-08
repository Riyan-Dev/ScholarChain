"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { ApplicationCount } from "@/services/admin.service";

interface FundDistributionProps {
    applicationCount: ApplicationCount[];
}

export function FundDistribution({ applicationCount }: FundDistributionProps) {

    const data = applicationCount.map((item) => ({
        name: item.status,
        value: item.count,
    }));

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "verified":
                return {
                    color: "#A7F3D0",
                    component: (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Approved
                        </Badge>
                    ),
                };
            case "rejected":
                return {
                    color: "#F87171",
                    component: (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                            <XCircle className="mr-1 h-3 w-3" />
                            Rejected
                        </Badge>
                    ),
                };
            case "accepted":
                return {
                    color: "#D8B4FE",
                    component: (
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Accepted
                        </Badge>
                    ),
                };
            case "ai-failure":
                return {
                    color: "#EF4444",
                    component: (
                        <Badge className="bg-red-800 text-white hover:bg-red-700">
                            <XCircle className="mr-1 h-3 w-3" />
                            AI Failure
                        </Badge>
                    ),
                };
            case "submitted":
                return {
                    color: "#60A5FA",
                    component: (
                        <Badge className="bg-blue-800 text-white hover:bg-blue-700">
                            <XCircle className="mr-1 h-3 w-3" />
                            Submitted
                        </Badge>
                    ),
                };
            case "inprogress":
                return {
                    color: "#FBBF24", // Or another suitable color
                    component: (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                            <Clock className="mr-1 h-3 w-3" />
                            In Progress
                        </Badge>
                    ),
                };
            case "": // Handle empty string status
                return {
                    color: "#9CA3AF", // Or another suitable color for "unknown"
                    component: (
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                            <Clock className="mr-1 h-3 w-3" />
                            N/A
                        </Badge>
                    ),
                };
            case "pending":
            default:
                return {
                    color: "#FBBF24",
                    component: (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                        </Badge>
                    ),
                };
        }
    };

    const COLORS = data.map((item) => getStatusBadge(item.name).color);

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Application Status Distribution</CardTitle>
                <CardDescription>Distribution of application statuses</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value.toLocaleString()} Applications`} />
                            <Legend formatter={(value, entry, index) => getStatusBadge(value).component} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}