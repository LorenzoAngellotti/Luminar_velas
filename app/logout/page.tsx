"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  // Redirigir después de 1.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        gap: "1rem",
      }}
    >
      <h2>Has cerrado sesión</h2>
      <p style={{ color: "#555" }}>Redirigiendo...</p>

      <div className="loader"></div>

      <style jsx>{`
        .loader {
          width: 34px;
          height: 34px;
          border: 3px solid #dcdcdc;
          border-top-color: #111;
          border-radius: 50%;
          animation: spin 0.8s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
