"use client";
import { useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type PlanCard = {
  slug: string;
  name: string;
  week: string;
  month: string;
  features: string[];
  linkWeek: string;
  linkMonth: string;
  current: boolean;
  highlight: boolean;
};

export function PlanCards({ plans }: { plans: PlanCard[] }) {
  const [interval, setInterval] = useState<"WEEK" | "MONTH">("MONTH");
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1 text-sm" role="tablist" aria-label="Período">
          {(["WEEK", "MONTH"] as const).map((i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={interval === i}
              onClick={() => setInterval(i)}
              className={cn("rounded-md px-4 py-1.5 font-medium", interval === i ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground")}
            >
              {i === "WEEK" ? "Semanal" : "Mensal"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.slug} className={cn("flex flex-col", p.highlight && "border-primary")}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              {p.current ? <Badge tone="success">Seu plano</Badge> : p.highlight ? <Badge tone="primary">Mais escolhido</Badge> : null}
            </div>
            <div className="mt-2 text-3xl font-bold">
              {interval === "WEEK" ? p.week : p.month}
              <span className="text-base font-normal text-muted">/{interval === "WEEK" ? "semana" : "mês"}</span>
            </div>
            <ul className="mt-4 flex-1 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-success" />{f}</li>
              ))}
            </ul>
            <a
              href={interval === "WEEK" ? p.linkWeek : p.linkMonth}
              target="_blank"
              rel="noreferrer"
              className={buttonClass(p.highlight ? "primary" : "outline", "md", "mt-5 w-full")}
            >
              <MessageCircle size={16} /> {p.current ? "Renovar" : "Assinar"} {p.name} pelo WhatsApp
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
