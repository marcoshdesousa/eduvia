import Link from "next/link";
import type { Metadata } from "next";
import { PageTitle } from "@/components/bits";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CLIENT_BLOCK_DAYS, UNLOCK_FEE_CENTS, formatBRL } from "@/lib/domain";
import { requireUser } from "@/lib/session";
import { clientBlock } from "@/lib/subscription";
import { UnlockBox } from "./unlock-box";

export const metadata: Metadata = { title: "Liberar conta" };

export default async function UnlockPage() {
  const user = await requireUser("/desbloquear");
  const block = await clientBlock(user.cpfHash);
  return (
    <div className="mx-auto max-w-md space-y-4">
      <PageTitle title="Liberar minha conta" />
      {block ? (
        <Card className="space-y-4">
          <p className="text-sm">{block.reason ?? "Um prestador foi até o endereço do Contrate rápido e você não estava."}</p>
          <p className="text-sm">Você pode escolher:</p>
          <div className="rounded-xl border border-border p-3 text-sm">
            <p className="font-semibold">Esperar</p>
            <p className="text-muted">Volta a contratar em {block.until.toLocaleDateString("pt-BR", { dateStyle: "long" })} ({CLIENT_BLOCK_DAYS} dias).</p>
          </div>
          <div className="space-y-3 rounded-xl border-2 border-primary p-3 text-sm">
            <p className="font-semibold">Liberar agora por {formatBRL(UNLOCK_FEE_CENTS)}</p>
            <UnlockBox label={`Pagar ${formatBRL(UNLOCK_FEE_CENTS)} com Pix`} askPhone={!user.provider} />
          </div>
        </Card>
      ) : (
        <Card className="space-y-3">
          <p>Sua conta está liberada. ✅</p>
          <Link href="/inicio" className={buttonClass("primary")}>Ir para o início</Link>
        </Card>
      )}
    </div>
  );
}
