import type { EnemLesson } from "./types";

/** Aulas a mais de Linguagens (entram depois das primeiras, sem mudar o progresso de quem já começou). */
export const MORE_LINGUAGENS: Record<string, EnemLesson[]> = {
  portugues: [
    {
      title: "Argumentação: tese, argumentos e estratégias",
      content: `## Convencer é uma arte

Muitos textos do ENEM querem convencer: artigos de opinião, editoriais, cartas do leitor, propagandas, discursos. Saber identificar como um texto argumenta ajuda tanto na prova objetiva quanto na redação.

## As partes de um texto argumentativo

- **Tese:** a opinião principal que o autor defende. Costuma aparecer no começo ou no fim.
- **Argumentos:** as razões que sustentam a tese.
- **Conclusão:** retoma a tese ou propõe uma solução.

Para achar a tese, pergunte: o que o autor quer que eu acredite depois de ler?

## Tipos de argumento

- **Autoridade:** cita um especialista ou instituição. "Segundo a Organização Mundial da Saúde..."
- **Dados e provas:** números, pesquisas, estatísticas.
- **Exemplo:** um caso concreto que ilustra a ideia.
- **Causa e consequência:** mostra o que provoca um problema e o que ele causa.
- **Comparação:** aproxima duas situações.
- **Contra-argumento:** apresenta a ideia contrária para depois rebatê-la. "Alguns dizem que..., porém..."

## Estratégias de persuasão

Além dos argumentos lógicos, os textos usam recursos para envolver o leitor: perguntas retóricas (que não esperam resposta), ironia, humor, linguagem emocional, uso do "nós" para criar proximidade e escolha de palavras com carga positiva ou negativa.

## Cuidado com as falácias

**Falácia** é um argumento que parece correto, mas tem um erro de raciocínio:

- **Ataque à pessoa:** critica quem fala, e não o que é dito.
- **Generalização apressada:** conclui algo geral a partir de poucos casos.
- **Falso dilema:** apresenta só duas opções quando existem outras.
- **Apelo à maioria:** "todo mundo faz, então é certo".

## Na redação do ENEM

A redação é dissertativo-argumentativa: você precisa de uma tese clara, argumentos desenvolvidos com repertório (dados, autores, fatos históricos) e uma proposta de intervenção. Entender como os textos argumentam é treinar para escrever melhor.

## Resumindo

Tese é a opinião defendida; argumentos sustentam a tese. Reconheça os tipos de argumento e desconfie das falácias.`,
      highlights: [
        "Tese é a opinião principal que o autor quer defender.",
        "Argumentos podem ser de autoridade, dados, exemplos, causa e consequência.",
        "Contra-argumento apresenta a ideia contrária para rebatê-la.",
        "Falácia é um argumento que parece certo, mas tem erro de raciocínio.",
      ],
      keyPoints: [
        { term: "Tese", explanation: "Ponto de vista central que o texto defende." },
        { term: "Argumento de autoridade", explanation: "Apoia a ideia citando um especialista ou instituição reconhecida." },
        { term: "Pergunta retórica", explanation: "Pergunta feita para provocar reflexão, sem esperar resposta." },
      ],
    },
    {
      title: "Textos multimodais: publicidade, infográfico e meme",
      content: `## Mais do que palavras

Um texto **multimodal** combina diferentes linguagens: palavras, imagens, cores, tipos de letra, gráficos, sons e vídeos. O ENEM usa muito esse tipo de texto e pergunta como as linguagens se combinam para produzir sentido.

## Publicidade

A propaganda quer vender um produto ou uma ideia. Ela usa:

- **Imagem** que chama a atenção e desperta emoção.
- **Slogan**, uma frase curta e fácil de lembrar, muitas vezes com rima, trocadilho ou duplo sentido.
- **Verbos no imperativo:** "Experimente", "Faça".
- **Intertextualidade** com ditados, músicas e expressões conhecidas.

Já a **campanha de conscientização** não vende produto: quer mudar um comportamento, como usar o cinto de segurança, doar sangue ou combater a dengue.

## Charge, cartum e tirinha

- **Charge:** crítica humorística a um fato atual; depende do contexto da época.
- **Cartum:** humor mais universal, que não depende de um fato específico.
- **Tirinha:** pequena história em quadrinhos, com humor geralmente no último quadro.

## Infográfico

Combina texto, números, ícones e gráficos para explicar um assunto de forma rápida. Para ler, observe o título, as legendas, as cores e a ordem de leitura sugerida pelas setas.

## Meme

O meme é um gênero da internet que circula e se transforma rapidamente. Ele combina imagem e texto curto, muitas vezes reaproveitando uma imagem conhecida com um novo sentido. Seu efeito depende do conhecimento compartilhado entre quem produz e quem lê.

## Como responder às questões

1. Observe a imagem com atenção: expressões, cores, objetos, posição.
2. Leia todo o texto verbal, inclusive letras pequenas e a fonte.
3. Pergunte: qual é o objetivo? Vender, conscientizar, criticar, divertir?
4. Relacione a imagem com a palavra: muitas vezes o sentido só aparece na combinação das duas.

## Resumindo

Textos multimodais juntam várias linguagens. Na publicidade, procure o objetivo e o slogan; na charge, a crítica a um fato atual; no infográfico, a organização dos dados; no meme, o sentido compartilhado.`,
      highlights: [
        "Texto multimodal combina palavras, imagens, cores e outros recursos.",
        "Publicidade vende; campanha de conscientização quer mudar comportamentos.",
        "Charge critica um fato atual; cartum tem humor mais universal.",
        "O sentido muitas vezes só aparece na combinação de imagem e palavra.",
      ],
      keyPoints: [
        { term: "Slogan", explanation: "Frase curta e marcante usada na publicidade." },
        { term: "Infográfico", explanation: "Texto que explica um assunto com dados, ícones e gráficos." },
        { term: "Multimodal", explanation: "Que combina diferentes linguagens para produzir sentido." },
      ],
    },
    {
      title: "Concordância, regência e crase em uso",
      content: `## Gramática a serviço do sentido

O ENEM não cobra regras soltas: ele pergunta como a gramática produz sentido e quando uma construção é adequada à norma-padrão. Os pontos mais comuns são concordância, regência e crase.

## Concordância verbal

O verbo concorda com o sujeito em número e pessoa: "Os alunos **estudaram**".

Casos que confundem:

- **Sujeito depois do verbo:** "**Chegaram** as encomendas", e não "chegou as encomendas".
- **Verbo haver no sentido de existir** fica no singular: "**Havia** muitos problemas".
- **Verbo fazer indicando tempo** fica no singular: "**Faz** dois anos".
- **A maioria de, grande parte de:** o verbo pode ficar no singular ou no plural.

## Concordância nominal

Adjetivos, artigos e pronomes concordam com o substantivo: "As **questões** estavam **difíceis**".

- "**É proibido** entrada", mas "**É proibida** a entrada" (com artigo, concorda).
- "**Meio**" como advérbio não varia: "Ela está **meio** cansada".
- "**Anexo**", "**obrigado**" e "**mesmo**" concordam: "As fotos seguem **anexas**"; ela diz "**obrigada**".

## Regência

Regência é a relação entre um verbo (ou nome) e o seu complemento, com ou sem preposição.

- **Assistir** (ver) pede "a": "Assisti **ao** filme".
- **Preferir** pede "a", sem "do que": "Prefiro estudar **a** ficar parado".
- **Obedecer** pede "a": "Obedeça **às** regras".
- **Ir** pede "a" na norma-padrão: "Vou **ao** cinema". Na fala, é comum "vou no cinema".

## Crase

A **crase** é a junção da preposição "a" com o artigo "a". Indicamos com o acento grave: **à**.

- Use crase quando o termo pedir a preposição "a" e a palavra seguinte aceitar o artigo "a": "Vou **à** escola" (vou a + a escola).
- Truque: troque por uma palavra masculina. Se ficar "ao", há crase. "Vou **ao** colégio" → "Vou **à** escola".
- Não há crase antes de palavra masculina, de verbo e da maioria dos pronomes: "a partir de", "a pé", "a ela".
- Em expressões de hora: "às 10 horas".

## No ENEM

Lembre-se do que você aprendeu sobre variação: na fala cotidiana muitas dessas regras não são seguidas, e isso não é "erro" no contexto informal. A norma-padrão é exigida em situações formais, como na redação.

## Resumindo

O verbo concorda com o sujeito (atenção quando ele vem depois). Haver (existir) e fazer (tempo) ficam no singular. Crase é a + a: troque por uma palavra masculina e veja se vira "ao".`,
      highlights: [
        "Haver no sentido de existir e fazer indicando tempo ficam no singular.",
        "Assistir (ver) e obedecer pedem a preposição 'a'.",
        "Crase = preposição a + artigo a; troque por masculino: se virar 'ao', tem crase.",
        "A norma-padrão é exigida em situações formais, como na redação.",
      ],
      keyPoints: [
        { term: "Concordância", explanation: "Ajuste do verbo ao sujeito e dos nomes ao substantivo." },
        { term: "Regência", explanation: "Relação entre o verbo ou nome e seu complemento, com ou sem preposição." },
        { term: "Crase", explanation: "Junção da preposição 'a' com o artigo 'a', marcada pelo acento grave." },
      ],
    },
    {
      title: "Pontuação, conectivos e efeitos de sentido",
      content: `## A pontuação também comunica

Os sinais de pontuação organizam o texto e mudam o sentido das frases. Um clássico: "Não, espere." e "Não espere." dizem coisas opostas.

## Vírgula

A vírgula marca pausas e separa elementos. Use para:

- Separar itens de uma enumeração: "Comprei arroz, feijão e óleo."
- Isolar o **vocativo** (quem é chamado): "Maria, venha cá."
- Isolar o **aposto** (explicação): "Machado de Assis, o fundador da Academia, nasceu no Rio."
- Separar expressões explicativas: "isto é", "ou seja", "por exemplo".
- Marcar termos deslocados: "No ano passado, a cidade cresceu."

**Não** separe o sujeito do verbo: "Os alunos, estudaram" está errado.

## Oração explicativa e restritiva

- "Os alunos **que estudaram** passaram." (restritiva, sem vírgula): só os que estudaram passaram.
- "Os alunos, **que estudaram**, passaram." (explicativa, com vírgulas): todos estudaram e todos passaram.

A vírgula muda o sentido, e o ENEM gosta dessa diferença.

## Outros sinais

- **Ponto de exclamação:** emoção, surpresa, ordem.
- **Reticências:** pausa, dúvida, ironia ou algo que fica no ar.
- **Aspas:** citações, ironia ou destaque de uma palavra usada em sentido especial.
- **Dois-pontos:** anunciam uma explicação, uma enumeração ou uma fala.
- **Travessão:** marca a fala do personagem ou isola um comentário.
- **Parênteses:** acrescentam uma informação extra.

## Aspas e ironia

Quando uma palavra aparece entre aspas fora de uma citação, muitas vezes o autor quer **ironizar** ou mostrar que não concorda com aquele termo. Exemplo: o "progresso" que destruiu a floresta.

## Efeitos de sentido

Muitas questões do ENEM perguntam qual é o **efeito** de um recurso: a repetição de uma palavra (ênfase), a frase curta (impacto), as reticências (suspense), o diminutivo (carinho ou desprezo), a escolha de um verbo mais forte. Sempre pense: por que o autor escolheu esse recurso aqui?

## Resumindo

A vírgula não separa sujeito e verbo. Oração restritiva não tem vírgula; explicativa tem, e isso muda o sentido. Aspas fora de citação podem indicar ironia. Pergunte sempre qual é o efeito do recurso.`,
      highlights: [
        "Nunca separe o sujeito do verbo com vírgula.",
        "Oração restritiva (sem vírgula) e explicativa (com vírgula) mudam o sentido da frase.",
        "Aspas fora de citação podem indicar ironia.",
        "Pergunte sempre qual é o efeito de sentido de um recurso.",
      ],
      keyPoints: [
        { term: "Vocativo", explanation: "Termo usado para chamar alguém; vem separado por vírgula." },
        { term: "Aposto", explanation: "Termo que explica outro, geralmente entre vírgulas." },
        { term: "Reticências", explanation: "Indicam pausa, hesitação, ironia ou ideia que fica no ar." },
      ],
    },
    {
      title: "Linguagem, internet e informação",
      content: `## A tecnologia mudou a comunicação

A internet e as redes sociais transformaram a forma como lemos, escrevemos e nos informamos. O ENEM cobra bastante esse tema, tanto nos textos de Linguagens quanto nas propostas de redação.

## A escrita na internet

Nas conversas digitais, a escrita ganhou marcas da fala: abreviações ("vc", "tb"), emojis, figurinhas, risadas escritas ("kkkk"), letras repetidas para dar ênfase. Isso não é "destruição da língua": é uma **variedade adequada** àquele contexto, rápido e informal. O problema é usar essa linguagem em situações que pedem a norma-padrão.

## Hipertexto

O **hipertexto** é um texto com links que levam a outros textos. A leitura deixa de ser linear: o leitor escolhe o caminho. Isso amplia o acesso à informação, mas também pode dispersar a atenção.

## Fake news e desinformação

**Notícias falsas** se espalham rápido porque exploram emoções como medo e raiva e confirmam o que as pessoas já acreditam. Para verificar uma informação:

1. Veja a **fonte**: é um veículo conhecido? Tem autor e data?
2. Leia além do **título**, que pode ser sensacionalista.
3. Procure a mesma notícia em outros meios confiáveis.
4. Desconfie de textos com muitos erros, tom alarmista e pedido para "compartilhar urgente".
5. Use agências de checagem de fatos.

## Algoritmos e bolhas

As redes mostram mais do que o usuário já curte, criando **bolhas** em que as pessoas só veem opiniões parecidas com as suas. Isso pode aumentar a polarização e dificultar o diálogo.

## Outros temas que o ENEM cobra

- **Exclusão digital:** nem todos têm acesso à internet de qualidade, o que aprofunda desigualdades.
- **Privacidade e dados pessoais:** empresas coletam informações dos usuários; a Lei Geral de Proteção de Dados (LGPD) busca proteger esses dados.
- **Discurso de ódio e cyberbullying.**
- **Inteligência artificial** e seus impactos no trabalho e na informação.

## Resumindo

A linguagem da internet é uma variedade adequada ao contexto informal. Hipertexto é leitura não linear com links. Para combater fake news, verifique a fonte, leia além do título e compare com outros meios.`,
      highlights: [
        "A escrita da internet é uma variedade adequada ao contexto informal.",
        "Hipertexto é um texto com links, de leitura não linear.",
        "Verifique fonte, autor, data e compare com outros meios antes de compartilhar.",
        "Algoritmos criam bolhas que mostram só opiniões parecidas.",
      ],
      keyPoints: [
        { term: "Hipertexto", explanation: "Texto com links que levam a outros conteúdos." },
        { term: "Fake news", explanation: "Notícia falsa criada para enganar, geralmente explorando emoções." },
        { term: "Exclusão digital", explanation: "Falta de acesso à internet e à tecnologia, que aprofunda desigualdades." },
      ],
    },
  ],
  literatura: [
    {
      title: "Quinhentismo, Barroco e Arcadismo",
      content: `## Quinhentismo (século 16)

Não é uma literatura brasileira propriamente dita, mas textos escritos **sobre** o Brasil:

- **Literatura de informação:** relatos de viajantes e cronistas, como a **Carta de Pero Vaz de Caminha** (1500), que descreve a terra e os indígenas com espanto e com olhar de dominação: "em se plantando, tudo dá".
- **Literatura de catequese:** textos dos jesuítas, como o **Padre José de Anchieta**, que escreveu poemas e peças de teatro para converter os indígenas ao catolicismo.

O ENEM costuma pedir uma leitura crítica: esses textos mostram o olhar do colonizador europeu sobre os povos originários.

## Barroco (século 17)

O Barroco nasceu em meio à Contrarreforma e expressa um **conflito**: o ser humano dividido entre a fé e o prazer, o espiritual e o material, a vida e a morte.

Características:

- **Antíteses** e **paradoxos**: luz e sombra, céu e terra.
- **Cultismo:** jogo com as palavras e imagens rebuscadas.
- **Conceptismo:** jogo de ideias e raciocínios elaborados.
- Consciência da passagem do tempo e da fragilidade da vida.

Autores: **Gregório de Matos**, o "Boca do Inferno", com poesia religiosa, lírica e principalmente **satírica**, criticando a sociedade da Bahia; e o **Padre Antônio Vieira**, com sermões argumentativos, como o Sermão da Sexagésima.

## Arcadismo (século 18)

Reação ao exagero barroco. Inspirado no Iluminismo e na cultura clássica, valoriza a **simplicidade** e a **razão**.

Características:

- **Bucolismo:** vida simples no campo, com pastores e pastoras.
- **Fugere urbem:** fugir da cidade.
- **Carpe diem:** aproveitar o momento.
- **Aurea mediocritas:** o equilíbrio, a vida simples.
- Pseudônimos de pastores: Tomás Antônio Gonzaga se tornou "Dirceu" e escreveu para a amada "Marília" em Marília de Dirceu.

Muitos árcades participaram da **Inconfidência Mineira**. Também se destacam o poema épico O Uraguai, de Basílio da Gama, e Cláudio Manoel da Costa.

## Resumindo

O Quinhentismo mostra o olhar europeu sobre o Brasil. O Barroco expressa o conflito entre fé e prazer, com antíteses. O Arcadismo busca simplicidade, natureza e equilíbrio.`,
      highlights: [
        "A Carta de Caminha é literatura de informação, com olhar do colonizador.",
        "Barroco: conflito entre fé e prazer, com antíteses e paradoxos.",
        "Gregório de Matos, o Boca do Inferno, fez sátiras à sociedade baiana.",
        "Arcadismo: bucolismo, simplicidade e razão, ligado à Inconfidência Mineira.",
      ],
      keyPoints: [
        { term: "Antítese", explanation: "Aproximação de ideias opostas, como luz e sombra." },
        { term: "Bucolismo", explanation: "Valorização da vida simples no campo." },
        { term: "Carpe diem", explanation: "Expressão latina que significa 'aproveite o dia'." },
      ],
    },
    {
      title: "Pré-Modernismo: o Brasil real",
      content: `## Entre dois séculos

No começo do século 20, antes da Semana de 1922, alguns escritores passaram a mostrar o Brasil que ficava escondido atrás do discurso de progresso da República: o sertão miserável, os subúrbios pobres, o caipira esquecido. Esse período se chama **Pré-Modernismo**.

Ele não é uma escola com regras, mas um conjunto de autores com uma preocupação em comum: a **denúncia da realidade social brasileira**.

## Euclides da Cunha

Em **Os Sertões** (1902), Euclides narra a **Guerra de Canudos**, em que o Exército destruiu a comunidade de Antônio Conselheiro, no sertão da Bahia. O livro tem três partes: a terra, o homem e a luta. Euclides foi como jornalista e passou a admirar a resistência dos sertanejos. A frase famosa: "**O sertanejo é, antes de tudo, um forte**." O livro denuncia o massacre cometido pela República.

## Lima Barreto

Escritor negro, de origem pobre, Lima Barreto retratou os **subúrbios do Rio de Janeiro** e criticou o racismo, a burocracia e o falso patriotismo. Em **Triste Fim de Policarpo Quaresma**, o protagonista é um nacionalista ingênuo que quer valorizar tudo o que é brasileiro, até propõe o tupi como língua oficial, e acaba destruído pelas instituições que admirava. Lima Barreto usava linguagem simples e direta, próxima da fala.

## Monteiro Lobato

Criou o **Jeca Tatu**, caipira preguiçoso que depois ele reconheceu ser vítima de doenças e da pobreza, e não culpado por ela. Também escreveu a obra infantil do Sítio do Picapau Amarelo.

## Augusto dos Anjos

Poeta único, misturou vocabulário científico com angústia e morte, num tom pessimista: "Tome, Doutor, esta tesoura e corte minha singularíssima pessoa".

## Graça Aranha

Em **Canaã**, discutiu a imigração alemã e o choque de culturas no Espírito Santo.

## Por que o ENEM gosta desse período

Porque esses autores mostram problemas que continuam atuais: desigualdade social, racismo, abandono do sertão e violência do Estado contra os pobres. As questões pedem para relacionar o texto com o contexto histórico da Primeira República.

## Resumindo

O Pré-Modernismo denunciou o Brasil real. Euclides mostrou o massacre de Canudos; Lima Barreto, os subúrbios e o racismo; Monteiro Lobato, o caipira esquecido.`,
      highlights: [
        "O Pré-Modernismo denunciou os problemas sociais do Brasil no início do século 20.",
        "Os Sertões, de Euclides da Cunha, narra a Guerra de Canudos.",
        "Lima Barreto criticou o racismo e o falso patriotismo em Policarpo Quaresma.",
        "Monteiro Lobato criou o Jeca Tatu.",
      ],
      keyPoints: [
        { term: "Canudos", explanation: "Comunidade do sertão baiano destruída pelo Exército em 1897, tema de Os Sertões." },
        { term: "Policarpo Quaresma", explanation: "Nacionalista ingênuo de Lima Barreto, destruído pelas instituições." },
        { term: "Denúncia social", explanation: "Literatura que expõe problemas e injustiças da sociedade." },
      ],
    },
    {
      title: "Gêneros literários e foco narrativo",
      content: `## Três grandes gêneros

Desde Aristóteles, a literatura é dividida em três gêneros:

- **Lírico:** expressa sentimentos e emoções de um eu lírico. É o gênero da maioria dos poemas.
- **Épico ou narrativo:** conta uma história, com narrador, personagens, tempo e espaço. Hoje inclui o romance, o conto, a novela e a crônica.
- **Dramático:** feito para ser encenado, com diálogos e rubricas (indicações de cena). É o teatro: tragédia, comédia e drama.

## Elementos da narrativa

- **Enredo:** a sequência de acontecimentos, geralmente com apresentação, conflito, clímax e desfecho.
- **Personagens:** protagonista, antagonista e secundários. Podem ser **planos** (simples, previsíveis) ou **redondos** (complexos, que mudam).
- **Tempo:** cronológico (na ordem dos fatos) ou psicológico (na lembrança e nos sentimentos do personagem).
- **Espaço:** onde a história acontece, que pode revelar o contexto social.

## Foco narrativo

O **narrador** é quem conta a história. Não é o autor.

- **Narrador em primeira pessoa (personagem):** participa da história e conta do seu ponto de vista. Sua visão é parcial: em Dom Casmurro, só sabemos o que Bentinho quer contar.
- **Narrador em terceira pessoa (observador):** conta de fora, sem participar.
- **Narrador onisciente:** sabe tudo, inclusive os pensamentos e sentimentos dos personagens.

## Discurso direto, indireto e indireto livre

- **Direto:** a fala do personagem aparece como ela é, com travessão ou aspas. — Vou embora, disse ela.
- **Indireto:** o narrador conta o que o personagem disse. Ela disse que ia embora.
- **Indireto livre:** a voz do narrador se mistura com o pensamento do personagem, sem aviso. Muito usado por Clarice Lispector e Graciliano Ramos.

## Gêneros curtos

- **Conto:** narrativa curta, com poucos personagens e um único conflito.
- **Crônica:** texto curto sobre fatos do cotidiano, com tom leve, reflexivo ou humorístico; publicado em jornais e revistas. Rubem Braga, Fernando Sabino e Luis Fernando Verissimo são cronistas famosos.

## Resumindo

Lírico expressa sentimentos; narrativo conta histórias; dramático é para encenar. O narrador pode ser personagem, observador ou onisciente. No discurso indireto livre, narrador e personagem se misturam.`,
      highlights: [
        "Gêneros literários: lírico, narrativo e dramático.",
        "O narrador não é o autor; o narrador-personagem tem visão parcial.",
        "Narrador onisciente sabe até os pensamentos dos personagens.",
        "Discurso indireto livre mistura a voz do narrador com a do personagem.",
      ],
      keyPoints: [
        { term: "Eu lírico", explanation: "Voz que expressa sentimentos no poema." },
        { term: "Narrador onisciente", explanation: "Narrador que sabe tudo sobre os personagens, inclusive o que pensam." },
        { term: "Crônica", explanation: "Texto curto sobre o cotidiano, publicado em jornais e revistas." },
      ],
    },
    {
      title: "Literatura contemporânea, afro-brasileira e indígena",
      content: `## Novas vozes na literatura

A partir das últimas décadas do século 20, a literatura brasileira ficou mais diversa. Grupos que antes apareciam só como personagens, muitas vezes de forma estereotipada, passaram a escrever sobre si mesmos. O ENEM valoriza muito essas vozes.

## Literatura afro-brasileira

Ela é escrita a partir da experiência negra e trata da memória da escravidão, do racismo, da resistência e da valorização da cultura afro-brasileira.

- **Conceição Evaristo** criou o conceito de **escrevivência**: a escrita que nasce da vivência, especialmente das mulheres negras. Obras: Ponciá Vicêncio e Olhos d'Água.
- **Carolina Maria de Jesus** escreveu Quarto de Despejo, diário da vida na favela do Canindé, em São Paulo, nos anos 1950. O livro denuncia a fome e a miséria com linguagem simples e direta.
- **Cruz e Sousa** (Simbolismo) e **Lima Barreto** (Pré-Modernismo) são precursores.
- A poesia e o rap das periferias também aparecem no ENEM, como as obras ligadas ao movimento da **literatura marginal** ou periférica.

## Literatura indígena

Autores indígenas escrevem a partir das suas culturas, valorizando a oralidade, a relação com a terra e a memória dos povos. **Daniel Munduruku** e **Ailton Krenak** (Ideias para Adiar o Fim do Mundo) são nomes importantes. Eles criticam a visão de mundo que separa o ser humano da natureza.

Atenção: no Romantismo, o indígena era personagem idealizado criado por autores brancos. Na literatura indígena contemporânea, ele é **autor** da própria história.

## Outros temas contemporâneos

- **Violência urbana:** Cidade de Deus, de Paulo Lins; os contos de Rubem Fonseca, com linguagem seca e crua.
- **Vozes femininas:** Lygia Fagundes Telles, Adélia Prado, Clarice Lispector.
- **Prosa intimista e fragmentada**, misturando gêneros.
- **Poesia concreta** e experimentações visuais.

## Como o ENEM cobra

As questões trazem um trecho e pedem para relacionar com a identidade, a memória e a resistência de um grupo social, ou para perceber o papel social da literatura como forma de denúncia e de afirmação.

## Resumindo

A literatura contemporânea é diversa e dá voz a grupos antes silenciados. Conceição Evaristo fala em escrevivência; Carolina Maria de Jesus denunciou a fome na favela; autores indígenas valorizam a oralidade e a relação com a terra.`,
      highlights: [
        "Escrevivência, de Conceição Evaristo: escrita que nasce da vivência.",
        "Carolina Maria de Jesus denunciou a fome em Quarto de Despejo.",
        "Na literatura indígena, o indígena é autor, não personagem idealizado.",
        "O ENEM liga esses textos à identidade, à memória e à resistência.",
      ],
      keyPoints: [
        { term: "Escrevivência", explanation: "Conceito de Conceição Evaristo: escrever a partir da própria vivência." },
        { term: "Quarto de Despejo", explanation: "Diário de Carolina Maria de Jesus sobre a vida na favela." },
        { term: "Literatura periférica", explanation: "Produção feita a partir das periferias, sobre a vida nesses lugares." },
      ],
    },
  ],
  artes: [
    {
      title: "Música brasileira: do samba ao rap",
      content: `## A música conta a história do país

A música popular brasileira acompanha as transformações sociais, e o ENEM costuma usar letras de canções para falar de política, cultura e identidade.

## Samba

Nasceu no início do século 20 nas comunidades negras do Rio de Janeiro, com forte herança africana. "Pelo Telefone", registrado em 1916, é considerado o primeiro samba gravado. Foi perseguido no começo e depois virou símbolo nacional, sobretudo na Era Vargas, que usou o samba e o rádio para construir uma identidade brasileira.

## Bossa Nova

No fim dos anos 1950, a Bossa Nova misturou o samba com o jazz, com batida de violão diferente e canto suave. João Gilberto, Tom Jobim e Vinicius de Moraes são os principais nomes. "Garota de Ipanema" ficou famosa no mundo todo.

## Canções de protesto e Tropicália

Durante a ditadura militar, os festivais de música revelaram artistas que usavam metáforas para driblar a censura, como Chico Buarque ("Cálice", "Apesar de Você") e Geraldo Vandré ("Pra Não Dizer que Não Falei das Flores").

A **Tropicália** (1967–1968), de Caetano Veloso e Gilberto Gil, misturou guitarra elétrica, rock, cultura pop e ritmos brasileiros, retomando a ideia da **antropofagia** de Oswald de Andrade. Os dois foram presos e exilados.

## MPB, regionais e a música das periferias

- A **MPB** reuniu vários estilos a partir dos anos 1960.
- Ritmos regionais: **baião** (Luiz Gonzaga, que levou o Nordeste para o rádio), **frevo**, **forró**, **maracatu**, **axé**.
- O **manguebeat**, de Chico Science, nos anos 1990, misturou maracatu e rock em Recife.
- O **rap** e o **hip-hop** chegaram das periferias para denunciar o racismo e a violência, como nos Racionais MC's.
- O **funk** carioca também é uma expressão cultural das favelas, muitas vezes alvo de preconceito.

## Como o ENEM cobra

Com letras de canções, a prova pede para relacionar a música com o contexto histórico (por exemplo, a censura), com a identidade cultural ou com a crítica social. Também pode tratar da música como patrimônio e do preconceito contra gêneros populares.

## Resumindo

O samba virou símbolo nacional; a Bossa Nova uniu samba e jazz; na ditadura, as canções de protesto usavam metáforas e a Tropicália misturou o pop com o brasileiro; o rap e o funk dão voz às periferias.`,
      highlights: [
        "O samba nasceu nas comunidades negras do Rio e virou símbolo nacional.",
        "A Bossa Nova misturou samba e jazz.",
        "Na ditadura, as canções de protesto usavam metáforas para driblar a censura.",
        "A Tropicália retomou a antropofagia, misturando o pop com o brasileiro.",
      ],
      keyPoints: [
        { term: "Tropicália", explanation: "Movimento de 1967–1968, de Caetano e Gil, que misturou estilos e criticou o conservadorismo." },
        { term: "Baião", explanation: "Ritmo nordestino popularizado por Luiz Gonzaga." },
        { term: "Canção de protesto", explanation: "Música que critica a situação política, comum na ditadura." },
      ],
    },
    {
      title: "Teatro, cinema e fotografia",
      content: `## Teatro

O teatro é arte de encenar, com atores, texto, cenário, figurino, iluminação e público. Na Grécia antiga, havia a **tragédia** (personagens nobres em conflitos que terminam mal) e a **comédia** (crítica com humor).

No Brasil, alguns nomes importantes:

- **Martins Pena**, no século 19, criou a comédia de costumes.
- **Nelson Rodrigues** revolucionou o teatro com Vestido de Noiva (1943), mostrando planos da realidade, da memória e da alucinação.
- **Ariano Suassuna**, com o Auto da Compadecida, uniu a cultura popular nordestina e o humor.
- **Teatro de Arena e Teatro Oficina**, nos anos 1960, com teatro político.
- **Augusto Boal** criou o **Teatro do Oprimido**, em que o público participa e discute a realidade social.

## Cinema

O cinema une imagem em movimento, som e narrativa. Momentos marcantes no Brasil:

- **Cinema Novo** (anos 1960): "uma câmera na mão e uma ideia na cabeça", disse Glauber Rocha. Filmes de baixo orçamento que mostravam a miséria e os problemas do país, como Vidas Secas e Deus e o Diabo na Terra do Sol.
- **Retomada** (anos 1990): Central do Brasil, Cidade de Deus.
- Hoje, o cinema discute temas como desigualdade, racismo e violência urbana, como em Que Horas Ela Volta? e Bacurau.

## Fotografia

A fotografia surgiu no século 19 e mudou a forma de ver o mundo. Ela pode **documentar** a realidade (fotojornalismo) ou ser **arte**. Sebastião Salgado é um fotógrafo brasileiro famoso pelas imagens em preto e branco de trabalhadores, migrantes e da natureza.

O ENEM lembra que a fotografia **não é neutra**: o enquadramento, o ângulo e o momento escolhidos pelo fotógrafo constroem um sentido. Uma foto tirada de baixo para cima engrandece a pessoa; de cima para baixo, a diminui.

## Linguagem audiovisual

Planos (geral, médio, close), ângulos, cortes, trilha sonora e iluminação criam emoções e significados. Na era digital, todos podem produzir vídeos, o que amplia as vozes, mas também a circulação de imagens manipuladas.

## Resumindo

O teatro brasileiro vai da comédia de costumes ao Teatro do Oprimido. O Cinema Novo mostrou a miséria do país com poucos recursos. Fotografia e cinema não são neutros: enquadramento e ângulo constroem sentidos.`,
      highlights: [
        "Nelson Rodrigues revolucionou o teatro com Vestido de Noiva.",
        "Teatro do Oprimido, de Augusto Boal: o público participa e discute a realidade.",
        "Cinema Novo: 'uma câmera na mão e uma ideia na cabeça'.",
        "A fotografia não é neutra: o ângulo e o enquadramento constroem sentido.",
      ],
      keyPoints: [
        { term: "Cinema Novo", explanation: "Movimento dos anos 1960 que mostrava os problemas sociais do Brasil." },
        { term: "Teatro do Oprimido", explanation: "Proposta de Augusto Boal em que o público participa da cena." },
        { term: "Enquadramento", explanation: "O que o fotógrafo ou cineasta escolhe mostrar dentro da imagem." },
      ],
    },
    {
      title: "Dança, lutas e práticas corporais",
      content: `## O corpo como linguagem

Dançar, lutar e jogar são formas de expressão e de cultura. O ENEM trata essas práticas como **patrimônio cultural**, ligadas à identidade e à história dos grupos.

## Dança

A dança comunica emoções e histórias com o movimento. Tipos:

- **Danças populares e folclóricas**, ligadas a festas e tradições: frevo, maracatu, quadrilha junina, carimbó, bumba meu boi, samba de roda.
- **Dança clássica (balé)**, com técnica rígida e movimentos codificados.
- **Dança moderna e contemporânea**, que rompem com as regras do balé e valorizam a liberdade de movimento e a expressão pessoal.
- **Danças urbanas**, como o breaking, do movimento hip-hop, que virou até modalidade olímpica.

## Lutas

As lutas envolvem técnicas de ataque e defesa, com regras e respeito ao adversário.

- **Capoeira:** criada por africanos escravizados e seus descendentes no Brasil, mistura luta, dança, música e jogo. Tem a roda, o berimbau e os cânticos. Foi perseguida e proibida, e hoje é **patrimônio cultural imaterial** reconhecido pela UNESCO.
- **Judô, jiu-jítsu, caratê, boxe**, entre outras, trazidas por imigrantes ou difundidas pelo esporte.
- **Huka-huka**, luta tradicional de povos indígenas do Xingu.

Diferença importante: **luta** tem regras e respeito ao oponente; **briga** é violência sem regras.

## Ginásticas e práticas corporais

- **Ginástica de condicionamento** (musculação, aeróbica) busca saúde e estética.
- **Ginástica de conscientização corporal** (ioga, pilates, alongamento) trabalha a postura, a respiração e a percepção do corpo.
- **Práticas corporais de aventura**, como skate, parkour e escalada, usam o espaço urbano e a natureza.

## Jogos e brincadeiras

Brincadeiras tradicionais, como pião, amarelinha e pipa, passam de geração em geração e variam de região para região. Os **jogos eletrônicos** também viraram prática cultural, e os **e-sports** levantam o debate sobre o que é esporte.

## Resumindo

Danças, lutas e jogos são cultura e identidade. A capoeira, criada por africanos escravizados, é patrimônio imaterial. Luta tem regras e respeito; briga não. Práticas de aventura usam a cidade e a natureza.`,
      highlights: [
        "Danças, lutas e jogos são patrimônio cultural e expressam identidades.",
        "A capoeira mistura luta, dança, música e jogo e é patrimônio imaterial.",
        "Luta tem regras e respeito ao oponente; briga é violência sem regras.",
        "Práticas de aventura, como o skate, usam o espaço urbano e a natureza.",
      ],
      keyPoints: [
        { term: "Dança contemporânea", explanation: "Dança que rompe com as regras do balé e valoriza a expressão livre." },
        { term: "Capoeira", explanation: "Luta-dança afro-brasileira, patrimônio cultural imaterial." },
        { term: "Práticas corporais de aventura", explanation: "Atividades como skate e escalada, com risco controlado." },
      ],
    },
  ],
  ingles: [
    {
      title: "Verb tenses: o tempo das ações",
      content: `## Por que os tempos verbais importam

Saber se uma ação aconteceu, está acontecendo ou vai acontecer muda a interpretação do texto. No ENEM, você não precisa conjugar verbos, só reconhecer as pistas de tempo.

## Presente

- **Simple present:** hábitos e verdades gerais. "She **works** in a hospital." Na terceira pessoa do singular, o verbo ganha **-s**.
- **Present continuous:** ação acontecendo agora ou temporária. Usa "am/is/are" + verbo com **-ing**: "They **are studying**."

## Passado

- **Simple past:** ação terminada no passado. Verbos regulares ganham **-ed**: "worked", "played". Os irregulares mudam de forma: "go" vira "**went**", "see" vira "**saw**", "write" vira "**wrote**".
- **Past continuous:** ação em andamento no passado: "I **was reading** when you called."

## Present perfect

Liga o passado ao presente: "have/has" + particípio. "I **have lived** here for ten years" (morei e ainda moro). Palavras que acompanham: *ever*, *never*, *already*, *yet*, *since*, *for*.

## Futuro

- **Will:** decisões e previsões: "It **will rain** tomorrow."
- **Going to:** planos e intenções: "We **are going to** travel."

## Marcadores de tempo

Palavras que indicam o tempo da frase:

- Passado: *yesterday*, *last week*, *ago* (two years ago), *in 1990*.
- Presente: *now*, *nowadays*, *currently*, *today*.
- Futuro: *tomorrow*, *next year*, *soon*.

Lembre: *nowadays* e *currently* significam "atualmente"; *actually* é "na verdade".

## Verbos auxiliares e negação

"Do/does" (presente) e "did" (passado) aparecem em perguntas e negativas: "She **doesn't** like coffee." "**Did** you see the news?" A palavra **not** (ou a contração **n't**) indica negação e inverte o sentido da frase: preste atenção nela.

## Na prova

Uma questão pode perguntar se algo já aconteceu ou ainda vai acontecer. Procure os marcadores de tempo e as terminações (-ed, -ing) para responder com segurança.

## Resumindo

Simple present para hábitos; -ing para ações em andamento; -ed ou forma irregular para o passado; will e going to para o futuro. Marcadores como yesterday, now e tomorrow ajudam a situar a ação.`,
      highlights: [
        "-ing indica ação em andamento; -ed indica passado (verbos regulares).",
        "Present perfect liga o passado ao presente: 'have lived'.",
        "Will e going to indicam futuro.",
        "Nowadays e currently significam 'atualmente'.",
      ],
      keyPoints: [
        { term: "Simple past", explanation: "Passado terminado: regular com -ed; irregular muda a forma (go → went)." },
        { term: "Present perfect", explanation: "Have/has + particípio: ação que começou no passado e tem efeito no presente." },
        { term: "Ago", explanation: "Indica tempo passado: 'two years ago' é 'dois anos atrás'." },
      ],
    },
    {
      title: "Pronomes, referência e palavras de ligação",
      content: `## Quem é "they"?

Uma pergunta comum no ENEM: a que palavra do texto um pronome se refere. Para responder, é preciso conhecer os pronomes e voltar ao texto para achar o termo retomado.

## Pronomes pessoais

- *I* (eu), *you* (você, vocês), *he* (ele), *she* (ela), *it* (ele ou ela para coisas e animais), *we* (nós), *they* (eles, elas).
- Como objeto: *me*, *you*, *him*, *her*, *it*, *us*, *them*.

## Possessivos

- Antes do substantivo: *my*, *your*, *his*, *her*, *its*, *our*, *their*. "**Their** house" (a casa deles).
- Sozinhos: *mine*, *yours*, *his*, *hers*, *ours*, *theirs*.
- Atenção: *his* (dele) e *her* (dela) dependem do dono, e não da coisa possuída.

## Pronomes relativos

Ligam orações e retomam um termo anterior:

- *who*: para pessoas. "The woman **who** wrote the book."
- *which*: para coisas. "The law **which** was approved."
- *that*: para pessoas ou coisas.
- *whose*: posse. "The student **whose** project won."
- *where*: lugar.

## Demonstrativos

*This* (este, esta) e *these* (estes) para o que está perto; *that* (aquele) e *those* (aqueles) para o que está longe.

## Como achar a referência

1. Leia a frase do pronome.
2. Volte às frases anteriores e procure um substantivo que combine em número (singular ou plural) e em tipo (pessoa ou coisa).
3. Teste: troque o pronome pela palavra e veja se faz sentido.

Exemplo: "Scientists studied the forests. **They** found new species." *They* retoma *scientists* (quem encontrou foram os cientistas, não as florestas).

## Palavras de ligação (linking words)

Elas mostram a relação entre as ideias, como os conectivos em português:

- **Contraste:** *but*, *however*, *although*, *despite*, *nevertheless*, *whereas*.
- **Adição:** *and*, *also*, *besides*, *moreover*, *furthermore*.
- **Causa:** *because*, *since*, *as*, *due to*.
- **Consequência:** *so*, *therefore*, *thus*, *as a result*.
- **Exemplo:** *for example*, *for instance*, *such as*.
- **Condição:** *if*, *unless* (a menos que).

## Resumindo

Para achar a referência de um pronome, volte ao texto e procure um termo que combine em número e tipo. Who é para pessoas; which, para coisas. Linking words como however e therefore mostram a relação entre as ideias.`,
      highlights: [
        "Para achar a referência de um pronome, volte ao texto e teste a substituição.",
        "Who é para pessoas; which, para coisas; whose indica posse.",
        "His (dele) e her (dela) dependem do dono.",
        "However e although indicam contraste; therefore e so, consequência.",
      ],
      keyPoints: [
        { term: "Pronome relativo", explanation: "Liga orações retomando um termo anterior: who, which, that, whose." },
        { term: "Their", explanation: "Possessivo 'deles' ou 'delas'." },
        { term: "Unless", explanation: "Conectivo de condição negativa: 'a menos que'." },
      ],
    },
    {
      title: "Modais, comparações e o sentido das frases",
      content: `## Verbos modais

Os **modais** acompanham outro verbo e mudam o sentido da frase, indicando possibilidade, obrigação, conselho ou capacidade. Eles são muito comuns em campanhas, regras e textos de opinião.

- *can*: capacidade ou permissão. "You **can** help." (você pode ajudar)
- *could*: possibilidade ou capacidade no passado; pedido educado.
- *may* / *might*: possibilidade. "It **may** rain." (pode chover)
- *must*: obrigação forte ou certeza. "You **must** wear a seatbelt."
- *mustn't*: proibição. "You **mustn't** smoke here."
- *should*: conselho, recomendação. "You **should** drink more water."
- *would*: condição ou pedido educado. "I **would** like..." (eu gostaria)
- *have to*: obrigação.

Na prova, a diferença entre **must** (obrigação) e **should** (conselho) pode decidir a resposta: o texto exige ou recomenda?

## Comparações

- **Comparativo de superioridade:** adjetivos curtos ganham **-er** + *than*: "bigger than", "cheaper than". Adjetivos longos usam **more** + *than*: "more important than".
- **Superlativo:** **the** + **-est** ("the biggest") ou **the most** ("the most important").
- **Igualdade:** *as* + adjetivo + *as*: "as good as" (tão bom quanto).
- **Inferioridade:** *less* + adjetivo + *than*: "less expensive than".
- Irregulares: *good*, *better*, *the best*; *bad*, *worse*, *the worst*.

Gráficos e notícias com dados usam muito essas comparações: "the highest rate", "fewer people than", "more than half".

## Quantidades

- *Many* (muitos, contáveis) e *much* (muito, incontáveis).
- *Few* (poucos) e *little* (pouco).
- *More than*, *less than*, *about* (cerca de), *almost* (quase), *half* (metade), *twice* (o dobro).

## Imperativo e voz passiva

- **Imperativo:** verbo sem sujeito, para ordens e conselhos: "Protect the environment."
- **Voz passiva:** *be* + particípio. "The law **was approved** in 2010." Destaca o que foi feito, não quem fez. Muito usada em notícias e textos científicos.

## Resumindo

Modais mudam o sentido: can (poder), should (dever, conselho), must (obrigação). Comparativos usam -er/more + than; superlativos, the -est/the most. Atenção às quantidades em gráficos e notícias.`,
      highlights: [
        "Must indica obrigação; should, conselho; can, capacidade ou permissão.",
        "Comparativo: -er ou more + than; superlativo: the -est ou the most.",
        "Many para contáveis e much para incontáveis.",
        "Voz passiva destaca o que foi feito: 'was approved'.",
      ],
      keyPoints: [
        { term: "Modal verb", explanation: "Verbo auxiliar que indica possibilidade, obrigação, conselho ou capacidade." },
        { term: "Should", explanation: "Indica conselho ou recomendação: 'deveria'." },
        { term: "Superlativo", explanation: "Grau máximo: the biggest, the most important." },
      ],
    },
  ],
  espanhol: [
    {
      title: "Verbos e tempos no espanhol",
      content: `## Reconhecer, não conjugar

No ENEM você não precisa conjugar verbos em espanhol, mas reconhecer o tempo ajuda a entender quando as coisas aconteceram e qual é a intenção do texto.

## Presente

Parecido com o português: *yo hablo*, *tú hablas*, *él habla*, *nosotros hablamos*, *ellos hablan*. Alguns verbos mudam a vogal da raiz: *poder* vira *puedo* (posso); *querer* vira *quiero* (quero); *pedir* vira *pido* (peço).

## Pretérito indefinido

É o passado simples, de ações terminadas: *hablé* (falei), *comí* (comi), *viví* (vivi). Irregulares importantes: *fue* (foi, dos verbos ser e ir), *tuvo* (teve), *hizo* (fez), *dijo* (disse), *estuvo* (esteve).

## Pretérito perfecto

Usa o verbo *haber* + particípio: *he comido* (comi, tenho comido), *ha llegado* (chegou). Indica ação passada ligada ao presente, comum na Espanha para fatos do mesmo dia.

Atenção: em espanhol, *haber* é auxiliar e também significa "existir": *hay* = há, existe.

## Pretérito imperfecto

Passado contínuo ou habitual: *hablaba* (falava), *comía* (comia), *era* (era), *iba* (ia).

## Futuro e condicional

- Futuro: *hablaré* (falarei), *será* (será), *habrá* (haverá). Também se usa *ir a* + infinitivo: *voy a estudiar* (vou estudar).
- Condicional: *hablaría* (falaria), *podría* (poderia).

## Imperativo

Muito comum em campanhas: *Cuida el agua* (cuide da água), *No tires basura* (não jogue lixo), *Participa* (participe).

## Verbos parecidos que enganam

- *Quedar* (ficar, combinar) e *quedarse* (permanecer).
- *Echar* (jogar, colocar para fora); *echar de menos* = sentir falta.
- *Tener que* = ter de, precisar.
- *Llevar* (levar, usar roupa) e *traer* (trazer).

## Gustar

*Me gusta el chocolate* = eu gosto de chocolate. A estrutura é diferente do português: a coisa de que se gosta é o sujeito. *Me gustan los libros* (plural).

## Resumindo

Reconheça os tempos: indefinido (hablé) para passado terminado, imperfecto (hablaba) para passado habitual, futuro (hablaré) e condicional (hablaría). Hay significa "há". Me gusta funciona diferente do português.`,
      highlights: [
        "Pretérito indefinido é o passado terminado: hablé, comí, fue.",
        "Hay significa 'há' ou 'existe'.",
        "Ir a + infinitivo indica futuro: voy a estudiar.",
        "Me gusta: a coisa de que se gosta é o sujeito da frase.",
      ],
      keyPoints: [
        { term: "Pretérito indefinido", explanation: "Passado de ações concluídas: hablé, comí, viví." },
        { term: "Echar de menos", explanation: "Expressão que significa 'sentir falta'." },
        { term: "Imperativo", explanation: "Forma de ordem ou conselho, comum em campanhas: 'Cuida el agua'." },
      ],
    },
    {
      title: "Pronomes, artigos e referências no texto",
      content: `## Quem é quem no texto

Assim como no inglês, o ENEM pergunta a que palavra um pronome se refere. Conhecer os pronomes do espanhol ajuda muito.

## Pronomes pessoais

- Sujeito: *yo*, *tú*, *él*, *ella*, *usted*, *nosotros*, *vosotros*, *ellos*, *ellas*, *ustedes*.
- **Usted** e **ustedes** são formas de tratamento (o senhor, os senhores; vocês), mas o verbo vai na terceira pessoa: *usted tiene* (o senhor tem).

## Pronomes complemento

- *me*, *te*, *lo*, *la*, *le*, *nos*, *os*, *los*, *las*, *les*.
- *Lo* e *la* substituem o objeto direto: "Compré el libro y **lo** leí" (e o li).
- *Le* e *les* substituem o objeto indireto: "**Le** di un regalo" (dei a ele um presente).
- Quando aparecem juntos, *le* vira *se*: "**Se lo** di" (eu o dei a ele).

## Possessivos

*Mi*, *tu*, *su* (seu, dele, dela, deles), *nuestro*, *vuestro*. Atenção: *su* pode significar "dele", "dela", "seu" ou "deles": o contexto decide.

## Demonstrativos

*Este* (este), *ese* (esse), *aquel* (aquele) e as formas *esta*, *esa*, *aquella* e os plurais. *Esto*, *eso* e *aquello* são neutros e se referem a ideias, não a palavras.

## Artigos

- Definidos: *el*, *la*, *los*, *las* e o neutro **lo**.
- Não existe contração com *de* e *a*, exceto *al* (a + el) e *del* (de + el).
- **El** antes de palavras femininas que começam com "a" tônico: *el agua*, *el águila*, mas *las aguas*.

## Lo + adjetivo

O neutro *lo* transforma um adjetivo em ideia: *lo importante* (o importante, o que é importante), *lo mejor* (o melhor), *lo que* (o que).

## Como achar a referência

Leia a frase com o pronome, volte ao texto e procure o termo que combina em gênero e número. Teste a substituição. Lembre que *lo* pode retomar uma ideia inteira, e não só uma palavra.

## Resumindo

Usted leva o verbo na terceira pessoa. Lo e la substituem o objeto direto; le, o indireto. Su pode ser dele, dela, seu ou deles: decida pelo contexto. Lo + adjetivo forma uma ideia: lo importante.`,
      highlights: [
        "Usted (o senhor) leva o verbo na terceira pessoa.",
        "Lo e la retomam o objeto direto; le e les, o indireto.",
        "Su pode ser 'dele', 'dela', 'seu' ou 'deles': o contexto decide.",
        "Lo + adjetivo forma uma ideia: lo importante, lo mejor.",
      ],
      keyPoints: [
        { term: "Lo neutro", explanation: "Artigo que transforma um adjetivo em ideia: 'lo bueno' é 'o que é bom'." },
        { term: "Al e del", explanation: "Únicas contrações: a + el = al; de + el = del." },
        { term: "El agua", explanation: "Palavra feminina com 'a' tônico usa o artigo el no singular." },
      ],
    },
    {
      title: "Variedades do espanhol e expressões",
      content: `## Um idioma, muitos jeitos de falar

Assim como o português do Brasil é diferente do de Portugal, o espanhol muda de um país para outro. O ENEM valoriza essa **diversidade** e critica o preconceito linguístico.

## Diferenças entre a Espanha e a América

- **Vosotros** (vocês) é usado na Espanha; na América Latina se usa *ustedes*.
- **Voseo:** na Argentina, no Uruguai e em partes da América Central, usa-se *vos* no lugar de *tú*: *vos tenés* em vez de *tú tienes*.
- **Seseo:** na América e em partes da Espanha, o "z" e o "c" antes de "e" e "i" são pronunciados como "s".
- **Vocabulário:** o carro é *coche* na Espanha e *carro* ou *auto* na América; o computador é *ordenador* na Espanha e *computadora* na América; o celular é *móvil* na Espanha e *celular* na América.

## Espanhol e línguas indígenas

O espanhol da América recebeu palavras de línguas indígenas, como o náhuatl (no México) e o quíchua (nos Andes): *chocolate*, *tomate*, *aguacate* (abacate), *cancha* (quadra). Em vários países, línguas indígenas são oficiais junto com o espanhol, como o guarani no Paraguai.

## Expressões idiomáticas

Expressões que não podem ser traduzidas palavra por palavra:

- *Estar en las nubes*: estar distraído (nas nuvens).
- *Tomar el pelo*: enganar, zombar de alguém (tirar sarro).
- *Echar una mano*: dar uma ajuda.
- *Costar un ojo de la cara*: custar muito caro (os olhos da cara).
- *Ponerse las pilas*: animar-se, se esforçar.
- *Ser pan comido*: ser muito fácil.
- *Meter la pata*: cometer uma gafe.

Na prova, se uma expressão parecer estranha, pense no sentido figurado pelo contexto.

## Portunhol e fronteiras

Nas regiões de fronteira entre o Brasil e os países vizinhos, as línguas se misturam no chamado **portunhol**. O ENEM já trouxe textos que tratam essa mistura como fenômeno cultural legítimo, não como "erro".

## Resumindo

O espanhol varia entre países: vosotros na Espanha, ustedes e vos na América. Há palavras de origem indígena e muitas expressões idiomáticas. A diversidade linguística deve ser respeitada.`,
      highlights: [
        "Vosotros é usado na Espanha; ustedes, na América Latina.",
        "O voseo (vos tenés) é comum na Argentina e no Uruguai.",
        "Expressões idiomáticas têm sentido figurado: echar una mano é dar uma ajuda.",
        "O ENEM valoriza a diversidade do espanhol e critica o preconceito linguístico.",
      ],
      keyPoints: [
        { term: "Voseo", explanation: "Uso de 'vos' no lugar de 'tú', comum na região do Rio da Prata." },
        { term: "Expressão idiomática", explanation: "Expressão de sentido figurado, que não se traduz palavra por palavra." },
        { term: "Portunhol", explanation: "Mistura de português e espanhol nas regiões de fronteira." },
      ],
    },
  ],
};
