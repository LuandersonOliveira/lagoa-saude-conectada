export const onlyDigits = (v: string) => (v || "").replace(/\D/g, "");

export function maskCPF(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

export function maskCNS(v: string) {
  const d = onlyDigits(v).slice(0, 15);
  return d.replace(/^(\d{3})(\d)/, "$1 $2").replace(/^(\d{3}) (\d{4})(\d)/, "$1 $2 $3").replace(/^(\d{3}) (\d{4}) (\d{4})(\d)/, "$1 $2 $3 $4");
}

export function maskTelefone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 10) return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export function maskCEP(v: string) {
  const d = onlyDigits(v).slice(0, 8);
  return d.replace(/^(\d{5})(\d)/, "$1-$2");
}

export function validaCPF(v: string) {
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

export function validaCNS(v: string) {
  const c = onlyDigits(v);
  if (c.length !== 15) return false;
  let soma = 0;
  for (let i = 0; i < 15; i++) soma += Number(c[i]) * (15 - i);
  return soma % 11 === 0;
}

export const validaCEP = (v: string) => onlyDigits(v).length === 8;

export const GENEROS = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
  { value: "nao_binario", label: "Não binário" },
  { value: "outro", label: "Outro" },
  { value: "nao_informado", label: "Prefiro não informar" },
];

export const RACAS_COR = [
  { value: "branca", label: "Branca" },
  { value: "preta", label: "Preta" },
  { value: "parda", label: "Parda" },
  { value: "amarela", label: "Amarela" },
  { value: "indigena", label: "Indígena" },
  { value: "sem_informacao", label: "Sem informação" },
];

export const PRIORIDADES = [
  { value: "gestante", label: "Gestante" },
  { value: "pcd", label: "Pessoa com deficiência" },
  { value: "idoso", label: "Idoso(a) 60+" },
  { value: "lactante", label: "Lactante" },
] as const;

export const PRIORIDADE_ORDEM: Record<string, number> = { gestante: 0, pcd: 1, idoso: 2, lactante: 3 };

export const prioridadeLabel = (p?: string | null) =>
  PRIORIDADES.find((x) => x.value === p)?.label ?? "";

export function prioridadePrincipal(prios?: string[] | null) {
  if (!prios || !prios.length) return null;
  return [...prios].sort((a, b) => (PRIORIDADE_ORDEM[a] ?? 9) - (PRIORIDADE_ORDEM[b] ?? 9))[0];
}

export const ESPECIALIDADES = [
  "Clínica Geral",
  "Pediatria",
  "Ginecologia",
  "Cardiologia",
  "Odontologia",
  "Enfermagem",
  "Psicologia",
  "Nutrição",
  "Outro",
];

export const EXAMES = [
  "Exame de sangue",
  "Exame de urina",
  "Raio-X",
  "Ultrassonografia",
  "Eletrocardiograma",
  "Mamografia",
  "Preventivo (Papanicolau)",
  "Outro",
];

export const CIDADES_DESTINO = [
  "Recife",
  "Caruaru",
  "Carpina",
  "Limoeiro",
  "Nazaré da Mata",
  "Paudalho",
  "Outro",
];

export const STATUS_AGENDAMENTO: Record<string, string> = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  reagendado: "Reagendado",
  em_atendimento: "Em atendimento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export const STATUS_TRANSPORTE: Record<string, string> = {
  solicitado: "Solicitado",
  aprovado: "Aprovado",
  negado: "Negado",
  concluido: "Concluído",
};

export const STATUS_FILA: Record<string, string> = {
  aguardando: "Aguardando",
  em_atendimento: "Em atendimento",
  atendido: "Atendido",
  ausente: "Ausente",
};

export const STATUS_USUARIO: Record<string, string> = {
  pendente: "Pendente",
  ativo: "Ativo",
  inativo: "Inativo",
};

export const NIVEL_ALERTA: Record<string, string> = {
  atencao: "Atenção",
  alto: "Alto",
  critico: "Crítico",
};

export const ROLE_LABEL: Record<string, string> = {
  admin: "Administração",
  atendente: "Atendente",
  paciente: "Paciente",
};

export function fmtDateTime(v?: string | null) {
  if (!v) return "—";
  return new Date(v).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function fmtDate(v?: string | null) {
  if (!v) return "—";
  const d = v.length === 10 ? new Date(v + "T12:00:00") : new Date(v);
  return d.toLocaleDateString("pt-BR");
}

export function toLocalInput(v?: string | null) {
  const d = v ? new Date(v) : new Date();
  d.setSeconds(0, 0);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function idade(nasc?: string | null) {
  if (!nasc) return 0;
  const d = new Date(nasc + "T12:00:00");
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

export function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function iniciais(nome?: string | null) {
  const parts = (nome || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "S+";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}
