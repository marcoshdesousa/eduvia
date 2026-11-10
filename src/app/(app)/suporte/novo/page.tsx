import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Label, Select, Textarea } from "@/components/ui/form";
import { requireUser } from "@/lib/session";
import { openTicket } from "../actions";

export const metadata: Metadata = { title: "Novo chamado" };

const SUBJECTS = ["Problema com uma contratação", "Cancelamento", "Pagamento da assinatura", "Verificação do perfil", "Meus dados / excluir conta", "Denúncia ou segurança", "Sugestão", "Outro assunto"];

export default async function NewTicket({ searchParams }: { searchParams: Promise<{ pedido?: string; assunto?: string }> }) {
  await requireUser("/suporte/novo");
  const sp = await searchParams;
  const def = sp.assunto === "dados" ? "Meus dados / excluir conta" : sp.pedido ? "Problema com uma contratação" : "";
  return (
    <div className="space-y-4">
      <PageTitle title="Novo chamado" />
      <Card>
        <ActionForm action={openTicket} className="space-y-4">
          {sp.pedido && <input type="hidden" name="bookingId" value={sp.pedido} />}
          <div>
            <Label htmlFor="subject">Assunto</Label>
            <Select id="subject" name="subject" defaultValue={def} required>
              <option value="" disabled>Escolha</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="text">Mensagem</Label>
            <Textarea id="text" name="text" required minLength={5} maxLength={3000} placeholder="Conte o que aconteceu, com o máximo de detalhes." />
          </div>
          <SubmitButton pendingText="Enviando…">Enviar</SubmitButton>
        </ActionForm>
      </Card>
    </div>
  );
}
