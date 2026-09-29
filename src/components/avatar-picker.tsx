"use client";
import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { AVATAR_CATEGORIES, AVATARS, canUseAvatar, type AvatarCategory } from "@/lib/avatars";
import { cn } from "@/lib/utils";

/** Escolha da foto de perfil (campo "avatar" do formulário). No plano Grátis, só 1 feminino + 1 masculino por categoria. */
export function AvatarPicker({ current, subscriber }: { current: string | null; subscriber: boolean }) {
  const [value, setValue] = useState(current ?? "");
  const [tab, setTab] = useState<AvatarCategory>(AVATARS.find((a) => a.id === current)?.category ?? "animais");
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">Foto de perfil</legend>
      <input type="hidden" name="avatar" value={value} />
      <div className="mb-3 flex gap-1 overflow-x-auto" role="tablist" aria-label="Categorias de personagens">
        {AVATAR_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={tab === c.id}
            onClick={() => setTab(c.id)}
            className={cn("shrink-0 rounded-full px-3 py-1 text-sm font-medium", tab === c.id ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted hover:text-foreground")}
          >
            {c.label}
          </button>
        ))}
      </div>
      {(["F", "M"] as const).map((g) => (
        <div key={g} className="mb-2">
          <p className="mb-1 text-xs text-muted">{g === "F" ? "Femininos" : "Masculinos"}</p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={g === "F" ? "Femininos" : "Masculinos"}>
            {AVATARS.filter((a) => a.category === tab && a.gender === g).map((a) => {
              const locked = !canUseAvatar(a.id, subscriber);
              return (
                <button
                  key={a.id}
                  type="button"
                  role="radio"
                  aria-checked={value === a.id}
                  aria-disabled={locked}
                  aria-label={locked ? `${a.label} (só para assinantes)` : a.label}
                  title={locked ? `${a.label}: assine para liberar` : a.label}
                  onClick={() => !locked && setValue(a.id)}
                  className={cn("relative rounded-full p-0.5 ring-2 transition", value === a.id ? "ring-primary" : "ring-transparent hover:ring-border", locked && "cursor-not-allowed")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/avatars/${a.id}.svg`} alt="" className={cn("size-14 rounded-full", locked && "opacity-40 grayscale")} />
                  {locked && (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid size-6 place-items-center rounded-full bg-background/90 text-foreground shadow"><Lock size={13} /></span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!subscriber && (
        <p className="mt-2 text-xs text-muted">
          No plano Grátis você usa 1 personagem feminino e 1 masculino de cada categoria.{" "}
          <Link href="/assinatura" className="font-medium text-primary">Assine para liberar todos</Link>.
        </p>
      )}
    </fieldset>
  );
}
