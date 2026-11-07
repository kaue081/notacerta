# S.C.O.P.E. — NotaCerta

## EQUIPE

**Integrantes:**
- Bianca Gabrielly 
- Charles Kaue Barbosa da Silva.
- Erick 
- Lauany kaliny

**Turma:** 2DS-A

**Nome do Projeto:** NotaCerta

**Data de entrega:** 19/11

---

# Visão Geral

Desenvolver uma aplicação web de gerenciamento escolar chamada **NotaCerta**.

O sistema terá como finalidade facilitar o gerenciamento de alunos, disciplinas, médias e boletins escolares, permitindo que os administradores realizem operações acadêmicas e que os alunos consultem individualmente seu desempenho escolar.

A aplicação deverá centralizar as informações acadêmicas em um único ambiente, proporcionando organização, praticidade e facilidade de acesso aos registros escolares.

O projeto será desenvolvido exclusivamente **Front-end** e terá finalidade didática.

A aplicação funcionará pelo navegador e utilizará o **LocalStorage** como mecanismo de armazenamento local.

O sistema deverá possuir dois perfis de acesso:

- **Administrador:** responsável pelo gerenciamento das informações escolares.
- **Aluno:** responsável exclusivamente pela consulta do próprio boletim.

O NotaCerta deverá apresentar uma interface moderna, intuitiva e responsiva, simulando o funcionamento de um sistema real de gerenciamento escolar.

---

# S — Situation | Situação

## Problema

Instituições de ensino precisam organizar e administrar diversas informações relacionadas à vida acadêmica dos estudantes.

Entre essas informações estão:

- Cadastro dos alunos.
- Matrículas.
- Turmas.
- Disciplinas.
- Médias escolares.
- Situação acadêmica.
- Boletins.
- Identificação da equipe responsável.
- video e botão para acessar o video no yt explicando a aplicalção

Quando essas informações são administradas de maneira descentralizada, podem surgir dificuldades relacionadas à organização, atualização, consulta e acompanhamento do desempenho dos estudantes.

O NotaCerta deverá solucionar esse problema centralizando as informações escolares em uma única aplicação.

O sistema deverá permitir que o administrador controle os registros acadêmicos, enquanto os alunos poderão consultar suas próprias informações de maneira simples e organizada.

## O sistema deverá trabalhar com informações como:

- Nome completo do aluno.
- Matrícula.
- E-mail.
- Turma.
- Disciplinas.
- Médias escolares.
- Situação acadêmica.
- Boletins individuais.
- Dados da equipe responsável pelo projeto.

## Existem diferentes possibilidades de utilização:

### Gerenciamento

O administrador poderá cadastrar, consultar, editar e excluir alunos e disciplinas.

### Lançamento de médias

O administrador poderá registrar as médias dos alunos em suas respectivas disciplinas.

### Acompanhamento acadêmico

O sistema deverá calcular automaticamente a situação acadêmica de acordo com as médias registradas.

### Consulta

O aluno poderá acessar seu próprio boletim e visualizar suas médias e situações em cada disciplina.

### Identificação

O sistema deverá apresentar uma página específica com as informações do projeto e seus integrantes.

---

# C — Context | Contexto

## Tecnologias obrigatórias

Utilizar:

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- LocalStorage.

O projeto deverá utilizar o **Next.js com App Router**.

Poderão ser utilizados os hooks necessários do React, como:

- `useState`.
- `useEffect`.
- `useMemo`.
- `useCallback`.

E os recursos de navegação do Next.js, como:

- `useRouter`.

Poderão ser utilizados ícones modernos e componentes reutilizáveis, mantendo a organização e a simplicidade do projeto.

Não adicionar bibliotecas externas sem necessidade.

---

# Arquitetura

O projeto será exclusivamente **Front-end**.

Não utilizar:

- Backend.
- Banco de dados externo.
- API própria.
- Rotas de API.
- Express.
- MySQL.
- MongoDB.
- Spring Boot.
- Serviços externos obrigatórios.
- Sistema de autenticação externo.
- JWT.
- Access Token.
- Refresh Token.
- OAuth.
- OAuth 2.0.
- NextAuth/Auth.js.

