"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // 🔥 Si el backend redirige → lo seguimos
    if (res.redirected) {
      window.location.href = res.url;
      return;
    }

    // 🔥 Si no hubo redirección, entonces sí leemos JSON
    try {
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error en el registro");
      }
    } catch {
      setError("Error en el servidor");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Crear cuenta
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
            Registrarse
          </button>
        </div>

        <p className="mt-4 text-center text-sm">
          ¿Ya tenés cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Iniciar sesión
          </a>
        </p>
      </form>
    </div>
  );
}
