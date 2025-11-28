import { cookies } from "next/headers";
import { supabase } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

<<<<<<< HEAD
=======
  // No hay token → no está logueado
>>>>>>> f65a93bb54bf797d7a78f4cba208db4a01027a21
  if (!token) {
    return new Response(
      JSON.stringify({ authenticated: false, user: null }),
      { status: 200 }
    );
  }

<<<<<<< HEAD
  const decoded: any = verifyToken(token);

  if (!decoded?.id) {
=======
  // Validar JWT
  const decoded: any = verifyToken(token);

  if (!decoded || !decoded.id) {
>>>>>>> f65a93bb54bf797d7a78f4cba208db4a01027a21
    return new Response(
      JSON.stringify({ authenticated: false, user: null }),
      { status: 200 }
    );
  }

<<<<<<< HEAD
=======
  // Buscar usuario
>>>>>>> f65a93bb54bf797d7a78f4cba208db4a01027a21
  const { data: user } = await supabase
    .from("users")
    .select("id, email")
    .eq("id", decoded.id)
    .single();

  if (!user) {
    return new Response(
      JSON.stringify({ authenticated: false, user: null }),
      { status: 200 }
    );
  }

  return new Response(
    JSON.stringify({ authenticated: true, user }),
    { status: 200 }
  );
}

