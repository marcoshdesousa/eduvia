import { aula } from "./build";

/** Geografia, lote 2: espaço urbano, economia, geopolítica e natureza. */
export const GEOGRAFIA_2 = [
  aula(
    "Problemas urbanos: segregação, moradia e mobilidade",
    `## Cidades que cresceram rápido demais

O Brasil se urbanizou de forma **rápida e sem planejamento** (de cerca de 30% urbano em 1940 para mais de 85% hoje). Isso gerou vários problemas.

## Segregação socioespacial

- Os grupos sociais se separam no espaço: **ricos** em áreas centrais com infraestrutura ou em **condomínios fechados**; **pobres** em **periferias** distantes, **favelas** e áreas de risco.
- A **especulação imobiliária** (manter terrenos vazios esperando valorizar) encarece a moradia e empurra os pobres para longe.
- **Gentrificação:** a revitalização de um bairro popular atrai moradores de renda mais alta e expulsa os antigos pelo aumento dos aluguéis.

## Moradia

- **Déficit habitacional** de milhões de moradias.
- Ocupações irregulares em encostas e margens de rios: risco de **deslizamentos** e **enchentes**.
- Programas como o **Minha Casa, Minha Vida**, às vezes criticados por construir conjuntos muito distantes dos empregos.
- **Estatuto da Cidade (2001):** prevê a **função social da propriedade** e o **plano diretor** obrigatório para cidades com mais de 20 mil habitantes.

## Mobilidade urbana

- Modelo baseado no **automóvel** (rodoviarismo): congestionamentos, poluição e acidentes.
- Transporte público caro e lotado; trabalhadores perdem horas por dia em deslocamentos (**migração pendular**).
- Soluções: **metrô**, **BRT**, corredores de ônibus, **ciclovias**, tarifa integrada.

## Outros problemas

- **Enchentes:** impermeabilização do solo (asfalto), rios canalizados, lixo nos bueiros.
- **Ilha de calor**, poluição do ar e sonora.
- **Lixo:** muitos municípios ainda usam **lixões**; a Política Nacional de Resíduos Sólidos (2010) prevê aterros sanitários e reciclagem com catadores.
- Violência e falta de áreas de lazer nas periferias.

## Direito à cidade

Conceito do filósofo **Henri Lefebvre**: todos devem poder usufruir da cidade (moradia, transporte, cultura, lazer), e não só quem pode pagar.

## Resumindo

A urbanização rápida gerou segregação, déficit habitacional, áreas de risco e problemas de mobilidade. Estatuto da Cidade, transporte coletivo e o direito à cidade são caminhos.`,
    [
      "Segregação: ricos no centro/condomínios; pobres nas periferias.",
      "Especulação imobiliária e gentrificação encarecem a moradia.",
      "Estatuto da Cidade: função social da propriedade e plano diretor.",
      "Mobilidade: priorizar o transporte coletivo e as ciclovias.",
    ],
    [
      ["Segregação socioespacial", "Separação dos grupos sociais no espaço da cidade conforme a renda."],
      ["Gentrificação", "Valorização de um bairro que expulsa os moradores mais pobres."],
      ["Plano diretor", "Lei municipal que organiza o crescimento e o uso do solo urbano."],
    ],
    [
      ["A gentrificação ocorre quando:", ["um bairro pobre é abandonado", "a valorização de um bairro expulsa moradores mais pobres", "a cidade perde população", "se constroem favelas", "o campo se urbaniza"], 1, "Aluguéis sobem e os antigos saem."],
      ["Uma causa das enchentes urbanas é:", ["excesso de vegetação", "impermeabilização do solo pelo asfalto", "falta de chuvas", "rios largos e naturais", "solo muito permeável"], 1, "A água não infiltra."],
      ["O Estatuto da Cidade prevê:", ["o fim das cidades médias", "a função social da propriedade e o plano diretor", "a proibição de transporte público", "a privatização das ruas", "o fim dos impostos urbanos"], 1, "Lei de 2001."],
      ["A especulação imobiliária consiste em:", ["construir casas populares", "manter terrenos vazios esperando valorização", "doar terrenos", "reduzir aluguéis", "criar parques"], 1, "Encarece a moradia."],
      ["Uma medida para melhorar a mobilidade urbana é:", ["incentivar só o carro individual", "investir em metrô, corredores de ônibus e ciclovias", "acabar com calçadas", "aumentar as tarifas", "fechar estações"], 1, "Transporte coletivo."],
    ],
    [["Explique o que é segregação socioespacial e cite uma causa.", "É a separação dos grupos sociais no espaço da cidade, com ricos em áreas com infraestrutura e pobres nas periferias e áreas de risco; uma causa é a especulação imobiliária, que encarece a moradia."]],
  ),
  aula(
    "Fontes de energia não renováveis e o petróleo",
    `## Combustíveis fósseis

São formados por **restos de seres vivos** acumulados e transformados ao longo de **milhões de anos**. Por isso são **não renováveis**.

## Petróleo

- Principal fonte de energia do mundo (transportes, plásticos, indústria).
- Formado em **bacias sedimentares**, a partir de matéria orgânica marinha.
- No Brasil: a **Petrobras** (criada em 1953, campanha "**O petróleo é nosso**", no governo Vargas) e a descoberta do **pré-sal** (2006), em águas ultraprofundas, que tornou o país grande produtor.
- **Geopolítica:** o **Oriente Médio** concentra grandes reservas; a **OPEP** controla parte da produção e influencia os preços. Guerras e conflitos (Golfo, Iraque) têm relação com o petróleo.
- **Choques do petróleo (1973 e 1979):** alta brusca dos preços que causou crise mundial e levou o Brasil a criar o **Proálcool** (1975).
- Impactos: emissão de **gases de efeito estufa**, **derramamentos** (como o de 2019 no litoral do Nordeste).

## Carvão mineral

- Base da **Revolução Industrial**.
- Muito usado na China, Índia e EUA para gerar eletricidade.
- O **mais poluente**: muito gás carbônico, enxofre (chuva ácida) e fuligem.
- No Brasil, há reservas no **Sul** (SC e RS), de baixa qualidade.

## Gás natural

- Menos poluente que carvão e petróleo, mas ainda fóssil.
- Transportado por **gasodutos** (o Gasbol traz gás da Bolívia).
- Usado em termelétricas, indústria, residências e veículos (GNV).
- **Fracking** (fraturamento hidráulico) para extrair gás de xisto: polêmico pelos riscos à água.

## Energia nuclear

- Usa o **urânio** (fissão nuclear). Não emite CO₂ na geração.
- Riscos: **acidentes** (Chernobyl, 1986; Fukushima, 2011) e **lixo radioativo** que dura milhares de anos.
- No Brasil: **Angra 1 e 2** (RJ); Angra 3 em construção. Acidente com **césio-137** em **Goiânia (1987)**.

## Resumindo

Petróleo, carvão e gás são fósseis e não renováveis; o carvão é o mais poluente. O pré-sal tornou o Brasil grande produtor. A energia nuclear não emite CO₂, mas tem riscos e lixo radioativo.`,
    [
      "Fósseis: petróleo, carvão e gás — não renováveis.",
      "Pré-sal e Petrobras (\"O petróleo é nosso\").",
      "Choques do petróleo (1973/79) levaram ao Proálcool.",
      "Nuclear: sem CO₂, mas com lixo radioativo e risco de acidentes.",
    ],
    [
      ["OPEP", "Organização dos Países Exportadores de Petróleo."],
      ["Pré-sal", "Reservas de petróleo em águas ultraprofundas do litoral brasileiro."],
      ["Fissão nuclear", "Divisão do núcleo do átomo que libera energia."],
    ],
    [
      ["A fonte fóssil considerada a mais poluente é:", ["gás natural", "carvão mineral", "etanol", "eólica", "solar"], 1, "Muito CO₂ e enxofre."],
      ["O Proálcool foi criado em resposta:", ["à abolição", "aos choques do petróleo dos anos 1970", "à descoberta do pré-sal", "à Segunda Guerra", "ao fim do café"], 1, "Alta dos preços do petróleo."],
      ["Um risco da energia nuclear é:", ["emissão de muito CO₂", "acidentes e geração de lixo radioativo", "falta de vento", "alagamento de terras", "dependência de chuvas"], 1, "Chernobyl, Fukushima, Goiânia."],
      ["A campanha \"O petróleo é nosso\" levou à criação:", ["da OPEP", "da Petrobras", "de Itaipu", "do Proálcool", "de Angra 1"], 1, "1953, governo Vargas."],
      ["O petróleo é considerado não renovável porque:", ["acaba com a chuva", "sua formação leva milhões de anos", "é produzido em fábricas", "vem do sol", "se renova todo ano"], 1, "Escala geológica."],
    ],
    [["Por que o petróleo é importante na geopolítica mundial?", "Porque é a principal fonte de energia e matéria-prima de plásticos; suas reservas se concentram em poucas regiões, como o Oriente Médio, e o controle da produção e dos preços gera disputas, alianças e até guerras."]],
  ),
  aula(
    "Indústria no mundo: das revoluções industriais à Indústria 4.0",
    `## Revoluções industriais

1. **Primeira (fim do século XVIII, Inglaterra):** máquina a **vapor**, **carvão**, indústria **têxtil**, ferrovias.
2. **Segunda (fim do século XIX, EUA, Alemanha, Japão):** **eletricidade**, **petróleo**, aço, química, automóvel; produção em massa.
3. **Terceira (meados do século XX):** **eletrônica**, **informática**, robótica, telecomunicações, biotecnologia.
4. **Quarta (Indústria 4.0, século XXI):** **inteligência artificial**, internet das coisas, big data, automação total, impressão 3D.

## Modelos de produção

- **Taylorismo:** divisão do trabalho em tarefas simples e cronometradas, para aumentar a produtividade.
- **Fordismo:** **linha de montagem** (esteira), produção **em massa** e padronizada, estoques grandes, salários para que os operários pudessem consumir. Ex.: o Ford Modelo T.
- **Toyotismo (acumulação flexível):** produção **enxuta**, sob demanda (***just in time***), **estoque mínimo**, trabalhador **multifuncional**, controle de qualidade, terceirização.

## Fatores de localização industrial

As indústrias se instalam onde há: matéria-prima, **mão de obra**, **mercado consumidor**, energia, transportes, **incentivos fiscais** e mão de obra qualificada (no caso de alta tecnologia).

## Desconcentração e "guerra fiscal"

- Muitas empresas saíram de grandes centros (como São Paulo) em busca de mão de obra mais barata, terrenos e **isenção de impostos** oferecida por estados e municípios (**guerra fiscal**).
- No mundo, multinacionais transferiram fábricas para países como **China**, Vietnã e México.

## Tecnopolos

Centros que unem **universidades**, pesquisa e empresas de alta tecnologia: **Vale do Silício** (EUA); no Brasil, **Campinas**, **São José dos Campos** (aviação, Embraer) e **São Carlos**.

## Efeitos no trabalho

- **Desemprego estrutural:** postos substituídos por máquinas e programas.
- **Precarização** e trabalho por aplicativos (**uberização**).
- Exigência de **qualificação** constante.

## Resumindo

As revoluções industriais foram do vapor à inteligência artificial. Fordismo: linha de montagem e massa; toyotismo: produção enxuta e just in time. Indústrias buscam incentivos e mão de obra; a automação gera desemprego estrutural.`,
    [
      "1ª RI: vapor e carvão; 2ª: eletricidade e petróleo; 3ª: informática; 4ª: IA.",
      "Fordismo: linha de montagem e produção em massa.",
      "Toyotismo: produção enxuta, just in time e estoque mínimo.",
      "Guerra fiscal: estados oferecem isenções para atrair indústrias.",
    ],
    [
      ["Just in time", "Produzir só o necessário, no momento certo, com estoque mínimo."],
      ["Tecnopolo", "Centro que reúne universidades, pesquisa e empresas de alta tecnologia."],
      ["Desemprego estrutural", "Desemprego causado por mudanças tecnológicas que eliminam postos de trabalho."],
    ],
    [
      ["A linha de montagem e a produção em massa caracterizam o:", ["toyotismo", "fordismo", "artesanato", "feudalismo", "mercantilismo"], 1, "Henry Ford."],
      ["O toyotismo se diferencia do fordismo por:", ["grandes estoques", "produção enxuta e just in time", "trabalhador com uma só tarefa", "produção artesanal", "ausência de qualidade"], 1, "Acumulação flexível."],
      ["A \"guerra fiscal\" entre estados brasileiros consiste em:", ["conflitos armados", "oferecer isenção de impostos para atrair empresas", "aumentar impostos", "proibir indústrias", "nacionalizar fábricas"], 1, "Disputa por investimentos."],
      ["A Segunda Revolução Industrial teve como base:", ["vapor e carvão", "eletricidade e petróleo", "inteligência artificial", "energia solar", "informática"], 1, "Fim do século XIX."],
      ["São José dos Campos é um exemplo de:", ["lixão", "tecnopolo ligado à indústria aeronáutica", "polo agrícola", "zona franca", "área de garimpo"], 1, "Embraer e ITA."],
    ],
    [["Compare o fordismo e o toyotismo.", "O fordismo usa a linha de montagem, produção em massa e padronizada, grandes estoques e trabalhador especializado numa tarefa; o toyotismo usa produção enxuta e flexível, just in time, estoque mínimo e trabalhador multifuncional."]],
  ),
  aula(
    "Geopolítica atual: conflitos, blocos e nova ordem mundial",
    `## Da bipolaridade à multipolaridade

- **Guerra Fria (1947–1991):** mundo **bipolar**, dividido entre **EUA** (capitalismo) e **URSS** (socialismo).
- Após o fim da URSS (1991): **hegemonia dos EUA** (unipolaridade militar).
- Hoje: mundo **multipolar**, com vários centros de poder: EUA, **China**, União Europeia, Rússia, Índia.

## A ascensão da China

- Segunda maior economia do mundo; "fábrica do mundo".
- **Socialismo de mercado**: Partido Comunista no poder, com economia aberta ao capital (**Zonas Econômicas Especiais**, desde Deng Xiaoping).
- **Nova Rota da Seda** (Iniciativa Cinturão e Rota): investimentos em infraestrutura em vários países.
- Disputa tecnológica e comercial com os EUA.
- Maior parceiro comercial do **Brasil** (compra soja, minério de ferro e petróleo).

## Blocos econômicos

- **União Europeia:** o mais integrado, com livre circulação de pessoas e moeda comum (**euro**) em parte dos países. O Reino Unido saiu (**Brexit**, 2020).
- **Mercosul:** Brasil, Argentina, Uruguai, Paraguai (e Bolívia em adesão); união aduaneira imperfeita.
- **USMCA** (antigo NAFTA): EUA, México e Canadá.
- **BRICS:** Brasil, Rússia, Índia, China, África do Sul e novos membros; não é bloco econômico formal, mas um grupo de cooperação entre emergentes.
- **APEC**, **ASEAN**.

## Conflitos atuais

- **Rússia x Ucrânia** (invasão em 2022): expansão da OTAN, interesses territoriais, gás natural; crise de refugiados e alta de alimentos e energia.
- **Israel x Palestina:** disputa por território desde 1948; ocupação, Faixa de Gaza, Cisjordânia, Jerusalém.
- **Oriente Médio:** guerras na Síria e no Iêmen; disputas por petróleo e influências religiosas (sunitas x xiitas).
- **África:** conflitos ligados a fronteiras artificiais traçadas pelos europeus (Conferência de Berlim, 1884–85), disputas étnicas e por recursos.

## Organizações internacionais

- **ONU** (1945): paz e segurança; **Conselho de Segurança** com 5 membros permanentes com **poder de veto** (EUA, Rússia, China, Reino Unido e França). O Brasil defende a reforma do Conselho.
- **OTAN:** aliança militar ocidental.
- **OMC:** regula o comércio internacional.

## Resumindo

O mundo passou de bipolar a multipolar. A China disputa a liderança com os EUA. Blocos como UE e Mercosul integram economias. Conflitos como Rússia–Ucrânia e Israel–Palestina marcam a geopolítica atual.`,
    [
      "Do mundo bipolar (Guerra Fria) ao multipolar atual.",
      "China: socialismo de mercado e Nova Rota da Seda.",
      "UE é o bloco mais integrado; Mercosul inclui o Brasil.",
      "Conselho de Segurança da ONU: 5 membros com veto.",
    ],
    [
      ["Multipolaridade", "Ordem mundial com vários centros de poder."],
      ["Bloco econômico", "Grupo de países que reduz barreiras comerciais entre si."],
      ["Poder de veto", "Direito de barrar uma decisão, como no Conselho de Segurança da ONU."],
    ],
    [
      ["A ordem mundial atual é melhor descrita como:", ["bipolar", "multipolar", "feudal", "colonial", "sem nenhum poder"], 1, "Vários centros de poder."],
      ["O bloco econômico mais integrado do mundo, com moeda comum, é:", ["Mercosul", "União Europeia", "BRICS", "USMCA", "APEC"], 1, "Euro e livre circulação."],
      ["Os membros permanentes do Conselho de Segurança da ONU têm:", ["poder de veto", "direito de invadir outros países", "obrigação de doar alimentos", "voto igual aos demais sem veto", "mandato de dois anos"], 0, "EUA, Rússia, China, Reino Unido e França."],
      ["O maior parceiro comercial do Brasil atualmente é:", ["Argentina", "China", "Portugal", "Japão", "Paraguai"], 1, "Compra soja, minério e petróleo."],
      ["Muitos conflitos na África têm relação com:", ["fronteiras traçadas pelos europeus sem respeitar os povos", "a falta de recursos naturais", "a Guerra Fria apenas", "a neve", "a ausência de população"], 0, "Conferência de Berlim."],
    ],
    [["O que significa dizer que o mundo atual é multipolar?", "Que não há uma única potência dominante como na Guerra Fria ou na hegemonia americana dos anos 1990; o poder está distribuído entre vários centros, como EUA, China, União Europeia, Rússia e Índia."]],
  ),
  aula(
    "Hidrografia brasileira: bacias e usos da água",
    `## O Brasil, potência hídrica

O Brasil tem cerca de **12% da água doce superficial** do planeta. Mas ela é **mal distribuída**: a maior parte está na **Amazônia**, onde vive pouca gente, enquanto o Sudeste e o Nordeste têm menos água por habitante.

## Características dos rios brasileiros

- Predominam rios de **planalto**, com quedas e desníveis: grande **potencial hidrelétrico**.
- Quase todos são **perenes** (correm o ano todo), exceto muitos do **semiárido**, que são **intermitentes**.
- Regime **pluvial** (alimentados pela chuva).
- Foz em **estuário** ou em **delta** (o Parnaíba tem delta).

## Principais bacias

- **Amazônica:** a maior do mundo; rios de planície, ótimos para **navegação** (hidrovias); grande biodiversidade.
- **Tocantins-Araguaia:** hidrelétrica de **Tucuruí**; avanço do agronegócio.
- **São Francisco:** o "**rio da integração nacional**" ("Velho Chico"); nasce em Minas e atravessa o semiárido; usado para irrigação, hidrelétricas (**Sobradinho**, Paulo Afonso) e **transposição**.
- **Paraná (Platina):** maior aproveitamento hidrelétrico do país (**Itaipu**, binacional com o Paraguai); hidrovia Tietê-Paraná.
- **Paraguai:** rio de planície que forma o **Pantanal**.
- **Uruguai** e bacias do Atlântico.

## Aquíferos

Reservas de **água subterrânea**: **Aquífero Guarani** (um dos maiores do mundo, em quatro países) e **Alter do Chão** (Amazônia). Ameaçados por poluição e uso excessivo.

## Usos múltiplos e conflitos

A água é usada para **abastecimento humano**, **irrigação** (maior consumo), indústria, **geração de energia**, navegação e lazer. Isso gera **conflitos** entre usos (ex.: secas que obrigam a escolher entre gerar energia ou abastecer cidades).

## Problemas

- **Poluição** por esgoto não tratado (metade da população brasileira não tem esgoto tratado), agrotóxicos e indústrias.
- **Assoreamento:** acúmulo de sedimentos no leito do rio após o desmatamento das **matas ciliares**.
- **Crises hídricas** (São Paulo, 2014–2015).
- Desastres de **barragens de mineração**: **Mariana** (2015, rio Doce) e **Brumadinho** (2019).

## Gestão

**Lei das Águas (1997):** a água é bem **público** e de valor econômico; gestão por **bacia hidrográfica**, com **comitês** que incluem governo, usuários e sociedade.

## Resumindo

O Brasil tem muita água, mas mal distribuída. Rios de planalto favorecem hidrelétricas; a Bacia Amazônica favorece a navegação. Poluição, assoreamento e desastres de barragens são problemas; a Lei das Águas organiza a gestão por bacia.`,
    [
      "O Brasil tem muita água doce, mas mal distribuída.",
      "Rios de planalto: potencial hidrelétrico (Itaipu, Tucuruí).",
      "São Francisco: rio da integração nacional e transposição.",
      "Assoreamento vem da retirada das matas ciliares.",
    ],
    [
      ["Bacia hidrográfica", "Área drenada por um rio principal e seus afluentes."],
      ["Assoreamento", "Acúmulo de sedimentos no leito dos rios."],
      ["Mata ciliar", "Vegetação às margens dos rios, que os protege."],
    ],
    [
      ["A distribuição da água no Brasil é desigual porque:", ["não há rios no Norte", "a maior parte está na Amazônia, onde vive pouca gente", "o Sudeste tem a maior parte", "toda a água é subterrânea", "o país não tem água doce"], 1, "Disponibilidade x população."],
      ["O rio São Francisco é chamado de:", ["rio dos bandeirantes", "rio da integração nacional", "rio voador", "rio internacional", "rio intermitente"], 1, "Liga regiões do país."],
      ["O assoreamento dos rios é causado principalmente:", ["pelo excesso de matas ciliares", "pela retirada das matas ciliares e erosão", "pelas chuvas fracas", "pela pesca", "pela navegação"], 1, "Sedimentos chegam ao leito."],
      ["Itaipu está localizada na bacia do rio:", ["Amazonas", "São Francisco", "Paraná", "Parnaíba", "Tocantins"], 2, "Binacional com o Paraguai."],
      ["Segundo a Lei das Águas, a gestão deve ser feita:", ["por estado isoladamente", "por bacia hidrográfica, com comitês participativos", "por empresas privadas", "só pelo Exército", "por cada morador"], 1, "Gestão descentralizada."],
    ],
    [["Explique o que é assoreamento e como ele pode ser evitado.", "Assoreamento é o acúmulo de sedimentos no leito do rio, que o deixa mais raso e causa enchentes; pode ser evitado preservando e recuperando as matas ciliares, que seguram o solo das margens."]],
  ),
  aula(
    "Agronegócio, agricultura familiar e questões no campo",
    `## Dois modelos no campo brasileiro

### Agronegócio

- Grandes propriedades (**latifúndios**), **monocultura** (soja, milho, cana, algodão), alta **mecanização** e tecnologia, voltado à **exportação** (**commodities**).
- Gera divisas e coloca o Brasil entre os maiores exportadores de alimentos do mundo.
- Críticas: **concentração de terras**, uso intenso de **agrotóxicos**, **desmatamento** (Cerrado e Amazônia), pouca geração de empregos, conflitos com povos tradicionais.

### Agricultura familiar

- Pequenas propriedades trabalhadas pela família; **policultura**.
- Produz grande parte dos **alimentos** que chegam à mesa dos brasileiros (feijão, mandioca, leite, hortaliças).
- Gera muitos empregos no campo.
- Apoio de políticas como o **PRONAF** (crédito) e o **PNAE** (compra de alimentos para a merenda escolar).

## Estrutura fundiária

- O Brasil tem uma das maiores **concentrações de terra** do mundo: poucos estabelecimentos grandes ocupam a maior parte da área.
- Origem histórica: **sesmarias**, **Lei de Terras (1850)**.
- Movimentos sociais lutam por **reforma agrária**, como o **MST** (Movimento dos Trabalhadores Rurais Sem Terra).
- Conflitos no campo: violência contra trabalhadores, indígenas e posseiros; **grilagem**.
- **Trabalho análogo à escravidão** ainda é encontrado em fazendas e carvoarias.

## Modernização do campo

- **Revolução Verde** (a partir dos anos 1960): sementes selecionadas, fertilizantes, agrotóxicos e máquinas. Aumentou a produtividade, mas trouxe dependência de insumos, impactos ambientais e **êxodo rural**.
- **Embrapa:** pesquisa que adaptou a soja ao Cerrado.
- **Fronteira agrícola:** avanço sobre o Centro-Oeste, o MATOPIBA e a Amazônia.

## Alternativas sustentáveis

- **Agroecologia** e produção **orgânica**.
- **Sistemas agroflorestais** (plantio junto com árvores).
- **Integração lavoura-pecuária-floresta**.
- Plantio direto, rotação de culturas.

## Segurança alimentar

Mesmo grande produtor, o Brasil voltou a ter pessoas em situação de **fome**. Produzir muito não garante acesso: a questão envolve **renda e distribuição**.

## Resumindo

O agronegócio exporta commodities com alta tecnologia, mas concentra terra e causa impactos; a agricultura familiar produz grande parte dos alimentos. A concentração fundiária gera conflitos e a luta por reforma agrária.`,
    [
      "Agronegócio: latifúndio, monocultura e exportação de commodities.",
      "Agricultura familiar produz grande parte dos alimentos consumidos.",
      "Alta concentração de terras e luta por reforma agrária (MST).",
      "Revolução Verde: mais produtividade, mais insumos e impactos.",
    ],
    [
      ["Commodity", "Produto primário padronizado negociado no mercado mundial, como soja e minério."],
      ["Estrutura fundiária", "Forma como a terra está distribuída entre proprietários."],
      ["Agroecologia", "Agricultura que segue princípios ecológicos, sem agrotóxicos."],
    ],
    [
      ["A agricultura familiar se destaca por:", ["exportar só soja", "produzir grande parte dos alimentos consumidos no país", "usar grandes latifúndios", "não gerar empregos", "ser totalmente mecanizada"], 1, "Feijão, mandioca, leite, hortaliças."],
      ["A Revolução Verde caracterizou-se pelo uso de:", ["técnicas tradicionais indígenas", "sementes selecionadas, fertilizantes, agrotóxicos e máquinas", "agricultura orgânica", "trabalho escravo legalizado", "plantio só de árvores"], 1, "Modernização do campo."],
      ["O MST luta principalmente por:", ["mais agrotóxicos", "reforma agrária", "fim das cidades", "privatização das terras públicas", "aumento dos latifúndios"], 1, "Distribuição de terras."],
      ["Uma crítica ao agronegócio é:", ["produzir pouco", "concentrar terras e causar desmatamento", "não exportar", "usar só policultura", "não ter tecnologia"], 1, "Impactos sociais e ambientais."],
      ["A Embrapa foi importante para:", ["proibir a soja", "adaptar culturas como a soja ao Cerrado", "acabar com a pesquisa", "importar alimentos", "fechar fazendas"], 1, "Pesquisa agropecuária."],
    ],
    [["Compare o agronegócio e a agricultura familiar no Brasil.", "O agronegócio usa grandes propriedades, monocultura e alta tecnologia para exportar commodities, mas concentra terras e gera impactos ambientais; a agricultura familiar usa pequenas propriedades e policultura, gera mais empregos e produz grande parte dos alimentos consumidos no país."]],
  ),
  aula(
    "Comércio internacional e a divisão internacional do trabalho",
    `## Quem produz o quê no mundo

A **Divisão Internacional do Trabalho (DIT)** é a especialização dos países na produção e no comércio mundial.

## DIT clássica (colonial)

- **Colônias e países periféricos:** exportavam **matérias-primas** e produtos agrícolas baratos.
- **Metrópoles e países industrializados:** exportavam **produtos industrializados**, de maior valor.
- Resultado: **deterioração dos termos de troca** — os produtos primários perdem valor em relação aos industrializados, e os países pobres precisam exportar cada vez mais para comprar o mesmo.

## Nova DIT

- Após a Segunda Guerra, **multinacionais** instalaram fábricas em países como **Brasil**, México, Coreia do Sul e depois **China**, atraídas por mão de obra barata, mercado e incentivos.
- Alguns países se industrializaram (**industrialização tardia**), mas a **tecnologia** e as decisões continuaram nos países ricos.
- Hoje, os países centrais concentram **pesquisa, marcas, finanças e alta tecnologia**; a produção industrial se espalha pelas chamadas **cadeias globais de valor**.

## O Brasil no comércio mundial

- Grande exportador de **commodities**: soja, minério de ferro, petróleo, carne, café, açúcar, celulose.
- Importa produtos de maior tecnologia (eletrônicos, máquinas, remédios, fertilizantes).
- Debate sobre **reprimarização** da pauta exportadora e **desindustrialização**.
- Principais parceiros: **China**, **EUA**, União Europeia e Argentina.

## Conceitos importantes

- **Balança comercial:** exportações − importações (superávit ou déficit).
- **Protecionismo:** barreiras (tarifas, cotas) para proteger a produção nacional.
- **Livre-comércio:** redução de barreiras.
- **OMC:** regula o comércio e resolve disputas.
- **Subsídios agrícolas** de países ricos (EUA e Europa) prejudicam exportadores como o Brasil.

## Globalização desigual

O comércio cresceu muito, mas os ganhos foram **desiguais** entre e dentro dos países. Os **países centrais** controlam os fluxos de capital e tecnologia; os **periféricos** dependem da exportação de produtos primários.

## Resumindo

Na DIT clássica, países pobres exportavam matérias-primas e ricos, industrializados. Na nova DIT, a indústria se espalhou, mas a tecnologia ficou nos países centrais. O Brasil exporta principalmente commodities.`,
    [
      "DIT clássica: periferia exporta matérias-primas; centro, industrializados.",
      "Deterioração dos termos de troca prejudica exportadores de primários.",
      "Nova DIT: multinacionais levam fábricas à periferia.",
      "O Brasil exporta principalmente commodities (soja, minério, petróleo).",
    ],
    [
      ["Divisão Internacional do Trabalho", "Especialização dos países na produção e no comércio mundial."],
      ["Termos de troca", "Relação entre os preços das exportações e das importações de um país."],
      ["Reprimarização", "Aumento do peso dos produtos primários nas exportações."],
    ],
    [
      ["Na DIT clássica, os países periféricos exportavam principalmente:", ["produtos de alta tecnologia", "matérias-primas e produtos agrícolas", "serviços financeiros", "patentes", "máquinas"], 1, "Base da dependência."],
      ["A \"deterioração dos termos de troca\" significa que:", ["os primários valem cada vez mais", "os primários perdem valor em relação aos industrializados", "o comércio acabou", "todos ganham igualmente", "o câmbio é fixo"], 1, "Desvantagem dos periféricos."],
      ["Os principais produtos exportados pelo Brasil são:", ["aviões e chips", "soja, minério de ferro e petróleo", "carros elétricos", "softwares", "remédios"], 1, "Commodities."],
      ["Uma medida protecionista é:", ["reduzir todas as tarifas", "aumentar tarifas sobre produtos importados", "acabar com as fronteiras", "assinar livre-comércio", "eliminar subsídios"], 1, "Barreira à importação."],
      ["Na nova DIT, os países centrais concentram:", ["apenas agricultura", "tecnologia, pesquisa, marcas e finanças", "mão de obra barata", "a extração de minérios", "a produção de matérias-primas apenas"], 1, "Parte de maior valor."],
    ],
    [["O que é a deterioração dos termos de troca e como ela afeta países como o Brasil?", "É a perda de valor dos produtos primários em relação aos industrializados; países que exportam commodities precisam vender cada vez mais para importar a mesma quantidade de produtos tecnológicos, o que reforça a dependência."]],
  ),
  aula(
    "Mineração no Brasil e seus impactos",
    `## Um país rico em minérios

O Brasil tem um subsolo muito rico, graças à sua **estrutura geológica**, com **escudos cristalinos** antigos (onde há minerais metálicos) e **bacias sedimentares** (onde há petróleo, gás e carvão).

## Principais minérios e regiões

- **Ferro:** o Brasil está entre os maiores produtores do mundo.
  - **Quadrilátero Ferrífero (MG)**: mineração histórica.
  - **Serra dos Carajás (PA)**: uma das maiores reservas do planeta (Projeto Grande Carajás), com ferrovia até o porto de São Luís (MA).
- **Bauxita** (alumínio): Pará (Trombetas).
- **Manganês:** Amapá (Serra do Navio, já esgotada) e Pará.
- **Ouro:** Minas Gerais (histórico) e Amazônia (garimpo, em grande parte ilegal).
- **Nióbio:** o Brasil tem a maior parte das reservas mundiais (MG e GO).
- **Petróleo e gás:** bacias sedimentares e **pré-sal**.

## Mineração e economia

- O minério de ferro é um dos principais produtos de **exportação**, sobretudo para a **China**.
- Gera empregos e impostos (**CFEM**, os royalties da mineração), mas é muito dependente dos **preços internacionais**.
- Crítica: exportamos minério bruto (baixo valor) e importamos produtos de alto valor feitos com ele.

## Impactos socioambientais

- **Desmatamento** e destruição de paisagens (cavas enormes).
- **Contaminação** de rios e solos; no garimpo, **mercúrio**, que envenena peixes e pessoas (crise **Yanomami**).
- Conflitos com **povos indígenas**, quilombolas e ribeirinhos.
- **Barragens de rejeitos:**
  - **Mariana (2015):** rompimento da barragem de Fundão (Samarco/Vale/BHP) destruiu o distrito de Bento Rodrigues, matou 19 pessoas e levou lama ao **rio Doce** até o oceano — o maior desastre ambiental do país.
  - **Brumadinho (2019):** rompimento de barragem da Vale matou **272 pessoas**.
  - Barragens do tipo **"a montante"** foram proibidas depois disso.
- Cidades mineradoras que sofrem quando a mina se esgota.

## Caminhos

Fiscalização rigorosa, novas técnicas de disposição de rejeitos (a seco), recuperação de áreas degradadas, combate ao garimpo ilegal, agregar valor (siderurgia) e consulta prévia às comunidades afetadas.

## Resumindo

O Brasil é grande produtor de ferro (Carajás e Quadrilátero Ferrífero), nióbio e bauxita. A mineração gera exportações, mas causa impactos graves, como os desastres de Mariana e Brumadinho e a contaminação por mercúrio no garimpo.`,
    [
      "Ferro: Quadrilátero Ferrífero (MG) e Carajás (PA).",
      "O Brasil tem a maior parte das reservas de nióbio do mundo.",
      "Mariana (2015) e Brumadinho (2019): desastres de barragens.",
      "Garimpo ilegal contamina rios com mercúrio.",
    ],
    [
      ["Rejeito", "Resíduo que sobra do beneficiamento do minério."],
      ["Royalties", "Compensação paga pela exploração de recursos naturais (CFEM)."],
      ["Escudo cristalino", "Estrutura geológica antiga rica em minerais metálicos."],
    ],
    [
      ["A Serra dos Carajás, no Pará, é famosa por suas reservas de:", ["petróleo", "ferro", "carvão", "sal", "urânio"], 1, "Uma das maiores do mundo."],
      ["O rompimento da barragem de Fundão, em Mariana (2015), atingiu principalmente o rio:", ["São Francisco", "Doce", "Amazonas", "Tietê", "Paraná"], 1, "Lama até o oceano."],
      ["Um impacto típico do garimpo ilegal na Amazônia é:", ["chuva ácida", "contaminação por mercúrio", "inversão térmica", "salinização marinha", "neve"], 1, "Mercúrio separa o ouro."],
      ["Minerais metálicos como o ferro estão associados a:", ["bacias sedimentares", "escudos cristalinos", "planícies aluviais", "dunas", "mangues"], 1, "Estruturas antigas."],
      ["Uma crítica à mineração brasileira é:", ["exportar produtos de alto valor", "exportar minério bruto e importar produtos de alto valor", "não ter reservas", "não exportar para a China", "ter poucas barragens"], 1, "Pouco valor agregado."],
    ],
    [["Quais foram as consequências do desastre de Mariana em 2015?", "O rompimento da barragem de rejeitos destruiu o distrito de Bento Rodrigues, matou pessoas, contaminou o rio Doce até o oceano, prejudicou o abastecimento de água, a pesca e comunidades indígenas e ribeirinhas."]],
  ),
  aula(
    "Geologia: placas tectônicas, terremotos e vulcões",
    `## A Terra por dentro

- **Crosta:** camada mais externa e fina (continental e oceânica).
- **Manto:** rocha quente e parcialmente fundida (**magma**), com **correntes de convecção**.
- **Núcleo:** externo (líquido) e interno (sólido), de ferro e níquel.

## Tectônica de placas

A crosta e a parte superior do manto (**litosfera**) são divididas em **placas tectônicas**, que se movem lentamente sobre o manto, impulsionadas pelas correntes de convecção.

- **Deriva continental (Alfred Wegener):** os continentes já estiveram unidos num supercontinente, a **Pangeia**. Evidências: encaixe entre América do Sul e África, fósseis iguais em continentes distantes.

## Limites entre placas

- **Divergentes:** placas se **afastam**; forma-se nova crosta (dorsal mesoatlântica). O Atlântico está se alargando.
- **Convergentes:** placas se **chocam**.
  - Oceânica sob continental (**subducção**): vulcões e terremotos (Andes).
  - Continental x continental: dobramentos que formam grandes **cordilheiras** (Himalaia).
- **Transformantes:** placas **deslizam** lado a lado (Falha de San Andreas, Califórnia).

## Terremotos e tsunamis

- Liberação de energia acumulada pelo movimento das placas.
- **Epicentro** (na superfície) e **hipocentro** (no interior).
- Medidos pela **escala Richter** (magnitude).
- **Tsunamis:** ondas gigantes causadas por terremotos no fundo do mar (Japão 2011, Oceano Índico 2004).
- Áreas de risco: **Círculo de Fogo do Pacífico** (Japão, Chile, Indonésia).

## Vulcões

Aberturas por onde o magma chega à superfície (lava), comuns nos limites de placas e em pontos quentes (Havaí).

## E o Brasil?

- O Brasil está no **centro da Placa Sul-Americana**, longe das bordas, por isso tem **poucos terremotos fortes** e **não tem vulcões ativos**.
- Há tremores **leves**, causados por falhas geológicas internas.
- Nosso relevo é **antigo e desgastado** pela erosão (sem grandes cordilheiras recentes): predominam planaltos, planícies e **depressões**.

## Agentes do relevo

- **Internos (endógenos):** tectonismo, vulcanismo, abalos sísmicos — **formam** o relevo.
- **Externos (exógenos):** chuva, vento, rios, temperatura, seres vivos — **desgastam** e modelam o relevo (intemperismo e erosão).

## Resumindo

A litosfera é dividida em placas que se afastam, se chocam ou deslizam, causando terremotos, vulcões e cordilheiras. O Brasil fica no centro da placa, por isso tem poucos tremores e relevo antigo e desgastado.`,
    [
      "A litosfera é dividida em placas tectônicas que se movem.",
      "Wegener: deriva continental e a Pangeia.",
      "Convergentes formam cordilheiras e vulcões; divergentes, nova crosta.",
      "O Brasil fica no centro da placa: poucos tremores, sem vulcões ativos.",
    ],
    [
      ["Placa tectônica", "Grande bloco da litosfera que se move sobre o manto."],
      ["Subducção", "Mergulho de uma placa sob outra em limites convergentes."],
      ["Epicentro", "Ponto da superfície acima do local onde o terremoto começa."],
    ],
    [
      ["A teoria da deriva continental foi proposta por:", ["Darwin", "Alfred Wegener", "Newton", "Galileu", "Richter"], 1, "Pangeia."],
      ["O Brasil tem poucos terremotos fortes porque:", ["não tem placas", "está no centro da Placa Sul-Americana, longe das bordas", "tem muitos vulcões", "fica no Círculo de Fogo", "está numa zona de subducção"], 1, "Estabilidade tectônica."],
      ["A Cordilheira dos Andes resulta de:", ["placas divergentes", "convergência com subducção da placa oceânica", "erosão pelo vento", "deposição de rios", "falha transformante"], 1, "Placa de Nazca sob a Sul-Americana."],
      ["Os tsunamis são causados principalmente por:", ["ventos fortes", "terremotos no fundo do mar", "marés de lua cheia", "chuvas", "derretimento de geleiras"], 1, "Abalos submarinos."],
      ["Chuva, vento e rios são agentes:", ["internos do relevo", "externos do relevo", "tectônicos", "vulcânicos", "magnéticos"], 1, "Desgastam e modelam."],
    ],
    [["Por que o Brasil não tem vulcões ativos nem grandes terremotos?", "Porque está localizado no centro da Placa Sul-Americana, longe das bordas onde as placas se chocam ou se afastam, que são as áreas com vulcões e terremotos fortes."]],
  ),
  aula(
    "Regionalização do Brasil e desigualdades regionais",
    `## Por que dividir o Brasil em regiões

Regionalizar é dividir um território em áreas com características **semelhantes**, para facilitar o estudo e o **planejamento**. A divisão depende do **critério** escolhido.

## Divisão do IBGE (1969/1988)

Cinco regiões, que respeitam os **limites dos estados**:

- **Norte:** AM, PA, AC, RO, RR, AP, TO — maior área, menor densidade; Amazônia.
- **Nordeste:** 9 estados; litoral, zona da mata, agreste, sertão e meio-norte.
- **Centro-Oeste:** MT, MS, GO e DF — agronegócio, Brasília.
- **Sudeste:** SP, RJ, MG, ES — mais populosa e mais industrializada.
- **Sul:** PR, SC, RS — clima subtropical, forte imigração europeia.

Útil para estatísticas e políticas públicas, mas **não considera** que dentro de um estado há realidades muito diferentes.

## Complexos regionais (Pedro Geiger, 1967)

Três regiões baseadas no **processo histórico e econômico**, **sem respeitar** os limites estaduais:

- **Amazônia:** baixa densidade, floresta, extrativismo, fronteira agrícola e mineral.
- **Nordeste:** ocupação mais antiga, problemas sociais herdados da economia açucareira e do latifúndio.
- **Centro-Sul:** área mais industrializada, urbanizada e rica.

Ex.: o norte de Minas Gerais fica no complexo do Nordeste (semiárido), e o sul do Tocantins, no Centro-Sul.

## Os "quatro Brasis" (Milton Santos)

Divisão baseada no **meio técnico-científico-informacional** (presença de tecnologia, informação e capital):

- **Região Concentrada** (Sudeste e Sul): maior densidade técnica.
- **Centro-Oeste**, **Nordeste** e **Amazônia**, com graus diferentes de modernização.

## Desigualdades regionais

- Diferenças em **renda**, **IDH**, acesso a saneamento, saúde e educação.
- Origem histórica: concentração da industrialização no **Sudeste**.
- Políticas de desenvolvimento regional: **SUDENE** (Nordeste, idealizada por Celso Furtado), **SUDAM** (Amazônia), **Zona Franca de Manaus** (incentivos fiscais para indústrias).
- Hoje há **desconcentração** da indústria e crescimento de cidades médias no interior e no Nordeste.

## Resumindo

O IBGE divide o Brasil em cinco regiões respeitando estados. Os complexos regionais (Amazônia, Nordeste, Centro-Sul) seguem critérios históricos e econômicos. Milton Santos propôs os quatro Brasis pela técnica e informação. SUDENE e Zona Franca buscaram reduzir desigualdades.`,
    [
      "IBGE: cinco regiões, respeitando os limites dos estados.",
      "Complexos regionais: Amazônia, Nordeste e Centro-Sul.",
      "Milton Santos: quatro Brasis e meio técnico-científico-informacional.",
      "SUDENE, SUDAM e Zona Franca: políticas de desenvolvimento regional.",
    ],
    [
      ["Regionalização", "Divisão de um território em regiões com características semelhantes."],
      ["Complexo regional", "Região definida por critérios históricos e econômicos, sem seguir limites estaduais."],
      ["Zona Franca de Manaus", "Área com incentivos fiscais para atrair indústrias à Amazônia."],
    ],
    [
      ["A divisão regional do IBGE caracteriza-se por:", ["ignorar os limites dos estados", "respeitar os limites dos estados", "ter só três regiões", "usar apenas o clima", "ter sido criada por Milton Santos"], 1, "Cinco regiões."],
      ["Os complexos regionais são:", ["Norte, Sul e Leste", "Amazônia, Nordeste e Centro-Sul", "Sudeste, Sul e Centro-Oeste", "Litoral, Sertão e Agreste", "Planalto, Planície e Depressão"], 1, "Proposta de Pedro Geiger."],
      ["Nos complexos regionais, o norte de Minas Gerais pertence:", ["à Amazônia", "ao Nordeste", "ao Centro-Sul inteiro", "a nenhum", "ao Sul"], 1, "Características do semiárido."],
      ["A SUDENE foi criada para:", ["desenvolver a Amazônia", "promover o desenvolvimento do Nordeste", "industrializar o Sul", "construir Brasília", "explorar o pré-sal"], 1, "Ideia de Celso Furtado."],
      ["A Zona Franca de Manaus atrai indústrias por meio de:", ["mão de obra escravizada", "incentivos fiscais", "proibição de importações", "fim dos impostos em todo o país", "exploração de petróleo"], 1, "Isenções."],
    ],
    [["Qual a diferença entre a divisão regional do IBGE e a dos complexos regionais?", "A do IBGE divide o Brasil em cinco regiões respeitando os limites dos estados; a dos complexos regionais divide em três (Amazônia, Nordeste e Centro-Sul) com base no processo histórico e econômico, sem seguir os limites estaduais."]],
  ),
];
