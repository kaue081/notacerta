"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserSession } from "@/types";
import { storageService } from "@/services/storageService";
import { authService } from "@/services/authService";

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
    let savedCollapsed: string | null = null;
    try {
      savedCollapsed = storageService.getItem("notacerta_sidebar_collapsed");
    } catch {
      // ignore
    }

    queueMicrotask(() => {
      if (currentSession) {
        setUser(currentSession);
      }
      if (savedCollapsed === "true") {
        setSidebarCollapsedState(true);
      }
      setLoading(false);
    });
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsedState((prev) => {
      const next = !prev;
      try {
        storageService.setItem("notacerta_sidebar_collapsed", String(next));
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
    const result = authService.authenticate(identifier, password);
    if (result.success && result.session) {
      setUser(result.session);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  // Cadastro e validação de novo professor com matrícula
  const registerProfessor = (data: {
    name: string;
    matricula: string;
    email: string;
    password: string;
    cargo: string;
    subjectIds: string[];
  }) => {
    const res = storageService.saveProfessor(data);
    if (!res.success) {
      return { success: false, error: res.error };
    }
    return { success: true };
  };

  // Encerramento de sessão seguro: limpa credenciais e dados locais do localStorage
  const logout = () => {
    authService.terminateSession();
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
