"use client";

import { useState } from "react";

export default function Login() {
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      window.location.href = "/";
      return;
    }

    try {
      const data = await res.json();
      setError(data.error || "Error en el login");
    } catch {
      setError("Error en el servidor");
    }
  }

  async function handleResendVerification() {
    const email = prompt("Ingresá tu email para reenviar verificación:");
    if (!email) return;

    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Te enviamos un nuevo email de verificación.");
    } else {
      alert("Error: " + data.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Iniciar sesión
        </h1>

        {error && (
          <p className="text-red-500 mb-4 text-center">{error}</p>
        )}

        <div className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="border p-2 rounded w-full"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="border p-2 rounded w-full"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </div>

        {/* 🔥 BOTÓN NUEVO 🔥 */}
        <button
          type="button"
          onClick={handleResendVerification}
          className="text-blue-600 text-sm mt-4 underline block mx-auto"
        >
          ¿No recibiste el email? Reenviar verificación
        </button>

        <p className="mt-4 text-center text-sm">
          ¿No tenés cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Crear una cuenta
          </a>
        </p>
      </form>
    </div>
  );
}
