"use client";
import { Fragment, useState } from "react";
import { CATEGORY_LABEL, type Annotation, type AnnotationCategory, type PlacedAnnotation } from "@/lib/core/essay";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Cor por gravidade: norma (vermelho), organização do texto (amarelo), tema/estilo (roxo). Sempre com o rótulo escrito.
const TONE: Record<AnnotationCategory, "danger" | "warning" | "primary"> = {
  ORTOGRAFIA: "danger",
  PONTUACAO: "danger",
  CONCORDANCIA: "danger",
  COESAO: "warning",
  COERENCIA: "warning",
  ESTRUTURA: "warning",
  TEMA: "primary",
  ESTILO: "primary",
};
const MARK: Record<"danger" | "warning" | "primary", string> = {
  danger: "bg-danger/20 decoration-danger",
  warning: "bg-warning/20 decoration-warning",
  primary: "bg-primary/20 decoration-primary",
};

export function AnnotatedEssay({ text, annotations, unplaced }: { text: string; annotations: PlacedAnnotation[]; unplaced: Annotation[] }) {
  const [active, setActive] = useState<number | null>(null);
  const pieces: React.ReactNode[] = [];
  let cursor = 0;
  annotations.forEach((a, i) => {
    if (a.start > cursor) pieces.push(<Fragment key={`t${i}`}>{text.slice(cursor, a.start)}</Fragment>);
    pieces.push(
      <mark
        key={`m${i}`}
        id={`marca-${i}`}
        onClick={() => {
          setActive(i);
          document.getElementById(`nota-${i}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }}
        className={cn("cursor-pointer rounded px-0.5 text-foreground underline decoration-2 underline-offset-4", MARK[TONE[a.category]], active === i && "ring-2 ring-ring")}
      >
        {text.slice(a.start, a.end)}
        <sup className="ml-0.5 text-[10px] font-bold text-muted">{i + 1}</sup>
      </mark>,
    );
    cursor = a.end;
  });
  if (cursor < text.length) pieces.push(<Fragment key="end">{text.slice(cursor)}</Fragment>);

  const counts = annotations.reduce<Record<string, number>>((acc, a) => ({ ...acc, [a.category]: (acc[a.category] ?? 0) + 1 }), {});

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Card>
        <div className="mb-3 flex flex-wrap gap-2">
          {Object.entries(counts).map(([c, n]) => (
            <Badge key={c} tone={TONE[c as AnnotationCategory]}>{CATEGORY_LABEL[c as AnnotationCategory]}: {n}</Badge>
          ))}
          {!annotations.length && <span className="text-sm text-success">Nenhum problema marcado no texto.</span>}
        </div>
        <div className="whitespace-pre-wrap text-[15px] leading-8">{pieces}</div>
      </Card>
      <div className="space-y-3 lg:max-h-[80vh] lg:overflow-y-auto">
        {annotations.map((a, i) => (
          <Card
            key={i}
            id={`nota-${i}`}
            onClick={() => {
              setActive(i);
              document.getElementById(`marca-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className={cn("cursor-pointer space-y-2 p-3 text-sm", active === i && "border-primary")}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted">{i + 1}</span>
              <Badge tone={TONE[a.category]}>{CATEGORY_LABEL[a.category]}</Badge>
            </div>
            <p><span className="text-danger line-through">{a.quote}</span> → <span className="font-medium text-success">{a.suggestion}</span></p>
            <p className="text-muted">{a.message}</p>
          </Card>
        ))}
        {unplaced.length > 0 && (
          <Card className="space-y-2 p-3 text-sm">
            <CardTitle className="text-sm">Outras observações</CardTitle>
            {unplaced.map((a, i) => (
              <p key={i}><Badge tone={TONE[a.category]}>{CATEGORY_LABEL[a.category]}</Badge> {a.message} {a.suggestion && <span className="text-success">Sugestão: {a.suggestion}</span>}</p>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
