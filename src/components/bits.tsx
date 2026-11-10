import { Star } from "lucide-react";
import type { BookingStatus, ProStatus } from "@/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { BOOKING_LABEL, BOOKING_TONE, PRO_STATUS_LABEL } from "@/lib/domain";
import { cn } from "@/lib/utils";

export function ProPhoto({ url, name, size = 64, className }: { url: string | null; name: string; size?: number; className?: string }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={`Foto de ${name.split(" ")[0]}`} width={size} height={size} className={cn("shrink-0 rounded-full object-cover", className)} style={{ width: size, height: size }} loading="lazy" />
  ) : (
    <div className={cn("flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary", className)} style={{ width: size, height: size, fontSize: size / 2.8 }} aria-hidden>
      {initials}
    </div>
  );
}

export function Rating({ value, count, className }: { value: number | null; count: number; className?: string }) {
  if (value == null) return <Badge tone="primary" className={className}>Novo na HoraLimp</Badge>;
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)} aria-label={`Nota ${value.toFixed(1).replace(".", ",")} de 5, ${count} avaliações`}>
      <Star size={15} className="fill-amber-400 text-amber-400" />
      <strong>{value.toFixed(1).replace(".", ",")}</strong>
      <span className="text-muted">({count})</span>
    </span>
  );
}

export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= value ? "fill-amber-400 text-amber-400" : "text-border"} />
      ))}
    </span>
  );
}

export function BookingBadge({ status }: { status: BookingStatus }) {
  return <Badge tone={BOOKING_TONE[status]}>{BOOKING_LABEL[status]}</Badge>;
}

const PRO_TONE: Record<ProStatus, "neutral" | "warning" | "success" | "danger"> = { INCOMPLETE: "neutral", PENDING: "warning", APPROVED: "success", REJECTED: "danger", SUSPENDED: "danger" };
export function ProStatusBadge({ status }: { status: ProStatus }) {
  return <Badge tone={PRO_TONE[status]}>{PRO_STATUS_LABEL[status]}</Badge>;
}

export function Empty({ icon, title, children }: { icon?: React.ReactNode; title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
      {icon && <div className="mb-2 flex justify-center text-muted">{icon}</div>}
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-1 text-sm text-muted">{children}</div>}
    </div>
  );
}

export function PageTitle({ title, subtitle, children }: { title: string; subtitle?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-brand-ink">{title}</h1>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
