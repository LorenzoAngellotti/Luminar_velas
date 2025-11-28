import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Luminar Velas"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
