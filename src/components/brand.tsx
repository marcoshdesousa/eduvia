import Link from "next/link";
import { cn } from "@/lib/utils";

/** Ícone do Diária Paga: calendário (a diária) com o "visto" de serviço feito e uma moeda (pago). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-9 w-9 shrink-0", className)} aria-hidden="true">
      <defs><linearGradient id="dpg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#00b37a" /><stop offset="1" stopColor="#0a8fb0" /></linearGradient></defs>
      <rect width="64" height="64" rx="16" fill="url(#dpg)" />
      <rect x="13" y="17" width="32" height="30" rx="6" fill="#fff" />
      <rect x="13" y="17" width="32" height="9" rx="4" fill="#bdf0d9" />
      <path d="M20 13v8M38 13v8" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M21 36l5 5 10-11" fill="none" stroke="#0a7d55" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="46" r="11" fill="#fbbf24" stroke="#0a7d55" strokeWidth="3" />
      <text x="48" y="51" textAnchor="middle" fontSize="14" fontWeight="800" fill="#7a4b00" fontFamily="Arial, sans-serif">$</text>
    </svg>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2", className)} aria-label="Diária Paga — início">
      <LogoMark />
      <span className="font-display text-xl font-extrabold tracking-tight text-brand-ink">
        Diária<span className="dp-grad-text">Paga</span>
      </span>
    </Link>
  );
}
