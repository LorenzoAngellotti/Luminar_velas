"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const params = useSearchParams();
  const token = params.get("token");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    const password = e.target.password.value;

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setMsg(res.ok ? "Contraseña actualizada" : data.error);
  }

  if (!token) return <p>Token inválido</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow max-w-md w-full" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4 text-center">Nueva contraseña</h1>

        <input
          name="password"
          type="password"
          placeholder="Nueva contraseña"
          className="border p-2 rounded w-full mb-4"
          required
        />

        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Guardar nueva contraseña
        </button>

        {msg && <p className="text-center mt-4 text-sm">{msg}</p>}
      </form>
    </div>
  );
}
