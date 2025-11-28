import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { supabase } from "@/lib/db";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

// Funciones locales de envío (mismas del checkout)
function calcularEnvioDomicilio(cp: number) {
  if (cp >= 1000 && cp <= 1499) return 1500;
  if (cp >= 1500 && cp <= 1899) return 2000;
  if (cp >= 1900 && cp <= 1999) return 2500;
  if (cp >= 2000 && cp <= 9999) return 3000;
  return null;
}

function calcularEnvioSucursal() {
  return 2000;
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

    // Recibir order_id
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json(
        { error: "Falta order_id." },
        { status: 400 }
      );
    }

    // Buscar orden en Supabase
    const { data: orden, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (error || !orden) {
      return NextResponse.json(
        { error: "Orden no encontrada." },
        { status: 404 }
      );
    }

    // ----------------------------
    // Preparar ítems para Mercado Pago
    // ----------------------------
    const itemsMP = orden.items.map((item: any) => ({
      title: `${item.name}${item.tamano ? ` (${item.tamano})` : ""}`,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: "ARS",
    }));

    // Agregamos ítem del envío
    itemsMP.push({
      title:
        orden.shipping_method === "retiro"
          ? "Retiro en persona"
          : orden.shipping_method === "sucursal"
          ? "Retiro en sucursal"
          : "Envío a domicilio",
      quantity: 1,
      unit_price: orden.shipping_cost,
      currency_id: "ARS",
    });

    // ----------------------------
    // Generar preferencia en Mercado Pago
    // ----------------------------
    const baseUrl = process.env.NGROK_URL;

    if (!baseUrl || !baseUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: "NGROK_URL inválida." },
        { status: 500 }
      );
    }

    const preference = await new Preference(client).create({
      body: {
        items: itemsMP,
        back_urls: {
          success: `${baseUrl}/pago-exitoso`,
          failure: `${baseUrl}/pago-fallido`,
          pending: `${baseUrl}/pago-pendiente`,
        },
        auto_return: "approved",

        // Para el webhook
        notification_url: `${baseUrl}/api/payments/webhook`,
      },
    });

    // ----------------------------
    // Guardar mp_preference_id en la orden
    // ----------------------------
    await supabase
      .from("orders")
      .update({ mp_preference_id: preference.id })
      .eq("id", order_id);

    return NextResponse.json({
      init_point: preference.init_point,
    });
  } catch (err) {
    console.error("Error create-preference:", err);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
