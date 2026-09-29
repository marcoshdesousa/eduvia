import { LegalPage } from "@/components/legal";

export const metadata = { title: "Termos de uso" };

export default function Page() {
  return (
    <LegalPage title="Termos de uso" updated="setembro de 2026">
      <h2>1. O serviço</h2>
      <p>O Eduvia é uma plataforma de estudos que usa inteligência artificial para transformar materiais enviados pelo próprio usuário em planos de estudo, textos, perguntas, revisões e outras atividades. O Eduvia não vende nem fornece conteúdo didático próprio.</p>
      <h2>2. Cadastro</h2>
      <p>Você deve informar dados verdadeiros e manter sua senha em sigilo. O nome de usuário (@) é único e pessoal. Menores de 18 anos só podem usar a plataforma com autorização de um dos pais ou responsável legal, coletada no cadastro.</p>
      <h2>3. Materiais enviados e direitos autorais</h2>
      <p><strong>Você é o único responsável pelos materiais que envia e compartilha</strong> (PDFs, documentos, imagens e textos), declarando que tem o direito de usá-los para fins de estudo pessoal. É proibido enviar ou compartilhar conteúdo que viole direitos autorais de terceiros, que seja ilegal, ofensivo ou que contenha dados pessoais de outras pessoas sem autorização.</p>
      <p>O Eduvia remove conteúdos mediante notificação fundamentada do titular dos direitos e pode suspender contas em caso de violação reiterada.</p>
      <h2>4. Conteúdo gerado pela IA</h2>
      <p>Textos, questões e correções são gerados automaticamente a partir do seu material e podem conter imprecisões. Use-os como apoio ao estudo e confira as informações importantes na fonte indicada.</p>
      <h2>5. Planos e pagamento</h2>
      <p>Novas contas têm 3 dias de teste grátis com acesso completo. Depois, o acesso continua mediante assinatura semanal (R$ 7) ou mensal (R$ 15), com renovação automática e cancelamento a qualquer momento, válido até o fim do período pago.</p>
      <h2>6. Uso adequado</h2>
      <p>Não é permitido tentar acessar dados de outros usuários, sobrecarregar o serviço, usar robôs para extrair conteúdo ou revender o acesso.</p>
      <h2>7. Encerramento</h2>
      <p>Você pode excluir sua conta a qualquer momento nas configurações. Seus dados e materiais serão apagados conforme a política de privacidade.</p>
      <h2>8. Contato</h2>
      <p>Dúvidas e notificações: suporte@eduvia.app.</p>
    </LegalPage>
  );
}
