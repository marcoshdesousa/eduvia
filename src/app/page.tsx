import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  GraduationCap,
  Leaf,
  Smartphone,
  MessageCircle,
  PenLine,
  RotateCcw,
  Target,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { StreakIcon } from "@/components/streak-icon";
import { buttonClass } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { formatBRL, listPlans } from "@/lib/billing";
import { planFeatures, PROMOS, REFERRAL_FIRST_CENTS } from "@/lib/plans";
import { MATERIAS } from "@/lib/enem/catalog";
import { InstallButton } from "@/components/install-app";
import { RegisterServiceWorker } from "@/components/push-settings";

const STEPS = [
  { icon: Smartphone, title: "Crie sua conta grátis", text: "Leva 2 minutos e não pede cartão. Baixe o app no celular e conecte a Gemini, a IA grátis do Google." },
  { icon: BookOpen, title: "Estude as aulas", text: "Aulas de todas as matérias do ENEM e de redação, com o robô lendo para você e um quiz no fim de cada uma." },
  { icon: Target, title: "Treine como na prova", text: "Questões reais do ENEM, simulados com o tempo de verdade, redação corrigida e banco de erros." },
];

const FEATURES = [
  { icon: BookOpen, title: "Aulas de todas as matérias", text: "Português, Matemática, Inglês, Espanhol, Literatura, Artes, História, Geografia, Filosofia, Sociologia, Biologia, Física, Química e Redação." },
  { icon: Brain, title: "Quiz em cada aula", text: "Perguntas de marcar e de escrever sobre o que você estudou. Tire 75% e libere a próxima aula." },
  { icon: GraduationCap, title: "Simulado ENEM", text: "1º e 2º dia com as quantidades e o tempo da prova, nota por área e questões reais do INEP." },
  { icon: Zap, title: "Teste rápido", text: "Questões reais do ENEM cronometradas: acertou, o bonequinho pula de alegria." },
  { icon: PenLine, title: "Redação nota mil", text: "Aulas das 5 competências e redações corrigidas no estilo do ENEM, com nota de 0 a 1000." },
  { icon: Target, title: "Banco de erros", text: "Toda questão errada volta para você refazer até acertar." },
  { icon: RotateCcw, title: "Revisão no tempo certo", text: "O que você erra volta mais vezes, para não esquecer na hora da prova." },
  { icon: MessageCircle, title: "Professor IA", text: "Tire dúvidas de qualquer matéria do ENEM a qualquer hora." },
  { icon: Users, title: "Grupos de estudo", text: "Estude com amigos: mural, ranking e torneios." },
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
    a: "Não. Você cria sua conta grátis, sem cartão, e já começa a estudar. No cadastro você conecta a Gemini, a IA grátis do Google (o passo a passo aparece lá). Quando quiser liberar mais aulas e atividades, é só assinar um plano.",
  },
  {
    q: "Quanto custa?",
    a: "Criar a conta é grátis. O Básico custa R$ 9,90 e libera metade das aulas de cada matéria. O Completo custa R$ 19,90 (nos 3 primeiros meses, R$ 14,90) e libera tudo. E tem o plano Indicação: compartilhe o seu código e, quando 3 pessoas criarem a conta com ele, você tem tudo do Completo por R$ 7,90. O pagamento é por Pix, direto no site: o plano libera sozinho assim que o Pix cai. Cada pagamento vale 30 dias e não há renovação automática.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Seu progresso é visto só por você. A sua chave da IA fica guardada criptografada. Em Ajustes você exporta ou apaga tudo quando quiser.",
  },
  {
    q: "Para quem é o Eduvia?",
    a: "Para quem vai fazer o ENEM e quer uma nota alta. As aulas, as questões e os simulados já vêm prontos: é só abrir e estudar.",
  },
  {
    q: "Como funciona o plano Indicação?",
    a: "Cada conta tem um código de 6 números. Compartilhe com amigos: quando 3 pessoas criarem a conta usando o seu código, você paga R$ 7,90 e tem tudo do plano Completo por 30 dias. Depois, para usar de novo, basta 1 indicação nova.",
  },
  {
    q: "Tenho outra dúvida. Como falo com vocês?",
    a: "Dentro do app, em Mais → Suporte, você manda uma mensagem e a equipe responde por lá. Se preferir, use os links das redes no rodapé.",
  },
];

