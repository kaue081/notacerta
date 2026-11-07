import {
  Student,
  Professor,
  Subject,
  GradeRecord,
  LessonRecord,
  AcademicStatus,
  Trimester,
  TeamData,
  UserSession,
} from "@/types";

const STORAGE_KEYS = {
  STUDENTS: "notacerta_students",
  PROFESSORS: "notacerta_professors",
  SUBJECTS: "notacerta_subjects",
  GRADES: "notacerta_grades",
  LESSONS: "notacerta_lessons",
  TEAM: "notacerta_team",
  SESSION: "notacerta_session",
};

// Alunos iniciais
const INITIAL_STUDENTS: Student[] = [
  {
    id: "std-1",
    name: "Arthur Henrique Cavalcanti",
    matricula: "2024001",
    email: "arthur.cavalcanti@escola.pe.gov.br",
    turma: "2DS-A",
    password: "aluno123",
    createdAt: "2024-02-05",
  },
  {
    id: "std-2",
    name: "Beatriz Vasconcelos Lima",
    matricula: "2024002",
    email: "beatriz.lima@escola.pe.gov.br",
    turma: "2DS-A",
    password: "aluno123",
    createdAt: "2024-02-05",
  },
  {
    id: "std-3",
    name: "Caio Fernando Albuquerque",
    matricula: "2024003",
    email: "caio.albuquerque@escola.pe.gov.br",
    turma: "2DS-A",
    password: "aluno123",
    createdAt: "2024-02-06",
  },
  {
    id: "std-4",
    name: "Daniela Maria Santos",
    matricula: "2024004",
    email: "daniela.santos@escola.pe.gov.br",
    turma: "2DS-A",
    password: "aluno123",
    createdAt: "2024-02-06",
  },
  {
    id: "std-5",
    name: "Eduardo Vinicius Ramos",
    matricula: "2024005",
    email: "eduardo.ramos@escola.pe.gov.br",
    turma: "2DS-A",
    password: "aluno123",
    createdAt: "2024-02-07",
  },
  {
    id: "std-6",
    name: "Fernanda Gabriela Souza",
    matricula: "2024006",
    email: "fernanda.souza@escola.pe.gov.br",
    turma: "2DS-B",
    password: "aluno123",
    createdAt: "2024-02-07",
  },
  {
    id: "std-7",
    name: "Gabriel Martins Vieira",
    matricula: "2024007",
    email: "gabriel.vieira@escola.pe.gov.br",
    turma: "2DS-B",
    password: "aluno123",
    createdAt: "2024-02-08",
  },
  {
    id: "std-8",
    name: "Helena Beatriz Moreira",
    matricula: "2024008",
    email: "helena.moreira@escola.pe.gov.br",
    turma: "2DS-B",
    password: "aluno123",
    createdAt: "2024-02-08",
  },
  {
    id: "std-9",
    name: "Igor Santana Bezerra",
    matricula: "2024009",
    email: "igor.bezerra@escola.pe.gov.br",
    turma: "2DS-B",
    password: "aluno123",
    createdAt: "2024-02-09",
  },
  {
    id: "std-10",
    name: "Juliana Ferreira Lima",
    matricula: "2024010",
    email: "juliana.ferreira@escola.pe.gov.br",
    turma: "2DS-B",
    password: "aluno123",
    createdAt: "2024-02-09",
  },
];

// Professores iniciais (com matrícula funcional e disciplinas interligadas)
const INITIAL_PROFESSORS: Professor[] = [
  {
    id: "prof-1",
    name: "Prof. Roberto Cavalcanti",
    matricula: "PROF101",
    email: "roberto.cavalcanti@escola.pe.gov.br",
    password: "prof123",
    cargo: "Docente de Informática & Web",
    subjectIds: ["sub-1", "sub-2"], // Desenvolvimento Web e Banco de Dados
    createdAt: "2024-01-15",
  },
  {
    id: "prof-2",
    name: "Profa. Maria Clara Andrade",
    matricula: "PROF102",
    email: "maria.andrade@escola.pe.gov.br",
    password: "prof123",
    cargo: "Docente de Exatas & Raciocínio",
    subjectIds: ["sub-3", "sub-6"], // Matemática e Física
    createdAt: "2024-01-15",
  },
  {
    id: "prof-3",
    name: "Prof. Fernando Tavares",
    matricula: "PROF103",
    email: "fernando.tavares@escola.pe.gov.br",
    password: "prof123",
    cargo: "Docente de Comunicação & Infraestrutura",
    subjectIds: ["sub-4", "sub-5"], // Português e Redes
    createdAt: "2024-01-15",
  },
];

