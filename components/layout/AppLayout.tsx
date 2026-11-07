"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  PernambucoSunLogo,
  IconDashboard,
  IconUsers,
  IconBookOpen,
  IconAward,
  IconFileText,
  IconHeartHandshake,
  IconLogOut,
  IconMenu,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconTeacher,
} from "@/components/icons/Icons";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout, sidebarCollapsed, toggleSidebar } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // O estado 'collapsed' é gerenciado globalmente no AuthContext e persistido no LocalStorage,
  // garantindo que ao navegar entre as páginas a sidebar permaneça recolhida!
  const collapsed = sidebarCollapsed;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const role = user?.role || "aluno";
  const isAdmin = role === "admin";
  const isProfessor = role === "professor";

  // Perfil formatado para a 1ª linha do cabeçalho
  const perfilLabel = isAdmin ? "ADM" : isProfessor ? "PROFESSOR" : "ALUNO";

  // Itens de navegação estritamente separados por perfil
  // Conforme solicitação: ADM NÃO tem preenchimento de notas!
  let navItems = [
    { label: "Meu Boletim", href: "/boletins", icon: IconFileText },
    { label: "Equipe", href: "/equipe", icon: IconHeartHandshake },
  ];

  if (isAdmin) {
    navItems = [
      { label: "Dashboard", href: "/dashboard", icon: IconDashboard },
      { label: "Alunos", href: "/alunos", icon: IconUsers },
      { label: "Disciplinas", href: "/disciplinas", icon: IconBookOpen },
      { label: "Professores", href: "/professores", icon: IconTeacher },
      { label: "Boletins", href: "/boletins", icon: IconFileText },
      { label: "Equipe", href: "/equipe", icon: IconHeartHandshake },
    ];
  } else if (isProfessor) {
    navItems = [
      { label: "Minhas Disciplinas", href: "/professor", icon: IconDashboard },
      { label: "Lançamento de Médias", href: "/medias", icon: IconAward },
      { label: "Diário de Aulas", href: "/aulas", icon: IconCalendar },
      { label: "Boletins Escolares", href: "/boletins", icon: IconFileText },
      { label: "Equipe", href: "/equipe", icon: IconHeartHandshake },
    ];
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* CABEÇALHO SUPERIOR */}
      <header className="sticky top-0 z-40 bg-blue-900 border-b border-blue-950 text-white shadow-md print:hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 h-18">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition"
              aria-label="Abrir menu"
            >
              <IconMenu className="w-6 h-6" />
            </button>

            {/* Logo e Nome NotaCerta */}
            <Link
              href={isAdmin ? "/dashboard" : isProfessor ? "/professor" : "/boletins"}
              className="flex items-center gap-3 group"
            >
              <PernambucoSunLogo className="w-10 h-10 transition-transform group-hover:scale-105" />
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-1">
                  Nota<span className="text-yellow-400">Certa</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-wider text-blue-200 font-medium">
                  Governo do Estado de Pernambuco • Educação
                </span>
              </div>
            </Link>
          </div>

          {/* DADOS DO USUÁRIO CONFORME A IMAGEM SOLICITADA:
              Linha 1: Perfil: ADM / PROFESSOR / ALUNO
              Linha 2: Nome do usuário
              Linha 3: Profissão/Cargo na escola
          */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right flex flex-col justify-center">
              {/* Linha 1: Perfil */}
              <div className="text-[11px] font-black uppercase tracking-wider text-yellow-300">
                Perfil: <span className="underline decoration-yellow-400">{perfilLabel}</span>
              </div>
              {/* Linha 2: Nome */}
              <div className="text-sm font-extrabold text-white leading-tight">
                {user?.name || "Usuário"}
              </div>
              {/* Linha 3: Profissão na escola */}
              <div className="text-[11px] text-blue-200 font-medium leading-tight">
                {user?.cargo || "Educação Básica & Técnica"}
              </div>
            </div>

            {/* Botão Sair - Retira todas as informações do LocalStorage */}
            <button
              onClick={handleLogout}
              title="Sair do sistema (limpa os dados locais)"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition shadow-sm hover:shadow active:scale-95 cursor-pointer shrink-0"
            >
              <IconLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* CORPO: SIDEBAR RETRÁTIL + CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR DESKTOP
            Observação: Quando retraída, o clique em um link apenas navega,
            SEM abrir ou alterar o estado 'collapsed'.
        */}
        <aside
          className={`hidden md:flex flex-col bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-300 print:hidden select-none shrink-0 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Header da Sidebar com botão retrátil */}
          <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
            {!collapsed && (
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Menu de Acesso
              </span>
            )}
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition mx-auto cursor-pointer"
              title={collapsed ? "Expandir Menu" : "Recolher Menu"}
            >
              {collapsed ? (
                <IconChevronRight className="w-5 h-5 text-yellow-400" />
              ) : (
                <IconChevronLeft className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>

          {/* Links do Menu (mantém 'collapsed' intacto ao clicar) */}
          <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-700 text-white shadow-md shadow-blue-900/30 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? "text-yellow-300" : "text-slate-400"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Rodapé da Sidebar */}
          <div className="p-3 border-t border-slate-800 text-center text-xs text-slate-400">
            {!collapsed ? (
              <div>
                <p className="font-semibold text-slate-300">NotaCerta v1.2</p>
                <p className="text-[11px] text-slate-500">Pernambuco • Gestão Escolar</p>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-yellow-400">PE</span>
            )}
          </div>
        </aside>

        {/* SIDEBAR MOBILE (DRAWER) */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-slate-900 text-slate-100 flex flex-col z-10 shadow-2xl">
              <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-blue-950">
                <div className="flex items-center gap-2">
                  <PernambucoSunLogo className="w-7 h-7" />
                  <span className="font-bold text-white">NotaCerta</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-lg text-slate-300 hover:bg-slate-800"
                >
                  <IconX className="w-6 h-6" />
                </button>
              </div>

              <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800 text-xs">
                <span className="text-[10px] font-bold uppercase text-yellow-400 block">
                  Perfil: {perfilLabel}
                </span>
                <p className="font-semibold text-white">{user?.name}</p>
                <p className="text-slate-400 text-[11px]">{user?.cargo}</p>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? "bg-blue-700 text-white font-semibold"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isActive ? "text-yellow-300" : "text-slate-400"}`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition"
                >
                  <IconLogOut className="w-4 h-4" />
                  <span>Sair do Sistema</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ÁREA DE CONTEÚDO PRINCIPAL COM TRANSIÇÃO SUAVE AO TROCAR DE PÁGINA */}
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div
            key={pathname}
            className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in"
          >
            <div className="max-w-7xl mx-auto space-y-6">{children}</div>
          </div>

          {/* RODAPÉ GLOBAL (FOOTER) SOLICITADO */}
          <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 print:hidden">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PernambucoSunLogo className="w-5 h-5" />
                <span className="font-bold text-slate-800">NotaCerta</span>
                <span>• Secretaria de Educação e Esportes de Pernambuco</span>
              </div>
              <div>
                <span>Sistema Acadêmico Front-end 100% Local • Turma 2DS-A</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
