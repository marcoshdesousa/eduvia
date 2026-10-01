import Link from "next/link";
import { cn } from "@/lib/utils";
import { addDays, keyFromDay, weekdayShort } from "@/lib/core/dates";
import { buttonClass } from "@/components/ui/button";

/**
 * Sequência no estilo Duolingo: foguinho aceso quando o aluno já estudou hoje,
 * apagado (cinza) quando ainda falta estudar para manter a sequência.
 */
export function StreakCard({ streak, best, day, studied, href }: { streak: number; best: number; day: Date; studied: Set<string>; href: string }) {
  const lit = studied.has(keyFromDay(day));
  const days = Array.from({ length: 7 }, (_, i) => addDays(day, i - 6));
  return (
    <section
      aria-label="Sequência de estudo"
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 sm:p-5",
        lit ? "border-[#f97316]/50 bg-gradient-to-br from-[#f97316]/15 via-[#f59e0b]/10 to-transparent" : "border-border bg-surface",
      )}
    >
      <div className="flex items-center gap-4">
        <Flame lit={lit} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className={cn("font-display text-4xl font-extrabold tabular-nums", lit ? "text-[#f97316]" : "text-muted")}>{streak}</span>
            <span className="text-sm font-semibold">{streak === 1 ? "dia seguido" : "dias seguidos"}</span>
          </div>
          <p className="text-sm text-muted">
            {lit
              ? "Foguinho aceso! Você já estudou hoje. Volte amanhã para manter a sequência."
              : streak > 0
                ? "Estude hoje para não perder a sua sequência!"
                : "Comece uma sequência hoje: basta uma sessão de estudo."}
          </p>
        </div>
      </div>
      <ol className="mt-4 grid grid-cols-7 gap-1.5" aria-label="Últimos 7 dias">
        {days.map((d) => {
          const on = studied.has(keyFromDay(d));
          const isToday = keyFromDay(d) === keyFromDay(day);
          return (
            <li key={keyFromDay(d)} className="flex flex-col items-center gap-1">
              <span className={cn("text-[11px] font-medium", isToday ? "text-foreground" : "text-muted")}>{weekdayShort(d.getUTCDay())}</span>
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full text-sm",
                  on ? "bg-[#f97316] text-white" : "bg-surface-2 text-muted",
                  isToday && !on && "ring-2 ring-[#f97316]/60",
                )}
                aria-label={on ? "estudou" : "não estudou"}
              >
                {on ? "🔥" : "·"}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-muted">Recorde: {best} {best === 1 ? "dia" : "dias"}</span>
        {!lit && <Link href={href} className={buttonClass("primary", "sm")}>Estudar agora</Link>}
      </div>
    </section>
  );
}

function Flame({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 48 60" className={cn("h-16 w-14 shrink-0", lit && "streak-flame")} aria-hidden>
      <path
        d="M24 2c3 9 14 15 14 30a14 14 0 0 1-28 0c0-7 3-11 6-14 0 5 2 8 5 9-2-9 1-18 3-25z"
        fill={lit ? "url(#flameOuter)" : "var(--border)"}
      />
      <path d="M24 30c2 5 7 7 7 13a7 7 0 0 1-14 0c0-4 2-6 4-8 0 2 1 4 2 4-1-4 0-7 1-9z" fill={lit ? "#fde68a" : "var(--surface-2)"} />
      <defs>
        <linearGradient id="flameOuter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
  );
}
