"use client";
import { useState } from "react";
import { Field, Input } from "@/components/ui/form";
import { cn, formatMinutes } from "@/lib/utils";

const PRESETS = [15, 30, 45, 60, 90, 120, 180, 240];
const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function AgendaFields({
  defaults = { dailyMinutes: 30, studyDays: [1, 2, 3, 4, 5], studyTime: "19:00", examDate: "" },
  examHint,
}: {
  defaults?: { dailyMinutes: number; studyDays: number[]; studyTime: string; examDate: string };
  examHint?: string;
}) {
  const [minutes, setMinutes] = useState(defaults.dailyMinutes);
  const [days, setDays] = useState<number[]>(defaults.studyDays);
  const toggle = (d: number) => setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()));
  return (
    <div className="space-y-5">
      <Field label="Quanto tempo por dia você tem para estudar?" hint={`${formatMinutes(minutes)} por dia · ${formatMinutes(minutes * days.length)} por semana`}>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setMinutes(p)}
              className={cn("rounded-lg border px-3 py-1.5 text-sm", minutes === p ? "border-primary bg-primary/15 text-primary" : "border-border hover:bg-surface-2")}
            >
              {formatMinutes(p)}
            </button>
          ))}
          <Input
            type="number"
            name="dailyMinutes"
            min={5}
            max={720}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-24"
            aria-label="Minutos por dia"
          />
        </div>
      </Field>
      <Field label="Em quais dias da semana?">
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d, i) => (
            <label key={d} className={cn("cursor-pointer rounded-lg border px-3 py-1.5 text-sm select-none", days.includes(i) ? "border-primary bg-primary/15 text-primary" : "border-border hover:bg-surface-2")}>
              <input type="checkbox" name="studyDays" value={i} checked={days.includes(i)} onChange={() => toggle(i)} className="sr-only" />
              {d}
            </label>
          ))}
        </div>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Horário do lembrete" htmlFor="studyTime" hint="Enviamos um lembrete nesse horário nos dias de estudo.">
          <Input id="studyTime" name="studyTime" type="time" defaultValue={defaults.studyTime} required />
        </Field>
        <Field label="Data da prova (opcional)" htmlFor="examDate" hint={examHint ?? "Com a data, o plano distribui o conteúdo até lá e avisa se o tempo não for suficiente."}>
          <Input id="examDate" name="examDate" type="date" defaultValue={defaults.examDate} min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)} />
        </Field>
      </div>
    </div>
  );
}