const INITIAL_SUBJECTS: Subject[] = [
  {
    id: "sub-1",
    name: "Desenvolvimento Web",
    code: "DEV-101",
    description: "Conceitos de Front-end, HTML, CSS, JavaScript, React e Next.js.",
    professorId: "prof-1",
  },
  {
    id: "sub-2",
    name: "Banco de Dados",
    code: "BD-201",
    description: "Modelagem relacional, SQL, persistência e integridade de dados.",
    professorId: "prof-1",
  },
  {
    id: "sub-3",
    name: "Matemática Aplicada",
    code: "MAT-301",
    description: "Cálculo, estatística e raciocínio lógico para computação.",
    professorId: "prof-2",
  },
  {
    id: "sub-4",
    name: "Língua Portuguesa",
    code: "POR-401",
    description: "Comunicação técnica, redação e interpretação de texto.",
    professorId: "prof-3",
  },
  {
    id: "sub-5",
    name: "Redes de Computadores",
    code: "RED-501",
    description: "Protocolos, arquitetura TCP/IP, segurança e conectividade.",
    professorId: "prof-3",
  },
  {
    id: "sub-6",
    name: "Física",
    code: "FIS-601",
    description: "Mecânica, eletricidade básica e leis fundamentais da natureza.",
    professorId: "prof-2",
  },
];

// Dados da Equipe (com foto de cada integrante, botões de perfil GitHub e repositório)
const INITIAL_TEAM: TeamData = {
  projectName: "NotaCerta",
  repoUrl: "https://github.com/kaue081/provaweb1",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  members: [
    {
      id: "mem-1",
      name: "Bianca Gabrielly da Silva Oliveira",
      roleDescription: "Pesquisa, Requisitos & Documentação",
      avatarUrl: "/FotoEquipe/BiancaGabriellyDaSilvaOliveira.jpeg",
      githubUrl: "https://github.com/gabriellysilva94",
    },
    {
      id: "mem-2",
      name: "Charles Kaue Barbosa da Silva",
      roleDescription: "Desenvolvimento Front-end & Arquitetura",
      avatarUrl: "/FotoEquipe/CharlesKaueBarbosaDaSilva.jpg",
      githubUrl: "https://github.com/kaue081",
    },
    {
      id: "mem-3",
      name: "Erik Jose da Silva",
      roleDescription: "Design, Interface & Prototipagem",
      avatarUrl: "/FotoEquipe/ErikJoseDaSilva.jpeg",
      githubUrl: "https://github.com/ericvzzl09-cmyk",
    },
    {
      id: "mem-4",
      name: "Lauany Kaline Alves do Nascimento",
      roleDescription: "Qualidade, Testes & Regras de Negócio",
      avatarUrl: "/FotoEquipe/LauanyKalineAlvesDoNascimento.jpeg",
      githubUrl: "https://github.com/lauanykaline3-hub",
    },
    {
      id: "mem-5",
      name: "Pedro Henrique de Medeiros Brito",
      roleDescription: "Qualidade, Testes & Regras de Negócio",
      avatarUrl: "/FotoEquipe/PedroHenriqueDeMedeirosBrito.jpeg",
      githubUrl: "https://github.com/phenriquebrito77-sudo",
    },
  ],
};

