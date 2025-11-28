import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies(); // <- IMPORTANTE

  cookieStore.delete("session");

  return NextResponse.redirect("http://localhost:3000/login");
}