export default async function Home() {
  if (await getCurrentUser()) redirect("/inicio");
  const all = await listPlans();
  const plans = all.filter((p) => p.slug !== "gratis" && p.slug !== "indicacao" && p.active && p.priceMonthCents > 0);
  const referral = all.find((p) => p.slug === "indicacao" && p.active);
  const lessons = MATERIAS.reduce((n, m) => n + m.lessons.length, 0);

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
          <div className="flex items-center gap-2">
            <InstallButton compact label="Baixar o app" className="grid size-9 place-items-center rounded-lg text-primary hover:bg-surface-2" href="/baixar-app" />
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
              <span className="size-2 rounded-full bg-[#fb923c]" /> Feito para o ENEM
            </span>
            <h1 className="font-display mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Estude para o ENEM e vá atrás da sua <span className="bg-gradient-to-r from-[#f97316] to-[#f59e0b] bg-clip-text text-transparent">nota mais alta</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              {lessons} aulas de todas as matérias e de redação, quiz em cada aula, questões reais do ENEM, simulados com o tempo da prova e redação corrigida. Tudo pronto no seu celular.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/cadastro" className={buttonClass("primary", "lg")}>Começar grátis <ArrowRight size={18} /></Link>
              <InstallButton label="Baixar o app" className="h-12 px-6" href="/baixar-app" />
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {["Grátis para sempre", "Sem cartão", "Questões reais do INEP"].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5"><Check size={16} className="text-success" />{t}</li>
              ))}
            </ul>
          </div>
          <HeroMockup />
        </section>

        {/* ── Como funciona */}
        <section id="como-funciona" className="scroll-mt-20 py-14">
          <SectionTitle kicker="Como funciona" title="Da conta ao estudo em 3 passos" />
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
          <SectionTitle kicker="Recursos" title="Tudo o que você precisa para o ENEM" />
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
              <strong>Estudo com saúde.</strong> <span className="text-muted">Quando você estuda demais, o Eduvia sugere uma pausa e indica o que fazer enquanto descansa.</span>
            </p>
          </div>
        </section>

        {/* ── Preço */}
        <section id="preco" className="scroll-mt-20 py-14">
          <SectionTitle kicker="Preço" title="Planos que cabem no bolso" subtitle="Crie sua conta grátis e assine quando quiser liberar mais aulas e atividades. Planos de 30 dias, pagos com Pix, sem renovação automática." />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p) => (
              <PriceCard
                key={p.slug}
                label={p.name}
                price={formatBRL(PROMOS[p.slug] && PROMOS[p.slug]!.priceCents < p.priceMonthCents ? PROMOS[p.slug]!.priceCents : p.priceMonthCents)}
                was={PROMOS[p.slug] && PROMOS[p.slug]!.priceCents < p.priceMonthCents ? formatBRL(p.priceMonthCents) : undefined}
                promo={PROMOS[p.slug] && PROMOS[p.slug]!.priceCents < p.priceMonthCents ? `nos ${PROMOS[p.slug]!.months} primeiros meses; depois ${formatBRL(p.priceMonthCents)}` : undefined}
                period="30 dias"
                features={planFeatures(p.limits).filter((f) => !f.startsWith("Sem "))}
                highlight={p.slug === "completo"}
              />
            ))}
            {referral && (
              <PriceCard
                label="Indicação"
                price={formatBRL(REFERRAL_FIRST_CENTS)}
                period="30 dias"
                badge="Indique 3 amigos"
                features={["Tudo o que o plano Completo tem", "Libera quando 3 pessoas criam a conta com o seu código", "Depois, 1 indicação nova por mês"]}
              />
            )}
          </div>
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
            <h2 className="font-display relative text-3xl font-extrabold tracking-tight sm:text-4xl">Sua preparação para o ENEM começa hoje.</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/85">Crie sua conta grátis em 2 minutos e faça a primeira aula agora.</p>
            <Link href="/cadastro" className="relative mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-[#c2410c] transition hover:bg-white/90">
              Começar grátis <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <RegisterServiceWorker />
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

function PriceCard({ label, price, was, promo, period, extra, features, highlight, badge }: { label: string; price: string; was?: string; promo?: string; period: string; extra?: string; features: string[]; highlight?: boolean; badge?: string }) {
  return (
    <div className={`flex flex-col rounded-2xl border p-6 ${highlight ? "border-primary bg-primary/5 shadow-[0_0_0_1px_var(--primary)]" : "border-border bg-surface"}`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold">{label}</span>
        {highlight && <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">Tudo liberado</span>}
        {badge && <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">{badge}</span>}
      </div>
      {was && <span className="mt-3 w-fit rounded-full bg-warning/15 px-2.5 py-0.5 text-xs font-semibold text-warning">Promoção</span>}
      <div className="font-display mt-3 text-4xl font-extrabold">
        {was && <span className="mr-2 align-middle text-lg font-semibold text-muted line-through">{was}</span>}
        {price}
      </div>
      <p className="text-sm text-muted">por {period}{promo ? `, ${promo}` : ""}</p>
      {extra && <p className="text-xs text-muted">ou {extra}</p>}
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
            <span>Biologia · Aula 3</span>
            <span className="inline-flex items-center gap-1"><Timer size={12} /> 20 min</span>
          </div>
          <p className="font-display mt-1 text-lg font-bold">Ecologia: cadeias alimentares</p>
          <div className="mt-3 h-1.5 rounded-full bg-surface-2"><div className="h-1.5 w-2/3 rounded-full bg-primary" /></div>
          <div className="mt-4 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs">
            <p className="font-semibold text-warning">Destaque</p>
            <p className="mt-1 text-foreground/90">A energia diminui a cada nível trófico: só cerca de 10% passa para o nível seguinte.</p>
          </div>
          <p className="mt-4 text-sm font-medium">Numa cadeia alimentar, quem recebe menos energia?</p>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="rounded-lg border border-border px-3 py-2 text-muted">Os produtores</li>
            <li className="rounded-lg border border-border px-3 py-2 text-muted">Os consumidores primários</li>
            <li className="flex items-center justify-between rounded-lg border border-success/50 bg-success/10 px-3 py-2">
              O último consumidor <Check size={16} className="text-success" />
            </li>
          </ul>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-6 hidden rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-xl sm:block">
        <p className="inline-flex items-center gap-1 font-semibold"><StreakIcon className="h-3.5 w-3.5" /> 7 dias seguidos</p>
        <p className="text-muted">+120 XP hoje</p>
      </div>
      <div className="absolute -right-4 top-8 hidden rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-xl sm:flex sm:items-center sm:gap-2">
        <MessageCircle size={14} className="text-primary" /> Simulado ENEM: 780 em Natureza
      </div>
    </div>
  );
}
