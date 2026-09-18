# Saúde+ — Lista de Ajustes Pendentes e Melhorias (Versão 3)

> **Para quem é este documento:** para o time do projeto — vocês não precisam saber programar para entender e decidir sobre estas tarefas. Cada item explica **onde** fica (qual tela, qual campo), **o que muda** e **por que muda**. A parte de programar quem faz é a IA; a parte de decidir "faz sentido ou não" é do time.
>
> Marque a caixinha `[x]` quando o time decidir que aquele item está aprovado e pronto (ou concluído).

---

## O que aconteceu desde a Versão 2 (Diagnóstico Geral)

Fizemos uma varredura completa em **todas as pastas e em todos os arquivos do projeto** para checar o que realmente foi implementado e o que ainda está faltando do `TAREFAS_SIMPLES_V2`. 

Aqui está o resumo honesto do estado atual do sistema:

1. **O que foi feito e está funcionando bem:**
   - A região das doenças no painel do administrador agora vem certinha dos bairros dos postos de saúde (Item 3.1).
   - Reagendar consulta ou exame no administrador e no atendente agora abre um calendário em vez de ter que digitar a data à mão (Itens 3.2 e 4.1).
   - O administrador agora tem uma tela única e unificada para buscar usuários e ver histórico (Item 3.4).
   - As abas dos painéis agora podem ser trocadas usando as setas do teclado (Item 5.1).
   - A confirmação de cancelamento no painel do paciente agora é uma janela bonita do app avisando sobre a perda da vaga (Item 2.3).
   - Os botões de agendar consulta e exame agora travam e mostram "Enviando..." (Item 2.4).
   - Existem botões de "Cancelar" para limpar os formulários de consulta e exame (Item 2.5).

2. **O que foi feito "pela metade" ou com defeitos que precisam de conserto:**
   - **O cargo do atendente no cadastro (Item 1.1):** foi colocado como lista, mas o código ficou com partes duplicadas e deixa avançar sem escolher o cargo.
   - **O motivo ao mudar status no admin (Item 3.3):** a tela mostra o campo para escrever o motivo, mas o servidor joga a informação fora e não guarda no histórico!
   - **O aviso de paciente inativo no atendente (Item 4.2):** a tela foi programada para mostrar o aviso, mas o servidor bloqueia os inativos antes de chegarem na tela. Então o aviso nunca aparece!
   - **O limite de 1 ano no calendário (Item 5.4):** o código da trava foi escrito, mas "esqueceram de ligar o interruptor" (a função nunca é chamada).
   - **O destaque ao editar (Item 5.5):** funciona para consultas, mas não para exames.
   - **O painel do atendente tem um erro que pode travar a tela:** faltava uma função de segurança de conexão no arquivo principal.

3. **O que NÃO foi feito e continua faltando:**
   - **ALERTA CRÍTICO: O módulo de Transporte sumiu da tela do paciente!** O paciente não tem onde pedir transporte nem ver seus transportes.
   - Todos os campos oficiais de saúde (Nome Social, Cartão SUS/CNS, Prioridade legal, Responsável por menores, Cor/raça).
   - Ponto de referência continua obrigatório para quem mora na cidade (deveria ser só para zona rural).
   - Avisos de erro ao lado dos campos e indicador de senha fraca/forte.
   - Lembretes automáticos (que avisem o paciente na véspera do atendimento).

Abaixo está o checklist completo e organizado por tela, atualizado para guiar os próximos passos do time.

---

## Painel Rápido de Status (V2 → V3)

