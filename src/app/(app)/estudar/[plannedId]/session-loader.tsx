"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { startSessionAction } from "@/app/actions/study";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const STEPS = ["Lendo os trechos do seu material", "Escrevendo o texto de estudo", "Separando os pontos-chave", "Criando as perguntas"];

export function SessionLoader({ plannedId, header }: { plannedId: string; header: { topic: string; subject: string; label: string } }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const started = useRef(false);

  const start = async () => {
    setError(null);
    const res = await startSessionAction(plannedId);
    if ("error" in res) setError(res.error);
    else router.refresh();
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    start();
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 6000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm text-muted">{header.subject} · {header.label}</p>
      <h1 className="text-2xl font-bold">{header.topic}</h1>
      <Card className="mt-6 text-center">
        {error ? (
          <>
            <p className="text-danger">{error}</p>
            <Button className="mt-4" onClick={start}>Tentar de novo</Button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto animate-spin text-primary" size={28} />
            <p className="mt-3 font-medium">Preparando sua sessão...</p>
            <p className="mt-1 text-sm text-muted">{STEPS[step]}</p>
          </>
        )}
      </Card>
    </div>
  );
}
