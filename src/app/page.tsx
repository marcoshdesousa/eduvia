import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarClock,
  Check,
  ChevronDown,
  FileUp,
  GraduationCap,
  Leaf,
  MessageCircle,
  PenLine,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { buttonClass } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { formatBRL, listPlans } from "@/lib/billing";
import { PAID_PLAN, planFeatures } from "@/lib/plans";

const STEPS = [
  { icon: FileUp, title: "Envie seu material", text: "PDFs, apostilas, fotos do caderno, DOCX ou texto colado. Para concurso, mande também o edital." },
  { icon: Sparkles, title: "A IA organiza tudo", text: "Ela lê, separa em assuntos, cita a página de origem e monta um plano do tamanho do seu dia." },
  { icon: Target, title: "Estude e acompanhe", text: "Sessões curtas, questões, revisões no tempo certo, testes rápidos e simulados. Você vê sua evolução." },
];

const FEATURES = [
  { icon: CalendarClock, title: "Plano que cabe no seu dia", text: "De 5 a 45 minutos por sessão, até a data da prova." },
  { icon: BookOpen, title: "Sessões prontas", text: "Texto explicativo, destaques e perguntas feitas do seu material." },
  { icon: RotateCcw, title: "Revisão espaçada", text: "Revisões em 1, 7, 15 e 30 dias. O que você erra volta mais." },
  { icon: Target, title: "Banco de erros", text: "Toda questão errada vira revisão, com a explicação certa." },
  { icon: Zap, title: "Teste rápido", text: "Perguntas cronometradas: acertou, o bonequinho pula de alegria." },
  { icon: GraduationCap, title: "Simulados", text: "No estilo da sua banca, com nota, gabarito e evolução." },
  { icon: PenLine, title: "Redação e português", text: "Tema sorteado, correção no estilo ENEM e teste de português." },
  { icon: Brain, title: "Professor IA", text: "Tire dúvidas sobre o seu material, com a página citada." },
  { icon: Users, title: "Grupos de estudo", text: "Estude com amigos: mural, materiais e ranking de simulado." },
];

const FAQ = [
  {
    q: "Por que vocês pedem o CPF?",
    a: "Para garantir uma conta por pessoa e evitar contas falsas ou repetidas para burlar o plano grátis. O CPF também é o seu login. Ele não aparece para outros alunos, não é vendido nem compartilhado e não é usado para nenhuma outra finalidade.",
  },
  {
    q: "Vocês pedem e-mail ou telefone?",
    a: "Não pedimos e-mail. Pedimos só o telefone (WhatsApp), que não é usado para mandar mensagens nem propaganda: ele serve apenas para confirmar que a conta é sua se você esquecer a senha. Aí, em \"Esqueci a senha\", você cria uma senha nova. A senha antiga ninguém consegue ver, nem a equipe do Eduvia.",
  },
  {
    q: "Preciso pagar alguma coisa para começar?",
    a: "Não. A conta é grátis e não pede cartão. No cadastro você ativa o Eduvia com uma chave gratuita do Google (o passo a passo aparece lá). Quando quiser mais, é só assinar um plano.",
  },
  {
    q: "Quanto custa?",
    a: "Você começa grátis, com limites pequenos para testar. Os planos começam em R$ 7 a cada 7 dias ou R$ 15 a cada 30 dias (Básico) e vão até o Ilimitado, por R$ 80. Todos têm PDFs e páginas sem limite; o que muda é quantos guias de estudo você cria por mês. O pagamento é combinado pelo WhatsApp (Pix) e não há renovação automática.",
  },
  {
    q: "Meus materiais e dados ficam seguros?",
    a: "Seus arquivos são vistos só por você e por quem você escolher num grupo. A sua chave da IA fica guardada criptografada. Em Ajustes você exporta ou apaga tudo quando quiser.",
  },
  {
    q: "Para quem é o Eduvia?",
    a: "Para qualquer estudante: ensino fundamental e médio, ENEM e vestibular, faculdade, concursos públicos ou quem quer estudar por conta própria. A IA ajusta a linguagem e o tipo de questão ao seu perfil.",
  },
  {
    q: "Tenho outra dúvida. Como falo com vocês?",
    a: "Dentro do app, em Mais → Suporte, você manda uma mensagem e a equipe responde por lá. Se preferir, use os links das redes no rodapé.",
  },
];

