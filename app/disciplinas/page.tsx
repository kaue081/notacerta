"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { storageService } from "@/services/storageService";
import { Subject, Professor } from "@/types";
import { Alert } from "@/components/ui/Alert";
import {
  IconBookOpen,
  IconSearch,
  IconPlus,
  IconPencil,
  IconTrash,
  IconX,
  IconAlertTriangle,
  IconCheckCircle,
} from "@/components/icons/Icons";

export default function DisciplinasPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  // Formulário
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  // Notificações
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (user.role !== "admin") {
        router.push("/boletins");
      } else {
        loadSubjects();
      }
    }
  }, [user, loading, router]);

  const loadSubjects = () => {
    setSubjects(storageService.getSubjects());
  };

  const showToast = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const openCreateModal = () => {
    setEditingSubject(null);
    setName("");
    // Sugestão de código baseado na quantidade
    setCode(`DISC-${subjects.length + 101}`);
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subject) => {
    setEditingSubject(sub);
    setName(sub.name);
    setCode(sub.code);
    setDescription(sub.description);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      showToast("error", "Nome e Código são obrigatórios.");
      return;
    }

    const payload = {
      id: editingSubject ? editingSubject.id : undefined,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
    };

    const res = storageService.saveSubject(payload);
    if (!res.success) {
      showToast("error", res.error || "Erro ao salvar disciplina.");
      return;
    }

    showToast(
      "success",
      editingSubject
        ? `Disciplina "${payload.name}" atualizada!`
        : `Disciplina "${payload.name}" cadastrada com sucesso!`
    );
    setIsModalOpen(false);
    loadSubjects();
  };

  const confirmDelete = () => {
    if (!subjectToDelete) return;
    storageService.deleteSubject(subjectToDelete.id);
    showToast("success", `Disciplina "${subjectToDelete.name}" foi removida.`);
    setSubjectToDelete(null);
    loadSubjects();
  };

  if (loading || !user || user.role !== "admin") {
    return null;
  }

  const filteredSubjects = subjects.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <AppLayout>
      {/* Toast Feedback com React Alert */}
      {feedback && (
        <div className="fixed top-20 right-6 z-50 max-w-sm">
          <Alert
            type={feedback.type}
            message={feedback.message}
            onClose={() => setFeedback(null)}
            autoCloseMs={4000}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <IconBookOpen className="w-7 h-7 text-blue-800" />
            Gerenciamento de Disciplinas
          </h1>
          <p className="text-sm text-slate-500">
            Configure as disciplinas curriculares que compõem a matriz de avaliação escolar.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm shadow-md transition active:scale-95 cursor-pointer"
        >
          <IconPlus className="w-4 h-4" />
          <span>Nova Disciplina</span>
        </button>
      </div>

      {/* Busca */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <IconSearch className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar disciplina por nome, código ou descrição..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Grid de Cards de Disciplinas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 transition group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {sub.code}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(sub)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-800 hover:bg-blue-50 transition"
                    title="Editar Disciplina"
                  >
                    <IconPencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSubjectToDelete(sub)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition"
                    title="Excluir Disciplina"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-800 transition">
                {sub.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-3">
                {sub.description || "Nenhuma ementa cadastrada para esta disciplina."}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Status: Ativa no currículo</span>
              <span className="font-semibold text-blue-700">Disponível p/ Notas</span>
            </div>
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center text-slate-400">
          Nenhuma disciplina encontrada para os termos pesquisados.
        </div>
      )}

      {/* MODAL CRIAR / EDITAR DISCIPLINA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-fade-in">
            <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <IconBookOpen className="w-5 h-5 text-yellow-400" />
                {editingSubject ? "Editar Disciplina" : "Nova Disciplina"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-blue-200 hover:text-white"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nome da Disciplina *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Desenvolvimento Web"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Código da Disciplina (Único) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex: DEV-101"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono uppercase"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  O administrador pode digitar o código ou manter o sugerido.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Descrição / Ementa
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descrição dos tópicos e competências..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold transition shadow cursor-pointer"
                >
                  Salvar Disciplina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO DE EXCLUSÃO */}
      {subjectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSubjectToDelete(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 z-10 animate-fade-in">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="p-2.5 rounded-xl bg-red-100">
                <IconAlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Confirmar Exclusão</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Deseja realmente excluir a disciplina{" "}
              <strong className="text-slate-900">{subjectToDelete.name}</strong> ({subjectToDelete.code})?
              Notas vinculadas a esta disciplina serão descartadas.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSubjectToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow cursor-pointer"
              >
                Sim, Excluir Disciplina
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
