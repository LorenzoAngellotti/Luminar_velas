import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/db";
import { verifyToken } from "@/lib/auth";


export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const [sessionId, signature] = sessionCookie.value.split(".");

  if (!verifySessionSignature(sessionId, signature)) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const { data: session } = await supabase
    .from("sessions")
    .select("user_id")
    .eq("session_id", sessionId)
    .single();

  if (!session)
    return NextResponse.json({ user: null }, { status: 401 });

  const { data: user } = await supabase
    .from("users")
    .select("id, email, verified")
    .eq("id", session.user_id)
    .single();

  return NextResponse.json({ user }, { status: 200 });
}
