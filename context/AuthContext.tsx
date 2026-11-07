"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserSession } from "@/types";
import { storageService } from "@/services/storageService";

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (identifier: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  registerProfessor: (data: {
    name: string;
    matricula: string;
    email: string;
    password: string;
    cargo: string;
    subjectIds: string[];
  }) => { success: boolean; error?: string };
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(false);

  useEffect(() => {
    storageService.init();
    const currentSession = storageService.getSession();
    if (currentSession) {
      setUser(currentSession);
    }
    try {
      const savedCollapsed = localStorage.getItem("notacerta_sidebar_collapsed");
      if (savedCollapsed === "true") {
        setSidebarCollapsedState(true);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("notacerta_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const setSidebarCollapsed = (val: boolean) => {
    setSidebarCollapsedState(val);
    try {
      localStorage.setItem("notacerta_sidebar_collapsed", String(val));
    } catch {
      // ignore
    }
  };

  const login = (identifier: string, password: string): { success: boolean; error?: string } => {
    const trimmedId = identifier.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedId || !trimmedPass) {
      return { success: false, error: "Preencha todos os campos para continuar." };
    }

    // 1. Checagem de Administrador (por e-mail institucional ou usuário)
    if (
      (trimmedId === "admin@escola.pe.gov.br" || trimmedId === "admin") &&
      trimmedPass === "admin123"
    ) {
      const adminSession: UserSession = {
        id: "usr-admin",
        name: "Administrador Geral",
        identifier: "admin@escola.pe.gov.br",
        role: "admin",
        cargo: "Direção & Gestão Escolar",
      };
      storageService.setSession(adminSession);
      setUser(adminSession);
      return { success: true };
    }

    // 2. Checagem de Professor (por e-mail ou matrícula funcional)
    const professor =
      storageService.getProfessorByEmail(trimmedId) ||
      storageService.getProfessorByMatricula(trimmedId);
    if (professor) {
      if (professor.password === trimmedPass) {
        const profSession: UserSession = {
          id: `usr-${professor.id}`,
          name: professor.name,
          identifier: professor.email,
          role: "professor",
          cargo: professor.cargo || "Docente Titular",
          professorId: professor.id,
          subjectIds: professor.subjectIds,
        };
        storageService.setSession(profSession);
        setUser(profSession);
        return { success: true };
      } else {
        return { success: false, error: "Senha incorreta para o e-mail de professor informado." };
      }
    }

    // 3. Checagem de Aluno (por e-mail institucional ou matrícula)
    const student =
      storageService.getStudentByEmail(trimmedId) ||
      storageService.getStudentByMatricula(trimmedId);
    if (student) {
      if (student.password === trimmedPass) {
        const studentSession: UserSession = {
          id: `usr-${student.id}`,
          name: student.name,
          identifier: student.email,
          role: "aluno",
          cargo: `Estudante • Turma ${student.turma}`,
          studentId: student.id,
        };
        storageService.setSession(studentSession);
        setUser(studentSession);
        return { success: true };
      } else {
        return { success: false, error: "Senha incorreta para o e-mail de aluno informado." };
      }
    }

    return {
      success: false,
      error: "E-mail ou senha incorretos. Verifique suas credenciais de acesso.",
    };
  };

  // Cadastro e validação de novo professor com matrícula
  const registerProfessor = (data: {
    name: string;
    matricula: string;
    email: string;
    password: string;
    cargo: string;
    subjectIds: string[];
  }): { success: boolean; error?: string } => {
    const res = storageService.saveProfessor(data);
    if (!res.success) {
      return { success: false, error: res.error };
    }
    return { success: true };
  };

  // O botão de sair retira todas as informações do local storage e remove os cookies (inclusive do YouTube)
  const logout = () => {
    storageService.clearAllLocalStorage();
    storageService.clearAllCookies();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        registerProfessor,
        sidebarCollapsed,
        toggleSidebar,
        setSidebarCollapsed,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
