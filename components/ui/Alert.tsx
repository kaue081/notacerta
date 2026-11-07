"use client";

import React, { useEffect } from "react";
import {
  IconCheckCircle,
  IconAlertTriangle,
  IconXCircle,
  IconHelpCircle,
  IconX,
} from "@/components/icons/Icons";

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  autoCloseMs?: number;
  className?: string;
}

export function Alert({
  type,
  title,
  message,
  onClose,
  autoCloseMs,
  className = "",
}: AlertProps) {
  useEffect(() => {
    if (autoCloseMs && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [autoCloseMs, onClose]);

  const config = {
    success: {
      bg: "bg-emerald-50 border-emerald-300 text-emerald-900",
      icon: <IconCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
      defaultTitle: "Operação Realizada",
    },
    error: {
      bg: "bg-red-50 border-red-300 text-red-900",
      icon: <IconXCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />,
      defaultTitle: "Atenção / Erro",
    },
    warning: {
      bg: "bg-amber-50 border-amber-300 text-amber-900",
      icon: <IconAlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
      defaultTitle: "Aviso do Sistema",
    },
    info: {
      bg: "bg-blue-50 border-blue-300 text-blue-900",
      icon: <IconHelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
      defaultTitle: "Informação",
    },
  }[type];

  return (
    <div
      role="alert"
      className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 transition-all animate-fade-in ${config.bg} ${className}`}
    >
      {config.icon}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-xs uppercase tracking-wider">
          {title || config.defaultTitle}
        </h4>
        <p className="text-xs mt-0.5 leading-relaxed font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 text-current transition cursor-pointer"
          aria-label="Fechar alerta"
        >
          <IconX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
