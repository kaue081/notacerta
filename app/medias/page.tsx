"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { storageService, calculateAcademicStatus } from "@/services/storageService";
import { Student, Subject, GradeRecord, Trimester } from "@/types";
import {
  IconAward,
  IconChevronLeft,
  IconChevronRight,
  IconTrash,
  IconBookOpen,
} from "@/components/icons/Icons";
import { Alert } from "@/components/ui/Alert";

function MediasContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  // Filtros de seleção
  const [selectedTurma, setSelectedTurma] = useState<string>("2DS-A");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedTrimester, setSelectedTrimester] = useState<Trimester>(1);

  // Campos de notas
  const [at1, setAt1] = useState<string>("");
  const [at2, setAt2] = useState<string>("");
  const [at3, setAt3] = useState<string>("");
  const [at4, setAt4] = useState<string>("");
  const [prova, setProva] = useState<string>("");
  const [manualAverage, setManualAverage] = useState<string>("");

  // Feedback com React Alert
  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const loadData = () => {
    const stds = storageService.getStudents();
    const allSubs = storageService.getSubjects();
    const grds = storageService.getGrades();

    // Filtrar apenas matérias interligadas ao professor
    const profSubjectIds = user?.subjectIds || [];
    const profSubjects = allSubs.filter(
      (s) => profSubjectIds.includes(s.id) || s.professorId === user?.professorId
    );
    const validSubs = profSubjects.length > 0 ? profSubjects : allSubs;

    setStudents(stds);
    setSubjects(validSubs);
    setGrades(grds);

    const paramSubject = searchParams.get("subjectId");
    if (paramSubject && validSubs.some((s) => s.id === paramSubject)) {
      setSelectedSubjectId(paramSubject);
    } else if (validSubs.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(validSubs[0].id);
    }

    if (stds.length > 0 && !selectedStudentId) {
      const firstStudent = stds[0];
      setSelectedTurma(firstStudent.turma);
      setSelectedStudentId(firstStudent.id);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (user.role === "admin") {
        // Conforme solicitado pelo usuário: ADM não tem preenchimento de notas!
        router.push("/dashboard");
      } else if (user.role === "aluno") {
        router.push("/boletins");
      } else {
        loadData();
      }
    }
  }, [user, loading, router]);

  const studentsInTurma = students.filter((s) => s.turma === selectedTurma);
  const currentStudentIndex = studentsInTurma.findIndex((s) => s.id === selectedStudentId);
  const currentStudent = students.find((s) => s.id === selectedStudentId);

  const goToPreviousStudent = useCallback(() => {
    if (studentsInTurma.length === 0) return;
    const prevIdx =
      currentStudentIndex <= 0 ? studentsInTurma.length - 1 : currentStudentIndex - 1;
    setSelectedStudentId(studentsInTurma[prevIdx].id);
  }, [studentsInTurma, currentStudentIndex]);

  const goToNextStudent = useCallback(() => {
    if (studentsInTurma.length === 0) return;
    const nextIdx =
      currentStudentIndex >= studentsInTurma.length - 1 ? 0 : currentStudentIndex + 1;
    setSelectedStudentId(studentsInTurma[nextIdx].id);
  }, [studentsInTurma, currentStudentIndex]);

  // Atalhos de teclado A, D, <, >
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea" || targetTag === "select") {
        return;
      }

      if (e.key === "a" || e.key === "A" || e.key === "<" || e.key === ",") {
        e.preventDefault();
        goToPreviousStudent();
      } else if (e.key === "d" || e.key === "D" || e.key === ">" || e.key === ".") {
        e.preventDefault();
        goToNextStudent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPreviousStudent, goToNextStudent]);

  // Carregar notas existentes
  useEffect(() => {
    if (!selectedStudentId || !selectedSubjectId) return;

    const existing = grades.find(
      (g) =>
        g.studentId === selectedStudentId &&
        g.subjectId === selectedSubjectId &&
        g.trimester === selectedTrimester
    );

    if (existing) {
      setAt1(existing.at1 !== null ? String(existing.at1) : "");
      setAt2(existing.at2 !== null ? String(existing.at2) : "");
      setAt3(existing.at3 !== null ? String(existing.at3) : "");
      setAt4(existing.at4 !== null ? String(existing.at4) : "");
      setProva(existing.prova !== null ? String(existing.prova) : "");
      setManualAverage(existing.average !== null ? String(existing.average) : "");
    } else {
      setAt1("");
      setAt2("");
      setAt3("");
      setAt4("");
      setProva("");
      setManualAverage("");
    }
  }, [selectedStudentId, selectedSubjectId, selectedTrimester, grades]);

  const parseNum = (val: string): number | null => {
    if (!val || val.trim() === "") return null;
    const parsed = parseFloat(val.replace(",", "."));
    return isNaN(parsed) ? null : parsed;
  };

  const nAt1 = parseNum(at1);
  const nAt2 = parseNum(at2);
  const nAt3 = parseNum(at3);
  const nAt4 = parseNum(at4);
  const nProva = parseNum(prova);
  const nManualAvg = parseNum(manualAverage);

  const atValues = [nAt1, nAt2, nAt3, nAt4].filter((v): v is number => v !== null);
  const somaAtividades = atValues.reduce((sum, v) => sum + v, 0);
  const isAtOverLimit = somaAtividades > 10;

  // Limite da Prova: até 10 pontos
  const isProvaOverLimit = nProva !== null && (nProva < 0 || nProva > 10);

  // Total acumulado que o aluno produziu no trimestre (máximo 20 pontos)
  const totalPontos = Math.min(20, Math.min(10, somaAtividades) + (nProva !== null ? Math.min(10, nProva) : 0));

  // Média do trimestre: total de pontos / 2 (máximo 10)
  const computedAverage =
    atValues.length > 0 || nProva !== null
      ? Number((totalPontos / 2).toFixed(1))
      : null;

  const effectiveAverage = nManualAvg !== null ? nManualAvg : computedAverage;
  const currentStatus = calculateAcademicStatus(effectiveAverage);

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertInfo(null);

    if (!selectedStudentId || !selectedSubjectId) {
      setAlertInfo({ type: "error", message: "Selecione o aluno e a matéria interligada." });
      return;
    }

    if (isAtOverLimit) {
      setAlertInfo({ type: "error", message: "A soma das atividades avaliativas não pode exceder 10 pontos." });
      return;
    }

    if (isProvaOverLimit) {
      setAlertInfo({ type: "error", message: "A nota da avaliação (prova) deve estar entre 0 e 10 pontos." });
      return;
    }

    const res = storageService.saveGrade({
      studentId: selectedStudentId,
      subjectId: selectedSubjectId,
      trimester: selectedTrimester,
      at1: nAt1,
      at2: nAt2,
      at3: nAt3,
      at4: nAt4,
      prova: nProva,
      average: effectiveAverage,
    });

    if (!res.success) {
      setAlertInfo({ type: "error", message: res.error || "Erro ao salvar notas." });
      return;
    }

    setGrades(storageService.getGrades());
    setAlertInfo({
      type: "success",
      message: `Notas salvas! Média trimestral: ${effectiveAverage?.toFixed(1)} (${currentStatus}).`,
    });
  };

  const handleDeleteGrade = (gradeId: string) => {
    storageService.deleteGrade(gradeId);
    setGrades(storageService.getGrades());
    setAt1("");
    setAt2("");
    setAt3("");
    setAt4("");
    setProva("");
    setManualAverage("");
    setAlertInfo({ type: "success", message: "Lançamento excluído com sucesso." });
  };

  if (loading || !user || user.role !== "professor") return null;

  const turmasList = Array.from(new Set(students.map((s) => s.turma)));

  // Notas da matéria selecionada para visualização de estatísticas do professor
  const subjectGrades = grades.filter((g) => g.subjectId === selectedSubjectId);
  const countAprov = subjectGrades.filter((g) => g.status === "Aprovado").length;
  const countRecup = subjectGrades.filter((g) => g.status === "Recuperação").length;
  const countReprov = subjectGrades.filter((g) => g.status === "Reprovado").length;
  const countPend = subjectGrades.filter((g) => g.status === "Pendente").length;

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
            <IconAward className="w-7 h-7 text-blue-800" />
            Lançamento de Médias — Acesso Docente
          </h1>
          <p className="text-sm text-slate-500">
            Fórmula: Soma das ATs (≤ 10) + Prova (≤ 10) = Acumulado até 20 pts ÷ 2 = Média (≤ 10).
          </p>
        </div>

        {/* Atalhos Rápidos */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-xs text-blue-900 font-medium">
          <span className="font-bold">Navegação:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-blue-300 font-mono font-bold">
            A ou &lt;
          </kbd>
          <span>Voltar</span>
          <span>•</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-blue-300 font-mono font-bold">
            D ou &gt;
          </kbd>
          <span>Avançar</span>
        </div>
      </div>

      {/* PAINEL DE CONTROLE DE TURMA E ALUNO */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Turma:
            </span>
            <select
              value={selectedTurma}
              onChange={(e) => {
                const newTurma = e.target.value;
                setSelectedTurma(newTurma);
                const first = students.find((s) => s.turma === newTurma);
                if (first) setSelectedStudentId(first.id);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-blue-900 bg-white"
            >
              {turmasList.map((t) => (
                <option key={t} value={t}>
                  Turma {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {([1, 2, 3] as Trimester[]).map((trim) => (
              <button
                key={trim}
                type="button"
                onClick={() => setSelectedTrimester(trim)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedTrimester === trim
                    ? "bg-blue-800 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {trim}º Trimestre
              </button>
            ))}
          </div>

          {/* Botões Mobile / Tablet para alternar aluno */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={goToPreviousStudent}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
            >
              <IconChevronLeft className="w-4 h-4 text-blue-900" />
              <span>[A] Anterior</span>
            </button>
            <span className="text-xs font-semibold text-slate-500">
              {currentStudentIndex + 1} de {studentsInTurma.length}
            </span>
            <button
              onClick={goToNextStudent}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
            >
              <span>Próximo [D]</span>
              <IconChevronRight className="w-4 h-4 text-blue-900" />
            </button>
          </div>
        </div>

        {currentStudent && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-800 text-white font-mono">
                  Matrícula: {currentStudent.matricula}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-yellow-400 text-blue-950">
                  {currentStudent.turma}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-blue-950 mt-1">
                {currentStudent.name}
              </h2>
            </div>

            <div className="sm:max-w-xs w-full">
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Selecionar Aluno da Turma:
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white text-slate-800"
              >
                {studentsInTurma.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.matricula} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* FORMULÁRIO DE LANÇAMENTO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <form onSubmit={handleSaveGrade} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Minha Matéria Interligada *
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    [{sub.code}] {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Atividades Avaliativas (1 a 4) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Atividades Avaliativas (Soma ≤ 10,0)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Preencha as ATs aplicadas neste trimestre.
                  </p>
                </div>
                <div
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    isAtOverLimit
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : "bg-blue-100 text-blue-900 border border-blue-200"
                  }`}
                >
                  Soma ATs: {somaAtividades.toFixed(1)} / 10,0
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">AT 1</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={at1}
                    onChange={(e) => setAt1(e.target.value)}
                    placeholder="0 a 10"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">AT 2</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={at2}
                    onChange={(e) => setAt2(e.target.value)}
                    placeholder="0 a 10"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">AT 3</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={at3}
                    onChange={(e) => setAt3(e.target.value)}
                    placeholder="0 a 10"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">AT 4</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={at4}
                    onChange={(e) => setAt4(e.target.value)}
                    placeholder="0 a 10"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Avaliação Oficial (Limite 10 pontos) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Nota da Avaliação / Prova (Máx 10,0) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={prova}
                  onChange={(e) => setProva(e.target.value)}
                  placeholder="Ex: 8.0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-blue-900"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Média Manual Opcional
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={manualAverage}
                  onChange={(e) => setManualAverage(e.target.value)}
                  placeholder="Deixe vazio para usar a fórmula"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAtOverLimit || isProvaOverLimit}
              className="w-full py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm shadow transition disabled:opacity-40 cursor-pointer"
            >
              Salvar Notas do Trimestre
            </button>
          </form>
        </div>

        {/* Resumo da Matéria e Cálculo */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
              Total Produzido & Média
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Soma das ATs:</span>
                <span className="font-bold text-slate-900">{somaAtividades.toFixed(1)} / 10,0</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Nota da Prova:</span>
                <span className="font-bold text-slate-900">
                  {nProva !== null ? `${nProva.toFixed(1)} / 10,0` : "Pendente"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex justify-between items-center text-xs">
                <span className="text-blue-900 font-bold">Total Acumulado (Máx 20):</span>
                <span className="font-extrabold text-blue-950 font-mono">
                  {totalPontos.toFixed(1)} pts
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Média Final:</span>
                  <span className="text-2xl font-black text-yellow-400">
                    {effectiveAverage !== null ? effectiveAverage.toFixed(1) : "Pendente"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium block">Situação:</span>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      currentStatus === "Aprovado"
                        ? "bg-emerald-500 text-white"
                        : currentStatus === "Recuperação"
                        ? "bg-amber-400 text-slate-900"
                        : currentStatus === "Reprovado"
                        ? "bg-red-500 text-white"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {currentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Panorama da Matéria para o Professor */}
            <div className="mt-5 p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Panorama da Minha Matéria:</p>
              <div className="grid grid-cols-2 gap-1 pt-1">
                <span>Aprovados: <strong>{countAprov}</strong></span>
                <span>Recuperação: <strong>{countRecup}</strong></span>
                <span>Reprovados: <strong>{countReprov}</strong></span>
                <span>Pendentes: <strong>{countPend}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function MediasPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      }
    >
      <MediasContent />
    </React.Suspense>
  );
}
