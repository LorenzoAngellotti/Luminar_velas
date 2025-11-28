import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("reset_token", token)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);

    await supabase
      .from("users")
      .update({ password_hash: newHash, reset_token: null })
      .eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}

