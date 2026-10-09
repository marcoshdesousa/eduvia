import { aula } from "./build";

/** Matemática, lote 4: mais habilidades da Matriz do ENEM, com exemplos do cotidiano. */
export const MATEMATICA_4 = [
  aula(
    "Grandezas inversamente proporcionais",
    `## Quando uma sobe e a outra desce

Duas grandezas são **inversamente proporcionais** quando, ao **multiplicar** uma por um número, a outra fica **dividida** pelo mesmo número. O **produto** entre elas é **constante**.

- Mais **operários** → **menos dias** para terminar uma obra.
- Mais **velocidade** → **menos tempo** de viagem.
- Mais **torneiras** abertas → **menos tempo** para encher a caixa.

## Diretas x inversas

- **Diretamente proporcionais:** a **razão** é constante (y/x = k). Ex.: preço e quantidade de pães.
- **Inversamente proporcionais:** o **produto** é constante (x · y = k).

Pergunte sempre: "se uma **dobra**, a outra **dobra** ou **cai pela metade**?"

## Exemplo 1

6 pedreiros constroem um muro em 10 dias. Em quanto tempo 4 pedreiros fariam o mesmo muro?

- Produto constante: 6 · 10 = 60 "pedreiro-dias".
- 4 · t = 60 → **t = 15 dias**.

## Exemplo 2 (velocidade e tempo)

Um carro a 80 km/h faz um trajeto em 3 h. A 120 km/h, quanto tempo?

- 80 · 3 = 240 (a distância).
- 120 · t = 240 → **t = 2 h**.

## Regra de três inversa

Monte a regra de três normalmente, mas **inverta** uma das razões antes de multiplicar em cruz:

| Operários | Dias |
|---|---|
| 6 | 10 |
| 4 | x |

Como é inversa: 6/4 = x/10 → 4x = 60 → x = 15.

## Gráfico

O gráfico de duas grandezas inversamente proporcionais é uma **hipérbole** (curva que se aproxima dos eixos sem tocar), e não uma reta.

## Cuidado

Nem tudo que "sobe e desce" é inversamente proporcional: é preciso que o **produto** se mantenha constante.

## Resumindo

Inversamente proporcionais: o produto é constante (x · y = k). Se uma dobra, a outra cai pela metade. Na regra de três inversa, inverta uma razão. O gráfico é uma hipérbole.`,
    [
      "Inversas: o produto é constante (x · y = k).",
      "Se uma dobra, a outra cai pela metade.",
      "Na regra de três inversa, inverta uma das razões.",
      "O gráfico é uma hipérbole, não uma reta.",
    ],
    [
      ["Inversamente proporcional", "Relação em que o produto das grandezas é constante."],
      ["Diretamente proporcional", "Relação em que a razão entre as grandezas é constante."],
      ["Hipérbole", "Curva do gráfico de grandezas inversamente proporcionais."],
    ],
    [
      ["8 operários fazem um serviço em 6 dias. Quantos dias 12 operários levariam?", ["3", "4", "9", "8", "5"], 1, "8 · 6 = 48; 48 ÷ 12 = 4."],
      ["A 60 km/h uma viagem dura 4 h. A 80 km/h, ela dura:", ["3 h", "5 h", "3,5 h", "2 h", "6 h"], 0, "Distância 240 km; 240 ÷ 80 = 3 h."],
      ["São grandezas inversamente proporcionais:", ["quantidade de pães e preço total", "número de torneiras iguais abertas e tempo para encher um tanque", "lado do quadrado e perímetro", "horas trabalhadas e salário por hora fixo", "distância e combustível gasto"], 1, "Mais torneiras, menos tempo."],
      ["Se x e y são inversamente proporcionais e x = 5 quando y = 12, então quando x = 10, y vale:", ["24", "6", "12", "60", "2"], 1, "5 · 12 = 60; 60 ÷ 10 = 6."],
      ["O gráfico de duas grandezas inversamente proporcionais é:", ["uma reta pela origem", "uma hipérbole", "uma parábola", "um círculo", "uma reta horizontal"], 1, "Produto constante."],
    ],
    [["Explique como saber se duas grandezas são diretamente ou inversamente proporcionais.", "Se, ao dobrar uma, a outra também dobra (razão constante), são diretamente proporcionais; se, ao dobrar uma, a outra cai pela metade (produto constante), são inversamente proporcionais."]],
  ),
  aula(
    "Divisão proporcional: partilhas e sociedades",
    `## Dividir de forma justa

Muitos problemas pedem para **repartir** um valor em partes **proporcionais** a outros números: lucro de uma sociedade, herança, prêmio, ingredientes.

## Divisão diretamente proporcional

Para dividir um total **T** em partes proporcionais a **a**, **b** e **c**:

1. Some os números: a + b + c.
2. Calcule a **constante**: k = T ÷ (a + b + c).
3. Cada parte é o número vezes k: a·k, b·k, c·k.

**Exemplo:** dividir R$ 12.000 de lucro entre dois sócios que investiram R$ 20.000 e R$ 40.000.

- Proporção 20 : 40 = 1 : 2. Soma = 3.
- k = 12.000 ÷ 3 = 4.000.
- Sócio A: 1 · 4.000 = **R$ 4.000**; Sócio B: 2 · 4.000 = **R$ 8.000**.

## Divisão com dois critérios

Se o lucro depende do **capital** e do **tempo** investido, multiplique os dois para cada sócio.

**Exemplo:** A investiu R$ 10.000 por 6 meses; B investiu R$ 15.000 por 2 meses. Lucro: R$ 9.000.

- A: 10.000 · 6 = 60.000; B: 15.000 · 2 = 30.000. Proporção 2 : 1.
- k = 9.000 ÷ 3 = 3.000 → **A = R$ 6.000**, **B = R$ 3.000**.

## Divisão inversamente proporcional

Quem tem **mais** de algo recebe **menos** (ex.: prêmio dividido inversamente ao número de faltas). Divida em partes proporcionais aos **inversos** (1/a, 1/b...).

**Exemplo:** dividir R$ 900 inversamente a 2 e 4 faltas.

- Inversos: 1/2 e 1/4 → multiplicando por 4: 2 e 1. Soma = 3.
- k = 900 ÷ 3 = 300 → **R$ 600** (2 faltas) e **R$ 300** (4 faltas).

## Receitas e misturas

"Uma tinta é feita com 3 partes de azul para 2 de branco. Para 20 litros?" Soma = 5 partes; cada parte = 4 L → **12 L azul** e **8 L branco**.

## Confira sempre

A soma das partes precisa dar o **total**.

## Resumindo

Na divisão proporcional, some as partes, ache a constante e multiplique. Com dois critérios, multiplique-os. Na inversa, use os inversos. Confira se a soma dá o total.`,
    [
      "Some as proporções, ache k = total ÷ soma e multiplique.",
      "Capital e tempo: multiplique os dois para cada sócio.",
      "Divisão inversa: use os inversos dos números.",
      "Confira: a soma das partes deve dar o total.",
    ],
    [
      ["Divisão proporcional", "Repartir um total em partes proporcionais a números dados."],
      ["Constante de proporcionalidade", "Valor de cada \"parte\" na divisão."],
      ["Inverso", "Número que multiplicado pelo original dá 1 (o inverso de 4 é 1/4)."],
    ],
    [
      ["Dividindo R$ 600 em partes proporcionais a 1 e 2, as partes são:", ["R$ 200 e R$ 400", "R$ 300 e R$ 300", "R$ 100 e R$ 500", "R$ 250 e R$ 350", "R$ 150 e R$ 450"], 0, "k = 600 ÷ 3 = 200."],
      ["Uma mistura usa 3 partes de cimento para 5 de areia. Para 40 kg de mistura, quanto de cimento?", ["15 kg", "24 kg", "12 kg", "8 kg", "25 kg"], 0, "8 partes; cada parte 5 kg; 3 · 5 = 15."],
      ["Dois sócios investiram R$ 30.000 e R$ 10.000. O lucro de R$ 8.000 é dividido proporcionalmente. O primeiro recebe:", ["R$ 4.000", "R$ 6.000", "R$ 2.000", "R$ 5.000", "R$ 7.000"], 1, "3 : 1; k = 2.000; 3 · 2.000."],
      ["Dividir R$ 300 inversamente proporcional a 1 e 2 dá:", ["R$ 100 e R$ 200", "R$ 200 e R$ 100", "R$ 150 e R$ 150", "R$ 250 e R$ 50", "R$ 50 e R$ 250"], 1, "Inversos 1 e 1/2 → 2 : 1."],
      ["A investiu R$ 1.000 por 3 meses e B, R$ 1.500 por 2 meses. O lucro deve ser dividido na razão:", ["1 : 1", "2 : 3", "3 : 2", "1 : 2", "3 : 1"], 0, "3.000 e 3.000."],
    ],
    [["Explique como dividir um lucro entre sócios que investiram valores diferentes por tempos diferentes.", "Multiplica-se o capital pelo tempo de cada sócio, soma-se esses produtos, divide-se o lucro pela soma para achar a constante e multiplica-se a constante pelo produto de cada um."]],
  ),
  aula(
    "Máximo e mínimo: o vértice da parábola",
    `## Por que isso cai tanto

Muitos problemas do ENEM pedem o **maior lucro**, a **maior área** ou o **menor custo**. Quando a situação é descrita por uma **função quadrática**, a resposta está no **vértice** da parábola.

## Função quadrática

f(x) = ax² + bx + c, com a ≠ 0.

- Se **a < 0**: a parábola tem **concavidade para baixo** → o vértice é um **ponto de máximo**.
- Se **a > 0**: concavidade para cima → o vértice é um **ponto de mínimo**.

## Coordenadas do vértice

- **x do vértice:** xv = **−b / (2a)**.
- **y do vértice:** substitua xv na função, ou use yv = −Δ / (4a), com Δ = b² − 4ac.

O **xv** responde "**quanto** produzir/vender/cobrar"; o **yv** responde "**qual** é o lucro/área máxima".

## Exemplo 1: lucro

L(x) = −x² + 40x − 300 (x = unidades vendidas).

- a = −1 (máximo). xv = −40 / (2 · −1) = **20 unidades**.
- L(20) = −400 + 800 − 300 = **R$ 100** de lucro máximo.

## Exemplo 2: maior área com cerca

Com 40 m de cerca, qual o maior cercado retangular?

- Perímetro: 2x + 2y = 40 → y = 20 − x.
- Área: A = x(20 − x) = −x² + 20x.
- xv = −20 / (−2) = 10 → y = 10. **Quadrado 10 × 10**, área **100 m²**.

## Exemplo 3: altura máxima

Uma bola segue h(t) = −5t² + 20t. xv = −20/(−10) = **2 s**; h(2) = −20 + 40 = **20 m** de altura máxima.

## Simetria

A parábola é **simétrica** em relação à reta vertical que passa pelo vértice. Se as **raízes** são x₁ e x₂, o vértice fica no **meio**: xv = (x₁ + x₂) / 2.

## Resumindo

Máximo quando a < 0; mínimo quando a > 0. xv = −b/(2a) dá onde ocorre; f(xv) dá o valor. A parábola é simétrica: o vértice fica no meio das raízes.`,
    [
      "a < 0: vértice é máximo; a > 0: vértice é mínimo.",
      "xv = −b/(2a); yv = f(xv).",
      "xv responde \"quanto\"; yv responde \"qual o valor máximo/mínimo\".",
      "O vértice fica no meio das raízes: xv = (x₁ + x₂)/2.",
    ],
    [
      ["Vértice", "Ponto de máximo ou de mínimo da parábola."],
      ["Concavidade", "Abertura da parábola, para cima (a > 0) ou para baixo (a < 0)."],
      ["Raízes", "Valores de x em que a função vale zero."],
    ],
    [
      ["Para L(x) = −x² + 10x, o valor de x que dá o lucro máximo é:", ["10", "5", "25", "−5", "2"], 1, "xv = −10/(−2) = 5."],
      ["O lucro máximo de L(x) = −x² + 10x é:", ["5", "10", "25", "50", "100"], 2, "L(5) = −25 + 50 = 25."],
      ["Uma parábola com raízes 2 e 8 tem vértice em x igual a:", ["4", "5", "6", "10", "3"], 1, "(2 + 8)/2 = 5."],
      ["Com 60 m de cerca, a maior área retangular possível é:", ["200 m²", "225 m²", "250 m²", "900 m²", "300 m²"], 1, "Quadrado 15 × 15 = 225."],
      ["A função f(x) = 2x² − 8x + 3 possui:", ["ponto de máximo", "ponto de mínimo", "nenhum vértice", "duas concavidades", "vértice em x = −2"], 1, "a > 0, concavidade para cima."],
    ],
    [["Como encontrar o lucro máximo de uma função quadrática L(x) = ax² + bx + c com a < 0?", "Calcula-se o x do vértice com xv = −b/(2a), que indica a quantidade que dá o lucro máximo, e depois substitui-se esse valor na função para obter o lucro máximo L(xv)."]],
  ),
  aula(
    "Fenômenos periódicos: seno e cosseno no cotidiano",
    `## O que se repete

Muitos fenômenos se repetem em intervalos regulares: **marés**, a altura de uma cadeira numa **roda-gigante**, a **pressão arterial**, a temperatura ao longo do ano, o movimento de um pêndulo. Eles são modelados por funções **trigonométricas** (seno e cosseno).

## A função seno básica

f(x) = sen(x):

- Varia entre **−1 e 1**.
- Repete-se a cada **2π** (360°): esse é o **período**.

## Forma geral

f(t) = **A + B · sen(C · t)** (ou cos):

- **A:** valor **médio** (desloca a curva para cima ou para baixo).
- **B:** **amplitude** (o quanto sobe e desce em relação à média).
- **Valor máximo:** A + |B|. **Valor mínimo:** A − |B|.
- **Período:** P = 2π / |C| (o tempo de uma repetição completa).

## Exemplo 1: maré

A altura da maré é h(t) = 3 + 2 · sen(πt/6), com t em horas.

- Altura média: **3 m**.
- Máxima: 3 + 2 = **5 m**; mínima: 3 − 2 = **1 m**.
- Período: 2π ÷ (π/6) = **12 horas**.

## Exemplo 2: roda-gigante

A altura de uma cadeira é h(t) = 10 − 8 · cos(πt/5) (metros, minutos).

- Mínimo: 10 − 8 = **2 m** (quando cos = 1, em t = 0).
- Máximo: 10 + 8 = **18 m**.
- Período: 2π ÷ (π/5) = **10 min** para uma volta.

## Dicas para o ENEM

- Para máximo e mínimo, lembre que **seno e cosseno valem no máximo 1 e no mínimo −1**.
- Leia o **gráfico**: a distância entre dois picos é o **período**; metade da distância entre pico e vale é a **amplitude**.
- Valores úteis: sen 0 = 0; sen(π/2) = 1; sen π = 0; sen(3π/2) = −1; cos 0 = 1; cos π = −1.

## Resumindo

Fenômenos periódicos usam f(t) = A + B·sen(Ct). A é a média, B a amplitude, máximo A + |B|, mínimo A − |B| e período 2π/|C|.`,
    [
      "Seno e cosseno variam entre −1 e 1.",
      "f(t) = A + B·sen(Ct): A é a média, B a amplitude.",
      "Máximo = A + |B|; mínimo = A − |B|.",
      "Período = 2π/|C|: tempo de uma repetição.",
    ],
    [
      ["Período", "Tempo para o fenômeno se repetir por completo."],
      ["Amplitude", "Quanto a função se afasta, para cima ou para baixo, do valor médio."],
      ["Função periódica", "Função que se repete em intervalos regulares."],
    ],
    [
      ["Para h(t) = 4 + 3·sen(t), o valor máximo é:", ["3", "4", "7", "1", "12"], 2, "4 + 3 = 7."],
      ["Para h(t) = 4 + 3·sen(t), o valor mínimo é:", ["1", "−1", "0", "4", "−7"], 0, "4 − 3 = 1."],
      ["O período de f(t) = sen(πt/4) é:", ["4", "8", "2π", "π", "16"], 1, "2π ÷ (π/4) = 8."],
      ["No gráfico de uma função periódica, a distância entre dois picos consecutivos é:", ["a amplitude", "o período", "o valor médio", "o mínimo", "a raiz"], 1, "Uma repetição completa."],
      ["Para P(t) = 100 + 20·cos(2πt), a pressão varia entre:", ["80 e 120", "100 e 120", "20 e 100", "0 e 200", "90 e 110"], 0, "100 ± 20."],
    ],
    [["Na função h(t) = 10 + 5·sen(πt/6), qual é a altura média, a máxima, a mínima e o período?", "A altura média é 10, a máxima é 15 (10 + 5), a mínima é 5 (10 − 5) e o período é 12, pois 2π dividido por π/6 dá 12."]],
  ),
  aula(
    "Probabilidade condicional e eventos independentes",
    `## Probabilidade com informação extra

A **probabilidade condicional** é a chance de um evento **A** acontecer **sabendo que** um evento **B** já aconteceu. Escreve-se **P(A | B)**.

A ideia é simples: a informação **reduz o espaço amostral** — você passa a contar só os casos em que B aconteceu.

**P(A | B) = (casos de A e B) ÷ (casos de B)**

## Exemplo com tabela

Numa escola com 200 alunos:

| | Usa óculos | Não usa | Total |
|---|---|---|---|
| Meninas | 30 | 90 | 120 |
| Meninos | 20 | 60 | 80 |
| Total | 50 | 150 | 200 |

- P(usar óculos) = 50/200 = **25%**.
- P(usar óculos **sabendo que é menina**) = 30/120 = **25%**.
- P(ser menina **sabendo que usa óculos**) = 30/50 = **60%**.

Note que P(A|B) e P(B|A) são **diferentes**.

## Eventos independentes

Dois eventos são **independentes** quando um **não altera** a chance do outro: lançar uma moeda e um dado; dois lançamentos de moeda.

- **Regra do "E":** P(A e B) = P(A) · P(B).
- Ex.: tirar cara **e** depois 6 num dado: 1/2 · 1/6 = **1/12**.

## Sem reposição (dependentes)

Uma urna tem 3 bolas vermelhas e 2 azuis. Tirar duas vermelhas seguidas **sem devolver**:

- 1ª vermelha: 3/5. 2ª vermelha (sobrou 2 de 4): 2/4.
- P = 3/5 · 2/4 = 6/20 = **3/10**.

## Regra do "OU"

- P(A ou B) = P(A) + P(B) − P(A e B).
- Se não podem ocorrer juntos (mutuamente exclusivos): P(A ou B) = P(A) + P(B).

## Evento complementar

P(não A) = 1 − P(A). Útil para "**pelo menos um**": P(pelo menos uma cara em 3 lançamentos) = 1 − P(nenhuma cara) = 1 − 1/8 = **7/8**.

## Resumindo

Condicional: conte só os casos em que a condição ocorreu. Independentes: multiplique. Sem reposição, a chance muda a cada retirada. "Pelo menos um" se resolve pelo complementar.`,
    [
      "P(A|B) = casos de A e B ÷ casos de B.",
      "A condição reduz o espaço amostral.",
      "Independentes: P(A e B) = P(A) · P(B).",
      "\"Pelo menos um\": use 1 − P(nenhum).",
    ],
    [
      ["Probabilidade condicional", "Chance de um evento sabendo que outro já ocorreu."],
      ["Eventos independentes", "Eventos em que um não altera a probabilidade do outro."],
      ["Evento complementar", "O evento \"não A\", com P = 1 − P(A)."],
    ],
    [
      ["Na tabela da aula, a probabilidade de um aluno ser menino sabendo que usa óculos é:", ["20%", "40%", "25%", "60%", "10%"], 1, "20/50 = 40%."],
      ["A chance de tirar duas caras em dois lançamentos de moeda é:", ["1/2", "1/4", "1/3", "3/4", "1"], 1, "1/2 · 1/2."],
      ["Uma urna tem 4 bolas brancas e 1 preta. Tirando duas sem reposição, a chance de ambas serem brancas é:", ["16/25", "3/5", "4/5", "12/25", "1/5"], 1, "4/5 · 3/4 = 3/5."],
      ["A probabilidade de sair pelo menos um 6 em dois lançamentos de dado é:", ["1/3", "11/36", "1/6", "25/36", "1/36"], 1, "1 − (5/6)² = 11/36."],
      ["Dois eventos são independentes quando:", ["não podem ocorrer juntos", "um não altera a probabilidade do outro", "sempre ocorrem juntos", "têm a mesma probabilidade", "somam 1"], 1, "Definição."],
    ],
    [["Explique por que, em uma retirada sem reposição, a probabilidade muda a cada retirada.", "Porque o objeto retirado não volta: o total de itens diminui e a quantidade do tipo retirado também, então a segunda retirada tem um espaço amostral diferente da primeira."]],
  ),
  aula(
    "Tabelas de frequência, média e mediana em dados agrupados",
    `## Organizar dados

Quando há muitos dados, eles são organizados em **tabelas de frequência**:

- **Frequência absoluta (f):** quantas vezes cada valor aparece.
- **Frequência relativa:** f ÷ total (em fração ou porcentagem).
- **Frequência acumulada:** soma das frequências até aquele valor.

## Exemplo

Número de filhos em 20 famílias:

| Filhos | Famílias (f) | Acumulada |
|---|---|---|
| 0 | 4 | 4 |
| 1 | 7 | 11 |
| 2 | 6 | 17 |
| 3 | 3 | 20 |

## Média (ponderada pela frequência)

Média = Σ(valor · f) ÷ total = (0·4 + 1·7 + 2·6 + 3·3) ÷ 20 = (0 + 7 + 12 + 9) ÷ 20 = 28 ÷ 20 = **1,4 filho**.

## Moda

O valor com **maior frequência**: **1 filho** (7 famílias).

## Mediana

O valor **do meio** quando os dados estão em ordem.

- Com 20 dados (par), a mediana é a média do **10º e 11º** valores.
- Pela frequência acumulada: até 0 filhos vão os 4 primeiros; até 1 filho vão do 5º ao 11º. Então o 10º e o 11º valem **1** → **mediana = 1**.

Se o total for **ímpar** (n), a mediana é o valor na posição **(n + 1)/2**.

## Quando usar cada uma

- **Média:** sensível a valores extremos (um salário altíssimo puxa a média para cima).
- **Mediana:** representa melhor dados com **valores extremos** (ex.: renda da população).
- **Moda:** o mais **comum** (útil em dados de categorias, como tamanho de roupa mais vendido).

## Dados em intervalos (classes)

Em tabelas com faixas (ex.: 0 a 10 anos), usa-se o **ponto médio** de cada faixa como representante para estimar a média.

## Resumindo

Na tabela de frequência, a média é Σ(valor·f) ÷ total; a moda é o valor mais frequente; a mediana é o termo do meio, achado pela frequência acumulada. A mediana resiste melhor a valores extremos.`,
    [
      "Média = Σ(valor · frequência) ÷ total.",
      "Moda: valor de maior frequência.",
      "Mediana: termo do meio; use a frequência acumulada.",
      "A mediana resiste a valores extremos; a média não.",
    ],
    [
      ["Frequência absoluta", "Número de vezes que um valor aparece."],
      ["Frequência acumulada", "Soma das frequências até determinado valor."],
      ["Ponto médio", "Valor central de um intervalo, usado para estimar a média em classes."],
    ],
    [
      ["Notas: 5 (2 alunos), 7 (3 alunos), 10 (5 alunos). A média é:", ["7", "8", "7,3", "8,1", "9"], 3, "(10 + 21 + 50) ÷ 10 = 8,1."],
      ["Nos dados da questão anterior, a moda é:", ["5", "7", "10", "8,1", "não há"], 2, "10 aparece 5 vezes."],
      ["Nos mesmos dados (10 notas), a mediana é:", ["7", "8,5", "10", "8,1", "5"], 1, "5º = 7 e 6º = 10 → (7 + 10)/2 = 8,5."],
      ["Para representar a renda típica de uma população com alguns bilionários, a melhor medida é:", ["média", "mediana", "maior valor", "soma total", "amplitude"], 1, "Resistente a extremos."],
      ["Em 15 dados ordenados, a mediana está na posição:", ["7ª", "8ª", "7,5ª", "15ª", "1ª"], 1, "(15 + 1)/2 = 8."],
    ],
    [["Explique por que a mediana pode representar melhor a renda de uma população do que a média.", "Porque a média é muito influenciada por valores extremos, como rendas muito altas, que a puxam para cima; a mediana é o valor do meio e não se altera com esses extremos, mostrando melhor a renda típica."]],
  ),
  aula(
    "Pisos, azulejos e cercas: área e perímetro na prática",
    `## Situações do dia a dia

O ENEM adora problemas de **reforma**: quantas caixas de piso comprar, quantos metros de rodapé, quanto de tinta, quantos azulejos.

## Perímetro x área

- **Perímetro:** medida do **contorno** (em metros). Usado para **cercas, rodapés, molduras, arames**.
- **Área:** medida da **superfície** (em m²). Usada para **pisos, tintas, gramas, azulejos, telhados**.

## Fórmulas principais

- Retângulo: A = b · h; P = 2b + 2h.
- Quadrado: A = L²; P = 4L.
- Triângulo: A = (b · h)/2.
- Círculo: A = π r²; comprimento = 2πr.
- Trapézio: A = (B + b) · h / 2.

## Figuras compostas

Divida a figura em partes conhecidas e **some** (ou **subtraia** partes "vazadas", como uma piscina num quintal).

## Exemplo 1: piso

Uma sala de 5 m × 4 m será coberta com piso vendido em caixas de 2,5 m². Quantas caixas?

- Área = 20 m². 20 ÷ 2,5 = **8 caixas**.
- Se o fabricante recomenda **10% a mais** pelas perdas: 22 m² ÷ 2,5 = 8,8 → **9 caixas** (sempre arredonde **para cima**).

## Exemplo 2: azulejos

Uma parede de 3 m × 2,4 m receberá azulejos de 20 cm × 30 cm.

- Converta: 300 cm × 240 cm = 72.000 cm².
- Azulejo: 20 × 30 = 600 cm².
- 72.000 ÷ 600 = **120 azulejos**.

## Exemplo 3: rodapé

Sala 5 m × 4 m, porta de 0,8 m: perímetro 18 m − 0,8 m = **17,2 m** de rodapé.

## Exemplo 4: tinta

Uma lata pinta 40 m². Paredes somam 92 m² e precisam de 2 demãos: 184 m² ÷ 40 = 4,6 → **5 latas**.

## Atenção às unidades

- 1 m = 100 cm, mas **1 m² = 10.000 cm²**.
- Converta **antes** de calcular.

## Resumindo

Perímetro para contornos (cercas, rodapés); área para superfícies (pisos, tinta). Divida figuras compostas. Arredonde para cima ao comprar materiais e cuidado: 1 m² = 10.000 cm².`,
    [
      "Perímetro: contorno (cercas, rodapés). Área: superfície (piso, tinta).",
      "Figuras compostas: some ou subtraia partes conhecidas.",
      "Ao comprar materiais, arredonde para cima.",
      "1 m² = 10.000 cm²: converta antes de calcular.",
    ],
    [
      ["Perímetro", "Soma das medidas dos lados; o contorno da figura."],
      ["Área", "Medida da superfície ocupada pela figura."],
      ["Demão", "Cada camada de tinta aplicada."],
    ],
    [
      ["Para cercar um terreno retangular de 30 m × 20 m, são necessários:", ["50 m", "100 m", "600 m", "60 m", "120 m"], 1, "2·30 + 2·20 = 100 m."],
      ["Um quarto de 4 m × 3 m será coberto com piso em caixas de 2 m². Quantas caixas, sem sobra?", ["5", "6", "7", "12", "24"], 1, "12 ÷ 2 = 6."],
      ["Quantos azulejos de 20 cm × 20 cm cobrem 1 m²?", ["5", "10", "25", "50", "100"], 2, "10.000 ÷ 400 = 25."],
      ["Uma lata de tinta cobre 30 m². Para 100 m² são necessárias:", ["3 latas", "4 latas", "3,3 latas exatas", "5 latas", "2 latas"], 1, "3,33... → arredondar para 4."],
      ["1 m² corresponde a:", ["100 cm²", "1.000 cm²", "10.000 cm²", "10 cm²", "100.000 cm²"], 2, "100 cm × 100 cm."],
    ],
    [["Ao calcular quantas caixas de piso comprar, por que se deve arredondar para cima?", "Porque não é possível comprar parte de uma caixa e, se arredondar para baixo, faltará piso para cobrir toda a área; além disso, costuma-se acrescentar uma margem para perdas nos cortes."]],
  ),
  aula(
    "Escalas logarítmicas: pH, terremotos e decibéis",
    `## Quando os números são grandes demais

Algumas grandezas variam enormemente (de 1 a 1 bilhão). Para facilitar, usam-se **escalas logarítmicas**, em que **cada ponto a mais multiplica** a grandeza por um fator (geralmente **10**).

Lembre: log₁₀(x) = y significa 10ʸ = x. log 10 = 1; log 100 = 2; log 1000 = 3.

## Escala Richter (terremotos)

- Mede a **magnitude** de um terremoto.
- Cada **ponto a mais** corresponde a uma amplitude **10 vezes maior** (e cerca de 32 vezes mais energia).
- Um terremoto de magnitude **7** tem amplitude **100 vezes** maior que um de magnitude **5** (10 · 10).

## pH (acidez)

- pH = −log[H⁺] (concentração de íons de hidrogênio).
- pH **7**: neutro; **menor que 7**: ácido; **maior que 7**: básico.
- Cada unidade a menos = **10 vezes mais ácido**.
- Ex.: pH 3 é **100 vezes** mais ácido que pH 5.

## Decibéis (som)

- O nível sonoro em **dB** usa logaritmo da intensidade.
- Cada aumento de **10 dB** = intensidade **10 vezes maior**.
- 80 dB é **100 vezes** mais intenso que 60 dB.
- Sons acima de **85 dB** por longos períodos podem causar perda auditiva.

## Propriedades úteis

- log(a · b) = log a + log b.
- log(a / b) = log a − log b.
- log(aⁿ) = n · log a.
- Valores aproximados: log 2 ≈ 0,3; log 3 ≈ 0,48.

## Como resolver

Ao comparar dois valores numa escala log de base 10:

**fator = 10^(diferença)**

- Diferença de 2 pontos → 10² = 100 vezes.
- Diferença de 3 → 1.000 vezes.

## Resumindo

Em escalas logarítmicas, cada ponto multiplica a grandeza (por 10 na Richter, no pH e a cada 10 dB). Para comparar, calcule 10 elevado à diferença.`,
    [
      "Escala logarítmica: cada ponto multiplica a grandeza.",
      "Richter: +1 ponto = amplitude 10 vezes maior.",
      "pH: −1 unidade = 10 vezes mais ácido.",
      "Compare com 10^(diferença).",
    ],
    [
      ["Logaritmo", "Expoente ao qual a base deve ser elevada para obter um número."],
      ["Magnitude", "Medida da intensidade de um terremoto na escala Richter."],
      ["Decibel", "Unidade logarítmica do nível sonoro."],
    ],
    [
      ["Um terremoto de magnitude 8 tem amplitude quantas vezes maior que um de magnitude 6?", ["2", "20", "100", "1.000", "12"], 2, "10² = 100."],
      ["Uma solução de pH 2 é quantas vezes mais ácida que uma de pH 5?", ["3", "30", "300", "1.000", "100"], 3, "10³ = 1.000."],
      ["Um som de 90 dB é quantas vezes mais intenso que um de 70 dB?", ["2", "20", "100", "1.000", "10"], 2, "Diferença de 20 dB → 10²."],
      ["log₁₀ 1000 é igual a:", ["2", "3", "10", "100", "30"], 1, "10³ = 1000."],
      ["Usando log 2 ≈ 0,3, log 8 vale aproximadamente:", ["0,6", "0,9", "2,4", "1,2", "0,8"], 1, "log 2³ = 3 · 0,3."],
    ],
    [["Explique por que um terremoto de magnitude 6 não é apenas \"um pouco\" mais forte que um de magnitude 5.", "Porque a escala Richter é logarítmica: cada ponto a mais significa uma amplitude 10 vezes maior (e cerca de 32 vezes mais energia), então a diferença de 1 ponto já é enorme."]],
  ),
  aula(
    "Simetria e transformações geométricas",
    `## Simetria no mundo

A **simetria** está na natureza (asas de borboleta, flores), na arte (mosaicos, azulejos portugueses, grafismos indígenas), na arquitetura e em logotipos. O ENEM cobra a capacidade de **visualizar** transformações.

## Reflexão (simetria axial)

- A figura é "espelhada" em relação a um **eixo** (reta).
- Cada ponto fica à **mesma distância** do eixo, do outro lado.
- Uma figura tem **eixo de simetria** quando, dobrada sobre ele, as duas metades coincidem.
  - Quadrado: **4 eixos**; retângulo: **2**; triângulo equilátero: **3**; círculo: **infinitos**.
- Letras com simetria vertical: A, H, M, O, T, U, V, W, X, Y.

## Translação

- A figura **desliza** numa direção, sem girar nem mudar de tamanho.
- Muito usada em **padrões** de papel de parede, faixas decorativas e ladrilhos.

## Rotação

- A figura **gira** em torno de um **ponto** (centro), por um certo **ângulo**.
- Rotação de 90°, 180°, 270°...
- Uma figura tem **simetria de rotação** se, girada por um ângulo menor que 360°, coincide com ela mesma (uma estrela de 5 pontas: a cada 72°).

## Homotetia (ampliação e redução)

- A figura é **ampliada** ou **reduzida** mantendo a **forma** (figuras **semelhantes**).
- Se os lados são multiplicados por **k**, a **área** fica multiplicada por **k²** e o **volume** por **k³**.

## No plano cartesiano

- Reflexão no **eixo x**: (x, y) → (x, −y).
- Reflexão no **eixo y**: (x, y) → (−x, y).
- Rotação de 180° em torno da origem: (x, y) → (−x, −y).
- Translação: (x, y) → (x + a, y + b).

## Mosaicos (pavimentações)

Para cobrir um plano sem buracos nem sobreposição com polígonos regulares iguais, a soma dos ângulos ao redor de cada vértice deve ser **360°**. Funciona com **triângulos equiláteros** (6 × 60°), **quadrados** (4 × 90°) e **hexágonos** (3 × 120°) — por isso as abelhas usam hexágonos.

## Resumindo

Reflexão espelha em um eixo; translação desliza; rotação gira em torno de um ponto; homotetia amplia ou reduz (área × k², volume × k³). Mosaicos regulares exigem 360° em cada vértice.`,
    [
      "Reflexão: espelho em um eixo; translação: deslizamento.",
      "Rotação: giro em torno de um ponto por um ângulo.",
      "Ampliar k vezes: área × k² e volume × k³.",
      "Mosaicos regulares: triângulos, quadrados e hexágonos (360°).",
    ],
    [
      ["Eixo de simetria", "Reta que divide a figura em duas partes que se sobrepõem por dobra."],
      ["Translação", "Movimento que desloca a figura sem girá-la."],
      ["Homotetia", "Transformação que amplia ou reduz a figura mantendo a forma."],
    ],
    [
      ["Quantos eixos de simetria tem um quadrado?", ["1", "2", "4", "8", "infinitos"], 2, "2 diagonais + 2 medianas."],
      ["O ponto (3, 5) refletido no eixo x vai para:", ["(−3, 5)", "(3, −5)", "(−3, −5)", "(5, 3)", "(3, 5)"], 1, "Muda o sinal de y."],
      ["Se uma foto é ampliada com lados 3 vezes maiores, sua área fica:", ["3 vezes maior", "6 vezes maior", "9 vezes maior", "27 vezes maior", "igual"], 2, "k² = 9."],
      ["Um padrão de faixa decorativa que repete o mesmo desenho deslizando para o lado usa:", ["rotação", "translação", "reflexão no eixo y", "homotetia", "nenhuma transformação"], 1, "Deslizamento."],
      ["Qual polígono regular NÃO forma um mosaico sozinho?", ["triângulo equilátero", "quadrado", "hexágono regular", "pentágono regular", "nenhum desses"], 3, "108° não divide 360°."],
    ],
    [["Por que é possível cobrir um piso apenas com hexágonos regulares, mas não com pentágonos regulares?", "Porque cada ângulo interno do hexágono mede 120° e três deles somam 360° em cada vértice, sem buracos; o ângulo do pentágono regular mede 108°, e 360 não é múltiplo de 108, então sobram espaços."]],
  ),
  aula(
    "Ângulos, relógios e orientação",
    `## Ângulos no dia a dia

Ângulos aparecem em **relógios**, **mapas**, **rampas**, **giros** de manobras e **direções**.

## Tipos de ângulos

- **Agudo:** menor que 90°.
- **Reto:** 90°.
- **Obtuso:** entre 90° e 180°.
- **Raso:** 180° (meia-volta).
- **Volta completa:** 360°.
- **Complementares:** somam 90°. **Suplementares:** somam 180°.

## Ângulos no relógio

- O mostrador tem 360° e **12 horas** → cada hora corresponde a **30°**.
- O ponteiro dos **minutos** anda **6° por minuto** (360° ÷ 60).
- O ponteiro das **horas** anda **0,5° por minuto** (30° ÷ 60).

**Fórmula do ângulo entre os ponteiros:** |30·H − 5,5·M| (H = horas, M = minutos). Se passar de 180°, use 360° menos o valor.

**Exemplo:** às 3h00 → |90 − 0| = **90°**. Às 2h30 → |60 − 165| = **105°**.

## Giros e direções

- Um giro de **meia-volta** = 180°; **um quarto de volta** = 90°.
- Girar à **direita** (sentido horário) ou à **esquerda** (anti-horário).
- Problemas de **robôs** ou pessoas que andam e viram: acompanhe a direção após cada giro.

## Rosa dos ventos

- **Pontos cardeais:** Norte (N), Sul (S), Leste (L ou E), Oeste (O ou W).
- **Colaterais:** NE, SE, SO, NO (entre os cardeais, a 45°).
- Entre N e L há 90°.
- O Sol **nasce no Leste** e se põe no Oeste (aproximadamente).

## Ângulos em polígonos e retas

- Soma dos ângulos internos de um **triângulo**: 180°.
- Retas paralelas cortadas por uma transversal: ângulos **alternos internos** são iguais.
- Soma dos ângulos internos de um polígono de n lados: (n − 2) · 180°.

## Exemplo de orientação

Uma pessoa está voltada para o Norte, gira 90° à direita (agora Leste), depois 180° (agora Oeste), depois 45° à esquerda: fica voltada para o **Sudoeste**.

## Resumindo

No relógio, cada hora vale 30°, o ponteiro dos minutos anda 6°/min e o das horas 0,5°/min. Na rosa dos ventos, cardeais estão a 90° e colaterais a 45°. Acompanhe os giros passo a passo.`,
    [
      "No relógio: 30° por hora; minutos 6°/min; horas 0,5°/min.",
      "Ângulo entre ponteiros: |30H − 5,5M|.",
      "Cardeais a 90° entre si; colaterais a 45°.",
      "Triângulo: 180°; polígono: (n − 2) · 180°.",
    ],
    [
      ["Ângulo reto", "Ângulo de 90°."],
      ["Suplementares", "Ângulos que somam 180°."],
      ["Ponto colateral", "Direção intermediária entre dois cardeais, como Nordeste."],
    ],
    [
      ["Às 4h00, o menor ângulo entre os ponteiros do relógio é:", ["90°", "120°", "100°", "150°", "60°"], 1, "4 · 30° = 120°."],
      ["Às 6h00 o ângulo entre os ponteiros é:", ["90°", "180°", "360°", "0°", "120°"], 1, "Ponteiros opostos."],
      ["Às 3h30, o ângulo entre os ponteiros é:", ["75°", "90°", "105°", "60°", "15°"], 0, "|90 − 165| = 75°."],
      ["Voltada para o Norte, uma pessoa gira 90° à esquerda. Fica voltada para:", ["Leste", "Oeste", "Sul", "Nordeste", "Sudeste"], 1, "Anti-horário a partir do Norte."],
      ["O complemento de um ângulo de 35° é:", ["145°", "55°", "65°", "325°", "35°"], 1, "90 − 35."],
    ],
    [["Explique como calcular o ângulo entre os ponteiros de um relógio às 2h20.", "Usa-se |30·H − 5,5·M|: |30·2 − 5,5·20| = |60 − 110| = 50°; isso porque o ponteiro das horas anda 30° por hora mais 0,5° por minuto e o dos minutos anda 6° por minuto."]],
  ),
];
