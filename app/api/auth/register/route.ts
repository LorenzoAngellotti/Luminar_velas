import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";
import { generateVerifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Falta email o contraseña" },
        { status: 400 }
      );
    }

    const exists = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (exists.data) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 400 }
      );
    }

    const password_hash = await hashPassword(password);
    const verifyToken = generateVerifyToken();

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email,
        password_hash,
        verified: false,
        verify_token: verifyToken,
      })
      .select()
      .single();

    if (error) throw error;

    await sendEmail(
      email,
      "Verificá tu cuenta",
      `
        <h1>Bienvenido/a a Luminar Velas</h1>
        <p>Usá este código para verificar tu cuenta:</p>
        <h2>${verifyToken}</h2>
      `
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
