import Link from "next/link";
import { cn } from "@/lib/utils";

/** Ícone da HoraLimp: relógio (o tempo do cliente) com um brilho de limpeza. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-9 w-9 shrink-0", className)} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#5b3cc4" />
      <circle cx="29" cy="35" r="17" fill="none" stroke="#fff" strokeWidth="5" />
      <path d="M29 25v11l7 5" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 8l2.6 6.4L59 17l-6.4 2.6L50 26l-2.6-6.4L41 17l6.4-2.6z" fill="#5eead4" />
    </svg>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2", className)} aria-label="HoraLimp — início">
      <LogoMark />
      <span className="font-display text-xl font-extrabold tracking-tight text-brand-ink">
        Hora<span className="text-accent">Limp</span>
      </span>
    </Link>
  );
}
