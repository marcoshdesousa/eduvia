import { aula } from "./build";

/** Física, lote 1: movimento, eletricidade, óptica, ondas e calor. */
export const FISICA_1 = [
  aula(
    "Movimento uniforme e variado: leitura de gráficos",
    `## Descrever o movimento

A **cinemática** descreve o movimento sem se preocupar com as causas.

## Movimento uniforme (MU)

A **velocidade é constante**: o objeto percorre distâncias iguais em tempos iguais.

s = s₀ + v·t

- Gráfico posição × tempo: uma **reta inclinada**.
- Gráfico velocidade × tempo: uma **reta horizontal**.

Ex.: um carro a 60 km/h constantes percorre 120 km em 2 h.

## Movimento uniformemente variado (MUV)

A **aceleração é constante**: a velocidade muda sempre do mesmo tanto a cada segundo.

- v = v₀ + a·t
- s = s₀ + v₀·t + a·t²/2
- Torricelli (sem o tempo): v² = v₀² + 2·a·Δs

Gráfico velocidade × tempo: **reta inclinada**. Posição × tempo: **parábola**.

## Áreas e inclinações

- No gráfico **v × t**, a **área** sob a linha é o **deslocamento**.
- A **inclinação** do gráfico v × t é a **aceleração**.
- A inclinação do gráfico s × t é a **velocidade**.

## Aplicação: distância de frenagem

Um carro a 20 m/s que freia com 5 m/s² para em: v² = v₀² + 2aΔs → 0 = 400 − 10Δs → Δs = **40 m**. Se a velocidade dobra, a distância de frenagem **quadruplica**. Por isso o excesso de velocidade é tão perigoso.

## Tempo de reação

Antes de frear, o motorista leva um tempo para reagir (cerca de 1 s), andando em velocidade constante. Distância total = reação + frenagem. Álcool e celular aumentam o tempo de reação.

## Resumindo

MU: velocidade constante, s = s₀ + vt. MUV: aceleração constante. No gráfico v × t, área é deslocamento e inclinação é aceleração.`,
    [
      "MU: velocidade constante; MUV: aceleração constante.",
      "No gráfico v × t, a área é o deslocamento e a inclinação é a aceleração.",
      "Torricelli: v² = v₀² + 2aΔs.",
      "Dobrar a velocidade quadruplica a distância de frenagem.",
    ],
    [
      ["Aceleração", "Variação da velocidade por unidade de tempo."],
      ["Deslocamento", "Variação de posição de um corpo."],
      ["Tempo de reação", "Intervalo entre perceber um perigo e começar a agir."],
    ],
    [
      ["Um ciclista a 5 m/s constantes percorre, em 1 minuto:", ["5 m", "60 m", "120 m", "300 m", "500 m"], 3, "s = v·t = 5 × 60 = 300 m."],
      ["Um carro parte do repouso com aceleração de 2 m/s². Após 5 s, sua velocidade é:", ["2 m/s", "5 m/s", "7 m/s", "10 m/s", "25 m/s"], 3, "v = 0 + 2 × 5 = 10 m/s."],
      ["Num gráfico velocidade × tempo, a área sob a curva representa:", ["a aceleração", "o deslocamento", "a força", "a massa", "a energia"], 1, "Área do gráfico v × t = deslocamento."],
      ["Se a velocidade de um carro dobra, a distância de frenagem (com a mesma desaceleração):", ["dobra", "fica igual", "quadruplica", "cai pela metade", "triplica"], 2, "Pela equação de Torricelli, Δs depende de v²."],
      ["Um gráfico posição × tempo em forma de reta inclinada indica:", ["repouso", "movimento uniforme", "aceleração constante", "queda livre", "movimento circular"], 1, "Posição variando linearmente = velocidade constante."],
    ],
    [["Explique por que dirigir em alta velocidade aumenta muito o risco de acidentes graves.", "Porque a distância de frenagem cresce com o quadrado da velocidade: dobrando a velocidade, o carro precisa de quatro vezes mais distância para parar, além de percorrer mais espaço durante o tempo de reação."]],
  ),
  aula(
    "Queda livre e lançamentos",
    `## Galileu e a queda dos corpos

Sem a resistência do ar, **todos os corpos caem com a mesma aceleração**, independentemente da massa. Essa é a **aceleração da gravidade**: g ≈ **10 m/s²** na Terra.

Uma pena e um martelo soltos na Lua (sem ar) chegam juntos ao chão, como mostrou um astronauta da Apollo 15.

## Equações da queda livre

Partindo do repouso:

- v = g·t
- h = g·t²/2
- v² = 2·g·h

Uma pedra solta do alto de um prédio cai 5 m no 1º segundo, chega a 20 m em 2 s e a 45 m em 3 s.

## Resistência do ar

No dia a dia, o ar freia os objetos. Um paraquedista acelera até a força do ar igualar seu peso; a partir daí cai com **velocidade constante** (velocidade terminal). O paraquedas aumenta a área e reduz muito essa velocidade.

## Lançamento vertical

Uma bola lançada para cima **desacelera** até parar no ponto mais alto (v = 0) e depois cai. O tempo de subida é igual ao de descida (sem ar).

## Lançamento oblíquo

Uma bola chutada faz uma **parábola**. O movimento se divide em:

- **Horizontal:** velocidade constante.
- **Vertical:** como um lançamento para cima.

O alcance máximo (sem ar) acontece com ângulo de **45°**.

## Resumindo

Sem ar, tudo cai com g ≈ 10 m/s², independentemente da massa. h = gt²/2. No ponto mais alto, a velocidade vertical é zero. Lançamentos oblíquos formam parábolas.`,
    [
      "Sem resistência do ar, todos os corpos caem com a mesma aceleração (g ≈ 10 m/s²).",
      "Queda a partir do repouso: v = gt e h = gt²/2.",
      "No ponto mais alto de um lançamento vertical, a velocidade é zero.",
      "Lançamento oblíquo: horizontal com velocidade constante e vertical acelerado.",
    ],
    [
      ["Aceleração da gravidade", "Aceleração com que os corpos caem perto da Terra, cerca de 10 m/s²."],
      ["Velocidade terminal", "Velocidade constante atingida quando a resistência do ar iguala o peso."],
      ["Alcance", "Distância horizontal percorrida por um objeto lançado."],
    ],
    [
      ["Uma pedra é solta do repouso. Após 2 s (g = 10 m/s²), sua velocidade é:", ["2 m/s", "10 m/s", "20 m/s", "40 m/s", "5 m/s"], 2, "v = g·t = 10 × 2 = 20 m/s."],
      ["Um objeto cai durante 3 s a partir do repouso. Ele percorre:", ["15 m", "30 m", "45 m", "90 m", "9 m"], 2, "h = 10 × 9 ÷ 2 = 45 m."],
      ["No vácuo, uma bola de ferro e uma pena soltas juntas:", ["a bola chega antes", "a pena chega antes", "chegam juntas", "a pena não cai", "a bola flutua"], 2, "Sem ar, a aceleração é a mesma para todos."],
      ["No ponto mais alto de uma bola lançada verticalmente para cima, sua velocidade é:", ["máxima", "zero", "igual a g", "negativa e máxima", "igual à inicial"], 1, "Ela para por um instante antes de descer."],
      ["O paraquedas funciona porque:", ["diminui o peso da pessoa", "aumenta a resistência do ar e reduz a velocidade terminal", "elimina a gravidade", "aumenta a massa", "cria sustentação como uma asa de avião a jato"], 1, "Mais área gera mais resistência do ar."],
    ],
    [["Explique por que, no dia a dia, uma folha de papel cai mais devagar que uma pedra, se a gravidade é a mesma.", "Porque a resistência do ar atua com mais efeito sobre a folha, que é leve e tem grande área; no vácuo, sem ar, as duas cairiam juntas."]],
  ),
  aula(
    "Atrito, plano inclinado e segurança",
    `## A força que se opõe ao deslizamento

O **atrito** surge entre superfícies em contato e se opõe ao movimento (ou à tendência de movimento). Depende do tipo de superfície (coeficiente de atrito) e da força com que elas se pressionam (força normal).

Fat = μ · N

## Atrito estático e dinâmico

- **Estático:** atua enquanto o objeto ainda não desliza. É maior.
- **Dinâmico (cinético):** atua quando já está deslizando. É menor.

Por isso é mais difícil **começar** a empurrar um armário do que mantê-lo andando.

## Atrito útil e atrito indesejado

- **Útil:** andar (o pé empurra o chão para trás), frear, segurar objetos. Sem atrito, ninguém andaria.
- **Indesejado:** desgasta peças e gera calor em motores; por isso se usa **óleo lubrificante**.

## Pneus e freios

- **Pneus carecas** têm menos atrito e o carro derrapa mais, especialmente na chuva (aquaplanagem).
- **Freios ABS** evitam que a roda trave: a roda girando mantém o **atrito estático** (maior) com o chão, o que encurta a frenagem e permite desviar.

## Plano inclinado

Num plano inclinado, o peso se divide em duas partes: uma empurra o objeto **contra** a rampa e outra o puxa **para baixo** ao longo dela. Quanto mais inclinada a rampa, maior a parte que puxa para baixo. Rampas suaves exigem menos força (mas um caminho mais longo): é o princípio das **rampas de acessibilidade** e das **estradas em zigue-zague** nas serras.

## Resumindo

Atrito se opõe ao deslizamento: estático é maior que dinâmico. Ele é útil para andar e frear. Pneus gastos reduzem o atrito; ABS mantém o atrito estático. Rampas suaves exigem menos força.`,
    [
      "Atrito se opõe ao deslizamento: Fat = μ · N.",
      "Atrito estático (antes de deslizar) é maior que o dinâmico.",
      "Sem atrito não se anda nem se freia; lubrificantes reduzem atrito indesejado.",
      "Freio ABS evita o travamento e mantém o atrito estático.",
    ],
    [
      ["Força normal", "Força de apoio que uma superfície faz sobre o objeto, perpendicular a ela."],
      ["Coeficiente de atrito", "Número que indica o quanto duas superfícies 'grudam' entre si."],
      ["Aquaplanagem", "Perda de contato do pneu com o chão por causa de uma camada de água."],
    ],
    [
      ["É mais difícil começar a empurrar um móvel do que mantê-lo andando porque:", ["o atrito estático é maior que o dinâmico", "o peso diminui", "a gravidade aumenta", "o atrito dinâmico é maior", "não há atrito parado"], 0, "O atrito estático máximo supera o dinâmico."],
      ["Sem atrito entre o pé e o chão, uma pessoa:", ["andaria mais rápido", "não conseguiria andar", "flutuaria", "ficaria mais pesada", "correria sem esforço"], 1, "É o atrito que permite empurrar o chão para trás."],
      ["O freio ABS diminui a distância de frenagem porque:", ["trava as rodas", "evita que as rodas travem, mantendo o atrito estático", "aumenta o peso do carro", "reduz o atrito", "desliga o motor"], 1, "Roda girando sem derrapar usa o atrito estático, maior."],
      ["Pneus carecas são perigosos principalmente porque:", ["aumentam o atrito", "reduzem o atrito, aumentando derrapagens", "aumentam o peso", "consomem menos combustível", "fazem barulho"], 1, "Com menos aderência, o carro derrapa e freia mal."],
      ["Uma rampa mais suave (menos inclinada) para subir um peso exige:", ["mais força e caminho mais curto", "menos força e caminho mais longo", "a mesma força", "nenhuma força", "mais força e caminho mais longo"], 1, "A rampa troca força por distância."],
    ],
    [["Explique por que o atrito é importante para a segurança no trânsito.", "Porque é o atrito entre o pneu e o chão que permite frear e fazer curvas; com pneus gastos ou pista molhada o atrito diminui, o carro derrapa e precisa de mais distância para parar."]],
  ),
  aula(
    "Potência elétrica e consumo de energia",
    `## Quanto um aparelho gasta

A **potência** (P) indica quanta energia um aparelho usa por segundo, em **watts (W)**. Um chuveiro de 5.500 W gasta muito mais que uma lâmpada LED de 9 W.

P = U · i (tensão × corrente)

## Energia consumida

A conta de luz cobra a **energia**, que depende da potência e do **tempo** de uso:

E = P · t

Na conta, a unidade é o **quilowatt-hora (kWh)**: um aparelho de 1.000 W ligado por 1 hora.

Ex.: um chuveiro de 5.000 W (5 kW) usado 30 minutos por dia: 5 × 0,5 = 2,5 kWh por dia → 75 kWh por mês. Se o kWh custa R$ 0,80, são **R$ 60** por mês só de banho.

## Economizando

- Trocar lâmpadas incandescentes por **LED** (gastam cerca de 80% menos para a mesma luz).
- Reduzir o tempo de banho e usar o chuveiro na posição "verão".
- Não deixar aparelhos em **stand-by** por muito tempo.
- Preferir eletrodomésticos com **selo Procel A**.
- Aquecimento solar de água.

## Tensão e corrente

- **Tensão (U)**, em volts: 127 V ou 220 V nas tomadas.
- **Corrente (i)**, em ampères.

Um aparelho de 2.200 W em 220 V puxa i = P ÷ U = **10 A**. Fios e disjuntores precisam suportar essa corrente; correntes acima do previsto aquecem os fios e podem causar incêndios.

## Ligar aparelho na tensão errada

Ligar um aparelho de 127 V em 220 V pode queimá-lo; o contrário faz ele funcionar com potência menor.

## Resumindo

P em watts; energia = potência × tempo, cobrada em kWh. Chuveiro elétrico costuma ser o maior gasto da casa. LED e menos tempo de uso economizam.`,
    [
      "Potência (W) indica a energia gasta por segundo; P = U · i.",
      "Energia = potência × tempo, cobrada em kWh.",
      "O chuveiro elétrico costuma ser o maior consumo da casa.",
      "Lâmpadas LED e selo Procel A ajudam a economizar.",
    ],
    [
      ["Potência elétrica", "Energia consumida por unidade de tempo, medida em watts."],
      ["Quilowatt-hora", "Energia de um aparelho de 1.000 W ligado por 1 hora; unidade da conta de luz."],
      ["Disjuntor", "Dispositivo que desliga o circuito quando a corrente fica alta demais."],
    ],
    [
      ["Um aparelho de 2.000 W ligado por 3 horas consome:", ["0,6 kWh", "2 kWh", "5 kWh", "6 kWh", "6.000 kWh"], 3, "2 kW × 3 h = 6 kWh."],
      ["Um ferro de 1.100 W ligado em 110 V é percorrido por uma corrente de:", ["1 A", "10 A", "11 A", "100 A", "1.210 A"], 1, "i = P ÷ U = 1.100 ÷ 110 = 10 A."],
      ["Qual troca mais reduz o consumo de iluminação?", ["Incandescente por LED", "LED por incandescente", "Desligar o disjuntor geral", "Pintar a parede de preto", "Usar lâmpada de maior potência"], 0, "O LED gasta muito menos energia para a mesma luz."],
      ["A conta de luz cobra:", ["a potência dos aparelhos", "a energia consumida em kWh", "a tensão da casa", "o número de tomadas", "a corrente máxima"], 1, "Cobra-se a energia: potência × tempo."],
      ["Um chuveiro de 4 kW usado 15 minutos por dia, durante 30 dias, consome:", ["15 kWh", "30 kWh", "60 kWh", "120 kWh", "4 kWh"], 1, "4 kW × 0,25 h × 30 = 30 kWh."],
    ],
    [["Explique como calcular quanto um chuveiro elétrico pesa na conta de luz de um mês.", "Multiplica-se a potência do chuveiro em quilowatts pelo tempo de uso em horas por dia, depois pelos dias do mês, obtendo os kWh; multiplicando pelo preço do kWh, chega-se ao valor em reais."]],
  ),
  aula(
    "Circuitos elétricos: série, paralelo e resistência",
    `## Resistência elétrica

A **resistência** (R), em ohms (Ω), é a dificuldade que um material oferece à passagem da corrente. A **Lei de Ohm** relaciona:

U = R · i

Fios **mais longos e mais finos** têm mais resistência. Bons condutores (cobre) têm pouca resistência.

## Efeito Joule

Quando a corrente passa por uma resistência, gera **calor**. É o princípio do **chuveiro**, do ferro de passar e da torradeira. Também explica por que fios finos demais esquentam.

No chuveiro, a posição "inverno" usa uma **resistência menor**, que deixa passar mais corrente e esquenta mais (em tensão fixa, P = U²/R).

## Associação em série

Os componentes ficam **um atrás do outro**: a mesma corrente passa por todos.

- A resistência total é a **soma**: R = R₁ + R₂ + ...
- Se um componente queima, **todos apagam** (o circuito abre).
- Ex.: pisca-piscas antigos de Natal.

## Associação em paralelo

Cada componente tem seu **próprio caminho**: todos recebem a **mesma tensão**.

- A resistência total é **menor** que a menor resistência.
- Se um aparelho queima, **os outros continuam funcionando**.
- É assim a instalação elétrica das casas: cada tomada e lâmpada recebe 127 V ou 220 V.

## Curto-circuito

Quando a corrente encontra um caminho de resistência quase zero, ela dispara e pode causar incêndio. Disjuntores e fusíveis desligam o circuito para proteger.

## Resumindo

U = R · i. Corrente em resistência gera calor (efeito Joule). Em série, um queima e todos apagam; em paralelo, cada aparelho funciona independente, como nas casas.`,
    [
      "Lei de Ohm: U = R · i.",
      "Efeito Joule: corrente em resistência gera calor (chuveiro, ferro).",
      "Em série: mesma corrente; se um queima, todos apagam.",
      "Em paralelo: mesma tensão; cada aparelho funciona sozinho, como nas casas.",
    ],
    [
      ["Resistência elétrica", "Dificuldade de um material à passagem de corrente, em ohms."],
      ["Efeito Joule", "Aquecimento causado pela passagem de corrente em um condutor."],
      ["Curto-circuito", "Ligação de resistência quase nula que faz a corrente disparar."],
    ],
    [
      ["Uma resistência de 20 Ω submetida a 220 V é percorrida por uma corrente de:", ["0,09 A", "11 A", "20 A", "220 A", "4.400 A"], 1, "i = U ÷ R = 220 ÷ 20 = 11 A."],
      ["Nas casas, as tomadas e lâmpadas são ligadas em:", ["série", "paralelo", "curto-circuito", "corrente contínua de pilha", "um único fio"], 1, "Em paralelo, cada aparelho recebe a tensão total e funciona independente."],
      ["Num circuito em série com três lâmpadas, se uma queimar:", ["as outras brilham mais", "as outras apagam", "nada muda", "as outras explodem", "só a vizinha apaga"], 1, "O circuito abre e a corrente para em todas."],
      ["O aquecimento da água no chuveiro elétrico se deve ao:", ["efeito Joule", "efeito Doppler", "magnetismo", "empuxo", "atrito do ar"], 0, "A corrente na resistência gera calor."],
      ["Duas resistências de 10 Ω em série equivalem a:", ["5 Ω", "10 Ω", "20 Ω", "100 Ω", "0 Ω"], 2, "Em série, somam-se: 10 + 10 = 20 Ω."],
    ],
    [["Por que as instalações elétricas das casas usam ligação em paralelo?", "Porque em paralelo cada aparelho recebe a tensão total da rede e funciona de forma independente; se um queimar ou for desligado, os outros continuam funcionando."]],
  ),
  aula(
    "Magnetismo e indução: como se gera eletricidade",
    `## Ímãs

Todo ímã tem dois **polos**: norte e sul. Polos iguais se repelem; diferentes se atraem. Cortar um ímã ao meio gera dois ímãs, cada um com norte e sul.

A **Terra** é um grande ímã: a bússola aponta para o norte geográfico porque se alinha com o campo magnético terrestre.

## Corrente cria campo magnético

Oersted descobriu que um fio com corrente desvia a bússola: **corrente elétrica gera campo magnético**. Enrolando o fio em espiral (bobina) com um núcleo de ferro, temos um **eletroímã**, usado em guindastes de ferro-velho, campainhas e motores.

## Indução eletromagnética

O contrário também acontece: **variar o campo magnético** perto de uma bobina **gera corrente elétrica** (Faraday). É assim que funcionam quase todas as usinas:

- **Hidrelétricas:** a água gira turbinas, que giram ímãs dentro de bobinas.
- **Termelétricas e nucleares:** o vapor gira as turbinas.
- **Eólicas:** o vento gira as hélices.
- **Dínamo de bicicleta:** a roda gira um ímã.

Em todos os casos, alguma energia (da água, do vapor, do vento) vira **energia de movimento** e depois **energia elétrica**.

## Motor elétrico

Faz o caminho inverso do gerador: a corrente numa bobina dentro de um campo magnético gera **força** e faz o eixo girar. Ventiladores, liquidificadores e carros elétricos usam motores.

## Transformadores

Funcionam por indução e só com **corrente alternada**. Elevam a tensão para a transmissão em longas distâncias (menos perdas) e reduzem para o uso nas casas.

## Resumindo

Corrente gera campo magnético (eletroímã, motor). Campo magnético variando gera corrente (geradores das usinas). Transformadores mudam a tensão na corrente alternada.`,
    [
      "Polos iguais se repelem; diferentes se atraem.",
      "Corrente elétrica gera campo magnético (eletroímã).",
      "Campo magnético variável gera corrente (indução): princípio das usinas.",
      "Motor transforma energia elétrica em movimento; gerador faz o contrário.",
    ],
    [
      ["Indução eletromagnética", "Geração de corrente elétrica pela variação do campo magnético."],
      ["Eletroímã", "Ímã produzido por corrente elétrica numa bobina."],
      ["Transformador", "Aparelho que altera a tensão da corrente alternada."],
    ],
    [
      ["O funcionamento dos geradores das usinas hidrelétricas se baseia na:", ["fissão nuclear", "indução eletromagnética", "fotossíntese", "efeito Joule", "dilatação térmica"], 1, "Ímãs girando perto de bobinas geram corrente."],
      ["Um motor elétrico transforma:", ["energia térmica em elétrica", "energia elétrica em energia de movimento", "luz em som", "movimento em energia elétrica", "energia química em luz"], 1, "É o oposto do gerador."],
      ["Ao cortar um ímã ao meio, obtém-se:", ["um polo norte e um polo sul separados", "dois ímãs, cada um com norte e sul", "dois pedaços sem magnetismo", "dois polos norte", "um ímã e um pedaço de ferro"], 1, "Não existem polos isolados."],
      ["A bússola aponta para o norte porque:", ["é atraída pelo Sol", "se alinha com o campo magnético da Terra", "é feita de ouro", "segue o vento", "é eletricamente carregada"], 1, "A Terra funciona como um grande ímã."],
      ["Transformadores elevam a tensão na transmissão de energia para:", ["aumentar as perdas", "reduzir as perdas nos fios", "gerar mais energia", "mudar a frequência", "funcionar com pilhas"], 1, "Tensão alta com corrente menor reduz o aquecimento dos fios."],
    ],
    [["Explique como uma usina eólica produz eletricidade.", "O vento gira as hélices, que fazem girar ímãs ou bobinas dentro do gerador; a variação do campo magnético nas bobinas induz corrente elétrica, transformando energia do vento em energia elétrica."]],
  ),
  aula(
    "Óptica: espelhos, lentes e visão",
    `## A luz anda em linha reta

Em meios homogêneos, a luz se propaga em **linha reta**. Isso explica as **sombras** e a **câmara escura** (que forma imagem invertida).

## Reflexão e espelhos

- **Espelho plano:** a imagem é do mesmo tamanho, à mesma distância atrás do espelho e **invertida lateralmente** (a palavra AMBULÂNCIA é escrita ao contrário nos carros para ser lida no retrovisor).
- **Espelho côncavo:** concentra a luz; usado em faróis, fogões solares e espelhos de maquiagem (aumentam a imagem de perto).
- **Espelho convexo:** amplia o **campo de visão**, com imagens menores; usado em retrovisores e em saídas de garagem.

## Refração

Quando a luz muda de meio (ar → água), muda de velocidade e pode **desviar**. Por isso:
- um lápis parece "quebrado" num copo d'água;
- a piscina parece mais rasa do que é;
- o arco-íris aparece (a luz branca se separa em cores ao atravessar gotas: **dispersão**).

## Lentes

- **Convergentes** (bordas finas): concentram a luz. Lupas e correção da **hipermetropia**.
- **Divergentes** (bordas grossas): espalham a luz. Correção da **miopia**.

## Defeitos da visão

- **Miopia:** dificuldade de ver **de longe**; a imagem se forma **antes** da retina. Corrige com lente **divergente**.
- **Hipermetropia:** dificuldade de ver **de perto**; imagem **depois** da retina. Lente **convergente**.
- **Presbiopia ("vista cansada"):** perda de foco para perto com a idade. Lente convergente.
- **Astigmatismo:** imagem distorcida; lentes cilíndricas.

## Resumindo

Espelho côncavo concentra; convexo amplia o campo de visão. Refração explica lápis quebrado e arco-íris. Miopia usa lente divergente; hipermetropia e presbiopia, convergente.`,
    [
      "Espelho convexo amplia o campo de visão (retrovisores); côncavo concentra a luz.",
      "Refração é o desvio da luz ao mudar de meio (lápis quebrado, piscina rasa).",
      "Miopia: imagem antes da retina, corrige com lente divergente.",
      "Hipermetropia e presbiopia: lente convergente.",
    ],
    [
      ["Refração", "Mudança de velocidade e de direção da luz ao passar de um meio para outro."],
      ["Lente convergente", "Lente de bordas finas que concentra os raios de luz."],
      ["Miopia", "Defeito em que se vê mal de longe porque a imagem se forma antes da retina."],
    ],
    [
      ["Os retrovisores externos de muitos carros usam espelhos convexos porque:", ["aumentam a imagem", "ampliam o campo de visão", "concentram a luz", "invertem a imagem de cabeça para baixo", "são mais baratos"], 1, "Mostram uma área maior, com imagens menores."],
      ["Uma pessoa míope deve usar lentes:", ["convergentes", "divergentes", "planas", "espelhadas", "coloridas"], 1, "A lente divergente afasta o foco para cima da retina."],
      ["O lápis que parece quebrado dentro de um copo d'água é efeito da:", ["reflexão", "refração", "difração", "polarização", "absorção"], 1, "A luz muda de direção ao passar da água para o ar."],
      ["A palavra AMBULÂNCIA escrita invertida na frente do veículo serve para:", ["enfeitar", "ser lida corretamente pelo retrovisor dos carros à frente", "confundir os pedestres", "refletir a luz do sol", "indicar a velocidade"], 1, "O espelho plano inverte esquerda e direita."],
      ["O arco-íris é formado pela:", ["reflexão total do ar", "dispersão da luz branca nas gotas de chuva", "sombra das nuvens", "polarização do céu", "emissão de luz pelas gotas"], 1, "A refração separa as cores da luz branca."],
    ],
    [["Explique o que acontece com a imagem no olho de um míope e como a lente corrige o problema.", "No olho míope a imagem de objetos distantes se forma antes da retina e fica borrada; a lente divergente espalha um pouco os raios de luz, fazendo a imagem se formar exatamente sobre a retina."]],
  ),
  aula(
    "Som: altura, intensidade, timbre e efeito Doppler",
    `## O som é uma onda mecânica

O som é uma **onda mecânica**: precisa de um meio (ar, água, sólidos) para se propagar. Por isso **não há som no vácuo** do espaço. No ar, viaja a cerca de **340 m/s**; na água e nos sólidos, é mais rápido.

## Qualidades do som

- **Altura:** depende da **frequência**. Som **agudo** = frequência alta; som **grave** = frequência baixa. ("Alto" e "baixo" na Física não é volume!)
- **Intensidade:** é o "volume", ligado à **amplitude** e à energia da onda. Mede-se em **decibéis (dB)**. Sons acima de 85 dB por muito tempo podem causar perda auditiva.
- **Timbre:** é o que diferencia a mesma nota tocada num violão e num piano. Depende do formato da onda.

## Faixa audível

O ser humano ouve de cerca de **20 Hz a 20.000 Hz**.
- Abaixo: **infrassom** (elefantes se comunicam assim).
- Acima: **ultrassom** (morcegos, golfinhos, exames de ultrassonografia).

## Eco

O som reflete em obstáculos. O **sonar** de navios e a ecolocalização de morcegos medem distâncias pelo tempo do eco: distância = velocidade × tempo ÷ 2.

## Efeito Doppler

Quando a fonte se **aproxima**, ouvimos o som mais **agudo**; quando se **afasta**, mais **grave**. É o que acontece com a sirene de uma ambulância que passa. O efeito também é usado em radares de velocidade e em exames de fluxo sanguíneo.

## Ressonância

Um objeto vibra muito quando recebe ondas na sua frequência natural. Uma taça pode quebrar com um som na frequência certa.

## Resumindo

Som precisa de meio. Altura = frequência (agudo/grave); intensidade = volume (dB); timbre diferencia instrumentos. Doppler: fonte se aproximando soa mais agudo.`,
    [
      "Som é onda mecânica: não se propaga no vácuo; no ar, cerca de 340 m/s.",
      "Altura depende da frequência (agudo/grave); intensidade é o volume (dB).",
      "Timbre diferencia instrumentos tocando a mesma nota.",
      "Efeito Doppler: fonte se aproximando soa mais agudo; se afastando, mais grave.",
    ],
    [
      ["Frequência", "Número de oscilações por segundo, em hertz (Hz)."],
      ["Ultrassom", "Som com frequência acima de 20.000 Hz, inaudível para humanos."],
      ["Efeito Doppler", "Mudança na frequência percebida quando a fonte e o observador se movem um em relação ao outro."],
    ],
    [
      ["Uma voz mais aguda tem:", ["menor frequência", "maior frequência", "maior amplitude apenas", "menor velocidade", "timbre igual ao grave"], 1, "Agudo = frequência alta."],
      ["Os astronautas não conseguem conversar no vácuo sem rádio porque:", ["o som é muito rápido", "o som precisa de um meio para se propagar", "o capacete é grosso", "a luz atrapalha", "o som vira luz"], 1, "Sem ar, o som não se propaga."],
      ["A sirene de uma ambulância que se aproxima parece mais aguda por causa do:", ["eco", "efeito Doppler", "timbre", "efeito Joule", "efeito estufa"], 1, "A aproximação aumenta a frequência percebida."],
      ["O que diferencia a mesma nota tocada num violão e num piano é o:", ["volume", "timbre", "altura", "período", "comprimento do som"], 1, "O timbre depende do formato da onda de cada instrumento."],
      ["Um sonar emite um som que volta após 2 s na água (1.500 m/s). A profundidade é:", ["750 m", "1.500 m", "3.000 m", "6.000 m", "500 m"], 1, "d = 1.500 × 2 ÷ 2 = 1.500 m."],
    ],
    [["Explique a diferença entre altura e intensidade de um som.", "A altura está ligada à frequência e diferencia sons agudos de graves; a intensidade está ligada à amplitude e à energia da onda, ou seja, ao volume, medido em decibéis."]],
  ),
  aula(
    "Calorimetria: calor específico e mudanças de estado",
    `## Calor e temperatura

- **Temperatura** mede o grau de agitação das partículas.
- **Calor** é a **energia térmica em trânsito**, que passa do corpo **mais quente** para o **mais frio** até o **equilíbrio térmico**.

## Calor sensível

Muda a temperatura:

Q = m · c · ΔT

O **calor específico (c)** indica quanto calor é preciso para esquentar 1 g da substância em 1 °C. A **água** tem calor específico **alto** (1 cal/g°C): demora para esquentar e para esfriar.

Consequências:
- Cidades litorâneas têm **menor amplitude térmica** que cidades do interior.
- A água é usada para **resfriar motores**.
- A areia da praia esquenta muito mais rápido que o mar.

## Calor latente

Muda o **estado físico**, sem mudar a temperatura:

Q = m · L

Enquanto o gelo derrete a 0 °C, a temperatura fica constante: toda a energia vai para a mudança de estado. O mesmo na água fervendo a 100 °C (ao nível do mar).

## Mudanças de estado

- Fusão (sólido → líquido) e solidificação.
- Vaporização (líquido → gás) e condensação.
- Sublimação (sólido → gás), como o gelo-seco.

## Suor e evaporação

O **suor** refresca porque, ao evaporar, retira calor da pele. Por isso, em dias úmidos (o suor evapora pouco), sentimos mais calor. A **moringa** de barro também esfria a água assim.

## Pressão e ponto de ebulição

Na **panela de pressão**, a pressão maior faz a água ferver acima de 100 °C, cozinhando mais rápido. Em lugares altos (pressão menor), a água ferve abaixo de 100 °C.

## Resumindo

Calor sensível muda a temperatura (Q = mcΔT); latente muda o estado (Q = mL). Água tem calor específico alto. Evaporação resfria. Pressão maior eleva o ponto de ebulição.`,
    [
      "Calor passa do corpo mais quente para o mais frio até o equilíbrio térmico.",
      "Q = m·c·ΔT; a água tem calor específico alto e varia pouco de temperatura.",
      "Na mudança de estado, a temperatura fica constante (calor latente).",
      "Evaporação resfria (suor); panela de pressão ferve acima de 100 °C.",
    ],
    [
      ["Calor específico", "Calor necessário para elevar em 1 °C a temperatura de 1 g de uma substância."],
      ["Calor latente", "Calor usado para mudar o estado físico sem mudar a temperatura."],
      ["Equilíbrio térmico", "Situação em que os corpos chegam à mesma temperatura."],
    ],
    [
      ["Para aquecer 200 g de água (c = 1 cal/g°C) de 20 °C a 70 °C, são necessárias:", ["1.000 cal", "4.000 cal", "10.000 cal", "14.000 cal", "200 cal"], 2, "Q = 200 × 1 × 50 = 10.000 cal."],
      ["Cidades à beira-mar têm menor variação de temperatura porque:", ["o sal esfria o ar", "a água tem alto calor específico", "venta menos", "chove menos", "o mar reflete toda a luz"], 1, "O mar esquenta e esfria devagar, moderando o clima."],
      ["Durante a fusão do gelo, a temperatura:", ["aumenta muito", "diminui", "permanece constante", "oscila", "vai a 100 °C"], 2, "A energia é usada na mudança de estado."],
      ["O suor ajuda a regular a temperatura do corpo porque:", ["aquece a pele", "ao evaporar, retira calor da pele", "impede a respiração", "aumenta a pressão", "é salgado"], 1, "A evaporação absorve calor."],
      ["A panela de pressão cozinha mais rápido porque:", ["usa menos água", "a água ferve acima de 100 °C", "a água ferve abaixo de 100 °C", "não há perda de calor", "o metal é diferente"], 1, "Maior pressão eleva o ponto de ebulição."],
    ],
    [["Explique por que a areia da praia esquenta muito mais rápido que a água do mar durante o dia.", "Porque a areia tem calor específico bem menor que a água; com a mesma energia do sol, sua temperatura sobe muito mais, enquanto a água precisa de muito calor para esquentar."]],
  ),
  aula(
    "Máquinas térmicas, rendimento e fontes de energia",
    `## Calor que vira movimento

**Máquinas térmicas** transformam calor em trabalho (movimento): motores de carro, locomotivas a vapor, turbinas de termelétricas.

## Como funcionam

Uma máquina térmica recebe calor de uma **fonte quente** (a queima do combustível), transforma **parte** em trabalho e **rejeita o resto** para uma **fonte fria** (o ambiente).

## Segunda lei da termodinâmica

**Nenhuma máquina térmica transforma todo o calor em trabalho.** Sempre há perda. O **rendimento** é:

rendimento = trabalho útil ÷ energia recebida

Um motor a combustão de carro aproveita cerca de **25% a 30%** da energia do combustível; o resto vira calor (por isso o motor esquenta e precisa de radiador).

## Ciclo de Carnot

É o ciclo ideal de maior rendimento possível entre duas temperaturas. Nenhuma máquina real o alcança.

## Fontes de energia

- **Não renováveis:** petróleo, carvão, gás natural, urânio. Acabam e, no caso dos fósseis, emitem CO₂.
- **Renováveis:** hidrelétrica, solar, eólica, biomassa, geotérmica.

## A matriz elétrica brasileira

O Brasil tem uma matriz elétrica **muito renovável**, com predominância de **hidrelétricas**, e crescimento da **eólica** (Nordeste) e da **solar**. Hidrelétricas não queimam combustível, mas causam impactos: alagam florestas, deslocam comunidades e alteram rios.

## Comparando

- **Termelétrica:** liga a qualquer hora, mas polui e tem rendimento limitado.
- **Solar e eólica:** limpas, mas dependem do sol e do vento (intermitentes).

## Resumindo

Máquinas térmicas sempre perdem parte da energia (2ª lei). Rendimento = útil ÷ total. O Brasil usa muitas fontes renováveis, principalmente hidrelétricas.`,
    [
      "Máquinas térmicas transformam calor em trabalho, sempre com perdas.",
      "Segunda lei: nenhuma máquina converte todo o calor em trabalho.",
      "Rendimento = energia útil ÷ energia recebida.",
      "A matriz elétrica brasileira é muito renovável (hidrelétricas, eólica, solar).",
    ],
    [
      ["Rendimento", "Fração da energia recebida que é aproveitada como trabalho útil."],
      ["Fonte renovável", "Fonte de energia que se renova naturalmente, como sol e vento."],
      ["Matriz elétrica", "Conjunto de fontes usadas para gerar eletricidade num país."],
    ],
    [
      ["Um motor recebe 1.000 J e realiza 300 J de trabalho. Seu rendimento é:", ["3%", "30%", "70%", "100%", "300%"], 1, "300 ÷ 1.000 = 0,3 = 30%."],
      ["Segundo a segunda lei da termodinâmica:", ["todo calor vira trabalho", "nenhuma máquina térmica tem 100% de rendimento", "a energia é criada nas máquinas", "o calor vai do frio para o quente sozinho", "motores não esquentam"], 1, "Sempre há calor rejeitado."],
      ["A principal fonte da eletricidade brasileira é:", ["carvão", "nuclear", "hidrelétrica", "petróleo", "geotérmica"], 2, "As hidrelétricas predominam na matriz elétrica."],
      ["Uma desvantagem das usinas solares e eólicas é:", ["emitem muito CO₂", "dependem de condições naturais variáveis", "usam urânio", "alagam grandes áreas", "não são renováveis"], 1, "São intermitentes: dependem de sol e vento."],
      ["Um impacto ambiental típico das grandes hidrelétricas é:", ["chuva ácida", "alagamento de florestas e deslocamento de populações", "lixo radioativo", "emissão de fumaça preta", "aumento do buraco na camada de ozônio"], 1, "O reservatório inunda grandes áreas."],
    ],
    [["Explique por que o motor de um carro esquenta e o que isso tem a ver com rendimento.", "Porque só uma parte da energia do combustível vira movimento; o restante é perdido como calor, o que mostra que o rendimento do motor é baixo, cerca de 30 por cento, como prevê a segunda lei da termodinâmica."]],
  ),
];
