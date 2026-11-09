# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e este projeto adere ao [Versionamento Semântico](https://semver.org/spec/v2.0.0.html).

## [0.5.1] - 2026-11-09

### Security & Privacy (Criptografia AES no LocalStorage & Eliminação Total de Cookies)
- **Criptografia AES em Repouso (`services/cryptoService.ts`)**:
  - Implementado serviço criptográfico baseado no algoritmo AES padrão indústria para cifrar 100% dos dados gravados no `localStorage`.
  - Ao inspecionar o DevTools / Console / Aba Application, qualquer chave (`notacerta_students`, `notacerta_professors`, `notacerta_grades`, `notacerta_session`, `notacerta_lessons`, `notacerta_subjects`, `notacerta_team`) exibe exclusivamente dados cifrados (`U2FsdGVkX1...`).
  - Decifragem transparente no consumo dos componentes via `storageService.safeParse()` e migração automática de dados legados no `init()`.
- **Expurgo e Varredura Ativa de Cookies**:
  - Implementado `cryptoService.purgeAllCookies()` que limpa e expira sumariamente qualquer cookie presente no navegador em todos os caminhos e domínios.
  - Zero cookies gravados ou retidos pelo sistema.

## [0.5.0] - 2026-11-09

### Security & Quality (Parte 5/5 - Validação Final & Padronização Exclusiva de LocalStorage)
- **Padronização Exclusiva em `LocalStorage`**:
  - Remoção de todos os resquícios de `sessionStorage` e `document.cookie`.
  - Sessão e dados persistentes agora operam 100% sobre `localStorage` com leitura segura defensiva (`safeParse<T>`), simplificando a arquitetura client-side.
- **Validação de Qualidade de Código & ESLint**:
  - Resolução completa de todos os erros de ESLint (`0 errors`), incluindo alinhamento de hoisting de funções (`loadData`, `loadStudents`, `loadSubjects`) e descarte de variáveis não utilizadas.
  - Correção na sintaxe do arquivo de pós-processamento `postcss.config.mjs` com atribuição de variável antes da exportação default.
- **Validação de Compilação & Build de Produção**:
  - `npx tsc --noEmit` validado com 0 erros.
  - `npm run build` gerou com sucesso todas as 13 rotas estáticas em 427ms.
- **Relatório Final Consolidado da Auditoria**:
  - Emissão do diagnóstico completo de segurança cobrindo as 5 etapas, comparativo antes vs depois, limitações da arquitetura frontend e plano de ação futuro.

## [0.4.0] - 2026-11-09

### Security & Hardening (Parte 4/5 - Fortalecimento da Segurança Frontend)
- **Implementação de Cabeçalhos HTTP de Segurança (`next.config.ts`)**:
  - `Content-Security-Policy (CSP)` restrito, bloqueando injeção de scripts não autorizados, objetos legados (`object-src 'none'`), restrição de formulários (`form-action 'self'`) e incorporação externa (`frame-ancestors 'none'`).
  - `X-Frame-Options: DENY` e `X-Content-Type-Options: nosniff` para mitigação de Clickjacking (CWE-1021) e MIME-Sniffing (CWE-79).
  - `Strict-Transport-Security (HSTS)` configurado para 2 anos com subdomínios e preload para conexões HTTPS.
  - `Referrer-Policy: strict-origin-when-cross-origin` e `Permissions-Policy` desabilitando APIs invasivas do navegador (câmera, microfone, geolocalização).
- **Supressão de Metadados e Source Maps em Produção**:
  - Desativação do cabeçalho identificador `poweredByHeader: false` para evitar enumeração de tecnologia (`X-Powered-By: Next.js`).
  - Configuração explícita de `productionBrowserSourceMaps: false` para proteger código-fonte interno de inspeção desnecessária no DevTools em produção.
- **Sanitização de URLs e Prevenção de XSS**:
  - Criação da rotina `sanitizeExternalUrl()` em `app/equipe/page.tsx` para bloquear pseudoprotocolos perigosos (`javascript:`, `data:`, `vbscript:`) em links externos.
  - Validação estrita de IDs do YouTube via expressão regular em `getCleanYoutubeEmbedUrl()` para impedir injeção arbitrária no `<iframe>`.
  - Validação de formato de e-mail nos formulários administrativos de Alunos e Professores.