A autenticação deverá ser demonstrativa, utilizando os dados armazenados localmente.

O sistema deverá possuir uma tela de identificação e controle de acesso conforme o perfil do usuário.

**Administrador:** poderá acessar todas as funcionalidades administrativas.

**Aluno:** poderá acessar somente as informações do próprio boletim.

Não será permitido que o aluno acesse páginas administrativas ou altere informações acadêmicas.

---

# Identidade visual e interface

O NotaCerta deverá apresentar uma interface moderna, profissional e intuitiva.

## Diretrizes visuais

- Cores predominantes: da bandeira de pernambuco e cores da bandeira do governo de estado.
- Layout organizado e limpo.
- Elementos com cantos arredondados.
- Ícones modernos.
- Cards informativos.
- Tabelas organizadas.
- Menu lateral para navegação.
- Retratil.
- Animações suaves.
- Feedback visual nas operações.
- Formulários intuitivos.
- Interface responsiva.

O nome **NotaCerta** deverá aparecer na tela de identificação e no cabeçalho da aplicação.

O design deverá transmitir a identidade visual de um sistema escolar real, priorizando a facilidade de utilização e a organização das informações.

---

# Sistema de autenticação

A aplicação deverá possuir uma tela inicial de identificação.

A tela deverá apresentar:

- Nome NotaCerta.
- Campo de usuário ou matrícula.
- Campo de senha.
- Botão de entrar.
- Validação dos campos.
- Mensagens de erro.
- Redirecionamento conforme o perfil.

O campo de senha deverá utilizar inicialmente o tipo `password`.

Também deverá existir uma função para mostrar ou ocultar a senha por meio de um ícone de olho.

## Perfis de acesso

### Administrador

O administrador terá acesso completo ao gerenciamento escolar.

Poderá:

- Visualizar o Dashboard.
- Gerenciar alunos.
- Gerenciar disciplinas.
- Realizar lançamentos de médias.
- Consultar boletins.
- Visualizar a equipe.
- Sair do sistema.

### Aluno

O aluno terá acesso restrito.

Poderá:

- Consultar o próprio boletim.
- Visualizar suas médias.
- Consultar sua situação acadêmica.
- Imprimir ou salvar seu boletim em PDF.
- Sair do sistema.

O aluno não poderá:

- Cadastrar outros alunos.
- Editar informações acadêmicas.
- Excluir registros.
- Alterar médias.
- Acessar funcionalidades administrativas.

## Dados demonstrativos

O sistema deverá criar automaticamente usuários demonstrativos para testar os dois perfis de acesso.

As credenciais deverão ser fictícias e facilmente identificáveis durante a demonstração.

---

# Armazenamento dos dados

As informações do NotaCerta deverão ser armazenadas localmente utilizando o `localStorage`.

Os dados deverão permanecer disponíveis mesmo quando o usuário:

- Atualizar a página.
- Fechar o navegador.
- Abrir novamente o navegador.

O LocalStorage poderá armazenar informações como:

- Usuários.
- Alunos.
- Disciplinas.
- Médias.
- Informações da equipe.
- Dados necessários para o funcionamento da aplicação.

## Requisitos de persistência

- Salvar automaticamente os dados cadastrados.
- Recuperar os dados ao abrir novamente o sistema.
- Evitar perda de informações ao atualizar a página.
- Atualizar os registros após operações de cadastro, edição e exclusão.
- Criar dados iniciais automaticamente quando o armazenamento estiver vazio.

## Camada de serviços

Implementar uma camada de serviços para separar as operações de armazenamento da interface.

Essa camada deverá ser responsável por:

- Salvar informações.
- Recuperar informações.
- Atualizar registros.
- Excluir registros.
- Inicializar dados demonstrativos.
- Consultar os dados armazenados.

A interface não deverá concentrar diretamente todas as operações do LocalStorage.

---

# Gerenciamento de alunos

O sistema deverá possuir uma página específica para o gerenciamento dos estudantes.

O administrador poderá realizar operações completas de cadastro, consulta, atualização e exclusão.

## Funcionalidades