export default async function Home() {
  if (await getCurrentUser()) redirect("/inicio");
  const plans = (await listPlans()).filter((p) => p.slug !== "gratis" && p.active && p.priceMonthCents > 0);
  const basic = plans.find((p) => p.slug === PAID_PLAN) ?? plans[0];
  const month = formatBRL(basic?.priceMonthCents ?? 1500);

  return (
    <div className="relative overflow-x-clip">
      {/* brilho de fundo */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[640px] bg-[radial-gradient(60%_60%_at_50%_30%,color-mix(in_oklab,var(--primary)_28%,transparent),transparent)]" />

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            <a href="#como-funciona" className="hover:text-foreground">Como funciona</a>
            <a href="#recursos" className="hover:text-foreground">Recursos</a>
            <a href="#preco" className="hover:text-foreground">Preço</a>
            <a href="#duvidas" className="hover:text-foreground">Dúvidas</a>
          </nav>
          <div className="flex gap-2">
            <Link href="/entrar" className={buttonClass("ghost", "sm")}>Entrar</Link>
            <Link href="/cadastro" className={buttonClass("primary", "sm")}>Começar grátis</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        {/* ── Hero */}
        <section className="grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
              <span className="size-2 rounded-full bg-[#fb923c]" /> ENEM · Concursos · Faculdade · Escola
            </span>
            <h1 className="font-display mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Seus PDFs viram um <span className="bg-gradient-to-r from-[#f97316] to-[#f59e0b] bg-clip-text text-transparent">plano de estudo</span> que funciona.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Envie o seu material e a IA monta sessões do tamanho do seu dia, com texto, questões, revisões no tempo certo, testes rápidos e simulados. Tudo com a página de origem citada.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/cadastro" className={buttonClass("primary", "lg")}>Começar grátis <ArrowRight size={18} /></Link>
              <a href="#como-funciona" className={buttonClass("outline", "lg")}>Ver como funciona</a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {["Sem cartão", "Pronto em 2 minutos", `Planos a partir de ${month}/mês`].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5"><Check size={16} className="text-success" />{t}</li>
              ))}
            </ul>
          </div>
          <HeroMockup />
        </section>

        {/* ── Como funciona */}
        <section id="como-funciona" className="scroll-mt-20 py-14">
          <SectionTitle kicker="Como funciona" title="Do arquivo ao estudo em 3 passos" />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl border border-border bg-surface p-6">
                <span className="font-display absolute right-5 top-4 text-5xl font-extrabold text-border">{i + 1}</span>
                <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary"><s.icon size={22} /></span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Recursos */}
        <section id="recursos" className="scroll-mt-20 py-14">
          <SectionTitle kicker="Recursos" title="Tudo o que você precisa para aprender de verdade" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="group rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-primary/50">
                <f.icon className="text-primary" size={22} />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-success/30 bg-success/5 p-5 sm:flex-row sm:items-center">
            <Leaf className="shrink-0 text-success" />
            <p className="text-sm">
              <strong>Estudo com saúde.</strong> <span className="text-muted">Quando você estuda demais, o Eduvia sugere uma pausa e indica o que ler enquanto descansa: o seu PDF, livros da matéria e revisões.</span>
            </p>
          </div>
        </section>

        {/* ── Preço */}
        <section id="preco" className="scroll-mt-20 py-14">
          <SectionTitle kicker="Preço" title="Planos que cabem no bolso" subtitle="Comece grátis. Todos os planos têm PDFs e páginas sem limite; o que muda é quantos guias de estudo você cria por mês." />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p) => (
              <PriceCard
                key={p.slug}
                label={p.name}
                price={formatBRL(p.priceMonthCents)}
                period="30 dias"
                extra={p.priceWeekCents > 0 ? `ou ${formatBRL(p.priceWeekCents)} por 7 dias` : undefined}
                features={planFeatures(p.limits).filter((f) => !f.startsWith("Sem "))}
                highlight={p.slug === "ilimitado"}
              />
            ))}
          </div>
          <ul className="mx-auto mt-6 grid max-w-3xl gap-2 text-sm text-muted sm:grid-cols-2">
            {["Testes rápidos à vontade em todos os planos", "Revisões e banco de erros ilimitados", "Grupos de estudo com torneios", "Sem renovação automática"].map((t) => (
              <li key={t} className="inline-flex items-center gap-2"><Check size={16} className="shrink-0 text-success" />{t}</li>
            ))}
          </ul>
        </section>

        {/* ── Dúvidas */}
        <section id="duvidas" className="scroll-mt-20 py-14">
          <SectionTitle kicker="Dúvidas" title="Perguntas frequentes" />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-2xl border border-border bg-surface">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}
                  <ChevronDown size={18} className="shrink-0 text-muted transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Chamada final */}
        <section className="py-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e293b] via-[#7c2d12] to-[#ea580c] px-6 py-12 text-center text-white sm:px-12">
            <div aria-hidden className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10" />
            <div aria-hidden className="absolute -bottom-16 -left-10 size-56 rounded-full bg-white/10" />
            <h2 className="font-display relative text-3xl font-extrabold tracking-tight sm:text-4xl">Seu próximo estudo começa hoje.</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/85">Crie sua conta em 2 minutos, envie seu primeiro PDF e veja o plano pronto.</p>
            <Link href="/cadastro" className="relative mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-[#c2410c] transition hover:bg-white/90">
              Começar grátis <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">{kicker}</p>
      <h2 className="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
    </div>
  );
}

