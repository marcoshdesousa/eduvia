"use client";
import { useState, useTransition } from "react";
import { Loader2, Pause, Play, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form";
import { setPaused, submitForReview } from "./actions";

export function PauseToggle({ paused }: { paused: boolean }) {
  const [pending, start] = useTransition();
  return (
    <Button type="button" variant={paused ? "primary" : "outline"} size="sm" disabled={pending} onClick={() => start(() => setPaused(!paused))}>
      {pending ? <Loader2 size={16} className="animate-spin" /> : paused ? <Play size={16} /> : <Pause size={16} />}
      {paused ? "Voltar a receber pedidos" : "Pausar novos pedidos"}
    </Button>
  );
}

export function SubmitReview({ missing }: { missing: string[] }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ error?: string; ok?: string } | null>(null);
  return (
    <div className="space-y-2">
      {missing.length > 0 && <p className="text-sm text-muted">Para enviar, falta: {missing.join(", ")}.</p>}
      <Button type="button" disabled={pending || missing.length > 0} onClick={() => start(async () => setMsg(await submitForReview()))}>
        {pending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Enviar perfil para verificação
      </Button>
      <FormError message={msg?.error} />
      {msg?.ok && <p className="text-sm text-success">{msg.ok}</p>}
    </div>
  );
}
