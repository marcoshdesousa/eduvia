import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, CalendarClock, HandCoins, MapPin, MessagesSquare, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Logo } from "@/components/brand";
import { CityPicker } from "@/components/city-picker";
import { SiteFooter } from "@/components/site-footer";
import { Button, buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SUBSCRIPTION_CENTS, formatBRL } from "@/lib/domain";
import { UFS } from "@/lib/places";
import { getCurrentUser, homeOf } from "@/lib/session";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect(homeOf(user));
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Logo />
        <div className="flex-1" />
        <Link href="/entrar" className={buttonClass("ghost", "sm")}>Entrar</Link>
        <Link href="/cadastro" className={buttonClass("primary", "sm")}>Criar conta</Link>
      </header>

      <section className="hl-hero">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-14 pt-8 md:grid-cols-[1.1fr_1fr] md:items-center md:pt-14">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              <Sparkles size={14} /> Grátis para quem contrata
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-brand-ink md:text-5xl">Sua casa em boas mãos, no seu tempo.</h1>
            <p className="max-w-xl text-lg text-muted">
              Encontre profissionais de limpeza residencial na sua cidade, compare o preço por hora e as avaliações, e combine tudo pelo chat do app.
            </p>
            <Card className="space-y-3 shadow-lg shadow-primary/5">
              <p className="font-semibold">Onde você precisa de limpeza?</p>
              <form action="/buscar" className="space-y-3">
                <CityPicker ufs={UFS} />
                <Button type="submit" size="lg" className="w-full">Ver profissionais</Button>
              </form>
            </Card>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: MapPin, t: "Busque pela sua cidade", d: "Veja quem atende no seu município, com foto, preço por hora e serviços." },
              { icon: CalendarClock, t: "Escolha as horas", d: "De 1 a 12 horas, com data e horário. O valor estimado aparece na hora." },
              { icon: MessagesSquare, t: "Converse no app", d: "Depois do aceite, o chat libera texto, áudio e fotos." },
              { icon: HandCoins, t: "Pague direto ao profissional", d: "Em dinheiro ou Pix, sem taxa da plataforma para você." },
            ].map(({ icon: Icon, t, d }, i) => (
              <Card key={t} className="hl-in space-y-2" style={{ animationDelay: `${i * 70}ms` }}>
                <Icon className="text-primary" size={22} />
                <p className="font-semibold">{t}</p>
                <p className="text-sm text-muted">{d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 py-12">
        <h2 className="text-2xl font-bold text-brand-ink">Como funciona</h2>
        <ol className="grid gap-3 md:grid-cols-4">
          {[
            "Crie sua conta grátis só com nome, CPF e senha.",
            "Escolha o profissional, os serviços, as horas, a data e o endereço.",
            "O profissional aceita ou recusa. A contratação só vale depois do aceite.",
            "Depois do serviço, vocês dois se avaliam.",
          ].map((t, i) => (
            <li key={t} className="flex gap-3 rounded-xl border border-border bg-surface p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
              <span className="text-sm">{t}</span>
            </li>
          ))}
        </ol>
        <div className="grid gap-3 md:grid-cols-3">
          <Card className="space-y-2">
            <ShieldCheck className="text-accent" />
            <p className="font-semibold">Profissionais verificados</p>
            <p className="text-sm text-muted">Todo profissional passa por verificação e precisa ter 18 anos ou mais.</p>
          </Card>
          <Card className="space-y-2">
            <MapPin className="text-accent" />
            <p className="font-semibold">Seu endereço protegido</p>
            <p className="text-sm text-muted">O endereço só aparece para o profissional que aceitou o seu pedido.</p>
          </Card>
          <Card className="space-y-2">
            <Star className="text-accent" />
            <p className="font-semibold">Avaliações reais</p>
            <p className="text-sm text-muted">Só quem fez um serviço concluído pode avaliar.</p>
          </Card>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-2 md:items-center">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-ink">Você é profissional de limpeza?</h2>
            <p className="text-muted">Apareça para clientes da sua cidade, defina o seu preço por hora e aceite só os serviços que quiser.</p>
            <ul className="space-y-2 text-sm">
              {["Sem comissão sobre os seus serviços", "Você recebe direto do cliente, em dinheiro ou Pix", "Escolha seus horários e pause quando quiser"].map((t) => (
                <li key={t} className="flex items-center gap-2"><BadgeCheck size={18} className="text-accent" /> {t}</li>
              ))}
            </ul>
          </div>
          <Card className="space-y-3 text-center">
            <p className="text-sm font-medium text-muted">Assinatura mensal do profissional</p>
            <p className="text-4xl font-extrabold text-brand-ink">{formatBRL(SUBSCRIPTION_CENTS)}<span className="text-base font-medium text-muted">/mês</span></p>
            <p className="text-xs text-muted">Sem taxa por serviço, sem cobrança por hora. Pagamento por Pix.</p>
            <Link href="/cadastro/profissional" className={buttonClass("primary", "lg", "w-full")}>Quero ser profissional</Link>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
