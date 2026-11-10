import type { Metadata } from "next";
import { SUBSCRIPTION_CENTS, formatBRL } from "@/lib/domain";

export const metadata: Metadata = { title: "Termos de uso" };

export default function Terms() {
  return (
    <>
      <h1>Termos de uso da HoraLimp</h1>
      <h2>1. O que é a HoraLimp</h2>
      <p>A HoraLimp é uma plataforma que aproxima clientes e profissionais autônomos de limpeza residencial. A HoraLimp não presta o serviço de limpeza, não é empregadora dos profissionais e não recebe, retém, divide ou processa o pagamento da limpeza.</p>
      <h2>2. Clientes</h2>
      <ul>
        <li>O cadastro e o uso são gratuitos: sem mensalidade, comissão ou taxa por contratação.</li>
        <li>O cliente escolhe o profissional, os serviços, as horas (de 1 a 12), a data e o endereço. O valor estimado é o preço por hora do profissional multiplicado pelas horas.</li>
        <li>O pagamento do serviço é feito diretamente ao profissional, em dinheiro ou Pix.</li>
      </ul>
      <h2>3. Profissionais</h2>
      <ul>
        <li>É preciso ter 18 anos completos e passar pela verificação da HoraLimp.</li>
        <li>O profissional define livremente o seu preço por hora e decide se aceita ou recusa cada solicitação.</li>
        <li>Para aparecer na vitrine e receber solicitações, o profissional paga a assinatura mensal de {formatBRL(SUBSCRIPTION_CENTS)} (R$ 15,00 de mensalidade + R$ 0,85 de valor adicional previsto no preço). Não há comissão, taxa por hora ou taxa por serviço.</li>
        <li>Com a assinatura vencida, o perfil sai da vitrine e não recebe novos pedidos; o histórico e o suporte continuam disponíveis.</li>
      </ul>
      <h2>4. Contratação</h2>
      <p>O envio da solicitação não obriga o profissional a aceitar. A contratação só fica confirmada depois do aceite. Sem resposta no prazo, a solicitação expira. Serviços extras devem ser combinados no chat antes da execução.</p>
      <h2>5. Conduta</h2>
      <ul>
        <li>É proibido usar a plataforma para assédio, ameaça, fraude, spam ou qualquer atividade ilegal.</li>
        <li>Avaliações devem ser verdadeiras e só podem ser feitas por quem participou de um serviço concluído.</li>
        <li>A HoraLimp pode suspender ou bloquear contas que descumprirem estes termos, com registro do motivo.</li>
      </ul>
      <h2>6. Responsabilidades</h2>
      <p>Cliente e profissional são responsáveis pelo que combinarem entre si. A HoraLimp oferece suporte e mediação quando necessário, mas não garante resultados do serviço e não devolve valores que não recebeu.</p>
      <h2>7. Contato</h2>
      <p>Pelo menu Suporte, dentro do app.</p>
    </>
  );
}
