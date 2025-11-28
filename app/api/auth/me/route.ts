import { cookies } from "next/headers";
import { supabase } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return new Response(
      JSON.stringify({ authenticated: false, user: null }),
      { status: 200 }
    );
  }

  const decoded: any = verifyToken(token);

  if (!decoded?.id) {
    return new Response(
      JSON.stringify({ authenticated: false, user: null }),
      { status: 200 }
    );
  }

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