// Registros de aulas iniciais
const INITIAL_LESSONS: LessonRecord[] = [
  {
    id: "les-1",
    professorId: "prof-1",
    subjectId: "sub-1",
    turma: "2DS-A",
    date: "2026-10-20",
    topic: "Componentes React & Hooks no Next.js",
    content: "Apresentação dos hooks useState e useEffect. Estruturação de componentes reutilizáveis.",
    createdAt: "2026-10-20T10:00:00Z",
  },
  {
    id: "les-2",
    professorId: "prof-1",
    subjectId: "sub-1",
    turma: "2DS-A",
    date: "2026-10-27",
    topic: "Persistência com LocalStorage",
    content: "Implementação da camada de serviços para gravação e recuperação de dados locais.",
    createdAt: "2026-10-27T10:00:00Z",
  },
  {
    id: "les-3",
    professorId: "prof-2",
    subjectId: "sub-3",
    turma: "2DS-A",
    date: "2026-10-22",
    topic: "Estatística Descritiva e Médias Ponderadas",
    content: "Cálculo de médias aritméticas, somatórios e interpretação de gráficos.",
    createdAt: "2026-10-22T08:00:00Z",
  },
];

export function calculateAcademicStatus(average: number | null): AcademicStatus {
  if (average === null || isNaN(average)) return "Pendente";
  if (average >= 6.0) return "Aprovado";
  if (average >= 5.0) return "Recuperação";
  return "Reprovado";
}

export function computeAverageFromComponents(
  at1: number | null,
  at2: number | null,
  at3: number | null,
  at4: number | null,
  prova: number | null
): { totalPoints: number; average: number | null } {
  const atValues = [at1, at2, at3, at4].filter((v): v is number => v !== null && !isNaN(v));
  const hasProva = prova !== null && !isNaN(prova);

  if (atValues.length === 0 && !hasProva) {
    return { totalPoints: 0, average: null };
  }

  const atSum = atValues.reduce((acc, curr) => acc + curr, 0);
  const cappedAtSum = Math.min(10, Math.max(0, atSum));
  const provaVal = hasProva ? Math.min(10, Math.max(0, prova)) : 0;

  const totalPoints = Math.min(20, cappedAtSum + provaVal);
  const average = Number((totalPoints / 2).toFixed(1));

  return { totalPoints, average };
}

function generateInitialGrades(students: Student[], subjects: Subject[]): GradeRecord[] {
  const grades: GradeRecord[] = [];
  const baseScores: Array<[number, number]> = [
    [8.0, 9.0],
    [6.5, 7.0],
    [5.0, 5.5],
    [3.5, 4.0],
    [9.5, 10.0],
    [6.0, 6.0],
  ];

  students.forEach((student, sIdx) => {
    subjects.forEach((subject, subIdx) => {
      const scorePair = baseScores[(sIdx + subIdx) % baseScores.length];
      const isPending = (sIdx + subIdx) % 7 === 0;

      if (!isPending) {
        const atSum = scorePair[0];
        const prova = scorePair[1];
        const average = Number(((atSum + prova) / 2).toFixed(1));
        grades.push({
          id: `grd-${student.id}-${subject.id}-1`,
          studentId: student.id,
          subjectId: subject.id,
          trimester: 1,
          at1: Number((atSum * 0.5).toFixed(1)),
          at2: Number((atSum * 0.5).toFixed(1)),
          at3: null,
          at4: null,
          prova,
          average,
          status: calculateAcademicStatus(average),
          updatedAt: new Date().toISOString(),
        });
      } else {
        grades.push({
          id: `grd-${student.id}-${subject.id}-1`,
          studentId: student.id,
          subjectId: subject.id,
          trimester: 1,
          at1: null,
          at2: null,
          at3: null,
          at4: null,
          prova: null,
          average: null,
          status: "Pendente",
          updatedAt: new Date().toISOString(),
        });
      }
    });
  });

  return grades;
}

