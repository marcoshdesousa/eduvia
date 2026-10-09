import type { EnemLesson } from "./types";

/** Aulas a mais de Ciências Humanas (entram depois das primeiras). */
export const MORE_HUMANAS: Record<string, EnemLesson[]> = {
  historia: [
    {
      title: "Antiguidade: Grécia e Roma",
      content: `## Por que estudar a Antiguidade

Muitas ideias que usamos até hoje nasceram na Grécia e em Roma: democracia, república, filosofia, direito e cidadania. O ENEM costuma comparar essas ideias com as do mundo atual.

## Grécia: as cidades-Estado

A Grécia antiga não era um país unificado, mas um conjunto de **pólis**, cidades-Estado independentes. As mais famosas eram Atenas e Esparta.

- **Esparta:** sociedade militarizada, governada por uma oligarquia. Os meninos eram treinados para a guerra desde cedo.
- **Atenas:** criou a **democracia**, por volta do século 5 antes de Cristo. Os cidadãos participavam diretamente das decisões na assembleia (a **ágora** era a praça pública).

**Atenção:** a democracia ateniense era **restrita**. Só eram cidadãos os homens adultos, livres e filhos de atenienses. **Mulheres, estrangeiros (metecos) e escravizados** ficavam de fora, ou seja, a grande maioria da população. Essa comparação com a democracia atual é muito cobrada.

A Grécia também deixou a filosofia, o teatro (tragédia e comédia), os Jogos Olímpicos e a valorização da razão.

## Roma: da república ao império

Roma passou por três fases:

- **Monarquia:** governada por reis.
- **República:** o poder ficava com o Senado, controlado pelos **patrícios** (a elite). Os **plebeus** lutaram por direitos e conquistaram os **tribunos da plebe** e a **Lei das Doze Tábuas**, as primeiras leis escritas, que diminuíam o poder arbitrário dos juízes patrícios.
- **Império:** começou com Augusto. Roma dominou o Mediterrâneo, construiu estradas, aquedutos e cidades.

Roma deixou o **direito romano** (base de muitas leis atuais), o **latim** (que deu origem ao português e ao espanhol) e a ideia de **república**, a "coisa pública".

A política do **pão e circo** (distribuir comida e oferecer espetáculos) servia para controlar a população pobre de Roma.

## A queda de Roma

O Império Romano do Ocidente caiu em 476, enfraquecido por crises econômicas, divisão política e invasões de povos germânicos. Começava a Idade Média.

## Resumindo

Atenas criou a democracia direta, mas restrita aos homens livres. Roma passou de monarquia a república e a império, e deixou o direito, o latim e a ideia de república.`,
      highlights: [
        "Atenas criou a democracia direta, mas mulheres, estrangeiros e escravizados ficavam de fora.",
        "Esparta era uma sociedade militarizada.",
        "Na República Romana, os plebeus conquistaram direitos, como a Lei das Doze Tábuas.",
        "Roma deixou o direito romano, o latim e a ideia de república.",
      ],
      keyPoints: [
        { term: "Pólis", explanation: "Cidade-Estado grega, com governo e leis próprios." },
        { term: "Patrícios e plebeus", explanation: "Elite e povo comum na Roma antiga." },
        { term: "Pão e circo", explanation: "Política romana de dar comida e espetáculos para controlar a população." },
      ],
    },
    {
      title: "Idade Média: feudalismo e Igreja",
      content: `## Mil anos de história

A Idade Média vai da queda de Roma (476) à tomada de Constantinopla pelos turcos (1453). Durante muito tempo foi chamada de "Idade das Trevas", mas hoje os historiadores criticam esse nome: houve universidades, catedrais, comércio e muita produção cultural.

## O feudalismo

Com as invasões e a crise das cidades, a vida se concentrou no **campo**. O **feudo** era uma grande propriedade de terra.

- **Senhores feudais** (nobres) eram donos das terras.
- **Servos** trabalhavam a terra e pagavam obrigações ao senhor: a **corveia** (trabalho nas terras do senhor), a **talha** (parte da produção) e as **banalidades** (taxas pelo uso do moinho, do forno). Os servos não eram escravizados: não podiam ser vendidos, mas estavam presos à terra.
- **Suserania e vassalagem:** um nobre (suserano) dava terras a outro (vassalo) em troca de fidelidade e ajuda militar.

A sociedade era **estamental**, com pouca mobilidade: os que rezavam (clero), os que lutavam (nobreza) e os que trabalhavam (servos).

## O poder da Igreja

A **Igreja Católica** era a instituição mais poderosa: dona de muitas terras, controlava a educação e a cultura e explicava o mundo pela fé (**teocentrismo**: Deus no centro). Os mosteiros guardavam e copiavam livros antigos.

As **Cruzadas** (séculos 11 a 13) foram expedições militares cristãs para tomar Jerusalém dos muçulmanos. Não conquistaram a Terra Santa de forma duradoura, mas reabriram o comércio com o Oriente.

## O mundo islâmico

Enquanto isso, o **Islã**, fundado por Maomé no século 7, se expandiu pelo Oriente Médio, Norte da África e Península Ibérica. Os árabes preservaram e desenvolveram a ciência, a matemática (os algarismos que usamos) e a medicina. Os muçulmanos ficaram cerca de 800 anos na Península Ibérica, influenciando o português e o espanhol.

## Baixa Idade Média e crise

A partir do século 11, o comércio renasceu, as **cidades (burgos)** cresceram e surgiu a **burguesia**. No século 14, uma grande crise — fome, guerras e a **Peste Negra**, que matou cerca de um terço da população da Europa — enfraqueceu o feudalismo e abriu caminho para o mundo moderno.

## Resumindo

O feudalismo baseava-se na terra, na servidão e na vassalagem. A Igreja dominava a cultura (teocentrismo). O comércio e as cidades renasceram, e a crise do século 14 abriu caminho para a Idade Moderna.`,
      highlights: [
        "Servos pagavam obrigações como a corveia e a talha, mas não eram escravizados.",
        "Sociedade estamental: clero, nobreza e servos, com pouca mobilidade.",
        "A Igreja dominava a cultura: o teocentrismo colocava Deus no centro.",
        "A Peste Negra e a crise do século 14 enfraqueceram o feudalismo.",
      ],
      keyPoints: [
        { term: "Feudo", explanation: "Grande propriedade de terra, base da economia medieval." },
        { term: "Corveia", explanation: "Dias de trabalho obrigatório do servo nas terras do senhor." },
        { term: "Teocentrismo", explanation: "Visão de mundo com Deus no centro de tudo." },
      ],
    },
    {
      title: "Idade Moderna: Renascimento, Reformas e Navegações",
      content: `## Um mundo em transformação

Entre os séculos 15 e 18, a Europa passou por mudanças profundas na cultura, na religião, na política e na economia. Foi nesse contexto que os europeus chegaram à América.

## Renascimento

O **Renascimento** valorizou o ser humano e a razão, retomando a cultura grega e romana. O **antropocentrismo** (o ser humano no centro) substituiu o teocentrismo medieval.

- Artistas como **Leonardo da Vinci**, **Michelangelo** e **Rafael** estudavam a anatomia, a perspectiva e a natureza.
- A **imprensa** de Gutenberg (por volta de 1450) espalhou livros e ideias com muito mais rapidez.
- A ciência avançou com a observação: **Copérnico** e **Galileu** defenderam o **heliocentrismo** (o Sol no centro).

## Reformas religiosas

Em 1517, **Martinho Lutero** criticou a venda de indulgências (perdão dos pecados em troca de dinheiro) e iniciou a **Reforma Protestante**. Defendeu a salvação pela fé e a leitura da Bíblia por todos. Depois vieram Calvino e a Igreja Anglicana, na Inglaterra.

A Igreja Católica respondeu com a **Contrarreforma**: o Concílio de Trento, a Inquisição, o Índice de livros proibidos e a Companhia de Jesus (os jesuítas), que vieram catequizar os indígenas no Brasil.

## Grandes Navegações

Portugal e Espanha buscaram novas rotas para o comércio de especiarias com as Índias. Portugal foi pioneiro, contornando a África (Vasco da Gama chegou à Índia em 1498). A Espanha financiou Colombo, que chegou à América em 1492. Em 1494, o **Tratado de Tordesilhas** dividiu as terras entre os dois reinos.

Para os povos da América, a chegada dos europeus significou conquista, violência, escravização e epidemias que mataram milhões de pessoas.

## Absolutismo e mercantilismo

- **Absolutismo:** o rei concentrava todos os poderes, com a justificativa de que o poder vinha de Deus. Luís XIV, da França, teria dito: "O Estado sou eu".
- **Mercantilismo:** política econômica que buscava acumular metais preciosos (metalismo), vender mais do que comprar (balança comercial favorável) e explorar colônias com exclusividade de comércio (**pacto colonial**).

## Resumindo

O Renascimento colocou o ser humano no centro. A Reforma dividiu o cristianismo, e a Contrarreforma reagiu. As Grandes Navegações levaram à conquista da América. O absolutismo concentrou o poder no rei, e o mercantilismo explorou as colônias.`,
      highlights: [
        "Renascimento: antropocentrismo e valorização da razão e da ciência.",
        "Lutero iniciou a Reforma Protestante em 1517, criticando as indulgências.",
        "A Contrarreforma criou a Companhia de Jesus, que catequizou indígenas no Brasil.",
        "Mercantilismo: metalismo, balança comercial favorável e pacto colonial.",
      ],
      keyPoints: [
        { term: "Antropocentrismo", explanation: "Visão de mundo com o ser humano no centro." },
        { term: "Tratado de Tordesilhas", explanation: "Acordo de 1494 que dividiu as terras entre Portugal e Espanha." },
        { term: "Pacto colonial", explanation: "Colônia só podia comerciar com a sua metrópole." },
      ],
    },
    {
      title: "Brasil de 1945 a 1964: o período democrático",
      content: `## Entre duas ditaduras

Com o fim do Estado Novo, em 1945, o Brasil viveu quase vinte anos de democracia, com eleições diretas, partidos e a Constituição de 1946. Esse período terminou com o golpe de 1964.

## Eurico Gaspar Dutra (1946–1951)

Governo alinhado aos Estados Unidos no início da Guerra Fria. O Partido Comunista foi colocado na ilegalidade.

## Getúlio Vargas, eleito (1951–1954)

Vargas voltou ao poder pelo voto. Adotou o **nacionalismo econômico**: criou a **Petrobras** (1953), com a campanha "O petróleo é nosso", e defendeu a indústria nacional. Pressionado por uma grave crise política e acusado de envolvimento num atentado contra o jornalista Carlos Lacerda, Vargas se suicidou em 1954, deixando uma carta-testamento: "Saio da vida para entrar na História".

## Juscelino Kubitschek (1956–1961)

O lema era "**50 anos em 5**". O **Plano de Metas** investiu em energia, transportes e indústria. Chegaram as montadoras de automóveis estrangeiras, e as rodovias ganharam prioridade sobre as ferrovias. JK construiu **Brasília**, inaugurada em 1960, para levar o desenvolvimento ao interior. O crescimento foi grande, mas aumentaram a **inflação** e a **dívida externa**.

## Jânio Quadros (1961)

Eleito com a vassoura como símbolo ("varrer a corrupção"), adotou uma política externa independente e renunciou depois de apenas sete meses.

## João Goulart (1961–1964)

O vice Jango assumiu sob desconfiança dos militares. Primeiro, o Brasil adotou o **parlamentarismo**; um plebiscito em 1963 trouxe de volta o presidencialismo. Jango defendeu as **reformas de base**: reforma agrária, urbana, educacional e eleitoral (voto dos analfabetos).

O país estava polarizado. Setores conservadores, empresários, parte da Igreja, da imprensa e os Estados Unidos temiam uma "ameaça comunista". Em março de 1964, a Marcha da Família com Deus pela Liberdade reuniu opositores. Em 31 de março e 1º de abril, veio o **golpe militar**.

## Populismo

Os governos desse período são muitas vezes chamados de **populistas**: líderes carismáticos que se dirigiam diretamente às massas urbanas, com discurso nacionalista e algumas concessões aos trabalhadores, mas mantendo o controle sobre os sindicatos.

## Resumindo

De 1945 a 1964 houve democracia. Vargas criou a Petrobras; JK construiu Brasília com o Plano de Metas; Jânio renunciou; Jango defendeu as reformas de base e foi derrubado pelo golpe de 1964.`,
      highlights: [
        "Vargas criou a Petrobras em 1953, com a campanha 'O petróleo é nosso'.",
        "JK: '50 anos em 5', Plano de Metas, indústria automobilística e Brasília.",
        "Jango defendia as reformas de base, como a reforma agrária.",
        "O golpe de 1964 encerrou o período democrático.",
      ],
      keyPoints: [
        { term: "Plano de Metas", explanation: "Programa de JK para desenvolver energia, transportes e indústria." },
        { term: "Reformas de base", explanation: "Propostas de Jango: agrária, urbana, educacional e eleitoral." },
        { term: "Populismo", explanation: "Política de líderes carismáticos que falam diretamente às massas." },
      ],
    },
    {
      title: "Povos indígenas, África e América colonial",
      content: `## Outras histórias

O ENEM valoriza a história dos povos que foram dominados, e não só a dos colonizadores. A lei brasileira, desde 2003 e 2008, obriga o ensino da história e da cultura afro-brasileira e indígena nas escolas.

## Povos indígenas no Brasil

Antes de 1500, viviam no território milhões de indígenas, de centenas de povos com línguas e culturas diferentes, como os tupis, os jês e os aruaques. Eles tinham conhecimentos profundos sobre a natureza, a agricultura (mandioca, milho) e a medicina.

A colonização trouxe **genocídio**, escravização, epidemias e perda de terras. Mesmo assim, os indígenas **resistiram**: com guerras (como a Confederação dos Tamoios), fugas, alianças e preservação da cultura.

Hoje, cerca de 1,7 milhão de pessoas se declaram indígenas no Brasil, segundo o Censo de 2022. A **Constituição de 1988** reconheceu o direito às terras que eles ocupam tradicionalmente. A **demarcação de terras** e o combate ao garimpo ilegal e ao desmatamento são lutas atuais.

## A África antes e durante o tráfico

A África tinha reinos e impérios ricos e organizados, como o **Mali** (com a cidade de Tombuctu, centro de estudos), o **Congo**, o **Benin** e o reino de **Gana**. Não era um continente "sem história", como dizia o pensamento colonial.

O **tráfico atlântico de escravizados** trouxe cerca de 4,8 milhões de africanos para o Brasil, o maior destino das Américas. Eles vinham sobretudo da região de Angola e do Congo (povos bantos) e da costa ocidental (povos iorubás e jejes). Trouxeram conhecimentos de agricultura, metalurgia, mineração, religiões, música, culinária e língua, que formaram a cultura brasileira.

## A América espanhola

Os espanhóis encontraram grandes civilizações:

- **Astecas**, no México, com a capital Tenochtitlán, conquistada por Hernán Cortés.
- **Incas**, nos Andes, com estradas e um grande império, conquistados por Francisco Pizarro.
- **Maias**, na América Central, com escrita, astronomia e calendário.

A conquista foi facilitada pelas armas de fogo, pelas alianças com povos inimigos dos astecas e, principalmente, pelas **epidemias** (como a varíola). Os espanhóis usaram o trabalho indígena compulsório, como a **mita** e a **encomienda**, para explorar a prata, como em Potosí.

A sociedade colonial espanhola era hierárquica: os chapetones (espanhóis) no topo, os criollos (filhos de espanhóis nascidos na América), os mestiços, os indígenas e os escravizados africanos.

## Resumindo

Os povos indígenas e africanos têm histórias ricas e resistiram à dominação. O Brasil foi o maior destino do tráfico de escravizados. Na América espanhola, astecas e incas foram conquistados, e o trabalho indígena foi explorado na mineração.`,
      highlights: [
        "A lei obriga o ensino da história afro-brasileira e indígena nas escolas.",
        "A Constituição de 1988 reconheceu o direito dos indígenas às suas terras.",
        "A África tinha reinos ricos, como o Mali; não era um continente 'sem história'.",
        "Na América espanhola, a mita e a encomienda exploraram o trabalho indígena.",
      ],
      keyPoints: [
        { term: "Demarcação", explanation: "Reconhecimento oficial dos limites de uma terra indígena." },
        { term: "Mita", explanation: "Trabalho compulsório indígena usado pelos espanhóis nas minas." },
        { term: "Criollos", explanation: "Descendentes de espanhóis nascidos na América." },
      ],
    },
  ],
  geografia: [
    {
      title: "Relevo, solos e a estrutura da Terra",
      content: `## A Terra por dentro

A Terra tem três camadas: a **crosta** (onde vivemos), o **manto** (rocha quente e pastosa, o magma) e o **núcleo**. A crosta é dividida em **placas tectônicas** que se movem lentamente sobre o manto.

## Placas tectônicas

O movimento das placas explica:

- **Terremotos** e **vulcões**, mais comuns nas bordas das placas, como no Círculo de Fogo do Pacífico.
- A formação de **cordilheiras**, como os Andes e o Himalaia, onde as placas se chocam.
- A separação dos continentes ao longo de milhões de anos (a deriva continental).

O Brasil fica no **meio** da Placa Sul-Americana, por isso tem poucos terremotos fortes e não tem vulcões ativos.

## Agentes do relevo

- **Agentes internos (endógenos):** tectonismo, vulcanismo e abalos sísmicos, que formam o relevo.
- **Agentes externos (exógenos):** chuva, vento, rios, mares, gelo e seres vivos, que desgastam e modelam o relevo pelo **intemperismo** (decomposição das rochas) e pela **erosão** (transporte do material).

## O relevo brasileiro

O relevo brasileiro é antigo e muito desgastado, formado principalmente por **planaltos**, **planícies** e **depressões**. Não há cordilheiras. O ponto mais alto é o Pico da Neblina, com cerca de 3 mil metros.

## Tipos de rocha

- **Magmáticas:** formadas pelo resfriamento do magma, como o granito e o basalto.
- **Sedimentares:** formadas pelo acúmulo de sedimentos; nelas se encontram o **petróleo** e os fósseis.
- **Metamórficas:** rochas transformadas por pressão e temperatura, como o mármore.

## Solos

O solo se forma pela decomposição das rochas e da matéria orgânica. Problemas ligados ao solo:

- **Erosão:** a retirada da vegetação deixa o solo exposto à chuva, que o carrega. Forma **voçorocas** (grandes buracos).
- **Lixiviação:** a chuva lava os nutrientes do solo, comum nas regiões tropicais.
- **Laterização:** endurecimento do solo.
- **Salinização:** acúmulo de sais por irrigação mal feita em áreas secas.
- **Desertificação** no semiárido.

Técnicas de conservação: **curvas de nível**, **plantio direto** (sem revirar a terra), **rotação de culturas**, terraceamento e manutenção da vegetação.

## Resumindo

As placas tectônicas causam terremotos e vulcões nas suas bordas; o Brasil fica no meio da placa. O relevo brasileiro é antigo, de planaltos e planícies. Erosão e lixiviação degradam o solo, e curvas de nível e plantio direto ajudam a conservá-lo.`,
      highlights: [
        "Terremotos e vulcões ocorrem nas bordas das placas tectônicas.",
        "O Brasil fica no meio da placa, por isso tem poucos tremores fortes.",
        "O relevo brasileiro é antigo e desgastado: planaltos, planícies e depressões.",
        "Curvas de nível e plantio direto ajudam a conservar o solo.",
      ],
      keyPoints: [
        { term: "Intemperismo", explanation: "Decomposição das rochas pela água, temperatura e seres vivos." },
        { term: "Voçoroca", explanation: "Grande buraco aberto no solo pela erosão." },
        { term: "Lixiviação", explanation: "Lavagem dos nutrientes do solo pela água da chuva." },
      ],
    },
    {
      title: "Água: rios, aquíferos e crise hídrica",
      content: `## Um recurso precioso e mal distribuído

O Brasil tem cerca de 12% da água doce superficial do planeta, mas ela é **mal distribuída**: a maior parte está na Amazônia, onde vive pouca gente, enquanto o Nordeste e as grandes cidades do Sudeste enfrentam falta de água.

## Ciclo da água e bacias

A água circula pela evaporação, transpiração das plantas, condensação, chuva, infiltração e escoamento. Uma **bacia hidrográfica** é a área drenada por um rio principal e seus afluentes.

Principais bacias brasileiras:

- **Amazônica:** a maior do mundo em volume de água.
- **Tocantins-Araguaia.**
- **São Francisco:** o "rio da integração nacional", que atravessa o semiárido. A **transposição** do São Francisco leva água para o sertão, mas gera debate sobre impactos ambientais e sociais.
- **Paraná:** a de maior potencial hidrelétrico aproveitado, com Itaipu.

Os rios de planalto têm grande potencial para **hidrelétricas**; os de planície, como os da Amazônia, são bons para a **navegação**.

## Águas subterrâneas

**Aquíferos** são reservas de água no subsolo, dentro das rochas. O **Aquífero Guarani** se estende por Brasil, Argentina, Paraguai e Uruguai. O **Sistema Aquífero Grande Amazônia** é ainda maior. A contaminação por agrotóxicos e esgoto e a extração excessiva ameaçam essas reservas.

## Usos e conflitos

A agricultura irrigada é a atividade que **mais consome água** no Brasil e no mundo, seguida pela indústria e pelo abastecimento das cidades. Os conflitos pelo uso da água tendem a aumentar com as mudanças climáticas.

## Crise hídrica

Secas prolongadas, desmatamento (que reduz a umidade levada pelos "rios voadores"), poluição, desperdício e falta de planejamento causam **crises hídricas**, como a de São Paulo em 2014 e 2015. A falta de chuva também afeta a geração de energia nas hidrelétricas.

## Saneamento

Ainda hoje, milhões de brasileiros não têm acesso a água tratada e quase metade não tem coleta de esgoto. O esgoto sem tratamento polui rios e causa doenças. O **Marco Legal do Saneamento** (2020) estabeleceu metas de universalização até 2033.

## Resumindo

O Brasil tem muita água, mas mal distribuída. A bacia Amazônica é a maior do mundo; o São Francisco integra o semiárido. A irrigação é o maior consumo. Desmatamento e poluição agravam as crises hídricas, e falta saneamento para muitos brasileiros.`,
      highlights: [
        "O Brasil tem muita água doce, mas concentrada na Amazônia.",
        "Bacia hidrográfica é a área drenada por um rio e seus afluentes.",
        "A agricultura irrigada é a atividade que mais consome água.",
        "O Aquífero Guarani se estende por quatro países da América do Sul.",
      ],
      keyPoints: [
        { term: "Bacia hidrográfica", explanation: "Área drenada por um rio principal e seus afluentes." },
        { term: "Aquífero", explanation: "Reserva de água subterrânea dentro das rochas." },
        { term: "Transposição", explanation: "Desvio de parte da água de um rio para outra região." },
      ],
    },
    {
      title: "Indústria e economia brasileira",
      content: `## A industrialização brasileira

O Brasil se industrializou tarde, principalmente a partir de 1930.

- **Era Vargas:** **substituição de importações** (produzir no país o que antes se comprava fora) e criação da indústria de base, como a Companhia Siderúrgica Nacional e a Vale do Rio Doce.
- **JK (anos 1950):** chegada das empresas estrangeiras, sobretudo das montadoras de automóveis. Esse modelo é chamado de **tripé**: Estado (infraestrutura), capital nacional e capital estrangeiro.
- **Ditadura (anos 1970):** grandes obras e crescimento com endividamento externo.
- **Anos 1990:** abertura econômica e **privatizações** de empresas estatais.

## Concentração e desconcentração

A indústria se concentrou no **Sudeste**, principalmente em São Paulo, por causa do capital do café, do mercado consumidor, da infraestrutura e da mão de obra.

A partir dos anos 1970 e 1980, houve **desconcentração industrial**: fábricas se mudaram para o interior paulista, para o Sul, o Nordeste e o Centro-Oeste, atraídas por:

- **Guerra fiscal:** estados oferecendo isenção de impostos.
- Mão de obra mais barata e menos sindicalizada.
- Terrenos baratos e melhoria das rodovias e da comunicação.

Mesmo assim, o Sudeste ainda concentra a maior parte da produção industrial, sobretudo as atividades de gestão e tecnologia.

## Desindustrialização

Nas últimas décadas, a participação da indústria no PIB brasileiro caiu. O país voltou a depender muito das **commodities** (soja, minério de ferro, petróleo, carne) exportadas sobretudo para a China. Isso é chamado de **reprimarização** da pauta exportadora.

## Os setores da economia

- **Primário:** agropecuária e extrativismo.
- **Secundário:** indústria e construção.
- **Terciário:** comércio e serviços, que hoje concentra a maior parte dos empregos.

## Revolução técnico-científica

A indústria atual usa automação, robótica, informática e inteligência artificial. Isso aumenta a produtividade, mas pode eliminar empregos e exige trabalhadores mais qualificados. Os **tecnopolos**, como Campinas e São José dos Campos, concentram empresas de tecnologia e universidades.

## Resumindo

O Brasil se industrializou a partir de 1930, com substituição de importações e depois capital estrangeiro. A indústria se concentrou no Sudeste e depois se desconcentrou pela guerra fiscal. Hoje o país depende muito da exportação de commodities.`,
      highlights: [
        "Substituição de importações: produzir no país o que antes se importava.",
        "JK abriu o país às montadoras estrangeiras.",
        "Guerra fiscal: estados dão isenção de impostos para atrair fábricas.",
        "Reprimarização: o país voltou a depender da exportação de commodities.",
      ],
      keyPoints: [
        { term: "Desconcentração industrial", explanation: "Saída de fábricas do Sudeste para outras regiões e para o interior." },
        { term: "Guerra fiscal", explanation: "Disputa entre estados oferecendo isenções de impostos às empresas." },
        { term: "Tecnopolo", explanation: "Centro que reúne empresas de tecnologia e universidades." },
      ],
    },
    {
      title: "Transportes, regiões e integração do território",
      content: `## Matriz de transportes

O Brasil depende muito do **transporte rodoviário**, que leva a maior parte das cargas. Essa escolha vem dos anos 1950, com a chegada da indústria automobilística e a construção de rodovias por JK.

Problemas desse modelo:

- O caminhão é mais caro e consome mais combustível por tonelada transportada do que o trem ou o navio em longas distâncias.
- Mais acidentes, poluição e desgaste das estradas.
- Dependência do diesel: uma greve de caminhoneiros, como a de 2018, pode parar o país.

O **transporte ferroviário** e o **hidroviário** seriam mais baratos para cargas pesadas e longas distâncias, como grãos e minérios, mas são pouco desenvolvidos. A **cabotagem** (navegação pela costa) também é pouco usada.

## Escoamento da produção

A soja e o milho do Centro-Oeste precisam viajar milhares de quilômetros até os portos. Por isso cresceram os corredores pelo **Arco Norte**, usando rios da Amazônia e portos do Norte, encurtando o caminho até a Europa e a Ásia.

## Mobilidade urbana

Nas cidades, o transporte individual (carros e motos) gera congestionamentos, poluição e acidentes. Soluções: transporte público de qualidade (metrô, BRT), ciclovias e calçadas seguras.

## As regiões do Brasil

O IBGE divide o país em **cinco regiões**: Norte, Nordeste, Centro-Oeste, Sudeste e Sul. Elas seguem os limites dos estados.

Há também a divisão em **três complexos regionais** (geoeconômicos), proposta pelo geógrafo Pedro Geiger, que considera a economia e a ocupação, e não os limites dos estados:

- **Amazônia**, com baixa densidade e economia extrativa e agropecuária em expansão.
- **Nordeste**, com o litoral úmido, o agreste, o sertão semiárido e o meio-norte.
- **Centro-Sul**, a área mais industrializada e urbanizada.

## Integração e desigualdades regionais

O Estado brasileiro tentou integrar o território com obras como Brasília, a Transamazônica e a Zona Franca de Manaus, e com órgãos como a Sudene (para o Nordeste). Mesmo assim, as **desigualdades regionais** continuam grandes em renda, saúde e educação.

## Resumindo

O Brasil depende das rodovias, mais caras para cargas pesadas; ferrovias e hidrovias são pouco usadas. O IBGE divide o país em cinco regiões; os complexos regionais dividem em três. As desigualdades regionais persistem.`,
      highlights: [
        "O Brasil depende muito das rodovias, mais caras para longas distâncias.",
        "Ferrovias e hidrovias seriam melhores para grãos e minérios.",
        "O IBGE divide o país em cinco regiões; os complexos regionais, em três.",
        "Obras como Brasília e a Zona Franca de Manaus buscaram integrar o território.",
      ],
      keyPoints: [
        { term: "Matriz de transportes", explanation: "Distribuição das cargas entre rodovias, ferrovias, hidrovias e outros." },
        { term: "Cabotagem", explanation: "Navegação de cargas entre portos do mesmo país, pela costa." },
        { term: "Complexos regionais", explanation: "Divisão do Brasil em Amazônia, Nordeste e Centro-Sul pela economia." },
      ],
    },
  ],
  filosofia: [
    {
      title: "Filosofia medieval: fé e razão",
      content: `## Conciliar a fé com a razão

Na Idade Média, a grande questão da filosofia foi como conciliar a **fé cristã** com a **razão** herdada dos gregos. A filosofia estava a serviço da teologia: era a "serva da teologia".

## Patrística: Santo Agostinho

A **Patrística** foi a filosofia dos primeiros "pais da Igreja", entre os séculos 2 e 8. Seu maior nome é **Santo Agostinho**, que viveu no norte da África entre os séculos 4 e 5.

- Agostinho se inspirou em **Platão**: assim como o mundo das ideias é superior ao mundo sensível, a cidade de Deus é superior à cidade dos homens.
- Defendeu a **iluminação divina**: conhecemos a verdade porque Deus ilumina a nossa mente.
- Sobre o mal, disse que ele não é uma coisa criada por Deus, mas a **ausência do bem**, fruto do **livre-arbítrio** humano, a liberdade de escolher.
- Frase famosa: "Creio para compreender": a fé vem antes da razão.

## Escolástica: São Tomás de Aquino

A **Escolástica** foi a filosofia ensinada nas escolas e universidades medievais, a partir do século 11. Seu maior nome é **São Tomás de Aquino** (século 13).

- Tomás se inspirou em **Aristóteles**, cujos textos chegaram à Europa por meio dos árabes.
- Defendeu que fé e razão **não se contradizem**: as duas vêm de Deus. A razão pode chegar a algumas verdades, e a fé completa o que a razão não alcança.
- Criou as **cinco vias**, argumentos racionais para provar a existência de Deus, como a do **primeiro motor**: tudo que se move é movido por algo; deve existir um primeiro motor que não é movido por nada, que é Deus.

## A questão dos universais

Um debate famoso: as ideias gerais, como "humanidade" ou "beleza", existem de verdade ou são apenas nomes que damos às coisas? Os **realistas** diziam que existem; os **nominalistas**, como Guilherme de Ockham, diziam que são só nomes. Ockham também propôs a "navalha": entre duas explicações, prefira a mais simples.

## A herança árabe e judaica

Pensadores árabes, como **Averróis** e **Avicena**, e judeus, como **Maimônides**, preservaram e comentaram Aristóteles e influenciaram a filosofia cristã.

## Resumindo

A filosofia medieval buscou conciliar fé e razão. Santo Agostinho, inspirado em Platão, colocou a fé antes da razão e explicou o mal pelo livre-arbítrio. São Tomás de Aquino, inspirado em Aristóteles, defendeu que fé e razão se completam.`,
      highlights: [
        "A filosofia medieval buscou conciliar a fé cristã com a razão grega.",
        "Agostinho (inspirado em Platão): o mal é ausência do bem e vem do livre-arbítrio.",
        "Tomás de Aquino (inspirado em Aristóteles): fé e razão não se contradizem.",
        "As cinco vias de Tomás tentam provar racionalmente a existência de Deus.",
      ],
      keyPoints: [
        { term: "Livre-arbítrio", explanation: "Liberdade humana de escolher entre o bem e o mal." },
        { term: "Escolástica", explanation: "Filosofia das escolas e universidades medievais, com Tomás de Aquino." },
        { term: "Navalha de Ockham", explanation: "Princípio de preferir a explicação mais simples." },
      ],
    },
    {
      title: "Ciência, conhecimento e verdade",
      content: `## O que é conhecimento científico

Existem vários tipos de conhecimento: o **senso comum** (aprendido no dia a dia, sem método), o **religioso** (baseado na fé), o **filosófico** (reflexão racional) e o **científico** (baseado em método, observação e teste).

## O método científico

Na Idade Moderna, com Galileu, Bacon e Descartes, a ciência passou a usar um **método**:

1. Observação de um fenômeno.
2. Formulação de uma **hipótese**.
3. **Experimentação** para testar a hipótese.
4. Conclusão e formulação de leis e teorias.

- **Indução:** partir de casos particulares para chegar a uma regra geral. "Todos os cisnes que vi são brancos; logo, todos os cisnes são brancos." O problema é que basta um cisne negro para derrubar a conclusão.
- **Dedução:** partir de uma regra geral para um caso particular, como no silogismo.

## Karl Popper: a falseabilidade

Para **Karl Popper**, uma teoria só é científica se puder ser **falseada**, ou seja, se for possível imaginar um teste que mostre que ela está errada. A ciência não prova verdades definitivas: ela testa as teorias e descarta as que falham. Teorias que explicam tudo e não podem ser testadas não são científicas.

## Thomas Kuhn: os paradigmas

**Thomas Kuhn** mostrou que a ciência não avança só acumulando conhecimento. Em cada época, os cientistas trabalham dentro de um **paradigma**, um modelo aceito por todos. Quando surgem problemas que o paradigma não explica, acontece uma **revolução científica**, e um novo paradigma substitui o antigo. Exemplo: a troca do geocentrismo pelo heliocentrismo.

## Ciência, ética e sociedade

A ciência trouxe vacinas, tecnologia e mais tempo de vida, mas também bombas atômicas e problemas ambientais. Por isso, o ENEM cobra a reflexão sobre a **ética na ciência**: experimentos com seres vivos, manipulação genética, inteligência artificial.

Outro tema atual é o **negacionismo científico**: rejeitar conclusões da ciência, como a eficácia das vacinas ou o aquecimento global, sem base em evidências. A confiança na ciência vem do método, da revisão por outros cientistas e da possibilidade de corrigir erros.

## Verdade

Há diferentes ideias de verdade: como **correspondência** com a realidade, como **coerência** entre ideias, ou como algo **útil** na prática (pragmatismo).

## Resumindo

O conhecimento científico se baseia em método e experimentação. Para Popper, uma teoria científica precisa poder ser falseada. Para Kuhn, a ciência muda por revoluções que trocam paradigmas. A ciência precisa de ética e combate ao negacionismo.`,
      highlights: [
        "Senso comum não tem método; o conhecimento científico usa observação e teste.",
        "Indução vai do particular ao geral; dedução, do geral ao particular.",
        "Popper: uma teoria científica precisa poder ser falseada.",
        "Kuhn: a ciência muda por revoluções que trocam o paradigma.",
      ],
      keyPoints: [
        { term: "Hipótese", explanation: "Explicação provisória que será testada." },
        { term: "Falseabilidade", explanation: "Possibilidade de uma teoria ser testada e mostrada falsa (Popper)." },
        { term: "Paradigma", explanation: "Modelo científico aceito em uma época (Kuhn)." },
      ],
    },
  ],
  sociologia: [
    {
      title: "Trabalho e sociedade: do fordismo à uberização",
      content: `## O trabalho organiza a sociedade

O jeito como trabalhamos mudou muito nos últimos 150 anos, e essas mudanças são um dos temas mais cobrados pelo ENEM.

## Taylorismo

No início do século 20, **Frederick Taylor** propôs a **administração científica** do trabalho: dividir as tarefas em partes simples, cronometrar cada movimento e pagar por produção. O trabalhador repetia sempre o mesmo gesto, sem pensar no processo como um todo.

## Fordismo

**Henry Ford** aplicou essas ideias na fábrica de automóveis e criou a **linha de montagem**: o carro passa por uma esteira e cada operário faz uma única tarefa.

- **Produção em massa** de produtos padronizados.
- Grandes estoques.
- Salários maiores para que os próprios trabalhadores pudessem consumir.
- Trabalho repetitivo e alienante, criticado no filme Tempos Modernos, de Charles Chaplin.

## Toyotismo

Depois dos anos 1970, a empresa japonesa Toyota criou um novo modelo, a **acumulação flexível**:

- **Just in time:** produzir só o que já foi vendido, sem grandes estoques.
- Trabalhador **multifuncional**, que opera várias máquinas.
- Controle de qualidade e trabalho em equipe.
- **Terceirização** de partes da produção.

## Precarização e uberização

A flexibilização trouxe a **precarização** do trabalho: contratos temporários, terceirização, salários menores, menos direitos e insegurança.

A **uberização** é o trabalho mediado por **aplicativos**, como os de transporte e entrega. O trabalhador é chamado de "parceiro" ou "empreendedor", mas não tem carteira assinada, férias, nem previdência garantida, e assume os custos (carro, combustível, celular). O algoritmo controla as tarefas e a remuneração. É um debate atual sobre direitos trabalhistas.

## Outros temas

- **Desemprego estrutural:** causado pela automação e pelas novas tecnologias, e não por uma crise passageira.
- **Informalidade:** milhões de brasileiros trabalham sem carteira assinada.
- **Trabalho análogo à escravidão:** ainda é encontrado no campo e nas cidades.
- **Divisão sexual do trabalho:** as mulheres fazem a maior parte do trabalho doméstico e de cuidado, sem remuneração.

## Resumindo

Taylor dividiu e cronometrou o trabalho; Ford criou a linha de montagem e a produção em massa; o toyotismo trouxe o just in time e o trabalhador multifuncional. Hoje, a precarização e a uberização reduzem direitos.`,
      highlights: [
        "Taylorismo: divisão das tarefas e controle do tempo.",
        "Fordismo: linha de montagem e produção em massa.",
        "Toyotismo: just in time, sem grandes estoques, e trabalhador multifuncional.",
        "Uberização: trabalho por aplicativo, sem direitos trabalhistas garantidos.",
      ],
      keyPoints: [
        { term: "Linha de montagem", explanation: "Sistema de Ford em que cada operário faz uma tarefa na esteira." },
        { term: "Just in time", explanation: "Produzir apenas o necessário, na hora certa, sem estoques." },
        { term: "Precarização", explanation: "Perda de direitos, segurança e estabilidade no trabalho." },
      ],
    },
    {
      title: "Estado, poder e política",
      content: `## O que é o Estado

O **Estado** é a organização política que governa um território e uma população, com leis, instituições e o direito de usar a força. Max Weber o definiu como a instituição que tem o **monopólio do uso legítimo da violência** em um território.

Não confunda: **Estado** é a estrutura permanente (instituições); **governo** é o grupo que está no poder por um período; **nação** é um povo com identidade cultural comum.

## Formas de governo e regimes

- **Monarquia** (rei, cargo hereditário) e **república** (governante eleito, por tempo determinado).
- **Presidencialismo** (o presidente é chefe de Estado e de governo, como no Brasil) e **parlamentarismo** (o primeiro-ministro, escolhido pelo parlamento, chefia o governo).
- **Democracia:** o poder vem do povo, com eleições livres, liberdade de expressão e respeito às minorias.
- **Autoritarismo** e **totalitarismo:** concentração do poder, sem liberdades; o totalitarismo controla todos os aspectos da vida.

## Os três poderes no Brasil

- **Executivo:** administra e executa as leis (presidente, governadores, prefeitos).
- **Legislativo:** faz as leis e fiscaliza o Executivo (Congresso Nacional, assembleias, câmaras de vereadores).
- **Judiciário:** julga e garante o cumprimento das leis.

Esse sistema de **freios e contrapesos** impede que um poder domine os outros.

## Tipos de Estado

- **Estado liberal:** intervém pouco na economia, protege a propriedade e as liberdades individuais.
- **Estado de bem-estar social:** garante direitos sociais, como saúde, educação e previdência públicas. Cresceu na Europa depois da Segunda Guerra.
- **Neoliberalismo:** a partir dos anos 1980, defendeu reduzir o Estado, privatizar empresas e cortar gastos sociais.

## Participação política

Além do voto, a participação se dá por partidos, sindicatos, movimentos sociais, conselhos, audiências públicas, abaixo-assinados e iniciativa popular de leis. A **Lei da Ficha Limpa** (2010) nasceu de uma iniciativa popular.

## Poder simbólico e ideologia

Para Pierre Bourdieu, o **poder simbólico** é o poder de impor uma visão de mundo como se fosse natural, por meio da linguagem, da educação e da cultura. A **ideologia** pode fazer a desigualdade parecer normal.

## Resumindo

Estado é a estrutura permanente; governo, quem está no poder. A democracia garante eleições e liberdades. No Brasil, há três poderes que se controlam. O Estado pode ser liberal, de bem-estar social ou neoliberal.`,
      highlights: [
        "Weber: o Estado tem o monopólio do uso legítimo da violência.",
        "Estado é a estrutura permanente; governo é quem está no poder por um tempo.",
        "Executivo administra, Legislativo faz as leis e Judiciário julga.",
        "Estado de bem-estar social garante saúde, educação e previdência públicas.",
      ],
      keyPoints: [
        { term: "Freios e contrapesos", explanation: "Sistema em que os três poderes se fiscalizam e se limitam." },
        { term: "Neoliberalismo", explanation: "Política de reduzir o Estado, privatizar e cortar gastos." },
        { term: "Poder simbólico", explanation: "Para Bourdieu, poder de impor uma visão de mundo como natural." },
      ],
    },
  ],
};
