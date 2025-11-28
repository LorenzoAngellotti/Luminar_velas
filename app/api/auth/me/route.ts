import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Obtener cookie
    const token = req.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Verificar JWT
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Retornar usuario (id y email)
    return NextResponse.json({
      user: {
        id: (decoded as any).id,
        email: (decoded as any).email,
      },
    });

  } catch (error) {
    console.error("🔥 ERROR /api/auth/me:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
