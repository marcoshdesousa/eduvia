"use client";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/components/action-form";
import type { ComponentProps } from "react";

/** Botão que chama uma server action (sem formulário) e mostra o resultado embaixo. */
export function ActionButton({ action, confirm, children, quiet, ...props }: Omit<ComponentProps<typeof Button>, "onClick" | "action"> & { action: () => Promise<ActionResult>; confirm?: string; quiet?: boolean }) {
  const [pending, run] = useTransition();
  const [res, setRes] = useState<ActionResult>(null);
  return (
    <span className="inline-flex flex-col gap-1">
      <Button
        type="button"
        {...props}
        disabled={pending || props.disabled}
        onClick={() => {
          if (confirm && !window.confirm(confirm)) return;
          run(async () => setRes(await action()));
        }}
      >
        {pending && <Loader2 size={16} className="animate-spin" />} {children}
      </Button>
      {res?.error && <span role="alert" className="text-xs text-danger">{res.error}</span>}
      {res?.ok && !quiet && <span role="status" className="text-xs text-success">{res.ok}</span>}
    </span>
  );
}

/** Interruptor ligado/desligado ligado a uma server action. */
export function ActionSwitch({ on, action, label, hint }: { on: boolean; action: (v: boolean) => Promise<ActionResult>; label: string; hint?: string }) {
  const [pending, run] = useTransition();
  const [value, setValue] = useState(on);
  const [res, setRes] = useState<ActionResult>(null);
  return (
    <div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        disabled={pending}
        onClick={() =>
          run(async () => {
            const r = await action(!value);
            setRes(r);
            if (!r?.error) setValue(!value);
          })
        }
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="block font-semibold">{label}</span>
          {hint && <span className="block text-xs text-muted">{hint}</span>}
        </span>
        <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${value ? "bg-primary" : "bg-border"}`}>
          <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${value ? "left-[1.4rem]" : "left-0.5"}`} />
          {pending && <Loader2 size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-foreground" />}
        </span>
      </button>
      {res?.error && <p role="alert" className="mt-1 text-xs text-danger">{res.error}</p>}
      {res?.ok && <p role="status" className="mt-1 text-xs text-success">{res.ok}</p>}
    </div>
  );
}
