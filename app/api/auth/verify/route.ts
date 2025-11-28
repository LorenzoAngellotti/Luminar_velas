import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { signToken } from "@/lib/auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token faltante" },
        { status: 400 }
      );
    }

    // Buscar usuario por verify_token
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("verify_token", token)
      .single();

    if (!user || error) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 400 }
      );
    }

    // Marcar como verificado y borrar el verify_token
    await supabase
      .from("users")
      .update({
        verified: true,
        verify_token: null,
      })
      .eq("id", user.id);

    // Crear cookie de sesión (loguearlo)
    const sessionToken = signToken({
      id: user.id,
      email: user.email,
    });

    const response = NextResponse.redirect(`${BASE_URL}/cuenta`);

    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (e) {
    console.error("VERIFY ERROR:", e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
