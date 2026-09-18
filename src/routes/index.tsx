import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarPlus, Bus, Bell, ShieldCheck } from "lucide-react";
import { useSession, homeForRoles } from "@/lib/auth";

const TITLE = "Saúde+ — Lagoa Conectada | Rede pública de saúde de Lagoa de Itaenga";
const DESC =
  "Agende consultas e exames, solicite transporte sanitário e acompanhe alertas de saúde do seu bairro. Plataforma oficial da rede pública de saúde de Lagoa de Itaenga - PE.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { data: session, isLoading } = useSession();
  const signedIn = !!session?.userId;

  return (
    <div className="app-bg min-h-screen text-ink">
      <header className="glass-strong sticky top-0 z-30 border-b border-ink/10">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-8">
          <span className="grid size-10 place-items-center rounded-xl bg-lagoon font-display text-lg font-extrabold text-creme ring-soft">
            S+
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-extrabold tracking-tight">Saúde+ — Lagoa Conectada</p>
            <p className="text-[11px] text-ink/55">Lagoa de Itaenga · PE</p>
          </div>
          <div className="ml-auto">
            {isLoading ? null : signedIn ? (
              <Link
                to={homeForRoles(session!.roles)}
                className="inline-flex h-11 items-center rounded-xl bg-primary px-5 font-display font-semibold text-primary-foreground hover:bg-lagoon-deep"
              >
                Meu painel
              </Link>
            ) : (
              <Link
                to="/auth"
                className="inline-flex h-11 items-center rounded-xl bg-primary px-5 font-display font-semibold text-primary-foreground hover:bg-lagoon-deep"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <section className="glass-lagoon rounded-3xl p-7 ring-1 ring-white/20 sm:p-10">
          <span className="rounded-full bg-creme/15 px-3 py-1 text-xs font-semibold text-creme/85">
            Prefeitura de Lagoa de Itaenga · Secretaria de Saúde
          </span>
          <h1 className="mt-4 max-w-[22ch] text-balance font-display text-3xl font-semibold leading-tight text-creme sm:text-5xl">
            Cuidado público, simples e perto de você.
          </h1>
          <p className="mt-3 max-w-[52ch] text-pretty text-creme/85 sm:text-lg">
            Marque consultas e exames, peça transporte sanitário e receba alertas de saúde do seu bairro — tudo em
            um só lugar, com letras grandes e sem complicação.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/auth"
              search={{ modo: "cadastro" }}
              className="inline-flex h-14 items-center rounded-2xl bg-creme px-7 font-display text-lg font-semibold text-lagoon-deep hover:bg-card"
            >
              Criar minha conta
            </Link>
            <Link
              to="/auth"
              className="inline-flex h-14 items-center rounded-2xl border-2 border-creme/40 px-7 font-display text-lg font-semibold text-creme hover:bg-creme/10"
            >
              Já tenho conta
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <CalendarPlus />, t: "Consultas e exames", d: "Escolha a unidade, o serviço e o melhor horário." },
            { icon: <Bus />, t: "Transporte sanitário", d: "Solicite viagem para atendimentos fora do município." },
            { icon: <Bell />, t: "Alertas do bairro", d: "Dengue, gripe e outros avisos filtrados pela sua região." },
            { icon: <ShieldCheck />, t: "Padrão SUS", d: "Cadastro com CPF, CNS e prioridade legal garantida." },
          ].map((f) => (
            <div key={f.t} className="glass flex flex-col gap-3 rounded-3xl p-5 ring-soft">
              <span className="grid size-12 place-items-center rounded-2xl bg-lagoon text-creme [&_svg]:size-6">{f.icon}</span>
              <p className="font-display text-lg font-semibold text-lagoon-deep">{f.t}</p>
              <p className="text-sm text-ink/65">{f.d}</p>
            </div>
          ))}
        </section>

        <p className="mt-10 text-center text-xs text-ink/50">
          Sistema integrado à rede pública de saúde · Dados protegidos e isolados por usuário · Ouvidoria SUS 136
        </p>
      </main>
    </div>
  );
}
