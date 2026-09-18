// Utilitários do padrão brasileiro (CADSUS / e-SUS): máscaras, validações e listas.

export const onlyDigits = (v: string) => v.replace(/\D/g, "");

export function maskCPF(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCNS(v: string) {
  const d = onlyDigits(v).slice(0, 15);
  return d.replace(/(\d{3})(\d)/, "$1 $2").replace(/(\d{4})(\d)/, "$1 $2").replace(/(\d{4})(\d)/, "$1 $2");
}

export function maskPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

export function maskCEP(v: string) {
  const d = onlyDigits(v).slice(0, 8);
  return d.replace(/(\d{5})(\d)/, "$1-$2");
}

export function isValidCPF(v: string) {
  const c = onlyDigits(v);
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(c[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === Number(c[9]) && calc(10) === Number(c[10]);
}

export function isValidCNS(v: string) {
  const c = onlyDigits(v);
  if (c.length !== 15) return false;
  if (/^[12]/.test(c)) {
    const pis = c.slice(0, 11);
    let sum = 0;
    for (let i = 0; i < 11; i++) sum += Number(pis[i]) * (15 - i);
    let dv = 11 - (sum % 11);
    if (dv === 11) dv = 0;
    let result: string;
    if (dv === 10) {
      sum += 2;
      dv = 11 - (sum % 11);
      result = pis + "001" + dv;
    } else {
      result = pis + "000" + dv;
    }
    return c === result;
  }
  if (/^[789]/.test(c)) {
    let sum = 0;
    for (let i = 0; i < 15; i++) sum += Number(c[i]) * (15 - i);
    return sum % 11 === 0;
  }
  return false;
}

export function isValidCEP(v: string) {
  return onlyDigits(v).length === 8;
}

export function ageFromDate(iso: string) {
  if (!iso) return 0;
  const b = new Date(iso);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}

export const GENEROS = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
  { value: "nao_binario", label: "Não binário" },
  { value: "outro", label: "Outro" },
  { value: "nao_informado", label: "Prefiro não informar" },
] as const;

export const RACAS_COR = [
  { value: "branca", label: "Branca" },
  { value: "preta", label: "Preta" },
  { value: "parda", label: "Parda" },
  { value: "amarela", label: "Amarela" },
  { value: "indigena", label: "Indígena" },
  { value: "sem_informacao", label: "Sem informação" },
] as const;

export const PRIORIDADES = [
  { value: "idoso", label: "Idoso 60+" },
  { value: "pcd", label: "Pessoa com deficiência" },
  { value: "gestante", label: "Gestante" },
  { value: "lactante", label: "Lactante" },
] as const;

export type Prioridade = (typeof PRIORIDADES)[number]["value"];

export const PRIORIDADE_ORDEM: Record<string, number> = { gestante: 0, pcd: 1, idoso: 2, lactante: 3 };

export function prioridadeLabel(p: string | null | undefined) {
  return PRIORIDADES.find((x) => x.value === p)?.label ?? "Padrão";
}

export function prioridadePrincipal(ps: string[] | null | undefined): string | null {
  if (!ps || ps.length === 0) return null;
  return [...ps].sort((a, b) => (PRIORIDADE_ORDEM[a] ?? 9) - (PRIORIDADE_ORDEM[b] ?? 9))[0] ?? null;
}

export const ESPECIALIDADES = [
  "Clínico geral",
  "Pediatria",
  "Ginecologia e obstetrícia",
  "Odontologia",
  "Enfermagem",
  "Psicologia",
  "Nutrição",
  "Fisioterapia",
  "Outro",
] as const;

export const EXAMES = [
  "Hemograma completo",
  "Glicemia em jejum",
  "Exame de urina",
  "Raio-X",
  "Ultrassonografia",
  "Eletrocardiograma",
  "Preventivo (Papanicolau)",
  "Teste rápido (HIV/Sífilis/Hepatites)",
  "Outro",
] as const;

export const CIDADES_DESTINO = ["Recife", "Caruaru", "Carpina", "Limoeiro", "Nazaré da Mata", "Paudalho", "Outro"] as const;

export const STATUS_AGENDAMENTO: Record<string, string> = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  reagendado: "Reagendado",
  em_atendimento: "Em atendimento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export const STATUS_TRANSPORTE: Record<string, string> = {
  solicitado: "Aguardando",
  aprovado: "Aprovado",
  negado: "Negado",
  concluido: "Concluído",
};

export const STATUS_USUARIO: Record<string, string> = {
  pendente: "Pendente",
  ativo: "Ativo",
  inativo: "Inativo",
};

export const NIVEL_ALERTA: Record<string, string> = { atencao: "Atenção", alto: "Alto", critico: "Crítico" };

export const ROLE_LABEL: Record<string, string> = { admin: "Administrador", atendente: "Atendente", paciente: "Paciente" };

export function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}
export function fmtWeekday(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
}
export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
export function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 36e5);
  if (h < 1) return "agora há pouco";
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return "ontem";
  return `há ${d} dias`;
}
export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}
export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
