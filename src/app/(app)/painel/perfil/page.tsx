import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/form";
import { db } from "@/lib/db";
import { providerPhotoUrl } from "@/lib/providers";
import { requireProvider } from "@/lib/session";
import { BackLink } from "../back-link";
import { saveProfileAction } from "../actions";
import { PhotoEditor } from "./photo-editor";

export const metadata: Metadata = { title: "Meu perfil" };

export default async function ProfilePage() {
  const user = await requireProvider();
  const pro = await db.providerProfile.findUniqueOrThrow({ where: { id: user.provider.id } });
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink />
      <PageTitle title="Meu perfil" subtitle="É o que os clientes veem antes de contratar." />
      <Card className="space-y-3">
        <CardTitle>Foto do rosto</CardTitle>
        <PhotoEditor url={providerPhotoUrl(pro)} />
      </Card>
      <Card>
        <ActionForm action={saveProfileAction} className="space-y-4">
          <div>
            <Label htmlFor="bio">Sobre você</Label>
            <Textarea id="bio" name="bio" rows={5} maxLength={700} defaultValue={pro.bio ?? ""} placeholder="Sua experiência, o que você faz de melhor, como trabalha…" />
            <p className="mt-1 text-xs text-muted">Não é permitido colocar telefone ou WhatsApp. Todo contato é pelo chat do app.</p>
          </div>
          <div>
            <Label htmlFor="instagram">Instagram (opcional)</Label>
            <Input id="instagram" name="instagram" defaultValue={pro.instagram ? `@${pro.instagram}` : ""} placeholder="@seu.perfil" maxLength={60} />
          </div>
          <SubmitButton className="w-full" pendingText="Salvando…">Salvar</SubmitButton>
        </ActionForm>
      </Card>
    </div>
  );
}
