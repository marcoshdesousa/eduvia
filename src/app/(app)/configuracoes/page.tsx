import Link from "next/link";
import { Download, LogOut } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { signOutAction } from "@/app/actions/account";
import { ThemeToggle } from "@/components/theme";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { maskCpf } from "@/lib/core/phone";
import { vapidPublicKey } from "@/lib/notifications";
import { PushSettings } from "@/components/push-settings";
import { DeleteAccountForm, PasswordForm, ProfileForm } from "./forms";

export const metadata = { title: "Configurações" };

export default async function Page() {
  const user = await requireReadyUser();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <Card className="space-y-4">
        <CardTitle>Conta</CardTitle>
        <p className="text-sm text-muted">CPF {maskCpf(user.cpf!)}</p>
        <ProfileForm name={user.name} handle={user.handle!} phone={user.phone!} visibility={user.profileVisibility} timezone={user.timezone} avatar={user.avatar} />
      </Card>
      <Card className="space-y-4">
        <CardTitle>Senha</CardTitle>
        <PasswordForm />
      </Card>
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle>Minha IA (Gemini)</CardTitle>
        <Link href="/minha-ia" className={buttonClass("outline")}>Ver ou trocar chave</Link>
      </Card>
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle>Assinatura</CardTitle>
        <Link href="/assinatura" className={buttonClass("outline")}>Gerenciar assinatura</Link>
      </Card>
      <Card className="space-y-2">
        <CardTitle>Notificações</CardTitle>
        <p className="text-sm text-muted">
          Receba no celular ou no computador o lembrete no horário de estudo, convites de grupo e conquistas.
        </p>
        <PushSettings vapidKey={vapidPublicKey()} remindersEnabled={user.remindersEnabled} />
      </Card>
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle>Aparência</CardTitle>
        <ThemeToggle withLabel />
      </Card>
      <Card className="space-y-3">
        <CardTitle>Seus dados (LGPD)</CardTitle>
        <a href="/api/account/export" className={buttonClass("outline")}><Download size={16} /> Exportar meus dados</a>
        <div className="border-t border-border pt-4">
          <DeleteAccountForm handle={user.handle!} />
        </div>
      </Card>
      <form action={signOutAction}>
        <Button variant="ghost"><LogOut size={16} /> Sair</Button>
      </form>
    </div>
  );
}
