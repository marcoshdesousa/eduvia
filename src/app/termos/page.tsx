import { LegalPage } from "@/components/legal";

export const metadata = { title: "Termos de uso" };

export default function Page() {
  return (
    <LegalPage title="Termos de uso" updated="setembro de 2026">
      <h2>1. O serviço</h2>
      <p>O Eduvia é uma plataforma de estudos que usa inteligência artificial para transformar materiais enviados pelo próprio usuário em planos de estudo, textos, perguntas, revisões e outras atividades. O Eduvia não vende nem fornece conteúdo didático próprio.</p>
      <h2>2. Cadastro</h2>
      <p>O cadastro pede nome, CPF, telefone (WhatsApp), nome de usuário (@) e senha. Você deve informar dados verdadeiros e manter sua senha em sigilo. O CPF identifica a conta (uma por pessoa) e, junto com o telefone cadastrado, permite criar uma nova senha. O @ é único e pessoal. Menores de 18 anos só podem usar a plataforma com autorização de um dos pais ou responsável legal.</p>
      <h2>3. Materiais enviados e direitos autorais</h2>
      <p><strong>Você é o único responsável pelos materiais que envia e compartilha</strong> (PDFs, documentos, imagens e textos), declarando que tem o direito de usá-los para fins de estudo pessoal. É proibido enviar ou compartilhar conteúdo que viole direitos autorais de terceiros, que seja ilegal, ofensivo ou que contenha dados pessoais de outras pessoas sem autorização.</p>
      <p>O Eduvia remove conteúdos mediante notificação fundamentada do titular dos direitos e pode suspender contas em caso de violação reiterada.</p>
      <h2>4. Conteúdo gerado pela IA</h2>
      <p>Textos, questões e correções podem ser gerados ou corrigidos automaticamente por inteligência artificial e podem conter imprecisões. Use-os como apoio ao estudo e confira as informações importantes na fonte indicada.</p>
      <p>A IA do Eduvia é o Google Gemini, usado com a <strong>chave de API do próprio aluno</strong>, obrigatória no cadastro. O uso da chave segue os termos do Google e a cota da conta Google do aluno. Na cota gratuita, o Google pode usar o conteúdo enviado para melhorar os produtos dele; com o faturamento ativado na conta Google, isso não acontece. O Eduvia guarda a chave criptografada e só a usa para gerar o seu conteúdo.</p>
      <h2>5. Planos e pagamento</h2>
      <p>Novas contas começam com 3 dias de teste grátis. Os planos pagos (Pro, Avançado e Ilimitado, de 30 dias) liberam todos os recursos; o que muda entre eles é a quantidade de guias de estudo por mês e alguns limites (valores e limites atuais na página de assinatura). Guias de estudo criados contam para o limite do mês mesmo se forem apagados. O plano é pago por Pix na página de assinatura e liberado automaticamente quando o pagamento é confirmado. Cada pagamento vale 30 dias; não há renovação automática: ao fim do período, basta renovar. Na troca de plano, o novo plano vale 30 dias a partir do pagamento e os dias não usados do plano anterior viram desconto (calculado por dia).</p>
      <h2>6. Uso adequado</h2>
      <p>Não é permitido tentar acessar dados de outros usuários, sobrecarregar o serviço, usar robôs para extrair conteúdo ou revender o acesso.</p>
      <h2>7. Encerramento</h2>
      <p>Você pode excluir sua conta a qualquer momento nas configurações. Seus dados e materiais serão apagados conforme a política de privacidade.</p>
      <h2>8. Contato</h2>
      <p>Dúvidas e notificações: suporte@eduvia.app.</p>
    </LegalPage>
  );
}
