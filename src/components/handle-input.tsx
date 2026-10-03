"use client";
import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/form";

/** Campo de @ com verificação de disponibilidade em tempo real. */
export function HandleInput({ name = "handle", defaultValue = "", onValidChange }: { name?: string; defaultValue?: string; onValidChange?: (ok: boolean) => void }) {
  const [value, setValue] = useState(defaultValue);
  const [state, setState] = useState<{ status: "idle" | "checking" | "ok" | "error"; reason?: string }>({ status: "idle" });

  useEffect(() => {
    if (!value) {
      setState({ status: "idle" });
      onValidChange?.(false);
      return;
    }
    setState({ status: "checking" });
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/handle?h=${encodeURIComponent(value)}`, { signal: ctrl.signal });
        const json = (await res.json()) as { ok: boolean; reason?: string };
        setState(json.ok ? { status: "ok" } : { status: "error", reason: json.reason });
        onValidChange?.(json.ok);
      } catch {
        /* cancelado */
      }
    }, 350);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">@</span>
        <Input
          id={name}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase().replace(/\s/g, ""))}
          className="pl-7 pr-9"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={30}
          required
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {state.status === "checking" && <Loader2 size={16} className="animate-spin text-muted" />}
          {state.status === "ok" && <Check size={16} className="text-success" />}
          {state.status === "error" && <X size={16} className="text-danger" />}
        </span>
      </div>
      <p className={`mt-1 text-xs ${state.status === "error" ? "text-danger" : state.status === "ok" ? "text-success" : "text-muted"}`}>
        {state.status === "error" ? state.reason : state.status === "ok" ? "Disponível!" : "Letras minúsculas, números, ponto e underline."}
      </p>
    </div>
  );
}
