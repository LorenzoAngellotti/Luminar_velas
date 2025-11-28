import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { supabase } from "@/lib/db";

// Función para verificar stock
async function verificarStock(items: any[]) {
  const faltantes: any[] = [];

  for (const item of items) {
    const { data: producto } = await supabase
      .from("productos")
      .select("stock")
      .eq("sku", item.id)
      .single();

    if (!producto || producto.stock < item.quantity) {
      faltantes.push({
        id: item.id,
        solicitado: item.quantity,
        disponible: producto?.stock ?? 0,
      });
    }
  }

  return faltantes;
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No estás autenticado" },
        { status: 401 }
      );
    }

    const decoded: any = verifyToken(token);

    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: "Sesión inválida" },
        { status: 401 }
      );
    }

    const {
      items,
      subtotal,
      shippingMethod,
      shippingCost,
      total,
      postal,
      address,
    } = await req.json();

    // Validación básica
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío." },
        { status: 400 }
      );
    }

    if (!address || !shippingMethod) {
      return NextResponse.json(
        { error: "Datos incompletos de envío." },
        { status: 400 }
      );
    }

    // 🔥 Control de stock
    const faltantes = await verificarStock(items);
    if (faltantes.length > 0) {
      return NextResponse.json(
        {
          error: "Stock insuficiente",
          detalles: faltantes,
        },
        { status: 400 }
      );
    }

    // 🔥 Crear orden
    const { data: orden, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: decoded.id,
          items,
          shipping_method: shippingMethod,
          shipping_cost: shippingCost,
          subtotal,
          total,
          postal,
          address,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error create order:", error);
      return NextResponse.json(
        { error: "No se pudo crear la orden." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: orden.id,
    });
  } catch (err) {
    console.error("Create order ERROR:", err);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
