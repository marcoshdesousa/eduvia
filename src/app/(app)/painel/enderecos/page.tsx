import type { Metadata } from "next";
import { MapPin, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { PlacePicker } from "@/components/place-picker";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";
import { db } from "@/lib/db";
import { MAX_PACKS, MAX_PLACES, PACK_CENTS, PACK_PLACES, formatBRL, placesLimit } from "@/lib/domain";
import { requireProvider } from "@/lib/session";
import { subscriptionActive } from "@/lib/subscription";
import { BackLink } from "../back-link";
import { addPackAction, addPlaceAction, deletePlaceAction, removePackAction } from "../actions";

export const metadata: Metadata = { title: "Endereços" };

export default async function PlacesPage() {
  const user = await requireProvider();
  const [places, sub] = await Promise.all([
    db.providerPlace.findMany({ where: { proId: user.provider.id }, orderBy: { createdAt: "asc" } }),
    db.subscription.findUnique({ where: { proId: user.provider.id } }),
  ]);
  const limit = sub ? placesLimit(sub.plan, sub.packs) : 1;
  const used = places.filter((p) => p.active).length;
  const full = sub?.plan === "FULL" && subscriptionActive(sub);
  const nextPacks = sub ? (sub.nextPacks ?? sub.packs) : 0;
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink />
      <PageTitle title="Endereços de atendimento" subtitle="Os clientes perto de cada endereço encontram você e recebem você no Contrate rápido. Eles veem só o bairro e a distância." />
      <Card className="flex items-center justify-between">
        <span className="text-sm">Usando <strong>{used}</strong> de <strong>{limit}</strong> endereços</span>
        <Badge tone={used >= limit ? "warning" : "success"}>{sub?.plan === "FULL" ? "Completo" : "Básico"}</Badge>
      </Card>

      <div className="space-y-2">
        {places.map((p) => (
          <Card key={p.id} className="flex items-center gap-3 p-3">
            <MapPin size={20} className={p.active ? "text-primary" : "text-muted"} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.label}</p>
              <p className="truncate text-xs text-muted">{[p.district, `${p.city}/${p.uf}`].filter(Boolean).join(" · ")}</p>
              {!p.active && <p className="text-xs text-warning">Guardado: fora do limite do plano</p>}
            </div>
            <ActionButton action={deletePlaceAction.bind(null, p.id)} variant="ghost" size="sm" confirm="Apagar este endereço?" aria-label="Apagar endereço">
              <Trash2 size={16} />
            </ActionButton>
          </Card>
        ))}
      </div>

      {used < limit && places.length < MAX_PLACES ? (
        <Card className="space-y-3">
          <CardTitle>Incluir endereço</CardTitle>
          <ActionForm action={addPlaceAction} className="space-y-3">
            <div>
              <Label htmlFor="label">Nome (só para você)</Label>
              <Input id="label" name="label" placeholder="Ex.: Casa da minha mãe, Centro…" maxLength={40} />
            </div>
            <PlacePicker />
            <SubmitButton className="w-full" pendingText="Salvando…">Salvar endereço</SubmitButton>
          </ActionForm>
        </Card>
      ) : (
        <p className="text-center text-sm text-muted">Você usou todos os endereços do seu plano.</p>
      )}

      <Card className="space-y-3">
        <CardTitle>Mais endereços</CardTitle>
        {full ? (
          <>
            <p className="text-sm text-muted">
              Pacote de <strong>+{PACK_PLACES} endereços</strong> por <strong>{formatBRL(PACK_CENTS)}/mês</strong>. Libera na hora e o valor entra na próxima mensalidade. Máximo de {MAX_PLACES} endereços.
            </p>
            <p className="text-sm">Pacotes agora: <strong>{sub!.packs}</strong>{nextPacks !== sub!.packs && <> · na próxima mensalidade: <strong>{nextPacks}</strong></>}</p>
            <div className="flex flex-wrap gap-2">
              {(sub!.packs < MAX_PACKS || nextPacks < sub!.packs) && (
                <ActionButton action={addPackAction} confirm={`Incluir +${PACK_PLACES} endereços por ${formatBRL(PACK_CENTS)} na próxima mensalidade?`}>
                  + {PACK_PLACES} endereços ({formatBRL(PACK_CENTS)}/mês)
                </ActionButton>
              )}
              {nextPacks > 0 && (
                <ActionButton action={removePackAction} variant="outline" confirm="Tirar um pacote da próxima mensalidade? Os endereços valem até o vencimento.">
                  Tirar um pacote
                </ActionButton>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">Os pacotes de endereços são do plano <strong>Completo</strong> (3 endereços + pacotes de +2 até {MAX_PLACES}).</p>
        )}
      </Card>
    </div>
  );
}
