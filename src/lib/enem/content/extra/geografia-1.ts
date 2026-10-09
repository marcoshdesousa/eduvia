import { aula } from "./build";

/** Geografia, lote 1: natureza, população e meio ambiente nos temas mais cobrados do ENEM. */
export const GEOGRAFIA_1 = [
  aula(
    "Coordenadas geográficas: latitude e longitude",
    `## Um endereço para cada lugar da Terra

Para localizar qualquer ponto do planeta usamos uma rede de linhas imaginárias: os **paralelos** e os **meridianos**. O cruzamento deles forma as **coordenadas geográficas**.

## Latitude

- É a distância, em graus, de um ponto até a **Linha do Equador** (0°).
- Vai de **0° a 90° Norte** ou **0° a 90° Sul**.
- É medida nos **paralelos** (linhas horizontais).
- Paralelos importantes: Equador, **Trópico de Câncer** (23°27' N), **Trópico de Capricórnio** (23°27' S), Círculos Polares Ártico e Antártico.
- A latitude influencia muito o **clima**: quanto mais perto do Equador, mais calor ao longo do ano.

## Longitude

- É a distância, em graus, de um ponto até o **Meridiano de Greenwich** (0°), que passa por Londres.
- Vai de **0° a 180° Leste** ou **0° a 180° Oeste**.
- É medida nos **meridianos** (linhas verticais, de polo a polo).
- A longitude define os **fusos horários**: a cada 15° há uma hora de diferença, porque a Terra gira 360° em 24 horas.

## Hemisférios

- O Equador divide a Terra em **Norte** e **Sul**.
- Greenwich divide a Terra em **Leste (Oriental)** e **Oeste (Ocidental)**.
- O Brasil fica quase todo no **Hemisfério Sul** e todo no **Hemisfério Ocidental**. É cortado pelo Equador (no Norte) e pelo Trópico de Capricórnio (em São Paulo e no Paraná).

## Como o ENEM cobra

- Identificar um ponto num mapa com grade de coordenadas.
- Relacionar latitude com clima (por que o Sul do Brasil é mais frio).
- Calcular diferença de horário a partir da longitude.
- Entender o GPS, que usa satélites para dar latitude e longitude exatas.

## Resumindo

Latitude mede a distância até o Equador (N/S); longitude mede a distância até Greenwich (L/O). Latitude ajuda a explicar o clima; longitude explica os fusos horários.`,
    [
      "Latitude: distância até o Equador, de 0° a 90° N ou S.",
      "Longitude: distância até Greenwich, de 0° a 180° L ou O.",
      "A cada 15° de longitude, uma hora de diferença.",
      "O Brasil está quase todo no Hemisfério Sul e todo no Ocidental.",
    ],
    [
      ["Paralelo", "Linha imaginária horizontal; marca a latitude."],
      ["Meridiano", "Linha imaginária de polo a polo; marca a longitude."],
      ["GPS", "Sistema de satélites que informa as coordenadas de um ponto."],
    ],
    [
      ["A latitude de um ponto é medida em relação:", ["ao Meridiano de Greenwich", "à Linha do Equador", "ao Trópico de Câncer", "ao Polo Norte", "ao nível do mar"], 1, "Latitude é a distância até o Equador."],
      ["Quantos graus de longitude correspondem a uma hora de diferença?", ["10°", "12°", "15°", "24°", "30°"], 2, "360° ÷ 24 h = 15° por hora."],
      ["O Brasil está localizado:", ["todo no Hemisfério Norte", "todo no Hemisfério Oriental", "todo no Hemisfério Ocidental", "todo no Hemisfério Sul", "metade em cada hemisfério oriental e ocidental"], 2, "Todo o Brasil está a oeste de Greenwich."],
      ["Qual paralelo atravessa o estado de São Paulo?", ["Equador", "Trópico de Câncer", "Trópico de Capricórnio", "Círculo Polar Antártico", "Meridiano de Greenwich"], 2, "O Trópico de Capricórnio passa por SP e PR."],
      ["Em geral, quanto maior a latitude, o clima tende a ser:", ["mais quente", "mais frio", "mais úmido sempre", "igual em todo lugar", "mais seco sempre"], 1, "Longe do Equador os raios solares chegam mais inclinados."],
    ],
    [["Explique a diferença entre latitude e longitude e diga o que cada uma ajuda a entender.", "A latitude é a distância até o Equador (Norte ou Sul) e ajuda a entender o clima; a longitude é a distância até Greenwich (Leste ou Oeste) e define os fusos horários."]],
  ),
  aula(
    "Projeções cartográficas e sensoriamento remoto",
    `## Por que todo mapa distorce

A Terra é quase uma esfera, e o mapa é plano. Ao "achatar" a superfície, sempre há **distorção**: de formas, de áreas ou de distâncias. A técnica de transformar a esfera em plano chama-se **projeção cartográfica**.

## Principais projeções

- **Mercator (cilíndrica):** preserva as **formas** e os ângulos, por isso foi muito usada na navegação. Mas **aumenta as áreas** perto dos polos: a Groenlândia parece do tamanho da África, que é 14 vezes maior. Coloca a Europa no centro e no alto, o que é lido como **eurocentrismo**.
- **Peters (cilíndrica equivalente):** preserva as **áreas** (tamanhos proporcionais), mas **distorce as formas**, deixando os continentes do Sul "esticados". Valoriza visualmente os países pobres do Sul.
- **Azimutal (plana):** feita a partir de um ponto, ótima para regiões polares e rotas aéreas.
- **Cônica:** boa para latitudes médias.

Não existe mapa neutro: a escolha da projeção, do centro e do que aparece revela uma **visão de mundo**.

## Sensoriamento remoto

É obter informações da superfície **sem contato direto**, por meio de **satélites**, aviões e drones.

- Usos: monitorar **desmatamento** (sistemas como o DETER e o PRODES do INPE), queimadas, safras, crescimento urbano, previsão do tempo.
- O **GPS** e os aplicativos de mapas usam satélites.
- O **SIG (Sistema de Informação Geográfica)** cruza camadas de dados (relevo, rios, população) num mapa digital.

## Como o ENEM cobra

- Comparar Mercator e Peters e as intenções de cada mapa.
- Reconhecer o uso de satélites no controle ambiental.
- Entender anamorfoses (mapas em que o tamanho do país representa um dado, como população).

## Resumindo

Todo mapa distorce algo. Mercator mantém formas e aumenta áreas perto dos polos; Peters mantém áreas e distorce formas. Satélites permitem monitorar o território a distância.`,
    [
      "Toda projeção distorce formas, áreas ou distâncias.",
      "Mercator preserva formas e exagera áreas perto dos polos.",
      "Peters preserva áreas e distorce formas.",
      "Satélites monitoram desmatamento, queimadas e cidades.",
    ],
    [
      ["Projeção cartográfica", "Técnica de representar a superfície esférica da Terra num plano."],
      ["Anamorfose", "Mapa em que o tamanho das áreas representa um dado, como população ou PIB."],
      ["Sensoriamento remoto", "Obtenção de dados da superfície a distância, por satélites e aviões."],
    ],
    [
      ["Na projeção de Mercator, a Groenlândia parece muito grande porque:", ["ela é maior que a África", "a projeção aumenta as áreas próximas dos polos", "a projeção preserva as áreas", "foi feita a partir do Polo Sul", "usa dados de satélite"], 1, "Mercator exagera áreas em altas latitudes."],
      ["A projeção de Peters tem como característica:", ["preservar as formas", "preservar as áreas", "não ter nenhuma distorção", "ser azimutal", "centralizar o Polo Norte"], 1, "Peters é equivalente: mantém as proporções de área."],
      ["O monitoramento do desmatamento da Amazônia é feito principalmente por:", ["censos", "sensoriamento remoto por satélites", "bússolas", "mapas de Mercator impressos", "entrevistas"], 1, "Sistemas do INPE usam imagens de satélite."],
      ["Dizer que \"nenhum mapa é neutro\" significa que:", ["mapas sempre erram as distâncias", "a escolha de projeção e de centro revela uma visão de mundo", "todo mapa é falso", "só existem mapas políticos", "mapas não servem para estudar"], 1, "Mapas carregam escolhas e intenções."],
      ["Um mapa em que o tamanho de cada país é proporcional à sua população é chamado de:", ["planta", "anamorfose", "carta topográfica", "croqui", "mapa de Mercator"], 1, "Anamorfose deforma as áreas conforme um dado."],
    ],
    [["Compare as projeções de Mercator e de Peters.", "Mercator preserva as formas e os ângulos, mas aumenta as áreas perto dos polos e valoriza a Europa; Peters preserva as áreas, mostrando o tamanho real dos países do Sul, mas distorce as formas."]],
  ),
  aula(
    "Fenômenos climáticos: El Niño, ilha de calor e inversão térmica",
    `## Tempo e clima

**Tempo** é o estado da atmosfera num momento (hoje está chovendo). **Clima** é o padrão do tempo ao longo de muitos anos (o Nordeste semiárido tem chuvas irregulares).

## El Niño e La Niña

- **El Niño:** aquecimento anormal das águas do **Oceano Pacífico** perto do Peru. No Brasil, costuma causar **seca no Norte e no Nordeste** e **chuvas fortes no Sul**.
- **La Niña:** resfriamento dessas águas; efeitos geralmente opostos (mais chuva no Norte e Nordeste, seca no Sul).
- Mostram que o clima é um **sistema global**: o oceano de um lado do planeta afeta a agricultura do outro.

## Ilha de calor

- Nas grandes cidades, a temperatura do centro é mais alta que a da periferia e do campo.
- Causas: **asfalto e concreto** absorvem calor, **pouca vegetação**, prédios que bloqueiam o vento, calor de carros e indústrias.
- Soluções: arborização, parques, telhados verdes, materiais claros.

## Inversão térmica

- Normalmente o ar perto do chão é mais quente e sobe, levando a poluição.
- Em noites frias de **inverno**, o solo esfria rápido e uma camada de ar frio fica **presa embaixo** de uma camada mais quente.
- O ar não circula e a **poluição fica concentrada** perto do solo, piorando doenças respiratórias.
- É comum em São Paulo no inverno.

## Chuva ácida

Gases das indústrias e carros (óxidos de enxofre e nitrogênio) reagem com a água da atmosfera e formam ácidos, que corroem monumentos e prejudicam florestas e rios.

## Resumindo

El Niño aquece o Pacífico e muda as chuvas no Brasil. Ilha de calor é a cidade mais quente que o entorno. Inversão térmica prende a poluição perto do solo no inverno.`,
    [
      "Tempo é o momento; clima é o padrão de muitos anos.",
      "El Niño: Pacífico quente, seca no Norte/Nordeste e chuva no Sul.",
      "Ilha de calor: cidades mais quentes por asfalto e falta de verde.",
      "Inversão térmica: ar frio preso embaixo concentra a poluição no inverno.",
    ],
    [
      ["El Niño", "Aquecimento anormal das águas do Pacífico que altera o clima mundial."],
      ["Ilha de calor", "Área urbana com temperatura maior que a das áreas vizinhas."],
      ["Inversão térmica", "Camada de ar frio presa sob ar quente, que impede a dispersão da poluição."],
    ],
    [
      ["O El Niño costuma provocar no Brasil:", ["chuvas fortes no Nordeste", "seca no Nordeste e chuvas no Sul", "neve no Norte", "fim das estações", "resfriamento do Atlântico"], 1, "Efeito típico: seca no N/NE e chuva no Sul."],
      ["Uma medida que reduz a ilha de calor é:", ["asfaltar mais ruas", "aumentar a arborização", "construir prédios mais altos", "cortar parques", "usar telhados escuros"], 1, "Vegetação reduz a temperatura."],
      ["A inversão térmica é mais comum:", ["no verão, ao meio-dia", "no inverno, em noites e manhãs frias", "só em florestas", "só no litoral", "em dias de muito vento"], 1, "O solo esfria rápido nas noites de inverno."],
      ["O principal problema da inversão térmica nas cidades é:", ["aumentar as chuvas", "concentrar poluentes perto do solo", "derreter geleiras", "provocar terremotos", "elevar o nível do mar"], 1, "Sem circulação, a poluição não se dispersa."],
      ["\"Amanhã vai chover em Recife\" é uma informação sobre:", ["clima", "tempo", "relevo", "bioma", "latitude"], 1, "Previsão de um momento é tempo."],
    ],
    [["Explique o que é a inversão térmica e por que ela piora a saúde nas cidades.", "É quando uma camada de ar frio fica presa embaixo de uma camada mais quente, geralmente no inverno; o ar não sobe e a poluição fica concentrada perto do solo, aumentando doenças respiratórias."]],
  ),
  aula(
    "Amazônia: floresta, rios e desmatamento",
    `## O maior bioma do Brasil

A **Amazônia** ocupa cerca de **49% do território** brasileiro e se estende por outros oito países. É a maior floresta tropical do mundo e tem enorme **biodiversidade**.

## Características

- **Clima equatorial:** quente e úmido o ano todo, com muita chuva.
- **Floresta densa e heterogênea**, com árvores altas, folhas largas e grande variedade de espécies.
- **Solo pobre:** os nutrientes estão na própria floresta (a matéria orgânica que cai e se decompõe rápido). Por isso, quando se desmata, o solo se esgota em poucos anos.
- **Bacia Amazônica:** a maior bacia hidrográfica do mundo, com rios usados para transporte e pesca.
- **Rios voadores:** a floresta libera vapor de água que é levado pelos ventos e gera chuvas no Centro-Oeste e no Sudeste. Desmatar a Amazônia afeta a chuva e a agricultura de outras regiões.

## Desmatamento

Principais causas:

- **Pecuária** extensiva (a maior causa), abrindo pastos.
- Avanço da **soja** e de outras lavouras.
- **Extração ilegal de madeira** e **garimpo** ilegal, que contamina rios com mercúrio.
- **Grilagem** de terras públicas e obras sem planejamento.

O desmatamento avançou pelo chamado **Arco do Desmatamento**, no sul e leste da floresta.

## Consequências

- Perda de biodiversidade e de conhecimentos tradicionais.
- Emissão de **gás carbônico**, agravando o aquecimento global.
- Redução das chuvas em outras regiões.
- Conflitos com **povos indígenas**, ribeirinhos e quilombolas.

## Caminhos

Fiscalização com satélites, demarcação de **terras indígenas** (que estão entre as áreas mais preservadas), **unidades de conservação**, manejo florestal e **bioeconomia** (produtos da floresta em pé, como açaí e castanha).

## Resumindo

A Amazônia tem clima equatorial, solo pobre e rios voadores. A pecuária é a maior causa do desmatamento, que afeta o clima do país e do planeta.`,
    [
      "A Amazônia ocupa cerca de metade do Brasil.",
      "O solo é pobre: os nutrientes estão na própria floresta.",
      "Rios voadores levam chuva para o Centro-Oeste e o Sudeste.",
      "A pecuária é a principal causa do desmatamento.",
    ],
    [
      ["Rios voadores", "Correntes de umidade que saem da Amazônia e geram chuva em outras regiões."],
      ["Arco do Desmatamento", "Faixa no sul e leste da Amazônia onde o desmatamento mais avança."],
      ["Bioeconomia", "Uso sustentável dos produtos da floresta em pé."],
    ],
    [
      ["O clima predominante na Amazônia é:", ["semiárido", "equatorial", "subtropical", "temperado", "tropical de altitude"], 1, "Quente e úmido o ano todo."],
      ["Por que o solo amazônico se esgota rápido após o desmatamento?", ["porque é arenoso e salino", "porque os nutrientes estão na floresta, não no solo", "porque há muitos terremotos", "porque chove pouco", "porque é coberto por gelo"], 1, "A fertilidade depende da reciclagem da matéria orgânica."],
      ["A principal causa do desmatamento na Amazônia é:", ["a urbanização", "a pecuária extensiva", "o turismo", "a pesca", "as hidrelétricas"], 1, "Abertura de pastos é a maior causa."],
      ["Os \"rios voadores\" mostram que o desmatamento da Amazônia pode:", ["aumentar as chuvas no Sul", "reduzir as chuvas no Centro-Oeste e Sudeste", "resfriar o planeta", "aumentar o nível dos rios", "não ter efeito fora da floresta"], 1, "A umidade da floresta alimenta chuvas em outras regiões."],
      ["Um problema ambiental causado pelo garimpo ilegal é:", ["a salinização do solo", "a contaminação dos rios por mercúrio", "a chuva ácida", "a inversão térmica", "a desertificação no Sul"], 1, "O mercúrio usado no garimpo contamina rios e peixes."],
    ],
    [["Cite duas consequências do desmatamento da Amazônia.", "Perda de biodiversidade, emissão de gás carbônico que agrava o aquecimento global, redução das chuvas em outras regiões e conflitos com povos indígenas e ribeirinhos."]],
  ),
  aula(
    "Cerrado, Caatinga e o semiárido",
    `## Cerrado: a "caixa d'água" do Brasil

- Ocupa o **Brasil central** (cerca de 24% do território).
- **Clima tropical** com duas estações bem marcadas: verão chuvoso e inverno seco.
- Vegetação de **savana**: árvores baixas, troncos tortos, casca grossa e raízes profundas que buscam água no subsolo.
- Abriga nascentes de grandes bacias (São Francisco, Tocantins-Araguaia, Paraná) e áreas de recarga de aquíferos, como o **Guarani**. Por isso é chamado de **berço das águas**.
- O fogo natural faz parte do ciclo, mas as queimadas humanas são frequentes e destrutivas.
- **Ameaça:** é o bioma que mais perdeu vegetação para o **agronegócio** (soja, milho, algodão e gado), sobretudo na região do **MATOPIBA** (Maranhão, Tocantins, Piauí e Bahia).

## Caatinga: só existe no Brasil

- Ocupa grande parte do **Nordeste**, no **semiárido**.
- **Clima semiárido:** chuvas **escassas e irregulares**, concentradas em poucos meses, e muita evaporação.
- Plantas **xerófilas**, adaptadas à seca: perdem as folhas na estiagem (caducifólias), têm espinhos e armazenam água (cactos como mandacaru e xique-xique).
- Rios **intermitentes**, que secam em parte do ano.

## O semiárido e a convivência com a seca

O problema do semiárido não é só a falta de chuva, mas a **concentração de terra e de água** (a "indústria da seca", em que obras beneficiavam poucos).

Soluções de **convivência com o semiárido**:

- **Cisternas** que guardam a água da chuva.
- Barragens subterrâneas, poços e dessalinizadores.
- Cultivo de plantas adaptadas e criação de caprinos.
- **Transposição do Rio São Francisco**, polêmica pelo custo e pelos impactos.

O desmatamento e o uso inadequado do solo podem levar à **desertificação**.

## Resumindo

O Cerrado é savana, berço das águas e o bioma mais ameaçado pelo agronegócio. A Caatinga é exclusiva do Brasil, semiárida, com plantas adaptadas à seca. Conviver com o semiárido exige guardar água e democratizar seu acesso.`,
    [
      "Cerrado: savana, duas estações e nascentes de grandes rios.",
      "O Cerrado perde vegetação para o agronegócio (MATOPIBA).",
      "Caatinga: exclusiva do Brasil, semiárida, plantas xerófilas.",
      "Convivência com o semiárido: cisternas e acesso justo à água.",
    ],
    [
      ["Xerófila", "Planta adaptada a ambientes secos."],
      ["Rio intermitente", "Rio que seca em parte do ano."],
      ["Desertificação", "Degradação do solo em áreas secas, que se tornam improdutivas."],
    ],
    [
      ["O Cerrado é chamado de \"berço das águas\" porque:", ["tem muitas praias", "abriga nascentes de grandes bacias hidrográficas", "chove o ano inteiro", "é coberto por mangues", "tem o maior rio do mundo"], 1, "Nascentes do São Francisco, Paraná e Tocantins."],
      ["Uma característica das plantas da Caatinga é:", ["folhas grandes e sempre verdes", "perder as folhas na seca e armazenar água", "viver submersas", "crescer só em solo congelado", "precisar de chuva todos os dias"], 1, "Adaptações à seca."],
      ["O bioma exclusivamente brasileiro é:", ["Amazônia", "Cerrado", "Caatinga", "Pampa", "Pantanal"], 2, "A Caatinga só existe no Brasil."],
      ["A região do MATOPIBA está associada a:", ["expansão do agronegócio no Cerrado", "turismo de praia", "mineração de ouro", "polo industrial automobilístico", "proteção total do bioma"], 0, "Fronteira agrícola da soja no Cerrado."],
      ["Uma tecnologia simples de convivência com o semiárido é:", ["a cisterna de captação da chuva", "a usina nuclear", "o metrô", "a irrigação por inundação", "o desmatamento"], 0, "Cisternas guardam a água da chuva para os meses secos."],
    ],
    [["Explique por que se fala em \"convivência com o semiárido\" em vez de \"combate à seca\".", "Porque a seca é natural no semiárido e não pode ser eliminada; o desafio é guardar e distribuir a água de forma justa, com cisternas, plantas adaptadas e acesso democrático à terra e à água."]],
  ),
  aula(
    "Mata Atlântica, Pantanal e Pampa",
    `## Mata Atlântica: a mais devastada

- Ocupava toda a faixa **litorânea**, do Nordeste ao Sul.
- Restam cerca de **12%** da vegetação original, em fragmentos.
- Foi devastada desde a colonização: **pau-brasil**, cana-de-açúcar, café, e depois as **cidades** e indústrias. Nela vivem cerca de **70% dos brasileiros**.
- Floresta tropical úmida, com enorme biodiversidade e muitas espécies **endêmicas** (que só existem ali), como o mico-leão-dourado.
- Protege nascentes que abastecem grandes cidades.

## Pantanal: a maior planície alagável

- Fica em **Mato Grosso** e **Mato Grosso do Sul**.
- É uma **planície** que **alaga na época das cheias** e seca no período de estiagem. Esse **ciclo de cheia e seca** organiza a vida do bioma.
- Grande concentração de fauna: aves, jacarés, onças, capivaras.
- Atividades: **pecuária** tradicional e turismo.
- Ameaças: **queimadas** (em 2020 queimou cerca de 30% do bioma), desmatamento no planalto ao redor e assoreamento dos rios.

## Pampa: os campos do Sul

- Fica no **Rio Grande do Sul** (também no Uruguai e na Argentina).
- Vegetação de **campos** (gramíneas), relevo plano ou de **coxilhas** (colinas suaves).
- Clima **subtropical**, com estações bem definidas e invernos frios.
- Atividade tradicional: **pecuária** de gado e ovelhas.
- Ameaças: monocultura de soja e de eucalipto e o processo de **arenização** (areais) no sudoeste gaúcho, agravado pelo mau uso do solo.

## Outros ecossistemas

- **Mangue:** no litoral, entre rio e mar; berçário de espécies marinhas.
- **Mata de Araucárias:** no Sul, com o pinheiro-do-paraná.

## Resumindo

A Mata Atlântica é a mais devastada e concentra a população. O Pantanal vive do ciclo de cheias e sofre com queimadas. O Pampa tem campos e pecuária e sofre com monoculturas e arenização.`,
    [
      "Mata Atlântica: resta cerca de 12%; concentra a maior parte da população.",
      "Pantanal: planície alagável guiada pelo ciclo de cheia e seca.",
      "Pampa: campos do Sul, clima subtropical e pecuária.",
      "Ameaças: urbanização, queimadas, monoculturas e arenização.",
    ],
    [
      ["Espécie endêmica", "Espécie que só existe em determinada região."],
      ["Planície alagável", "Área plana que fica inundada em parte do ano."],
      ["Arenização", "Formação de areais em solos arenosos degradados, como no Pampa."],
    ],
    [
      ["O bioma brasileiro mais devastado ao longo da história é:", ["Amazônia", "Mata Atlântica", "Pantanal", "Pampa", "Caatinga"], 1, "Restam cerca de 12% da Mata Atlântica."],
      ["O que organiza a vida no Pantanal é:", ["o frio do inverno", "o ciclo de cheias e secas", "a neve", "as marés oceânicas", "os terremotos"], 1, "A inundação periódica define o bioma."],
      ["A vegetação típica do Pampa é formada por:", ["florestas densas", "campos de gramíneas", "cactos", "mangues", "araucárias apenas"], 1, "Campos sulinos."],
      ["Por que a Mata Atlântica foi tão devastada?", ["por estar no interior isolado", "por estar na faixa litorânea, ocupada desde a colonização", "por causa de vulcões", "por ser muito seca", "por ter solo congelado"], 1, "Ciclos econômicos e cidades ocuparam o litoral."],
      ["O mangue é importante porque:", ["é um deserto costeiro", "serve de berçário para espécies marinhas", "não tem animais", "fica no alto das montanhas", "produz petróleo"], 1, "Muitas espécies se reproduzem no mangue."],
    ],
    [["Por que a destruição da Mata Atlântica afeta diretamente a vida nas cidades?", "Porque a maior parte da população vive na área da Mata Atlântica e a floresta protege nascentes que abastecem as cidades, além de regular o clima e evitar deslizamentos."]],
  ),
  aula(
    "Matriz energética brasileira e fontes renováveis",
    `## Matriz energética x matriz elétrica

- **Matriz energética:** todas as fontes de energia usadas no país (para transporte, indústria, cozinhar, gerar eletricidade).
- **Matriz elétrica:** só as fontes usadas para **gerar eletricidade**.

## O Brasil é diferente

- A **matriz elétrica** brasileira é muito **renovável** (cerca de 85% a 90%), principalmente por causa das **hidrelétricas**, além de eólica, solar e biomassa.
- A matriz energética brasileira também é mais renovável que a média mundial (quase metade), graças à hidreletricidade, ao **etanol** da cana e à biomassa.
- No mundo, predominam os **combustíveis fósseis** (petróleo, carvão e gás natural).

## Fontes e seus impactos

- **Hidrelétrica:** renovável e barata de operar, mas **alaga grandes áreas**, desloca populações (ribeirinhos, indígenas), afeta peixes e depende de chuva. Ex.: Itaipu, Belo Monte.
- **Eólica:** usa o vento; cresce muito no **Nordeste**. Impactos: ruído, efeito sobre aves e sobre comunidades locais.
- **Solar fotovoltaica:** cresce rápido, inclusive nos telhados (geração distribuída). Depende da luz do dia.
- **Biomassa e etanol:** cana-de-açúcar, bagaço, lenha. Renováveis, mas exigem grandes áreas de cultivo.
- **Petróleo:** o Brasil explora o **pré-sal**. Fóssil e poluente.
- **Termelétricas:** queimam gás, carvão ou óleo; são acionadas quando falta água nas represas, o que deixa a conta de luz mais cara (**bandeiras tarifárias**).
- **Nuclear:** Angra 1 e 2; não emite gás carbônico, mas gera lixo radioativo e risco de acidentes.

## Crise hídrica e energia

Como a eletricidade depende muito das represas, **secas** reduzem a geração. Diversificar a matriz (mais eólica e solar) reduz esse risco.

## Resumindo

A eletricidade do Brasil é muito renovável graças às hidrelétricas, mas toda fonte tem impactos. Eólica e solar crescem e diversificam a matriz.`,
    [
      "Matriz energética: todas as fontes; matriz elétrica: só eletricidade.",
      "A matriz elétrica brasileira é majoritariamente renovável (hidrelétricas).",
      "Hidrelétricas alagam áreas e deslocam populações.",
      "Eólica e solar crescem e reduzem a dependência das chuvas.",
    ],
    [
      ["Fonte renovável", "Fonte que se renova na natureza em pouco tempo, como sol, vento e água."],
      ["Pré-sal", "Camada de petróleo em águas muito profundas do litoral brasileiro."],
      ["Bandeira tarifária", "Acréscimo na conta de luz quando a geração fica mais cara, como em secas."],
    ],
    [
      ["A principal fonte da matriz elétrica brasileira é:", ["carvão mineral", "hidrelétrica", "nuclear", "petróleo", "gás natural"], 1, "As hidrelétricas geram a maior parte."],
      ["Um impacto socioambiental típico das grandes hidrelétricas é:", ["emissão de lixo radioativo", "alagamento de áreas e deslocamento de populações", "chuva ácida", "ruído de turbinas eólicas", "derramamento de petróleo"], 1, "Os reservatórios alagam terras."],
      ["Em anos de seca, a conta de luz fica mais cara porque:", ["as eólicas param", "são acionadas termelétricas, mais caras", "o sol diminui", "o petróleo acaba", "as usinas nucleares fecham"], 1, "Termelétricas cobrem a falta de água nas represas."],
      ["A região que mais se destaca na energia eólica no Brasil é:", ["Norte", "Nordeste", "Sul", "Centro-Oeste", "Sudeste"], 1, "Ventos constantes no Nordeste."],
      ["É uma fonte não renovável:", ["solar", "eólica", "petróleo", "etanol", "hidrelétrica"], 2, "Petróleo é fóssil."],
    ],
    [["Por que diversificar a matriz elétrica com eólica e solar é importante para o Brasil?", "Porque a geração depende muito das hidrelétricas e das chuvas; em secas, falta água e é preciso usar termelétricas caras e poluentes. Eólica e solar são renováveis e reduzem esse risco."]],
  ),
  aula(
    "Migrações: êxodo rural, migração interna e refugiados",
    `## O que é migrar

**Migração** é o deslocamento de pessoas de um lugar para outro para morar. Quem sai é **emigrante**; quem chega é **imigrante**.

## Motivos

- **Fatores de expulsão:** pobreza, falta de emprego, seca, guerra, perseguição, desastres.
- **Fatores de atração:** empregos, salários, serviços, segurança.

## Migrações internas no Brasil

- **Êxodo rural:** saída do campo para a cidade, intensa entre 1950 e 1980, causada pela **mecanização** do campo, pela **concentração de terras** e pela atração da indústria. Fez o Brasil se tornar urbano rapidamente.
- **Nordestinos para o Sudeste:** muitos migraram para São Paulo e Rio, trabalhando na indústria e na construção civil.
- **Para o Centro-Oeste e o Norte:** com a construção de **Brasília** e as frentes agrícolas e de mineração.
- **Migração de retorno:** a partir dos anos 1990, muitos voltaram ao Nordeste, com o crescimento de cidades médias da região.
- **Migração pendular:** ir e voltar todos os dias entre a cidade-dormitório e o trabalho.
- **Migração sazonal (transumância):** trabalho temporário, como no corte da cana.

## Migrações internacionais

- O Brasil recebeu **europeus** (italianos, alemães, portugueses) e **japoneses** nos séculos XIX e XX, em parte para substituir a mão de obra escravizada nas lavouras de café.
- Hoje chegam **venezuelanos**, **haitianos**, bolivianos e outros.
- **Refugiado:** pessoa que foge de **guerra, perseguição ou violação de direitos** e tem proteção internacional. O Brasil tem a **Lei de Migração** (2017), que trata o migrante como sujeito de direitos.

## Desafios

**Xenofobia** (aversão a estrangeiros), trabalho análogo à escravidão, falta de acolhimento e de documentos. Por outro lado, migrantes contribuem para a economia e a cultura.

## Resumindo

O êxodo rural urbanizou o Brasil. Nordestinos migraram ao Sudeste e hoje há migração de retorno. Refugiados fogem de guerras e perseguições e têm direito a proteção.`,
    [
      "Migração tem fatores de expulsão e de atração.",
      "O êxodo rural (1950–1980) urbanizou o Brasil.",
      "Migração pendular: ir e voltar no mesmo dia para trabalhar.",
      "Refugiados fogem de guerras e perseguições e têm proteção internacional.",
    ],
    [
      ["Êxodo rural", "Saída em massa da população do campo para as cidades."],
      ["Migração pendular", "Deslocamento diário entre a cidade onde se mora e onde se trabalha."],
      ["Xenofobia", "Aversão ou preconceito contra estrangeiros."],
    ],
    [
      ["Uma causa do êxodo rural no Brasil foi:", ["a reforma agrária ampla", "a mecanização e a concentração de terras", "a falta de indústrias nas cidades", "o fim das cidades", "o turismo rural"], 1, "Máquinas e latifúndios expulsaram trabalhadores."],
      ["Quem mora numa cidade e trabalha em outra, voltando todo dia, faz migração:", ["sazonal", "pendular", "internacional", "de retorno", "forçada"], 1, "É a migração pendular."],
      ["Refugiado é a pessoa que:", ["viaja a turismo", "foge de guerra ou perseguição e busca proteção em outro país", "muda de bairro", "trabalha só no verão", "estuda fora por um ano"], 1, "Definição de refugiado."],
      ["A migração de retorno ao Nordeste, a partir dos anos 1990, está ligada:", ["ao fim das secas", "ao crescimento econômico de cidades médias nordestinas", "à proibição de migrar", "ao fechamento das fábricas do Nordeste", "ao fim da urbanização"], 1, "Novas oportunidades na região de origem."],
      ["A vinda de imigrantes europeus no fim do século XIX esteve ligada:", ["ao ciclo do ouro", "à substituição da mão de obra escravizada no café", "à construção de Brasília", "ao pré-sal", "à seca do Sertão"], 1, "Política de imigração para as lavouras de café."],
    ],
    [["Explique o que foi o êxodo rural e cite uma consequência dele para as cidades.", "Foi a saída em massa de pessoas do campo para a cidade, causada pela mecanização e pela concentração de terras; nas cidades, o crescimento rápido e sem planejamento gerou favelas, periferias e falta de serviços."]],
  ),
  aula(
    "Demografia: transição demográfica e pirâmide etária",
    `## Conceitos básicos

- **Natalidade:** nascimentos por mil habitantes em um ano.
- **Mortalidade:** mortes por mil habitantes.
- **Crescimento vegetativo (natural):** natalidade menos mortalidade.
- **Fecundidade:** número médio de filhos por mulher. Para a população se manter estável, é preciso cerca de **2,1 filhos** (taxa de reposição).
- **Expectativa de vida:** quantos anos, em média, uma pessoa deve viver.
- **População absoluta:** total de habitantes. **Densidade demográfica:** habitantes por km². O Brasil é **populoso** (muita gente), mas **pouco povoado** (baixa densidade média).

## Transição demográfica

1. **Antes:** natalidade e mortalidade altas; crescimento baixo.
2. **Queda da mortalidade** (vacinas, saneamento, remédios) com natalidade ainda alta: **explosão demográfica**. O Brasil viveu isso entre 1940 e 1970.
3. **Queda da natalidade** (urbanização, mulher no mercado de trabalho, métodos contraceptivos, custo de criar filhos).
4. **Natalidade e mortalidade baixas:** crescimento lento e **envelhecimento** da população.

Hoje a fecundidade no Brasil está **abaixo de 2,1**.

## Pirâmide etária

Gráfico que mostra a população por **idade** e **sexo**.

- **Base larga e topo estreito:** muitos jovens, país com alta natalidade.
- **Base estreitando e meio largo:** o caso atual do Brasil.
- **Topo largo:** muitos idosos, país envelhecido (Japão, Europa).

## Bônus demográfico e envelhecimento

- **Bônus demográfico:** fase em que há muita gente em **idade de trabalhar** em relação a crianças e idosos. É uma oportunidade para crescer, se houver educação e emprego.
- Com o envelhecimento, crescem os desafios da **previdência**, da saúde e do cuidado com idosos.

## Resumindo

A transição demográfica vai de altas para baixas taxas de natalidade e mortalidade. O Brasil está envelhecendo, e a pirâmide etária mostra isso com a base cada vez mais estreita.`,
    [
      "Crescimento vegetativo = natalidade − mortalidade.",
      "Taxa de reposição: cerca de 2,1 filhos por mulher.",
      "A urbanização e a mulher no trabalho reduziram a natalidade.",
      "O Brasil envelhece: base da pirâmide estreitando.",
    ],
    [
      ["Fecundidade", "Número médio de filhos por mulher."],
      ["Densidade demográfica", "Número de habitantes por quilômetro quadrado."],
      ["Bônus demográfico", "Fase com muitas pessoas em idade ativa em relação a dependentes."],
    ],
    [
      ["O crescimento vegetativo é calculado por:", ["imigração − emigração", "natalidade − mortalidade", "população ÷ área", "nascimentos + mortes", "idosos − jovens"], 1, "Diferença entre nascimentos e mortes."],
      ["Uma pirâmide etária de base larga indica:", ["população envelhecida", "alta natalidade e muitos jovens", "baixa natalidade", "muitos idosos", "nenhuma migração"], 1, "Base larga = muitos jovens."],
      ["O Brasil é considerado populoso e pouco povoado porque:", ["tem poucos habitantes e área pequena", "tem muitos habitantes, mas baixa densidade média", "tem alta densidade em todo o território", "não tem cidades grandes", "tem natalidade alta"], 1, "Muita gente, território enorme."],
      ["Um fator que reduziu a natalidade no Brasil foi:", ["o êxodo urbano para o campo", "a entrada da mulher no mercado de trabalho e a urbanização", "a falta de métodos contraceptivos", "o aumento da mortalidade infantil", "a proibição do casamento"], 1, "Mudanças sociais e urbanas."],
      ["Um desafio do envelhecimento da população é:", ["excesso de escolas infantis", "pressão sobre a previdência e a saúde", "falta de idosos", "aumento da natalidade", "explosão demográfica"], 1, "Mais aposentados e mais cuidados de saúde."],
    ],
    [["Explique as etapas da transição demográfica brasileira.", "Primeiro havia natalidade e mortalidade altas; depois a mortalidade caiu com vacinas e saneamento, gerando explosão demográfica; em seguida a natalidade caiu com a urbanização e a mulher no trabalho; hoje as duas taxas são baixas e a população envelhece."]],
  ),
  aula(
    "Mudanças climáticas e acordos ambientais",
    `## Efeito estufa: natural e necessário

Alguns gases da atmosfera (gás carbônico, metano, vapor de água) retêm parte do calor do Sol. Sem esse **efeito estufa natural**, a Terra seria gelada. O problema é a **intensificação** do efeito estufa pelas atividades humanas.

## Causas do aquecimento global

- Queima de **combustíveis fósseis** (petróleo, carvão, gás) em carros, indústrias e usinas.
- **Desmatamento** e queimadas (no Brasil, a maior fonte de emissões).
- **Pecuária** (o gado libera metano) e uso de fertilizantes.

## Consequências

- Aumento da temperatura média do planeta.
- **Derretimento de geleiras** e **elevação do nível do mar**, ameaçando cidades litorâneas e ilhas.
- **Eventos extremos** mais frequentes: secas, ondas de calor, enchentes (como as do Rio Grande do Sul em 2024).
- Perda de biodiversidade, branqueamento de corais, prejuízos à agricultura.
- **Refugiados climáticos** e aumento da desigualdade: os mais pobres sofrem mais (**injustiça climática**).

## Acordos internacionais

- **Eco-92 (Rio de Janeiro, 1992):** criou a ideia de **desenvolvimento sustentável** e a Agenda 21.
- **Protocolo de Kyoto (1997):** metas de redução de emissões só para países ricos; criou o mercado de **créditos de carbono**.
- **Acordo de Paris (2015):** todos os países assumem metas (as NDCs) para limitar o aquecimento a **bem menos de 2 °C**, buscando **1,5 °C**.
- **COP:** conferências anuais da ONU sobre o clima. A **COP30** foi realizada em **Belém**, em 2025.
- Princípio das **responsabilidades comuns, porém diferenciadas**: todos devem agir, mas os países que mais poluíram historicamente têm mais responsabilidade.

## Não confunda

A **camada de ozônio** (que filtra raios ultravioleta) é outro problema, causado pelos gases CFC e tratado pelo **Protocolo de Montreal**.

## Resumindo

O aquecimento global vem da intensificação do efeito estufa por fósseis e desmatamento. Traz eventos extremos e elevação do mar. O Acordo de Paris busca limitar o aquecimento a 1,5 °C.`,
    [
      "O efeito estufa é natural; o problema é sua intensificação.",
      "No Brasil, o desmatamento é a maior fonte de emissões.",
      "Consequências: eventos extremos e elevação do nível do mar.",
      "Acordo de Paris: limitar o aquecimento a 1,5 °C, com metas de todos.",
    ],
    [
      ["Efeito estufa", "Retenção de calor por gases da atmosfera; natural, mas intensificado pelo ser humano."],
      ["Crédito de carbono", "Certificado que representa uma tonelada de gás carbônico que deixou de ser emitida."],
      ["Injustiça climática", "Os mais pobres sofrem mais com a crise climática, embora poluam menos."],
    ],
    [
      ["A principal fonte de emissões de gases de efeito estufa no Brasil é:", ["a indústria automobilística", "o desmatamento e as mudanças no uso da terra", "as usinas nucleares", "as eólicas", "o turismo"], 1, "Desmatamento e queimadas lideram as emissões brasileiras."],
      ["O Acordo de Paris (2015) estabeleceu:", ["metas só para países pobres", "o objetivo de limitar o aquecimento a bem menos de 2 °C, buscando 1,5 °C", "a proibição do petróleo", "o fim das COPs", "a criação da camada de ozônio"], 1, "Meta central do Acordo de Paris."],
      ["Uma consequência do aquecimento global é:", ["o aumento das geleiras", "a elevação do nível do mar", "o fim das chuvas no mundo", "a diminuição das secas", "o resfriamento dos oceanos"], 1, "O gelo derrete e a água se expande."],
      ["O buraco na camada de ozônio é causado principalmente por:", ["gás carbônico", "gases CFC", "vapor de água", "metano do gado", "oxigênio"], 1, "CFCs, tratados no Protocolo de Montreal."],
      ["O princípio das \"responsabilidades comuns, porém diferenciadas\" significa que:", ["só os pobres devem agir", "todos devem agir, mas quem mais poluiu historicamente tem mais responsabilidade", "nenhum país deve agir", "só a ONU é responsável", "as empresas não têm responsabilidade"], 1, "Base das negociações climáticas."],
    ],
    [["Diferencie o efeito estufa natural do aquecimento global causado pelo ser humano.", "O efeito estufa natural mantém a Terra aquecida e permite a vida; o aquecimento global é a intensificação desse efeito pelo excesso de gases emitidos pela queima de combustíveis fósseis, pelo desmatamento e pela pecuária."]],
  ),
];
