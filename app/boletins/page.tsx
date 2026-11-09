"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { storageService, calculateAcademicStatus } from "@/services/storageService";
import { Student, Subject, GradeRecord } from "@/types";
import { PernambucoSunLogo, IconFileText, IconPrinter } from "@/components/icons/Icons";

export default function BoletinsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedTurma, setSelectedTurma] = useState<string>("TODAS");
  const [emissionDate, setEmissionDate] = useState<string>("07/11/2026");

  const loadData = () => {
    const stds = storageService.getStudents();
    const subs = storageService.getSubjects();
    const grds = storageService.getGrades();

    setStudents(stds);
    setSubjects(subs);
    setGrades(grds);

    if (user?.role === "aluno" && user.studentId) {
      setSelectedStudentId(user.studentId);
    } else if (stds.length > 0 && !selectedStudentId) {
      setSelectedStudentId(stds[0].id);
    }
  };

  useEffect(() => {
    setEmissionDate(new Date().toLocaleDateString("pt-BR"));
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else {
        loadData();
      }
    }
  }, [user, loading, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!activeStudent) return;
    const header = [
      "Disciplina",
      "Codigo",
      "1T_Soma_ATs",
      "1T_Prova",
      "1T_Media",
      "2T_Soma_ATs",
      "2T_Prova",
      "2T_Media",
      "3T_Soma_ATs",
      "3T_Prova",
      "3T_Media",
      "Media_Final",
      "Situacao_Final",
    ].join(";");

    const rows = subjectSummary.map((r) =>
      [
        `"${r.subject.name}"`,
        r.subject.code,
        r.t1.atSum ?? "-",
        r.t1.grade?.prova ?? "-",
        r.t1.grade?.average ?? "-",
        r.t2.atSum ?? "-",
        r.t2.grade?.prova ?? "-",
        r.t2.grade?.average ?? "-",
        r.t3.atSum ?? "-",
        r.t3.grade?.prova ?? "-",
        r.t3.grade?.average ?? "-",
        r.finalAvg ?? "-",
        r.finalStatus,
      ].join(";")
    );

    const csvContent = "\uFEFF" + [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `boletim_${activeStudent.matricula}_${activeStudent.name.replace(/\s+/g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !user) return null;

  const isAluno = user.role === "aluno";
  const activeStudent = students.find((s) => s.id === selectedStudentId);
  const studentGrades = grades.filter((g) => g.studentId === selectedStudentId);

  // Helper para somar ATs de um registro
  const getAtSum = (g?: GradeRecord) => {
    if (!g) return null;
    const vals = [g.at1, g.at2, g.at3, g.at4].filter((v): v is number => v !== null && !isNaN(v));
    if (vals.length === 0) return null;
    return Number(vals.reduce((a, b) => a + b, 0).toFixed(1));
  };

  const subjectSummary = subjects.map((sub) => {
    const gT1 = studentGrades.find((g) => g.subjectId === sub.id && g.trimester === 1);
    const gT2 = studentGrades.find((g) => g.subjectId === sub.id && g.trimester === 2);
    const gT3 = studentGrades.find((g) => g.subjectId === sub.id && g.trimester === 3);

    const validAverages = [gT1?.average, gT2?.average, gT3?.average].filter(
      (avg): avg is number => avg !== undefined && avg !== null
    );

    const finalAvg =
      validAverages.length > 0
        ? Number((validAverages.reduce((a, b) => a + b, 0) / validAverages.length).toFixed(1))
        : null;

    const finalStatus = calculateAcademicStatus(finalAvg);

    return {
      subject: sub,
      t1: { grade: gT1, atSum: getAtSum(gT1) },
      t2: { grade: gT2, atSum: getAtSum(gT2) },
      t3: { grade: gT3, atSum: getAtSum(gT3) },
      finalAvg,
      finalStatus,
    };
  });

  const totalDisciplinas = subjects.length;
  const countAprovadas = subjectSummary.filter((s) => s.finalStatus === "Aprovado").length;
  const countRecuperacao = subjectSummary.filter((s) => s.finalStatus === "Recuperação").length;
  const countReprovadas = subjectSummary.filter((s) => s.finalStatus === "Reprovado").length;
  const countPendentes = subjectSummary.filter((s) => s.finalStatus === "Pendente").length;

  const filteredStudents =
    selectedTurma === "TODAS" ? students : students.filter((s) => s.turma === selectedTurma);

  const turmasList = Array.from(new Set(students.map((s) => s.turma)));

  return (
    <AppLayout>
      {/* Controles de Topo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <IconFileText className="w-7 h-7 text-blue-800" />
            {isAluno ? "Meu Boletim Escolar Oficial" : "Boletim Escolar & Histórico de Médias"}
          </h1>
          <p className="text-sm text-slate-500">
            Acompanhe a pontuação das ATs somadas, avaliações e média por trimestre.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition active:scale-95 cursor-pointer"
            title="Baixar planilha CSV para Excel / Calc"
          >
            <IconFileText className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm shadow-md transition active:scale-95 cursor-pointer"
          >
            <IconPrinter className="w-4 h-4" />
            <span>Imprimir / Salvar em PDF</span>
          </button>
        </div>
      </div>

      {/* Seletor para Professores e Administradores */}
      {!isAluno && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Turma:
            </span>
            <select
              value={selectedTurma}
              onChange={(e) => {
                setSelectedTurma(e.target.value);
                const first = (
                  e.target.value === "TODAS"
                    ? students
                    : students.filter((s) => s.turma === e.target.value)
                )[0];
                if (first) setSelectedStudentId(first.id);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="TODAS">Todas as Turmas</option>
              {turmasList.map((t) => (
                <option key={t} value={t}>
                  Turma {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold text-blue-950 bg-white"
            >
              {filteredStudents.map((std) => (
                <option key={std.id} value={std.id}>
                  Matrícula: {std.matricula} — {std.name} ({std.turma})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* DOCUMENTO DO BOLETIM (COM AJUSTES DE MARGEM, PARÁGRAFO E TIPOGRAFIA OFICIAL) */}
      <div
        id="boletim-imprimivel"
        className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-10 print:p-0 print:border-none print:shadow-none print:m-0"
      >
        {/* Cabeçalho Oficial de Pernambuco */}
        <div className="border-b-2 border-blue-900 pb-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <PernambucoSunLogo className="w-14 h-14" />
              <div>
                <h2 className="text-xl font-black tracking-tight text-blue-950 uppercase leading-snug">
                  Governo do Estado de Pernambuco
                </h2>
                <p className="text-xs font-bold text-slate-700 leading-snug">
                  Secretaria de Educação e Esportes • Sistema Integrado NotaCerta
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Boletim Escolar Oficial do Rendimento Acadêmico Trimestral
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase bg-blue-900 text-white font-mono">
                Ano Letivo 2026
              </span>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                Emitido em: {emissionDate}
              </p>
            </div>
          </div>
        </div>

        {/* Dados do Estudante com espaçamento e margens padronizadas */}
        {activeStudent && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px] leading-snug">
                Nome do Aluno
              </span>
              <span className="font-extrabold text-slate-900 text-sm leading-tight">
                {activeStudent.name}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px] leading-snug">
                Matrícula
              </span>
              <span className="font-mono font-bold text-blue-900 text-sm leading-tight">
                {activeStudent.matricula}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px] leading-snug">
                Turma
              </span>
              <span className="font-bold text-slate-900 text-sm leading-tight">
                {activeStudent.turma}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px] leading-snug">
                E-mail Institucional
              </span>
              <span className="font-mono text-slate-700 text-xs truncate block leading-tight">
                {activeStudent.email}
              </span>
            </div>
          </div>
        )}

        {/* TABELA DE MÉDIAS: EXIBE ATs SOMADAS, PROVA E MÉDIA PARA CADA TRIMESTRE */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3 border border-blue-950">Disciplina</th>
                <th colSpan={3} className="py-1 px-2 text-center border border-blue-950 bg-blue-800">
                  1º Trimestre
                </th>
                <th colSpan={3} className="py-1 px-2 text-center border border-blue-950 bg-blue-800">
                  2º Trimestre
                </th>
                <th colSpan={3} className="py-1 px-2 text-center border border-blue-950 bg-blue-800">
                  3º Trimestre
                </th>
                <th className="py-2.5 px-2 text-center border border-blue-950 bg-blue-950">
                  Média Final
                </th>
                <th className="py-2.5 px-3 text-center border border-blue-950">Situação</th>
              </tr>
              <tr className="bg-blue-950 text-blue-100 font-bold uppercase text-[9px]">
                <th className="py-1 px-3 border border-blue-900">Nome / Código</th>
                {/* 1º Trim */}
                <th className="py-1 px-1.5 text-center border border-blue-900">Soma ATs</th>
                <th className="py-1 px-1.5 text-center border border-blue-900">Prova</th>
                <th className="py-1 px-1.5 text-center border border-blue-900 font-extrabold text-yellow-300">
                  Média
                </th>
                {/* 2º Trim */}
                <th className="py-1 px-1.5 text-center border border-blue-900">Soma ATs</th>
                <th className="py-1 px-1.5 text-center border border-blue-900">Prova</th>
                <th className="py-1 px-1.5 text-center border border-blue-900 font-extrabold text-yellow-300">
                  Média
                </th>
                {/* 3º Trim */}
                <th className="py-1 px-1.5 text-center border border-blue-900">Soma ATs</th>
                <th className="py-1 px-1.5 text-center border border-blue-900">Prova</th>
                <th className="py-1 px-1.5 text-center border border-blue-900 font-extrabold text-yellow-300">
                  Média
                </th>
                <th className="py-1 px-2 text-center border border-blue-900">Anual</th>
                <th className="py-1 px-3 text-center border border-blue-900">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {subjectSummary.map((row) => (
                <tr key={row.subject.id} className="hover:bg-slate-50 transition">
                  <td className="py-2 px-3 border border-slate-200">
                    <span className="font-bold text-slate-900 block leading-tight">
                      {row.subject.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {row.subject.code}
                    </span>
                  </td>

                  {/* 1º Trimestre */}
                  <td className="py-2 px-1.5 border border-slate-200 text-center font-mono">
                    {row.t1.atSum !== null ? row.t1.atSum.toFixed(1) : "-"}
                  </td>
                  <td className="py-2 px-1.5 border border-slate-200 text-center font-mono">
                    {row.t1.grade?.prova !== null && row.t1.grade?.prova !== undefined
                      ? row.t1.grade.prova.toFixed(1)
                      : "-"}
                  </td>
                  <td className="py-2 px-1.5 border border-slate-200 text-center font-mono font-bold text-blue-950 bg-blue-50/30">
                    {row.t1.grade?.average !== null && row.t1.grade?.average !== undefined
                      ? row.t1.grade.average.toFixed(1)
                      : "-"}
                  </td>

                  {/* 2º Trimestre */}
                  <td className="py-2 px-1.5 border border-slate-200 text-center font-mono">
                    {row.t2.atSum !== null ? row.t2.atSum.toFixed(1) : "-"}
                  </td>
                  <td className="py-2 px-1.5 border border-slate-200 text-center font-mono">
                    {row.t2.grade?.prova !== null && row.t2.grade?.prova !== undefined
                      ? row.t2.grade.prova.toFixed(1)
                      : "-"}
                  </td>
                  <td className="py-2 px-1.5 border border-slate-200 text-center font-mono font-bold text-blue-950 bg-blue-50/30">
                    {row.t2.grade?.average !== null && row.t2.grade?.average !== undefined
                      ? row.t2.grade.average.toFixed(1)
                      : "-"}
                  </td>

                  {/* 3º Trimestre */}
                  <td className="py-2 px-1.5 border border-slate-200 text-center font-mono">
                    {row.t3.atSum !== null ? row.t3.atSum.toFixed(1) : "-"}
                  </td>
                  <td className="py-2 px-1.5 border border-slate-200 text-center font-mono">
                    {row.t3.grade?.prova !== null && row.t3.grade?.prova !== undefined
                      ? row.t3.grade.prova.toFixed(1)
                      : "-"}
                  </td>
                  <td className="py-2 px-1.5 border border-slate-200 text-center font-mono font-bold text-blue-950 bg-blue-50/30">
                    {row.t3.grade?.average !== null && row.t3.grade?.average !== undefined
                      ? row.t3.grade.average.toFixed(1)
                      : "-"}
                  </td>

                  {/* Média Final e Situação */}
                  <td className="py-2 px-2 border border-slate-200 text-center font-mono font-extrabold text-blue-900 bg-slate-50">
                    {row.finalAvg !== null ? row.finalAvg.toFixed(1) : "-"}
                  </td>
                  <td className="py-2 px-3 border border-slate-200 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        row.finalStatus === "Aprovado"
                          ? "bg-emerald-100 text-emerald-800"
                          : row.finalStatus === "Recuperação"
                          ? "bg-amber-100 text-amber-800"
                          : row.finalStatus === "Reprovado"
                          ? "bg-red-100 text-red-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {row.finalStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumo de Desempenho e Assinaturas */}
        <div className="pt-4 border-t border-slate-200 text-xs leading-relaxed">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-slate-600 mb-8">
            <div>
              <p className="font-bold text-slate-800">Quadro Resumo de Avaliação Acadêmica:</p>
              <p className="text-[11px] mt-0.5 leading-normal">
                Disciplinas: <strong>{totalDisciplinas}</strong> • Aprovadas:{" "}
                <strong className="text-emerald-700">{countAprovadas}</strong> • Em Recuperação:{" "}
                <strong className="text-amber-700">{countRecuperacao}</strong> • Reprovadas:{" "}
                <strong className="text-red-700">{countReprovadas}</strong> • Pendentes:{" "}
                <strong>{countPendentes}</strong>
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <p>Critério: Média ≥ 6,0 (Aprovado)</p>
              <p>5,0 a 5,9 (Recuperação) • &lt; 5,0 (Reprovado)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
            <div>
              <div className="border-t border-slate-400 w-3/4 mx-auto pt-1 font-semibold text-slate-800">
                Coordenação Pedagógica
              </div>
              <p className="text-[10px] text-slate-500">Escola Técnica Estadual • PE</p>
            </div>
            <div>
              <div className="border-t border-slate-400 w-3/4 mx-auto pt-1 font-semibold text-slate-800">
                Secretaria Escolar
              </div>
              <p className="text-[10px] text-slate-500">Registro Acadêmico Oficial</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
