"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/lib/useUser";
import { useCart } from "@/lib/useCart";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const { cartCount } = useCart();

  function toggleMenu() {
    setOpen(!open);
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link href="/" className="text-xl font-bold">
            Luminar Velas
          </Link>

          {/* HAMBURGER (MOBILE) */}
          <button
            className="md:hidden flex flex-col justify-between w-6 h-5"
            onClick={toggleMenu}
            aria-label="Abrir menú"
          >
            <span
              className={`block h-1 bg-black transition-all ${
                open ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-1 bg-black transition-all ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-1 bg-black transition-all ${
                open ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex gap-6 items-center">

            <Link href="/" className="hover:text-blue-600">
              Inicio
            </Link>

            <Link href="/productos" className="hover:text-blue-600">
              Productos
            </Link>

            <Link href="/contacto" className="hover:text-blue-600">
              Contacto
            </Link>

            {/* CARRITO (DESKTOP) */}
            <Link href="/carrito" className="relative flex items-center">
              <span className="text-2xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* MI CUENTA / LOGIN */}
            {user ? (
              <Link href="/cuenta" className="hover:text-blue-600">
                Mi Cuenta
              </Link>
            ) : (
              <Link href="/login" className="hover:text-blue-600">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div className="md:hidden bg-white shadow px-4 pb-4 flex flex-col gap-4 text-lg">
          <Link href="/" onClick={closeMenu}>
            Inicio
          </Link>

          <Link href="/productos" onClick={closeMenu}>
            Productos
          </Link>

          <Link href="/contacto" onClick={closeMenu}>
            Contacto
          </Link>

          {/* CARRITO (MOBILE) */}
          <Link
            href="/carrito"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">🛒</span>
            <span>Carrito</span>
            {cartCount > 0 && (
              <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* MI CUENTA / LOGIN */}
          {user ? (
            <Link href="/cuenta" onClick={closeMenu}>
              Mi Cuenta
            </Link>
          ) : (
            <Link href="/login" onClick={closeMenu}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
