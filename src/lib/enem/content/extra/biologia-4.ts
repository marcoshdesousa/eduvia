import { aula } from "./build";

/** Biologia, lote 4: fisiologia, seres vivos, biotecnologia e saúde. */
export const BIOLOGIA_4 = [
  aula(
    "Fotossíntese em detalhe: fase clara e fase escura",
    `## A equação geral

**6 CO₂ + 6 H₂O + luz → C₆H₁₂O₆ (glicose) + 6 O₂**

A fotossíntese ocorre nos **cloroplastos**, organelas com o pigmento **clorofila**, que absorve principalmente luz **azul** e **vermelha** (e reflete a **verde**, por isso as folhas são verdes).

## Fase clara (fotoquímica)

- Ocorre nos **tilacoides** (membranas internas do cloroplasto) e **depende da luz**.
- A luz excita a clorofila.
- **Fotólise da água:** a água é quebrada → libera **O₂** (o oxigênio liberado vem da **água**, não do CO₂).
- Produz **ATP** e **NADPH** (moléculas que carregam energia).

## Fase escura (química, ciclo de Calvin)

- Ocorre no **estroma** (líquido do cloroplasto) e **não depende diretamente** da luz (mas precisa dos produtos da fase clara).
- O **CO₂** do ar é **fixado** e, usando ATP e NADPH, forma **glicose**.
- A enzima **rubisco** participa da fixação do CO₂.

## Fatores que afetam a taxa de fotossíntese

- **Intensidade luminosa:** aumenta a taxa até um limite (saturação).
- **Concentração de CO₂:** aumenta a taxa até um limite.
- **Temperatura:** há um valor ótimo; calor excessivo desnatura as enzimas.
- **Água** disponível.

## Ponto de compensação luminoso

- A planta também **respira** o tempo todo (consome O₂ e libera CO₂).
- **Ponto de compensação:** intensidade de luz em que a **fotossíntese = respiração** (a planta não ganha nem perde matéria orgânica).
- Abaixo dele, a planta consome mais do que produz; acima, cresce.
- Plantas de **sombra** têm ponto de compensação **baixo**; plantas de **sol**, alto.

## Importância

- Base das **cadeias alimentares** (produtores).
- Produz o **oxigênio** da atmosfera.
- Retira **CO₂** do ar (sequestro de carbono) — por isso florestas e algas ajudam a combater o aquecimento global.
- Origem da energia dos **combustíveis fósseis** e da **biomassa**.

## Quimiossíntese

Algumas bactérias produzem matéria orgânica usando a energia de **reações químicas** (oxidação de compostos inorgânicos), **sem luz** — como nas fontes hidrotermais do fundo do mar.

## Resumindo

Fase clara (tilacoides): luz quebra a água, libera O₂ e produz ATP e NADPH. Fase escura (estroma, ciclo de Calvin): CO₂ é fixado e forma glicose. Luz, CO₂ e temperatura limitam a taxa. No ponto de compensação, fotossíntese = respiração.`,
    [
      "Fase clara: luz quebra a água e libera O₂.",
      "O oxigênio liberado vem da água.",
      "Fase escura (ciclo de Calvin): CO₂ é fixado em glicose.",
      "Ponto de compensação: fotossíntese = respiração.",
    ],
    [
      ["Clorofila", "Pigmento verde que absorve a luz para a fotossíntese."],
      ["Fotólise da água", "Quebra da molécula de água pela energia luminosa."],
      ["Ponto de compensação", "Intensidade de luz em que a fotossíntese iguala a respiração."],
    ],
    [
      ["O oxigênio liberado na fotossíntese vem:", ["do CO₂", "da água", "da glicose", "do solo", "do nitrogênio"], 1, "Fotólise."],
      ["A fase escura da fotossíntese ocorre:", ["nos tilacoides", "no estroma", "na mitocôndria", "no núcleo", "no vacúolo"], 1, "Ciclo de Calvin."],
      ["As folhas são verdes porque a clorofila:", ["absorve a luz verde", "reflete a luz verde", "não absorve luz", "produz luz verde", "absorve só infravermelho"], 1, "Absorve azul e vermelho."],
      ["No ponto de compensação luminoso:", ["a planta só respira", "a fotossíntese é igual à respiração", "a planta não faz fotossíntese", "a planta cresce ao máximo", "não há luz"], 1, "Equilíbrio."],
      ["Aumentar muito a temperatura reduz a fotossíntese porque:", ["a luz some", "as enzimas desnaturam", "o CO₂ aumenta", "a clorofila vira azul", "a água congela"], 1, "Proteínas perdem a forma."],
    ],
    [["Explique a diferença entre a fase clara e a fase escura da fotossíntese.", "Na fase clara, nos tilacoides, a luz excita a clorofila, quebra a água liberando oxigênio e produz ATP e NADPH; na fase escura, no estroma, essas moléculas são usadas para fixar o CO₂ e produzir glicose no ciclo de Calvin."]],
  ),
  aula(
    "Sistema reprodutor, hormônios e ciclo menstrual",
    `## Sistema reprodutor masculino

- **Testículos:** produzem **espermatozoides** e o hormônio **testosterona**. Ficam no escroto, com temperatura um pouco menor que a do corpo (necessária para a produção).
- **Epidídimo:** amadurecimento e armazenamento dos espermatozoides.
- **Ductos deferentes:** levam os espermatozoides (cortados na **vasectomia**).
- **Glândulas** (vesículas seminais, próstata): produzem o líquido do **sêmen**.
- **Uretra** e **pênis**.

## Sistema reprodutor feminino

- **Ovários:** produzem os **ovócitos** e os hormônios **estrogênio** e **progesterona**.
- **Tubas uterinas:** local onde geralmente ocorre a **fecundação** (cortadas/ligadas na **laqueadura**).
- **Útero:** onde o embrião se implanta; revestido pelo **endométrio**.
- **Vagina.**

## Ciclo menstrual (cerca de 28 dias)

Controlado por hormônios da **hipófise** (**FSH** e **LH**) e dos **ovários** (estrogênio e progesterona).

1. **Menstruação (dias 1 a 5):** descamação do endométrio quando não houve gravidez.
2. **Fase folicular:** o **FSH** estimula o amadurecimento do folículo no ovário, que produz **estrogênio** → o endométrio volta a engrossar.
3. **Ovulação (por volta do 14º dia):** pico de **LH** → o ovócito é liberado. É o **período fértil** (alguns dias antes e depois).
4. **Fase lútea:** o folículo vira **corpo lúteo**, que produz **progesterona**, mantendo o endométrio preparado para a gravidez.
5. Sem fecundação, o corpo lúteo regride, a progesterona **cai** e ocorre nova **menstruação**.

Se houver gravidez, o embrião produz **hCG** (hormônio detectado nos **testes de gravidez**), que mantém o corpo lúteo.

## Métodos contraceptivos (revisão)

- **Barreira:** **camisinha** masculina e feminina (também previnem **ISTs**), diafragma.
- **Hormonais:** **pílula** (inibe a ovulação), injeção, implante, adesivo.
- **DIU** (de cobre ou hormonal).
- **Cirúrgicos:** vasectomia e laqueadura.
- **Comportamentais** (tabelinha): pouco eficientes, pois o ciclo varia.
- **Pílula do dia seguinte:** emergência, não deve ser usada como rotina.

## Puberdade

Hormônios sexuais causam as **características sexuais secundárias**: pelos, mudança de voz, crescimento das mamas, menarca (primeira menstruação), aumento de massa muscular.

## Resumindo

Testículos produzem espermatozoides e testosterona; ovários, ovócitos, estrogênio e progesterona. No ciclo menstrual, o FSH amadurece o folículo, o pico de LH causa a ovulação (~14º dia) e a progesterona mantém o endométrio. Camisinha previne gravidez e ISTs.`,
    [
      "Testículos: espermatozoides e testosterona.",
      "Ovários: ovócitos, estrogênio e progesterona.",
      "Pico de LH provoca a ovulação (~14º dia).",
      "Queda da progesterona leva à menstruação; hCG indica gravidez.",
    ],
    [
      ["Endométrio", "Camada interna do útero que se renova a cada ciclo."],
      ["Ovulação", "Liberação do ovócito pelo ovário."],
      ["Corpo lúteo", "Estrutura do ovário que produz progesterona após a ovulação."],
    ],
    [
      ["A fecundação geralmente ocorre:", ["no útero", "nas tubas uterinas", "no ovário", "na vagina", "no colo do útero"], 1, "Encontro dos gametas."],
      ["O hormônio cujo pico provoca a ovulação é o:", ["FSH", "LH", "testosterona", "insulina", "adrenalina"], 1, "Liberado pela hipófise."],
      ["A menstruação ocorre quando:", ["há gravidez", "a progesterona cai porque não houve fecundação", "o LH aumenta", "o estrogênio dobra", "o ovócito é fecundado"], 1, "Descamação do endométrio."],
      ["Os testes de gravidez detectam o hormônio:", ["FSH", "hCG", "insulina", "testosterona", "ocitocina"], 1, "Produzido pelo embrião."],
      ["O método que previne gravidez e ISTs ao mesmo tempo é:", ["pílula", "DIU", "camisinha", "laqueadura", "tabelinha"], 2, "Barreira."],
    ],
    [["Explique o papel da progesterona no ciclo menstrual.", "Após a ovulação, o corpo lúteo produz progesterona, que mantém o endométrio espesso e preparado para receber o embrião; se não houver fecundação, o corpo lúteo regride, a progesterona cai e o endométrio descama, causando a menstruação."]],
  ),
  aula(
    "Sistemas esquelético e muscular",
    `## Funções do esqueleto

O esqueleto humano adulto tem cerca de **206 ossos** e serve para:

- **Sustentação** do corpo.
- **Proteção** de órgãos (crânio protege o encéfalo; costelas, o coração e os pulmões).
- **Movimento** (junto com os músculos).
- **Produção de células do sangue** (na **medula óssea vermelha**).
- **Reserva de cálcio** e fósforo.

## Os ossos

- Formados por células (osteócitos), **colágeno** (flexibilidade) e **sais de cálcio** (dureza).
- São tecidos **vivos**: crescem, se renovam e se regeneram (fraturas se consolidam).
- **Vitamina D**, **cálcio** e **exercício** fortalecem os ossos.
- **Osteoporose:** perda de massa óssea, comum em idosos e mulheres após a menopausa (queda do estrogênio); ossos frágeis.

## Articulações

Pontos de encontro entre ossos:

- **Móveis:** joelho, cotovelo, ombro (com líquido sinovial e cartilagem).
- **Semimóveis:** entre as vértebras.
- **Imóveis:** entre os ossos do crânio (suturas).

**Ligamentos** unem ossos; **tendões** unem músculos aos ossos (ex.: tendão de Aquiles).

## Músculos

Há três tipos de tecido muscular:

- **Estriado esquelético:** **voluntário** (controlamos), contração rápida; movimenta o esqueleto.
- **Estriado cardíaco:** **involuntário**, forma o **coração**, contrai ritmicamente sem cansar.
- **Liso:** **involuntário**, contração lenta; nas paredes do estômago, intestino, vasos sanguíneos, útero.

## Como o músculo contrai

- As fibras musculares têm filamentos de proteínas (**actina** e **miosina**) que **deslizam** uns sobre os outros, encurtando o músculo.
- Precisa de **ATP** (energia) e **cálcio**.
- Em exercício intenso com pouco oxigênio, ocorre **fermentação lática**.

## Músculos antagonistas

Os músculos só **puxam** (contraem); para mover em direções opostas, trabalham em **pares**: **bíceps** contrai e dobra o braço, enquanto o **tríceps** relaxa; para esticar, o contrário.

## Saúde

- **Postura** correta e ergonomia previnem dores na coluna.
- Exercícios fortalecem músculos e ossos; o **sedentarismo** causa perda muscular.
- **Anabolizantes** sem orientação médica causam danos ao fígado, coração e hormônios.

## Resumindo

O esqueleto sustenta, protege, produz sangue (medula) e guarda cálcio. Tendões ligam músculo a osso; ligamentos, osso a osso. Músculo esquelético é voluntário; cardíaco e liso, involuntários. Actina e miosina deslizam com ATP. Bíceps e tríceps são antagonistas.`,
    [
      "Esqueleto: sustentação, proteção, movimento e produção de sangue.",
      "Tendões unem músculos a ossos; ligamentos unem ossos.",
      "Esquelético: voluntário; cardíaco e liso: involuntários.",
      "Bíceps e tríceps trabalham como antagonistas.",
    ],
    [
      ["Medula óssea vermelha", "Tecido dentro dos ossos que produz células do sangue."],
      ["Tendão", "Estrutura que une o músculo ao osso."],
      ["Osteoporose", "Perda de massa óssea que deixa os ossos frágeis."],
    ],
    [
      ["As células do sangue são produzidas:", ["no fígado", "na medula óssea vermelha", "no coração", "nos músculos", "nos rins"], 1, "Dentro dos ossos."],
      ["O tecido muscular que forma o coração é:", ["liso voluntário", "estriado cardíaco involuntário", "estriado esquelético voluntário", "cartilaginoso", "ósseo"], 1, "Contração rítmica."],
      ["A estrutura que liga o músculo ao osso é o:", ["ligamento", "tendão", "nervo", "cartilagem", "menisco"], 1, "Ex.: tendão de Aquiles."],
      ["Quando o bíceps contrai para dobrar o braço, o tríceps:", ["também contrai", "relaxa", "se rompe", "vira osso", "produz sangue"], 1, "Antagonistas."],
      ["A osteoporose é mais comum em mulheres após a menopausa por causa:", ["do excesso de cálcio", "da queda do estrogênio", "do aumento da testosterona", "da vitamina C", "do excesso de exercício"], 1, "Perda de massa óssea."],
    ],
    [["Explique por que os músculos do corpo trabalham em pares antagonistas.", "Porque os músculos só conseguem puxar, ao se contrair, e não empurrar; para mover uma parte do corpo em direções opostas, um músculo contrai enquanto o outro relaxa, como o bíceps e o tríceps ao dobrar e esticar o braço."]],
  ),
  aula(
    "Protozoários, algas e fungos",
    `## Reino Protista (Protoctista)

Seres **eucariontes** simples, em geral **unicelulares**, que não se encaixam em animais, plantas ou fungos.

### Protozoários

- Unicelulares, **heterótrofos**, muitas vezes aquáticos ou parasitas.
- Locomoção: **pseudópodes** (amebas), **cílios** (paramécio), **flagelos** (tripanossomo).
- **Doenças** causadas por protozoários:
  - **Doença de Chagas:** *Trypanosoma cruzi*, transmitido pelas fezes do **barbeiro** (e por alimentos contaminados, como caldo de cana e açaí mal processados).
  - **Malária:** *Plasmodium*, transmitido pela fêmea do mosquito **Anopheles** (Amazônia).
  - **Leishmaniose:** transmitida pelo mosquito-palha.
  - **Amebíase** e **giardíase:** água e alimentos contaminados (falta de saneamento).
  - **Toxoplasmose:** fezes de gato e carne malcozida; perigosa na gravidez.

### Algas

- Podem ser **unicelulares** (diatomáceas, dinoflagelados) ou **multicelulares** (algas marinhas).
- **Autótrofas** (fazem fotossíntese).
- O **fitoplâncton** produz grande parte do **oxigênio** do planeta e é a base das cadeias marinhas.
- **Maré vermelha:** proliferação de algas que liberam toxinas.
- Usadas na alimentação (sushi), cosméticos e na produção de **ágar**.

## Reino Fungi (fungos)

- **Eucariontes**, **heterótrofos** (absorvem nutrientes), com parede de **quitina**.
- Unicelulares (**leveduras**) ou multicelulares (**bolores**, **cogumelos**), formados por filamentos chamados **hifas** (o conjunto é o **micélio**).
- Reprodução por **esporos**.

### Importância

- **Decompositores:** reciclam a matéria orgânica, devolvendo nutrientes ao solo.
- **Alimentação:** cogumelos (champignon, shiitake), leveduras no **pão** e nas bebidas (fermentação).
- **Medicamentos:** a **penicilina**, primeiro antibiótico, foi descoberta por **Alexander Fleming** (1928) a partir do fungo *Penicillium*.
- **Liquens:** associação (**mutualismo**) entre fungo e alga; são **bioindicadores** de poluição do ar (não crescem em ar poluído).
- **Micorrizas:** associação de fungos com raízes, que ajuda as plantas a absorver nutrientes.

### Problemas

- **Micoses:** frieira (pé de atleta), candidíase, "pano branco".
- **Bolores** que estragam alimentos; algumas toxinas (**aflatoxinas** do amendoim mofado) são cancerígenas.
- Cogumelos **venenosos**.
- Pragas agrícolas (ferrugem do café).

## Resumindo

Protozoários causam Chagas (barbeiro), malária (Anopheles), amebíase e toxoplasmose. Algas fazem fotossíntese e o fitoplâncton produz muito oxigênio. Fungos são heterótrofos decompositores, produzem pão, penicilina e formam liquens (bioindicadores).`,
    [
      "Protozoários: Chagas (barbeiro), malária (Anopheles), amebíase.",
      "Fitoplâncton produz grande parte do oxigênio do planeta.",
      "Fungos: decompositores, leveduras do pão e penicilina.",
      "Liquens (fungo + alga) indicam a qualidade do ar.",
    ],
    [
      ["Protozoário", "Ser unicelular eucarionte heterótrofo."],
      ["Hifas", "Filamentos que formam o corpo dos fungos multicelulares."],
      ["Líquen", "Associação mutualística entre fungo e alga."],
    ],
    [
      ["A doença de Chagas é causada por um protozoário transmitido pelo:", ["Aedes aegypti", "barbeiro", "Anopheles", "caramujo", "rato"], 1, "Trypanosoma cruzi."],
      ["A malária é transmitida pela picada do mosquito:", ["Aedes", "Anopheles", "Culex apenas", "barbeiro", "mosquito-palha"], 1, "Plasmodium."],
      ["A penicilina foi descoberta a partir de:", ["uma bactéria", "um fungo", "uma alga", "um vírus", "um protozoário"], 1, "Fleming, 1928."],
      ["Os liquens são bons bioindicadores porque:", ["crescem em ar muito poluído", "não sobrevivem em ar poluído", "produzem poluição", "são parasitas", "só vivem na água"], 1, "Sensíveis à poluição."],
      ["Na natureza, os fungos são importantes principalmente como:", ["produtores", "decompositores", "predadores", "polinizadores", "consumidores terciários"], 1, "Reciclam nutrientes."],
    ],
    [["Cite duas importâncias dos fungos para o ser humano e para a natureza.", "Na natureza, os fungos são decompositores que reciclam a matéria orgânica e devolvem nutrientes ao solo; para o ser humano, são usados na produção de pão e bebidas pela fermentação e na fabricação de antibióticos como a penicilina."]],
  ),
  aula(
    "Invertebrados: das esponjas aos artrópodes",
    `## Animais sem coluna vertebral

Os **invertebrados** são a **grande maioria** das espécies animais.

## Principais grupos

### Poríferos (esponjas)

Animais mais simples, aquáticos, **fixos**, com poros por onde a água entra (filtram alimento).

### Cnidários

**Águas-vivas**, **corais**, anêmonas. Têm células urticantes (**cnidócitos**) que causam queimaduras. Os **recifes de corais** abrigam enorme biodiversidade e sofrem **branqueamento** com o aquecimento dos oceanos.

### Platelmintos (vermes achatados)

- **Tênia** (solitária): carne de porco ou boi malcozida → **teníase**; ovos da tênia do porco → **cisticercose** (pode atingir o cérebro).
- **Esquistossomo:** **esquistossomose** ("barriga d'água"), transmitida em água doce contaminada onde vivem **caramujos** hospedeiros.

### Nematelmintos (vermes cilíndricos)

- **Lombriga** (ascaridíase): ovos em água e alimentos contaminados.
- **Ancilóstomo** (amarelão): larvas penetram pela pele (andar **descalço** em solo contaminado); causa **anemia** (Jeca Tatu de Monteiro Lobato).
- **Filária** (elefantíase), transmitida por mosquito.

Prevenção das verminoses: **saneamento**, higiene, lavar alimentos, ferver água, usar **calçados**, cozinhar bem as carnes.

### Anelídeos (corpo em anéis)

**Minhoca** (aera e fertiliza o solo — importante na agricultura), **sanguessuga**.

### Moluscos (corpo mole)

**Caramujos**, **lesmas**, **polvos**, **lulas**, **mexilhões**, **ostras**. Muitos têm **concha** de calcário. O **caramujo-africano** é uma espécie invasora.

### Artrópodes (patas articuladas)

O **maior grupo** do reino animal. Têm **exoesqueleto** de **quitina** (precisam fazer **mudas** para crescer).

- **Insetos:** 3 pares de patas, corpo em cabeça, tórax e abdômen, geralmente asas e antenas. Abelhas (**polinização**), formigas, mosquitos (vetores de doenças: dengue, malária), borboletas (**metamorfose** completa: ovo → larva → pupa → adulto).
- **Aracnídeos:** 4 pares de patas, sem antenas (aranhas, escorpiões, carrapatos, ácaros).
- **Crustáceos:** maioria aquáticos (camarão, caranguejo, lagosta).
- **Miriápodes:** muitos pares de patas (centopeias, piolhos-de-cobra).

### Equinodermos

**Estrelas-do-mar** e **ouriços**, exclusivamente marinhos.

## Resumindo

Invertebrados são a maioria dos animais. Platelmintos e nematelmintos causam verminoses (prevenidas com saneamento e calçados). Artrópodes têm exoesqueleto de quitina: insetos (6 patas), aracnídeos (8 patas), crustáceos. Abelhas polinizam; mosquitos transmitem doenças.`,
    [
      "Artrópodes: maior grupo; exoesqueleto de quitina.",
      "Insetos: 6 patas; aracnídeos: 8 patas, sem antenas.",
      "Verminoses: tênia, lombriga, amarelão, esquistossomose.",
      "Prevenção: saneamento, higiene e calçados.",
    ],
    [
      ["Invertebrado", "Animal sem coluna vertebral."],
      ["Exoesqueleto", "Esqueleto externo, como o de quitina dos artrópodes."],
      ["Metamorfose", "Transformação do corpo durante o desenvolvimento, como nas borboletas."],
    ],
    [
      ["Os insetos se caracterizam por terem:", ["4 pares de patas", "3 pares de patas", "nenhuma pata", "muitos pares de patas", "tentáculos"], 1, "Seis patas."],
      ["O amarelão (ancilostomose) é evitado principalmente:", ["usando calçados", "comendo carne crua", "tomando sol", "evitando gatos", "bebendo leite"], 0, "Larvas penetram pela pele."],
      ["A esquistossomose é transmitida em:", ["água doce contaminada com caramujos hospedeiros", "picada de barbeiro", "carne de porco", "ar", "picada de aranha"], 0, "Barriga d'água."],
      ["As aranhas pertencem aos:", ["insetos", "aracnídeos", "crustáceos", "moluscos", "anelídeos"], 1, "8 patas."],
      ["A minhoca é importante na agricultura porque:", ["destrói as raízes", "aera e fertiliza o solo", "transmite doenças", "come as sementes", "polui a água"], 1, "Anelídeo."],
    ],
    [["Por que as verminoses são mais comuns em locais sem saneamento básico?", "Porque os ovos e larvas dos vermes são eliminados nas fezes e contaminam água, solo e alimentos; sem esgoto tratado, água potável e higiene, as pessoas ingerem os ovos ou têm contato com as larvas, como ao andar descalças."]],
  ),
  aula(
    "Vertebrados: peixes, anfíbios, répteis, aves e mamíferos",
    `## Cordados e vertebrados

Os **vertebrados** têm **coluna vertebral** e **crânio** que protege o encéfalo. Fazem parte do filo dos **cordados**.

## Peixes

- Vivem na água; respiram por **brânquias**; nadadeiras.
- **Cartilaginosos** (tubarões, raias) e **ósseos** (a maioria: tilápia, sardinha).
- **Ectotérmicos** ("sangue frio": temperatura varia com o ambiente).

## Anfíbios

- **Sapos, rãs, pererecas, salamandras.**
- Vida **dupla**: larvas (**girinos**) na **água**, com brânquias; adultos geralmente **terrestres**, com **pulmões** e respiração pela **pele** (que precisa ficar úmida).
- Dependem da água para a **reprodução** (ovos sem casca).
- Ectotérmicos.
- São **bioindicadores**: sua pele permeável os torna sensíveis à poluição; muitas espécies estão ameaçadas.

## Répteis

- **Cobras, lagartos, tartarugas, jacarés.**
- Pele com **escamas** e pouco permeável (evita perda de água).
- **Ovo com casca** e anexos embrionários (âmnio): **independência da água** para a reprodução — uma grande conquista do ambiente terrestre.
- Respiram por **pulmões**; ectotérmicos.

## Aves

- **Penas**, **bico** sem dentes, ossos **pneumáticos** (ocos e leves), **sacos aéreos**: adaptações ao **voo**.
- **Endotérmicas** ("sangue quente": mantêm a temperatura constante).
- Ovos com casca; muitas cuidam dos filhotes.
- Excretam **ácido úrico** (economia de água).
- Descendem de **dinossauros**.

## Mamíferos

- **Glândulas mamárias** (amamentação), **pelos**, endotérmicos, **diafragma**.
- Maioria **placentários** (filhote se desenvolve no útero ligado à placenta).
- **Marsupiais** (gambá, canguru): filhote termina o desenvolvimento numa bolsa.
- **Monotremados** (ornitorrinco, équidna): mamíferos que **botam ovos**.
- Incluem **morcegos** (únicos que voam), **baleias** e **golfinhos** (aquáticos, respiram ar por pulmões), primatas e humanos.

## Conquista do ambiente terrestre

Peixes → anfíbios (pulmões, patas, ainda dependentes da água) → répteis (ovo com casca, pele impermeável) → aves e mamíferos (endotermia).

## Resumindo

Peixes: brânquias. Anfíbios: vida dupla e pele úmida, dependem da água para reproduzir. Répteis: escamas e ovo com casca. Aves: penas, ossos pneumáticos, endotérmicas. Mamíferos: glândulas mamárias e pelos; placentários, marsupiais e monotremados.`,
    [
      "Anfíbios: girinos aquáticos, pele úmida, dependem da água.",
      "Répteis: escamas e ovo com casca (independência da água).",
      "Aves: penas, ossos pneumáticos e endotermia.",
      "Mamíferos: glândulas mamárias; ornitorrinco bota ovos.",
    ],
    [
      ["Endotérmico", "Animal que mantém a temperatura corporal constante."],
      ["Ectotérmico", "Animal cuja temperatura varia com o ambiente."],
      ["Ovo amniótico", "Ovo com casca e anexos que permitem o desenvolvimento fora da água."],
    ],
    [
      ["A aquisição do ovo com casca, que libertou a reprodução da água, ocorreu nos:", ["peixes", "anfíbios", "répteis", "mamíferos marsupiais apenas", "cnidários"], 2, "Conquista terrestre."],
      ["Os anfíbios são bons bioindicadores porque:", ["têm pele impermeável", "têm pele permeável e sensível à poluição", "vivem só no deserto", "não se reproduzem", "são endotérmicos"], 1, "Absorvem substâncias pela pele."],
      ["É uma adaptação das aves ao voo:", ["ossos maciços", "ossos pneumáticos (ocos)", "escamas", "glândulas mamárias", "brânquias"], 1, "Leveza."],
      ["O mamífero que bota ovos é o:", ["canguru", "ornitorrinco", "morcego", "golfinho", "gambá"], 1, "Monotremado."],
      ["Baleias e golfinhos respiram por meio de:", ["brânquias", "pulmões", "pele", "traqueias", "sacos aéreos"], 1, "São mamíferos."],
    ],
    [["Explique por que os répteis são considerados mais adaptados ao ambiente terrestre do que os anfíbios.", "Porque têm pele com escamas, pouco permeável, que evita a perda de água, e ovo com casca e anexos embrionários, que permite a reprodução fora da água, enquanto os anfíbios têm pele úmida e precisam da água para se reproduzir."]],
  ),
  aula(
    "Biotecnologia moderna: PCR, DNA forense e vacinas de RNA",
    `## Manipular o DNA

A **biotecnologia** usa seres vivos ou suas moléculas para produzir bens e serviços. Com o conhecimento do **DNA**, surgiram técnicas poderosas.

## PCR (reação em cadeia da polimerase)

- Técnica que **multiplica** um trecho de DNA **milhões de vezes** em poucas horas, a partir de uma amostra muito pequena.
- Usa a enzima **DNA polimerase** e ciclos de aquecimento e resfriamento.
- Aplicações: **diagnóstico** de doenças (o **RT-PCR** foi o teste padrão para **COVID-19**), investigação criminal, testes de paternidade, pesquisa.

## DNA forense e teste de paternidade

- Cada pessoa tem um **perfil genético único** (exceto gêmeos idênticos).
- Com sangue, saliva, cabelo ou pele, é possível comparar regiões do DNA.
- **Teste de paternidade:** o filho herda **metade** do DNA de cada genitor; as bandas do filho devem coincidir com as da mãe ou do suposto pai.
- **Investigação criminal:** comparar o DNA de vestígios com o de suspeitos (e inocentar condenados injustamente).
- **Eletroforese:** separa fragmentos de DNA por tamanho num gel, formando um padrão de **bandas**.

## Engenharia genética

- **DNA recombinante:** inserir um gene de um organismo em outro.
- **Insulina humana** produzida por **bactérias** transgênicas (antes vinha de porcos e bois).
- **Transgênicos** na agricultura (resistência a pragas e herbicidas) — debate sobre riscos e rotulagem (símbolo "T" no Brasil).
- **CRISPR-Cas9:** "tesoura genética" que permite **editar** genes com precisão; promessa para doenças genéticas, mas com debates **éticos** (edição de embriões).

## Vacinas e biotecnologia

- **Vacinas tradicionais:** vírus inativado ou atenuado (ex.: CoronaVac, de vírus inativado).
- **Vacinas de vetor viral:** um vírus inofensivo leva a instrução (ex.: AstraZeneca).
- **Vacinas de RNA mensageiro (mRNA):** levam às células a "receita" para produzir uma proteína do vírus (a proteína *spike*), que treina o sistema imune. **Não alteram o DNA** (o mRNA não entra no núcleo e é degradado). Foram desenvolvidas rapidamente na pandemia (Pfizer, Moderna) graças a décadas de pesquisa.

## Outras aplicações

- **Clonagem** (ovelha **Dolly**, 1996).
- **Células-tronco** e terapia gênica.
- **Testes genéticos** de ancestralidade e de risco de doenças (com debates sobre **privacidade** dos dados genéticos).

## Resumindo

PCR multiplica DNA (usado no RT-PCR da COVID). DNA forense compara perfis genéticos (paternidade e crimes). Bactérias transgênicas produzem insulina. CRISPR edita genes. Vacinas de mRNA ensinam as células a produzir uma proteína do vírus e não alteram o DNA.`,
    [
      "PCR multiplica trechos de DNA (RT-PCR da COVID-19).",
      "DNA forense: perfil genético único para paternidade e crimes.",
      "Bactérias transgênicas produzem insulina humana.",
      "Vacinas de mRNA não alteram o DNA.",
    ],
    [
      ["PCR", "Técnica que multiplica rapidamente trechos de DNA."],
      ["Eletroforese", "Técnica que separa fragmentos de DNA por tamanho num gel."],
      ["CRISPR", "Ferramenta de edição genética precisa, a \"tesoura genética\"."],
    ],
    [
      ["A técnica que multiplica trechos de DNA milhões de vezes é a:", ["clonagem", "PCR", "eletroforese", "fermentação", "transfusão"], 1, "Reação em cadeia da polimerase."],
      ["No teste de paternidade, as bandas de DNA do filho devem coincidir:", ["todas com as do pai", "metade com a mãe e metade com o pai", "todas com a mãe", "com as de qualquer pessoa", "com as dos avós apenas"], 1, "Metade de cada genitor."],
      ["A insulina humana para diabéticos é hoje produzida por:", ["porcos", "bactérias geneticamente modificadas", "plantas comuns", "fungos venenosos", "síntese do petróleo"], 1, "DNA recombinante."],
      ["Sobre as vacinas de RNA mensageiro, é correto afirmar que:", ["alteram o DNA da pessoa", "levam a instrução para produzir uma proteína do vírus e não alteram o DNA", "contêm o vírus vivo", "são antibióticos", "causam a doença"], 1, "mRNA é degradado."],
      ["A ovelha Dolly, de 1996, foi o primeiro mamífero:", ["transgênico", "clonado a partir de uma célula adulta", "vacinado com mRNA", "editado por CRISPR", "nascido por PCR"], 1, "Clonagem."],
    ],
    [["Explique como funciona uma vacina de RNA mensageiro e por que ela não altera o DNA.", "Ela leva às células uma molécula de mRNA com a receita de uma proteína do vírus; as células produzem essa proteína, e o sistema imune aprende a reconhecê-la. O mRNA não entra no núcleo, onde está o DNA, e é degradado depois de pouco tempo."]],
  ),
  aula(
    "Biomas do mundo",
    `## O que define um bioma

**Bioma** é um conjunto de ecossistemas com **clima**, **vegetação** e **fauna** semelhantes, em grande extensão. O **clima** (temperatura e chuva) é o principal fator, e por isso os biomas se distribuem conforme a **latitude** e a **altitude**.

## Principais biomas terrestres

### Tundra

- Regiões **polares** do Hemisfério Norte (Canadá, Sibéria, Groenlândia).
- Muito **frio**, solo congelado (**permafrost**), verão curto.
- Vegetação rasteira: **musgos** e **liquens**.
- Fauna: renas, ursos-polares, raposas-do-ártico.
- O degelo do permafrost libera **metano** (aquecimento global).

### Taiga (floresta boreal)

- Norte da América, Europa e Ásia.
- Inverno longo e frio.
- **Coníferas** (pinheiros) com folhas em forma de **agulha** (perdem menos água e a neve escorrega).
- Fonte de madeira e celulose.

### Floresta temperada

- Europa, leste dos EUA, China.
- Quatro estações bem definidas; árvores **decíduas** (perdem as folhas no outono).
- Muito devastada pela ocupação humana.

### Florestas tropicais

- Perto do **Equador** (Amazônia, Congo, Indonésia).
- Quente e muito chuvosa; a **maior biodiversidade** do planeta.
- Floresta estratificada (vários andares); solo pobre.

### Savanas

- África (Serengeti), Cerrado brasileiro, Austrália.
- Estação seca e chuvosa; gramíneas com árvores esparsas.
- Grandes herbívoros (zebras, gnus) e predadores (leões).

### Pradarias (campos)

- Interior dos EUA, Pampas argentinos e gaúchos.
- Gramíneas; muito usadas para **agricultura e pecuária** (solos férteis).

### Desertos

- Pouquíssima chuva (menos de 250 mm/ano); grande **amplitude térmica** (dias quentes, noites frias).
- Quentes (Saara, Atacama) ou frios (Gobi).
- Plantas xerófitas (cactos), animais com hábitos noturnos.

## Biomas aquáticos

- **Marinhos** (oceanos, recifes de corais, zonas costeiras) e de **água doce** (rios, lagos, áreas alagadas).

## Ameaças

Desmatamento, expansão agrícola, mudanças climáticas, desertificação, poluição e caça.

## Resumindo

Biomas dependem do clima (latitude e altitude). Tundra: frio, musgos e permafrost. Taiga: coníferas. Temperada: árvores decíduas. Tropical: maior biodiversidade. Savana: estações seca e chuvosa. Deserto: pouca chuva e grande amplitude térmica.`,
    [
      "Biomas dependem do clima: latitude e altitude.",
      "Tundra: permafrost, musgos e liquens.",
      "Taiga: coníferas com folhas em agulha.",
      "Florestas tropicais têm a maior biodiversidade.",
    ],
    [
      ["Bioma", "Conjunto de ecossistemas com clima, vegetação e fauna semelhantes."],
      ["Permafrost", "Solo permanentemente congelado da tundra."],
      ["Árvores decíduas", "Árvores que perdem as folhas numa estação do ano."],
    ],
    [
      ["O bioma com solo permanentemente congelado e vegetação de musgos e liquens é a:", ["taiga", "tundra", "savana", "pradaria", "floresta temperada"], 1, "Permafrost."],
      ["A taiga é dominada por:", ["cactos", "coníferas (pinheiros)", "gramíneas", "palmeiras", "mangues"], 1, "Floresta boreal."],
      ["O bioma com maior biodiversidade do planeta é a:", ["tundra", "floresta tropical", "taiga", "deserto", "pradaria"], 1, "Amazônia, Congo."],
      ["Uma característica dos desertos é:", ["chuvas abundantes", "grande amplitude térmica entre dia e noite", "florestas densas", "solo congelado", "temperatura constante"], 1, "Ar seco."],
      ["O Cerrado brasileiro é um tipo de:", ["tundra", "savana", "taiga", "floresta temperada", "deserto frio"], 1, "Estações seca e chuvosa."],
    ],
    [["Explique por que a distribuição dos biomas na Terra está relacionada à latitude.", "Porque a latitude influencia a quantidade de energia solar e o clima: perto do Equador há calor e muita chuva (florestas tropicais), em latitudes médias há estações definidas (florestas temperadas) e perto dos polos o frio é intenso (taiga e tundra)."]],
  ),
  aula(
    "Drogas e seus efeitos no sistema nervoso",
    `## O que são drogas psicoativas

São substâncias que **alteram o funcionamento do sistema nervoso**, modificando humor, percepção, comportamento e consciência. Podem ser **lícitas** (álcool, tabaco, medicamentos) ou **ilícitas**.

## Como agem

Atuam nas **sinapses**, interferindo nos **neurotransmissores** (como **dopamina**, **serotonina**, noradrenalina). Muitas aumentam a **dopamina** no circuito de **recompensa** do cérebro, produzindo prazer — o que favorece a **dependência**.

## Classificação

### Depressoras (diminuem a atividade do sistema nervoso)

- **Álcool:** a droga mais consumida; reduz reflexos, coordenação e julgamento (acidentes de trânsito, violência); causa **cirrose** hepática, dependência e danos ao cérebro. Na gravidez, causa a **síndrome alcoólica fetal**.
- **Calmantes** e ansiolíticos (benzodiazepínicos), **opioides** (morfina, heroína) — risco de parada respiratória por overdose.
- **Inalantes/solventes** (cola, "lança-perfume").

### Estimulantes (aumentam a atividade)

- **Nicotina** (tabaco): muito viciante; o cigarro causa **câncer** (pulmão, boca, garganta), enfisema, doenças cardíacas. **Cigarros eletrônicos (vapes)** também têm nicotina e são proibidos para venda no Brasil.
- **Cafeína:** estimulante leve.
- **Cocaína** e **crack:** euforia intensa e curta, alto poder de dependência, risco de infarto e AVC.
- **Anfetaminas** ("rebites", usados por alguns motoristas para não dormir).

### Perturbadoras (alucinógenas)

- **Maconha** (THC): altera percepção, memória e atenção; prejudica a memória e o aprendizado em **adolescentes**; pode desencadear psicoses em pessoas predispostas. Seu **canabidiol (CBD)** tem uso medicinal regulamentado em alguns casos.
- **LSD**, cogumelos alucinógenos, **ecstasy** (também estimulante).

## Tolerância, dependência e abstinência

- **Tolerância:** é preciso doses cada vez **maiores** para obter o mesmo efeito.
- **Dependência:** física e/ou psicológica; necessidade compulsiva de usar.
- **Síndrome de abstinência:** sintomas desagradáveis quando a pessoa para.

## Adolescência e risco

O cérebro continua em desenvolvimento até cerca dos **25 anos** (especialmente o córtex pré-frontal, ligado ao controle dos impulsos). Por isso o uso na adolescência é mais **danoso** e aumenta o risco de dependência.

## Saúde pública

- O uso de drogas é tratado também como questão de **saúde pública**: tratamento nos **CAPS AD** (álcool e drogas), redução de danos, prevenção nas escolas.
- Leis: proibição de venda de álcool e cigarro para **menores de 18 anos**; **Lei Seca**; restrição à propaganda de cigarro.

## Resumindo

Drogas psicoativas agem nos neurotransmissores (muitas aumentam a dopamina). Depressoras (álcool, opioides), estimulantes (nicotina, cocaína) e perturbadoras (maconha, LSD). Tolerância, dependência e abstinência. O cérebro adolescente é mais vulnerável.`,
    [
      "Drogas agem nas sinapses e nos neurotransmissores (dopamina).",
      "Depressoras: álcool, opioides; estimulantes: nicotina, cocaína.",
      "Perturbadoras: maconha, LSD.",
      "Tolerância exige doses maiores; cérebro adolescente é vulnerável.",
    ],
    [
      ["Droga psicoativa", "Substância que altera o funcionamento do sistema nervoso."],
      ["Tolerância", "Necessidade de doses cada vez maiores para obter o mesmo efeito."],
      ["Síndrome de abstinência", "Sintomas que surgem quando o dependente para de usar a droga."],
    ],
    [
      ["O álcool é classificado como droga:", ["estimulante", "depressora do sistema nervoso", "perturbadora", "sem efeito no cérebro", "vitamina"], 1, "Reduz reflexos."],
      ["A nicotina do cigarro é:", ["depressora", "estimulante e muito viciante", "alucinógena", "inofensiva", "um calmante"], 1, "Causa dependência."],
      ["A tolerância a uma droga significa que:", ["a pessoa fica imune", "são necessárias doses maiores para o mesmo efeito", "a droga deixa de existir", "o efeito aumenta sozinho", "a pessoa não sente nada"], 1, "Adaptação do organismo."],
      ["O uso de drogas é mais danoso na adolescência porque:", ["o corpo é mais forte", "o cérebro ainda está em desenvolvimento", "os jovens não têm neurônios", "a droga é mais fraca", "não há efeitos"], 1, "Córtex pré-frontal."],
      ["Muitas drogas causam dependência porque aumentam a liberação de:", ["insulina", "dopamina no circuito de recompensa", "hemoglobina", "adrenalina apenas no coração", "glicose"], 1, "Sensação de prazer."],
    ],
    [["Explique por que muitas drogas causam dependência.", "Porque aumentam a liberação de dopamina no circuito de recompensa do cérebro, gerando prazer intenso; com o uso repetido, o cérebro se adapta (tolerância) e a pessoa passa a precisar da droga, sentindo abstinência quando para."]],
  ),
  aula(
    "Órgãos dos sentidos",
    `## Como percebemos o mundo

Os **órgãos dos sentidos** têm **receptores** que captam estímulos (luz, som, substâncias químicas, pressão, temperatura) e os transformam em **impulsos nervosos**, interpretados pelo **cérebro**.

## Visão (olhos)

- A luz entra pela **córnea** e **pupila**, é focada pelo **cristalino** e forma a imagem na **retina**.
- Na retina: **cones** (cores e detalhes, com luz forte) e **bastonetes** (visão em pouca luz, preto e branco).
- O **nervo óptico** leva a informação ao cérebro.
- **Daltonismo:** falha em tipos de cones (herança ligada ao X).

## Audição e equilíbrio (orelhas)

- **Orelha externa:** pavilhão e canal auditivo captam o som.
- **Orelha média:** **tímpano** vibra e os **ossículos** (martelo, bigorna e estribo) amplificam a vibração.
- **Orelha interna:** a **cóclea** transforma vibrações em impulsos nervosos.
- Os **canais semicirculares** (orelha interna) controlam o **equilíbrio** (por isso a labirintite causa tontura).
- **Perda auditiva:** sons acima de **85 dB** por muito tempo (fones altos, shows) danificam as células da cóclea de forma **permanente**.

## Olfato (nariz)

- Receptores na **mucosa olfativa** detectam moléculas no ar.
- O olfato está ligado à **memória** e às **emoções** (um cheiro traz lembranças).
- Junto com o paladar, forma o **sabor** (por isso a comida parece sem gosto quando estamos gripados).
- A **perda de olfato** foi um sintoma marcante da COVID-19.

## Paladar (língua)

- **Papilas gustativas** com receptores para cinco gostos básicos: **doce, salgado, azedo, amargo** e **umami** (gosto de alimentos como carne, queijo e tomate maduro, ligado ao glutamato).
- O "mapa da língua" com áreas para cada gosto é um **mito**: todas as regiões percebem todos os gostos.
- O gosto **amargo** pode alertar para substâncias tóxicas.

## Tato (pele)

- Receptores para **pressão**, **toque**, **dor**, **calor** e **frio**.
- Mais sensíveis nas **pontas dos dedos**, lábios e língua.
- A **dor** é um sinal de proteção.
- A escrita **braille** usa o tato para a leitura de pessoas cegas.

## Saúde dos sentidos

Exames de vista e audição, óculos e protetores auriculares, evitar fones muito altos, não usar objetos no ouvido, proteger os olhos do sol.

## Resumindo

Os sentidos captam estímulos e o cérebro os interpreta. Retina tem cones (cores) e bastonetes (pouca luz). Cóclea transforma som em impulso; canais semicirculares controlam o equilíbrio. Olfato e paladar formam o sabor. São cinco gostos básicos, incluindo o umami.`,
    [
      "Retina: cones (cores) e bastonetes (pouca luz).",
      "Cóclea: audição; canais semicirculares: equilíbrio.",
      "Olfato + paladar = sabor; ligado à memória.",
      "Gostos básicos: doce, salgado, azedo, amargo e umami.",
    ],
    [
      ["Receptor sensorial", "Estrutura que capta um estímulo e o transforma em impulso nervoso."],
      ["Cóclea", "Estrutura da orelha interna que transforma vibrações em impulsos nervosos."],
      ["Umami", "Gosto básico associado ao glutamato, presente em carnes e queijos."],
    ],
    [
      ["As células da retina responsáveis pela visão em cores são os:", ["bastonetes", "cones", "ossículos", "tímpanos", "neurônios motores"], 1, "Luz forte e detalhes."],
      ["O equilíbrio do corpo é controlado:", ["pelo tímpano", "pelos canais semicirculares da orelha interna", "pela retina", "pela língua", "pela mucosa olfativa"], 1, "Labirinto."],
      ["Quando estamos gripados, a comida parece sem gosto porque:", ["a língua perde papilas", "o olfato fica prejudicado, e ele forma o sabor junto com o paladar", "o estômago para", "os dentes doem", "a saliva some"], 1, "Olfato + paladar."],
      ["Sons muito altos por longos períodos podem causar:", ["melhora da audição", "perda auditiva permanente", "visão dupla", "aumento do olfato", "nenhum efeito"], 1, "Dano à cóclea."],
      ["O \"mapa da língua\" com regiões para cada gosto é:", ["comprovado cientificamente", "um mito: todas as regiões percebem todos os gostos", "válido só para o doce", "a base do umami", "usado na medicina"], 1, "Mito antigo."],
    ],
    [["Explique como ouvimos um som, desde a orelha externa até o cérebro.", "O som é captado pela orelha externa e faz o tímpano vibrar; os ossículos da orelha média amplificam a vibração e a transmitem à cóclea, na orelha interna, que a transforma em impulsos nervosos levados ao cérebro pelo nervo auditivo."]],
  ),
];
