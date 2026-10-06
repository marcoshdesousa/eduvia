import Link from "next/link";
import { CalendarDays, Clock, Info } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { ENEM_EXAMS } from "@/lib/enem/catalog";
import { ensureEnemCatalog } from "@/lib/enem/bank";
import { Card, CardTitle } from "@/components/ui/card";
import { StartEnemExam } from "./enem-exam-picker";

export const metadata = { title: "Simulado ENEM" };

const hours = (min: number) => `${Math.floor(min / 60)}h${min % 60 ? String(min % 60).padStart(2, "0") : ""}`;
const count = (k: keyof typeof ENEM_EXAMS) => ENEM_EXAMS[k].parts.reduce((s, p) => s + p.count, 0);

export default async function Page() {
  await requireReadyUser();
  await ensureEnemCatalog();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/simulados" className="text-sm text-muted hover:text-foreground">← Simulados</Link>
        <h1 className="mt-2 text-2xl font-bold">Simulado ENEM</h1>
        <p className="text-sm text-muted">Questões reais das provas do ENEM (2009 a 2023), com a quantidade de questões e o tempo da prova de verdade. Pode terminar antes; quando o tempo acaba, a prova é entregue sozinha.</p>
      </div>

      <Card className="flex gap-3 text-sm">
        <Info size={18} className="mt-0.5 shrink-0 text-primary" />
        <p className="text-muted">
          O ENEM tem <strong className="text-foreground">dois dias de prova</strong>. No 1º dia: 5 questões de língua estrangeira (inglês ou espanhol, você escolhe),
          40 de Linguagens e 45 de Ciências Humanas, mais a redação, em 5h30. No 2º dia: 45 de Ciências da Natureza e 45 de Matemática, em 5h.
          Aqui o tempo é o mesmo do ENEM, mesmo sem a redação (treine a redação na aba Redação). As questões erradas vão para o banco de erros.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="space-y-3">
          <CardTitle className="flex items-center gap-2"><CalendarDays size={18} className="text-primary" /> 1º dia</CardTitle>
          <ul className="space-y-1 text-sm text-muted">
            <li>5 de língua estrangeira + 40 de Linguagens</li>
            <li>45 de Ciências Humanas</li>
            <li className="flex items-center gap-1 font-medium text-foreground"><Clock size={14} /> {count("dia1-ingles")} questões · {hours(ENEM_EXAMS["dia1-ingles"].minutes)}</li>
          </ul>
          <StartEnemExam kind="dia1-ingles" label="1º dia com Inglês" />
          <StartEnemExam kind="dia1-espanhol" label="1º dia com Espanhol" variant="outline" />
        </Card>
        <Card className="space-y-3">
          <CardTitle className="flex items-center gap-2"><CalendarDays size={18} className="text-primary" /> 2º dia</CardTitle>
          <ul className="space-y-1 text-sm text-muted">
            <li>45 de Ciências da Natureza</li>
            <li>45 de Matemática</li>
            <li className="flex items-center gap-1 font-medium text-foreground"><Clock size={14} /> {count("dia2")} questões · {hours(ENEM_EXAMS.dia2.minutes)}</li>
          </ul>
          <StartEnemExam kind="dia2" label="Fazer o 2º dia" />
        </Card>
      </div>

      <Card className="space-y-3">
        <CardTitle>Por área</CardTitle>
        <p className="text-sm text-muted">Só uma parte da prova: as 45 questões da área, com metade do tempo do dia dela.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {(["linguagens-ingles", "linguagens-espanhol", "humanas", "natureza", "matematica"] as const).map((k) => (
            <div key={k} className="rounded-lg border border-border p-3">
              <p className="text-sm font-medium">{ENEM_EXAMS[k].title.replace("Simulado ENEM — ", "")}</p>
              <p className="mb-2 text-xs text-muted">{count(k)} questões · {hours(ENEM_EXAMS[k].minutes)}</p>
              <StartEnemExam kind={k} label={`Fazer ${ENEM_EXAMS[k].title.replace("Simulado ENEM — ", "")}`} variant="outline" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
