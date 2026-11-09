"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { storageService } from "@/services/storageService";
import { Student, Subject, GradeRecord } from "@/types";
import {
  IconUsers,
  IconBookOpen,
  IconCheckCircle,
  IconAlertTriangle,
  IconXCircle,
  IconPlus,
  IconAward,
  IconFileText,
  IconTeacher,
} from "@/components/icons/Icons";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  const loadData = () => {
    setStudents(storageService.getStudents());
    setSubjects(storageService.getSubjects());
    setGrades(storageService.getGrades());
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (user.role !== "admin") {
        router.push("/boletins");
      } else {
        loadData();
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  // Estatísticas calculadas dinamicamente com base nas notas registradas
  // Consideramos a situação média geral de cada aluno cadastrado
  const studentPerformance = students.map((std) => {
    const stdGrades = grades.filter((g) => g.studentId === std.id && g.average !== null);
    if (stdGrades.length === 0) return { student: std, status: "Pendente", avg: null };
    const avg =
      stdGrades.reduce((sum, g) => sum + (g.average || 0), 0) / stdGrades.length;
    let status: "Aprovado" | "Recuperação" | "Reprovado" = "Reprovado";
    if (avg >= 6.0) status = "Aprovado";
    else if (avg >= 5.0) status = "Recuperação";
    return { student: std, status, avg: Number(avg.toFixed(1)) };
  });

  const countAprovados = studentPerformance.filter((p) => p.status === "Aprovado").length;
  const countRecuperacao = studentPerformance.filter((p) => p.status === "Recuperação").length;
  const countReprovados = studentPerformance.filter((p) => p.status === "Reprovado").length;
  const countPendentes = studentPerformance.filter((p) => p.status === "Pendente").length;
  const totalAnalyzed = students.length || 1;

  const pctAprovados = Math.round((countAprovados / totalAnalyzed) * 100);
  const pctRecuperacao = Math.round((countRecuperacao / totalAnalyzed) * 100);
  const pctReprovados = Math.round((countReprovados / totalAnalyzed) * 100);
  const pctPendentes = Math.round((countPendentes / totalAnalyzed) * 100);

  // Últimos alunos cadastrados (ordem decrescente)
  const recentStudents = [...students].slice(0, 5);

  return (
    <AppLayout>
      {/* Header do Dashboard com Banner de Boas-vindas */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-400 text-blue-950 uppercase tracking-wider">
                Painel Geral
              </span>
              <span className="text-xs text-blue-200">Ano Letivo 2026 • Pernambuco</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Olá, {user.name} 👋
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              Acompanhe o panorama acadêmico, o desempenho dos alunos e acesse rapidamente as rotinas de gestão escolar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/alunos"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-xs uppercase tracking-wider transition shadow-md"
            >
              <IconPlus className="w-4 h-4" />
              <span>Novo Aluno</span>
            </Link>
            <Link
              href="/professores"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider transition border border-white/20"
            >
              <IconTeacher className="w-4 h-4 text-yellow-300" />
              <span>Corpo Docente</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CARDS DE INDICADORES (CONFORME SCOPE) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Alunos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Alunos</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{students.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Matriculados ativos</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
            <IconUsers className="w-6 h-6" />
          </div>
        </div>

        {/* Total Disciplinas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Disciplinas</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{subjects.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Matriz curricular</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <IconBookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Aprovados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Aprovados</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{countAprovados}</p>
            <p className="text-[11px] text-emerald-500 font-medium mt-0.5">{pctAprovados}% do total (≥ 6,0)</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <IconCheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Recuperação */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Recuperação</p>
            <p className="text-3xl font-extrabold text-amber-600 mt-1">{countRecuperacao}</p>
            <p className="text-[11px] text-amber-500 font-medium mt-0.5">{pctRecuperacao}% do total (5,0 a 5,9)</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <IconAlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Reprovados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Reprovados</p>
            <p className="text-3xl font-extrabold text-red-600 mt-1">{countReprovados}</p>
            <p className="text-[11px] text-red-500 font-medium mt-0.5">{pctReprovados}% do total (&lt; 5,0)</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <IconXCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* GRÁFICO DE DESEMPENHO REAL + ÚLTIMOS CADASTROS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRÁFICO DE DESEMPENHO (2 colunas) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Gráfico de Desempenho Geral dos Estudantes
                </h2>
                <p className="text-xs text-slate-500">
                  Cálculo automático em tempo real com base nos registros do LocalStorage
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">
                Critério: 6,0
              </span>
            </div>

            {/* Barra visual proporcional */}
            <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-100 shadow-inner mb-6">
              {pctAprovados > 0 && (
                <div
                  style={{ width: `${pctAprovados}%` }}
                  className="bg-emerald-500 flex items-center justify-center text-[11px] text-white font-bold transition-all duration-500"
                  title={`Aprovados: ${countAprovados} (${pctAprovados}%)`}
                >
                  {pctAprovados > 10 ? `${pctAprovados}%` : ""}
                </div>
              )}
              {pctRecuperacao > 0 && (
                <div
                  style={{ width: `${pctRecuperacao}%` }}
                  className="bg-amber-400 flex items-center justify-center text-[11px] text-slate-900 font-bold transition-all duration-500"
                  title={`Recuperação: ${countRecuperacao} (${pctRecuperacao}%)`}
                >
                  {pctRecuperacao > 10 ? `${pctRecuperacao}%` : ""}
                </div>
              )}
              {pctReprovados > 0 && (
                <div
                  style={{ width: `${pctReprovados}%` }}
                  className="bg-red-500 flex items-center justify-center text-[11px] text-white font-bold transition-all duration-500"
                  title={`Reprovados: ${countReprovados} (${pctReprovados}%)`}
                >
                  {pctReprovados > 10 ? `${pctReprovados}%` : ""}
                </div>
              )}
              {pctPendentes > 0 && (
                <div
                  style={{ width: `${pctPendentes}%` }}
                  className="bg-slate-300 flex items-center justify-center text-[11px] text-slate-700 font-bold transition-all duration-500"
                  title={`Pendentes: ${countPendentes} (${pctPendentes}%)`}
                >
                  {pctPendentes > 10 ? `${pctPendentes}%` : ""}
                </div>
              )}
            </div>

            {/* Gráfico em Barras Individuais por Categoria */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    Aprovados (Média ≥ 6,0)
                  </span>
                  <span className="text-slate-900 font-bold">
                    {countAprovados} alunos ({pctAprovados}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${pctAprovados}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    Em Recuperação (5,0 ≤ Média &lt; 6,0)
                  </span>
                  <span className="text-slate-900 font-bold">
                    {countRecuperacao} alunos ({pctRecuperacao}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-amber-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${pctRecuperacao}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    Reprovados (Média &lt; 5,0)
                  </span>
                  <span className="text-slate-900 font-bold">
                    {countReprovados} alunos ({pctReprovados}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-red-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${pctReprovados}%` }}
                  ></div>
                </div>
              </div>

              {countPendentes > 0 && (
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                      Notas Pendentes / Não Lançadas
                    </span>
                    <span className="text-slate-900 font-bold">
                      {countPendentes} alunos ({pctPendentes}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className="bg-slate-300 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${pctPendentes}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Legenda: Verde = Aprovado | Amarelo = Recuperação | Vermelho = Reprovado</span>
            <Link href="/boletins" className="font-semibold text-blue-700 hover:text-blue-900">
              Ver Boletins Detalhados &rarr;
            </Link>
          </div>
        </div>

        {/* ÚLTIMOS CADASTROS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">Últimos Cadastros</h2>
              <Link
                href="/alunos"
                className="text-xs font-bold text-blue-700 hover:text-blue-900"
              >
                Gerenciar Alunos &rarr;
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentStudents.map((std) => (
                <div key={std.id} className="py-3 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-bold text-slate-900 truncate">{std.name}</p>
                    <p className="text-xs text-slate-500">
                      Matrícula: <span className="font-semibold">{std.matricula}</span> • Turma: {std.turma}
                    </p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100">
                    {std.turma}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              href="/boletins"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <IconFileText className="w-4 h-4 text-blue-800" />
              <span>Acessar Consulta de Boletins</span>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
