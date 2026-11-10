import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de cancelamento" };

export default function Cancellation() {
  return (
    <>
      <h1>Política de cancelamento</h1>
      <p>A HoraLimp não cobra taxa por contratação e não recebe o pagamento da limpeza. Por isso não existe reembolso de taxa de serviço.</p>
      <ul>
        <li><strong>Antes do aceite</strong>: o cliente pode cancelar a solicitação a qualquer momento, sem custo nenhum da plataforma.</li>
        <li><strong>Depois do aceite</strong>: cliente ou profissional podem cancelar informando o motivo. Fica registrado quem cancelou, quando e por quê. Cancelamentos frequentes ou de última hora podem levar à revisão da conta.</li>
        <li><strong>Pagamento do serviço</strong>: se já foi pago direto ao profissional, cliente e profissional combinam uma eventual devolução entre si. O suporte ajuda a mediar quando necessário. A HoraLimp não devolve valores que não recebeu.</li>
        <li><strong>Assinatura do profissional</strong>: vale por 30 dias a partir do pagamento e não renova sozinha. O profissional pode deixar de renovar quando quiser. Cobrança indevida ou falha da plataforma: fale com o suporte, e a correção é feita quando comprovada.</li>
      </ul>
      <p>Esta política não elimina nenhum direito garantido pelo Código de Defesa do Consumidor.</p>
    </>
  );
}
