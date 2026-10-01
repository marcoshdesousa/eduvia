"use client";
import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button, buttonClass } from "@/components/ui/button";

/** Se algo falhar numa tela, o aluno vê um aviso calmo e pode tentar de novo, sem perder o resto do app. */
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="mx-auto max-w-md space-y-4 py-16 text-center">
      <div className="text-5xl" aria-hidden>🦊</div>
      <h1 className="text-xl font-bold">Ops, essa tela demorou a responder</h1>
      <p className="text-sm text-muted">Seus dados estão salvos. Tente de novo em alguns segundos; se continuar, volte ao início.</p>
      <div className="flex justify-center gap-2">
        <Button onClick={reset}><RefreshCw size={16} /> Tentar de novo</Button>
        <Link href="/inicio" className={buttonClass("outline", "md")}>Ir para o início</Link>
      </div>
    </div>
  );
}
