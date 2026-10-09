import { aula } from "./build";

/** Matemática, lote 3: juros, álgebra, geometria analítica, trigonometria, polígonos e lógica. */
export const MATEMATICA_3 = [
  aula(
    "Juros simples e juros compostos",
    `## O preço do dinheiro no tempo

**Juros** são o valor pago pelo uso do dinheiro: quem empresta recebe, quem pega emprestado paga. Termos importantes:

- **Capital (C):** valor inicial.
- **Taxa (i):** porcentagem por período.
- **Tempo (t):** número de períodos.
- **Montante (M):** capital + juros.

## Juros simples

Os juros são calculados **sempre sobre o capital inicial**:

J = C × i × t e M = C + J

R$ 1.000 a 2% ao mês por 5 meses: J = 1.000 × 0,02 × 5 = R$ 100 → M = **R$ 1.100**.

## Juros compostos

Os juros de cada período **entram no capital** e também rendem juros ("juros sobre juros"):

M = C × (1 + i)ᵗ

R$ 1.000 a 10% ao mês por 2 meses: M = 1.000 × 1,1² = **R$ 1.210**. Em juros simples seriam R$ 1.200.

## Onde aparece

- **Cartão de crédito e cheque especial:** juros compostos altíssimos; a dívida cresce rápido.
- **Poupança e investimentos:** juros compostos a seu favor.
- **Compras a prazo:** comparar o preço à vista com a soma das parcelas mostra quanto de juros está embutido.

## À vista ou a prazo?

Uma geladeira custa R$ 2.000 à vista ou 10 × R$ 230. A prazo, paga-se R$ 2.300: **R$ 300 a mais** (15%). Se o dinheiro aplicado rendesse menos que isso no período, é melhor pagar à vista.

## Resumindo

Simples: juros fixos sobre o capital inicial (J = C·i·t). Compostos: juros sobre juros (M = C·(1 + i)ᵗ). No longo prazo, os compostos crescem muito mais.`,
    [
      "Juros simples: J = C × i × t, sempre sobre o capital inicial.",
      "Juros compostos: M = C × (1 + i)ᵗ, juros sobre juros.",
      "Cartão de crédito e cheque especial usam juros compostos altos.",
      "Compare à vista com a soma das parcelas para ver os juros embutidos.",
    ],
    [
      ["Capital", "Valor inicial emprestado ou aplicado."],
      ["Montante", "Capital somado aos juros."],
      ["Juros compostos", "Juros calculados sobre o valor acumulado, incluindo juros anteriores."],
    ],
    [
      ["R$ 500 a juros simples de 3% ao mês por 4 meses rendem:", ["R$ 15", "R$ 30", "R$ 60", "R$ 120", "R$ 560"], 2, "J = 500 × 0,03 × 4 = R$ 60."],
      ["R$ 2.000 a juros compostos de 5% ao mês, após 2 meses, viram:", ["R$ 2.100", "R$ 2.200", "R$ 2.205", "R$ 2.250", "R$ 2.400"], 2, "2.000 × 1,05² = 2.000 × 1,1025 = R$ 2.205."],
      ["Um produto custa R$ 600 à vista ou 4 × R$ 165. Os juros embutidos são de:", ["R$ 15", "R$ 45", "R$ 60", "R$ 65", "R$ 165"], 2, "4 × 165 = 660; 660 − 600 = R$ 60."],
      ["Nos juros compostos, os juros de cada mês:", ["são sempre iguais", "diminuem", "são calculados sobre o montante acumulado", "são calculados só sobre o primeiro mês", "não existem"], 2, "É o chamado juros sobre juros."],
      ["Com a mesma taxa e o mesmo tempo (mais de um período), qual rende mais?", ["Juros simples", "Juros compostos", "Rendem igual", "Depende da cor da nota", "Nenhum rende"], 1, "A partir do 2º período, os compostos rendem mais porque os juros também rendem."],
    ],
    [["Explique por que uma dívida de cartão de crédito cresce tão rápido.", "Porque o cartão cobra juros compostos com taxas altas; os juros de cada mês são somados à dívida e no mês seguinte também geram juros, fazendo o valor crescer cada vez mais rápido."]],
  ),
  aula(
    "Inequações: quando vale a pena",
    `## Desigualdades

Uma **inequação** é como uma equação, mas com os sinais **>**, **<**, **≥** ou **≤**. A resposta não é um único número, e sim um **intervalo** de valores.

## Resolvendo

Resolve-se como equação, com uma regra especial: ao **multiplicar ou dividir por número negativo**, o sinal **inverte**.

- 2x + 3 > 11 → 2x > 8 → x > 4.
- −3x ≥ 12 → x ≤ −4 (o sinal virou).

## Aplicação: quando um plano compensa

Plano A: R$ 50 fixos + R$ 2 por GB. Plano B: R$ 80 fixos + R$ 0,50 por GB. Quando o B é mais barato?

80 + 0,5x < 50 + 2x → 30 < 1,5x → x > 20.

A partir de **20 GB**, o plano B compensa.

## Aplicação: lucro

Uma empresa vende cada peça por R$ 30 e tem custo fixo de R$ 1.200 mais R$ 10 por peça. Para ter lucro:

30x > 1.200 + 10x → 20x > 1.200 → x > 60. Precisa vender **mais de 60 peças**.

## Na reta numérica

A resposta pode ser desenhada numa reta: bolinha **fechada** quando o número faz parte da resposta (≥ ou ≤) e **aberta** quando não faz (> ou <). Isso ajuda a ver, por exemplo, que "x > 20" não inclui o 20.

## Palavras que indicam inequação

- "no mínimo", "pelo menos" → ≥
- "no máximo", "até" → ≤
- "mais que", "acima de" → >
- "menos que", "abaixo de" → <

## Resumindo

Inequações dão intervalos. Resolva como equação, mas inverta o sinal ao multiplicar ou dividir por negativo. Use-as para descobrir quando um plano compensa ou quando há lucro.`,
    [
      "Inequações usam >, <, ≥ ou ≤ e têm como resposta um intervalo.",
      "Multiplicando ou dividindo por negativo, o sinal inverte.",
      "Compare planos montando a desigualdade entre as funções de custo.",
      "“No mínimo” é ≥; “no máximo” é ≤.",
    ],
    [
      ["Inequação", "Sentença matemática com sinal de desigualdade."],
      ["Intervalo", "Conjunto de números entre dois limites."],
      ["Custo fixo", "Valor pago independentemente da quantidade produzida."],
    ],
    [
      ["A solução de 3x − 5 > 10 é:", ["x > 3", "x > 5", "x < 5", "x > 15", "x = 5"], 1, "3x > 15 → x > 5."],
      ["A solução de −2x < 8 é:", ["x < −4", "x > −4", "x < 4", "x > 4", "x = −4"], 1, "Dividindo por −2, o sinal inverte: x > −4."],
      ["Plano A: R$ 30 + R$ 3 por hora. Plano B: R$ 60 + R$ 1 por hora. O B fica mais barato a partir de mais de:", ["10 horas", "15 horas", "20 horas", "30 horas", "45 horas"], 1, "60 + x < 30 + 3x → 30 < 2x → x > 15."],
      ["“A turma deve ter no mínimo 20 alunos” é escrito como:", ["x > 20", "x < 20", "x ≥ 20", "x ≤ 20", "x = 20"], 2, "“No mínimo” inclui o 20: x ≥ 20."],
      ["Preço de venda R$ 25 por unidade; custo R$ 500 fixos + R$ 15 por unidade. Há lucro com mais de:", ["20 unidades", "25 unidades", "33 unidades", "50 unidades", "100 unidades"], 3, "25x > 500 + 15x → 10x > 500 → x > 50."],
    ],
    [["O que muda ao resolver uma inequação em comparação com uma equação?", "A resposta é um intervalo de valores, e ao multiplicar ou dividir os dois lados por um número negativo é preciso inverter o sinal da desigualdade."]],
  ),
  aula(
    "Sistemas de equações",
    `## Duas incógnitas, duas informações

Quando um problema tem **duas** coisas desconhecidas, precisamos de **duas** equações. Isso é um **sistema**.

Ex.: num estacionamento há carros e motos, 20 veículos e 64 rodas. Quantos carros?

- c + m = 20
- 4c + 2m = 64

## Método da substituição

Isole uma letra numa equação e substitua na outra:

m = 20 − c → 4c + 2(20 − c) = 64 → 4c + 40 − 2c = 64 → 2c = 24 → **c = 12**, m = 8.

## Método da adição

Multiplique as equações para que, ao somar, uma letra desapareça:

- x + y = 10
- x − y = 4

Somando: 2x = 14 → x = 7, y = 3.

## Interpretação gráfica

Cada equação de 1º grau é uma reta. A solução do sistema é o **ponto de encontro** das retas.

- Retas que se cruzam: uma solução.
- Retas paralelas: nenhuma solução.
- Retas iguais: infinitas soluções.

## Montando a partir do texto

O passo mais difícil é traduzir o enunciado:

- "A soma das idades é 50" → x + y = 50.
- "Um tem o dobro do outro" → x = 2y.
- "Ingresso inteiro R$ 20 e meia R$ 10; 100 pessoas e R$ 1.600 arrecadados" → i + m = 100 e 20i + 10m = 1.600 → i = 60.

## Resumindo

Duas incógnitas pedem duas equações. Use substituição ou adição. Graficamente, a solução é o cruzamento das retas. O segredo é traduzir bem o texto.`,
    [
      "Duas incógnitas exigem duas equações (um sistema).",
      "Substituição: isole uma letra e substitua na outra equação.",
      "Adição: some as equações para eliminar uma letra.",
      "A solução é o ponto onde as duas retas se cruzam.",
    ],
    [
      ["Sistema de equações", "Conjunto de equações com as mesmas incógnitas resolvidas juntas."],
      ["Substituição", "Método em que se isola uma incógnita e se troca na outra equação."],
      ["Incógnita", "Valor desconhecido representado por uma letra."],
    ],
    [
      ["x + y = 15 e x − y = 5. O valor de x é:", ["5", "8", "10", "12", "20"], 2, "Somando: 2x = 20 → x = 10."],
      ["Num sítio há galinhas e porcos: 30 cabeças e 80 patas. Quantos porcos?", ["5", "10", "15", "20", "25"], 1, "g + p = 30 e 2g + 4p = 80 → 2p = 20 → p = 10."],
      ["“João tem o triplo da idade de Pedro, e juntos somam 48 anos.” Pedro tem:", ["10", "12", "16", "24", "36"], 1, "j = 3p e j + p = 48 → 4p = 48 → p = 12."],
      ["Graficamente, um sistema sem solução corresponde a retas:", ["que se cruzam", "paralelas", "iguais", "perpendiculares", "que passam pela origem"], 1, "Retas paralelas nunca se encontram."],
      ["Foram vendidos 50 ingressos, inteiros a R$ 30 e meias a R$ 15, somando R$ 1.200. Quantas meias?", ["10", "15", "20", "25", "30"], 2, "i + m = 50 e 30i + 15m = 1.200 → 30(50 − m) + 15m = 1.200 → 1.500 − 15m = 1.200 → m = 20."],
    ],
    [["Explique como montar um sistema para o problema dos carros e motos num estacionamento.", "Chama-se de c o número de carros e m o de motos; uma equação soma os veículos, c + m igual ao total, e a outra soma as rodas, 4c + 2m igual ao total de rodas."]],
  ),
  aula(
    "Plano cartesiano e distância entre pontos",
    `## Localizar com dois números

O **plano cartesiano** tem dois eixos perpendiculares: o horizontal (**x**, abscissas) e o vertical (**y**, ordenadas). Cada ponto é um par (x, y).

O ponto (3, 2) fica 3 unidades à direita e 2 para cima da origem (0, 0).

## Quadrantes

- 1º: x > 0 e y > 0.
- 2º: x < 0 e y > 0.
- 3º: x < 0 e y < 0.
- 4º: x > 0 e y < 0.

## Distância entre dois pontos

Usa o teorema de Pitágoras:

d = √[(x₂ − x₁)² + (y₂ − y₁)²]

De A(1, 2) a B(4, 6): d = √(3² + 4²) = √25 = **5**.

## Ponto médio

O ponto no meio do segmento AB:

M = ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2)

## Aplicações no ENEM

- **Mapas e GPS:** localizar um ponto numa malha de ruas.
- **Menor distância:** escolher o lugar para construir uma escola equidistante de bairros.
- **Deslocamento em quarteirões:** quando só se anda pelas ruas (não pela diagonal), a distância é |Δx| + |Δy|, a chamada "distância do táxi".

## Dica de prova

Sempre desenhe os pontos num rascunho quadriculado. Ver a posição ajuda a perceber se a distância pedida é na horizontal, na vertical ou na diagonal, e evita trocar x com y.

## Cuidado

Leia se o problema permite andar em linha reta (use Pitágoras) ou só pelas ruas (some os deslocamentos).

## Resumindo

Pontos são pares (x, y). A distância em linha reta vem de Pitágoras; o ponto médio é a média das coordenadas. Pelas ruas, some os deslocamentos.`,
    [
      "Cada ponto é um par (x, y): horizontal e vertical.",
      "Distância em linha reta: √[(Δx)² + (Δy)²].",
      "Ponto médio: média das coordenadas.",
      "Andando só pelas ruas, a distância é |Δx| + |Δy|.",
    ],
    [
      ["Abscissa", "Coordenada x, medida no eixo horizontal."],
      ["Ordenada", "Coordenada y, medida no eixo vertical."],
      ["Origem", "Ponto (0, 0), onde os eixos se cruzam."],
    ],
    [
      ["A distância entre (0, 0) e (6, 8) é:", ["7", "10", "14", "48", "100"], 1, "√(36 + 64) = √100 = 10."],
      ["O ponto médio entre (2, 4) e (8, 10) é:", ["(5, 7)", "(6, 6)", "(10, 14)", "(3, 3)", "(4, 5)"], 0, "((2 + 8)/2, (4 + 10)/2) = (5, 7)."],
      ["O ponto (−3, 5) fica no:", ["1º quadrante", "2º quadrante", "3º quadrante", "4º quadrante", "eixo x"], 1, "x negativo e y positivo: 2º quadrante."],
      ["Andando só pelas ruas de uma malha quadriculada de (1, 1) até (4, 5), percorre-se:", ["5", "7", "12", "25", "9"], 1, "|4 − 1| + |5 − 1| = 3 + 4 = 7."],
      ["A distância entre (1, 3) e (4, 7) é:", ["3", "4", "5", "7", "25"], 2, "√(3² + 4²) = 5."],
    ],
    [["Explique a diferença entre a distância em linha reta e a distância andando pelas ruas num mapa quadriculado.", "Em linha reta usa-se Pitágoras com as diferenças de x e de y; pelas ruas, como não dá para cortar na diagonal, somam-se as diferenças horizontal e vertical."]],
  ),
  aula(
    "Circunferência, círculo e arcos",
    `## Circunferência e círculo

- **Circunferência:** a linha (a borda).
- **Círculo:** a região interna (a borda + o miolo).

Elementos: **centro**, **raio (r)** e **diâmetro (d = 2r)**.

## Comprimento da circunferência

C = 2πr (ou π × d)

Uma roda de bicicleta com raio 30 cm percorre, a cada volta, 2 × 3,14 × 30 ≈ **188 cm**. Em 100 voltas, cerca de 188 m.

## Área do círculo

A = πr²

Uma pizza de 40 cm de diâmetro (r = 20) tem área ≈ 3,14 × 400 = **1.256 cm²**. Uma pizza de 30 cm tem 707 cm²: a de 40 cm tem quase o **dobro** de área, embora o diâmetro seja só 1/3 maior. Por isso comparar pizzas pelo preço por área é uma questão clássica.

## Arcos e setores

Um **setor** é uma "fatia". Sua área é proporcional ao ângulo:

área do setor = (ângulo ÷ 360°) × πr²

Um setor de 90° é 1/4 do círculo.

O comprimento de um **arco** também é proporcional: (ângulo ÷ 360°) × 2πr.

## Dica de prova

Quando o problema pede quantas voltas uma roda dá para percorrer uma distância, divida a distância pelo comprimento da circunferência (2πr), sempre nas mesmas unidades.

## Coroa circular

A região entre dois círculos de mesmo centro: πR² − πr². Aparece em arruelas, pistas e canos.

## Resumindo

Comprimento: 2πr. Área: πr². Setores e arcos são frações proporcionais ao ângulo. Dobrar o raio quadruplica a área.`,
    [
      "Circunferência é a borda; círculo é a região.",
      "Comprimento = 2πr; área = πr².",
      "Setor e arco são proporcionais ao ângulo (ângulo ÷ 360°).",
      "Dobrar o raio quadruplica a área.",
    ],
    [
      ["Diâmetro", "Segmento que passa pelo centro e liga dois pontos da circunferência; vale 2r."],
      ["Setor circular", "Parte do círculo limitada por dois raios, como uma fatia de pizza."],
      ["Coroa circular", "Região entre dois círculos de mesmo centro."],
    ],
    [
      ["Uma roda tem raio 50 cm. Com π = 3,14, em uma volta ela percorre:", ["157 cm", "314 cm", "50 cm", "100 cm", "7.850 cm"], 1, "2πr = 2 × 3,14 × 50 = 314 cm."],
      ["Um círculo de raio 10 m tem área (π = 3,14):", ["31,4 m²", "62,8 m²", "100 m²", "314 m²", "628 m²"], 3, "πr² = 3,14 × 100 = 314 m²."],
      ["Um setor de 60° de um círculo de área 360 cm² tem área:", ["30 cm²", "60 cm²", "90 cm²", "120 cm²", "180 cm²"], 1, "60/360 = 1/6; 360 ÷ 6 = 60 cm²."],
      ["Se o raio de um círculo triplica, a área fica:", ["3 vezes maior", "6 vezes maior", "9 vezes maior", "27 vezes maior", "igual"], 2, "A área depende de r²: 3² = 9."],
      ["O diâmetro de um círculo é 12 cm. Seu raio é:", ["3 cm", "6 cm", "12 cm", "24 cm", "36 cm"], 1, "r = d ÷ 2 = 6 cm."],
    ],
    [["Por que uma pizza de 40 cm de diâmetro tem quase o dobro de área de uma de 30 cm?", "Porque a área do círculo depende do raio ao quadrado; aumentar o raio de 15 para 20 cm multiplica a área por cerca de 1,78, quase o dobro."]],
  ),
  aula(
    "Trigonometria: seno, cosseno e tangente",
    `## Razões no triângulo retângulo

Num triângulo retângulo, para um ângulo agudo α:

- **seno α** = cateto oposto ÷ hipotenusa
- **cosseno α** = cateto adjacente ÷ hipotenusa
- **tangente α** = cateto oposto ÷ cateto adjacente

Dica para memorizar: "**SOH CAH TOA**" (Seno = Oposto/Hipotenusa; Cosseno = Adjacente/Hipotenusa; Tangente = Oposto/Adjacente).

## Ângulos notáveis

| | 30° | 45° | 60° |
|---|---|---|---|
| seno | 1/2 | √2/2 | √3/2 |
| cosseno | √3/2 | √2/2 | 1/2 |
| tangente | √3/3 | 1 | √3 |

## Aplicações

- **Altura de um prédio:** de 30 m de distância, vê-se o topo sob 60°: altura = 30 × tg 60° = 30√3 ≈ **52 m**.
- **Rampas:** uma rampa com inclinação de 30° e 10 m de comprimento sobe 10 × sen 30° = **5 m**.
- **Teleférico e avião:** subida ao longo de uma linha inclinada.

## Ciclo trigonométrico (ideia geral)

Ângulos maiores que 90° são estudados num círculo de raio 1. O seno se repete a cada 360°, e por isso descreve fenômenos **periódicos**: marés, ondas, a altura de uma cadeira na roda-gigante e a temperatura ao longo do ano.

## Resumindo

SOH CAH TOA para o triângulo retângulo; decore os ângulos de 30°, 45° e 60°. Funções trigonométricas descrevem o que se repete periodicamente.`,
    [
      "Seno = oposto/hipotenusa; cosseno = adjacente/hipotenusa; tangente = oposto/adjacente.",
      "sen 30° = 1/2; cos 60° = 1/2; tg 45° = 1.",
      "Tangente ajuda a achar alturas a partir de distâncias.",
      "Funções trigonométricas descrevem fenômenos periódicos, como marés e rodas-gigantes.",
    ],
    [
      ["Cateto oposto", "Cateto que fica em frente ao ângulo considerado."],
      ["Cateto adjacente", "Cateto que forma o ângulo considerado junto com a hipotenusa."],
      ["Fenômeno periódico", "Algo que se repete em intervalos regulares."],
    ],
    [
      ["Num triângulo retângulo, o cateto oposto a α mede 3 e a hipotenusa mede 6. Então sen α vale:", ["1/3", "1/2", "2", "√3/2", "3"], 1, "sen α = 3 ÷ 6 = 1/2 (α = 30°)."],
      ["Uma rampa de 8 m de comprimento faz 30° com o chão. A altura que ela vence é:", ["2 m", "4 m", "6 m", "8 m", "4√3 m"], 1, "h = 8 × sen 30° = 8 × 1/2 = 4 m."],
      ["De 20 m de distância, vê-se o topo de uma torre sob 45°. A torre mede:", ["10 m", "20 m", "20√2 m", "40 m", "10√2 m"], 1, "tg 45° = 1 = h ÷ 20 → h = 20 m."],
      ["Quanto vale cos 60°?", ["0", "1/2", "√2/2", "√3/2", "1"], 1, "cos 60° = 1/2."],
      ["Qual fenômeno é bem descrito por funções trigonométricas?", ["Preço de um produto com desconto fixo", "Altura da maré ao longo do dia", "Juros simples", "Área de um quadrado", "Número de habitantes de um país"], 1, "A maré sobe e desce periodicamente."],
    ],
    [["Explique como calcular a altura de um prédio conhecendo a distância até ele e o ângulo de visão do topo.", "Usa-se a tangente: a altura é o cateto oposto ao ângulo e a distância é o cateto adjacente, então a altura é a distância multiplicada pela tangente do ângulo."]],
  ),
  aula(
    "Polígonos: ângulos e diagonais",
    `## Polígonos

Polígonos são figuras planas fechadas formadas por segmentos: triângulo (3 lados), quadrilátero (4), pentágono (5), hexágono (6), octógono (8)...

Um polígono é **regular** quando todos os lados e ângulos são iguais.

## Soma dos ângulos internos

S = (n − 2) × 180°

- Triângulo: 180°.
- Quadrilátero: 360°.
- Pentágono: 540°.
- Hexágono: 720°.

Num polígono regular, cada ângulo interno vale S ÷ n. Hexágono regular: 720° ÷ 6 = **120°**.

## Ângulos externos

A soma dos ângulos externos de qualquer polígono convexo é sempre **360°**. Num polígono regular, cada um vale 360° ÷ n.

## Diagonais

d = n × (n − 3) ÷ 2

Hexágono: 6 × 3 ÷ 2 = **9** diagonais.

## Dica de prova

Se a questão diz que um polígono é regular, já dá para achar cada ângulo: calcule a soma dos internos e divida pelo número de lados. Muitas questões de mosaicos e logotipos dependem só disso.

## Pisos e ladrilhos

Uma questão clássica: quais polígonos regulares cobrem um piso sem deixar buracos? Os ângulos que se encontram num vértice precisam somar **360°**:

- Triângulos: 6 × 60° = 360° ✓
- Quadrados: 4 × 90° = 360° ✓
- Hexágonos: 3 × 120° = 360° ✓ (é o formato dos favos de mel)
- Pentágonos regulares (108°) não fecham 360°.

## Resumindo

Soma dos internos: (n − 2) × 180°. Externos somam 360°. Diagonais: n(n − 3)/2. Ladrilhos encaixam quando os ângulos no vértice somam 360°.`,
    [
      "Soma dos ângulos internos: (n − 2) × 180°.",
      "Soma dos ângulos externos: sempre 360°.",
      "Número de diagonais: n(n − 3) ÷ 2.",
      "Ladrilhos regulares encaixam quando os ângulos somam 360° no vértice.",
    ],
    [
      ["Polígono regular", "Polígono com todos os lados e ângulos iguais."],
      ["Diagonal", "Segmento que liga dois vértices não vizinhos."],
      ["Vértice", "Ponto onde dois lados se encontram."],
    ],
    [
      ["A soma dos ângulos internos de um octógono é:", ["720°", "900°", "1.080°", "1.260°", "1.440°"], 2, "(8 − 2) × 180° = 1.080°."],
      ["Cada ângulo interno de um pentágono regular mede:", ["72°", "90°", "108°", "120°", "540°"], 2, "540° ÷ 5 = 108°."],
      ["Quantas diagonais tem um pentágono?", ["3", "5", "7", "9", "10"], 1, "5 × (5 − 3) ÷ 2 = 5."],
      ["Qual polígono regular NÃO cobre um piso sozinho, sem buracos?", ["Triângulo", "Quadrado", "Hexágono", "Pentágono", "Todos cobrem"], 3, "108° não divide 360° de forma exata."],
      ["Cada ângulo externo de um polígono regular de 12 lados mede:", ["15°", "30°", "36°", "60°", "150°"], 1, "360° ÷ 12 = 30°."],
    ],
    [["Por que as abelhas usam hexágonos e um piso de pentágonos regulares não funciona?", "Porque três ângulos de 120° do hexágono somam exatamente 360° num vértice, encaixando sem buracos; os ângulos de 108° do pentágono não somam 360°, então sobram espaços."]],
  ),
  aula(
    "Escalas em mapas e plantas",
    `## O que é escala

Escala é a razão entre a medida no desenho e a medida real:

escala = medida no desenho ÷ medida real (nas **mesmas unidades**)

"1 : 50.000" significa que 1 cm no mapa equivale a 50.000 cm (500 m) no real.

## Calculando distâncias

Num mapa de escala 1 : 200.000, duas cidades estão a 6 cm:

real = 6 × 200.000 = 1.200.000 cm = **12 km**.

## Descobrindo a escala

Uma planta mostra uma sala de 5 m com 10 cm. Escala = 10 cm ÷ 500 cm = **1 : 50**.

## Escala grande e escala pequena

- **Escala grande** (ex.: 1 : 100): mostra pouca área com muitos detalhes, como plantas de casas.
- **Escala pequena** (ex.: 1 : 10.000.000): mostra muita área com poucos detalhes, como mapas de países.

Quanto **maior o denominador**, **menor** a escala.

## Escala gráfica

Alguns mapas trazem uma barrinha dividida: "|——| = 10 km". Basta medir a distância no mapa e comparar com a barra.

## Áreas

Se a escala é 1 : 100, as **áreas** estão na razão 1 : 10.000 (100²). Um cômodo de 4 cm² na planta tem 40.000 cm² = **4 m²** reais.

## Converta antes de calcular

Lembre: 1 km = 1.000 m = 100.000 cm. Essa conversão é onde mais se erra.

## Resumindo

Escala = desenho ÷ real, nas mesmas unidades. Multiplique pelo denominador para achar o real. Áreas usam a escala ao quadrado. Denominador maior = escala menor.`,
    [
      "Escala = medida no desenho ÷ medida real, nas mesmas unidades.",
      "Na escala 1 : n, multiplique a medida do desenho por n para achar a real.",
      "Denominador maior = escala menor (mais área, menos detalhe).",
      "Para áreas, use a escala ao quadrado; 1 km = 100.000 cm.",
    ],
    [
      ["Escala numérica", "Razão escrita como 1 : n entre o desenho e o real."],
      ["Escala gráfica", "Barra desenhada no mapa que mostra a distância real equivalente."],
      ["Escala grande", "Escala com denominador pequeno, que mostra mais detalhes."],
    ],
    [
      ["Num mapa 1 : 100.000, 5 cm correspondem a:", ["500 m", "5 km", "50 km", "500 km", "50 m"], 1, "5 × 100.000 = 500.000 cm = 5 km."],
      ["Uma parede de 6 m aparece com 12 cm na planta. A escala é:", ["1 : 20", "1 : 50", "1 : 100", "1 : 500", "1 : 2"], 1, "12 cm ÷ 600 cm = 1/50."],
      ["Qual escala mostra mais detalhes?", ["1 : 1.000.000", "1 : 500.000", "1 : 100.000", "1 : 10.000", "1 : 100"], 4, "Menor denominador = escala maior = mais detalhes."],
      ["Na escala 1 : 50, um quarto tem 8 cm × 6 cm na planta. A área real é:", ["12 m²", "24 m²", "48 m²", "120 m²", "4,8 m²"], 0, "Real: 4 m × 3 m = 12 m²."],
      ["Um mapa 1 : 25.000 mostra uma trilha de 8 cm. Ela mede:", ["200 m", "2 km", "20 km", "3,125 km", "8 km"], 1, "8 × 25.000 = 200.000 cm = 2 km."],
    ],
    [["Explique a diferença entre uma escala grande e uma escala pequena.", "Escala grande tem denominador pequeno, como 1 para 100, e mostra pouca área com muitos detalhes; escala pequena tem denominador grande e mostra uma área enorme com poucos detalhes."]],
  ),
  aula(
    "Raciocínio lógico e problemas do cotidiano",
    `## Matemática que é pura atenção

Várias questões do ENEM não exigem fórmula: pedem **organizar informações** e **testar possibilidades**.

## Estratégias

1. **Tabela:** organize os dados em linhas e colunas. Em problemas de "quem fez o quê", marque o que é impossível.
2. **Desenho:** faça um esquema de filas, mesas, caminhos ou horários.
3. **Testar as alternativas:** às vezes é mais rápido colocar cada opção no problema e ver qual funciona.
4. **Casos pequenos:** se o problema fala de 100 itens, veja o que acontece com 1, 2, 3 e descubra o padrão.

## Sequências e padrões

"Um pisca-pisca acende azul, vermelho, verde, azul, vermelho, verde... Qual a cor da 50ª lâmpada?" O padrão tem 3 cores. 50 ÷ 3 dá resto 2: a 2ª cor, **vermelho**.

## Calendário e horários

"Se hoje é segunda, que dia será daqui a 100 dias?" 100 ÷ 7 dá resto 2: dois dias depois de segunda, **quarta-feira**.

Fusos e horários: some ou subtraia as horas com cuidado ao passar da meia-noite.

## Lógica de proposições

- "Todo A é B" não significa que "todo B é A". Todo gato é mamífero, mas nem todo mamífero é gato.
- A negação de "todos estudaram" é "**pelo menos um** não estudou".

## Ler com atenção

A maior fonte de erro é a pressa: sublinhe as condições e confira se a resposta respeita todas.

## Resumindo

Organize com tabelas e desenhos, teste as alternativas, procure padrões com o resto da divisão e cuidado com negações e "todo".`,
    [
      "Organize dados em tabelas e desenhos.",
      "Em padrões repetitivos, use o resto da divisão.",
      "“Todo A é B” não quer dizer que todo B é A.",
      "A negação de “todos” é “pelo menos um não”.",
    ],
    [
      ["Padrão", "Regra que se repete numa sequência."],
      ["Resto da divisão", "O que sobra numa divisão inteira; indica a posição dentro de um ciclo."],
      ["Negação", "Afirmação que contraria outra."],
    ],
    [
      ["Uma sequência de cores repete amarelo, verde, azul, rosa. Qual a cor da 22ª posição?", ["Amarelo", "Verde", "Azul", "Rosa", "Branco"], 1, "22 ÷ 4 dá resto 2: segunda cor, verde."],
      ["Hoje é sexta-feira. Daqui a 30 dias será:", ["sexta", "sábado", "domingo", "segunda", "quinta"], 2, "30 ÷ 7 dá resto 2: dois dias depois de sexta, domingo."],
      ["A negação de “Todos os alunos passaram” é:", ["Nenhum aluno passou", "Todos os alunos reprovaram", "Pelo menos um aluno não passou", "Alguns alunos passaram", "Metade passou"], 2, "Basta um não ter passado para a frase ser falsa."],
      ["“Todo atleta é disciplinado.” Logo:", ["todo disciplinado é atleta", "quem não é atleta não é disciplinado", "se Ana é atleta, Ana é disciplinada", "nenhum disciplinado é atleta", "alguns atletas não são disciplinados"], 2, "Se Ana pertence ao grupo dos atletas, pertence ao dos disciplinados."],
      ["Um relógio adianta 2 minutos por dia. Em quantos dias adianta 1 hora?", ["20", "24", "30", "60", "120"], 2, "60 ÷ 2 = 30 dias."],
    ],
    [["Explique como descobrir a cor da centésima lâmpada de um pisca-pisca que repete 4 cores.", "Divide-se 100 pela quantidade de cores do ciclo, 4; o resto indica a posição dentro do ciclo, e como o resto é zero, a lâmpada tem a última cor do padrão."]],
  ),
  aula(
    "Conversão de unidades: área, volume e tempo",
    `## Por que tanta gente erra

O ENEM mistura unidades de propósito: metros e centímetros, litros e metros cúbicos, horas e minutos. Converter certo é metade da questão.

## Comprimento

km → hm → dam → **m** → dm → cm → mm: cada passo multiplica (descendo) ou divide (subindo) por **10**.

1 km = 1.000 m; 1 m = 100 cm.

## Área

Cada passo vale **100** (10²):

1 m² = 100 dm² = 10.000 cm².
1 km² = 1.000.000 m².
1 hectare (ha) = 10.000 m² (um quadrado de 100 m × 100 m).

## Volume

Cada passo vale **1.000** (10³):

1 m³ = 1.000 dm³ = 1.000.000 cm³.
**1 dm³ = 1 litro**; 1 cm³ = 1 mL; 1 m³ = 1.000 L.

## Tempo

O tempo não é decimal: 1 h = 60 min; 1 min = 60 s.

- 1,5 h = 1 h 30 min (não 1 h 50 min!).
- 2 h 15 min = 2,25 h.
- 0,2 h = 12 min.

## Massa

1 kg = 1.000 g; 1 tonelada = 1.000 kg.

## Dica de prova

Cuidado com o tempo em notação decimal nas calculadoras e planilhas: 3,75 h são 3 h 45 min. Multiplique a parte decimal por 60 para achar os minutos.

## Estratégia

1. Antes de calcular, passe **tudo para a mesma unidade**.
2. Prefira a unidade que a resposta pede.
3. Confira se o resultado faz sentido (uma piscina não tem 3 litros).

## Resumindo

Comprimento: 10 em 10. Área: 100 em 100. Volume: 1.000 em 1.000, com 1 dm³ = 1 L. Tempo: base 60, então 1,5 h = 1 h 30 min.`,
    [
      "Comprimento varia de 10 em 10; área de 100 em 100; volume de 1.000 em 1.000.",
      "1 dm³ = 1 L; 1 m³ = 1.000 L; 1 cm³ = 1 mL.",
      "1 hectare = 10.000 m².",
      "Tempo é base 60: 1,5 h = 1 h 30 min.",
    ],
    [
      ["Hectare", "Unidade de área igual a 10.000 m²."],
      ["Decímetro cúbico", "Volume de um cubo de 10 cm de aresta, igual a 1 litro."],
      ["Sistema decimal", "Sistema em que as unidades mudam de 10 em 10."],
    ],
    [
      ["Quantos m² há em 3 hectares?", ["300", "3.000", "30.000", "300.000", "3.000.000"], 2, "1 ha = 10.000 m², então 3 ha = 30.000 m²."],
      ["2,5 m³ correspondem a:", ["25 L", "250 L", "2.500 L", "25.000 L", "2,5 L"], 2, "1 m³ = 1.000 L."],
      ["2,4 horas equivalem a:", ["2 h 4 min", "2 h 24 min", "2 h 40 min", "2 h 14 min", "3 h"], 1, "0,4 h × 60 = 24 min."],
      ["Uma seringa tem 5 cm³. Isso é:", ["0,5 mL", "5 mL", "50 mL", "5 L", "0,05 L"], 1, "1 cm³ = 1 mL."],
      ["Um terreno de 0,03 km² tem quantos m²?", ["300", "3.000", "30.000", "300.000", "30"], 2, "1 km² = 1.000.000 m²; 0,03 × 1.000.000 = 30.000."],
    ],
    [["Por que 1,5 hora não é igual a 1 hora e 50 minutos?", "Porque o tempo é contado na base 60; meia hora é metade de 60 minutos, ou seja, 30 minutos, então 1,5 hora é 1 hora e 30 minutos."]],
  ),
];
