import type { Metadata } from "next";
import { PageTitle } from "@/components/bits";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireProvider } from "@/lib/session";
import { BackLink } from "../../back-link";
import { NewProfileForm } from "./new-profile-form";

export const metadata: Metadata = { title: "Novo perfil" };

export default async function NewProfilePage() {
  const user = await requireProvider();
  const mine = await db.providerService.findMany({ where: { proId: user.provider.id }, select: { category: true } });
  const places = await db.providerPlace.count({ where: { proId: user.provider.id } });
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink href="/painel/perfil" label="Meu perfil" />
      <PageTitle title="Novo perfil" subtitle={mine.length ? "Mais uma profissão? Crie um perfil para ela. Agenda, mensagens e financeiro continuam os mesmos." : "Crie o seu primeiro perfil: a profissão, o seu valor e uma foto."} />
      <Card>
        <NewProfileForm exclude={mine.map((m) => m.category)} needPlace={!places} />
      </Card>
    </div>
  );
}
