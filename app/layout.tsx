import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fábrica de Carrosséis — Projeto Copiloto",
  description: "Dashboard interno para gerar, revisar e publicar carrosséis do Instagram e posts do LinkedIn.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen font-sans">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 mb-8 sm:mb-10">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#4DA3FF]" />
              <span className="font-extrabold tracking-wide text-xs sm:text-sm text-softer">FÁBRICA DE CARROSSÉIS</span>
            </Link>
            <nav className="flex gap-4 text-sm font-semibold">
              <Link href="/" className="text-soft hover:text-white">Fila</Link>
              <Link href="/novo" className="text-soft hover:text-white">Novo post</Link>
              <Link href="/config" className="text-soft hover:text-white">Configurações</Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
