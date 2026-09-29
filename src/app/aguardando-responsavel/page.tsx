import { redirect } from "next/navigation";
import { AuthShell } from "@/components/brand";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { signOutAction } from "@/app/actions/account";
import { ResendForm } from "./resend-form";

export const metadata = { title: "Aguardando autorização" };

export default async function Page() {
  const user = await requireUser();
  if (user.guardianConsentStatus === "GRANTED" || user.guardianConsentStatus === "NOT_REQUIRED") redirect("/inicio");
  const last = await db.guardianConsent.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  return (
    <AuthShell title="Falta a autorização do responsável" subtitle="Assim que ele(a) autorizar, sua conta é liberada.">
      <Card className="space-y-4">
        <p className="text-sm">
          Enviamos um e-mail para <strong>{last?.guardianEmail ?? "seu responsável"}</strong> com o link de autorização. Peça para ele(a) abrir o e-mail
          (confira também a caixa de spam). Depois é só atualizar esta página.
        </p>
        <ResendForm name={last?.guardianName ?? ""} email={last?.guardianEmail ?? ""} />
      </Card>
      <form action={signOutAction} className="mt-6">
        <Button variant="ghost" className="w-full">Sair</Button>
      </form>
    </AuthShell>
  );
}