- Cadastrar aluno.
- Listar alunos.
- Pesquisar pelo nome.
- Pesquisar pela matrícula.
- Editar cadastro.
- Excluir aluno.
- Visualizar informações individuais.

## Informações dos alunos

Cada aluno deverá possuir:

- Nome completo.
- Matrícula.
- E-mail.
- Turma.
- Senha de acesso.

## Dados demonstrativos

O sistema deverá iniciar com **10 alunos fictícios**, permitindo testar as funcionalidades de gerenciamento.

A matrícula deverá ser única para cada estudante.

Não permitir o cadastro de dois alunos com a mesma matrícula.

---

# Gerenciamento de disciplinas

O sistema deverá possuir uma página específica para o gerenciamento das disciplinas escolares.

O administrador poderá controlar todas as disciplinas cadastradas.

## Funcionalidades

- Cadastrar disciplina.
- Listar disciplinas.
- Editar disciplina.
- Excluir disciplina.
- Pesquisar disciplina.

## Informações das disciplinas

Cada disciplina deverá possuir:

- Nome da disciplina.
- Código da disciplina.
- Descrição.

O código da disciplina deverá ser único.

As disciplinas deverão estar disponíveis para associação aos alunos durante o lançamento das médias.

---

# Lançamento e gerenciamento de médias

O sistema deverá possuir uma página específica para o lançamento das médias escolares.

O administrador poderá registrar e administrar as notas dos estudantes.

## Funcionalidades

- Selecionar aluno.
- Selecionar disciplina.
- Informar média.
- Salvar média.
- Editar média.
- Excluir lançamento.
- Consultar médias cadastradas.

## Regras de lançamento

A média deverá iniciar como `NULL`, representando a ausência de uma nota lançada.

O sistema deverá:

- Aceitar notas entre 0 e 10.
- Não permitir valores negativos.
- Não permitir valores superiores a 10.
- Não permitir valores inválidos.
- Vincular cada média a um aluno.
- Vincular cada média a uma disciplina.
- Evitar lançamentos duplicados para o mesmo aluno e disciplina.

Caso ainda não exista uma média cadastrada, a situação deverá ser apresentada como pendente.

Sempre que uma média for cadastrada, alterada ou excluída, a situação acadêmica deverá ser atualizada automaticamente.

---

# Cálculo automático da situação escolar

O NotaCerta deverá implementar uma regra de negócio para determinar automaticamente a situação acadêmica dos estudantes.

## Critérios de avaliação

| Média | Resultado |
|---|---|
| Menor que 6,0 | Reprovado |
| De 5,0 até menor que 6,0 | Recuperação |
| Igual ou superior a 6,0 | Aprovado |
| Sem média lançada | Pendente |

## Identificação visual

A situação deverá ser apresentada por meio de indicadores visuais.

- **Aprovado:** verde.
- **Recuperação:** amarelo.
- **Reprovado:** vermelho.
- **Pendente:** cinza.

O sistema deverá atualizar automaticamente os indicadores sempre que ocorrer uma alteração nas médias.

O cálculo deverá ser realizado individualmente para cada disciplina do estudante.

O Dashboard também deverá apresentar indicadores gerais do desempenho acadêmico, utilizando os registros armazenados.

---

# Boletim escolar

O sistema deverá possuir uma área destinada à consulta dos boletins escolares.

O administrador poderá consultar os boletins dos estudantes cadastrados.

O aluno poderá visualizar exclusivamente seu próprio boletim.

o sistema deve ser usar como trimeste!

## Informações do boletim

O boletim deverá apresentar:

- Nome completo.
- Matrícula.
- Turma.
- Lista de disciplinas.
- Média de cada disciplina.
- Situação em cada disciplina.
- Resumo do desempenho escolar.

## Resumo acadêmico

O sistema deverá apresentar informações como:

- Quantidade de disciplinas.
- Quantidade de aprovações.
- Quantidade de recuperações.
- Quantidade de reprovações.
- Quantidade de disciplinas pendentes.

Essas informações deverão ser calculadas automaticamente com base nas médias cadastradas.

## Impressão do boletim

Adicionar uma funcionalidade para imprimir ou salvar o boletim em PDF.

