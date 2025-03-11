"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  {
    name: "Jan",
    tokens: 120,
  },
  {
    name: "Feb",
    tokens: 170,
  },
  {
    name: "Mar",
    tokens: 150,
  },
  {
    name: "Apr",
    tokens: 210,
  },
  {
    name: "May",
    tokens: 250,
  },
  {
    name: "Jun",
    tokens: 190,
  },
  {
    name: "Jul",
    tokens: 280,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="tokens"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
