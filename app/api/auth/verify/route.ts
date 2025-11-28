import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (user.verified) {
      return NextResponse.json(
        { error: "La cuenta ya está verificada" },
        { status: 400 }
      );
    }

    if (user.verify_token !== code) {
      return NextResponse.json(
        { error: "Código incorrecto" },
        { status: 400 }
      );
    }

    await supabase
      .from("users")
      .update({ verified: true, verify_token: null })
      .eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

