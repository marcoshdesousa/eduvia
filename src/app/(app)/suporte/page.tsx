import { LifeBuoy } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { markStaffRepliesRead, supportThread } from "@/lib/support";
import { sendSupportAction } from "@/app/actions/support";
import { SupportChat } from "@/components/support-chat";

export const metadata = { title: "Suporte" };

export default async function Page() {
  const user = await requireReadyUser();
  const messages = await supportThread(user.id);
  await markStaffRepliesRead(user.id);
  const at = (d: Date) => d.toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: user.timezone });
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold"><LifeBuoy className="text-primary" /> Suporte</h1>
        <p className="text-sm text-muted">Dúvida, problema ou sugestão? Escreva aqui. A equipe do Eduvia responde nesta conversa e você recebe um aviso.</p>
      </div>
      <SupportChat
        messages={messages.map((m) => ({ id: m.id, body: m.body, mine: !m.fromStaff, author: m.fromStaff ? "Equipe Eduvia" : "Você", at: at(m.createdAt) }))}
        action={sendSupportAction}
        placeholder="Escreva sua mensagem..."
        empty="Nenhuma mensagem ainda. Conte como podemos ajudar!"
      />
    </div>
  );
}
