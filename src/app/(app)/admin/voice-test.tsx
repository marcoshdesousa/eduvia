"use client";
import { useState, useTransition } from "react";
import { testVideoVoiceAction, testVoiceAction, type VoiceTestResult } from "@/app/actions/ai";
import { Button } from "@/components/ui/button";

/** Botões do admin: testam a voz do robô e a voz do vídeo no servidor e mostram o resultado (ou o erro real). */
export function VoiceTest() {
  return (
    <div className="space-y-3">
      <One label="Testar voz do robô" action={testVoiceAction} />
      <One label="Testar voz do vídeo" action={testVideoVoiceAction} />
    </div>
  );
}

function One({ label, action }: { label: string; action: () => Promise<VoiceTestResult> }) {
  const [result, setResult] = useState<VoiceTestResult | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="space-y-2">
      <Button size="sm" variant="outline" disabled={pending} onClick={() => start(async () => setResult(await action()))}>
        {pending ? "Testando a voz... (a 1ª vez pode levar 1 minuto)" : label}
      </Button>
      {result &&
        (result.ok ? (
          <p className="text-sm text-success">
            ✅ Voz funcionando ({result.voice}): {result.seconds}s de áudio em {(result.ms / 1000).toFixed(1)}s. Memória do site: {result.memoryMb} MB.
          </p>
        ) : (
          <p className="break-words text-sm text-danger">
            ❌ A voz falhou: {result.error} (memória do site: {result.memoryMb} MB)
          </p>
        ))}
    </div>
  );
}
