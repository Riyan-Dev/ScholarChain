/* eslint-disable prettier/prettier */
"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { MonthlyTransaction } from "@/services/admin.service";

interface MonthlyTrendsProps {
    monthlyTransactions: MonthlyTransaction[];
}

export function MonthlyTrends({ monthlyTransactions }: MonthlyTrendsProps) {

    // Transform data to the format recharts expects
    const monthlyData = Object.entries(
        monthlyTransactions.reduce((acc: any, curr) => {
            const monthName = new Date(2024, curr.month - 1, 1).toLocaleString('default', { month: 'short' }); // Get month name
            if (!acc[monthName]) {
                acc[monthName] = { name: monthName };
            }
            acc[monthName][curr.transactionType] = curr.totalAmount;
            return acc;
        }, {})
    ).map(([month, data]) => data);


    const lineChart = (
        <ResponsiveContainer width="100%" aspect={3}>
            <LineChart
                data={monthlyData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                }}
            >
                <CartesianGrid />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="donations"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="loans" stroke="#82ca9d" />
                <Line type="monotone" dataKey="repayments" stroke="#ffc658" />
            </LineChart>
        </ResponsiveContainer>
    );

    const barChart = (
        <ResponsiveContainer width="100%" aspect={3}>
            <BarChart
                data={monthlyData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="donations" fill="#8884d8" />
                <Bar dataKey="loans" fill="#82ca9d" />
                <Bar dataKey="repayments" fill="#ffc658" />
            </BarChart>
        </ResponsiveContainer>
    );

    const areaChart = (
        <ResponsiveContainer width="100%" aspect={3}>
            <AreaChart
                data={monthlyData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                    type="monotone"
                    dataKey="donations"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                />
                <Area
                    type="monotone"
                    dataKey="loans"
                    stackId="2"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                />
                <Area
                    type="monotone"
                    dataKey="repayments"
                    stackId="3"
                    stroke="#ffc658"
                    fill="#ffc658"
                />
            </AreaChart>
        </ResponsiveContainer>
    );

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>
                    Track donations, loans, and repayments over time
                </CardDescription>
            </CardHeader>
            <CardContent
                style={{
                    height: "300px",
                    width: "100%",
                }}
            >
                <Tabs defaultValue="bar">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="line">Line</TabsTrigger>
                            <TabsTrigger value="bar">Bar</TabsTrigger>
                            <TabsTrigger value="area">Area</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="line">
                        {lineChart}
                    </TabsContent>
                    <TabsContent value="bar">
                        {barChart}
                    </TabsContent>
                    <TabsContent value="area">
                        {areaChart}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}