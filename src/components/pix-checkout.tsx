"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Copy, Loader2, QrCode, X } from "lucide-react";
import { createPixAction, type PixResult } from "@/app/actions/billing";
import { Button } from "@/components/ui/button";

const brl = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Botão "Pagar com Pix": mostra o QR Code e o "copia e cola" e libera o plano sozinho quando o Pix cai. */
export function PixCheckout({ planSlug, label }: { planSlug: string; label: string }) {
  const router = useRouter();
  const [pix, setPix] = useState<Extract<PixResult, { ok: true }> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"pending" | "paid" | "failed">("pending");
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!pix || status !== "pending") return;
    const t = setInterval(async () => {
      const r = await fetch(`/api/billing/pix/${pix.paymentId}`, { cache: "no-store" }).catch(() => null);
      const j = r?.ok ? ((await r.json()) as { status: "pending" | "paid" | "failed" }) : null;
      if (j && j.status !== "pending") {
        setStatus(j.status);
        if (j.status === "paid") setTimeout(() => router.refresh(), 1500);
      }
    }, 4000);
    return () => clearInterval(t);
  }, [pix, status, router]);

  return (
    <>
      <Button
        className="w-full"
        disabled={pending}
        aria-label={label}
        onClick={() =>
          start(async () => {
            setError(null);
            const r = await createPixAction(planSlug);
            if (r.ok) {
              setPix(r);
              setStatus("pending");
            } else setError(r.error);
          })
        }
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />} {pending ? "Gerando o Pix..." : "Pagar com Pix"}
      </Button>
      {error && <p className="text-xs text-danger">{error}</p>}
      {pix && (
        <div role="dialog" aria-modal="true" aria-label="Pagamento por Pix" className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-sm space-y-3 rounded-2xl border border-border bg-surface p-5 text-center shadow-xl">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Plano {pix.planName} · {brl(pix.valueCents)}</p>
              <button type="button" onClick={() => setPix(null)} aria-label="Fechar" className="rounded-md p-1 text-muted hover:bg-surface-2"><X size={18} /></button>
            </div>
            {status === "paid" ? (
              <div className="space-y-2 py-6">
                <CheckCircle2 size={48} className="mx-auto text-success" />
                <p className="text-lg font-semibold">Pagamento confirmado!</p>
                <p className="text-sm text-muted">Seu plano {pix.planName} está liberado por 30 dias. Bons estudos!</p>
              </div>
            ) : status === "failed" ? (
              <p className="py-6 text-sm text-danger">Este Pix expirou ou foi cancelado. Feche e gere um novo.</p>
            ) : (
              <>
                <p className="text-sm text-muted">Abra o app do seu banco, escolha <strong>Pix → Ler QR Code</strong> ou use o <strong>Pix Copia e Cola</strong>.</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pix.qr} alt="QR Code do Pix" className="mx-auto size-56 rounded-lg bg-white p-2" />
                <div className="flex gap-2">
                  <input readOnly value={pix.pixCode} aria-label="Pix copia e cola" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-2 text-xs" onFocus={(e) => e.currentTarget.select()} />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await navigator.clipboard?.writeText(pix.pixCode).catch(() => {});
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    }}
                  >
                    <Copy size={14} /> {copied ? "Copiado!" : "Copiar"}
                  </Button>
                </div>
                <p className="flex items-center justify-center gap-2 text-xs text-muted"><Loader2 size={14} className="animate-spin" /> Esperando o pagamento. O plano libera sozinho assim que o Pix cair.</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
