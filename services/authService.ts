import { UserSession, UserRole } from "@/types";
import { storageService } from "@/services/storageService";

/**
 * SERVIÇO DE AUTENTICAÇÃO E CONTROLE DE ACESSO — NOTACERTA
 * 
 * ⚠️ AVISO DE ARQUITETURA DE SEGURANÇA:
 * Este sistema é uma aplicação 100% frontend didática, sem backend, sem banco de dados
 * e sem servidor de autenticação dedicado.
 * 
 * Limitação Intrínseca:
 * Nenhum mecanismo de autenticação executado exclusivamente no navegador (client-side)
 * pode ser considerado seguro contra usuários com acesso ao DevTools ou que inspecionem
 * o bundle JavaScript. Em um ambiente de produção real, as credenciais e tokens assinados
 * (como JWT em cookies HttpOnly) DEVEM obrigatoriamente ser validadas em um servidor confiável.
 */

export interface AuthResult {
  success: boolean;
  error?: string;
  session?: UserSession;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Configuração centralizada de credenciais demonstrativas para o ambiente escolar
// (Evita regras e credenciais hardcoded dispersas em múltiplos componentes React)
export const DEMO_ADMIN_ACCOUNT = {
  id: "usr-admin",
  name: "Administrador Geral",
  email: "admin@escola.pe.gov.br",
  username: "admin",
  password: "admin123",
  role: "admin" as UserRole,
  cargo: "Direção & Gestão Escolar",
};

export const authService = {
  /**
   * Valida o formato básico do identificador institucional (e-mail ou matrícula)
   */
  validateIdentifier(identifier: string): ValidationResult {
    const trimmed = identifier.trim();
    if (!trimmed) {
      return { isValid: false, error: "Informe seu e-mail institucional ou matrícula." };
    }
    if (trimmed.length < 3 || trimmed.length > 100) {
      return { isValid: false, error: "O identificador deve conter entre 3 e 100 caracteres." };
    }
    // Proteção básica contra injeções de quebra de linha ou caracteres de controle
    if (/[\r\n\t]/.test(trimmed)) {
      return { isValid: false, error: "O identificador contém caracteres inválidos." };
    }
    return { isValid: true };
  },

  /**
   * Valida os requisitos mínimos do campo de senha no cliente
   */
  validatePassword(password: string): ValidationResult {
    if (!password || password.trim().length === 0) {
      return { isValid: false, error: "Informe a sua senha de acesso." };
    }
    if (password.length > 128) {
      return { isValid: false, error: "A senha excede o limite máximo permitido." };
    }
    return { isValid: true };
  },

  /**
   * Executa a autenticação de credenciais no repositório local.
   * 
   * SEGURANÇA (Prevenção de Enumeração de Usuários - CWE-204):
   * Retorna SEMPRE a mesma mensagem de erro genérica ("E-mail ou senha incorretos"),
   * impedindo que um atacante descubra se um e-mail ou matrícula existe no sistema
   * analisando respostas diferenciadas ("usuário inexistente" vs "senha incorreta").
   */
  authenticate(identifier: string, password: string): AuthResult {
    const idValidation = this.validateIdentifier(identifier);
    if (!idValidation.isValid) {
      return { success: false, error: idValidation.error };
    }

    const passValidation = this.validatePassword(password);
    if (!passValidation.isValid) {
      return { success: false, error: passValidation.error };
    }

    const normalizedId = identifier.trim().toLowerCase();
    const normalizedPass = password.trim();
    const genericAuthError = "E-mail institucional ou senha incorretos. Verifique suas credenciais de acesso.";

    // 1. Verificação da Conta Administrativa Demonstrativa
    if (
      (normalizedId === DEMO_ADMIN_ACCOUNT.email || normalizedId === DEMO_ADMIN_ACCOUNT.username) &&
      normalizedPass === DEMO_ADMIN_ACCOUNT.password
    ) {
      const adminSession: UserSession = {
        id: DEMO_ADMIN_ACCOUNT.id,
        name: DEMO_ADMIN_ACCOUNT.name,
        identifier: DEMO_ADMIN_ACCOUNT.email,
        role: DEMO_ADMIN_ACCOUNT.role,
        cargo: DEMO_ADMIN_ACCOUNT.cargo,
      };
      storageService.setSession(adminSession);
      return { success: true, session: adminSession };
    }

    // 2. Verificação do Corpo Docente (Professores)
    const professor =
      storageService.getProfessorByEmail(normalizedId) ||
      storageService.getProfessorByMatricula(normalizedId);

    if (professor) {
      const expectedPassword = professor.password || "prof123";
      if (normalizedPass === expectedPassword) {
        const profSession: UserSession = {
          id: `usr-${professor.id}`,
          name: professor.name,
          identifier: professor.email,
          role: "professor",
          cargo: professor.cargo || "Docente Titular",
          professorId: professor.id,
          subjectIds: professor.subjectIds,
        };
        storageService.setSession(profSession);
        return { success: true, session: profSession };
      }
      // Mensagem unificada anti-enumeração
      return { success: false, error: genericAuthError };
    }

    // 3. Verificação do Corpo Discente (Alunos)
    const student =
      storageService.getStudentByEmail(normalizedId) ||
      storageService.getStudentByMatricula(normalizedId);

    if (student) {
      const expectedPassword = student.password || "aluno123";
      if (normalizedPass === expectedPassword) {
        const studentSession: UserSession = {
          id: `usr-${student.id}`,
          name: student.name,
          identifier: student.email,
          role: "aluno",
          cargo: `Estudante • Turma ${student.turma}`,
          studentId: student.id,
        };
        storageService.setSession(studentSession);
        return { success: true, session: studentSession };
      }
      // Mensagem unificada anti-enumeração
      return { success: false, error: genericAuthError };
    }

    // Identificador não encontrado -> Erro idêntico
    return { success: false, error: genericAuthError };
  },

  /**
   * Encerra a sessão ativa de forma segura, removendo dados locais do localStorage
   */
  terminateSession(): void {
    storageService.setSession(null);
    storageService.clearAllLocalStorage();
  },

  /**
   * Determina a rota de redirecionamento apropriada com base no papel do usuário
   */
  getRedirectPathForRole(role?: UserRole): string {
    switch (role) {
      case "admin":
        return "/dashboard";
      case "professor":
        return "/professor";
      case "aluno":
        return "/boletins";
      default:
        return "/";
    }
  },
};
