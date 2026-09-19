import * as React from "react";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export const inputClass =
  "w-full h-12 rounded-2xl border border-lagoon/25 bg-white/85 px-4 text-[1rem] text-ink placeholder:text-ink/40 focus-ring";
export const selectClass = inputClass + " pr-10";
export const textareaClass =
  "w-full min-h-28 rounded-2xl border border-lagoon/25 bg-white/85 px-4 py-3 text-[1rem] text-ink focus-ring";

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger" | "success";
  size?: "md" | "lg" | "sm";
};

export function Button({ variant = "primary", size = "md", className, ...props }: BtnProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition disabled:opacity-55 disabled:cursor-not-allowed focus-ring";
  const sizes = { sm: "h-10 px-4 text-[0.95rem]", md: "h-12 px-5", lg: "h-14 px-7 text-[1.05rem]" }[size];
  const variants = {
    primary: "glass-lagoon text-white hover:brightness-110",
    outline: "border border-lagoon/35 text-lagoon-deep bg-white/70 hover:bg-white",
    ghost: "text-lagoon-deep hover:bg-lagoon/10",
    danger: "bg-critico text-white hover:brightness-110",
    success: "bg-mata text-white hover:brightness-110",
  }[variant];
  return <button className={cx(base, sizes, variants, className)} {...props} />;
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cx("glass rounded-3xl p-5 md:p-6", className)}>{children}</div>;
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl md:text-3xl font-bold text-lagoon-deep">{title}</h1>
      {sub ? <p className="text-ink/65 mt-1">{sub}</p> : null}
    </div>
  );
}

export function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <h2 className="text-lg font-bold text-lagoon-deep">{children}</h2>
      {right}
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "lagoon" | "mata" | "atencao" | "alto" | "critico" }) {
  const tones = {
    neutral: "bg-ink/8 text-ink/75",
    lagoon: "bg-lagoon/12 text-lagoon-deep",
    mata: "bg-mata/15 text-mata",
    atencao: "bg-atencao/20 text-ink",
    alto: "bg-alto/20 text-alto",
    critico: "bg-critico/18 text-critico",
  }[tone];
  return <span className={cx("inline-flex items-center rounded-full px-3 py-1 text-[0.8rem] font-semibold", tones)}>{children}</span>;
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-1.5 font-semibold text-[0.95rem] text-lagoon-deep">{label}</span>
      {children}
      {hint && !error ? <span className="block mt-1 text-[0.85rem] text-ink/55">{hint}</span> : null}
      {error ? <span className="block mt-1 text-[0.85rem] font-semibold text-critico">{error}</span> : null}
    </label>
  );
}

export function Spinner() {
  return <span className="inline-block size-5 animate-spin rounded-full border-2 border-lagoon/30 border-t-lagoon" />;
}

export function LoadingBlock({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-8 justify-center text-ink/60">
      <Spinner /> {label}
    </div>
  );
}

export function EmptyState({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-lagoon/25 p-6 text-center">
      <p className="font-semibold text-lagoon-deep">{title}</p>
      {sub ? <p className="text-ink/60 mt-1 text-[0.95rem]">{sub}</p> : null}
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/45" role="dialog" aria-modal="true" aria-label={title}>
      <div className="glass rounded-3xl w-full max-w-lg p-6 bg-white/95 max-h-[85dvh] overflow-auto">
        <h3 className="text-xl font-bold text-lagoon-deep mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  loading,
  onConfirm,
  onCancel,
  children,
}: {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      {message ? <p className="text-ink/75 mb-4">{message}</p> : null}
      {children}
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} disabled={loading}>
          {loading ? <Spinner /> : null} {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export function StatusBadge({ status, map }: { status: string; map: Record<string, string> }) {
  const tone =
    status === "cancelado" || status === "negado" || status === "inativo"
      ? "critico"
      : status === "concluido" || status === "ativo" || status === "aprovado" || status === "confirmado"
        ? "mata"
        : status === "pendente" || status === "aguardando" || status === "solicitado"
          ? "atencao"
          : "lagoon";
  return <Pill tone={tone as never}>{map[status] ?? status}</Pill>;
}