export const storageService = {
  init() {
    if (typeof window === "undefined") return;

    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROFESSORS)) {
      localStorage.setItem(STORAGE_KEYS.PROFESSORS, JSON.stringify(INITIAL_PROFESSORS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LESSONS)) {
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(INITIAL_LESSONS));
    }

    // Sincronização inteligente dos dados da equipe:
    // Se o código foi atualizado (ex: novos membros, novas fotos ou novo link do repositório),
    // atualiza o LocalStorage para refletir na tela imediatamente!
    const CURRENT_TEAM_VERSION = "2026-11-07-v2";
    const savedVersion = localStorage.getItem("notacerta_team_version");
    if (!localStorage.getItem(STORAGE_KEYS.TEAM) || savedVersion !== CURRENT_TEAM_VERSION) {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(INITIAL_TEAM));
      localStorage.setItem("notacerta_team_version", CURRENT_TEAM_VERSION);
    }

    if (!localStorage.getItem(STORAGE_KEYS.GRADES)) {
      const students = this.getStudents();
      const subjects = this.getSubjects();
      const initialGrades = generateInitialGrades(students, subjects);
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(initialGrades));
    }
  },

  resetToDefaults() {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.PROFESSORS, JSON.stringify(INITIAL_PROFESSORS));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(INITIAL_LESSONS));
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(INITIAL_TEAM));
    const initialGrades = generateInitialGrades(INITIAL_STUDENTS, INITIAL_SUBJECTS);
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(initialGrades));
  },

  clearAllCookies() {
    if (typeof document === "undefined") return;
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      if (!name) continue;
      // Remove cookie para a raiz e para o domínio atual
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      if (typeof window !== "undefined") {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=;`;
      }
    }
  },

  clearAllLocalStorage() {
    if (typeof window === "undefined") return;
    localStorage.clear();
    sessionStorage.clear();
    this.clearAllCookies();
  },

  // ================= PROFESSORES =================
  getProfessors(): Professor[] {
    if (typeof window === "undefined") return INITIAL_PROFESSORS;
    const data = localStorage.getItem(STORAGE_KEYS.PROFESSORS);
    return data ? JSON.parse(data) : INITIAL_PROFESSORS;
  },

  getProfessorById(id: string): Professor | undefined {
    return this.getProfessors().find((p) => p.id === id);
  },

  getProfessorByMatricula(matricula: string): Professor | undefined {
    return this.getProfessors().find(
      (p) => p.matricula.trim().toLowerCase() === matricula.trim().toLowerCase()
    );
  },

  getProfessorByEmail(email: string): Professor | undefined {
    return this.getProfessors().find(
      (p) => p.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
  },

  saveProfessor(profData: Omit<Professor, "id" | "createdAt"> & { id?: string }): {
    success: boolean;
    professor?: Professor;
    error?: string;
  } {
    const professors = this.getProfessors();
    const matTrimmed = profData.matricula.trim().toUpperCase();

    const exists = professors.some(
      (p) => p.matricula.toUpperCase() === matTrimmed && p.id !== profData.id
    );
    if (exists) {
      return { success: false, error: "Esta matrícula já pertence a outro professor." };
    }

    if (profData.id) {
      const index = professors.findIndex((p) => p.id === profData.id);
      if (index === -1) return { success: false, error: "Professor não encontrado." };
      const updated: Professor = {
        ...professors[index],
        ...profData,
        matricula: matTrimmed,
      };
      professors[index] = updated;
      localStorage.setItem(STORAGE_KEYS.PROFESSORS, JSON.stringify(professors));
      return { success: true, professor: updated };
    } else {
      const newProf: Professor = {
        ...profData,
        id: `prof-${Date.now()}`,
        matricula: matTrimmed,
        createdAt: new Date().toISOString().split("T")[0],
      };
      professors.push(newProf);
      localStorage.setItem(STORAGE_KEYS.PROFESSORS, JSON.stringify(professors));
      return { success: true, professor: newProf };
    }
  },

  deleteProfessor(id: string): boolean {
    const professors = this.getProfessors().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROFESSORS, JSON.stringify(professors));
    return true;
  },

  // ================= REGISTRO DE AULAS =================
  getLessons(professorId?: string, subjectId?: string): LessonRecord[] {
    if (typeof window === "undefined") return INITIAL_LESSONS;
    const data = localStorage.getItem(STORAGE_KEYS.LESSONS);
    const list: LessonRecord[] = data ? JSON.parse(data) : INITIAL_LESSONS;
    return list.filter((l) => {
      const matchProf = !professorId || l.professorId === professorId;
      const matchSub = !subjectId || l.subjectId === subjectId;
      return matchProf && matchSub;
    });
  },

  saveLesson(lessonData: Omit<LessonRecord, "id" | "createdAt"> & { id?: string }): {
    success: boolean;
    lesson?: LessonRecord;
    error?: string;
  } {
    const list = this.getLessons();
    if (!lessonData.topic.trim() || !lessonData.date) {
      return { success: false, error: "Data e Assunto da aula são obrigatórios." };
    }

    if (lessonData.id) {
      const index = list.findIndex((l) => l.id === lessonData.id);
      if (index === -1) return { success: false, error: "Registro de aula não encontrado." };
      const updated: LessonRecord = {
        ...list[index],
        ...lessonData,
      };
      list[index] = updated;
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(list));
      return { success: true, lesson: updated };
    } else {
      const newLesson: LessonRecord = {
        ...lessonData,
        id: `les-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      list.unshift(newLesson);
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(list));
      return { success: true, lesson: newLesson };
    }
  },

  deleteLesson(id: string): boolean {
    const list = this.getLessons().filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(list));
    return true;
  },

  // ================= ALUNOS =================
  getStudents(): Student[] {
    if (typeof window === "undefined") return INITIAL_STUDENTS;
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : INITIAL_STUDENTS;
  },

  getStudentById(id: string): Student | undefined {
    return this.getStudents().find((s) => s.id === id);
  },

  getStudentByMatricula(matricula: string): Student | undefined {
    return this.getStudents().find(
      (s) => s.matricula.trim().toLowerCase() === matricula.trim().toLowerCase()
    );
  },

  getStudentByEmail(email: string): Student | undefined {
    return this.getStudents().find(
      (s) => s.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
  },

  saveStudent(studentData: Omit<Student, "id" | "createdAt"> & { id?: string }): {
    success: boolean;
    student?: Student;
    error?: string;
  } {
    const students = this.getStudents();
    const matriculaTrimmed = studentData.matricula.trim();

    const exists = students.some(
      (s) =>
        s.matricula.toLowerCase() === matriculaTrimmed.toLowerCase() &&
        s.id !== studentData.id
    );
    if (exists) {
      return { success: false, error: "Esta matrícula já está cadastrada para outro aluno." };
    }

    if (studentData.id) {
      const index = students.findIndex((s) => s.id === studentData.id);
      if (index === -1) return { success: false, error: "Aluno não encontrado." };

      const updated: Student = {
        ...students[index],
        ...studentData,
        matricula: matriculaTrimmed,
      };
      students[index] = updated;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      return { success: true, student: updated };
    } else {
      const newStudent: Student = {
        ...studentData,
        id: `std-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        matricula: matriculaTrimmed,
        createdAt: new Date().toISOString().split("T")[0],
      };
      students.unshift(newStudent);
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      return { success: true, student: newStudent };
    }
  },

  deleteStudent(id: string): boolean {
    const students = this.getStudents().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    const grades = this.getGrades().filter((g) => g.studentId !== id);
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
    return true;
  },

  // ================= DISCIPLINAS =================
  getSubjects(): Subject[] {
    if (typeof window === "undefined") return INITIAL_SUBJECTS;
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return data ? JSON.parse(data) : INITIAL_SUBJECTS;
  },

  getSubjectById(id: string): Subject | undefined {
    return this.getSubjects().find((s) => s.id === id);
  },

  saveSubject(subjectData: Omit<Subject, "id"> & { id?: string }): {
    success: boolean;
    subject?: Subject;
    error?: string;
  } {
    const subjects = this.getSubjects();
    const codeTrimmed = subjectData.code.trim().toUpperCase();

    const exists = subjects.some(
      (s) => s.code.toUpperCase() === codeTrimmed && s.id !== subjectData.id
    );
    if (exists) {
      return { success: false, error: "O código da disciplina deve ser único." };
    }

    if (subjectData.id) {
      const index = subjects.findIndex((s) => s.id === subjectData.id);
      if (index === -1) return { success: false, error: "Disciplina não encontrada." };
      const updated: Subject = {
        ...subjects[index],
        ...subjectData,
        code: codeTrimmed,
      };
      subjects[index] = updated;
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
      return { success: true, subject: updated };
    } else {
      const newSubject: Subject = {
        ...subjectData,
        id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        code: codeTrimmed,
      };
      subjects.push(newSubject);
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
      return { success: true, subject: newSubject };
    }
  },

  deleteSubject(id: string): boolean {
    const subjects = this.getSubjects().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    const grades = this.getGrades().filter((g) => g.subjectId !== id);
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
    return true;
  },

  // ================= MÉDIAS & NOTAS =================
  getGrades(): GradeRecord[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.GRADES);
    return data ? JSON.parse(data) : [];
  },

  getGradesByStudent(studentId: string): GradeRecord[] {
    return this.getGrades().filter((g) => g.studentId === studentId);
  },

  getGrade(studentId: string, subjectId: string, trimester: Trimester): GradeRecord | undefined {
    return this.getGrades().find(
      (g) => g.studentId === studentId && g.subjectId === subjectId && g.trimester === trimester
    );
  },

  saveGrade(gradeData: {
    studentId: string;
    subjectId: string;
    trimester: Trimester;
    at1: number | null;
    at2: number | null;
    at3: number | null;
    at4: number | null;
    prova: number | null;
    average?: number | null;
  }): { success: boolean; record?: GradeRecord; error?: string } {
    const checkRange = (val: number | null, name: string) => {
      if (val !== null && !isNaN(val)) {
        if (val < 0 || val > 10) return `${name} deve estar entre 0 e 10.`;
      }
      return null;
    };

    const err =
      checkRange(gradeData.at1, "Atividade 1") ||
      checkRange(gradeData.at2, "Atividade 2") ||
      checkRange(gradeData.at3, "Atividade 3") ||
      checkRange(gradeData.at4, "Atividade 4") ||
      checkRange(gradeData.prova, "Prova") ||
      (gradeData.average !== undefined ? checkRange(gradeData.average, "Média") : null);

    if (err) return { success: false, error: err };

    let finalAverage: number | null = null;
    if (gradeData.average !== undefined && gradeData.average !== null) {
      finalAverage = Math.min(10, Math.max(0, Number(gradeData.average.toFixed(1))));
    } else {
      const computed = computeAverageFromComponents(
        gradeData.at1,
        gradeData.at2,
        gradeData.at3,
        gradeData.at4,
        gradeData.prova
      );
      finalAverage = computed.average;
    }

    const status = calculateAcademicStatus(finalAverage);
    const grades = this.getGrades();
    const existingIndex = grades.findIndex(
      (g) =>
        g.studentId === gradeData.studentId &&
        g.subjectId === gradeData.subjectId &&
        g.trimester === gradeData.trimester
    );

    const record: GradeRecord = {
      id:
        existingIndex !== -1
          ? grades[existingIndex].id
          : `grd-${gradeData.studentId}-${gradeData.subjectId}-${gradeData.trimester}`,
      studentId: gradeData.studentId,
      subjectId: gradeData.subjectId,
      trimester: gradeData.trimester,
      at1: gradeData.at1,
      at2: gradeData.at2,
      at3: gradeData.at3,
      at4: gradeData.at4,
      prova: gradeData.prova,
      average: finalAverage,
      status,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      grades[existingIndex] = record;
    } else {
      grades.push(record);
    }

    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
    return { success: true, record };
  },

  deleteGrade(id: string): boolean {
    const grades = this.getGrades().filter((g) => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
    return true;
  },

  // ================= EQUIPE =================
  getTeamData(): TeamData {
    if (typeof window === "undefined") return INITIAL_TEAM;
    const data = localStorage.getItem(STORAGE_KEYS.TEAM);
    if (!data) return INITIAL_TEAM;
    try {
      const parsed: TeamData = JSON.parse(data);
      if (parsed?.members) {
        parsed.members = parsed.members.map((m) => {
          let avatar = m.avatarUrl || "";
          // Normaliza barras invertidas do Windows e prefixo public
          avatar = avatar.replace(/\\/g, "/").replace(/^\/?public\//, "/");
          if (!avatar.startsWith("/") && !avatar.startsWith("http")) {
            avatar = "/" + avatar;
          }
          return { ...m, avatarUrl: avatar };
        });
      }
      return parsed;
    } catch {
      return INITIAL_TEAM;
    }
  },

  resetTeamToDefaults(): TeamData {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(INITIAL_TEAM));
      localStorage.setItem("notacerta_team_version", "2026-11-07-v2");
    }
    return INITIAL_TEAM;
  },

  saveTeamData(team: TeamData): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
  },

  // ================= SESSÃO / AUTH =================
  getSession(): UserSession | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  },

  setSession(session: UserSession | null): void {
    if (typeof window === "undefined") return;
    if (session) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  },
};
