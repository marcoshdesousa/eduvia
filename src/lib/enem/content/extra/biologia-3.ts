import { aula } from "./build";

/** Biologia, lote 3: bioquímica, células, saúde, ecologia e evolução. */
export const BIOLOGIA_3 = [
  aula(
    "Origem da vida: abiogênese, biogênese e Oparin",
    `## Como surge a vida?

## Abiogênese (geração espontânea)

Ideia antiga (defendida desde Aristóteles) de que seres vivos poderiam surgir da **matéria sem vida**: larvas da carne podre, ratos de roupas sujas.

## Biogênese: todo ser vivo vem de outro ser vivo

- **Francesco Redi (1668):** colocou carne em frascos **abertos** e **cobertos com gaze**. Só nos abertos apareceram larvas, porque as **moscas** botaram ovos. A carne não gerava larvas sozinha.
- **Louis Pasteur (1860s):** experimento com frascos de **"pescoço de cisne"**. O caldo nutritivo foi fervido; o pescoço curvo deixava o **ar** entrar, mas retinha os micro-organismos. O caldo ficou **estéril**. Quando o pescoço foi quebrado, os micro-organismos apareceram. Isso **derrubou** a abiogênese.
- As descobertas de Pasteur levaram à **pasteurização** (aquecer o leite para matar micro-organismos) e à melhoria da higiene em hospitais.

## Mas e a primeira forma de vida?

**Hipótese de Oparin e Haldane (evolução química):**

1. A **Terra primitiva** tinha uma atmosfera **sem oxigênio livre**, com metano, amônia, hidrogênio e vapor de água.
2. Descargas **elétricas** (raios) e radiação **ultravioleta** forneceram energia.
3. Formaram-se **moléculas orgânicas simples** (aminoácidos), que se acumularam nos mares — a "**sopa primordial**".
4. Essas moléculas se organizaram em estruturas mais complexas (coacervados) até surgirem os primeiros seres vivos.

**Experimento de Miller e Urey (1953):** simularam a atmosfera primitiva com faíscas elétricas e obtiveram **aminoácidos**, apoiando a hipótese.

## Outras hipóteses

- **Panspermia:** a vida (ou suas moléculas) teria vindo do **espaço**, em meteoritos.
- **Fontes hidrotermais** no fundo dos oceanos.

## Os primeiros seres

- Provavelmente **procariontes** (sem núcleo), **heterótrofos** ou quimiossintetizantes.
- Depois surgiram os **fotossintetizantes** (cianobactérias), que liberaram **oxigênio** e transformaram a atmosfera, permitindo a respiração aeróbia e a camada de ozônio.

## Resumindo

Redi e Pasteur derrubaram a geração espontânea (biogênese). Oparin e Haldane propuseram a evolução química na Terra primitiva; Miller e Urey produziram aminoácidos em laboratório.`,
    [
      "Abiogênese: vida surgindo da matéria sem vida (derrubada).",
      "Pasteur: frascos de pescoço de cisne comprovaram a biogênese.",
      "Oparin-Haldane: evolução química na Terra primitiva.",
      "Miller-Urey: aminoácidos formados com faíscas elétricas.",
    ],
    [
      ["Abiogênese", "Hipótese de que seres vivos surgem de matéria sem vida."],
      ["Biogênese", "Teoria de que todo ser vivo se origina de outro ser vivo."],
      ["Pasteurização", "Aquecimento controlado de alimentos para eliminar micro-organismos."],
    ],
    [
      ["O experimento de Pasteur com frascos de pescoço de cisne demonstrou que:", ["a vida surge espontaneamente", "micro-organismos vêm de outros micro-organismos do ar", "o ar impede a vida", "a fervura cria vida", "o caldo gera larvas"], 1, "Biogênese."],
      ["No experimento de Redi, só apareceram larvas na carne:", ["dos frascos cobertos com gaze", "dos frascos abertos, onde as moscas pousaram", "de todos os frascos", "de nenhum frasco", "dos frascos fechados com rolha"], 1, "Ovos de moscas."],
      ["O experimento de Miller e Urey obteve:", ["células completas", "aminoácidos a partir de gases e faíscas elétricas", "DNA", "bactérias", "oxigênio"], 1, "Apoio à evolução química."],
      ["Segundo Oparin, a atmosfera primitiva:", ["era rica em oxigênio", "não tinha oxigênio livre", "era igual à atual", "era só nitrogênio", "não existia"], 1, "Metano, amônia, hidrogênio e vapor."],
      ["O oxigênio da atmosfera se acumulou graças:", ["aos vulcões", "aos seres fotossintetizantes, como as cianobactérias", "aos animais", "aos meteoritos", "aos fungos"], 1, "Fotossíntese."],
    ],
    [["Explique a hipótese de Oparin e Haldane para a origem da vida.", "Na Terra primitiva, sem oxigênio, gases como metano, amônia e hidrogênio receberam energia de raios e radiação ultravioleta e formaram moléculas orgânicas simples, que se acumularam nos mares e se organizaram até originar os primeiros seres vivos."]],
  ),
  aula(
    "Bioquímica: carboidratos, lipídios, proteínas e vitaminas",
    `## Do que os seres vivos são feitos

## Água e sais minerais

- A **água** é a substância mais abundante nos seres vivos; é **solvente**, transporta substâncias e regula a temperatura.
- **Sais minerais:** **cálcio** (ossos e dentes), **ferro** (hemoglobina; falta causa **anemia**), **iodo** (hormônios da tireoide; falta causa **bócio**), sódio e potássio (impulsos nervosos).

## Carboidratos (glicídios)

- Principal **fonte de energia** imediata.
- **Monossacarídeos:** glicose, frutose. **Dissacarídeos:** sacarose (açúcar comum), lactose (leite). **Polissacarídeos:** **amido** (reserva das plantas: arroz, batata, pão), **glicogênio** (reserva dos animais, no fígado e músculos), **celulose** (parede das plantas; vira **fibra** na nossa dieta).
- **Intolerância à lactose:** falta da enzima **lactase**.

## Lipídios

- **Reserva** de energia (mais energia por grama), **isolamento térmico**, proteção de órgãos.
- Formam as **membranas** celulares (fosfolipídios).
- **Colesterol:** necessário para hormônios e membranas, mas o excesso de **LDL** ("ruim") favorece a **aterosclerose** (placas nas artérias). O **HDL** é o "bom".
- Gorduras **trans** e saturadas em excesso aumentam o risco cardiovascular.

## Proteínas

- Formadas por **aminoácidos** unidos por **ligações peptídicas**.
- Funções: **estrutural** (colágeno, queratina), **enzimas**, **hormônios** (insulina), **defesa** (anticorpos), **transporte** (hemoglobina), contração muscular.
- **Aminoácidos essenciais** precisam vir da alimentação (arroz com feijão combinados oferecem uma boa variedade).
- **Desnaturação:** o calor ou o pH alteram a forma da proteína e ela perde a função (clara do ovo cozida).

## Vitaminas

Necessárias em pequenas quantidades; a falta causa **avitaminoses**:

- **A:** visão (falta → **cegueira noturna**).
- **C:** imunidade e colágeno (falta → **escorbuto**, sangramento nas gengivas).
- **D:** absorção de cálcio; produzida com **sol** (falta → **raquitismo**).
- **Complexo B:** metabolismo e sistema nervoso (B12 em alimentos animais).
- **K:** coagulação do sangue.

## Ácidos nucleicos

**DNA** e **RNA**: guardam e expressam a informação genética.

## Resumindo

Carboidratos dão energia (amido, glicogênio); lipídios reservam energia e formam membranas; proteínas têm funções estruturais, enzimáticas e de defesa; vitaminas evitam doenças como escorbuto e raquitismo.`,
    [
      "Carboidratos: energia imediata (glicose, amido, glicogênio).",
      "Lipídios: reserva de energia e membranas; excesso de LDL faz mal.",
      "Proteínas: aminoácidos; enzimas, anticorpos, hormônios.",
      "Falta de vitamina C: escorbuto; de D: raquitismo; de A: cegueira noturna.",
    ],
    [
      ["Polissacarídeo", "Carboidrato formado por muitas unidades de açúcar, como amido e glicogênio."],
      ["Desnaturação", "Perda da forma e da função de uma proteína por calor ou pH."],
      ["Avitaminose", "Doença causada pela falta de uma vitamina."],
    ],
    [
      ["A reserva de energia dos animais, armazenada no fígado, é o:", ["amido", "glicogênio", "celulose", "colesterol", "colágeno"], 1, "Polissacarídeo animal."],
      ["A falta de vitamina C causa:", ["raquitismo", "escorbuto", "cegueira noturna", "bócio", "anemia"], 1, "Sangramento nas gengivas."],
      ["Anticorpos e enzimas são exemplos de:", ["carboidratos", "lipídios", "proteínas", "vitaminas", "sais minerais"], 2, "Funções proteicas."],
      ["A carência de iodo na alimentação pode causar:", ["anemia", "bócio", "escorbuto", "raquitismo", "diabetes"], 1, "Por isso o sal é iodado."],
      ["A clara do ovo fica branca e sólida ao cozinhar porque ocorre:", ["dissolução", "desnaturação das proteínas", "fotossíntese", "fermentação", "osmose"], 1, "Calor altera a forma."],
    ],
    [["Por que a exposição moderada ao sol é importante para a saúde dos ossos?", "Porque a luz do sol estimula a pele a produzir vitamina D, que é necessária para a absorção de cálcio no intestino; sem ela, os ossos ficam fracos, podendo ocorrer raquitismo em crianças."]],
  ),
  aula(
    "Enzimas: os catalisadores da vida",
    `## O que são enzimas

**Enzimas** são, em geral, **proteínas** que **aceleram** reações químicas nos seres vivos (são **catalisadores biológicos**). Sem elas, as reações seriam lentas demais para manter a vida.

- Diminuem a **energia de ativação** da reação.
- **Não são consumidas**: podem ser usadas muitas vezes.
- São **específicas**: cada enzima atua sobre um **substrato** determinado.

## Modelo chave-fechadura

- A enzima tem um **sítio ativo** com formato que se encaixa no **substrato**, como uma chave numa fechadura.
- Forma-se o complexo **enzima-substrato**, a reação ocorre e os **produtos** são liberados.

## Fatores que afetam a atividade enzimática

- **Temperatura:** a atividade aumenta até uma **temperatura ótima** (no corpo humano, cerca de **37 °C**). Acima disso, a enzima **desnatura** (perde a forma) e para de funcionar. Por isso a **febre muito alta** é perigosa.
- **pH:** cada enzima tem um **pH ótimo**.
  - **Pepsina** (estômago): pH **ácido** (≈ 2).
  - **Amilase salivar** e enzimas do intestino: pH próximo do **neutro** ou levemente básico.
- **Concentração do substrato:** aumenta a velocidade até a **saturação** (todas as enzimas ocupadas).
- **Inibidores:** substâncias que bloqueiam a enzima (alguns medicamentos e venenos agem assim).

## Exemplos no corpo

- **Amilase** (saliva e pâncreas): digere o **amido**.
- **Pepsina** (estômago): digere **proteínas**.
- **Lipase** (pâncreas): digere **gorduras** (com ajuda da **bile**, que emulsifica).
- **Lactase**: digere a lactose.
- **Catalase**: decompõe a **água oxigenada** (as bolhas ao colocá-la num ferimento).

## Enzimas no cotidiano e na indústria

- **Sabão em pó** com enzimas que removem manchas de proteína e gordura.
- **Amaciante de carne** (papaína do mamão, bromelina do abacaxi): quebram proteínas. Por isso o abacaxi cru impede a gelatina de endurecer.
- Produção de **queijos**, pães, cervejas e etanol.
- **Conservação na geladeira:** o frio **diminui** a atividade das enzimas e dos micro-organismos (sem destruí-las).
- **Branqueamento** de vegetais antes de congelar: inativa enzimas que escurecem o alimento.

## Resumindo

Enzimas são proteínas catalisadoras, específicas (chave-fechadura) e reutilizáveis. Dependem de temperatura e pH ótimos; calor excessivo as desnatura. Exemplos: amilase, pepsina, lipase.`,
    [
      "Enzimas aceleram reações e não são consumidas.",
      "Modelo chave-fechadura: cada enzima tem seu substrato.",
      "Temperatura e pH ótimos; calor excessivo desnatura.",
      "Pepsina age em pH ácido; amilase digere amido.",
    ],
    [
      ["Enzima", "Proteína que acelera reações químicas nos seres vivos."],
      ["Substrato", "Molécula sobre a qual a enzima atua."],
      ["Sítio ativo", "Região da enzima onde o substrato se encaixa."],
    ],
    [
      ["As enzimas atuam:", ["aumentando a energia de ativação", "diminuindo a energia de ativação das reações", "sendo consumidas na reação", "só fora do corpo", "sem especificidade"], 1, "Catalisadores."],
      ["A pepsina funciona melhor em pH:", ["ácido", "neutro", "básico", "qualquer", "acima de 12"], 0, "Ambiente do estômago."],
      ["A febre muito alta é perigosa porque pode:", ["acelerar demais as enzimas para sempre", "desnaturar enzimas importantes", "aumentar o pH do sangue", "parar a digestão de água", "criar novas enzimas"], 1, "Perda de função."],
      ["O abacaxi cru impede a gelatina de endurecer porque contém:", ["amido", "bromelina, uma enzima que quebra proteínas", "açúcar demais", "vitamina C", "gordura"], 1, "A gelatina é proteína."],
      ["Guardar alimentos na geladeira conserva-os porque o frio:", ["destrói as enzimas", "diminui a atividade das enzimas e dos micro-organismos", "aumenta o pH", "esteriliza totalmente", "desnatura as proteínas"], 1, "Reações mais lentas."],
    ],
    [["Explique o modelo chave-fechadura da ação enzimática.", "A enzima possui um sítio ativo com formato específico onde só o substrato certo se encaixa, como uma chave numa fechadura; o encaixe forma o complexo enzima-substrato, a reação ocorre e os produtos são liberados."]],
  ),
  aula(
    "Citologia: as organelas da célula",
    `## A célula, unidade da vida

Todos os seres vivos são formados por **células** (exceto os vírus, que são **acelulares**).

## Procariontes x eucariontes

- **Procariontes:** **sem núcleo** organizado (o DNA fica disperso no citoplasma) e sem organelas membranosas. Ex.: **bactérias**.
- **Eucariontes:** com **núcleo** delimitado por membrana (carioteca) e organelas. Ex.: animais, plantas, fungos, protozoários.

## Partes principais

- **Membrana plasmática:** envoltório que controla a entrada e saída de substâncias (**permeabilidade seletiva**); modelo do mosaico fluido (fosfolipídios e proteínas).
- **Citoplasma:** região entre a membrana e o núcleo, com o citosol e as organelas.
- **Núcleo:** contém o **DNA** e comanda a célula; o **nucléolo** produz ribossomos.

## Organelas e funções

- **Mitocôndrias:** **respiração celular**, produzem **ATP** (energia). Muitas em células musculares. Têm **DNA próprio** (herdado da **mãe**).
- **Ribossomos:** **síntese de proteínas** (presentes também nos procariontes).
- **Retículo endoplasmático rugoso:** com ribossomos; produz e transporta **proteínas**.
- **Retículo endoplasmático liso:** produz **lipídios** e **desintoxica** (muito desenvolvido no fígado).
- **Complexo golgiense:** **modifica, empacota e secreta** substâncias; forma os lisossomos.
- **Lisossomos:** **digestão intracelular** (enzimas digestivas).
- **Peroxissomos:** decompõem a água oxigenada.
- **Centríolos:** participam da divisão celular (em animais).

## Exclusivas da célula vegetal

- **Parede celular** de **celulose**: sustentação e proteção.
- **Cloroplastos:** **fotossíntese** (contêm **clorofila**); também têm DNA próprio.
- **Vacúolo** grande: armazena água e substâncias; mantém a pressão da célula.

## Teoria endossimbiótica

Mitocôndrias e cloroplastos teriam sido **bactérias** englobadas por células maiores, passando a viver em **simbiose**. Evidências: têm **DNA próprio**, ribossomos semelhantes aos bacterianos e **dupla membrana**.

## Resumindo

Procariontes não têm núcleo; eucariontes sim. Mitocôndria: energia; ribossomo: proteínas; Golgi: secreção; lisossomo: digestão. Células vegetais têm parede de celulose, cloroplastos e vacúolo grande.`,
    [
      "Procariontes (bactérias) não têm núcleo; eucariontes têm.",
      "Mitocôndria: respiração e ATP; ribossomo: proteínas.",
      "Golgi: empacota e secreta; lisossomo: digestão celular.",
      "Vegetais: parede de celulose, cloroplastos e vacúolo grande.",
    ],
    [
      ["Organela", "Estrutura da célula com função específica."],
      ["ATP", "Molécula que armazena e fornece energia para a célula."],
      ["Teoria endossimbiótica", "Hipótese de que mitocôndrias e cloroplastos eram bactérias englobadas."],
    ],
    [
      ["A organela responsável pela respiração celular é:", ["ribossomo", "mitocôndria", "lisossomo", "complexo golgiense", "cloroplasto"], 1, "Produz ATP."],
      ["As bactérias são células:", ["eucariontes", "procariontes", "vegetais", "acelulares", "animais"], 1, "Sem núcleo organizado."],
      ["É exclusiva da célula vegetal (em relação à animal):", ["mitocôndria", "parede celular de celulose", "ribossomo", "membrana plasmática", "núcleo"], 1, "Sustentação."],
      ["A digestão intracelular é feita pelos:", ["ribossomos", "lisossomos", "centríolos", "cloroplastos", "nucléolos"], 1, "Enzimas digestivas."],
      ["Uma evidência da teoria endossimbiótica é que as mitocôndrias:", ["não têm membrana", "possuem DNA próprio", "fazem fotossíntese", "existem só em plantas", "são feitas de celulose"], 1, "Semelhança com bactérias."],
    ],
    [["Cite duas diferenças entre a célula vegetal e a célula animal.", "A célula vegetal tem parede celular de celulose e cloroplastos para a fotossíntese, além de um vacúolo grande; a célula animal não tem parede nem cloroplastos e possui centríolos."]],
  ),
  aula(
    "Sistema excretor e homeostase",
    `## Manter o equilíbrio do corpo

**Homeostase** é a capacidade do organismo de manter o **meio interno estável** (temperatura, água, sais, pH, glicose), mesmo com mudanças no ambiente.

## Excreção

É a eliminação de **resíduos do metabolismo**, principalmente os **nitrogenados** (que vêm da quebra de proteínas):

- **Amônia:** muito tóxica e solúvel; eliminada por animais **aquáticos** (peixes).
- **Ureia:** menos tóxica; eliminada por **mamíferos** e anfíbios adultos.
- **Ácido úrico:** pouco tóxico e pouco solúvel; eliminado por **aves**, répteis e insetos, com **pouca perda de água** (vantagem em ambientes secos e para ovos).

## O sistema urinário humano

- **Rins** (dois): filtram o sangue.
- **Ureteres:** levam a urina à **bexiga**.
- **Bexiga:** armazena a urina.
- **Uretra:** elimina a urina.

## O néfron: unidade de filtração

Cada rim tem cerca de **1 milhão de néfrons**.

1. **Filtração:** no **glomérulo** (cápsula de Bowman), o sangue é filtrado sob pressão: passam água, sais, glicose, ureia (células e proteínas grandes ficam no sangue).
2. **Reabsorção:** nos túbulos, substâncias úteis (**glicose**, grande parte da **água** e dos sais) **voltam** para o sangue.
3. **Secreção:** algumas substâncias são lançadas no túbulo.
4. O que sobra forma a **urina**.

**Glicose na urina** é sinal de **diabetes**: há tanta glicose no sangue que os rins não conseguem reabsorver toda.

## Controle hormonal

- **ADH (hormônio antidiurético):** produzido no hipotálamo e liberado pela hipófise. Quando falta água, o ADH aumenta a **reabsorção de água** e a urina fica **mais concentrada**.
- O **álcool inibe o ADH**: urina-se mais e ocorre **desidratação** (parte da "ressaca").

## Outras formas de excreção e regulação

- **Pele:** suor elimina água e sais e ajuda a regular a **temperatura**.
- **Pulmões:** eliminam **CO₂**.
- **Fígado:** transforma a amônia em **ureia**.

## Saúde

- Beber **água** previne **cálculos renais** (pedras nos rins) e infecções urinárias.
- **Hemodiálise:** máquina que filtra o sangue de quem tem insuficiência renal; o **transplante** é outra opção.
- Pressão alta e diabetes não controlados danificam os rins.

## Resumindo

Homeostase mantém o meio interno estável. Rins filtram o sangue nos néfrons (filtração, reabsorção, secreção). O ADH controla a água; o álcool o inibe. Aves eliminam ácido úrico; mamíferos, ureia.`,
    [
      "Homeostase: manter o meio interno estável.",
      "Néfron: filtração, reabsorção e secreção.",
      "ADH aumenta a reabsorção de água; o álcool o inibe.",
      "Peixes: amônia; mamíferos: ureia; aves: ácido úrico.",
    ],
    [
      ["Homeostase", "Manutenção do equilíbrio do meio interno do organismo."],
      ["Néfron", "Unidade funcional do rim que filtra o sangue e forma a urina."],
      ["ADH", "Hormônio antidiurético, que aumenta a reabsorção de água nos rins."],
    ],
    [
      ["A unidade funcional dos rins é o:", ["neurônio", "néfron", "alvéolo", "glomérulo apenas", "ureter"], 1, "Filtra o sangue."],
      ["A presença de glicose na urina pode indicar:", ["desidratação leve", "diabetes", "excesso de vitamina C", "anemia", "gripe"], 1, "Excesso de glicose no sangue."],
      ["O consumo de álcool aumenta a produção de urina porque:", ["estimula o ADH", "inibe o ADH", "aumenta a sede", "destrói os rins na hora", "produz ureia"], 1, "Menos reabsorção de água."],
      ["As aves excretam ácido úrico, o que é vantajoso porque:", ["é muito tóxico", "gasta pouca água", "é um gás", "é muito solúvel", "aquece o corpo"], 1, "Economia de água."],
      ["A transformação da amônia em ureia ocorre no:", ["rim", "fígado", "pulmão", "estômago", "coração"], 1, "Ciclo da ureia."],
    ],
    [["Explique como o ADH ajuda a manter o equilíbrio de água no corpo.", "Quando o corpo perde água, a hipófise libera ADH, que faz os rins reabsorverem mais água; assim a urina fica mais concentrada e o organismo economiza água. Quando há água em excesso, o ADH diminui e a urina fica mais diluída."]],
  ),
  aula(
    "Doenças virais e bacterianas: HIV, tuberculose e COVID-19",
    `## Vírus x bactérias

- **Vírus:** **acelulares**, formados por material genético (DNA ou RNA) e uma cápsula de proteína. Só se reproduzem **dentro de células** (parasitas intracelulares obrigatórios). **Antibióticos não funcionam** contra vírus. Prevenção principal: **vacinas**; alguns têm **antivirais**.
- **Bactérias:** **células procariontes**, com metabolismo próprio. Tratadas com **antibióticos**.

## Doenças virais importantes

- **Gripe (influenza)** e **COVID-19** (SARS-CoV-2, pandemia a partir de 2020): transmissão por **gotículas** e aerossóis. Prevenção: vacinas, máscaras, ventilação, higiene das mãos.
- **Sarampo**, **rubéola**, **caxumba** (vacina tríplice viral). O sarampo voltou com a queda da vacinação.
- **Poliomielite** (paralisia infantil): eliminada no Brasil graças à vacina (gotinha/injetável).
- **Hepatites A** (água e alimentos contaminados) e **B e C** (sangue, sexo; podem levar a cirrose e câncer de fígado).
- **HIV/AIDS:** o vírus HIV ataca os **linfócitos T CD4**, enfraquecendo a imunidade. Transmissão por **relação sexual** sem preservativo, **sangue** (seringas compartilhadas) e de mãe para filho. Não se transmite por abraço, beijo social, talheres ou picada de mosquito. O **tratamento antirretroviral** (gratuito no SUS) permite vida longa e, com carga viral indetectável, a pessoa **não transmite** o vírus. Prevenção: camisinha, **PrEP** e **PEP**.
- **Dengue, zika, chikungunya e febre amarela:** transmitidas por mosquitos (*Aedes*).
- **Raiva:** mordida de animais infectados; vacina para cães e gatos.
- **HPV:** pode causar câncer de colo do útero; há vacina para meninas e meninos.

## Doenças bacterianas importantes

- **Tuberculose:** bacilo de Koch, ataca principalmente os **pulmões**; transmissão pelo **ar**. Tosse por mais de 3 semanas é sinal de alerta. Tratamento longo (6 meses) e gratuito; vacina **BCG** ao nascer.
- **Hanseníase:** manchas com perda de sensibilidade; tem cura.
- **Cólera** e **leptospirose** (urina de rato em enchentes): ligadas à falta de **saneamento**.
- **Tétano:** bactéria do solo entra por ferimentos (vacina).
- **Sífilis**, **gonorreia** e **clamídia**: ISTs bacterianas; prevenção com camisinha.
- **Meningite bacteriana**, **coqueluche**, **difteria** (vacinas).

## Resistência a antibióticos

O uso **errado** de antibióticos (sem receita, interromper o tratamento, usá-los contra vírus) **seleciona bactérias resistentes** (as "superbactérias").

## Resumindo

Vírus são acelulares e não respondem a antibióticos (vacinas são a principal prevenção); bactérias são células tratadas com antibióticos. HIV ataca linfócitos T; tuberculose é transmitida pelo ar. Uso incorreto de antibióticos cria resistência.`,
    [
      "Antibióticos não funcionam contra vírus.",
      "HIV ataca linfócitos T; tratamento antirretroviral é gratuito no SUS.",
      "Tuberculose: bactéria transmitida pelo ar; vacina BCG.",
      "Uso errado de antibióticos seleciona bactérias resistentes.",
    ],
    [
      ["Vírus", "Agente acelular que só se reproduz dentro de células."],
      ["Antibiótico", "Medicamento que mata ou impede o crescimento de bactérias."],
      ["Carga viral indetectável", "Quantidade de vírus tão baixa que não é detectada nos exames e não há transmissão sexual do HIV."],
    ],
    [
      ["Tomar antibiótico para gripe é inadequado porque:", ["a gripe é causada por bactéria resistente", "a gripe é causada por vírus, e antibióticos não agem sobre vírus", "antibióticos causam gripe", "a gripe não tem cura", "a gripe é causada por fungo"], 1, "Antibióticos agem em bactérias."],
      ["O HIV ataca principalmente:", ["as hemácias", "os linfócitos T CD4", "os neurônios", "as plaquetas", "os ossos"], 1, "Enfraquece a imunidade."],
      ["A tuberculose é transmitida principalmente:", ["pela picada do Aedes", "pelo ar, por gotículas de tosse", "por água contaminada", "por urina de rato", "pelo solo"], 1, "Doença respiratória."],
      ["A leptospirose está associada a:", ["picada de mosquito", "enchentes e contato com urina de rato", "relação sexual", "alimentos com glúten", "transfusão de sangue"], 1, "Falta de saneamento."],
      ["O surgimento de superbactérias está ligado:", ["ao uso correto de vacinas", "ao uso inadequado de antibióticos", "à lavagem das mãos", "ao saneamento básico", "ao uso de máscaras"], 1, "Seleção de resistentes."],
    ],
    [["Por que interromper o tratamento com antibiótico antes do tempo é perigoso?", "Porque as bactérias mais sensíveis morrem primeiro e as mais resistentes sobrevivem e se multiplicam; assim, a infecção pode voltar mais forte e surgem bactérias resistentes aos antibióticos."]],
  ),
  aula(
    "Ecologia de populações, nicho e pirâmides ecológicas",
    `## Níveis de organização

**Indivíduo → população → comunidade → ecossistema → biosfera.**

- **População:** indivíduos da **mesma espécie** na mesma área.
- **Comunidade:** **todas as populações** de uma área.
- **Ecossistema:** comunidade + ambiente físico (fatores **abióticos**: luz, água, temperatura, solo).

## Habitat x nicho ecológico

- **Habitat:** o **"endereço"** da espécie (onde vive).
- **Nicho ecológico:** a **"profissão"**: o que come, quando age, como se reproduz, seu papel no ecossistema.
- Duas espécies com o **mesmo nicho** no mesmo lugar competem; uma tende a eliminar a outra (**princípio da exclusão competitiva**).

## Dinâmica de populações

- A população **cresce** com **natalidade** e **imigração**; **diminui** com **mortalidade** e **emigração**.
- **Potencial biótico:** capacidade máxima de crescimento sem limitações (curva **J**, exponencial).
- **Resistência ambiental:** fatores que limitam o crescimento (falta de alimento e espaço, predadores, doenças, competição).
- Na natureza, a população se estabiliza na **capacidade de suporte** do ambiente (curva **S**, logística).
- Ex.: espécies **invasoras** sem predadores crescem descontroladamente (caramujo-africano, javali, mexilhão-dourado).

## Relação predador-presa

As populações de predadores e presas **oscilam** de forma ligada: mais presas → mais predadores → menos presas → menos predadores...

## Pirâmides ecológicas

Representam os **níveis tróficos** (produtores na base).

- **Pirâmide de números:** quantidade de indivíduos. Pode ser **invertida** (uma árvore sustenta milhares de insetos).
- **Pirâmide de biomassa:** massa de matéria orgânica. Geralmente com base larga (pode inverter em ambientes aquáticos).
- **Pirâmide de energia:** **nunca é invertida**. A cada nível, só cerca de **10%** da energia passa adiante; o resto é **perdido** como calor (respiração) e em fezes e partes não comidas.

## Consequências

- Cadeias alimentares são **curtas** (poucos níveis), pois a energia se esgota.
- É mais eficiente energeticamente alimentar-se de **produtores** (vegetais): a mesma área alimenta mais pessoas com grãos do que com carne.

## Resumindo

Habitat é onde vive; nicho é o papel. Populações crescem até a capacidade de suporte (curva S). A pirâmide de energia nunca inverte: só ~10% passa de um nível para o outro.`,
    [
      "Habitat é o \"endereço\"; nicho é a \"profissão\".",
      "Resistência ambiental limita o crescimento (curva S).",
      "Pirâmide de energia nunca é invertida.",
      "Só cerca de 10% da energia passa ao nível seguinte.",
    ],
    [
      ["Nicho ecológico", "Papel de uma espécie no ecossistema: alimentação, comportamento, relações."],
      ["Capacidade de suporte", "Número máximo de indivíduos que um ambiente sustenta."],
      ["Nível trófico", "Posição de um organismo na cadeia alimentar."],
    ],
    [
      ["O conjunto de todas as populações de uma área forma:", ["um indivíduo", "uma comunidade", "uma espécie", "um nicho", "um habitat"], 1, "Várias espécies juntas."],
      ["A pirâmide que nunca pode ser invertida é a de:", ["números", "biomassa", "energia", "indivíduos", "espécies"], 2, "Energia sempre diminui."],
      ["Uma espécie invasora sem predadores tende a:", ["desaparecer logo", "crescer descontroladamente e prejudicar as nativas", "ficar estável", "virar produtora", "ajudar todas as espécies"], 1, "Sem resistência ambiental."],
      ["Se um produtor tem 10.000 kcal, o consumidor secundário recebe cerca de:", ["1.000 kcal", "100 kcal", "10 kcal", "10.000 kcal", "5.000 kcal"], 1, "10% de 10% = 1%."],
      ["Uma árvore com milhares de pulgões gera uma pirâmide de números:", ["normal", "invertida", "de energia", "impossível", "sem produtores"], 1, "Um produtor, muitos consumidores."],
    ],
    [["Por que as cadeias alimentares costumam ter poucos níveis tróficos?", "Porque a cada nível apenas cerca de 10% da energia é transferida ao seguinte; o restante é perdido como calor na respiração e em restos, então a energia disponível se esgota rapidamente."]],
  ),
  aula(
    "Impactos ambientais: biomagnificação e espécies invasoras",
    `## Quando o ser humano altera o equilíbrio

## Bioacumulação e biomagnificação

- Algumas substâncias **não são degradadas** nem eliminadas pelos organismos: **metais pesados** (mercúrio, chumbo, cádmio) e **pesticidas** como o **DDT**.
- **Bioacumulação:** a substância se **acumula** no corpo ao longo da vida.
- **Biomagnificação (magnificação trófica):** a concentração **aumenta a cada nível** da cadeia alimentar, porque cada predador come muitas presas contaminadas.
- Os **consumidores do topo** (grandes peixes, aves de rapina, **seres humanos**) são os mais afetados.
- Exemplos:
  - **Mercúrio** do garimpo na Amazônia: contamina peixes e as populações **ribeirinhas e indígenas** que os comem (danos neurológicos).
  - **Minamata (Japão, 1950s):** envenenamento por mercúrio de uma fábrica.
  - **DDT:** tornou frágeis as cascas dos ovos de aves de rapina; foi proibido em muitos países (livro *Primavera Silenciosa*, de Rachel Carson).

## Espécies invasoras (exóticas)

- Espécies levadas para fora de sua região natural que se **espalham** e causam danos.
- Sem **predadores** e competidores naturais, crescem rápido e **competem** com as nativas, causam doenças ou alteram o ambiente.
- Exemplos no Brasil:
  - **Caramujo-africano** (praga agrícola e transmissor de doenças).
  - **Mexilhão-dourado** (entope tubulações de hidrelétricas).
  - **Javali** (destrói lavouras).
  - **Peixe-leão** (no litoral, come peixes nativos).
  - **Abelha africana** (cruzou com as europeias: abelhas africanizadas).
  - **Pinus** e **braquiária** que invadem áreas naturais.
- A introdução de espécies é uma das **principais causas de perda de biodiversidade**.

## Outros impactos

- **Desmatamento** e **fragmentação de habitats** (isolam populações; solução: **corredores ecológicos**).
- **Agrotóxicos:** contaminam solo, água, trabalhadores e consumidores; matam polinizadores como as **abelhas**.
- **Poluição por plástico** e **microplásticos** nos oceanos (ingeridos por animais e já encontrados no corpo humano).
- **Caça e tráfico** de animais silvestres.

## Controle biológico

Usar **inimigos naturais** para controlar pragas, reduzindo agrotóxicos (ex.: vespas que parasitam lagartas na cana; *Wolbachia* em mosquitos da dengue). Exige cuidado para que o agente não vire uma nova praga.

## Resumindo

Substâncias não degradáveis se acumulam e aumentam ao longo da cadeia (biomagnificação), atingindo o topo, inclusive os humanos. Espécies invasoras sem predadores ameaçam as nativas. Controle biológico reduz o uso de agrotóxicos.`,
    [
      "Biomagnificação: concentração aumenta a cada nível trófico.",
      "Mercúrio do garimpo contamina peixes e populações ribeirinhas.",
      "Espécies invasoras sem predadores ameaçam as nativas.",
      "Controle biológico usa inimigos naturais contra pragas.",
    ],
    [
      ["Biomagnificação", "Aumento da concentração de uma substância ao longo da cadeia alimentar."],
      ["Espécie exótica invasora", "Espécie introduzida fora de sua área natural que se espalha e causa danos."],
      ["Controle biológico", "Uso de organismos para controlar pragas."],
    ],
    [
      ["Na biomagnificação, os mais afetados são:", ["os produtores", "os consumidores do topo da cadeia", "os decompositores", "as plantas aquáticas", "os herbívoros apenas"], 1, "Acumulam mais."],
      ["O mercúrio usado no garimpo prejudica os ribeirinhos porque:", ["evapora e some", "se acumula nos peixes que eles comem", "melhora a pesca", "é eliminado rapidamente", "só afeta plantas"], 1, "Biomagnificação."],
      ["Espécies invasoras costumam se espalhar porque:", ["têm muitos predadores", "não têm predadores e competidores naturais no novo ambiente", "são sempre plantas", "não se reproduzem", "dependem de humanos para comer"], 1, "Sem resistência ambiental."],
      ["O uso de vespas para controlar lagartas na cana é um exemplo de:", ["biomagnificação", "controle biológico", "eutrofização", "espécie invasora", "agrotóxico"], 1, "Inimigo natural."],
      ["O livro \"Primavera Silenciosa\", de Rachel Carson, denunciou os efeitos do:", ["mercúrio", "DDT", "plástico", "petróleo", "CO₂"], 1, "Pesticida."],
    ],
    [["Explique o que é biomagnificação, com um exemplo.", "É o aumento da concentração de uma substância não degradável a cada nível da cadeia alimentar; por exemplo, o mercúrio do garimpo passa da água para pequenos peixes, depois para peixes maiores e chega em alta concentração nas pessoas que os comem."]],
  ),
  aula(
    "Herança ligada ao sexo e mutações",
    `## Os cromossomos sexuais

Na espécie humana há **46 cromossomos**: 44 autossomos e **2 sexuais**.

- **Mulheres:** **XX**. **Homens:** **XY**.
- O cromossomo **Y** é pequeno e tem poucos genes (incluindo o que determina o sexo masculino).
- O **pai** define o sexo do filho (envia X ou Y).

## Herança ligada ao X

Genes localizados no **cromossomo X** (sem correspondente no Y).

- **Homens** têm **um só X**: se ele tiver o alelo recessivo, o homem **manifesta** a característica (são **hemizigóticos**).
- **Mulheres** precisam de **dois** alelos recessivos para manifestar; com um só, são **portadoras** (normais, mas podem transmitir).
- Por isso essas condições são **mais comuns em homens**.
- O **filho homem herda o X da mãe**; a filha herda um X de cada genitor.

## Exemplos

- **Daltonismo:** dificuldade de distinguir cores (vermelho e verde).
- **Hemofilia:** falha na coagulação do sangue; sangramentos prolongados. Famosa na família real europeia (rainha Vitória era portadora).
- **Distrofia muscular de Duchenne**.

**Exemplo de cruzamento:** mãe portadora (XᴰXᵈ) e pai normal (XᴰY):

- Filhas: XᴰXᴰ ou XᴰXᵈ → **todas normais** (50% portadoras).
- Filhos: XᴰY ou XᵈY → **50% daltônicos**.

## Mutações

**Mutação** é uma alteração no **material genético**.

- **Gênicas:** mudança na sequência de bases do DNA. Ex.: **anemia falciforme** (troca de uma base no gene da hemoglobina, deixando as hemácias em forma de foice). É mais comum em populações de origem africana e confere certa resistência à malária aos heterozigotos.
- **Cromossômicas numéricas:** número alterado de cromossomos.
  - **Síndrome de Down:** **trissomia do 21** (três cromossomos 21; 47 no total). O risco aumenta com a idade materna.
  - **Síndrome de Turner** (X0, mulher com um X só) e **Klinefelter** (XXY, homem).
- **Cromossômicas estruturais:** quebras, perdas ou trocas de pedaços.

## Causas de mutações

Podem ser **espontâneas** (erros na duplicação do DNA) ou causadas por **agentes mutagênicos**: radiação **UV**, raios X, radioatividade, fumaça do **cigarro**, alguns produtos químicos e vírus.

## Importância evolutiva

Mutações são a **fonte primária de variabilidade genética**: sem elas não haveria evolução. A maioria é neutra ou prejudicial, mas algumas podem ser vantajosas em certo ambiente.

## Resumindo

Genes no X explicam por que daltonismo e hemofilia são mais comuns em homens. O filho herda o X da mãe. Mutações gênicas (anemia falciforme) e cromossômicas (Down) alteram o material genético e são fonte de variabilidade.`,
    [
      "Homens XY têm um só X: manifestam genes recessivos do X.",
      "Daltonismo e hemofilia são mais comuns em homens.",
      "O filho homem herda o X da mãe.",
      "Down: trissomia do 21; mutações geram variabilidade.",
    ],
    [
      ["Herança ligada ao sexo", "Transmissão de genes localizados no cromossomo X."],
      ["Portadora", "Mulher com um alelo recessivo que não manifesta, mas pode transmitir."],
      ["Mutação", "Alteração no material genético."],
    ],
    [
      ["O daltonismo é mais comum em homens porque:", ["eles têm dois X", "eles têm um só X, e basta um alelo recessivo", "o Y causa daltonismo", "as mulheres não têm X", "é transmitido só de pai para filho"], 1, "Hemizigose."],
      ["Mãe portadora de hemofilia e pai normal: a chance de um filho homem ser hemofílico é:", ["0%", "25%", "50%", "75%", "100%"], 2, "Recebe X da mãe: metade com o alelo."],
      ["A síndrome de Down é causada por:", ["falta do cromossomo X", "trissomia do cromossomo 21", "mutação no gene da hemoglobina", "excesso de Y", "vírus"], 1, "47 cromossomos."],
      ["A anemia falciforme resulta de:", ["uma mutação gênica no gene da hemoglobina", "falta de ferro na dieta", "um vírus", "trissomia", "falta de vitamina C"], 0, "Hemácias em foice."],
      ["Um homem daltônico transmite o gene do daltonismo:", ["a todos os filhos homens", "a todas as filhas", "a ninguém", "só aos netos homens", "metade dos filhos homens"], 1, "As filhas recebem o X do pai."],
    ],
    [["Explique por que um pai daltônico não transmite o daltonismo para seus filhos homens.", "Porque o filho homem recebe do pai o cromossomo Y, e não o X; o gene do daltonismo está no X, que o pai passa apenas para as filhas, que se tornam pelo menos portadoras."]],
  ),
  aula(
    "Especiação e evolução humana",
    `## Como surgem novas espécies

**Espécie** é um grupo de indivíduos capazes de se **cruzar** e gerar **descendentes férteis**. (Cavalo e jumenta geram a **mula**, que é **estéril**: cavalos e jumentos são espécies diferentes.)

## Especiação alopátrica (a mais comum)

1. Uma população é **dividida** por uma **barreira geográfica** (rio, montanha, mar, deriva continental).
2. Os grupos ficam **isolados** e acumulam **mutações** diferentes.
3. **Seleção natural** e deriva genética atuam de formas diferentes em cada ambiente.
4. Com o tempo, surge **isolamento reprodutivo**: mesmo se reencontrarem, já **não conseguem gerar descendentes férteis**. Formaram-se **novas espécies**.

Ex.: os **tentilhões de Darwin** nas ilhas Galápagos, com bicos adaptados a alimentos diferentes (**irradiação adaptativa**).

## Evidências da evolução

- **Fósseis.**
- **Órgãos homólogos:** mesma origem, funções diferentes (braço humano, asa do morcego, nadadeira da baleia) → ancestral comum (**divergência**).
- **Órgãos análogos:** origem diferente, mesma função (asa de inseto e de ave) → **convergência** evolutiva.
- **Órgãos vestigiais:** apêndice, cóccix, músculos da orelha.
- **Semelhanças no DNA** e na embriologia.

## Evolução humana

- Humanos e chimpanzés têm um **ancestral comum** (não descendemos dos chimpanzés atuais), que viveu há cerca de **6 a 7 milhões de anos**, na **África**.
- **Australopithecus** (como **"Lucy"**): já andavam em pé (**bipedismo**), cérebro pequeno.
- **Homo habilis:** primeiras ferramentas de pedra.
- **Homo erectus:** uso do **fogo**, saiu da África.
- **Homo sapiens:** surgiu na **África** há cerca de **300 mil anos** e se espalhou pelo mundo (hipótese "**Out of Africa**"). Conviveu e até cruzou com os **neandertais**.
- Tendências: bipedismo, aumento do cérebro, uso de ferramentas, linguagem, cultura.

## Raças humanas?

Geneticamente, as diferenças entre os grupos humanos são **muito pequenas**; não existem "raças" biológicas na espécie humana. O conceito de raça é uma **construção social**, usada historicamente para justificar o racismo (como no **darwinismo social**, uma distorção da teoria de Darwin).

## Resumindo

Especiação alopátrica: barreira geográfica → isolamento → diferenças → isolamento reprodutivo. Órgãos homólogos indicam ancestral comum. O Homo sapiens surgiu na África; não existem raças biológicas humanas.`,
    [
      "Espécie: cruzam e geram descendentes férteis (a mula é estéril).",
      "Especiação alopátrica: barreira geográfica e isolamento reprodutivo.",
      "Homólogos: mesma origem; análogos: mesma função.",
      "Homo sapiens surgiu na África; não há raças biológicas humanas.",
    ],
    [
      ["Especiação", "Processo de formação de novas espécies."],
      ["Isolamento reprodutivo", "Impossibilidade de duas populações gerarem descendentes férteis."],
      ["Órgãos homólogos", "Estruturas com mesma origem embrionária, que podem ter funções diferentes."],
    ],
    [
      ["Cavalos e jumentos são espécies diferentes porque:", ["não cruzam nunca", "seu descendente, a mula, é estéril", "vivem em continentes diferentes", "têm cores diferentes", "comem alimentos diferentes"], 1, "Critério reprodutivo."],
      ["O primeiro passo da especiação alopátrica é:", ["a hibridização", "o isolamento geográfico", "a extinção", "a domesticação", "a clonagem"], 1, "Barreira física."],
      ["O braço humano e a asa do morcego são órgãos:", ["análogos", "homólogos", "vestigiais", "idênticos", "sem relação"], 1, "Mesma origem."],
      ["Segundo as evidências, o Homo sapiens surgiu:", ["na Europa", "na África", "na América", "na Ásia", "na Oceania"], 1, "Out of Africa."],
      ["Sobre as \"raças humanas\", a ciência afirma que:", ["são biologicamente muito diferentes", "não existem raças biológicas; raça é construção social", "existem cinco raças puras", "dependem da cor da pele apenas", "são espécies diferentes"], 1, "Diferenças genéticas mínimas."],
    ],
    [["Explique como uma barreira geográfica pode levar à formação de novas espécies.", "A barreira separa uma população em grupos isolados; cada grupo acumula mutações diferentes e sofre seleção natural em ambientes distintos; com o tempo, ficam tão diferentes que não conseguem mais gerar descendentes férteis, tornando-se espécies diferentes."]],
  ),
];
