import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, User, Stethoscope, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, Glass, Spinner, inputClass, selectClass } from "@/components/lagoa";
import { homeForRoles, loadSession } from "@/lib/auth";
import {
  GENEROS,
  RACAS_COR,
  PRIORIDADES,
  ageFromDate,
  isValidCEP,
  isValidCNS,
  isValidCPF,
  maskCEP,
  maskCNS,
  maskCPF,
  maskPhone,
  onlyDigits,
} from "@/lib/br";
import { cn } from "@/lib/utils";

const TITLE = "Entrar ou criar conta — Saúde+ Lagoa Conectada";
const DESC = "Acesse a plataforma de saúde de Lagoa de Itaenga ou faça seu cadastro no padrão SUS em 4 passos.";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    modo: s.modo === "cadastro" ? ("cadastro" as const) : ("entrar" as const),
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: AuthPage,
});

type Tipo = "paciente" | "atendente" | "admin";

interface Form {
  tipo: Tipo;
  nome_civil: string;
  nome_social: string;
  cpf: string;
  cns: string;
  rg: string;
  data_nascimento: string;
  genero: string;
  raca_cor: string;
  telefone: string;
  prioridades: string[];
  responsavel_nome: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro_id: string;
  zona: "urbana" | "rural";
  ponto_referencia: string;
  email: string;
  senha: string;
  confirmar: string;
}

const initial: Form = {
  tipo: "paciente",
  nome_civil: "",
  nome_social: "",
  cpf: "",
  cns: "",
  rg: "",
  data_nascimento: "",
  genero: "",
  raca_cor: "",
  telefone: "",
  prioridades: [],
  responsavel_nome: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro_id: "",
  zona: "urbana",
  ponto_referencia: "",
  email: "",
  senha: "",
  confirmar: "",
};

const step2 = z
  .object({
    nome_civil: z.string().trim().min(3, "Informe o nome completo").max(120),
    nome_social: z.string().trim().max(120),
    cpf: z.string().refine(isValidCPF, "CPF inválido"),
    cns: z.string().refine((v) => !onlyDigits(v) || isValidCNS(v), "CNS inválido (15 dígitos)"),
    rg: z.string().trim().max(20),
    data_nascimento: z.string().refine((v) => !!v && new Date(v) < new Date(), "Informe a data de nascimento"),
    genero: z.string().min(1, "Selecione o gênero"),
    raca_cor: z.string().min(1, "Selecione raça/cor"),
    telefone: z.string().refine((v) => onlyDigits(v).length >= 10, "Telefone inválido"),
    responsavel_nome: z.string().trim().max(120),
  })
  .refine((d) => ageFromDate(d.data_nascimento) >= 18 || d.responsavel_nome.length >= 3, {
    message: "Informe o responsável legal para menores de 18 anos",
    path: ["responsavel_nome"],
  });

const step3 = z.object({
  cep: z.string().refine(isValidCEP, "CEP inválido"),
  logradouro: z.string().trim().min(2, "Informe a rua/sítio").max(160),
  numero: z.string().trim().min(1, "Informe o número (ou S/N)").max(10),
  bairro_id: z.string().min(1, "Selecione o bairro/região"),
  ponto_referencia: z.string().trim().max(200),
});

const step4 = z
  .object({
    email: z.string().trim().email("E-mail inválido").max(255),
    senha: z.string().min(8, "Mínimo de 8 caracteres").max(72),
    confirmar: z.string(),
  })
  .refine((d) => d.senha === d.confirmar, { message: "As senhas não conferem", path: ["confirmar"] });

