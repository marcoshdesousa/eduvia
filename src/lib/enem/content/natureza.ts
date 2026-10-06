import type { Materia } from "../catalog";

export const NATUREZA: Materia[] = [
  {
    slug: "biologia",
    name: "Biologia",
    area: "natureza",
    lessons: [
      {
        title: "Ecologia: cadeias, ciclos e impactos",
        content: `## Ecologia é o assunto mais cobrado

Ecologia estuda as relações dos seres vivos entre si e com o ambiente. É, de longe, o tema de Biologia que mais aparece no ENEM, quase sempre ligado a problemas ambientais.

## Níveis de organização

Indivíduo, **população** (mesma espécie, mesmo lugar), **comunidade** (várias populações), **ecossistema** (comunidade mais o ambiente físico) e **biosfera**.

## Cadeias e teias alimentares

A energia entra nos ecossistemas pela **fotossíntese** dos **produtores** (plantas, algas). Depois passa para os **consumidores** primários (herbívoros), secundários e terciários (carnívoros). Os **decompositores** (fungos e bactérias) devolvem os nutrientes ao ambiente.

Regras importantes:

- A **energia** flui em um só sentido e **diminui** a cada nível, porque cerca de 90% se perde como calor e nas atividades do organismo. Por isso as cadeias são curtas.
- A **matéria** é reciclada.
- **Magnificação trófica** (bioacumulação): substâncias não degradáveis, como mercúrio e alguns agrotóxicos, se **acumulam** ao longo da cadeia. O último consumidor tem a maior concentração. É assim que o mercúrio do garimpo chega aos peixes grandes e às pessoas.

## Relações ecológicas

- **Mutualismo:** as duas espécies se beneficiam e dependem uma da outra, como nos líquens (alga e fungo).
- **Comensalismo:** uma se beneficia e a outra não é afetada.
- **Parasitismo:** uma vive às custas da outra.
- **Predação:** uma mata e come a outra.
- **Competição:** disputa por recursos.

## Ciclos biogeoquímicos

- **Carbono:** a fotossíntese retira gás carbônico do ar; a respiração e as queimadas devolvem. A queima de combustíveis fósseis aumenta o CO2 e intensifica o efeito estufa.
- **Nitrogênio:** as bactérias fixam o nitrogênio do ar no solo, muitas delas nas raízes das leguminosas, como o feijão e a soja. Por isso a **rotação de culturas** e a adubação verde melhoram o solo.
- **Água:** evaporação, transpiração das plantas, condensação e chuva. A floresta amazônica forma os "rios voadores", que levam umidade ao Centro-Sul.

## Impactos que o ENEM cobra

- **Eutrofização:** excesso de nutrientes (esgoto, fertilizantes) faz as algas crescerem demais; depois elas morrem, as bactérias decompositoras consomem o oxigênio da água e os peixes morrem.
- **Espécies exóticas invasoras**, sem predadores naturais, que desequilibram o ambiente.
- **Desmatamento** e perda de biodiversidade.

## Resumindo

A energia flui e diminui na cadeia; a matéria é reciclada. Poluentes não degradáveis se acumulam no topo da cadeia. A eutrofização tira o oxigênio da água.`,
        highlights: [
          "A energia diminui a cada nível da cadeia alimentar; a matéria é reciclada.",
          "Magnificação trófica: poluentes se acumulam no topo da cadeia.",
          "Leguminosas, com bactérias nas raízes, fixam nitrogênio no solo.",
          "Eutrofização: excesso de nutrientes leva à falta de oxigênio na água.",
        ],
        keyPoints: [
          { term: "Produtor", explanation: "Ser que faz fotossíntese e produz o próprio alimento, como plantas e algas." },
          { term: "Magnificação trófica", explanation: "Acúmulo de substâncias tóxicas ao longo da cadeia alimentar." },
          { term: "Eutrofização", explanation: "Excesso de nutrientes na água que termina em falta de oxigênio e morte de peixes." },
        ],
      },
      {
        title: "Célula, metabolismo e energia",
        content: `## A célula

A célula é a unidade básica da vida. Há dois tipos:

- **Procarionte:** sem núcleo organizado; o material genético fica solto no citoplasma. São as bactérias.
- **Eucarionte:** com núcleo e organelas. São os animais, plantas, fungos e protozoários.

## Organelas principais

- **Membrana plasmática:** controla o que entra e sai da célula (permeabilidade seletiva).
- **Núcleo:** guarda o DNA.
- **Ribossomos:** produzem proteínas.
- **Mitocôndrias:** fazem a respiração celular e produzem energia (ATP).
- **Cloroplastos:** fazem a fotossíntese; só existem em plantas e algas.
- **Complexo golgiense:** armazena e "empacota" substâncias.
- **Lisossomos:** fazem a digestão dentro da célula.
- **Parede celular:** reforço externo nas plantas (de celulose), fungos e bactérias.

## Fotossíntese e respiração

- **Fotossíntese:** gás carbônico + água + luz → glicose + oxigênio. Acontece nos cloroplastos e é a porta de entrada da energia nos ecossistemas.
- **Respiração celular:** glicose + oxigênio → gás carbônico + água + energia (ATP). Acontece nas mitocôndrias.

Repare que uma é praticamente o inverso da outra.

## Fermentação

Quando não há oxigênio, algumas células fazem **fermentação**, que produz pouca energia:

- **Fermentação alcoólica:** feita por leveduras, produz álcool e gás carbônico. É usada para fazer pão (o gás faz a massa crescer), cerveja e o etanol de cana.
- **Fermentação lática:** feita por bactérias e também pelos nossos músculos em esforço intenso; produz ácido lático. É usada para fazer iogurte e queijo.

## Transporte pela membrana

- **Difusão:** substâncias passam do lugar mais concentrado para o menos concentrado, sem gasto de energia.
- **Osmose:** a **água** passa do meio menos concentrado para o mais concentrado. Por isso o sal desidrata a carne e conserva os alimentos: a água sai das células e dos micro-organismos.
- **Transporte ativo:** contra o gradiente, com gasto de energia.

## Biomoléculas

Carboidratos (energia rápida), lipídios (reserva de energia e membranas), proteínas (estrutura e enzimas), vitaminas, sais minerais e ácidos nucleicos (DNA e RNA). **Enzimas** são proteínas que aceleram reações e dependem da temperatura e do pH: o calor excessivo desnatura a enzima.

## Resumindo

Células procariontes não têm núcleo; eucariontes têm. A fotossíntese produz glicose e oxigênio; a respiração usa e libera energia. Osmose é a passagem da água, e é por isso que o sal conserva alimentos.`,
        highlights: [
          "Procariontes (bactérias) não têm núcleo organizado; eucariontes têm.",
          "Fotossíntese: gás carbônico + água + luz geram glicose e oxigênio.",
          "Respiração celular, nas mitocôndrias, libera a energia da glicose.",
          "Osmose: a água vai do meio menos concentrado para o mais concentrado.",
        ],
        keyPoints: [
          { term: "Mitocôndria", explanation: "Organela que faz a respiração celular e produz ATP." },
          { term: "Fermentação", explanation: "Obtenção de energia sem oxigênio; produz álcool ou ácido lático." },
          { term: "Enzima", explanation: "Proteína que acelera reações; sensível à temperatura e ao pH." },
        ],
      },
      {
        title: "Genética e biotecnologia",
        content: `## DNA, genes e proteínas

O **DNA** guarda a informação genética. Ele é formado por duas fitas em dupla hélice, com quatro bases: adenina (A), timina (T), citosina (C) e guanina (G). A sempre se liga com T, e C com G.

Um **gene** é um trecho do DNA com a instrução para fazer uma proteína. O caminho é: o DNA é copiado em **RNA** (transcrição), e o RNA é lido pelos ribossomos para formar a proteína (tradução). Os **cromossomos** são o DNA enrolado; os seres humanos têm 46, em 23 pares.

## Mutações

**Mutações** são alterações no DNA. Podem ser espontâneas ou causadas por radiação e substâncias químicas. Elas são a fonte da variabilidade genética e da evolução, mas também podem causar doenças, como alguns tipos de câncer.

## Leis de Mendel

Gregor Mendel estudou ervilhas e descobriu como as características passam de pais para filhos.

- Cada característica é determinada por um par de **alelos**, um vindo da mãe e outro do pai.
- O alelo **dominante** (A) se manifesta mesmo com um só; o **recessivo** (a) só aparece em dose dupla (aa).
- **Homozigoto:** alelos iguais (AA ou aa). **Heterozigoto:** diferentes (Aa).
- **Genótipo** é a constituição genética; **fenótipo** é a característica que aparece.

Exemplo clássico: dois pais **Aa**. Os filhos podem ser AA, Aa, aA e aa. Ou seja, **3/4** têm a característica dominante e **1/4** a recessiva. É assim que dois pais sem uma doença recessiva podem ter um filho com ela.

## Herança ligada ao sexo e grupos sanguíneos

- O **daltonismo** e a **hemofilia** estão no cromossomo X; por isso são mais comuns em homens (XY), que têm um só X.
- **Grupos sanguíneos ABO:** A e B são codominantes, O é recessivo. O tipo O negativo é doador universal de hemácias; AB positivo é receptor universal.

## Biotecnologia

- **Transgênicos:** organismos que recebem genes de outra espécie, como plantas resistentes a pragas e bactérias que produzem **insulina** humana.
- **Clonagem:** produção de indivíduos geneticamente iguais, como a ovelha Dolly.
- **Teste de DNA:** usado para identificar paternidade e em investigações criminais.
- **Células-tronco:** podem se transformar em vários tipos de células, com uso em tratamentos.
- **Terapia gênica e edição de genes (CRISPR):** corrigir genes defeituosos.

O ENEM costuma cobrar os **benefícios e os riscos éticos e ambientais** dessas técnicas.

## Resumindo

Gene é um trecho de DNA que produz uma proteína. No cruzamento Aa × Aa, a proporção é 3 dominantes para 1 recessivo. Transgênicos recebem genes de outra espécie, como as bactérias que produzem insulina.`,
        highlights: [
          "Gene é um trecho de DNA com a instrução para fazer uma proteína.",
          "Cruzamento Aa × Aa: 3/4 com a característica dominante e 1/4 recessiva.",
          "Daltonismo e hemofilia são mais comuns em homens: estão no cromossomo X.",
          "Transgênicos recebem genes de outra espécie, como bactérias que fazem insulina.",
        ],
        keyPoints: [
          { term: "Alelo recessivo", explanation: "Só se manifesta em dose dupla (aa)." },
          { term: "Fenótipo", explanation: "Característica que se manifesta, resultado do genótipo e do ambiente." },
          { term: "Transgênico", explanation: "Organismo que recebeu gene de outra espécie." },
        ],
      },
      {
        title: "Corpo humano, saúde e doenças",
        content: `## Sistemas do corpo que mais caem

- **Digestório:** a digestão começa na boca (amilase da saliva), continua no estômago (ácido e pepsina, para proteínas) e termina no intestino delgado, onde os nutrientes são absorvidos. O fígado produz a bile, que ajuda a digerir gorduras.
- **Respiratório:** nos alvéolos dos pulmões, o oxigênio entra no sangue e o gás carbônico sai.
- **Circulatório:** o coração bombeia o sangue. As hemácias levam oxigênio (pela hemoglobina, que tem ferro), os leucócitos defendem o corpo e as plaquetas ajudam na coagulação.
- **Endócrino:** hormônios como a **insulina**, do pâncreas, que diminui a glicose no sangue. O diabetes é a falta de insulina ou a resistência a ela.
- **Nervoso:** os neurônios transmitem impulsos elétricos; o álcool e as drogas alteram essa transmissão.

## Imunidade: vacina e soro

O sistema imunológico produz **anticorpos** contra os **antígenos** (partes de vírus, bactérias ou toxinas).

- **Vacina:** contém o agente enfraquecido, morto ou partes dele. O corpo produz os próprios anticorpos e **células de memória**. É **imunização ativa**, **preventiva** e duradoura.
- **Soro:** contém **anticorpos prontos**, produzidos em outro animal, como o cavalo. É **imunização passiva**, **curativa** e de efeito rápido, mas temporário. Usado em picadas de cobra e contra o tétano já instalado.

Essa diferença é muito cobrada no ENEM.

## Doenças que o ENEM cobra

- **Viroses:** dengue, zika e chikungunya (transmitidas pelo mosquito Aedes aegypti, que se reproduz em água parada), febre amarela, sarampo, gripe, covid-19, HIV/AIDS. **Antibióticos não funcionam contra vírus.**
- **Bacterioses:** tuberculose, cólera, leptospirose (pela urina de ratos, em enchentes), tétano, sífilis. O uso errado de antibióticos seleciona **bactérias resistentes**.
- **Protozooses:** malária (mosquito Anopheles), doença de Chagas (barbeiro), leishmaniose (mosquito-palha), giardíase e amebíase.
- **Verminoses:** esquistossomose (caramujo e água contaminada), ascaridíase, teníase e cisticercose (carne de porco mal cozida e verduras contaminadas).

A maior parte dessas doenças é prevenida com **saneamento básico**: água tratada, esgoto e coleta de lixo.

## Resumindo

Vacina é preventiva e ensina o corpo a produzir anticorpos; soro traz anticorpos prontos e é curativo. Antibiótico não mata vírus. Saneamento básico previne a maioria das doenças infecciosas.`,
        highlights: [
          "Vacina: imunização ativa e preventiva, com células de memória.",
          "Soro: anticorpos prontos, imunização passiva e curativa.",
          "Antibióticos não funcionam contra vírus.",
          "Saneamento básico previne a maioria das doenças infecciosas.",
        ],
        keyPoints: [
          { term: "Anticorpo", explanation: "Proteína de defesa que reconhece e neutraliza um antígeno." },
          { term: "Insulina", explanation: "Hormônio do pâncreas que reduz a glicose no sangue." },
          { term: "Resistência bacteriana", explanation: "Seleção de bactérias que sobrevivem aos antibióticos, favorecida pelo uso inadequado." },
        ],
      },
      {
        title: "Evolução e seleção natural",
        content: `## A vida muda ao longo do tempo

A **evolução** é a mudança das espécies ao longo das gerações. Todas as espécies atuais descendem de ancestrais comuns. As evidências vêm dos **fósseis**, da **anatomia comparada** (como os ossos parecidos do braço humano, da asa do morcego e da nadadeira da baleia), da **embriologia** e, principalmente, das comparações de **DNA**.

## Lamarck

Jean-Baptiste de Lamarck propôs, no começo do século 19, duas leis:

- **Uso e desuso:** os órgãos usados se desenvolvem; os não usados atrofiam.
- **Herança dos caracteres adquiridos:** essas mudanças passariam para os filhos.

O exemplo clássico: as girafas teriam esticado o pescoço para alcançar as folhas altas, e os filhos nasceriam com pescoço mais longo. Hoje sabemos que **características adquiridas não são herdadas**. Se uma pessoa malha, os filhos não nascem musculosos.

## Darwin e a seleção natural

Charles Darwin (e Alfred Wallace) explicou a evolução pela **seleção natural**:

1. Os indivíduos de uma população **variam** entre si.
2. Nascem mais indivíduos do que o ambiente consegue sustentar, e há **competição**.
3. Os que têm características **mais vantajosas** naquele ambiente sobrevivem e se reproduzem mais.
4. Essas características passam para os descendentes e se tornam mais comuns.

No exemplo das girafas: já havia girafas de pescoço mais longo e mais curto; as de pescoço longo comiam melhor, sobreviviam e deixavam mais filhos.

**Atenção:** o ambiente **não cria** as características, ele **seleciona** as que já existem. Essa é a pegadinha mais comum do ENEM.

## Teoria sintética (neodarwinismo)

Juntou Darwin com a genética: a variabilidade vem das **mutações** e da **recombinação genética** (reprodução sexuada). A seleção natural atua sobre essa variabilidade.

## Exemplos atuais de seleção

- **Bactérias resistentes a antibióticos:** o antibiótico mata as sensíveis, e as resistentes, que já existiam, se multiplicam.
- **Insetos resistentes a inseticidas** e plantas daninhas resistentes a herbicidas.
- **Melanismo industrial:** na Inglaterra industrial, mariposas escuras ficaram mais comuns nos troncos escurecidos pela fuligem, porque eram menos vistas pelos pássaros.

## Especiação

Uma nova espécie surge quando populações ficam **isoladas** (por exemplo, por um rio ou uma montanha), acumulam diferenças e deixam de cruzar entre si, gerando o **isolamento reprodutivo**.

## Resumindo

Lamarck errou ao propor a herança do que é adquirido. Darwin explicou a evolução pela seleção natural: o ambiente seleciona variações que já existem. Bactérias resistentes são um exemplo atual.`,
        highlights: [
          "Lamarck: uso e desuso e herança do adquirido (ideia hoje rejeitada).",
          "Darwin: o ambiente seleciona as variações que já existem.",
          "O ambiente não cria características, só seleciona: pegadinha clássica do ENEM.",
          "Bactérias resistentes a antibióticos são seleção natural acontecendo.",
        ],
        keyPoints: [
          { term: "Seleção natural", explanation: "Os mais adaptados ao ambiente sobrevivem e se reproduzem mais." },
          { term: "Variabilidade genética", explanation: "Diferenças entre indivíduos, geradas por mutações e recombinação." },
          { term: "Especiação", explanation: "Formação de uma nova espécie, geralmente após isolamento geográfico." },
        ],
      },
    ],
  },
  {
    slug: "quimica",
    name: "Química",
    area: "natureza",
    lessons: [
      {
        title: "Mol, estequiometria e cálculos químicos",
        content: `## Contar partículas em pacotes

Átomos e moléculas são pequenos demais para contar um a um. Por isso a Química usa o **mol**, um "pacote" com 6,02 × 10²³ partículas (a constante de Avogadro). É como a dúzia, que sempre tem 12, só que muito maior.

## Massa molar

A **massa molar** é a massa de 1 mol, em gramas. Ela é a soma das massas atômicas da tabela periódica.

Exemplo: a água, H2O. Hidrogênio = 1 e oxigênio = 16. Massa molar = 2 × 1 + 16 = **18 g/mol**. Então 18 g de água têm 1 mol de moléculas, e 36 g têm 2 mol.

Outras massas molares úteis: gás carbônico, CO2 = 44 g/mol; glicose, C6H12O6 = 180 g/mol.

## Equação química e balanceamento

Uma equação mostra os **reagentes** e os **produtos**. Pela **Lei de Lavoisier**, "na natureza nada se cria, nada se perde, tudo se transforma": a massa total se conserva. Por isso a equação precisa estar **balanceada**, com o mesmo número de átomos de cada elemento dos dois lados.

Exemplo, a combustão do metano:

CH4 + 2 O2 → CO2 + 2 H2O

Lê-se: 1 mol de metano reage com 2 mol de oxigênio e forma 1 mol de gás carbônico e 2 mol de água.

## Estequiometria: a regra de três da Química

**Estequiometria** é calcular quanto de cada substância participa da reação. O caminho é sempre:

1. Escreva a equação **balanceada**.
2. Veja a **proporção em mol** entre as substâncias que interessam.
3. Transforme em massa (ou volume) e monte a **regra de três**.

Exemplo: quanto CO2 é produzido na queima de 32 g de metano? A proporção é 1 mol de CH4 (16 g) para 1 mol de CO2 (44 g). Então: 16 g está para 44 g, assim como 32 g está para x. Logo, x = **88 g de CO2**.

## Pegadinhas comuns

- **Rendimento:** se a reação tem rendimento de 80%, multiplique o resultado por 0,8.
- **Pureza:** se o reagente tem 90% de pureza, só 90% da massa reage.
- **Volume de gás:** nas condições normais (0 °C e 1 atm), 1 mol de gás ocupa cerca de 22,4 L.

## Resumindo

Mol é um pacote de 6,02 × 10²³ partículas. A massa molar vem da tabela periódica. Para calcular, balanceie a equação, use a proporção em mol e faça a regra de três.`,
        highlights: [
          "1 mol = 6,02 × 10²³ partículas.",
          "A massa molar é a soma das massas atômicas: H2O = 18 g/mol.",
          "Lavoisier: a massa se conserva, por isso a equação precisa estar balanceada.",
          "Estequiometria: equação balanceada, proporção em mol e regra de três.",
        ],
        keyPoints: [
          { term: "Mol", explanation: "Quantidade de matéria que contém 6,02 × 10²³ partículas." },
          { term: "Massa molar", explanation: "Massa, em gramas, de 1 mol de uma substância." },
          { term: "Rendimento", explanation: "Porcentagem do produto que realmente se forma em relação ao teórico." },
        ],
      },
      {
        title: "Soluções, concentração e pH",
        content: `## O que é uma solução

**Solução** é uma mistura homogênea: o **soluto** (o que se dissolve, como o sal) espalhado no **solvente** (o que dissolve, geralmente a água). O soro fisiológico, o refrigerante e o ar são soluções.

## Concentração

- **Concentração comum (g/L):** massa de soluto por volume de solução. Se 5 g de açúcar estão em 1 L, a concentração é 5 g/L.
- **Concentração em quantidade de matéria (mol/L):** número de mol de soluto por litro de solução.
- **Porcentagem e partes por milhão (ppm):** muito usadas em rótulos e em poluentes. 1 ppm é 1 parte em 1 milhão, por exemplo, 1 mg por kg ou por litro de água.

## Diluição

**Diluir** é acrescentar solvente. A quantidade de soluto não muda, só o volume aumenta, então a concentração diminui:

C1 × V1 = C2 × V2

Exemplo: 100 mL de uma solução de 20 g/L recebem água até 400 mL. A nova concentração é 20 × 100 / 400 = **5 g/L**.

## Ácidos, bases e pH

- **Ácidos** liberam íons H+ na água: vinagre, suco de limão, ácido do estômago.
- **Bases** liberam íons OH−: soda cáustica, leite de magnésia, sabão.
- **Neutralização:** ácido + base → sal + água. É o que fazem os antiácidos no estômago e a cal (calagem) para corrigir solos ácidos.

A escala de **pH** vai de 0 a 14:

- pH **menor que 7**: ácido.
- pH **igual a 7**: neutro (água pura a 25 °C).
- pH **maior que 7**: básico.

A escala é logarítmica: cada unidade de pH a menos significa uma solução **10 vezes** mais ácida. pH 3 é dez vezes mais ácido que pH 4.

## Propriedades coligativas

Um soluto dissolvido muda algumas propriedades do solvente:

- A água com sal ferve a uma temperatura **maior** e congela a uma temperatura **menor**. Por isso se joga sal nas estradas com neve.
- **Osmose:** a água atravessa uma membrana do meio menos concentrado para o mais concentrado. É o princípio da dessalinização por **osmose reversa**.

## Resumindo

Concentração é quanto soluto há em certo volume. Na diluição, C1 × V1 = C2 × V2. pH abaixo de 7 é ácido; acima, básico; e cada unidade é dez vezes mais. Ácido + base dá sal e água.`,
        highlights: [
          "Concentração comum: massa de soluto por litro de solução (g/L).",
          "Na diluição, a quantidade de soluto não muda: C1 × V1 = C2 × V2.",
          "pH < 7 é ácido, 7 é neutro, > 7 é básico; cada unidade é 10 vezes.",
          "Neutralização: ácido + base → sal + água.",
        ],
        keyPoints: [
          { term: "Soluto e solvente", explanation: "Soluto é o que se dissolve; solvente é o que dissolve." },
          { term: "ppm", explanation: "Partes por milhão: 1 mg por kg ou por litro, usada para poluentes." },
          { term: "Calagem", explanation: "Uso de cal (base) para corrigir a acidez do solo." },
        ],
      },
      {
        title: "Química orgânica: carbono, combustíveis e polímeros",
        content: `## A química do carbono

A **Química Orgânica** estuda os compostos de carbono. O carbono faz **4 ligações** e forma longas cadeias, o que permite milhões de compostos diferentes: combustíveis, plásticos, remédios, alimentos e o próprio DNA.

## Hidrocarbonetos e combustíveis

**Hidrocarbonetos** têm só carbono e hidrogênio. O **petróleo** é uma mistura deles, separada por **destilação fracionada**, de acordo com o ponto de ebulição: gás de cozinha, gasolina, querosene, diesel e asfalto.

**Combustão:**

- **Completa:** com bastante oxigênio, produz gás carbônico (CO2) e água.
- **Incompleta:** com pouco oxigênio, produz **monóxido de carbono (CO)**, gás tóxico, e fuligem.

**Biocombustíveis**, como o **etanol** (da cana) e o **biodiesel** (de óleos vegetais), são renováveis. O CO2 que liberam foi retirado do ar pela planta durante a fotossíntese, o que reduz o saldo de emissões.

## Funções orgânicas

As funções são grupos de átomos que dão características às moléculas:

- **Álcool** (–OH ligado a carbono): etanol, das bebidas e do combustível.
- **Ácido carboxílico** (–COOH): ácido acético, do vinagre.
- **Éster:** responsável por aromas de frutas e pela produção do biodiesel.
- **Cetona:** a acetona, do removedor de esmalte.
- **Aldeído:** o formol.
- **Amina:** presente em proteínas e no cheiro de peixe.
- **Fenol** e **éter** também aparecem.

Quase todo remédio e toda molécula biológica tem várias funções juntas.

## Polímeros e plásticos

**Polímeros** são moléculas gigantes formadas pela repetição de unidades pequenas, os **monômeros**. Exemplos: polietileno (sacolas), PVC (canos), PET (garrafas), náilon e borracha. Proteínas, amido e celulose são polímeros naturais.

O grande problema ambiental dos plásticos é a **baixa degradação**: duram centenas de anos e viram **microplásticos** nos oceanos. Soluções: reduzir, reutilizar, reciclar e os **plásticos biodegradáveis**.

## Sabões e detergentes

As moléculas de sabão têm uma parte **polar**, que se mistura com a água, e uma parte **apolar**, que se mistura com a gordura. Assim elas envolvem a gordura e a levam com a água. A produção do sabão a partir de óleo e soda cáustica se chama **saponificação**. Óleo de cozinha usado nunca deve ir para o ralo: pode virar sabão ou biodiesel.

## Resumindo

O carbono faz 4 ligações e forma cadeias. A combustão incompleta gera monóxido de carbono. Biocombustíveis são renováveis. Polímeros são repetições de monômeros, e o plástico é um grande problema ambiental. O sabão tem uma parte polar e outra apolar.`,
        highlights: [
          "O carbono faz 4 ligações e forma cadeias longas.",
          "Combustão incompleta produz monóxido de carbono, um gás tóxico.",
          "Biocombustíveis são renováveis: o CO2 liberado foi absorvido pela planta.",
          "O sabão tem parte polar (água) e apolar (gordura).",
        ],
        keyPoints: [
          { term: "Hidrocarboneto", explanation: "Composto formado só por carbono e hidrogênio, como os derivados do petróleo." },
          { term: "Polímero", explanation: "Macromolécula formada pela repetição de monômeros, como os plásticos." },
          { term: "Saponificação", explanation: "Reação de óleo ou gordura com base que produz sabão." },
        ],
      },
      {
        title: "Química ambiental",
        content: `## A Química e os problemas do planeta

O ENEM adora relacionar Química com meio ambiente. Os temas principais são os gases da atmosfera, a água e os resíduos.

## Efeito estufa

Gases como o **gás carbônico (CO2)**, o **metano (CH4)** e o vapor d'água retêm parte do calor que a Terra irradia. Sem eles, o planeta seria gelado. O problema é o **aumento** desses gases, principalmente pela queima de combustíveis fósseis, pelo desmatamento e pela pecuária (o metano vem da digestão do gado e dos lixões). O resultado é o **aquecimento global**.

## Camada de ozônio

O **ozônio (O3)** na alta atmosfera filtra a radiação **ultravioleta** do Sol. Gases chamados **CFCs**, usados antigamente em geladeiras e sprays, destroem o ozônio. O **Protocolo de Montreal** proibiu esses gases, e a camada está se recuperando.

Atenção: camada de ozônio e efeito estufa são problemas **diferentes**. No ENEM, essa confusão é armadilha comum.

## Chuva ácida

A queima de combustíveis e carvão libera **óxidos de enxofre (SO2)** e **de nitrogênio (NOx)**. Na atmosfera, eles reagem com a água e formam ácidos. A chuva ácida corrói monumentos de mármore e metais, acidifica solos e lagos e prejudica as plantas.

## Poluição da água

- **Esgoto** e fertilizantes causam a **eutrofização**.
- **Metais pesados**, como o mercúrio do garimpo e o chumbo, se acumulam nos seres vivos.
- **Tratamento de água:** coagulação e floculação (as impurezas se juntam), decantação (descem para o fundo), filtração, **cloração** (mata os micro-organismos) e **fluoretação** (protege os dentes).

## Separação de misturas

Muitas questões perguntam qual processo usar:

- **Filtração:** sólido de líquido (o coador de café).
- **Decantação:** separa por densidade, como água e óleo.
- **Destilação simples:** sólido dissolvido em líquido; a água evapora e condensa pura.
- **Destilação fracionada:** líquidos com pontos de ebulição diferentes, como no petróleo.
- **Evaporação:** obter o sal das salinas.

## Resíduos e reciclagem

Os **resíduos sólidos** devem ir para aterros sanitários, e não lixões. A reciclagem de metais como o alumínio economiza muita energia. **Pilhas e baterias** têm metais pesados e devem ir para pontos de coleta. A **compostagem** transforma restos orgânicos em adubo.

## Resumindo

O efeito estufa é intensificado pelo CO2 e pelo metano. CFCs destroem a camada de ozônio, que filtra o ultravioleta. Óxidos de enxofre e nitrogênio causam a chuva ácida. O tratamento de água tem floculação, decantação, filtração e cloração.`,
        highlights: [
          "CO2 e metano intensificam o efeito estufa.",
          "CFCs destroem a camada de ozônio, que filtra a radiação ultravioleta.",
          "Óxidos de enxofre e nitrogênio formam a chuva ácida.",
          "Efeito estufa e buraco na camada de ozônio são problemas diferentes.",
        ],
        keyPoints: [
          { term: "CFC", explanation: "Gás que destrói o ozônio, banido pelo Protocolo de Montreal." },
          { term: "Floculação", explanation: "Etapa do tratamento em que as impurezas se juntam em flocos." },
          { term: "Destilação fracionada", explanation: "Separa líquidos com pontos de ebulição diferentes, como no petróleo." },
        ],
      },
      {
        title: "Reações, eletroquímica e radioatividade",
        content: `## Velocidade das reações (cinética)

Uma reação fica **mais rápida** quando:

- A **temperatura** aumenta. É por isso que a geladeira conserva os alimentos: o frio desacelera as reações e os micro-organismos.
- A **concentração** dos reagentes aumenta.
- A **superfície de contato** aumenta. Um comprimido em pó dissolve mais rápido que inteiro, e lenha picada queima mais rápido que um tronco.
- Há um **catalisador**, substância que acelera a reação sem ser consumida. As **enzimas** são catalisadores biológicos, e os catalisadores dos carros transformam gases tóxicos em menos tóxicos.

## Equilíbrio químico

Muitas reações são reversíveis e chegam a um **equilíbrio**. Pelo **Princípio de Le Chatelier**, quando se perturba o equilíbrio (mudando concentração, temperatura ou pressão), ele se desloca para diminuir essa perturbação.

## Oxirredução

- **Oxidação:** perda de elétrons.
- **Redução:** ganho de elétrons.

A **ferrugem** é a oxidação do ferro na presença de água e oxigênio. Para proteger o ferro, usa-se tinta, galvanização com zinco ou um **metal de sacrifício**, mais reativo, que oxida no lugar dele, como em cascos de navio.

## Pilhas e baterias

Uma **pilha** transforma energia química em elétrica com uma reação espontânea de oxirredução:

- No **ânodo** ocorre a **oxidação** (perde elétrons; polo negativo).
- No **cátodo** ocorre a **redução** (ganha elétrons; polo positivo).
- Os elétrons vão do ânodo para o cátodo pelo fio.

A **eletrólise** faz o contrário: usa energia elétrica para provocar uma reação não espontânea, como na obtenção do alumínio e na galvanoplastia (cromar e niquelar peças).

## Termoquímica

- **Exotérmica:** libera calor, como a combustão.
- **Endotérmica:** absorve calor, como o derretimento do gelo e a fotossíntese.

## Radioatividade

Alguns núcleos instáveis emitem radiação: **alfa** (pouco penetrante), **beta** e **gama** (muito penetrante). A **meia-vida** é o tempo para a metade dos átomos radioativos se transformar. Depois de 2 meias-vidas, sobra 1/4; depois de 3, 1/8.

Usos: geração de energia nas usinas nucleares (por **fissão**), medicina (radioterapia e exames), datação com carbono-14. Riscos: acidentes, como o de Goiânia (1987), com o césio-137, e o lixo radioativo.

## Resumindo

Temperatura, concentração, superfície de contato e catalisadores aceleram reações. Oxidação é perder elétrons; redução, ganhar. Na pilha, o ânodo oxida e o cátodo reduz. A cada meia-vida, a radioatividade cai pela metade.`,
        highlights: [
          "Temperatura, concentração, superfície de contato e catalisador aceleram reações.",
          "Oxidação é perder elétrons; redução é ganhar elétrons.",
          "Na pilha, o ânodo oxida (negativo) e o cátodo reduz (positivo).",
          "Meia-vida: a cada período, sobra metade do material radioativo.",
        ],
        keyPoints: [
          { term: "Catalisador", explanation: "Substância que acelera a reação sem ser consumida." },
          { term: "Metal de sacrifício", explanation: "Metal mais reativo que oxida no lugar do ferro, protegendo-o." },
          { term: "Meia-vida", explanation: "Tempo para metade dos átomos radioativos se desintegrar." },
        ],
      },
    ],
  },
  {
    slug: "fisica",
    name: "Física",
    area: "natureza",
    lessons: [
      {
        title: "Movimento e as leis de Newton",
        content: `## Velocidade e aceleração

- **Velocidade média** = distância percorrida ÷ tempo. Se um carro anda 120 km em 2 horas, a velocidade média é 60 km/h.
- Para converter: de **km/h para m/s**, divida por **3,6**; de m/s para km/h, multiplique por 3,6. 72 km/h = 20 m/s.
- **Aceleração** é a variação da velocidade por tempo. Um carro que vai de 0 a 20 m/s em 10 s tem aceleração de 2 m/s².

No **movimento uniforme**, a velocidade é constante. No **uniformemente variado**, a aceleração é constante, como na **queda livre**, em que a aceleração é a da gravidade, cerca de **10 m/s²**. Sem a resistência do ar, um martelo e uma pena caem juntos.

## As três leis de Newton

**1ª lei, a da inércia:** um corpo tende a manter seu estado: parado continua parado, e em movimento continua em linha reta com a mesma velocidade, a menos que uma força o obrigue a mudar. É por isso que somos jogados para a frente quando o ônibus freia e que o **cinto de segurança** é essencial.

**2ª lei, a fundamental:** **F = m × a**. A força resultante é igual à massa vezes a aceleração. Para acelerar uma massa maior, é preciso mais força. Um caminhão carregado demora mais para frear.

**3ª lei, a da ação e reação:** toda ação tem uma reação de mesma intensidade e sentido oposto, **em corpos diferentes**. Quando você anda, empurra o chão para trás e o chão empurra você para a frente. Os foguetes funcionam assim: expelem gás para trás e são empurrados para a frente.

## Forças do dia a dia

- **Peso:** P = m × g. Uma pessoa de 60 kg tem peso de 600 N. Massa não muda de um planeta para outro; o peso muda.
- **Atrito:** força contra o deslizamento. Sem atrito, não conseguiríamos andar nem frear. Pneus carecas têm menos atrito e aumentam o risco de acidentes na chuva.
- **Normal:** a força que a superfície faz sobre o corpo.

## Segurança no trânsito

O ENEM gosta de aplicar a Física ao trânsito: quanto maior a velocidade, maior a distância de frenagem (ela cresce com o **quadrado** da velocidade). O **airbag** e o cinto aumentam o tempo da colisão, o que diminui a força sobre o corpo.

## Resumindo

Velocidade é distância sobre tempo; para converter km/h em m/s, divida por 3,6. Inércia: corpos mantêm o movimento. F = m × a. Ação e reação agem em corpos diferentes.`,
        highlights: [
          "Para converter km/h em m/s, divida por 3,6.",
          "1ª lei: inércia; o cinto de segurança existe por causa dela.",
          "2ª lei: F = m × a.",
          "3ª lei: ação e reação têm mesma intensidade e agem em corpos diferentes.",
        ],
        keyPoints: [
          { term: "Inércia", explanation: "Tendência de um corpo de manter seu estado de repouso ou de movimento." },
          { term: "Peso", explanation: "Força da gravidade sobre o corpo: P = m × g." },
          { term: "Atrito", explanation: "Força que se opõe ao deslizamento entre superfícies." },
        ],
      },
      {
        title: "Energia, trabalho e potência",
        content: `## Energia se transforma

A energia não é criada nem destruída: ela se **transforma** de uma forma em outra. Esse é o **princípio da conservação da energia**, uma das ideias mais cobradas do ENEM.

Exemplos de transformação:

- **Hidrelétrica:** a energia potencial da água no alto vira energia cinética na queda, que gira as turbinas e vira energia elétrica.
- **Termelétrica:** a energia química do combustível vira calor, que gera vapor, que gira as turbinas.
- **Usina eólica:** a energia cinética do vento vira elétrica.
- **Painel solar:** a energia da luz vira elétrica.
- **Corpo humano:** a energia química dos alimentos vira movimento e calor.

Em toda transformação, parte da energia se "perde", geralmente como **calor**. Por isso nenhuma máquina tem rendimento de 100%.

## Tipos de energia mecânica

- **Energia cinética** (de movimento): Ec = m × v² / 2. Se a velocidade dobra, a energia cinética **quadruplica**. Por isso batidas em alta velocidade são tão graves.
- **Energia potencial gravitacional** (de altura): Ep = m × g × h.
- **Energia potencial elástica:** em molas e elásticos.

Numa montanha-russa sem atrito, a energia potencial do alto vira cinética na descida, e a soma das duas, a **energia mecânica**, se conserva.

## Trabalho

**Trabalho** é a energia transferida por uma força ao longo de um deslocamento: T = F × d. Só há trabalho se houver deslocamento na direção da força. Segurar uma mala parado cansa, mas não realiza trabalho físico.

## Potência

**Potência** é a rapidez com que a energia é transformada: P = energia ÷ tempo. A unidade é o **watt (W)**, que é 1 joule por segundo.

## Consumo de energia elétrica

A conta de luz cobra em **quilowatt-hora (kWh)**:

Energia (kWh) = potência (kW) × tempo (h)

Exemplo: um chuveiro de 5.000 W (5 kW) ligado 30 minutos (0,5 h) por dia consome 2,5 kWh por dia. Em 30 dias, 75 kWh. Se o kWh custa R$ 0,80, são R$ 60,00 no mês.

Para economizar: trocar lâmpadas incandescentes por **LED** (gastam bem menos para iluminar o mesmo), reduzir o tempo do chuveiro e não deixar aparelhos em stand-by.

## Resumindo

A energia se conserva e se transforma, com perdas em forma de calor. Energia cinética depende do quadrado da velocidade. Consumo em kWh é potência em kW vezes o tempo em horas.`,
        highlights: [
          "Energia não se cria nem se perde: se transforma.",
          "Energia cinética depende do quadrado da velocidade.",
          "Potência é energia por tempo; a unidade é o watt.",
          "Consumo (kWh) = potência (kW) × tempo (h).",
        ],
        keyPoints: [
          { term: "Conservação da energia", explanation: "A energia total se mantém; ela só muda de forma." },
          { term: "Rendimento", explanation: "Parte da energia que vira energia útil; nunca chega a 100%." },
          { term: "kWh", explanation: "Unidade de energia da conta de luz: 1 kW funcionando por 1 hora." },
        ],
      },
      {
        title: "Eletricidade no dia a dia",
        content: `## Grandezas elétricas

- **Corrente elétrica (i):** o fluxo de cargas elétricas (elétrons) pelo fio, medida em **ampère (A)**.
- **Tensão ou diferença de potencial (U):** o "empurrão" que faz a corrente circular, medida em **volt (V)**. As tomadas no Brasil são de 127 V ou 220 V.
- **Resistência (R):** a dificuldade que o material oferece à passagem da corrente, medida em **ohm (Ω)**.

## Lei de Ohm e potência

- **U = R × i** (lei de Ohm).
- **P = U × i** (potência elétrica).

Exemplo: um chuveiro de 4.400 W ligado em 220 V puxa uma corrente de 4.400 ÷ 220 = 20 A. É por isso que aparelhos potentes exigem fios mais grossos e disjuntores adequados.

## Efeito Joule

Quando a corrente passa por um resistor, ele **esquenta**. Esse é o **efeito Joule**, usado em chuveiros, ferros de passar, torradeiras e nas antigas lâmpadas incandescentes.

No chuveiro: a posição **inverno** tem uma resistência **menor**, o que faz passar mais corrente e gera mais potência e mais calor. Parece contraintuitivo, mas, com a tensão fixa, P = U² / R: resistência menor, potência maior.

## Circuitos em série e em paralelo

- **Série:** os aparelhos ficam um depois do outro, e a corrente é a mesma em todos. Se um queima, todos apagam, como nos pisca-piscas antigos de Natal.
- **Paralelo:** cada aparelho recebe a mesma tensão, e eles funcionam de forma independente. É assim a instalação elétrica das casas: você liga a TV sem precisar ligar a geladeira.

## Segurança

- **Disjuntores e fusíveis** desligam o circuito quando a corrente fica alta demais, evitando incêndios.
- O **fio terra** leva para o chão cargas que poderiam dar choque.
- Usar muitos aparelhos num só "benjamim" sobrecarrega a tomada.
- O choque é perigoso por causa da corrente que passa pelo corpo; a pele molhada tem menor resistência, por isso o risco é maior no banheiro.

## Magnetismo

Uma corrente elétrica cria um campo magnético, e um campo magnético que varia gera corrente: é a **indução eletromagnética**, base dos geradores das usinas e dos transformadores. Os motores elétricos fazem o caminho inverso: usam corrente e ímãs para gerar movimento.

## Resumindo

U = R × i e P = U × i. Resistores esquentam pelo efeito Joule. No chuveiro, menos resistência dá mais calor. As casas usam circuitos em paralelo. Geradores funcionam por indução eletromagnética.`,
        highlights: [
          "Lei de Ohm: U = R × i. Potência: P = U × i.",
          "Efeito Joule: a corrente esquenta o resistor, como no chuveiro.",
          "No chuveiro, a posição inverno tem menor resistência e mais potência.",
          "As instalações das casas são em paralelo: cada aparelho funciona sozinho.",
        ],
        keyPoints: [
          { term: "Corrente elétrica", explanation: "Fluxo de cargas pelo condutor, medido em ampère." },
          { term: "Efeito Joule", explanation: "Aquecimento de um condutor pela passagem da corrente." },
          { term: "Indução eletromagnética", explanation: "Geração de corrente por um campo magnético variável; base dos geradores." },
        ],
      },
      {
        title: "Ondas, som e luz",
        content: `## O que é uma onda

**Onda** é uma perturbação que transporta **energia** sem transportar matéria. Uma onda no mar faz a boia subir e descer, mas não a leva embora.

- **Ondas mecânicas** precisam de um meio para se propagar, como o **som**. No vácuo do espaço não há som.
- **Ondas eletromagnéticas** se propagam até no vácuo, como a **luz**, o rádio, as micro-ondas, o raio X e o ultravioleta. No vácuo, todas têm a velocidade da luz, cerca de 300.000 km/s.

## Grandezas de uma onda

- **Comprimento de onda (λ):** distância entre duas cristas.
- **Frequência (f):** quantas ondas passam por segundo, em **hertz (Hz)**.
- **Velocidade:** **v = λ × f**.

Para uma mesma velocidade, frequência e comprimento de onda são **inversos**: quanto maior a frequência, menor o comprimento de onda.

## Som

- **Altura:** depende da frequência. Som **agudo** tem frequência alta; som **grave**, frequência baixa.
- **Intensidade:** o volume, medido em **decibéis (dB)**. Ruídos acima de cerca de 85 dB por muito tempo prejudicam a audição.
- **Timbre:** o que diferencia um violão de um piano tocando a mesma nota.
- **Eco:** reflexão do som. Morcegos e sonares usam o eco para localizar objetos.
- O ser humano ouve de cerca de 20 Hz a 20.000 Hz; acima disso é **ultrassom**, usado em exames médicos.

## Luz

- **Reflexão:** a luz bate e volta, como no espelho. A cor de um objeto é a cor da luz que ele reflete: uma folha é verde porque reflete o verde e absorve as outras cores.
- **Refração:** a luz muda de velocidade e de direção ao passar de um meio para outro. É por isso que um lápis parece "quebrado" num copo d'água e que existe o arco-íris (a luz branca se separa em cores na **dispersão**).
- **Lentes:** convergentes corrigem a hipermetropia (e a presbiopia); divergentes corrigem a miopia.

## Espectro eletromagnético

Em ordem crescente de frequência (e de energia): ondas de rádio, micro-ondas, infravermelho, luz visível, **ultravioleta**, raios X e raios gama. As de alta frequência, como o ultravioleta, o raio X e o gama, são **ionizantes** e podem danificar o DNA; por isso se usa protetor solar e se limita a exposição ao raio X.

## Resumindo

Ondas transportam energia, não matéria. O som precisa de meio; a luz, não. v = λ × f. Som agudo tem frequência alta. Refração é a mudança de direção da luz entre meios.`,
        highlights: [
          "Ondas transportam energia sem transportar matéria.",
          "O som precisa de um meio; a luz se propaga até no vácuo.",
          "v = λ × f; frequência e comprimento de onda são inversos.",
          "Ultravioleta, raio X e gama são radiações ionizantes.",
        ],
        keyPoints: [
          { term: "Frequência", explanation: "Número de oscilações por segundo, medido em hertz." },
          { term: "Refração", explanation: "Mudança de velocidade e de direção da luz ao mudar de meio." },
          { term: "Ultrassom", explanation: "Som acima de 20.000 Hz, inaudível para nós e usado em exames." },
        ],
      },
      {
        title: "Calor, temperatura e termodinâmica",
        content: `## Temperatura não é calor

- **Temperatura** mede o grau de agitação das partículas de um corpo.
- **Calor** é energia térmica **em trânsito**, que passa espontaneamente do corpo **mais quente** para o **mais frio**, até que os dois fiquem com a mesma temperatura (o **equilíbrio térmico**).

Por isso não se diz que um corpo "tem calor": ele tem temperatura, e o calor é o que passa.

## Escalas

Na escala **Celsius**, a água congela a 0 °C e ferve a 100 °C (ao nível do mar). Na **Kelvin**, usada na ciência, não há temperaturas negativas: K = °C + 273. Na **Fahrenheit**, usada nos Estados Unidos, a água congela a 32 °F e ferve a 212 °F.

## Como o calor se propaga

- **Condução:** de partícula em partícula, principalmente nos sólidos. Metais são bons condutores; madeira, isopor e ar são **isolantes**. É por isso que as panelas têm cabo de madeira ou plástico.
- **Convecção:** pelo movimento de líquidos e gases. O ar quente sobe e o frio desce. Por isso o ar-condicionado fica no alto e o aquecedor embaixo, e o congelador fica em cima na geladeira.
- **Irradiação:** por ondas eletromagnéticas (infravermelho), sem precisar de meio. É assim que o calor do Sol chega à Terra. Superfícies escuras absorvem mais radiação; as claras refletem.

A **garrafa térmica** combate as três: vácuo entre as paredes (evita condução e convecção) e paredes espelhadas (evita irradiação).

## Calor sensível e latente

- **Calor sensível** muda a temperatura: Q = m × c × ΔT. O **calor específico (c)** da água é alto, por isso ela demora para esquentar e esfriar. Isso explica por que as cidades litorâneas têm temperaturas mais estáveis.
- **Calor latente** muda o estado físico **sem mudar a temperatura**. Enquanto o gelo derrete, a temperatura fica em 0 °C.

A **pressão** muda o ponto de ebulição: na panela de pressão, a água ferve acima de 100 °C e cozinha mais rápido; em lugares altos, onde a pressão é menor, a água ferve abaixo de 100 °C.

## Dilatação térmica

Os corpos se expandem quando esquentam. Por isso há **juntas de dilatação** em pontes e trilhos. A água é uma exceção: entre 0 °C e 4 °C ela se contrai ao esquentar, e o gelo é menos denso que a água, por isso flutua.

## Máquinas térmicas

Motores de carro e usinas termelétricas transformam calor em trabalho, mas **nenhuma máquina térmica converte todo o calor em trabalho**: parte sempre é rejeitada para o ambiente (2ª lei da termodinâmica).

## Resumindo

Calor é energia em trânsito do quente para o frio. Ele se propaga por condução, convecção e irradiação. O calor latente muda o estado sem mudar a temperatura. Nenhuma máquina térmica tem rendimento de 100%.`,
        highlights: [
          "Calor é energia em trânsito, do corpo mais quente para o mais frio.",
          "Condução (sólidos), convecção (fluidos) e irradiação (sem meio, como o Sol).",
          "Calor latente muda o estado físico sem mudar a temperatura.",
          "Nenhuma máquina térmica transforma todo o calor em trabalho.",
        ],
        keyPoints: [
          { term: "Equilíbrio térmico", explanation: "Quando dois corpos ficam com a mesma temperatura e o calor para de passar." },
          { term: "Convecção", explanation: "Propagação do calor pelo movimento de líquidos e gases." },
          { term: "Calor específico", explanation: "Quanto calor é preciso para elevar a temperatura de 1 g de um material em 1 °C." },
        ],
      },
    ],
  },
];