function PriceCard({ label, price, period, extra, features, highlight }: { label: string; price: string; period: string; extra?: string; features: string[]; highlight?: boolean }) {
  return (
    <div className={`flex flex-col rounded-2xl border p-6 ${highlight ? "border-primary bg-primary/5 shadow-[0_0_0_1px_var(--primary)]" : "border-border bg-surface"}`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold">{label}</span>
        {highlight && <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">Tudo ilimitado</span>}
      </div>
      <div className="font-display mt-3 text-4xl font-extrabold">{price}</div>
      <p className="text-sm text-muted">por {period}{extra ? ` · ${extra}` : ""}</p>
      <ul className="mt-4 flex-1 space-y-1.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2"><Check size={15} className="mt-0.5 shrink-0 text-success" />{f}</li>
        ))}
      </ul>
      <Link href="/cadastro" className={buttonClass(highlight ? "primary" : "outline", "md", "mt-6 w-full")}>Começar grátis</Link>
    </div>
  );
}

/** Ilustração do app (feita em HTML): uma sessão de estudo no celular. */
function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden>
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-[#f97316]/30 to-[#f59e0b]/20 blur-2xl" />
      <div className="rounded-[2.2rem] border border-border bg-surface p-3 shadow-2xl">
        <div className="rounded-[1.7rem] border border-border bg-background p-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Direito Constitucional · Parte 2</span>
            <span className="inline-flex items-center gap-1"><Timer size={12} /> 15 min</span>
          </div>
          <p className="font-display mt-1 text-lg font-bold">Direitos fundamentais</p>
          <div className="mt-3 h-1.5 rounded-full bg-surface-2"><div className="h-1.5 w-2/3 rounded-full bg-primary" /></div>
          <div className="mt-4 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs">
            <p className="font-semibold text-warning">Destaque</p>
            <p className="mt-1 text-foreground/90">Os direitos fundamentais têm aplicação imediata (art. 5º, § 1º). <span className="text-primary">[p. 45]</span></p>
          </div>
          <p className="mt-4 text-sm font-medium">Os direitos fundamentais podem ser abolidos por emenda?</p>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="rounded-lg border border-border px-3 py-2 text-muted">Sim, por maioria simples</li>
            <li className="flex items-center justify-between rounded-lg border border-success/50 bg-success/10 px-3 py-2">
              Não, são cláusulas pétreas <Check size={16} className="text-success" />
            </li>
            <li className="rounded-lg border border-border px-3 py-2 text-muted">Só por plebiscito</li>
          </ul>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-6 hidden rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-xl sm:block">
        <p className="font-semibold">🔥 7 dias seguidos</p>
        <p className="text-muted">+120 XP hoje</p>
      </div>
      <div className="absolute -right-4 top-8 hidden rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-xl sm:flex sm:items-center sm:gap-2">
        <MessageCircle size={14} className="text-primary" /> Revisão R2 amanhã
      </div>
    </div>
  );
}
