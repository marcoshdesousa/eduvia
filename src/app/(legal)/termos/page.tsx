import type { Metadata } from "next";
import { ARRIVE_HOURS, CLIENT_BLOCK_DAYS, MAX_PLACES, PACK_CENTS, PACK_PLACES, PLANS, PRO_QUICK_BAN_DAYS, TRIAL_DAYS, UNLOCK_FEE_CENTS, formatBRL } from "@/lib/domain";

export const metadata: Metadata = { title: "Termos de uso" };

export default function Terms() {
  return (
    <>
      <h1>Termos de uso do Diária Paga</h1>
      <h2>1. O que é o Diária Paga</h2>
      <p>O Diária Paga é uma plataforma que aproxima clientes e prestadores de serviço autônomos (diaristas, pedreiros, cuidadores, babás, eletricistas e outros). O Diária Paga não presta os serviços, não é empregador dos prestadores e não recebe, retém, divide ou processa o pagamento dos serviços.</p>
      <h2>2. Conta</h2>
      <ul>
        <li>Cada pessoa pode ter uma única conta, ligada ao seu CPF. A mesma conta serve para contratar e, se quiser, para oferecer serviços.</li>
        <li>A pessoa pode apagar a própria conta. O CPF continua registrado de forma protegida apenas para impedir um novo teste grátis e manter penalidades em vigor.</li>
      </ul>
      <h2>3. Clientes</h2>
      <ul>
        <li>Contratar é grátis: sem mensalidade, comissão ou taxa por contratação.</li>
        <li>O pagamento do serviço é feito diretamente ao prestador, por Pix, em dinheiro ou no cartão, se o prestador tiver maquininha.</li>
      </ul>
      <h2>4. Prestadores e planos</h2>
      <ul>
        <li>É preciso ter 18 anos completos (declarado no cadastro). O trabalhador cria um perfil para cada profissão, define seus preços (por diária, por hora ou por serviço) e decide se aceita cada pedido. Todos os perfis usam o mesmo plano, agenda, mensagens e gestão financeira.</li>
        <li>Plano Completo: {formatBRL(PLANS.FULL.priceCents)} por mês ({formatBRL(PLANS.FULL.platformCents)} da plataforma + {formatBRL(PLANS.FULL.feesCents)} de impostos e taxas), com {PLANS.FULL.places} endereços de atendimento, prioridade na busca e selo Recomendado.</li>
        <li>Plano Básico: {formatBRL(PLANS.BASIC.priceCents)} por mês ({formatBRL(PLANS.BASIC.platformCents)} da plataforma + {formatBRL(PLANS.BASIC.feesCents)} de impostos e taxas), com {PLANS.BASIC.places} endereço de atendimento.</li>
        <li>No plano Completo, pacotes de +{PACK_PLACES} endereços custam {formatBRL(PACK_CENTS)} por mês cada, até {MAX_PLACES} endereços. O pacote é liberado na hora e cobrado na mensalidade seguinte; pode ser retirado a qualquer momento e deixa de ser cobrado na próxima mensalidade.</li>
        <li>Teste grátis de {TRIAL_DAYS} dias do plano Completo, uma única vez por CPF.</li>
        <li>Com o teste grátis ou o plano vencido, a área de trabalho fica bloqueada (perfis, agenda, mensagens de trabalho, financeiro e histórico) até o pagamento. Não há comissão sobre os serviços.</li>
        <li>Do Básico para o Completo, paga-se o valor integral do Completo (sem desconto pelos dias usados) e começa um novo mês. Do Completo para o Básico, só depois de o Completo terminar.</li>
        <li>Indicação: cada pessoa que criar conta pelo link do trabalhador dá 0,5% de desconto na próxima mensalidade, até 30%. No Básico, a mensalidade não fica abaixo de R$ 4,85. Usado o desconto, a contagem recomeça.</li>
      </ul>
      <h2>5. Contrate rápido</h2>
      <ul>
        <li>O cliente informa o serviço, a quantidade, a localização e uma descrição do que precisa. O valor é fixo para cada profissão, definido pelo Diária Paga, e é pago integralmente ao prestador.</li>
        <li>Só algumas profissões entram no Contrate rápido (as que permitem um valor fixo, como diarista, pedreiro, eletricista, encanador, cuidador e compras no supermercado). As demais são contratadas pela vitrine, com o valor de cada prestador.</li>
        <li>Compras no supermercado: o cliente informa a lista completa e um telefone para o Pix das compras; o valor das compras é pago pelo cliente e o prestador entrega a nota fiscal (notinha) junto com as compras.</li>
        <li>Só recebem chamados os prestadores do plano Completo em dia que aceitaram as regras do Contrate rápido e estão Disponíveis.</li>
        <li>O chamado toca primeiro para quem aceita mais chamados e está mais perto. Quem recusa muito, ou deixa tocar sem responder, passa a receber menos chamados. O primeiro que aceitar fica com o serviço e tem até {ARRIVE_HOURS} horas para chegar.</li>
        <li>Se o prestador não chegar em {ARRIVE_HOURS} horas, o chamado é cancelado e ele fica {PRO_QUICK_BAN_DAYS} dias sem receber chamados do Contrate rápido.</li>
        <li>Se o prestador chegar e o cliente não estiver no endereço (depois de 15 minutos de espera), o cliente fica {CLIENT_BLOCK_DAYS} dias sem contratar, ou paga {formatBRL(UNLOCK_FEE_CENTS)} para liberar a conta na hora.</li>
      </ul>
      <h2>6. Uso pelo aplicativo</h2>
      <p>O Diária Paga funciona instalado no aparelho (aplicativo pelo navegador) e com as notificações ativadas, que são o meio de avisar sobre mensagens, pedidos e chamados.</p>
      <h2>7. Conduta</h2>
      <ul>
        <li>O prestador pode informar o WhatsApp, o Instagram, o TikTok e o YouTube nos campos do perfil, e os dois podem trocar contato pelo chat. Só nas fotos de trabalho (e nas legendas delas) é proibido colocar telefone ou contato.</li>
        <li>É proibido usar a plataforma para assédio, ameaça, fraude, spam, conteúdo impróprio ou qualquer atividade ilegal.</li>
        <li>Avaliações devem ser verdadeiras e só podem ser feitas por quem participou de um serviço concluído.</li>
        <li>O Diária Paga pode remover conteúdo e suspender ou bloquear contas que descumprirem estes termos, com registro do motivo.</li>
      </ul>
      <h2>8. Responsabilidades</h2>
      <p>Cliente e prestador são responsáveis pelo que combinarem entre si. O Diária Paga oferece suporte e mediação quando necessário, mas não garante o resultado do serviço e não devolve valores que não recebeu.</p>
      <h2>9. Contato</h2>
      <p>Pelo menu Suporte, dentro do app.</p>
    </>
  );
}
