"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu({ isLogged }: { isLogged: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      <button
        className="text-3xl select-none"
        onClick={() => setOpen((o) => !o)}
      >
        ☰
      </button>

      {open && (
        <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-lg p-5 w-52 flex flex-col gap-3 border border-gray-200 animate-fadeIn">
          <Link href="/" onClick={() => setOpen(false)}>Inicio</Link>
          <Link href="/productos" onClick={() => setOpen(false)}>Productos</Link>
          <Link href="/contacto" onClick={() => setOpen(false)}>Contacto</Link>
          <Link href="/carrito" onClick={() => setOpen(false)}>Carrito</Link>

          {!isLogged ? (
            <Link
              href="/login"
              className="px-3 py-2 border border-blue-600 text-blue-600 rounded-lg"
              onClick={() => setOpen(false)}
            >
              Iniciar sesión
            </Link>
          ) : (
            <>
              <Link
                href="/cuenta"
                className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => setOpen(false)}
              >
                Mi Cuenta
              </Link>

              <form action="/api/auth/logout" method="POST">
                <button
                  className="px-3 py-2 bg-red-500 text-white rounded-lg w-full"
                  onClick={() => setOpen(false)}
                >
                  Cerrar sesión
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
