import { aula } from "./build";

/** Biologia, lote 2: doenças, ecologia, biotecnologia, saúde e ambiente. */
export const BIOLOGIA_2 = [
  aula(
    "Arboviroses: dengue, zika e chikungunya",
    `## Doenças transmitidas por mosquitos

**Arboviroses** são doenças causadas por vírus transmitidos por artrópodes, como mosquitos. No Brasil, as principais são **dengue**, **zika**, **chikungunya** e **febre amarela**.

## O vetor: Aedes aegypti

O mosquito ***Aedes aegypti*** transmite dengue, zika e chikungunya. A **fêmea** pica para obter sangue, necessário para os ovos. Ela coloca os ovos em **água parada e limpa**: pneus, vasos de planta, garrafas, caixas-d'água destampadas.

Os ovos resistem mais de um ano no seco e eclodem quando chove. Por isso os surtos aumentam no **verão chuvoso**.

## Sintomas e cuidados

- **Dengue:** febre alta, dores no corpo e atrás dos olhos, manchas. A forma grave pode causar sangramentos. Não se deve tomar remédios com ácido acetilsalicílico (AAS), que aumentam o risco de hemorragia.
- **Zika:** geralmente leve, mas na gestação pode causar **microcefalia** no bebê.
- **Chikungunya:** dores fortes nas articulações que podem durar meses.

## Prevenção

O mais eficaz é **eliminar os criadouros**: virar garrafas, tampar caixas-d'água, colocar areia nos pratos de plantas, limpar calhas. Também ajudam telas, repelentes e, para a dengue, vacinas.

Combater o mosquito é uma ação **coletiva**: um quintal com água parada afeta toda a vizinhança.

## Febre amarela

Também é viral. Tem ciclo silvestre (macacos e mosquitos *Haemagogus*) e urbano (*Aedes*). Existe **vacina** eficaz. Macacos não transmitem a doença: eles são vítimas e servem de alerta.

## Resumindo

Aedes aegypti transmite dengue, zika e chikungunya; a fêmea põe ovos em água parada. Eliminar criadouros é a principal prevenção.`,
    [
      "Dengue, zika e chikungunya são transmitidas pelo Aedes aegypti.",
      "A fêmea põe ovos em água parada; os ovos resistem meses no seco.",
      "Zika na gestação pode causar microcefalia.",
      "A principal prevenção é eliminar os criadouros, uma ação coletiva.",
    ],
    [
      ["Arbovirose", "Doença causada por vírus transmitido por artrópodes, como mosquitos."],
      ["Vetor", "Ser vivo que transmite o agente de uma doença."],
      ["Criadouro", "Lugar com água parada onde o mosquito se reproduz."],
    ],
    [
      ["O agente causador da dengue é:", ["uma bactéria", "um vírus", "um protozoário", "um verme", "um fungo"], 1, "A dengue é uma arbovirose: causada por vírus."],
      ["A medida mais eficaz contra a dengue é:", ["tomar antibiótico", "eliminar água parada", "evitar contato com doentes", "usar máscara", "ferver a água de beber"], 1, "Sem criadouros, o mosquito não se reproduz."],
      ["A infecção por zika na gravidez está associada a:", ["diabetes no bebê", "microcefalia", "anemia falciforme", "daltonismo", "albinismo"], 1, "O vírus zika pode afetar o desenvolvimento do cérebro do feto."],
      ["Quem pica e transmite a dengue é:", ["o macho do Aedes", "a fêmea do Aedes", "a larva", "o barbeiro", "o caramujo"], 1, "Só a fêmea pica, porque precisa de sangue para os ovos."],
      ["Em casos de suspeita de dengue, deve-se evitar remédios com AAS porque:", ["causam febre", "aumentam o risco de sangramento", "matam o vírus rápido demais", "provocam microcefalia", "são proibidos"], 1, "O AAS dificulta a coagulação."],
    ],
    [["Por que o combate ao Aedes aegypti é uma ação coletiva?", "Porque o mosquito voa entre as casas; se um vizinho deixa água parada, os mosquitos se reproduzem ali e picam toda a vizinhança, então todos precisam eliminar os criadouros."]],
  ),
  aula(
    "Doenças parasitárias: Chagas, malária e verminoses",
    `## Doenças ligadas à pobreza

Muitas doenças parasitárias estão ligadas à **falta de saneamento básico** e a moradias precárias. São chamadas de **doenças negligenciadas**.

## Protozooses

- **Doença de Chagas:** causada pelo protozoário *Trypanosoma cruzi*, transmitido pelo **barbeiro**, inseto que vive em frestas de casas de pau a pique. O barbeiro defeca ao picar e o parasita entra pela ferida. Também pode ser transmitida pela ingestão de alimentos contaminados, como **caldo de cana e açaí** mal processados. Afeta o **coração**.
- **Malária:** causada pelo *Plasmodium*, transmitido pela fêmea do mosquito ***Anopheles***. Comum na **Amazônia**. Causa febres em ciclos.
- **Leishmaniose:** transmitida pelo mosquito-palha.

## Verminoses

- **Esquistossomose ("barriga-d'água"):** o *Schistosoma* passa pelo **caramujo** e as larvas penetram na pele de quem entra em água contaminada por esgoto.
- **Ascaridíase (lombriga):** ovos ingeridos em alimentos e água contaminados.
- **Teníase e cisticercose:** a teníase vem de carne de porco ou boi mal cozida com larvas; a cisticercose vem de ingerir **ovos** da tênia, e as larvas podem ir ao cérebro.
- **Ancilostomose ("amarelão"):** larvas entram pela pele dos pés descalços; causa anemia.

## Prevenção

- **Saneamento básico:** esgoto tratado e água potável.
- Lavar mãos e alimentos; cozinhar bem as carnes.
- Usar calçados.
- Melhorar moradias (contra o barbeiro).
- Telas e repelentes (contra mosquitos).

## Resumindo

Chagas (barbeiro), malária (Anopheles), esquistossomose (caramujo), ascaridíase e teníase (alimentos), amarelão (pés descalços). Saneamento é a principal arma.`,
    [
      "Chagas: Trypanosoma, transmitido pelo barbeiro ou por alimentos contaminados.",
      "Malária: Plasmodium, transmitido pelo mosquito Anopheles, comum na Amazônia.",
      "Esquistossomose: larvas do caramujo penetram na pele em água com esgoto.",
      "Saneamento básico previne a maioria das verminoses.",
    ],
    [
      ["Protozoário", "Ser unicelular eucarionte; alguns causam doenças, como Chagas e malária."],
      ["Hospedeiro intermediário", "Ser onde o parasita passa parte da vida, como o caramujo na esquistossomose."],
      ["Saneamento básico", "Água tratada, coleta e tratamento de esgoto e de lixo."],
    ],
    [
      ["O transmissor da doença de Chagas é:", ["o mosquito Aedes", "o barbeiro", "o caramujo", "o rato", "o mosquito Anopheles"], 1, "O barbeiro transmite o Trypanosoma cruzi."],
      ["A esquistossomose é adquirida principalmente:", ["comendo carne crua", "entrando em água contaminada por esgoto onde há caramujos", "pela picada do barbeiro", "pelo ar", "por transfusão de sangue apenas"], 1, "As larvas saem do caramujo e penetram na pele."],
      ["A malária é causada por:", ["vírus", "bactéria", "protozoário Plasmodium", "verme", "fungo"], 2, "O Plasmodium é um protozoário."],
      ["Andar descalço em solo contaminado pode causar:", ["teníase", "amarelão (ancilostomose)", "malária", "dengue", "Chagas"], 1, "As larvas do ancilóstomo penetram pela pele dos pés."],
      ["A medida que mais previne verminoses é:", ["vacina contra vermes", "saneamento básico", "uso de antibióticos", "ar-condicionado", "comer menos"], 1, "Sem esgoto contaminando água e solo, o ciclo dos vermes é interrompido."],
    ],
    [["Por que o saneamento básico é a principal forma de combater as verminoses?", "Porque muitos vermes têm ovos e larvas que se espalham pelo esgoto, contaminando água, solo e alimentos; tratando o esgoto e a água, interrompe-se o ciclo de transmissão."]],
  ),
  aula(
    "Relações ecológicas entre os seres vivos",
    `## Ninguém vive sozinho

Os seres vivos interagem o tempo todo. Essas interações são as **relações ecológicas**. Podem ser **harmônicas** (ninguém é prejudicado) ou **desarmônicas** (pelo menos um é prejudicado), e **intraespecíficas** (mesma espécie) ou **interespecíficas** (espécies diferentes).

## Harmônicas

- **Mutualismo:** as duas espécies ganham e dependem uma da outra. Ex.: **líquens** (fungo + alga) e bactérias que vivem no intestino de cupins para digerir madeira.
- **Protocooperação:** as duas ganham, mas podem viver separadas. Ex.: pássaro-palito e crocodilo; anu e gado.
- **Comensalismo:** uma ganha e a outra não é afetada. Ex.: rêmora e tubarão (aproveita restos de comida).
- **Inquilinismo:** uma usa a outra como abrigo sem prejudicá-la. Ex.: **orquídeas e bromélias** sobre árvores (epifitismo).
- **Sociedade e colônia:** organização da mesma espécie, como abelhas e formigas (sociedade) e corais (colônia).

## Desarmônicas

- **Predação:** um animal mata e come outro (onça e capivara).
- **Parasitismo:** o parasita vive à custa do hospedeiro, geralmente sem matá-lo logo (carrapato, lombriga, erva-de-passarinho).
- **Competição:** disputa por recursos (alimento, espaço, luz), entre espécies ou dentro da mesma.
- **Amensalismo (antibiose):** uma espécie libera substâncias que prejudicam outra. Ex.: o fungo *Penicillium* e as bactérias, origem da penicilina; a maré vermelha.

## Espécies invasoras

Quando uma espécie é levada a outro ambiente sem seus predadores naturais, pode se multiplicar demais e competir com as nativas. Ex.: o **javali** e o **caramujo-africano** no Brasil.

## Resumindo

Harmônicas: mutualismo, protocooperação, comensalismo, inquilinismo. Desarmônicas: predação, parasitismo, competição, amensalismo.`,
    [
      "Mutualismo: as duas espécies ganham e dependem uma da outra (líquens).",
      "Comensalismo: uma ganha e a outra não é afetada.",
      "Parasitismo: o parasita vive à custa do hospedeiro.",
      "Espécies invasoras sem predadores competem com as nativas.",
    ],
    [
      ["Mutualismo", "Relação obrigatória em que as duas espécies se beneficiam."],
      ["Epifitismo", "Planta que vive sobre outra, sem parasitá-la, como bromélias."],
      ["Espécie invasora", "Espécie levada a outro ambiente que se espalha e prejudica as nativas."],
    ],
    [
      ["Os líquens, associação de fungo e alga em que ambos dependem um do outro, são exemplo de:", ["parasitismo", "mutualismo", "predação", "competição", "amensalismo"], 1, "Os dois se beneficiam e dependem da relação."],
      ["Bromélias crescendo sobre galhos de árvores, sem prejudicá-las, são exemplo de:", ["parasitismo", "predação", "inquilinismo (epifitismo)", "competição", "mutualismo"], 2, "Usam a árvore só como apoio."],
      ["O carrapato no cachorro é um caso de:", ["mutualismo", "comensalismo", "parasitismo", "protocooperação", "sociedade"], 2, "O carrapato se alimenta do sangue do cão, prejudicando-o."],
      ["O fungo Penicillium inibindo bactérias ao seu redor é exemplo de:", ["amensalismo", "mutualismo", "comensalismo", "sociedade", "predação"], 0, "Ele libera substâncias que prejudicam as bactérias."],
      ["Por que espécies invasoras costumam se espalhar rápido?", ["porque são sempre maiores", "porque não têm predadores naturais no novo ambiente", "porque fazem fotossíntese", "porque vivem pouco", "porque não se reproduzem"], 1, "Sem controle natural, a população cresce e compete com as nativas."],
    ],
    [["Explique a diferença entre mutualismo e protocooperação.", "Nos dois casos as duas espécies se beneficiam; no mutualismo elas dependem uma da outra e não vivem bem separadas, enquanto na protocooperação podem viver de forma independente."]],
  ),
  aula(
    "Ciclos do carbono e do nitrogênio",
    `## A matéria circula

Na natureza, os elementos químicos passam pelos seres vivos e pelo ambiente em **ciclos biogeoquímicos**. Dois dos mais cobrados são o do carbono e o do nitrogênio.

## Ciclo do carbono

- A **fotossíntese** retira CO₂ do ar e transforma em matéria orgânica.
- A **respiração** dos seres vivos e a **decomposição** devolvem CO₂ ao ar.
- A **queima de combustíveis fósseis** (petróleo, carvão, gás) e as **queimadas** liberam carbono que estava guardado há milhões de anos, **aumentando o CO₂** na atmosfera.
- Os **oceanos** absorvem parte do CO₂, o que os torna mais ácidos.

Mais CO₂ intensifica o **efeito estufa** e o **aquecimento global**. Por isso, preservar florestas e usar energias renováveis ajuda o clima.

## Ciclo do nitrogênio

O nitrogênio é essencial para proteínas e DNA. O ar tem 78% de N₂, mas plantas e animais **não conseguem usar** o N₂ diretamente.

1. **Fixação:** bactérias (algumas vivendo nas raízes de **leguminosas**, como feijão e soja) transformam N₂ em amônia.
2. **Nitrificação:** bactérias transformam amônia em **nitritos** e depois **nitratos**, absorvidos pelas plantas.
3. Os animais obtêm nitrogênio comendo plantas.
4. **Decomposição** devolve amônia ao solo.
5. **Desnitrificação:** bactérias devolvem N₂ ao ar.

## Aplicações

- **Rotação de culturas** e **adubação verde** com leguminosas enriquecem o solo com nitrogênio, reduzindo adubos químicos.
- Excesso de fertilizantes escorre para rios e causa **eutrofização**.

## Resumindo

Carbono: fotossíntese retira, respiração, decomposição e queima devolvem; combustíveis fósseis aumentam o CO₂. Nitrogênio: bactérias fixam o N₂ do ar; leguminosas enriquecem o solo.`,
    [
      "Fotossíntese retira CO₂; respiração, decomposição e queima devolvem.",
      "Queimar combustíveis fósseis libera carbono guardado e intensifica o efeito estufa.",
      "Plantas não usam N₂ do ar: bactérias fixadoras o transformam.",
      "Leguminosas e rotação de culturas enriquecem o solo com nitrogênio.",
    ],
    [
      ["Ciclo biogeoquímico", "Circulação de um elemento entre os seres vivos e o ambiente."],
      ["Fixação do nitrogênio", "Transformação do N₂ do ar em compostos que as plantas usam, feita por bactérias."],
      ["Leguminosas", "Plantas como feijão e soja, cujas raízes abrigam bactérias fixadoras de nitrogênio."],
    ],
    [
      ["O processo que retira CO₂ da atmosfera é:", ["respiração", "decomposição", "fotossíntese", "combustão", "fermentação"], 2, "Na fotossíntese, o CO₂ vira matéria orgânica."],
      ["A queima de combustíveis fósseis contribui para:", ["diminuir o CO₂", "aumentar o efeito estufa", "fixar nitrogênio", "reduzir a temperatura", "aumentar o ozônio"], 1, "Libera CO₂ que estava guardado há milhões de anos."],
      ["Plantar feijão ou soja ajuda a enriquecer o solo com:", ["fósforo", "potássio", "nitrogênio", "carbono", "ferro"], 2, "Suas raízes abrigam bactérias fixadoras de nitrogênio."],
      ["A forma de nitrogênio absorvida pelas plantas é principalmente:", ["N₂ do ar", "nitrato", "gás carbônico", "oxigênio", "metano"], 1, "Os nitratos são produzidos na nitrificação."],
      ["Os seres que devolvem o N₂ ao ar são:", ["plantas", "animais", "bactérias desnitrificantes", "fungos de chapéu", "algas apenas"], 2, "A desnitrificação é feita por bactérias."],
    ],
    [["Explique por que a rotação de culturas com leguminosas pode reduzir o uso de adubos químicos.", "Porque as leguminosas abrigam nas raízes bactérias que fixam o nitrogênio do ar, deixando o solo mais rico em nitrogênio para a próxima plantação, o que reduz a necessidade de fertilizantes."]],
  ),
  aula(
    "Poluição das águas e eutrofização",
    `## Rios que perdem a vida

Quando esgoto doméstico ou fertilizantes chegam em grande quantidade a rios e lagos, pode ocorrer a **eutrofização**, um dos temas ambientais mais cobrados no ENEM.

## Como acontece

1. **Excesso de nutrientes** (fósforo e nitrogênio, vindos de esgoto e adubos) chega à água.
2. As **algas** se multiplicam muito (floração), deixando a água verde.
3. As algas na superfície **bloqueiam a luz**; as de baixo morrem.
4. **Bactérias aeróbicas decompõem** a enorme quantidade de matéria orgânica e **consomem o oxigênio** da água.
5. Sem oxigênio, **peixes morrem**.
6. Bactérias **anaeróbicas** passam a agir, produzindo gases de mau cheiro (como gás sulfídrico).

## DBO

A **demanda bioquímica de oxigênio (DBO)** mede quanto oxigênio as bactérias precisam para decompor a matéria orgânica. **DBO alta = água muito poluída** por matéria orgânica.

## Outros poluentes

- **Metais pesados** (mercúrio do garimpo, chumbo): acumulam-se nos seres vivos e aumentam ao longo da cadeia alimentar (**bioacumulação** ou **magnificação trófica**). Quem está no topo, como o ser humano, recebe mais.
- **Plásticos e microplásticos:** chegam aos oceanos e à comida.
- **Derramamento de petróleo:** forma uma película que impede trocas de gases e cobre animais.

## Soluções

- **Tratamento de esgoto** antes de lançar nos rios.
- Uso racional de fertilizantes.
- Preservar a **mata ciliar**, que filtra o que escorre para os rios.

## Resumindo

Eutrofização: excesso de nutrientes → algas → decomposição consome oxigênio → morte de peixes. DBO alta indica poluição orgânica. Metais pesados se acumulam ao longo da cadeia.`,
    [
      "Eutrofização começa com excesso de nutrientes (esgoto e adubos).",
      "A decomposição das algas por bactérias consome o oxigênio da água.",
      "DBO alta indica muita matéria orgânica (água poluída).",
      "Metais pesados se acumulam e aumentam ao longo da cadeia alimentar.",
    ],
    [
      ["Eutrofização", "Excesso de nutrientes na água que leva à proliferação de algas e à falta de oxigênio."],
      ["DBO", "Demanda bioquímica de oxigênio: quanto O₂ é gasto para decompor a matéria orgânica."],
      ["Bioacumulação", "Acúmulo de substâncias tóxicas nos seres vivos, maior no topo da cadeia."],
    ],
    [
      ["A principal causa da morte de peixes na eutrofização é:", ["excesso de luz", "falta de oxigênio na água", "excesso de oxigênio", "temperatura baixa", "falta de algas"], 1, "A decomposição consome o oxigênio dissolvido."],
      ["Os nutrientes que iniciam a eutrofização são principalmente:", ["ferro e cálcio", "fósforo e nitrogênio", "sódio e cloro", "ouro e prata", "carbono e oxigênio"], 1, "Vêm de esgoto e fertilizantes."],
      ["Uma água com DBO muito alta indica:", ["água pura", "muita matéria orgânica, poluição", "excesso de peixes", "água salgada", "ausência de bactérias"], 1, "As bactérias precisam de muito oxigênio para decompor a matéria orgânica."],
      ["O mercúrio do garimpo é mais concentrado em:", ["algas", "peixes pequenos", "peixes grandes predadores e quem os come", "na água apenas", "no fundo do rio apenas"], 2, "Por bioacumulação, aumenta ao subir na cadeia alimentar."],
      ["Uma medida eficaz contra a eutrofização é:", ["jogar mais adubo", "tratar o esgoto antes de lançá-lo nos rios", "retirar a mata ciliar", "aumentar a pesca", "colocar sal nos rios"], 1, "Sem esgoto bruto, menos nutrientes chegam à água."],
    ],
    [["Descreva em ordem as etapas da eutrofização.", "Excesso de nutrientes chega à água, as algas se multiplicam, bloqueiam a luz e morrem, bactérias aeróbicas decompõem essa matéria orgânica consumindo o oxigênio, e sem oxigênio os peixes morrem."]],
  ),
  aula(
    "Biotecnologia: transgênicos, clonagem e células-tronco",
    `## Tecnologia com seres vivos

**Biotecnologia** é o uso de seres vivos ou de suas moléculas para produzir algo útil. Pão, iogurte e vinho são biotecnologia antiga; hoje há técnicas de **engenharia genética**.

## DNA recombinante e transgênicos

Um gene de uma espécie é colocado em outra. O organismo resultante é **transgênico** (OGM).

- **Insulina humana** produzida por bactérias com o gene humano: tratamento do diabetes.
- **Soja e milho transgênicos** resistentes a pragas ou herbicidas.

Debates: possível impacto ambiental (cruzamento com espécies nativas, resistência de pragas), concentração do mercado de sementes, rotulagem para o consumidor e segurança alimentar.

## Clonagem

Clones são indivíduos geneticamente **idênticos**. A ovelha **Dolly** (1996) foi clonada a partir do núcleo de uma célula adulta colocado num óvulo sem núcleo. Gêmeos idênticos são clones naturais. Mudas de plantas feitas por estaquia também.

## Células-tronco

São células que podem se transformar em **vários tipos de células**. As **embrionárias** são as mais versáteis; as **adultas** (como as da medula óssea) são mais limitadas. Podem ajudar a tratar lesões e doenças. A medula óssea é usada em transplantes contra leucemia.

## Outras aplicações

- **Teste de DNA** para paternidade e investigação criminal.
- **PCR:** técnica que copia trechos de DNA milhões de vezes; usada para diagnosticar infecções.
- **Terapia gênica:** tentativa de corrigir genes defeituosos.

## Resumindo

Transgênico recebe gene de outra espécie (insulina por bactérias). Clones são geneticamente iguais (Dolly). Células-tronco podem virar vários tecidos. A biotecnologia traz benefícios e debates éticos.`,
    [
      "Transgênico é um organismo com gene de outra espécie.",
      "Bactérias transgênicas produzem insulina humana.",
      "Clones são geneticamente idênticos, como a ovelha Dolly.",
      "Células-tronco podem se transformar em vários tipos de células.",
    ],
    [
      ["Transgênico", "Organismo que recebeu um gene de outra espécie."],
      ["Clonagem", "Produção de um indivíduo geneticamente idêntico a outro."],
      ["Célula-tronco", "Célula capaz de originar diferentes tipos de células."],
    ],
    [
      ["Bactérias que produzem insulina humana são exemplo de:", ["clonagem", "organismo transgênico", "seleção natural", "mutação espontânea", "fermentação lática"], 1, "Receberam o gene humano da insulina."],
      ["A ovelha Dolly foi importante porque foi o primeiro mamífero:", ["transgênico", "clonado a partir de célula adulta", "com células-tronco", "geneticamente modificado para crescer", "criado em laboratório sem óvulo"], 1, "O núcleo de uma célula adulta foi colocado num óvulo sem núcleo."],
      ["Gêmeos idênticos são:", ["transgênicos", "clones naturais", "mutantes", "células-tronco", "híbridos"], 1, "Vêm do mesmo zigoto e têm o mesmo DNA."],
      ["A técnica PCR serve para:", ["clonar animais", "copiar trechos de DNA muitas vezes", "fazer fotossíntese", "produzir vacinas de soro", "medir o pH"], 1, "Ela multiplica o DNA para análise e diagnóstico."],
      ["As células-tronco embrionárias se destacam por:", ["não se dividirem", "poderem originar muitos tipos de células", "serem bactérias", "não terem DNA", "só formarem sangue"], 1, "São as mais versáteis."],
    ],
    [["Cite um benefício e uma preocupação relacionados aos alimentos transgênicos.", "Um benefício é a planta resistir a pragas e aumentar a produção; uma preocupação é o possível impacto ambiental, como o cruzamento com espécies nativas e o surgimento de pragas resistentes."]],
  ),
  aula(
    "Fisiologia vegetal: água, transpiração e hormônios",
    `## Como a planta funciona

As plantas não têm coração, mas transportam água e nutrientes por longas distâncias.

## Vasos condutores

- **Xilema:** leva **água e sais minerais** (seiva bruta) das raízes até as folhas.
- **Floema:** leva os **açúcares** produzidos na fotossíntese (seiva elaborada) das folhas para o resto da planta.

O **anelamento** (tirar um anel de casca do tronco) retira o floema: as raízes deixam de receber açúcar e a planta morre com o tempo.

## Transpiração e estômatos

Nas folhas há os **estômatos**, pequenas aberturas que permitem a entrada de CO₂ e a saída de vapor d'água. A **transpiração** puxa a água desde as raízes, como num canudo.

- Em dia quente e seco, os estômatos **fecham** para evitar perda de água, mas isso reduz a fotossíntese.
- Plantas da **Caatinga** e do deserto têm adaptações: folhas pequenas, espinhos, cutícula grossa, armazenamento de água.

## Hormônios vegetais

- **Auxina:** crescimento; faz a planta se curvar em direção à luz (**fototropismo**).
- **Giberelina:** alongamento do caule e germinação.
- **Citocinina:** divisão celular.
- **Etileno:** **amadurecimento de frutos**. Por isso uma banana madura num saco com frutas verdes acelera o amadurecimento delas.
- **Ácido abscísico:** fechamento dos estômatos em seca e dormência.

## Tropismos

- **Fototropismo:** crescimento em resposta à luz.
- **Geotropismo:** raiz cresce para baixo, caule para cima.

## Resumindo

Xilema leva água; floema leva açúcar. Estômatos controlam transpiração e entrada de CO₂. Etileno amadurece frutos; auxina faz a planta crescer para a luz.`,
    [
      "Xilema leva água e sais (seiva bruta); floema leva açúcares (seiva elaborada).",
      "Estômatos controlam a entrada de CO₂ e a saída de vapor d'água.",
      "Etileno acelera o amadurecimento de frutos.",
      "Auxina faz a planta crescer em direção à luz (fototropismo).",
    ],
    [
      ["Xilema", "Vaso que conduz água e sais minerais das raízes às folhas."],
      ["Floema", "Vaso que conduz os açúcares produzidos nas folhas."],
      ["Estômato", "Abertura na folha que permite trocas gasosas e transpiração."],
    ],
    [
      ["O vaso que transporta água das raízes às folhas é o:", ["floema", "xilema", "estômato", "cloroplasto", "parênquima"], 1, "O xilema conduz a seiva bruta."],
      ["Colocar uma banana madura junto de frutas verdes acelera o amadurecimento por causa do:", ["oxigênio", "etileno", "gás carbônico", "nitrogênio", "vapor d'água"], 1, "A fruta madura libera etileno."],
      ["Em dias muito quentes e secos, as plantas tendem a:", ["abrir mais os estômatos", "fechar os estômatos para economizar água", "parar de respirar", "perder as raízes", "produzir mais flores"], 1, "Fechar os estômatos reduz a perda de água."],
      ["Uma planta na janela que se curva em direção à luz mostra:", ["geotropismo", "fototropismo", "fotossíntese", "transpiração", "germinação"], 1, "É o crescimento em resposta à luz, coordenado pela auxina."],
      ["O anelamento do tronco mata a árvore porque interrompe o:", ["xilema", "floema", "estômato", "fruto", "pólen"], 1, "Sem floema, o açúcar não chega às raízes."],
    ],
    [["Explique a função dos estômatos e o dilema da planta em dias de seca.", "Os estômatos permitem a entrada de gás carbônico para a fotossíntese e a saída de vapor d'água; na seca, a planta fecha os estômatos para não perder água, mas com isso entra menos gás carbônico e a fotossíntese diminui."]],
  ),
  aula(
    "Sucessão ecológica e biomas brasileiros",
    `## A natureza se reconstrói

**Sucessão ecológica** é a sequência de mudanças em uma comunidade ao longo do tempo, até chegar a uma comunidade estável, chamada **clímax**.

- **Sucessão primária:** começa num lugar sem vida, como rocha nua ou lava. Os primeiros a chegar são **líquens** (espécies **pioneiras**), que começam a formar solo.
- **Sucessão secundária:** acontece onde a vida foi destruída mas o solo ficou, como após uma queimada ou numa roça abandonada. É mais rápida.

Ao longo da sucessão, aumentam a **biodiversidade**, a **biomassa** e a complexidade das relações.

## Biomas brasileiros (visão da Biologia)

- **Amazônia:** maior floresta tropical do mundo, altíssima biodiversidade, solo pobre (os nutrientes estão na própria vegetação). O desmatamento expõe o solo à erosão.
- **Mata Atlântica:** muito devastada (restam pequenas partes), mas com alta biodiversidade e muitas espécies endêmicas.
- **Cerrado:** "berço das águas", árvores de troncos tortos e casca grossa (resistentes ao fogo), raízes profundas. Ameaçado pela expansão agrícola.
- **Caatinga:** exclusiva do Brasil, clima semiárido, plantas que perdem folhas na seca e cactos.
- **Pantanal:** maior planície alagável do mundo, ciclo de cheias e secas.
- **Pampa:** campos no Sul, com gramíneas.

## Hotspots

**Hotspots** são áreas com muita biodiversidade e muito ameaçadas. Mata Atlântica e Cerrado são hotspots.

## Resumindo

Sucessão: das pioneiras ao clímax, com aumento de biodiversidade. Primária começa sem solo; secundária, com solo. Cada bioma tem adaptações próprias.`,
    [
      "Sucessão ecológica: mudanças na comunidade até chegar ao clímax.",
      "Primária começa sem solo (líquens pioneiros); secundária, com solo.",
      "Cerrado: troncos tortos, casca grossa e raízes profundas.",
      "Mata Atlântica e Cerrado são hotspots de biodiversidade.",
    ],
    [
      ["Espécie pioneira", "Primeira a ocupar um ambiente na sucessão, como os líquens."],
      ["Comunidade clímax", "Etapa final e estável da sucessão ecológica."],
      ["Hotspot", "Região com alta biodiversidade e muito ameaçada."],
    ],
    [
      ["Os primeiros seres a ocupar uma rocha nua costumam ser:", ["árvores", "líquens", "mamíferos", "aves", "peixes"], 1, "Líquens são pioneiros e ajudam a formar solo."],
      ["Uma roça abandonada que volta a ter mato e depois floresta passa por sucessão:", ["primária", "secundária", "terciária", "inexistente", "artificial"], 1, "O solo já existia: é sucessão secundária."],
      ["Ao longo da sucessão, a biodiversidade tende a:", ["diminuir", "aumentar", "ficar igual", "zerar", "oscilar sem tendência"], 1, "A comunidade fica mais rica e complexa."],
      ["Troncos tortuosos, casca grossa e raízes profundas são características do:", ["Pampa", "Cerrado", "Pantanal", "Mata Atlântica", "manguezal"], 1, "São adaptações ao fogo e à seca do Cerrado."],
      ["O bioma exclusivamente brasileiro e de clima semiárido é a:", ["Amazônia", "Caatinga", "Mata Atlântica", "Pampa", "Pantanal"], 1, "A Caatinga só existe no Brasil."],
    ],
    [["Explique a diferença entre sucessão primária e secundária.", "A sucessão primária começa em um lugar sem vida e sem solo, como uma rocha, com espécies pioneiras como líquens; a secundária ocorre onde a vegetação foi destruída mas o solo permaneceu, e por isso é mais rápida."]],
  ),
  aula(
    "Saúde pública: saneamento, antibióticos e resistência",
    `## Saúde é coletiva

Muitas questões do ENEM unem Biologia e cidadania: como a sociedade se protege das doenças?

## Saneamento básico

Água tratada, esgoto coletado e tratado e lixo recolhido previnem diarreias, verminoses, hepatite A, cólera e leptospirose. Cada real investido em saneamento economiza gastos com saúde. Ainda assim, milhões de brasileiros não têm esgoto tratado.

## Leptospirose

Causada por bactéria eliminada na **urina de ratos**. Aumenta em **enchentes**, quando a água contaminada entra em contato com a pele.

## Antibióticos e resistência

**Antibióticos** matam **bactérias**, não vírus. Tomar antibiótico para gripe ou resfriado (causados por vírus) não adianta.

Quando o antibiótico é usado de forma errada (sem receita, interrompido antes do fim), as bactérias mais resistentes sobrevivem e se multiplicam: é a **seleção natural** em ação. Surgem as **superbactérias**, difíceis de tratar.

Por isso:
- Só use antibiótico com receita.
- Tome pelo tempo indicado, mesmo que melhore antes.

## SUS e vacinação

O **Sistema Único de Saúde** oferece atendimento gratuito e o **Programa Nacional de Imunizações**, que erradicou doenças como a varíola e controlou o sarampo e a poliomielite. A queda na vacinação pode trazer doenças de volta.

## Hábitos saudáveis

Atividade física, alimentação equilibrada, sono adequado e evitar cigarro e álcool previnem doenças crônicas, como hipertensão, diabetes e doenças do coração.

## Resumindo

Saneamento previne muitas doenças. Antibiótico é para bactérias e deve ser usado corretamente para evitar superbactérias. Vacinação em massa protege a todos.`,
    [
      "Saneamento básico previne diarreias, verminoses, cólera e leptospirose.",
      "Antibióticos combatem bactérias, não vírus.",
      "Uso errado de antibióticos seleciona bactérias resistentes (superbactérias).",
      "Vacinação em massa erradicou a varíola e controla outras doenças.",
    ],
    [
      ["Antibiótico", "Medicamento que mata ou impede o crescimento de bactérias."],
      ["Superbactéria", "Bactéria resistente a vários antibióticos."],
      ["Leptospirose", "Doença bacteriana transmitida pela urina de ratos, comum em enchentes."],
    ],
    [
      ["Tomar antibiótico para tratar gripe é:", ["eficaz", "inútil, pois a gripe é causada por vírus", "obrigatório", "recomendado pelo SUS", "a forma de vacinar"], 1, "Antibióticos não agem sobre vírus."],
      ["O surgimento de superbactérias é explicado por:", ["mutação causada pelo antibiótico em cada bactéria", "seleção das bactérias resistentes pelo uso inadequado de antibióticos", "excesso de vacinas", "falta de vitaminas", "o clima"], 1, "As resistentes sobrevivem e se multiplicam: seleção natural."],
      ["A leptospirose costuma aumentar em:", ["épocas de seca", "enchentes", "dias frios", "festas juninas", "cidades sem ratos"], 1, "A água das enchentes leva a urina de ratos contaminada."],
      ["Qual doença foi erradicada graças à vacinação?", ["Dengue", "Varíola", "Gripe", "Malária", "Chagas"], 1, "A varíola foi erradicada no mundo."],
      ["O investimento em saneamento básico:", ["aumenta os gastos com saúde", "reduz doenças e gastos com saúde", "não tem relação com saúde", "só beneficia a indústria", "aumenta a dengue"], 1, "Previne muitas doenças de veiculação hídrica."],
    ],
    [["Por que é importante tomar o antibiótico pelo tempo completo indicado na receita?", "Porque interromper antes pode deixar vivas as bactérias mais resistentes, que se multiplicam e originam infecções difíceis de tratar, contribuindo para as superbactérias."]],
  ),
  aula(
    "Embriologia e desenvolvimento humano",
    `## Do zigoto ao bebê

A **embriologia** estuda o desenvolvimento do embrião, da fecundação até a formação dos órgãos.

## Fecundação

O espermatozoide encontra o óvulo nas **tubas uterinas** (trompas). Os núcleos se unem e formam o **zigoto**, com 46 cromossomos. O sexo genético é definido pelo espermatozoide: X (menina) ou Y (menino).

## Primeiras divisões

- **Segmentação:** o zigoto se divide por mitose (2, 4, 8 células...) enquanto desce até o útero.
- **Mórula:** bolinha maciça de células.
- **Blástula (blastocisto):** bolinha oca que se implanta no útero (**nidação**), cerca de uma semana após a fecundação.
- **Gástrula:** formam-se os **folhetos embrionários**.

## Folhetos embrionários

- **Ectoderme:** pele e **sistema nervoso**.
- **Mesoderme:** músculos, ossos, coração, sangue.
- **Endoderme:** revestimento do tubo digestório e dos pulmões.

## Anexos embrionários

- **Placenta:** troca de nutrientes, oxigênio e gás carbônico entre mãe e feto, **sem misturar** os sangues. Algumas substâncias passam por ela, como álcool, nicotina e certos vírus.
- **Âmnio:** bolsa com líquido amniótico que protege contra choques.
- **Cordão umbilical:** liga o feto à placenta.

## Cuidados na gestação

O pré-natal, a vacinação, o ácido fólico (que previne defeitos no tubo neural) e evitar álcool, cigarro e drogas são essenciais. O álcool pode causar a **síndrome alcoólica fetal**.

## Gêmeos

- **Univitelinos (idênticos):** um zigoto que se divide em dois; mesmo DNA e mesmo sexo.
- **Fraternos:** dois óvulos fecundados por dois espermatozoides; podem ter sexos diferentes.

## Resumindo

Zigoto → segmentação → mórula → blástula (nidação) → gástrula com três folhetos. A placenta troca substâncias sem misturar os sangues; álcool e cigarro atravessam e prejudicam o feto.`,
    [
      "A fecundação ocorre nas tubas uterinas e forma o zigoto.",
      "Ectoderme forma pele e sistema nervoso; mesoderme, músculos e ossos; endoderme, o tubo digestório.",
      "A placenta faz trocas sem misturar o sangue da mãe e do feto.",
      "Gêmeos idênticos vêm de um zigoto; fraternos, de dois.",
    ],
    [
      ["Zigoto", "Primeira célula do novo indivíduo, formada na fecundação."],
      ["Nidação", "Implantação do embrião na parede do útero."],
      ["Placenta", "Órgão que faz as trocas entre a mãe e o feto."],
    ],
    [
      ["A fecundação humana normalmente acontece:", ["no útero", "nas tubas uterinas", "nos ovários", "na vagina", "na placenta"], 1, "O encontro dos gametas ocorre nas tubas."],
      ["O sistema nervoso se origina da:", ["endoderme", "mesoderme", "ectoderme", "placenta", "mórula"], 2, "A ectoderme forma a pele e o sistema nervoso."],
      ["Gêmeos que podem ter sexos diferentes são:", ["univitelinos", "fraternos", "clones", "siameses", "idênticos"], 1, "Vêm de dois óvulos e dois espermatozoides diferentes."],
      ["Beber álcool na gravidez é perigoso porque:", ["o álcool não atravessa a placenta", "o álcool atravessa a placenta e pode causar síndrome alcoólica fetal", "aumenta o líquido amniótico", "acelera o parto sem riscos", "só afeta a mãe"], 1, "O álcool chega ao feto e prejudica seu desenvolvimento."],
      ["A função do líquido amniótico é:", ["nutrir o feto", "proteger o feto contra choques", "produzir hormônios", "formar ossos", "fazer a respiração"], 1, "Ele amortece choques e mantém a temperatura."],
    ],
    [["Explique como a placenta permite trocas entre a mãe e o feto e por que isso exige cuidados na gestação.", "Na placenta os vasos da mãe e do feto ficam próximos sem misturar o sangue, permitindo passar nutrientes, oxigênio e gás carbônico; mas substâncias como álcool, nicotina e alguns vírus também passam, prejudicando o bebê."]],
  ),
];
