"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductosPage() {
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    async function cargarProductos() {
      const res = await fetch("/api/products");
      const data = await res.json();

      if (Array.isArray(data)) {
        setProductos(data);
      }
    }
    cargarProductos();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Productos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {productos.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg shadow hover:shadow-lg transition p-4"
          >
            <img
              src={p.image || "/placeholder.jpg"}
              className="w-full h-48 object-cover rounded"
            />

            <h2 className="text-xl font-semibold mt-3">{p.name}</h2>

            {p.tamano && (
              <p className="text-gray-600 text-sm">Tamaño: {p.tamano}</p>
            )}

            <p className="font-bold mt-2">${p.price}</p>

            {/* 🔥 STOCK VISUAL */}
            <p
              className={`mt-2 font-bold ${
                p.stock > 5
                  ? "text-green-600"
                  : p.stock > 0
                  ? "text-orange-500"
                  : "text-red-600"
              }`}
            >
              {p.stock > 0
                ? `Stock disponible: ${p.stock}`
                : "Sin stock"}
            </p>

            <Link
              href={`/productos/${p.slug}`}
              className={`mt-4 inline-block px-4 py-2 rounded text-white ${
                p.stock > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400"
              }`}
            >
              {p.stock > 0 ? "Ver detalles" : "Agotado"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
