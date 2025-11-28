import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json(
        { error: "Email y contraseña son obligatorios" },
        { status: 400 }
      );

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user || error)
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );

    // 🔥 PASO 4 — Evitar login si no está verificado
    if (!user.verified) {
      return NextResponse.json(
        { error: "Debes verificar tu email antes de iniciar sesión" },
        { status: 403 }
      );
    }

    const correctPassword = await comparePassword(
      password,
      user.password_hash
    );

    if (!correctPassword)
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );

    const token = signToken({
      id: user.id,
      email: user.email,
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
