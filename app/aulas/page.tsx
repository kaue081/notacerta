"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { storageService } from "@/services/storageService";
import { Subject, LessonRecord } from "@/types";
import {
  IconCalendar,
  IconPlus,
  IconPencil,
  IconTrash,
  IconX,
} from "@/components/icons/Icons";
import { Alert } from "@/components/ui/Alert";

export default function AulasPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [mySubjects, setMySubjects] = useState<Subject[]>([]);
  const [lessons, setLessons] = useState<LessonRecord[]>([]);

  // Estado de Edição
  const [editingLesson, setEditingLesson] = useState<LessonRecord | null>(null);

  // Formulário de Aula
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [turma, setTurma] = useState("2DS-A");
  const [date, setDate] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");

  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (user.role !== "professor") {
        router.push(user.role === "admin" ? "/dashboard" : "/boletins");
      } else {
        loadData();
      }
    }
  }, [user, loading, router]);

  const loadData = () => {
    const allSubjects = storageService.getSubjects();
    const profSubjectIds = user?.subjectIds || [];
    const filteredSubs = allSubjects.filter(
      (s) => profSubjectIds.includes(s.id) || s.professorId === user?.professorId
    );
    const validSubs = filteredSubs.length > 0 ? filteredSubs : allSubjects;
    setMySubjects(validSubs);
    if (validSubs.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(validSubs[0].id);
    }

    setLessons(storageService.getLessons(user?.professorId));
    if (!date) {
      setDate(new Date().toISOString().split("T")[0]);
    }
  };

  const handleStartEdit = (les: LessonRecord) => {
    setEditingLesson(les);
    setSelectedSubjectId(les.subjectId);
    setTurma(les.turma);
    setDate(les.date);
    setTopic(les.topic);
    setContent(les.content);
    setAlertInfo({
      type: "info",
      message: `Modo de edição ativado para a aula "${les.topic}". Modifique os campos abaixo e clique em Atualizar.`,
    });
  };

  const handleCancelEdit = () => {
    setEditingLesson(null);
    setTopic("");
    setContent("");
    setDate(new Date().toISOString().split("T")[0]);
    setTurma("2DS-A");
    setAlertInfo(null);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertInfo(null);

    if (!topic.trim() || !date) {
      setAlertInfo({ type: "error", message: "Informe a data e o tema da aula ministrada." });
      return;
    }

    const payload = {
      id: editingLesson ? editingLesson.id : undefined,
      professorId: user?.professorId || "prof-1",
      subjectId: selectedSubjectId,
      turma: turma.trim() || "2DS-A",
      date,
      topic: topic.trim(),
      content: content.trim(),
    };

    const res = storageService.saveLesson(payload);

    if (!res.success) {
      setAlertInfo({ type: "error", message: res.error || "Erro ao registrar aula." });
      return;
    }

    setAlertInfo({
      type: "success",
      message: editingLesson
        ? `Aula "${topic}" atualizada com sucesso no diário!`
        : `Aula "${topic}" gravada com sucesso no diário de classe!`,
    });

    setEditingLesson(null);
    setTopic("");
    setContent("");
    setDate(new Date().toISOString().split("T")[0]);
    setLessons(storageService.getLessons(user?.professorId));
  };

  const handleDeleteLesson = (id: string) => {
    storageService.deleteLesson(id);
    if (editingLesson?.id === id) {
      handleCancelEdit();
    }
    setLessons(storageService.getLessons(user?.professorId));
    setAlertInfo({ type: "success", message: "Registro de aula removido do diário." });
  };

  if (loading || !user || user.role !== "professor") return null;

  return (
    <AppLayout>
      {alertInfo && (
        <Alert
          type={alertInfo.type}
          message={alertInfo.message}
          onClose={() => setAlertInfo(null)}
          autoCloseMs={4500}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <IconCalendar className="w-7 h-7 text-blue-800" />
            Diário de Classe & Registro de Aulas
          </h1>
          <p className="text-sm text-slate-500">
            Cadastre, edite e consulte os conteúdos e metodologias pedagógicas ministradas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Registro / Edição de Aula */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {editingLesson ? (
                <>
                  <IconPencil className="w-5 h-5 text-amber-600" />
                  <span>Editar Registro de Aula</span>
                </>
              ) : (
                <>
                  <IconPlus className="w-5 h-5 text-blue-800" />
                  <span>Novo Registro de Aula</span>
                </>
              )}
            </h2>

            {editingLesson && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
              >
                <IconX className="w-3.5 h-3.5" />
                <span>Cancelar</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSaveLesson} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Disciplina Interligada *
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {mySubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    [{sub.code}] {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Turma *
                </label>
                <input
                  type="text"
                  required
                  value={turma}
                  onChange={(e) => setTurma(e.target.value)}
                  placeholder="Ex: 2DS-A"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Data da Aula *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Tema / Assunto Principal *
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Estruturação de Banco de Dados"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Conteúdo & Metodologia
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Resumo das atividades desenvolvidas em sala..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              {editingLesson && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase cursor-pointer hover:bg-slate-50 transition"
                >
                  Descartar
                </button>
              )}
              <button
                type="submit"
                className={`flex-1 py-2.5 px-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer ${
                  editingLesson
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-blue-800 hover:bg-blue-900"
                }`}
              >
                {editingLesson ? "Atualizar Aula" : "Gravar no Diário"}
              </button>
            </div>
          </form>
        </div>

        {/* Histórico de Aulas Ministradas */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Aulas Registradas ({lessons.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Clique no lápis para editar qualquer registro
              </span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {lessons.map((les) => {
                const sub = mySubjects.find((s) => s.id === les.subjectId);
                const isCurrentEditing = editingLesson?.id === les.id;

                return (
                  <div
                    key={les.id}
                    className={`p-4 rounded-xl border transition flex items-start justify-between gap-3 ${
                      isCurrentEditing
                        ? "border-amber-400 bg-amber-50/40 shadow-xs"
                        : "border-slate-200 hover:border-blue-300 bg-slate-50/60"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-100 text-blue-900">
                          {sub?.code || les.subjectId}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-yellow-100 text-yellow-900">
                          Turma {les.turma}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {new Date(les.date + "T00:00:00").toLocaleDateString("pt-BR")}
                        </span>
                        {isCurrentEditing && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                            Em edição
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                        {les.topic}
                      </h3>
                      {les.content && (
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {les.content}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(les)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-100 transition cursor-pointer"
                        title="Editar registro da aula"
                      >
                        <IconPencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(les.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                        title="Excluir aula"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {lessons.length === 0 && (
                <div className="p-12 text-center text-slate-400 text-xs">
                  Nenhuma aula registrada ainda neste diário.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