| Tarefa original (V2) | Status no Código Real | Situação atual na V3 |
|---|---|---|
| **1.1 Cargo do atendente** | 🟡 Feito pela metade | Tem código duplicado e não valida se escolheu |
| **1.2 Nome social** | 🔴 Não feito | Faltando no formulário e no banco |
| **1.3 Cartão SUS (CNS)** | 🔴 Não feito | Faltando no formulário e no banco |
| **1.4 Prioridade de atendimento** | 🔴 Não feito | Faltando no formulário e no banco |
| **1.5 Responsável p/ menor** | 🔴 Não feito | Faltando no formulário e no banco |
| **1.6 Cor/raça** | 🔴 Não feito | Faltando no formulário e no banco |
| **1.7 Ref. só para rural** | 🔴 Não feito | Continua obrigatório para todo mundo |
| **1.8 Explicar por que pede dado** | 🔴 Não feito | Nenhum texto de ajuda nos campos |
| **2.1 Campo "Outro" no transporte** | 🔴 Não feito | **Grave:** a tela inteira de transporte sumiu do painel do paciente |
| **2.2 Campo "Outro" no exame** | 🟢 Feito | Funcionando (só falta validar preenchimento) |
| **2.3 Confirmação de cancelamento** | 🟢 Feito | Modal bonito funcionando no paciente |
| **2.4 Botão trava ao enviar** | 🟢 Feito | Funcionando em consultas e exames |
| **2.5 Botão cancelar formulário** | 🟢 Feito | Funcionando em consultas e exames |
| **3.1 Região do alerta de doença** | 🟢 Feito | Puxa a lista de bairros dos postos |
| **3.2 Reagendar com calendário (admin)** | 🟢 Feito | Calendário clicável funcionando |
| **3.3 Motivo de status de conta** | 🟡 Feito pela metade | Tela pede o motivo, mas servidor não salva |
| **3.4 Unificar telas de busca** | 🟢 Feito | Busca unificada funcionando no admin |
| **4.1 Reagendar com calendário (atendente)** | 🟢 Feito | Calendário clicável funcionando |
| **4.2 Avisar paciente inativo** | 🟡 Com defeito | Tela pronta, mas servidor não envia os dados |
| **4.3 Cargo certo no cabeçalho** | 🟡 Incompleto | Faltam cargos como Motorista e Auxiliar |
| **5.1 Navegar abas com teclado** | 🟢 Feito | Setas do teclado funcionam nos painéis |
| **5.2 Erro claro nos campos** | 🔴 Não feito | Continua só com mensagem genérica no topo |
| **5.3 Indicador de senha fraca/forte**| 🔴 Não feito | Qualquer senha de 6 letras passa |
| **5.4 Limite de 1 ano no calendário** | 🟡 Não ativado | Código escrito, mas nunca é chamado |
| **5.5 Destacar formulário em edição** | 🟡 Parcial | Funciona em consulta, esquecido em exame |

---

## 1. Tela de Cadastro e Acesso (`auth.html`)

### 1.1 Consertar a escolha de Cargo do Atendente
- [ ] **Onde:** primeiro passo do cadastro, ao escolher a opção "Atendente".
  **O que muda:** 
  1. Limpar a repetição de campos que ficou no código visual.
  2. Impedir que o atendente avance para o passo 2 sem escolher um cargo.
  3. Se ele escolher a opção "Outro", obrigar a escrever qual é o cargo no campo que abre embaixo.
  **Por que:** hoje um atendente consegue clicar em "Continuar" sem escolher nenhum cargo, ou escolher "Outro" e deixar a caixa em branco.

### 1.2 Adicionar campo "Nome social"
- [ ] **Onde:** passo 2 (dados pessoais), logo abaixo do campo "Nome completo".
  **O que muda:** adicionar o campo opcional "Nome social", com um aviso explicando: *"Preencha apenas se você tiver um nome pelo qual prefere ser chamado(a), diferente do seu registro civil"*.
  **Por que:** direito garantido por lei e pelo SUS (Portaria nº 1.820/2009). Quem usa nome social precisa ser acolhido pelo nome correto no posto de saúde.

### 1.3 Adicionar número do Cartão SUS (CNS)
- [ ] **Onde:** passo 2 (dados pessoais), junto aos campos de CPF e RG.
  **O que muda:** adicionar o campo opcional "Cartão Nacional de Saúde (CNS)" com limite e formatação de 15 números, avisando: *"O número que consta no seu cartão do SUS (opcional se não tiver em mãos)"*.
  **Por que:** qualquer posto, hospital ou sistema oficial do governo usa o CNS como chave principal de atendimento.

