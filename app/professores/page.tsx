"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { storageService } from "@/services/storageService";
import { Professor, Subject } from "@/types";
import {
  IconTeacher,
  IconPlus,
  IconTrash,
  IconSearch,
  IconPencil,
} from "@/components/icons/Icons";
import { Alert } from "@/components/ui/Alert";

export default function ProfessoresPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [professors, setProfessors] = useState<Professor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Formulário de Cadastro e Edição
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [name, setName] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("prof123");
  const [cargo, setCargo] = useState("Docente Titular");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const loadData = () => {
    setProfessors(storageService.getProfessors());
    setSubjects(storageService.getSubjects());
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (user.role !== "admin") {
        router.push(user.role === "professor" ? "/professor" : "/boletins");
      } else {
        loadData();
      }
    }
  }, [user, loading, router]);

  const handleCreateProfessor = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertInfo(null);

    if (!name.trim() || !matricula.trim()) {
      setAlertInfo({ type: "error", message: "Nome e Matrícula de Professor são obrigatórios." });
      return;
    }

    if (selectedSubjects.length === 0) {
      setAlertInfo({ type: "warning", message: "Vincule pelo menos uma matéria ao professor." });
      return;
    }

    const trimmedEmail = email.trim() || `${matricula.trim().toLowerCase()}@escola.pe.gov.br`;
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setAlertInfo({ type: "error", message: "Por favor, informe um formato de e-mail válido." });
      return;
    }

    const res = storageService.saveProfessor({
      id: editingProfessor?.id,
      name: name.trim(),
      matricula: matricula.trim().toUpperCase(),
      email: trimmedEmail,
      password: password.trim() || "prof123",
      cargo: cargo.trim() || "Docente Titular",
      subjectIds: selectedSubjects,
    });

    if (!res.success) {
      setAlertInfo({ type: "error", message: res.error || "Erro ao salvar professor." });
      return;
    }

    setAlertInfo({
      type: "success",
      message: editingProfessor
        ? `Informações do(a) Professor(a) ${name} atualizadas com sucesso!`
        : `Professor(a) ${name} cadastrado(a) com sucesso!`,
    });
    handleCancelEdit();
    loadData();
  };

  const handleStartEdit = (prof: Professor) => {
    setEditingProfessor(prof);
    setName(prof.name);
    setMatricula(prof.matricula);
    setEmail(prof.email);
    setPassword(prof.password || "prof123");
    setCargo(prof.cargo || "Docente Titular");
    setSelectedSubjects(prof.subjectIds || []);
    setAlertInfo({
      type: "warning",
      message: `Modo de edição: altere os dados do(a) Professor(a) ${prof.name} e clique em Salvar Alterações.`,
    });
  };

  const handleCancelEdit = () => {
    setEditingProfessor(null);
    setName("");
    setMatricula("");
    setEmail("");
    setPassword("prof123");
    setCargo("Docente Titular");
    setSelectedSubjects([]);
  };

  const handleDelete = (id: string, profName: string) => {
    if (editingProfessor?.id === id) {
      handleCancelEdit();
    }
    storageService.deleteProfessor(id);
    loadData();
    setAlertInfo({ type: "success", message: `Professor(a) ${profName} removido(a).` });
  };

  const toggleSubject = (subId: string) => {
    if (selectedSubjects.includes(subId)) {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subId));
    } else {
      setSelectedSubjects([...selectedSubjects, subId]);
    }
  };

  if (loading || !user || user.role !== "admin") return null;

  const filtered = professors.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <IconTeacher className="w-7 h-7 text-blue-800" />
            Corpo Docente & Matrículas de Professores
          </h1>
          <p className="text-sm text-slate-500">
            Cadastre e gerencie os professores e as disciplinas curriculares interligadas a cada um.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Novo / Edição Professor */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              {editingProfessor ? (
                <IconPencil className="w-5 h-5 text-yellow-600" />
              ) : (
                <IconPlus className="w-5 h-5 text-blue-800" />
              )}
              {editingProfessor ? "Atualizar Informações do Professor" : "Cadastrar Novo Professor"}
            </span>
            {editingProfessor && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Cancelar
              </button>
            )}
          </h2>

          <form onSubmit={handleCreateProfessor} className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Prof. Rogério Lins"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Matrícula Docente *
                </label>
                <input
                  type="text"
                  required
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  placeholder="Ex: PROF105"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Senha {editingProfessor ? "(Deixe para manter)" : "Inicial"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                E-mail Institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: rogerio.lins@escola.pe.gov.br"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Cargo / Especialidade
              </label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ex: Docente de Redes e Infraestrutura"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Disciplinas Interligadas *
              </label>
              <div className="max-h-36 overflow-y-auto p-2.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                {subjects.map((sub) => (
                  <label
                    key={sub.id}
                    className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-blue-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(sub.id)}
                      onChange={() => toggleSubject(sub.id)}
                      className="rounded text-blue-800"
                    />
                    <span className="font-semibold">[{sub.code}]</span>
                    <span className="truncate">{sub.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {editingProfessor && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className={`flex-1 py-2.5 px-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer ${
                  editingProfessor
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-blue-800 hover:bg-blue-900"
                }`}
              >
                {editingProfessor ? "Salvar Alterações" : "Cadastrar Professor"}
              </button>
            </div>
          </form>
        </div>

        {/* Listagem de Professores */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-2">
            <IconSearch className="w-5 h-5 text-slate-400 ml-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar professor por nome, matrícula ou especialidade..."
              className="w-full px-2 py-1 text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((prof) => {
              const profSubs = subjects.filter((s) => prof.subjectIds.includes(s.id));
              return (
                <div
                  key={prof.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-400 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-100 text-blue-950">
                        {prof.matricula}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(prof)}
                          className="p-1 rounded text-slate-400 hover:text-blue-700 transition cursor-pointer"
                          title="Editar informações do professor"
                        >
                          <IconPencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prof.id, prof.name)}
                          className="p-1 rounded text-slate-400 hover:text-red-700 transition cursor-pointer"
                          title="Remover professor"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900">{prof.name}</h3>
                    <p className="text-xs text-blue-700 font-semibold mt-0.5">{prof.cargo}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{prof.email}</p>

                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Matérias Interligadas:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {profSubs.map((s) => (
                          <span
                            key={s.id}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Acesso a Lançamento de Notas</span>
                    <span className="font-bold text-emerald-600">Ativo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
