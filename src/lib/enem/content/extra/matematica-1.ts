import { aula } from "./build";

/** Matemática, lote 1: proporcionalidade, porcentagem, médias, gráficos e funções. */
export const MATEMATICA_1 = [
  aula(
    "Regra de três simples e composta",
    `## A ferramenta mais usada do ENEM

Muitas questões de Matemática do ENEM se resolvem com **regra de três**: quando duas grandezas variam juntas, dá para descobrir um valor desconhecido a partir de três conhecidos.

## Diretamente ou inversamente proporcional?

- **Diretamente proporcionais:** quando uma dobra, a outra dobra. Ex.: quantidade de pães e preço total.
- **Inversamente proporcionais:** quando uma dobra, a outra cai pela metade. Ex.: número de pedreiros e dias para terminar uma obra.

## Regra de três simples

Se 3 kg de arroz custam R$ 15, quanto custam 5 kg?

| kg | R$ |
|---|---|
| 3 | 15 |
| 5 | x |

São diretamente proporcionais: 3x = 5 · 15 → x = 25. Custam **R$ 25**.

Se 4 torneiras enchem um tanque em 6 horas, 8 torneiras enchem em quanto tempo? Mais torneiras, **menos** tempo: inversamente proporcional. Multiplica "reto": 4 · 6 = 8 · x → x = 3 horas.

## Regra de três composta

Quando há três ou mais grandezas, compare cada uma com a incógnita separadamente.

Exemplo: 5 operários fazem 20 peças em 4 dias. Quantas peças 10 operários fazem em 6 dias?

- Mais operários → mais peças (direta).
- Mais dias → mais peças (direta).

x = 20 · (10/5) · (6/4) = 20 · 2 · 1,5 = **60 peças**.

## Dica de prova

Antes de calcular, pergunte: "se essa grandeza aumentar, a resposta aumenta ou diminui?". Isso evita o erro mais comum, que é montar uma inversa como se fosse direta.`,
    [
      "Diretamente proporcional: as duas aumentam juntas na mesma razão.",
      "Inversamente proporcional: uma aumenta e a outra diminui na mesma razão.",
      "Na composta, compare cada grandeza com a incógnita separadamente.",
      "Pergunte sempre: se isso aumentar, a resposta aumenta ou diminui?",
    ],
    [
      ["Grandeza", "Tudo o que pode ser medido ou contado: tempo, preço, quantidade."],
      ["Proporção direta", "As grandezas crescem juntas na mesma razão."],
      ["Proporção inversa", "Quando uma cresce, a outra diminui na mesma razão."],
    ],
    [
      ["Se 4 cadernos custam R$ 18, quanto custam 10 cadernos iguais?", ["R$ 36", "R$ 40", "R$ 45", "R$ 50", "R$ 72"], 2, "Diretamente proporcional: 18 ÷ 4 = 4,50 por caderno; 10 × 4,50 = R$ 45."],
      ["Uma viagem leva 6 horas a 80 km/h. Quanto tempo leva a 120 km/h?", ["3 horas", "4 horas", "5 horas", "9 horas", "10 horas"], 1, "Velocidade e tempo são inversamente proporcionais: 80 × 6 = 120 × t → t = 4 h."],
      ["Qual par de grandezas é inversamente proporcional?", ["Litros de gasolina e preço pago", "Número de trabalhadores e dias para terminar a mesma obra", "Horas trabalhadas e salário por hora fixo", "Quantidade de farinha e de bolos", "Distância percorrida e tempo a velocidade constante"], 1, "Mais trabalhadores terminam a mesma obra em menos dias: é inversa."],
      ["3 máquinas produzem 120 peças em 2 horas. Quantas peças 6 máquinas produzem em 3 horas?", ["240", "300", "360", "480", "540"], 2, "Dobrar as máquinas dobra (240) e 1,5 vez o tempo multiplica por 1,5: 360 peças."],
      ["Uma receita usa 2 ovos para 8 pessoas. Para 20 pessoas, quantos ovos?", ["4", "5", "6", "8", "10"], 1, "Diretamente proporcional: 2/8 = x/20 → x = 5 ovos."],
    ],
    [["Explique como saber se uma regra de três é direta ou inversa.", "Pergunta-se se, quando uma grandeza aumenta, a outra também aumenta (direta) ou diminui (inversa) na mesma razão."]],
  ),
  aula(
    "Porcentagem: aumentos, descontos e variações",
    `## Porcentagem é fração de 100

"25%" significa 25 de cada 100, ou 25/100 = 0,25. Para calcular a porcentagem de um valor, multiplique: 25% de 80 = 0,25 × 80 = 20.

## Aumentos e descontos com o fator

O jeito mais rápido é usar o **fator multiplicativo**:

- Aumento de 10%: multiplique por **1,10**.
- Desconto de 10%: multiplique por **0,90**.
- Aumento de 35%: × 1,35. Desconto de 35%: × 0,65.

Ex.: uma TV de R$ 2.000 com 15% de desconto custa 2.000 × 0,85 = **R$ 1.700**.

## Aumentos sucessivos não se somam

Um aumento de 10% seguido de outro de 10% **não** é 20%:

1,10 × 1,10 = 1,21 → aumento total de **21%**.

E um aumento de 20% seguido de desconto de 20% **não** volta ao preço inicial:

1,20 × 0,80 = 0,96 → no fim, o preço cai **4%**.

## Variação percentual

Para saber quanto algo mudou em porcentagem:

variação = (valor novo − valor antigo) ÷ valor antigo × 100

Se um produto foi de R$ 50 para R$ 60: (60 − 50) ÷ 50 = 0,2 → **aumento de 20%**.

## Pontos percentuais

Se a taxa de desemprego passou de 10% para 12%, ela subiu **2 pontos percentuais**, mas cresceu **20%** em relação ao valor antigo. O ENEM adora essa diferença.

## Resumindo

Use o fator (1 + taxa ou 1 − taxa), multiplique fatores em mudanças sucessivas e divida a diferença pelo valor antigo para achar a variação.`,
    [
      "Aumento de x%: multiplique por (1 + x/100); desconto: por (1 − x/100).",
      "Aumentos sucessivos se multiplicam: 10% e 10% dão 21%.",
      "Variação percentual = diferença ÷ valor antigo.",
      "Pontos percentuais são diferentes de variação percentual.",
    ],
    [
      ["Fator multiplicativo", "Número pelo qual se multiplica um valor para aplicar um aumento ou desconto."],
      ["Variação percentual", "Quanto um valor mudou em relação ao valor inicial, em porcentagem."],
      ["Ponto percentual", "Diferença simples entre duas porcentagens."],
    ],
    [
      ["Um tênis de R$ 250 teve desconto de 20%. Qual o novo preço?", ["R$ 180", "R$ 200", "R$ 210", "R$ 230", "R$ 300"], 1, "250 × 0,80 = R$ 200."],
      ["Um salário teve dois aumentos seguidos de 10%. O aumento total foi de:", ["10%", "20%", "21%", "22%", "100%"], 2, "1,10 × 1,10 = 1,21: aumento de 21%."],
      ["Um preço subiu 25% e depois caiu 20%. Em relação ao início, ele:", ["subiu 5%", "caiu 5%", "ficou igual", "subiu 45%", "caiu 25%"], 2, "1,25 × 0,80 = 1,00: voltou ao valor inicial."],
      ["A passagem foi de R$ 4,00 para R$ 5,00. A variação percentual foi de:", ["1%", "20%", "25%", "80%", "125%"], 2, "(5 − 4) ÷ 4 = 0,25 = 25%."],
      ["A inflação foi de 4% para 6%. Ela aumentou:", ["2 pontos percentuais", "2%", "6 pontos percentuais", "10%", "60%"], 0, "A diferença simples entre as taxas é de 2 pontos percentuais (o que equivale a um aumento de 50% sobre 4%)."],
    ],
    [["Por que dois aumentos de 10% não dão 20% no total?", "Porque o segundo aumento é calculado sobre o valor já aumentado; os fatores se multiplicam: 1,1 × 1,1 = 1,21, ou seja, 21%."]],
  ),
  aula(
    "Média ponderada e a nota do ENEM",
    `## Nem toda média é igual

A **média aritmética** soma os valores e divide pela quantidade. Mas quando os valores têm **importâncias diferentes**, usamos a **média ponderada**.

## Como calcular

Multiplique cada valor pelo seu **peso**, some tudo e divida pela **soma dos pesos**:

média ponderada = (v1·p1 + v2·p2 + ...) ÷ (p1 + p2 + ...)

Exemplo: uma prova vale peso 2 e um trabalho vale peso 1. Um aluno tirou 6 na prova e 9 no trabalho:

(6 · 2 + 9 · 1) ÷ (2 + 1) = 21 ÷ 3 = **7**.

Na média simples daria 7,5. A nota da prova, com peso maior, puxou a média para baixo.

## Pesos no SISU

Universidades usam média ponderada nas notas do ENEM. Um curso de Medicina pode dar peso 3 para Ciências da Natureza e peso 1 para Ciências Humanas. Por isso, saber em que área você vai melhor ajuda a escolher o curso.

## Descobrindo a nota que falta

Muitas questões perguntam: "quanto o aluno precisa tirar para ter média 7?". Monte a equação:

Se as notas 5 e 7 têm peso 1 e a última tem peso 2, para média 7:

(5 + 7 + 2x) ÷ 4 = 7 → 12 + 2x = 28 → x = **8**.

## Cuidados

- Sempre divida pela **soma dos pesos**, não pela quantidade de notas.
- Porcentagens também podem ser pesos: 40% e 60% funcionam como pesos 4 e 6.

## Resumindo

Média ponderada: multiplique cada valor pelo peso, some e divida pela soma dos pesos. Para achar a nota que falta, monte a equação e resolva.`,
    [
      "Média ponderada: soma de (valor × peso) dividida pela soma dos pesos.",
      "Valores com peso maior puxam mais a média.",
      "O SISU usa pesos diferentes para cada área do ENEM.",
      "Para achar a nota que falta, monte e resolva a equação.",
    ],
    [
      ["Peso", "Número que indica a importância de um valor no cálculo da média."],
      ["Média aritmética", "Soma dos valores dividida pela quantidade de valores."],
      ["Média ponderada", "Média em que cada valor é multiplicado pelo seu peso."],
    ],
    [
      ["Notas 8 (peso 3) e 5 (peso 2). A média ponderada é:", ["6,5", "6,8", "7,0", "7,2", "6,0"], 1, "(8·3 + 5·2) ÷ 5 = (24 + 10) ÷ 5 = 6,8."],
      ["Na média ponderada, divide-se a soma dos produtos por:", ["quantidade de notas", "soma dos pesos", "maior peso", "maior nota", "número 10"], 1, "O divisor é sempre a soma dos pesos."],
      ["Um curso dá peso 4 para Matemática e peso 1 para Linguagens. Um aluno tirou 700 e 500. A média é:", ["600", "620", "640", "660", "680"], 3, "(700·4 + 500·1) ÷ 5 = 3300 ÷ 5 = 660."],
      ["Duas notas 6 e 8 têm peso 1, e a terceira tem peso 2. Para média 7, a terceira nota deve ser:", ["6", "6,5", "7", "7,5", "8"], 2, "(6 + 8 + 2x) ÷ 4 = 7 → 14 + 2x = 28 → x = 7."],
      ["Uma prova vale 40% e outra 60% da nota. Notas 5 e 10 dão média:", ["7,0", "7,5", "8,0", "8,5", "9,0"], 2, "0,4 × 5 + 0,6 × 10 = 2 + 6 = 8."],
    ],
    [["Explique por que a média ponderada pode ser diferente da média simples.", "Porque na média ponderada cada valor tem um peso; os valores com peso maior influenciam mais o resultado, puxando a média para perto deles."]],
  ),
  aula(
    "Leitura de gráficos e tabelas",
    `## Quase toda prova tem gráfico

O ENEM usa gráficos e tabelas em Matemática, Ciências e Humanas. Ler bem um gráfico é ganhar pontos em várias áreas.

## Tipos de gráfico

- **Barras ou colunas:** comparam quantidades entre categorias.
- **Linhas:** mostram como algo muda ao longo do tempo.
- **Setores (pizza):** mostram partes de um todo; os setores somam 100%.
- **Infográficos:** misturam números, ícones e textos.

## Roteiro de leitura

1. Leia o **título**: do que o gráfico trata?
2. Veja os **eixos**: o que está no horizontal e no vertical? Qual a **unidade** (mil, milhões, %)?
3. Observe a **escala**: o eixo começa em zero? Às vezes não, e isso exagera as diferenças.
4. Leia a **legenda** e a **fonte**.
5. Só então leia a pergunta.

## Interpretações comuns

- **Maior crescimento:** procure a linha com maior inclinação, não o maior valor.
- **Período de queda:** a linha desce.
- **Porcentagem no setor:** um setor de 90° corresponde a 25% (90 ÷ 360).

## Armadilhas

- Confundir **valor absoluto** com **porcentagem**.
- Não perceber que a unidade é "em milhares".
- Achar que uma tendência vai continuar para sempre: o gráfico mostra o que aconteceu, não garante o futuro.

## Tabelas

Em tabelas, leia o cabeçalho de cada coluna e confira a unidade. Quando a pergunta envolve "variação", calcule a diferença entre duas linhas ou colunas.

## Resumindo

Título, eixos, unidade, escala, legenda e fonte, nessa ordem. Depois, responda à pergunta com base só no que o gráfico mostra.`,
    [
      "Barras comparam categorias; linhas mostram evolução no tempo; setores mostram partes de um todo.",
      "Leia título, eixos, unidade, escala, legenda e fonte antes da pergunta.",
      "Maior crescimento é a maior inclinação, não o maior valor.",
      "Cuidado com eixos que não começam em zero e unidades em milhares.",
    ],
    [
      ["Eixo", "Linha de referência do gráfico onde ficam as categorias ou os valores."],
      ["Escala", "Como os valores estão distribuídos no eixo."],
      ["Gráfico de setores", "Círculo dividido em partes proporcionais que somam 100%."],
    ],
    [
      ["Qual gráfico é mais indicado para mostrar a evolução da temperatura ao longo de um ano?", ["Setores", "Linhas", "Pictograma de pizza", "Tabela sem números", "Mapa político"], 1, "O gráfico de linhas mostra como uma grandeza muda ao longo do tempo."],
      ["Num gráfico de setores, um setor de 72° representa qual porcentagem do total?", ["10%", "15%", "20%", "25%", "72%"], 2, "72 ÷ 360 = 0,2 = 20%."],
      ["Um gráfico de vendas tem eixo vertical em “milhares de unidades”. O valor 35 significa:", ["35 unidades", "350 unidades", "3.500 unidades", "35.000 unidades", "35 milhões"], 3, "35 mil = 35.000 unidades."],
      ["Para achar o período de maior crescimento num gráfico de linhas, procura-se:", ["o ponto mais alto", "o ponto mais baixo", "o trecho com maior inclinação para cima", "o último ponto", "a legenda"], 2, "Crescimento é a variação: o trecho mais inclinado para cima é o de maior crescimento."],
      ["Um eixo vertical que começa em 90 em vez de 0 tende a:", ["diminuir as diferenças", "exagerar visualmente as diferenças", "não mudar nada", "inverter os dados", "eliminar a legenda"], 1, "Cortar a base do eixo faz pequenas diferenças parecerem grandes."],
    ],
    [["Descreva o roteiro para ler um gráfico antes de responder a questão.", "Ler o título, os eixos e as unidades, conferir a escala, a legenda e a fonte, e só depois ler a pergunta, respondendo com base no que o gráfico mostra."]],
  ),
  aula(
    "Função afim: a reta no dia a dia",
    `## O que é função afim

Uma **função afim** (ou do 1º grau) tem a forma **f(x) = ax + b**. O gráfico é uma **reta**.

- **a** é a **taxa de variação**: quanto y muda quando x aumenta 1.
- **b** é o **valor inicial**: o valor de y quando x = 0.

## Exemplos do cotidiano

- Corrida de táxi: bandeirada de R$ 5 mais R$ 3 por km → f(x) = 3x + 5.
- Conta de celular: taxa fixa de R$ 40 mais R$ 0,50 por minuto extra → f(x) = 0,5x + 40.
- Salário com comissão: R$ 1.500 fixos mais 5% das vendas → f(x) = 0,05x + 1500.

## Crescente ou decrescente

- **a > 0:** a reta sobe (função crescente).
- **a < 0:** a reta desce (função decrescente). Ex.: um tanque que esvazia 10 litros por minuto.
- **a = 0:** a função é constante.

## Achando a lei a partir de dois pontos

Se um táxi cobra R$ 11 por 2 km e R$ 17 por 4 km:

a = (17 − 11) ÷ (4 − 2) = 6 ÷ 2 = **3** (R$ 3 por km).
Para achar b: 11 = 3 · 2 + b → b = **5**. Lei: f(x) = 3x + 5.

## Comparando planos

Questões comuns comparam dois planos: "a partir de quantos minutos o plano B fica mais barato?". Iguale as duas funções e resolva:

Plano A: 30 + 1x. Plano B: 50 + 0,5x. 30 + x = 50 + 0,5x → 0,5x = 20 → x = 40 minutos.

## Resumindo

f(x) = ax + b: "a" é a taxa por unidade, "b" é o valor fixo. Para comparar planos, iguale as funções.`,
    [
      "Função afim: f(x) = ax + b, cujo gráfico é uma reta.",
      "a é a taxa de variação; b é o valor inicial (quando x = 0).",
      "a positivo: crescente; a negativo: decrescente.",
      "Para comparar planos, iguale as duas funções.",
    ],
    [
      ["Coeficiente angular", "O número a, que indica a inclinação da reta."],
      ["Coeficiente linear", "O número b, onde a reta corta o eixo y."],
      ["Taxa de variação", "Quanto y muda quando x aumenta uma unidade."],
    ],
    [
      ["Um táxi cobra R$ 6 de bandeirada e R$ 2,50 por km. Uma corrida de 8 km custa:", ["R$ 20", "R$ 24", "R$ 26", "R$ 30", "R$ 32"], 2, "f(8) = 2,5 · 8 + 6 = 20 + 6 = R$ 26."],
      ["Na função f(x) = −4x + 100, o gráfico é uma reta:", ["crescente", "decrescente", "constante", "que passa pela origem", "vertical"], 1, "O coeficiente a = −4 é negativo, então a função é decrescente."],
      ["Uma função afim passa por (1, 5) e (3, 11). Seu coeficiente a é:", ["2", "3", "4", "5", "6"], 1, "a = (11 − 5) ÷ (3 − 1) = 6 ÷ 2 = 3."],
      ["Plano A: R$ 20 + R$ 2 por hora. Plano B: R$ 50 + R$ 1 por hora. Os planos custam o mesmo com:", ["10 horas", "20 horas", "30 horas", "40 horas", "50 horas"], 2, "20 + 2x = 50 + x → x = 30 horas."],
      ["Em f(x) = 0,05x + 1500 (salário com comissão), o número 1500 representa:", ["a comissão", "o salário fixo", "as vendas", "a porcentagem", "o lucro da empresa"], 1, "O termo independente b é o valor fixo, recebido mesmo sem vendas."],
    ],
    [["Explique o significado dos números a e b na função f(x) = ax + b em uma situação de táxi.", "O b é a bandeirada, o valor fixo pago mesmo sem rodar; o a é o preço por quilômetro, quanto a corrida aumenta a cada km rodado."]],
  ),
  aula(
    "Função quadrática: a parábola",
    `## A forma da função

A **função quadrática** (do 2º grau) tem a forma **f(x) = ax² + bx + c**, com a ≠ 0. Seu gráfico é uma **parábola**.

- **a > 0:** concavidade para cima (forma de "U"): tem um **ponto mínimo**.
- **a < 0:** concavidade para baixo (forma de "∩"): tem um **ponto máximo**.

## Raízes

As **raízes** (ou zeros) são os valores de x em que f(x) = 0, onde a parábola cruza o eixo x. Usamos a fórmula de Bhaskara:

Δ = b² − 4ac e x = (−b ± √Δ) ÷ 2a

- Δ > 0: duas raízes.
- Δ = 0: uma raiz.
- Δ < 0: nenhuma raiz real.

## O vértice: máximo ou mínimo

O vértice é o ponto mais alto ou mais baixo da parábola:

xv = −b ÷ 2a e yv = −Δ ÷ 4a (ou calcule f(xv)).

## Aplicações no ENEM

- **Lançamento de objetos:** a altura de uma bola é uma parábola; a altura máxima é o yv.
- **Lucro máximo:** se o lucro é L(x) = −2x² + 80x, o lucro máximo ocorre em xv = −80 ÷ (2 · −2) = 20 unidades.
- **Área máxima:** com 40 m de cerca, o retângulo de maior área é um quadrado de 10 m de lado.

## Dica

Quando a pergunta fala em "máximo", "mínimo", "maior altura" ou "menor custo" e a função é do 2º grau, a resposta está no **vértice**.

## Resumindo

Parábola para cima tem mínimo; para baixo, máximo. Raízes com Bhaskara; máximo ou mínimo no vértice, em x = −b/2a.`,
    [
      "f(x) = ax² + bx + c tem gráfico em forma de parábola.",
      "a > 0: mínimo; a < 0: máximo.",
      "Raízes com Bhaskara: Δ = b² − 4ac.",
      "Máximo ou mínimo ocorre no vértice, em x = −b/2a.",
    ],
    [
      ["Parábola", "Curva que é o gráfico de uma função do 2º grau."],
      ["Vértice", "Ponto de máximo ou de mínimo da parábola."],
      ["Discriminante (Δ)", "Valor b² − 4ac, que indica quantas raízes reais a função tem."],
    ],
    [
      ["A função f(x) = −x² + 6x tem concavidade:", ["para cima, com mínimo", "para baixo, com máximo", "para cima, com máximo", "para baixo, com mínimo", "reta"], 1, "a = −1 < 0: concavidade para baixo, com ponto de máximo."],
      ["O x do vértice de f(x) = x² − 8x + 3 é:", ["−4", "2", "4", "8", "3"], 2, "xv = −b ÷ 2a = 8 ÷ 2 = 4."],
      ["A altura de uma bola é h(t) = −5t² + 20t. A altura máxima é:", ["10 m", "15 m", "20 m", "25 m", "40 m"], 2, "tv = −20 ÷ (−10) = 2; h(2) = −20 + 40 = 20 m."],
      ["As raízes de f(x) = x² − 5x + 6 são:", ["1 e 6", "2 e 3", "−2 e −3", "5 e 6", "0 e 5"], 1, "Δ = 25 − 24 = 1; x = (5 ± 1) ÷ 2 → 3 e 2."],
      ["Se Δ < 0, a parábola:", ["corta o eixo x em dois pontos", "toca o eixo x em um ponto", "não corta o eixo x", "é uma reta", "passa pela origem"], 2, "Com Δ negativo não há raízes reais: a parábola não toca o eixo x."],
    ],
    [["Em um problema de lucro máximo com função do 2º grau, onde está a resposta e por quê?", "Está no vértice da parábola, porque, com a negativo, a concavidade é para baixo e o vértice é o ponto mais alto, ou seja, o lucro máximo."]],
  ),
  aula(
    "Função exponencial: crescimento rápido",
    `## Quando a variação é multiplicada

Na função afim, a cada passo **somamos** o mesmo valor. Na **função exponencial**, a cada passo **multiplicamos** pelo mesmo fator. A forma é:

f(x) = a · bˣ

- **a:** valor inicial.
- **b:** fator de crescimento (b > 1) ou de decaimento (0 < b < 1).

## Exemplos

- **Bactérias** que dobram a cada hora: N(t) = 100 · 2ᵗ. Depois de 5 horas: 100 · 32 = 3.200.
- **Juros compostos:** M = C · (1 + i)ᵗ.
- **Depreciação:** um carro que perde 10% do valor por ano: V(t) = V₀ · 0,9ᵗ.
- **Meia-vida:** uma substância radioativa que cai pela metade a cada período: Q = Q₀ · (1/2)ⁿ.

## Comparando com a afim

Começando em 100 e aumentando por 5 períodos:

- Somando 20 por período (afim): 200.
- Dobrando a cada período (exponencial): 3.200.

Por isso dizemos que o crescimento exponencial é "explosivo": no começo parece lento e depois dispara.

## Gráfico

O gráfico de bˣ com b > 1 é uma curva que sobe cada vez mais rápido e nunca toca o eixo x. Com 0 < b < 1, a curva desce e se aproxima de zero sem chegar.

## Dica de prova

Procure palavras como "dobra", "triplica", "cai pela metade", "a cada ano aumenta x%". Elas indicam crescimento exponencial.

## Resumindo

Exponencial multiplica pelo mesmo fator a cada período: f(x) = a · bˣ. Aparece em bactérias, juros compostos, depreciação e meia-vida.`,
    [
      "Exponencial: a cada período, o valor é multiplicado pelo mesmo fator.",
      "f(x) = a · bˣ; b > 1 cresce, 0 < b < 1 decresce.",
      "Aparece em bactérias, juros compostos, depreciação e meia-vida.",
      "Palavras como “dobra” e “cai pela metade” indicam exponencial.",
    ],
    [
      ["Fator de crescimento", "Número pelo qual o valor é multiplicado a cada período."],
      ["Meia-vida", "Tempo para uma quantidade cair pela metade."],
      ["Depreciação", "Perda de valor de um bem com o tempo."],
    ],
    [
      ["Uma população de 500 bactérias dobra a cada hora. Após 3 horas, serão:", ["1.000", "1.500", "2.000", "3.000", "4.000"], 4, "500 · 2³ = 500 · 8 = 4.000."],
      ["Um carro de R$ 40.000 perde 10% do valor por ano. Após 2 anos, vale:", ["R$ 32.000", "R$ 32.400", "R$ 36.000", "R$ 30.000", "R$ 38.000"], 1, "40.000 · 0,9² = 40.000 · 0,81 = R$ 32.400."],
      ["Uma substância tem meia-vida de 5 anos. De 80 g, após 15 anos restam:", ["5 g", "10 g", "20 g", "40 g", "60 g"], 1, "15 anos = 3 meias-vidas: 80 → 40 → 20 → 10 g."],
      ["Qual situação é modelada por uma função exponencial?", ["Táxi com preço fixo por km", "Salário com valor fixo", "Dinheiro rendendo juros compostos", "Caminhar a velocidade constante", "Preço de um quilo de arroz"], 2, "Nos juros compostos, o montante é multiplicado por (1 + i) a cada período."],
      ["Na função f(x) = 3 · 0,5ˣ, a função é:", ["crescente", "decrescente", "constante", "uma reta", "uma parábola"], 1, "O fator 0,5 está entre 0 e 1: a função decresce."],
    ],
    [["Explique a diferença entre crescimento linear (afim) e exponencial.", "No linear, soma-se o mesmo valor a cada período; no exponencial, multiplica-se pelo mesmo fator, então o crescimento fica cada vez mais rápido."]],
  ),
  aula(
    "Logaritmo: a pergunta inversa da potência",
    `## O que é um logaritmo

A potência responde: "2 elevado a 3 dá quanto?" → 8.
O **logaritmo** responde a pergunta inversa: "2 elevado a quanto dá 8?" → 3.

Escrevemos: **log₂ 8 = 3**, porque 2³ = 8.

Em geral: logₐ b = x significa aˣ = b.

## Logaritmo decimal

Quando a base não aparece, ela é 10: log 100 = 2 (porque 10² = 100), log 1000 = 3.

## Propriedades úteis

- log(a · b) = log a + log b
- log(a ÷ b) = log a − log b
- log(aⁿ) = n · log a
- log 1 = 0 e logₐ a = 1

Com log 2 ≈ 0,30 e log 3 ≈ 0,48, dá para calcular muitos outros: log 6 = log 2 + log 3 ≈ 0,78.

## Para que serve no ENEM

O logaritmo aparece quando a incógnita está no **expoente**:

- "Em quanto tempo uma população de bactérias chega a tal número?"
- "Em quantos meses um investimento dobra?"

Exemplo: 1.000 · 2ᵗ = 8.000 → 2ᵗ = 8 → t = 3.

Na prova, os valores de log costumam ser dados no enunciado (como log 2 ≈ 0,30). Você não precisa decorar tabelas: precisa saber usar as propriedades para transformar a conta em somas e multiplicações simples.

Também aparece em **escalas**: a escala Richter (terremotos) e o pH são logarítmicos. Um terremoto de magnitude 7 libera muito mais energia que um de 6, não só "um pouco mais".

## Resumindo

Logaritmo é o expoente: logₐ b = x quando aˣ = b. Use-o quando a incógnita estiver no expoente e lembre que escalas como pH e Richter são logarítmicas.`,
    [
      "logₐ b = x significa aˣ = b: o logaritmo é um expoente.",
      "Sem base escrita, a base é 10.",
      "Propriedades: log do produto é a soma; log da potência é n vezes o log.",
      "pH e escala Richter são escalas logarítmicas.",
    ],
    [
      ["Logaritmo", "Expoente ao qual se eleva a base para obter um número."],
      ["Base", "Número que é elevado ao expoente na potência."],
      ["Escala logarítmica", "Escala em que cada unidade representa uma multiplicação, não uma soma."],
    ],
    [
      ["Quanto vale log₂ 32?", ["4", "5", "6", "16", "64"], 1, "2⁵ = 32, então log₂ 32 = 5."],
      ["Quanto vale log 1000?", ["2", "3", "10", "100", "30"], 1, "10³ = 1000, então log 1000 = 3."],
      ["Usando log 2 ≈ 0,30 e log 3 ≈ 0,48, log 12 é aproximadamente:", ["0,78", "0,90", "1,08", "1,18", "1,44"], 2, "log 12 = log(4 · 3) = 2 · 0,30 + 0,48 = 1,08."],
      ["Uma cultura de 200 bactérias dobra a cada hora. Em quantas horas chega a 3.200?", ["3", "4", "5", "8", "16"], 1, "200 · 2ᵗ = 3.200 → 2ᵗ = 16 → t = 4."],
      ["Qual destas é uma escala logarítmica?", ["Metro", "Escala Richter", "Quilograma", "Celsius", "Litro"], 1, "Na escala Richter, cada ponto a mais representa uma energia muitas vezes maior."],
    ],
    [["Explique, com um exemplo, a relação entre logaritmo e potência.", "O logaritmo é o expoente da potência: por exemplo, log de 8 na base 2 é 3 porque 2 elevado a 3 é 8."]],
  ),
  aula(
    "Áreas de figuras planas",
    `## Área é a medida da superfície

Área mede quanto espaço uma figura ocupa no plano, em unidades quadradas (cm², m², km²).

## Fórmulas principais

- **Retângulo:** base × altura.
- **Quadrado:** lado × lado = lado².
- **Triângulo:** (base × altura) ÷ 2.
- **Paralelogramo:** base × altura.
- **Trapézio:** (base maior + base menor) × altura ÷ 2.
- **Losango:** (diagonal maior × diagonal menor) ÷ 2.
- **Círculo:** π × raio². Use π ≈ 3,14 ou o valor que a questão der.

## Figuras compostas

Muitas questões mostram uma planta de casa ou um terreno irregular. A estratégia é **dividir** a figura em partes conhecidas (retângulos, triângulos) e **somar** as áreas. Às vezes é mais fácil calcular a área total e **subtrair** a parte que falta.

## Exemplo

Um terreno em L tem duas partes retangulares: 10 m × 6 m e 4 m × 5 m. Área = 60 + 20 = **80 m²**.

## Cuidado com as unidades

Se os lados estão em centímetros, a área sai em cm². E lembre: 1 m² = 10.000 cm² (porque 100 cm × 100 cm).

## Proporção entre áreas

Se você **dobra** os lados de uma figura, a área fica **4 vezes** maior (2²). Se triplica os lados, a área fica 9 vezes maior. Essa ideia aparece em ampliações de fotos e plantas.

## Resumindo

Saiba as fórmulas básicas, divida figuras complicadas em partes simples e cuide das unidades. Multiplicar os lados por k multiplica a área por k².`,
    [
      "Retângulo: base × altura; triângulo: base × altura ÷ 2; círculo: π × r².",
      "Figuras compostas: divida em partes simples e some (ou subtraia).",
      "1 m² = 10.000 cm².",
      "Multiplicar os lados por k multiplica a área por k².",
    ],
    [
      ["Área", "Medida da superfície de uma figura, em unidades quadradas."],
      ["Trapézio", "Quadrilátero com dois lados paralelos, chamados bases."],
      ["Raio", "Distância do centro do círculo até a borda."],
    ],
    [
      ["Um triângulo tem base 10 cm e altura 6 cm. Sua área é:", ["16 cm²", "30 cm²", "60 cm²", "32 cm²", "15 cm²"], 1, "(10 × 6) ÷ 2 = 30 cm²."],
      ["Um círculo tem raio 5 m. Usando π = 3, a área é:", ["15 m²", "30 m²", "45 m²", "75 m²", "150 m²"], 3, "π · r² = 3 · 25 = 75 m²."],
      ["Um trapézio tem bases 8 e 4 e altura 5. A área é:", ["20", "30", "40", "60", "12"], 1, "(8 + 4) × 5 ÷ 2 = 30."],
      ["Os lados de uma foto foram triplicados. A área ficou:", ["3 vezes maior", "6 vezes maior", "9 vezes maior", "27 vezes maior", "igual"], 2, "Multiplicar os lados por 3 multiplica a área por 3² = 9."],
      ["Quantos cm² há em 2 m²?", ["200", "2.000", "20.000", "200.000", "2.000.000"], 2, "1 m² = 10.000 cm², então 2 m² = 20.000 cm²."],
    ],
    [["Como calcular a área de um terreno com formato irregular, como um L?", "Dividindo o terreno em figuras simples, como retângulos, calculando a área de cada parte e somando os resultados."]],
  ),
  aula(
    "Teorema de Pitágoras",
    `## O triângulo retângulo

Um **triângulo retângulo** tem um ângulo de 90°. O lado oposto a esse ângulo é a **hipotenusa** (o maior lado). Os outros dois são os **catetos**.

## O teorema

**hipotenusa² = cateto² + cateto²**

a² = b² + c²

## Exemplo clássico

Catetos 3 e 4: a² = 9 + 16 = 25 → a = **5**. O trio 3, 4, 5 (e seus múltiplos 6, 8, 10 ou 9, 12, 15) aparece muito.

## Aplicações no ENEM

- **Escada encostada na parede:** a escada é a hipotenusa, a altura na parede e a distância do pé até a parede são os catetos.
- **Diagonal de uma tela:** uma TV de 16 × 12 polegadas tem diagonal de 20 polegadas (16² + 12² = 400).
- **Rampas de acessibilidade:** comprimento da rampa, altura e distância horizontal.
- **Menor caminho:** atravessar um terreno na diagonal em vez de dar a volta.

## Diagonal do quadrado

Num quadrado de lado L, a diagonal mede **L√2** (cerca de 1,41 × L).

## Como resolver

1. Desenhe o triângulo e marque o ângulo reto.
2. Identifique a hipotenusa (oposta ao ângulo reto).
3. Aplique a fórmula e isole o lado que falta.

## Resumindo

Em todo triângulo retângulo, a hipotenusa ao quadrado é a soma dos quadrados dos catetos. Procure o ângulo reto escondido em escadas, telas, rampas e diagonais.`,
    [
      "Triângulo retângulo: tem um ângulo de 90°; a hipotenusa é o maior lado.",
      "a² = b² + c² (hipotenusa ao quadrado = soma dos quadrados dos catetos).",
      "O trio 3, 4, 5 e seus múltiplos aparecem muito.",
      "Diagonal do quadrado de lado L mede L√2.",
    ],
    [
      ["Hipotenusa", "Lado oposto ao ângulo reto; o maior lado do triângulo retângulo."],
      ["Cateto", "Cada um dos dois lados que formam o ângulo reto."],
      ["Ângulo reto", "Ângulo de 90 graus."],
    ],
    [
      ["Os catetos de um triângulo retângulo medem 6 e 8. A hipotenusa mede:", ["10", "12", "14", "48", "100"], 0, "6² + 8² = 36 + 64 = 100 → 10."],
      ["Uma escada de 5 m está com o pé a 3 m da parede. Até que altura ela alcança?", ["2 m", "3 m", "4 m", "6 m", "8 m"], 2, "5² = 3² + h² → 25 = 9 + h² → h = 4 m."],
      ["A diagonal de um quadrado de lado 10 cm mede aproximadamente:", ["10 cm", "12 cm", "14,1 cm", "20 cm", "100 cm"], 2, "Diagonal = L√2 ≈ 10 × 1,41 = 14,1 cm."],
      ["Uma tela tem 24 cm por 18 cm. Sua diagonal mede:", ["28 cm", "30 cm", "32 cm", "36 cm", "42 cm"], 1, "24² + 18² = 576 + 324 = 900 → 30 cm."],
      ["Em um triângulo retângulo, a hipotenusa é sempre:", ["o menor lado", "o lado oposto ao ângulo de 90°", "igual à soma dos catetos", "metade de um cateto", "paralela a um cateto"], 1, "A hipotenusa fica oposta ao ângulo reto e é o maior lado."],
    ],
    [["Explique como usar o teorema de Pitágoras para achar a altura alcançada por uma escada encostada na parede.", "A escada é a hipotenusa e a distância do pé até a parede é um cateto; a altura é o outro cateto, que se acha fazendo hipotenusa ao quadrado menos o cateto conhecido ao quadrado e tirando a raiz."]],
  ),
];