### 1.4 Adicionar pergunta sobre Prioridade Legal de Atendimento
- [ ] **Onde:** passo 2 (dados pessoais).
  **O que muda:** adicionar uma caixinha de seleção: *"Possui prioridade legal de atendimento?"* com as opções: **Nenhuma, Idoso (60+), Gestante, Pessoa com deficiência (PCD), Lactante**. Se a pessoa preencher a data de nascimento e ela tiver 60 anos ou mais, o sistema seleciona "Idoso (60+)" sozinho automaticamente.
  **Por que:** a Lei 10.048/2000 exige prioridade no atendimento de saúde. Se o sistema não souber disso, o atendente não tem como organizar a fila de forma humana e legal.

### 1.5 Campo para Nome do Responsável (quando for menor de 18 anos)
- [ ] **Onde:** passo 2 (dados pessoais).
  **O que muda:** assim que o usuário digita a data de nascimento, se o sistema calcular que ele tem menos de 18 anos, abre automaticamente um campo obrigatório: *"Nome do responsável legal / acompanhante"*. Para maiores de idade, esse campo fica escondido.
  **Por que:** crianças e adolescentes não comparecem a consultas nem assinam termos de saúde desacompanhados.

### 1.6 Adicionar campo "Cor ou Raça" (Autodeclaração)
- [ ] **Onde:** passo 2 (dados pessoais).
  **O que muda:** adicionar campo opcional com as opções oficiais do IBGE e do Ministério da Saúde: **Branca, Preta, Parda, Amarela, Indígena, Prefiro não informar**.
  **Por que:** é uma exigência de qualquer cadastro de saúde pública no Brasil para garantir que as políticas de saúde cheguem com igualdade a todas as comunidades.

### 1.7 Ponto de referência obrigatório APENAS para quem mora na zona rural
- [ ] **Onde:** passo 3 (endereço), campo "Ponto de referência".
  **O que muda:** hoje o formulário trava se você não colocar ponto de referência, mesmo morando em rua asfaltada com número e CEP. Vai mudar para: se a pessoa marcar **Zona Urbana**, o ponto de referência se torna opcional. Se marcar **Zona Rural**, o ponto de referência continua obrigatório com a dica: *"Ex: Sítio São José, após o engenho, próximo à casa de Dona Maria"*.
  **Por que:** na zona urbana o carteiro e a ambulância acham pelo CEP e número; na zona rural, sem ponto de referência a ambulância não encontra a residência do paciente.

### 1.8 Textos explicativos sob campos delicados (Transparência / LGPD)
- [ ] **Onde:** passo 2 e passo 4 (dados pessoais e documentos).
  **O que muda:** colocar uma letrinha miúda e cinza embaixo de campos delicados explicando a finalidade:
  - Embaixo do CPF: *"Usado para garantir que seus agendamentos fiquem vinculados unicamente a você."*
  - Embaixo do Telefone: *"Usado para avisar caso sua consulta precise ser reagendada."*
  - Embaixo da Senha: *"Sua senha é criptografada e ninguém da equipe tem acesso a ela."*
  **Por que:** aumenta a confiança do morador no aplicativo e atende à Lei Geral de Proteção de Dados (LGPD).

### 1.9 Indicador visual de senha fraca, média ou forte
- [ ] **Onde:** passo 4 (criação da senha).
  **O que muda:** enquanto a pessoa digita a senha, aparece uma barrinha colorida embaixo (vermelha = fraca, amarela = média, verde = forte) com dicas curtas (ex: *"misture letras e números"*).
  **Por que:** como o sistema guarda histórico médico, senhas fáceis como "123456" colocam a privacidade do paciente em risco.

### 1.10 Avisos de erro direto no campo errado (em vez de aviso genérico)
- [ ] **Onde:** passos 2, 3 e 4 do cadastro.
  **O que muda:** se faltar preencher um campo obrigatório ou se a senha for muito curta, a caixinha daquele campo específico fica com borda vermelha e uma mensagem embaixo dizendo exatamente o que falta (ex: *"Informe seu celular com DDD"* ou *"O CEP precisa ter 8 dígitos"*), em vez de só mostrar um aviso genérico flutuando no topo da tela.
  **Por que:** a pessoa que está se cadastrando no celular não sabe o que errou se o aviso não apontar para o campo exato.

---

## 2. Tela do Paciente (`dashboard.html`)

