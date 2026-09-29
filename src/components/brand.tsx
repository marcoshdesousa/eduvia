import Link from "next/link";
import { cn } from "@/lib/utils";

/** Símbolo do Eduvia: um livro aberto de onde sai um caminho ("via") até a estrela (o objetivo). */
export function LogoMark({ className }: { className?: string }) {
  // fundo em CSS (gradiente de SVG com id repetido some quando há outra logo escondida na página)
  return (
    <span className={cn("inline-block size-8 shrink-0 overflow-hidden rounded-[28%] bg-gradient-to-br from-[#6d5dfc] to-[#3b82f6]", className)} aria-hidden="true">
    <svg viewBox="0 0 64 64" className="size-full">
      <path d="M8 41.5 Q20 36.5 31 42 V52.5 Q20 47 8 52 Z" fill="#fff" />
      <path d="M56 41.5 Q44 36.5 33 42 V52.5 Q44 47 56 52 Z" fill="#e0e7ff" />
      <g fill="#5eead4">
        <circle cx="32" cy="36.5" r="2.5" />
        <circle cx="27.6" cy="30.8" r="2.4" />
        <circle cx="28.8" cy="24.2" r="2.3" />
        <circle cx="34" cy="20" r="2.2" />
      </g>
      <path d="M43.5 7.5 l2.4 5.4 5.4 2.4 -5.4 2.4 -2.4 5.4 -2.4 -5.4 -5.4 -2.4 5.4 -2.4z" fill="#fff" />
    </svg>
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-extrabold tracking-tight", className)}>
      edu<span className="text-primary">via</span>
    </span>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 text-xl", className)} aria-label="Eduvia — início">
      <LogoMark />
      <Wordmark />
    </Link>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: React.ReactNode; children: React.ReactNode }) {
  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-10">
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(60%_70%_at_50%_0%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent)]" />
      <div className="mb-8">
        <Logo />
      </div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      <div className="mt-6">{children}</div>
      <p className="mt-10 text-center text-xs text-muted">
        <Link href="/" className="hover:text-foreground">Início</Link> · <Link href="/termos" className="hover:text-foreground">Termos</Link> ·{" "}
        <Link href="/privacidade" className="hover:text-foreground">Privacidade</Link>
      </p>
    </main>
  );
}
