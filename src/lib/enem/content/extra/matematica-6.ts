import { aula } from "./build";

/** Matemática, lote 6: álgebra, médias, ciclos, crédito e funções no cotidiano. */
export const MATEMATICA_6 = [
  aula(
    "Frações no cotidiano: receitas, partes e divisões",
    `## Fração é parte de um todo

Uma **fração** a/b indica que o todo foi dividido em **b** partes iguais e foram tomadas **a** partes.

- 3/4 de uma pizza = 3 de 4 pedaços.
- **Fração de uma quantidade:** 2/5 de 300 = 300 ÷ 5 × 2 = **120**.

## Frações equivalentes e simplificação

- 1/2 = 2/4 = 50/100 (mesmo valor).
- Simplifique dividindo numerador e denominador pelo mesmo número: 18/24 = **3/4**.

## Comparar frações

- Mesmo denominador: maior numerador é maior.
- Denominadores diferentes: iguale os denominadores (MMC) ou transforme em decimal. 3/5 = 0,6 e 2/3 ≈ 0,67 → **2/3 é maior**.

## Operações

- **Somar/subtrair:** iguale os denominadores. 1/2 + 1/3 = 3/6 + 2/6 = **5/6**.
- **Multiplicar:** numerador × numerador, denominador × denominador. 2/3 × 3/4 = 6/12 = **1/2**.
- **Dividir:** multiplique pelo **inverso**. (3/4) ÷ (1/2) = 3/4 × 2 = **3/2**.

## "Fração do que sobrou"

Um clássico do ENEM: "Gastou 1/3 do salário com aluguel e 1/4 do **restante** com alimentação."

- Salário: 1. Aluguel: 1/3 → sobram 2/3.
- Alimentação: 1/4 de 2/3 = **2/12 = 1/6** do salário.
- Total gasto: 1/3 + 1/6 = 1/2 → sobra **1/2** do salário.

Atenção: "do restante" é diferente de "do total"!

## Receitas e proporção

Uma receita para 4 pessoas usa 3/4 de xícara de açúcar. Para 6 pessoas: 3/4 × 6/4 = 18/16 = **9/8 de xícara** (1 xícara e 1/8).

## Frações e porcentagens

- 1/2 = 50%; 1/4 = 25%; 3/4 = 75%; 1/5 = 20%; 1/3 ≈ 33,3%; 1/10 = 10%.

## Frações de tempo

- 1/4 de hora = **15 minutos**; 3/4 de hora = 45 min; 1/3 de hora = 20 min.
- 2,5 horas = 2 horas e **30 minutos** (não 2h50!).

## Resumindo

Fração de uma quantidade: divida pelo denominador e multiplique pelo numerador. Some igualando denominadores; divida multiplicando pelo inverso. Cuidado com "do restante". 1/4 de hora = 15 min; 2,5 h = 2h30.`,
    [
      "2/5 de 300 = 300 ÷ 5 × 2 = 120.",
      "Somar frações: igualar os denominadores.",
      "Dividir: multiplicar pelo inverso.",
      "\"Do restante\" é diferente de \"do total\".",
    ],
    [
      ["Fração", "Representação de partes iguais de um todo."],
      ["Frações equivalentes", "Frações diferentes que representam a mesma quantidade."],
      ["Inverso", "Fração com numerador e denominador trocados: o inverso de 2/3 é 3/2."],
    ],
    [
      ["3/8 de 240 é:", ["80", "90", "30", "120", "72"], 1, "240 ÷ 8 × 3."],
      ["1/4 + 2/3 é igual a:", ["3/7", "11/12", "3/12", "2/12", "5/6"], 1, "3/12 + 8/12."],
      ["Alguém gastou 1/2 do dinheiro e depois 1/3 do restante. Sobrou:", ["1/6", "1/3", "1/2", "2/3", "1/4"], 1, "Restam 1/2 × 2/3."],
      ["3/4 de hora correspondem a:", ["34 min", "45 min", "75 min", "30 min", "40 min"], 1, "60 × 3/4."],
      ["Qual fração é maior?", ["3/5", "4/7", "5/9", "2/3", "1/2"], 3, "2/3 ≈ 0,67."],
    ],
    [["Explique a diferença entre gastar \"1/4 do total\" e \"1/4 do restante\" após já ter gasto parte do dinheiro.", "1/4 do total é calculado sobre o valor inicial; 1/4 do restante é calculado apenas sobre o que sobrou depois do primeiro gasto, resultando num valor menor."]],
  ),
  aula(
    "Potências e raízes: propriedades e aplicações",
    `## Potência

**aⁿ** = a multiplicado por si mesmo **n** vezes. 2⁵ = 2·2·2·2·2 = **32**.

## Casos especiais

- a¹ = a; **a⁰ = 1** (a ≠ 0).
- **Expoente negativo:** a⁻ⁿ = 1/aⁿ. 2⁻³ = 1/8.
- **Base negativa:** expoente par → positivo; ímpar → negativo. (−2)⁴ = 16; (−2)³ = −8.
- Cuidado: −2² = −4 (o sinal fica de fora), mas (−2)² = 4.

## Propriedades

- **Produto de mesma base:** soma os expoentes. aᵐ · aⁿ = aᵐ⁺ⁿ. 2³ · 2⁴ = 2⁷.
- **Divisão de mesma base:** subtrai. aᵐ ÷ aⁿ = aᵐ⁻ⁿ. 10⁵ ÷ 10² = 10³.
- **Potência de potência:** multiplica. (aᵐ)ⁿ = aᵐ·ⁿ. (3²)³ = 3⁶.
- **Potência de produto:** (a·b)ⁿ = aⁿ · bⁿ.

## Potências de 10 e notação científica

- 10³ = 1.000; 10⁶ = 1 milhão; 10⁹ = 1 bilhão; 10⁻³ = 0,001.
- Notação científica: a × 10ⁿ, com 1 ≤ a < 10. 45.000 = 4,5 × 10⁴; 0,0007 = 7 × 10⁻⁴.
- Prefixos: **quilo** (10³), **mega** (10⁶), **giga** (10⁹), **mili** (10⁻³), **micro** (10⁻⁶), **nano** (10⁻⁹).

## Raízes

- √a é o número que, ao quadrado, dá a. √49 = 7.
- ∛a: ao cubo dá a. ∛27 = 3.
- Raiz como potência: **√a = a^(1/2)**.
- **Simplificar:** √50 = √(25 · 2) = **5√2**.
- **Estimar:** √20 está entre 4 (√16) e 5 (√25), mais perto de 4,5 (≈ 4,47).
- **Produto:** √a · √b = √(ab). √2 · √8 = √16 = 4.
- **Não** vale para soma: √9 + √16 = 3 + 4 = 7, mas √25 = 5.

## Aplicações no ENEM

- **Crescimento exponencial:** bactérias que dobram a cada hora: após n horas, N = N₀ · 2ⁿ.
- **Armazenamento digital:** 1 kB ≈ 10³ bytes; 1 GB ≈ 10⁹ bytes.
- **Área e lado:** um quadrado de 64 m² tem lado √64 = 8 m.
- **Distâncias astronômicas** e grandezas microscópicas.

## Resumindo

Mesma base: multiplicar soma expoentes; dividir subtrai; potência de potência multiplica. a⁰ = 1 e a⁻ⁿ = 1/aⁿ. √a = a^(1/2). Raiz do produto é o produto das raízes, mas raiz da soma não é a soma das raízes.`,
    [
      "aᵐ · aⁿ = aᵐ⁺ⁿ; aᵐ ÷ aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ.",
      "a⁰ = 1; a⁻ⁿ = 1/aⁿ.",
      "√a = a^(1/2); √50 = 5√2.",
      "√(a + b) ≠ √a + √b.",
    ],
    [
      ["Potência", "Produto de fatores iguais: aⁿ."],
      ["Expoente", "Número que indica quantas vezes a base é multiplicada."],
      ["Radiciação", "Operação inversa da potenciação."],
    ],
    [
      ["2³ · 2⁵ é igual a:", ["2⁸", "2¹⁵", "4⁸", "2²", "8⁸"], 0, "Soma os expoentes."],
      ["5⁻² é igual a:", ["−25", "1/25", "−10", "25", "1/10"], 1, "Inverso de 5²."],
      ["√72 simplificada é:", ["6√2", "8√3", "36√2", "2√6", "9√8"], 0, "√(36·2)."],
      ["Uma colônia de 100 bactérias dobra a cada hora. Após 5 horas, há:", ["500", "1.000", "3.200", "1.600", "6.400"], 2, "100 · 2⁵."],
      ["0,00045 em notação científica é:", ["4,5 × 10⁻⁴", "45 × 10⁻⁵", "4,5 × 10⁴", "0,45 × 10⁻³", "4,5 × 10⁻³"], 0, "Vírgula 4 casas."],
    ],
    [["Explique por que √9 + √16 é diferente de √25.", "Porque a raiz não se distribui na soma: √9 + √16 = 3 + 4 = 7, enquanto √25 = 5; a propriedade de separar raízes só vale para produtos e quocientes, como √(a·b) = √a · √b."]],
  ),
  aula(
    "Equação do 2º grau: Bhaskara, soma e produto",
    `## A equação

**ax² + bx + c = 0**, com a ≠ 0. As soluções são as **raízes**.

## Fórmula de Bhaskara

1. **Discriminante:** Δ = b² − 4ac.
2. **Raízes:** x = (−b ± √Δ) / (2a).

**O que o Δ indica:**

- Δ > 0: **duas** raízes reais diferentes.
- Δ = 0: **uma** raiz (duas iguais).
- Δ < 0: **nenhuma** raiz real.

**Exemplo:** x² − 5x + 6 = 0 → Δ = 25 − 24 = 1 → x = (5 ± 1)/2 → **x = 3 ou x = 2**.

## Soma e produto (atalho)

Para ax² + bx + c = 0:

- **Soma das raízes:** S = −b/a.
- **Produto das raízes:** P = c/a.

No exemplo: S = 5 e P = 6 → dois números que somam 5 e multiplicam 6: **2 e 3**.

## Casos incompletos

- **c = 0:** x² − 4x = 0 → x(x − 4) = 0 → **x = 0 ou x = 4** (fatorar).
- **b = 0:** x² − 9 = 0 → x² = 9 → **x = ±3**.

## Problemas do ENEM

**Exemplo 1 (área):** um terreno retangular tem um lado 3 m maior que o outro e área de 40 m². x(x + 3) = 40 → x² + 3x − 40 = 0 → Δ = 9 + 160 = 169 → x = (−3 ± 13)/2 → x = 5 (descarta −8, pois não há medida negativa). Lados: **5 m e 8 m**.

**Exemplo 2 (lançamento):** h(t) = −5t² + 20t. Quando a bola volta ao chão? −5t² + 20t = 0 → t(−5t + 20) = 0 → **t = 4 s**.

**Exemplo 3 (lucro zero):** L(x) = −x² + 12x − 20 = 0 → x² − 12x + 20 = 0 → S = 12, P = 20 → **x = 2 ou x = 10** (entre 2 e 10 unidades há lucro).

## Interpretar o resultado

- Descarte valores **sem sentido** (medidas negativas, tempo negativo, número de pessoas fracionário).
- As raízes são os pontos onde a parábola **corta o eixo x**.

## Resumindo

Δ = b² − 4ac; x = (−b ± √Δ)/2a. Δ > 0: duas raízes; Δ = 0: uma; Δ < 0: nenhuma real. Soma = −b/a; produto = c/a. Descarte soluções sem sentido no problema.`,
    [
      "Δ = b² − 4ac; x = (−b ± √Δ) / 2a.",
      "Δ < 0: nenhuma raiz real.",
      "Soma = −b/a; produto = c/a.",
      "Descarte raízes sem sentido (medidas negativas).",
    ],
    [
      ["Discriminante (Δ)", "Valor b² − 4ac, que indica quantas raízes reais a equação tem."],
      ["Raiz", "Valor de x que torna a equação verdadeira."],
      ["Equação incompleta", "Equação do 2º grau com b = 0 ou c = 0."],
    ],
    [
      ["As raízes de x² − 7x + 10 = 0 são:", ["2 e 5", "−2 e −5", "1 e 10", "3 e 4", "−1 e 10"], 0, "Soma 7, produto 10."],
      ["Se Δ < 0, a equação:", ["tem duas raízes reais", "tem uma raiz real", "não tem raízes reais", "tem infinitas raízes", "tem raiz zero"], 2, "Raiz de negativo."],
      ["As raízes de x² − 16 = 0 são:", ["4 e −4", "16 e −16", "8 e −8", "só 4", "0 e 16"], 0, "x² = 16."],
      ["A soma das raízes de 2x² − 8x + 3 = 0 é:", ["8", "4", "−4", "3/2", "−8"], 1, "−b/a = 8/2."],
      ["Um retângulo tem lados x e x + 2 e área 48. O menor lado mede:", ["4", "6", "8", "12", "2"], 1, "x² + 2x − 48 = 0."],
    ],
    [["Como o valor do discriminante (Δ) indica o número de raízes reais de uma equação do 2º grau?", "Se Δ é positivo, há duas raízes reais diferentes; se é zero, há uma raiz (duas iguais); se é negativo, não há raízes reais, pois não existe raiz quadrada real de número negativo."]],
  ),
  aula(
    "Ciclos e calendários: MMC na prática",
    `## Quando eventos voltam a coincidir

Muitos problemas perguntam **quando** dois ou mais eventos periódicos vão acontecer **juntos de novo**. A resposta é o **MMC** (mínimo múltiplo comum) dos períodos.

## Exemplo 1: remédios

Uma pessoa toma um remédio a cada **6 horas** e outro a cada **8 horas**. Tomou os dois juntos às 8h. Quando tomará juntos de novo?

- MMC(6, 8) = **24** → daqui a 24 horas: **8h do dia seguinte**.

## Exemplo 2: ônibus

Duas linhas partem do terminal a cada **12** e **18** minutos. Partiram juntas às 7h. Próxima saída simultânea: MMC(12, 18) = **36 min** → **7h36**.

## Como calcular o MMC

- **Decomposição em fatores primos:** 12 = 2² · 3; 18 = 2 · 3². MMC = 2² · 3² = **36** (maiores expoentes).
- Ou liste os múltiplos até coincidir.

## MDC: dividir em partes iguais

O **MDC** (máximo divisor comum) serve para **dividir** coisas em partes **iguais e do maior tamanho possível**.

**Exemplo:** cortar fitas de 24 cm e 36 cm em pedaços iguais, do maior tamanho possível, sem sobras: MDC(24, 36) = **12 cm** (2 + 3 = 5 pedaços).

**Dica:** MMC → "quando coincidem / juntar"; MDC → "dividir no maior tamanho".

## Calendário

- **Semana:** ciclo de 7 dias. Para saber o dia da semana daqui a **n** dias, use o **resto** da divisão por 7.
  - Hoje é segunda; daqui a 100 dias? 100 ÷ 7 = 14, resto **2** → segunda + 2 = **quarta-feira**.
- **Ano bissexto:** 366 dias, a cada 4 anos (fevereiro com 29 dias). Divisível por 4 (mas anos terminados em 00 só se divisíveis por 400: 2000 foi, 1900 não).
- Um ano comum tem 365 dias = 52 semanas + 1 dia: por isso o mesmo dia avança **1** dia da semana no ano seguinte (2 se passar por um 29 de fevereiro).

## Ciclos e padrões repetitivos

"Uma sequência repete as cores azul, verde, vermelho, amarelo. Qual a cor da 50ª posição?" → 50 ÷ 4 = 12, resto **2** → segunda cor: **verde**.

## Resumindo

Eventos periódicos coincidem a cada MMC dos períodos. MDC divide em partes iguais do maior tamanho. Para dias da semana e padrões repetitivos, use o resto da divisão pelo tamanho do ciclo.`,
    [
      "Coincidir de novo: MMC dos períodos.",
      "Dividir em partes iguais, do maior tamanho: MDC.",
      "Dia da semana daqui a n dias: resto de n ÷ 7.",
      "Padrões repetitivos: resto da divisão pelo tamanho do ciclo.",
    ],
    [
      ["MMC", "Menor número que é múltiplo de dois ou mais números ao mesmo tempo."],
      ["MDC", "Maior número que divide dois ou mais números ao mesmo tempo."],
      ["Ano bissexto", "Ano com 366 dias, que ocorre a cada 4 anos."],
    ],
    [
      ["Dois faróis piscam a cada 10 s e 15 s. Piscaram juntos agora; voltarão a piscar juntos em:", ["25 s", "30 s", "5 s", "150 s", "60 s"], 1, "MMC(10, 15)."],
      ["Para cortar barras de 30 cm e 45 cm em pedaços iguais e do maior tamanho, cada pedaço terá:", ["5 cm", "15 cm", "10 cm", "90 cm", "3 cm"], 1, "MDC(30, 45)."],
      ["Hoje é sexta-feira. Daqui a 30 dias será:", ["sexta", "sábado", "domingo", "segunda", "quinta"], 2, "30 ÷ 7, resto 2."],
      ["Numa sequência que repete A, B, C, a 20ª letra é:", ["A", "B", "C", "não dá para saber", "D"], 1, "20 ÷ 3, resto 2."],
      ["Qual destes anos foi bissexto?", ["1900", "2000", "2100", "2023", "2019"], 1, "Divisível por 400."],
    ],
    [["Explique quando usar MMC e quando usar MDC em problemas, com exemplos.", "Usa-se o MMC quando se quer saber quando eventos periódicos voltam a coincidir, como remédios tomados de 6 em 6 e de 8 em 8 horas; usa-se o MDC para dividir coisas em partes iguais do maior tamanho possível, como cortar fitas sem sobras."]],
  ),
  aula(
    "Médias que mudam: incluir, retirar e trocar valores",
    `## A média como "soma dividida"

**Média = soma dos valores ÷ quantidade de valores**

Portanto: **soma = média × quantidade**. Esse truque resolve muitos problemas do ENEM.

## Incluir um valor

A média de 5 notas é 6. Qual deve ser a 6ª nota para a média subir para 7?

- Soma atual: 5 × 6 = 30.
- Soma necessária: 6 × 7 = 42.
- 6ª nota: 42 − 30 = **12**. (Impossível se a nota máxima for 10!)

## Retirar um valor

A média de idade de 10 pessoas é 20 anos. Uma pessoa de 38 anos sai. Nova média?

- Soma: 10 × 20 = 200. Sem ela: 200 − 38 = 162.
- Nova média: 162 ÷ 9 = **18 anos**.

## Trocar um valor

A média de 4 números é 15. Troca-se o 12 por 20. Nova média: soma 60 → 60 − 12 + 20 = 68 → 68 ÷ 4 = **17**.

## Juntar dois grupos

- Turma A: 20 alunos com média 6. Turma B: 30 alunos com média 8.
- Média geral **não é** (6 + 8)/2 = 7!
- Soma total: 20·6 + 30·8 = 120 + 240 = 360. Total de alunos: 50.
- Média geral: 360 ÷ 50 = **7,2** (puxada pela turma maior).

Isso é uma **média ponderada** pelos tamanhos dos grupos.

## Quanto preciso tirar?

"Para passar, a média de 4 provas deve ser 7. Já tirei 6, 8 e 5. Quanto preciso na última?"

- Soma necessária: 4 × 7 = 28. Já tenho: 19. Preciso de **9**.

## Média e valores extremos

Um valor muito alto ou muito baixo **puxa** a média. Ex.: 9 funcionários ganham R$ 2.000 e o dono, R$ 52.000 → média = (18.000 + 52.000)/10 = **R$ 7.000**, que não representa ninguém. Por isso, nesses casos, a **mediana** (R$ 2.000) é melhor.

## Resumindo

Soma = média × quantidade. Para incluir, retirar ou trocar valores, trabalhe com a soma. Ao juntar grupos, use média ponderada pelos tamanhos. Valores extremos distorcem a média.`,
    [
      "Soma = média × quantidade.",
      "Incluir, retirar ou trocar: recalcule pela soma.",
      "Juntar grupos: média ponderada pelos tamanhos.",
      "Valores extremos distorcem a média.",
    ],
    [
      ["Média aritmética", "Soma dos valores dividida pela quantidade de valores."],
      ["Média ponderada", "Média em que cada valor tem um peso diferente."],
      ["Valor extremo", "Valor muito maior ou muito menor que os demais."],
    ],
    [
      ["A média de 3 números é 10. Somando um 4º número, a média vira 12. Esse número é:", ["12", "14", "18", "20", "16"], 2, "48 − 30."],
      ["A média de 8 pesos é 60 kg. Sai uma pessoa de 74 kg. A nova média é:", ["58 kg", "60 kg", "62 kg", "56 kg", "59 kg"], 0, "(480 − 74) ÷ 7."],
      ["Grupo A: 10 pessoas, média 5; grupo B: 30 pessoas, média 9. A média geral é:", ["7", "8", "6", "7,5", "8,5"], 1, "(50 + 270) ÷ 40."],
      ["Para ter média 6 em 3 provas, tendo tirado 5 e 4, é preciso na 3ª:", ["6", "7", "8", "9", "10"], 3, "18 − 9."],
      ["A média de 5 números é 20. Troca-se o 10 por 30. A nova média é:", ["20", "22", "24", "26", "30"], 2, "(100 + 20) ÷ 5."],
    ],
    [["Por que a média geral de duas turmas não é simplesmente a média das médias de cada turma?", "Porque as turmas podem ter números diferentes de alunos; a média geral deve considerar o tamanho de cada grupo (média ponderada), somando todas as notas e dividindo pelo total de alunos, e a turma maior pesa mais."]],
  ),
  aula(
    "Crédito, cartão e empréstimos: o custo do dinheiro",
    `## Comprar a prazo tem preço

Quando parcelamos ou pegamos dinheiro emprestado, pagamos **juros**: o "aluguel" do dinheiro. O ENEM cobra a capacidade de **comparar** opções e evitar armadilhas.

## Juros compostos no crédito

O crédito usa **juros compostos** ("juros sobre juros"):

**M = C · (1 + i)ⁿ**

**Exemplo:** dívida de R$ 1.000 no **rotativo do cartão** a **10% ao mês**, sem pagar nada por 3 meses:

- 1.000 × 1,1³ = 1.000 × 1,331 = **R$ 1.331**.
- Em 12 meses: 1.000 × 1,1¹² ≈ **R$ 3.138** — a dívida **triplica**!

## Os juros mais caros

- **Rotativo do cartão de crédito** e **cheque especial** estão entre os juros **mais altos** do mercado (podem passar de 100% ao ano).
- Pagar só o **mínimo** da fatura joga o restante para o rotativo.
- Alternativas menos caras: **crédito consignado** (descontado em folha), empréstimo pessoal com juros menores, renegociação.

## À vista ou parcelado?

"Uma TV custa R$ 2.000 à vista ou 10 × R$ 230."

- Total parcelado: **R$ 2.300**. Diferença de R$ 300 = 15% a mais.
- Se for "10 × sem juros" e não houver desconto à vista, parcelar pode valer a pena (o dinheiro fica rendendo).
- Se houver **desconto à vista**, o "sem juros" na verdade **embute** juros.

## CET (Custo Efetivo Total)

Além dos juros, há **tarifas**, **seguros** e **impostos (IOF)**. O **CET** reúne tudo e é o número certo para **comparar** empréstimos. A lei obriga os bancos a informá-lo.

## Superendividamento

- Quando as dívidas ultrapassam a capacidade de pagamento. Milhões de brasileiros estão **inadimplentes**.
- A **Lei do Superendividamento (2021)** permite renegociar dívidas preservando um **mínimo existencial**.
- Educação financeira: **orçamento** (anotar ganhos e gastos), **reserva de emergência**, evitar compras por impulso, cuidado com apostas online.

## Investir é o lado oposto

Quem **poupa** recebe juros compostos a seu favor (poupança, Tesouro Direto). A diferença entre os juros pagos no crédito e os recebidos em investimentos costuma ser enorme.

## Resumindo

O crédito usa juros compostos: M = C(1 + i)ⁿ. Rotativo do cartão e cheque especial são os mais caros. Compare o total pago e o CET. Desconto à vista indica que o "sem juros" embute juros. Orçamento e reserva evitam o endividamento.`,
    [
      "Crédito usa juros compostos: M = C(1 + i)ⁿ.",
      "Rotativo do cartão e cheque especial: juros altíssimos.",
      "CET inclui juros, tarifas, seguros e IOF.",
      "Desconto à vista indica juros embutidos no parcelado.",
    ],
    [
      ["Rotativo", "Crédito usado quando não se paga a fatura do cartão por inteiro."],
      ["CET", "Custo Efetivo Total: soma de juros, tarifas e impostos de um empréstimo."],
      ["Inadimplência", "Falta de pagamento de dívidas no prazo."],
    ],
    [
      ["Uma dívida de R$ 500 a 10% ao mês, por 2 meses, sem pagamento, vira:", ["R$ 600", "R$ 605", "R$ 550", "R$ 610", "R$ 1.000"], 1, "500 × 1,21."],
      ["Entre as opções de crédito, geralmente a mais cara é:", ["consignado", "rotativo do cartão de crédito", "financiamento imobiliário", "empréstimo com garantia", "crédito estudantil"], 1, "Juros altíssimos."],
      ["Um produto custa R$ 900 à vista ou 6 × R$ 165. O valor pago a mais no parcelado é:", ["R$ 65", "R$ 90", "R$ 99", "R$ 165", "R$ 45"], 1, "990 − 900."],
      ["Para comparar empréstimos de bancos diferentes, o melhor indicador é:", ["a cor do cartão", "o CET", "o número de agências", "o valor da parcela apenas", "o nome do banco"], 1, "Custo total."],
      ["Se a loja oferece desconto para pagamento à vista, o parcelado \"sem juros\":", ["é realmente sem custo", "embute juros", "é sempre mais barato", "é ilegal", "não tem relação"], 1, "Diferença é o juro."],
    ],
    [["Por que pagar apenas o valor mínimo da fatura do cartão de crédito pode ser perigoso?", "Porque o restante da fatura vai para o crédito rotativo, que cobra juros compostos altíssimos; a dívida cresce rapidamente, podendo dobrar ou triplicar em poucos meses e levar ao superendividamento."]],
  ),
  aula(
    "Velocidade média em trechos diferentes",
    `## A armadilha da média simples

"Um carro faz metade do caminho a 60 km/h e a outra metade a 40 km/h. Qual a velocidade média?"

Muitos respondem **50 km/h**, mas está **errado**!

## Definição correta

**Velocidade média = distância total ÷ tempo total**

## Resolvendo o exemplo

Suponha um percurso de 240 km (metade = 120 km):

- 1º trecho: 120 km a 60 km/h → **2 h**.
- 2º trecho: 120 km a 40 km/h → **3 h**.
- Total: 240 km em 5 h → v = 240 ÷ 5 = **48 km/h**.

O carro passa **mais tempo** no trecho lento, por isso a média fica **abaixo** de 50.

## Fórmula para distâncias iguais (média harmônica)

Se os dois trechos têm a **mesma distância**:

**v = 2 · v₁ · v₂ / (v₁ + v₂)**

v = 2 · 60 · 40 / 100 = 4.800/100 = **48 km/h** ✔

## Quando a média simples funciona

Se os trechos têm **o mesmo tempo** (não a mesma distância), aí sim a média é a simples:

- 1 hora a 60 km/h e 1 hora a 40 km/h → 100 km em 2 h → **50 km/h**.

## Com paradas

"Viagem de 300 km: dirigiu 3 h, parou 1 h para almoçar." → v média = 300 ÷ 4 = **75 km/h** (paradas contam no tempo total).

## Conversão de unidades

- km/h → m/s: **divida por 3,6**. 72 km/h = 20 m/s.
- m/s → km/h: multiplique por 3,6.

## Pace (ritmo) em corridas

Corredores usam o **pace**: minutos por quilômetro. Um pace de 5 min/km equivale a 12 km/h (60 ÷ 5).

## Aplicações

- Tempo de viagem com trânsito.
- Comparar meios de transporte.
- Aplicativos de mapas estimam o tempo pela velocidade média de cada trecho.

## Resumindo

Velocidade média = distância total ÷ tempo total. Com distâncias iguais e velocidades diferentes, a média é a harmônica (2v₁v₂/(v₁ + v₂)) e fica abaixo da média simples. Com tempos iguais, use a média simples. Paradas contam no tempo.`,
    [
      "v média = distância total ÷ tempo total.",
      "Distâncias iguais: média harmônica, menor que a simples.",
      "Tempos iguais: média aritmética simples.",
      "km/h ÷ 3,6 = m/s.",
    ],
    [
      ["Velocidade média", "Razão entre a distância total e o tempo total do percurso."],
      ["Média harmônica", "Média usada para velocidades em trechos de mesma distância."],
      ["Pace", "Ritmo de corrida, em minutos por quilômetro."],
    ],
    [
      ["Um ciclista vai a 20 km/h e volta pelo mesmo caminho a 30 km/h. A velocidade média é:", ["25 km/h", "24 km/h", "26 km/h", "50 km/h", "22 km/h"], 1, "2·20·30/50."],
      ["Um ônibus anda 2 h a 70 km/h e 2 h a 50 km/h. A velocidade média é:", ["60 km/h", "58 km/h", "65 km/h", "120 km/h", "55 km/h"], 0, "Tempos iguais."],
      ["Uma viagem de 360 km levou 4 h dirigindo e 30 min de parada. A velocidade média foi de:", ["90 km/h", "80 km/h", "72 km/h", "85 km/h", "100 km/h"], 1, "360 ÷ 4,5."],
      ["90 km/h correspondem a:", ["25 m/s", "324 m/s", "9 m/s", "15 m/s", "30 m/s"], 0, "90 ÷ 3,6."],
      ["Um corredor com pace de 6 min/km corre a:", ["6 km/h", "10 km/h", "12 km/h", "36 km/h", "8 km/h"], 1, "60 ÷ 6."],
    ],
    [["Explique por que, ao fazer metade do caminho a 60 km/h e metade a 40 km/h, a velocidade média não é 50 km/h.", "Porque a velocidade média é a distância total dividida pelo tempo total; como o carro passa mais tempo no trecho lento, esse trecho pesa mais, e a média resulta em 48 km/h, abaixo da média simples."]],
  ),
  aula(
    "Funções exponenciais decrescentes: depreciação e meia-vida",
    `## Diminuir em porcentagem fixa

Quando uma grandeza **diminui sempre a mesma porcentagem** a cada período, ela segue uma **função exponencial decrescente**:

**f(t) = f₀ · (1 − i)ᵗ** ou **f(t) = f₀ · bᵗ**, com 0 < b < 1.

## Depreciação

Um carro de R$ 50.000 perde **10%** do valor a cada ano:

- Após 1 ano: 50.000 × 0,9 = R$ 45.000.
- Após 2 anos: 50.000 × 0,9² = R$ 40.500.
- Após 3 anos: 50.000 × 0,9³ = **R$ 36.450**.

Atenção: perder 10% por 3 anos **não** é perder 30% (seria R$ 35.000). A perda é calculada sobre um valor **cada vez menor**.

## Meia-vida

Na **meia-vida**, a quantidade cai **pela metade** a cada período:

**Q(t) = Q₀ · (1/2)^(t / T)** (T = meia-vida)

- Radioatividade (C-14, iodo-131).
- **Medicamentos:** se um remédio tem meia-vida de 6 horas, de 400 mg restam 200 mg após 6 h, 100 mg após 12 h, **50 mg após 18 h**.
- **Cafeína:** meia-vida de cerca de 5 horas (por isso café à noite atrapalha o sono).

## Outros exemplos

- **Resfriamento** de um café (a diferença de temperatura em relação ao ambiente diminui exponencialmente).
- **Luz** atravessando a água (perde intensidade com a profundidade).
- **Bateria** que perde carga, população em declínio, **inflação** reduzindo o poder de compra.

## Gráfico

- Começa no valor inicial e **decresce**, cada vez mais devagar, aproximando-se de **zero** sem nunca chegar (assíntota no eixo x).
- Diferente de uma **reta** (que cairia sempre o mesmo valor absoluto).

## Linear x exponencial

- **Linear:** perde sempre o **mesmo valor** (ex.: R$ 5.000 por ano).
- **Exponencial:** perde sempre a **mesma porcentagem** (ex.: 10% ao ano).

## Usando logaritmo

Para descobrir **quanto tempo** leva para chegar a certo valor, usa-se **logaritmo**. Ex.: em quantos anos um valor cai pela metade perdendo 10% ao ano? 0,9ᵗ = 0,5 → t ≈ **6,6 anos**.

## Resumindo

Diminuir a mesma porcentagem a cada período gera função exponencial decrescente: f = f₀(1 − i)ᵗ. Perder 10% por 3 anos não é perder 30%. Na meia-vida, a quantidade cai pela metade a cada período. O gráfico se aproxima de zero sem tocá-lo.`,
    [
      "Perda percentual fixa: f = f₀ · (1 − i)ᵗ.",
      "Perder 10% por 3 anos ≠ perder 30%.",
      "Meia-vida: a quantidade cai à metade a cada período.",
      "Linear perde o mesmo valor; exponencial, a mesma porcentagem.",
    ],
    [
      ["Depreciação", "Perda de valor de um bem ao longo do tempo."],
      ["Função exponencial decrescente", "Função em que a grandeza diminui sempre a mesma porcentagem."],
      ["Assíntota", "Linha da qual o gráfico se aproxima sem nunca tocá-la."],
    ],
    [
      ["Um bem de R$ 10.000 desvaloriza 20% ao ano. Após 2 anos vale:", ["R$ 6.000", "R$ 6.400", "R$ 8.000", "R$ 7.200", "R$ 6.800"], 1, "10.000 × 0,8²."],
      ["Um remédio tem meia-vida de 4 h. De 80 mg, após 12 h restam:", ["40 mg", "20 mg", "10 mg", "5 mg", "0 mg"], 2, "80 → 40 → 20 → 10."],
      ["Perder 50% e depois mais 50% do que sobrou equivale a perder:", ["100%", "75%", "50%", "25%", "60%"], 1, "Sobra 25%."],
      ["Um gráfico de função exponencial decrescente:", ["é uma reta que cruza o eixo x", "decresce cada vez mais devagar e se aproxima de zero", "cresce sem parar", "é uma parábola", "é horizontal"], 1, "Assíntota."],
      ["Perder R$ 1.000 por ano é um modelo:", ["exponencial", "linear", "logarítmico", "quadrático", "periódico"], 1, "Mesmo valor absoluto."],
    ],
    [["Explique por que um carro que perde 10% do valor por ano não perde 30% em 3 anos.", "Porque a perda de cada ano é calculada sobre o valor já reduzido, e não sobre o valor original; assim, o carro vale 0,9³ ≈ 72,9% do preço inicial após 3 anos, uma perda de cerca de 27,1%."]],
  ),
  aula(
    "Círculo: setores, arcos e polígonos inscritos",
    `## Circunferência e círculo (revisão)

- **Circunferência:** a linha (contorno). Comprimento: **C = 2πr**.
- **Círculo:** a região (área). Área: **A = πr²**.
- Use π ≈ 3,14 (ou 3, quando o enunciado permitir).

## Setor circular ("fatia de pizza")

É a parte do círculo entre **dois raios**. Sua área é proporcional ao **ângulo central**:

**A_setor = (θ / 360°) · πr²**

**Exemplo:** pizza de raio 20 cm cortada em 8 fatias iguais (θ = 45°):

- Área da pizza: 3 · 400 = 1.200 cm² (π ≈ 3).
- Cada fatia: 1.200 ÷ 8 = **150 cm²**.

## Comprimento de arco

**L = (θ / 360°) · 2πr**

**Exemplo:** o ponteiro dos minutos de um relógio tem 10 cm. Em 15 minutos (90°), a ponta percorre: (90/360) · 2 · 3 · 10 = **15 cm**.

## Coroa circular

Região entre dois círculos de mesmo centro (anel, pista de atletismo): **A = π(R² − r²)**.

## Gráfico de setores (pizza)

Cada fatia representa uma **porcentagem** do total; o ângulo é **porcentagem × 360°**.

- 25% → 90°; 50% → 180°; 10% → 36°; 1% → 3,6°.

## Polígonos inscritos

- **Quadrado inscrito** num círculo de raio r: a **diagonal** do quadrado é o **diâmetro** (2r).
- **Hexágono regular inscrito:** o **lado** é igual ao **raio**; o hexágono é formado por **6 triângulos equiláteros**.
  - Área do hexágono de lado L: 6 × (L²√3/4) = **(3L²√3)/2**.
- **Triângulo equilátero inscrito** e circunscrito: relações com o raio.

## Comparando pizzas

"É melhor comprar uma pizza grande de 40 cm de diâmetro ou duas médias de 30 cm?"

- Grande: π · 20² = 400π.
- Duas médias: 2 · π · 15² = 450π.
- As **duas médias** têm mais área (se o preço for parecido).
- Dobrar o raio **quadruplica** a área!

## Resumindo

Comprimento C = 2πr; área A = πr². Setor e arco são proporcionais ao ângulo (θ/360°). Num gráfico de pizza, ângulo = % × 360°. No hexágono inscrito, lado = raio. Dobrar o raio quadruplica a área.`,
    [
      "C = 2πr; A = πr².",
      "Setor: (θ/360°) · πr²; arco: (θ/360°) · 2πr.",
      "Gráfico de pizza: ângulo = porcentagem × 360°.",
      "Hexágono inscrito: lado = raio; dobrar o raio quadruplica a área.",
    ],
    [
      ["Setor circular", "Parte do círculo limitada por dois raios."],
      ["Arco", "Parte da circunferência entre dois pontos."],
      ["Polígono inscrito", "Polígono com todos os vértices sobre a circunferência."],
    ],
    [
      ["A área de um círculo de raio 5 cm (π ≈ 3) é:", ["30 cm²", "75 cm²", "15 cm²", "25 cm²", "150 cm²"], 1, "3 · 25."],
      ["Um setor de 90° num círculo de raio 4 cm (π ≈ 3) tem área:", ["48 cm²", "12 cm²", "24 cm²", "6 cm²", "16 cm²"], 1, "(1/4) · 48."],
      ["Num gráfico de setores, uma categoria de 20% ocupa um ângulo de:", ["20°", "36°", "72°", "90°", "180°"], 2, "0,2 × 360."],
      ["Num hexágono regular inscrito em um círculo de raio 6 cm, o lado mede:", ["3 cm", "6 cm", "12 cm", "6√3 cm", "2 cm"], 1, "Lado = raio."],
      ["Uma pizza de 40 cm de diâmetro tem quantas vezes a área de uma de 20 cm?", ["2", "4", "8", "1,5", "3"], 1, "Raio dobra, área × 4."],
    ],
    [["Explique como calcular o ângulo de cada fatia num gráfico de setores.", "Multiplica-se a porcentagem de cada categoria por 360°, pois o círculo inteiro corresponde a 100%; por exemplo, uma categoria com 25% ocupa 0,25 × 360° = 90°."]],
  ),
  aula(
    "Interpretação de problemas: como não errar questões fáceis",
    `## O ENEM testa leitura também na Matemática

Muitas questões de Matemática são **longas** e cheias de informação. Errar costuma ser por **leitura apressada**, e não por falta de conteúdo.

## Passo a passo

1. **Leia a pergunta primeiro** (a última frase): o que exatamente se pede? Valor total? Porcentagem? Diferença? Quantidade mínima?
2. **Sublinhe os dados** úteis e as **unidades**.
3. **Desconfie de informações extras**: nem todo número do enunciado é usado.
4. **Faça um esquema**: tabela, desenho, linha do tempo.
5. **Resolva** e **confira** se a resposta faz sentido (estimativa).
6. **Compare** com as alternativas: se nenhuma bate, releia o enunciado.

## Armadilhas frequentes

- **"Aumentou para"** x **"aumentou em"**: passar de 50 **para** 60 é aumentar **em** 10 (20%).
- **"Pelo menos"** e **"no máximo"**: indicam limites (arredondar para cima ou para baixo).
- **"Do restante"** x "do total".
- **Unidades diferentes:** cm e m, min e h, mL e L, m² e cm².
- **Porcentagem de porcentagem:** 50% de 20% = 10%.
- **Perguntar o que sobra**, quando você calculou o que foi gasto.
- **"Exceto"**, **"não"**, **"incorreto"**: leia com atenção.
- **Escalas** em gráficos que não começam do zero.
- **Arredondamentos** no meio da conta (deixe para o fim).

## Exemplo comentado

"Uma loja aumentou o preço de um produto em 20% e, depois, deu desconto de 20% sobre o novo preço. O preço final, em relação ao inicial, é:"

- Não é "igual"! 1,2 × 0,8 = 0,96 → **4% menor**.

## Exemplo comentado 2

"Uma escola tem 1.200 alunos; 40% são do ensino médio, e destes, 25% estudam à noite. Quantos alunos do ensino médio estudam de dia?"

- Ensino médio: 480. À noite: 120. **De dia: 360** (a pergunta é "de dia"!).

## Gerenciar o tempo

- Faça primeiro as questões que você sabe.
- Não fique preso em uma questão por mais de alguns minutos.
- Marque as que pulou para voltar depois.
- **Nunca deixe em branco**: no ENEM não há desconto por erro (mas a TRI valoriza a coerência das respostas).

## Resumindo

Leia primeiro a pergunta, destaque dados e unidades, faça esquemas e confira se o resultado faz sentido. Cuidado com "aumentou para/em", "do restante", "pelo menos", unidades e o que exatamente se pede.`,
    [
      "Leia primeiro a pergunta: o que exatamente se pede?",
      "Destaque dados e unidades; ignore informações extras.",
      "Aumentar 20% e descontar 20% resulta em 4% a menos.",
      "Confira se a resposta faz sentido antes de marcar.",
    ],
    [
      ["Estimativa", "Cálculo aproximado para conferir se a resposta faz sentido."],
      ["Informação distratora", "Dado do enunciado que não é necessário para a resolução."],
      ["TRI", "Teoria de Resposta ao Item, método de correção do ENEM."],
    ],
    [
      ["Um preço aumentou 10% e depois teve desconto de 10%. Em relação ao inicial, ficou:", ["igual", "1% menor", "1% maior", "10% menor", "20% menor"], 1, "1,1 × 0,9 = 0,99."],
      ["Um valor passou de 80 para 100. Ele aumentou:", ["20%", "25%", "80%", "100%", "15%"], 1, "20 ÷ 80."],
      ["Numa turma de 40 alunos, 75% passaram. Quantos NÃO passaram?", ["30", "10", "25", "15", "75"], 1, "Atenção ao \"não\"."],
      ["Para transportar 250 pessoas em vans de 12 lugares, são necessárias pelo menos:", ["20 vans", "21 vans", "22 vans", "25 vans", "12 vans"], 1, "20,8 → 21."],
      ["Uma estratégia importante na prova é:", ["fazer as questões na ordem obrigatoriamente", "ler primeiro o que a questão pede", "deixar questões em branco", "calcular sem olhar as unidades", "arredondar tudo no início"], 1, "Foco no objetivo."],
    ],
    [["Explique por que aumentar um preço em 20% e depois dar 20% de desconto não volta ao preço original.", "Porque o desconto de 20% é calculado sobre o preço já aumentado, que é maior; multiplicando 1,2 por 0,8 obtém-se 0,96, ou seja, o preço final fica 4% menor que o original."]],
  ),
];
