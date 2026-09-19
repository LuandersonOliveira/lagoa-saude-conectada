import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export type Perfil = {
  id: string;
  nome_civil: string;
  nome_social: string | null;
  cpf: string;
  cns: string | null;
  rg: string | null;
  data_nascimento: string;
  genero: string;
  raca_cor: string;
  telefone: string | null;
  email: string | null;
  responsavel_nome: string | null;
  prioridades: string[];
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro_id: string | null;
  zona: string;
  ponto_referencia: string | null;
  status: string;
  status_motivo: string | null;
};

export type Sessao = {
  userId: string;
  email: string | null;
  perfil: Perfil | null;
  papeis: string[];
};

export async function loadSession(): Promise<Sessao | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const [{ data: perfil }, { data: papeis }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", data.user.id),
  ]);
  return {
    userId: data.user.id,
    email: data.user.email ?? null,
    perfil: (perfil as Perfil | null) ?? null,
    papeis: (papeis ?? []).map((r: { role: string }) => r.role),
  };
}

export const sessionQuery = {
  queryKey: ["session"] as const,
  queryFn: loadSession,
  staleTime: 60_000,
};

export function useSession() {
  return useQuery(sessionQuery);
}

export function homeForRoles(papeis: string[]) {
  if (papeis.includes("admin")) return "/admin";
  if (papeis.includes("atendente")) return "/atendente";
  return "/paciente";
}

export function useSignOut() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
}

export async function logAudit(acao: string, entidade: string, entidadeId?: string | null, detalhes: Record<string, unknown> = {}) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("audit_log").insert({
    actor_id: data.user.id,
    acao,
    entidade,
    entidade_id: entidadeId ?? null,
    detalhes,
  });
}
