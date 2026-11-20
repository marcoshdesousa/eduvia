// Rotinas que rodam no próprio servidor do site (sem processo separado nem fila):
// - a cada 10 segundos: Contrate rápido (tocar a próxima rodada, cancelar quem não chegou em 2 horas);
// - a cada 5 minutos: expirar pedidos sem resposta, lembretes, conferir Pix, vencimentos e apagar endereços antigos.
import "./process-guards";

const g = globalThis as unknown as { diariapagaCron?: boolean; quickBusy?: boolean };

async function quick() {
  if (g.quickBusy) return;
  g.quickBusy = true;
  try {
    const { quickSweep } = await import("./lib/bookings");
    await quickSweep();
  } catch (e) {
    console.error("[rotina] contrate rápido:", e);
  } finally {
    g.quickBusy = false;
  }
}

async function tick() {
  const { expireSweep, reminderSweep, agendaReminderSweep, purgeAddresses } = await import("./lib/bookings");
  const { subscriptionSweep } = await import("./lib/subscription");
  const jobs: [string, () => Promise<unknown>][] = [
    ["expirar pedidos", () => expireSweep()],
    ["lembretes", () => reminderSweep()],
    ["lembretes da agenda", () => agendaReminderSweep()],
    ["planos e pagamentos", () => subscriptionSweep()],
    ["endereços antigos", () => purgeAddresses()],
  ];
  for (const [name, job] of jobs) await job().catch((e: unknown) => console.error(`[rotina] ${name}:`, e));
}

if (!g.diariapagaCron && process.env.NODE_ENV === "production" && process.env.DISABLE_CRON !== "true") {
  g.diariapagaCron = true;
  setInterval(() => void quick(), 10_000).unref();
  setTimeout(() => void tick(), 20_000);
  setInterval(() => void tick(), 5 * 60_000).unref();
}
