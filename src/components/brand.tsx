import Link from "next/link";
import { cn } from "@/lib/utils";

/** Símbolo do Eduvia: um "e" que vira caminho ("via"), com o ponto de chegada. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("size-8 shrink-0", className)} aria-hidden="true">
      <defs>
        <linearGradient id="eduvia-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6d5dfc" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#eduvia-mark)" />
      <path d="M18.5 33h26.5a13.5 13.5 0 1 0-3.9 9.6" fill="none" stroke="#fff" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48.6" cy="47.2" r="4" fill="#5eead4" />
    </svg>
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
