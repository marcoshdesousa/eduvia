import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft, ChevronRight, FileDown, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";
import { formatBRL } from "@/lib/domain";
import { monthKey, monthLabel, monthRange, movements, providerFinance } from "@/lib/finance";
import { requireProvider } from "@/lib/session";
import { cn } from "@/lib/utils";
import { addFinanceEntryAction, deleteFinanceEntryAction } from "../actions";

export const metadata: Metadata = { title: "Gestão financeira" };

const shift = (key: string, n: number) => {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 15));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

export default async function FinancePage({ searchParams }: { searchParams: Promise<{ mes?: string }> }) {
  const user = await requireProvider();
  const now = new Date();
  const cur = monthKey(now);
  const { mes } = await searchParams;
  const key = mes && /^\d{4}-\d{2}$/.test(mes) && mes <= cur ? mes : cur;
  const { start, end } = monthRange(key);
  const [f, list] = await Promise.all([providerFinance(user.provider.id, now), movements(user.provider.id, start, end)]);
  const income = list.filter((m) => m.kind === "IN").reduce((a, m) => a + m.cents, 0);
  const expense = list.filter((m) => m.kind === "OUT").reduce((a, m) => a + m.cents, 0);
  const max = Math.max(1, ...f.months.flatMap((m) => [m.in, m.out]));
  const today = now.toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <PageTitle title="Gestão financeira" subtitle="Os serviços concluídos entram sozinhos. Lance também o que entrou e saiu por fora." />
      <div className="grid grid-cols-3 gap-2">
        {[{ t: "Esta semana", v: f.week }, { t: "Este mês", v: f.month }, { t: "30 dias", v: f.last30 }].map((x) => (
          <Card key={x.t} className="p-3">
            <p className="text-xs text-muted">{x.t}</p>
            <p className="text-lg font-extrabold">{formatBRL(x.v.cents)}</p>
            <p className="text-xs text-muted">{x.v.count} serviço(s)</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardTitle>Últimos 6 meses</CardTitle>
        <div className="mt-4 flex h-40 items-end gap-2" role="img" aria-label="Entradas e saídas por mês">
          {f.months.map((m) => (
            <Link key={m.key} href={`/painel/financeiro?mes=${m.key}`} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div className="flex h-full w-full items-end justify-center gap-0.5">
                <div className="w-1/2 rounded-t bg-primary" style={{ height: `${Math.max(m.in ? 3 : 1, (m.in / max) * 100)}%`, opacity: m.in ? 1 : 0.25 }} title={`Entradas ${formatBRL(m.in)}`} />
                <div className="w-1/2 rounded-t bg-danger/70" style={{ height: `${Math.max(m.out ? 3 : 1, (m.out / max) * 100)}%`, opacity: m.out ? 1 : 0.25 }} title={`Saídas ${formatBRL(m.out)}`} />
              </div>
              <span className={cn("text-xs capitalize", m.key === key && "font-bold text-primary")}>{m.label}</span>
            </Link>
          ))}
        </div>
        <p className="mt-2 flex gap-4 text-xs text-muted"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Entradas</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-danger/70" /> Saídas</span></p>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <Link href={`/painel/financeiro?mes=${shift(key, -1)}`} className={buttonClass("ghost", "sm")} aria-label="Mês anterior"><ChevronLeft size={18} /></Link>
          <p className="font-bold capitalize">{monthLabel(key)}</p>
          {key < cur ? <Link href={`/painel/financeiro?mes=${shift(key, 1)}`} className={buttonClass("ghost", "sm")} aria-label="Próximo mês"><ChevronRight size={18} /></Link> : <span className="w-9" />}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-xl bg-primary/10 p-2"><p className="text-xs text-muted">Entradas</p><p className="font-bold text-primary">{formatBRL(income)}</p></div>
          <div className="rounded-xl bg-danger/10 p-2"><p className="text-xs text-muted">Saídas</p><p className="font-bold text-danger">{formatBRL(expense)}</p></div>
          <div className="rounded-xl bg-surface-2 p-2"><p className="text-xs text-muted">Saldo</p><p className="font-bold">{formatBRL(income - expense)}</p></div>
        </div>
        <a href={`/api/financeiro/relatorio?mes=${key}`} className={buttonClass("outline", "md", "w-full")}><FileDown size={16} /> Baixar relatório do mês (PDF)</a>
        <ul className="divide-y divide-border text-sm">
          {list.map((m) => (
            <li key={m.id} className="flex items-center gap-2 py-2">
              <span className="w-12 shrink-0 text-xs text-muted">{m.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" })}</span>
              <span className="min-w-0 flex-1 truncate">{m.description}</span>
              <strong className={m.kind === "IN" ? "text-primary" : "text-danger"}>{m.kind === "IN" ? "+" : "−"} {formatBRL(m.cents)}</strong>
              {!m.auto && <ActionButton action={deleteFinanceEntryAction.bind(null, m.id)} variant="ghost" size="sm" confirm="Apagar este lançamento?" aria-label="Apagar" quiet><Trash2 size={14} /></ActionButton>}
            </li>
          ))}
          {!list.length && <li className="py-3 text-center text-muted">Nenhum movimento neste mês.</li>}
        </ul>
      </Card>

      <Card className="space-y-3">
        <CardTitle>Lançar entrada ou saída</CardTitle>
        <ActionForm action={addFinanceEntryAction} resetOnOk className="space-y-3">
          <div className="grid grid-cols-2 rounded-xl bg-surface-2 p-1 text-sm font-semibold">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2 has-[:checked]:bg-surface has-[:checked]:text-primary has-[:checked]:shadow-sm"><input type="radio" name="kind" value="IN" defaultChecked className="sr-only" /> + Entrada</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2 has-[:checked]:bg-surface has-[:checked]:text-danger has-[:checked]:shadow-sm"><input type="radio" name="kind" value="OUT" className="sr-only" /> − Saída</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input id="amount" name="amount" inputMode="decimal" placeholder="50,00" required />
            </div>
            <div>
              <Label htmlFor="fdate">Data</Label>
              <Input id="fdate" name="date" type="date" max={today} defaultValue={today} required />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" name="description" maxLength={120} placeholder="Ex.: material, combustível, serviço por fora" required />
          </div>
          <SubmitButton className="w-full" pendingText="Lançando…">Lançar</SubmitButton>
        </ActionForm>
      </Card>
    </div>
  );
}
