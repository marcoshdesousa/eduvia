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
        <li><strong>Profissionais</strong>: data de nascimento (conferir os 18 anos), WhatsApp (verificação e avisos; não aparece para clientes), foto do rosto (perfil), municípios de atendimento, preço e serviços.</li>
        <li><strong>Endereço da limpeza</strong>: informado só na solicitação e mostrado ao profissional apenas depois do aceite. Depois de 90 dias do fim da contratação, o endereço exato é apagado.</li>
        <li><strong>Localização</strong>: só quando você toca em “Usar minha localização”, com a permissão do aparelho. Não acompanhamos a sua localização.</li>
        <li><strong>Mensagens, fotos e áudios do chat</strong>: guardados para as duas partes da contratação. A equipe só acessa com justificativa (denúncia, suporte ou investigação), e esse acesso fica registrado.</li>
        <li><strong>Pagamentos da assinatura</strong>: processados pelo provedor de Pix; guardamos o status e o histórico.</li>
      </ul>
      <h2>Com quem compartilhamos</h2>
      <p>Com a outra parte da contratação (o necessário para o serviço), com o provedor de pagamento da assinatura e com serviços de mapa (OpenStreetMap, ViaCEP), que recebem só a busca de endereço feita pelo seu aparelho. Não vendemos dados.</p>
      <h2>Seus direitos</h2>
      <p>Você pode pedir acesso, correção, cópia ou exclusão dos seus dados pelo menu Suporte (“Meus dados / excluir conta”).</p>
      <h2>Segurança</h2>
      <p>Senhas guardadas com hash forte, conexão criptografada, acesso restrito por função e por contratação, e registro das operações administrativas sensíveis.</p>
    </>
  );
}
