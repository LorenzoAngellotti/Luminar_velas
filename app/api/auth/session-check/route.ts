import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") ?? "";
  return NextResponse.json({ cookie: cookieHeader });
}
