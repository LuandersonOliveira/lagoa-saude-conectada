import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles"> & { bairros?: { nome: string; zona: string } | null };
export type Role = "admin" | "atendente" | "paciente";

export interface SessionInfo {
  userId: string | null;
  email: string | null;
  profile: Profile | null;
  roles: Role[];
}

export async function loadSession(): Promise<SessionInfo> {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { userId: null, email: null, profile: null, roles: [] };
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("*, bairros(nome, zona)").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);
  return {
    userId: user.id,
    email: user.email ?? null,
    profile: (profile as Profile | null) ?? null,
    roles: (roles ?? []).map((r) => r.role as Role),
  };
}

export const sessionQuery = { queryKey: ["session"], queryFn: loadSession, staleTime: 60_000 };

export function useSession() {
  return useQuery(sessionQuery);
}

export function homeForRoles(roles: Role[]): "/admin" | "/atendente" | "/paciente" {
  if (roles.includes("admin")) return "/admin";
  if (roles.includes("atendente")) return "/atendente";
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

export async function logAudit(acao: string, entidade: string, entidadeId: string | null, detalhes: Record<string, unknown> = {}) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("audit_log").insert({
    actor_id: data.user.id,
    acao,
    entidade,
    entidade_id: entidadeId,
    detalhes: detalhes as never,
  });
}
