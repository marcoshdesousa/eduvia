import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Brain, CalendarClock, FileUp, RotateCcw, Target } from "lucide-react";
import { Logo } from "@/components/brand";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/session";

const FEATURES = [
  { icon: FileUp, title: "Seu material, sem limite", text: "Envie quantos PDFs quiser — inclusive escaneados. A IA lê, organiza em assuntos e cita a página de origem." },
  { icon: CalendarClock, title: "Plano que cabe no seu dia", text: "15 minutos ou 4 horas: o plano divide o conteúdo em sessões do seu tamanho, até a data da prova." },
  { icon: BookOpen, title: "Sessões de estudo prontas", text: "Texto explicativo, destaques, perguntas para responder sem consultar e questões objetivas." },
  { icon: RotateCcw, title: "Revisão espaçada", text: "Revisões automáticas em 1, 7, 15 e 30 dias. O que você erra volta mais vezes." },
  { icon: Target, title: "Banco de erros", text: "Toda questão errada vai para o seu caderno de erros, com a explicação da resposta certa." },
  { icon: Brain, title: "Para todo estudante", text: "Fundamental, médio, ENEM, faculdade, concurso ou estudo livre — a IA ajusta linguagem e estilo." },
];

export default async function Home() {
  if (await getCurrentUser()) redirect("/inicio");
  return (
    <main className="mx-auto max-w-5xl px-4 pb-16">
      <header className="flex items-center justify-between py-5">
        <Logo />
        <div className="flex gap-2">
          <Link href="/entrar" className={buttonClass("ghost", "sm")}>Entrar</Link>
          <Link href="/cadastro" className={buttonClass("primary", "sm")}>Começar grátis</Link>
        </div>
      </header>
      <section className="py-14 text-center sm:py-20">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Envie seu material. A IA monta seu <span className="text-primary">plano de estudo</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Do ensino fundamental ao concurso público: textos de estudo, perguntas e revisões feitos a partir dos seus PDFs, no tempo que você tem.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/cadastro" className={buttonClass("primary", "lg")}>Testar 3 dias grátis</Link>
          <span className="text-sm text-muted">Depois, planos a partir de R$ 9,90/semana ou R$ 29,90/mês.</span>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <Card key={f.title}>
            <f.icon className="text-primary" size={22} />
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted">{f.text}</p>
          </Card>
        ))}
      </section>
      <footer className="mt-16 flex justify-center gap-4 text-sm text-muted">
        <Link href="/termos">Termos de uso</Link>
        <Link href="/privacidade">Privacidade</Link>
      </footer>
    </main>
  );
}
