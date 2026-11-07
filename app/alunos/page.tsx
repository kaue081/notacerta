"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { storageService } from "@/services/storageService";
import { Student } from "@/types";
import { Alert } from "@/components/ui/Alert";
import {
  IconUsers,
  IconSearch,
  IconPlus,
  IconPencil,
  IconTrash,
  IconX,
  IconAlertTriangle,
  IconCheckCircle,
  IconEye,
} from "@/components/icons/Icons";

export default function AlunosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTurma, setSelectedTurma] = useState<string>("TODAS");

  // Estados de Modal e Operações
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Estados do Formulário
  const [name, setName] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [turma, setTurma] = useState("2DS-A");
  const [password, setPassword] = useState("aluno123");

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
        loadStudents();
      }
    }
  }, [user, loading, router]);

  const loadStudents = () => {
    setStudents(storageService.getStudents());
  };

  const showToast = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const openCreateModal = () => {
    setEditingStudent(null);
    setName("");
    // Gerar uma sugestão de matrícula não utilizada
    const existing = storageService.getStudents().map((s) => s.matricula);
    let nextNum = 2024001;
    while (existing.includes(String(nextNum))) {
      nextNum++;
    }
    setMatricula(String(nextNum));
    setEmail("");
    setTurma("2DS-A");
    setPassword("aluno123");
    setIsModalOpen(true);
  };

  const openEditModal = (std: Student) => {
    setEditingStudent(std);
    setName(std.name);
    setMatricula(std.matricula);
    setEmail(std.email);
    setTurma(std.turma);
    setPassword(std.password);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !matricula.trim() || !email.trim() || !turma.trim()) {
      showToast("error", "Preencha todos os campos obrigatórios.");
      return;
    }

    const payload = {
      id: editingStudent ? editingStudent.id : undefined,
      name: name.trim(),
      matricula: matricula.trim(),
      email: email.trim(),
      turma: turma.trim(),
      password: password.trim() || "aluno123",
    };

    const res = storageService.saveStudent(payload);
    if (!res.success) {
      showToast("error", res.error || "Erro ao salvar aluno.");
      return;
    }

    showToast(
      "success",
      editingStudent
        ? `Aluno "${payload.name}" atualizado com sucesso!`
        : `Aluno "${payload.name}" cadastrado com sucesso!`
    );
    setIsModalOpen(false);
    loadStudents();
  };

  const confirmDelete = () => {
    if (!studentToDelete) return;
    storageService.deleteStudent(studentToDelete.id);
    showToast("success", `Aluno "${studentToDelete.name}" foi removido com sucesso.`);
    setStudentToDelete(null);
    loadStudents();
  };

  if (loading || !user || user.role !== "admin") {
    return null;
  }

  // Filtragem de alunos por nome, matrícula e turma
  const turmasList = Array.from(new Set(students.map((s) => s.turma)));

  const filteredStudents = students.filter((std) => {
    const matchSearch =
      std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchTurma = selectedTurma === "TODAS" || std.turma === selectedTurma;
    return matchSearch && matchTurma;
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

      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <IconUsers className="w-7 h-7 text-blue-800" />
            Gerenciamento de Alunos
          </h1>
          <p className="text-sm text-slate-500">
            Cadastre, edite, pesquise e controle os estudantes matriculados no sistema.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm shadow-md transition active:scale-95 cursor-pointer"
        >
          <IconPlus className="w-4 h-4" />
          <span>Cadastrar Novo Aluno</span>
        </button>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <IconSearch className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome, matrícula ou e-mail..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Turma:
          </span>
          <select
            value={selectedTurma}
            onChange={(e) => setSelectedTurma(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="TODAS">Todas as Turmas ({students.length})</option>
            {turmasList.map((t) => (
              <option key={t} value={t}>
                Turma {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Alunos */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Matrícula</th>
                <th className="py-3.5 px-4 sm:px-6">Nome Completo</th>
                <th className="py-3.5 px-4 sm:px-6">Turma</th>
                <th className="py-3.5 px-4 sm:px-6">E-mail Institucional</th>
                <th className="py-3.5 px-4 sm:px-6">Senha</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-blue-900">
                      {std.matricula}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                      {std.name}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100">
                        {std.turma}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-600 font-mono text-xs">
                      {std.email}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-xs text-slate-500">
                      ••••••••
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingStudent(std)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-800 hover:bg-blue-50 transition cursor-pointer"
                          title="Visualizar Informações Individuais"
                        >
                          <IconEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(std)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-800 hover:bg-blue-50 transition cursor-pointer"
                          title="Editar Cadastro"
                        >
                          <IconPencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setStudentToDelete(std)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                          title="Excluir Aluno"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Nenhum aluno encontrado com os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
          <span>Total exibido: {filteredStudents.length} de {students.length} alunos</span>
          <span>Critério: Matrícula única obrigatória</span>
        </div>
      </div>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-fade-in">
            <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <IconUsers className="w-5 h-5 text-yellow-400" />
                {editingStudent ? "Editar Aluno" : "Cadastrar Novo Aluno"}
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
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Arthur Henrique Cavalcanti"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Matrícula (Única) *
                  </label>
                  <input
                    type="text"
                    required
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    placeholder="Ex: 2024011"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Turma *
                  </label>
                  <input
                    type="text"
                    required
                    value={turma}
                    onChange={(e) => setTurma(e.target.value)}
                    placeholder="Ex: 2DS-A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  E-mail Institucional *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: arthur@escola.pe.gov.br"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Senha de Acesso do Aluno *
                </label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha para consulta do boletim"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  O aluno usará a Matrícula e esta senha para consultar o próprio boletim.
                </p>
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
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setStudentToDelete(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 z-10 animate-fade-in">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="p-2.5 rounded-xl bg-red-100">
                <IconAlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Confirmar Exclusão</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Tem certeza que deseja excluir o aluno{" "}
              <strong className="text-slate-900">{studentToDelete.name}</strong> (Matrícula:{" "}
              {studentToDelete.matricula})? Todas as notas associadas a este estudante também serão removidas.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow cursor-pointer"
              >
                Sim, Excluir Aluno
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL DE VISUALIZAÇÃO DE INFORMAÇÕES INDIVIDUAIS */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setViewingStudent(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-fade-in">
            <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <IconEye className="w-5 h-5 text-yellow-400" />
                Ficha Cadastral do Aluno
              </h3>
              <button
                onClick={() => setViewingStudent(null)}
                className="text-blue-200 hover:text-white cursor-pointer"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 font-black text-lg flex items-center justify-center">
                  {viewingStudent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">{viewingStudent.name}</h4>
                  <p className="text-xs text-blue-800 font-semibold">Turma: {viewingStudent.turma}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">
                    Matrícula Escolar
                  </span>
                  <span className="font-mono font-bold text-blue-950 text-sm">
                    {viewingStudent.matricula}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">
                    Data de Ingresso
                  </span>
                  <span className="font-semibold text-slate-800 text-sm">
                    {viewingStudent.createdAt || "05/02/2024"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">
                  E-mail Institucional
                </span>
                <span className="font-mono text-slate-800 break-all">{viewingStudent.email}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">
                  Senha de Consulta do Aluno
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {viewingStudent.password || "aluno123"}
                </span>
              </div>

              <div className="pt-3 flex justify-between items-center border-t border-slate-100">
                <Link
                  href="/boletins"
                  className="text-xs font-bold text-blue-800 hover:text-blue-950 underline"
                >
                  Consultar Boletim Escolar &rarr;
                </Link>

                <button
                  type="button"
                  onClick={() => setViewingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-blue-800 text-white text-xs font-bold cursor-pointer hover:bg-blue-900 transition"
                >
                  Fechar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
