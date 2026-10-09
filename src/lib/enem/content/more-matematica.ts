import type { EnemLesson } from "./types";

/** Aulas a mais de Matemática (entram depois das primeiras). */
export const MORE_MATEMATICA: Record<string, EnemLesson[]> = {
  matematica: [
    {
      title: "Números: frações, decimais e potências",
      content: `## A base das contas

Muitas questões do ENEM parecem difíceis só porque misturam frações, decimais e porcentagens. Dominar esses números deixa tudo mais rápido.

## Frações

Uma fração representa partes de um todo: em 3/4, o inteiro foi dividido em 4 partes e pegamos 3.

- **Somar e subtrair:** precisa do mesmo denominador. 1/2 + 1/3 = 3/6 + 2/6 = **5/6**.
- **Multiplicar:** multiplica em cima e embaixo. 2/3 × 3/5 = 6/15 = **2/5**.
- **Dividir:** multiplica pelo inverso da segunda. 1/2 ÷ 1/4 = 1/2 × 4/1 = **2**.
- **Fração de um número:** 3/4 de 200 = 200 ÷ 4 × 3 = **150**.

## Decimais e porcentagens

Fração, decimal e porcentagem são formas diferentes do mesmo número:

- 1/2 = 0,5 = 50%
- 1/4 = 0,25 = 25%
- 3/4 = 0,75 = 75%
- 1/5 = 0,2 = 20%
- 1/10 = 0,1 = 10%

Comparar números fica fácil quando todos estão na mesma forma. Qual é maior, 3/8 ou 0,4? 3/8 = 0,375, então **0,4 é maior**.

## Potências

Potência é multiplicar um número por ele mesmo várias vezes: 2³ = 2 × 2 × 2 = 8.

- a⁰ = 1 (todo número diferente de zero elevado a zero é 1).
- Multiplicação de mesma base: soma os expoentes. 10² × 10³ = 10⁵.
- Divisão de mesma base: subtrai os expoentes. 10⁶ ÷ 10² = 10⁴.
- Expoente negativo: 10⁻² = 1/100 = 0,01.

## Raízes

A raiz quadrada é a operação inversa do quadrado: √49 = 7, porque 7² = 49. Raízes aparecem em áreas (o lado de um quadrado de área 64 m² é 8 m) e no teorema de Pitágoras.

## MMC e MDC

- **MMC** (mínimo múltiplo comum): usado para saber **quando** eventos voltam a coincidir. Ônibus que passam a cada 12 e a cada 18 minutos voltam a sair juntos depois de **36 minutos** (MMC de 12 e 18).
- **MDC** (máximo divisor comum): usado para **dividir** em partes iguais do maior tamanho possível. Cortar fitas de 24 cm e 36 cm em pedaços iguais, sem sobra e do maior tamanho: **12 cm** (MDC de 24 e 36).

## Arredondamento e estimativa

Antes de calcular, faça uma estimativa: ela ajuda a eliminar alternativas absurdas. Se o resultado deve ficar perto de 500, uma alternativa de 50 ou de 5.000 está errada.

## Resumindo

Para somar frações, iguale os denominadores; para dividir, multiplique pelo inverso. Fração, decimal e porcentagem são o mesmo número em formas diferentes. MMC responde "quando coincidem"; MDC, "maior pedaço igual".`,
      highlights: [
        "Para somar frações, use o mesmo denominador; para dividir, multiplique pelo inverso.",
        "1/4 = 0,25 = 25%: fração, decimal e porcentagem são o mesmo número.",
        "MMC: quando eventos voltam a coincidir. MDC: dividir no maior pedaço igual.",
        "Estime o resultado antes para eliminar alternativas absurdas.",
      ],
      keyPoints: [
        { term: "MMC", explanation: "Menor número que é múltiplo de todos; responde 'quando coincidem'." },
        { term: "MDC", explanation: "Maior número que divide todos; responde 'maior parte igual possível'." },
        { term: "Potência de 10", explanation: "Forma prática de escrever números grandes e pequenos: 10⁻² = 0,01." },
      ],
    },
    {
      title: "Equações e sistemas: traduzir o problema",
      content: `## Transformar texto em conta

A maior dificuldade em muitos problemas não é a conta, e sim **traduzir o texto** para a linguagem da Matemática. Chame o valor desconhecido de x e escreva o que o texto diz.

## Equação do 1º grau

Uma equação é uma igualdade com um valor desconhecido. Para resolver, isole o x, fazendo a mesma operação dos dois lados.

Exemplo: "O dobro de um número mais 7 é igual a 25." Equação: 2x + 7 = 25. Então 2x = 18 e **x = 9**.

Exemplo do dia a dia: um plano de celular custa R$ 30,00 por mês mais R$ 0,50 por minuto. Com uma conta de R$ 45,00, quantos minutos foram usados? 30 + 0,5x = 45, então 0,5x = 15 e **x = 30 minutos**.

## Traduções comuns

- "O dobro de x": 2x. "O triplo": 3x. "A metade": x/2.
- "x aumentado de 5": x + 5. "5 a menos que x": x − 5.
- "A soma de dois números consecutivos": x + (x + 1).
- "x é 20% maior que y": x = 1,2y.

## Sistemas de equações

Quando há **duas incógnitas**, é preciso de **duas equações**.

Exemplo: num estacionamento há carros e motos, num total de 20 veículos e 64 rodas. Quantos são carros?

- c + m = 20
- 4c + 2m = 64

Da primeira, m = 20 − c. Substituindo: 4c + 2(20 − c) = 64, então 4c + 40 − 2c = 64, 2c = 24 e **c = 12 carros** (e 8 motos).

Dois métodos: **substituição** (isolar uma incógnita e substituir na outra equação) e **adição** (somar as equações para eliminar uma incógnita).

## Inequações

Quando a pergunta é "no mínimo", "no máximo", "a partir de quanto", usamos uma desigualdade. Exemplo: com R$ 100,00, quantos ingressos de R$ 12,00 posso comprar? 12x ≤ 100, então x ≤ 8,33. Como não dá para comprar parte de ingresso, a resposta é **8**.

Atenção: nas inequações, ao multiplicar ou dividir por um número negativo, o sinal da desigualdade **inverte**.

## Confira a resposta

Depois de resolver, substitua o valor no problema original. No exemplo do estacionamento: 12 carros têm 48 rodas e 8 motos têm 16; 48 + 16 = 64. Confere.

## Resumindo

Traduza o texto: chame o desconhecido de x e escreva a igualdade. Com duas incógnitas, monte duas equações e use substituição ou adição. Em "no máximo" e "no mínimo", use inequações e arredonde de acordo com o problema.`,
      highlights: [
        "Traduza o texto: chame o valor desconhecido de x.",
        "Duas incógnitas exigem duas equações (substituição ou adição).",
        "Em 'no máximo' e 'no mínimo', use inequações e arredonde pelo contexto.",
        "Sempre confira a resposta substituindo no problema.",
      ],
      keyPoints: [
        { term: "Equação", explanation: "Igualdade com um valor desconhecido a ser encontrado." },
        { term: "Sistema de equações", explanation: "Duas ou mais equações com as mesmas incógnitas." },
        { term: "Inequação", explanation: "Desigualdade, usada em situações de 'no mínimo' e 'no máximo'." },
      ],
    },
    {
      title: "Sequências: padrões, PA e PG",
      content: `## Encontrar o padrão

Muitas questões mostram uma sequência de figuras ou números e pedem o próximo termo ou um termo distante. O primeiro passo é descobrir **como** a sequência cresce.

## Progressão aritmética (PA)

Numa **PA**, cada termo é o anterior **somado** a um valor fixo, a **razão (r)**.

Exemplo: 3, 7, 11, 15... A razão é 4.

- **Termo geral:** aₙ = a₁ + (n − 1) × r.
  O 20º termo da sequência acima: a₂₀ = 3 + 19 × 4 = **79**.
- **Soma dos termos:** Sₙ = (a₁ + aₙ) × n ÷ 2.
  A soma dos 20 primeiros: (3 + 79) × 20 ÷ 2 = **820**.

Situações de PA: economizar o mesmo valor a mais a cada mês, uma pilha de latas em que cada fileira tem uma lata a menos, salário com aumento fixo por ano.

## Progressão geométrica (PG)

Numa **PG**, cada termo é o anterior **multiplicado** por um valor fixo, a **razão (q)**.

Exemplo: 2, 6, 18, 54... A razão é 3.

- **Termo geral:** aₙ = a₁ × q^(n − 1).
  O 6º termo: 2 × 3⁵ = 2 × 243 = **486**.

Situações de PG: populações de bactérias que dobram a cada hora, juros compostos, uma notícia que cada pessoa repassa para 3 outras, a depreciação de um carro que perde 10% do valor por ano (razão 0,9).

## PA ou PG?

- A **diferença** entre termos seguidos é constante? É **PA** (cresce somando, em linha reta).
- O **quociente** entre termos seguidos é constante? É **PG** (cresce multiplicando, cada vez mais rápido).

## Sequências de figuras

Para figuras (quadradinhos, palitos, bolinhas), conte os elementos das primeiras posições e monte a sequência numérica. Exemplo: um quadrado feito com palitos usa 4; dois quadrados lado a lado usam 7; três usam 10. A sequência é 4, 7, 10..., uma PA de razão 3. Com n quadrados, são 3n + 1 palitos. Para 50 quadrados: **151 palitos**.

## Resumindo

Na PA, soma-se a razão; na PG, multiplica-se. Termo geral da PA: a₁ + (n − 1)r; da PG: a₁ × q^(n − 1). Em sequências de figuras, conte os elementos e encontre a regra.`,
      highlights: [
        "PA: cada termo é o anterior somado à razão.",
        "PG: cada termo é o anterior multiplicado pela razão.",
        "Termo geral da PA: aₙ = a₁ + (n − 1) × r.",
        "Em sequências de figuras, conte os elementos e encontre a regra.",
      ],
      keyPoints: [
        { term: "Razão da PA", explanation: "Valor somado de um termo para o seguinte." },
        { term: "Razão da PG", explanation: "Valor pelo qual se multiplica um termo para obter o seguinte." },
        { term: "Soma da PA", explanation: "Sₙ = (primeiro + último) × número de termos ÷ 2." },
      ],
    },
    {
      title: "Matemática financeira: juros, parcelas e inflação",
      content: `## Dinheiro no tempo

O ENEM adora questões de dinheiro: compras parceladas, descontos, empréstimos, investimentos e inflação.

## Juros simples

O juro é calculado sempre sobre o **valor inicial (capital)**: J = C × i × t.

Exemplo: R$ 1.000,00 a 2% ao mês por 5 meses rendem 1.000 × 0,02 × 5 = **R$ 100,00** de juros. Montante: R$ 1.100,00.

## Juros compostos

O juro de cada mês é calculado sobre o valor **já acumulado**: M = C × (1 + i)^t.

Exemplo: R$ 1.000,00 a 10% ao ano por 2 anos: 1.000 × 1,1 × 1,1 = **R$ 1.210,00**. Com juros simples, seriam R$ 1.200,00. A diferença cresce muito com o tempo: é o "juro sobre juro".

Os juros compostos explicam por que as dívidas do **cartão de crédito** e do **cheque especial** crescem tão rápido, e por que começar a poupar cedo faz tanta diferença.

## À vista ou parcelado?

Para comparar, olhe o **total pago**. Exemplo: uma TV custa R$ 1.800,00 à vista ou 10 parcelas de R$ 200,00. Parcelado, o total é R$ 2.000,00: você paga R$ 200,00 a mais, cerca de 11% a mais.

Atenção às propagandas de "sem juros": muitas vezes o preço à vista com desconto mostra que os juros estão embutidos nas parcelas.

## Desconto e lucro

- **Desconto de 20%:** paga 80% do preço (multiplica por 0,8).
- **Lucro** = preço de venda − custo. A porcentagem de lucro pode ser calculada sobre o custo ou sobre a venda: leia com atenção qual a questão pede.

## Inflação

**Inflação** é o aumento geral dos preços, que faz o dinheiro perder **poder de compra**. Se a inflação de um ano foi de 5% e o salário não aumentou, a pessoa compra menos com o mesmo dinheiro.

- **Aumento real** de salário é o que fica acima da inflação. Um reajuste de 8% com inflação de 5% dá um ganho real de cerca de 3% (mais precisamente, 1,08 ÷ 1,05 ≈ 1,029, ou 2,9%).

## Orçamento e consumo consciente

Muitas questões tratam de planejar gastos: somar despesas fixas e variáveis, calcular quanto sobra, comparar tarifas e planos. Leia todas as condições do problema antes de calcular.

## Resumindo

Juros simples incidem sempre sobre o capital; compostos, sobre o montante acumulado. Para comparar à vista e parcelado, veja o total pago. Inflação reduz o poder de compra; aumento real é o que supera a inflação.`,
      highlights: [
        "Juros simples: J = C × i × t, sempre sobre o valor inicial.",
        "Juros compostos: M = C × (1 + i)^t, juro sobre juro.",
        "Para comparar à vista e parcelado, compare o total pago.",
        "Aumento real é o que fica acima da inflação.",
      ],
      keyPoints: [
        { term: "Montante", explanation: "Capital mais os juros acumulados." },
        { term: "Inflação", explanation: "Aumento geral dos preços, que reduz o poder de compra." },
        { term: "Aumento real", explanation: "Ganho do salário descontada a inflação do período." },
      ],
    },
    {
      title: "Ângulos e trigonometria no triângulo retângulo",
      content: `## Ângulos

Um ângulo mede uma abertura, em **graus**. Uma volta completa tem 360°; meia volta, 180°; um ângulo reto, 90°.

- A soma dos ângulos internos de um **triângulo** é **180°**.
- A de um **quadrilátero** é 360°.
- Num polígono de n lados, a soma dos ângulos internos é (n − 2) × 180°.

Ângulos aparecem em relógios (o ponteiro das horas anda 30° por hora), em rampas, em telhados e na navegação.

## Trigonometria no triângulo retângulo

Num triângulo retângulo, escolhido um ângulo agudo, os lados recebem nomes:

- **Hipotenusa:** o maior lado, oposto ao ângulo reto.
- **Cateto oposto:** o lado em frente ao ângulo escolhido.
- **Cateto adjacente:** o lado junto ao ângulo, que não é a hipotenusa.

As razões trigonométricas:

- **Seno** = cateto oposto ÷ hipotenusa.
- **Cosseno** = cateto adjacente ÷ hipotenusa.
- **Tangente** = cateto oposto ÷ cateto adjacente.

## Ângulos notáveis

- sen 30° = 1/2; cos 30° = √3/2; tg 30° = √3/3.
- sen 45° = cos 45° = √2/2; tg 45° = 1.
- sen 60° = √3/2; cos 60° = 1/2; tg 60° = √3.

## Aplicações

**Altura de um prédio:** uma pessoa a 20 m de um prédio vê o topo sob um ângulo de 45°. Como tg 45° = 1, a altura (cateto oposto) é igual à distância (cateto adjacente): **20 m**.

**Rampa:** uma rampa com 10 m de comprimento e inclinação de 30° sobe 10 × sen 30° = 10 × 1/2 = **5 m**.

**Inclinação em porcentagem:** uma rampa de 8% sobe 8 m a cada 100 m na horizontal. As normas de acessibilidade limitam a inclinação das rampas para cadeirantes.

## Dica de prova

Identifique o ângulo dado, marque qual lado você conhece e qual quer descobrir. Depois escolha a razão que liga esses dois lados: oposto e hipotenusa → seno; adjacente e hipotenusa → cosseno; oposto e adjacente → tangente.

## Resumindo

A soma dos ângulos de um triângulo é 180°. Seno = oposto ÷ hipotenusa; cosseno = adjacente ÷ hipotenusa; tangente = oposto ÷ adjacente. Guarde os valores de 30°, 45° e 60°.`,
      highlights: [
        "A soma dos ângulos internos de um triângulo é 180°.",
        "Seno = oposto/hipotenusa; cosseno = adjacente/hipotenusa; tangente = oposto/adjacente.",
        "tg 45° = 1: altura igual à distância.",
        "sen 30° = 1/2: uma rampa de 10 m a 30° sobe 5 m.",
      ],
      keyPoints: [
        { term: "Cateto oposto", explanation: "Lado do triângulo retângulo em frente ao ângulo considerado." },
        { term: "Tangente", explanation: "Razão entre o cateto oposto e o adjacente." },
        { term: "Inclinação de 8%", explanation: "Sobe 8 unidades a cada 100 na horizontal." },
      ],
    },
    {
      title: "Geometria espacial: sólidos, vistas e capacidade",
      content: `## Sólidos geométricos

- **Poliedros** têm faces planas: cubo, paralelepípedo, prismas e pirâmides.
- **Corpos redondos** têm superfícies curvas: cilindro, cone e esfera.

Num poliedro convexo vale a **relação de Euler**: **V − A + F = 2** (vértices menos arestas mais faces). O cubo tem 8 vértices, 12 arestas e 6 faces: 8 − 12 + 6 = 2.

## Planificação

A **planificação** é o sólido "aberto" no plano. O cubo tem 6 quadrados; o cilindro, dois círculos e um retângulo; o cone, um círculo e um setor circular; a pirâmide de base quadrada, um quadrado e quatro triângulos.

O ENEM pede para reconhecer qual planificação forma uma caixa, ou quais faces ficam opostas. Imagine dobrando as faces.

## Vistas

Um objeto pode ser desenhado em **vista frontal**, **lateral** e **superior** (de cima). Um cilindro em pé, por exemplo, tem vista frontal retangular e vista superior circular. Em pilhas de cubinhos, conte as colunas de cada lado.

## Áreas e volumes

- **Área total** é a soma das áreas das faces: a quantidade de papel para embrulhar ou de tinta para pintar.
- **Volume** é o espaço interno: a capacidade.

Volumes: cubo de aresta a: a³. Paralelepípedo: comprimento × largura × altura. Cilindro: π × r² × h. Cone e pirâmide: um terço da base vezes a altura. Esfera: 4/3 × π × r³.

## Capacidade

**1 dm³ = 1 litro** e **1 m³ = 1.000 litros**. Uma piscina de 10 m × 5 m × 1,5 m tem 75 m³, ou seja, **75.000 litros**.

## Semelhança e escala no espaço

Se todas as medidas de um sólido são multiplicadas por k, a área fica multiplicada por k² e o **volume por k³**. Uma caixa com o dobro das medidas tem **8 vezes** o volume. Por isso uma pizza ou uma lata maior costuma ser mais vantajosa: o volume cresce mais rápido que as medidas.

## Embalagens

Questões comuns pedem a embalagem que gasta **menos material** para o mesmo volume, ou quantas caixas pequenas cabem em uma grande (divida as medidas, dimensão por dimensão, e multiplique os resultados).

## Resumindo

Poliedros têm faces planas; vale V − A + F = 2. Planificação é o sólido aberto; vistas são o desenho de frente, de lado e de cima. 1 m³ = 1.000 L. Ampliar as medidas k vezes multiplica o volume por k³.`,
      highlights: [
        "Relação de Euler nos poliedros: V − A + F = 2.",
        "Planificação é o sólido aberto; vistas são frente, lado e cima.",
        "1 dm³ = 1 L e 1 m³ = 1.000 L.",
        "Dobrar as medidas multiplica o volume por 8.",
      ],
      keyPoints: [
        { term: "Poliedro", explanation: "Sólido com todas as faces planas, como o cubo e a pirâmide." },
        { term: "Área total", explanation: "Soma das áreas de todas as faces do sólido." },
        { term: "Volume", explanation: "Espaço interno de um sólido, ligado à capacidade." },
      ],
    },
  ],
};