A impressão deverá utilizar os recursos nativos do navegador.

O documento deverá possuir uma apresentação organizada, adequada para impressão em papel.
 
## formula para o calculo das medias

- terão 4 atidades avaliativas, mas pode ter matirias que so vão usar 1, 2, 3 ou 4, o importante e registrar os compos que foram digitados algum valor. mas a soma tem que ser =<10, as atividades avaliativas e a prova so deverá ter um campo para pora nota.
- soma todas as notas da at e prova e dividir por 2.
- um aluno so pode acumular 20 pontos, mais que isso n pode.

---

# Dashboard administrativo

Após a identificação do administrador, o sistema deverá apresentar um Dashboard com informações gerais da situação escolar.

## Indicadores

O painel deverá apresentar:

- Total de alunos cadastrados.
- Total de disciplinas.
- Quantidade de alunos aprovados.
- Quantidade de alunos em recuperação.
- Quantidade de alunos reprovados.

## Gráfico de desempenho

Criar um gráfico para apresentar o desempenho acadêmico dos estudantes.

O gráfico deverá utilizar os dados reais armazenados no LocalStorage.

## Últimos cadastros

Apresentar uma lista dos últimos alunos cadastrados.

A lista deverá ser atualizada automaticamente após novos cadastros.

## Menu lateral

O painel administrativo deverá possuir as seguintes opções:

1. Dashboard.
2. Alunos.
3. Disciplinas.
4. Lançamento de médias.
5. Boletins.
6. Equipe.
7. Sair.

A navegação deverá ser intuitiva e apresentar a identificação da página atual.

---

# Identificação da equipe

O sistema deverá possuir uma página chamada **EQUIPE**.

Essa página será responsável por apresentar as informações do projeto e dos integrantes responsáveis pelo desenvolvimento.

## Informações do projeto

- Nome do projeto: NotaCerta.
- Turma: 2DS-A.
- Data de entrega: 19/11.

## Integrantes

Permitir a identificação de até 5 integrantes.

Os nomes deverão ser facilmente editáveis.

A página deverá possuir uma apresentação visual organizada, mantendo a identidade do NotaCerta.

---

# Responsividade

A aplicação deverá funcionar adequadamente em diferentes dispositivos.

Garantir compatibilidade com:

- Computadores.
- Notebooks.
- Tablets.
- Smartphones.

Os componentes deverão adaptar seu comportamento conforme o tamanho da tela.

O menu lateral deverá possuir comportamento responsivo.

Tabelas, formulários, botões e cards deverão manter sua organização e legibilidade em diferentes resoluções.

---

# Regras de funcionamento e validações

O sistema deverá implementar validações para garantir a consistência dos registros.

## Alunos

- Não permitir matrícula duplicada.
- Validar os campos obrigatórios.
- Impedir cadastros incompletos.

## Disciplinas

- Não permitir códigos duplicados.
- Validar os campos obrigatórios.

## Médias

- Aceitar somente valores entre 0 e 10.
- Não permitir notas inválidas.
- Não permitir lançamentos duplicados para o mesmo aluno e disciplina.
- Atualizar automaticamente a situação acadêmica.

## Autenticação

- Controlar o acesso conforme o perfil.
- Impedir que alunos acessem páginas administrativas.
- Validar usuário e senha.
- Disponibilizar a função de sair do sistema.

## Exclusões

Exibir mensagens de confirmação antes de excluir registros.

As operações deverão apresentar mensagens de sucesso ou erro para orientar o usuário.

---

# O — Objective | Objetivo

O objetivo do NotaCerta é facilitar o gerenciamento das informações escolares e proporcionar uma maneira organizada de acompanhar o desempenho acadêmico dos estudantes.

O sistema deverá oferecer ao administrador ferramentas para controlar:

- Alunos.
- Matrículas.
- Turmas.
- Disciplinas.
- Médias.
- Situações acadêmicas.
- Boletins.

Também deverá proporcionar aos alunos um ambiente simples para consultar suas informações acadêmicas.

Além disso, o projeto busca demonstrar a aplicação prática de tecnologias modernas de desenvolvimento web, utilizando componentes reutilizáveis, tipagem estática, organização de código e armazenamento local.

