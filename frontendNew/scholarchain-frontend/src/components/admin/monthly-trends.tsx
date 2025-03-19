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

export function MonthlyTrends() {
  // Client-side rendering control
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Sample data for the charts
  const monthlyData = [
    { name: "Jan", donations: 65000, loans: 45000, repayments: 30000 },
    { name: "Feb", donations: 59000, loans: 48000, repayments: 32000 },
    { name: "Mar", donations: 80000, loans: 52000, repayments: 35000 },
    { name: "Apr", donations: 81000, loans: 55000, repayments: 40000 },
    { name: "May", donations: 56000, loans: 50000, repayments: 42000 },
    { name: "Jun", donations: 55000, loans: 60000, repayments: 45000 },
    { name: "Jul", donations: 40000, loans: 65000, repayments: 48000 },
    { name: "Aug", donations: 60000, loans: 70000, repayments: 50000 },
    { name: "Sep", donations: 70000, loans: 68000, repayments: 52000 },
    { name: "Oct", donations: 90000, loans: 72000, repayments: 55000 },
    { name: "Nov", donations: 95000, loans: 75000, repayments: 58000 },
    { name: "Dec", donations: 100000, loans: 80000, repayments: 60000 },
  ];

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
          <TabsContent key={`line-${Date.now()}`} value="line">
            <ResponsiveContainer width="100%" height="100%">
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
          </TabsContent>
          <TabsContent
            key={`bar-${Date.now()}`}
            value="bar"
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
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
          </TabsContent>
          <TabsContent
            key={`area-${Date.now()}`}
            value="area"
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
