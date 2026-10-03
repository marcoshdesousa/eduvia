"use client";
import { useState, useTransition } from "react";
import { testVoiceAction, type VoiceTestResult } from "@/app/actions/ai";
import { Button } from "@/components/ui/button";

/** Botão do admin: testa a voz do robô no servidor e mostra o resultado (ou o erro real). */
export function VoiceTest() {
  const [result, setResult] = useState<VoiceTestResult | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="space-y-2">
      <Button size="sm" variant="outline" disabled={pending} onClick={() => start(async () => setResult(await testVoiceAction()))}>
        {pending ? "Testando a voz... (a 1ª vez pode levar 1 minuto)" : "Testar voz do robô"}
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
