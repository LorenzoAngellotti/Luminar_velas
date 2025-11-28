import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { generateVerifyToken } from "@/lib/auth";

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
        { error: "No existe un usuario con este email" },
        { status: 404 }
      );
    }

    if (user.verified) {
      return NextResponse.json(
        { error: "Tu cuenta ya está verificada" },
        { status: 400 }
      );
    }

    const newToken = generateVerifyToken();

    await supabase
      .from("users")
      .update({ verify_token: newToken })
      .eq("id", user.id);

    await sendEmail(
      user.email,
      "Nuevo código de verificación",
      `
        <h1>Nuevo código</h1>
        <h2>${newToken}</h2>
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
