import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { ServiceFields } from "@/components/service-fields";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { UNIT_LABEL, category, formatBRL } from "@/lib/domain";
import { requireProvider } from "@/lib/session";
import { BackLink } from "../back-link";
import { addServiceAction, deleteServiceAction, updateServiceAction } from "../actions";

export const metadata: Metadata = { title: "Serviços e preços" };

const brl = (c: number) => (c / 100).toFixed(2).replace(".", ",");

export default async function ServicesPage() {
  const user = await requireProvider();
  const services = await db.providerService.findMany({ where: { proId: user.provider.id }, orderBy: { createdAt: "asc" } });
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink />
      <PageTitle title="Serviços e preços" subtitle="O valor que você cobra aparece na busca e nos pedidos com data marcada. No Contrate rápido o valor é fixo por profissão (veja no painel)." />
      {services.map((s) => (
        <Card key={s.id} className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>{category(s.category)?.emoji} {category(s.category)?.label ?? s.category}</CardTitle>
              <p className="text-sm text-muted">{formatBRL(s.priceCents)} {UNIT_LABEL[s.unit].per}</p>
            </div>
            <ActionButton action={deleteServiceAction.bind(null, s.id)} variant="ghost" size="sm" confirm="Remover este serviço?" aria-label="Remover serviço">
              <Trash2 size={16} />
            </ActionButton>
          </div>
          <details>
            <summary className="cursor-pointer text-sm text-primary">Editar</summary>
            <ActionForm action={updateServiceAction} className="mt-3 space-y-3">
              <input type="hidden" name="id" value={s.id} />
              <ServiceFields lockCategory defaults={{ category: s.category, price: brl(s.priceCents), unit: s.unit, description: s.description ?? "" }} />
              <SubmitButton className="w-full" pendingText="Salvando…">Salvar</SubmitButton>
            </ActionForm>
          </details>
        </Card>
      ))}
      <Card className="space-y-3">
        <CardTitle>Incluir serviço</CardTitle>
        <ActionForm action={addServiceAction} resetOnOk className="space-y-3">
          <ServiceFields exclude={services.map((s) => s.category)} />
          <SubmitButton className="w-full" pendingText="Incluindo…">Incluir serviço</SubmitButton>
        </ActionForm>
      </Card>
    </div>
  );
}
