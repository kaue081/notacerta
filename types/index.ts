export type UserRole = "admin" | "professor" | "aluno";

export interface UserSession {
  id: string;
  name: string;
  identifier: string; // username ou matrícula
  role: UserRole;
  cargo: string; // Profissão/Cargo na escola (ex: Direção Pedagógica, Professor Titular, Estudante)
  studentId?: string; // se for aluno
  professorId?: string; // se for professor
  subjectIds?: string[]; // IDs das matérias do professor
}

export interface Student {
  id: string;
  name: string;
  matricula: string;
  email: string;
  turma: string;
  password: string;
  createdAt: string;
}

export interface Professor {
  id: string;
  name: string;
  matricula: string; // Matrícula funcional de professor
  email: string;
  password: string;
  cargo: string;
  subjectIds: string[]; // Disciplinas que leciona
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  professorId?: string; // Professor responsável
}

export interface LessonRecord {
  id: string;
  professorId: string;
  subjectId: string;
  turma: string;
  date: string;
  topic: string;
  content: string;
  createdAt: string;
}

export type AcademicStatus = "Aprovado" | "Recuperação" | "Reprovado" | "Pendente";

export type Trimester = 1 | 2 | 3;

export interface GradeRecord {
  id: string;
  studentId: string;
  subjectId: string;
  trimester: Trimester;
  at1: number | null;
  at2: number | null;
  at3: number | null;
  at4: number | null;
  prova: number | null;
  average: number | null;
  status: AcademicStatus;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  roleDescription?: string;
  avatarUrl: string;
  githubUrl: string;
}

export interface TeamData {
  projectName: string;
  videoUrl: string;
  repoUrl: string; // Repositório no GitHub
  members: TeamMember[];
}
