// Temas sorteados para a redação (estilo ENEM) e propostas do teste de português.
// Ficam no próprio app: sortear um tema não gasta IA.

export type EssayPrompt = { theme: string; instructions: string };

const ENEM_INSTRUCTIONS = (theme: string) =>
  `Com base nos seus conhecimentos, redija um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema "${theme}", apresentando proposta de intervenção que respeite os direitos humanos. Selecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defesa de seu ponto de vista. Extensão sugerida: 20 a 30 linhas.`;

const ENEM_THEMES = [
  "Os desafios para combater a desinformação nas redes sociais no Brasil",
  "Caminhos para reduzir a evasão escolar entre jovens brasileiros",
  "O impacto do uso excessivo de celulares na saúde mental dos adolescentes",
  "Desafios para garantir o acesso à água potável em todo o território brasileiro",
  "A persistência do trabalho infantil no Brasil",
  "Os desafios da mobilidade urbana nas grandes cidades brasileiras",
  "Caminhos para valorizar os professores da educação básica",
  "O combate ao desperdício de alimentos no Brasil",
  "Desafios para a inclusão de pessoas com deficiência no mercado de trabalho",
  "A importância da vacinação para a saúde coletiva",
  "Os desafios do descarte correto do lixo eletrônico",
  "Caminhos para combater a violência contra a mulher no Brasil",
  "O envelhecimento da população e os desafios do cuidado com os idosos",
  "A valorização da cultura popular brasileira entre os jovens",
  "Desafios para garantir segurança alimentar às famílias brasileiras",
  "O papel da leitura na formação crítica dos cidadãos",
  "Os impactos das apostas on-line na vida financeira dos brasileiros",
  "Caminhos para ampliar o acesso à internet nas regiões rurais",
  "A preservação da Amazônia e o desenvolvimento sustentável",
  "Os desafios para combater o racismo estrutural no Brasil",
  "A importância da educação financeira nas escolas",
  "O combate ao bullying e ao cyberbullying no ambiente escolar",
  "Desafios para o tratamento da saúde mental no sistema público",
  "A insegurança no trânsito e a cultura de imprudência ao volante",
  "Caminhos para reduzir a desigualdade no acesso ao ensino superior",
  "O abandono de animais domésticos nas cidades brasileiras",
  "Os desafios do uso da inteligência artificial na educação",
  "A importância do voluntariado na construção de uma sociedade solidária",
  "Desafios para enfrentar as mudanças climáticas nas cidades",
  "A invisibilidade das pessoas em situação de rua no Brasil",
  "Caminhos para incentivar a prática de esportes entre crianças e jovens",
  "O consumismo e seus impactos no meio ambiente",
];

const PORTUGUES_PROMPTS: EssayPrompt[] = [
  { theme: "Um dia que mudou a minha forma de pensar", instructions: "Escreva um texto de 10 a 15 linhas contando um dia marcante e o que você aprendeu com ele. Capriche na pontuação, na acentuação e na concordância." },
  { theme: "Carta para mim mesmo daqui a cinco anos", instructions: "Escreva uma carta de 10 a 15 linhas para você no futuro, contando seus planos e sonhos. Use a linguagem formal." },
  { theme: "A cidade onde eu moro", instructions: "Descreva, em 10 a 15 linhas, a sua cidade: o que ela tem de bom e o que poderia melhorar." },
  { theme: "O livro, filme ou série que eu recomendaria", instructions: "Escreva uma resenha curta (10 a 15 linhas) explicando por que outras pessoas deveriam conhecer essa obra." },
  { theme: "Uma pessoa que admiro", instructions: "Escreva de 10 a 15 linhas sobre alguém que você admira e explique o porquê. Atenção às vírgulas e à concordância verbal." },
  { theme: "Como seria a escola ideal", instructions: "Em 10 a 15 linhas, descreva como seria para você a escola ideal e justifique suas ideias." },
  { theme: "Uma viagem inesquecível (real ou imaginária)", instructions: "Narre uma viagem em 10 a 15 linhas, com começo, meio e fim." },
  { theme: "Os prós e os contras das redes sociais", instructions: "Escreva de 10 a 15 linhas apresentando pontos positivos e negativos das redes sociais, com sua opinião no final." },
  { theme: "O que eu faria se fosse prefeito por um dia", instructions: "Em 10 a 15 linhas, conte quais medidas você tomaria e por quê. Use a norma culta." },
  { theme: "A importância de saber ouvir", instructions: "Escreva um texto opinativo de 10 a 15 linhas sobre o tema." },
  { theme: "Minha rotina de estudos", instructions: "Descreva, em 10 a 15 linhas, como você organiza (ou gostaria de organizar) seus estudos." },
  { theme: "Um objeto que conta a minha história", instructions: "Escolha um objeto e escreva de 10 a 15 linhas sobre o que ele significa para você." },
  { theme: "Reclamação formal sobre um serviço", instructions: "Escreva uma carta de reclamação formal (10 a 15 linhas) sobre um serviço que não funcionou bem. Atenção à regência e aos pronomes de tratamento." },
  { theme: "O melhor conselho que já recebi", instructions: "Em 10 a 15 linhas, conte qual foi o conselho, quem deu e como ele ajudou você." },
  { theme: "Tecnologia: aliada ou vilã?", instructions: "Escreva de 10 a 15 linhas defendendo o seu ponto de vista, com pelo menos um argumento e um exemplo." },
  { theme: "Um e-mail pedindo uma oportunidade de estágio", instructions: "Escreva um e-mail formal (10 a 15 linhas) apresentando-se e pedindo uma oportunidade de estágio." },
];

function pick<T>(list: T[], avoid?: (x: T) => boolean): T {
  const pool = avoid ? list.filter((x) => !avoid(x)) : list;
  const from = pool.length ? pool : list;
  return from[Math.floor(Math.random() * from.length)];
}

/** Sorteia um tema de redação (estilo ENEM), diferente do atual. */
export function drawEssayTheme(current?: string): EssayPrompt {
  const theme = pick(ENEM_THEMES, (t) => t === current);
  return { theme, instructions: ENEM_INSTRUCTIONS(theme) };
}

/** Sorteia uma proposta do teste de português, diferente da atual. */
export function drawPortuguesePrompt(current?: string): EssayPrompt {
  return pick(PORTUGUES_PROMPTS, (p) => p.theme === current);
}
