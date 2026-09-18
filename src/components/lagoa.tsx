import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NIVEL_ALERTA, STATUS_AGENDAMENTO, STATUS_TRANSPORTE, STATUS_USUARIO, prioridadeLabel } from "@/lib/br";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function Glass({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass rounded-2xl p-4 ring-soft", className)} {...rest}>
      {children}
    </div>
  );
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-lagoon-deep sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-ink/65">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-lg font-semibold text-lagoon-deep">{children}</h2>
      {aside}
    </div>
  );
}

export function Pill({ tone = "lagoon", children, className }: { tone?: "lagoon" | "mata" | "atencao" | "alto" | "critico" | "neutral"; children: ReactNode; className?: string }) {
  const tones = {
    lagoon: "bg-lagoon/12 text-lagoon-deep ring-lagoon/25",
    mata: "bg-mata/15 text-mata ring-mata/25",
    atencao: "bg-atencao/20 text-alto ring-atencao/30",
    alto: "bg-alto/15 text-alto ring-alto/30",
    critico: "bg-critico/12 text-critico ring-critico/30",
    neutral: "bg-ink/8 text-ink/70 ring-ink/10",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1", tones[tone], className)}>
      {children}
    </span>
  );
}

export function PriorityBadge({ prioridade }: { prioridade: string | null | undefined }) {
  if (!prioridade) return <Pill tone="neutral">Padrão</Pill>;
  const tone = prioridade === "gestante" ? "critico" : prioridade === "pcd" ? "lagoon" : prioridade === "idoso" ? "mata" : "atencao";
  return <Pill tone={tone}>{prioridadeLabel(prioridade)}</Pill>;
}

export function NivelBadge({ nivel }: { nivel: string }) {
  const bg = nivel === "critico" ? "bg-critico" : nivel === "alto" ? "bg-alto" : "bg-atencao";
  return (
    <span className={cn("rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-creme", bg)}>
      {NIVEL_ALERTA[nivel] ?? nivel}
    </span>
  );
}

export function StatusBadge({ status, kind }: { status: string; kind: "agendamento" | "transporte" | "usuario" }) {
  const map = kind === "agendamento" ? STATUS_AGENDAMENTO : kind === "transporte" ? STATUS_TRANSPORTE : STATUS_USUARIO;
  const tone =
    ["confirmado", "aprovado", "ativo", "concluido"].includes(status)
      ? "mata"
      : ["cancelado", "negado", "inativo"].includes(status)
        ? "critico"
        : ["pendente", "reagendado", "solicitado"].includes(status)
          ? "atencao"
          : "lagoon";
  return <Pill tone={tone}>{map[status] ?? status}</Pill>;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="glass rounded-2xl border border-dashed border-lagoon/30 p-8 text-center ring-soft">
      <p className="font-display font-semibold text-lagoon-deep">{title}</p>
      {hint && <p className="mt-1 text-sm text-ink/60">{hint}</p>}
    </div>
  );
}

export function Field({ label, htmlFor, error, hint, children, required }: { label: string; htmlFor?: string; error?: string; hint?: string; children: ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-lagoon-deep">
        {label} {required && <span className="text-critico">*</span>}
      </label>
      {children}
      {error ? <p className="text-sm font-medium text-critico">{error}</p> : hint ? <p className="text-xs text-ink/55">{hint}</p> : null}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("animate-spin", className)} aria-hidden />;
}

export function LoadingBlock({ label = "Carregando…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-ink/60" role="status">
      <Spinner /> <span>{label}</span>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  destructive,
  loading,
  onConfirm,
  children,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  children?: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !loading && onOpenChange(o)}>
      <DialogContent className="glass-strong rounded-3xl border-0 ring-soft sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-lagoon-deep">{title}</DialogTitle>
          {description && <DialogDescription className="text-ink/70">{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button variant={destructive ? "destructive" : "default"} onClick={onConfirm} disabled={loading}>
            {loading && <Spinner />} {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const inputClass =
  "h-12 w-full rounded-xl border-2 border-input bg-card px-3.5 text-base text-ink placeholder:text-ink/40 focus-visible:border-lagoon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/30 disabled:opacity-60";
export const selectClass = inputClass + " appearance-none";
export const textareaClass = inputClass.replace("h-12", "min-h-24 py-2.5");
