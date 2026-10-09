import type { Materia } from "../catalog";

export const MATEMATICA: Materia[] = [
  {
    slug: "matematica",
    name: "Matemática",
    area: "matematica",
    lessons: [
      {
        title: "Razão, proporção e porcentagem",
        content: `## A base de quase tudo

Razão, proporção e porcentagem aparecem em uma enorme parte das questões de Matemática do ENEM, quase sempre em situações do dia a dia: receitas, preços, descontos, mapas e misturas.

## Razão e proporção

**Razão** é a comparação entre duas quantidades por divisão. Se numa sala há 12 meninas e 18 meninos, a razão de meninas para meninos é 12/18 = 2/3.

**Proporção** é a igualdade entre duas razões. Se uma receita usa 2 xícaras de farinha para 3 ovos, para 6 ovos serão 4 xícaras.

## Grandezas diretamente e inversamente proporcionais

- **Diretamente proporcionais:** quando uma dobra, a outra também dobra. Exemplo: quantidade de gasolina e preço pago.
- **Inversamente proporcionais:** quando uma dobra, a outra cai pela metade. Exemplo: número de pedreiros e tempo para terminar uma obra.

## Regra de três

Exemplo direto: 3 kg de arroz custam R$ 15,00. Quanto custam 7 kg? 3 está para 15 assim como 7 está para x. Então x = 15 × 7 ÷ 3 = **R$ 35,00**.

Exemplo inverso: 4 torneiras enchem um tanque em 6 horas. Em quanto tempo 8 torneiras enchem? Mais torneiras, menos tempo: 4 × 6 = 8 × x, então x = **3 horas**.

Na **regra de três composta**, com três ou mais grandezas, analise cada uma em relação à que se quer descobrir, uma de cada vez.

## Porcentagem

**Porcentagem** é uma razão com denominador 100. 25% = 25/100 = 0,25.

- 20% de 150 = 0,20 × 150 = **30**.
- **Aumento de 15%:** multiplique por 1,15.
- **Desconto de 15%:** multiplique por 0,85.

## Aumentos e descontos sucessivos

**Cuidado:** um aumento de 10% seguido de um desconto de 10% **não** volta ao preço original. Um produto de R$ 100,00 sobe para 110 e depois cai para 110 × 0,9 = **R$ 99,00**.

Para aplicar várias mudanças, multiplique os fatores: dois aumentos de 10% equivalem a 1,1 × 1,1 = 1,21, ou seja, **21%** de aumento, e não 20%.

## Juros

- **Juros simples:** o juro é sempre calculado sobre o valor inicial. J = C × i × t.
- **Juros compostos:** o juro rende juro. M = C × (1 + i)^t. É como funcionam as dívidas de cartão e as aplicações financeiras.

## Resumindo

Na regra de três, veja se as grandezas são diretas ou inversas. Aumento de x% é multiplicar por (1 + x/100); desconto, por (1 − x/100). Mudanças sucessivas se multiplicam.`,
        highlights: [
          "Diretamente proporcionais: uma dobra, a outra dobra. Inversamente: uma dobra, a outra cai pela metade.",
          "Aumento de 15%: multiplique por 1,15. Desconto de 15%: multiplique por 0,85.",
          "Aumento de 10% e depois desconto de 10% não volta ao valor inicial.",
          "Mudanças percentuais sucessivas se multiplicam.",
        ],
        keyPoints: [
          { term: "Razão", explanation: "Comparação entre duas quantidades por meio de uma divisão." },
          { term: "Fator multiplicativo", explanation: "Número pelo qual se multiplica para aplicar uma porcentagem, como 1,15 ou 0,85." },
          { term: "Juros compostos", explanation: "Juros calculados sobre o valor já acrescido dos juros anteriores." },
        ],
      },
      {
        title: "Escalas, unidades de medida e grandezas",
        content: `## Escala

**Escala** é a razão entre a medida no desenho (ou mapa) e a medida real, sempre **na mesma unidade**.

Exemplo: numa planta com escala 1:50, cada 1 cm do desenho representa 50 cm reais. Uma parede de 8 cm na planta mede 8 × 50 = 400 cm = **4 m**.

Num mapa de escala 1:2.000.000, 3 cm representam 6.000.000 cm, ou seja, **60 km**.

Atenção à **área**: se as medidas lineares estão em escala 1:50, a área fica em escala 1:2.500 (50 × 50). Ampliar uma figura 2 vezes nas medidas faz a área ficar 4 vezes maior, e o volume, 8 vezes maior.

## Conversão de unidades

- **Comprimento:** km, hm, dam, **m**, dm, cm, mm. Cada passo é × 10. 1 km = 1.000 m; 1 m = 100 cm.
- **Área:** cada passo é × 100. 1 m² = 10.000 cm². 1 hectare = 10.000 m².
- **Volume:** cada passo é × 1.000. 1 m³ = 1.000 L. **1 dm³ = 1 L** e **1 cm³ = 1 mL**.
- **Massa:** 1 kg = 1.000 g; 1 tonelada = 1.000 kg.
- **Tempo:** 1 hora = 60 min = 3.600 s. Cuidado: 1,5 h é 1 h e 30 min, e não 1 h e 50 min.

## Notação científica e ordem de grandeza

Números muito grandes ou pequenos são escritos como a × 10^n, com a entre 1 e 10. Exemplo: 3.200.000 = 3,2 × 10⁶; 0,0005 = 5 × 10⁻⁴.

## Grandezas compostas

- **Velocidade** = distância ÷ tempo.
- **Densidade** = massa ÷ volume.
- **Vazão** = volume ÷ tempo. Uma torneira com vazão de 12 L/min enche uma caixa de 1.200 L em 100 minutos.
- **Consumo** de um carro = km ÷ litros. Um carro que faz 12 km/L gasta 25 L para rodar 300 km.
- **Densidade demográfica** = habitantes ÷ área.

## Dica de prova

Antes de calcular, **coloque tudo na mesma unidade**. Grande parte dos erros no ENEM vem de misturar centímetros com metros ou minutos com horas.

## Resumindo

Escala compara desenho e realidade na mesma unidade. Em comprimento, cada passo é × 10; em área, × 100; em volume, × 1.000. 1 dm³ = 1 L. Sempre converta as unidades antes de calcular.`,
        highlights: [
          "Escala compara desenho e realidade na mesma unidade.",
          "Ampliar as medidas 2 vezes deixa a área 4 vezes e o volume 8 vezes maior.",
          "1 m³ = 1.000 L e 1 dm³ = 1 L.",
          "Coloque tudo na mesma unidade antes de calcular.",
        ],
        keyPoints: [
          { term: "Escala 1:50", explanation: "1 unidade no desenho representa 50 unidades reais." },
          { term: "Vazão", explanation: "Volume que passa por unidade de tempo, como litros por minuto." },
          { term: "Notação científica", explanation: "Escrita de um número como a × 10^n, com a entre 1 e 10." },
        ],
      },
      {
        title: "Estatística: média, mediana, moda e gráficos",
        content: `## Medidas de tendência central

- **Média aritmética:** soma de todos os valores dividida pela quantidade. As notas 6, 7 e 8 têm média (6 + 7 + 8) ÷ 3 = **7**.
- **Mediana:** o valor do meio quando os dados estão **em ordem**. Se a quantidade de dados for par, é a média dos dois do meio.
- **Moda:** o valor que **mais se repete**.

Exemplo: os salários 1.500, 1.500, 2.000, 2.500 e 20.000.

- Média = 27.500 ÷ 5 = **5.500**.
- Mediana = **2.000** (o valor do meio).
- Moda = **1.500**.

Repare que a média foi "puxada" pelo salário muito alto. Quando há **valores extremos**, a **mediana** representa melhor o grupo. Isso é muito cobrado no ENEM.

## Média ponderada

Quando os valores têm pesos diferentes, multiplique cada um pelo seu peso e divida pela soma dos pesos. Exemplo: prova com peso 2 e nota 8, trabalho com peso 1 e nota 5. Média = (8 × 2 + 5 × 1) ÷ 3 = 21 ÷ 3 = **7**.

## Dispersão

Duas turmas podem ter a mesma média e comportamentos diferentes. A **amplitude** (maior valor menos o menor) e o **desvio padrão** medem o quanto os dados se espalham. **Menor desvio padrão significa mais regularidade.** Num concurso, o candidato com notas mais regulares é o de menor desvio padrão.

## Leitura de gráficos e tabelas

O ENEM traz muitos gráficos. Antes de responder:

1. Leia o **título**, os **eixos** e as **unidades**.
2. Veja se o eixo começa do zero: gráficos que começam de outro valor exageram as diferenças.
3. Diferencie **valores absolutos** de **porcentagens**.

Tipos principais:

- **Gráfico de barras ou colunas:** compara quantidades.
- **Gráfico de linhas:** mostra a evolução ao longo do tempo.
- **Gráfico de setores (pizza):** mostra as partes de um todo. O ângulo de cada setor é proporcional à porcentagem: 25% corresponde a 90°.
- **Histograma:** frequência por faixas de valores.

## Resumindo

Média é a soma dividida pela quantidade; mediana é o valor do meio (com os dados em ordem); moda é o mais frequente. Com valores extremos, prefira a mediana. Menor desvio padrão significa mais regularidade.`,
        highlights: [
          "Mediana é o valor do meio, com os dados em ordem.",
          "Com valores extremos, a mediana representa melhor o grupo que a média.",
          "Média ponderada: multiplique pelos pesos e divida pela soma dos pesos.",
          "Menor desvio padrão significa dados mais regulares.",
        ],
        keyPoints: [
          { term: "Moda", explanation: "O valor que aparece com mais frequência." },
          { term: "Desvio padrão", explanation: "Mede o quanto os dados se afastam da média." },
          { term: "Gráfico de setores", explanation: "Mostra partes de um todo; 25% equivale a um ângulo de 90°." },
        ],
      },
      {
        title: "Probabilidade e contagem",
        content: `## Princípio fundamental da contagem

Se uma escolha pode ser feita de **m** maneiras e outra de **n** maneiras, as duas juntas podem ser feitas de **m × n** maneiras.

Exemplo: 3 camisetas e 4 calças formam 3 × 4 = **12** combinações de roupa. Uma senha de 4 dígitos (0 a 9, com repetição) tem 10 × 10 × 10 × 10 = **10.000** possibilidades.

## Permutação, arranjo e combinação

- **Permutação:** organizar **todos** os elementos. De quantas formas 4 pessoas podem formar uma fila? 4! = 4 × 3 × 2 × 1 = **24**.
- **Arranjo:** escolher **alguns** elementos em que **a ordem importa**. Um pódio com 1º, 2º e 3º lugar entre 8 corredores: 8 × 7 × 6 = **336**.
- **Combinação:** escolher alguns elementos em que **a ordem não importa**. Uma comissão de 3 pessoas entre 8: 336 ÷ 3! = 336 ÷ 6 = **56**.

A pergunta-chave é: **trocar a ordem muda o resultado?** Se muda (pódio, senha, cargos diferentes), é arranjo. Se não muda (comissão, grupo, salada de frutas), é combinação.

## Probabilidade

**Probabilidade** = casos favoráveis ÷ casos possíveis.

Ao lançar um dado, a chance de sair um número par é 3 ÷ 6 = **1/2 = 50%**.

Propriedades:

- A probabilidade vai de **0** (impossível) a **1** (certo).
- A chance de **não** acontecer = 1 − a chance de acontecer. Se a chance de chover é 30%, a de não chover é 70%.

## Eventos "e" e "ou"

- **E** (os dois acontecem, eventos independentes): **multiplique**. A chance de tirar cara duas vezes seguidas numa moeda é 1/2 × 1/2 = **1/4**.
- **OU** (um ou outro, sem acontecer juntos): **some**. Num dado, a chance de sair 1 ou 2 é 1/6 + 1/6 = **1/3**.

## Sem reposição

Se os elementos não voltam, o total diminui. Numa caixa com 3 bolas vermelhas e 2 azuis, a chance de tirar duas vermelhas seguidas, sem devolver, é 3/5 × 2/4 = 6/20 = **3/10**.

## Resumindo

Na contagem, multiplique as possibilidades de cada etapa. Se a ordem importa, é arranjo; se não importa, é combinação. Probabilidade é favoráveis sobre possíveis; "e" multiplica e "ou" soma.`,
        highlights: [
          "Princípio da contagem: multiplique as possibilidades de cada etapa.",
          "Ordem importa: arranjo. Ordem não importa: combinação.",
          "Probabilidade = casos favoráveis ÷ casos possíveis.",
          "Eventos com 'e' se multiplicam; com 'ou' (exclusivos) se somam.",
        ],
        keyPoints: [
          { term: "Fatorial (n!)", explanation: "Produto de n até 1: 4! = 24. Conta as permutações de n elementos." },
          { term: "Combinação", explanation: "Escolha de elementos em que a ordem não importa." },
          { term: "Evento complementar", explanation: "A chance de não acontecer é 1 menos a chance de acontecer." },
        ],
      },
      {
        title: "Geometria plana e espacial",
        content: `## Áreas das figuras planas

- **Retângulo:** base × altura.
- **Quadrado:** lado × lado.
- **Triângulo:** base × altura ÷ 2.
- **Trapézio:** (base maior + base menor) × altura ÷ 2.
- **Círculo:** π × r². O **comprimento da circunferência** é 2 × π × r. Use π ≈ 3,14 (ou 3, quando a questão indicar).

Exemplo: um terreno retangular de 12 m por 20 m tem 240 m². Para cercá-lo, é preciso medir o **perímetro**: 2 × (12 + 20) = 64 m.

**Área** é o espaço ocupado (m²); **perímetro** é o contorno (m). Questões de pisos e azulejos pedem área; de cercas e rodapés, perímetro.

## Teorema de Pitágoras

Num triângulo **retângulo**, o quadrado da hipotenusa (o lado maior, oposto ao ângulo reto) é a soma dos quadrados dos catetos: **a² = b² + c²**.

Exemplo: uma escada encostada numa parede, com o pé a 3 m da parede e o topo a 4 m de altura, mede √(9 + 16) = √25 = **5 m**. Os ternos 3, 4, 5 e 6, 8, 10 aparecem muito.

## Semelhança de triângulos

Triângulos semelhantes têm ângulos iguais e lados proporcionais. É assim que se calcula a altura de um prédio pela sombra: se uma pessoa de 1,8 m faz sombra de 1,2 m, um prédio que faz sombra de 20 m tem 1,8 × 20 ÷ 1,2 = **30 m**.

## Volumes

- **Prisma** (como o paralelepípedo, a caixa): área da base × altura. Uma caixa-d'água de 2 m × 1 m × 1 m tem 2 m³ = 2.000 L.
- **Cilindro:** π × r² × altura.
- **Pirâmide e cone:** área da base × altura ÷ 3.
- **Esfera:** 4/3 × π × r³.

## Planificação e vistas

O ENEM pede muito para reconhecer a **planificação** de sólidos (a "caixa desmontada") e as **vistas** (de frente, de cima, de lado) de um objeto. Imagine o sólido montado e confira o número de faces e a posição de cada uma.

## Resumindo

Área é espaço ocupado; perímetro é o contorno. Pitágoras: a² = b² + c². Triângulos semelhantes têm lados proporcionais. Volume do prisma e do cilindro é área da base vezes a altura; da pirâmide e do cone, divida por 3.`,
        highlights: [
          "Área do triângulo: base × altura ÷ 2; área do círculo: π × r².",
          "Pitágoras: a² = b² + c², só em triângulos retângulos.",
          "Triângulos semelhantes têm lados proporcionais: altura pela sombra.",
          "Volume de prisma e cilindro: área da base × altura; cone e pirâmide: divida por 3.",
        ],
        keyPoints: [
          { term: "Perímetro", explanation: "Soma das medidas dos lados, o contorno da figura." },
          { term: "Hipotenusa", explanation: "Lado oposto ao ângulo reto, o maior do triângulo retângulo." },
          { term: "Planificação", explanation: "Figura plana obtida ao 'desmontar' um sólido." },
        ],
      },
      {
        title: "Funções e leitura de gráficos",
        content: `## O que é uma função

Uma **função** relaciona duas grandezas: para cada valor de x existe um único valor de y. No dia a dia: o preço de uma corrida de táxi depende da distância; a conta de água depende do consumo.

## Função do 1º grau (afim)

Forma: **y = a × x + b**.

- **b** é o valor fixo, o ponto onde a reta corta o eixo y.
- **a** é a taxa de variação: quanto y aumenta a cada unidade de x.

Exemplo: um táxi cobra R$ 5,00 de bandeirada mais R$ 3,00 por km. O preço é P = 3x + 5. Uma corrida de 10 km custa 3 × 10 + 5 = **R$ 35,00**.

O gráfico é uma **reta**. Se a > 0, a reta sobe (função crescente); se a < 0, desce (decrescente).

Para comparar dois planos (por exemplo, duas operadoras de celular), iguale as duas funções para achar a partir de que ponto um fica mais vantajoso.

## Função do 2º grau (quadrática)

Forma: **y = a × x² + b × x + c**. O gráfico é uma **parábola**.

- Se a > 0, a parábola tem a "boca" para cima e um **ponto mínimo**.
- Se a < 0, tem a "boca" para baixo e um **ponto máximo**.

O **vértice** dá o valor máximo ou mínimo, e o seu x é **x = −b ÷ (2a)**. Isso aparece em questões de lucro máximo, área máxima e altura máxima de um objeto lançado.

As **raízes** (onde a parábola corta o eixo x) são encontradas pela fórmula de Bhaskara: Δ = b² − 4ac e x = (−b ± √Δ) ÷ 2a.

## Função exponencial

Forma: **y = a × b^x**. Cresce (ou diminui) cada vez mais rápido. Aparece em crescimento de populações de bactérias, juros compostos e decaimento radioativo. Exemplo: uma população que **dobra a cada hora** e começa com 100 terá 100 × 2³ = **800** depois de 3 horas.

## Logaritmo

É a operação inversa da exponencial: log₁₀ 1000 = 3, porque 10³ = 1000. Aparece na escala de pH, na escala Richter de terremotos e nos decibéis do som.

## Leitura de gráficos de funções

Muitas questões não pedem cálculo, só **interpretação**: em que intervalo a função cresce, qual é o valor máximo, onde dois gráficos se cruzam (o ponto em que as duas situações se igualam).

## Resumindo

Função afim: y = ax + b, gráfico em reta; a é a taxa de variação e b o valor fixo. Função quadrática: parábola, com máximo ou mínimo no vértice, em x = −b/2a. Exponencial cresce multiplicando.`,
        highlights: [
          "Função afim y = ax + b: b é o valor fixo e a, a taxa de variação.",
          "Na parábola, o vértice dá o máximo ou o mínimo, em x = −b ÷ 2a.",
          "Exponencial cresce multiplicando: população que dobra a cada hora.",
          "O cruzamento de dois gráficos mostra quando duas situações se igualam.",
        ],
        keyPoints: [
          { term: "Taxa de variação", explanation: "Quanto y muda para cada unidade de x; é o 'a' da função afim." },
          { term: "Vértice da parábola", explanation: "Ponto de máximo ou de mínimo da função do 2º grau." },
          { term: "Função exponencial", explanation: "Função do tipo y = a × b^x, que cresce ou decresce multiplicando." },
        ],
      },
    ],
  },
];
