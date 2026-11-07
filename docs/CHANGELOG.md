# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e este projeto adere ao [Versionamento Semântico](https://semver.org/spec/v2.0.0.html).

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
