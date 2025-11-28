import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Luminar Velas",
  description: "Tienda de velas aromáticas y esencias",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