O NotaCerta deverá transformar operações escolares que normalmente seriam realizadas de maneira descentralizada em um sistema integrado de gerenciamento acadêmico.

---

# P — Process | Processo

O fluxo principal do sistema deverá funcionar da seguinte maneira:

1. O usuário acessa a aplicação NotaCerta.

2. O sistema apresenta a tela de identificação.

3. O usuário informa sua matrícula ou usuário e sua senha.

4. O sistema verifica as credenciais armazenadas localmente.

5. O sistema identifica o perfil do usuário.

6. Caso seja administrador, o sistema apresenta o Dashboard administrativo.

7. Caso seja aluno, o sistema apresenta sua área de consulta do boletim.

8. O administrador poderá acessar o gerenciamento de alunos.

9. O administrador poderá cadastrar, consultar, editar e excluir estudantes.

10. O administrador poderá acessar o gerenciamento de disciplinas.

11. O administrador poderá cadastrar, consultar, editar e excluir disciplinas.

12. O administrador poderá acessar o lançamento de médias.

13. O sistema permitirá selecionar o aluno e a disciplina.

14. O administrador informará a média correspondente.

15. O sistema validará o valor informado.

16. O sistema registrará a média no LocalStorage.

17. O sistema calculará automaticamente a situação acadêmica.

18. O sistema atualizará os indicadores do Dashboard.

19. O sistema disponibilizará as informações atualizadas para consulta nos boletins.

20. O aluno poderá acessar seu próprio boletim.

21. O sistema apresentará suas disciplinas, médias e situações acadêmicas.

22. O aluno poderá imprimir ou salvar seu boletim em PDF.

23. O usuário poderá encerrar sua sessão por meio da opção Sair.

---

# E — Execution | Execução

Na prática, o NotaCerta deverá executar ou coordenar as seguintes operações:

## Identificação do usuário

Exemplo:

> O usuário informa sua matrícula e senha para acessar o sistema.

O sistema deverá:

1. Receber as informações.
2. Validar os campos.
3. Consultar os usuários armazenados.
4. Verificar as credenciais.
5. Identificar o perfil.
6. Redirecionar para a área correspondente.

Caso as informações estejam incorretas, apresentar uma mensagem de erro.

---

## Cadastro de alunos

Exemplo:

> O administrador deseja cadastrar um novo estudante.

O sistema deverá:

1. Abrir o formulário de cadastro.
2. Solicitar as informações do aluno.
3. Validar os campos.
4. Verificar se a matrícula já existe.
5. Registrar o novo aluno.
6. Armazenar as informações no LocalStorage.
7. Atualizar a listagem de estudantes.
8. Apresentar uma mensagem de confirmação.

---

## Cadastro de disciplinas

Exemplo:

> O administrador deseja cadastrar a disciplina de Matemática.

O sistema deverá:

1. Abrir o formulário de disciplinas.
2. Solicitar o nome da disciplina.
3. sistema cria ou solicita o adm pode escolher o código.
4. Solicitar a descrição.
5. Validar as informações.
6. Verificar se o código já existe.
7. Registrar a disciplina.
8. Atualizar a listagem.
9. Armazenar os dados no LocalStorage.

---

## Lançamento de médias

Exemplo:

> O administrador deseja registrar a média 8,5 de um aluno em Matemática.

O sistema deverá:

1. Identificar o aluno.
2. Identificar a disciplina.
3. Receber a média informada.
4. Verificar se o valor está entre 0 e 10.
5. Verificar se já existe um lançamento para aquela combinação.
6. Registrar ou atualizar a média.
7. Calcular a situação acadêmica.
8. Atualizar os dados armazenados.
9. Atualizar as informações do boletim.
10. deve ter um atalho para mudar de aluno de acordo com a turma no pc pode usar as teclas "A" para voltar "D" para passar para frente e tambem as teclas "<", ">" respectivamente e nos dispositivos moveis tem que ter o atalho tbm para facilitar tant no tablet e nos smarphones.

---

## Cálculo da situação acadêmica

Exemplo:

