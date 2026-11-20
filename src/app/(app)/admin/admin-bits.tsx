"use client";
import { useState, useTransition } from "react";
import { Copy, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { makeResetLink, revealSensitive } from "./actions";

/** Mostra CPF/celular completo só quando o admin clica (fica registrado na auditoria). */
export function Reveal({ userId, what, masked }: { userId: string; what: "cpf" | "phone"; masked: string }) {
  const [value, setValue] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return value ? (
    <span className="font-mono">{value}</span>
  ) : (
    <button type="button" className="inline-flex items-center gap-1 font-mono text-primary hover:underline" disabled={pending} onClick={() => start(async () => setValue(await revealSensitive(userId, what)))}>
      {masked} {pending ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
    </button>
  );
}

export function ResetLinkButton({ userId }: { userId: string }) {
  const [link, setLink] = useState<string | null>(null);
  const [pending, start] = useTransition();
  if (link)
    return (
      <div className="flex w-full items-center gap-2 rounded-lg bg-surface-2 p-2 text-xs">
        <span className="min-w-0 flex-1 truncate font-mono">{link}</span>
        <Button type="button" size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(link)}><Copy size={14} /> Copiar</Button>
      </div>
    );
  return (
    <Button type="button" size="sm" variant="outline" disabled={pending} onClick={() => start(async () => setLink((await makeResetLink(userId)).link ?? null))}>
      {pending && <Loader2 size={14} className="animate-spin" />} Gerar link de nova senha
    </Button>
  );
}