- **Auditoria de Dependências (`npm audit`)**:
  - Avaliação técnica demonstrando zero vulnerabilidades de execução em tempo de produção (dependências de runtime enxutas e seguras).
- **Consolidação de Redirecionamento de Rotas**:
  - Padronização do redirecionamento na raiz (`/`) utilizando o serviço centralizado `authService.getRedirectPathForRole()`.

## [0.3.1] - 2026-11-09

### Security & Architecture (Parte 3/5 - Auditoria e Proteção do Armazenamento Local)
- **Remoção de Senhas em Texto Puro do LocalStorage**: As senhas de alunos e professores deixaram de ser persistidas no armazenamento do navegador (`types/index.ts` e `services/storageService.ts`).
- **Higienização Retroativa de Armazenamento**: Implementada rotina automática em `storageService.init()` que purga qualquer campo `password` residual remanescente de versões anteriores no `LocalStorage`.
- **Migração de Sessão para `SessionStorage`**: O estado de autenticação ativa (`notacerta_session`) foi migrado de `localStorage` para `sessionStorage`, garantindo isolamento entre abas e autodestruição da sessão assim que a janela ou aba for fechada.
- **Leitura Defensiva com `safeParse<T>`**: Implementada validação com `try/catch` e checagem de tipos em todos os métodos de leitura (`getStudents`, `getProfessors`, `getSubjects`, `getLessons`, `getGrades`), impedindo crashes causados por JSON corrompido ou adulterações no DevTools.
- **Purga Abrangente no Logout**: Integração de `clearAllCookies()`, `sessionStorage.clear()` e limpeza de credenciais ao acionar o encerramento de sessão.
- **Análise Técnica da Web Crypto API**: Documentada a restrição arquitetural em SPAs 100% frontend, concluindo pela eliminação do armazenamento de segredos no navegador ao invés de criptografia cliente fictícia ("Security Theater").

## [0.3.0] - 2026-11-09

### Security & Architecture (Parte 2/5 - Credenciais & Autenticação)
- **Criação do Serviço Centralizado `authService.ts`**: Desacoplamento da lógica de autenticação dos componentes React, centralizando a validação de identificador e senhas em `services/authService.ts`.
- **Prevenção de Enumeração de Usuários (CWE-204)**: Unificação das mensagens de erro de autenticação para evitar vazamento da existência de e-mails/matrículas cadastrados.
- **Mascaramento de Credenciais nos Formulários Administrativos**: Alteração de inputs de senha de `type="text"` para `type="password"` em `app/alunos/page.tsx` e `app/professores/page.tsx`, além de mascarar a exibição da senha na ficha de consulta de alunos para proteção contra *shoulder-surfing*.
- **Documentação de Limitações de Segurança**: Registro explícito no código e nos relatórios de que autenticações executadas exclusivamente no frontend não devem ser consideradas seguras contra inspeção de código ou engenharia reversa.

## [0.2.6] - 2026-11-09

### Added
- **Edição e Atualização de Professores**: Implementação da funcionalidade de edição no Corpo Docente (`app/professores/page.tsx`), permitindo ao Administrador selecionar qualquer professor cadastrado (ícone de lápis), carregar seus dados no formulário, atualizar nome, matrícula, e-mail, senha, cargo e disciplinas vinculadas, ou cancelar a edição.

## [0.2.5] - 2026-11-07

### Added
- **Configuração Oficial PostCSS para Tailwind v4 (Compatibilidade Vercel)**: Instalação de `@tailwindcss/postcss` e `postcss`, criação de `postcss.config.mjs` para garantir compilação universal de estilos tanto localmente quanto nos servidores da Vercel.

### Changed & Fixed
- **Correção de Estilização na Vercel**: Remoção da flag `--webpack` de `package.json`, padronizando o comando de build para `next build`. Os estilos CSS do Tailwind v4 agora são compilados com 100% de precisão nos deploys de produção.

