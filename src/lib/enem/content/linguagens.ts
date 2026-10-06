import type { Materia } from "../catalog";

export const LINGUAGENS: Materia[] = [
  {
    slug: "portugues",
    name: "Língua Portuguesa",
    area: "linguagens",
    lessons: [
      {
        title: "Interpretação de texto: como o ENEM pergunta",
        content: `## Ler é a habilidade mais cobrada do ENEM

Quase todas as questões do ENEM começam com um texto: uma notícia, um poema, uma tirinha, um gráfico, uma propaganda. Por isso, saber interpretar vale ponto em todas as áreas, não só em Linguagens.

## Compreender e interpretar não são a mesma coisa

**Compreender** é entender o que está escrito, a informação que aparece no texto. **Interpretar** é ir além: perceber a intenção do autor, a crítica, a ironia, o que fica nas entrelinhas. O ENEM cobra as duas coisas, mas adora a segunda.

## Um roteiro que funciona

1. **Leia o comando da questão primeiro.** Saber o que vai ser perguntado ajuda a ler o texto com um objetivo.
2. **Identifique o gênero e a fonte.** Uma charge quer criticar; um anúncio quer convencer; um artigo científico quer informar. A fonte, embaixo do texto, dá pistas sobre o contexto e a época.
3. **Procure a ideia central.** Pergunte: sobre o que é o texto e o que ele diz sobre isso?
4. **Volte ao texto para confirmar.** A resposta certa sempre se apoia no texto. Se você precisou "imaginar" algo que não está lá, desconfie.

## As armadilhas das alternativas

As alternativas erradas costumam cair em três tipos:

- **Extrapolação:** vai além do que o texto diz. Parece verdade no mundo real, mas o texto não afirma aquilo.
- **Redução:** pega só um detalhe do texto e trata como se fosse a ideia principal.
- **Contradição:** afirma o contrário do texto, muitas vezes trocando uma palavra só.

Desconfie de palavras absolutas como "sempre", "nunca", "todos" e "exclusivamente". Elas raramente aparecem na alternativa certa.

## Texto verbal e não verbal

Tirinhas, charges e cartuns misturam imagem e palavra. Observe as expressões dos personagens, o último quadrinho (onde costuma estar o humor ou a crítica) e a relação entre o desenho e a fala. O sentido nasce da soma dos dois.

## Resumindo

Leia o comando, entenda o gênero, ache a ideia central e confirme no texto. Elimine as alternativas que extrapolam, reduzem ou contradizem. Com treino, esse caminho fica automático.`,
        highlights: [
          "Leia o comando antes do texto: você lê com um objetivo.",
          "A resposta certa sempre se apoia no que está no texto.",
          "Alternativas erradas costumam extrapolar, reduzir ou contradizer o texto.",
          "Em tirinhas e charges, o sentido nasce da soma da imagem com a palavra.",
        ],
        keyPoints: [
          { term: "Compreender", explanation: "Entender a informação que está escrita no texto." },
          { term: "Interpretar", explanation: "Perceber intenções, críticas e ideias que estão nas entrelinhas." },
          { term: "Extrapolação", explanation: "Alternativa que afirma algo além do que o texto diz." },
        ],
      },
      {
        title: "Gêneros textuais e tipos de texto",
        content: `## Tipo e gênero: a diferença

Os **tipos textuais** são poucos e falam da estrutura do texto: narrar, descrever, argumentar, expor e instruir. Já os **gêneros textuais** são infinitos: são os textos do dia a dia, como a notícia, a receita, o meme, a crônica, o e-mail, o editorial e o anúncio.

Um mesmo gênero pode misturar tipos. Uma crônica, por exemplo, pode narrar uma cena e, no fim, argumentar sobre ela.

## Os cinco tipos

- **Narrativo:** conta fatos em sequência, com personagens, tempo e espaço. Aparece em contos, romances e notícias.
- **Descritivo:** mostra como algo é, com características e detalhes.
- **Dissertativo-argumentativo:** defende um ponto de vista com argumentos. É o tipo da redação do ENEM e dos artigos de opinião.
- **Expositivo:** explica um assunto sem defender opinião, como nos verbetes e textos didáticos.
- **Injuntivo:** orienta o leitor a fazer algo, como nas receitas, manuais e regras.

## Como o ENEM cobra gêneros

O ENEM costuma perguntar **qual é a função social** de um texto ou **qual característica** identifica o gênero. Para responder, pense:

- Quem escreveu e para quem?
- Onde o texto circula: jornal, internet, rua, escola?
- Qual é o objetivo: informar, convencer, vender, divertir, ensinar?

Um **anúncio publicitário** usa verbos no imperativo e apelos emocionais para convencer. Uma **notícia** responde às perguntas o quê, quem, quando, onde, como e por quê, em linguagem objetiva. Um **artigo de opinião** é assinado e defende uma tese. Uma **charge** faz humor crítico sobre um fato atual.

## Gêneros digitais

Memes, posts, comentários e tuítes também caem no ENEM. Eles usam linguagem informal, abreviações, emojis e mistura de imagem e texto. O ENEM costuma perguntar sobre o efeito dessa linguagem e sobre o comportamento das pessoas nas redes.

## Resumindo

Tipo é a estrutura; gênero é o texto concreto do dia a dia. Para identificar um gênero, observe o objetivo, o público e o lugar onde ele circula.`,
        highlights: [
          "Tipos textuais são cinco: narrativo, descritivo, dissertativo, expositivo e injuntivo.",
          "Gêneros textuais são os textos do dia a dia: notícia, anúncio, crônica, meme...",
          "Para identificar o gênero, pense no objetivo, no público e onde ele circula.",
        ],
        keyPoints: [
          { term: "Função social", explanation: "Para que o texto serve na sociedade: informar, convencer, vender, ensinar." },
          { term: "Texto injuntivo", explanation: "Texto que dá instruções, como receitas e manuais." },
          { term: "Charge", explanation: "Desenho de humor crítico sobre um fato atual." },
        ],
      },
      {
        title: "Funções da linguagem",
        content: `## Para que serve uma mensagem?

O linguista Roman Jakobson percebeu que toda comunicação tem seis elementos: quem fala (emissor), quem recebe (receptor), a mensagem, o código (a língua), o canal (o meio) e o referente (o assunto). Cada **função da linguagem** coloca o foco em um desses elementos.

## As seis funções

- **Referencial (ou denotativa):** foco no assunto. Informa de forma objetiva, como nas notícias e nos textos científicos.
- **Emotiva (ou expressiva):** foco em quem fala. Mostra sentimentos e opiniões, com primeira pessoa e exclamações. Aparece em diários e muitos poemas.
- **Conativa (ou apelativa):** foco em quem recebe. Quer convencer ou dar ordens, com verbos no imperativo e vocativos. É a função das propagandas: "Compre já!".
- **Fática:** foco no canal. Testa ou mantém o contato: "Alô?", "Tá me ouvindo?", "Bom dia!".
- **Metalinguística:** foco no código. É a linguagem falando dela mesma: um dicionário, um poema sobre fazer poemas, um filme sobre cinema.
- **Poética:** foco na mensagem. Cuida da forma: rimas, ritmo, jogos de palavras, sonoridade. Aparece na poesia, mas também em slogans.

## Um texto, várias funções

Um texto quase sempre tem mais de uma função, mas uma delas **predomina**. O ENEM pede a predominante. Pergunte: o que este texto mais quer fazer? Informar, emocionar, convencer, testar o contato, explicar a própria linguagem ou brincar com a forma?

## Dicas rápidas

- Verbo no imperativo e "você" chamando o leitor: pense em **conativa**.
- Texto explicando o significado de uma palavra: **metalinguística**.
- Poema que fala sobre o ato de escrever um poema: também **metalinguística**.
- Jogo de sons e de palavras em uma propaganda: **poética** junto com a conativa.

## Resumindo

Cada função dá destaque a um elemento da comunicação. Descubra o objetivo principal do texto e você descobre a função predominante.`,
        highlights: [
          "Referencial informa; emotiva expressa; conativa convence.",
          "Fática testa o contato; metalinguística fala da própria linguagem; poética cuida da forma.",
          "O ENEM pede a função que predomina no texto.",
        ],
        keyPoints: [
          { term: "Função conativa", explanation: "Busca convencer ou ordenar o leitor; usa imperativo. Típica da propaganda." },
          { term: "Metalinguagem", explanation: "Quando a linguagem fala dela mesma, como um dicionário ou um poema sobre poemas." },
          { term: "Função fática", explanation: "Serve para abrir, manter ou testar o contato: 'alô', 'tá me ouvindo?'." },
        ],
      },
      {
        title: "Variação linguística e preconceito linguístico",
        content: `## A língua muda

Ninguém fala exatamente igual a ninguém. A língua portuguesa muda conforme o lugar, a época, o grupo social e a situação. Isso se chama **variação linguística**, e o ENEM adora esse assunto.

## Os tipos de variação

- **Regional (diatópica):** muda de lugar para lugar. "Mandioca", "aipim" e "macaxeira" são a mesma raiz em regiões diferentes. O sotaque também é variação regional.
- **Social (diastrática):** muda conforme o grupo social, a idade, a profissão. As gírias dos jovens e os jargões dos médicos e advogados são exemplos.
- **Histórica (diacrônica):** muda com o tempo. "Vossa mercê" virou "vosmecê", depois "você" e hoje "cê".
- **Situacional (diafásica):** muda conforme a situação. Ninguém fala numa entrevista de emprego do mesmo jeito que fala com os amigos.

## Norma-padrão não é "o certo"

A **norma-padrão** é o modelo ensinado na escola e usado em textos formais, como leis e a redação do ENEM. Ela é importante, mas não é a única forma "correta" de falar. O que existe é **adequação**: cada situação pede um jeito de falar ou escrever.

Falar "nós vai" numa conversa informal comunica muito bem. Numa redação oficial, não é adequado. Não é questão de certo e errado, e sim de contexto.

## Preconceito linguístico

**Preconceito linguístico** é julgar alguém como inferior pelo jeito de falar: pelo sotaque, pelas palavras ou pela gramática. É uma forma de discriminação social, porque quase sempre atinge grupos de menor prestígio, como pessoas pobres, do campo ou de certas regiões.

O ENEM costuma trazer textos que criticam esse preconceito e valorizam a diversidade da língua. Quando a questão falar de variação, a resposta certa quase nunca vai dizer que uma forma de falar é "errada" ou "feia".

## Resumindo

A língua varia por lugar, grupo social, época e situação. A norma-padrão é uma das variedades, adequada a situações formais. Julgar as pessoas pela fala é preconceito linguístico.`,
        highlights: [
          "A língua varia conforme o lugar, o grupo social, a época e a situação.",
          "Não existe certo ou errado, e sim adequado ou inadequado à situação.",
          "Preconceito linguístico é discriminar alguém pelo jeito de falar.",
        ],
        keyPoints: [
          { term: "Variação regional", explanation: "Diferenças de sotaque e vocabulário entre lugares, como aipim, macaxeira e mandioca." },
          { term: "Norma-padrão", explanation: "Variedade ensinada na escola e usada em situações formais." },
          { term: "Adequação linguística", explanation: "Escolher o jeito de falar que combina com a situação." },
        ],
      },
      {
        title: "Coesão, coerência e o sentido das palavras",
        content: `## O que faz um texto ser um texto

Um amontoado de frases não é um texto. Para ser texto, as ideias precisam estar ligadas (**coesão**) e fazer sentido juntas (**coerência**).

## Coesão: as ligações

A coesão aparece na superfície do texto, nas palavras que ligam as ideias:

- **Pronomes e sinônimos** retomam algo já dito sem repetir: "Machado de Assis escreveu muito. **O autor** fundou a Academia Brasileira de Letras, e **ele** foi seu primeiro presidente."
- **Conectivos** mostram a relação entre as ideias:
  - Adição: e, além disso, também.
  - Oposição: mas, porém, contudo, no entanto, embora.
  - Causa: porque, pois, já que, visto que.
  - Consequência: portanto, logo, por isso, de modo que.
  - Condição: se, caso, desde que.
  - Finalidade: para que, a fim de.

O ENEM pergunta muito: "o conectivo destacado expressa uma relação de...". Troque o conectivo por outro de sentido conhecido e veja se a frase continua igual. "Estudou, **contudo** não passou" é o mesmo que "estudou, **mas** não passou": oposição.

## Coerência: o sentido

A coerência é a lógica das ideias. Um texto pode ter conectivos e ainda assim ser incoerente, por exemplo: "Choveu muito, portanto as ruas ficaram secas". A ligação existe, mas o sentido não.

## Denotação e conotação

- **Denotação:** a palavra no sentido literal, do dicionário. "O gelo é frio."
- **Conotação:** a palavra em sentido figurado. "Ele tem um coração de gelo."

## Figuras de linguagem que mais caem

- **Metáfora:** comparação sem o "como". "Meu coração é um balde despejado."
- **Comparação:** com "como", "feito", "tal qual".
- **Metonímia:** troca de uma palavra por outra relacionada. "Li Machado" (a obra pelo autor).
- **Ironia:** dizer o contrário do que se pensa, para criticar.
- **Hipérbole:** exagero. "Já falei um milhão de vezes."
- **Antítese:** ideias opostas lado a lado. "Amor e ódio."

## Resumindo

Coesão liga, coerência dá sentido. Conectivos indicam a relação entre as ideias. Fique atento ao sentido figurado e às figuras de linguagem.`,
        highlights: [
          "Coesão são as ligações entre as ideias; coerência é a lógica do texto.",
          "Conectivos indicam relações: oposição (mas, porém), causa (porque) e conclusão (portanto).",
          "Denotação é o sentido literal; conotação é o sentido figurado.",
        ],
        keyPoints: [
          { term: "Conectivo", explanation: "Palavra que liga ideias e mostra a relação entre elas, como mas, porque e portanto." },
          { term: "Metáfora", explanation: "Comparação implícita, sem o 'como'." },
          { term: "Metonímia", explanation: "Troca de uma palavra por outra com relação próxima, como o autor pela obra." },
        ],
      },
    ],
  },
  {
    slug: "literatura",
    name: "Literatura",
    area: "linguagens",
    lessons: [
      {
        title: "Escolas literárias: o panorama",
        content: `## Literatura e história andam juntas

Cada **escola literária** reflete o jeito de pensar de uma época. Conhecer o contexto ajuda a reconhecer as características de um texto, que é o que o ENEM mais pede.

## A linha do tempo no Brasil

- **Quinhentismo (século 16):** textos de informação sobre a nova terra, como a Carta de Pero Vaz de Caminha, e textos dos jesuítas para catequizar os indígenas.
- **Barroco (século 17):** conflito entre fé e prazer, entre o céu e a terra. Linguagem cheia de contrastes e jogos de palavras. Destaques: Gregório de Matos, o "Boca do Inferno", com sátiras, e o Padre Antônio Vieira, com seus sermões.
- **Arcadismo (século 18):** volta à simplicidade e à natureza, com pastores idealizados. Ligado à Inconfidência Mineira. Destaques: Tomás Antônio Gonzaga e Cláudio Manoel da Costa.
- **Romantismo (século 19):** emoção, nacionalismo, idealização do amor e do indígena. Destaques: José de Alencar, Gonçalves Dias e Castro Alves.
- **Realismo e Naturalismo (fim do século 19):** crítica à sociedade, análise psicológica e retrato da realidade sem idealização. Destaques: Machado de Assis e Aluísio Azevedo.
- **Parnasianismo:** poesia com forma perfeita, "a arte pela arte". Destaque: Olavo Bilac.
- **Simbolismo:** musicalidade, mistério e espiritualidade. Destaque: Cruz e Sousa.
- **Pré-Modernismo (início do século 20):** denúncia dos problemas do Brasil. Destaques: Euclides da Cunha e Lima Barreto.
- **Modernismo (a partir de 1922):** liberdade na forma, linguagem do cotidiano, valorização da cultura brasileira.

## Como estudar para o ENEM

O ENEM raramente pede datas. Ele mostra um trecho e pergunta qual característica aparece ali, ou compara dois textos de épocas diferentes. Por isso, guarde as **marcas** de cada escola: exagero emocional e idealização no Romantismo; crítica e ironia no Realismo; forma rígida no Parnasianismo; verso livre e humor no Modernismo.

## Resumindo

Cada escola literária responde ao seu tempo. Para o ENEM, mais importante que decorar nomes é reconhecer as características no texto.`,
        highlights: [
          "Cada escola literária reflete o pensamento da sua época.",
          "O ENEM pede características, não datas.",
          "Romantismo idealiza; Realismo critica; Modernismo liberta a forma.",
        ],
        keyPoints: [
          { term: "Barroco", explanation: "Estilo do século 17 marcado por contrastes e pelo conflito entre fé e prazer." },
          { term: "Parnasianismo", explanation: "Poesia que valoriza a forma perfeita, a 'arte pela arte'." },
          { term: "Pré-Modernismo", explanation: "Literatura do início do século 20 que denuncia os problemas sociais do Brasil." },
        ],
      },
      {
        title: "Romantismo e Realismo",
        content: `## Romantismo: emoção e nação

O Romantismo chegou ao Brasil logo depois da Independência. O país queria criar uma identidade própria, e a literatura ajudou nisso.

Características principais:

- **Subjetividade:** o eu, os sentimentos e a emoção no centro.
- **Idealização:** da mulher (pura e perfeita), do amor e do herói.
- **Nacionalismo:** valorização da natureza e do passado brasileiro.
- **Indianismo:** o indígena como herói nacional, corajoso e nobre, como em Iracema e O Guarani, de José de Alencar, e no poema I-Juca-Pirama, de Gonçalves Dias.

A poesia romântica teve três gerações. A primeira foi nacionalista e indianista. A segunda, chamada "mal do século", trouxe pessimismo, tédio e obsessão pela morte, com Álvares de Azevedo. A terceira, a condoreira, teve preocupação social; Castro Alves denunciou a escravidão em Navio Negreiro.

## Realismo: o olhar crítico

No fim do século 19, as ideias científicas e a crise do Império mudaram a literatura. O Realismo trocou a idealização pela **análise crítica** da sociedade.

Características principais:

- **Objetividade** e retrato da realidade como ela é.
- **Crítica à burguesia**, ao casamento por interesse e à hipocrisia social.
- **Análise psicológica** dos personagens.
- **Ironia**, especialmente em Machado de Assis.

Machado de Assis é o maior nome. Em Memórias Póstumas de Brás Cubas, o narrador é um defunto que conta a própria vida com ironia, conversando com o leitor. Em Dom Casmurro, fica a dúvida: Capitu traiu ou não Bentinho? O narrador é suspeito, e é isso que torna o livro genial.

## Naturalismo

O Naturalismo é o Realismo levado ao extremo, com influência da ciência: o ser humano é visto como resultado do meio, da raça e do momento histórico. O Cortiço, de Aluísio Azevedo, mostra os moradores de um cortiço como um organismo vivo.

## Resumindo

Romantismo idealiza e emociona; Realismo analisa e critica; Naturalismo explica o ser humano pelo meio.`,
        highlights: [
          "Romantismo: subjetividade, idealização, nacionalismo e indianismo.",
          "Castro Alves, poeta condoreiro, denunciou a escravidão.",
          "Realismo: crítica social, objetividade e ironia, com Machado de Assis.",
          "Naturalismo: o ser humano explicado pelo meio, como em O Cortiço.",
        ],
        keyPoints: [
          { term: "Indianismo", explanation: "Tendência romântica que apresenta o indígena como herói nacional." },
          { term: "Mal do século", explanation: "Segunda geração romântica, marcada por pessimismo e obsessão pela morte." },
          { term: "Narrador não confiável", explanation: "Narrador cuja versão dos fatos pode ser parcial, como Bentinho em Dom Casmurro." },
        ],
      },
      {
        title: "Modernismo brasileiro",
        content: `## A Semana de Arte Moderna

Em fevereiro de 1922, no Theatro Municipal de São Paulo, artistas e escritores fizeram a **Semana de Arte Moderna**. Eles queriam romper com a arte acadêmica e criar uma arte com a cara do Brasil. Participaram nomes como Mário de Andrade, Oswald de Andrade, Anita Malfatti e Villa-Lobos.

## Primeira fase (1922 a 1930): a ruptura

- **Verso livre**, sem rima nem métrica obrigatória.
- **Linguagem coloquial**, do dia a dia, "a contribuição milionária de todos os erros", como disse Oswald.
- **Humor e paródia**, inclusive de textos famosos como a Canção do Exílio.
- **Nacionalismo crítico**, olhando o Brasil real.

O **Manifesto Antropófago**, de Oswald de Andrade, propôs "devorar" a cultura estrangeira e transformá-la em algo brasileiro. Macunaíma, de Mário de Andrade, é o "herói sem nenhum caráter", que mistura as culturas do país.

## Segunda fase (1930 a 1945): maturidade

**Na poesia**, aparecem Carlos Drummond de Andrade, com reflexão sobre o mundo e o próprio eu, Cecília Meireles, Vinicius de Moraes e Manuel Bandeira.

**Na prosa**, surge o **romance de 30**, ou regionalista, que denuncia a seca, a miséria e as injustiças do Nordeste: Vidas Secas, de Graciliano Ramos, O Quinze, de Rachel de Queiroz, e Capitães da Areia, de Jorge Amado.

## Terceira fase (a partir de 1945): experimentação

Guimarães Rosa reinventou a linguagem do sertão em Grande Sertão: Veredas, criando palavras novas. Clarice Lispector mergulhou na mente dos personagens, com momentos de revelação chamados epifanias. João Cabral de Melo Neto escreveu Morte e Vida Severina, sobre um retirante nordestino.

## Depois do Modernismo

Ainda aparecem no ENEM a poesia concreta, que brinca com a forma visual das palavras, e a poesia marginal dos anos 1970.

## Resumindo

O Modernismo libertou a forma e valorizou o Brasil real: começou com ruptura e humor, amadureceu com a crítica social e terminou reinventando a linguagem.`,
        highlights: [
          "A Semana de Arte Moderna de 1922 rompeu com a arte acadêmica.",
          "Primeira fase: verso livre, coloquialismo, humor e paródia.",
          "Romance de 30: denúncia social no Nordeste, como em Vidas Secas.",
          "Guimarães Rosa e Clarice Lispector renovaram a linguagem e a introspecção.",
        ],
        keyPoints: [
          { term: "Antropofagia", explanation: "Proposta de Oswald de Andrade de 'devorar' a cultura estrangeira e transformá-la em brasileira." },
          { term: "Verso livre", explanation: "Verso sem rima e sem métrica fixa." },
          { term: "Epifania", explanation: "Momento de revelação interior de um personagem, comum em Clarice Lispector." },
        ],
      },
      {
        title: "Como ler poemas e intertextualidade",
        content: `## O poema tem forma e sentido

Ler poema é prestar atenção em **como** algo é dito, não só no **que** é dito. Ritmo, rimas, a escolha das palavras e até a disposição no papel fazem parte do sentido.

## Termos básicos

- **Verso:** cada linha do poema.
- **Estrofe:** conjunto de versos.
- **Soneto:** forma fixa com 14 versos: duas estrofes de quatro (quartetos) e duas de três (tercetos).
- **Eu lírico:** a voz que fala no poema. Não é necessariamente o autor.
- **Rima e métrica:** a repetição de sons e a contagem de sílabas poéticas.

## Perguntas que ajudam a ler um poema

1. Quem é o eu lírico e com quem ele fala?
2. Qual é o sentimento ou o tema principal?
3. Que imagens e figuras de linguagem aparecem?
4. A forma (versos curtos, repetições, quebras) reforça o sentido?

## Intertextualidade

**Intertextualidade** é o diálogo entre textos. Um texto retoma outro, e o leitor precisa reconhecer essa relação. O ENEM adora comparar dois textos.

- **Paródia:** retoma um texto com humor ou crítica, mudando o sentido. A Canção do Exílio, de Gonçalves Dias, foi parodiada por vários modernistas, como Oswald de Andrade.
- **Paráfrase:** reescreve um texto mantendo o sentido original.
- **Citação:** reproduz um trecho de outro texto, indicando a fonte.
- **Alusão:** faz uma referência indireta a outro texto ou obra.

A diferença mais cobrada: **paródia muda o sentido**, geralmente com humor ou crítica; **paráfrase mantém o sentido**.

## O ENEM e a literatura

O ENEM traz trechos de obras e pede para relacionar o texto com seu contexto, identificar o efeito de sentido de um recurso ou comparar obras de épocas diferentes. Não precisa ter lido todos os livros, mas precisa saber ler com atenção.

## Resumindo

No poema, forma também é sentido. Identifique o eu lírico e as imagens. Na intertextualidade, veja se o novo texto mantém (paráfrase) ou muda (paródia) o sentido do original.`,
        highlights: [
          "No poema, a forma também carrega sentido.",
          "Eu lírico é a voz do poema, não necessariamente o autor.",
          "Paródia muda o sentido com humor ou crítica; paráfrase mantém o sentido.",
        ],
        keyPoints: [
          { term: "Soneto", explanation: "Poema de forma fixa com 14 versos: dois quartetos e dois tercetos." },
          { term: "Intertextualidade", explanation: "Diálogo entre textos, quando um retoma outro." },
          { term: "Paródia", explanation: "Retomada de um texto com humor ou crítica, mudando o sentido original." },
        ],
      },
    ],
  },
  {
    slug: "artes",
    name: "Artes e Educação Física",
    area: "linguagens",
    lessons: [
      {
        title: "Arte moderna e contemporânea",
        content: `## A arte também é linguagem

O ENEM trata a arte como uma forma de comunicação. Pintura, escultura, música, dança, teatro, fotografia e cinema transmitem ideias e refletem o seu tempo.

## As vanguardas europeias

No começo do século 20, artistas europeus romperam com a arte tradicional, que buscava copiar a realidade. Esses movimentos se chamam **vanguardas**:

- **Impressionismo:** antes das vanguardas, já mostrava a luz e a impressão do momento, com pinceladas soltas. Monet é o nome mais conhecido.
- **Expressionismo:** expressa emoções fortes, angústia e medo, com cores intensas e formas distorcidas. O Grito, de Edvard Munch, é o exemplo clássico.
- **Cubismo:** decompõe as figuras em formas geométricas e mostra vários ângulos ao mesmo tempo. Picasso pintou Guernica, uma denúncia do bombardeio de uma cidade espanhola.
- **Futurismo:** exalta a velocidade, as máquinas e a vida moderna.
- **Dadaísmo:** antiarte, deboche e acaso, como reação à Primeira Guerra. Marcel Duchamp levou um mictório para uma exposição e chamou de obra de arte.
- **Surrealismo:** o mundo dos sonhos e do inconsciente. Salvador Dalí pintou relógios derretendo.

## Arte contemporânea

A partir da metade do século 20, a arte passou a valorizar a **ideia** e a **participação do público**. Exemplos:

- **Instalações:** obras que ocupam um espaço e que o público percorre.
- **Performances:** o corpo do artista é a obra, num acontecimento ao vivo.
- **Arte urbana e grafite:** a cidade vira suporte da arte e do protesto.
- **Arte conceitual:** o conceito importa mais do que o objeto.

No Brasil, Hélio Oiticica criou obras para o público vestir, os Parangolés, e Lygia Clark fez objetos para serem manipulados. A ideia era tirar o espectador da posição passiva.

## Como o ENEM pergunta

Geralmente aparece a imagem de uma obra com um texto, e a pergunta é sobre a proposta do artista: romper com a tradição, criticar a sociedade, convidar o público a participar ou questionar o que é arte.

## Resumindo

As vanguardas romperam com a cópia da realidade. A arte contemporânea valoriza a ideia, o corpo e a participação do público.`,
        highlights: [
          "Vanguardas europeias romperam com a arte que copiava a realidade.",
          "Cubismo decompõe formas; Surrealismo mostra o inconsciente; Dadaísmo debocha da arte.",
          "Arte contemporânea valoriza a ideia e a participação do público.",
        ],
        keyPoints: [
          { term: "Vanguarda", explanation: "Movimento artístico que rompe com a tradição e propõe algo novo." },
          { term: "Instalação", explanation: "Obra que ocupa um espaço e é percorrida pelo público." },
          { term: "Performance", explanation: "Arte feita com o corpo do artista, ao vivo." },
        ],
      },
      {
        title: "Arte e cultura brasileira",
        content: `## Uma arte com muitas origens

A cultura brasileira nasceu do encontro, muitas vezes violento, entre povos indígenas, africanos e europeus, e depois de imigrantes de várias partes do mundo. Essa mistura aparece na música, na dança, nas festas e nas artes visuais.

## Momentos importantes da arte brasileira

- **Barroco mineiro (século 18):** igrejas e esculturas de Aleijadinho, como os profetas de Congonhas, e pinturas de Mestre Ataíde.
- **Missão Artística Francesa (século 19):** trouxe a arte acadêmica; Debret retratou o cotidiano do Rio de Janeiro, inclusive a escravidão.
- **Modernismo (1922):** Tarsila do Amaral pintou o Abaporu, símbolo da antropofagia; Anita Malfatti chocou o público com cores expressionistas; Di Cavalcanti retratou o povo brasileiro.
- **Arquitetura moderna:** Oscar Niemeyer e as curvas de Brasília.
- **Arte contemporânea:** Hélio Oiticica, Lygia Clark e Lygia Pape.

## Cultura popular

O ENEM valoriza muito as manifestações populares:

- **Literatura de cordel:** poemas populares do Nordeste, vendidos em folhetos pendurados em cordas, com capas em xilogravura.
- **Festas e danças:** bumba meu boi, frevo, maracatu, congada, festas juninas.
- **Capoeira:** luta, dança e jogo criado por africanos escravizados e seus descendentes. É patrimônio cultural imaterial.
- **Samba:** nasceu nas comunidades negras do Rio de Janeiro e virou símbolo nacional.

## Patrimônio cultural

**Patrimônio material** é o que se pode tocar: prédios, cidades históricas, obras de arte. **Patrimônio imaterial** são saberes, celebrações, formas de expressão e lugares de memória: o ofício das baianas de acarajé, o frevo, o samba de roda do Recôncavo Baiano. O ENEM costuma perguntar por que preservar esses bens: eles guardam a memória e a identidade de um grupo.

## Resumindo

A arte brasileira mistura heranças indígenas, africanas e europeias. A cultura popular e o patrimônio imaterial são formas de manter viva a identidade dos grupos.`,
        highlights: [
          "A cultura brasileira mistura heranças indígenas, africanas, europeias e de imigrantes.",
          "Tarsila do Amaral pintou o Abaporu, símbolo da antropofagia.",
          "Patrimônio imaterial são saberes e celebrações, como o frevo e a capoeira.",
        ],
        keyPoints: [
          { term: "Cordel", explanation: "Poesia popular nordestina em folhetos, com capas em xilogravura." },
          { term: "Patrimônio imaterial", explanation: "Saberes, celebrações e formas de expressão que guardam a identidade de um grupo." },
          { term: "Aleijadinho", explanation: "Escultor e arquiteto do Barroco mineiro, autor dos profetas de Congonhas." },
        ],
      },
      {
        title: "Corpo, esporte, saúde e sociedade",
        content: `## A Educação Física no ENEM

A Educação Física aparece no ENEM como **cultura corporal**: os jogos, esportes, danças, lutas e ginásticas são práticas sociais, ligadas à saúde, ao lazer, à cultura e também a questões como o consumo e o preconceito.

## Atividade física e saúde

- **Atividade física** é qualquer movimento do corpo que gasta energia, como andar ou subir escadas. **Exercício físico** é a atividade planejada e repetida, com objetivo.
- Exercícios **aeróbicos** (caminhada, corrida, natação) usam oxigênio e melhoram o coração e a respiração. Exercícios **anaeróbicos** (musculação, tiros curtos) são intensos e curtos e trabalham força e potência.
- O **sedentarismo** está ligado a doenças como obesidade, diabetes e problemas cardíacos.

## Corpo e mídia

A mídia e as redes sociais divulgam um **padrão de beleza** muitas vezes inalcançável. O ENEM costuma criticar esse padrão e mostrar seus efeitos: distúrbios alimentares, uso de anabolizantes e baixa autoestima. A ideia defendida é a do corpo saudável e diverso, não o do "corpo perfeito".

## Esporte: espetáculo, inclusão e preconceito

- O **esporte de alto rendimento** virou espetáculo e mercadoria, com patrocínio, transmissão e muito dinheiro.
- O **esporte de participação**, ou de lazer, busca prazer, convivência e saúde.
- O **esporte educacional** busca formar o cidadão, com cooperação e inclusão.

O ENEM também fala de preconceito no esporte: racismo nos estádios, desigualdade entre homens e mulheres no reconhecimento e nos salários, e a inclusão de pessoas com deficiência, como nos Jogos Paralímpicos.

## Jogos, lutas e danças

**Jogo** tem regras flexíveis, criadas pelos participantes; **esporte** tem regras oficiais e instituições. As lutas e danças brasileiras, como a capoeira e o frevo, também são patrimônio cultural.

## Resumindo

Corpo e movimento são cultura. O ENEM valoriza a saúde e a diversidade dos corpos, critica o padrão de beleza da mídia e discute o esporte como espetáculo, lazer e inclusão.`,
        highlights: [
          "Exercício físico é a atividade física planejada e repetida.",
          "O ENEM critica o padrão de beleza da mídia e valoriza a diversidade dos corpos.",
          "O esporte pode ser espetáculo, lazer ou educação, e deve ser inclusivo.",
        ],
        keyPoints: [
          { term: "Cultura corporal", explanation: "Jogos, esportes, danças, lutas e ginásticas vistos como práticas culturais." },
          { term: "Exercício aeróbico", explanation: "Atividade longa e moderada que usa oxigênio, como caminhar e nadar." },
          { term: "Sedentarismo", explanation: "Falta de atividade física, ligada a obesidade, diabetes e doenças do coração." },
        ],
      },
    ],
  },
  {
    slug: "ingles",
    name: "Inglês",
    area: "linguagens",
    lang: "ingles",
    lessons: [
      {
        title: "Estratégias de leitura em inglês",
        content: `## Você não precisa saber todas as palavras

No ENEM, a prova de inglês tem só **5 questões**, e o objetivo é ler e entender textos, não traduzir palavra por palavra. Com algumas estratégias, dá para acertar mesmo sem um vocabulário enorme.

## Skimming e scanning

- **Skimming** é passar os olhos rapidamente pelo texto para pegar a ideia geral: título, imagem, primeiras frases de cada parágrafo e a fonte.
- **Scanning** é procurar uma informação específica: um número, um nome, uma data, a palavra que aparece na pergunta.

Faça assim: leia a pergunta (que vem em português), faça o skimming para saber do que o texto trata e depois o scanning para achar o trecho que responde.

## Palavras transparentes (cognatos)

Muitas palavras em inglês se parecem com o português e têm o mesmo sentido: *important*, *information*, *technology*, *university*, *problem*, *history*, *possible*. Elas são chamadas **cognatos**. Num texto comum, uma boa parte das palavras é cognata. Use isso a seu favor.

## Pistas que ajudam

- **Título e imagens:** dizem muito sobre o assunto.
- **Fonte:** se é de um jornal, uma campanha, uma rede social, já indica o gênero e a intenção.
- **Números, nomes e datas** aparecem iguais em qualquer língua.
- **Contexto:** se não souber uma palavra, tente entender pelo resto da frase.

## Os gêneros que mais caem

Tirinhas (comic strips), letras de música, poemas, anúncios e campanhas, notícias, verbetes e posts de redes sociais. Nas tirinhas, o humor costuma estar no último quadrinho. Nas campanhas, procure o objetivo: conscientizar, convencer, vender.

## Cuidado com a pergunta

As alternativas estão em português. Muitas vezes, mais de uma parece certa no mundo real, mas só uma está **no texto**. Volte ao texto e confirme.

## Resumindo

Leia a pergunta, faça o skimming para a ideia geral e o scanning para a informação específica. Aproveite os cognatos, as imagens e a fonte.`,
        highlights: [
          "São só 5 questões de inglês no ENEM, focadas em leitura.",
          "Skimming é pegar a ideia geral; scanning é procurar uma informação específica.",
          "Cognatos são palavras parecidas com o português e com o mesmo sentido.",
        ],
        keyPoints: [
          { term: "Skimming", explanation: "Leitura rápida para entender a ideia geral do texto." },
          { term: "Scanning", explanation: "Busca de uma informação específica, como um número ou um nome." },
          { term: "Cognato", explanation: "Palavra parecida com o português e com o mesmo significado, como 'important'." },
        ],
      },
      {
        title: "Falsos cognatos e vocabulário essencial",
        content: `## Cuidado: nem tudo que parece é

Os **falsos cognatos** são palavras em inglês parecidas com o português, mas com outro significado. Eles são armadilhas clássicas do ENEM. Os mais comuns:

- *actually*: na verdade (não é "atualmente", que é *currently* ou *nowadays*).
- *pretend*: fingir (não é "pretender", que é *intend*).
- *push*: empurrar (não é "puxar", que é *pull*).
- *library*: biblioteca (não é "livraria", que é *bookstore*).
- *college*: faculdade (não é "colégio").
- *parents*: pais, o pai e a mãe (não é "parentes", que é *relatives*).
- *exquisite*: refinado, delicado (não é "esquisito").
- *realize*: perceber, dar-se conta (não é "realizar").
- *lunch*: almoço (não é "lanche").
- *novel*: romance, o livro (não é "novela").
- *assist*: ajudar (não é "assistir", que é *watch*).
- *eventually*: no fim das contas (não é "eventualmente").

## Palavras que mudam o sentido da frase

Algumas palavras pequenas são decisivas para entender o texto:

- **Oposição:** *but*, *however*, *although*, *yet*: mas, porém, embora.
- **Adição:** *and*, *also*, *moreover*, *in addition*: e, também, além disso.
- **Causa e consequência:** *because*, *since*, *so*, *therefore*: porque, já que, então, portanto.
- **Negação:** *not*, *never*, *no*, *without*: não, nunca, sem.

Uma palavra como *however* pode mudar toda a ideia de um parágrafo. Preste atenção nela.

## Prefixos e sufixos

Eles ajudam a descobrir o sentido de palavras novas:

- *un-*, *dis-*, *in-*: negação. *Unhappy* é infeliz.
- *-less*: sem. *Homeless* é sem-teto.
- *-ful*: cheio de. *Careful* é cuidadoso.
- *-er*: quem faz. *Teacher* é professor.
- *-ly*: transforma em advérbio, como o nosso "-mente". *Quickly* é rapidamente.

## Resumindo

Desconfie das palavras "parecidas demais". Fique de olho nos conectivos, que mudam o sentido, e use prefixos e sufixos para deduzir palavras novas.`,
        highlights: [
          "Falsos cognatos parecem português, mas têm outro sentido: actually é 'na verdade'.",
          "Conectivos como however e although mudam a ideia da frase.",
          "Prefixos e sufixos ajudam a descobrir palavras novas: -less significa 'sem'.",
        ],
        keyPoints: [
          { term: "Falso cognato", explanation: "Palavra parecida com o português, mas com outro significado." },
          { term: "However", explanation: "Conectivo de oposição: 'porém', 'no entanto'." },
          { term: "Sufixo -less", explanation: "Indica ausência, 'sem': homeless, careless." },
        ],
      },
      {
        title: "Textos em inglês: gêneros e temas do ENEM",
        content: `## Os temas que se repetem

As questões de inglês do ENEM costumam tratar de assuntos sociais e culturais: **meio ambiente**, **tecnologia e redes sociais**, **diversidade e preconceito**, **direitos humanos**, **saúde** e **cultura de diferentes países de língua inglesa**. Conhecer esses temas ajuda a prever o vocabulário.

## Tirinhas e cartuns

O humor geralmente está na quebra de expectativa, no último quadrinho. A pergunta costuma ser: "o humor da tirinha está em..." ou "a tirinha critica...". Observe as imagens e as expressões dos personagens tanto quanto as falas.

## Letras de música e poemas

Pergunte-se: qual é o sentimento do eu lírico? Do que ele reclama ou o que ele celebra? Repetições e o refrão costumam trazer a ideia principal.

## Campanhas e anúncios

O objetivo é convencer: conscientizar sobre um problema, mudar um comportamento ou vender algo. Repare no **imperativo**, que no inglês é o verbo sem sujeito: *Save water*, *Don't drink and drive*, *Join us*. A pergunta costuma ser sobre o objetivo da campanha.

## Notícias e artigos

Procure no título e no primeiro parágrafo as respostas para: o que aconteceu, com quem, onde e por quê. Números e nomes ajudam a localizar a informação.

## Citações e frases famosas

O ENEM às vezes traz frases de pessoas importantes, como Nelson Mandela ou Martin Luther King, e pergunta qual é a ideia defendida. Nesse caso, pense no contexto histórico da pessoa: luta contra o racismo, pela educação, pela paz.

## Uma dica final

Na hora da prova, comece pela língua estrangeira, que tem só 5 questões e textos curtos: é um bom aquecimento. E escolha bem: no dia da inscrição você decide entre inglês e espanhol, e não dá para trocar depois.

## Resumindo

Os textos de inglês do ENEM falam de temas sociais. Em cada gênero, busque o objetivo: o humor na tirinha, o sentimento na música, o convencimento na campanha e os fatos na notícia.`,
        highlights: [
          "Temas comuns: meio ambiente, tecnologia, diversidade, direitos humanos e saúde.",
          "Em campanhas, o imperativo (verbo sem sujeito) mostra o que se quer convencer.",
          "Na tirinha, o humor costuma estar na quebra de expectativa do último quadrinho.",
        ],
        keyPoints: [
          { term: "Imperativo em inglês", explanation: "Verbo sem sujeito usado para dar ordens ou conselhos: 'Save water'." },
          { term: "Comic strip", explanation: "Tirinha, história curta em quadrinhos." },
          { term: "Headline", explanation: "Manchete, o título de uma notícia." },
        ],
      },
    ],
  },
  {
    slug: "espanhol",
    name: "Espanhol",
    area: "linguagens",
    lang: "espanhol",
    lessons: [
      {
        title: "Estratégias de leitura em espanhol",
        content: `## Parece fácil, mas pede atenção

O espanhol é parecido com o português, e isso ajuda muito. Mas essa semelhança também engana: muitas palavras parecidas têm outro sentido. No ENEM são **5 questões** de leitura, e a pergunta vem em português.

## Como ler

1. Leia a pergunta primeiro.
2. Faça uma leitura geral do texto: título, fonte, imagens.
3. Volte ao texto procurando o trecho que responde à pergunta.
4. Confirme a alternativa com o que está escrito, não com o que você acha.

## Diferenças que confundem

- **Artigos:** *el* (o), *la* (a), *los* (os), *las* (as), e o neutro *lo*, que não existe em português: *lo bueno* quer dizer "o que é bom".
- **Muy e mucho:** *muy* vem antes de adjetivos e advérbios (*muy bonito*); *mucho* vem com substantivos e verbos (*mucho trabajo*, *trabaja mucho*).
- **Pronomes:** *usted* é o tratamento formal, como "o senhor" ou "a senhora". *Vosotros* é usado na Espanha para "vocês"; na América Latina se usa *ustedes*.
- **Acentos:** a pronúncia e a tonicidade às vezes mudam. *Teléfono*, *océano*, *nivel*.

## Conectivos importantes

- **Oposição:** *pero*, *sin embargo*, *aunque*: mas, no entanto, embora.
- **Causa:** *porque*, *ya que*, *puesto que*.
- **Conclusão:** *por lo tanto*, *así que*, *entonces*.
- **Adição:** *además*, *también*.

Atenção: *aunque* indica concessão ("embora", "ainda que"), e é muito cobrado.

## Gêneros e temas

Assim como no inglês, aparecem tirinhas (como as da Mafalda, do argentino Quino), poemas, letras de música, campanhas e notícias. Os temas costumam ser sociais e culturais: identidade latino-americana, desigualdade, meio ambiente, imigração e tecnologia.

## Resumindo

Use a semelhança com o português, mas desconfie dela. Leia a pergunta, ache o trecho e confirme. Atenção aos conectivos, especialmente *sin embargo* e *aunque*.`,
        highlights: [
          "São 5 questões de leitura em espanhol, com pergunta em português.",
          "A semelhança com o português ajuda, mas também engana.",
          "Muy vem antes de adjetivos; mucho vem com substantivos e verbos.",
          "Aunque indica concessão: 'embora', 'ainda que'.",
        ],
        keyPoints: [
          { term: "Lo (artigo neutro)", explanation: "Artigo do espanhol sem equivalente direto: 'lo bueno' é 'o que é bom'." },
          { term: "Sin embargo", explanation: "Conectivo de oposição: 'no entanto', 'porém'." },
          { term: "Usted", explanation: "Tratamento formal, como 'o senhor' ou 'a senhora'." },
        ],
      },
      {
        title: "Falsos amigos (heterossemânticos)",
        content: `## As armadilhas do espanhol

**Heterossemânticos**, ou "falsos amigos", são palavras iguais ou muito parecidas com o português, mas com significado diferente. São as pegadinhas mais comuns da prova de espanhol.

## Os mais cobrados

- *exquisito*: delicioso, saboroso (não é "esquisito", que é *raro*).
- *embarazada*: grávida (não é "embaraçada", que é *avergonzada*).
- *rato*: um momento, um tempinho (rato, o animal, é *ratón*).
- *oficina*: escritório (oficina mecânica é *taller*).
- *largo*: comprido (largo, em português, é *ancho*).
- *polvo*: poeira, pó (o animal polvo é *pulpo*).
- *apellido*: sobrenome (apelido é *apodo*).
- *borracha*: bêbada (a borracha de apagar é *goma*).
- *cena*: jantar (a cena de um filme é *escena*).
- *zurdo*: canhoto (surdo é *sordo*).
- *salsa*: molho (o tempero salsinha é *perejil*).
- *pronto*: logo, em breve (pronto, preparado, é *listo*).
- *todavía*: ainda (não é "todavia").
- *contestar*: responder (e não discordar).
- *latido*: batida do coração (o latido do cachorro, em espanhol, é *ladrido*).
- *crianza*: criação, educação dos filhos.

## Mudanças de gênero

Algumas palavras mudam de gênero do português para o espanhol:

- *el viaje*, *el paisaje*, *el mensaje*, *el coraje*: em espanhol, as palavras terminadas em *-aje* são masculinas, enquanto em português "a viagem", "a paisagem", "a mensagem" e "a coragem" são femininas.
- *la leche* (o leite), *la sal* (o sal), *la sangre* (o sangue), *la nariz* (o nariz).
- *el árbol* (a árvore), *el color* (a cor), *el dolor* (a dor).

## Como lidar na prova

Se uma palavra parecer estranha no contexto, desconfie: pode ser um falso amigo. Leia a frase inteira e veja qual sentido faz mais sentido. O contexto quase sempre resolve.

## Resumindo

Falsos amigos parecem português, mas significam outra coisa: *exquisito* é delicioso, *embarazada* é grávida, *oficina* é escritório. Na dúvida, confie no contexto.`,
        highlights: [
          "Heterossemânticos são palavras parecidas com o português, mas com outro sentido.",
          "Exquisito é delicioso; embarazada é grávida; oficina é escritório.",
          "Palavras terminadas em -aje são masculinas em espanhol: el viaje.",
        ],
        keyPoints: [
          { term: "Heterossemântico", explanation: "Falso amigo: palavra parecida com o português e com outro significado." },
          { term: "Todavía", explanation: "Quer dizer 'ainda', e não 'todavia'." },
          { term: "Apellido", explanation: "Sobrenome; o apelido, em espanhol, é 'apodo'." },
        ],
      },
      {
        title: "Cultura hispânica e textos do ENEM",
        content: `## Um mundo que fala espanhol

O espanhol é a língua oficial de mais de 20 países, da Espanha à maior parte da América Latina. O ENEM valoriza essa diversidade e costuma trazer textos sobre a **identidade latino-americana**.

## Temas que se repetem

- **Identidade e diversidade:** as culturas indígenas, africanas e europeias que formam a América Latina; as variações do espanhol entre os países.
- **Desigualdade social e direitos humanos:** pobreza, exclusão, trabalho infantil, direitos das mulheres.
- **Migração:** o deslocamento de pessoas entre países, as fronteiras e o preconceito contra imigrantes.
- **Memória e ditaduras:** países como Argentina e Chile viveram ditaduras; aparecem textos sobre memória e justiça.
- **Meio ambiente e tecnologia.**

## Autores e personagens conhecidos

- **Mafalda**, a menina das tirinhas de Quino, que questiona o mundo com críticas à política, à guerra e à desigualdade.
- **Gabriel García Márquez** (Colômbia), do realismo mágico, em que o extraordinário aparece como algo comum.
- **Pablo Neruda** (Chile), poeta do amor e da política.
- **Eduardo Galeano** (Uruguai), que escreveu sobre a história e as injustiças da América Latina.
- **Frida Kahlo** (México), pintora conhecida pelos autorretratos e pela valorização da cultura mexicana.

## Gêneros comuns

Tirinhas, poemas, letras de música, campanhas de conscientização, notícias, textos de opinião e até receitas. Pergunte sempre: qual é o objetivo do texto e para quem ele foi escrito?

## Dica de prova

Muitas questões pedem a **intenção** do autor ou o **efeito de sentido** de uma expressão. Responda com base no texto inteiro, não em uma palavra solta. E lembre: a alternativa certa costuma ter uma visão de respeito à diversidade e de crítica à injustiça, porque é assim que o ENEM seleciona os textos.

## Resumindo

O espanhol do ENEM traz a diversidade da América Latina e da Espanha. Conheça os temas sociais mais comuns e busque sempre a intenção do texto.`,
        highlights: [
          "O espanhol é língua oficial em mais de 20 países.",
          "Temas comuns: identidade latino-americana, desigualdade, migração e memória.",
          "Mafalda, de Quino, critica a política e a desigualdade com humor.",
        ],
        keyPoints: [
          { term: "Realismo mágico", explanation: "Estilo em que o extraordinário aparece como parte normal da realidade, como em García Márquez." },
          { term: "Mafalda", explanation: "Personagem de tirinhas do argentino Quino, crítica e questionadora." },
          { term: "Identidade latino-americana", explanation: "A cultura comum e diversa dos países da América Latina." },
        ],
      },
    ],
  },
];
