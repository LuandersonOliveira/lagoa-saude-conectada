import { Link, type LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { useSession, useSignOut, type Role } from "@/lib/auth";
import { initials, prioridadePrincipal, prioridadeLabel, ROLE_LABEL } from "@/lib/br";
import { cn } from "@/lib/utils";

export interface NavItem {
  to: LinkProps["to"];
  label: string;
  short?: string;
  icon: ReactNode;
}

export function AppShell({ nav, role, children }: { nav: NavItem[]; role: Role; children: ReactNode }) {
  const { data: session } = useSession();
  const signOut = useSignOut();
  const p = session?.profile;
  const prio = prioridadePrincipal(p?.prioridades);
  const nome = p?.nome_social || p?.nome_civil || "";

  return (
    <div className="app-bg min-h-screen text-ink">
      <header className="glass-strong sticky top-0 z-30 border-b border-ink/10">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-lagoon font-display text-lg font-extrabold text-creme ring-soft">
              S+
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-extrabold tracking-tight">Saúde+ — Lagoa Conectada</p>
              <p className="text-[11px] text-ink/55">Lagoa de Itaenga · PE · {ROLE_LABEL[role]}</p>
            </div>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Principal">
            {nav.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                activeOptions={{ exact: n.to === "/paciente" || n.to === "/atendente" || n.to === "/admin" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5"
                activeProps={{ className: "bg-lagoon/12 font-semibold text-lagoon-deep hover:bg-lagoon/12" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 md:ml-3">
            {prio && role === "paciente" && (
              <span className="hidden rounded-full bg-mata/15 px-3 py-1 text-xs font-semibold text-mata ring-1 ring-mata/25 sm:inline">
                Prioridade: {prioridadeLabel(prio)}
              </span>
            )}
            <div
              className="grid size-9 place-items-center rounded-full bg-creme font-display text-sm font-bold text-lagoon-deep ring-soft"
              title={nome}
              aria-label={nome}
            >
              {initials(nome) || "?"}
            </div>
            <button
              onClick={signOut}
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-critico"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-28 pt-6 sm:px-8 sm:pb-12 sm:pt-8">{children}</main>

      <nav
        className="glass-strong fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 md:hidden"
        aria-label="Navegação inferior"
      >
        <div className="mx-auto flex max-w-6xl items-stretch justify-around px-2 py-1.5">
          {nav.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              activeOptions={{ exact: n.to === "/paciente" || n.to === "/atendente" || n.to === "/admin" }}
              className={cn("flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-ink/60")}
              activeProps={{ className: "text-lagoon font-semibold" }}
            >
              <span className="[&_svg]:size-5">{n.icon}</span>
              <span className="text-[11px] font-medium">{n.short ?? n.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