## [0.2.4] - 2026-11-07

### Added
- **Preservação de Cookies do YouTube na Sessão**: Habilitado suporte a cookies durante a sessão para guardar preferências de reprodução, volume e informações do player do YouTube (`app/equipe/page.tsx`).
- **Remoção Total de Cookies ao Sair**: Implementado método `clearAllCookies()` em `services/storageService.ts` e integrado ao `logout()` do `context/AuthContext.tsx`. Ao clicar no botão **Sair**, todos os cookies (`document.cookie`) do domínio e caminhos são imediatamente expirados e destruídos, junto com a limpeza completa do `LocalStorage` e `SessionStorage`.

## [0.2.3] - 2026-11-07

### Added
- **Sincronização Automática da Equipe**: Adicionado versionamento de cache (`notacerta_team_version`) para que qualquer atualização de integrantes, fotos e links feita no código seja refletida imediatamente no navegador sem bloqueio por dados antigos no `LocalStorage`.
- **Botão Restaurar Padrão do Projeto**: Adicionada opção no modal de edição da equipe para sincronizar e restaurar os dados definidos no código-fonte com um único clique.
- **Normalização de Caminhos de Imagens**: Tratamento automático de barras invertidas do Windows (`\`), remoção de prefixos `public` e suporte simultâneo às pastas `public/FotoEquipe/` e `public/equipe/`.
- **Fallback Automático de Avatares**: Caso qualquer imagem local falhe no carregamento, o sistema exibe dinamicamente um avatar com as iniciais do integrante.

### Changed & Fixed
- **Link do Repositório do Projeto**: Atualizado para `https://github.com/kaue081/provaweb1` (conforme o remote oficial do Git).
- **Cadastro dos 5 Integrantes da Equipe**: Sincronização completa dos 5 membros reais (Bianca, Charles Kaue, Erik, Lauany e Pedro) com suas respectivas fotos e perfis no GitHub.
- **Correção de Identificadores TypeScript Duplicados**: Remoção de declarações repetidas de `getProfessorByEmail` e `getStudentByEmail` em `services/storageService.ts`.

## [0.2.2] - 2026-11-07

### Added
- **Pasta para Fotos Locais da Equipe**: Criação do diretório `public/equipe/` para permitir que o usuário adicione imagens locais dos integrantes e as referencie como `/equipe/nome.jpg` nos cards da equipe.

### Changed & Fixed
- **Autenticação por E-mail Institucional**: O sistema de login foi configurado para exigir e-mails institucionais `@escola.pe.gov.br` para Administrador (`admin@escola.pe.gov.br`), Professores (`roberto.cavalcanti@...`, `maria.andrade@...`, `fernando.tavares@...`) e Alunos (`arthur.cavalcanti@...`, etc.), mantendo as senhas inalteradas.
- **Persistência da Sidebar Retrátil**: O estado de retração da barra lateral foi elevado para o `AuthContext` e sincronizado com o `LocalStorage` (`notacerta_sidebar_collapsed`). Isso elimina a perda de estado nas transições de página do Next.js App Router, garantindo que o menu permaneça recolhido ao clicar em qualquer ícone de navegação.

## [0.2.1] - 2026-11-07

### Added
- **Edição de Aulas no Diário de Classe**: O professor agora pode clicar no ícone de lápis em qualquer registro de aula em `/aulas` para carregar as informações no formulário, realizar alterações e atualizar o registro, com opção de cancelar a edição.
- **Exportação CSV no Boletim**: Adicionado botão para download imediato da planilha de notas em formato `.csv` compatível com Excel e Google Planilhas.
- **Ficha Cadastral do Aluno**: Modal de visualização de detalhes individuais ao clicar no ícone de olho na tabela de alunos em `/alunos`.

### Fixed & Changed
- **Correção da Estilização e Tailwind CSS**: Restauração imediata do `@tailwindcss/turbopack` e das diretivas em `next.config.ts` e `app/globals.css`, reativando 100% da identidade visual e classes utilitárias no ambiente de desenvolvimento do usuário.
- **Remoção de Abas da Tela de Login**: A aba e formulário de "Validar Matrícula Docente" foram removidos, simplificando a tela de identificação para um formulário único e direto.

## [0.2.0] - 2026-11-07

### Added
- **React Alertas**: Criação e integração do componente `components/ui/Alert.tsx` com suporte a variantes de sucesso, erro, aviso e informação, com dismiss e auto-fechamento.
- **Perfil de Professor**:
  - Implementação do perfil `professor` com disciplinas interligadas, painel próprio (`/professor`) com métricas de alunos aprovados, em recuperação, reprovados e pendentes.
  - Tela de Diário de Classe (`/aulas`) para registro pedagógico das aulas ministradas com turma, data e assunto.
  - Validação de Matrícula de Professor no formulário de cadastro/login.
  - Gestão do corpo docente em `/professores` acessível pela administração.
- **Transição e Rodapé**:
  - Adicionado rodapé institucional global com créditos do Governo de Pernambuco e turma 2DS-A.
  - Adicionadas animações suaves de transição ao trocar de página via CSS e App Router.
- **Boletim Detalhado**:
  - Visualização explícita da soma das Atividades Avaliativas (ATs somadas), nota da avaliação (prova até 10) e média para cada trimestre e disciplina.
  - Ajustes tipográficos de documento oficial: margens, entrelinhas, formatação institucional e campos de assinatura da coordenação.
- **Página EQUIPE Refinada**:
  - Foto/avatar de cada integrante com botão dedicado para seu perfil no GitHub.
  - Botão de acesso ao repositório completo do projeto no GitHub.
  - Remoção dos blocos de turma e data de entrega da página de equipe.

### Changed
- **Ajuste do Cabeçalho de Usuário**:
  - Linha 1: `Perfil: ADM / PROFESSOR / ALUNO`.
  - Linha 2: Nome do usuário.
  - Linha 3: Profissão/Cargo na escola.
- **Separação de Privilégios (ADM vs Professor)**:
  - O preenchimento/lançamento de notas foi completamente retirado do Administrador, sendo de uso exclusivo do Professor nas suas matérias vinculadas.
  - O Administrador agora gerencia alunos, disciplinas, professores e consulta boletins.
- **Sidebar Retrátil**:
  - Corrigido o comportamento ao clicar em ícones quando a barra está retraída, garantindo que ela permaneça compacta e apenas execute a navegação.
- **Política de Privacidade e Cookies**:
  - Botão Sair configurado para limpar integralmente os dados do LocalStorage e da sessão.
  - O player de vídeo do YouTube foi atualizado para o modo `youtube-nocookie.com`, eliminando cookies de rastreamento de terceiros.
- **Remoção de Atalhos de Demonstração**:
  - Removida a caixa "Demonstração Rápida (1-clique)" da tela de autenticação para uso de login padrão.

## [0.1.0] - 2026-11-07

### Added
- **Identidade Visual**: Implementação da identidade visual do NotaCerta inspirada nas cores da bandeira do Estado de Pernambuco e no brasão governamental (Azul Real/Cobalto, Dourado/Amarelo do Sol, Arco-íris e Cruz).
- **Camada de Serviços & LocalStorage**: Criado `services/storageService.ts` com tipagem forte TypeScript, seed de 10 alunos fictícios, 6 disciplinas padrão, notas trimestrais demonstrativas e dados da equipe.
- **Autenticação Demonstrativa**: Criado `context/AuthContext.tsx` e `components/auth/LoginForm.tsx`.
- **Menu Lateral Retrátil**: Implementado `components/layout/AppLayout.tsx`.
- **Dashboard Administrativo**: Criada página `/dashboard`.
- **Gerenciamento de Alunos**: Criada página `/alunos`.
- **Gerenciamento de Disciplinas**: Criada página `/disciplinas`.
- **Boletim Escolar & Impressão PDF**: Criada página `/boletins`.
- **Página EQUIPE**: Criada página `/equipe`.
- **Conjunto de Ícones SVG**: Criado `components/icons/Icons.tsx`.
