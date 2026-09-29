import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { formatBRL } from "@/lib/billing";
import { isSimulatedPayments, paymentProvider } from "@/lib/payments";
import { formatDay } from "@/lib/core/dates";
import { Card } from "@/components/ui/card";
import { PaymentWatcher } from "./payment-watcher";

export const metadata = { title: "Pagamento" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireReadyUser({ allowWithoutAccess: true });
  const { id } = await params;
  const payment = await db.payment.findFirst({ where: { id, subscription: { userId: user.id } }, include: { subscription: { include: { plan: true } } } });
  if (!payment) notFound();

  const open = payment.status === "PENDING" || payment.status === "OVERDUE";
  const pix = open && payment.billingType === "PIX" ? await paymentProvider().getPixCode(payment.providerPaymentId).catch(() => null) : null;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/assinatura" className="text-sm text-muted hover:text-foreground">← Assinatura</Link>
      <div>
        <h1 className="text-2xl font-bold">Plano {payment.subscription.plan.name}</h1>
        <p className="text-sm text-muted">
          {formatBRL(payment.valueCents)} · vencimento {formatDay(payment.dueDate, { day: "2-digit", month: "long" })}
        </p>
      </div>
      <Card>
        <PaymentWatcher
          paymentId={payment.id}
          initialStatus={payment.status}
          billingType={payment.billingType}
          pix={pix}
          invoiceUrl={payment.invoiceUrl}
          simulated={isSimulatedPayments()}
        />
      </Card>
    </div>
  );
}
