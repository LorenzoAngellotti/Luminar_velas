import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateVerifyToken } from "@/lib/auth";
import { transporter } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Falta el email" }, { status: 400 });
    }

    // 1. Buscar usuario
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json({ error: "No existe una cuenta con ese email" }, { status: 400 });
    }

    if (user.verified) {
      return NextResponse.json({ error: "La cuenta ya está verificada" }, { status: 400 });
    }

    // 2. Generar nuevo token
    const newToken = generateVerifyToken();

    await supabase
      .from("users")
      .update({ verify_token: newToken })
      .eq("id", user.id);

    // 3. Crear link
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${newToken}`;

    console.log("🔗 VERIFICATION LINK:", verifyUrl);

    // 4. Enviar email
    await transporter.sendMail({
      from: `"Luminar Velas" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reenviar verificación",
      html: `
        <h1>Confirmá tu cuenta</h1>
        <p>Hacé clic aquí para verificar tu email:</p>
        <a href="${verifyUrl}">Verificar cuenta</a>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
