"use client";

export type ProductType = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  tamano?: string;
  imagen?: string;
};

export function addToCart(product: ProductType) {
  const cart: ProductType[] = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  // Avisar al navbar
  window.dispatchEvent(new Event("cart-updated"));
}
