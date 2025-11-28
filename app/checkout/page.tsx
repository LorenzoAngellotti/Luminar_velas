"use client";

import { useEffect, useState } from "react";

type ShippingMethod = "domicilio" | "sucursal" | "retiro";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [envio, setEnvio] = useState<number | null>(null);
  const [postal, setPostal] = useState("");
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("domicilio");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Cálculo de envío local
  // -------------------------------
  function calcularEnvioDomicilio(cp: number) {
    if (cp >= 1000 && cp <= 1499) return 1500; // CABA
    if (cp >= 1500 && cp <= 1899) return 2000; // AMBA
    if (cp >= 1900 && cp <= 1999) return 2500; // Interior BsAs (Junín)
    if (cp >= 2000 && cp <= 9999) return 3000; // Resto del país
    return null;
  }

  function calcularEnvioSucursal() {
    return 2000;
  }

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");

    const normalizados = stored.map((item: any) => ({
      id: item.id,
      name: item.name || item.nombre,
      price: item.price || item.precio,
      quantity: item.quantity || item.cantidad,
      image: item.image || item.imagen,
      tamano: item.tamano,
    }));

    setCart(normalizados);

    const t = normalizados.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(t);
  }, []);

  // Calcular envío según método + CP
  function recomputarEnvio(method: ShippingMethod, cpText: string) {
    if (method === "retiro") {
      setEnvio(0);
      return;
    }

    if (method === "sucursal") {
      setEnvio(calcularEnvioSucursal());
      return;
    }

    const cp = parseInt(cpText);
    if (!cp || isNaN(cp)) {
      setEnvio(null);
      return;
    }

    const costo = calcularEnvioDomicilio(cp);
    setEnvio(costo);
  }

  function handlePostalInput(value: string) {
    setPostal(value);
    recomputarEnvio(shippingMethod, value);
  }

  function handleShippingChange(value: ShippingMethod) {
    setShippingMethod(value);
    recomputarEnvio(value, postal);
  }

  async function iniciarPago(e: any) {
    e.preventDefault();
    if (loading) return;

    setMessage("");
    setLoading(true);

    const form = e.currentTarget.closest("form");
    const data = new FormData(form);

    const name = data.get("name")?.toString().trim();
    const email = data.get("email")?.toString().trim();
    const address = data.get("address")?.toString().trim();
    const cp = data.get("postal")?.toString().trim();

    if (!name || !email || !address) {
      setMessage("Completá todos los datos del formulario.");
      setLoading(false);
      return;
    }

    if (shippingMethod === "domicilio") {
      if (!cp) {
        setMessage("Ingresá un código postal válido.");
        setLoading(false);
        return;
      }
      if (envio === null) {
        setMessage("Código postal inválido o no soportado.");
        setLoading(false);
        return;
      }
    }

    // -----------------------------
    // PASO 1 — Crear orden en backend
    // -----------------------------
    const resCreate = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        subtotal,
        shippingMethod,
        shippingCost: envio ?? 0,
        total: subtotal + (envio ?? 0),
        postal: cp,
        address,
      }),
    });

    const dataCreate = await resCreate.json();

    if (!dataCreate.success) {
      setMessage(dataCreate.error || "No se pudo crear la orden.");
      setLoading(false);
      return;
    }

    const orderId = dataCreate.order_id;

    // -----------------------------
    // PASO 2 — Crear preferencia MP
    // -----------------------------
    const resMP = await fetch("/api/payments/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId, // 🔥 importante
      }),
    });

    const dataMP = await resMP.json();

    if (!dataMP.init_point) {
      setMessage("Error al generar pago. Intentá nuevamente.");
      setLoading(false);
      return;
    }

    // -----------------------------
    // PASO 3 — Redirigir a Mercado Pago
    // -----------------------------
    window.location.href = dataMP.init_point;
  }

  if (cart.length === 0)
    return (
      <div className="p-10 text-center text-xl">
        Tu carrito está vacío.
      </div>
    );

  const totalFinal = subtotal + (envio ?? 0);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Finalizar compra</h1>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Resumen</h2>

        {cart.map((item) => (
          <p key={item.id} className="flex justify-between">
            <span>
              {item.name}
              {item.tamano ? ` (${item.tamano})` : ""} × {item.quantity}
            </span>
            <span>${item.price * item.quantity}</span>
          </p>
        ))}

        <hr className="my-2" />

        <p className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal}</span>
        </p>

        <p className="flex justify-between">
          <span>Envío:</span>
          <span>{envio !== null ? `$${envio}` : "—"}</span>
        </p>

        <hr className="my-2" />

        <p className="text-lg font-bold flex justify-between">
          <span>Total:</span>
          <span>${totalFinal}</span>
        </p>
      </div>

      {/* Formulario */}
      <form className="flex flex-col gap-4">
        <input
          name="name"
          required
          placeholder="Nombre Completo"
          className="border p-2 rounded"
        />

        <input
          name="postal"
          placeholder="Código Postal"
          className="border p-2 rounded"
          value={postal}
          onChange={(e) => handlePostalInput(e.target.value)}
        />

        {/* Selector envío */}
        <div className="border p-3 rounded">
          <p className="font-semibold mb-2">Método de envío</p>

          <label className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="shippingMethod"
              value="domicilio"
              checked={shippingMethod === "domicilio"}
              onChange={() => handleShippingChange("domicilio")}
            />
            <span>Envío a domicilio</span>
          </label>

          <label className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="shippingMethod"
              value="sucursal"
              checked={shippingMethod === "sucursal"}
              onChange={() => handleShippingChange("sucursal")}
            />
            <span>Retiro en sucursal</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="shippingMethod"
              value="retiro"
              checked={shippingMethod === "retiro"}
              onChange={() => handleShippingChange("retiro")}
            />
            <span>Retiro en persona (Junín)</span>
          </label>
        </div>

        <input
          name="email"
          required
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
        />

        <textarea
          name="address"
          required
          placeholder="Dirección completa"
          className="border p-2 rounded"
        />

        <button
          onClick={iniciarPago}
          disabled={loading}
          className={`p-3 rounded text-white font-semibold ${
            loading ? "bg-blue-400" : "bg-blue-600"
          }`}
        >
          {loading ? "Procesando..." : "Pagar con Mercado Pago"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-red-600 font-medium">{message}</p>
      )}
    </div>
  );
}
