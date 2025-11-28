import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mail";
import crypto from "crypto";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json(
        { error: "Email y contraseña requeridos" },
        { status: 400 }
      );

    // 1. Verificar si ya existe
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      );
    }

    // 2. Crear hash de la contraseña
    const password_hash = await hashPassword(password);

    // 3. Generar token único de verificación
    const verify_token = crypto.randomUUID();

    // 4. Crear usuario
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email,
        password_hash,
        verify_token,
        verified: false,
      })
      .select()
      .single();

    if (error) {
      console.error("REGISTER ERROR:", error);
      return NextResponse.json(
        { error: "Error al registrar usuario" },
        { status: 500 }
      );
    }

    // 5. Enviar mail de verificación
    await sendVerificationEmail(email, verify_token);

    const response = NextResponse.redirect(
      `${BASE_URL}/verify-email`
    );
    return response;


  } catch (e) {
    console.error("REGISTER ERROR:", e);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
