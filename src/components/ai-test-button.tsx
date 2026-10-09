"use client";
import { useState, useTransition } from "react";
import { testAiAction, type AiTestResult } from "@/app/actions/ai";
import { Button } from "@/components/ui/button";

/** Botão "Testar agora": faz uma chamada pequena e mostra se deu certo (e, para admins, o erro exato do Google). */
export function AiTestButton() {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<AiTestResult | null>(null);
  return (
    <div className="space-y-2">
      <Button variant="outline" disabled={pending} onClick={() => start(async () => setResult(await testAiAction()))}>
        {pending ? "Testando..." : "Testar agora"}
      </Button>
      {result?.ok && (
        <p className="rounded-lg border border-success/40 bg-success/10 p-3 text-sm">
          ✅ Funcionando ({(result.ms / 1000).toFixed(1)} s{result.models[0] ? ` · ${result.models[0]}` : ""}): “{result.text}”
        </p>
      )}
      {result && !result.ok && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
          <p>❌ {result.error}</p>
          {result.details && <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-foreground/80">{result.details}</pre>}
        </div>
      )}
    </div>
  );
}
