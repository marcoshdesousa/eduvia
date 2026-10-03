// Temas sorteados para a redação (estilo ENEM) e propostas do teste de português.
// Ficam no próprio app: sortear um tema não gasta IA.

export type EssayPrompt = { theme: string; instructions: string; texts?: string[] };

const ENEM_INSTRUCTIONS = (theme: string) =>
  `A partir da leitura dos textos motivadores e com base nos conhecimentos construídos ao longo de sua formação, redija um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema "${theme}", apresentando proposta de intervenção que respeite os direitos humanos. Selecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defesa de seu ponto de vista. Não copie trechos dos textos motivadores. Extensão sugerida: 20 a 30 linhas.`;

/** Temas no estilo ENEM, cada um com textos motivadores curtos escritos para o Eduvia (não são redações-modelo). */
const ENEM_THEMES: { theme: string; texts: string[] }[] = [
  {
    theme: "Os desafios para combater a desinformação nas redes sociais no Brasil",
    texts: [
      "Notícias falsas circulam mais rápido do que as verdadeiras porque costumam despertar medo, raiva ou surpresa. Em grupos de mensagens, um texto encaminhado por um parente ganha uma credibilidade que não teria se viesse de um desconhecido.",
      "Checar a fonte, desconfiar de títulos alarmantes e procurar a mesma informação em veículos diferentes são hábitos simples, mas pouco ensinados. A educação midiática ainda aparece pouco nos currículos escolares.",
      "Plataformas digitais lucram com o engajamento. Conteúdos polêmicos prendem a atenção e, por isso, tendem a ser mais distribuídos pelos algoritmos.",
    ],
  },
  {
    theme: "Caminhos para reduzir a evasão escolar entre jovens brasileiros",
    texts: [
      "Muitos jovens deixam a escola para trabalhar e ajudar na renda da família. Para eles, o diploma parece uma promessa distante diante de contas que vencem hoje.",
      "Escolas com projetos que dialogam com a realidade dos alunos, como cursos técnicos, esportes e tutoria, costumam manter mais estudantes até o fim do ensino médio.",
    ],
  },
  {
    theme: "O impacto do uso excessivo de celulares na saúde mental dos adolescentes",
    texts: [
      "Notificações constantes fragmentam a atenção. Muitos adolescentes relatam dificuldade de se concentrar em uma única tarefa por mais de alguns minutos.",
      "Nas redes, cada pessoa mostra a melhor versão de si. A comparação permanente com vidas aparentemente perfeitas pode alimentar ansiedade e baixa autoestima.",
      "O uso do celular à noite atrasa o sono, e dormir pouco afeta humor, memória e desempenho escolar.",
    ],
  },
  {
    theme: "Desafios para garantir o acesso à água potável em todo o território brasileiro",
    texts: [
      "Apesar de concentrar uma parte importante da água doce do planeta, o Brasil ainda tem famílias que dependem de caminhões-pipa, poços improvisados ou cisternas.",
      "A falta de saneamento básico contamina rios e lençóis freáticos, encarece o tratamento da água e espalha doenças que poderiam ser evitadas.",
    ],
  },
  {
    theme: "A persistência do trabalho infantil no Brasil",
    texts: [
      "Crianças trabalham em feiras, lavouras, semáforos e dentro de casas de terceiros. Muitas vezes, o trabalho é visto pela própria família como forma de ensinar responsabilidade.",
      "O Estatuto da Criança e do Adolescente proíbe qualquer trabalho a menores de 14 anos, salvo na condição de aprendiz. Ainda assim, a fiscalização não alcança todos os lugares.",
    ],
  },
  {
    theme: "Os desafios da mobilidade urbana nas grandes cidades brasileiras",
    texts: [
      "Trabalhadores que moram nas periferias chegam a passar horas por dia no transporte público, tempo que poderia ser usado para descanso, estudo ou convívio familiar.",
      "Cidades planejadas para o carro tendem a ter calçadas estreitas, poucas ciclovias e congestionamentos que pioram a qualidade do ar.",
    ],
  },
  {
    theme: "Caminhos para valorizar os professores da educação básica",
    texts: [
      "Salas cheias, salários baixos e pouco tempo para planejar aulas fazem muitos jovens desistirem da carreira docente antes mesmo de começar.",
      "Países que melhoraram a qualidade da educação investiram na formação contínua dos professores e no reconhecimento social da profissão.",
    ],
  },
  {
    theme: "O combate ao desperdício de alimentos no Brasil",
    texts: [
      "Enquanto toneladas de alimentos são descartadas em feiras, mercados e restaurantes, muitas famílias ainda não sabem se terão a próxima refeição.",
      "O desperdício acontece em toda a cadeia: na colheita, no transporte, no armazenamento e dentro de casa, quando compramos mais do que conseguimos consumir.",
    ],
  },
  {
    theme: "Desafios para a inclusão de pessoas com deficiência no mercado de trabalho",
    texts: [
      "A Lei de Cotas obriga empresas maiores a reservar vagas para pessoas com deficiência, mas muitas preferem pagar multas a adaptar seus espaços.",
      "Rampas, softwares de leitura de tela e intérpretes de Libras são adaptações que custam pouco perto do talento que deixam de ser desperdiçado.",
    ],
  },
  {
    theme: "A importância da vacinação para a saúde coletiva",
    texts: [
      "Doenças que já estavam controladas podem voltar quando a cobertura vacinal cai. A proteção de quem não pode se vacinar depende de quem pode.",
      "Boatos sobre efeitos colaterais se espalham com facilidade nas redes, enquanto as informações dos órgãos de saúde nem sempre chegam com a mesma força.",
    ],
  },
  {
    theme: "Os desafios do descarte correto do lixo eletrônico",
    texts: [
      "Celulares, pilhas e baterias guardam metais pesados que, descartados no lixo comum, contaminam o solo e a água.",
      "Pontos de coleta existem, mas são pouco conhecidos. Muitas pessoas guardam aparelhos velhos na gaveta por não saber o que fazer com eles.",
    ],
  },
  {
    theme: "Caminhos para combater a violência contra a mulher no Brasil",
    texts: [
      "A Lei Maria da Penha é reconhecida como um avanço, mas muitas vítimas ainda não denunciam por medo, dependência financeira ou vergonha.",
      "A violência nem sempre deixa marcas visíveis: controle, humilhação e isolamento também são formas de agressão.",
    ],
  },
  {
    theme: "O envelhecimento da população e os desafios do cuidado com os idosos",
    texts: [
      "A população brasileira está envelhecendo rapidamente, e as cidades nem sempre estão preparadas para quem anda devagar, enxerga menos ou mora sozinho.",
      "Muitas famílias não têm tempo nem recursos para cuidar de seus idosos, e as instituições de longa permanência são poucas e caras.",
    ],
  },
  {
    theme: "A valorização da cultura popular brasileira entre os jovens",
    texts: [
      "Festas juninas, maracatu, cordel e repente contam a história de um povo. Quando ninguém mais aprende, essas tradições correm o risco de desaparecer.",
      "A internet pode ser aliada: artistas populares ganham novos públicos quando suas obras circulam em vídeos e playlists.",
    ],
  },
  {
    theme: "Desafios para garantir segurança alimentar às famílias brasileiras",
    texts: [
      "Ter comida no prato não basta: segurança alimentar significa acesso regular a alimentos de qualidade, em quantidade suficiente.",
      "Ultraprocessados costumam ser mais baratos e práticos do que frutas e verduras, o que afeta principalmente as famílias de baixa renda.",
    ],
  },
  {
    theme: "O papel da leitura na formação crítica dos cidadãos",
    texts: [
      "Quem lê com frequência amplia o vocabulário, entende melhor diferentes pontos de vista e tem mais ferramentas para questionar o que ouve.",
      "Bibliotecas públicas fechadas ou sem acervo atualizado afastam justamente quem não pode comprar livros.",
    ],
  },
  {
    theme: "Os impactos das apostas on-line na vida financeira dos brasileiros",
    texts: [
      "Propagandas com celebridades apresentam as apostas como diversão e caminho para o dinheiro fácil.",
      "Especialistas alertam que a facilidade de apostar pelo celular, a qualquer hora, favorece o endividamento e o vício.",
    ],
  },
  {
    theme: "Caminhos para ampliar o acesso à internet nas regiões rurais",
    texts: [
      "Sem conexão, estudantes do campo ficam fora de cursos on-line, e produtores têm dificuldade para vender e acompanhar preços.",
      "Levar infraestrutura a áreas pouco povoadas custa caro e, por isso, desperta pouco interesse comercial das operadoras.",
    ],
  },
  {
    theme: "A preservação da Amazônia e o desenvolvimento sustentável",
    texts: [
      "A floresta regula chuvas que abastecem lavouras e cidades em outras regiões do país.",
      "Comunidades tradicionais mostram que é possível gerar renda com a floresta em pé, com extrativismo, turismo e produtos da biodiversidade.",
    ],
  },
  {
    theme: "Os desafios para combater o racismo estrutural no Brasil",
    texts: [
      "O racismo estrutural não depende apenas de atitudes individuais: ele aparece em quem ocupa cargos de chefia, em quem é parado pela polícia e em quem chega à universidade.",
      "Políticas afirmativas, como as cotas, buscam corrigir desigualdades históricas que começaram com séculos de escravidão.",
    ],
  },
  {
    theme: "A importância da educação financeira nas escolas",
    texts: [
      "Muitos jovens recebem o primeiro salário sem saber o que são juros, parcelamento ou orçamento mensal.",
      "Aprender a planejar gastos desde cedo ajuda a evitar o endividamento e permite fazer escolhas com mais liberdade.",
    ],
  },
  {
    theme: "O combate ao bullying e ao cyberbullying no ambiente escolar",
    texts: [
      "Apelidos e exclusões vistos como brincadeira podem deixar marcas profundas na autoestima de quem é alvo.",
      "No ambiente digital, a humilhação não termina quando o sinal toca: ela continua no celular, à vista de muitas pessoas.",
    ],
  },
  {
    theme: "Desafios para o tratamento da saúde mental no sistema público",
    texts: [
      "Ansiedade e depressão estão entre as principais causas de afastamento do trabalho, mas o atendimento especializado ainda tem longas filas.",
      "O preconceito faz muitas pessoas demorarem a pedir ajuda, por medo de serem vistas como fracas.",
    ],
  },
  {
    theme: "A insegurança no trânsito e a cultura de imprudência ao volante",
    texts: [
      "Excesso de velocidade, uso do celular ao dirigir e álcool estão entre as principais causas de acidentes graves.",
      "Muitos motoristas só respeitam as regras quando há radar ou fiscalização por perto.",
    ],
  },
  {
    theme: "Caminhos para reduzir a desigualdade no acesso ao ensino superior",
    texts: [
      "Estudantes de escola pública competem por vagas com quem teve cursinho, tempo livre e acesso a materiais caros.",
      "Entrar na universidade é só o começo: transporte, alimentação e moradia também decidem quem consegue se formar.",
    ],
  },
  {
    theme: "O abandono de animais domésticos nas cidades brasileiras",
    texts: [
      "Filhotes são adotados por impulso e, quando crescem ou adoecem, acabam deixados na rua.",
      "Campanhas de castração e adoção responsável reduzem o número de animais abandonados e o risco de doenças.",
    ],
  },
  {
    theme: "Os desafios do uso da inteligência artificial na educação",
    texts: [
      "Ferramentas de inteligência artificial respondem perguntas em segundos, mas podem errar com muita confiança.",
      "Usada como apoio, a tecnologia pode explicar conteúdos de outro jeito; usada como atalho, pode impedir que o aluno aprenda a pensar sozinho.",
    ],
  },
  {
    theme: "A importância do voluntariado na construção de uma sociedade solidária",
    texts: [
      "Voluntários atuam em hospitais, abrigos, escolas e em situações de desastre, chegando onde o poder público demora a chegar.",
      "Quem participa de ações voluntárias costuma relatar mais senso de propósito e de pertencimento à comunidade.",
    ],
  },
  {
    theme: "Desafios para enfrentar as mudanças climáticas nas cidades",
    texts: [
      "Ondas de calor, enchentes e deslizamentos têm se tornado mais frequentes e atingem com mais força quem mora em áreas de risco.",
      "Áreas verdes, drenagem eficiente e transporte coletivo de qualidade ajudam as cidades a se adaptar e a emitir menos poluentes.",
    ],
  },
  {
    theme: "A invisibilidade das pessoas em situação de rua no Brasil",
    texts: [
      "Muitas pessoas passam todos os dias por alguém que dorme na calçada sem notar sua presença.",
      "Perda de emprego, conflitos familiares e dependência química estão entre os motivos que levam alguém a viver na rua.",
    ],
  },
  {
    theme: "Caminhos para incentivar a prática de esportes entre crianças e jovens",
    texts: [
      "O esporte ensina disciplina, trabalho em equipe e respeito às regras, além de melhorar a saúde.",
      "Em muitos bairros faltam quadras, praças seguras e professores para orientar a prática.",
    ],
  },
  {
    theme: "O consumismo e seus impactos no meio ambiente",
    texts: [
      "Roupas e aparelhos eletrônicos são trocados cada vez mais rápido, e o descarte gera montanhas de resíduos.",
      "A publicidade associa felicidade à compra de produtos novos, mesmo quando os antigos ainda funcionam.",
    ],
  },
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
  const t = pick(ENEM_THEMES, (x) => x.theme === current);
  return { theme: t.theme, instructions: ENEM_INSTRUCTIONS(t.theme), texts: t.texts };
}

