import { aula } from "./build";

/** Matemática, lote 5: gráficos, funções, geometria espacial, contagem e matemática do cotidiano. */
export const MATEMATICA_5 = [
  aula(
    "Taxa de variação em gráficos e tabelas",
    `## O que é taxa de variação

A **taxa de variação** mede **quanto uma grandeza muda** em relação a outra. A mais comum é em relação ao **tempo**.

**Taxa média de variação = (valor final − valor inicial) ÷ (tempo final − tempo inicial)**

## Exemplos

- Uma cidade tinha 50.000 habitantes em 2010 e 62.000 em 2020. Taxa = (62.000 − 50.000) ÷ 10 = **1.200 habitantes por ano**.
- Um carro estava no km 40 às 8h e no km 160 às 10h: (160 − 40) ÷ 2 = **60 km/h** (velocidade média).

## Variação absoluta x variação percentual

- **Absoluta:** a diferença simples (de 200 para 260: aumento de **60**).
- **Percentual:** a diferença dividida pelo valor **inicial** × 100: 60 ÷ 200 = **30%**.
- Cuidado: um aumento de 10 para 20 é de **100%**; de 100 para 110 é só de **10%**, embora ambos aumentem 10 unidades.

## Lendo gráficos de linha

- **Inclinação** (quanto a linha "sobe" ou "desce") indica a **rapidez** da mudança.
- Linha **mais íngreme** → variação **maior** naquele intervalo.
- Linha **horizontal** → **sem variação** (constante).
- Linha descendo → **diminuição**.

Perguntas típicas: "Em qual período houve **maior crescimento**?" → procure o trecho mais inclinado (ou calcule a variação de cada intervalo).

## Atenção à escala

- Eixos que **não começam no zero** podem fazer variações pequenas parecerem enormes.
- Intervalos de tempo **diferentes** entre os pontos mudam a taxa: compare sempre **por unidade de tempo**.

## Taxa de variação e função afim

Numa **função afim** f(x) = ax + b, a taxa de variação é **constante** e igual ao **coeficiente a**. Por isso o gráfico é uma **reta**. Se a taxa muda, o gráfico é uma curva.

## Resumindo

Taxa média de variação = variação do valor ÷ variação do tempo. Variação percentual usa o valor inicial. No gráfico, o trecho mais inclinado tem a maior taxa. Na função afim, a taxa é constante (coeficiente a).`,
    [
      "Taxa média = (valor final − inicial) ÷ (tempo final − inicial).",
      "Variação percentual: diferença ÷ valor inicial × 100.",
      "Trecho mais inclinado do gráfico = maior variação.",
      "Na função afim, a taxa de variação é constante (a).",
    ],
    [
      ["Taxa de variação", "Quanto uma grandeza muda por unidade de outra, como por ano."],
      ["Variação percentual", "Mudança em relação ao valor inicial, expressa em porcentagem."],
      ["Inclinação", "Quanto a linha do gráfico sobe ou desce; indica a rapidez da variação."],
    ],
    [
      ["Uma empresa vendeu 400 unidades em 2021 e 700 em 2024. A taxa média de crescimento foi de:", ["100 por ano", "300 por ano", "75 por ano", "175 por ano", "233 por ano"], 0, "300 ÷ 3 anos."],
      ["Um preço passou de R$ 50 para R$ 65. O aumento percentual foi de:", ["15%", "30%", "23%", "65%", "13%"], 1, "15 ÷ 50 = 30%."],
      ["Num gráfico de linha, o período de maior crescimento corresponde ao trecho:", ["horizontal", "mais inclinado para cima", "descendente", "mais longo", "mais à direita sempre"], 1, "Maior inclinação."],
      ["Uma população passou de 20 para 40 mil e outra de 200 para 220 mil. Em termos percentuais:", ["a segunda cresceu mais", "a primeira cresceu 100% e a segunda 10%", "ambas cresceram 20 mil e igual", "nenhuma cresceu", "a segunda cresceu 100%"], 1, "Base inicial diferente."],
      ["Na função f(x) = 3x + 5, a taxa de variação é:", ["5", "3", "8", "15", "variável"], 1, "Coeficiente angular."],
    ],
    [["Explique por que um aumento de 10 unidades pode representar porcentagens muito diferentes.", "Porque a variação percentual depende do valor inicial: aumentar 10 sobre 10 é 100%, mas aumentar 10 sobre 100 é apenas 10%; a mesma diferença absoluta pesa mais quando a base é menor."]],
  ),
  aula(
    "Funções por partes: tarifas, táxi e impostos",
    `## Quando a regra muda conforme o valor

Muitas situações do dia a dia são descritas por funções **definidas por partes**: a regra de cálculo **muda** dependendo da faixa em que o valor está.

## Táxi e aplicativos

- **Bandeirada** (valor fixo) + valor por **km rodado**: P(x) = 5 + 2,5x.
- Isso já é uma função afim. Mas pode haver partes: "até 2 km, preço fixo de R$ 12; acima disso, R$ 12 + R$ 3 por km excedente".
  - P(x) = 12, se x ≤ 2
  - P(x) = 12 + 3(x − 2), se x > 2

## Contas de água e luz

- Muitas companhias cobram **tarifas por faixa** de consumo (quem consome mais paga mais por unidade):
  - Até 10 m³: valor mínimo fixo.
  - De 11 a 20 m³: R$ x por m³.
  - Acima de 20 m³: R$ y por m³ (mais caro).
- **Calcule faixa por faixa**: o consumo de cada faixa é cobrado pela tarifa daquela faixa.

**Exemplo:** água com tarifa mínima de R$ 30 até 10 m³; R$ 4 por m³ de 11 a 20; R$ 6 por m³ acima de 20. Consumo de 25 m³:

- Até 10: R$ 30.
- De 11 a 20 (10 m³): 10 · 4 = R$ 40.
- De 21 a 25 (5 m³): 5 · 6 = R$ 30.
- Total: **R$ 100**.

## Imposto de Renda progressivo

- A renda é dividida em **faixas**, com alíquotas crescentes (0%, 7,5%, 15%...).
- Cada faixa da renda paga a sua alíquota, e não toda a renda pela alíquota mais alta.
- Isso torna o imposto **progressivo**: quem ganha mais paga proporcionalmente mais.

## Estacionamento e planos de celular

- "R$ 10 pela primeira hora e R$ 4 por hora adicional ou fração."
- "Plano com 10 GB por R$ 50; cada GB extra custa R$ 8."
- Atenção a "**ou fração**": 2h10min conta como 3 horas.

## Gráfico

O gráfico de uma função por partes é formado por **pedaços** de retas (ou outras curvas), com mudança de inclinação nos pontos onde a regra muda.

## Comparar planos

Para saber quando um plano fica mais vantajoso, **iguale** as funções e encontre o ponto de equilíbrio.

## Resumindo

Funções por partes mudam a regra conforme a faixa. Em tarifas por faixa e no imposto progressivo, calcule cada faixa separadamente e some. Atenção a "por hora ou fração".`,
    [
      "A regra de cálculo muda conforme a faixa do valor.",
      "Tarifa por faixa: calcule cada faixa e some.",
      "Imposto progressivo: cada faixa paga sua alíquota.",
      "\"Ou fração\": arredonde para cima a unidade iniciada.",
    ],
    [
      ["Função por partes", "Função com regras diferentes em intervalos diferentes."],
      ["Bandeirada", "Valor fixo inicial cobrado pelo táxi."],
      ["Imposto progressivo", "Imposto cuja alíquota cresce com a faixa de renda."],
    ],
    [
      ["Um táxi cobra R$ 6 de bandeirada e R$ 3 por km. Uma corrida de 8 km custa:", ["R$ 24", "R$ 30", "R$ 27", "R$ 48", "R$ 36"], 1, "6 + 3·8."],
      ["Com a tarifa de água do exemplo da aula, um consumo de 15 m³ custa:", ["R$ 50", "R$ 60", "R$ 70", "R$ 90", "R$ 30"], 0, "30 + 5·4."],
      ["Um estacionamento cobra R$ 10 na 1ª hora e R$ 4 por hora adicional ou fração. Para 3h20min paga-se:", ["R$ 18", "R$ 22", "R$ 20", "R$ 14", "R$ 26"], 1, "1ª hora + 3 horas adicionais."],
      ["No imposto progressivo:", ["toda a renda paga a maior alíquota", "cada faixa da renda paga sua alíquota", "todos pagam o mesmo valor", "só os pobres pagam", "não há faixas"], 1, "Cálculo por faixas."],
      ["Plano A: R$ 40 fixo + R$ 2/GB; plano B: R$ 20 fixo + R$ 4/GB. Eles custam o mesmo com:", ["5 GB", "10 GB", "20 GB", "15 GB", "8 GB"], 1, "40 + 2x = 20 + 4x → x = 10."],
    ],
    [["Explique como calcular uma conta de água com tarifas por faixa de consumo.", "Divide-se o consumo nas faixas definidas pela companhia e multiplica-se a quantidade de cada faixa pela tarifa daquela faixa (somando o valor mínimo, se houver); depois somam-se os valores de todas as faixas."]],
  ),
  aula(
    "Área de superfície: prismas, cilindros e embalagens",
    `## Para que serve

A **área de superfície** (ou área total) indica quanto **material** é necessário para **revestir** ou **fabricar** um sólido: papel de presente, lata, caixa, tinta para pintar uma caixa d'água.

## Planificação

Uma boa estratégia é **planificar** o sólido (abri-lo no plano) e **somar as áreas** das faces.

## Paralelepípedo (caixa)

Dimensões a, b, c. Tem 6 faces retangulares, iguais duas a duas:

**A = 2(ab + ac + bc)**

**Exemplo:** caixa de 10 cm × 6 cm × 4 cm → A = 2(60 + 40 + 24) = 2 · 124 = **248 cm²**.

## Cubo

Aresta a: **A = 6a²**.

## Prisma qualquer

**A total = 2 · (área da base) + (área lateral)**. A área lateral é o perímetro da base × altura.

## Cilindro (lata)

Raio r e altura h. Planificado, é formado por **dois círculos** (tampa e fundo) e um **retângulo** (a lateral), cujo comprimento é o da circunferência (2πr):

- Área da base: πr² (são duas).
- Área lateral: **2πr · h**.
- **A total = 2πr² + 2πrh**.

**Exemplo:** lata com r = 4 cm e h = 10 cm (π ≈ 3):

- Bases: 2 · 3 · 16 = 96 cm².
- Lateral: 2 · 3 · 4 · 10 = 240 cm².
- Total: **336 cm²**.

## Área x volume em embalagens

- **Volume:** quanto **cabe** (capacidade).
- **Área:** quanto **material** se gasta.
- Problemas de **otimização**: para o mesmo volume, qual formato gasta menos material? Formas mais "compactas" (próximas do cubo ou de cilindros com altura igual ao diâmetro) usam menos material.

## Efeito da ampliação

Se todas as dimensões forem multiplicadas por **k**:

- A **área** fica multiplicada por **k²**.
- O **volume** fica multiplicado por **k³**.

Ex.: dobrar as medidas de uma caixa → 4 vezes mais papel e 8 vezes mais capacidade.

## Resumindo

Área total = soma das áreas das faces (planifique). Caixa: 2(ab + ac + bc). Cilindro: 2πr² + 2πrh. Área mede material; volume mede capacidade. Ampliar k vezes: área × k², volume × k³.`,
    [
      "Planifique e some as áreas das faces.",
      "Caixa: A = 2(ab + ac + bc); cubo: 6a².",
      "Cilindro: A = 2πr² + 2πrh.",
      "Ampliar k vezes: área × k² e volume × k³.",
    ],
    [
      ["Área de superfície", "Soma das áreas de todas as faces de um sólido."],
      ["Planificação", "Representação de um sólido aberto no plano."],
      ["Área lateral", "Área das faces laterais, sem as bases."],
    ],
    [
      ["A área total de um cubo de aresta 5 cm é:", ["25 cm²", "125 cm²", "150 cm²", "100 cm²", "30 cm²"], 2, "6 · 25."],
      ["A área total de uma caixa 5 × 4 × 2 cm é:", ["40 cm²", "76 cm²", "38 cm²", "80 cm²", "22 cm²"], 1, "2(20 + 10 + 8)."],
      ["A planificação da lateral de um cilindro é um:", ["triângulo", "retângulo", "círculo", "trapézio", "losango"], 1, "Comprimento 2πr."],
      ["A área lateral de um cilindro de raio 2 cm e altura 5 cm (π ≈ 3) é:", ["30 cm²", "60 cm²", "20 cm²", "120 cm²", "12 cm²"], 1, "2·3·2·5."],
      ["Ao dobrar todas as dimensões de uma caixa, a quantidade de papel para embrulhá-la fica:", ["2 vezes maior", "4 vezes maior", "8 vezes maior", "igual", "6 vezes maior"], 1, "Área × k²."],
    ],
    [["Qual a diferença entre calcular a área de superfície e o volume de uma embalagem?", "A área de superfície indica quanto material é necessário para fabricar ou revestir a embalagem; o volume indica quanto ela consegue armazenar por dentro."]],
  ),
  aula(
    "Pirâmides, cones e esferas: o volume com 1/3",
    `## Sólidos "pontudos"

**Pirâmides** e **cones** têm uma **base** e afinam até um **vértice**. Seu volume é **um terço** do volume do prisma ou cilindro de **mesma base e mesma altura**.

## Volume da pirâmide

**V = (área da base × altura) ÷ 3**

**Exemplo:** pirâmide de base quadrada com lado 6 m e altura 10 m:

- Área da base = 36 m².
- V = 36 · 10 ÷ 3 = **120 m³**.

## Volume do cone

**V = (π r² × h) ÷ 3**

**Exemplo:** casquinha com raio 3 cm e altura 10 cm (π ≈ 3):

- V = 3 · 9 · 10 ÷ 3 = **90 cm³**.

## Por que 1/3?

Experimentalmente: são necessários **três cones cheios** de água para encher um **cilindro** de mesma base e altura. O mesmo vale para pirâmide e prisma.

## Volume da esfera

**V = (4/3) π r³**

**Exemplo:** bola de raio 3 cm (π ≈ 3): V = (4/3) · 3 · 27 = **108 cm³**.

Área da superfície da esfera: **A = 4πr²**.

## Tronco (cone ou pirâmide cortada)

Copo, balde, abajur: é um cone cortado. Volume = volume do cone grande − volume do cone pequeno retirado.

## Semelhança em cones

Se um cone é preenchido até a **metade da altura**, o líquido forma um cone **semelhante** com razão 1/2, e seu volume é (1/2)³ = **1/8** do total. Por isso uma taça cônica "pela metade da altura" tem bem pouco líquido!

## Aplicações no ENEM

- Comparar embalagens (cone x cilindro).
- Calcular quanto sorvete cabe na casquinha.
- Pilhas de areia ou grãos (formam cones).
- Telhados em forma de pirâmide.
- Tanques esféricos de gás.

## Unidades

1 dm³ = **1 litro**; 1 m³ = 1.000 litros; 1 cm³ = 1 mL.

## Resumindo

Pirâmide e cone: V = (área da base × altura) ÷ 3. Esfera: V = (4/3)πr³. Cone cheio até a metade da altura tem só 1/8 do volume. 1 dm³ = 1 L.`,
    [
      "Pirâmide e cone: V = (área da base × h) ÷ 3.",
      "Três cones enchem um cilindro de mesma base e altura.",
      "Esfera: V = (4/3)πr³; área = 4πr².",
      "Cone cheio até metade da altura: 1/8 do volume.",
    ],
    [
      ["Pirâmide", "Sólido com base poligonal e faces triangulares que se encontram num vértice."],
      ["Cone", "Sólido com base circular que afina até um vértice."],
      ["Tronco de cone", "Parte que sobra de um cone cortado por um plano paralelo à base."],
    ],
    [
      ["Uma pirâmide com base de área 30 m² e altura 9 m tem volume:", ["270 m³", "90 m³", "135 m³", "30 m³", "39 m³"], 1, "30 · 9 ÷ 3."],
      ["Um cone de raio 2 cm e altura 6 cm (π ≈ 3) tem volume:", ["72 cm³", "24 cm³", "36 cm³", "12 cm³", "18 cm³"], 1, "3 · 4 · 6 ÷ 3."],
      ["Quantos cones são necessários para encher um cilindro de mesma base e altura?", ["2", "3", "4", "1", "6"], 1, "Volume do cone = 1/3."],
      ["Uma esfera de raio 2 cm (π ≈ 3) tem volume:", ["32 cm³", "16 cm³", "48 cm³", "24 cm³", "8 cm³"], 0, "(4/3) · 3 · 8."],
      ["Uma taça cônica cheia até a metade da altura contém que fração do volume total?", ["1/2", "1/4", "1/8", "1/3", "1/6"], 2, "(1/2)³."],
    ],
    [["Por que uma taça em forma de cone, cheia até a metade da altura, contém bem menos que metade do volume?", "Porque o líquido forma um cone semelhante ao da taça com razão 1/2; como o volume varia com o cubo da razão, ele tem (1/2)³ = 1/8 do volume total."]],
  ),
  aula(
    "Contagem: senhas, placas e anagramas",
    `## Princípio fundamental da contagem

Se uma escolha pode ser feita de **m** maneiras e outra de **n** maneiras, as duas juntas podem ser feitas de **m × n** maneiras.

## Senhas e códigos (com repetição)

- Senha de 4 dígitos (0 a 9), podendo repetir: 10 × 10 × 10 × 10 = **10.000**.
- Sem repetir dígitos: 10 × 9 × 8 × 7 = **5.040**.
- Senha com 2 letras (26) e 3 algarismos: 26 × 26 × 10 × 10 × 10 = **676.000**.

## Placas de carro (padrão Mercosul)

Formato **LLL NLNN** (3 letras, 1 número, 1 letra, 2 números):

26 × 26 × 26 × 10 × 26 × 10 × 10 = **26⁴ × 10³ = 456.976.000** combinações.

## Anagramas (permutações)

**Anagrama** é qualquer reordenação das letras de uma palavra.

- Letras **todas diferentes**: n! (fatorial).
  - AMOR: 4! = 4 × 3 × 2 × 1 = **24**.
- **Com letras repetidas**: divide-se pelo fatorial das repetições.
  - ARARA (5 letras; A aparece 3 vezes, R 2 vezes): 5! ÷ (3! · 2!) = 120 ÷ 12 = **10**.
  - BANANA: 6! ÷ (3! · 2!) = 720 ÷ 12 = **60**.

## Restrições

- "Anagramas de AMOR que **começam com A**": fixa o A e permuta o resto: 3! = **6**.
- "Que começam **e** terminam com vogal": escolha as posições restritas primeiro.
- "Com as letras M e O **juntas**": trate "MO" como um bloco (e lembre que ele pode ser "OM"): 3! × 2 = **12**.

## Filas e posições

- De quantas formas 5 pessoas podem formar uma fila? 5! = **120**.
- Se 2 delas precisam ficar juntas: 4! × 2! = **48**.

## Ordem importa ou não?

- **Importa** (senhas, filas, pódio, cargos diferentes): **arranjo/permutação** → multiplique.
- **Não importa** (comissões, grupos, apostas): **combinação** → divida pelas repetições da ordem: C(n, p) = n! ÷ [p!(n − p)!].
  - Escolher 3 de 5 pessoas para uma comissão: 10.

## Resumindo

Multiplique as possibilidades de cada etapa. Senhas com repetição: 10ⁿ. Anagramas: n!, dividindo pelas repetições. Blocos de letras juntas contam como uma só, vezes suas permutações internas.`,
    [
      "Princípio multiplicativo: m × n.",
      "Senha de 4 dígitos com repetição: 10⁴ = 10.000.",
      "Anagramas: n!; com repetição, divida pelos fatoriais.",
      "Letras juntas: trate como bloco e multiplique por suas ordens.",
    ],
    [
      ["Fatorial", "Produto de todos os inteiros positivos até n: 4! = 24."],
      ["Anagrama", "Reordenação das letras de uma palavra."],
      ["Combinação", "Escolha em que a ordem não importa."],
    ],
    [
      ["Quantos anagramas tem a palavra LIVRO?", ["24", "60", "120", "720", "25"], 2, "5! = 120."],
      ["Quantos anagramas tem a palavra OSSO?", ["24", "12", "6", "4", "8"], 2, "4! ÷ (2!·2!) = 6."],
      ["Quantas senhas de 3 dígitos (0–9) existem, permitindo repetição?", ["720", "1.000", "30", "999", "100"], 1, "10 · 10 · 10 = 1.000."],
      ["Quantos anagramas de CASA começam com C?", ["3", "6", "12", "24", "4"], 0, "3! ÷ 2! = 3 (A repete)."],
      ["De quantas formas 4 amigos podem se sentar em fila se dois deles querem ficar juntos?", ["6", "12", "24", "48", "8"], 1, "3! · 2!."],
    ],
    [["Explique como calcular o número de anagramas de uma palavra com letras repetidas, com um exemplo.", "Calcula-se o fatorial do número total de letras e divide-se pelo fatorial da quantidade de cada letra repetida; por exemplo, ARARA tem 5!/(3!·2!) = 10 anagramas, porque trocar entre si letras iguais não gera palavra nova."]],
  ),
  aula(
    "Árvore de possibilidades e eventos sucessivos",
    `## Organizar para não errar

A **árvore de possibilidades** é um diagrama que mostra **todos os resultados** de experimentos feitos em **etapas**. Cada "galho" é uma possibilidade, com sua **probabilidade**.

## Como usar

1. Desenhe a primeira etapa com seus resultados e probabilidades.
2. A partir de cada resultado, desenhe a etapa seguinte.
3. A probabilidade de um **caminho** é o **produto** das probabilidades dos galhos.
4. Se vários caminhos levam ao evento desejado, **some** as probabilidades desses caminhos.

## Exemplo 1: dois filhos

Qual a probabilidade de um casal ter **um menino e uma menina** em dois filhos?

- Caminhos: MM, MF, FM, FF (cada um com 1/2 · 1/2 = 1/4).
- "Um de cada": MF ou FM → 1/4 + 1/4 = **1/2**.

## Exemplo 2: urna sem reposição

Urna com 3 bolas azuis e 2 vermelhas. Retiram-se duas, sem reposição. Probabilidade de serem de **cores diferentes**:

- Azul e depois vermelha: 3/5 · 2/4 = 6/20.
- Vermelha e depois azul: 2/5 · 3/4 = 6/20.
- Total: 12/20 = **3/5**.

## Exemplo 3: teste diagnóstico

Uma doença atinge **1%** da população. Um teste acerta 90% dos doentes e dá falso positivo em 5% dos saudáveis. Em 10.000 pessoas:

- Doentes: 100 → 90 positivos.
- Saudáveis: 9.900 → 495 positivos (falsos).
- Positivos totais: 585. Chance de estar doente dado positivo: 90/585 ≈ **15%**.

Isso mostra que, em doenças raras, um positivo nem sempre significa doença — uma das ideias mais cobradas de **probabilidade condicional**.

## Lançamentos sucessivos

- Probabilidade de **três caras** seguidas: (1/2)³ = **1/8**.
- Probabilidade de **pelo menos uma coroa** em 3 lançamentos: 1 − 1/8 = **7/8**.

## Cuidado

- Moeda e dado **não têm memória**: depois de 5 caras, a chance de cara na próxima continua 1/2 (**falácia do jogador**).

## Resumindo

Na árvore, multiplique ao longo do caminho e some os caminhos favoráveis. Sem reposição, as probabilidades mudam. Em testes de doenças raras, muitos positivos são falsos. Eventos independentes não têm memória.`,
    [
      "Multiplique ao longo do caminho; some caminhos favoráveis.",
      "Um menino e uma menina em dois filhos: 1/2.",
      "Doença rara: muitos positivos podem ser falsos.",
      "Falácia do jogador: a moeda não tem memória.",
    ],
    [
      ["Árvore de possibilidades", "Diagrama que organiza os resultados de etapas sucessivas."],
      ["Falso positivo", "Resultado positivo em quem não tem a condição testada."],
      ["Falácia do jogador", "Crença equivocada de que resultados passados mudam a chance de eventos independentes."],
    ],
    [
      ["A probabilidade de um casal ter dois meninos em dois filhos é:", ["1/2", "1/4", "1/3", "3/4", "1/8"], 1, "1/2 · 1/2."],
      ["A probabilidade de ter pelo menos uma menina em três filhos é:", ["1/8", "3/8", "1/2", "7/8", "3/4"], 3, "1 − (1/2)³."],
      ["Urna com 2 brancas e 2 pretas; tirando duas sem reposição, a chance de ambas brancas é:", ["1/4", "1/6", "1/3", "1/2", "1/8"], 1, "2/4 · 1/3."],
      ["Após 5 caras seguidas, a probabilidade de sair cara no 6º lançamento é:", ["menor que 1/2", "1/2", "maior que 1/2", "zero", "1/64"], 1, "Independência."],
      ["No exemplo do teste diagnóstico, quem testa positivo tem chance de estar doente de cerca de:", ["90%", "50%", "15%", "1%", "99%"], 2, "90 ÷ 585."],
    ],
    [["Explique por que, para uma doença rara, um teste positivo nem sempre indica que a pessoa está doente.", "Porque, como há muito mais pessoas saudáveis, mesmo uma pequena taxa de falsos positivos gera muitos resultados positivos errados; assim, entre os positivos, a maioria pode ser de pessoas saudáveis."]],
  ),
  aula(
    "Inflação, índices de preços e poder de compra",
    `## O que é inflação

**Inflação** é o **aumento generalizado** e contínuo dos **preços**. Com ela, o mesmo dinheiro compra **menos** coisas: cai o **poder de compra**.

- No Brasil, a inflação oficial é medida pelo **IPCA** (IBGE).
- **Deflação:** queda geral dos preços.
- **Hiperinflação:** inflação descontrolada (o Brasil teve mais de 2.000% ao ano antes do Plano Real, 1994).

## Inflação acumulada (aumentos sucessivos)

Os índices **não se somam**: eles se **multiplicam**.

- Inflação de 10% em um ano e 10% no seguinte: 1,10 × 1,10 = 1,21 → **21%**, e não 20%.
- Com três meses de 2%: 1,02³ ≈ 1,0612 → **≈ 6,12%**.

## Aumento real de salário

Se o salário subiu, mas a inflação subiu também, o ganho **real** é menor.

**Fator real = (1 + aumento do salário) ÷ (1 + inflação)**

**Exemplo:** salário aumentou 10%, inflação foi 6%:

- 1,10 ÷ 1,06 ≈ 1,0377 → ganho real ≈ **3,8%** (e não 4%).

Se o salário sobe **menos** que a inflação, há **perda** de poder de compra.

## Corrigir valores pela inflação

Para saber quanto R$ 100 de 2020 valem hoje, multiplica-se pelo fator acumulado da inflação no período.

## Índices e números-índice

- Um **número-índice** compara valores com uma **base** (geralmente 100).
- Se o índice de preços foi de 100 para 125, os preços subiram **25%**.

## Causas e consequências

- Causas: aumento da demanda, custos de produção (combustível, energia), crises, desvalorização da moeda, choques climáticos que encarecem alimentos.
- Consequências: perda de poder de compra, sobretudo dos **mais pobres** (que gastam quase tudo com itens básicos), incerteza econômica.
- O **Banco Central** usa a **taxa de juros (Selic)** para controlar a inflação.

## Resumindo

Inflação é o aumento geral de preços e reduz o poder de compra. Taxas sucessivas se multiplicam (10% + 10% = 21%). Ganho real = (1 + aumento) ÷ (1 + inflação). A inflação pesa mais para os pobres.`,
    [
      "Inflação reduz o poder de compra do dinheiro.",
      "Taxas sucessivas se multiplicam: 10% e 10% = 21%.",
      "Ganho real = (1 + aumento) ÷ (1 + inflação) − 1.",
      "IPCA é o índice oficial; a Selic ajuda a controlar a inflação.",
    ],
    [
      ["Inflação", "Aumento generalizado e contínuo dos preços."],
      ["Poder de compra", "Quantidade de bens que o dinheiro consegue comprar."],
      ["Ganho real", "Aumento de renda descontada a inflação."],
    ],
    [
      ["Duas inflações seguidas de 20% acumulam:", ["40%", "44%", "42%", "20%", "24%"], 1, "1,2 × 1,2 = 1,44."],
      ["Um salário subiu 5% num ano em que a inflação foi 8%. Houve:", ["ganho real", "perda de poder de compra", "ganho real de 3%", "nenhuma mudança", "deflação"], 1, "Aumento menor que a inflação."],
      ["Um salário subiu 12% e a inflação foi 12%. O ganho real foi:", ["12%", "24%", "0%", "6%", "1%"], 2, "1,12 ÷ 1,12 = 1."],
      ["Um índice de preços passou de 100 para 118. Os preços subiram:", ["118%", "18%", "1,8%", "82%", "8%"], 1, "Base 100."],
      ["A inflação prejudica mais os mais pobres porque:", ["eles não compram nada", "gastam quase toda a renda em itens básicos", "investem em ações", "não usam dinheiro", "recebem em dólar"], 1, "Sem margem de reserva."],
    ],
    [["Explique por que duas inflações anuais de 10% não resultam em 20% acumulados.", "Porque o segundo aumento incide sobre os preços já aumentados no primeiro ano; os fatores se multiplicam (1,10 × 1,10 = 1,21), resultando em 21% acumulados."]],
  ),
  aula(
    "Tabelas de dupla entrada e pesquisas de opinião",
    `## Tabelas de dupla entrada

Cruzam **duas variáveis** ao mesmo tempo: as **linhas** representam uma categoria e as **colunas**, outra.

**Exemplo:** pesquisa com 500 estudantes sobre transporte:

| | Ônibus | Bicicleta | A pé | Total |
|---|---|---|---|---|
| Manhã | 120 | 40 | 90 | 250 |
| Tarde | 150 | 30 | 70 | 250 |
| Total | 270 | 70 | 160 | 500 |

## Como interpretar

- **Total geral:** 500.
- **Porcentagem sobre o total:** usam bicicleta 70/500 = **14%**.
- **Porcentagem dentro de uma linha:** dos alunos da manhã, usam ônibus 120/250 = **48%**.
- **Porcentagem dentro de uma coluna:** dos que vão a pé, são da manhã 90/160 ≈ **56%**.

O **denominador muda** conforme a pergunta! Leia com atenção: "dos alunos da manhã" (linha) é diferente de "dos que usam ônibus" (coluna) e de "do total".

## Pesquisas de opinião

- **População:** todo o grupo que se quer estudar.
- **Amostra:** parte da população que é efetivamente pesquisada. Deve ser **representativa** (sorteada, com perfis variados).
- **Margem de erro:** indica a precisão. "Candidato A tem 30%, margem de **2 pontos** para mais ou para menos" → entre **28% e 32%**.
- **Empate técnico:** quando os intervalos de dois candidatos se **sobrepõem** (A: 30% ± 2; B: 27% ± 2 → A entre 28 e 32, B entre 25 e 29 → empate técnico).
- **Nível de confiança:** geralmente 95%.

## Vieses comuns

- Amostra **não representativa** (pesquisar só em um bairro rico ou só pela internet).
- Perguntas **tendenciosas**.
- Respostas **por conveniência** (só quem quer responde).

## Porcentagem de porcentagem

"40% dos alunos são da tarde, e 25% deles usam bicicleta" → 0,40 × 0,25 = **10%** do total.

## Resumindo

Em tabelas de dupla entrada, identifique se a porcentagem é sobre o total, a linha ou a coluna. Pesquisas usam amostras representativas e margem de erro; intervalos que se sobrepõem indicam empate técnico.`,
    [
      "Tabelas de dupla entrada cruzam duas variáveis.",
      "O denominador depende da pergunta: total, linha ou coluna.",
      "Margem de erro: o valor real fica num intervalo.",
      "Intervalos sobrepostos = empate técnico.",
    ],
    [
      ["Amostra", "Parte da população efetivamente pesquisada."],
      ["Margem de erro", "Variação possível em torno do resultado de uma pesquisa."],
      ["Empate técnico", "Quando os intervalos de dois resultados se sobrepõem."],
    ],
    [
      ["Na tabela da aula, a porcentagem do total que vai de ônibus é:", ["27%", "54%", "48%", "60%", "50%"], 1, "270 ÷ 500."],
      ["Dos alunos da tarde, a porcentagem que usa ônibus é:", ["30%", "60%", "54%", "50%", "15%"], 1, "150 ÷ 250."],
      ["A tem 35% e B tem 31%, com margem de erro de 3 pontos. Há:", ["vitória clara de A", "empate técnico", "vitória de B", "erro na pesquisa", "nada a concluir sobre margem"], 1, "32–38 e 28–34 se sobrepõem."],
      ["Uma pesquisa sobre a cidade toda feita só num bairro rico tem problema de:", ["margem de erro pequena", "amostra não representativa", "excesso de entrevistados", "nível de confiança alto", "nenhum"], 1, "Viés de amostra."],
      ["60% dos clientes são mulheres; 30% delas compram online. A porcentagem do total que são mulheres compradoras online é:", ["90%", "30%", "18%", "20%", "36%"], 2, "0,6 × 0,3."],
    ],
    [["Explique o que é margem de erro e como ela pode indicar um empate técnico.", "Margem de erro é a variação possível do resultado de uma pesquisa; se um candidato tem 30% com margem de 2 pontos, seu valor real está entre 28% e 32%. Quando os intervalos de dois candidatos se sobrepõem, há empate técnico."]],
  ),
  aula(
    "Equação da reta e coeficiente angular",
    `## A reta no plano cartesiano

Toda reta não vertical pode ser escrita como:

**y = ax + b**

- **a:** **coeficiente angular** (inclinação). Indica quanto y varia quando x aumenta 1.
  - a > 0: reta **crescente**.
  - a < 0: reta **decrescente**.
  - a = 0: reta **horizontal** (constante).
- **b:** **coeficiente linear**: o valor de y quando x = 0 (onde a reta **corta o eixo y**).

## Calculando a inclinação com dois pontos

Dados os pontos (x₁, y₁) e (x₂, y₂):

**a = (y₂ − y₁) ÷ (x₂ − x₁)** ("variação de y sobre variação de x")

**Exemplo:** pontos (1, 5) e (3, 11): a = (11 − 5) ÷ (3 − 1) = 6 ÷ 2 = **3**. Usando (1, 5): 5 = 3·1 + b → b = 2. Reta: **y = 3x + 2**.

## Interpretação em problemas

- **Custo** de produção: C(x) = 4x + 200 → R$ 200 de custo fixo e R$ 4 por unidade.
- **Água num reservatório** que esvazia: V(t) = 1.000 − 50t → começa com 1.000 L e perde 50 L por minuto; esvazia em 20 min (quando V = 0).
- **Conversão de temperatura:** F = 1,8C + 32.

## Raiz (zero da função)

O ponto onde a reta **corta o eixo x** (y = 0): x = −b/a. Em problemas, pode ser "quando o reservatório esvazia" ou o "ponto de equilíbrio".

## Retas paralelas e cruzamentos

- Retas **paralelas** têm o **mesmo coeficiente angular**.
- O **ponto de encontro** de duas retas resolve o **sistema** formado por elas (ex.: quando dois planos custam o mesmo, quando dois carros se encontram).

## Inclinação e porcentagem

Em rampas e estradas, a inclinação também é dada em **%**: uma rampa de 8% sobe 8 m a cada 100 m na horizontal (a = 0,08). A norma de acessibilidade recomenda rampas com no máximo **8,33%**.

## Resumindo

Reta: y = ax + b. a é a inclinação (variação de y ÷ variação de x); b é onde corta o eixo y. Paralelas têm o mesmo a. O cruzamento de retas resolve sistemas. Inclinação de rampas pode ser dada em %.`,
    [
      "Reta: y = ax + b.",
      "a = inclinação = (y₂ − y₁) ÷ (x₂ − x₁).",
      "b = onde a reta corta o eixo y (valor inicial).",
      "Paralelas têm o mesmo coeficiente angular.",
    ],
    [
      ["Coeficiente angular", "Número que indica a inclinação da reta."],
      ["Coeficiente linear", "Valor de y quando x = 0."],
      ["Raiz", "Valor de x em que a função vale zero."],
    ],
    [
      ["A inclinação da reta que passa por (2, 3) e (4, 11) é:", ["2", "4", "8", "3", "7"], 1, "8 ÷ 2."],
      ["Na reta y = −2x + 10, o ponto onde ela corta o eixo y é:", ["(0, −2)", "(0, 10)", "(5, 0)", "(10, 0)", "(−2, 0)"], 1, "b = 10."],
      ["Um reservatório com 600 L perde 30 L por minuto. Ele esvazia em:", ["30 min", "20 min", "18 min", "60 min", "10 min"], 1, "600 ÷ 30."],
      ["As retas y = 3x + 1 e y = 3x − 4 são:", ["perpendiculares", "paralelas", "iguais", "concorrentes no eixo y", "horizontais"], 1, "Mesmo coeficiente angular."],
      ["Uma rampa de inclinação 5% sobe, a cada 20 m na horizontal:", ["5 m", "1 m", "0,5 m", "2 m", "4 m"], 1, "0,05 × 20."],
    ],
    [["Interprete os coeficientes da função C(x) = 4x + 200, que representa o custo de produção de x unidades.", "O coeficiente 200 é o custo fixo, pago mesmo sem produzir nada; o coeficiente 4 é o custo de cada unidade produzida, ou seja, o custo aumenta R$ 4 para cada unidade a mais."]],
  ),
  aula(
    "Estimativa, arredondamento e cálculo mental",
    `## Por que estimar

No ENEM, o tempo é curto. **Estimar** ajuda a:

- **Eliminar alternativas** absurdas rapidamente.
- **Conferir** se um cálculo faz sentido.
- Resolver questões que pedem valores **aproximados**.

## Arredondamento

- Olhe o algarismo **seguinte** ao que vai ficar: se for **5 ou mais**, arredonde **para cima**; se for menor que 5, mantenha.
  - 3,46 → 3,5 (uma casa); 3,44 → 3,4.
  - 1.738 → 1.700 (centena).
- **Arredondar para cima por necessidade:** latas de tinta, ônibus para uma excursão, caixas de piso (não dá para comprar meia lata).
- **Para baixo por necessidade:** quantas embalagens completas consigo encher.

## Truques de cálculo mental

- **Multiplicar por 5:** multiplique por 10 e divida por 2. 48 × 5 = 480 ÷ 2 = **240**.
- **Por 25:** multiplique por 100 e divida por 4. 36 × 25 = 3.600 ÷ 4 = **900**.
- **Por 9 ou 11:** 47 × 9 = 47 × 10 − 47 = **423**; 47 × 11 = 470 + 47 = **517**.
- **10% de um valor:** "ande" a vírgula uma casa. 10% de 340 = 34; 5% é a metade: 17; 15% = 34 + 17 = **51**.
- **1%:** duas casas. 1% de 340 = 3,4.
- **Dividir por 0,5** é **multiplicar por 2**; dividir por 0,25 é multiplicar por 4.
- **Decompor:** 23 × 14 = 23 × 10 + 23 × 4 = 230 + 92 = **322**.

## Ordem de grandeza

É a **potência de 10** mais próxima de um número. Ajuda a estimar quantidades muito grandes ou pequenas.

- 3.200 → ordem de grandeza **10³**.
- 8.000 → mais próxima de **10⁴** (quando o número passa de ≈ 3,16 × 10ⁿ, arredonda-se para 10ⁿ⁺¹).

## Estimando com dados reais

"Quantos litros de água uma família de 4 pessoas gasta por mês, se cada pessoa usa 150 L por dia?" → 4 × 150 × 30 = **18.000 L** = 18 m³.

## Conferir unidades

Muitas questões erram propositalmente nas **unidades** (cm × m, minutos × horas). Converta tudo **antes** de calcular.

## Resumindo

Estime para eliminar alternativas e conferir resultados. Arredonde para cima quando precisar comprar materiais. Use truques: ×5 = ×10 ÷ 2; 10% = vírgula uma casa. Ordem de grandeza ajuda em números enormes.`,
    [
      "Estimar elimina alternativas absurdas e confere resultados.",
      "Arredonde para cima quando precisar comprar unidades inteiras.",
      "× 5 = × 10 ÷ 2; 10% = vírgula uma casa.",
      "Converta as unidades antes de calcular.",
    ],
    [
      ["Estimativa", "Cálculo aproximado para ter uma ideia rápida do resultado."],
      ["Arredondamento", "Substituição de um número por outro próximo e mais simples."],
      ["Ordem de grandeza", "Potência de 10 mais próxima de um número."],
    ],
    [
      ["Calculando 64 × 5 mentalmente, obtém-se:", ["300", "320", "340", "310", "330"], 1, "640 ÷ 2."],
      ["15% de R$ 80 é:", ["R$ 8", "R$ 12", "R$ 15", "R$ 10", "R$ 16"], 1, "10% é 8 e 5% é 4: 8 + 4."],
      ["Uma excursão de 130 alunos usará ônibus de 40 lugares. São necessários:", ["3 ônibus", "3,25 ônibus", "4 ônibus", "5 ônibus", "2 ônibus"], 2, "Arredondar para cima."],
      ["A ordem de grandeza de 7.500 é:", ["10²", "10³", "10⁴", "10⁵", "10"], 2, "Mais próxima de 10.000."],
      ["Dividir 18 por 0,5 é o mesmo que:", ["9", "36", "18,5", "0,9", "90"], 1, "Multiplicar por 2."],
    ],
    [["Por que, em problemas de compra de materiais, às vezes se arredonda para cima mesmo quando a parte decimal é pequena?", "Porque não é possível comprar parte de uma lata, caixa ou ônibus; se arredondar para baixo, o material ou os lugares não serão suficientes, então é preciso a unidade inteira seguinte."]],
  ),
];
