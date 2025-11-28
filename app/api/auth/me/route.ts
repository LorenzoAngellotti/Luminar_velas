import { cookies } from "next/headers";
import { supabase } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  // No hay token → no está logueado
  if (!token) {
    return new Response(
      JSON.stringify({ authenticated: false, user: null }),
      { status: 200 }
    );
  }

  // Validar token
  const decoded: any = verifyToken(token);

  if (!decoded || !decoded.id) {
    return new Response(
      JSON.stringify({ authenticated: false, user: null }),
      { status: 200 }
    );
  }

  // Buscar usuario
  const { data: user } = await supabase
    .from("users")
    .select("id, email")
    .eq("id", decoded.id)
    .single();

  return new Response(
    JSON.stringify({
      authenticated: true,
      user,
    }),
    { status: 200 }
  );
}


