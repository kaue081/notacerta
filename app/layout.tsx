import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "NotaCerta — Sistema de Gerenciamento Escolar",
  description: "Gerenciamento escolar de alunos, disciplinas, médias e boletins com identidade visual de Pernambuco.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-800">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
