import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { themeInitScript } from "@/lib/theme/constants";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-app",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KaiEdu — Gestión escolar inteligente",
  description:
    "KaiEdu: plataforma de gestión escolar. Matrícula, asistencia, calificaciones y comunicación con familias.",
  applicationName: "KaiEdu",
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d6efd",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={plusJakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
