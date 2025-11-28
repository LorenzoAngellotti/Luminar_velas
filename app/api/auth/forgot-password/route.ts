import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "No existe un usuario con ese email" },
        { status: 404 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    await supabase
      .from("users")
      .update({ reset_token: token })
      .eq("id", user.id);

    const base = process.env.NEXT_PUBLIC_BASE_URL;

    await sendEmail(
      user.email,
      "Restablecer contraseña",
      `
        <h1>Recuperación de contraseña</h1>
        <p>Hacé clic para restablecer tu contraseña:</p>
        <a href="${base}/reset-password/${token}">
          Recuperar contraseña
        </a>
      `
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}

