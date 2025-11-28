import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken, hashPassword, comparePassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("session")?.value;
    if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword)
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });

    // traer usuario
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", (decoded as any).id)
      .single();

    if (!user)
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const isCorrect = await comparePassword(oldPassword, user.password_hash);

    if (!isCorrect)
      return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });

    const newHash = await hashPassword(newPassword);

    const { error } = await supabase
      .from("users")
      .update({ password_hash: newHash })
      .eq("id", user.id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("UPDATE PASSWORD ERROR:", err);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
