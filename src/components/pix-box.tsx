"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { Check, Copy, Loader2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form";

export type PixStart = () => Promise<{ paymentId?: string; error?: string }>;

/** Gera um Pix (pela server action recebida), mostra QR Code + copia e cola e espera o banco confirmar. */
export function PixBox({ start, label, paidText = "Pagamento confirmado!", variant = "primary" }: { start: PixStart; label: string; paidText?: string; variant?: "primary" | "secondary" }) {
  const router = useRouter();
  const [payment, setPayment] = useState<{ id: string; pixCode: string } | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [pending, run] = useTransition();

  useEffect(() => {
    if (payment?.pixCode) void QRCode.toDataURL(payment.pixCode, { margin: 1, width: 240 }).then(setQr).catch(() => setQr(null));
  }, [payment?.pixCode]);

  useEffect(() => {
    if (!payment || paid) return;
    const t = setInterval(async () => {
      const r = await fetch(`/api/pix/${payment.id}`).then((x) => x.json()).catch(() => null);
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

  if (paid) return <p className="rounded-xl bg-success/10 p-3 text-sm font-medium text-success">{paidText}</p>;

  if (!payment) {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          size="lg"
          variant={variant}
          className="w-full"
          disabled={pending}
          onClick={() =>
            run(async () => {
              setError(null);
              const r = await start();
              if (r.error || !r.paymentId) return setError(r.error ?? "Não foi possível gerar o Pix.");
              const s = await fetch(`/api/pix/${r.paymentId}`).then((x) => x.json()).catch(() => null);
              if (s?.status === "PAID") {
                setPaid(true);
                router.refresh();
              } else if (s?.pixCode) setPayment({ id: r.paymentId, pixCode: s.pixCode });
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
      <p className="text-sm">Pague no app do seu banco: leia o QR Code ou use o Pix Copia e Cola.</p>
      {qr && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qr} alt="QR Code do Pix" width={220} height={220} className="mx-auto rounded-xl bg-white p-2" />
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
      <p className="flex items-center gap-2 text-xs text-muted"><Loader2 size={14} className="animate-spin" /> Esperando o banco confirmar… pode deixar esta tela aberta.</p>
      <FormError message={error} />
    </div>
  );
}
