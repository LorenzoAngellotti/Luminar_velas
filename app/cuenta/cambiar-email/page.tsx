"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CambiarEmailPage() {
  const router = useRouter();

  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    setError("");

    const res = await fetch("/api/auth/cambiar-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newEmail }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al actualizar email");
      setLoading(false);
      return;
    }

    setMensaje("Email actualizado correctamente 🎉");
    setLoading(false);

    // Redirige luego de 1.5 segundos
    setTimeout(() => router.push("/cuenta"), 1500);
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Cambiar Email</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-5 border border-gray-200 flex flex-col gap-4"
      >
        <label className="font-medium">Nuevo Email</label>
        <input
          type="email"
          required
          className="p-2 border rounded-lg"
          placeholder="nuevoemail@gmail.com"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />

        {error && <p className="text-red-600">{error}</p>}
        {mensaje && <p className="text-green-600">{mensaje}</p>}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Actualizando..." : "Actualizar Email"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
        >
          Volver
        </button>
      </form>
    </div>
  );
}