### 2.1 URGENTE: Restaurar a aba e os pedidos de "Transporte Sanitário"
- [ ] **Onde:** menu de abas e conteúdo da tela do paciente (`dashboard.html`).
  **O que muda:** 
  1. Recriar a aba **"Transporte"** no menu principal do paciente.
  2. Adicionar o formulário **"Solicitar transporte sanitário"** (com Tipo de transporte: Ambulância, Van, Carro, Cadeirante, Outro; Local de saída; Destino; Data/hora; e Motivo).
  3. Adicionar a listagem **"Meus transportes"**, onde o paciente vê o status do pedido (Pendente, Confirmado, Cancelado), pode editar enquanto estiver pendente e pode cancelar se desistir.
  4. Fazer os transportes agendados aparecerem nos cards de resumo do topo e na lista de "Próximos eventos" da tela de Início.
  **Por que:** esta é uma das promessas principais do Saúde+! O servidor já tem todo o código de transporte pronto, mas na interface do paciente a aba inteira foi esquecida ou removida por engano.

### 2.2 Campo "Outro" no formulário de transporte
- [ ] **Onde:** formulário de solicitar transporte (ao reativar o item 2.1).
  **O que muda:** quando o paciente escolher a opção "Outro", abre uma caixinha de texto para ele escrever que tipo de veículo precisa. Se escolher outra opção, a caixinha fica guardada.
  **Por que:** se o paciente precisa de um transporte especial que não está na lista, essa informação não pode se perder.

### 2.3 Exigir preenchimento ao escolher "Outro" no tipo de exame
- [ ] **Onde:** formulário de agendar exame, campo "Tipo de exame".
  **O que muda:** hoje o campo de texto já abre quando escolhe "Outro", mas o formulário deixa enviar com o campo vazio. O sistema agora vai avisar: *"Por favor, informe qual é o exame"* e não deixa enviar em branco.
  **Por que:** evita que o posto receba um pedido de exame sem saber do que se trata.

### 2.4 Ativar de verdade a trava de agendamento no futuro (máximo 1 ano)
- [ ] **Onde:** todos os campos de escolher data e hora de consulta, exame e transporte.
  **O que muda:** o calendário do celular/computador não vai deixar selecionar nenhuma data com mais de 12 meses para a frente.
  **Por que:** evita que a pessoa digite o ano errado sem perceber (ex: agendar para o ano 2035 por engano). O código disso já existe no arquivo, mas estava desligado.

### 2.5 Destacar visualmente o formulário de Exame e Transporte ao clicar em "Editar"
- [ ] **Onde:** formulários de exames e transportes no painel do paciente.
  **O que muda:** quando o paciente clica no botão "Editar" de um agendamento da lista, a tela sobe até o formulário e ele ganha uma borda colorida destacada avisando: *"Você está editando este agendamento"*, com um botão claro para salvar ou cancelar a edição.
  **Por que:** hoje isso só foi feito no formulário de consultas; em exames a pessoa clica em editar e não fica claro na tela que o formulário mudou para modo de edição.

### 2.6 Botão de "Reagendar" para itens cancelados
- [ ] **Onde:** na lista de consultas, exames e transportes cancelados do paciente.
  **O que muda:** quando uma consulta ou exame constar como "Cancelado", colocar um botãozinho amigável **"Tentar agendar novamente"**, que já abre o formulário pré-preenchido com a mesma especialidade e local, precisando apenas escolher uma nova data.
  **Por que:** se a consulta foi cancelada (por falta de médico ou pelo próprio paciente), ele não precisa preencher tudo do zero novamente.

---

## 3. Tela do Atendente (`atendente.html`)

### 3.1 Consertar o carregamento do painel do atendente (Erro de Login)
- [ ] **Onde:** no carregamento da tela do atendente (`atendente.html`).
  **O que muda:** corrigir uma incompatibilidade no código de segurança de acesso (`requireRole`), garantindo que o atendente logado entre no painel sem erros de tela travada ou tela em branco.
  **Por que:** hoje o atendente pode se deparar com um erro silencioso no navegador que o impede de usar as ferramentas do posto.

