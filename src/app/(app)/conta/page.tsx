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
import { changePassword, deleteAccount, deleteAddress, logout, setModeAction } from "./actions";
import { InviteBox } from "./invite-box";
import { getMode } from "@/lib/session";
import { referralCount } from "@/lib/subscription";
import { REFERRAL_MAX_PCT, REFERRAL_PCT_EACH, referralPct } from "@/lib/domain";
import { appUrl } from "@/lib/app-url";
import { ArrowLeftRight, Rocket } from "lucide-react";

export const metadata: Metadata = { title: "Minha conta" };

export default async function AccountPage() {
  const user = await requireUser("/conta");
  const cpf = openCpf(user.cpfSealed);
  const addresses = await db.address.findMany({ where: { clientId: user.id }, orderBy: { lastUsedAt: "desc" } });
  const mode = await getMode(user);
  const referrals = user.provider ? await referralCount(user.id, user.provider.referralsFrom) : 0;
  return (
    <div className="space-y-4">
      <PageTitle title="Minha conta" />
      {user.role !== "ADMIN" &&
        (user.provider ? (
          <Card className="space-y-3 border-primary/40 bg-primary/5">
            <p className="flex items-center gap-2 font-semibold"><ArrowLeftRight size={18} className="text-primary" /> Você está no modo {mode === "trabalho" ? "trabalho" : "cliente"}</p>
            <p className="text-sm text-muted">{mode === "trabalho" ? "Quer contratar alguém? Troque para o modo cliente." : "Volte para a sua área de trabalho quando quiser."}</p>
            <form action={setModeAction.bind(null, mode === "trabalho" ? "cliente" : "trabalho")}>
              <Button type="submit" className="w-full">{mode === "trabalho" ? "Entrar como cliente" : "Entrar como trabalhador"}</Button>
            </form>
          </Card>
        ) : (
          <Card className="space-y-2 border-accent/40 bg-accent-soft">
            <p className="flex items-center gap-2 font-bold"><Rocket size={18} className="text-accent" /> Turbinar conta para trabalhador</p>
            <p className="text-sm text-muted">Ofereça os seus serviços, receba chamados e organize agenda e dinheiro. 3 dias grátis.</p>
            <Link href="/seja-prestador" className={buttonClass("primary", "md", "w-full")}>Quero trabalhar</Link>
          </Card>
        ))}
      {user.provider && user.refCode && (
        <Card className="space-y-2">
          <CardTitle>🎁 Indique e ganhe desconto</CardTitle>
          <p className="text-sm text-muted">Cada pessoa que criar conta pelo seu link (cliente ou trabalhador) dá {REFERRAL_PCT_EACH.toString().replace(".", ",")}% de desconto na sua próxima mensalidade, até {REFERRAL_MAX_PCT}%. Depois de usado, recomeça.</p>
          <p className="text-sm">Desde o último desconto: <strong>{referrals}</strong> pessoa(s) · desconto atual <strong>{referralPct(referrals).toString().replace(".", ",")}%</strong></p>
          <InviteBox link={`${appUrl()}/convite/${user.refCode}`} />
        </Card>
      )}
      <Card className="space-y-1">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-muted">CPF {cpf ? maskCpf(cpf) : "—"} · {user.role === "ADMIN" ? "Administrador" : user.provider ? "Cliente e prestador" : "Cliente"}</p>
        <p className="text-xs text-muted">Para corrigir nome ou CPF, fale com o suporte.</p>
      </Card>

      {user.role !== "ADMIN" && (
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
            <p className="text-sm text-muted">Nenhum endereço salvo. Você pode salvar ao pedir um serviço.</p>
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
        <p className="text-muted">Você pode pedir uma cópia dos seus dados pelo suporte.</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/suporte/novo?assunto=dados" className={buttonClass("outline", "sm")}>Pedir meus dados</Link>
          <Link href="/privacidade" className={buttonClass("ghost", "sm")}>Política de privacidade</Link>
        </div>
      </Card>

      <Card className="flex flex-wrap gap-2">
        <Link href="/suporte" className={buttonClass("outline", "sm")}>Suporte e chamados</Link>
        {user.provider ? <Link href="/painel" className={buttonClass("outline", "sm")}>Painel do prestador</Link> : user.role !== "ADMIN" && <Link href="/seja-prestador" className={buttonClass("outline", "sm")}>Quero oferecer serviços</Link>}
        <Link href="/baixar" className={buttonClass("outline", "sm")}>Instalar o app</Link>
        <Link href="/termos" className={buttonClass("ghost", "sm")}>Termos de uso</Link>
        <Link href="/cancelamento" className={buttonClass("ghost", "sm")}>Política de cancelamento</Link>
      </Card>

      {user.role !== "ADMIN" && (
        <Card className="space-y-2">
          <details>
            <summary className="cursor-pointer text-sm font-medium text-danger">Apagar minha conta</summary>
            <ActionForm action={deleteAccount} className="mt-3 space-y-3">
              <p className="text-sm text-muted">Apaga seu perfil, fotos, pedidos e conversas. Não dá para desfazer. Por segurança, o CPF continua registrado: uma conta nova com o mesmo CPF não ganha outro teste grátis e as penalidades continuam valendo.</p>
              <div>
                <Label htmlFor="del-pass">Sua senha</Label>
                <Input id="del-pass" name="password" type="password" autoComplete="current-password" required />
              </div>
              <div>
                <Label htmlFor="del-confirm">Digite APAGAR</Label>
                <Input id="del-confirm" name="confirm" required autoComplete="off" />
              </div>
              <SubmitButton variant="danger" pendingText="Apagando…">Apagar conta para sempre</SubmitButton>
            </ActionForm>
          </details>
        </Card>
      )}

      <form action={logout}>
        <Button type="submit" variant="outline" className="w-full"><LogOut size={16} /> Sair</Button>
      </form>
    </div>
  );
}
