import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { CityPicker } from "@/components/city-picker";
import { PhoneInput } from "@/components/masked-inputs";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/form";
import { formatPhone } from "@/lib/core/phone";
import { db } from "@/lib/db";
import { SERVICES } from "@/lib/domain";
import { UFS } from "@/lib/places";
import { proPhotoUrl } from "@/lib/pros";
import { openSecret } from "@/lib/secret-box";
import { requirePro } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { addArea, saveProfile, saveWhatsapp } from "../actions";
import { AreaList } from "./area-list";
import { PhotoEditor } from "./photo-editor";

export const metadata: Metadata = { title: "Meu perfil" };

export default async function ProProfilePage() {
  const user = await requirePro();
  const pro = await db.professionalProfile.findUniqueOrThrow({ where: { id: user.pro.id }, include: { areas: { orderBy: { city: "asc" } } } });
  const settings = await getSettings();
  const phone = openSecret(pro.whatsappSealed) ?? "";
  const price = pro.hourlyCents ? (pro.hourlyCents / 100).toFixed(2).replace(".", ",") : "";
  return (
    <div className="space-y-5">
      <PageTitle title="Meu perfil" subtitle="É assim que os clientes vão te conhecer." />
      <Card className="space-y-3">
        <CardTitle>Foto do rosto</CardTitle>
        <PhotoEditor url={proPhotoUrl(pro)} />
      </Card>

      <Card className="space-y-4">
        <CardTitle>Preço e serviços</CardTitle>
        <ActionForm action={saveProfile} className="space-y-4">
          <div className="max-w-xs">
            <Label htmlFor="price">Preço por hora (R$)</Label>
            <Input id="price" name="price" inputMode="decimal" placeholder="25,00" defaultValue={price} required />
            <p className="mt-1 text-xs text-muted">Você define o seu preço. O cliente vê o valor estimado (preço × horas) e paga direto a você.</p>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Serviços que você faz</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <label key={s.slug} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="checkbox" name="services" value={s.slug} defaultChecked={pro.services.includes(s.slug)} className="h-4 w-4 accent-[var(--primary)]" />
                  {s.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <Label htmlFor="bio">Sobre você (opcional)</Label>
            <Textarea id="bio" name="bio" maxLength={600} defaultValue={pro.bio ?? ""} placeholder="Ex.: Trabalho com limpeza há 8 anos, sou caprichosa e pontual." />
            <p className="mt-1 text-xs text-muted">Não coloque telefone, endereço ou redes sociais.</p>
          </div>
          <SubmitButton pendingText="Salvando…">Salvar</SubmitButton>
        </ActionForm>
      </Card>

      <Card className="space-y-4">
        <CardTitle>Municípios onde atende</CardTitle>
        <AreaList areas={pro.areas} />
        {settings.multipleCities && pro.areas.length < settings.maxCities ? (
          <ActionForm action={addArea} className="space-y-3" resetOnOk>
            <CityPicker ufs={UFS} defaultUf={pro.areas[0]?.uf ?? ""} />
            <SubmitButton variant="outline" pendingText="Incluindo…">Incluir município</SubmitButton>
          </ActionForm>
        ) : (
          <p className="text-xs text-muted">Limite de municípios atingido.</p>
        )}
      </Card>

      <Card className="space-y-3">
        <CardTitle>WhatsApp (só a HoraLimp vê)</CardTitle>
        <ActionForm action={saveWhatsapp} className="flex flex-wrap items-end gap-3">
          <div className="min-w-56 flex-1">
            <Label htmlFor="whatsapp">Número</Label>
            <PhoneInput name="whatsapp" defaultValue={phone ? formatPhone(phone) : ""} />
          </div>
          <SubmitButton variant="outline" pendingText="Salvando…">Atualizar</SubmitButton>
        </ActionForm>
      </Card>
    </div>
  );
}
