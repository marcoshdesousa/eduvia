"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Trophy } from "lucide-react";
import { answerGameAction, finishGameAction, startGameAction, type GameResult } from "@/app/actions/games";
import { GAME_COMPONENTS } from "@/games/components";
import type { GameMeta } from "@/games/catalog";
import type { GameEndReason, GameQuestion } from "@/games/types";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, Stat } from "@/components/ui/card";
import { Field, FormError, Select } from "@/components/ui/form";

type Prep = { id: string; title: string; subjects: { id: string; name: string }[] };
const REASON: Record<GameEndReason, string> = {
  caught: "A cobra te alcançou!",
  errors: "Você atingiu o limite de erros.",
  finished: "Você respondeu todas as perguntas! 🎉",
  quit: "Partida encerrada.",
};

export function GamePlayer({ game, preparations }: { game: GameMeta; preparations: Prep[] }) {
  const [prepId, setPrepId] = useState(preparations[0].id);
  const [subjectId, setSubjectId] = useState("");
  const [config, setConfig] = useState<Record<string, string>>(Object.fromEntries(game.configFields.map((f) => [f.key, f.default])));
  const [run, setRun] = useState<{ runId: string; questions: GameQuestion[]; config: Record<string, string> } | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [error, setError] = useState<{ message: string; upgrade?: boolean } | null>(null);
  const [pending, start] = useTransition();
  const prep = preparations.find((p) => p.id === prepId)!;
  const Game = GAME_COMPONENTS[game.slug];

  const play = () =>
    start(async () => {
      setError(null);
      setResult(null);
      const res = await startGameAction({ slug: game.slug, preparationId: prepId, subjectId: subjectId || null, config });
      if ("error" in res) setError({ message: res.error, upgrade: res.upgrade });
      else setRun(res);
    });

  if (run && !result) {
    return (
      <Card>
        <Game
          key={run.runId}
          questions={run.questions}
          config={run.config}
          onAnswer={(qid, answer, timeMs) => answerGameAction(run.runId, qid, answer, timeMs)}
          onFinish={async (reason) => setResult(await finishGameAction(run.runId, reason))}
        />
      </Card>
    );
  }

  if (result) {
    return (
      <div className="space-y-4">
        <Card className="text-center">
          {result.isRecord && <p className="mb-2 inline-flex items-center gap-2 font-semibold text-warning"><Trophy size={18} /> Novo recorde!</p>}
          <p className="text-lg font-semibold">{REASON[result.reason]}</p>
          <p className="mt-1 text-4xl font-extrabold text-primary">{result.score}</p>
          <p className="text-sm text-muted">pontos · recorde {result.best}</p>
        </Card>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Acertos" value={result.correct} />
          <Stat label="Erros" value={result.wrong} hint={result.wrong ? "foram para o banco de erros" : undefined} />
          <Stat label="Tempo médio" value={result.avgTimeMs ? `${(result.avgTimeMs / 1000).toFixed(1)}s` : "—"} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => { setRun(null); play(); }} disabled={pending}>Jogar de novo</Button>
          {result.wrong > 0 && <Link href="/revisoes?filtro=erros" className={buttonClass("outline")}>Ver banco de erros</Link>}
        </div>
      </div>
    );
  }

  return (
    <Card className="space-y-4">
      <p className="text-sm text-muted">{game.description} Quanto mais rápido você acerta, mais pontos ganha.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Preparação" htmlFor="prep">
          <Select id="prep" value={prepId} onChange={(e) => { setPrepId(e.target.value); setSubjectId(""); }}>
            {preparations.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </Select>
        </Field>
        <Field label="Assunto" htmlFor="subject">
          <Select id="subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="">Tudo o que já estudei</option>
            {prep.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </Field>
        {game.configFields.map((f) => (
          <Field key={f.key} label={f.label} htmlFor={f.key}>
            <Select id={f.key} value={config[f.key]} onChange={(e) => setConfig((c) => ({ ...c, [f.key]: e.target.value }))}>
              {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          </Field>
        ))}
      </div>
      {error && (
        <div className="space-y-1">
          <FormError message={error.message} />
          {error.upgrade && /Assine|não fazem parte/.test(error.message) && <Link href="/assinatura" className="text-sm font-semibold text-primary">Assinar plano</Link>}
        </div>
      )}
      <Button size="lg" className="w-full" onClick={play} disabled={pending}>
        {pending ? <><Loader2 size={18} className="animate-spin" /> Preparando perguntas...</> : "Começar"}
      </Button>
    </Card>
  );
}
