"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { createEnemExamAction } from "@/app/actions/enem";
import { Button, buttonClass } from "@/components/ui/button";

/** Botão que monta o simulado ENEM escolhido e abre a prova. */
export function StartEnemExam({ kind, label, variant = "primary" }: { kind: string; label: string; variant?: "primary" | "outline" }) {
  const [error, setError] = useState<{ text: string; upgrade?: boolean } | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="space-y-1">
      <Button
        variant={variant}
        className="w-full"
        disabled={pending}
        aria-label={label}
        onClick={() =>
          start(async () => {
            setError(null);
            const r = await createEnemExamAction(kind);
            if (r?.error) setError({ text: r.error, upgrade: r.upgrade });
          })
        }
      >
        {pending ? "Montando a prova..." : label}
      </Button>
      {error && (
        <p className="text-xs text-danger">
          {error.text} {error.upgrade && <Link href="/assinatura" className={buttonClass("ghost", "sm")}>Ver planos</Link>}
        </p>
      )}
    </div>
  );
}
