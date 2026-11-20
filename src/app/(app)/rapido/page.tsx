import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageTitle } from "@/components/bits";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { CATEGORIES, isCategory, quickHourPrice, quickPrice } from "@/lib/domain";
import { getSettings } from "@/lib/settings";
import { UFS } from "@/lib/places";
import { savedAddresses } from "@/lib/saved-addresses";
import { requireUser } from "@/lib/session";
import { clientBlock } from "@/lib/subscription";
import { QuickForm } from "./quick-form";

export const metadata: Metadata = { title: "Contrate rápido" };

export default async function QuickPage({ searchParams }: { searchParams: Promise<{ servico?: string }> }) {
  const user = await requireUser("/rapido");
  if (user.role === "ADMIN") redirect("/admin");
  const { servico = "" } = await searchParams;
  const searching = await db.booking.findFirst({ where: { clientId: user.id, mode: "QUICK", status: "SEARCHING" }, select: { id: true } });
  if (searching) redirect(`/pedidos/${searching.id}`);
  const block = await clientBlock(user.cpfHash);
  const { quickPrices, quickHourPrices } = await getSettings();
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <PageTitle title="⚡ Contrate rápido" subtitle="Precisa de alguém agora? Valor fixo por profissão. Chamamos quem está perto e o primeiro que aceitar chega em até 2 horas." />
      {block ? (
        <Card className="space-y-2 border-danger/40 bg-danger/5">
          <p className="font-semibold">Sua conta está sem contratar até {block.until.toLocaleDateString("pt-BR")}</p>
          <p className="text-sm">{block.reason ?? "Um prestador foi até o endereço e você não estava."}</p>
          <Link href="/desbloquear" className={buttonClass("primary")}>Liberar agora por R$ 2,85</Link>
        </Card>
      ) : (
        <QuickForm saved={await savedAddresses(user.id)} ufs={UFS} initialCategory={isCategory(servico) ? servico : ""} prices={Object.fromEntries(CATEGORIES.map((c) => [c.slug, quickPrice(c.slug, quickPrices)!]))} hourPrices={Object.fromEntries(CATEGORIES.flatMap((c) => { const h = quickHourPrice(c.slug, quickPrices, quickHourPrices); return h != null && c.unit !== "HORA" ? [[c.slug, h]] : []; }))} />
      )}
    </div>
  );
}