### 3.2 Fazer o aviso de "Paciente Inativo/Pendente" funcionar de verdade
- [ ] **Onde:** aba "Buscar paciente" no painel do atendente.
  **O que muda:** quando o atendente buscar pelo nome ou e-mail de um paciente cuja conta esteja desativada ou ainda aguardando aprovação, o sistema vai avisar com destaque amarelo: *"Este paciente já tem cadastro no sistema, mas a conta está [Inativa / Pendente]. Não crie um novo cadastro — solicite ao administrador a reativação da conta existente."*
  **Por que:** a tela do atendente já tem esse aviso desenhado, mas o servidor estava filtrando os inativos antes da tela receber. Corrigindo no servidor, evita-se a criação de cadastros duplicados no posto de saúde.

### 3.3 Completar a lista de cargos no cabeçalho do atendente
- [ ] **Onde:** saudação no topo da tela do atendente (ex: *"Olá, Maria! Enfermeira · Painel de atendimento"*).
  **O que muda:** atualizar a regra de formatação para reconhecer todos os cargos reais (incluindo **Motorista**, **Auxiliar Administrativo**, etc.), exibindo o nome do cargo sempre com letra bonita e acentuação correta.
  **Por que:** cargos como Motorista e Auxiliar Administrativo estavam ficando de fora da lista oficial de formatação.

### 3.4 Ativar o limite de data no calendário de reagendamento do atendente
- [ ] **Onde:** janelinha de reagendar atendimento na tela do atendente.
  **O que muda:** não permitir selecionar datas passadas nem datas além de 1 ano no futuro.
  **Por que:** evita erros de digitação durante o atendimento corrido no balcão do posto.

---

## 4. Tela do Administrador (`admin.html`)

### 4.1 Salvar de verdade o motivo ao ativar ou inativar uma conta
- [ ] **Onde:** na aba "Usuários e Histórico", ao abrir o perfil de um usuário e alterar seu status para "Inativo" ou "Ativo".
  **O que muda:** 
  1. Quando o administrador preencher o campo "Observação / Motivo" (ex: *"Paciente mudou de cidade"* ou *"Cadastro duplicado da dona Josefa"*), o sistema vai realmente salvar essa explicação no histórico de auditoria do sistema.
  2. Adicionar uma coluna ou linha no relatório de auditoria mostrando o motivo registrado.
  **Por que:** hoje a tela do admin tem o campo para digitar o motivo, mas o servidor ignorava o texto e não gravava em lugar nenhum! Ninguém conseguia saber depois por que uma conta foi bloqueada.

### 4.2 Janela bonita ao excluir alerta de doença
- [ ] **Onde:** aba "Doenças", no botão "Excluir".
  **O que muda:** hoje aparece uma janelinha cinza simples do próprio navegador perguntando *"Excluir este alerta?"*. Vai virar uma janela bonita do próprio sistema Saúde+, explicando: *"Tem certeza que deseja apagar o alerta sobre esta doença? Ele deixará de aparecer para todos os moradores imediatamente."*
  **Por que:** ações de apagar dados devem seguir a mesma identidade visual e cuidado das outras janelas do aplicativo.

### 4.3 Gestão de Postos e Unidades de Saúde (`health_units`)
- [ ] **Onde:** criar uma nova aba ou seção dentro do painel do Administrador: **"Postos e Unidades"**.
  **O que muda:** permitir que o administrador:
  1. Veja a lista dos postos de saúde, UBSs e hospitais cadastrados no município.
  2. Adicione uma nova unidade se um posto novo for inaugurado em Lagoa de Itaenga.
  3. Altere o nome, bairro ou desative uma unidade que estiver em reforma.
  **Por que:** hoje as 10 unidades de saúde estão gravadas no banco de dados sem nenhuma tela para o administrador mexer. Se um PSF mudar de nome ou endereço, ninguém consegue alterar pelo sistema sem chamar um programador.

---

## 5. Tela Inicial (`index.html`) e Navegação Geral

### 5.1 Redirecionamento correto do Atendente na página inicial
- [ ] **Onde:** página inicial (`index.html`).
  **O que muda:** se uma pessoa já logada como Atendente acessar a página inicial do site, o sistema deve enviá-la direto para `atendente.html`. (Hoje o código só checava Administrador e mandava os atendentes para a tela do paciente por engano).
  **Por que:** evita confusão e cliques desnecessários para os funcionários da rede municipal.

