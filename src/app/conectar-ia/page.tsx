import { redirect } from "next/navigation";
import { AuthShell } from "@/components/brand";
import { requireUser } from "@/lib/session";
import { ConnectAiForm } from "@/components/connect-ai-form";
import { signOutAction } from "@/app/actions/account";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Conecte sua IA" };

export default async function Page() {
  const user = await requireUser();
  if (!user.handle || !user.termsAcceptedAt || !user.cpf || !user.phone) redirect("/boas-vindas");
  if (user.geminiKey) redirect("/inicio");
  return (
    <AuthShell title="Falta só um passo" subtitle="Para gerar seus estudos, o Eduvia precisa da sua IA do Gemini.">
      <ConnectAiForm next="/inicio" />
      <form action={signOutAction} className="mt-3">
        <Button variant="ghost" className="w-full">Agora não (sair)</Button>
      </form>
    </AuthShell>
  );
}
