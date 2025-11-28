import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateVerifyToken } from "@/lib/auth";
import { transporter } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json({ error: "Ese email no está registrado" }, { status: 400 });
    }

    const token = generateVerifyToken();

    await supabase
      .from("users")
      .update({ verify_token: token })
      .eq("id", user.id);

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    console.log("🔗 RECOVERY LINK:", resetUrl);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperá tu contraseña",
      html: `
        <h1>Recuperar contraseña</h1>
        <p>Hacé clic para crear una nueva contraseña:</p>
        <a href="${resetUrl}">Restablecer contraseña</a>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
