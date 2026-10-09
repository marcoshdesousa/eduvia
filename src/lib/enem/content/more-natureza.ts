import type { EnemLesson } from "./types";

/** Aulas a mais de Ciências da Natureza (entram depois das primeiras). */
export const MORE_NATUREZA: Record<string, EnemLesson[]> = {
  biologia: [
    {
      title: "Plantas: grupos, fotossíntese e adaptações",
      content: `## Os grandes grupos de plantas

As plantas são divididas em quatro grupos, de acordo com a presença de vasos condutores, sementes, flores e frutos:

- **Briófitas** (musgos): sem vasos condutores, pequenas, vivem em lugares úmidos. Dependem da água para a reprodução.
- **Pteridófitas** (samambaias): têm vasos condutores, mas não têm sementes. Reproduzem-se por esporos.
- **Gimnospermas** (pinheiros, araucária): têm sementes, mas **sem frutos** ("semente nua"). A araucária, típica do Sul, produz o pinhão.
- **Angiospermas:** têm **flores e frutos**. São o grupo mais diverso: feijão, laranjeira, milho, ipê.

## Partes da planta e transporte

- A **raiz** absorve água e sais minerais do solo.
- O **xilema** leva a seiva bruta (água e sais) da raiz até as folhas.
- O **floema** leva a seiva elaborada (açúcares produzidos na fotossíntese) das folhas para o resto da planta.
- Nas folhas, os **estômatos** são pequenas aberturas que controlam a entrada de gás carbônico e a saída de vapor d'água (transpiração).

## Fotossíntese

Nos cloroplastos, a planta usa a luz para transformar gás carbônico e água em glicose, liberando oxigênio. Fatores que aumentam a fotossíntese: mais luz, mais gás carbônico e temperatura adequada, até um limite.

## Polinização e frutos

Nas angiospermas, a **polinização** leva o pólen até a parte feminina da flor. Pode ser feita pelo vento, pela água ou por animais, como **abelhas**, borboletas, morcegos e beija-flores. O declínio das abelhas, causado por agrotóxicos e destruição de habitats, ameaça a produção de alimentos.

Depois da fecundação, a flor forma o **fruto**, que protege a semente e ajuda na sua dispersão por animais, vento ou água.

## Adaptações

- **Cactos** da Caatinga: folhas transformadas em espinhos (menos perda de água), caule que armazena água e raízes extensas.
- Plantas do **Cerrado**: raízes profundas para alcançar a água e casca grossa que resiste ao fogo.
- **Mangue**: raízes aéreas (pneumatóforos) para respirar no solo encharcado e pobre em oxigênio.

## Hormônios vegetais

As **auxinas** controlam o crescimento e fazem a planta crescer em direção à luz (fototropismo). O **etileno** amadurece os frutos: por isso uma banana madura junto de outras acelera o amadurecimento delas.

## Resumindo

Briófitas não têm vasos; pteridófitas não têm sementes; gimnospermas têm sementes sem frutos; angiospermas têm flores e frutos. O xilema leva a seiva bruta, o floema a elaborada. A polinização por abelhas é essencial para os alimentos.`,
      highlights: [
        "Briófitas sem vasos; pteridófitas sem sementes; gimnospermas sem frutos; angiospermas com flores e frutos.",
        "Xilema leva a seiva bruta; floema leva a seiva elaborada.",
        "Estômatos controlam as trocas de gases e a transpiração.",
        "O etileno amadurece os frutos.",
      ],
      keyPoints: [
        { term: "Angiosperma", explanation: "Planta com flores e frutos, o grupo mais diverso." },
        { term: "Estômato", explanation: "Abertura nas folhas para trocas de gases e saída de vapor d'água." },
        { term: "Polinização", explanation: "Transporte do pólen até a parte feminina da flor." },
      ],
    },
    {
      title: "Classificação dos seres vivos e animais",
      content: `## Organizar a diversidade da vida

Os seres vivos são classificados em grupos, do mais amplo para o mais específico: **domínio, reino, filo, classe, ordem, família, gênero e espécie**.

O **nome científico** tem duas partes, em latim, e é escrito em itálico: o gênero (com inicial maiúscula) e o epíteto específico (minúscula). O ser humano é *Homo sapiens*; o cachorro, *Canis familiaris*.

**Espécie** é o grupo de indivíduos que podem cruzar entre si e gerar descendentes **férteis**. O cavalo e a jumenta podem gerar a mula, mas ela é estéril, por isso cavalo e jumento são espécies diferentes.

## Os reinos

- **Monera:** bactérias, procariontes.
- **Protista:** protozoários e algas, eucariontes simples.
- **Fungi:** fungos (cogumelos, bolores, leveduras). São heterótrofos e decompositores.
- **Plantae:** plantas, autótrofas, fazem fotossíntese.
- **Animalia:** animais, heterótrofos e multicelulares.

Os **vírus** não entram em nenhum reino: não têm célula e só se reproduzem dentro de outras células.

## Principais grupos de animais

**Invertebrados:**

- **Poríferos** (esponjas) e **cnidários** (águas-vivas, corais).
- **Platelmintos** (vermes achatados, como a tênia e o esquistossomo) e **nematelmintos** (vermes cilíndricos, como a lombriga).
- **Anelídeos** (minhoca), importantes para arejar e fertilizar o solo.
- **Moluscos** (caramujo, polvo).
- **Artrópodes:** o maior grupo, com esqueleto externo e patas articuladas: insetos, aracnídeos, crustáceos.
- **Equinodermos** (estrela-do-mar).

**Vertebrados (cordados):**

- **Peixes:** respiram por brânquias.
- **Anfíbios** (sapos): vivem na água quando jovens (girinos) e na terra quando adultos; têm pele fina e úmida, sensível à poluição.
- **Répteis:** pele com escamas e ovos com casca, que permitiram a vida totalmente terrestre.
- **Aves:** penas, ossos leves e ocos, sangue quente.
- **Mamíferos:** pelos, glândulas mamárias e sangue quente.

## Sangue quente e frio

Aves e mamíferos são **endotérmicos** (mantêm a temperatura do corpo constante). Peixes, anfíbios e répteis são **ectotérmicos**: a temperatura do corpo varia com o ambiente, por isso o lagarto toma sol.

## Resumindo

A classificação vai do domínio à espécie, e o nome científico tem gênero e espécie. Espécie é quem gera descendentes férteis. Os artrópodes são o maior grupo animal. Aves e mamíferos têm sangue quente.`,
      highlights: [
        "Classificação: domínio, reino, filo, classe, ordem, família, gênero e espécie.",
        "Espécie: indivíduos que geram descendentes férteis.",
        "Vírus não pertencem a nenhum reino: não têm célula.",
        "Aves e mamíferos mantêm a temperatura do corpo constante.",
      ],
      keyPoints: [
        { term: "Nome científico", explanation: "Nome em latim, com gênero e espécie, como Homo sapiens." },
        { term: "Artrópodes", explanation: "Maior grupo animal: insetos, aracnídeos e crustáceos." },
        { term: "Ectotérmico", explanation: "Animal cuja temperatura do corpo varia com o ambiente." },
      ],
    },
    {
      title: "Reprodução humana, métodos contraceptivos e IST",
      content: `## Sistemas reprodutores

- **Masculino:** os **testículos** produzem os espermatozoides e o hormônio **testosterona**. Os espermatozoides passam pelo ducto deferente e saem com o sêmen pela uretra.
- **Feminino:** os **ovários** produzem os óvulos e os hormônios **estrogênio** e **progesterona**. A fecundação acontece geralmente nas **tubas uterinas**, e o embrião se fixa no **útero**.

## Ciclo menstrual

Dura em média 28 dias. Por volta do 14º dia ocorre a **ovulação**. Se não há fecundação, a camada interna do útero (endométrio) descama, e isso é a **menstruação**. Os hormônios do ciclo são controlados pela hipófise, no cérebro.

## Fecundação e desenvolvimento

O espermatozoide encontra o óvulo e forma o **zigoto**, que se divide e vira embrião. A **placenta** permite a troca de nutrientes, oxigênio e gás carbônico entre a mãe e o feto, por isso álcool, cigarro e drogas usados pela gestante chegam ao bebê.

**Gêmeos idênticos (univitelinos)** vêm de um só zigoto que se divide; são geneticamente iguais. **Gêmeos fraternos** vêm de dois óvulos fecundados por dois espermatozoides diferentes.

## Métodos contraceptivos

- **Preservativo** (camisinha masculina ou feminina): o **único** que também protege contra as infecções sexualmente transmissíveis.
- **Pílula anticoncepcional:** hormônios que impedem a ovulação.
- **DIU:** dispositivo colocado no útero.
- **Laqueadura** (corte das tubas) e **vasectomia** (corte dos ductos deferentes): métodos cirúrgicos e considerados definitivos.
- **Tabelinha:** evitar relações nos dias férteis; é pouco segura.

## Infecções sexualmente transmissíveis (IST)

- **Virais:** HIV (que causa a aids), HPV (ligado ao câncer do colo do útero, prevenido por vacina), herpes e hepatite B.
- **Bacterianas:** sífilis, gonorreia e clamídia, tratadas com antibióticos.

A prevenção envolve o uso de preservativo, a vacinação (HPV e hepatite B) e a testagem. A sífilis voltou a crescer no Brasil, e a **sífilis congênita** passa da mãe para o bebê, por isso o teste no pré-natal é essencial.

## Resumindo

A fecundação ocorre nas tubas e o embrião se fixa no útero. A placenta faz as trocas entre mãe e feto. A camisinha é o único método que também previne as IST. A vacina contra o HPV previne o câncer do colo do útero.`,
      highlights: [
        "A fecundação ocorre nas tubas uterinas; o embrião se fixa no útero.",
        "A placenta faz as trocas entre mãe e feto: álcool e drogas chegam ao bebê.",
        "Gêmeos idênticos vêm de um só zigoto.",
        "A camisinha é o único método que também protege contra as IST.",
      ],
      keyPoints: [
        { term: "Ovulação", explanation: "Liberação do óvulo pelo ovário, por volta da metade do ciclo." },
        { term: "Zigoto", explanation: "Célula formada pela união do espermatozoide com o óvulo." },
        { term: "IST", explanation: "Infecções sexualmente transmissíveis, como HIV, sífilis e HPV." },
      ],
    },
    {
      title: "Micro-organismos: vírus, bactérias e fungos",
      content: `## O mundo invisível

Os micro-organismos estão em todo lugar. Muitos causam doenças, mas a maioria é **útil** ou essencial para a vida no planeta.

## Vírus

- **Não têm célula:** são formados por material genético (DNA ou RNA) envolto por uma cápsula de proteína.
- São **parasitas obrigatórios**: só se reproduzem dentro de uma célula, usando a "maquinaria" dela.
- **Antibióticos não funcionam** contra vírus. O combate é feito com **vacinas**, alguns antivirais e prevenção.
- Mutam com frequência, por isso surgem novas variantes, como no vírus da gripe e no coronavírus.

## Bactérias

- São **procariontes** (célula sem núcleo organizado).
- Algumas causam doenças (tuberculose, cólera, tétano), tratadas com **antibióticos**.
- A maioria é útil: decompõem a matéria orgânica, fixam o nitrogênio no solo, vivem no nosso intestino (a **microbiota**) ajudando na digestão e na defesa.
- São usadas na produção de **iogurte**, queijo, vinagre e na **biotecnologia** (bactérias que produzem insulina).
- **Resistência:** o uso errado de antibióticos (sem receita, sem completar o tratamento) seleciona bactérias resistentes, um grave problema de saúde pública.

## Fungos

- Eucariontes, heterótrofos. Incluem cogumelos, bolores e **leveduras**.
- São **decompositores** essenciais.
- Leveduras fazem **fermentação**: usadas no pão, na cerveja, no vinho e na produção de **etanol**.
- O fungo *Penicillium* deu origem à **penicilina**, o primeiro antibiótico, descoberto por Alexander Fleming em 1928.
- Alguns causam doenças, como micoses e candidíase.

## Protozoários

Seres unicelulares eucariontes. Alguns causam doenças: malária, doença de Chagas, leishmaniose, giardíase e amebíase.

## Conservação dos alimentos

Para evitar a ação dos micro-organismos, usamos: **refrigeração** (desacelera o crescimento), **pasteurização** (aquecimento rápido), **salga** e **açúcar** em grande quantidade (tiram água por osmose), **desidratação** e **embalagem a vácuo**.

## Resumindo

Vírus não têm célula e só se reproduzem em outras células; antibiótico não age sobre eles. Bactérias e fungos causam doenças, mas são essenciais na decomposição, nos alimentos e nos remédios. O uso errado de antibióticos cria bactérias resistentes.`,
      highlights: [
        "Vírus não têm célula e só se reproduzem dentro de outras células.",
        "Antibióticos atuam em bactérias, não em vírus.",
        "Leveduras fazem fermentação: pão, bebidas e etanol.",
        "Sal e açúcar conservam alimentos tirando água dos micro-organismos (osmose).",
      ],
      keyPoints: [
        { term: "Microbiota", explanation: "Conjunto de micro-organismos que vivem no nosso corpo, como no intestino." },
        { term: "Pasteurização", explanation: "Aquecimento rápido que elimina micro-organismos dos alimentos." },
        { term: "Penicilina", explanation: "Primeiro antibiótico, obtido de um fungo por Fleming em 1928." },
      ],
    },
  ],
  quimica: [
    {
      title: "Átomo e tabela periódica",
      content: `## Do que a matéria é feita

Toda matéria é formada por **átomos**. O átomo tem:

- **Núcleo:** com **prótons** (carga positiva) e **nêutrons** (sem carga).
- **Eletrosfera:** com **elétrons** (carga negativa), muito mais leves, em níveis de energia ao redor do núcleo.

O **número atômico (Z)** é o número de prótons e identifica o elemento. O **número de massa (A)** é prótons mais nêutrons.

- **Isótopos:** mesmo número de prótons, nêutrons diferentes. O carbono-12 e o carbono-14 são isótopos. O carbono-14 é radioativo e serve para datar fósseis.
- **Íons:** átomos que ganharam elétrons (ânions, negativos) ou perderam elétrons (cátions, positivos).

## Modelos atômicos

- **Dalton:** átomo como esfera maciça e indivisível ("bola de bilhar").
- **Thomson:** esfera positiva com elétrons espalhados ("pudim de passas").
- **Rutherford:** núcleo pequeno e denso, com os elétrons girando ao redor e muito espaço vazio.
- **Bohr:** elétrons em níveis de energia. Quando um elétron recebe energia, sobe de nível; ao voltar, emite **luz** de cor característica. É assim que funcionam os fogos de artifício e o teste de chama.

## Tabela periódica

Os elementos são organizados em ordem de número atômico.

- **Períodos** (linhas horizontais): indicam o número de camadas de elétrons.
- **Grupos ou famílias** (colunas): elementos com propriedades parecidas.
  - Grupo 1: **metais alcalinos** (sódio, potássio), muito reativos.
  - Grupo 2: **alcalinoterrosos** (cálcio, magnésio).
  - Grupo 17: **halogênios** (flúor, cloro).
  - Grupo 18: **gases nobres** (hélio, neônio, argônio), estáveis e pouco reativos.

Os **metais** ficam à esquerda e no centro: são bons condutores de calor e eletricidade, brilhantes e maleáveis. Os **ametais** ficam à direita.

## Propriedades periódicas

- **Raio atômico:** aumenta para baixo e para a esquerda na tabela.
- **Eletronegatividade:** a tendência de atrair elétrons; o flúor é o mais eletronegativo. Aumenta para cima e para a direita.

## Resumindo

O átomo tem prótons e nêutrons no núcleo e elétrons na eletrosfera. Isótopos têm o mesmo número de prótons. No modelo de Bohr, o elétron que volta de nível emite luz. Na tabela, grupos reúnem elementos com propriedades parecidas.`,
      highlights: [
        "Número atômico é o número de prótons e identifica o elemento.",
        "Isótopos têm o mesmo número de prótons e nêutrons diferentes.",
        "Bohr: o elétron que volta de nível emite luz (fogos de artifício).",
        "Elementos do mesmo grupo têm propriedades parecidas; gases nobres são estáveis.",
      ],
      keyPoints: [
        { term: "Isótopos", explanation: "Átomos do mesmo elemento com números de nêutrons diferentes." },
        { term: "Cátion e ânion", explanation: "Íon positivo (perdeu elétrons) e íon negativo (ganhou elétrons)." },
        { term: "Eletronegatividade", explanation: "Tendência de um átomo atrair elétrons numa ligação." },
      ],
    },
    {
      title: "Ligações químicas e polaridade",
      content: `## Por que os átomos se ligam

Os átomos se ligam para ficar mais **estáveis**, geralmente com oito elétrons na última camada, como os gases nobres (a **regra do octeto**).

## Ligação iônica

Ocorre entre um **metal** e um **ametal**: o metal **perde** elétrons e o ametal **ganha**, formando íons de cargas opostas que se atraem. Exemplo: o sal de cozinha, NaCl (cloreto de sódio).

Compostos iônicos: sólidos em temperatura ambiente, com altos pontos de fusão, e conduzem eletricidade quando **dissolvidos na água** ou derretidos.

## Ligação covalente

Ocorre entre **ametais**, que **compartilham** pares de elétrons. Exemplos: água (H2O), gás carbônico (CO2), oxigênio (O2), açúcar. Formam moléculas.

## Ligação metálica

Entre átomos de metais: os elétrons ficam livres, numa "nuvem", o que explica por que os metais conduzem bem a eletricidade e o calor.

## Polaridade

Numa ligação entre átomos diferentes, o mais eletronegativo puxa os elétrons para si, criando polos. Uma molécula é:

- **Polar:** quando tem polos, como a **água**.
- **Apolar:** quando os polos se anulam ou não existem, como o óleo, a gasolina e o gás carbônico.

**Semelhante dissolve semelhante:** substâncias polares se dissolvem em polares (sal e açúcar na água); apolares em apolares (gordura na gasolina). Por isso água e óleo não se misturam, e o sabão, com uma parte polar e outra apolar, consegue unir as duas.

## Forças intermoleculares

São as atrações **entre** as moléculas. Da mais fraca para a mais forte:

- **Dipolo induzido** (forças de London): entre moléculas apolares.
- **Dipolo permanente:** entre moléculas polares.
- **Ligação de hidrogênio:** a mais forte, quando o hidrogênio está ligado a flúor, oxigênio ou nitrogênio. Ocorre na água e no DNA.

Quanto mais fortes as forças intermoleculares, **maior o ponto de ebulição**. A água ferve a 100 °C, uma temperatura alta para uma molécula tão pequena, por causa das ligações de hidrogênio.

## Resumindo

Iônica: metal + ametal, com transferência de elétrons. Covalente: ametais compartilham elétrons. A água é polar; o óleo, apolar; semelhante dissolve semelhante. Ligações de hidrogênio explicam o alto ponto de ebulição da água.`,
      highlights: [
        "Ligação iônica: metal perde e ametal ganha elétrons, como no sal de cozinha.",
        "Ligação covalente: ametais compartilham elétrons, como na água.",
        "Semelhante dissolve semelhante: polar com polar, apolar com apolar.",
        "Ligações de hidrogênio explicam o alto ponto de ebulição da água.",
      ],
      keyPoints: [
        { term: "Regra do octeto", explanation: "Átomos tendem a ficar estáveis com oito elétrons na última camada." },
        { term: "Molécula polar", explanation: "Molécula com distribuição desigual de cargas, como a água." },
        { term: "Ligação de hidrogênio", explanation: "Atração forte entre moléculas com H ligado a F, O ou N." },
      ],
    },
    {
      title: "Funções inorgânicas: ácidos, bases, sais e óxidos",
      content: `## As quatro funções

As substâncias inorgânicas são organizadas em quatro funções principais.

## Ácidos

Liberam íons **H+** na água. Têm sabor azedo e reagem com metais.

- **Ácido clorídrico (HCl):** presente no suco gástrico do estômago.
- **Ácido sulfúrico (H2SO4):** o mais produzido pela indústria; usado em baterias de carro e fertilizantes.
- **Ácido acético:** o do vinagre.
- **Ácido cítrico:** nas frutas cítricas.
- **Ácido carbônico:** nos refrigerantes (gás carbônico dissolvido).

## Bases (hidróxidos)

Liberam íons **OH−** na água. Têm sabor adstringente ("amarram" a boca) e sensação escorregadia.

- **Hidróxido de sódio (NaOH):** a soda cáustica, usada para fazer sabão e desentupir canos.
- **Hidróxido de magnésio:** o leite de magnésia, antiácido e laxante.
- **Hidróxido de cálcio:** a cal hidratada, usada na construção e para corrigir a acidez do solo.
- **Amônia:** em produtos de limpeza.

## Sais

Formados na **neutralização** entre ácido e base: ácido + base → sal + água.

- **Cloreto de sódio (NaCl):** o sal de cozinha.
- **Bicarbonato de sódio:** fermento e antiácido.
- **Carbonato de cálcio:** calcário, mármore, cascas de ovo.
- **Nitratos e fosfatos:** fertilizantes; em excesso nos rios, causam eutrofização.

## Óxidos

Compostos de um elemento com o oxigênio.

- **Óxidos ácidos**, como o **CO2**, o **SO2** e os **NOx**: reagem com a água formando ácidos. São os responsáveis pela **chuva ácida**.
- **Óxidos básicos**, como a **cal virgem (CaO)**: reagem com a água formando bases.
- **Monóxido de carbono (CO):** óxido neutro e muito tóxico, produzido na combustão incompleta.

## Indicadores

Substâncias que mudam de cor conforme o meio é ácido ou básico. A **fenolftaleína** fica rosa em meio básico e incolor em meio ácido. O suco de **repolho roxo** é um indicador natural que muda de cor em toda a escala de pH.

## No cotidiano

- **Azia:** excesso de ácido no estômago, tratado com antiácidos (bases fracas ou bicarbonato).
- **Solo ácido:** corrigido com calcário (**calagem**).
- **Picada de formiga:** libera ácido fórmico.

## Resumindo

Ácidos liberam H+ (vinagre, suco gástrico); bases liberam OH− (soda cáustica, leite de magnésia). Ácido + base dá sal + água. Óxidos ácidos, como SO2 e NOx, causam a chuva ácida.`,
      highlights: [
        "Ácidos liberam H+; bases liberam OH−.",
        "Neutralização: ácido + base → sal + água.",
        "Óxidos ácidos (SO2, NOx) causam a chuva ácida.",
        "Antiácidos (bases fracas) neutralizam o excesso de ácido do estômago.",
      ],
      keyPoints: [
        { term: "Indicador ácido-base", explanation: "Substância que muda de cor conforme o pH, como a fenolftaleína." },
        { term: "Óxido", explanation: "Composto formado por um elemento ligado ao oxigênio." },
        { term: "Calagem", explanation: "Uso de calcário para corrigir a acidez do solo." },
      ],
    },
  ],
  fisica: [
    {
      title: "Hidrostática: pressão, empuxo e Pascal",
      content: `## Pressão

**Pressão** é a força distribuída sobre uma área: P = F ÷ A. A mesma força em uma área menor gera pressão maior.

- Por isso a faca afiada corta melhor (área pequena) e o salto fino afunda na areia.
- E por isso esquis e raquetes de neve impedem de afundar (área grande).

## Pressão nos líquidos

A pressão dentro de um líquido **aumenta com a profundidade**: P = densidade × gravidade × altura. A cada 10 metros de água, a pressão aumenta cerca de 1 atmosfera.

- Por isso as barragens são mais grossas na base.
- Mergulhadores sentem a pressão nos ouvidos ao descer.
- A caixa-d'água fica no alto para dar pressão à água das torneiras.

## Pressão atmosférica

O ar também pesa e exerce pressão. Ao nível do mar, ela vale cerca de 1 atmosfera; em lugares altos, é **menor**. Por isso, em cidades altas, a água ferve abaixo de 100 °C. O **canudinho** funciona porque, ao sugar, você diminui a pressão dentro dele, e a pressão atmosférica empurra o líquido para cima.

## Princípio de Pascal

Uma pressão aplicada a um líquido se transmite **igualmente** para todos os pontos dele. É a base do **elevador hidráulico** e dos **freios hidráulicos** dos carros: uma força pequena num pistão de área pequena vira uma força grande num pistão de área grande.

## Princípio de Arquimedes: empuxo

Todo corpo mergulhado num líquido recebe uma força para **cima**, o **empuxo**, igual ao peso do líquido deslocado.

- Se o peso do corpo é **maior** que o empuxo, ele afunda.
- Se é **menor**, ele sobe e flutua.

Na prática, comparamos densidades: um objeto **menos denso** que o líquido flutua. O gelo flutua na água porque é menos denso. Um navio de aço flutua porque seu formato oco desloca muita água. No Mar Morto, muito salgado e denso, as pessoas boiam com facilidade.

## Densidade

**Densidade** = massa ÷ volume. A água tem densidade de 1 g/cm³. O óleo é menos denso e fica por cima da água.

## Resumindo

Pressão é força sobre área. Nos líquidos, ela aumenta com a profundidade. Pascal: a pressão se transmite igualmente (elevador hidráulico). Arquimedes: o empuxo é igual ao peso do líquido deslocado; menos denso flutua.`,
      highlights: [
        "Pressão = força ÷ área: menos área, mais pressão.",
        "A pressão nos líquidos aumenta com a profundidade.",
        "Princípio de Pascal: base do elevador e do freio hidráulico.",
        "Empuxo: corpos menos densos que o líquido flutuam.",
      ],
      keyPoints: [
        { term: "Pressão atmosférica", explanation: "Pressão do ar; diminui com a altitude." },
        { term: "Empuxo", explanation: "Força para cima igual ao peso do líquido deslocado (Arquimedes)." },
        { term: "Densidade", explanation: "Massa dividida pelo volume; a água tem 1 g/cm³." },
      ],
    },
    {
      title: "Gravitação e movimento circular",
      content: `## A gravidade

**Isaac Newton** percebeu que a mesma força que faz uma maçã cair mantém a Lua girando ao redor da Terra. Pela **Lei da Gravitação Universal**, todos os corpos se atraem com uma força que:

- **Aumenta** com as massas dos corpos.
- **Diminui** com o **quadrado** da distância: se a distância dobra, a força fica **4 vezes menor**.

## Peso e gravidade em outros lugares

A aceleração da gravidade na Terra é cerca de 10 m/s². Na Lua, é cerca de 1/6 disso. Por isso um astronauta pesa menos na Lua, embora a **massa** continue a mesma.

## As leis de Kepler

Johannes Kepler descreveu o movimento dos planetas:

1. As órbitas são **elipses**, com o Sol num dos focos.
2. O planeta anda **mais rápido** quando está mais perto do Sol e mais devagar quando está longe.
3. Quanto **mais longe** do Sol, **maior** o tempo para dar uma volta (o ano do planeta).

## Satélites

Um satélite fica em órbita porque está "caindo" ao redor da Terra o tempo todo: a gravidade o puxa, mas a velocidade horizontal o faz contornar o planeta. Os **satélites geoestacionários** dão uma volta a cada 24 horas, junto com a rotação da Terra, e parecem parados no céu. São usados para TV e telecomunicações. Os satélites de GPS e de observação ficam em outras órbitas.

Os astronautas na estação espacial **flutuam** não porque não há gravidade, mas porque estão em queda livre junto com a estação.

## Movimento circular

- **Período (T):** tempo de uma volta completa.
- **Frequência (f):** número de voltas por segundo (ou por minuto, como em rotações por minuto, rpm). f = 1 ÷ T.
- Num movimento circular, mesmo com velocidade constante, existe aceleração, porque a **direção** muda. A força que aponta para o centro é a **força centrípeta**.

Exemplos: o carro numa curva (o atrito dos pneus faz a força centrípeta; com pista molhada, ele derrapa), a roupa na centrífuga da máquina de lavar, o globo da morte.

## Engrenagens e polias

Em engrenagens ou polias ligadas por correia, como na bicicleta, a roda **menor gira mais rápido**. Trocar a marcha da bicicleta muda a relação entre as coroas, o que muda a velocidade e o esforço.

## Resumindo

A gravidade diminui com o quadrado da distância. Planetas mais distantes do Sol demoram mais para dar a volta. Satélites estão sempre "caindo" em volta da Terra. No movimento circular, a força centrípeta aponta para o centro.`,
      highlights: [
        "A força gravitacional diminui com o quadrado da distância.",
        "Na Lua, o peso é menor, mas a massa é a mesma.",
        "Satélites geoestacionários dão uma volta a cada 24 horas.",
        "Em polias e engrenagens ligadas, a roda menor gira mais rápido.",
      ],
      keyPoints: [
        { term: "Força centrípeta", explanation: "Força que aponta para o centro e mantém o movimento circular." },
        { term: "Período e frequência", explanation: "Período é o tempo de uma volta; frequência, as voltas por segundo." },
        { term: "Leis de Kepler", explanation: "Descrevem as órbitas elípticas e a velocidade dos planetas." },
      ],
    },
    {
      title: "Quantidade de movimento, impulso e colisões",
      content: `## Quantidade de movimento

A **quantidade de movimento** (ou momento linear) é a massa vezes a velocidade: **Q = m × v**. Um caminhão lento pode ter mais quantidade de movimento que uma moto rápida, porque tem muito mais massa.

## Impulso

**Impulso** é a força aplicada durante um tempo: **I = F × Δt**. O impulso muda a quantidade de movimento de um corpo.

Isso explica dispositivos de segurança: para parar um corpo, é preciso tirar toda a sua quantidade de movimento. Se o tempo da parada for **maior**, a força será **menor**.

- O **airbag** e o **cinto de segurança** aumentam o tempo da desaceleração do passageiro, diminuindo a força sobre o corpo.
- A **zona de deformação** dos carros, que amassa na batida, faz o mesmo.
- Dobrar os joelhos ao pular de um lugar alto, os colchões de salto e as luvas de goleiro e de boxe também aumentam o tempo do impacto.

## Conservação da quantidade de movimento

Em um sistema isolado (sem forças externas), a quantidade de movimento total **se conserva**. Exemplos:

- O **recuo** de uma arma: a bala vai para a frente e a arma vai para trás.
- O **foguete** expele gases para trás e é empurrado para a frente.
- Duas pessoas paradas sobre patins se empurram e saem em sentidos opostos; a mais leve sai mais rápido.

## Colisões

- **Elástica:** os corpos batem e se separam sem perder energia cinética, como bolas de bilhar (quase).
- **Inelástica:** parte da energia vira calor, som e deformação.
- **Perfeitamente inelástica:** os corpos ficam **grudados** depois da batida, como dois vagões que se engatam.

Em todas elas, a **quantidade de movimento se conserva**; o que pode se perder é a energia cinética.

## Exemplo

Um vagão de 2 toneladas a 6 m/s bate num vagão parado de 1 tonelada e os dois seguem juntos. Antes: Q = 2 × 6 = 12. Depois: (2 + 1) × v = 12, então v = **4 m/s**.

## Resumindo

Quantidade de movimento é massa vezes velocidade. Impulso é força vezes tempo: aumentar o tempo da batida diminui a força (airbag, cinto). Em colisões, a quantidade de movimento sempre se conserva.`,
      highlights: [
        "Quantidade de movimento: Q = m × v.",
        "Aumentar o tempo do impacto diminui a força: airbag, cinto, colchão.",
        "A quantidade de movimento se conserva em sistemas isolados.",
        "Na colisão perfeitamente inelástica, os corpos ficam juntos.",
      ],
      keyPoints: [
        { term: "Impulso", explanation: "Força aplicada durante um tempo; muda a quantidade de movimento." },
        { term: "Recuo", explanation: "Movimento para trás da arma ao disparar, pela conservação do momento." },
        { term: "Colisão inelástica", explanation: "Batida em que parte da energia cinética vira calor e deformação." },
      ],
    },
    {
      title: "Física moderna: átomo, radiação e energia nuclear",
      content: `## Quando a física clássica não bastou

No início do século 20, alguns fenômenos não eram explicados pelas leis de Newton. Surgiram duas grandes teorias: a **física quântica** e a **relatividade**.

## O efeito fotoelétrico

Quando a luz incide sobre certos metais, ela arranca elétrons. **Einstein** explicou que a luz é formada por pequenos pacotes de energia, os **fótons**, e que a energia de cada fóton depende da **frequência** da luz: a luz ultravioleta tem fótons mais energéticos que a luz vermelha. O efeito fotoelétrico é a base das **células solares** (painéis fotovoltaicos) e de sensores de portas automáticas.

## Espectro e cores

Cada elemento químico, quando aquecido, emite luz com cores específicas, como uma "impressão digital". Isso permite saber do que são feitas as estrelas. As lâmpadas de LED e de neon funcionam por elétrons que mudam de nível de energia e emitem luz.

## Relatividade

Einstein mostrou que a velocidade da luz no vácuo é a mesma para todos os observadores, cerca de 300.000 km/s, e nada pode ir mais rápido que ela. A famosa equação **E = m × c²** mostra que **massa pode se transformar em energia**: uma pequena quantidade de massa gera uma quantidade enorme de energia.

## Energia nuclear

- **Fissão nuclear:** um núcleo pesado, como o do **urânio**, é quebrado e libera muita energia. É o que acontece nas **usinas nucleares**, como Angra 1 e 2, e nas bombas atômicas. A usina aquece água, gera vapor e gira turbinas.
- **Fusão nuclear:** núcleos leves se juntam, como o hidrogênio formando hélio. É o que acontece no **Sol** e nas estrelas.

Vantagens das usinas nucleares: geram muita energia e não emitem gases de efeito estufa durante a operação. Desvantagens: risco de acidentes (Chernobyl, 1986; Fukushima, 2011) e o **lixo radioativo**, que continua perigoso por milhares de anos.

## Radiação ionizante e saúde

Raios X, raios gama e partículas radioativas são **ionizantes**: podem danificar o DNA e causar câncer. Mas também são usados na medicina: **radiografia**, **tomografia**, **radioterapia** contra tumores e esterilização de materiais. A proteção envolve distância, tempo curto de exposição e barreiras como o **chumbo**.

## Resumindo

Einstein explicou o efeito fotoelétrico com os fótons: base dos painéis solares. E = mc² mostra que massa vira energia. A fissão do urânio gera energia nas usinas nucleares; a fusão acontece no Sol. Radiações ionizantes podem danificar o DNA, mas são úteis na medicina.`,
      highlights: [
        "Efeito fotoelétrico: a luz arranca elétrons; é a base dos painéis solares.",
        "E = m × c²: uma pequena massa gera uma enorme quantidade de energia.",
        "Fissão (urânio) nas usinas nucleares; fusão (hidrogênio) no Sol.",
        "Radiações ionizantes podem danificar o DNA; o chumbo protege.",
      ],
      keyPoints: [
        { term: "Fóton", explanation: "Pacote de energia da luz; sua energia depende da frequência." },
        { term: "Fissão nuclear", explanation: "Quebra de um núcleo pesado, como o urânio, liberando energia." },
        { term: "Fusão nuclear", explanation: "União de núcleos leves, que acontece nas estrelas." },
      ],
    },
  ],
};
