import { aula } from "./build";

/** Geografia, lote 3: clima, solos, rede urbana, território e questões globais. */
export const GEOGRAFIA_3 = [
  aula(
    "Climas do Brasil e massas de ar",
    `## Fatores que influenciam o clima

- **Latitude:** o Brasil está quase todo na **zona tropical**, por isso predomina o calor.
- **Altitude:** quanto mais alto, mais frio (cerca de 0,6 °C a menos a cada 100 m).
- **Maritimidade x continentalidade:** perto do mar, menor amplitude térmica; no interior, maior variação.
- **Massas de ar** e **correntes marítimas**.
- **Relevo:** serras barram umidade (chuvas orográficas).
- **Vegetação:** a Amazônia libera umidade (rios voadores).

## Massas de ar que atuam no Brasil

- **Equatorial continental (mEc):** quente e **úmida**, forma-se na Amazônia; traz chuvas de verão ao Centro-Oeste e Sudeste.
- **Equatorial atlântica (mEa):** quente e úmida, atua no litoral do Norte e Nordeste.
- **Tropical atlântica (mTa):** quente e úmida, atua no litoral leste e sul.
- **Tropical continental (mTc):** quente e **seca**, no Chaco (centro do continente).
- **Polar atlântica (mPa):** **fria** e úmida; vinda do sul, provoca **frentes frias**, quedas de temperatura, **geadas** e até **friagem** na Amazônia.

## Tipos de clima

- **Equatorial:** Amazônia; quente e chuvoso o ano todo, pequena amplitude térmica.
- **Tropical:** Brasil central; verão chuvoso e **inverno seco** (duas estações bem marcadas).
- **Tropical de altitude:** áreas altas do Sudeste; temperaturas mais amenas, geadas ocasionais.
- **Tropical atlântico (litorâneo úmido):** litoral leste; chuvoso, influência marítima.
- **Semiárido:** sertão nordestino; chuvas **escassas e irregulares**, altas temperaturas.
- **Subtropical:** Sul; estações bem definidas, **inverno frio**, chuvas bem distribuídas, geadas e, raramente, neve nas serras.

## Climograma

Gráfico que combina **temperatura** (linha) e **precipitação** (barras) de cada mês. Ajuda a identificar o clima:

- Chuvas altas todos os meses e temperatura sempre alta → **equatorial**.
- Meses de inverno com poucas chuvas → **tropical**.
- Temperaturas baixas no meio do ano e chuva distribuída → **subtropical**.
- Pouquíssima chuva, concentrada em poucos meses → **semiárido**.

## Resumindo

Latitude, altitude, maritimidade e massas de ar definem o clima. A mPa traz frentes frias e geadas. Climas: equatorial, tropical (inverno seco), tropical de altitude, litorâneo, semiárido e subtropical. O climograma combina temperatura e chuva.`,
    [
      "Latitude, altitude, maritimidade e massas de ar definem o clima.",
      "Massa polar atlântica traz frentes frias, geadas e friagem.",
      "Tropical: verão chuvoso e inverno seco.",
      "Climograma: linha de temperatura + barras de chuva.",
    ],
    [
      ["Massa de ar", "Grande porção de ar com temperatura e umidade semelhantes."],
      ["Amplitude térmica", "Diferença entre a maior e a menor temperatura."],
      ["Climograma", "Gráfico que mostra temperatura e precipitação ao longo do ano."],
    ],
    [
      ["A massa de ar responsável pelas frentes frias e geadas no Sul e Sudeste é a:", ["equatorial continental", "polar atlântica", "tropical continental", "equatorial atlântica", "tropical atlântica"], 1, "Dica: mPa."],
      ["O clima com verão chuvoso e inverno seco, típico do Brasil central, é o:", ["equatorial", "tropical", "subtropical", "semiárido", "polar"], 1, "Duas estações."],
      ["Um climograma com chuvas altas o ano todo e temperatura sempre acima de 25 °C indica clima:", ["semiárido", "equatorial", "subtropical", "tropical de altitude", "temperado"], 1, "Amazônia."],
      ["Quanto maior a altitude, a temperatura tende a:", ["aumentar", "diminuir", "não variar", "dobrar", "variar só à noite"], 1, "Ar rarefeito."],
      ["A friagem na Amazônia é causada pela:", ["massa equatorial continental", "chegada da massa polar atlântica", "maritimidade", "corrente do Golfo", "El Niño apenas"], 1, "Ar frio do sul."],
    ],
    [["Como o climograma ajuda a identificar o clima de um lugar?", "Ele mostra a temperatura média (linha) e a chuva (barras) de cada mês; pela distribuição da chuva e pela variação da temperatura é possível reconhecer, por exemplo, o equatorial (calor e chuva o ano todo) ou o tropical (inverno seco)."]],
  ),
  aula(
    "Solos: formação, erosão e conservação",
    `## Como o solo se forma

O **solo** é a camada superficial da Terra, formada pela **decomposição das rochas** (**intemperismo**) e pela ação de **seres vivos** e da **matéria orgânica**. Esse processo leva **milhares de anos**: o solo é um recurso praticamente **não renovável** na escala humana.

## Intemperismo

- **Físico:** fragmentação da rocha por variação de temperatura, congelamento da água em fendas, raízes.
- **Químico:** reações com água e gases que alteram os minerais; muito forte em **climas quentes e úmidos** (como no Brasil), gerando solos profundos.
- **Biológico:** ação de seres vivos (raízes, liquens, micro-organismos).

## Horizontes do solo

- **O:** matéria orgânica (folhas, restos).
- **A:** camada superficial, rica em **húmus** e vida.
- **B:** acúmulo de minerais.
- **C:** rocha em decomposição.
- **R:** rocha-mãe.

## Solos brasileiros

- Muitos são **ácidos** e pobres em nutrientes (como no **Cerrado**), por causa da **lixiviação** (a chuva "lava" os nutrientes). A **calagem** (calcário) corrige a acidez.
- **Terra roxa:** solo fértil de origem basáltica, no Paraná e em São Paulo, importante para o café.
- **Massapê:** solo fértil do litoral nordestino, ligado à cana-de-açúcar.
- **Terra preta de índio:** solos férteis na Amazônia criados por povos indígenas antigos.

## Degradação do solo

- **Erosão:** remoção do solo pela **água** (**voçorocas**, grandes buracos) e pelo **vento**; acelerada pelo **desmatamento** e pelo pisoteio do gado.
- **Lixiviação** e **laterização** (endurecimento do solo).
- **Compactação** por máquinas e gado.
- **Salinização:** acúmulo de sais por irrigação inadequada, comum no semiárido.
- **Desertificação** (semiárido) e **arenização** (Pampa).
- **Contaminação** por agrotóxicos e resíduos.
- **Assoreamento** dos rios pelo solo erodido.

## Conservação

- **Plantio direto** (sem revolver o solo, mantendo a palha).
- **Curvas de nível** e **terraceamento** em terrenos inclinados.
- **Rotação de culturas** e **adubação verde**.
- **Matas ciliares** e cobertura vegetal.
- **Sistemas agroflorestais** e integração lavoura-pecuária-floresta.

## Resumindo

O solo se forma pelo intemperismo das rochas ao longo de milhares de anos. Solos brasileiros são muitas vezes ácidos pela lixiviação. Desmatamento causa erosão e voçorocas. Plantio direto e curvas de nível conservam o solo.`,
    [
      "Solo se forma pelo intemperismo em milhares de anos.",
      "Lixiviação deixa muitos solos brasileiros ácidos e pobres.",
      "Terra roxa (café) e massapê (cana) são solos férteis.",
      "Plantio direto e curvas de nível evitam a erosão.",
    ],
    [
      ["Intemperismo", "Decomposição das rochas por agentes físicos, químicos e biológicos."],
      ["Lixiviação", "Remoção de nutrientes do solo pela água da chuva."],
      ["Voçoroca", "Grande buraco formado pela erosão da água."],
    ],
    [
      ["O solo é considerado praticamente não renovável porque:", ["não existe mais", "leva milhares de anos para se formar", "é feito em fábricas", "não tem minerais", "é renovado todo ano"], 1, "Escala geológica."],
      ["A terra roxa, fértil, está ligada historicamente ao cultivo de:", ["cana no Nordeste", "café no Paraná e em São Paulo", "borracha na Amazônia", "trigo no Sul apenas", "algodão no sertão"], 1, "Origem basáltica."],
      ["A lixiviação é:", ["a adição de calcário", "a lavagem dos nutrientes do solo pela chuva", "a formação de rochas", "o plantio em curvas de nível", "a irrigação"], 1, "Empobrece o solo."],
      ["Uma técnica que reduz a erosão em terrenos inclinados é:", ["queimada", "plantio em curvas de nível", "monocultura sem cobertura", "desmatamento", "compactação"], 1, "Segura a água."],
      ["A salinização do solo é comum no semiárido por causa:", ["do excesso de chuvas", "da irrigação inadequada que acumula sais", "do frio", "da floresta densa", "da calagem"], 1, "Evaporação deixa sais."],
    ],
    [["Explique como o desmatamento contribui para a erosão do solo e o assoreamento dos rios.", "Sem a vegetação, o solo fica exposto à chuva e ao vento, que removem suas camadas superficiais (erosão); esse material é levado para os rios e se acumula no leito, deixando-os mais rasos (assoreamento)."]],
  ),
  aula(
    "Rede urbana, metrópoles e megalópoles",
    `## Cidades conectadas

A **rede urbana** é o conjunto de cidades **ligadas** por fluxos de pessoas, mercadorias, capitais, informações e serviços. As cidades têm **hierarquia**: umas influenciam muitas outras.

## Hierarquia urbana (IBGE)

- **Grande metrópole nacional:** **São Paulo** (influência sobre todo o país).
- **Metrópoles nacionais:** **Rio de Janeiro** e **Brasília**.
- **Metrópoles:** Belo Horizonte, Salvador, Recife, Fortaleza, Porto Alegre, Curitiba, Manaus, Belém, Goiânia...
- **Capitais regionais**, **centros sub-regionais**, **centros de zona** e **centros locais**.

Hoje a hierarquia não é rígida: graças à **internet** e aos transportes, uma cidade pequena pode se ligar diretamente a uma metrópole ou ao exterior.

## Conceitos importantes

- **Metrópole:** cidade grande que comanda uma vasta área, com muitos serviços especializados.
- **Região metropolitana:** a metrópole e os municípios vizinhos integrados a ela (definida por lei).
- **Conurbação:** quando cidades **crescem e se encontram**, formando uma mancha urbana contínua (São Paulo e o ABC).
- **Megalópole:** junção de **várias metrópoles** próximas e conectadas. Ex.: **Boston–Washington** (EUA), **Tóquio–Osaka** (Japão). No Brasil, fala-se na formação de uma megalópole **Rio–São Paulo** (eixo da Via Dutra).
- **Megacidade:** cidade com mais de **10 milhões** de habitantes (Tóquio, Délhi, São Paulo, Cidade do México). Muitas estão em países em desenvolvimento.
- **Cidade global:** comanda fluxos econômicos mundiais (Nova York, Londres, Tóquio; São Paulo em nível regional).
- **Metropolização** e, mais recentemente, **desmetropolização**: crescimento das **cidades médias** do interior.

## Funções urbanas

Cidades podem ter funções predominantes: **político-administrativa** (Brasília), **industrial**, **portuária** (Santos), **turística** (Gramado), **religiosa** (Aparecida), **universitária**.

## Problemas metropolitanos

Mobilidade, moradia, segregação, violência, poluição, abastecimento de água — exigem **gestão compartilhada** entre municípios.

## Resumindo

A rede urbana tem hierarquia (São Paulo no topo). Conurbação é a junção física de cidades; megalópole, a de metrópoles. Megacidades têm mais de 10 milhões de habitantes. Cidades médias crescem com a desmetropolização.`,
    [
      "Rede urbana: cidades ligadas por fluxos, com hierarquia.",
      "São Paulo: grande metrópole nacional.",
      "Conurbação: cidades que se juntam numa mancha contínua.",
      "Megalópole: várias metrópoles conectadas (Rio–São Paulo).",
    ],
    [
      ["Rede urbana", "Conjunto de cidades interligadas por fluxos econômicos e sociais."],
      ["Conurbação", "União física de cidades que cresceram até se encontrar."],
      ["Megacidade", "Cidade com mais de 10 milhões de habitantes."],
    ],
    [
      ["No topo da hierarquia urbana brasileira está:", ["Brasília", "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Manaus"], 1, "Grande metrópole nacional."],
      ["Quando duas cidades crescem até formar uma mancha urbana contínua, ocorre:", ["megalópole", "conurbação", "êxodo rural", "gentrificação", "desmetropolização"], 1, "Ex.: SP e ABC."],
      ["Uma megalópole é formada:", ["por uma única cidade grande", "pela junção de várias metrópoles conectadas", "por vilas rurais", "por uma capital estadual", "por cidades médias isoladas"], 1, "Ex.: Boston–Washington."],
      ["Megacidade é a cidade com mais de:", ["1 milhão de habitantes", "10 milhões de habitantes", "100 mil habitantes", "500 mil habitantes", "50 milhões"], 1, "Critério da ONU."],
      ["O crescimento recente das cidades médias do interior é chamado de:", ["metropolização", "desmetropolização", "conurbação", "gentrificação", "êxodo urbano total"], 1, "Interiorização."],
    ],
    [["Diferencie conurbação de megalópole.", "Conurbação é a união física de duas ou mais cidades que cresceram até se encontrar, formando uma mancha urbana contínua; megalópole é a junção de várias metrópoles próximas e muito conectadas por fluxos, como o eixo Rio–São Paulo."]],
  ),
  aula(
    "Fronteiras, território e soberania do Brasil",
    `## Território e soberania

- **Território:** espaço delimitado sobre o qual um **Estado** exerce **poder** (soberania).
- **Soberania:** autoridade máxima de um Estado sobre seu território, sem se submeter a outro.
- O território inclui o **solo**, o **subsolo**, o **espaço aéreo** e as **águas**.

## Dimensões do Brasil

- **5º maior país do mundo** em área (cerca de **8,5 milhões de km²**).
- Faz fronteira com **10 países** da América do Sul (todos, exceto **Chile** e **Equador**).
- Cerca de **16 mil km** de fronteiras terrestres e mais de **7 mil km** de litoral.

## Formação das fronteiras

- **Tratado de Tordesilhas** (1494), superado pela ocupação (bandeiras, pecuária, mineração).
- **Tratado de Madri** (1750): princípio do **uti possidetis**.
- **Barão do Rio Branco** (início do século XX): resolveu disputas por **diplomacia** e arbitragem, como a compra do **Acre** à Bolívia (**Tratado de Petrópolis**, 1903).

## Território marítimo (Convenção da ONU sobre o Direito do Mar)

- **Mar territorial:** até **12 milhas náuticas** (soberania total).
- **Zona Econômica Exclusiva (ZEE):** até **200 milhas**: direito exclusivo de explorar recursos (pesca, petróleo — o **pré-sal** está aqui).
- **Plataforma continental:** pode ir além das 200 milhas.
- A Marinha chama essa área de "**Amazônia Azul**", pela riqueza e extensão.

## Faixa de fronteira

- Faixa de **150 km** ao longo das fronteiras terrestres, considerada **estratégica** para a defesa.
- Desafios: **narcotráfico**, contrabando, tráfico de armas, garimpo ilegal, crimes ambientais, migração.
- Programas de vigilância (SISFRON, Calha Norte).

## Cidades-gêmeas

Cidades vizinhas de países diferentes, muito integradas: **Foz do Iguaçu–Ciudad del Este**, **Santana do Livramento–Rivera**, **Pacaraima–Santa Elena de Uairén** (entrada de venezuelanos), **Tabatinga–Letícia**.

## Integração regional

**Mercosul**, a **Ponte da Amizade**, a **Tríplice Fronteira** (Brasil, Paraguai, Argentina), a **Hidrovia Paraná-Paraguai** e a **Itaipu Binacional** mostram a integração com os vizinhos.

## Resumindo

O Brasil é o 5º maior país e faz fronteira com 10 países (não com Chile e Equador). Rio Branco definiu fronteiras por diplomacia (Acre, 1903). O mar territorial vai até 12 milhas e a ZEE até 200 ("Amazônia Azul"). A faixa de fronteira tem 150 km.`,
    [
      "Brasil: 5º maior país; fronteira com 10 países (não Chile e Equador).",
      "Barão do Rio Branco: Acre comprado da Bolívia (1903).",
      "Mar territorial: 12 milhas; ZEE: 200 milhas (\"Amazônia Azul\").",
      "Faixa de fronteira de 150 km: área estratégica.",
    ],
    [
      ["Soberania", "Poder supremo de um Estado sobre seu território."],
      ["Zona Econômica Exclusiva", "Faixa de até 200 milhas onde o país explora os recursos com exclusividade."],
      ["Cidades-gêmeas", "Cidades vizinhas de países diferentes, muito integradas."],
    ],
    [
      ["Os países sul-americanos que não fazem fronteira com o Brasil são:", ["Peru e Bolívia", "Chile e Equador", "Uruguai e Paraguai", "Colômbia e Venezuela", "Argentina e Guiana"], 1, "Os únicos dois."],
      ["O Acre foi incorporado ao Brasil por meio:", ["de uma guerra com o Peru", "do Tratado de Petrópolis (1903), com a Bolívia", "do Tratado de Tordesilhas", "da Guerra do Paraguai", "da independência"], 1, "Barão do Rio Branco."],
      ["A Zona Econômica Exclusiva brasileira se estende até:", ["12 milhas", "50 milhas", "200 milhas", "500 milhas", "1.000 milhas"], 2, "Exploração de recursos."],
      ["A expressão \"Amazônia Azul\" refere-se:", ["aos rios amazônicos", "ao território marítimo brasileiro e suas riquezas", "ao céu da Amazônia", "a uma reserva indígena", "ao Pantanal"], 1, "Termo da Marinha."],
      ["Foz do Iguaçu e Ciudad del Este são exemplo de:", ["megalópole", "cidades-gêmeas", "conurbação nacional", "regiões metropolitanas", "capitais"], 1, "Fronteira integrada."],
    ],
    [["O que é a Zona Econômica Exclusiva e por que ela é importante para o Brasil?", "É a faixa marítima de até 200 milhas da costa onde o país tem direito exclusivo de explorar recursos, como pesca e petróleo; é importante porque ali está o pré-sal e grande riqueza natural, a chamada Amazônia Azul."]],
  ),
  aula(
    "Fusos horários e horário de verão",
    `## Por que existem fusos horários

A Terra gira **360°** em torno de seu eixo em **24 horas** (movimento de **rotação**). Logo, a cada **15°** de longitude, há **1 hora** de diferença (360 ÷ 24 = 15).

O mundo foi dividido em **24 fusos** a partir do **Meridiano de Greenwich** (0°), em Londres, que marca o horário de referência (**GMT** ou **UTC**).

## Regra do leste e do oeste

A Terra gira de **oeste para leste**, então o Sol "nasce" primeiro no **leste**:

- Lugares a **leste** de Greenwich estão **adiantados** (horas a mais).
- Lugares a **oeste** estão **atrasados** (horas a menos).

Dica: "**Leste soma, oeste subtrai**".

## Fusos do Brasil

O Brasil está todo a **oeste** de Greenwich, por isso tem horários **atrasados** em relação a Londres. Tem **4 fusos**:

- **UTC −2:** Fernando de Noronha e ilhas oceânicas.
- **UTC −3:** **horário de Brasília** (oficial): Sul, Sudeste, Nordeste, Goiás, DF, Tocantins, Pará e Amapá.
- **UTC −4:** Mato Grosso, Mato Grosso do Sul, Rondônia, Roraima e maior parte do Amazonas.
- **UTC −5:** Acre e oeste do Amazonas.

Os limites seguem divisas **políticas**, não exatamente os meridianos.

## Como calcular

**Exemplo 1:** São Paulo (UTC −3) às 10h. Londres (UTC 0)? São 3 fusos a leste → **13h**.

**Exemplo 2:** São Paulo às 10h. Tóquio (UTC +9)? Diferença de 12 fusos a leste → **22h**.

**Exemplo 3:** um voo sai de Brasília às 22h e leva 10h até Lisboa (UTC 0). Chega às 8h no horário de Brasília → em Lisboa são **11h**.

## Linha Internacional de Data

No meridiano **180°** (oceano Pacífico), muda o **dia**: ao cruzá-la para oeste, avança-se um dia; para leste, volta-se um dia.

## Horário de verão

- Adiantar o relógio em 1 hora no verão para **aproveitar a luz natural** e reduzir o consumo de energia no horário de pico.
- No Brasil, foi **extinto em 2019**, porque a economia de energia ficou pequena (os hábitos de consumo mudaram, com mais uso de ar-condicionado à tarde).

## Resumindo

A cada 15° de longitude, 1 hora de diferença. Leste adianta, oeste atrasa. O Brasil tem 4 fusos; o oficial é o de Brasília (UTC −3). A Linha de Data no 180° muda o dia. O horário de verão foi extinto em 2019.`,
    [
      "15° de longitude = 1 hora de diferença.",
      "Leste adianta (soma); oeste atrasa (subtrai).",
      "Brasil: 4 fusos; Brasília = UTC −3.",
      "Horário de verão extinto no Brasil em 2019.",
    ],
    [
      ["Fuso horário", "Faixa da Terra com o mesmo horário oficial."],
      ["UTC", "Tempo Universal Coordenado, referência a partir de Greenwich."],
      ["Linha Internacional de Data", "Meridiano de 180° onde muda o dia do calendário."],
    ],
    [
      ["Quando são 12h em Brasília (UTC −3), em Londres (UTC 0) são:", ["9h", "15h", "12h", "18h", "6h"], 1, "Três horas a mais."],
      ["Em relação a Greenwich, o Brasil está:", ["adiantado, pois fica a leste", "atrasado, pois fica a oeste", "no mesmo horário", "adiantado em 12 horas", "sem fuso"], 1, "Hemisfério ocidental."],
      ["Quantos fusos horários tem o Brasil?", ["1", "2", "3", "4", "5"], 3, "UTC −2 a −5."],
      ["Uma diferença de 45° de longitude corresponde a:", ["1 hora", "2 horas", "3 horas", "4 horas", "45 horas"], 2, "45 ÷ 15."],
      ["O horário de verão foi extinto no Brasil porque:", ["era ilegal", "a economia de energia passou a ser pequena", "o Sol mudou", "os fusos foram unificados", "causava terremotos"], 1, "Mudança nos hábitos de consumo."],
    ],
    [["Explique por que lugares a leste de Greenwich têm horário adiantado.", "Porque a Terra gira de oeste para leste; assim, o Sol aparece primeiro nos lugares mais a leste, que começam o dia antes, ficando com horário adiantado em relação aos que estão a oeste."]],
  ),
  aula(
    "Oceanos, litoral e economia do mar",
    `## A importância dos oceanos

Os oceanos cobrem cerca de **70%** da superfície da Terra. Eles:

- **Regulam o clima** (absorvem calor e CO₂; correntes marítimas distribuem calor).
- Produzem grande parte do **oxigênio** (pelo fitoplâncton).
- Fornecem **alimentos**, **petróleo**, **minerais** e rotas de **transporte** (cerca de 90% do comércio mundial é marítimo).

## Correntes marítimas

- **Quentes:** aquecem e trazem umidade ao litoral (Corrente do **Brasil**, Corrente do Golfo, que ameniza o clima da Europa).
- **Frias:** deixam o litoral mais seco e frio, mas são ricas em **nutrientes** (Corrente de **Humboldt**, no Peru e Chile: muito peixe e o deserto do Atacama).
- Correntes frias favorecem a **pesca**, pois trazem nutrientes das profundezas (**ressurgência**).

## Litoral brasileiro

- Mais de **7 mil km** de costa.
- Ecossistemas: **manguezais** (berçário de espécies), **restingas**, **dunas**, **recifes de corais** (Abrolhos, na Bahia), praias.
- Concentra grande parte da **população** e das **capitais**, por herança da colonização.
- Atividades: **turismo**, **portos** (Santos, Paranaguá, Itaqui), **pesca**, **petróleo** (pré-sal), **energia eólica offshore** (no mar).

## Problemas

- **Poluição por plástico** e **microplásticos** (ilhas de lixo no Pacífico).
- **Esgoto** e **derramamentos de petróleo** (como o que atingiu o Nordeste em 2019).
- **Sobrepesca** (pesca excessiva) que ameaça espécies.
- **Branqueamento** e morte de **corais** pelo aquecimento das águas.
- **Acidificação** dos oceanos (absorção de CO₂).
- **Elevação do nível do mar** e **erosão costeira**, ameaçando cidades litorâneas.
- **Especulação imobiliária** e destruição de mangues e restingas.

## Proteção

- **Unidades de conservação marinhas** (Parque Nacional Marinho de Abrolhos, Fernando de Noronha).
- **ODS 14** (vida na água) da ONU.
- Gerenciamento costeiro, redução do plástico descartável, pesca sustentável (defeso: período de proibição da pesca na reprodução).

## Resumindo

Os oceanos regulam o clima, produzem oxigênio e sustentam comércio e alimentação. Correntes frias trazem nutrientes (pesca); quentes, umidade. O litoral brasileiro tem mangues e corais e concentra população. Plástico, sobrepesca e aquecimento ameaçam os oceanos.`,
    [
      "Oceanos regulam o clima e produzem oxigênio (fitoplâncton).",
      "Correntes frias trazem nutrientes e favorecem a pesca.",
      "Litoral brasileiro: mangues, corais (Abrolhos) e muita população.",
      "Ameaças: plástico, sobrepesca, branqueamento de corais.",
    ],
    [
      ["Ressurgência", "Subida de águas frias e ricas em nutrientes das profundezas."],
      ["Sobrepesca", "Pesca excessiva que impede a reposição das espécies."],
      ["Defeso", "Período em que a pesca é proibida para proteger a reprodução."],
    ],
    [
      ["As correntes marítimas frias favorecem a pesca porque:", ["aquecem a água", "trazem nutrientes das profundezas", "eliminam os peixes predadores", "aumentam as chuvas", "são poluídas"], 1, "Ressurgência."],
      ["Os manguezais são importantes porque:", ["são desertos costeiros", "funcionam como berçário de muitas espécies", "não têm vida", "produzem petróleo", "impedem o turismo"], 1, "Reprodução de espécies."],
      ["O branqueamento dos corais está ligado principalmente:", ["ao frio intenso", "ao aquecimento das águas", "à pesca artesanal", "ao turismo de montanha", "à chuva"], 1, "Mudanças climáticas."],
      ["O Parque Nacional Marinho de Abrolhos fica na:", ["Bahia", "Amazônia", "Rio Grande do Sul", "Paraná", "Goiás"], 0, "Recifes de corais."],
      ["Uma forma de proteger a reprodução dos peixes é:", ["aumentar a pesca", "respeitar o período de defeso", "usar redes menores", "poluir menos o ar apenas", "pescar à noite"], 1, "Proibição temporária."],
    ],
    [["Explique dois motivos pelos quais os oceanos são importantes para o planeta.", "Eles regulam o clima, absorvendo calor e gás carbônico e distribuindo calor pelas correntes, e produzem grande parte do oxigênio por meio do fitoplâncton, além de fornecer alimentos e servir como rota de comércio."]],
  ),
  aula(
    "Conflitos no Oriente Médio",
    `## Uma região estratégica

O **Oriente Médio** fica entre a Europa, a Ásia e a África. É estratégico por concentrar grandes reservas de **petróleo** e **gás**, rotas comerciais (**Canal de Suez**, **Estreito de Ormuz**) e lugares sagrados para **judeus, cristãos e muçulmanos** (Jerusalém, Meca).

## Herança colonial

- Após a Primeira Guerra, o **Império Otomano** foi dividido entre **Reino Unido** e **França** (Acordo **Sykes-Picot**, 1916), que traçaram **fronteiras artificiais**, sem respeitar povos e religiões.
- Isso está na raiz de vários conflitos.

## Israel e Palestina

- Em **1947**, a **ONU** propôs dividir a Palestina em um Estado **judeu** e um **árabe**. Em **1948**, foi criado **Israel**. Os países árabes não aceitaram e houve guerra. Cerca de 700 mil palestinos foram expulsos ou fugiram (**Nakba**, "catástrofe").
- **Guerra dos Seis Dias (1967):** Israel ocupou **Cisjordânia**, **Faixa de Gaza**, **Jerusalém Oriental** e as Colinas de Golã.
- Questões centrais: **assentamentos** israelenses na Cisjordânia, **status de Jerusalém**, **refugiados** palestinos, segurança, criação do **Estado palestino**.
- **Acordos de Oslo (1993):** criaram a Autoridade Palestina, mas a paz não se consolidou.
- A **Faixa de Gaza** vive bloqueio e sucessivas guerras; o ataque do **Hamas** em **outubro de 2023** e a guerra que se seguiu causaram dezenas de milhares de mortos e uma grave crise humanitária.
- Proposta defendida pela ONU e pelo Brasil: **dois Estados** convivendo em paz.

## Outros conflitos

- **Curdos:** maior povo **sem Estado** do mundo, dividido entre Turquia, Iraque, Irã e Síria.
- **Sunitas x xiitas:** divisões no Islã que se misturam a disputas políticas (Arábia Saudita, sunita, x Irã, xiita).
- **Guerras do Golfo** (1991) e **invasão do Iraque** pelos EUA (2003).
- **Guerra civil na Síria** (desde 2011, após a **Primavera Árabe**): milhões de **refugiados**.
- **Iêmen:** guerra e uma das piores crises humanitárias.
- **Estado Islâmico** (grupo terrorista) e intervenções estrangeiras.

## Primavera Árabe (2010–2012)

Onda de protestos por democracia e contra ditaduras (Tunísia, Egito, Líbia, Síria), organizados em parte por **redes sociais**. Resultados variados: democracia na Tunísia, guerras na Líbia e na Síria.

## Resumindo

O Oriente Médio é estratégico (petróleo, rotas, lugares sagrados). Fronteiras coloniais geraram conflitos. Israel–Palestina envolve território, Jerusalém, refugiados e Gaza. Curdos são um povo sem Estado. A Primavera Árabe levou a democracia e a guerras.`,
    [
      "Oriente Médio: petróleo, rotas (Suez, Ormuz) e lugares sagrados.",
      "Fronteiras traçadas por britânicos e franceses (Sykes-Picot).",
      "Israel–Palestina: território, Jerusalém, refugiados e Gaza.",
      "Curdos: maior povo sem Estado; Primavera Árabe em 2011.",
    ],
    [
      ["Nakba", "Expulsão e fuga de palestinos em 1948, chamada de \"catástrofe\"."],
      ["Assentamentos", "Colônias israelenses construídas em territórios palestinos ocupados."],
      ["Primavera Árabe", "Onda de protestos por democracia em países árabes a partir de 2010."],
    ],
    [
      ["Uma razão da importância estratégica do Oriente Médio é:", ["a falta de recursos", "as grandes reservas de petróleo e gás", "o clima frio", "a ausência de rotas comerciais", "a baixa população"], 1, "Energia."],
      ["O Estado de Israel foi criado em:", ["1917", "1948", "1967", "1993", "2001"], 1, "Após a proposta da ONU de 1947."],
      ["O maior povo sem Estado próprio do mundo são os:", ["palestinos", "curdos", "árabes", "persas", "judeus"], 1, "Divididos em quatro países."],
      ["A Primavera Árabe foi:", ["uma guerra entre Israel e Egito", "uma onda de protestos por democracia em países árabes", "um acordo de paz", "uma crise do petróleo de 1973", "uma estação do ano"], 1, "2010–2012."],
      ["A solução de \"dois Estados\" propõe:", ["acabar com Israel", "a convivência de Israel e de um Estado palestino", "a anexação de Gaza ao Egito", "a união com a Jordânia", "a ocupação internacional permanente"], 1, "Defendida pela ONU."],
    ],
    [["Explique como a herança colonial contribuiu para os conflitos no Oriente Médio.", "Após a Primeira Guerra, britânicos e franceses dividiram o antigo Império Otomano traçando fronteiras artificiais, sem respeitar povos, etnias e religiões; isso deixou grupos como os curdos sem Estado e gerou disputas territoriais e políticas que persistem."]],
  ),
  aula(
    "África: diversidade, colonização e desafios atuais",
    `## Um continente diverso

A **África** tem **54 países**, mais de **1,4 bilhão** de habitantes e grande diversidade de **povos**, **línguas** (mais de 2 mil), religiões e paisagens. É o **berço da humanidade** (o *Homo sapiens* surgiu lá).

## Paisagens

- **Norte:** deserto do **Saara** (o maior deserto quente do mundo) e região árabe-muçulmana (Egito, Marrocos).
- **Sahel:** faixa de transição ao sul do Saara, ameaçada pela **desertificação**.
- **Centro:** floresta tropical do **Congo**.
- **Leste:** **Vale do Rift**, grandes lagos, savanas (Quênia, Tanzânia) e o **Kilimanjaro**.
- **Sul:** planaltos, deserto do Kalahari, África do Sul.
- Rio **Nilo** (o mais longo do mundo, segundo muitas medições) e rio Congo.

## Colonização e suas heranças

- **Tráfico atlântico de escravizados** (séculos XVI a XIX): milhões de africanos levados à força, sobretudo para o **Brasil**.
- **Conferência de Berlim (1884–1885):** potências europeias **partilharam** a África, traçando **fronteiras artificiais** que separaram povos aliados e juntaram rivais.
- Exploração de recursos (minérios, borracha, marfim) e violência (ex.: Congo Belga de Leopoldo II).
- **Independências** principalmente entre **1950 e 1975** (Gana em 1957; as colônias portuguesas — Angola, Moçambique, Guiné-Bissau, Cabo Verde, São Tomé — em 1974–1975, após guerras de libertação).

## Desafios atuais

- **Conflitos étnicos e guerras civis**, muitos ligados às fronteiras coloniais e à disputa por recursos (diamantes de sangue, coltan).
- **Genocídio de Ruanda** (1994): cerca de 800 mil tutsis e hutus moderados mortos.
- **Apartheid** na África do Sul (1948–1994): segregação racial legalizada; **Nelson Mandela** ficou 27 anos preso e se tornou o primeiro presidente negro (1994).
- **Pobreza** e desigualdade, dívida externa, dependência da exportação de **commodities**.
- **Doenças** (malária, HIV) e falta de saneamento em muitas áreas.
- **Mudanças climáticas** e insegurança alimentar.

## Potencial e mudanças

- Crescimento econômico em vários países, população **jovem**, urbanização acelerada (Lagos, Kinshasa), inovação tecnológica (pagamentos por celular no Quênia).
- Forte presença da **China** em investimentos e infraestrutura.
- **União Africana** e a Zona de Livre Comércio Continental.

## Laços com o Brasil

Herança cultural profunda (religião, música, culinária, língua); a **CPLP** (Comunidade dos Países de Língua Portuguesa) une o Brasil a Angola, Moçambique e outros.

## Resumindo

A África é diversa e berço da humanidade. A Conferência de Berlim criou fronteiras artificiais. Independências entre 1950 e 1975. Desafios: conflitos, pobreza, doenças e clima. Mandela derrotou o apartheid. O Brasil tem laços profundos com o continente.`,
    [
      "África: 54 países, enorme diversidade, berço da humanidade.",
      "Conferência de Berlim (1884–85): fronteiras artificiais.",
      "Independências entre 1950 e 1975; colônias portuguesas em 1975.",
      "Apartheid derrotado; Mandela presidente em 1994.",
    ],
    [
      ["Conferência de Berlim", "Reunião de potências europeias que partilhou a África (1884–1885)."],
      ["Apartheid", "Regime de segregação racial na África do Sul (1948–1994)."],
      ["Sahel", "Faixa semiárida ao sul do Saara, ameaçada pela desertificação."],
    ],
    [
      ["A Conferência de Berlim (1884–1885):", ["libertou a África", "partilhou a África entre potências europeias, criando fronteiras artificiais", "aboliu o tráfico", "criou a ONU", "dividiu a América"], 1, "Neocolonialismo."],
      ["As colônias portuguesas na África se tornaram independentes principalmente em:", ["1822", "1888", "1945", "1974–1975", "2000"], 3, "Após a Revolução dos Cravos."],
      ["Nelson Mandela é símbolo da luta contra:", ["o colonialismo francês", "o apartheid na África do Sul", "a ditadura brasileira", "a Guerra Fria", "o nazismo"], 1, "Preso por 27 anos."],
      ["O Sahel é uma região:", ["de florestas tropicais", "semiárida ao sul do Saara, ameaçada pela desertificação", "de geleiras", "do litoral mediterrâneo", "de clima temperado"], 1, "Transição."],
      ["A CPLP une o Brasil a países como:", ["Nigéria e Quênia", "Angola e Moçambique", "Egito e Marrocos", "África do Sul e Gana", "Etiópia e Sudão"], 1, "Língua portuguesa."],
    ],
    [["Como as fronteiras traçadas na Conferência de Berlim contribuem para conflitos atuais na África?", "As potências europeias dividiram o continente segundo seus interesses, sem respeitar povos, etnias e reinos; isso separou grupos aliados e juntou rivais no mesmo país, gerando disputas étnicas, guerras civis e conflitos por território e recursos."]],
  ),
  aula(
    "Transportes e logística no Brasil",
    `## Como as mercadorias circulam

O sistema de **transportes** liga regiões produtoras aos mercados e portos, influenciando o **custo** dos produtos e a **competitividade** do país.

## Matriz de transportes brasileira

- O Brasil depende muito das **rodovias**: a maior parte das cargas viaja por **caminhão**.
- Origem histórica: a partir dos anos 1950 (governo **JK**), priorizou-se a **indústria automobilística** e as rodovias; ferrovias foram abandonadas.
- A **greve dos caminhoneiros de 2018** mostrou essa dependência: o país quase parou (falta de combustível e alimentos).

## Modais e suas características

- **Rodoviário:** flexível (porta a porta), bom para **curtas distâncias**; mas caro em longas distâncias, mais poluente, com mais acidentes e estradas muitas vezes precárias.
- **Ferroviário:** grande capacidade, **mais barato** em longas distâncias e menos poluente; caro para implantar. No Brasil, usado principalmente para **minério** (Estrada de Ferro Carajás, Vitória–Minas) e grãos (Ferrovia Norte-Sul).
- **Hidroviário:** o **mais barato** para grandes cargas e longas distâncias; o Brasil tem grande potencial (bacias Amazônica, Tietê-Paraná, Paraná-Paraguai), mas usa pouco. Depende do nível dos rios (secas atrapalham).
- **Aeroviário:** rápido, mas caro; para pessoas e cargas leves e valiosas.
- **Dutoviário:** oleodutos e gasodutos para petróleo e gás.
- **Cabotagem:** navegação ao longo da costa.

## Intermodalidade

Combinar modais (caminhão até a ferrovia, ferrovia até o porto) reduz custos. O chamado **"Custo Brasil"** inclui a ineficiência logística.

## Corredores de exportação

- Escoamento da **soja** do Centro-Oeste: tradicionalmente pelos portos do Sul e Sudeste (Santos, Paranaguá); hoje cresce o **Arco Norte** (portos de Itaqui, Barcarena, Santarém, Miritituba), mais próximos, mas com impactos na Amazônia (como a rodovia BR-163).

## Mobilidade urbana

Nas cidades, o transporte individual congestiona as ruas; metrô, BRT, trens e ciclovias são alternativas (veja a aula de problemas urbanos).

## Impactos ambientais

Rodovias na Amazônia (Transamazônica, BR-163, BR-319) facilitam o **desmatamento** e a grilagem ao longo das estradas ("espinha de peixe").

## Resumindo

O Brasil depende das rodovias desde os anos 1950. Ferrovias e hidrovias são mais baratas e menos poluentes para longas distâncias e grandes cargas, mas pouco usadas. A intermodalidade reduz custos. Estradas na Amazônia favorecem o desmatamento.`,
    [
      "A maior parte das cargas no Brasil vai por rodovias.",
      "Ferrovias e hidrovias são mais baratas em longas distâncias.",
      "Intermodalidade combina modais e reduz custos.",
      "Rodovias na Amazônia favorecem o desmatamento.",
    ],
    [
      ["Modal de transporte", "Tipo de transporte: rodoviário, ferroviário, hidroviário, aéreo ou dutoviário."],
      ["Intermodalidade", "Combinação de diferentes modais de transporte."],
      ["Cabotagem", "Navegação entre portos de um mesmo país, ao longo da costa."],
    ],
    [
      ["A greve dos caminhoneiros de 2018 evidenciou:", ["a força das ferrovias", "a dependência do transporte rodoviário", "o excesso de hidrovias", "o fim dos caminhões", "a eficiência logística total"], 1, "País quase parou."],
      ["O modal mais barato para transportar grandes cargas a longas distâncias é o:", ["aéreo", "rodoviário", "hidroviário", "dutoviário para grãos", "por caminhonete"], 2, "Baixo custo por tonelada."],
      ["A Estrada de Ferro Carajás transporta principalmente:", ["passageiros de luxo", "minério de ferro", "frutas", "automóveis", "petróleo"], 1, "Do Pará ao Maranhão."],
      ["A priorização das rodovias no Brasil se intensificou:", ["no Império", "a partir dos anos 1950, com a indústria automobilística", "em 1500", "com Vargas em 1930 apenas", "após 2010"], 1, "Governo JK."],
      ["O desmatamento em \"espinha de peixe\" ocorre:", ["no litoral", "ao longo de rodovias abertas na floresta", "em cidades", "em rios", "no deserto"], 1, "Estradas facilitam a ocupação."],
    ],
    [["Por que o Brasil é criticado por depender tanto das rodovias para o transporte de cargas?", "Porque as rodovias são mais caras e poluentes para longas distâncias e grandes volumes, têm muitos acidentes e estradas precárias, o que encarece os produtos; ferrovias e hidrovias seriam mais eficientes, mas foram pouco desenvolvidas."]],
  ),
  aula(
    "Desigualdade mundial: IDH, Norte e Sul",
    `## Como medir o desenvolvimento

- **PIB (Produto Interno Bruto):** soma de tudo o que um país produz. Mede o tamanho da economia, mas **não** mostra como a riqueza é distribuída.
- **PIB per capita:** PIB dividido pela população (média por pessoa); também esconde desigualdades.
- **IDH (Índice de Desenvolvimento Humano):** criado pela ONU (PNUD) com base nas ideias de **Amartya Sen** e **Mahbub ul Haq**. Combina:
  - **Saúde:** expectativa de vida.
  - **Educação:** anos de estudo.
  - **Renda:** renda per capita.
  - Varia de **0 a 1**; quanto mais perto de 1, maior o desenvolvimento humano.
- **Índice de Gini:** mede a **desigualdade de renda** (0 = igualdade total; 1 = desigualdade máxima). O Brasil tem um dos Ginis mais **altos** do mundo.

## Norte x Sul

- Após a Guerra Fria, passou-se a dividir o mundo em **Norte** (países desenvolvidos, ricos) e **Sul** (países em desenvolvimento ou subdesenvolvidos).
- A divisão é **socioeconômica**, não exatamente geográfica: **Austrália** e **Nova Zelândia** estão no Sul, mas são "Norte".
- Antes, usava-se Primeiro, Segundo e Terceiro Mundo (Guerra Fria).
- Hoje fala-se em **Sul Global** e em **países emergentes** (BRICS).

## Causas históricas das desigualdades

- **Colonialismo** e **imperialismo**: exploração de recursos e de pessoas.
- **Divisão Internacional do Trabalho**: periferia exportando produtos primários.
- **Dívida externa** e dependência tecnológica.
- Desigualdades **internas**: concentração de renda e de terra.

## O Brasil

- IDH considerado **alto**, mas com grandes diferenças **regionais** e entre grupos (raça, gênero).
- Grande economia (entre as 10 maiores), mas muito **desigual**.
- O **IDHM** (municipal) mostra contrastes entre municípios.

## Outros índices

- **IDH ajustado à desigualdade** (cai bastante no Brasil).
- **Índice de Pobreza Multidimensional**, **Felicidade Interna Bruta** (Butão), **pegada ecológica**.

## Resumindo

PIB mede a economia, mas não a distribuição. IDH combina saúde, educação e renda (0 a 1). Gini mede desigualdade de renda; o do Brasil é alto. Norte e Sul é uma divisão socioeconômica. Colonialismo e dependência explicam parte das desigualdades.`,
    [
      "PIB mede a economia, mas não a distribuição da riqueza.",
      "IDH: saúde, educação e renda (de 0 a 1).",
      "Gini mede desigualdade de renda; o do Brasil é alto.",
      "Norte x Sul: divisão socioeconômica, não só geográfica.",
    ],
    [
      ["IDH", "Índice de Desenvolvimento Humano: saúde, educação e renda."],
      ["Índice de Gini", "Medida da desigualdade de renda, de 0 a 1."],
      ["PIB per capita", "PIB dividido pelo número de habitantes."],
    ],
    [
      ["O IDH é calculado com base em:", ["só a renda", "saúde, educação e renda", "área territorial", "número de indústrias", "exportações"], 1, "Três dimensões."],
      ["Um Índice de Gini próximo de 1 indica:", ["igualdade de renda", "alta desigualdade de renda", "alto IDH", "baixa população", "economia pequena"], 1, "Concentração."],
      ["Uma limitação do PIB per capita é:", ["mostrar a distribuição exata da renda", "esconder as desigualdades internas", "considerar a educação", "medir a felicidade", "ser calculado pela ONU"], 1, "É uma média."],
      ["Austrália e Nova Zelândia, apesar de estarem no Hemisfério Sul, fazem parte do:", ["Sul Global", "Norte desenvolvido", "Terceiro Mundo", "BRICS", "grupo de países pobres"], 1, "Divisão socioeconômica."],
      ["O IDH foi criado com base nas ideias de:", ["Adam Smith", "Amartya Sen e Mahbub ul Haq", "Karl Marx", "Malthus", "Keynes apenas"], 1, "Desenvolvimento como liberdade."],
    ],
    [["Por que o IDH é considerado uma medida mais completa de desenvolvimento do que o PIB?", "Porque o PIB mede apenas a produção econômica, enquanto o IDH também considera a saúde (expectativa de vida) e a educação, além da renda, mostrando melhor a qualidade de vida das pessoas."]],
  ),
];