function AuthPage() {
  const { modo } = Route.useSearch();
  const [tab, setTab] = useState<"entrar" | "cadastro">(modo);
  useEffect(() => setTab(modo), [modo]);

  return (
    <div className="app-bg flex min-h-screen flex-col text-ink">
      <header className="mx-auto flex w-full max-w-3xl items-center gap-3 px-5 py-5">
        <span className="grid size-10 place-items-center rounded-xl bg-lagoon font-display text-lg font-extrabold text-creme ring-soft">S+</span>
        <div className="leading-tight">
          <p className="font-display text-sm font-extrabold tracking-tight">Saúde+ — Lagoa Conectada</p>
          <p className="text-[11px] text-ink/55">Lagoa de Itaenga · PE</p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-12">
        <div className="glass mb-4 inline-flex rounded-2xl p-1 ring-soft" role="tablist">
          {(["entrar", "cadastro"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "cursor-pointer rounded-xl px-5 py-2.5 font-display font-semibold transition-colors",
                tab === t ? "bg-lagoon text-creme" : "text-ink/70 hover:bg-ink/5",
              )}
            >
              {t === "entrar" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>
        {tab === "entrar" ? <LoginForm /> : <Wizard />}
      </main>
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setErro(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    if (error) {
      setLoading(false);
      setErro(
        error.message.includes("Email not confirmed")
          ? "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada."
          : "E-mail ou senha incorretos.",
      );
      return;
    }
    const session = await loadSession();
    qc.setQueryData(["session"], session);
    setLoading(false);
    navigate({ to: homeForRoles(session.roles), replace: true });
  }

  return (
    <Glass className="rounded-3xl p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-lagoon-deep">Bem-vindo de volta</h1>
      <p className="mt-1 text-ink/65">Entre com o e-mail e a senha cadastrados.</p>
      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <Field label="E-mail" htmlFor="email" required>
          <input id="email" type="email" autoComplete="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Senha" htmlFor="senha" required>
          <input id="senha" type="password" autoComplete="current-password" className={inputClass} value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </Field>
        {erro && (
          <p role="alert" className="rounded-xl bg-critico/10 px-3 py-2 text-sm font-medium text-critico">
            {erro}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={loading || !email || !senha}>
          {loading && <Spinner />} Entrar
        </Button>
      </form>
    </Glass>
  );
}

const STEPS = ["Tipo de conta", "Dados pessoais", "Endereço", "Acesso"];

function Wizard() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { data: bairros = [] } = useQuery({
    queryKey: ["bairros"],
    queryFn: async () => (await supabase.from("bairros").select("*").order("zona").order("nome")).data ?? [],
  });

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const menor = f.data_nascimento ? ageFromDate(f.data_nascimento) < 18 : false;
  const idoso = f.data_nascimento ? ageFromDate(f.data_nascimento) >= 60 : false;

  useEffect(() => {
    const b = bairros.find((x) => x.id === f.bairro_id);
    if (b) set("zona", b.zona);
  }, [f.bairro_id, bairros]);

  function validate(): boolean {
    const schema = step === 1 ? step2 : step === 2 ? step3 : step === 3 ? step4 : null;
    if (!schema) return true;
    const r = schema.safeParse(f);
    if (r.success) {
      setErrors({});
      return true;
    }
    const e: Record<string, string> = {};
    for (const issue of r.error.issues) e[String(issue.path[0])] = issue.message;
    setErrors(e);
    return false;
  }

  function next() {
    if (validate()) setStep((s) => Math.min(s + 1, 3));
  }

  async function submit() {
    if (loading || !validate()) return;
    setLoading(true);
    const prioridades = [...f.prioridades];
    if (idoso && !prioridades.includes("idoso")) prioridades.push("idoso");
    const { error } = await supabase.auth.signUp({
      email: f.email.trim(),
      password: f.senha,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: {
          tipo_conta: f.tipo,
          nome_civil: f.nome_civil.trim(),
          nome_social: f.nome_social.trim(),
          cpf: onlyDigits(f.cpf),
          cns: onlyDigits(f.cns),
          rg: f.rg.trim(),
          data_nascimento: f.data_nascimento,
          genero: f.genero,
          raca_cor: f.raca_cor,
          telefone: onlyDigits(f.telefone),
          prioridades,
          responsavel_nome: menor ? f.responsavel_nome.trim() : "",
          cep: onlyDigits(f.cep),
          logradouro: f.logradouro.trim(),
          numero: f.numero.trim(),
          complemento: f.complemento.trim(),
          bairro_id: f.bairro_id,
          zona: f.zona,
          ponto_referencia: f.ponto_referencia.trim(),
        },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(
        error.message.includes("already registered")
          ? "Este e-mail já possui cadastro. Tente entrar."
          : error.message.includes("profiles_cpf_key")
            ? "Este CPF já está cadastrado."
            : "Não foi possível concluir o cadastro. Verifique os dados e tente novamente.",
      );
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <Glass className="rounded-3xl p-8 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-mata text-creme">
          <Check className="size-8" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-lagoon-deep">Cadastro enviado!</h1>
        <p className="mx-auto mt-2 max-w-md text-ink/70">
          Enviamos um link de confirmação para <strong>{f.email}</strong>. Abra seu e-mail e clique no link para ativar
          sua conta.
          {f.tipo !== "paciente" && " Contas de equipe passam ainda pela aprovação do administrador."}
        </p>
      </Glass>
    );
  }

  return (
    <Glass className="rounded-3xl p-6 sm:p-8">
      <ol className="mb-6 grid grid-cols-4 gap-2" aria-label="Etapas do cadastro">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-col gap-1.5">
            <span className={cn("h-1.5 rounded-full", i <= step ? "bg-lagoon" : "bg-ink/10")} />
            <span className={cn("text-[11px] font-semibold sm:text-xs", i === step ? "text-lagoon-deep" : "text-ink/45")}>
              {i + 1}. {s}
            </span>
          </li>
        ))}
      </ol>

      <h1 className="text-2xl font-bold text-lagoon-deep">{STEPS[step]}</h1>

      {step === 0 && (
        <div className="mt-5 grid gap-3">
          {(
            [
              { v: "paciente", t: "Paciente", d: "Morador que agenda consultas, exames e transporte.", i: <User /> },
              { v: "atendente", t: "Atendente", d: "Profissional que gerencia filas e reagendamentos. Requer aprovação.", i: <Stethoscope /> },
              { v: "admin", t: "Administrador", d: "Gestor público de usuários, alertas e unidades. Requer aprovação.", i: <ShieldCheck /> },
            ] as const
          ).map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => set("tipo", o.v)}
              aria-pressed={f.tipo === o.v}
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-2xl border-2 bg-card p-4 text-left transition-colors",
                f.tipo === o.v ? "border-lagoon bg-lagoon/8" : "border-transparent hover:border-lagoon/30",
              )}
            >
              <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl text-creme [&_svg]:size-6", f.tipo === o.v ? "bg-lagoon" : "bg-ink/30")}>{o.i}</span>
              <span>
                <span className="block font-display text-lg font-semibold text-lagoon-deep">{o.t}</span>
                <span className="block text-sm text-ink/65">{o.d}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Nome civil (como no documento)" htmlFor="nome_civil" required error={errors.nome_civil}>
              <input id="nome_civil" className={inputClass} value={f.nome_civil} onChange={(e) => set("nome_civil", e.target.value)} autoComplete="name" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Nome social (opcional)" htmlFor="nome_social" hint="Como você prefere ser chamado(a).">
              <input id="nome_social" className={inputClass} value={f.nome_social} onChange={(e) => set("nome_social", e.target.value)} />
            </Field>
          </div>
          <Field label="CPF" htmlFor="cpf" required error={errors.cpf}>
            <input id="cpf" inputMode="numeric" className={inputClass} value={f.cpf} onChange={(e) => set("cpf", maskCPF(e.target.value))} placeholder="000.000.000-00" />
          </Field>
          <Field label="CNS — Cartão SUS" htmlFor="cns" error={errors.cns} hint="15 dígitos. Se não souber, deixe em branco.">
            <input id="cns" inputMode="numeric" className={inputClass} value={f.cns} onChange={(e) => set("cns", maskCNS(e.target.value))} placeholder="000 0000 0000 0000" />
          </Field>
          <Field label="RG" htmlFor="rg">
            <input id="rg" className={inputClass} value={f.rg} onChange={(e) => set("rg", e.target.value)} />
          </Field>
          <Field label="Data de nascimento" htmlFor="nasc" required error={errors.data_nascimento}>
            <input id="nasc" type="date" className={inputClass} value={f.data_nascimento} onChange={(e) => set("data_nascimento", e.target.value)} max={new Date().toISOString().slice(0, 10)} />
          </Field>
          <Field label="Gênero" htmlFor="genero" required error={errors.genero}>
            <select id="genero" className={selectClass} value={f.genero} onChange={(e) => set("genero", e.target.value)}>
              <option value="">Selecione…</option>
              {GENEROS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Raça/Cor (IBGE)" htmlFor="raca" required error={errors.raca_cor}>
            <select id="raca" className={selectClass} value={f.raca_cor} onChange={(e) => set("raca_cor", e.target.value)}>
              <option value="">Selecione…</option>
              {RACAS_COR.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Telefone / WhatsApp" htmlFor="tel" required error={errors.telefone}>
            <input id="tel" inputMode="tel" className={inputClass} value={f.telefone} onChange={(e) => set("telefone", maskPhone(e.target.value))} placeholder="(81) 90000-0000" />
          </Field>
          {menor && (
            <Field label="Nome do responsável legal" htmlFor="resp" required error={errors.responsavel_nome} hint="Obrigatório para menores de 18 anos.">
              <input id="resp" className={inputClass} value={f.responsavel_nome} onChange={(e) => set("responsavel_nome", e.target.value)} />
            </Field>
          )}
          <fieldset className="sm:col-span-2">
            <legend className="mb-2 text-sm font-semibold text-lagoon-deep">Prioridade legal (marque o que se aplica)</legend>
            <div className="flex flex-wrap gap-2">
              {PRIORIDADES.map((p) => {
                const auto = p.value === "idoso" && idoso;
                const on = auto || f.prioridades.includes(p.value);
                return (
                  <label
                    key={p.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-medium",
                      on ? "border-mata bg-mata/12 text-mata" : "border-input bg-card text-ink/70",
                      auto && "cursor-default",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="size-4 accent-mata"
                      checked={on}
                      disabled={auto}
                      onChange={(e) =>
                        set("prioridades", e.target.checked ? [...f.prioridades, p.value] : f.prioridades.filter((x) => x !== p.value))
                      }
                    />
                    {p.label}
                    {auto && " (automático)"}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      )}

      {step === 2 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="CEP" htmlFor="cep" required error={errors.cep}>
            <input id="cep" inputMode="numeric" className={inputClass} value={f.cep} onChange={(e) => set("cep", maskCEP(e.target.value))} placeholder="55840-000" />
          </Field>
          <Field label="Bairro / Região" htmlFor="bairro" required error={errors.bairro_id}>
            <select id="bairro" className={selectClass} value={f.bairro_id} onChange={(e) => set("bairro_id", e.target.value)}>
              <option value="">Selecione…</option>
              <optgroup label="Zona urbana">
                {bairros.filter((b) => b.zona === "urbana").map((b) => (
                  <option key={b.id} value={b.id}>{b.nome}</option>
                ))}
              </optgroup>
              <optgroup label="Zona rural">
                {bairros.filter((b) => b.zona === "rural").map((b) => (
                  <option key={b.id} value={b.id}>{b.nome}</option>
                ))}
              </optgroup>
            </select>
          </Field>
          <div className="sm:col-span-2">
            <div className="flex gap-2" role="radiogroup" aria-label="Zona">
              {(["urbana", "rural"] as const).map((z) => (
                <button
                  key={z}
                  type="button"
                  role="radio"
                  aria-checked={f.zona === z}
                  onClick={() => set("zona", z)}
                  className={cn(
                    "flex-1 cursor-pointer rounded-xl border-2 px-4 py-3 font-display font-semibold",
                    f.zona === z ? "border-lagoon bg-lagoon text-creme" : "border-input bg-card text-ink/70",
                  )}
                >
                  Zona {z}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <Field label={f.zona === "rural" ? "Sítio / Estrada / Engenho" : "Rua / Avenida"} htmlFor="log" required error={errors.logradouro}>
              <input id="log" className={inputClass} value={f.logradouro} onChange={(e) => set("logradouro", e.target.value)} />
            </Field>
          </div>
          <Field label="Número" htmlFor="num" required error={errors.numero} hint="Use S/N se não houver.">
            <input id="num" className={inputClass} value={f.numero} onChange={(e) => set("numero", e.target.value)} />
          </Field>
          <Field label="Complemento" htmlFor="comp">
            <input id="comp" className={inputClass} value={f.complemento} onChange={(e) => set("complemento", e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Ponto de referência" htmlFor="ref" hint="Ex.: em frente à igreja, próximo ao campo de futebol.">
              <input id="ref" className={inputClass} value={f.ponto_referencia} onChange={(e) => set("ponto_referencia", e.target.value)} />
            </Field>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-5 grid gap-4">
          <Field label="E-mail" htmlFor="email2" required error={errors.email}>
            <input id="email2" type="email" autoComplete="email" className={inputClass} value={f.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Senha" htmlFor="pw" required error={errors.senha} hint="Mínimo de 8 caracteres.">
              <input id="pw" type="password" autoComplete="new-password" className={inputClass} value={f.senha} onChange={(e) => set("senha", e.target.value)} />
            </Field>
            <Field label="Confirmar senha" htmlFor="pw2" required error={errors.confirmar}>
              <input id="pw2" type="password" autoComplete="new-password" className={inputClass} value={f.confirmar} onChange={(e) => set("confirmar", e.target.value)} />
            </Field>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || loading}>
          <ArrowLeft /> Voltar
        </Button>
        {step < 3 ? (
          <Button type="button" onClick={next}>
            Continuar <ArrowRight />
          </Button>
        ) : (
          <Button type="button" size="lg" onClick={submit} disabled={loading}>
            {loading && <Spinner />} Criar conta
          </Button>
        )}
      </div>
    </Glass>
  );
}