### 5.2 Organização dos arquivos de conexão do sistema
- [ ] **Onde:** arquivos técnicos de conexão (`assets/api.js` e pasta `server`).
  **O que muda:** consolidar todas as regras de conexão e permissões em um único arquivo oficial dentro de `assets/api.js`, eliminando arquivos duplicados deixados na pasta errada do servidor.
  **Por que:** evita que alterações feitas em uma parte do sistema deixem de funcionar em outras telas.

---

## 6. Inteligência e Automação do Sistema ("Debaixo do Capô")

> *Estes itens são resolvidos diretamente na programação pela IA, mas o time de produto precisa saber que existem para poder testar e validar o funcionamento.*

### 6.1 Lembretes automáticos na véspera da consulta/exame
- [ ] **O que muda:** o sistema passará a ter uma rotina automática diária que lê as consultas e transportes agendados para o dia seguinte e cria um aviso na aba "Minha agenda" e no card de lembretes do paciente (ex: *"Lembrete: sua consulta com Clínico Geral é amanhã às 08:30 no PSF Progresso"*).
  **Por que:** uma das maiores causas de filas na saúde pública é o paciente faltar à consulta porque esqueceu a data. Lembretes automáticos reduzem o índice de faltas.

### 6.2 Blindagem de segurança no cadastro e nas datas
- [ ] **O que muda:** o servidor passará a validar com rigor os dados recebidos:
  1. Bloquear cadastros que venham com CPF de formato inválido (ex: `111.111.111-11`).
  2. Rejeitar qualquer tentativa de agendamento em datas passadas, mesmo que alguém tente burlar o formulário.
  3. Garantir que ninguém consiga criar conta sem os dados essenciais de saúde.
  **Por que:** segurança e integridade de dados são indispensáveis para um sistema que será apresentado e licenciado para a Secretaria de Saúde do município.

### 6.3 Proteção contra tentativas repetidas de senha (Força bruta)
- [ ] **O que muda:** se alguém errar a senha 5 vezes seguidas na tela de login, o sistema bloqueia novas tentativas por 5 minutos naquele computador.
  **Por que:** impede que pessoas mal-intencionadas usem robôs para adivinhar senhas de pacientes ou da administração.

---

## 7. Roteiro Sugerido de Execução para o Time (Próximas Reuniões)

Para o time não se perder tentando fazer tudo de uma vez, sugerimos aprovar as tarefas nestas 3 etapas lógicas:

### Etapa 1: Consertos Urgentes e o Transporte do Paciente
1. **Restaurar o módulo de Transporte Sanitário no painel do paciente** (Item 2.1).
2. **Consertar a inicialização do Atendente** (Item 3.1) e o aviso de paciente inativo (Item 3.2).
3. **Consertar a gravação do motivo de status de usuário no Admin** (Item 4.1).
4. **Ativar o limite de 1 ano no calendário de todas as telas** (Itens 2.4 e 3.4).

### Etapa 2: Alinhamento Oficial com o SUS e Cadastro Completo
1. **Ajustar o Cargo do Atendente** (Item 1.1) e adicionar **Nome Social, CNS, Prioridade e Raça/Cor** (Itens 1.2 a 1.6).
2. **Tornar o ponto de referência obrigatório apenas para zona rural** (Item 1.7).
3. **Adicionar os textos explicativos e os avisos de erro em cada campo** (Itens 1.8 e 1.10).
4. **Indicador de força de senha** (Item 1.9).

### Etapa 3: Automação, Gestão de Postos e Acabamento Visual
1. **Gestão de Postos e Unidades de Saúde pelo Administrador** (Item 4.3).
2. **Geração automática de lembretes na véspera** (Item 6.1).
3. **Modal bonito ao excluir doenças e botões de tentar novamente** (Itens 4.2 e 2.6).
4. **Blindagem e proteção contra senhas repetidas** (Itens 6.2 e 6.3).

---

## 8. Como usar este documento

1. Em cada reunião, o time escolhe a Etapa que quer executar.
2. Leiam item por item.
3. Se o item estiver aprovado como prioridade do time, instruam a IA para executar o código daquela etapa.
4. Após testarem e confirmarem na prática que a tela está funcionando, marquem a caixinha `[x]`.
