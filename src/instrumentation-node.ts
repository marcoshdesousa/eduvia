// Rotinas que rodam no próprio servidor do site, a cada 5 minutos (sem processo separado nem fila):
// expirar solicitações sem resposta, lembretes de serviço, conferir Pix pendentes, avisar vencimento da
// assinatura e apagar endereços antigos (privacidade).
import "./process-guards";

const g = globalThis as unknown as { horalimpCron?: boolean };

async function tick() {
  const { expireSweep, reminderSweep, purgeAddresses } = await import("./lib/bookings");
  const { subscriptionSweep } = await import("./lib/subscription");
  const jobs: [string, () => Promise<unknown>][] = [
    ["expirar pedidos", () => expireSweep()],
    ["lembretes", () => reminderSweep()],
    ["assinaturas", () => subscriptionSweep()],
    ["endereços antigos", () => purgeAddresses()],
  ];
  for (const [name, job] of jobs) await job().catch((e: unknown) => console.error(`[rotina] ${name}:`, e));
}

if (!g.horalimpCron && process.env.NODE_ENV === "production" && process.env.DISABLE_CRON !== "true") {
  g.horalimpCron = true;
  setTimeout(() => void tick(), 20_000);
  setInterval(() => void tick(), 5 * 60_000).unref();
}
