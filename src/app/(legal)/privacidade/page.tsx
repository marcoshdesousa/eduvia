import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de privacidade" };

export default function Privacy() {
  return (
    <>
      <h1>Política de privacidade</h1>
      <p>Coletamos só o necessário para a plataforma funcionar, seguindo a Lei Geral de Proteção de Dados (LGPD).</p>
      <h2>Dados que coletamos e para quê</h2>
      <ul>
        <li><strong>Nome e CPF</strong>: identificar a conta, entrar no app e impedir cadastros repetidos. O CPF fica criptografado e nunca aparece para outros usuários.</li>
        <li><strong>Prestadores</strong>: data de nascimento (conferir os 18 anos), celular (segurança e Pix; nunca aparece para clientes), foto do rosto, bio, Instagram (se informado), fotos do portfólio, serviços, preços e endereços de atendimento (os clientes veem só o bairro e a distância).</li>
        <li><strong>Endereço do serviço</strong>: informado só no pedido e mostrado ao prestador apenas depois do aceite. Depois de 90 dias do fim da contratação, o endereço exato é apagado.</li>
        <li><strong>Localização</strong>: só quando você toca em “Usar minha localização” ou usa o Contrate rápido, com a permissão do aparelho. Não acompanhamos a sua localização em segundo plano.</li>
        <li><strong>Mensagens, fotos, áudios e vídeos do chat</strong>: guardados para as duas partes da contratação. A equipe só acessa com justificativa (denúncia, suporte ou investigação), e esse acesso fica registrado.</li>
        <li><strong>Pagamentos (planos e taxa de desbloqueio)</strong>: processados pelo provedor de Pix; guardamos o status e o histórico.</li>
      </ul>
      <h2>Com quem compartilhamos</h2>
      <p>Com a outra parte da contratação (o necessário para o serviço), com o provedor de pagamento Pix e com serviços de mapa (OpenStreetMap, ViaCEP), que recebem só a busca de endereço feita pelo seu aparelho. Não vendemos dados.</p>
      <h2>Seus direitos</h2>
      <p>Você pode pedir acesso, correção ou cópia dos seus dados pelo menu Suporte, e apagar a sua conta em Conta → “Apagar minha conta”. Ao apagar, guardamos apenas um código irreversível do CPF (sem nome) para impedir um novo teste grátis e manter penalidades do Contrate rápido.</p>
      <h2>Segurança</h2>
      <p>Senhas guardadas com hash forte, conexão criptografada, acesso restrito por função e por contratação, e registro das operações administrativas sensíveis.</p>
    </>
  );
}
