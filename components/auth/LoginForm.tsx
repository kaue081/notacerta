"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { storageService } from "@/services/storageService";
import { PernambucoSunLogo, IconEye, IconEyeOff } from "@/components/icons/Icons";
import { Alert } from "@/components/ui/Alert";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertInfo(null);
    setIsSubmitting(true);

    const result = login(identifier, password);
    if (!result.success) {
      setAlertInfo({
        type: "error",
        title: "Acesso Recusado",
        message: result.error || "Credenciais não encontradas. Verifique usuário e senha.",
      });
      setIsSubmitting(false);
    } else {
      setAlertInfo({
        type: "success",
        title: "Acesso Autorizado",
        message: "Identificação confirmada! Redirecionando...",
      });
      setTimeout(() => {
        const session = storageService.getSession();
        if (session?.role === "admin") {
          router.push("/dashboard");
        } else if (session?.role === "professor") {
          router.push("/professor");
        } else {
          router.push("/boletins");
        }
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-950 via-blue-900 to-slate-900 flex flex-col justify-center items-center p-4">
      {/* Barra superior com as cores oficiais de Pernambuco */}
      <div className="w-full max-w-md h-2 rounded-t-2xl bg-linear-to-r from-red-600 via-yellow-400 to-green-600 shadow-md" />

      {/* Card Principal de Login */}
      <div className="w-full max-w-md bg-white rounded-b-2xl shadow-2xl p-7 sm:p-9 border border-slate-200">
        {/* Cabeçalho da Marca */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 border border-blue-100 shadow-inner mb-3">
            <PernambucoSunLogo className="w-14 h-14" />
          </div>
          <h1 className="text-3xl font-black text-blue-950 tracking-tight">
            Nota<span className="text-yellow-500">Certa</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            Governo de Pernambuco • Gestão Escolar
          </p>
        </div>

        {/* Mensagens de Alerta */}
        {alertInfo && (
          <div className="mb-5">
            <Alert
              type={alertInfo.type}
              title={alertInfo.title}
              message={alertInfo.message}
              onClose={() => setAlertInfo(null)}
            />
          </div>
        )}

        {/* Formulário Único e Limpo de Acesso */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              E-mail Institucional
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Ex: admin@escola.pe.gov.br"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Informe seu e-mail institucional e senha de acesso.
            </p>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Informe sua senha"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 focus:outline-none cursor-pointer"
                title={showPassword ? "Ocultar senha" : "Exibir senha"}
              >
                {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-extrabold text-white bg-blue-800 hover:bg-blue-900 active:scale-[0.99] transition shadow-lg shadow-blue-900/25 cursor-pointer disabled:opacity-50 text-sm tracking-wide"
          >
            {isSubmitting ? "Autenticando..." : "Entrar no Sistema"}
          </button>
        </form>
      </div>

      {/* Rodapé da Tela de Login */}
      <footer className="mt-6 text-center text-xs text-blue-200/80">
        <p className="font-semibold">NotaCerta • Secretaria de Educação e Esportes de Pernambuco</p>
        <p className="text-[11px] text-blue-300/60 mt-0.5">Ambiente Escolar 100% Local • Turma 2DS-A</p>
      </footer>
    </div>
  );
}
