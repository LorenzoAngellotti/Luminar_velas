"use client";

import { useState } from "react";

export default function ForgotPassword() {
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    const email = e.target.email.value;

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMsg(res.ok ? "Te enviamos un email con instrucciones" : data.error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow max-w-md w-full" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4 text-center">Recuperar contraseña</h1>

        <input
          name="email"
          type="email"
          placeholder="Tu email"
          className="border p-2 rounded w-full mb-4"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Enviar instrucciones
        </button>

        {msg && <p className="text-center mt-4 text-sm text-green-600">{msg}</p>}
      </form>
    </div>
  );
}
