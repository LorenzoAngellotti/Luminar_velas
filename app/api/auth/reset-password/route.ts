import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("verify_token", token)
      .single();

    if (!user) {
      return NextResponse.json({ error: "Token inválido" }, { status: 400 });
    }

    const newHash = await hashPassword(password);

    await supabase
      .from("users")
      .update({
        password_hash: newHash,
        verify_token: null,
      })
      .eq("id", user.id);

    return NextResponse.json({ success: true });

  } catch (e) {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
