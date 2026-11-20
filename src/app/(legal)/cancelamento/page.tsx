import type { Metadata } from "next";
import { ARRIVE_HOURS, CLIENT_BLOCK_DAYS, CLIENT_NOSHOW_WAIT_MIN, PRO_QUICK_BAN_DAYS, UNLOCK_FEE_CENTS, formatBRL } from "@/lib/domain";

export const metadata: Metadata = { title: "Cancelamento e penalidades" };

export default function Cancellation() {
  return (
    <>
      <h1>Cancelamento e penalidades</h1>
      <p>O Diária Paga não cobra taxa por contratação e não recebe o pagamento do serviço. Por isso não existe reembolso de taxa de serviço.</p>
      <h2>Pedido normal (com data marcada)</h2>
      <ul>
        <li><strong>Antes do aceite</strong>: o cliente pode cancelar a qualquer momento, sem custo.</li>
        <li><strong>Depois do aceite</strong>: cliente ou prestador podem cancelar informando o motivo. Fica registrado quem cancelou, quando e por quê. Cancelamentos frequentes podem levar à revisão da conta.</li>
      </ul>
      <h2>Contrate rápido</h2>
      <ul>
        <li>Enquanto procura prestador, o cliente pode cancelar o chamado sem custo.</li>
        <li><strong>Prestador que não chega</strong>: quem aceita tem {ARRIVE_HOURS} horas para chegar. Passado esse prazo, o chamado é cancelado automaticamente e o prestador fica {PRO_QUICK_BAN_DAYS} dias sem receber chamados do Contrate rápido (os pedidos normais continuam).</li>
        <li><strong>Cliente que não está no endereço</strong>: o prestador marca que chegou e, depois de {CLIENT_NOSHOW_WAIT_MIN} minutos tentando contato pelo chat, pode registrar que o cliente não estava. O cliente escolhe: ficar {CLIENT_BLOCK_DAYS} dias sem contratar, ou pagar {formatBRL(UNLOCK_FEE_CENTS)} para liberar a conta na hora.</li>
        <li>Penalidades injustas podem ser revistas pelo suporte.</li>
      </ul>
      <h2>Pagamento do serviço</h2>
      <p>Se já foi pago direto ao prestador, cliente e prestador combinam uma eventual devolução entre si. O suporte ajuda a mediar. O Diária Paga não devolve valores que não recebeu.</p>
      <h2>Planos do prestador</h2>
      <p>Cada mensalidade vale 30 dias e não renova sozinha: o prestador paga por Pix quando quiser continuar. Pacotes de endereços podem ser retirados a qualquer momento e deixam de ser cobrados na mensalidade seguinte. Cobrança indevida ou falha da plataforma: fale com o suporte.</p>
      <p>Esta política não elimina nenhum direito garantido pelo Código de Defesa do Consumidor.</p>
    </>
  );
}
