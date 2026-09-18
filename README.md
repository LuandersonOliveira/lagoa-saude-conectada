# Lagoa Saúde Conectada

Crie a plataforma web "Saúde+ — Lagoa Conectada", um sistema de gestão e cuidado integrado para a rede pública de saúde de Lagoa de Itaenga - PE.

### 1. Visão Geral & Papéis de Usuário

O aplicativo atende três perfis distintos de acesso:

- Paciente: Morador municipal que realiza agendamentos de consultas/exames, solicita transporte sanitário e acompanha alertas de doenças locais.

- Atendente: Profissional de saúde que gerencia filas de atendimento, busca pacientes e realiza reagendamentos.

- Administrador: Gestor público responsável por gerenciar usuários, cadastrar alertas regionais de saúde, administrar unidades de saúde e visualizar registros de auditoria.

### 2. Padrão de Dados & Conformidade SUS

O cadastro e as entidades de dados devem seguir o padrão da saúde pública brasileira (CADSUS/e-SUS):

- Identificação do Paciente: Nome civil, Nome social, CPF (com validação de dígito verificador), CNS (Cartão Nacional de Saúde - 15 dígitos), RG, Data de nascimento, Gênero e Raça/Cor (categorias do IBGE/CADSUS).

- Prioridade Legal: Classificação automática ou manual para ordens de fila (Idoso 60+, PCD, Gestante, Lactante).

- Responsável: Campo condicional para nome do responsável legal caso o paciente seja menor de 18 anos.

- Endereço: Validação de CEP, com diferenciação clara entre Zona Urbana e Zona Rural, além de Ponto de Referência.

### 3. Módulos e Funcionalidades Principais

- Autenticação e Cadastro: Wizard em 4 passos (Tipo de Conta, Dados Pessoais, Endereço, Acesso) com máscaras em tempo real para CPF, telefone e CEP.

- Painel do Paciente (Dashboard):

  * Agendamento de Consultas e Exames (com seletores fechados e campo condicional "Outro").

  * Solicitação de Transporte Sanitário para atendimentos fora do município.

  * Feed de Alertas Epidêmicos/Doenças filtrados por região/bairro.

  * Painel de próximos eventos e lembretes de consultas.

- Painel do Atendente:

  * Busca rápida de pacientes por nome/CPF com indicação de status.

  * Fila de atendimento ordenada por Prioridade Legal.

  * Reagendamento com seletor de data/hora (datetime-local) dentro de modais.

- Painel de Administração:

  * Controle e aprovação de usuários (ativação/inativação com campo de motivo para auditoria).

  * Cadastro de Alertas de Doenças com seletor de bairros/regiões padronizados.

  * Histórico e registro completo de ações administrativas (audit_log).

### 4. Requisitos de UI/UX e Segurança

- Design System: Interface responsiva em paleta de alto contraste ("Lagoa"), focada em acessibilidade para usuários com baixa familiaridade digital.

- Modais e Interações: Substituição total de alertas/confirmações nativas do navegador (alert/confirm/prompt) por Modais acessíveis do próprio design system.

- Feedback Visual: Estados de carregamento (loading e botão desabilitado) em todos os formulários para impedir duplo envio.

- Segurança e Isolamento: Autenticação via JWT, isolamento estrito de dados por ID de usuário (cada paciente só lê seus dados) e proteção de rotas restritas a Admin e Atendente.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7fe84362-9411-48ae-a9ca-ed509c9ea26b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
