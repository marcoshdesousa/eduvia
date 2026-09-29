"use client";
import { useState, useTransition } from "react";
import { grantConsentAction } from "@/app/actions/account";
import { Button } from "@/components/ui/button";

export function ConsentButton({ token }: { token: string }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ ok?: boolean; error?: string } | null>(null);
  if (result?.ok) return <p className="rounded-lg bg-success/15 p-3 font-medium text-success">Autorização registrada. Obrigado!</p>;
  return (
    <div className="space-y-2">
      {result?.error && <p className="text-danger">{result.error}</p>}
      <Button className="w-full" disabled={pending} onClick={() => start(async () => setResult(await grantConsentAction(token)))}>
        Sou pai/mãe ou responsável legal e autorizo
      </Button>
    </div>
  );
}