/** Textos motivadores de um tema do Eduvia (o servidor nunca confia nos textos vindos do navegador). */
export function motivatingTexts(theme: string): string[] {
  return ENEM_THEMES.find((t) => t.theme === theme)?.texts ?? [];
}

/**
 * Trechos do aluno copiados dos textos motivadores: sequências de `n` palavras ou mais iguais
 * (ignorando maiúsculas, acentos e pontuação). Devolve os trechos como estão no texto do aluno.
 */
export function copiedPassages(text: string, sources: string[], n = 7): string[] {
  const norm = (w: string) => w.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const grams = new Set<string>();
  for (const src of sources) {
    const w = src.split(/\s+/).map(norm).filter(Boolean);
    for (let i = 0; i + n <= w.length; i++) grams.add(w.slice(i, i + n).join(" "));
  }
  if (!grams.size) return [];
  const raw = text.split(/\s+/).filter(Boolean);
  const words = raw.map(norm);
  const hit = new Array(raw.length).fill(false);
  for (let i = 0; i + n <= words.length; i++) {
    if (words.slice(i, i + n).some((w) => !w)) continue;
    if (grams.has(words.slice(i, i + n).join(" "))) for (let j = i; j < i + n; j++) hit[j] = true;
  }
  const out: string[] = [];
  for (let i = 0; i < raw.length; i++) {
    if (!hit[i]) continue;
    let j = i;
    while (j < raw.length && hit[j]) j++;
    out.push(raw.slice(i, j).join(" "));
    i = j;
  }
  return out;
}

/** Sorteia uma proposta do teste de português, diferente da atual. */
export function drawPortuguesePrompt(current?: string): EssayPrompt {
  return pick(PORTUGUES_PROMPTS, (p) => p.theme === current);
}
