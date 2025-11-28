"use client";

import { useUser } from "@/lib/useUser";
import { useEffect, useState } from "react";

export default function Cuenta() {
  const { user, loading } = useUser();
  const [passwordMessage, setPasswordMessage] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadOrders() {
      if (!user) return;
      const res = await fetch("/api/orders/history");
      const data = await res.json();
      setOrders(data.orders || []);
    }
    loadOrders();
  }, [user]);

  if (loading) return <p className="p-8 text-lg">Cargando...</p>;
  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  async function updatePassword(e: any) {
    e.preventDefault();
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;

    const res = await fetch("/api/auth/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();
    setPasswordMessage(data.success ? "Contraseña actualizada!" : data.error);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6">
      {/* TÍTULO */}
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Mi Cuenta</h1>

      {/* TARJETA DE DATOS */}
      <div className="bg-gray-100 p-5 rounded-xl shadow-sm border mb-8">
        <p className="text-sm text-gray-500 font-semibold uppercase mb-2">
          Datos del Usuario
        </p>
        <p className="font-medium">
          <span className="text-gray-600">ID:</span> {user.id}
        </p>
        <p className="font-medium mt-1">
          <span className="text-gray-600">Email:</span> {user.email}
        </p>
      </div>

      {/* CAMBIAR CONTRASEÑA */}
      <div className="bg-white p-6 rounded-xl shadow border mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Cambiar Contraseña
        </h2>

        <form onSubmit={updatePassword} className="flex flex-col gap-4">
          <input
            type="password"
            name="oldPassword"
            placeholder="Contraseña actual"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="Nueva contraseña"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <button className="bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg text-center font-semibold">
            Actualizar contraseña
          </button>
        </form>

        {passwordMessage && (
          <p className="mt-3 text-blue-600 font-medium">
            {passwordMessage}
          </p>
        )}
      </div>

      {/* HISTORIAL DE COMPRAS */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Historial de Compras
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-600">No tenés compras registradas.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              // 👇 ÚNICO BLOQUE CAMBIADO
              let items: any[] = [];

              const rawItems = (order as any).items;

              if (Array.isArray(rawItems)) {
                // ya viene como array (json/jsonb)
                items = rawItems;
              } else if (typeof rawItems === "string") {
                // viene como texto -> intentar parsear
                try {
                  items = JSON.parse(rawItems);
                } catch {
                  items = [];
                }
              }

              return (
                <div
                  key={order.id}
                  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                >
                  <p className="font-semibold text-gray-800">
                    Pedido #{order.id}
                  </p>
                  <p className="text-gray-700">
                    Total: <b>${order.total}</b>
                  </p>

                  {items.length > 0 && (
                    <ul className="mt-2 ml-4 list-disc text-sm text-gray-700">
                      {items.map((item, idx) => (
                        <li key={idx}>
                          {item.nombre || item.name || "Producto"}{" "}
                          {item.tamano ? `— ${item.tamano}` : ""}{" "}
                          — Cantidad: {item.cantidad ?? item.quantity ?? 1}
                        </li>
                      ))}
                    </ul>
                  )}


                  <p className="text-gray-600 text-sm mt-2">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CERRAR SESIÓN */}
      <div className="bg-white p-6 rounded-xl shadow border mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Cerrar sesión
        </h2>

        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-3 rounded-lg font-semibold"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
