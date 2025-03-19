/* eslint-disable prettier/prettier */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDash, getAdminDash } from "@/services/admin.service";
import { DollarSign, CreditCard, LucidePersonStanding } from "lucide-react";
import { useEffect, useState } from "react";

export function KeyMetrics() {
  const [dashData, setDashData] = useState<AdminDash | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _dashData = await getAdminDash();
        setDashData(_dashData);
      } catch (error) {
        console.error("Error while fetching admin dashboard:", error);
      }
    };

    fetchData();
  }, []);

  const metrics = [
    {
      title: "Total Donations",
      value: dashData ? dashData.total_donations : "$1,245,678",
      icon: DollarSign,
      change: "+20.1%",
      changeType: "positive",
    },
    {
      title: "Available Funds",
      value: dashData ? dashData.available_funds : "$845,392",
      icon: DollarSign,
      change: "+4.3%",
      changeType: "positive",
    },
    {
      title: "Active Loans",
      value: dashData ? dashData.active_loans : "2,345",
      icon: CreditCard,
      change: "+12.5%",
      changeType: "positive",
    },
    {
      title: "Total Applications",
      value: dashData ? dashData.total_applications : "3.2%",
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
