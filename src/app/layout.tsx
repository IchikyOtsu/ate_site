import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "After The End — Portail RP",
  description: "Accède au portail du serveur After The End.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#0e0c0a] text-[#d4cfc8] antialiased">
        {children}
      </body>
    </html>
  );
}
