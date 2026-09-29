import Link from "next/link";
import { AuthShell } from "@/components/brand";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { ConsentButton } from "./consent-button";

export const metadata = { title: "Autorização do responsável" };

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const consent = await db.guardianConsent.findUnique({ where: { token }, include: { user: true } });
  if (!consent || consent.revokedAt) {
    return (
      <AuthShell title="Link inválido">
        <p className="text-sm text-muted">Este link não é válido ou já foi substituído por um pedido mais recente.</p>
      </AuthShell>
    );
  }
  return (
    <AuthShell title="Autorização do responsável" subtitle={`Pedido de ${consent.user.name} (@${consent.user.handle})`}>
      <Card className="space-y-3 text-sm leading-relaxed">
        <p>Olá, {consent.guardianName}. O Eduvia é uma plataforma de estudos: o aluno envia os próprios materiais e a inteligência artificial cria plano de estudo, textos, perguntas e revisões.</p>
        <p><strong>Dados que tratamos:</strong> nome, e-mail, data de nascimento, @ de usuário, os materiais enviados e o histórico de estudo (respostas, desempenho, tempo de estudo).</p>
        <p><strong>Para quê:</strong> exclusivamente para oferecer o serviço de estudo. Não vendemos dados nem exibimos publicidade direcionada. Os materiais são processados por provedores de IA contratados apenas para gerar o conteúdo de estudo.</p>
        <p><strong>Seus direitos:</strong> você pode pedir acesso, correção, exportação ou exclusão dos dados, e revogar esta autorização a qualquer momento pelo e-mail de suporte.</p>
        <p>Leia os <Link href="/termos" className="text-primary underline">termos de uso</Link> e a <Link href="/privacidade" className="text-primary underline">política de privacidade</Link>.</p>
        {consent.grantedAt ? (
          <p className="rounded-lg bg-success/15 p-3 font-medium text-success">Autorização registrada. Obrigado!</p>
        ) : (
          <ConsentButton token={token} />
        )}
      </Card>
    </AuthShell>
  );
}
