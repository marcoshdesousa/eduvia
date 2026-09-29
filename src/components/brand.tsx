import Link from "next/link";
import { cn } from "@/lib/utils";

/** Símbolo do Eduvia: a raposa geométrica (esperta, curiosa, rápida para aprender). */
export function LogoMark({ className }: { className?: string }) {
  // fundo em CSS (gradiente de SVG com id repetido some quando há outra logo escondida na página)
  return (
    <span className={cn("inline-block size-8 shrink-0 overflow-hidden rounded-[26%] bg-gradient-to-br from-[#1e293b] to-[#334155]", className)} aria-hidden="true">
      <svg viewBox="0 0 64 64" className="size-full">
        <FoxShape />
      </svg>
    </span>
  );
}

/** A raposa (sem fundo), no espaço 64×64. */
export function FoxShape() {
  return (
    <>
      <path d="M12 12 L24 24 L16 30Z" fill="#fb923c" />
      <path d="M52 12 L40 24 L48 30Z" fill="#f97316" />
      <path d="M16 30 L24 24 L32 26 L40 24 L48 30 L44 42 L32 52 L20 42Z" fill="#fb923c" />
      <path d="M32 26 L40 24 L48 30 L44 42 L32 52Z" fill="#ea580c" />
      <path d="M20 42 L32 52 L26 40Z M44 42 L32 52 L38 40Z" fill="#fff7ed" />
      <path d="M26 40 L32 52 L38 40 L32 44Z" fill="#ffedd5" />
      <path d="M24 34 l4 2 -4 1Z M40 34 l-4 2 4 1Z" fill="#0f172a" />
      <path d="M30 48 L34 48 L32 51Z" fill="#0f172a" />
      <path d="M14 14 L20 22 L17 25Z M50 14 L44 22 L47 25Z" fill="#fff7ed" opacity=".8" />
    </>
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
