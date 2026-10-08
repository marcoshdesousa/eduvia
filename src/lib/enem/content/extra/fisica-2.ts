import { aula } from "./build";

/** Física, lote 2: calor, eletricidade, ondas e mecânica no cotidiano. */
export const FISICA_2 = [
  aula(
    "Propagação do calor: condução, convecção e irradiação",
    `## Calor é energia em trânsito

**Calor** é a energia que passa de um corpo **mais quente** para um **mais frio**. Ele se propaga de três formas.

## Condução

- O calor passa **de partícula em partícula**, por contato, principalmente nos **sólidos**.
- **Bons condutores:** metais (panela de alumínio, colher de metal esquenta rápido).
- **Isolantes térmicos:** madeira, plástico, isopor, lã, **ar parado**.
- Exemplos: cabo de panela de madeira; agasalho de lã (prende o ar, que isola); o piso de cerâmica parece mais frio que o tapete porque **conduz** o calor do pé mais rápido, embora estejam à mesma temperatura.

## Convecção

- O calor é levado pelo **movimento do próprio fluido** (líquido ou gás).
- O fluido aquecido fica **menos denso** e **sobe**; o frio, mais denso, **desce** — formando **correntes de convecção**.
- Exemplos:
  - **Ar-condicionado** deve ficar no **alto** (o ar frio desce); **aquecedor** deve ficar **embaixo** (o ar quente sobe).
  - O **congelador** fica na parte de cima da geladeira.
  - **Brisas** marítima e terrestre, ventos e correntes oceânicas.
  - A água fervendo na panela.

## Irradiação (radiação)

- O calor se propaga por **ondas eletromagnéticas** (principalmente **infravermelho**).
- **Não precisa de meio material**: funciona no **vácuo** (é assim que o calor do **Sol** chega à Terra).
- Superfícies **escuras** absorvem mais radiação; **claras e espelhadas** refletem.
- Exemplos: estufa, forno, roupas claras no verão, carros escuros mais quentes.

## A garrafa térmica

Ela dificulta as três formas:

- **Vácuo** entre as paredes duplas: impede condução e convecção.
- Paredes **espelhadas**: refletem a radiação.
- Tampa isolante.

## Efeito estufa

A luz do Sol atravessa a atmosfera (ou o vidro), aquece o solo, que emite **infravermelho**; parte dele é retida pelos gases (ou pelo vidro), aquecendo o ambiente.

## Resumindo

Condução: por contato, nos sólidos (metais conduzem). Convecção: correntes no fluido (quente sobe). Irradiação: ondas eletromagnéticas, funciona no vácuo. A garrafa térmica bloqueia as três.`,
    [
      "Condução: por contato; metais conduzem, ar parado isola.",
      "Convecção: fluido quente sobe, frio desce.",
      "Irradiação: ondas eletromagnéticas, inclusive no vácuo.",
      "Ar-condicionado no alto; aquecedor embaixo.",
    ],
    [
      ["Condução térmica", "Transmissão de calor de partícula a partícula, por contato."],
      ["Convecção", "Transmissão de calor pelo movimento de fluidos."],
      ["Irradiação", "Transmissão de calor por ondas eletromagnéticas."],
    ],
    [
      ["O calor do Sol chega à Terra por:", ["condução", "convecção", "irradiação", "contato", "dilatação"], 2, "Atravessa o vácuo do espaço."],
      ["O ar-condicionado deve ser instalado no alto porque:", ["o ar frio sobe", "o ar frio é mais denso e desce, formando correntes de convecção", "conduz melhor no teto", "evita a irradiação", "é mais bonito"], 1, "Correntes de convecção."],
      ["O piso de cerâmica parece mais frio que o tapete porque:", ["está em temperatura menor", "conduz o calor do pé mais rapidamente", "irradia frio", "é escuro", "absorve luz"], 1, "Bom condutor."],
      ["Na garrafa térmica, o vácuo entre as paredes serve para evitar:", ["somente a irradiação", "condução e convecção", "a dilatação", "a evaporação apenas", "a reflexão"], 1, "Sem matéria, sem esses processos."],
      ["Roupas claras são recomendadas no verão porque:", ["absorvem mais radiação", "refletem mais radiação", "conduzem mais calor", "produzem convecção", "são isolantes elétricos"], 1, "Menos absorção de energia."],
    ],
    [["Explique por que a garrafa térmica mantém o café quente por muito tempo.", "Porque o vácuo entre as paredes duplas impede a condução e a convecção, as paredes espelhadas refletem a radiação térmica e a tampa isolante evita trocas de calor com o ar."]],
  ),
  aula(
    "Dilatação térmica",
    `## Corpos aquecidos aumentam de tamanho

Quando a **temperatura aumenta**, as partículas de um material vibram mais e se afastam: o corpo **dilata**. Ao esfriar, ele **contrai**.

## Tipos de dilatação

- **Linear** (comprimento): trilhos, fios, barras.
  **ΔL = L₀ · α · ΔT**
  (L₀ = comprimento inicial; α = coeficiente de dilatação linear; ΔT = variação de temperatura)
- **Superficial** (área): chapas. β = 2α.
- **Volumétrica** (volume): sólidos e líquidos. γ = 3α.

Cada material dilata de um jeito: **metais** dilatam mais que o vidro comum; o **alumínio** dilata mais que o **ferro**.

## Aplicações e cuidados

- **Juntas de dilatação** em pontes, calçadas e trilhos: pequenos espaços que permitem a expansão sem rachaduras.
- **Fios elétricos** ficam mais **curvados** (frouxos) no verão e mais esticados no inverno.
- **Lâmina bimetálica:** duas tiras de metais diferentes coladas; ao aquecer, uma dilata mais e a lâmina **curva**. Usada em **termostatos**, ferros de passar e pisca-piscas.
- Para soltar uma **tampa metálica** emperrada de um pote de vidro, coloca-se a tampa em **água quente**: o metal dilata mais que o vidro.
- Copo de vidro comum pode **trincar** com água fervente (dilatação desigual); o vidro **pirex** tem dilatação pequena.

## Exemplo

Um trilho de aço de 10 m (α = 1,2 · 10⁻⁵ °C⁻¹) passa de 20 °C para 40 °C.

ΔL = 10 · 1,2 · 10⁻⁵ · 20 = 2,4 · 10⁻³ m = **2,4 mm**.

## Dilatação dos líquidos e a anomalia da água

- Líquidos dilatam mais que os sólidos (por isso o tanque de combustível não deve ser cheio até a boca num dia quente).
- **Anomalia da água:** entre **0 °C e 4 °C**, a água **contrai** ao ser aquecida. Ela tem **densidade máxima a 4 °C**.
- Consequência: o **gelo é menos denso** e **flutua**; em lagos congelados, a água a 4 °C fica no fundo e a **vida aquática sobrevive** sob a camada de gelo.
- Garrafas cheias de água podem estourar no congelador (a água aumenta de volume ao congelar).

## Resumindo

Aquecer dilata, esfriar contrai. ΔL = L₀·α·ΔT. Juntas de dilatação evitam rachaduras; a lâmina bimetálica funciona em termostatos. A água tem densidade máxima a 4 °C e o gelo flutua.`,
    [
      "Aquecer dilata; esfriar contrai.",
      "Dilatação linear: ΔL = L₀ · α · ΔT.",
      "Juntas de dilatação e lâminas bimetálicas são aplicações.",
      "Anomalia da água: densidade máxima a 4 °C; gelo flutua.",
    ],
    [
      ["Coeficiente de dilatação", "Número que indica quanto um material dilata por grau."],
      ["Junta de dilatação", "Espaço deixado em estruturas para permitir a expansão."],
      ["Lâmina bimetálica", "Duas tiras de metais diferentes que se curvam ao aquecer."],
    ],
    [
      ["As juntas de dilatação em pontes servem para:", ["decorar", "permitir a expansão do material sem rachaduras", "aumentar o peso", "escoar a água da chuva", "conduzir eletricidade"], 1, "Evitam tensões."],
      ["Para soltar uma tampa metálica de um pote de vidro, aquece-se a tampa porque:", ["o vidro dilata mais", "o metal dilata mais que o vidro", "o metal contrai", "a água dissolve a cola", "o vidro derrete"], 1, "Coeficientes diferentes."],
      ["Uma barra de 2 m (α = 2 · 10⁻⁵ °C⁻¹) aquecida em 50 °C dilata:", ["2 mm", "0,2 mm", "20 mm", "1 mm", "4 mm"], 0, "2 · 2·10⁻⁵ · 50 = 2·10⁻³ m."],
      ["Lagos congelados mantêm vida no fundo porque:", ["o gelo afunda", "a água tem densidade máxima a 4 °C e o gelo flutua, isolando", "a água ferve no fundo", "os peixes produzem calor", "o fundo é seco"], 1, "Anomalia da água."],
      ["A lâmina bimetálica é usada em:", ["lâmpadas LED", "termostatos", "baterias", "ímãs", "lentes"], 1, "Liga/desliga com a temperatura."],
    ],
    [["Explique a anomalia da água e uma consequência dela para a natureza.", "Entre 0 °C e 4 °C a água se contrai ao ser aquecida, tendo densidade máxima a 4 °C; por isso o gelo é menos denso e flutua, formando uma camada isolante nos lagos e permitindo que a vida aquática sobreviva no fundo."]],
  ),
  aula(
    "Eletrostática: cargas, raios e para-raios",
    `## Carga elétrica

A matéria é formada por átomos com **prótons** (carga positiva), **elétrons** (carga negativa) e nêutrons (sem carga). Um corpo está:

- **Neutro:** número de prótons = número de elétrons.
- **Positivo:** **perdeu** elétrons.
- **Negativo:** **ganhou** elétrons.

Só os **elétrons** se movem entre os corpos. **Cargas iguais se repelem; cargas opostas se atraem.**

## Processos de eletrização

- **Atrito:** dois materiais diferentes esfregados trocam elétrons e ficam com cargas **opostas** (pente no cabelo, balão na roupa).
- **Contato:** um corpo carregado toca outro e divide a carga; ficam com cargas de **mesmo sinal**.
- **Indução:** um corpo carregado se aproxima de um condutor neutro e **separa** suas cargas, sem tocar. Por isso um pente eletrizado **atrai papeizinhos** neutros.

## Condutores e isolantes

- **Condutores:** elétrons se movem facilmente (metais, corpo humano, água com sais).
- **Isolantes:** dificultam o movimento (borracha, plástico, vidro, madeira seca).

## Lei de Coulomb

A força entre duas cargas é **proporcional ao produto das cargas** e **inversamente proporcional ao quadrado da distância**:

F = k · |Q₁ · Q₂| / d²

Se a distância **dobra**, a força cai para **1/4**.

## Raios

- Nas nuvens de tempestade, o atrito entre gotas, gelo e ar **separa cargas**. Quando a diferença de potencial fica enorme, o ar se torna condutor e ocorre uma **descarga elétrica**: o raio.
- O **trovão** é o som da expansão rápida do ar aquecido; vemos o **relâmpago antes** porque a luz é muito mais rápida que o som.
- O Brasil é um dos países com **mais raios** no mundo.

## Proteção

- **Para-raios** (Franklin): haste pontiaguda no alto, ligada à terra por um cabo; oferece um **caminho seguro** para a descarga. Funciona pelo **poder das pontas** (cargas se concentram nas pontas).
- **Gaiola de Faraday:** dentro de um condutor fechado, o campo elétrico é nulo. Por isso ficar **dentro de um carro** ou avião é seguro em tempestades.
- Evite árvores isoladas, campos abertos, água e objetos metálicos durante tempestades.

## Resumindo

Cargas iguais se repelem e opostas se atraem; só elétrons se movem. Eletrização por atrito, contato e indução. F = k·Q₁Q₂/d². Raios são descargas; para-raios e gaiola de Faraday protegem.`,
    [
      "Cargas iguais se repelem; opostas se atraem.",
      "Atrito: cargas opostas; contato: mesmo sinal; indução: sem tocar.",
      "Coulomb: força cai com o quadrado da distância.",
      "Para-raios e gaiola de Faraday (carro) protegem de raios.",
    ],
    [
      ["Eletrização", "Processo de tornar um corpo carregado eletricamente."],
      ["Indução", "Separação de cargas num condutor pela aproximação de um corpo carregado."],
      ["Gaiola de Faraday", "Condutor fechado em cujo interior o campo elétrico é nulo."],
    ],
    [
      ["Um corpo fica carregado positivamente quando:", ["ganha prótons", "perde elétrons", "ganha elétrons", "perde nêutrons", "ganha nêutrons"], 1, "Só elétrons se transferem."],
      ["Na eletrização por atrito, os dois corpos ficam com cargas:", ["iguais", "opostas", "neutras", "sempre positivas", "sempre negativas"], 1, "Um ganha e outro perde elétrons."],
      ["Se a distância entre duas cargas triplica, a força entre elas fica:", ["3 vezes maior", "3 vezes menor", "9 vezes menor", "9 vezes maior", "igual"], 2, "1/d² → 1/9."],
      ["Ficar dentro de um carro durante uma tempestade é seguro por causa:", ["dos pneus de borracha apenas", "do efeito gaiola de Faraday", "do vidro", "do motor", "da cor do carro"], 1, "Carcaça metálica."],
      ["Vemos o relâmpago antes de ouvir o trovão porque:", ["o som é mais rápido", "a luz é muito mais rápida que o som", "o trovão acontece depois", "os olhos são mais sensíveis", "o ar bloqueia a luz"], 1, "Diferença de velocidades."],
    ],
    [["Explique como funciona o para-raios.", "Ele é uma haste pontiaguda no alto da construção, ligada à terra por um cabo condutor; pelo poder das pontas, atrai a descarga e oferece um caminho seguro para a corrente ir para o solo, protegendo a construção."]],
  ),
  aula(
    "Espectro eletromagnético: do rádio aos raios gama",
    `## Ondas eletromagnéticas

São ondas formadas por campos **elétricos e magnéticos** que se propagam **sem precisar de meio material** (também no vácuo), sempre à velocidade da luz: **c ≈ 300.000 km/s**.

Elas diferem pela **frequência** (f) e pelo **comprimento de onda** (λ): **c = λ · f**.

- Maior frequência → **menor comprimento de onda** → **mais energia**.

## O espectro (da menor para a maior frequência)

1. **Ondas de rádio:** rádio AM/FM, TV, comunicação.
2. **Micro-ondas:** forno de micro-ondas (agita as moléculas de **água** dos alimentos), Wi-Fi, celulares, radar, satélites.
3. **Infravermelho:** **calor**, controles remotos, câmeras térmicas, visão noturna.
4. **Luz visível:** a única que nossos olhos enxergam — do **vermelho** (menor frequência) ao **violeta** (maior): vermelho, laranja, amarelo, verde, azul, anil, violeta.
5. **Ultravioleta (UV):** bronzeamento, **queimaduras** e **câncer de pele**; esteriliza materiais; a **camada de ozônio** filtra parte dele. Por isso usamos **protetor solar**.
6. **Raios X:** atravessam tecidos moles, mas não ossos — radiografias. Exposição excessiva é perigosa (por isso o avental de **chumbo**).
7. **Raios gama:** os mais energéticos; vêm de reações nucleares; usados na **radioterapia** contra o câncer e na esterilização de alimentos.

## Radiação ionizante x não ionizante

- **Ionizante** (UV de alta energia, raios X, gama): tem energia para arrancar elétrons e **danificar o DNA**.
- **Não ionizante** (rádio, micro-ondas, infravermelho, luz visível): não tem essa energia. Celulares e Wi-Fi usam radiação **não ionizante**.

## Cores dos objetos

Um objeto **vermelho** reflete a luz vermelha e absorve as outras. Um objeto **branco** reflete todas; um **preto** absorve todas (e por isso esquenta mais).

## Resumindo

Ondas eletromagnéticas viajam à velocidade da luz e não precisam de meio. Do rádio ao gama, a frequência e a energia aumentam. UV, raios X e gama são ionizantes e podem danificar o DNA.`,
    [
      "Ondas eletromagnéticas viajam no vácuo a 300.000 km/s.",
      "Maior frequência = menor comprimento de onda = mais energia.",
      "Ordem: rádio, micro-ondas, infravermelho, visível, UV, raios X, gama.",
      "UV, raios X e gama são ionizantes: danificam o DNA.",
    ],
    [
      ["Espectro eletromagnético", "Conjunto de todas as ondas eletromagnéticas, ordenadas por frequência."],
      ["Radiação ionizante", "Radiação com energia suficiente para arrancar elétrons e danificar células."],
      ["Comprimento de onda", "Distância entre dois picos consecutivos da onda."],
    ],
    [
      ["O forno de micro-ondas aquece os alimentos porque:", ["usa raios X", "agita as moléculas de água com micro-ondas", "usa luz ultravioleta", "conduz calor pelas paredes", "usa raios gama"], 1, "Ressonância com a água."],
      ["A radiação que causa queimaduras solares e câncer de pele é:", ["infravermelho", "ultravioleta", "rádio", "micro-ondas", "luz vermelha"], 1, "É a radiação ultravioleta."],
      ["Entre as ondas abaixo, a de maior energia é:", ["rádio", "luz visível", "raios gama", "infravermelho", "micro-ondas"], 2, "Maior frequência."],
      ["As radiografias usam:", ["raios X", "ondas de rádio", "infravermelho", "micro-ondas", "luz visível"], 0, "Atravessam tecidos moles."],
      ["As ondas usadas por celulares e Wi-Fi são:", ["ionizantes", "não ionizantes", "radioativas", "sonoras", "mecânicas"], 1, "Baixa energia."],
    ],
    [["Qual a diferença entre radiação ionizante e não ionizante? Dê exemplos.", "A ionizante tem energia suficiente para arrancar elétrons e danificar o DNA, como raios X, gama e parte do ultravioleta; a não ionizante não tem essa energia, como ondas de rádio, micro-ondas, infravermelho e luz visível."]],
  ),
  aula(
    "Refração e reflexão total: arco-íris e fibra óptica",
    `## Refração

**Refração** é a mudança de **velocidade** da luz ao passar de um meio para outro (do ar para a água, por exemplo). Quando a luz chega **inclinada**, ela também **muda de direção**.

- **Índice de refração (n):** n = c / v (quanto maior, mais lenta a luz no meio).
- Ar ≈ 1; água ≈ 1,33; vidro ≈ 1,5; diamante ≈ 2,4.
- Ao entrar num meio **mais refringente** (maior n), o raio se **aproxima da normal** (linha perpendicular à superfície).

## Efeitos da refração no dia a dia

- Um lápis dentro de um copo d'água parece **quebrado**.
- Uma piscina parece **mais rasa** do que é; um peixe parece estar mais alto.
- **Miragens** no asfalto quente: camadas de ar com temperaturas diferentes desviam a luz do céu.
- O Sol ainda é visto um pouco depois de já estar abaixo do horizonte.
- **Lentes** de óculos, câmeras e lupas funcionam por refração.

## Dispersão: o arco-íris

- A luz branca é formada por **várias cores**. Cada cor tem índice de refração um pouco diferente e se desvia de forma diferente.
- No **prisma** (experimento de **Newton**) e nas **gotas de chuva**, a luz branca se **separa** nas cores do arco-íris.
- Para ver o arco-íris, o **Sol deve estar atrás** do observador e as gotas à frente.
- O **violeta** se desvia mais; o **vermelho**, menos.

## Reflexão total

- Quando a luz vai de um meio **mais refringente para um menos refringente** (da água para o ar, do vidro para o ar) com ângulo **maior que o ângulo limite**, ela **não sai**: é **totalmente refletida**.
- **Fibra óptica:** fio fino de vidro em que a luz se reflete totalmente muitas vezes, viajando por longas distâncias com pouca perda. Usada na **internet de alta velocidade**, telefonia e na medicina (**endoscopia**).
- O **brilho do diamante** vem de muitas reflexões totais internas (índice de refração alto).

## Resumindo

Refração é a mudança de velocidade e direção da luz entre meios (lápis "quebrado", piscina rasa). A dispersão separa as cores (arco-íris). A reflexão total prende a luz na fibra óptica.`,
    [
      "Refração: a luz muda de velocidade e direção entre meios.",
      "Piscina parece mais rasa; lápis parece quebrado na água.",
      "Dispersão separa as cores: prisma e arco-íris.",
      "Reflexão total: princípio da fibra óptica.",
    ],
    [
      ["Índice de refração", "Razão entre a velocidade da luz no vácuo e no meio (n = c/v)."],
      ["Dispersão", "Separação da luz branca em cores por refração."],
      ["Reflexão total", "Reflexão completa da luz ao tentar passar para um meio menos refringente com ângulo grande."],
    ],
    [
      ["A piscina parece mais rasa do que realmente é por causa da:", ["reflexão", "refração", "difração", "polarização", "absorção"], 1, "Desvio da luz na interface água-ar."],
      ["O arco-íris é formado pela:", ["reflexão total apenas", "dispersão da luz nas gotas de chuva", "absorção da luz", "difração no ar seco", "emissão das nuvens"], 1, "Separação das cores."],
      ["A fibra óptica funciona com base na:", ["refração simples", "reflexão total", "dispersão", "absorção", "difração"], 1, "Luz presa no vidro."],
      ["Se o índice de refração de um meio é 1,5, a velocidade da luz nele é:", ["450.000 km/s", "200.000 km/s", "150.000 km/s", "300.000 km/s", "100.000 km/s"], 1, "300.000 ÷ 1,5."],
      ["Para ver um arco-íris, o Sol deve estar:", ["à frente do observador", "atrás do observador", "acima, ao meio-dia", "abaixo do horizonte", "em qualquer posição"], 1, "Luz refletida nas gotas à frente."],
    ],
    [["Explique como funciona a fibra óptica.", "A luz entra num fio fino de vidro e, ao atingir a parede com ângulo maior que o ângulo limite, sofre reflexão total; assim ela se reflete muitas vezes e percorre longas distâncias com pouca perda, transmitindo dados."]],
  ),
  aula(
    "Conservação da energia mecânica",
    `## Energia mecânica

**Energia mecânica = energia cinética + energia potencial.**

- **Cinética** (movimento): **Ec = m · v² / 2**.
- **Potencial gravitacional** (altura): **Ep = m · g · h**.
- **Potencial elástica** (molas, elásticos): **Ee = k · x² / 2**.

## O princípio da conservação

Em um sistema **sem atrito** e sem resistência do ar, a energia mecânica **se conserva**: ela apenas **se transforma** de um tipo em outro.

**Em = Ec + Ep = constante**

## Exemplos

- **Montanha-russa:** no alto, muita energia potencial e pouca cinética; ao descer, a potencial vira cinética e o carrinho acelera.
- **Pêndulo:** nos extremos, velocidade zero (só potencial); no ponto mais baixo, velocidade máxima (só cinética).
- **Salto com vara:** a cinética da corrida vira elástica (vara curvada) e depois potencial (altura).
- **Cama elástica e estilingue:** potencial elástica vira cinética.

## Calculando a velocidade

Um corpo cai de uma altura **h**, a partir do repouso. Pela conservação: m·g·h = m·v²/2 → **v = √(2·g·h)**.

**Exemplo:** queda de 5 m (g = 10 m/s²): v = √(2 · 10 · 5) = √100 = **10 m/s**.

Note que a **massa não importa**: corpos de massas diferentes chegam com a mesma velocidade (sem resistência do ar).

## Com atrito

Na prática, há **atrito** e **resistência do ar**: parte da energia mecânica se transforma em **calor** e **som** (energia dissipada). A energia **total** continua conservada, mas a **mecânica** diminui. Por isso a montanha-russa precisa que a primeira subida seja a mais alta, e o pêndulo para com o tempo.

## Usinas hidrelétricas

A água represada tem **energia potencial**; ao cair, ela vira **cinética**, que gira as turbinas e se transforma em **energia elétrica** no gerador.

## Resumindo

Energia mecânica = cinética + potencial. Sem atrito, ela se conserva e só muda de forma. v = √(2gh) numa queda. Com atrito, parte vira calor, mas a energia total se conserva.`,
    [
      "Energia mecânica = cinética (mv²/2) + potencial (mgh).",
      "Sem atrito, a energia mecânica se conserva.",
      "Queda livre: v = √(2gh), independe da massa.",
      "Com atrito, parte da energia vira calor e som.",
    ],
    [
      ["Energia cinética", "Energia associada ao movimento."],
      ["Energia potencial gravitacional", "Energia associada à altura de um corpo."],
      ["Energia dissipada", "Parte da energia transformada em calor e som pelo atrito."],
    ],
    [
      ["Um objeto cai de 20 m de altura (g = 10 m/s²), sem resistência do ar. Ele chega ao chão com velocidade de:", ["10 m/s", "20 m/s", "200 m/s", "40 m/s", "14 m/s"], 1, "√(2·10·20) = √400."],
      ["No ponto mais baixo da trajetória de um pêndulo, a energia é:", ["totalmente potencial", "totalmente cinética", "nula", "elástica", "térmica apenas"], 1, "Velocidade máxima."],
      ["Uma bola de 2 kg a 10 m de altura (g = 10 m/s²) tem energia potencial de:", ["20 J", "100 J", "200 J", "2.000 J", "50 J"], 2, "2 · 10 · 10."],
      ["Em uma hidrelétrica, a sequência de transformações é:", ["elétrica → potencial → cinética", "potencial → cinética → elétrica", "química → elétrica", "térmica → potencial", "nuclear → elétrica"], 1, "Água que cai gira turbinas."],
      ["Na presença de atrito, a energia mecânica:", ["aumenta", "diminui, transformando-se em calor e som", "se conserva sempre", "vira massa", "desaparece sem deixar nada"], 1, "Energia dissipada."],
    ],
    [["Explique as transformações de energia em uma montanha-russa.", "No ponto mais alto o carrinho tem muita energia potencial; ao descer, ela se transforma em energia cinética e ele acelera; ao subir de novo, a cinética volta a ser potencial. Com atrito, parte vira calor e som."]],
  ),
  aula(
    "Máquinas simples: alavancas, polias e torque",
    `## Fazer menos força

**Máquinas simples** ajudam a realizar tarefas com **menos força**, trocando força por **distância** (o trabalho total não diminui).

## Torque (momento de uma força)

O efeito de **girar** de uma força depende da sua intensidade e da **distância ao ponto de apoio** (braço):

**Torque = F · d**

Por isso a **maçaneta** fica longe das dobradiças e é mais fácil soltar um parafuso com uma **chave de cabo longo**.

## Alavancas

Uma barra rígida que gira em torno de um **ponto de apoio** (fulcro). Equilíbrio: **F_potente · d_potente = F_resistente · d_resistente**.

- **Interfixa** (apoio no meio): **gangorra**, tesoura, alicate, pé de cabra.
- **Inter-resistente** (resistência no meio): **carrinho de mão**, quebra-nozes, abridor de garrafas.
- **Interpotente** (força no meio): **pinça**, vara de pescar, o **antebraço** humano (o bíceps faz força entre o cotovelo e a mão).

**Exemplo:** numa gangorra, uma criança de 30 kg a 2 m do apoio equilibra outra de 40 kg a **1,5 m** (30 · 2 = 40 · 1,5).

## Polias (roldanas)

- **Polia fixa:** **não** reduz a força, só **muda a direção** (puxar para baixo para levantar algo).
- **Polia móvel:** reduz a força pela **metade**.
- **Associação (talha):** com n polias móveis, a força fica dividida por **2ⁿ**.

## Plano inclinado

Subir um peso por uma **rampa** exige menos força do que levantá-lo verticalmente, mas a distância percorrida é maior. Ex.: rampas de acessibilidade, estradas em zigue-zague nas serras.

## Outras máquinas simples

- **Cunha:** machado, faca (divide forças).
- **Parafuso:** um plano inclinado enrolado.
- **Roda e eixo:** volante, manivela.
- **Engrenagens** e **bicicleta:** coroas e catracas trocam força por velocidade. Coroa grande na frente e catraca pequena atrás: **mais velocidade, mais esforço**; o contrário facilita as subidas.

## Resumindo

Torque = força × distância ao apoio. Alavancas equilibram F·d dos dois lados. Polia fixa muda a direção; a móvel divide a força por 2. Máquinas simples trocam força por distância.`,
    [
      "Torque = força × distância ao ponto de apoio.",
      "Alavanca em equilíbrio: F₁ · d₁ = F₂ · d₂.",
      "Polia fixa muda a direção; polia móvel divide a força por 2.",
      "Máquinas simples trocam força por distância.",
    ],
    [
      ["Torque", "Efeito de rotação de uma força: F × d."],
      ["Fulcro", "Ponto de apoio de uma alavanca."],
      ["Polia móvel", "Roldana que se move com a carga e reduz a força à metade."],
    ],
    [
      ["Numa gangorra, uma pessoa de 60 kg a 1 m do apoio equilibra outra de 30 kg a:", ["0,5 m", "1 m", "2 m", "3 m", "1,5 m"], 2, "60 · 1 = 30 · 2."],
      ["É mais fácil abrir uma porta empurrando longe das dobradiças porque:", ["a força é maior", "o braço de alavanca maior aumenta o torque", "a porta fica mais leve", "o atrito diminui", "a madeira dilata"], 1, "Torque = F · d."],
      ["Uma polia fixa serve para:", ["dividir a força por 2", "mudar a direção da força", "multiplicar a força por 4", "eliminar o peso", "aumentar o peso"], 1, "Não reduz a força."],
      ["Com 2 polias móveis, para erguer 800 N é preciso uma força de:", ["400 N", "200 N", "100 N", "800 N", "1.600 N"], 1, "800 ÷ 2² = 200."],
      ["O carrinho de mão é uma alavanca:", ["interfixa", "inter-resistente", "interpotente", "sem apoio", "elástica"], 1, "Carga entre a roda e as mãos."],
    ],
    [["Explique por que uma chave de cabo longo facilita soltar um parafuso apertado.", "Porque o torque é o produto da força pela distância ao eixo; com um cabo mais longo, a mesma força aplicada a uma distância maior produz um torque maior, facilitando o giro."]],
  ),
  aula(
    "Geradores, transformadores e transmissão de energia",
    `## Da usina até a tomada

A energia elétrica é **gerada** nas usinas, **transmitida** por longas distâncias e **distribuída** às casas. Entender esse caminho cai muito no ENEM.

## Geração: indução eletromagnética

- Descoberta por **Faraday**: quando um **ímã se move** perto de uma bobina (ou a bobina gira num campo magnético), surge **corrente elétrica** — a corrente **induzida**.
- Os **geradores** de quase todas as usinas funcionam assim: algo gira a **turbina**, que gira o gerador.
  - **Hidrelétrica:** água em queda.
  - **Termelétrica e nuclear:** vapor de água aquecido (queima de combustível ou fissão nuclear).
  - **Eólica:** vento.
- Exceção: a **energia solar fotovoltaica** transforma luz diretamente em eletricidade (sem turbina).
- O **dínamo da bicicleta** é um pequeno gerador.

## Corrente alternada (CA) e contínua (CC)

- **Alternada:** muda de sentido muitas vezes por segundo (no Brasil, **60 Hz**). É a das tomadas.
- **Contínua:** sentido constante. É a das **pilhas e baterias** (celulares usam carregadores que convertem CA em CC).

## Transformadores

- Mudam a **tensão** (voltagem) da corrente **alternada**, usando duas bobinas enroladas num núcleo de ferro.
- **Elevador:** aumenta a tensão (mais espiras na saída).
- **Abaixador:** diminui (mais espiras na entrada).
- Relação: **U₁ / U₂ = N₁ / N₂** (N = número de espiras).
- Só funcionam com **corrente alternada** (precisam de variação do campo magnético).

## Por que transmitir em alta tensão?

- A **perda de energia** nos fios (por **efeito Joule**, aquecimento) depende da **corrente**: P_perdida = R · i².
- Para transmitir a mesma potência (P = U · i), aumentar muito a **tensão** permite usar **corrente menor**, reduzindo as perdas.
- Por isso as linhas de transmissão usam **centenas de milhares de volts**; perto das cidades, **subestações** e transformadores nos postes **abaixam** a tensão para 127 V ou 220 V.

## Sistema Interligado Nacional

O Brasil tem um sistema que **interliga** usinas e regiões, permitindo levar energia de onde sobra para onde falta (o **apagão de 2001** mostrou os riscos da falta de investimento e da dependência das chuvas).

## Resumindo

Geradores usam indução eletromagnética (ímã e bobina girando). Transformadores mudam a tensão da corrente alternada (U₁/U₂ = N₁/N₂). Transmite-se em alta tensão para reduzir a corrente e as perdas por efeito Joule.`,
    [
      "Geradores funcionam por indução eletromagnética (Faraday).",
      "Tomadas: corrente alternada (60 Hz); pilhas: contínua.",
      "Transformador: U₁/U₂ = N₁/N₂; só com corrente alternada.",
      "Alta tensão reduz a corrente e as perdas nos fios.",
    ],
    [
      ["Indução eletromagnética", "Geração de corrente pela variação do campo magnético numa bobina."],
      ["Transformador", "Aparelho que eleva ou reduz a tensão da corrente alternada."],
      ["Efeito Joule", "Aquecimento de um condutor pela passagem de corrente."],
    ],
    [
      ["Os geradores das usinas funcionam pelo princípio:", ["do efeito fotoelétrico", "da indução eletromagnética", "da reflexão total", "da dilatação", "da fissão apenas"], 1, "Faraday."],
      ["A energia é transmitida em alta tensão para:", ["aumentar a corrente", "reduzir a corrente e as perdas por aquecimento", "deixar os fios mais leves", "aumentar o consumo", "mudar a frequência"], 1, "Perdas dependem de i²."],
      ["Um transformador com 1.000 espiras na entrada e 100 na saída, ligado a 2.200 V, fornece:", ["22.000 V", "220 V", "110 V", "2.200 V", "22 V"], 1, "Razão 10:1."],
      ["Transformadores não funcionam com pilhas porque:", ["a pilha é fraca", "precisam de corrente alternada para variar o campo magnético", "a pilha é alternada", "não têm fios", "a pilha tem tensão alta"], 1, "Corrente contínua não induz."],
      ["A fonte que gera eletricidade sem usar turbina é:", ["hidrelétrica", "termelétrica", "solar fotovoltaica", "eólica", "nuclear"], 2, "Efeito fotovoltaico."],
    ],
    [["Por que as linhas de transmissão usam tensões tão altas?", "Porque, para transmitir a mesma potência, uma tensão maior permite uma corrente menor; como as perdas por aquecimento nos fios dependem do quadrado da corrente, a energia perdida no caminho diminui muito."]],
  ),
  aula(
    "Pressão atmosférica e o dia a dia",
    `## O peso do ar

O ar tem massa e exerce **pressão** sobre tudo: a **pressão atmosférica**. Ao nível do mar, ela vale cerca de **1 atm ≈ 100.000 Pa** (equivale a uma coluna de **10 m de água** ou **76 cm de mercúrio**).

## O experimento de Torricelli

**Torricelli** encheu um tubo com **mercúrio** e o virou numa bacia: o mercúrio desceu até ficar com **76 cm** de altura. A pressão do ar sobre a bacia sustentava a coluna. Assim criou o **barômetro**.

## Altitude e pressão

- Quanto **maior a altitude**, **menor a pressão** (há menos ar acima).
- Em **La Paz** ou no alto de montanhas:
  - A água **ferve abaixo de 100 °C** (cerca de 87 °C), e os alimentos demoram mais para cozinhar.
  - O ar é **rarefeito** (menos oxigênio por respiração) — atletas sentem cansaço e falta de ar.
- Em aviões, a cabine é **pressurizada**; os ouvidos "entopem" na subida e na descida pela diferença de pressão.

## Panela de pressão

- Mantém o vapor preso, **aumentando a pressão** interna.
- Com mais pressão, a água ferve a **temperatura maior** (cerca de 120 °C), e os alimentos cozinham **mais rápido**.
- A válvula de segurança libera o excesso de pressão.

## Aplicações do dia a dia

- **Canudinho:** ao sugar, reduzimos a pressão dentro da boca; a pressão atmosférica empurra o líquido para cima.
- **Ventosa:** ao pressioná-la, expulsamos o ar; a pressão externa a mantém presa.
- **Seringa** e **conta-gotas**.
- **Respiração:** o diafragma aumenta o volume dos pulmões, a pressão interna diminui e o ar entra.
- **Previsão do tempo:** **baixa pressão** costuma indicar **nuvens e chuva**; **alta pressão**, tempo **estável** e seco.

## Pressão em geral

**Pressão = Força ÷ Área.** A mesma força em área **menor** gera **mais pressão**: por isso a faca afiada corta melhor, o salto fino afunda na grama e o esqui não afunda na neve.

## Resumindo

O ar exerce pressão (1 atm ≈ 76 cmHg ≈ 10 m de água). Mais altitude, menos pressão e água fervendo abaixo de 100 °C. A panela de pressão aumenta a pressão e a temperatura de ebulição. Pressão = força ÷ área.`,
    [
      "Pressão atmosférica ao nível do mar: 1 atm ≈ 76 cmHg.",
      "Mais altitude, menos pressão e água ferve abaixo de 100 °C.",
      "Panela de pressão: mais pressão, ebulição a ~120 °C.",
      "Pressão = força ÷ área: área menor, pressão maior.",
    ],
    [
      ["Pressão atmosférica", "Pressão exercida pelo peso do ar sobre as superfícies."],
      ["Barômetro", "Instrumento que mede a pressão atmosférica."],
      ["Ar rarefeito", "Ar com menor densidade e menos oxigênio, comum em grandes altitudes."],
    ],
    [
      ["Em cidades de grande altitude, a água ferve:", ["acima de 100 °C", "abaixo de 100 °C", "exatamente a 100 °C", "não ferve", "a 0 °C"], 1, "Menor pressão."],
      ["A panela de pressão cozinha mais rápido porque:", ["diminui a pressão interna", "aumenta a pressão e a temperatura de ebulição da água", "usa menos água", "isola o calor", "resfria o alimento"], 1, "Ebulição a cerca de 120 °C."],
      ["Ao tomar suco com canudinho, o líquido sobe porque:", ["a boca puxa o líquido", "a pressão atmosférica empurra o líquido quando a pressão na boca diminui", "o canudo é magnético", "o líquido evapora", "a gravidade inverte"], 1, "Diferença de pressão."],
      ["No experimento de Torricelli, ao nível do mar, a coluna de mercúrio mede cerca de:", ["10 cm", "76 cm", "1 m", "10 m", "100 cm"], 1, "760 mmHg."],
      ["Uma faca afiada corta melhor porque:", ["é mais pesada", "concentra a força numa área menor, aumentando a pressão", "tem mais atrito", "é feita de metal", "dilata"], 1, "P = F/A."],
    ],
    [["Explique por que é mais difícil cozinhar alimentos em cidades muito altas.", "Porque em grandes altitudes a pressão atmosférica é menor e a água ferve a uma temperatura abaixo de 100 °C; com a água menos quente, os alimentos demoram mais para cozinhar."]],
  ),
  aula(
    "Lei de Ohm, resistência e choque elétrico",
    `## Grandezas elétricas

- **Tensão (U)**, em **volts (V)**: a "força" que empurra as cargas (diferença de potencial).
- **Corrente (i)**, em **ampères (A)**: a quantidade de carga que passa por segundo.
- **Resistência (R)**, em **ohms (Ω)**: a dificuldade que o material oferece à passagem da corrente.

## Primeira Lei de Ohm

**U = R · i**

- Para a mesma tensão, **maior resistência → menor corrente**.
- Ex.: um chuveiro de 220 V com resistência de 11 Ω: i = 220 ÷ 11 = **20 A**.

## Segunda Lei de Ohm

A resistência de um fio depende do **material**, do **comprimento** e da **espessura**:

**R = ρ · L / A**

- Fio **mais longo** → mais resistência.
- Fio **mais grosso** → **menos** resistência.
- Por isso aparelhos de alta potência (chuveiros, fornos) precisam de **fios mais grossos**: fios finos esquentam e podem causar **incêndios**.

## Potência

**P = U · i = R · i² = U² / R**

- No **chuveiro**: na posição **"inverno"**, a resistência é **menor** (fio mais curto), a corrente e a potência **aumentam**, e a água sai mais quente.

## Choque elétrico

- Ocorre quando a corrente passa pelo **corpo**. O perigo depende principalmente da **corrente** e do caminho (passar pelo coração é o mais grave).
- Correntes de poucos **miliampères** já causam dor; acima de cerca de **100 mA** podem provocar parada cardíaca.
- A pele **molhada** tem **resistência muito menor**, então a corrente é maior: nunca mexa em aparelhos com mãos molhadas ou descalço em chão molhado.
- Um passarinho pousado num fio não leva choque porque seus pés estão no **mesmo potencial** (não há diferença de tensão).

## Proteções

- **Disjuntores e fusíveis:** desligam o circuito quando a corrente fica alta demais (sobrecarga ou curto-circuito).
- **DR (dispositivo diferencial residual):** desliga ao detectar **fuga de corrente** (choque).
- **Fio terra:** oferece caminho seguro para a corrente em caso de falha.
- Evitar **"benjamins"** (vários aparelhos na mesma tomada), que causam sobrecarga.

## Resumindo

U = R·i. Fio longo e fino tem mais resistência; aparelhos potentes exigem fios grossos. P = U·i. O chuveiro no inverno tem menor resistência. Pele molhada aumenta o risco de choque; disjuntor, DR e fio terra protegem.`,
    [
      "Lei de Ohm: U = R · i.",
      "Fio longo e fino: mais resistência; grosso: menos.",
      "Chuveiro no inverno: menor resistência, maior potência.",
      "Pele molhada reduz a resistência e aumenta o perigo de choque.",
    ],
    [
      ["Resistência elétrica", "Oposição de um material à passagem da corrente."],
      ["Disjuntor", "Dispositivo que desliga o circuito em caso de corrente excessiva."],
      ["Curto-circuito", "Ligação direta de baixa resistência que provoca corrente muito alta."],
    ],
    [
      ["Um aparelho de 20 Ω ligado em 120 V é percorrido por uma corrente de:", ["6 A", "2.400 A", "0,16 A", "140 A", "60 A"], 0, "120 ÷ 20."],
      ["Para um mesmo material, a resistência de um fio diminui quando ele é:", ["mais longo e fino", "mais curto e grosso", "mais longo e grosso", "mais fino", "mais quente"], 1, "R = ρL/A."],
      ["Na posição \"inverno\", o chuveiro esquenta mais porque:", ["a resistência aumenta", "a resistência diminui e a potência aumenta", "a tensão cai", "a corrente diminui", "a água passa mais rápido"], 1, "P = U²/R."],
      ["O choque é mais perigoso com a pele molhada porque:", ["a tensão aumenta", "a resistência do corpo diminui e a corrente aumenta", "a água isola", "a corrente diminui", "não há diferença"], 1, "U = R·i."],
      ["O dispositivo que desliga o circuito ao detectar fuga de corrente (choque) é o:", ["transformador", "DR", "benjamim", "resistor", "capacitor"], 1, "Diferencial residual."],
    ],
    [["Por que chuveiros elétricos precisam ser ligados com fios mais grossos?", "Porque têm alta potência e consomem corrente elevada; fios finos têm maior resistência e, com corrente alta, esquentam muito pelo efeito Joule, podendo derreter o isolamento e causar incêndios."]],
  ),
];
