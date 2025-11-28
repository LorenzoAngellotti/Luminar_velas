import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("id");

  console.log("🟦 DEBUG DELETE USER:", userId);

  const result = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

  console.log("🟥 DELETE RESULT:", result);

  return NextResponse.json(result);
}
