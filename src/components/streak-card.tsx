import Link from "next/link";
import { cn } from "@/lib/utils";
import { addDays, keyFromDay, weekdayShort } from "@/lib/core/dates";
import { buttonClass } from "@/components/ui/button";
import { StreakIcon } from "@/components/streak-icon";

/**
 * Sequência no estilo Duolingo: chama acesa quando o aluno já estudou hoje,
 * apagada (cinza) quando ainda falta estudar para manter a sequência.
 */
export function StreakCard({
  streak,
  best,
  day,
  studied,
  href,
  minutesToday = 0,
  goal = 5,
}: {
  streak: number;
  best: number;
  day: Date;
  studied: Set<string>;
  href: string;
  minutesToday?: number;
  goal?: number;
}) {
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
        <StreakIcon lit={lit} className={cn("h-16 w-14", lit && "streak-flame")} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className={cn("font-display text-4xl font-extrabold tabular-nums", lit ? "text-[#f97316]" : "text-muted")}>{streak}</span>
            <span className="text-sm font-semibold">{streak === 1 ? "dia seguido" : "dias seguidos"}</span>
          </div>
          <p className="text-sm text-muted">
            {lit
              ? "Sequência garantida! Você já estudou hoje. Volte amanhã para continuar."
              : streak > 0
                ? `Estude ${goal} minutos hoje para não perder a sua sequência!`
                : `Comece uma sequência hoje: basta estudar ${goal} minutos.`}
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
                {on ? <StreakIcon mono className="h-4 w-4" /> : "·"}
              </span>
            </li>
          );
        })}
      </ol>
      {!lit && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>Estudo de hoje</span>
            <span>{Math.min(minutesToday, goal)} de {goal} min</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(minutesToday, goal)}>
            <div className="h-full rounded-full bg-[#f97316]" style={{ width: `${Math.min(100, (minutesToday / goal) * 100)}%` }} />
          </div>
        </div>
      )}
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-muted">Recorde: {best} {best === 1 ? "dia" : "dias"}</span>
        {!lit && <Link href={href} className={buttonClass("primary", "sm")}>Estudar agora</Link>}
      </div>
    </section>
  );
}
