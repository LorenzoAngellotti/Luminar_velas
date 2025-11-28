"use client";

import { useEffect, useState } from "react";

export default function Carrito() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  function actualizarCantidad(index, cantidad) {
    const updated = [...cart];
    updated[index].cantidad = Math.max(1, Number(cantidad));
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
  }

  function eliminarProducto(index) {
    const updated = cart.filter((_, i) => i !== index);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event("cart-updated"));
  }

  function vaciarCarrito() {
    localStorage.removeItem("cart");
    setCart([]);
    window.dispatchEvent(new Event("cart-updated"));
  }

  const total = cart.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  if (cart.length === 0)
    return (
      <div className="p-10 text-center text-xl">
        <p>Tu carrito está vacío</p>
        <a href="/productos" className="text-blue-600 underline mt-4 block">
          Ver productos
        </a>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>

      {cart.map((item, index) => (
        <div
          key={item.id + index}
          className="border p-4 rounded mb-4 flex items-center justify-between"
        >
          <div>
            <p className="font-semibold">{item.nombre}</p>
            <p className="text-sm text-gray-600">{item.tamano}</p>
            <p className="mt-1 font-bold">${item.precio}</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              value={item.cantidad}
              min={1}
              onChange={(e) => actualizarCantidad(index, e.target.value)}
              className="w-16 border p-1 rounded"
            />

            <button
              className="bg-red-500 text-white px-4 py-1 rounded"
              onClick={() => eliminarProducto(index)}
            >
              X
            </button>
          </div>
        </div>
      ))}

      {/* Total */}
      <div className="bg-gray-100 p-4 rounded text-xl font-bold mb-4">
        Total: ${total}
      </div>

      <div className="flex gap-4">
        <button
          onClick={vaciarCarrito}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Vaciar carrito
        </button>

        <a
          href="/checkout"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Finalizar compra
        </a>
      </div>
    </div>
  );
}
