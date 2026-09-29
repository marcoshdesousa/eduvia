"use client";
import { useState } from "react";
import { AVATARS } from "@/lib/avatars";
import { cn } from "@/lib/utils";

/** Escolha da foto de perfil (campo "avatar" do formulário). */
export function AvatarPicker({ current }: { current: string | null }) {
  const [value, setValue] = useState(current ?? "");
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">Foto de perfil</legend>
      <input type="hidden" name="avatar" value={value} />
      {(["Meninas", "Meninos"] as const).map((g) => (
        <div key={g} className="mb-2">
          <p className="mb-1 text-xs text-muted">{g}</p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Personagens: ${g}`}>
            {AVATARS.filter((a) => a.group === g).map((a) => (
              <button
                key={a.id}
                type="button"
                role="radio"
                aria-checked={value === a.id}
                aria-label={a.label}
                title={a.label}
                onClick={() => setValue(a.id)}
                className={cn("rounded-full p-0.5 ring-2 transition", value === a.id ? "ring-primary" : "ring-transparent hover:ring-border")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/avatars/${a.id}.svg`} alt="" className="size-14 rounded-full" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </fieldset>
  );
}
