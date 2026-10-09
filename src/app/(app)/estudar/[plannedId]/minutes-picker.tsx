"use client";
import { cn } from "@/lib/utils";

/** Botões "5 min, 10 min, ..." para o aluno escolher quanto tempo tem agora. */
export function MinutesPicker({ options, value, onChange }: { options: readonly number[]; value: number; onChange: (m: number) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="Duração da sessão">
      {options.map((m) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={value === m}
          onClick={() => onChange(m)}
          className={cn("rounded-lg border px-2 py-3 text-center font-semibold", value === m ? "border-primary bg-primary/15 text-primary" : "border-border hover:bg-surface-2")}
        >
          {m} min
        </button>
      ))}
    </div>
  );
}
