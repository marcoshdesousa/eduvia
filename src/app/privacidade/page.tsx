import { LegalPage } from "@/components/legal";

export const metadata = { title: "Política de privacidade" };

export default function Page() {
  return (
    <LegalPage title="Política de privacidade" updated="setembro de 2026">
      <p>Esta política explica como o Eduvia trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).</p>
      <h2>Dados que coletamos</h2>
      <ul>
        <li>Cadastro: nome, e-mail, senha (armazenada criptografada), data de nascimento e @ de usuário.</li>
        <li>Materiais que você envia e o texto extraído deles.</li>
        <li>Uso: preparações, respostas, desempenho, tempo de estudo, preferências de notificação.</li>
        <li>Para menores de idade: nome e e-mail do responsável e o registro da autorização (data e IP).</li>
      </ul>
      <h2>Finalidades e bases legais</h2>
      <ul>
        <li>Prestar o serviço contratado (execução de contrato).</li>
        <li>Enviar lembretes de estudo que você configurou (execução de contrato; pode desativar).</li>
        <li>Segurança e prevenção a fraudes (legítimo interesse).</li>
        <li>Dados de crianças e adolescentes: tratados no seu melhor interesse, com consentimento específico de um dos pais ou responsável (art. 14 da LGPD).</li>
      </ul>
      <h2>Compartilhamento</h2>
      <p>Usamos fornecedores para hospedagem, armazenamento de arquivos, envio de e-mail, pagamentos e processamento por inteligência artificial. Eles tratam os dados apenas para executar esses serviços. Não vendemos dados pessoais.</p>
      <h2>Seus direitos</h2>
      <p>Você pode acessar, corrigir, exportar e excluir seus dados, e revogar consentimentos, pelas configurações da conta ou pelo e-mail privacidade@eduvia.app.</p>
      <h2>Retenção</h2>
      <p>Mantemos os dados enquanto a conta estiver ativa. Ao excluir a conta, apagamos dados e materiais em até 30 dias, salvo obrigação legal de guarda (por exemplo, registros fiscais de pagamento).</p>
      <h2>Segurança</h2>
      <p>Arquivos ficam em armazenamento privado e só são acessados por links temporários após verificação de permissão. Senhas são armazenadas com hash.</p>
    </LegalPage>
  );
}
