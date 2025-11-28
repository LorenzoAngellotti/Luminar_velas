import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  return NextResponse.json({
    rawCookieHeader: req.headers.get("cookie") || "(no-cookie-header)",
  });
}
