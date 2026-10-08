import type { Materia } from "../catalog";

/** Comando da redação do ENEM para as atividades das aulas (o mesmo formato da prova). */
export const essayInstructions = (theme: string) =>
  `A partir da leitura dos textos motivadores e com base nos conhecimentos construídos ao longo de sua formação, redija um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema "${theme}", apresentando proposta de intervenção que respeite os direitos humanos. Selecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defesa de seu ponto de vista. Extensão sugerida: 20 a 30 linhas.`;

const essay = (theme: string) => ({ theme, instructions: essayInstructions(theme) });

/** Redação: do básico (como a prova funciona) até a redação completa, com quiz em toda aula e redações para escrever. */
export const REDACAO: Materia[] = [
  {
    slug: "redacao",
    name: "Redação",
    area: "linguagens",
    lessons: [
      {
        title: "Como é a redação do ENEM",
        content: `## A prova que vale mil pontos

A redação é a única parte do ENEM em que você escreve. Ela vale de 0 a 1000 pontos e pesa muito na nota final, principalmente para cursos concorridos. A boa notícia: é a parte da prova em que o treino mais faz diferença.

## O que o ENEM pede

Todo ano a prova traz um **tema** e alguns **textos motivadores** (trechos de notícias, gráficos, leis, charges). Com base neles e no que você sabe, você escreve um **texto dissertativo-argumentativo**:

- **Dissertativo:** discute uma questão, analisando causas e consequências.
- **Argumentativo:** defende um ponto de vista com argumentos.

Além disso, o texto precisa terminar com uma **proposta de intervenção**: uma solução detalhada para o problema discutido, que respeite os direitos humanos.

## Regras da folha

- Máximo de **30 linhas**. Textos com até **7 linhas** recebem nota zero.
- Escreva com **caneta preta**, com letra legível.
- O título é opcional. Se escrever, ele conta como linha.
- O rascunho não é corrigido: só vale o que estiver na folha de redação.

## O que zera a redação

A nota é zero quando o texto:

- **foge totalmente do tema**;
- **não é dissertativo-argumentativo** (por exemplo, um poema ou uma narração);
- tem **até 7 linhas**;
- tem **parte desconectada** de propósito (receita, hino, recado);
- **copia** os textos motivadores sem escrever nada próprio;
- fica **em branco** ou tem desenhos e sinais que identificam o aluno.

## Como a nota é dada

Dois corretores leem o seu texto e dão nota em **5 competências**, cada uma de 0 a 200 pontos. Se as notas deles forem muito diferentes, um terceiro corretor avalia. Nas próximas aulas, você vai estudar cada competência com calma.

## Resumindo

A redação do ENEM é um texto dissertativo-argumentativo, de até 30 linhas, sobre um tema dado, que termina com uma proposta de solução. Respeite as regras básicas e você já evita os zeros mais comuns.`,
        highlights: [
          "A redação vale de 0 a 1000 pontos, em 5 competências de 200 pontos cada.",
          "O texto precisa ser dissertativo-argumentativo e terminar com uma proposta de intervenção.",
          "Fuga total ao tema, texto de até 7 linhas e cópia dos textos motivadores zeram a redação.",
          "Só vale o que está na folha de redação: o rascunho não é corrigido.",
        ],
        keyPoints: [
          { term: "Texto dissertativo-argumentativo", explanation: "Texto que discute um problema e defende um ponto de vista com argumentos." },
          { term: "Textos motivadores", explanation: "Trechos que acompanham o tema para dar ideias e contexto. Não podem ser copiados." },
          { term: "Proposta de intervenção", explanation: "Solução detalhada para o problema discutido, respeitando os direitos humanos." },
        ],
        quiz: {
          choices: [
            {
              q: "Qual é o tipo de texto exigido na redação do ENEM?",
              options: ["Narrativo, contando uma história.", "Dissertativo-argumentativo, defendendo um ponto de vista.", "Poema com rimas sobre o tema.", "Carta pessoal para uma autoridade.", "Resumo dos textos motivadores."],
              answer: 1,
              explanation: "O ENEM pede um texto dissertativo-argumentativo: ele discute o problema e defende uma opinião com argumentos.",
            },
            {
              q: "Quantas linhas, no máximo, a redação do ENEM pode ter?",
              options: ["20 linhas.", "25 linhas.", "30 linhas.", "40 linhas.", "Não há limite."],
              answer: 2,
              explanation: "A folha de redação tem 30 linhas. Textos com até 7 linhas recebem nota zero.",
            },
            {
              q: "Qual destas situações leva a redação a receber nota zero?",
              options: ["Escrever sem título.", "Usar dados de pesquisas.", "Citar um filósofo.", "Fugir totalmente do tema proposto.", "Escrever 25 linhas."],
              answer: 3,
              explanation: "A fuga total ao tema zera a redação. Não colocar título é permitido, e usar dados e citações é até recomendado.",
            },
            {
              q: "Sobre o rascunho da redação, é correto afirmar que:",
              options: ["ele é corrigido se a folha oficial estiver em branco.", "ele vale metade da nota.", "ele não é corrigido; só vale a folha de redação.", "ele substitui a folha oficial.", "ele precisa ser entregue a lápis."],
              answer: 2,
              explanation: "O rascunho serve só para você. Os corretores avaliam apenas o que está na folha de redação.",
            },
            {
              q: "Como a nota da redação do ENEM é composta?",
              options: ["Uma nota única de 0 a 10.", "Cinco competências, cada uma de 0 a 200 pontos.", "Dez critérios de 0 a 100 pontos.", "Apenas a contagem de erros de português.", "A média das notas das provas objetivas."],
              answer: 1,
              explanation: "São 5 competências, cada uma valendo de 0 a 200 pontos, somando até 1000.",
            },
          ],
          open: [
            {
              q: "Explique, com suas palavras, o que é a proposta de intervenção na redação do ENEM.",
              expected: "É a solução detalhada que o aluno propõe no fim do texto para resolver o problema discutido no tema, respeitando os direitos humanos.",
            },
          ],
        },
      },
      {
        title: "As 5 competências da redação",
        content: `## O que os corretores avaliam

Cada redação recebe nota em 5 competências. Conhecer cada uma ajuda você a saber exatamente onde ganhar pontos.

## Competência 1: norma culta

Avalia o domínio da **escrita formal** da língua portuguesa: ortografia, acentuação, concordância, regência, pontuação e construção das frases. Erros pequenos e raros são tolerados; muitos erros derrubam a nota.

## Competência 2: tema e tipo de texto

Avalia se você **entendeu o tema**, escreveu um **texto dissertativo-argumentativo** e usou **repertório** (conhecimentos de outras áreas, como história, filosofia, dados, leis). O repertório precisa ser **legitimado** (verdadeiro e com fonte) e **produtivo** (ligado à discussão).

## Competência 3: argumentação

Avalia como você **seleciona, organiza e interpreta** informações para defender seu ponto de vista. Um texto nota alta tem um projeto claro: a tese é apresentada e os argumentos a defendem, sem contradições.

## Competência 4: coesão

Avalia o uso dos **mecanismos que ligam** as partes do texto: conectivos (além disso, portanto, entretanto), pronomes e sinônimos para retomar ideias. Um texto coeso não repete palavras o tempo todo e passa de um parágrafo para o outro com naturalidade.

## Competência 5: proposta de intervenção

Avalia a **solução** apresentada para o problema. Para tirar 200, ela precisa ter cinco elementos: **agente** (quem faz), **ação** (o que faz), **modo ou meio** (como faz), **finalidade** (para quê) e **detalhamento** (uma explicação a mais sobre algum elemento). E sempre respeitando os direitos humanos.

## Como usar isso no estudo

Quando receber a correção de uma redação, olhe a nota de cada competência. Ela mostra onde está o seu ponto fraco. Muita gente perde pontos na competência 5 por esquecer um dos cinco elementos: é o jeito mais rápido de subir a nota.

## Resumindo

C1: norma culta. C2: tema, tipo de texto e repertório. C3: argumentação. C4: coesão. C5: proposta de intervenção completa.`,
        highlights: [
          "C1 avalia a norma culta; C2, o tema, o tipo de texto e o repertório.",
          "C3 avalia a argumentação; C4, os conectivos e a ligação entre as ideias.",
          "C5 exige agente, ação, modo/meio, finalidade e detalhamento.",
          "A nota por competência mostra exatamente onde você precisa melhorar.",
        ],
        keyPoints: [
          { term: "Repertório legitimado", explanation: "Conhecimento verdadeiro e com fonte: um dado, uma lei, um pensador, um fato histórico." },
          { term: "Repertório produtivo", explanation: "Repertório que ajuda a defender a ideia do parágrafo, e não só aparece solto." },
          { term: "Coesão", explanation: "Ligação entre as palavras, frases e parágrafos, feita por conectivos e retomadas." },
        ],
        quiz: {
          choices: [
            {
              q: "Qual competência avalia o uso de conectivos como “além disso” e “portanto”?",
              options: ["Competência 1.", "Competência 2.", "Competência 3.", "Competência 4.", "Competência 5."],
              answer: 3,
              explanation: "A competência 4 avalia a coesão: conectivos, pronomes e outras formas de ligar as ideias.",
            },
            {
              q: "Um texto com muitos erros de concordância e ortografia perde pontos principalmente em qual competência?",
              options: ["Competência 1.", "Competência 2.", "Competência 3.", "Competência 4.", "Competência 5."],
              answer: 0,
              explanation: "A competência 1 avalia o domínio da norma culta: ortografia, concordância, regência, pontuação.",
            },
            {
              q: "Quais são os cinco elementos de uma proposta de intervenção nota máxima?",
              options: [
                "Título, tese, argumento, exemplo e conclusão.",
                "Agente, ação, modo ou meio, finalidade e detalhamento.",
                "Introdução, causa, consequência, dado e citação.",
                "Problema, culpado, punição, lei e prazo.",
                "Tema, recorte, repertório, conectivo e ponto final.",
              ],
              answer: 1,
              explanation: "A proposta completa diz quem faz (agente), o que faz (ação), como faz (modo/meio), para quê (finalidade) e explica algum elemento (detalhamento).",
            },
            {
              q: "Para ser bem avaliado na competência 2, o repertório usado na redação precisa ser:",
              options: [
                "longo, ocupando um parágrafo inteiro.",
                "copiado dos textos motivadores.",
                "legitimado e produtivo, ligado à discussão.",
                "sempre uma citação em outra língua.",
                "inventado, desde que pareça verdadeiro.",
              ],
              answer: 2,
              explanation: "O repertório deve ser verdadeiro e com fonte (legitimado) e ajudar a defender a ideia (produtivo).",
            },
            {
              q: "Qual competência avalia se o aluno tem um projeto de texto claro, com argumentos que defendem a tese?",
              options: ["Competência 1.", "Competência 2.", "Competência 3.", "Competência 4.", "Competência 5."],
              answer: 2,
              explanation: "A competência 3 avalia a seleção e a organização dos argumentos em defesa do ponto de vista.",
            },
          ],
          open: [
            {
              q: "Por que olhar a nota de cada competência ajuda a melhorar a redação?",
              expected: "Porque a nota de cada competência mostra em qual parte o aluno está mais fraco, como norma culta, argumentação ou proposta de intervenção, e indica o que treinar.",
            },
          ],
        },
      },
      {
        title: "Entendendo o tema: palavras-chave e recorte",
        content: `## O erro que mais derruba notas

Muita gente perde pontos porque escreve sobre o **assunto geral** e não sobre o **tema** pedido. Entender o tema é o primeiro passo de qualquer redação.

## Assunto, tema e recorte

- **Assunto:** a área geral. Exemplo: educação.
- **Tema:** o problema específico dentro do assunto. Exemplo: evasão escolar.
- **Recorte:** os detalhes que delimitam o tema. Exemplo: "Caminhos para reduzir a evasão escolar **entre jovens brasileiros**".

Neste exemplo, o texto precisa falar de **evasão** (e não de qualidade do ensino em geral), de **jovens** e do **Brasil**, apontando **caminhos** para reduzir o problema.

## Sublinhe as palavras-chave

Antes de escrever, sublinhe as palavras que carregam o sentido do tema. Pergunte:

1. Qual é o problema central?
2. Quem é afetado?
3. Onde acontece?
4. O tema pede causas, desafios, caminhos ou impactos?

Use essas palavras ao longo do texto, principalmente na introdução e no começo de cada parágrafo. Isso mostra ao corretor que você está dentro do tema.

## Tangenciar não é fugir, mas custa caro

- **Fuga ao tema:** falar de outro assunto. A nota é zero.
- **Tangenciamento:** falar do assunto geral sem chegar ao recorte. A nota cai muito nas competências 2, 3 e 5.

Exemplo: se o tema é "O impacto do uso excessivo de celulares na saúde mental dos adolescentes" e você escreve só sobre "tecnologia na sociedade", você tangenciou.

## Use os textos motivadores a seu favor

Os textos motivadores ajudam a entender o recorte e dão pistas de causas e consequências. Leia todos, mas **não copie**: use as ideias com as suas palavras e acrescente o seu próprio repertório.

## Resumindo

Separe assunto, tema e recorte. Sublinhe as palavras-chave, responda às quatro perguntas e mantenha essas palavras no texto inteiro.`,
        highlights: [
          "Assunto é a área geral; tema é o problema; recorte são os detalhes que delimitam o tema.",
          "Sublinhe as palavras-chave e use-as ao longo do texto.",
          "Fugir do tema zera; tangenciar derruba a nota em várias competências.",
          "Use os textos motivadores como pista, mas nunca copie.",
        ],
        keyPoints: [
          { term: "Recorte temático", explanation: "Parte específica do tema que o texto precisa discutir (quem, onde, qual aspecto)." },
          { term: "Tangenciamento", explanation: "Falar só do assunto geral, sem chegar ao recorte pedido." },
          { term: "Palavras-chave", explanation: "Palavras do tema que carregam o sentido principal e devem aparecer no texto." },
        ],
        quiz: {
          choices: [
            {
              q: "No tema “Caminhos para reduzir a evasão escolar entre jovens brasileiros”, qual é o recorte?",
              options: ["Educação em geral.", "Evasão escolar entre jovens do Brasil, com foco em soluções.", "Qualidade dos professores no mundo.", "Tecnologia na escola.", "Vestibular e ENEM."],
              answer: 1,
              explanation: "O recorte delimita o tema: evasão (problema), jovens (quem), Brasil (onde) e caminhos (o texto deve propor soluções).",
            },
            {
              q: "Um aluno recebeu um tema sobre saúde mental dos adolescentes e escreveu só sobre tecnologia na sociedade. Isso é:",
              options: ["Fuga total, com nota zero.", "Tangenciamento, que derruba a nota.", "Um texto perfeito.", "Cópia dos textos motivadores.", "Um erro só de gramática."],
              answer: 1,
              explanation: "Ele falou do assunto geral sem chegar ao recorte: é tangenciamento. A nota cai, mas não zera.",
            },
            {
              q: "Qual é a melhor forma de usar os textos motivadores?",
              options: ["Copiar os trechos mais bonitos.", "Ignorá-los completamente.", "Usar as ideias com suas palavras e somar repertório próprio.", "Resumir cada texto num parágrafo.", "Colocar o título deles na redação."],
              answer: 2,
              explanation: "Os textos dão pistas, mas copiar tira pontos. O ideal é usar as ideias com suas palavras e trazer repertório próprio.",
            },
            {
              q: "Por que repetir as palavras-chave do tema ao longo do texto?",
              options: ["Para ocupar mais linhas.", "Para mostrar ao corretor que o texto está dentro do tema.", "Porque o ENEM exige repetir o título.", "Para substituir os argumentos.", "Para evitar usar conectivos."],
              answer: 1,
              explanation: "Retomar as palavras-chave (com variações) mostra que você discute exatamente o tema pedido.",
            },
            {
              q: "Qual destas é uma das perguntas úteis para entender um tema?",
              options: ["Qual é a minha cor favorita?", "Quantas linhas vou escrever?", "O tema pede causas, desafios, caminhos ou impactos?", "Qual foi o tema do ano passado?", "Vou usar caneta azul ou preta?"],
              answer: 2,
              explanation: "Saber se o tema pede desafios, caminhos ou impactos define o foco de toda a argumentação.",
            },
          ],
          open: [
            {
              q: "Explique a diferença entre fugir do tema e tangenciar o tema.",
              expected: "Fugir do tema é escrever sobre outro assunto e a nota é zero. Tangenciar é falar só do assunto geral sem chegar ao recorte do tema, o que derruba a nota mas não zera.",
            },
          ],
        },
      },
      {
        title: "A estrutura da redação: quatro parágrafos",
        content: `## Um modelo que funciona

Não existe uma única forma de escrever, mas a estrutura em **quatro parágrafos** é a mais segura para o ENEM:

1. **Introdução** (cerca de 5 linhas)
2. **Desenvolvimento 1** (cerca de 8 linhas)
3. **Desenvolvimento 2** (cerca de 8 linhas)
4. **Conclusão** (cerca de 6 a 7 linhas)

Somando, dá entre 25 e 30 linhas: o tamanho ideal.

## Introdução

Apresenta o tema e a sua **tese** (o seu ponto de vista). Uma boa introdução tem:

- uma **contextualização** (um repertório, um dado ou um fato que abre o assunto);
- a **tese**, ligada ao tema;
- o **anúncio dos dois argumentos** que serão desenvolvidos.

## Desenvolvimento

Cada parágrafo defende **um argumento**. Use a sequência:

- **Tópico frasal:** a primeira frase diz qual é a ideia do parágrafo.
- **Fundamentação:** explica a ideia e traz repertório (dado, lei, autor, fato histórico).
- **Fechamento:** liga o argumento de volta à tese.

Um parágrafo pode falar das **causas** do problema e o outro das **consequências**, ou cada um pode tratar de um agente diferente (Estado e sociedade, por exemplo).

## Conclusão

Retoma a tese em uma frase e apresenta a **proposta de intervenção** completa: agente, ação, modo ou meio, finalidade e detalhamento. O ideal é que a proposta resolva os problemas apontados no desenvolvimento.

## Planeje antes de escrever

Antes de passar a limpo, faça um esquema rápido:

- Tese: ...
- Argumento 1 + repertório: ...
- Argumento 2 + repertório: ...
- Proposta: quem, o quê, como, para quê, detalhe.

Esse esquema leva poucos minutos e evita que o texto fique perdido no meio.

## Resumindo

Introdução com contexto, tese e anúncio dos argumentos; dois parágrafos de desenvolvimento com tópico frasal, fundamentação e fechamento; conclusão com a proposta completa.`,
        highlights: [
          "Estrutura segura: introdução, dois parágrafos de desenvolvimento e conclusão.",
          "A introdução tem contextualização, tese e anúncio dos argumentos.",
          "Cada desenvolvimento: tópico frasal, fundamentação com repertório e fechamento.",
          "Planeje um esquema antes de passar a limpo.",
        ],
        keyPoints: [
          { term: "Tese", explanation: "O ponto de vista que o texto defende sobre o tema." },
          { term: "Tópico frasal", explanation: "Primeira frase do parágrafo, que apresenta a ideia dele." },
          { term: "Fundamentação", explanation: "Explicação do argumento com repertório e exemplos." },
        ],
        quiz: {
          choices: [
            {
              q: "Quantos parágrafos tem a estrutura mais segura para a redação do ENEM?",
              options: ["Dois.", "Três.", "Quatro.", "Seis.", "Oito."],
              answer: 2,
              explanation: "Introdução, dois parágrafos de desenvolvimento e conclusão: quatro parágrafos.",
            },
            {
              q: "O que NÃO costuma fazer parte da introdução?",
              options: ["Contextualização.", "Tese.", "Anúncio dos argumentos.", "Proposta de intervenção completa.", "Ligação com o tema."],
              answer: 3,
              explanation: "A proposta de intervenção completa fica na conclusão.",
            },
            {
              q: "Qual é a função do tópico frasal?",
              options: ["Encerrar o texto.", "Apresentar a ideia principal do parágrafo.", "Citar um autor obrigatoriamente.", "Repetir o título.", "Fazer uma pergunta ao leitor."],
              answer: 1,
              explanation: "O tópico frasal é a primeira frase do parágrafo e diz qual ideia será desenvolvida.",
            },
            {
              q: "Onde a proposta de intervenção deve aparecer?",
              options: ["No título.", "Na introdução.", "No primeiro desenvolvimento.", "Na conclusão.", "Em uma nota de rodapé."],
              answer: 3,
              explanation: "A conclusão retoma a tese e apresenta a proposta de intervenção completa.",
            },
            {
              q: "Por que fazer um esquema antes de escrever?",
              options: ["Porque o esquema é corrigido.", "Para o texto não se perder e os argumentos ficarem organizados.", "Para escrever menos de 7 linhas.", "Para copiar os textos motivadores.", "Porque o ENEM obriga."],
              answer: 1,
              explanation: "O esquema organiza tese, argumentos e proposta, evitando que o texto fique confuso.",
            },
          ],
          open: [
            {
              q: "Descreva as três partes de um parágrafo de desenvolvimento.",
              expected: "Tópico frasal, que apresenta a ideia; fundamentação, que explica o argumento com repertório; e fechamento, que liga o argumento de volta à tese.",
            },
          ],
        },
      },
      {
        title: "Introdução nota mil: contexto e tese",
        content: `## O primeiro parágrafo dá o tom

A introdução é a primeira impressão do corretor. Em cerca de cinco linhas, ela precisa mostrar que você entendeu o tema e sabe para onde o texto vai.

## Os três movimentos

1. **Contextualização:** abre o assunto com um repertório. Pode ser um fato histórico, uma lei, um dado, um pensador, uma obra de arte ou um filme.
2. **Ligação com o tema:** mostra que o repertório tem a ver com o problema de hoje.
3. **Tese com anúncio dos argumentos:** diz o seu ponto de vista e quais são os dois motivos que você vai desenvolver.

## Um exemplo comentado

Tema: "Caminhos para combater a desinformação nas redes sociais no Brasil".

> A Constituição Federal de 1988 garante a todos o direito à informação. Na prática, porém, esse direito é ameaçado pela circulação de notícias falsas nas redes sociais brasileiras. Esse cenário se mantém tanto pela falta de educação midiática nas escolas quanto pela omissão das plataformas digitais no controle desses conteúdos.

- Contexto: a Constituição e o direito à informação.
- Ligação: "na prática, porém...".
- Tese e argumentos: falta de educação midiática e omissão das plataformas.

## Formas de começar

- **Alusão histórica:** "Durante a Revolução Industrial..."
- **Dado:** "Segundo o IBGE..." (use só dados que você conhece de verdade).
- **Citação:** "Para o sociólogo Zygmunt Bauman..."
- **Lei:** "O Estatuto da Criança e do Adolescente determina..."

## O que evitar

- Perguntas retóricas no lugar da tese ("Será que um dia isso vai mudar?").
- Frases vagas como "Desde os primórdios da humanidade...".
- Repertório sem ligação com o tema, só para enfeitar.
- Começar a argumentar na introdução: deixe isso para o desenvolvimento.

## Resumindo

Contextualize com um repertório, ligue ao tema e termine com a tese e os dois argumentos que virão. Uma introdução clara deixa o resto do texto muito mais fácil de escrever.`,
        highlights: [
          "Introdução: contextualização, ligação com o tema e tese com os dois argumentos.",
          "Comece com um repertório: fato histórico, lei, dado, pensador ou obra.",
          "Evite perguntas no lugar da tese e frases vagas.",
          "Não use dados que você não conhece de verdade.",
        ],
        keyPoints: [
          { term: "Contextualização", explanation: "Abertura que situa o tema usando um repertório." },
          { term: "Alusão histórica", explanation: "Referência a um fato do passado para introduzir o tema." },
          { term: "Anúncio dos argumentos", explanation: "Parte da tese que antecipa os dois motivos que serão desenvolvidos." },
        ],
        quiz: {
          choices: [
            {
              q: "Qual é a ordem dos movimentos de uma boa introdução?",
              options: [
                "Proposta, tese e conclusão.",
                "Contextualização, ligação com o tema e tese com os argumentos.",
                "Pergunta retórica, dado e despedida.",
                "Título, resumo dos textos motivadores e opinião.",
                "Argumento 1, argumento 2 e tese.",
              ],
              answer: 1,
              explanation: "A introdução abre com um repertório, liga ao tema e termina com a tese e o anúncio dos argumentos.",
            },
            {
              q: "Qual destas frases é a melhor forma de começar uma redação?",
              options: [
                "Desde os primórdios da humanidade, as pessoas têm problemas.",
                "Será que um dia o Brasil vai mudar?",
                "A Constituição de 1988 garante o direito à educação a todos os brasileiros.",
                "Eu acho que esse tema é muito importante.",
                "Hoje vou falar sobre um assunto interessante.",
              ],
              answer: 2,
              explanation: "Começar com um repertório concreto e verdadeiro (a Constituição) é muito melhor do que frases vagas ou perguntas.",
            },
            {
              q: "Por que evitar uma pergunta retórica no lugar da tese?",
              options: [
                "Porque perguntas são proibidas no ENEM.",
                "Porque a tese precisa afirmar um ponto de vista, e a pergunta não afirma nada.",
                "Porque perguntas ocupam muitas linhas.",
                "Porque o corretor não gosta de interrogação.",
                "Porque zera a redação.",
              ],
              answer: 1,
              explanation: "A tese é uma afirmação do seu ponto de vista. Uma pergunta deixa o projeto de texto sem direção.",
            },
            {
              q: "Na introdução do exemplo, quais eram os dois argumentos anunciados?",
              options: [
                "Falta de educação midiática e omissão das plataformas.",
                "Pobreza e violência.",
                "Uso de celulares e falta de esportes.",
                "Desemprego e inflação.",
                "Falta de leis e excesso de impostos.",
              ],
              answer: 0,
              explanation: "A tese anunciava a falta de educação midiática nas escolas e a omissão das plataformas digitais.",
            },
            {
              q: "Sobre o uso de dados na introdução, o recomendado é:",
              options: [
                "inventar números que pareçam reais.",
                "usar só dados que você conhece de verdade.",
                "sempre usar porcentagens.",
                "nunca usar dados.",
                "copiar os dados dos textos motivadores sem citar.",
              ],
              answer: 1,
              explanation: "Dados inventados são um risco: use apenas informações verdadeiras que você realmente conhece.",
            },
          ],
          open: [
            {
              q: "Escreva uma tese para o tema “O combate ao desperdício de alimentos no Brasil”, anunciando dois argumentos.",
              expected: "Uma tese que afirma que o desperdício de alimentos persiste no Brasil e aponta duas causas ou motivos, por exemplo a falta de educação para o consumo consciente e problemas no transporte e armazenamento dos alimentos.",
            },
          ],
        },
      },
      {
        title: "Repertório sociocultural: como usar bem",
        content: `## O que é repertório

**Repertório sociocultural** é todo conhecimento que você traz de fora dos textos motivadores para fortalecer a argumentação: filósofos, sociólogos, leis, dados, fatos históricos, livros, filmes, músicas e acontecimentos atuais.

## Legitimado e produtivo

Para valer pontos na competência 2, o repertório precisa ser:

- **Legitimado:** verdadeiro e reconhecido. Um pensador real, uma lei que existe, um dado de instituição séria.
- **Pertinente:** ligado ao tema.
- **Produtivo:** usado para defender a ideia do parágrafo, e não apenas citado e abandonado.

Um repertório produtivo é **explicado** e **relacionado** ao problema. Não basta escrever o nome de um autor: diga o que ele pensava e como isso ajuda a entender o tema.

## Repertórios coringas

Alguns conhecimentos servem para muitos temas:

- **Constituição Federal de 1988:** direitos à educação, saúde, moradia, lazer, informação.
- **Zygmunt Bauman:** a ideia de "modernidade líquida", em que as relações ficam frágeis e passageiras.
- **Émile Durkheim:** o "fato social", comportamentos que a sociedade impõe às pessoas.
- **Paulo Freire:** a educação como prática de liberdade e de formação crítica.
- **Estatuto da Criança e do Adolescente (ECA):** proteção integral de crianças e adolescentes.
- **Declaração Universal dos Direitos Humanos (1948).**

## Exemplo de uso produtivo

Ruim: "Como dizia Bauman, a modernidade é líquida. Além disso, as redes sociais..."

Bom: "Segundo Zygmunt Bauman, vivemos uma modernidade líquida, em que os vínculos são frágeis e passageiros. Nas redes sociais, isso se vê na troca constante de conteúdos superficiais, que favorece o compartilhamento de notícias falsas sem checagem."

Na segunda versão, o repertório é explicado e ligado ao tema.

## Monte o seu banco de repertórios

Anote, para cada grande eixo (educação, saúde, meio ambiente, tecnologia, desigualdade, cultura), dois ou três repertórios que você domina. Assim, na hora da prova, você já tem material.

## Resumindo

Use repertório verdadeiro, ligado ao tema e explicado. Tenha alguns coringas preparados, mas sempre mostre a relação com o problema.`,
        highlights: [
          "Repertório é conhecimento de fora dos textos motivadores: autores, leis, dados, fatos, obras.",
          "Ele precisa ser legitimado, pertinente e produtivo.",
          "Explique o repertório e relacione-o ao tema: não basta citar o nome.",
          "Monte um banco de repertórios por eixo temático.",
        ],
        keyPoints: [
          { term: "Repertório sociocultural", explanation: "Conhecimentos de várias áreas usados para fortalecer a argumentação." },
          { term: "Modernidade líquida", explanation: "Ideia de Bauman: relações e valores frágeis e passageiros na sociedade atual." },
          { term: "Fato social", explanation: "Conceito de Durkheim: maneiras de agir que a sociedade impõe às pessoas." },
        ],
        quiz: {
          choices: [
            {
              q: "O que é um repertório produtivo?",
              options: [
                "Um repertório longo, com muitas citações.",
                "Um repertório explicado e ligado ao argumento do parágrafo.",
                "Qualquer frase em latim.",
                "Um trecho copiado do texto motivador.",
                "Um repertório colocado só no título.",
              ],
              answer: 1,
              explanation: "Produtivo é o repertório que ajuda a defender a ideia: ele é explicado e relacionado ao tema.",
            },
            {
              q: "Qual destes é um exemplo de repertório legitimado?",
              options: [
                "“Um especialista disse que a internet é ruim.”",
                "“Todo mundo sabe que isso é verdade.”",
                "“O ECA garante a proteção integral de crianças e adolescentes.”",
                "“Um amigo meu passou por isso.”",
                "“Dizem por aí que 90% das pessoas concordam.”",
              ],
              answer: 2,
              explanation: "O ECA é uma lei real e reconhecida. As outras frases são vagas ou sem fonte.",
            },
            {
              q: "Qual pensador ficou conhecido pela ideia de “modernidade líquida”?",
              options: ["Paulo Freire.", "Émile Durkheim.", "Zygmunt Bauman.", "Karl Marx.", "Aristóteles."],
              answer: 2,
              explanation: "Zygmunt Bauman descreveu a modernidade líquida, com relações frágeis e passageiras.",
            },
            {
              q: "Em qual competência o repertório é avaliado principalmente?",
              options: ["Competência 1.", "Competência 2.", "Competência 4.", "Competência 5.", "Em nenhuma."],
              answer: 1,
              explanation: "A competência 2 avalia o tema, o tipo de texto e o uso do repertório sociocultural.",
            },
            {
              q: "Qual é a melhor estratégia para ter repertório na hora da prova?",
              options: [
                "Decorar uma redação pronta.",
                "Inventar autores na hora.",
                "Montar um banco de repertórios por eixo temático e saber explicá-los.",
                "Usar só os textos motivadores.",
                "Citar o maior número possível de nomes.",
              ],
              answer: 2,
              explanation: "Ter alguns repertórios que você domina em cada eixo permite usá-los bem em vários temas.",
            },
          ],
          open: [
            {
              q: "Por que não basta citar o nome de um autor na redação?",
              expected: "Porque o repertório precisa ser produtivo: é preciso explicar a ideia do autor e mostrar como ela se relaciona com o tema e ajuda a defender o argumento.",
            },
          ],
        },
      },
      {
        title: "Desenvolvimento: como argumentar de verdade",
        content: `## O coração do texto

Os parágrafos de desenvolvimento são onde você **prova** a sua tese. É aqui que a competência 3 (argumentação) é decidida.

## O argumento completo

Um bom parágrafo segue quatro passos:

1. **Tópico frasal:** apresenta a ideia. "Em primeiro lugar, a falta de educação midiática favorece a desinformação."
2. **Explicação:** mostra por que isso acontece. "Sem aprender a checar fontes, muitos usuários compartilham conteúdos sem verificar se são verdadeiros."
3. **Repertório:** comprova ou aprofunda. Um dado, um autor, um fato.
4. **Fechamento:** conclui o parágrafo voltando à tese. "Desse modo, a ausência dessa formação mantém o problema."

## Estratégias de argumentação

- **Causa e consequência:** mostrar o que provoca o problema e o que ele causa.
- **Exemplificação:** um caso concreto que ilustra a ideia.
- **Comparação:** com outro país ou outra época.
- **Dados:** números que mostram o tamanho do problema.
- **Autoridade:** a opinião de um especialista ou instituição.

## Aprofunde, não liste

Um erro comum é listar várias ideias sem explicar nenhuma. Prefira **uma ideia bem desenvolvida** por parágrafo a cinco ideias soltas. O corretor quer ver você **interpretar** a informação, e não só apresentá-la.

## Ligue os parágrafos

O segundo desenvolvimento deve começar com um conectivo que mostre a continuação: "Além disso", "Somado a isso", "Paralelamente". E os dois argumentos precisam ser os mesmos que você anunciou na introdução: isso mostra um **projeto de texto** bem pensado.

## Evite contradições e generalizações

Cuidado com frases como "todos os jovens só pensam em celular". Generalizações enfraquecem o argumento. Prefira "grande parte dos jovens" ou traga um dado.

## Resumindo

Tópico frasal, explicação, repertório e fechamento. Uma ideia bem aprofundada por parágrafo, ligada à tese e anunciada na introdução.`,
        highlights: [
          "Parágrafo completo: tópico frasal, explicação, repertório e fechamento.",
          "Prefira uma ideia bem desenvolvida a várias ideias soltas.",
          "Os argumentos do desenvolvimento devem ser os anunciados na introdução.",
          "Evite generalizações como “todos” e “nunca”.",
        ],
        keyPoints: [
          { term: "Projeto de texto", explanation: "Planejamento visível em que introdução, argumentos e conclusão se encaixam." },
          { term: "Argumento por causa e consequência", explanation: "Mostra o que provoca o problema e quais efeitos ele gera." },
          { term: "Generalização", explanation: "Afirmação exagerada sobre todos os casos, que enfraquece o argumento." },
        ],
        quiz: {
          choices: [
            {
              q: "Qual é a sequência de um parágrafo de desenvolvimento completo?",
              options: [
                "Título, pergunta, resposta e despedida.",
                "Tópico frasal, explicação, repertório e fechamento.",
                "Proposta, agente, ação e finalidade.",
                "Dado, dado, dado e conclusão.",
                "Contexto, tese, anúncio e título.",
              ],
              answer: 1,
              explanation: "O parágrafo apresenta a ideia, explica, comprova com repertório e fecha ligando à tese.",
            },
            {
              q: "O que é melhor para a competência 3?",
              options: [
                "Listar o maior número possível de ideias.",
                "Desenvolver bem uma ideia por parágrafo.",
                "Repetir a tese em todas as frases.",
                "Usar só perguntas.",
                "Escrever parágrafos de duas linhas.",
              ],
              answer: 1,
              explanation: "Aprofundar uma ideia mostra capacidade de interpretar e argumentar, o que a competência 3 valoriza.",
            },
            {
              q: "Qual frase evita uma generalização?",
              options: [
                "Todos os jovens só pensam em celular.",
                "Nenhum político se importa com a educação.",
                "Grande parte dos jovens passa muitas horas por dia nas redes sociais.",
                "Sempre foi assim e sempre será.",
                "Todo mundo sabe que a escola é ruim.",
              ],
              answer: 2,
              explanation: "“Grande parte” é mais preciso e defensável do que “todos”, “nenhum” ou “sempre”.",
            },
            {
              q: "Qual conectivo é adequado para começar o segundo parágrafo de desenvolvimento?",
              options: ["Portanto.", "Em suma.", "Além disso.", "Por fim, conclui-se.", "Era uma vez."],
              answer: 2,
              explanation: "“Além disso” indica que um novo argumento está sendo somado ao anterior.",
            },
            {
              q: "Por que os argumentos do desenvolvimento devem ser os anunciados na introdução?",
              options: [
                "Porque o ENEM proíbe ideias novas.",
                "Para mostrar um projeto de texto coerente e planejado.",
                "Para economizar linhas.",
                "Porque o corretor só lê a introdução.",
                "Não precisam ser os mesmos.",
              ],
              answer: 1,
              explanation: "Cumprir o que foi anunciado mostra organização e um projeto de texto claro.",
            },
          ],
          open: [
            {
              q: "Escreva um tópico frasal para um parágrafo sobre as causas da evasão escolar entre jovens.",
              expected: "Uma frase que apresente uma causa da evasão escolar, por exemplo: em primeiro lugar, a necessidade de trabalhar para ajudar a família afasta muitos jovens da escola.",
            },
          ],
        },
      },
      {
        title: "Coesão: conectivos que ligam o texto",
        content: `## O que é coesão

Coesão é a **costura** do texto. Ela faz as frases e os parágrafos se ligarem de forma lógica. É avaliada na competência 4, e um texto com bons conectivos fica mais claro e ganha pontos.

## Conectivos por função

- **Adição:** além disso, ademais, também, somado a isso.
- **Oposição:** entretanto, contudo, todavia, no entanto, porém.
- **Causa:** porque, visto que, uma vez que, já que.
- **Consequência:** de modo que, por isso, consequentemente.
- **Conclusão:** portanto, logo, dessa forma, em suma.
- **Exemplo:** por exemplo, como, a exemplo de.
- **Finalidade:** para que, a fim de que, com o objetivo de.

Usar o conectivo errado muda o sentido. "Ele estudou, **portanto** foi reprovado" não faz sentido: o correto seria "**entretanto** foi reprovado".

## Retomar sem repetir

Outra parte da coesão é **retomar** ideias sem repetir as mesmas palavras:

- **Pronomes:** "A evasão escolar é grave. **Ela** afeta..."
- **Sinônimos:** "os estudantes" → "os alunos" → "os jovens".
- **Expressões resumidoras:** "**Esse cenário**", "**Tal problema**", "**Essa situação**".

## Coesão entre parágrafos

Comece cada parágrafo com um conectivo que mostre a relação com o anterior:

- 1º desenvolvimento: "Em primeiro lugar", "Primordialmente".
- 2º desenvolvimento: "Além disso", "Somado a isso", "Paralelamente".
- Conclusão: "Portanto", "Dessa forma", "Logo".

## Cuidado com o exagero

Conectivos são importantes, mas não precisam aparecer em toda frase. Use-os quando a relação entre as ideias realmente existe. E evite repetir o mesmo conectivo várias vezes.

## Resumindo

Use conectivos de acordo com a relação entre as ideias (adição, oposição, causa, conclusão), retome palavras com pronomes e sinônimos e ligue os parágrafos entre si.`,
        highlights: [
          "Coesão é a ligação entre frases e parágrafos, avaliada na competência 4.",
          "Escolha o conectivo pela relação de sentido: adição, oposição, causa, conclusão.",
          "Retome ideias com pronomes, sinônimos e expressões resumidoras.",
          "Comece cada parágrafo com um conectivo, sem repetir sempre o mesmo.",
        ],
        keyPoints: [
          { term: "Conectivo", explanation: "Palavra ou expressão que liga ideias mostrando a relação entre elas." },
          { term: "Retomada", explanation: "Uso de pronome ou sinônimo para não repetir a mesma palavra." },
          { term: "Expressão resumidora", explanation: "Expressão como “esse cenário” que resume o que foi dito antes." },
        ],
        quiz: {
          choices: [
            {
              q: "Qual conectivo indica oposição?",
              options: ["Além disso.", "Portanto.", "Entretanto.", "Visto que.", "Por exemplo."],
              answer: 2,
              explanation: "“Entretanto” indica uma ideia contrária à anterior, como “porém” e “contudo”.",
            },
            {
              q: "Complete corretamente: “Ele estudou bastante, ___ foi aprovado.”",
              options: ["entretanto", "portanto", "contudo", "embora", "todavia"],
              answer: 1,
              explanation: "Ser aprovado é consequência de estudar: “portanto” expressa essa conclusão.",
            },
            {
              q: "Qual é uma forma de retomar uma ideia sem repetir a palavra?",
              options: ["Usar um sinônimo ou um pronome.", "Repetir a palavra em maiúsculas.", "Deixar a frase sem sujeito.", "Usar reticências.", "Trocar o parágrafo."],
              answer: 0,
              explanation: "Pronomes e sinônimos retomam o que já foi dito sem repetição.",
            },
            {
              q: "Qual conectivo é mais adequado para começar a conclusão?",
              options: ["Primordialmente.", "Além disso.", "Dessa forma.", "Por exemplo.", "Em primeiro lugar."],
              answer: 2,
              explanation: "“Dessa forma”, “portanto” e “logo” indicam conclusão.",
            },
            {
              q: "“Visto que” e “uma vez que” expressam:",
              options: ["oposição.", "adição.", "causa.", "finalidade.", "exemplo."],
              answer: 2,
              explanation: "Os dois introduzem o motivo (a causa) de algo.",
            },
          ],
          open: [
            {
              q: "Explique por que usar o conectivo errado pode prejudicar a redação.",
              expected: "Porque o conectivo mostra a relação entre as ideias; usar o errado muda o sentido da frase, deixa o texto incoerente e tira pontos na competência 4.",
            },
          ],
        },
      },
      {
        title: "Norma culta: os erros que mais tiram pontos",
        content: `## Competência 1 sem sustos

A competência 1 avalia a escrita formal. Ninguém precisa ser gramático: basta evitar os erros mais comuns e revisar o texto no final.

## Concordância

O verbo concorda com o sujeito, mesmo quando o sujeito está longe ou depois do verbo.

- Errado: "**Existe** muitos problemas." Certo: "**Existem** muitos problemas."
- Errado: "**Haviam** muitas escolas." Certo: "**Havia** muitas escolas." (o verbo "haver" no sentido de existir fica no singular).
- Errado: "A maioria dos jovens **acham**..." Prefira: "A maioria dos jovens **acha**..."

## Crase

Use crase antes de palavra feminina quando houver "a + a": "Vou **à** escola", "Referiu-se **às** leis". Não use crase antes de verbo ("começou a estudar") nem antes de palavra masculina ("a pé").

## Pontuação

- Não separe o sujeito do verbo com vírgula. Errado: "Os jovens**,** precisam estudar."
- Use vírgula depois de expressões no começo da frase: "Além disso**,** ..."
- Evite frases muito longas: divida com ponto final.

## Mas, mais, mau, mal, por que

- **Mas:** oposição. **Mais:** quantidade.
- **Mal:** oposto de bem. **Mau:** oposto de bom.
- **Por que** (pergunta), **porque** (explicação), **por quê** (no fim de frase), **porquê** (substantivo).

## Registro formal

Evite gírias, abreviações ("vc", "tb") e marcas de oralidade ("tipo", "a gente", "né"). Prefira "nós" e a terceira pessoa ("é necessário", "deve-se").

## Revise no final

Reserve alguns minutos para reler a redação procurando só erros: concordância, acentos, crase e vírgulas. Muitos pontos são salvos nessa revisão.

## Resumindo

Atenção à concordância (inclusive com "haver"), à crase, às vírgulas entre sujeito e verbo, às palavras parecidas e ao registro formal. E sempre revise.`,
        highlights: [
          "“Haver” no sentido de existir fica no singular: “havia muitas escolas”.",
          "Não separe o sujeito do verbo com vírgula.",
          "Crase: a + a antes de palavra feminina; nunca antes de verbo.",
          "Evite gírias, abreviações e “a gente”; revise o texto no final.",
        ],
        keyPoints: [
          { term: "Concordância verbal", explanation: "O verbo combina em número e pessoa com o sujeito." },
          { term: "Crase", explanation: "Junção da preposição “a” com o artigo “a”, marcada com acento grave." },
          { term: "Registro formal", explanation: "Linguagem cuidada, sem gírias nem marcas de conversa." },
        ],
        quiz: {
          choices: [
            {
              q: "Qual frase está correta?",
              options: ["Haviam muitos alunos na sala.", "Existe muitos problemas na cidade.", "Havia muitos alunos na sala.", "Fazem dois anos que estudo.", "Os jovens, precisam estudar."],
              answer: 2,
              explanation: "“Haver” no sentido de existir não vai para o plural: “havia muitos alunos”.",
            },
            {
              q: "Em qual frase a crase está correta?",
              options: ["Começou à estudar cedo.", "Fui à escola ontem.", "Voltou à pé.", "Entregou o trabalho à ele.", "Ficou à esperar."],
              answer: 1,
              explanation: "“Ir a + a escola” = “à escola”. Não há crase antes de verbo, de palavra masculina ou de pronome “ele”.",
            },
            {
              q: "Qual frase tem um erro de pontuação?",
              options: [
                "Além disso, o governo deve agir.",
                "Os estudantes, precisam de apoio.",
                "Portanto, a escola tem um papel central.",
                "No Brasil, a desigualdade é grande.",
                "Dessa forma, o problema persiste.",
              ],
              answer: 1,
              explanation: "Não se separa o sujeito (“Os estudantes”) do verbo (“precisam”) com vírgula.",
            },
            {
              q: "Complete: “Ele não veio à aula ___ estava doente.”",
              options: ["por que", "porque", "por quê", "porquê", "mais"],
              answer: 1,
              explanation: "“Porque” junto e sem acento introduz uma explicação.",
            },
            {
              q: "Qual expressão deve ser evitada na redação do ENEM?",
              options: ["É necessário.", "Deve-se.", "A gente precisa.", "Nós devemos.", "Cabe ao Estado."],
              answer: 2,
              explanation: "“A gente” é marca de oralidade. Prefira “nós” ou construções impessoais.",
            },
          ],
          open: [
            {
              q: "Corrija a frase e explique o erro: “Haviam muitas pessoas sem acesso à internet.”",
              expected: "O correto é “Havia muitas pessoas sem acesso à internet”, porque o verbo haver no sentido de existir é impessoal e fica no singular.",
            },
          ],
        },
      },
      {
        title: "Proposta de intervenção completa",
        content: `## A competência mais fácil de gabaritar

A competência 5 tem regras claras. Se a proposta tiver os **cinco elementos** e respeitar os direitos humanos, você chega aos 200 pontos.

## Os cinco elementos

1. **Agente:** quem vai agir. Seja específico: "o Ministério da Educação", "as escolas", "a mídia", "as famílias", "as ONGs".
2. **Ação:** o que será feito. "criar campanhas", "promover oficinas", "ampliar o acesso".
3. **Modo ou meio:** como será feito. "por meio de parcerias com universidades", "mediante verbas públicas".
4. **Finalidade:** para quê. "a fim de reduzir a evasão escolar".
5. **Detalhamento:** uma explicação a mais sobre qualquer elemento. "oficinas **semanais**, conduzidas por **psicólogos**".

## Exemplo completo

> Portanto, cabe ao Ministério da Educação (agente) incluir a educação midiática no currículo das escolas públicas (ação), por meio de oficinas semanais conduzidas por professores capacitados (modo e detalhamento), a fim de ensinar os jovens a verificar a veracidade das informações (finalidade).

## Ligue a proposta ao problema

A melhor proposta **resolve os problemas apontados** no desenvolvimento. Se você disse que a causa é a falta de educação midiática, proponha justamente isso. Isso mostra coerência.

## Respeite os direitos humanos

Propostas que violam direitos (como punições cruéis, censura total ou exclusão de grupos) são penalizadas. Prefira soluções educativas, de conscientização, de políticas públicas e de fiscalização.

## Dicas extras

- Você pode fazer **duas propostas**, uma para cada argumento. Basta que pelo menos uma esteja completa.
- Evite agentes vagos como "eles", "alguém" ou "a sociedade" sozinha.
- Não deixe a proposta genérica: "o governo deve fazer algo" vale pouco.

## Resumindo

Agente, ação, modo ou meio, finalidade e detalhamento, ligados ao problema discutido e respeitando os direitos humanos.`,
        highlights: [
          "Os cinco elementos: agente, ação, modo ou meio, finalidade e detalhamento.",
          "Agente específico vale mais do que “alguém” ou “a sociedade”.",
          "A proposta deve resolver os problemas apontados no desenvolvimento.",
          "Propostas que violam os direitos humanos são penalizadas.",
        ],
        keyPoints: [
          { term: "Agente", explanation: "Quem vai executar a ação proposta." },
          { term: "Finalidade", explanation: "O objetivo da ação: para que ela será feita." },
          { term: "Detalhamento", explanation: "Informação a mais sobre um dos elementos da proposta." },
        ],
        quiz: {
          choices: [
            {
              q: "Na proposta “cabe ao Ministério da Educação criar oficinas…”, qual é o agente?",
              options: ["As oficinas.", "O Ministério da Educação.", "Os alunos.", "A finalidade.", "O texto motivador."],
              answer: 1,
              explanation: "O agente é quem executa a ação: o Ministério da Educação.",
            },
            {
              q: "Qual trecho representa a finalidade da proposta?",
              options: [
                "o Ministério da Educação",
                "por meio de parcerias com universidades",
                "a fim de reduzir a evasão escolar",
                "oficinas semanais",
                "Portanto,",
              ],
              answer: 2,
              explanation: "“A fim de…” indica o objetivo da ação, ou seja, a finalidade.",
            },
            {
              q: "Qual proposta respeita os direitos humanos?",
              options: [
                "Prender todos os usuários de redes sociais.",
                "Proibir jovens de usar a internet para sempre.",
                "Promover campanhas educativas sobre checagem de notícias.",
                "Excluir da escola alunos com notas baixas.",
                "Punir fisicamente quem espalha boatos.",
              ],
              answer: 2,
              explanation: "Campanhas educativas resolvem o problema sem violar direitos. As outras opções são abusivas.",
            },
            {
              q: "Qual destes agentes é mais adequado?",
              options: ["Alguém.", "Eles.", "As escolas públicas, em parceria com o Ministério da Saúde.", "A sociedade, de algum jeito.", "Todo mundo."],
              answer: 2,
              explanation: "Agentes específicos deixam a proposta concreta. “Alguém” e “eles” são vagos.",
            },
            {
              q: "Por que a proposta deve se ligar aos argumentos do desenvolvimento?",
              options: [
                "Porque mostra coerência: a solução resolve os problemas apontados.",
                "Porque o ENEM proíbe propostas novas.",
                "Para repetir o desenvolvimento.",
                "Para ocupar mais linhas.",
                "Não precisa ligar.",
              ],
              answer: 0,
              explanation: "Uma proposta que ataca as causas discutidas mostra um texto coerente do começo ao fim.",
            },
          ],
          open: [
            {
              q: "Escreva uma proposta de intervenção completa (com os cinco elementos) para o problema do desperdício de alimentos.",
              expected: "Uma proposta com agente específico, ação, modo ou meio, finalidade e detalhamento, por exemplo: cabe ao Ministério do Desenvolvimento Social criar programas de doação de alimentos, por meio de parcerias com supermercados e ONGs que recolham diariamente os produtos próximos do vencimento, a fim de reduzir o desperdício e combater a fome.",
            },
          ],
        },
      },
      {
        title: "A conclusão e a revisão final",
        content: `## Fechar bem é tão importante quanto começar

A conclusão é o último contato do corretor com o seu texto. Ela precisa **retomar a tese** e apresentar a **proposta de intervenção**, sem trazer argumentos novos.

## Como montar a conclusão

1. **Conectivo de conclusão:** "Portanto", "Dessa forma", "Logo".
2. **Retomada da tese** em uma frase curta: "...é evidente que a desinformação nas redes exige ação conjunta."
3. **Proposta de intervenção** completa (agente, ação, modo ou meio, finalidade e detalhamento).
4. **Frase final** opcional, retomando o repertório da introdução. Isso dá a sensação de texto "fechado".

## Exemplo

> Portanto, é evidente que a desinformação nas redes sociais exige ação conjunta. Para isso, cabe ao Ministério da Educação incluir a educação midiática no currículo escolar, por meio de oficinas semanais com professores capacitados, a fim de formar jovens capazes de checar o que leem. Assim, o direito à informação previsto na Constituição deixará de ser apenas uma promessa.

Repare como a última frase retoma a Constituição, citada na introdução.

## O que evitar na conclusão

- Argumentos novos que não foram discutidos.
- Frases como "Espero ter ajudado" ou "Esse é o meu ponto de vista".
- Propostas sem agente ou sem finalidade.
- Terminar com perguntas.

## A revisão final

Antes de entregar, leia o texto inteiro com calma e confira:

- **Tema:** as palavras-chave aparecem? Você não tangenciou?
- **Estrutura:** introdução, desenvolvimento e conclusão estão claros?
- **Proposta:** os cinco elementos estão lá?
- **Norma culta:** concordância, crase, vírgulas, acentos.
- **Linhas:** entre 25 e 30, sem rasuras exageradas.

## Resumindo

Conecte, retome a tese, apresente a proposta completa e, se quiser, feche retomando a introdução. Depois, revise tema, estrutura, proposta e gramática.`,
        highlights: [
          "A conclusão retoma a tese e traz a proposta de intervenção, sem argumentos novos.",
          "Retomar o repertório da introdução dá sensação de texto fechado.",
          "Evite “espero ter ajudado” e perguntas no final.",
          "Revise tema, estrutura, proposta, gramática e número de linhas.",
        ],
        keyPoints: [
          { term: "Retomada da tese", explanation: "Frase que lembra o ponto de vista defendido no texto." },
          { term: "Fechamento circular", explanation: "Terminar o texto retomando o repertório usado na introdução." },
          { term: "Revisão final", explanation: "Leitura atenta para conferir tema, estrutura, proposta e erros." },
        ],
        quiz: {
          choices: [
            {
              q: "O que NÃO deve aparecer na conclusão?",
              options: ["Retomada da tese.", "Proposta de intervenção.", "Um argumento novo que não foi discutido.", "Um conectivo de conclusão.", "Uma retomada da introdução."],
              answer: 2,
              explanation: "A conclusão fecha o que foi discutido. Argumentos novos ficam soltos, sem desenvolvimento.",
            },
            {
              q: "Qual frase é inadequada para encerrar a redação?",
              options: [
                "Assim, o direito à educação deixará de ser apenas uma promessa.",
                "Espero ter ajudado com o meu texto.",
                "Dessa forma, a sociedade será mais justa.",
                "Com isso, o problema poderá ser reduzido.",
                "Logo, os jovens terão mais oportunidades.",
              ],
              answer: 1,
              explanation: "“Espero ter ajudado” é informal e foge do gênero dissertativo-argumentativo.",
            },
            {
              q: "O que é o fechamento circular?",
              options: [
                "Terminar o texto com uma pergunta.",
                "Retomar no final o repertório da introdução.",
                "Repetir a introdução inteira.",
                "Escrever a conclusão em círculo.",
                "Colocar o título no fim.",
              ],
              answer: 1,
              explanation: "Retomar o repertório da introdução no final dá unidade e sensação de texto completo.",
            },
            {
              q: "Na revisão final, o que deve ser conferido?",
              options: [
                "Apenas a letra.",
                "Tema, estrutura, proposta, norma culta e número de linhas.",
                "Só o título.",
                "Se usou caneta azul.",
                "Se copiou os textos motivadores.",
              ],
              answer: 1,
              explanation: "A revisão completa evita perder pontos por descuidos em todas as competências.",
            },
            {
              q: "Qual conectivo abre bem a conclusão?",
              options: ["Primeiramente.", "Por exemplo.", "Portanto.", "Além disso.", "Visto que."],
              answer: 2,
              explanation: "“Portanto” indica que o texto está chegando à conclusão.",
            },
          ],
          open: [
            {
              q: "Quais são os passos para montar uma boa conclusão?",
              expected: "Usar um conectivo de conclusão, retomar a tese, apresentar a proposta de intervenção completa com agente, ação, modo, finalidade e detalhamento e, se quiser, fechar retomando o repertório da introdução.",
            },
          ],
        },
      },
      {
        title: "Prática: sua primeira redação completa",
        content: `## Hora de escrever

Você já estudou como a prova funciona, as competências, a introdução, o desenvolvimento, a coesão, a norma culta, a proposta e a conclusão. Agora é hora de juntar tudo numa redação completa.

## O tema desta aula

**"Caminhos para reduzir a evasão escolar entre jovens brasileiros"**

## Roteiro para a sua redação

1. **Leia o tema e sublinhe:** caminhos (o texto precisa propor soluções), evasão escolar (o problema), jovens (quem), brasileiros (onde).
2. **Faça o esquema:**
   - Tese: a evasão escolar entre jovens persiste por causa de dois fatores.
   - Argumento 1: a necessidade de trabalhar para ajudar a família.
   - Argumento 2: a falta de sentido que muitos jovens veem na escola.
   - Proposta: quem, o quê, como, para quê e um detalhe.
3. **Escolha os repertórios:** a Constituição (educação como direito de todos), Paulo Freire (educação ligada à realidade do aluno), o ECA.
4. **Escreva** a introdução, os dois desenvolvimentos e a conclusão.
5. **Revise** tema, estrutura, proposta e gramática.

## Sugestão de proposta

Cabe ao Ministério da Educação ampliar bolsas de permanência estudantil, por meio de repasses mensais às famílias de baixa renda, com a condição de frequência escolar, a fim de que os jovens não precisem abandonar os estudos para trabalhar.

Você pode usar essa ideia ou criar a sua, desde que tenha os cinco elementos.

## Depois de enviar

A correção mostra a sua nota em cada competência. Leia com atenção: ela indica o que treinar. Escreva pelo menos uma redação por semana, sempre revendo os erros da anterior.

## Resumindo

Siga o roteiro: entender o tema, esquema, repertórios, escrita e revisão. Toque no botão "Escrever a redação" abaixo da aula para fazer a sua.`,
        highlights: [
          "Roteiro: entender o tema, fazer o esquema, escolher repertórios, escrever e revisar.",
          "Tema da prática: evasão escolar entre jovens brasileiros, com foco em caminhos.",
          "A correção por competência mostra o que treinar.",
          "Escreva pelo menos uma redação por semana.",
        ],
        keyPoints: [
          { term: "Bolsa de permanência", explanation: "Auxílio financeiro para o estudante continuar na escola." },
          { term: "Evasão escolar", explanation: "Quando o aluno abandona a escola antes de concluir os estudos." },
          { term: "Esquema", explanation: "Planejamento rápido da tese, dos argumentos e da proposta antes de escrever." },
        ],
        quiz: {
          choices: [
            {
              q: "No tema desta aula, a palavra “caminhos” indica que o texto deve:",
              options: ["contar uma história.", "propor soluções para o problema.", "descrever uma viagem.", "falar de mobilidade urbana.", "evitar a proposta de intervenção."],
              answer: 1,
              explanation: "“Caminhos” mostra que o foco é apontar soluções para reduzir a evasão.",
            },
            {
              q: "Qual repertório combina com o tema da evasão escolar?",
              options: ["A teoria da relatividade.", "Paulo Freire e a educação ligada à realidade do aluno.", "A receita de um bolo.", "As regras do futebol.", "A letra do hino de um clube."],
              answer: 1,
              explanation: "Paulo Freire defendia uma educação que dialogue com a vida do estudante, o que se liga à falta de sentido que leva à evasão.",
            },
            {
              q: "Qual é o primeiro passo do roteiro de redação?",
              options: ["Escrever a conclusão.", "Ler o tema e sublinhar as palavras-chave.", "Escolher o título.", "Contar as linhas.", "Revisar a gramática."],
              answer: 1,
              explanation: "Tudo começa por entender o tema e o recorte.",
            },
            {
              q: "Na proposta sugerida, qual é a finalidade?",
              options: [
                "O Ministério da Educação.",
                "Ampliar bolsas de permanência.",
                "Por meio de repasses mensais.",
                "Para que os jovens não precisem abandonar os estudos para trabalhar.",
                "Famílias de baixa renda.",
              ],
              answer: 3,
              explanation: "A finalidade é o objetivo: evitar que os jovens deixem a escola para trabalhar.",
            },
            {
              q: "Com que frequência é recomendado treinar redação?",
              options: ["Uma vez por ano.", "Só na véspera do ENEM.", "Pelo menos uma vez por semana.", "Nunca: basta ler sobre redação.", "Uma vez por mês, sem ler a correção."],
              answer: 2,
              explanation: "Escrever toda semana e rever os erros da correção é o que faz a nota subir.",
            },
          ],
          open: [
            {
              q: "Escreva a tese da sua redação sobre a evasão escolar entre jovens brasileiros, anunciando dois argumentos.",
              expected: "Uma tese que afirma que a evasão escolar entre jovens brasileiros persiste e apresenta dois motivos, como a necessidade de trabalhar para ajudar a família e a falta de sentido que muitos jovens veem na escola.",
            },
          ],
        },
        essay: essay("Caminhos para reduzir a evasão escolar entre jovens brasileiros"),
      },
      {
        title: "Prática: tecnologia e saúde mental",
        content: `## Um tema muito atual

Temas ligados à tecnologia aparecem com frequência no ENEM. Nesta aula, você vai treinar com um deles:

**"O impacto do uso excessivo de celulares na saúde mental dos adolescentes"**

## Entendendo o recorte

- **Problema:** o uso **excessivo** de celulares (não o celular em si).
- **Foco:** a **saúde mental** (ansiedade, sono, autoestima, atenção).
- **Quem:** os **adolescentes**.
- O tema fala de **impacto**: o texto deve mostrar os efeitos e, na conclusão, propor como reduzi-los.

## Ideias de argumentos

- **Comparação constante:** nas redes, os adolescentes comparam a própria vida com imagens editadas e perfeitas, o que afeta a autoestima.
- **Sono e atenção:** o uso do celular até tarde prejudica o sono, a concentração e o desempenho escolar.
- **Algoritmos:** as plataformas são feitas para prender a atenção, estimulando o uso sem fim.

## Repertórios possíveis

- **Zygmunt Bauman:** relações frágeis e passageiras na "modernidade líquida".
- **O filme "O Dilema das Redes" (2020):** mostra como as plataformas são planejadas para viciar.
- **ECA:** o dever de proteger a saúde de crianças e adolescentes.

## Proposta de exemplo

Cabe às escolas, em parceria com o Ministério da Saúde, promover rodas de conversa mensais com psicólogos sobre o uso saudável da tecnologia, a fim de ensinar os adolescentes a reconhecer sinais de uso excessivo e a buscar ajuda.

## Cuidado para não tangenciar

Não escreva só sobre "a tecnologia na sociedade" ou só sobre "saúde mental em geral". Os três elementos precisam aparecer juntos: uso excessivo, celular e adolescentes.

## Resumindo

Entenda o recorte, escolha dois argumentos (como comparação e sono), use repertórios bem explicados e termine com uma proposta completa. Depois do quiz, escreva a sua redação.`,
        highlights: [
          "O problema é o uso excessivo do celular, e não o celular em si.",
          "Foco na saúde mental dos adolescentes: autoestima, sono, atenção.",
          "Argumentos possíveis: comparação nas redes, sono e algoritmos que prendem a atenção.",
          "Não tangencie: uso excessivo, celular e adolescentes precisam aparecer juntos.",
        ],
        keyPoints: [
          { term: "Algoritmo", explanation: "Sistema das plataformas que escolhe o que mostrar para manter a pessoa conectada." },
          { term: "Autoestima", explanation: "A forma como a pessoa se vê e se valoriza." },
          { term: "Uso excessivo", explanation: "Uso que passa do saudável e prejudica outras áreas da vida." },
        ],
        quiz: {
          choices: [
            {
              q: "Qual é o problema central do tema desta aula?",
              options: ["O celular em si.", "O uso excessivo de celulares e seu impacto na saúde mental dos adolescentes.", "O preço dos celulares.", "A tecnologia nas empresas.", "A falta de internet nas escolas."],
              answer: 1,
              explanation: "O recorte é o uso excessivo e o impacto na saúde mental, especificamente dos adolescentes.",
            },
            {
              q: "Qual argumento está dentro do recorte do tema?",
              options: [
                "Os celulares ficaram mais baratos.",
                "A comparação com vidas perfeitas nas redes afeta a autoestima dos adolescentes.",
                "As empresas usam computadores.",
                "Os idosos usam pouco a internet.",
                "A tecnologia ajudou a medicina.",
              ],
              answer: 1,
              explanation: "Esse argumento liga o uso das redes à saúde mental dos adolescentes.",
            },
            {
              q: "Qual repertório combina com o tema?",
              options: ["O filme “O Dilema das Redes”.", "A Revolução Francesa sem relação com o tema.", "A tabela periódica.", "A Copa do Mundo de 1970.", "A receita de pão de queijo."],
              answer: 0,
              explanation: "O documentário mostra como as plataformas são feitas para prender a atenção, ligado ao uso excessivo.",
            },
            {
              q: "Escrever apenas sobre “a tecnologia na sociedade” neste tema seria:",
              options: ["fuga total.", "tangenciamento.", "o ideal.", "cópia.", "proposta de intervenção."],
              answer: 1,
              explanation: "Falar só do assunto geral, sem o recorte (uso excessivo, adolescentes, saúde mental), é tangenciar.",
            },
            {
              q: "Na proposta de exemplo, quem são os agentes?",
              options: ["Os adolescentes.", "As escolas, em parceria com o Ministério da Saúde.", "Os psicólogos sozinhos.", "As redes sociais.", "Os pais."],
              answer: 1,
              explanation: "Os agentes são as escolas em parceria com o Ministério da Saúde.",
            },
          ],
          open: [
            {
              q: "Explique como o uso excessivo do celular pode prejudicar o sono e os estudos dos adolescentes.",
              expected: "O uso do celular até tarde da noite atrasa e piora o sono; com sono ruim, o adolescente fica cansado, perde a concentração e o desempenho escolar cai.",
            },
          ],
        },
        essay: essay("O impacto do uso excessivo de celulares na saúde mental dos adolescentes"),
      },
    ],
  },
];
