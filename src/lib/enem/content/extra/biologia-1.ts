import { aula } from "./build";

/** Biologia, lote 1: célula, genética e corpo humano. */
export const BIOLOGIA_1 = [
  aula(
    "Membrana plasmática: difusão e osmose",
    `## A porta da célula

A **membrana plasmática** envolve todas as células e controla o que entra e sai. Ela é formada por uma dupla camada de **fosfolipídios** com **proteínas** espalhadas, o chamado **modelo do mosaico fluido**. Essa capacidade de escolher o que passa se chama **permeabilidade seletiva**.

## Transporte passivo (sem gasto de energia)

- **Difusão simples:** as substâncias vão do lugar mais concentrado para o menos concentrado. É assim que o oxigênio entra nas células.
- **Difusão facilitada:** igual à simples, mas com ajuda de proteínas transportadoras. Ex.: entrada de glicose em muitas células.
- **Osmose:** passagem de **água** do meio menos concentrado (em soluto) para o mais concentrado.

## Osmose no dia a dia

- **Salada temperada murcha:** o sal deixa o meio externo mais concentrado e a água sai das folhas.
- **Hemácias em água pura** incham e podem estourar (hemólise); em água muito salgada, murcham.
- **Soro fisiológico** tem a mesma concentração do sangue (isotônico), por isso não danifica as células.
- **Salgar carne** para conservar retira água e dificulta a vida das bactérias.

## Transporte ativo (com gasto de energia)

Move substâncias **contra** o gradiente de concentração, gastando **ATP**. Ex.: a **bomba de sódio e potássio**, essencial para os impulsos nervosos.

## Endocitose e exocitose

- **Fagocitose:** a célula "engole" partículas grandes, como glóbulos brancos fazendo com bactérias.
- **Pinocitose:** englobamento de líquidos.
- **Exocitose:** eliminação de substâncias, como hormônios.

## Resumindo

A membrana é seletiva. Difusão e osmose não gastam energia e seguem o gradiente; o transporte ativo gasta ATP e vai contra ele. A osmose explica a salada murcha e o uso do soro fisiológico.`,
    [
      "A membrana plasmática é uma dupla camada de fosfolipídios com proteínas (mosaico fluido).",
      "Difusão e osmose são passivas: seguem o gradiente e não gastam energia.",
      "Na osmose, a água vai para o meio mais concentrado em soluto.",
      "Transporte ativo gasta ATP e vai contra o gradiente (bomba de sódio e potássio).",
    ],
    [
      ["Osmose", "Passagem de água através de uma membrana para o meio mais concentrado em soluto."],
      ["Gradiente de concentração", "Diferença de concentração de uma substância entre dois lugares."],
      ["Solução isotônica", "Solução com a mesma concentração que o interior da célula."],
    ],
    [
      ["Uma salada temperada com sal murcha depois de um tempo porque:", ["as folhas absorvem o sal e incham", "a água sai das células por osmose", "o sal destrói as membranas por transporte ativo", "as folhas fazem fotossíntese", "o vinagre produz gás"], 1, "O sal torna o meio externo mais concentrado; a água sai das células por osmose."],
      ["O transporte que gasta energia (ATP) é:", ["difusão simples", "osmose", "difusão facilitada", "transporte ativo", "nenhum deles"], 3, "O transporte ativo move substâncias contra o gradiente e gasta ATP."],
      ["Hemácias colocadas em água destilada tendem a:", ["murchar", "inchar e podem estourar", "ficar iguais", "se dividir", "virar plaquetas"], 1, "A água pura é menos concentrada: a água entra nas hemácias por osmose."],
      ["O soro fisiológico é usado na veia porque é:", ["hipertônico", "hipotônico", "isotônico em relação ao sangue", "rico em glicose", "ácido"], 2, "Por ter a mesma concentração do sangue, não faz as células incharem nem murcharem."],
      ["Glóbulos brancos englobam bactérias por:", ["osmose", "pinocitose", "fagocitose", "difusão simples", "exocitose"], 2, "Fagocitose é o englobamento de partículas grandes."],
    ],
    [["Explique por que salgar a carne ajuda a conservá-la.", "O sal deixa o meio muito concentrado e a água sai da carne e dos micro-organismos por osmose; sem água, as bactérias e fungos não conseguem se multiplicar."]],
  ),
  aula(
    "Respiração celular e fermentação",
    `## De onde vem a energia

As células precisam de energia para tudo: contrair músculos, transmitir impulsos, fabricar substâncias. Essa energia vem da **quebra da glicose**, que gera **ATP**, a "moeda de energia" da célula.

## Respiração celular aeróbica

Acontece com **oxigênio**, principalmente nas **mitocôndrias**:

glicose + oxigênio → gás carbônico + água + **energia (muito ATP)**

Etapas: **glicólise** (no citoplasma), **ciclo de Krebs** e **cadeia respiratória** (nas mitocôndrias). Rende cerca de **30 a 38 ATP** por glicose.

O gás carbônico que expiramos vem justamente desse processo.

## Fermentação

Acontece **sem oxigênio** e rende só **2 ATP** por glicose.

- **Fermentação alcoólica:** feita por leveduras (fungos). Produz **álcool etílico e gás carbônico**. É usada no pão (o CO₂ faz a massa crescer), na cerveja, no vinho e na produção de etanol combustível a partir da cana.
- **Fermentação lática:** feita por bactérias (iogurte, coalhada) e pelos nossos **músculos** quando falta oxigênio num esforço intenso, produzindo **ácido lático**.

## Fotossíntese x respiração

A fotossíntese **produz** glicose e oxigênio usando luz; a respiração **consome** glicose e oxigênio para liberar energia. Plantas fazem as duas.

## Relação com o ENEM

- Por que o pão cresce? CO₂ da fermentação.
- Por que o atleta sente cansaço muscular? Fermentação lática num esforço muito intenso.
- Por que a cana vira combustível? Fermentação alcoólica.

## Resumindo

Com oxigênio: respiração aeróbica, nas mitocôndrias, muito ATP. Sem oxigênio: fermentação, pouco ATP, com álcool e CO₂ ou ácido lático.`,
    [
      "A quebra da glicose gera ATP, a moeda de energia da célula.",
      "Respiração aeróbica usa oxigênio, ocorre nas mitocôndrias e gera muito ATP.",
      "Fermentação ocorre sem oxigênio e gera só 2 ATP.",
      "Fermentação alcoólica faz o pão crescer e produz etanol; a lática ocorre em músculos e no iogurte.",
    ],
    [
      ["ATP", "Molécula que armazena e transfere energia dentro das células."],
      ["Mitocôndria", "Organela onde ocorre a maior parte da respiração celular aeróbica."],
      ["Levedura", "Fungo microscópico que faz fermentação alcoólica."],
    ],
    [
      ["O gás que faz a massa do pão crescer é produzido por:", ["fotossíntese", "fermentação alcoólica", "fermentação lática", "osmose", "digestão"], 1, "As leveduras fazem fermentação alcoólica e liberam CO₂."],
      ["A respiração celular aeróbica ocorre principalmente:", ["no núcleo", "nos ribossomos", "nas mitocôndrias", "nos cloroplastos", "na parede celular"], 2, "Krebs e cadeia respiratória ocorrem nas mitocôndrias."],
      ["Em um exercício muito intenso, com pouco oxigênio, os músculos produzem:", ["álcool", "ácido lático", "oxigênio", "glicose", "amido"], 1, "Os músculos fazem fermentação lática."],
      ["Comparada à respiração aeróbica, a fermentação produz:", ["mais ATP", "menos ATP", "a mesma quantidade de ATP", "oxigênio", "glicose"], 1, "A fermentação rende 2 ATP; a aeróbica, cerca de 30 a 38."],
      ["O etanol brasileiro é obtido da cana-de-açúcar por meio de:", ["fotossíntese", "fermentação alcoólica", "respiração aeróbica", "destilação do petróleo", "fermentação lática"], 1, "Leveduras fermentam o açúcar da cana produzindo etanol."],
    ],
    [["Explique a diferença entre respiração aeróbica e fermentação.", "A respiração aeróbica usa oxigênio, ocorre nas mitocôndrias e produz muita energia; a fermentação ocorre sem oxigênio e produz pouca energia, além de álcool e gás carbônico ou ácido lático."]],
  ),
  aula(
    "DNA, RNA e síntese de proteínas",
    `## O DNA guarda as instruções

O **DNA** (ácido desoxirribonucleico) é a molécula que guarda as informações hereditárias. Ele tem a forma de uma **dupla hélice** formada por **nucleotídeos**, com quatro bases: **adenina (A), timina (T), citosina (C) e guanina (G)**.

As bases se pareiam sempre do mesmo jeito: **A com T** e **C com G**.

## O RNA

O **RNA** tem uma fita só, o açúcar ribose e troca a timina pela **uracila (U)**. Tipos principais:

- **RNA mensageiro (RNAm):** leva a "receita" do DNA até os ribossomos.
- **RNA transportador (RNAt):** traz os aminoácidos.
- **RNA ribossômico (RNAr):** forma os ribossomos.

## Do gene à proteína

1. **Replicação:** o DNA faz uma cópia de si mesmo antes da divisão celular.
2. **Transcrição:** um trecho do DNA (um **gene**) é copiado em RNAm, no núcleo.
3. **Tradução:** nos ribossomos, o RNAm é lido de **três em três bases (códons)** e cada códon indica um **aminoácido**. Os aminoácidos se ligam e formam a **proteína**.

## Por que isso importa

As proteínas fazem quase tudo no corpo: enzimas, hormônios como a insulina, anticorpos, a cor dos olhos. Uma **mutação** (mudança no DNA) pode mudar a proteína, como na anemia falciforme.

## Biotecnologia

Conhecer esse processo permite produzir **insulina humana** em bactérias, fazer **testes de DNA** e criar **vacinas de RNA mensageiro**, que ensinam a célula a produzir uma proteína do vírus para treinar o sistema imune.

## Resumindo

DNA (A-T, C-G) guarda a informação; a transcrição gera o RNAm; a tradução, nos ribossomos, forma proteínas lendo códons de três bases.`,
    [
      "DNA é dupla hélice com bases A, T, C e G; pareamento A-T e C-G.",
      "RNA tem uma fita, ribose e uracila no lugar da timina.",
      "Transcrição: DNA → RNAm; tradução: RNAm → proteína nos ribossomos.",
      "Cada códon (três bases) indica um aminoácido.",
    ],
    [
      ["Gene", "Trecho do DNA com a informação para fabricar uma proteína."],
      ["Códon", "Sequência de três bases do RNAm que indica um aminoácido."],
      ["Mutação", "Alteração na sequência do DNA."],
    ],
    [
      ["Se uma fita de DNA tem a sequência ATCG, a fita complementar é:", ["ATCG", "TAGC", "UAGC", "GCTA", "CGAT"], 1, "A pareia com T e C com G: TAGC."],
      ["A base nitrogenada que existe no RNA e não no DNA é:", ["adenina", "timina", "citosina", "uracila", "guanina"], 3, "No RNA, a uracila substitui a timina."],
      ["O processo em que o RNAm é produzido a partir do DNA chama-se:", ["replicação", "transcrição", "tradução", "mutação", "fermentação"], 1, "Transcrição é a cópia de um gene em RNA."],
      ["A tradução (montagem da proteína) acontece:", ["no núcleo", "nos ribossomos", "na membrana", "nas mitocôndrias apenas", "no vacúolo"], 1, "Os ribossomos leem o RNAm e ligam os aminoácidos."],
      ["Quantas bases formam um códon?", ["1", "2", "3", "4", "20"], 2, "Cada códon tem três bases."],
    ],
    [["Explique, em ordem, como a informação do DNA vira uma proteína.", "Primeiro um gene do DNA é transcrito em RNA mensageiro no núcleo; depois o RNA mensageiro vai aos ribossomos, onde é lido de três em três bases, e cada códon indica um aminoácido que se liga aos outros formando a proteína."]],
  ),
  aula(
    "Divisão celular: mitose e meiose",
    `## Por que as células se dividem

As células se dividem para o corpo **crescer**, **repor** células mortas, **cicatrizar** feridas e para formar **gametas** (espermatozoides e óvulos).

## Mitose

- Uma célula gera **duas células idênticas** à original.
- O número de cromossomos **se mantém** (no ser humano, 46).
- Serve para crescimento, regeneração e reprodução assexuada.

Fases: **prófase** (cromossomos se condensam), **metáfase** (alinham-se no meio), **anáfase** (separam-se para os polos) e **telófase** (formam-se dois núcleos).

## Meiose

- Uma célula gera **quatro células** com **metade** dos cromossomos (23 no ser humano).
- Acontece na formação dos **gametas**.
- Na fecundação, 23 + 23 = 46: o número volta ao normal.

A meiose também **aumenta a variabilidade genética** por causa do **crossing-over** (troca de pedaços entre cromossomos) e da separação aleatória dos cromossomos. Por isso irmãos (que não são gêmeos idênticos) são diferentes.

## Câncer

O **câncer** é uma doença em que células se dividem **sem controle**, formando tumores. Fatores como cigarro, radiação ultravioleta em excesso e algumas infecções aumentam o risco porque causam mutações nos genes que controlam a divisão.

## Comparando

| | Mitose | Meiose |
|---|---|---|
| Células formadas | 2 | 4 |
| Cromossomos | iguais à mãe | metade |
| Função | crescimento e reparo | gametas |

## Resumindo

Mitose: duas células iguais, mesmo número de cromossomos, para crescer e reparar. Meiose: quatro células com metade dos cromossomos, para gametas e variabilidade.`,
    [
      "Mitose gera 2 células idênticas com o mesmo número de cromossomos.",
      "Meiose gera 4 células com metade dos cromossomos (gametas).",
      "Crossing-over e separação aleatória aumentam a variabilidade genética.",
      "Câncer é divisão celular sem controle, causada por mutações.",
    ],
    [
      ["Cromossomo", "Estrutura formada por DNA condensado que carrega os genes."],
      ["Gameta", "Célula reprodutiva com metade dos cromossomos (óvulo ou espermatozoide)."],
      ["Crossing-over", "Troca de pedaços entre cromossomos durante a meiose."],
    ],
    [
      ["A cicatrização de um corte na pele ocorre principalmente por:", ["meiose", "mitose", "fecundação", "fermentação", "osmose"], 1, "Novas células iguais são produzidas por mitose."],
      ["Um espermatozoide humano tem quantos cromossomos?", ["23", "46", "92", "12", "48"], 0, "Gametas têm metade: 23."],
      ["Ao final da meiose, uma célula origina:", ["2 células iguais", "4 células com metade dos cromossomos", "4 células iguais à mãe", "1 célula maior", "8 células"], 1, "A meiose forma quatro células haploides."],
      ["O crossing-over é importante porque:", ["mantém as células idênticas", "aumenta a variabilidade genética", "impede a fecundação", "duplica o número de cromossomos", "produz energia"], 1, "A troca de trechos cria novas combinações de genes."],
      ["O câncer está relacionado a:", ["divisões celulares descontroladas", "falta de osmose", "excesso de fotossíntese", "ausência de mitocôndrias", "meiose normal"], 0, "Mutações fazem as células se dividirem sem controle."],
    ],
    [["Por que é importante que os gametas tenham metade dos cromossomos?", "Porque na fecundação o gameta masculino e o feminino se juntam; se cada um tem metade, o filho fica com o número normal de cromossomos, 46 no ser humano."]],
  ),
  aula(
    "Genética: leis de Mendel e heredograma",
    `## O pai da genética

**Gregor Mendel** estudou ervilhas no século XIX e descobriu como as características passam de pais para filhos.

## Conceitos básicos

- **Gene:** trecho do DNA que determina uma característica.
- **Alelos:** versões de um gene (ex.: semente amarela ou verde).
- **Dominante (A):** aparece mesmo com uma só cópia.
- **Recessivo (a):** só aparece em dose dupla (aa).
- **Homozigoto:** alelos iguais (AA ou aa). **Heterozigoto:** diferentes (Aa).
- **Genótipo:** os alelos. **Fenótipo:** a característica visível.

## 1ª Lei de Mendel

Cada característica é determinada por **um par de alelos**, que se separam na formação dos gametas. Cada filho recebe um alelo de cada pai.

## Cruzamento clássico: Aa × Aa

| | A | a |
|---|---|---|
| A | AA | Aa |
| a | Aa | aa |

Genótipos: 1 AA : 2 Aa : 1 aa. Fenótipos: **3 dominantes : 1 recessivo**. A chance de um filho ser aa é **1/4**.

## Heredogramas

São "árvores genealógicas" com símbolos: quadrado = homem, círculo = mulher, preenchido = afetado. Pista importante: se **dois pais sem a característica** têm um filho **com** ela, a característica é **recessiva** e os pais são **heterozigotos**.

## Exemplos humanos

O **albinismo** e a **fibrose cística** são recessivos. A **acondroplasia** (um tipo de nanismo) é dominante.

## Resumindo

Alelos dominantes aparecem com uma cópia; recessivos, só em dose dupla. Aa × Aa dá 3:1. Pais normais com filho afetado indicam herança recessiva.`,
    [
      "Cada característica é determinada por um par de alelos, um de cada pai.",
      "Dominante aparece com uma cópia; recessivo só em dose dupla.",
      "Aa × Aa: 1 AA : 2 Aa : 1 aa, ou 3 dominantes : 1 recessivo.",
      "Pais sem a característica com filho afetado: herança recessiva.",
    ],
    [
      ["Alelo", "Cada versão de um gene."],
      ["Genótipo", "Conjunto de alelos de um indivíduo para uma característica."],
      ["Fenótipo", "Característica que se manifesta, influenciada pelo genótipo e pelo ambiente."],
    ],
    [
      ["No cruzamento Aa × Aa, a probabilidade de um filho aa é:", ["0", "1/4", "1/2", "3/4", "1"], 1, "Um em cada quatro quadros do quadro de Punnett é aa."],
      ["Um indivíduo Aa é:", ["homozigoto dominante", "homozigoto recessivo", "heterozigoto", "mutante", "estéril"], 2, "Tem alelos diferentes: heterozigoto."],
      ["Pais sem albinismo tiveram um filho albino. Os pais são:", ["AA e AA", "Aa e Aa", "aa e aa", "AA e aa", "impossível saber"], 1, "Para o filho ser aa, cada pai precisa ter um alelo a, sem manifestar: Aa."],
      ["Cruzando AA × aa, os filhos serão:", ["todos AA", "todos aa", "todos Aa", "metade AA e metade aa", "3/4 aa"], 2, "Cada filho recebe A de um pai e a do outro."],
      ["Fenótipo é:", ["a sequência do DNA", "a característica observável", "o número de cromossomos", "o alelo recessivo", "o heredograma"], 1, "Fenótipo é o que se manifesta, como a cor dos olhos."],
    ],
    [["Num heredograma, como descobrir que uma doença é recessiva?", "Quando dois pais que não têm a doença têm um filho afetado; isso mostra que os dois carregam o alelo recessivo sem manifestá-lo, ou seja, são heterozigotos."]],
  ),
  aula(
    "Grupos sanguíneos: sistema ABO e fator Rh",
    `## Por que existem tipos de sangue

As hemácias têm na superfície substâncias chamadas **aglutinogênios** (antígenos A e B). O plasma tem **aglutininas** (anticorpos anti-A e anti-B), que atacam o antígeno que a pessoa não tem.

## Sistema ABO

| Tipo | Antígeno na hemácia | Anticorpo no plasma |
|---|---|---|
| A | A | anti-B |
| B | B | anti-A |
| AB | A e B | nenhum |
| O | nenhum | anti-A e anti-B |

## Transfusões

O doador não pode ter um antígeno que o receptor ataque:

- **O** é **doador universal** (não tem antígenos A nem B).
- **AB** é **receptor universal** (não tem anticorpos anti-A nem anti-B).
- A recebe de A e O; B recebe de B e O.

## Genética do ABO

Três alelos: **Iᴬ**, **Iᴮ** e **i**. Iᴬ e Iᴮ são **codominantes** (os dois aparecem juntos no tipo AB) e ambos dominam o i.

- A: IᴬIᴬ ou Iᴬi. B: IᴮIᴮ ou Iᴮi. AB: IᴬIᴮ. O: ii.

Pais A (Iᴬi) e B (Iᴮi) podem ter filhos dos **quatro tipos**.

## Fator Rh

Quem tem o antígeno Rh é **Rh+**; quem não tem, **Rh−**. A **eritroblastose fetal** pode ocorrer quando a mãe é Rh− e o bebê Rh+: na segunda gestação, os anticorpos da mãe atacam as hemácias do bebê. Hoje isso é prevenido com uma injeção de imunoglobulina após o primeiro parto.

## Resumindo

O é doador universal; AB é receptor universal. Iᴬ e Iᴮ são codominantes e o i é recessivo. Mãe Rh− com bebê Rh+ exige cuidado.`,
    [
      "Tipo sanguíneo depende dos antígenos A e B nas hemácias.",
      "O é doador universal; AB é receptor universal.",
      "Iᴬ e Iᴮ são codominantes; i é recessivo (tipo O = ii).",
      "Eritroblastose fetal: mãe Rh− e bebê Rh+, prevenida com imunoglobulina.",
    ],
    [
      ["Antígeno", "Substância que o sistema imune reconhece como estranha."],
      ["Codominância", "Quando dois alelos se manifestam juntos, como no tipo AB."],
      ["Eritroblastose fetal", "Doença em que anticorpos da mãe atacam hemácias do bebê."],
    ],
    [
      ["Uma pessoa do tipo O pode doar sangue para:", ["só tipo O", "só tipo AB", "todos os tipos do sistema ABO", "só A e B", "ninguém"], 2, "Sem antígenos A e B, o sangue O não é atacado: doador universal."],
      ["Uma pessoa do tipo AB pode receber sangue de:", ["só AB", "A, B, AB e O", "só O", "só A", "só B"], 1, "Sem anticorpos anti-A e anti-B: receptor universal."],
      ["O genótipo de uma pessoa do tipo O é:", ["IᴬIᴮ", "Iᴬi", "ii", "IᴮIᴮ", "IᴬIᴬ"], 2, "O tipo O é recessivo: ii."],
      ["Pais Iᴬi e Iᴮi podem ter filhos dos tipos:", ["só A e B", "só AB", "A, B, AB e O", "só O", "só A"], 2, "As combinações IᴬIᴮ, Iᴬi, Iᴮi e ii dão os quatro tipos."],
      ["A eritroblastose fetal pode ocorrer quando:", ["mãe Rh+ e bebê Rh−", "mãe Rh− e bebê Rh+", "mãe e bebê Rh+", "mãe e bebê Rh−", "o pai é tipo O"], 1, "Os anticorpos anti-Rh da mãe Rh− atacam as hemácias do bebê Rh+."],
    ],
    [["Explique por que o tipo O é chamado de doador universal.", "Porque as hemácias do tipo O não têm os antígenos A nem B, então os anticorpos de quem recebe não as atacam, independentemente do tipo do receptor no sistema ABO."]],
  ),
  aula(
    "Sistema imunológico, vacinas e soros",
    `## A defesa do corpo

O **sistema imunológico** protege o corpo contra vírus, bactérias, fungos e parasitas. Ele tem duas linhas de defesa.

## Defesa inata

É a primeira barreira, igual para qualquer invasor: pele, mucosas, lágrima, saliva, febre, inflamação e células que fazem **fagocitose** (como neutrófilos e macrófagos).

## Defesa adaptativa

É específica para cada invasor e tem **memória**:

- **Linfócitos B** produzem **anticorpos**, proteínas que se ligam aos **antígenos** do invasor.
- **Linfócitos T** coordenam a resposta e destroem células infectadas.
- Depois de uma infecção, ficam **células de memória**: num segundo contato, a resposta é mais rápida e forte.

## Vacina: imunização ativa

A vacina leva ao corpo o **antígeno** (vírus atenuado, inativado, partes do vírus ou RNA mensageiro) **sem causar a doença**. O próprio corpo produz anticorpos e células de memória.

- É **preventiva**.
- A proteção demora alguns dias para surgir, mas é **duradoura**.
- Quando muita gente se vacina, forma-se a **imunidade coletiva**, que protege até quem não pode se vacinar.

## Soro: imunização passiva

O soro já traz **anticorpos prontos** (produzidos em outro animal, como cavalos). É usado em emergências, como **picada de cobra** ou **tétano**.

- É **curativo** e age **na hora**.
- A proteção é **temporária**: não há memória.

## HIV

O HIV ataca os **linfócitos T auxiliares**, enfraquecendo todo o sistema imune; por isso, sem tratamento, doenças oportunistas aparecem.

## Resumindo

Vacina: antígeno, imunidade ativa, preventiva e duradoura. Soro: anticorpos prontos, imunidade passiva, curativa e temporária.`,
    [
      "A defesa adaptativa é específica e tem memória.",
      "Linfócitos B produzem anticorpos; linfócitos T coordenam e destroem células infectadas.",
      "Vacina: antígeno, imunização ativa, preventiva e duradoura.",
      "Soro: anticorpos prontos, imunização passiva, imediata e temporária.",
    ],
    [
      ["Anticorpo", "Proteína que reconhece e se liga a um antígeno específico."],
      ["Imunidade coletiva", "Proteção da comunidade quando a maioria está vacinada."],
      ["Memória imunológica", "Capacidade de reconhecer rapidamente um invasor já encontrado."],
    ],
    [
      ["Uma pessoa picada por cobra venenosa deve receber:", ["vacina", "soro antiofídico", "antibiótico", "vitamina", "antiviral"], 1, "O soro traz anticorpos prontos e age imediatamente."],
      ["A vacina protege porque:", ["traz anticorpos prontos", "estimula o corpo a produzir anticorpos e memória", "mata o vírus no ar", "substitui os linfócitos", "causa a doença leve sempre"], 1, "É imunização ativa: o corpo produz a própria defesa."],
      ["A imunidade obtida pelo soro é:", ["ativa e duradoura", "passiva e temporária", "ativa e temporária", "passiva e permanente", "genética"], 1, "Os anticorpos recebidos acabam com o tempo e não há memória."],
      ["As células que produzem anticorpos são os:", ["linfócitos B", "glóbulos vermelhos", "plaquetas", "neurônios", "linfócitos T apenas"], 0, "Os linfócitos B (e os plasmócitos derivados deles) produzem anticorpos."],
      ["A imunidade coletiva acontece quando:", ["ninguém se vacina", "a maioria da população está vacinada", "só idosos se vacinam", "se usa soro", "se tomam antibióticos"], 1, "Com poucos suscetíveis, o vírus circula menos e protege até quem não se vacinou."],
    ],
    [["Explique a diferença entre vacina e soro.", "A vacina contém antígenos que estimulam o corpo a produzir anticorpos e memória, sendo preventiva e duradoura; o soro contém anticorpos prontos, age na hora, é usado para tratar e a proteção é temporária."]],
  ),
  aula(
    "Sistema digestório e nutrição",
    `## Da comida às moléculas

A **digestão** quebra os alimentos em moléculas pequenas que o corpo consegue absorver.

## O caminho do alimento

1. **Boca:** dentes trituram (digestão mecânica); a saliva tem **amilase**, que começa a digerir o **amido**.
2. **Esôfago:** leva o alimento ao estômago por movimentos chamados **peristaltismo**.
3. **Estômago:** o suco gástrico, com **ácido clorídrico** e **pepsina**, digere **proteínas**.
4. **Intestino delgado:** principal local de digestão e **absorção**.
   - O **fígado** produz a **bile**, que emulsiona as gorduras (quebra em gotinhas).
   - O **pâncreas** libera enzimas que digerem carboidratos, proteínas e lipídios.
   - As **vilosidades** aumentam a área de absorção.
5. **Intestino grosso:** absorve **água** e forma as fezes. Bactérias da flora intestinal produzem vitaminas.

## Nutrientes

- **Carboidratos:** energia (pão, arroz, massas).
- **Proteínas:** construção do corpo (carnes, ovos, feijão).
- **Lipídios:** energia e reserva (óleos, manteiga).
- **Vitaminas e sais minerais:** funcionamento do corpo. Falta de vitamina C causa **escorbuto**; de vitamina A, problemas de visão; de ferro, **anemia**.
- **Fibras:** ajudam o intestino a funcionar.

## Saúde

- **Obesidade e diabetes tipo 2** se relacionam ao excesso de açúcar e alimentos ultraprocessados.
- **Desnutrição** ainda atinge famílias pobres.

## Resumindo

Boca (amido), estômago (proteínas), intestino delgado (quase tudo + absorção), intestino grosso (água). Bile emulsiona gorduras. Uma dieta equilibrada combina todos os nutrientes.`,
    [
      "Amilase salivar inicia a digestão do amido na boca.",
      "No estômago, a pepsina digere proteínas em meio ácido.",
      "O intestino delgado é o principal local de digestão e absorção.",
      "A bile emulsiona gorduras; o intestino grosso absorve água.",
    ],
    [
      ["Enzima", "Proteína que acelera reações, como a quebra de nutrientes."],
      ["Bile", "Líquido produzido pelo fígado que emulsiona as gorduras."],
      ["Vilosidades", "Dobras do intestino delgado que aumentam a área de absorção."],
    ],
    [
      ["A digestão das proteínas começa no:", ["boca", "esôfago", "estômago", "intestino grosso", "fígado"], 2, "A pepsina, no estômago, começa a digerir proteínas."],
      ["A bile, produzida pelo fígado, atua sobre:", ["proteínas", "gorduras", "amido", "fibras", "vitaminas"], 1, "A bile emulsiona as gorduras."],
      ["A maior parte da absorção de nutrientes ocorre no:", ["estômago", "intestino delgado", "intestino grosso", "esôfago", "pâncreas"], 1, "As vilosidades do intestino delgado absorvem os nutrientes."],
      ["A falta de vitamina C causa:", ["anemia", "escorbuto", "raquitismo", "cegueira noturna", "bócio"], 1, "Escorbuto, com sangramento nas gengivas."],
      ["A principal função do intestino grosso é:", ["digerir proteínas", "absorver água e formar as fezes", "produzir bile", "digerir amido", "produzir insulina"], 1, "O intestino grosso absorve água."],
    ],
    [["Descreva o caminho do alimento e onde cada tipo de nutriente começa a ser digerido.", "Na boca a saliva começa a digerir o amido; no estômago o suco gástrico digere proteínas; no intestino delgado, com a bile e o suco pancreático, digerem-se gorduras e o restante, e os nutrientes são absorvidos; no intestino grosso a água é absorvida."]],
  ),
  aula(
    "Sistemas circulatório e respiratório",
    `## Transporte e trocas

Os sistemas **circulatório** e **respiratório** trabalham juntos: um leva o oxigênio para todo o corpo e o outro faz a troca de gases com o ar.

## O coração

O coração humano tem **quatro cavidades**: dois **átrios** (recebem sangue) e dois **ventrículos** (bombeiam). O lado direito trabalha com sangue pobre em oxigênio; o esquerdo, com sangue rico em oxigênio. Eles não se misturam.

## Dois circuitos

- **Pequena circulação (pulmonar):** coração → pulmões → coração. O sangue deixa o CO₂ e pega O₂.
- **Grande circulação (sistêmica):** coração → corpo → coração. Leva O₂ e nutrientes às células e recolhe CO₂.

## Vasos

- **Artérias:** levam sangue **do** coração (paredes grossas, alta pressão).
- **Veias:** trazem sangue **ao** coração (têm válvulas).
- **Capilares:** finíssimos, é onde ocorrem as trocas com as células.

## O sangue

- **Hemácias:** transportam O₂ graças à **hemoglobina** (que tem ferro).
- **Leucócitos:** defesa.
- **Plaquetas:** coagulação.
- **Plasma:** parte líquida.

## Respiração

O ar entra por nariz → faringe → laringe → traqueia → brônquios → **alvéolos**, onde ocorre a **hematose** (troca de gases). O **diafragma** se contrai e desce na inspiração.

## Saúde

- **Cigarro:** danifica os alvéolos (enfisema) e causa câncer.
- **Hipertensão:** pressão alta, ligada a sal em excesso e sedentarismo.
- **Monóxido de carbono** se liga à hemoglobina e impede o transporte de O₂.

## Resumindo

Coração de 4 cavidades, circulação dupla (pulmonar e sistêmica), artérias saem do coração, veias chegam, capilares trocam. Nos alvéolos ocorre a hematose.`,
    [
      "O coração tem 4 cavidades; os lados direito e esquerdo não misturam o sangue.",
      "Pequena circulação vai aos pulmões; grande circulação vai ao corpo.",
      "Artérias saem do coração; veias chegam; capilares fazem as trocas.",
      "Nos alvéolos ocorre a hematose (troca de O₂ e CO₂).",
    ],
    [
      ["Hematose", "Troca de gases nos alvéolos: o sangue recebe O₂ e libera CO₂."],
      ["Hemoglobina", "Proteína das hemácias que transporta oxigênio."],
      ["Capilar", "Vaso sanguíneo finíssimo onde ocorrem as trocas com as células."],
    ],
    [
      ["Os vasos que levam o sangue do coração para o corpo são as:", ["veias", "artérias", "vênulas", "linfas", "traqueias"], 1, "Artérias saem do coração."],
      ["A troca de gases nos pulmões acontece nos:", ["brônquios", "alvéolos", "laringe", "traqueia", "diafragma"], 1, "Nos alvéolos ocorre a hematose."],
      ["O transporte de oxigênio no sangue é feito principalmente pelas:", ["plaquetas", "hemácias", "leucócitos", "células do plasma", "linfócitos"], 1, "As hemácias têm hemoglobina, que leva O₂."],
      ["O monóxido de carbono é perigoso porque:", ["dilata os alvéolos", "se liga à hemoglobina e impede o transporte de O₂", "aumenta as plaquetas", "destrói o diafragma", "causa febre"], 1, "Ele ocupa o lugar do oxigênio na hemoglobina."],
      ["A pequena circulação leva o sangue:", ["do coração ao corpo", "do coração aos pulmões e de volta", "do fígado ao intestino", "dos rins à bexiga", "do cérebro aos pés"], 1, "É a circulação pulmonar."],
    ],
    [["Explique o que acontece com o sangue na pequena e na grande circulação.", "Na pequena circulação o sangue vai do coração aos pulmões, libera gás carbônico e recebe oxigênio; na grande circulação o sangue oxigenado vai do coração ao corpo, entrega oxigênio e nutrientes e recolhe gás carbônico."]],
  ),
  aula(
    "Sistemas nervoso e endócrino: comando do corpo",
    `## Dois sistemas de controle

O corpo é coordenado por dois sistemas: o **nervoso** (rápido, por impulsos elétricos) e o **endócrino** (mais lento e duradouro, por **hormônios** no sangue).

## Sistema nervoso

- **Neurônio:** célula que transmite o **impulso nervoso**. Tem dendritos (recebem), corpo celular e axônio (envia).
- **Sinapse:** ligação entre neurônios, onde atuam os **neurotransmissores** (como serotonina e dopamina).
- **Sistema nervoso central:** encéfalo e medula espinhal.
- **Sistema nervoso periférico:** nervos que ligam o centro ao corpo.

## Arco reflexo

Ao tocar algo muito quente, você tira a mão **antes** de sentir dor. O estímulo vai à **medula espinhal**, que responde direto, sem esperar o cérebro. Isso protege o corpo.

## Drogas e sistema nervoso

Álcool e outras drogas alteram os neurotransmissores, afetando reflexos, memória e humor. Por isso beber e dirigir é perigoso.

## Sistema endócrino

Glândulas liberam hormônios no sangue:

- **Pâncreas:** **insulina** (baixa a glicose do sangue) e glucagon (aumenta). Falta de insulina causa **diabetes**.
- **Tireoide:** hormônios do metabolismo; precisa de **iodo** (por isso o sal é iodado; a falta causa bócio).
- **Suprarrenais:** **adrenalina**, a reação de "luta ou fuga".
- **Hipófise:** controla outras glândulas e produz o hormônio do crescimento.
- **Ovários e testículos:** estrogênio, progesterona e testosterona.

## Resumindo

Nervoso: rápido, por impulsos e sinapses; o reflexo passa pela medula. Endócrino: hormônios no sangue, como insulina (glicose) e adrenalina (alerta).`,
    [
      "Sistema nervoso: rápido, por impulsos; endócrino: lento, por hormônios.",
      "Sinapse é a ligação entre neurônios, com neurotransmissores.",
      "No arco reflexo, a medula responde antes do cérebro.",
      "Insulina baixa a glicose; falta dela causa diabetes. Iodo é essencial à tireoide.",
    ],
    [
      ["Neurônio", "Célula do sistema nervoso que transmite impulsos."],
      ["Hormônio", "Substância produzida por glândulas e levada pelo sangue que regula funções do corpo."],
      ["Arco reflexo", "Resposta rápida e involuntária coordenada pela medula espinhal."],
    ],
    [
      ["O hormônio que diminui a quantidade de glicose no sangue é:", ["adrenalina", "insulina", "glucagon", "testosterona", "tiroxina"], 1, "A insulina, produzida pelo pâncreas, faz a glicose entrar nas células."],
      ["Tirar a mão rapidamente de uma panela quente é um exemplo de:", ["ato voluntário pensado", "arco reflexo", "ação hormonal", "digestão", "sinapse química apenas no cérebro"], 1, "A medula espinhal responde antes de a dor chegar ao cérebro."],
      ["O sal de cozinha é iodado para prevenir:", ["diabetes", "bócio", "anemia", "escorbuto", "hipertensão"], 1, "O iodo é usado pela tireoide; sua falta causa bócio."],
      ["A adrenalina é liberada em situações de:", ["sono profundo", "perigo ou estresse", "digestão", "crescimento", "jejum longo apenas"], 1, "Ela prepara o corpo para lutar ou fugir."],
      ["Os neurotransmissores atuam:", ["nas hemácias", "nas sinapses", "no estômago", "nos ossos", "nas glândulas sudoríparas"], 1, "São liberados na sinapse para passar o impulso adiante."],
    ],
    [["Compare o funcionamento do sistema nervoso e do sistema endócrino.", "O sistema nervoso age por impulsos elétricos entre neurônios, com respostas muito rápidas e curtas; o endócrino age por hormônios levados pelo sangue, com respostas mais lentas e duradouras."]],
  ),
];
