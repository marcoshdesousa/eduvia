import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { formatBRL } from "@/lib/domain";
import { monthKey, monthLabel, monthRange, movements } from "@/lib/finance";
import { buildPdf, type PdfLine } from "@/lib/pdf";
import { workerPaid } from "@/lib/session";

/** Relatório financeiro do mês em PDF (com a marca d'água do Diária Paga). */
export async function GET(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  if (!user.provider) return jsonError("Só para trabalhadores.", 403);
  if (!(await workerPaid(user.provider.id))) return jsonError("Seu plano está vencido.", 402);
  const mes = new URL(req.url).searchParams.get("mes") ?? "";
  const key = /^\d{4}-\d{2}$/.test(mes) ? mes : monthKey(new Date());
  const { start, end } = monthRange(key);
  const list = (await movements(user.provider.id, start, end)).reverse();
  const income = list.filter((m) => m.kind === "IN").reduce((a, m) => a + m.cents, 0);
  const expense = list.filter((m) => m.kind === "OUT").reduce((a, m) => a + m.cents, 0);
  const services = list.filter((m) => m.auto);
  const day = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" });
  const lines: PdfLine[] = [
    { text: user.name, size: 11, bold: true },
    { text: `Mês: ${monthLabel(key)}`, gray: true },
    { text: "", rule: true, gap: 4 },
    { text: "Resumo", size: 13, bold: true, gap: 4 },
    { text: "Entradas", right: formatBRL(income) },
    { text: `  dos quais serviços pelo app (${services.length})`, gray: true, right: formatBRL(services.reduce((a, m) => a + m.cents, 0)) },
    { text: "Saídas", right: `- ${formatBRL(expense)}` },
    { text: "Saldo do mês", bold: true, size: 12, right: formatBRL(income - expense) },
    { text: "", rule: true, gap: 4 },
    { text: "Movimentos", size: 13, bold: true, gap: 4 },
    ...(list.length
      ? list.map((m) => ({ text: `${day(m.date)}   ${m.description.slice(0, 70)}`, right: `${m.kind === "IN" ? "+" : "-"} ${formatBRL(m.cents)}` }))
      : [{ text: "Nenhum movimento neste mês.", gray: true }]),
  ];
  const now = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });
  const pdf = buildPdf("Relatório financeiro", lines, `Diária Paga · relatório gerado em ${now} · os valores dos serviços são os informados pelo trabalhador`);
  return new NextResponse(new Uint8Array(pdf), {
    headers: { "content-type": "application/pdf", "content-disposition": `attachment; filename="diaria-paga-financeiro-${key}.pdf"`, "cache-control": "private, no-store" },
  });
}
