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
import { useEffect, useState } from "react";
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
import { getAdminDash, MonthlyTransaction } from "@/services/admin.service";
import { Skeleton } from "@/components/ui/skeleton";

export function MonthlyTrends() {
  const [monthlyData, setMonthlyData] = useState<MonthlyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const adminDash = await getAdminDash();
        // Transform data to the format recharts expects
        const transformedData = Object.entries(
          adminDash.monthly_transactions.reduce((acc: any, curr) => {
            const monthName = new Date(2024, curr.month - 1, 1).toLocaleString('default', { month: 'short' }); // Get month name
            if (!acc[monthName]) {
              acc[monthName] = { name: monthName };
            }
            acc[monthName][curr.transactionType] = curr.totalAmount;
            return acc;
          }, {})
        ).map(([month, data]) => data);
        setMonthlyData(transformedData as any);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
        console.error("Error fetching admin dash data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>
            Track donations, loans, and repayments over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>
            Track donations, loans, and repayments over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

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
          height: "400px",
          width: "100%",
        }}
      >
        <Tabs defaultValue="line">
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