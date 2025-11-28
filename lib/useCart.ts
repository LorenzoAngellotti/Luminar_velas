"use client";

import { useEffect, useState } from "react";

export function useCart() {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(stored.length);

    const handler = () => {
      const updated = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(updated.length);
    };

    window.addEventListener("cart-updated", handler);

    return () => {
      window.removeEventListener("cart-updated", handler);
    };
  }, []);

  return { cartCount };
}
