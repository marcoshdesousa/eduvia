import Link from "next/link";
import type { Metadata } from "next";
import { LogOut, MapPin, Trash2 } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { PasswordPair } from "@/components/masked-inputs";
import { PushToggle } from "@/components/push-toggle";
import { SubmitButton } from "@/components/submit-button";
import { ThemeToggle } from "@/components/theme";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";
import { maskCpf } from "@/lib/core/phone";
import { openCpf } from "@/lib/cpf";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { changePassword, deleteAddress, logout } from "./actions";

export const metadata: Metadata = { title: "Minha conta" };

export default async function AccountPage() {
  const user = await requireUser("/conta");
  const cpf = openCpf(user.cpfSealed);
  const addresses = user.role === "CLIENT" ? await db.address.findMany({ where: { clientId: user.id }, orderBy: { lastUsedAt: "desc" } }) : [];
  return (
    <div className="space-y-4">
      <PageTitle title="Minha conta" />
      <Card className="space-y-1">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-muted">CPF {cpf ? maskCpf(cpf) : "—"} · {user.role === "PRO" ? "Profissional" : user.role === "ADMIN" ? "Administrador" : "Cliente"}</p>
        <p className="text-xs text-muted">Para corrigir nome ou CPF, fale com o suporte.</p>
      </Card>

      {user.role === "CLIENT" && (
        <Card className="space-y-3">
          <CardTitle>Endereços salvos</CardTitle>
          {addresses.length ? (
            <ul className="divide-y divide-border">
              {addresses.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-2 text-sm">
                  <MapPin size={16} className="shrink-0 text-muted" />
                  <span className="flex-1"><strong>{a.label}</strong><span className="block text-muted">{a.street}{a.number ? `, ${a.number}` : ""} — {a.city}/{a.uf}</span></span>
                  <form action={deleteAddress.bind(null, a.id)}>
                    <Button type="submit" variant="ghost" size="sm" aria-label={`Apagar ${a.label}`}><Trash2 size={16} /></Button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Nenhum endereço salvo. Você pode salvar ao pedir uma limpeza.</p>
          )}
        </Card>
      )}

      <Card className="space-y-3">
        <CardTitle>Notificações e aparência</CardTitle>
        <PushToggle />
        <ThemeToggle withLabel />
      </Card>

      <Card className="space-y-3">
        <CardTitle>Trocar senha</CardTitle>
        <ActionForm action={changePassword} className="space-y-3" resetOnOk>
          <div>
            <Label htmlFor="current">Senha atual</Label>
            <Input id="current" name="current" type="password" autoComplete="current-password" required />
          </div>
          <PasswordPair label="Nova senha" />
          <SubmitButton variant="outline" pendingText="Salvando…">Trocar senha</SubmitButton>
        </ActionForm>
      </Card>

      <Card className="space-y-2 text-sm">
        <CardTitle>Privacidade</CardTitle>
        <p className="text-muted">Você pode pedir uma cópia dos seus dados ou a exclusão da conta pelo suporte.</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/suporte/novo?assunto=dados" className={buttonClass("outline", "sm")}>Pedir meus dados / excluir conta</Link>
          <Link href="/privacidade" className={buttonClass("ghost", "sm")}>Política de privacidade</Link>
        </div>
      </Card>

      <Card className="flex flex-wrap gap-2">
        <Link href="/suporte" className={buttonClass("outline", "sm")}>Suporte e chamados</Link>
        {user.role === "PRO" && <Link href="/painel/agenda" className={buttonClass("outline", "sm")}>Agenda e pausa</Link>}
        <Link href="/termos" className={buttonClass("ghost", "sm")}>Termos de uso</Link>
        <Link href="/cancelamento" className={buttonClass("ghost", "sm")}>Política de cancelamento</Link>
      </Card>

      <form action={logout}>
        <Button type="submit" variant="outline" className="w-full"><LogOut size={16} /> Sair</Button>
      </form>
    </div>
  );
}
