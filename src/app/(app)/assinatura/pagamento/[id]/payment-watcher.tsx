"use client";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, ExternalLink, Loader2 } from "lucide-react";
import { simulatePaymentAction } from "@/app/actions/billing";
import { Button, buttonClass } from "@/components/ui/button";

type Status = "PENDING" | "PAID" | "OVERDUE" | "REFUNDED" | "CANCELED";

export function PaymentWatcher({
  paymentId,
  initialStatus,
  billingType,
  pix,
  invoiceUrl,
  simulated,
}: {
  paymentId: string;
  initialStatus: Status;
  billingType: "PIX" | "CREDIT_CARD";
  pix: { image: string | null; payload: string; expiresAt: string | null } | null;
  invoiceUrl: string | null;
  simulated: boolean;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();
  const open = status === "PENDING" || status === "OVERDUE";

  useEffect(() => {
    if (!open) return;
    const t = setInterval(async () => {
      const res = await fetch(`/api/assinatura/pagamento/${paymentId}`, { cache: "no-store" });
      if (res.ok) setStatus(((await res.json()) as { status: Status }).status);
    }, 5000);
    return () => clearInterval(t);
  }, [open, paymentId]);

  if (status === "PAID") {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto text-success" size={40} />
        <p className="mt-3 text-lg font-semibold">Pagamento confirmado!</p>
        <p className="mt-1 text-sm text-muted">Sua assinatura está ativa. Bons estudos!</p>
        <Link href="/inicio" className={buttonClass("primary", "md", "mt-4")}>Ir para o início</Link>
      </div>
    );
  }
  if (!open) {
    return <p className="text-sm text-muted">Esta cobrança está {status === "REFUNDED" ? "estornada" : "cancelada"}. <Link href="/assinatura" className="text-primary">Voltar</Link></p>;
  }

  return (
    <div className="space-y-4">
      {billingType === "PIX" ? (
        pix ? (
          <>
            <p className="text-sm">Abra o app do seu banco, escolha <strong>Pix → Ler QR code</strong> ou use o <strong>Pix copia e cola</strong>:</p>
            {pix.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pix.image} alt="QR code Pix" className="mx-auto size-56 rounded-lg bg-white p-2" />
            )}
            <div className="flex gap-2">
              <input readOnly value={pix.payload} className="h-10 min-w-0 flex-1 truncate rounded-lg border border-border bg-surface-2 px-3 text-xs" aria-label="Pix copia e cola" />
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  await navigator.clipboard.writeText(pix.payload);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                <Copy size={16} /> {copied ? "Copiado!" : "Copiar"}
              </Button>
            </div>
          </>
        ) : invoiceUrl ? (
          <a href={invoiceUrl} target="_blank" rel="noreferrer" className={buttonClass("primary", "md", "w-full")}><ExternalLink size={16} /> Abrir cobrança Pix</a>
        ) : (
          <p className="text-sm text-muted">Gerando o Pix... atualize a página em instantes.</p>
        )
      ) : invoiceUrl ? (
        <>
          <p className="text-sm">Você vai para a página segura do Asaas para informar o cartão. As próximas renovações são cobradas automaticamente nele.</p>
          <a href={invoiceUrl} target="_blank" rel="noreferrer" className={buttonClass("primary", "md", "w-full")}><ExternalLink size={16} /> Pagar com cartão</a>
        </>
      ) : (
        <p className="text-sm text-muted">Cobrança por cartão criada.</p>
      )}
      <p className="flex items-center justify-center gap-2 text-sm text-muted">
        <Loader2 size={14} className="animate-spin" /> Aguardando a confirmação do pagamento...
      </p>
      {simulated && (
        <Button type="button" variant="outline" className="w-full" disabled={pending} onClick={() => start(async () => { await simulatePaymentAction(paymentId); setStatus("PAID"); })}>
          Simular pagamento (modo de desenvolvimento)
        </Button>
      )}
    </div>
  );
}
