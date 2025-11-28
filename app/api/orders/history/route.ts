import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("session")?.value;

    if (!token)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = (decoded as any).id;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ orders: data });
  } catch (err) {
    console.error("ORDER HISTORY ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