> Um aluno recebeu média 6,0 em determinada disciplina.

O sistema deverá:

1. Consultar a média registrada.
2. Comparar o valor com os critérios estabelecidos.
3. Identificar a situação correspondente.
4. Apresentar o resultado como recuperação.
5. Atualizar os indicadores visuais.
6. Disponibilizar a informação no boletim.

Exemplo de funcionamento:

```text
Média: 8,5
       ↓
Verificação da regra
       ↓
Média igual ou superior a 7,0
       ↓
Resultado: APROVADO
```

---

## Consulta do boletim

Exemplo:

> O aluno deseja consultar suas médias escolares.

O sistema deverá:

1. Identificar o usuário autenticado.
2. Consultar seus dados acadêmicos.
3. Identificar as disciplinas vinculadas.
4. Recuperar as médias cadastradas.
5. Calcular as situações.
6. Apresentar o boletim individual.
7. Disponibilizar a impressão ou exportação por meio do navegador.

O sistema deverá garantir que o aluno visualize somente suas próprias informações.

---

## Dashboard

Exemplo:

> O administrador acessa o painel principal para acompanhar o desempenho escolar.

O sistema deverá:

1. Consultar os alunos cadastrados.
2. Consultar as disciplinas.
3. Consultar as médias.
4. Calcular as situações acadêmicas.
5. Atualizar os indicadores.
6. Construir o gráfico de desempenho.
7. Apresentar os últimos cadastros.

As informações deverão ser atualizadas conforme as operações realizadas no sistema.

---

# Regras importantes do projeto

## Regra 1 — Front-end

Todo o projeto deverá funcionar exclusivamente no Front-end.

## Regra 2 — Persistência

Os dados deverão ser armazenados utilizando o LocalStorage.

## Regra 3 — Sem backend

Não criar servidor ou backend.

## Regra 4 — Sem banco de dados

Não utilizar MySQL, MongoDB ou qualquer outro banco de dados externo.

## Regra 5 — Sem API

Não criar ou utilizar APIs externas para o funcionamento principal do projeto.

## Regra 6 — Next.js

Utilizar Next.js com App Router.

## Regra 7 — TypeScript

O projeto deverá ser desenvolvido utilizando TypeScript.

## Regra 8 — Interface

A interface deverá ser desenvolvida utilizando Tailwind CSS.

## Regra 9 — Responsividade

A aplicação deverá possuir uma interface responsiva e funcionar adequadamente em diferentes dispositivos.

## Regra 10 — Persistência após atualização

As informações importantes não deverão ser perdidas ao atualizar a página.

## Regra 11 — Persistência após fechar o navegador

As informações armazenadas no LocalStorage deverão permanecer disponíveis após fechar e abrir novamente o navegador.

## Regra 12 — Controle de acesso

O sistema deverá possuir dois perfis: administrador e aluno.

Cada perfil deverá possuir permissões específicas.

## Regra 13 — Cálculos automáticos

As situações acadêmicas deverão ser calculadas automaticamente de acordo com as médias cadastradas.

## Regra 14 — Validação

Todos os formulários deverão possuir validações para evitar informações inválidas ou duplicadas.

## Regra 15 — Dados demonstrativos

O sistema deverá possuir dados iniciais para facilitar os testes e a apresentação do projeto.

---

# Estrutura conceitual do projeto

A aplicação deverá possuir, conforme a necessidade do projeto, páginas e componentes relacionados a:

```text
NotaCerta
│
├── Identificação
│
├── Dashboard
│
├── Alunos
│   ├── Listagem
│   ├── Cadastro
│   ├── Edição
│   └── Detalhes
│
├── Disciplinas
│   ├── Listagem
│   ├── Cadastro
│   └── Edição
│
├── Lançamento de médias
│   ├── Seleção do aluno
│   ├── Seleção da disciplina
│   ├── Registro da média
│   └── Gerenciamento dos lançamentos
│
├── Boletins
│   ├── Consulta geral
│   ├── Boletim individual
│   └── Impressão / PDF
│
├── Equipe
│
└── Sair
```

