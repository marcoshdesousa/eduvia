import { cn } from "@/lib/utils";

/**
 * Ícone da sequência de estudo (desenho próprio do Eduvia, no lugar do emoji de fogo):
 * uma chama arredondada em degradê laranja, com o miolo claro. Apagada fica cinza.
 */
export function StreakIcon({ lit = true, className, mono = false }: { lit?: boolean; className?: string; mono?: boolean }) {
  return (
    <svg viewBox="0 0 24 28" className={cn("inline-block shrink-0", className)} aria-hidden>
      <defs>
        <linearGradient id="eduvia-streak" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#fcd34d" />
          <stop offset="0.55" stopColor="#fb923c" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <path
        d="M12.6 1.2c.9 3.4 3.3 5.6 5.4 8 2 2.3 3.5 4.9 3.5 8.3A9.5 9.5 0 0 1 12 27a9.5 9.5 0 0 1-9.5-9.5c0-3.2 1.4-5.6 3.3-7.6.5-.5 1.3-.2 1.3.5 0 1.6.6 3 1.7 3.8.3-4.7 1.7-9.1 3-12.4.2-.6.7-.8.8-.6Z"
        fill={mono ? "currentColor" : lit ? "url(#eduvia-streak)" : "var(--border)"}
      />
      <path
        d="M12.2 14.5c.6 1.9 2 3 3 4.5.6.9 1 1.8 1 2.9a4.2 4.2 0 0 1-8.4 0c0-1.5.7-2.7 1.6-3.6.3-.3.7-.1.8.3.1.6.4 1.1.8 1.4.1-2 .6-3.8 1.2-5.3Z"
        fill={mono ? "var(--background)" : lit ? "#fef3c7" : "var(--surface-2)"}
        opacity={mono ? 0.35 : 1}
      />
    </svg>
  );
}
