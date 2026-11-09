# 📋 Quadro de Tarefas (Backlog & Sprint)

Diretrizes rápidas:
- 🔴 **Alta**: Bloqueia o desenvolvimento ou tem prazo crítico.
- 🟡 **Média**: Importante, mas não impede outras tarefas.
- 🔵 **Baixa**: Melhorias cosméticas ou refatorações secundárias.

---

## 🏃 Em Andamento (Sprint Atual)

### 🔴 Alta Prioridade
- [ ] Validação final de homologação com os docentes e discentes da turma 2DS-A.

### 🟡 Média Prioridade
- [ ] Gravação e inserção do link do vídeo explicativo final no YouTube (modo privacy-enhanced).

---

## ⏳ A Fazer (Backlog Priorizado)

### 🔵 Baixa Prioridade
- [ ] Tema escuro (Dark Mode) opcional.

---

## ✅ Concluído (Done)

### 📅 Semana: 02/11 a 19/11
- [x] Criptografia AES em repouso de 100% dos dados no `localStorage` (`services/cryptoService.ts`) e eliminação completa/varredura ativa de cookies (`purgeAllCookies`).
- [x] Conclusão da Parte 5/5 — Validação Final da Auditoria de Segurança, Build com 0 erros, ESLint com 0 erros, padronização exclusiva em LocalStorage e Relatório Consolidado.
- [x] Conclusão da Parte 4/5 — Fortalecimento da Segurança Frontend (Cabeçalhos HTTP CSP/HSTS/X-Frame-Options, Source Maps desativados em produção, remoção de X-Powered-By, sanitização de URLs/iframes e auditoria npm audit).
- [x] Conclusão da Parte 3/5 — Auditoria e Proteção do Armazenamento Local (Remoção de senhas do storage, migração da sessão para `sessionStorage`, `safeParse<T>` defensivo e purga no logout).
- [x] Conclusão da Parte 2/5 — Refinamento de Credenciais, Autenticação e Prevenção de Enumeração de Usuários (`services/authService.ts`).
- [x] Implementação da funcionalidade de edição e atualização de dados de Professores (`app/professores/page.tsx`).
- [x] Realização da Parte 1/5 — Auditoria Técnica Inicial de Segurança da Informação do NotaCerta.
- [x] Configuração universal de build e PostCSS (`@tailwindcss/postcss`) para resolução definitiva do layout e estilos na Vercel.
- [x] Suporte a cookies para retenção de informações do YouTube na sessão e remoção total de cookies ao clicar em "Sair" (`clearAllCookies`).
- [x] Atualização e correção do link do repositório no GitHub para `https://github.com/kaue081/provaweb1`.
- [x] Sincronização automática dos dados da equipe (5 membros reais, fotos locais em `/FotoEquipe` e links de GitHub) com versionamento de cache no LocalStorage.
- [x] Correção de caminhos com barras invertidas do Windows `\` e normalização de URLs de avatares com fallback automático.
- [x] Resolução de métodos TypeScript duplicados em `services/storageService.ts`.
- [x] Atualização de todos os logins para **E-mail Institucional** (`@escola.pe.gov.br`) preservando senhas de ADM, Professores e Alunos.
- [x] Correção definitiva da persistência da Sidebar Retrátil no `AuthContext` e `LocalStorage`, mantendo-a retraída ao clicar em ícones e navegar entre páginas.
- [x] Suporte à personalização de fotos e perfis do GitHub da equipe via interface web (`/equipe`), código-fonte e pasta local `public/equipe/`.
- [x] Criação da estrutura inicial do projeto (`CHANGELOG.md`).
- [x] Definição de tipos TypeScript estritos para Usuários, Alunos, Professores, Disciplinas, Notas, Aulas e Equipe (`types/index.ts`).
- [x] Implementação da camada de serviços com persistência em `LocalStorage` e seed automático de dados demonstrativos (`services/storageService.ts`).
- [x] Criação e integração do componente nativo de notificações com **React Alert** (`components/ui/Alert.tsx`).
- [x] Reestruturação do cabeçalho de usuário: Linha 1: Perfil (ADM, PROFESSOR, ALUNO); Linha 2: Nome; Linha 3: Profissão/Cargo na escola (`components/layout/AppLayout.tsx`).
- [x] Implementação do perfil de **PROFESSOR** com disciplinas interligadas, painel próprio (`/professor`) e registro de diário de aulas (`/aulas`).
- [x] Adição da funcionalidade de **Edição de Registro de Aula** para o professor no Diário de Classe com botão de edição e descarte (`app/aulas/page.tsx`).
- [x] Remoção da aba "Validar Matrícula Docente" da tela de login, mantendo o formulário único, elegante e centrado (`components/auth/LoginForm.tsx`).
- [x] Restauração e correção imediata da estilização e compilação do Tailwind CSS v4 (`@tailwindcss/turbopack`) e CSS global (`app/globals.css`).
- [x] Remoção completa da função de lançamento de notas do perfil Administrador (ADM gerencia alunos, disciplinas, professores e boletins).
- [x] Atualização da tela de Lançamento de Médias (`/medias`) exclusiva para professores em suas disciplinas, com limite de até 10 pontos na prova e teto de 20 pontos acumulados no trimestre.
- [x] Atualização do Boletim Escolar para exibir explicitamente a **pontuação das ATs somadas**, **nota da avaliação/prova** e **média do trimestre** para cada disciplina (`app/boletins/page.tsx`).
- [x] Exportação de dados do Boletim Escolar em formato de planilha CSV (`app/boletins/page.tsx`).
- [x] Ficha cadastral individual de visualização de aluno (`app/alunos/page.tsx`).
- [x] Padronização e ajustes tipográficos de documentos no Boletim (margens, tamanho de parágrafo, cabeçalho timbrado do Governo de Pernambuco e assinaturas).
- [x] Correção do comportamento da Sidebar Retrátil para permanecer retraída ao navegar entre links sem expansão automática indesejada.
- [x] Adição de foto/avatar individual e botão direto para o perfil do GitHub de cada integrante na página EQUIPE (`app/equipe/page.tsx`).
- [x] Adição do botão de acesso direto ao repositório do projeto no GitHub (`app/equipe/page.tsx`).
- [x] Remoção dos blocos de turma e data de entrega da página EQUIPE conforme solicitação.
- [x] Remoção da caixa de "Demonstração Rápida (1-clique)" da tela de identificação.
- [x] Atualização do botão Sair para limpar integralmente os dados do LocalStorage e da sessão.
- [x] Configuração do player de vídeo com o domínio `youtube-nocookie.com` para conformidade sem cookies de rastreamento de terceiros.
- [x] Criação do Rodapé Global e efeito de transição suave ao navegar entre as páginas.
