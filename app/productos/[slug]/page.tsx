"use client";

import { useState, useEffect } from "react";

// Opciones de tamaño y precio (estas pueden venir de la DB más adelante)
const opciones = [
  { label: "100 ml", precio: 2500 },
  { label: "250 ml", precio: 5200 },
  { label: "500 ml", precio: 9800 },
  { label: "1 litro", precio: 18000 },
];

export default function ProductoPage({ params }: any) {
  const { slug } = params;

  const [producto, setProducto] = useState<any>(null);
  const [tamano, setTamano] = useState(opciones[0]);

  useEffect(() => {
    async function fetchProducto() {
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();
      setProducto(data);
    }
    fetchProducto();
  }, [slug]);

  if (!producto)
    return <p className="p-6 text-lg">Cargando producto...</p>;

  function addToCart() {
    const item = {
      id: producto.sku || `${slug}-${tamano.label}`,
      nombre: producto.name,
      tamano: tamano.label,
      precio: tamano.precio,
      imagen: producto.image || "/placeholder.jpg",
      cantidad: 1,
    };

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cart-updated"));
    alert("Producto agregado al carrito!");
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Imagen */}
        <img
          src={producto.image || "/placeholder.jpg"}
          alt={producto.name}
          className="rounded-lg shadow-lg w-full"
        />

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {producto.name}
          </h1>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {producto.descripcion ||
              "Esencia aromática de alta calidad ideal para velas artesanales."}
          </p>

          {/* STOCK */}
          <p
            className={`text-lg font-bold mb-4 ${
              producto.stock > 5
                ? "text-green-600"
                : producto.stock > 0
                ? "text-orange-500"
                : "text-red-600"
            }`}
          >
            {producto.stock > 0
              ? `Stock disponible: ${producto.stock}`
              : "Sin stock"}
          </p>

          {/* TAMAÑO */}
          <label className="block mb-2 font-semibold">Tamaño:</label>
          <select
            className="border p-2 rounded mb-6 w-full"
            value={tamano.label}
            onChange={(e) =>
              setTamano(opciones.find((x) => x.label === e.target.value)!)
            }
          >
            {opciones.map((opt) => (
              <option key={opt.label} value={opt.label}>
                {opt.label} — ${opt.precio}
              </option>
            ))}
          </select>

          {/* PRECIO */}
          <p className="text-xl font-bold mb-6">
            Precio: ${tamano.precio}
          </p>

          {/* BOTÓN */}
          <button
            onClick={addToCart}
            disabled={producto.stock === 0}
            className={`px-6 py-2 rounded text-white font-semibold ${
              producto.stock === 0
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}
