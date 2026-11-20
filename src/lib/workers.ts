// Conta de trabalhador: celular (privado) + teste grátis. Os perfis (um por profissão) ele cria depois em "Meu perfil".
import { db } from "@/lib/db";
import { notify } from "@/lib/notifications";
import { sealSecret } from "@/lib/secret-box";
import { startTrialIfEligible } from "@/lib/subscription";

export class WorkerError extends Error {}

export function checkPhone(raw: string) {
  const phone = raw.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (!/^\d{10,11}$/.test(phone)) throw new WorkerError("Informe o seu WhatsApp com DDD.");
  return phone;
}

/** Transforma a conta em trabalhador (a mesma conta continua servindo para contratar). Devolve se ganhou o teste grátis. */
export async function becomeWorker(user: { id: string; cpfHash: string }, phone: string) {
  const existing = await db.providerProfile.findUnique({ where: { userId: user.id } });
  const pro =
    existing ??
    (await db.providerProfile.create({
      data: {
        userId: user.id,
        phoneSealed: sealSecret(phone),
        // horário padrão: segunda a sábado, 7h às 18h (ele muda na agenda)
        availability: { create: [1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, startMin: 7 * 60, endMin: 18 * 60 })) },
        quickReplies: { create: ["Olá! Tudo bem? Como posso ajudar?", "Estou a caminho 🚗", "Chego em 30 minutos", "Cheguei! Estou na porta", "Serviço concluído. Obrigado pela preferência!"].map((text) => ({ text })) },
      },
    }));
  const trial = await startTrialIfEligible(pro.id, user.cpfHash);
  await notify(user.id, trial
    ? { title: "Conta de trabalhador criada 🎉", body: "Você tem 3 dias grátis. Crie o seu primeiro perfil (uma profissão) para aparecer para os clientes.", href: "/painel/perfil/novo" }
    : { title: "Conta de trabalhador criada", body: "Este CPF já usou o teste grátis. Escolha um plano para usar a área de trabalho.", href: "/painel/plano" });
  return { pro, trial };
}
