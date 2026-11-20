import type { Metadata } from "next";
import { ARRIVE_HOURS, CLIENT_BLOCK_DAYS, MAX_PLACES, PACK_CENTS, PACK_PLACES, PLANS, PRO_QUICK_BAN_DAYS, TRIAL_DAYS, UNLOCK_FEE_CENTS, formatBRL } from "@/lib/domain";

export const metadata: Metadata = { title: "Termos de uso" };

export default function Terms() {
  return (
    <>
      <h1>Termos de uso do Diária Paga</h1>
      <h2>1. O que é o Diária Paga</h2>
      <p>O Diária Paga é uma plataforma que aproxima clientes e prestadores de serviço autônomos (diaristas, pedreiros, cuidadores, babás, motoristas, eletricistas e outros). O Diária Paga não presta os serviços, não é empregador dos prestadores e não recebe, retém, divide ou processa o pagamento dos serviços.</p>
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
        <li>É preciso ter 18 anos completos. O prestador define seus preços (por diária, por hora ou por serviço) e decide se aceita cada pedido.</li>
        <li>Plano Completo: {formatBRL(PLANS.FULL.priceCents)} por mês ({formatBRL(PLANS.FULL.platformCents)} da plataforma + {formatBRL(PLANS.FULL.feesCents)} de impostos e taxas), com {PLANS.FULL.places} endereços de atendimento, prioridade na busca e selo Recomendado.</li>
        <li>Plano Básico: {formatBRL(PLANS.BASIC.priceCents)} por mês ({formatBRL(PLANS.BASIC.platformCents)} da plataforma + {formatBRL(PLANS.BASIC.feesCents)} de impostos e taxas), com {PLANS.BASIC.places} endereço de atendimento.</li>
        <li>No plano Completo, pacotes de +{PACK_PLACES} endereços custam {formatBRL(PACK_CENTS)} por mês cada, até {MAX_PLACES} endereços. O pacote é liberado na hora e cobrado na mensalidade seguinte; pode ser retirado a qualquer momento e deixa de ser cobrado na próxima mensalidade.</li>
        <li>Teste grátis de {TRIAL_DAYS} dias do plano Completo, uma única vez por CPF.</li>
        <li>Com o plano vencido, o perfil sai da busca e do Contrate rápido. Não há comissão sobre os serviços.</li>
      </ul>
      <h2>5. Contrate rápido</h2>
      <ul>
        <li>O cliente informa o serviço, a localização e o valor máximo, que não pode ser menor que o menor preço da plataforma para aquele serviço.</li>
        <li>O chamado toca para os prestadores disponíveis mais próximos. O primeiro que aceitar fica com o serviço e tem até {ARRIVE_HOURS} horas para chegar.</li>
        <li>Se o prestador não chegar em {ARRIVE_HOURS} horas, o chamado é cancelado e ele fica {PRO_QUICK_BAN_DAYS} dias sem receber chamados do Contrate rápido.</li>
        <li>Se o prestador chegar e o cliente não estiver no endereço (depois de 15 minutos de espera), o cliente fica {CLIENT_BLOCK_DAYS} dias sem contratar, ou paga {formatBRL(UNLOCK_FEE_CENTS)} para liberar a conta na hora.</li>
      </ul>
      <h2>6. Conduta</h2>
      <ul>
        <li>É proibido passar telefone, WhatsApp ou outro contato fora do app em perfis, fotos, legendas ou no chat. Toda contratação acontece dentro do Diária Paga.</li>
        <li>É proibido usar a plataforma para assédio, ameaça, fraude, spam, conteúdo impróprio ou qualquer atividade ilegal.</li>
        <li>Avaliações devem ser verdadeiras e só podem ser feitas por quem participou de um serviço concluído.</li>
        <li>O Diária Paga pode remover conteúdo e suspender ou bloquear contas que descumprirem estes termos, com registro do motivo.</li>
      </ul>
      <h2>7. Responsabilidades</h2>
      <p>Cliente e prestador são responsáveis pelo que combinarem entre si. O Diária Paga oferece suporte e mediação quando necessário, mas não garante o resultado do serviço e não devolve valores que não recebeu.</p>
      <h2>8. Contato</h2>
      <p>Pelo menu Suporte, dentro do app.</p>
    </>
  );
}
