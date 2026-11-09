"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { storageService } from "@/services/storageService";
import { Subject, GradeRecord } from "@/types";
import {
  IconBookOpen,
  IconUsers,
  IconCheckCircle,
  IconAlertTriangle,
  IconXCircle,
  IconAward,
  IconCalendar,
} from "@/components/icons/Icons";

export default function ProfessorDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [mySubjects, setMySubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  const loadData = () => {
    const allSubjects = storageService.getSubjects();
    const allGrades = storageService.getGrades();

    setGrades(allGrades);

    // Filtrar apenas as matérias interligadas a este professor
    const profSubjectIds = user?.subjectIds || [];
    const filteredSubs = allSubjects.filter(
      (s) => profSubjectIds.includes(s.id) || s.professorId === user?.professorId
    );
    setMySubjects(filteredSubs.length > 0 ? filteredSubs : allSubjects);
  };

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

  if (loading || !user || user.role !== "professor") {
    return null;
  }

  // Filtrar notas apenas das matérias deste professor
  const mySubjectIds = mySubjects.map((s) => s.id);
  const myGrades = grades.filter((g) => mySubjectIds.includes(g.subjectId));

  // Estatísticas por situação acadêmica nas matérias do professor
  const validGrades = myGrades.filter((g) => g.average !== null);
  const countAprovados = validGrades.filter((g) => g.status === "Aprovado").length;
  const countRecuperacao = validGrades.filter((g) => g.status === "Recuperação").length;
  const countReprovados = validGrades.filter((g) => g.status === "Reprovado").length;
  const countPendentes = myGrades.filter((g) => g.status === "Pendente").length;
  const totalNotas = myGrades.length || 1;

  const pctAprovados = Math.round((countAprovados / totalNotas) * 100);
  const pctRecuperacao = Math.round((countRecuperacao / totalNotas) * 100);
  const pctReprovados = Math.round((countReprovados / totalNotas) * 100);

  return (
    <AppLayout>
      {/* Banner de Boas-Vindas Docente */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-400 text-blue-950 uppercase tracking-wider">
                Painel do Docente
              </span>
              <span className="text-xs text-blue-200">Matrícula: {user.identifier}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Olá, {user.name}
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              Gerencie suas disciplinas interligadas, lance as médias trimestrais e acompanhe a situação dos seus estudantes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/medias"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-xs uppercase tracking-wider transition shadow"
            >
              <IconAward className="w-4 h-4" />
              <span>Lançar Notas da Matéria</span>
            </Link>
            <Link
              href="/aulas"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider transition border border-white/20"
            >
              <IconCalendar className="w-4 h-4" />
              <span>Registrar Aula</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CARDS DE INDICADORES DAS DISCIPLINAS DO PROFESSOR */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Minhas Matérias</p>
            <p className="text-3xl font-extrabold text-blue-900 mt-1">{mySubjects.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Interligadas</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
            <IconBookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Aprovados</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{countAprovados}</p>
            <p className="text-[11px] text-emerald-500 font-medium mt-0.5">{pctAprovados}% da matéria (≥ 6,0)</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <IconCheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Recuperação</p>
            <p className="text-3xl font-extrabold text-amber-600 mt-1">{countRecuperacao}</p>
            <p className="text-[11px] text-amber-500 font-medium mt-0.5">{pctRecuperacao}% (5,0 a 5,9)</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <IconAlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Reprovados</p>
            <p className="text-3xl font-extrabold text-red-600 mt-1">{countReprovados}</p>
            <p className="text-[11px] text-red-500 font-medium mt-0.5">{pctReprovados}% (&lt; 5,0)</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <IconXCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendentes</p>
            <p className="text-3xl font-extrabold text-slate-600 mt-1">{countPendentes}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Sem lançamento</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <IconUsers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* DISCIPLINAS INTERLIGADAS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <IconBookOpen className="w-5 h-5 text-blue-800" />
          Minhas Disciplinas Interligadas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mySubjects.map((sub) => {
            const subGrades = grades.filter((g) => g.subjectId === sub.id && g.average !== null);
            const subAprovados = subGrades.filter((g) => g.status === "Aprovado").length;
            const subRecup = subGrades.filter((g) => g.status === "Recuperação").length;
            const subReprov = subGrades.filter((g) => g.status === "Reprovado").length;

            return (
              <div
                key={sub.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:border-blue-400 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-blue-100 text-blue-900">
                      {sub.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {subGrades.length} notas lançadas
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">{sub.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sub.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-emerald-700">Aprovados: {subAprovados}</span>
                    <span className="text-amber-700">Recup: {subRecup}</span>
                    <span className="text-red-700">Reprov: {subReprov}</span>
                  </div>
                  <Link
                    href={`/medias?subjectId=${sub.id}`}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <IconAward className="w-4 h-4" />
                    <span>Lançar Notas Desta Matéria</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
