import { aula } from "./build";

/** Matemática, lote 2: geometria, contagem, probabilidade e estatística. */
export const MATEMATICA_2 = [
  aula(
    "Semelhança de triângulos e Teorema de Tales",
    `## Figuras semelhantes

Duas figuras são **semelhantes** quando têm a mesma forma, mas tamanhos diferentes: os ângulos são iguais e os lados são **proporcionais**. Uma foto ampliada é semelhante à original.

## Triângulos semelhantes

Dois triângulos são semelhantes quando têm **dois ângulos iguais**. Aí, a razão entre lados correspondentes é sempre a mesma (a **razão de semelhança**).

## A sombra do prédio

Uma aplicação clássica do ENEM: um poste de 3 m faz uma sombra de 2 m. No mesmo momento, um prédio faz sombra de 20 m. Qual a altura do prédio?

Os raios de sol chegam com o mesmo ângulo, formando triângulos semelhantes:

3 ÷ 2 = h ÷ 20 → h = **30 m**.

## Teorema de Tales

Quando retas **paralelas** cortam duas retas transversais, os segmentos formados são proporcionais. É assim que se divide um terreno em lotes com frentes proporcionais.

Ex.: paralelas determinam numa transversal segmentos de 4 e 6; na outra, o primeiro segmento mede 10. O segundo mede x: 4/6 = 10/x → x = **15**.

## Razão entre áreas e volumes

Se a razão entre os lados é k:

- a razão entre as **áreas** é k²;
- a razão entre os **volumes** é k³.

Uma maquete na escala 1:100 tem área 10.000 vezes menor que o prédio real.

## Resumindo

Semelhança: mesmos ângulos e lados proporcionais. Use-a em sombras, mapas, maquetes e divisões de terrenos (Tales). Áreas variam com k² e volumes com k³.`,
    [
      "Figuras semelhantes têm ângulos iguais e lados proporcionais.",
      "Dois ângulos iguais bastam para dois triângulos serem semelhantes.",
      "Tales: paralelas cortando transversais formam segmentos proporcionais.",
      "Se os lados estão na razão k, as áreas estão em k² e os volumes em k³.",
    ],
    [
      ["Semelhança", "Mesma forma com tamanhos diferentes: ângulos iguais e lados proporcionais."],
      ["Razão de semelhança", "Número que relaciona os lados correspondentes de figuras semelhantes."],
      ["Transversal", "Reta que corta duas ou mais retas paralelas."],
    ],
    [
      ["Uma pessoa de 1,8 m faz sombra de 1,2 m. Uma árvore, no mesmo instante, faz sombra de 8 m. A árvore mede:", ["10 m", "12 m", "14 m", "16 m", "9,6 m"], 1, "1,8 ÷ 1,2 = h ÷ 8 → h = 12 m."],
      ["Dois triângulos são semelhantes quando:", ["têm o mesmo perímetro", "têm dois ângulos iguais", "têm a mesma área", "têm um lado igual", "são retângulos"], 1, "Com dois ângulos iguais, o terceiro também é igual e os lados ficam proporcionais."],
      ["Pelo Teorema de Tales, se 3/5 = 9/x, então x vale:", ["12", "15", "18", "27", "45"], 1, "3x = 45 → x = 15."],
      ["Uma maquete tem escala 1:50. A área real é quantas vezes a área da maquete?", ["50", "100", "500", "2.500", "125.000"], 3, "Áreas variam com k²: 50² = 2.500."],
      ["Uma foto de 10 cm × 15 cm é ampliada para 20 cm de largura, mantendo a forma. A altura nova é:", ["25 cm", "30 cm", "35 cm", "40 cm", "45 cm"], 1, "A razão é 2: 15 × 2 = 30 cm."],
    ],
    [["Explique como a semelhança de triângulos permite medir a altura de um prédio pela sombra.", "No mesmo instante, os raios de sol formam ângulos iguais, então o triângulo do prédio e sua sombra é semelhante ao de um objeto de altura conhecida e sua sombra; basta montar a proporção entre altura e sombra."]],
  ),
  aula(
    "Volumes: prismas, cilindros, cones e esferas",
    `## Volume é espaço ocupado

Volume mede quanto um sólido ocupa no espaço, em unidades cúbicas (cm³, m³). Também se relaciona com **capacidade**: **1 dm³ = 1 litro** e **1 m³ = 1.000 litros**.

## Prismas e cilindros

A regra é a mesma: **área da base × altura**.

- **Paralelepípedo (caixa):** comprimento × largura × altura.
- **Cubo:** aresta³.
- **Cilindro:** π × r² × altura.

Ex.: uma caixa-d'água de 2 m × 1 m × 1,5 m tem 3 m³ = **3.000 litros**.

## Pirâmides e cones

Têm **um terço** do volume do prisma ou cilindro de mesma base e altura:

- **Pirâmide:** (área da base × altura) ÷ 3.
- **Cone:** (π × r² × altura) ÷ 3.

## Esfera

**V = (4/3) × π × r³**. Aparece em bolas, tanques esféricos e gotas.

## Situações do ENEM

- Quantas latas cilíndricas cabem numa caixa?
- Quanto tempo uma torneira leva para encher um reservatório? (volume ÷ vazão)
- Uma piscina de 10 m × 5 m × 1,2 m precisa de 60 m³ = 60.000 litros.

## Cuidado com unidades

Converta tudo para a mesma unidade antes de calcular. Se as medidas estão em cm, o volume sai em cm³; 1.000 cm³ = 1 litro.

## Resumindo

Prisma e cilindro: base × altura. Pirâmide e cone: um terço disso. Esfera: 4/3 πr³. 1 m³ = 1.000 L e 1 dm³ = 1 L.`,
    [
      "Prisma e cilindro: volume = área da base × altura.",
      "Pirâmide e cone têm um terço do volume do prisma ou cilindro equivalente.",
      "Esfera: V = 4/3 × π × r³.",
      "1 m³ = 1.000 litros; 1 dm³ = 1 litro; 1.000 cm³ = 1 litro.",
    ],
    [
      ["Volume", "Espaço ocupado por um sólido, em unidades cúbicas."],
      ["Capacidade", "Quanto um recipiente comporta, geralmente em litros."],
      ["Vazão", "Volume que passa por unidade de tempo, como litros por minuto."],
    ],
    [
      ["Uma caixa tem 50 cm × 20 cm × 10 cm. Seu volume em litros é:", ["1 L", "10 L", "100 L", "1.000 L", "10.000 L"], 1, "50 × 20 × 10 = 10.000 cm³ = 10 L."],
      ["Um cilindro tem raio 2 m e altura 5 m. Com π = 3, o volume é:", ["30 m³", "60 m³", "120 m³", "20 m³", "15 m³"], 1, "π · r² · h = 3 · 4 · 5 = 60 m³."],
      ["Um cone e um cilindro têm mesma base e mesma altura. O volume do cone é:", ["igual ao do cilindro", "metade do cilindro", "um terço do cilindro", "o dobro do cilindro", "três vezes o cilindro"], 2, "Cone (e pirâmide) = 1/3 do cilindro (e prisma) correspondente."],
      ["Uma piscina de 8 m × 4 m × 1,5 m comporta:", ["48 L", "480 L", "4.800 L", "48.000 L", "480.000 L"], 3, "8 × 4 × 1,5 = 48 m³ = 48.000 L."],
      ["Uma torneira despeja 20 L por minuto. Para encher 1,2 m³, leva:", ["6 min", "20 min", "60 min", "120 min", "600 min"], 2, "1,2 m³ = 1.200 L; 1.200 ÷ 20 = 60 min."],
    ],
    [["Como se calcula quanto tempo uma torneira leva para encher um reservatório?", "Calcula-se o volume do reservatório, converte-se para litros e divide-se pela vazão da torneira, que é quantos litros ela despeja por minuto."]],
  ),
  aula(
    "Planificações, vistas e projeções",
    `## Visualizar no espaço

Muitas questões de geometria do ENEM não pedem cálculo, mas **visualização**: imaginar um sólido aberto, visto de cima ou de lado.

## Planificação

**Planificar** é "abrir" um sólido e deixá-lo no plano.

- **Cubo:** seis quadrados; existem 11 planificações diferentes do cubo.
- **Cilindro:** dois círculos e um retângulo (a lateral desenrolada). O comprimento do retângulo é o perímetro do círculo (2πr).
- **Cone:** um círculo e um setor circular.
- **Pirâmide de base quadrada:** um quadrado e quatro triângulos.

## Vistas

- **Vista frontal:** como o objeto aparece olhando de frente.
- **Vista superior:** olhando de cima.
- **Vista lateral:** olhando de lado.

Uma pilha de cubos pode ter vistas diferentes de cada ângulo. Para resolver, imagine-se de pé no lugar indicado.

## Projeção ortogonal

É a "sombra" de uma figura sobre um plano, com a luz chegando perpendicularmente. A projeção de um cilindro em pé vista de cima é um **círculo**; vista de lado é um **retângulo**.

## Caminhos sobre a superfície

Uma formiga andando sobre um cubo pelo menor caminho: planifique o cubo e trace uma **reta** entre os pontos. Muitas vezes, o resultado sai com o teorema de Pitágoras.

## Resumindo

Planificar é abrir o sólido; vistas mostram o objeto de frente, de cima e de lado; projeção é a sombra perpendicular. Para menor caminho na superfície, planifique e trace a reta.`,
    [
      "Planificar é abrir o sólido no plano.",
      "Cilindro planificado: dois círculos e um retângulo com comprimento 2πr.",
      "Vistas frontal, superior e lateral mostram o objeto de lados diferentes.",
      "Menor caminho sobre a superfície: planifique e trace uma reta.",
    ],
    [
      ["Planificação", "Figura plana obtida ao abrir as faces de um sólido."],
      ["Vista superior", "Como o objeto aparece visto de cima."],
      ["Projeção ortogonal", "Sombra de uma figura sobre um plano, com luz perpendicular a ele."],
    ],
    [
      ["A planificação de um cilindro é formada por:", ["dois quadrados e um círculo", "dois círculos e um retângulo", "um círculo e um triângulo", "seis quadrados", "quatro triângulos"], 1, "As bases são dois círculos e a lateral desenrolada é um retângulo."],
      ["A planificação de um cubo tem quantas faces?", ["4", "5", "6", "8", "12"], 2, "O cubo tem 6 faces quadradas."],
      ["A vista superior de um cone em pé (base no chão) é:", ["um triângulo", "um retângulo", "um círculo", "um quadrado", "um trapézio"], 2, "Visto de cima, o cone mostra o contorno circular da base (com o vértice no centro)."],
      ["A lateral de um cilindro de raio 5 cm, planificada, é um retângulo cujo comprimento é (π = 3,14):", ["15,7 cm", "31,4 cm", "78,5 cm", "10 cm", "25 cm"], 1, "Comprimento = 2πr = 2 × 3,14 × 5 = 31,4 cm."],
      ["Para achar o menor caminho de uma formiga sobre a superfície de uma caixa, deve-se:", ["somar todas as arestas", "planificar a caixa e traçar uma reta", "calcular o volume", "andar pelas arestas", "medir a diagonal interna"], 1, "Na planificação, o menor caminho entre dois pontos é a reta."],
    ],
    [["Descreva a planificação de uma pirâmide de base quadrada.", "É formada por um quadrado, que é a base, e quatro triângulos, que são as faces laterais, presos aos lados do quadrado."]],
  ),
  aula(
    "Contagem: o princípio multiplicativo",
    `## Contar sem listar tudo

Quantos códigos, senhas, placas ou combinações de roupas existem? Em vez de listar um por um, usamos o **princípio fundamental da contagem**.

## A regra

Se uma escolha tem **m** opções e outra escolha, independente, tem **n** opções, juntas elas têm **m × n** possibilidades.

Ex.: 3 camisas e 4 calças dão 3 × 4 = **12** combinações de roupa.

## Senhas e placas

- Senha de 4 dígitos (0 a 9), podendo repetir: 10 × 10 × 10 × 10 = **10.000**.
- Sem repetir dígitos: 10 × 9 × 8 × 7 = **5.040**.
- Placa com 3 letras (26) e 4 algarismos: 26³ × 10⁴.

## Restrições

Comece pela posição com **mais restrições**. Ex.: números de 3 algarismos distintos que sejam pares:

- O último algarismo precisa ser par. Mas o primeiro não pode ser zero. Separe os casos: terminando em 0 (9 × 8 × 1 = 72) e terminando em 2, 4, 6 ou 8 (8 × 8 × 4 = 256). Total: **328**.

## "E" multiplica, "ou" soma

- "Escolher uma camisa **E** uma calça": multiplique.
- "Ir de ônibus **OU** de metrô": some as opções.

## Fatorial

O número de formas de **ordenar** n objetos é n! = n × (n−1) × ... × 1. Cinco pessoas numa fila: 5! = **120** formas.

## Resumindo

Escolhas sucessivas e independentes se multiplicam. Comece pelas posições com restrição, some casos separados ("ou") e use o fatorial para ordenar objetos.`,
    [
      "Princípio multiplicativo: escolhas independentes se multiplicam.",
      "Com repetição: 10 × 10 × ...; sem repetição: 10 × 9 × 8 ...",
      "Comece pela posição com mais restrições.",
      "“E” multiplica, “ou” soma; n! ordena n objetos.",
    ],
    [
      ["Princípio fundamental da contagem", "Se há m formas de fazer uma coisa e n de fazer outra, há m × n formas de fazer as duas."],
      ["Fatorial", "Produto n × (n−1) × ... × 1, que conta as ordenações de n objetos."],
      ["Restrição", "Condição que limita as opções em uma posição."],
    ],
    [
      ["Um lanche tem 4 tipos de pão e 5 recheios. Quantos lanches diferentes (1 pão e 1 recheio)?", ["9", "20", "25", "45", "120"], 1, "4 × 5 = 20."],
      ["Quantas senhas de 3 dígitos (0 a 9) existem, podendo repetir?", ["30", "720", "900", "1.000", "10.000"], 3, "10 × 10 × 10 = 1.000."],
      ["E sem repetir dígitos?", ["504", "720", "810", "900", "1.000"], 1, "10 × 9 × 8 = 720."],
      ["De quantas formas 4 amigos podem se sentar em 4 cadeiras em fila?", ["4", "8", "16", "24", "256"], 3, "4! = 4 × 3 × 2 × 1 = 24."],
      ["Para ir à escola, há 3 linhas de ônibus ou 2 de metrô. Quantas opções de transporte há?", ["5", "6", "8", "9", "1"], 0, "É uma escolha OU outra: 3 + 2 = 5."],
    ],
    [["Explique quando somar e quando multiplicar em problemas de contagem.", "Multiplica-se quando as escolhas são feitas juntas, uma e outra; soma-se quando se escolhe uma opção ou outra, casos que não acontecem ao mesmo tempo."]],
  ),
  aula(
    "Permutações e combinações",
    `## A ordem importa?

Esta é a pergunta-chave da análise combinatória.

- **Ordem importa:** pódio de corrida (1º, 2º, 3º), senhas, filas → **arranjo** ou **permutação**.
- **Ordem não importa:** grupos, comissões, saladas de fruta → **combinação**.

## Permutação

Ordenar **todos** os n elementos: Pₙ = n!.

Anagramas da palavra AMOR: 4! = **24**.

Com letras repetidas, divida pelas repetições: anagramas de ARARA (A×3, R×2) = 5! ÷ (3! × 2!) = **10**.

## Arranjo

Escolher p de n elementos **em ordem**: A = n! ÷ (n − p)!.

Pódio com 3 de 8 corredores: 8 × 7 × 6 = **336**.

## Combinação

Escolher p de n elementos **sem ordem**: C = n! ÷ [p! × (n − p)!].

Comissão de 3 pessoas entre 8: 336 ÷ 3! = 336 ÷ 6 = **56**. Dividimos por 3! porque, num grupo, as 6 ordens das mesmas 3 pessoas são o mesmo grupo.

## Exemplo do ENEM

Uma lanchonete monta saladas com 3 frutas entre 6 disponíveis: C(6,3) = (6 × 5 × 4) ÷ 6 = **20** saladas.

Um jogo de loteria em que se escolhem números sem ordem também é uma combinação. Na Mega-Sena, escolhem-se 6 números entre 60: são mais de 50 milhões de combinações possíveis, por isso a chance de acertar com um jogo simples é tão pequena.

## Resumindo

Pergunte se trocar a ordem muda o resultado. Se muda: arranjo ou permutação. Se não muda: combinação (divida pelo fatorial do tamanho do grupo).`,
    [
      "Pergunta-chave: trocar a ordem muda o resultado?",
      "Permutação: ordenar todos (n!); com repetições, divide-se pelos fatoriais das repetições.",
      "Arranjo: escolher em ordem; combinação: escolher sem ordem.",
      "Combinação = arranjo ÷ p! (as ordens do mesmo grupo contam uma vez).",
    ],
    [
      ["Permutação", "Todas as ordenações possíveis de um conjunto de elementos."],
      ["Arranjo", "Escolha de alguns elementos em que a ordem importa."],
      ["Combinação", "Escolha de alguns elementos em que a ordem não importa."],
    ],
    [
      ["Quantos anagramas tem a palavra LIVRO?", ["24", "60", "100", "120", "720"], 3, "5 letras distintas: 5! = 120."],
      ["Escolher presidente e vice entre 6 pessoas é um problema de:", ["combinação", "arranjo", "soma simples", "média", "probabilidade apenas"], 1, "A ordem importa (presidente ≠ vice): é arranjo, 6 × 5 = 30."],
      ["Quantas comissões de 2 pessoas podem ser formadas com 5 pessoas?", ["5", "10", "20", "25", "120"], 1, "C(5,2) = (5 × 4) ÷ 2 = 10."],
      ["Quantos anagramas tem a palavra OVO?", ["2", "3", "6", "9", "1"], 1, "3! ÷ 2! = 3 (o O se repete 2 vezes)."],
      ["Um sorvete com 2 sabores diferentes entre 7 (sem importar a ordem) pode ser feito de quantas formas?", ["14", "21", "42", "49", "7"], 1, "C(7,2) = (7 × 6) ÷ 2 = 21."],
    ],
    [["Explique, com um exemplo, a diferença entre arranjo e combinação.", "No arranjo a ordem importa, como escolher 1º e 2º lugar numa corrida; na combinação a ordem não importa, como escolher duas pessoas para uma comissão, em que trocar a ordem dá o mesmo grupo."]],
  ),
  aula(
    "Probabilidade: chance de um evento",
    `## Probabilidade é uma razão

A **probabilidade** de um evento é:

P = casos favoráveis ÷ casos possíveis

Ela vai de **0** (impossível) a **1** (certo), ou de 0% a 100%.

Ex.: tirar um número par num dado: {2, 4, 6} → 3 ÷ 6 = **1/2 = 50%**.

## Evento complementar

A probabilidade de algo **não** acontecer é **1 − P**. Muitas vezes é mais fácil calcular o contrário.

Ex.: probabilidade de **não** tirar 6 num dado: 1 − 1/6 = **5/6**.

"Pelo menos um": calcule a chance de **nenhum** e subtraia de 1. Em dois lances de moeda, P(pelo menos uma cara) = 1 − P(nenhuma cara) = 1 − 1/4 = **3/4**.

## Eventos independentes: multiplique

Se um evento não interfere no outro, a probabilidade de os dois acontecerem é o **produto**:

Duas moedas darem cara: 1/2 × 1/2 = **1/4**.

## Eventos que não podem ocorrer juntos: some

Tirar 1 **ou** 2 num dado: 1/6 + 1/6 = **2/6 = 1/3**.

## Sem reposição

Se você tira uma bola de uma urna e **não devolve**, o total muda. Urna com 3 bolas vermelhas e 2 azuis; tirar duas vermelhas seguidas: 3/5 × 2/4 = **6/20 = 3/10**.

## Resumindo

P = favoráveis ÷ possíveis. Use o complementar para "pelo menos um", multiplique para "e" (independentes), some para "ou" (excludentes) e ajuste o total quando não há reposição.`,
    [
      "P = casos favoráveis ÷ casos possíveis, entre 0 e 1.",
      "Complementar: P(não acontecer) = 1 − P.",
      "“Pelo menos um” = 1 − P(nenhum).",
      "Independentes: multiplique; excludentes (“ou”): some.",
    ],
    [
      ["Espaço amostral", "Conjunto de todos os resultados possíveis."],
      ["Evento complementar", "O evento contrário: tudo o que não é o evento."],
      ["Eventos independentes", "Eventos em que um não altera a chance do outro."],
    ],
    [
      ["Ao lançar um dado, a probabilidade de sair um número maior que 4 é:", ["1/6", "1/3", "1/2", "2/3", "5/6"], 1, "Favoráveis {5, 6}: 2 ÷ 6 = 1/3."],
      ["Lançando duas moedas, a probabilidade de saírem duas coroas é:", ["1/2", "1/3", "1/4", "1/8", "3/4"], 2, "1/2 × 1/2 = 1/4."],
      ["A chance de chover amanhã é 30%. A chance de não chover é:", ["30%", "50%", "60%", "70%", "100%"], 3, "Complementar: 100% − 30% = 70%."],
      ["Uma urna tem 4 bolas brancas e 6 pretas. Tirando uma ao acaso, a chance de ser branca é:", ["4%", "40%", "60%", "1/4", "2/3"], 1, "4 ÷ 10 = 0,4 = 40%."],
      ["Lançando 3 moedas, a probabilidade de sair pelo menos uma cara é:", ["1/8", "3/8", "1/2", "7/8", "1"], 3, "1 − P(nenhuma cara) = 1 − 1/8 = 7/8."],
    ],
    [["Por que, em problemas de “pelo menos um”, costuma ser mais fácil usar o evento complementar?", "Porque calcular a chance de nenhum acontecer é um único caso simples; depois basta subtrair de 1, em vez de somar vários casos diferentes."]],
  ),
  aula(
    "Medidas de dispersão: amplitude e desvio padrão",
    `## Média não conta tudo

Dois alunos têm média 6:

- Aluno A: notas 6, 6, 6, 6.
- Aluno B: notas 2, 10, 2, 10.

A média é igual, mas o aluno A é muito mais **regular**. As **medidas de dispersão** mostram o quanto os dados se espalham em torno da média.

## Amplitude

A mais simples: **maior valor − menor valor**. Aluno A: 0. Aluno B: 8.

## Variância e desvio padrão

1. Calcule a média.
2. Subtraia a média de cada valor (desvios).
3. Eleve cada desvio ao quadrado e tire a média: essa é a **variância**.
4. Tire a raiz quadrada: esse é o **desvio padrão**.

Aluno B: desvios −4, 4, −4, 4; quadrados 16 cada; variância 16; **desvio padrão 4**.
Aluno A: desvio padrão **0**.

## Como interpretar

- **Desvio padrão pequeno:** dados próximos da média, mais regularidade.
- **Desvio padrão grande:** dados espalhados, menos regularidade.

No ENEM, questões pedem para escolher o candidato, o fornecedor ou o atleta **mais regular**: é o que tem **menor desvio padrão**, mesmo que a média seja parecida.

## Cuidados

- O desvio padrão tem a mesma unidade dos dados (em reais, em pontos).
- Muitas vezes a questão já dá o desvio padrão: você só precisa comparar.

## Resumindo

Média mostra o centro; dispersão mostra o espalhamento. Amplitude é maior menos menor; desvio padrão é a raiz da média dos quadrados dos desvios. Mais regular = menor desvio padrão.`,
    [
      "Medidas de dispersão mostram o quanto os dados se espalham em torno da média.",
      "Amplitude = maior valor − menor valor.",
      "Desvio padrão = raiz quadrada da variância.",
      "Mais regular = menor desvio padrão.",
    ],
    [
      ["Amplitude", "Diferença entre o maior e o menor valor de um conjunto."],
      ["Variância", "Média dos quadrados das diferenças entre cada valor e a média."],
      ["Desvio padrão", "Raiz quadrada da variância; mede a dispersão na unidade dos dados."],
    ],
    [
      ["A amplitude dos dados 4, 9, 2, 7, 5 é:", ["5", "6", "7", "9", "27"], 2, "9 − 2 = 7."],
      ["Dois atletas têm a mesma média. O mais regular é o que tem:", ["maior desvio padrão", "menor desvio padrão", "maior amplitude", "mais competições", "maior moda"], 1, "Menor desvio padrão significa resultados mais próximos da média."],
      ["As notas 5, 5, 5, 5 têm desvio padrão:", ["0", "1", "5", "25", "não existe"], 0, "Todos os valores são iguais à média: não há dispersão."],
      ["A variância de um conjunto é 9. O desvio padrão é:", ["3", "4,5", "9", "18", "81"], 0, "Desvio padrão = √9 = 3."],
      ["Os dados 2 e 8 têm média 5. Os desvios são −3 e 3. O desvio padrão é:", ["0", "3", "6", "9", "5"], 1, "Quadrados 9 e 9; variância 9; desvio padrão 3."],
    ],
    [["Explique por que a média sozinha pode não descrever bem um conjunto de dados.", "Porque conjuntos muito diferentes podem ter a mesma média; a dispersão, como o desvio padrão, mostra se os valores estão próximos da média ou muito espalhados."]],
  ),
  aula(
    "Números: múltiplos, divisores, MMC e MDC",
    `## Múltiplos e divisores

- **Múltiplos** de 4: 0, 4, 8, 12, 16... (resultados de 4 × n).
- **Divisores** de 12: 1, 2, 3, 4, 6, 12 (dividem 12 sem deixar resto).
- **Números primos** têm exatamente dois divisores: 1 e ele mesmo (2, 3, 5, 7, 11, 13...).

## Critérios de divisibilidade

- Por **2**: termina em número par.
- Por **3**: a soma dos algarismos é múltiplo de 3.
- Por **5**: termina em 0 ou 5.
- Por **10**: termina em 0.

## MMC: quando as coisas se encontram de novo

O **mínimo múltiplo comum** responde perguntas de "quando acontecerá junto de novo".

Ex.: um ônibus passa a cada 12 minutos e outro a cada 18. Se passaram juntos às 8h, quando voltam a passar juntos? MMC(12, 18) = **36** → às 8h36.

## MDC: dividir em partes iguais e máximas

O **máximo divisor comum** responde "qual o maior tamanho para dividir em partes iguais sem sobrar".

Ex.: cortar duas fitas de 40 cm e 60 cm em pedaços iguais, do maior tamanho possível: MDC(40, 60) = **20 cm** → 2 + 3 = 5 pedaços.

## Como calcular

Fatore em primos:
- 12 = 2² × 3 e 18 = 2 × 3².
- MMC: pegue todos os fatores com o **maior** expoente: 2² × 3² = 36.
- MDC: pegue só os fatores **comuns** com o **menor** expoente: 2 × 3 = 6.

## Resumindo

"Quando se encontram de novo?" → MMC. "Maior pedaço igual sem sobra?" → MDC. Fatore em primos para calcular.`,
    [
      "Múltiplos: resultados da tabuada; divisores: dividem sem resto.",
      "Primos têm só dois divisores: 1 e o próprio número.",
      "MMC responde “quando acontece junto de novo”.",
      "MDC responde “maior parte igual sem sobrar”.",
    ],
    [
      ["Número primo", "Número com exatamente dois divisores: 1 e ele mesmo."],
      ["MMC", "Menor número que é múltiplo de dois ou mais números ao mesmo tempo."],
      ["MDC", "Maior número que divide dois ou mais números sem deixar resto."],
    ],
    [
      ["Dois sinais piscam a cada 6 s e a cada 8 s. Se piscaram juntos agora, piscam juntos de novo em:", ["12 s", "14 s", "24 s", "48 s", "2 s"], 2, "MMC(6, 8) = 24 s."],
      ["Quer-se cortar tábuas de 24 cm e 36 cm em pedaços iguais, os maiores possíveis. Cada pedaço mede:", ["4 cm", "6 cm", "12 cm", "18 cm", "72 cm"], 2, "MDC(24, 36) = 12 cm."],
      ["Qual destes números é primo?", ["21", "27", "29", "33", "39"], 2, "29 só é divisível por 1 e por 29."],
      ["O número 4.635 é divisível por:", ["2", "3 e 5", "10", "só 5", "4"], 1, "Termina em 5 (divisível por 5) e 4 + 6 + 3 + 5 = 18, múltiplo de 3."],
      ["O MDC de 18 e 30 é:", ["2", "3", "6", "9", "90"], 2, "18 = 2 × 3² e 30 = 2 × 3 × 5; comuns com menor expoente: 2 × 3 = 6."],
    ],
    [["Explique como identificar, num problema, se a conta é de MMC ou de MDC.", "Usa-se MMC quando se pergunta quando dois eventos que se repetem vão coincidir de novo; usa-se MDC quando se quer dividir quantidades em partes iguais com o maior tamanho possível, sem sobra."]],
  ),
  aula(
    "Notação científica e ordem de grandeza",
    `## Números muito grandes ou muito pequenos

Distâncias no espaço, tamanho de vírus, população mundial: escrever esses números por extenso é difícil. A **notação científica** resolve:

número = a × 10ⁿ, com a entre 1 e 10 (1 ≤ a < 10).

- 300.000.000 = **3 × 10⁸** (velocidade da luz em m/s).
- 0,00005 = **5 × 10⁻⁵**.

## Como converter

- Número grande: conte quantas casas a vírgula andou para a **esquerda** → expoente positivo.
  45.000 = 4,5 × 10⁴.
- Número pequeno: conte quantas casas andou para a **direita** → expoente negativo.
  0,0032 = 3,2 × 10⁻³.

## Operações

- **Multiplicar:** multiplique os números e **some** os expoentes. (2 × 10³) × (3 × 10⁴) = 6 × 10⁷.
- **Dividir:** divida os números e **subtraia** os expoentes. (8 × 10⁶) ÷ (2 × 10²) = 4 × 10⁴.

## Ordem de grandeza

É a potência de 10 mais próxima do número. Regra prática: se a ≥ 3,16 (≈ √10), arredonde para cima.

- 2 × 10⁵ → ordem de grandeza 10⁵.
- 7 × 10⁵ → ordem de grandeza 10⁶.

## Prefixos

- quilo (k) = 10³, mega (M) = 10⁶, giga (G) = 10⁹.
- mili (m) = 10⁻³, micro (μ) = 10⁻⁶, nano (n) = 10⁻⁹.

Um celular de 128 GB tem 128 × 10⁹ bytes.

## Resumindo

Notação científica: a × 10ⁿ com 1 ≤ a < 10. Multiplicando, some expoentes; dividindo, subtraia. Ordem de grandeza é a potência de 10 mais próxima.`,
    [
      "Notação científica: a × 10ⁿ, com a entre 1 e 10.",
      "Vírgula para a esquerda: expoente positivo; para a direita: negativo.",
      "Multiplicação soma expoentes; divisão subtrai.",
      "Prefixos: quilo 10³, mega 10⁶, giga 10⁹; mili 10⁻³, micro 10⁻⁶, nano 10⁻⁹.",
    ],
    [
      ["Notação científica", "Forma de escrever números como a × 10ⁿ, com a entre 1 e 10."],
      ["Ordem de grandeza", "Potência de 10 mais próxima de um número."],
      ["Prefixo", "Termo como quilo ou mili que indica uma potência de 10."],
    ],
    [
      ["O número 72.000.000 em notação científica é:", ["72 × 10⁶", "7,2 × 10⁷", "7,2 × 10⁶", "0,72 × 10⁸", "7,2 × 10⁸"], 1, "A vírgula anda 7 casas para a esquerda: 7,2 × 10⁷."],
      ["O número 0,0009 em notação científica é:", ["9 × 10⁻³", "9 × 10⁻⁴", "9 × 10⁴", "0,9 × 10⁻³", "90 × 10⁻⁵"], 1, "A vírgula anda 4 casas para a direita: 9 × 10⁻⁴."],
      ["(3 × 10⁵) × (2 × 10³) é igual a:", ["5 × 10⁸", "6 × 10⁸", "6 × 10¹⁵", "6 × 10²", "5 × 10¹⁵"], 1, "3 × 2 = 6 e 5 + 3 = 8: 6 × 10⁸."],
      ["Um nanômetro corresponde a:", ["10³ m", "10⁻³ m", "10⁻⁶ m", "10⁻⁹ m", "10⁹ m"], 3, "Nano = 10⁻⁹."],
      ["A ordem de grandeza de 8 × 10⁴ é:", ["10³", "10⁴", "10⁵", "10⁶", "8"], 2, "8 é maior que 3,16, então arredonda-se para 10⁵."],
    ],
    [["Explique como se escreve um número muito pequeno, como 0,00045, em notação científica.", "Move-se a vírgula para a direita até ficar um número entre 1 e 10, no caso 4,5, contando 4 casas; como andou para a direita, o expoente é negativo: 4,5 vezes 10 elevado a menos 4."]],
  ),
  aula(
    "Grandezas compostas: velocidade, vazão e densidade",
    `## Quando uma grandeza é razão de outras

Algumas grandezas do dia a dia são **divisões** entre duas medidas:

- **Velocidade média** = distância ÷ tempo (km/h, m/s).
- **Vazão** = volume ÷ tempo (L/min).
- **Densidade** = massa ÷ volume (g/cm³, kg/m³).
- **Densidade demográfica** = população ÷ área (hab/km²).
- **Consumo de combustível** = distância ÷ litros (km/L).

## Velocidade média

Um carro percorre 240 km em 3 horas: v = 240 ÷ 3 = **80 km/h**.

Cuidado: a velocidade média de uma viagem é **distância total ÷ tempo total**, não a média das velocidades.

Conversão: para passar de km/h para m/s, **divida por 3,6**. 72 km/h = 20 m/s.

## Vazão e tempo de enchimento

Uma caixa de 1.000 L com torneira de 25 L/min enche em 1.000 ÷ 25 = **40 minutos**.

## Densidade

A densidade explica por que o óleo boia na água: o óleo é menos denso. Um objeto de 600 g e 200 cm³ tem densidade **3 g/cm³**.

## Densidade demográfica

Um município com 50.000 habitantes e 250 km² tem 200 hab/km². Um estado muito populoso pode ter densidade baixa se for enorme.

## Consumo

Um carro que faz 12 km/L gasta 25 L para rodar 300 km. Comparar carros pelo consumo é uma questão comum.

## Resumindo

Identifique as duas grandezas da razão e as unidades. Velocidade média é total ÷ total. Para km/h → m/s, divida por 3,6.`,
    [
      "Velocidade = distância ÷ tempo; vazão = volume ÷ tempo; densidade = massa ÷ volume.",
      "Velocidade média = distância total ÷ tempo total.",
      "km/h para m/s: divida por 3,6.",
      "Densidade demográfica = população ÷ área.",
    ],
    [
      ["Velocidade média", "Distância total percorrida dividida pelo tempo total gasto."],
      ["Densidade", "Massa de um corpo dividida pelo seu volume."],
      ["Densidade demográfica", "Número de habitantes por unidade de área."],
    ],
    [
      ["Um ônibus percorre 180 km em 2,5 h. Sua velocidade média é:", ["60 km/h", "72 km/h", "75 km/h", "80 km/h", "90 km/h"], 1, "180 ÷ 2,5 = 72 km/h."],
      ["90 km/h equivalem a:", ["15 m/s", "20 m/s", "25 m/s", "30 m/s", "324 m/s"], 2, "90 ÷ 3,6 = 25 m/s."],
      ["Um bloco tem massa 800 g e volume 100 cm³. Sua densidade é:", ["0,8 g/cm³", "8 g/cm³", "80 g/cm³", "800 g/cm³", "0,125 g/cm³"], 1, "800 ÷ 100 = 8 g/cm³."],
      ["Uma cidade tem 120.000 habitantes e 400 km². A densidade demográfica é:", ["30 hab/km²", "300 hab/km²", "3.000 hab/km²", "480 hab/km²", "48 hab/km²"], 1, "120.000 ÷ 400 = 300 hab/km²."],
      ["Um carro faz 14 km/L. Para rodar 420 km, gasta:", ["20 L", "25 L", "30 L", "35 L", "42 L"], 2, "420 ÷ 14 = 30 L."],
    ],
    [["Por que a velocidade média de uma viagem não é a média das velocidades de cada trecho?", "Porque cada trecho pode durar um tempo diferente; a velocidade média é a distância total dividida pelo tempo total, e trechos mais demorados pesam mais."]],
  ),
];
