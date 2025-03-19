import { NextResponse } from "next/server"
import type { TokenTransaction } from "@/lib/types"

// Mock data for local token transactions
const mockLocalTransactions: TokenTransaction[] = [
  {
    username: "alice",
    amount: 100,
    action: "buy",
    timestamp: "2023-11-15 14:30:22",
    description: "Initial token purchase",
  },
  {
    username: "bob",
    amount: 50,
    action: "buy",
    timestamp: "2023-11-16 09:45:10",
    description: "Token investment",
  },
  {
    username: "alice",
    amount: 25,
    action: "burn",
    timestamp: "2023-11-17 16:20:05",
    description: "Partial token redemption",
  },
  {
    username: "charlie",
    amount: 200,
    action: "buy",
    timestamp: "2023-11-18 11:10:33",
    description: "Large token purchase",
  },
  {
    username: "dave",
    amount: 75,
    action: "buy",
    timestamp: "2023-11-19 13:55:47",
    description: "Medium token purchase",
  },
  {
    username: "bob",
    amount: 30,
    action: "burn",
    timestamp: "2023-11-20 10:15:29",
    description: "Partial token redemption",
  },
  {
    username: "eve",
    amount: 150,
    action: "buy",
    timestamp: "2023-11-21 15:40:12",
    description: "Strategic token investment",
  },
  {
    username: "charlie",
    amount: 100,
    action: "burn",
    timestamp: "2023-11-22 09:30:55",
    description: "Partial profit taking",
  },
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json(mockLocalTransactions)
}