A estrutura poderá ser adaptada durante o desenvolvimento, desde que mantenha as funcionalidades e regras definidas neste documento.

---

# SCOPE resumido

## S — Situation

Instituições de ensino precisam organizar e administrar informações acadêmicas, como alunos, matrículas, disciplinas, médias e boletins. O NotaCerta busca centralizar essas informações em uma única aplicação, facilitando o gerenciamento escolar e a consulta individual do desempenho dos estudantes.

## C — Context

O NotaCerta será uma aplicação exclusivamente Front-end desenvolvida com Next.js, React, TypeScript, Tailwind CSS e LocalStorage. O sistema possuirá autenticação demonstrativa com dois perfis de acesso, gerenciamento de alunos e disciplinas, lançamento de médias, cálculo automático de situações acadêmicas e consulta de boletins.

## O — Objective

Facilitar o gerenciamento das informações escolares, automatizar o cálculo das situações acadêmicas e permitir que os alunos consultem seus próprios boletins de maneira simples, organizada e intuitiva.

## P — Process

```text
Acessar o NotaCerta
        ↓
Realizar identificação
        ↓
Verificar credenciais
        ↓
Identificar perfil
        ↓
Acessar área correspondente
        ↓
Gerenciar alunos e disciplinas
        ↓
Realizar lançamento de médias
        ↓
Validar as notas
        ↓
Calcular situações acadêmicas
        ↓
Atualizar Dashboard
        ↓
Disponibilizar boletins
        ↓
Consultar desempenho individual
        ↓
Imprimir ou salvar boletim
```

## E — Execution

O sistema deverá permitir realizar a identificação dos usuários, gerenciar alunos e disciplinas, registrar médias, calcular automaticamente as situações acadêmicas, apresentar indicadores de desempenho, consultar boletins individuais e imprimir os resultados, utilizando exclusivamente recursos do Front-end e o LocalStorage.

---

# Limitações do projeto

O NotaCerta possui finalidade didática e, portanto, algumas funcionalidades serão demonstrativas.

Não haverá:

- Backend.
- Banco de dados externo.
- API própria.
- Integração com sistemas escolares institucionais.
- Autenticação externa.
- Serviços externos obrigatórios.
- Sincronização entre diferentes dispositivos.
- Segurança de autenticação adequada para produção.

A autenticação será simulada utilizando os dados armazenados localmente.

As senhas utilizadas deverão ser exclusivamente fictícias, não devendo ser armazenadas senhas reais nesse ambiente.

O LocalStorage será responsável pela persistência dos registros no navegador utilizado.

As informações não serão automaticamente compartilhadas entre diferentes computadores ou navegadores.

O projeto deverá respeitar essas limitações durante todo o desenvolvimento.

---

# Resultado esperado

Ao final do desenvolvimento, o NotaCerta deverá ser uma aplicação web capaz de:

- Apresentar uma tela de identificação.
- Diferenciar os perfis de administrador e aluno.
- Controlar o acesso às funcionalidades.
- Cadastrar alunos.
- Listar alunos.
- Editar alunos.
- Excluir alunos.
- Pesquisar estudantes.
- Cadastrar disciplinas.
- Listar disciplinas.
- Editar disciplinas.
- Excluir disciplinas.
- Pesquisar disciplinas.
- Realizar lançamento de médias.
- Editar médias.
- Excluir lançamentos.
- Validar notas entre 0 e 10.
- Impedir lançamentos duplicados.
- Calcular automaticamente as situações acadêmicas.
- Apresentar indicadores de desempenho.
- Exibir gráficos com dados reais.
- Consultar boletins individuais.
- Restringir o acesso do aluno ao próprio boletim.
- Imprimir ou salvar boletins em PDF.
- Apresentar a identificação da equipe.
- Persistir os dados utilizando LocalStorage.
- Funcionar exclusivamente no navegador.
- Adaptar-se a computadores, notebooks, tablets e smartphones.

O projeto deverá manter como princípio central a criação de uma solução simples, organizada e funcional para gerenciamento de informações acadêmicas.

no final de cada tarefa vc tem que fazer as devidas alterações nos arquivos docs\CHANGELOG.md e docs\TASKS.md sem falta