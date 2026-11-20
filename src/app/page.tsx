import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, BellRing, HandCoins, MapPin, MessagesSquare, ShieldCheck, Smartphone, Star, Zap } from "lucide-react";
import { Logo } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CATEGORIES, PACK_CENTS, PACK_PLACES, PLANS, TRIAL_DAYS, formatBRL } from "@/lib/domain";
import { getCurrentUser, homeOf } from "@/lib/session";

export default async function Home({ searchParams }: { searchParams: Promise<{ conta?: string }> }) {
  const user = await getCurrentUser();
  if (user) redirect(homeOf(user));
  const { conta } = await searchParams;
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Logo />
        <div className="flex-1" />
        <Link href="/entrar" className={buttonClass("ghost", "sm")}>Entrar</Link>
        <Link href="/cadastro" className={buttonClass("primary", "sm")}>Criar conta</Link>
      </header>
      {conta === "apagada" && <p className="mx-auto max-w-6xl px-4 text-sm text-muted">Sua conta foi apagada. Obrigado por ter usado o Diária Paga.</p>}

      <section className="hl-hero">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-14 pt-8 md:grid-cols-[1.1fr_1fr] md:items-center md:pt-14">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              <HandCoins size={14} /> Grátis para quem contrata
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-brand-ink md:text-5xl">Quem faz o serviço, perto de você. Hoje.</h1>
            <p className="max-w-xl text-lg text-muted">
              Diarista, pedreiro, cuidador de idoso, babá, eletricista, compras no supermercado e muito mais. Compare preço e avaliações, ou chame na hora com o <strong className="text-foreground">Contrate rápido</strong>.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/rapido" className={buttonClass("primary", "lg", "dp-ring")}><Zap size={18} /> Contratar agora</Link>
              <Link href="/buscar" className={buttonClass("outline", "lg")}>Ver prestadores</Link>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.slice(0, 16).map((c, i) => (
              <Link key={c.slug} href={`/buscar?servico=${c.slug}`} className="hl-in flex flex-col items-center gap-1 rounded-2xl border border-border bg-surface p-2 text-center text-[11px] font-medium shadow-sm transition hover:border-primary" style={{ animationDelay: `${i * 30}ms` }}>
                <span className="text-2xl">{c.emoji}</span>
                <span className="leading-tight">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 py-12">
        <h2 className="text-2xl font-bold text-brand-ink">⚡ Contrate rápido: como um app de corrida, só que para serviços</h2>
        <ol className="grid gap-3 md:grid-cols-4">
          {[
            "Escolha o serviço e libere a sua localização.",
            "Descreva o que precisa. O valor é fixo para cada profissão, sem surpresa.",
            "Tocamos no celular de quem está perto e mais aceita chamados. O primeiro que aceitar leva.",
            "O prestador chega em até 2 horas. Vocês conversam pelo chat.",
          ].map((t, i) => (
            <li key={t} className="flex gap-3 rounded-xl border border-border bg-surface p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
              <span className="text-sm">{t}</span>
            </li>
          ))}
        </ol>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { icon: ShieldCheck, t: "CPF verificado", d: "Uma conta por CPF. Prestadores com 18 anos ou mais." },
            { icon: MapPin, t: "Endereço protegido", d: "Só quem aceitou vê o seu endereço." },
            { icon: MessagesSquare, t: "Tudo pelo chat", d: "Texto, áudio, foto e vídeo. E o WhatsApp do prestador no perfil, se ele quiser." },
            { icon: Star, t: "Avaliações reais", d: "Só quem concluiu um serviço pode avaliar." },
          ].map(({ icon: Icon, t, d }) => (
            <Card key={t} className="space-y-2">
              <Icon className="text-primary" />
              <p className="font-semibold">{t}</p>
              <p className="text-sm text-muted">{d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-ink">Você presta serviço? Trabalhe com a gente.</h2>
            <p className="text-muted">Receba chamados de clientes perto de você e monte o seu perfil com fotos dos trabalhos.</p>
            <ul className="space-y-2 text-sm">
              {["Sem comissão: o cliente paga direto para você (Pix, dinheiro ou cartão)", `Comece com ${TRIAL_DAYS} dias grátis do plano Completo`, "Painel financeiro: quanto entrou na semana e no mês", "Escolha seus horários e pause quando quiser"].map((t) => (
                <li key={t} className="flex items-center gap-2"><BadgeCheck size={18} className="shrink-0 text-primary" /> {t}</li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["FULL", "BASIC"] as const).map((k) => {
              const p = PLANS[k];
              return (
                <Card key={k} className={k === "FULL" ? "space-y-2 border-2 border-primary" : "space-y-2"}>
                  <p className="flex items-center justify-between font-semibold">{p.name} {p.recommended && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">★ Recomendado</span>}</p>
                  <p className="text-3xl font-extrabold text-brand-ink">{formatBRL(p.priceCents)}<span className="text-sm font-medium text-muted">/mês</span></p>
                  <p className="text-xs text-muted">{formatBRL(p.platformCents)} da plataforma + {formatBRL(p.feesCents)} de impostos e taxas</p>
                  <p className="text-sm">{k === "FULL" ? `⚡ Contrate rápido, aparece primeiro, ${p.places} endereços e pacotes de +${PACK_PLACES} por ${formatBRL(PACK_CENTS)}` : `${p.places} endereço, pedidos com data marcada`}</p>
                </Card>
              );
            })}
            <Link href="/cadastro?quero=trabalhar" className={buttonClass("primary", "lg", "sm:col-span-2")}>Quero trabalhar · {TRIAL_DAYS} dias grátis</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <Card className="flex flex-col items-center gap-3 bg-brand-ink p-6 text-center text-white md:flex-row md:text-left">
          <Smartphone size={40} className="shrink-0 text-amber-300" />
          <div className="flex-1">
            <p className="text-lg font-bold">Instale o app no seu celular</p>
            <p className="text-sm text-white/80">Funciona no Android e no iPhone, sem loja. Com o app instalado você recebe os avisos de pedidos e chamados na hora. <BellRing size={14} className="inline" /></p>
          </div>
          <Link href="/baixar" className={buttonClass("secondary", "lg")}>Como instalar</Link>
        </Card>
      </section>

      <SiteFooter />
    </div>
  );
}
