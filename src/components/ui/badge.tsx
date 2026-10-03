import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { MasteryStatus } from "@/generated/prisma/enums";
import { MASTERY_LABEL } from "@/lib/core/spaced";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger";
const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted",
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
};

export function Badge({ tone = "neutral", className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", tones[tone], className)} {...props} />;
}

const MASTERY_TONE: Record<MasteryStatus, Tone> = { SEM_DADOS: "neutral", CRITICO: "danger", EM_DESENVOLVIMENTO: "warning", BOM: "success" };

export function MasteryBadge({ status }: { status: MasteryStatus }) {
  return <Badge tone={MASTERY_TONE[status]}>{MASTERY_LABEL[status]}</Badge>;
}

export function Progress({ value, className, tone = "primary" }: { value: number; className?: string; tone?: "primary" | "success" | "warning" | "danger" }) {
  const color = { primary: "bg-primary", success: "bg-success", warning: "bg-warning", danger: "bg-danger" }[tone];
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-2", className)}>
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} />
    </div>
  );
}
