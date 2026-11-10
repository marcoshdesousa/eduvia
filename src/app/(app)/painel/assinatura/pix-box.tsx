"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { Check, Copy, Loader2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form";
import { startPix } from "../actions";

type Open = { id: string; pixCode: string; createdAt: string } | null;

export function PixBox({ open, label }: { open: Open; label: string }) {
  const router = useRouter();
  const [payment, setPayment] = useState<{ id: string; pixCode: string } | null>(open);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (payment?.pixCode) void QRCode.toDataURL(payment.pixCode, { margin: 1, width: 240 }).then(setQr).catch(() => setQr(null));
  }, [payment?.pixCode]);

  // confere o pagamento a cada 5 segundos enquanto a tela está aberta
  useEffect(() => {
    if (!payment || paid) return;
    const t = setInterval(async () => {
      const r = await fetch(`/api/painel/pix/${payment.id}`).then((x) => x.json()).catch(() => null);
      if (r?.status === "PAID") {
        setPaid(true);
        router.refresh();
      } else if (r?.status === "FAILED") {
        setError("Este Pix não foi concluído. Gere outro.");
        setPayment(null);
      }
    }, 5000);
    return () => clearInterval(t);
  }, [payment, paid, router]);

  if (paid) return <p className="rounded-lg bg-success/10 p-3 text-sm font-medium text-success">Pagamento confirmado! Sua assinatura está ativa.</p>;

  if (!payment) {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={pending}
          onClick={() =>
            start(async () => {
              setError(null);
              const r = await startPix();
              if (r.error) return setError(r.error);
              const s = await fetch(`/api/painel/pix/${r.paymentId}`).then((x) => x.json()).catch(() => null);
              if (s?.pixCode) setPayment({ id: r.paymentId!, pixCode: s.pixCode });
              else setError("Não foi possível mostrar o Pix. Tente de novo.");
            })
          }
        >
          {pending ? <Loader2 size={18} className="animate-spin" /> : <QrCode size={18} />} {label}
        </Button>
        <FormError message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm">Pague com o app do seu banco: leia o QR Code ou use o Pix Copia e Cola.</p>
      {qr && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qr} alt="QR Code do Pix" width={220} height={220} className="mx-auto rounded-lg bg-white p-2" />
      )}
      <div className="flex gap-2">
        <input readOnly value={payment.pixCode} className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-surface-2 px-3 text-xs" aria-label="Pix Copia e Cola" onFocus={(e) => e.target.select()} />
        <Button
          type="button"
          variant="secondary"
          onClick={async () => {
            await navigator.clipboard.writeText(payment.pixCode).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copiado" : "Copiar"}
        </Button>
      </div>
      <p className="flex items-center gap-2 text-xs text-muted"><Loader2 size={14} className="animate-spin" /> Esperando a confirmação do banco… pode deixar esta tela aberta.</p>
      <FormError message={error} />
    </div>
  );
}
