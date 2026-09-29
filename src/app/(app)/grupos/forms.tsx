"use client";
import { useActionState, useEffect, useState, useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { createGroupAction, inviteAction, respondInviteAction } from "@/app/actions/groups";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input, Textarea } from "@/components/ui/form";

export function CreateGroupForm() {
  const [state, action, pending] = useActionState(createGroupAction, undefined);
  return (
    <ActionForm action={action} className="space-y-3">
      <FormError message={state?.error} />
      <Field label="Nome do grupo" htmlFor="group-name"><Input id="group-name" name="name" required minLength={3} maxLength={60} placeholder="Ex.: Galera do TRT 2026" /></Field>
      <Field label="Descrição (opcional)" htmlFor="group-desc"><Textarea id="group-desc" name="description" rows={2} maxLength={300} /></Field>
      <Button disabled={pending}>{pending ? "Criando..." : "Criar grupo"}</Button>
    </ActionForm>
  );
}

export function InviteResponse({ inviteId }: { inviteId: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-danger">{error}</span>}
      <Button size="sm" disabled={pending} onClick={() => start(async () => { const r = await respondInviteAction(inviteId, true); if (r?.error) setError(r.error); })}>Aceitar</Button>
      <Button size="sm" variant="ghost" disabled={pending} onClick={() => start(async () => { const r = await respondInviteAction(inviteId, false); if (r?.error) setError(r.error); })}>Recusar</Button>
    </div>
  );
}

/** Convite por @ com confirmação em tempo real de que a pessoa existe. */
export function InviteForm({ groupId }: { groupId: string }) {
  const [handle, setHandle] = useState("");
  const [lookup, setLookup] = useState<{ state: "idle" | "checking" | "found" | "missing"; name?: string }>({ state: "idle" });
  const [result, setResult] = useState<{ error?: string; message?: string } | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    const h = handle.replace(/^@/, "");
    if (h.length < 3) return setLookup({ state: "idle" });
    setLookup({ state: "checking" });
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/users/lookup?h=${encodeURIComponent(h)}`, { signal: ctrl.signal });
        const j = (await r.json()) as { exists: boolean; name?: string };
        setLookup(j.exists ? { state: "found", name: j.name } : { state: "missing" });
      } catch {
        /* cancelado */
      }
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [handle]);

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await inviteAction(groupId, handle);
          setResult(r);
          if (r.ok) setHandle("");
        });
      }}
    >
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">@</span>
          <Input value={handle} onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/\s/g, ""))} placeholder="usuario" className="pl-7 pr-9" aria-label="@ de quem convidar" autoCapitalize="none" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {lookup.state === "checking" && <Loader2 size={16} className="animate-spin text-muted" />}
            {lookup.state === "found" && <Check size={16} className="text-success" />}
            {lookup.state === "missing" && <X size={16} className="text-danger" />}
          </span>
        </div>
        <Button disabled={pending || lookup.state !== "found"}>Convidar</Button>
      </div>
      <p className="text-xs text-muted">
        {lookup.state === "found" ? <span className="text-success">{lookup.name}</span> : lookup.state === "missing" ? <span className="text-danger">Ninguém com esse @.</span> : "Digite o @ de quem você quer convidar."}
      </p>
      {result?.error && <p className="text-sm text-danger">{result.error}</p>}
      {result?.message && <p className="text-sm text-success">{result.message}</p>}
    </form>
  );
}
