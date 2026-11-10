"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { ActionForm, type ActionResult } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { Textarea } from "@/components/ui/form";

export function ReviewForm({ action, who }: { action: (p: ActionResult, d: FormData) => Promise<ActionResult>; who: string }) {
  const [stars, setStars] = useState(0);
  return (
    <ActionForm action={action} className="space-y-3">
      <p className="text-sm">Como foi a experiência com {who}?</p>
      <input type="hidden" name="stars" value={stars} />
      <div className="flex gap-1" role="radiogroup" aria-label="Nota de 1 a 5 estrelas">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} type="button" role="radio" aria-checked={stars === i} aria-label={`${i} estrela${i > 1 ? "s" : ""}`} onClick={() => setStars(i)} className="p-1">
            <Star size={30} className={i <= stars ? "fill-amber-400 text-amber-400" : "text-border"} />
          </button>
        ))}
      </div>
      <Textarea name="comment" maxLength={600} placeholder="Comentário (opcional)" className="min-h-16" />
      <SubmitButton disabled={!stars} pendingText="Enviando…">Enviar avaliação</SubmitButton>
    </ActionForm>
  );
}
