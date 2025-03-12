// app/api/get-token/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import config from "@/config/config";
export async function GET(req: NextRequest) {
  // Now you can access cookies from the NextRequest object
  const token = req.cookies.get(config.jwtSecret)?.value;

  return NextResponse.json({ token });
}
