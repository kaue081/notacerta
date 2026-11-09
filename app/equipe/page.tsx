"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { storageService } from "@/services/storageService";
import { TeamData, TeamMember } from "@/types";
import {
  PernambucoSunLogo,
  IconHeartHandshake,
  IconYoutube,
  IconGithub,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@/components/icons/Icons";
import { Alert } from "@/components/ui/Alert";

export default function EquipePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [teamData, setTeamData] = useState<TeamData>(storageService.getTeamData());
  const [isEditing, setIsEditing] = useState(false);

  // Estados de edição da equipe
  const [projectName, setProjectName] = useState(teamData.projectName);
  const [repoUrl, setRepoUrl] = useState(teamData.repoUrl);
  const [videoUrl, setVideoUrl] = useState(teamData.videoUrl);
  const [members, setMembers] = useState<TeamMember[]>(teamData.members);

  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const formatAvatarUrl = (url?: string) => {
    if (!url) return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80";
    let clean = url.replace(/\\/g, "/");
    clean = clean.replace(/^\/?public\//, "/");
    if (!clean.startsWith("/") && !clean.startsWith("http")) {
      clean = "/" + clean;
    }
    return clean;
  };

  const handleResetToDefaults = () => {
    const defaultData = storageService.resetTeamToDefaults();
    setTeamData(defaultData);
    setProjectName(defaultData.projectName);
    setRepoUrl(defaultData.repoUrl);
    setVideoUrl(defaultData.videoUrl);
    setMembers(defaultData.members);
    setAlertInfo({
      type: "success",
      message: "Dados da equipe e integrantes restaurados a partir do código do projeto!",
    });
  };

  const handleMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const handleAddMember = () => {
    if (members.length >= 5) {
      setAlertInfo({ type: "warning", message: "Limite máximo de 5 integrantes atingido." });
      return;
    }
    setMembers([
      ...members,
      {
        id: `mem-${Date.now()}`,
        name: "Novo Integrante",
        roleDescription: "Desenvolvedor(a)",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
        githubUrl: "https://github.com",
      },
    ]);
  };

  const handleRemoveMember = (index: number) => {
    if (members.length <= 1) {
      setAlertInfo({ type: "warning", message: "A equipe deve ter pelo menos 1 integrante." });
      return;
    }
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData: TeamData = {
      projectName: projectName.trim() || "NotaCerta",
      repoUrl: repoUrl.trim() || "https://github.com",
      videoUrl: videoUrl.trim() || "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      members,
    };

    storageService.saveTeamData(updatedData);
    setTeamData(updatedData);
    setIsEditing(false);
    setAlertInfo({ type: "success", message: "Dados da equipe e integrantes atualizados!" });
  };

  if (loading || !user) return null;

  // Valida e sanitiza URLs externas bloqueando protocolos perigosos (javascript:, data:, vbscript:)
  const sanitizeExternalUrl = (url: string, fallback: string = "#"): string => {
    if (!url || typeof url !== "string") return fallback;
    const trimmed = url.trim();
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return trimmed;
      }
    } catch {
      if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
        return trimmed;
      }
    }
    return fallback;
  };

  // Converte a URL do YouTube para embed seguro, validando o ID do vídeo
  const getCleanYoutubeEmbedUrl = (url: string) => {
    try {
      if (!url || typeof url !== "string") {
        return "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
      }
      const trimmed = url.trim();
      let videoId: string | null = null;

      if (trimmed.includes("youtu.be/")) {
        videoId = trimmed.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0] || null;
      } else if (trimmed.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(new URL(trimmed).search);
        videoId = urlParams.get("v");
      } else if (trimmed.includes("youtube.com/embed/")) {
        videoId = trimmed.split("youtube.com/embed/")[1]?.split("?")[0]?.split("&")[0] || null;
      }

      // Validação estrita de ID do YouTube (somente caracteres alfanuméricos seguros)
      if (videoId && /^[a-zA-Z0-9_-]{6,15}$/.test(videoId)) {
        if (typeof window !== "undefined") {
          storageService.setItem("notacerta_youtube_info", trimmed);
        }
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
      return "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
    } catch {
      return "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
    }
  };

  return (
    <AppLayout>
      {alertInfo && (
        <Alert
          type={alertInfo.type}
          message={alertInfo.message}
          onClose={() => setAlertInfo(null)}
          autoCloseMs={4000}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <IconHeartHandshake className="w-7 h-7 text-blue-800" />
            Identificação da Equipe do Projeto
          </h1>
          <p className="text-sm text-slate-500">
            Conheça os desenvolvedores, seus perfis no GitHub e o repositório da aplicação.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão para acessar o Repositório do Projeto no GitHub */}
          <a
            href={sanitizeExternalUrl(teamData.repoUrl, "https://github.com")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer"
          >
            <IconGithub className="w-4 h-4 text-white" />
            <span>Repositório no GitHub</span>
          </a>

          {user.role === "admin" && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs transition shadow cursor-pointer"
            >
              <IconPencil className="w-4 h-4" />
              <span>{isEditing ? "Cancelar" : "Editar Equipe"}</span>
            </button>
          )}
        </div>
      </div>

      {/* PAINEL INFORMATIVO DO PROJETO (TURMA E DATA DE ENTREGA FORAM REMOVIDOS CONFORME SOLICITADO) */}
      <div className="bg-linear-to-r from-blue-950 via-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 shrink-0">
            <PernambucoSunLogo className="w-14 h-14" />
          </div>
          <div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-yellow-400 text-blue-950 uppercase tracking-wider">
              Projeto Didático Front-end
            </span>
            <h2 className="text-3xl font-black tracking-tight mt-1">{teamData.projectName}</h2>
            <p className="text-xs text-blue-200 mt-0.5">
              Sistema de Gerenciamento Escolar e Boletins • Front-end com LocalStorage & Next.js
            </p>
          </div>
        </div>
      </div>

      {/* FORMULÁRIO DE EDIÇÃO DA EQUIPE */}
      {isEditing && (
        <form
          onSubmit={handleSaveTeam}
          className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-blue-900">
              Editar Integrantes e Links do Projeto
            </h3>
            <span className="text-xs text-slate-500">Máximo: 5 integrantes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nome do Projeto
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Link do Repositório no GitHub
              </label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Link do Vídeo no YouTube (Sem cookies / Privado)
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Integrantes da Equipe
              </label>
              {members.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                >
                  <IconPlus className="w-3.5 h-3.5" />
                  Adicionar Integrante
                </button>
              )}
            </div>

            <div className="space-y-3">
              {members.map((mem, index) => (
                <div
                  key={mem.id || index}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={mem.name}
                      onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                      placeholder="Nome completo"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                    />
                    <input
                      type="text"
                      value={mem.roleDescription || ""}
                      onChange={(e) =>
                        handleMemberChange(index, "roleDescription", e.target.value)
                      }
                      placeholder="Atribuição no projeto"
                      className="w-1/3 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={mem.avatarUrl}
                      onChange={(e) => handleMemberChange(index, "avatarUrl", e.target.value)}
                      placeholder="URL da Foto / Avatar"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                    />
                    <input
                      type="text"
                      value={mem.githubUrl}
                      onChange={(e) => handleMemberChange(index, "githubUrl", e.target.value)}
                      placeholder="URL Perfil GitHub"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="text-xs text-red-600 hover:text-red-800 font-semibold underline text-left cursor-pointer"
            >
              Restaurar Padrão do Projeto
            </button>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-800 text-white text-xs font-bold shadow cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      )}

      {/* CARDS DOS INTEGRANTES DA EQUIPE (CADA UM COM FOTO + BOTÃO PERFIL GITHUB) */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-3">Integrantes Responsáveis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {teamData.members.map((member, idx) => (
            <div
              key={member.id || idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition text-center"
            >
              <div>
                {/* Foto do Integrante */}
                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-3 border-blue-800 shadow-md mb-3 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formatAvatarUrl(member.avatarUrl)}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&background=1e3a8a&color=fff&size=200`;
                    }}
                  />
                </div>

                <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                  {member.name}
                </h4>
                <p className="text-xs text-blue-700 font-semibold mt-0.5 leading-snug">
                  {member.roleDescription || "Integrante da Equipe"}
                </p>
              </div>

              {/* Botão para Acessar Perfil no GitHub */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <a
                  href={sanitizeExternalUrl(member.githubUrl, "https://github.com")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition cursor-pointer"
                >
                  <IconGithub className="w-4 h-4 text-white" />
                  <span>Perfil no GitHub</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO DO VÍDEO EXPLICATIVO DO YOUTUBE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <IconYoutube className="w-6 h-6 text-red-600" />
              Vídeo de Demonstração da Aplicação
            </h3>
          </div>

          <a
            href={sanitizeExternalUrl(teamData.videoUrl, "https://www.youtube.com")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer shrink-0"
          >
            <IconYoutube className="w-4 h-4" />
            <span>Abrir no YouTube</span>
          </a>
        </div>

        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner">
          <iframe
            src={getCleanYoutubeEmbedUrl(teamData.videoUrl)}
            title="Vídeo Explicativo NotaCerta"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </AppLayout>
  );
}
