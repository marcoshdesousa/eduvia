import { aula } from "./build";

/** Química, lote 2: modelos, transformações e química do cotidiano. */
export const QUIMICA_2 = [
  aula(
    "Modelos atômicos: de Dalton a Bohr",
    `## Como imaginamos o átomo

Ninguém "vê" o átomo diretamente. Os cientistas criaram **modelos** que explicam os experimentos e foram sendo **substituídos** quando surgiam novos dados. Isso mostra que a ciência é **construída e revisada**.

## Dalton (1808): a "bola de bilhar"

- O átomo é uma **esfera maciça, indivisível** e indestrutível.
- Átomos de um mesmo elemento são iguais; as reações são **rearranjos** de átomos.
- Explicava as leis das massas (Lavoisier, Proust).

## Thomson (1897): o "pudim de passas"

- Descobriu o **elétron** com experimentos em **tubos de raios catódicos**.
- O átomo seria uma esfera **positiva** com **elétrons** espalhados (como passas num pudim).
- Primeiro modelo **divisível**.

## Rutherford (1911): o modelo planetário

- **Experimento da folha de ouro:** bombardeou uma lâmina finíssima de ouro com partículas **alfa** (positivas).
  - A **maioria atravessou** → o átomo é quase todo **espaço vazio**.
  - **Poucas desviaram ou voltaram** → existe um **núcleo** pequeno, denso e **positivo**.
- Elétrons giram ao redor do núcleo numa **eletrosfera**.

## Bohr (1913): as camadas de energia

- Os elétrons giram em **órbitas (níveis) de energia definidas** (K, L, M, N...).
- Ao **absorver** energia, o elétron **salta** para um nível mais externo; ao **voltar**, **emite** a energia como **luz** de cor específica.
- Explica:
  - **Fogos de artifício** (cada metal dá uma cor: sódio, amarelo; estrôncio, vermelho; bário, verde; cobre, azul-esverdeado).
  - **Teste de chama**.
  - **Lâmpadas de neon** e de vapor de sódio.

## Modelo atual

O **modelo quântico** fala em **orbitais**: regiões de maior **probabilidade** de encontrar o elétron, e não órbitas fixas.

## Partículas do átomo

- **Prótons** (+) e **nêutrons** (0) no núcleo; **elétrons** (−) na eletrosfera.
- **Número atômico (Z):** número de prótons (define o elemento).
- **Número de massa (A):** prótons + nêutrons.
- **Isótopos:** mesmo Z, massa diferente (carbono-12 e carbono-14).

## Resumindo

Dalton: esfera maciça. Thomson: pudim de passas (descobre o elétron). Rutherford: núcleo pequeno e denso (folha de ouro). Bohr: níveis de energia (explica a cor dos fogos).`,
    [
      "Dalton: esfera maciça e indivisível.",
      "Thomson: descobriu o elétron (pudim de passas).",
      "Rutherford: núcleo pequeno e positivo; átomo quase vazio.",
      "Bohr: níveis de energia; saltos explicam as cores dos fogos.",
    ],
    [
      ["Modelo atômico", "Representação que explica a estrutura do átomo com base em experimentos."],
      ["Número atômico", "Número de prótons do núcleo, que define o elemento."],
      ["Isótopos", "Átomos do mesmo elemento com números de massa diferentes."],
    ],
    [
      ["O experimento da folha de ouro mostrou que o átomo:", ["é maciço", "tem um núcleo pequeno e denso e muito espaço vazio", "não tem cargas", "é um pudim de passas", "não tem elétrons"], 1, "Rutherford."],
      ["As cores dos fogos de artifício são explicadas pelo modelo de:", ["Dalton", "Thomson", "Bohr", "Rutherford apenas", "Demócrito"], 2, "Saltos de elétrons emitem luz."],
      ["O modelo do \"pudim de passas\" é de:", ["Dalton", "Thomson", "Bohr", "Rutherford", "Lavoisier"], 1, "Elétrons espalhados numa massa positiva."],
      ["Isótopos são átomos com:", ["mesmo número de massa e Z diferente", "mesmo número de prótons e número de nêutrons diferente", "mesmo número de nêutrons apenas", "cargas diferentes", "elementos diferentes"], 1, "Mesmo elemento, massas diferentes."],
      ["Um átomo com 11 prótons e 12 nêutrons tem número de massa:", ["11", "12", "23", "1", "34"], 2, "11 + 12."],
    ],
    [["Explique como o modelo de Bohr explica a emissão de luz colorida nos fogos de artifício.", "Ao receber energia do calor, os elétrons dos metais saltam para níveis mais externos; ao voltar para os níveis de origem, liberam essa energia na forma de luz, com cor característica de cada elemento."]],
  ),
  aula(
    "Propriedades da matéria: densidade e mudanças de estado",
    `## Estados físicos

- **Sólido:** forma e volume definidos; partículas muito próximas e organizadas.
- **Líquido:** volume definido, forma do recipiente.
- **Gasoso:** forma e volume variáveis; partículas afastadas e muito agitadas.

## Mudanças de estado

- **Fusão:** sólido → líquido. **Solidificação:** líquido → sólido.
- **Vaporização:** líquido → gás (pode ser **evaporação**, lenta, na superfície; **ebulição**, com bolhas; ou **calefação**, brusca).
- **Condensação (liquefação):** gás → líquido (gotas no copo gelado).
- **Sublimação:** sólido → gás direto (naftalina, gelo-seco).

Absorvem calor: fusão, vaporização, sublimação. Liberam calor: solidificação, condensação.

## Substância pura x mistura

- **Substância pura:** temperaturas de fusão e ebulição **constantes** (patamares no gráfico). Água pura ferve a 100 °C ao nível do mar.
- **Mistura:** a temperatura **varia** durante a mudança de estado.
- **Misturas especiais:** **azeotrópica** (ebulição constante, como álcool 96%) e **eutética** (fusão constante, como a solda).

## Densidade

**d = massa ÷ volume** (g/cm³ ou g/mL)

- Água: 1 g/cm³. Objetos com densidade **menor flutuam**; maiores **afundam**.
- **Gelo** (≈ 0,92 g/cm³) flutua na água.
- **Óleo** flutua na água.
- Teste de **adulteração**: o álcool combustível e o leite devem ter densidades dentro de faixas certas; os postos usam **densímetros**.
- Um ovo estragado flutua (acumula gás e fica menos denso).
- Com **sal**, a água fica mais densa: é mais fácil boiar no **Mar Morto**.

## Propriedades gerais e específicas

- **Gerais:** massa, volume, inércia (todas as matérias têm).
- **Específicas:** densidade, ponto de fusão e de ebulição, solubilidade, cor, odor, dureza — **identificam** uma substância.

## Fenômenos físicos x químicos

- **Físico:** não muda a natureza da substância (derreter gelo, quebrar vidro, dissolver açúcar).
- **Químico:** forma **novas substâncias** (queimar papel, enferrujar ferro, cozinhar um ovo, digerir alimentos). Indícios: mudança de cor, liberação de gás, luz, calor, formação de precipitado.

## Resumindo

Fusão, vaporização e sublimação absorvem calor. Substâncias puras têm patamares fixos de fusão e ebulição. Densidade = m/V; menos denso flutua. Fenômeno químico forma novas substâncias.`,
    [
      "Sublimação: sólido direto para gás (naftalina, gelo-seco).",
      "Substância pura: fusão e ebulição em temperatura constante.",
      "Densidade = massa ÷ volume; menos denso flutua.",
      "Fenômeno químico forma novas substâncias.",
    ],
    [
      ["Densidade", "Razão entre a massa e o volume de um material."],
      ["Sublimação", "Passagem direta do estado sólido para o gasoso."],
      ["Fenômeno químico", "Transformação que produz novas substâncias."],
    ],
    [
      ["As gotas que se formam do lado de fora de um copo gelado resultam da:", ["evaporação", "condensação do vapor de água do ar", "fusão do vidro", "sublimação", "solidificação"], 1, "Vapor esfria e vira líquido."],
      ["Um objeto de 50 g e volume 25 cm³ tem densidade de:", ["0,5 g/cm³", "2 g/cm³", "75 g/cm³", "25 g/cm³", "1.250 g/cm³"], 1, "50 ÷ 25."],
      ["Um material com densidade 0,8 g/cm³ colocado em água:", ["afunda", "flutua", "dissolve sempre", "evapora", "explode"], 1, "Menor que 1 g/cm³."],
      ["É um fenômeno químico:", ["derreter gelo", "quebrar um copo", "enferrujar um prego", "dissolver sal na água", "ferver água"], 2, "Forma óxido de ferro."],
      ["Durante a ebulição de uma substância pura, a temperatura:", ["aumenta sem parar", "permanece constante", "diminui", "oscila", "depende da quantidade"], 1, "Patamar no gráfico."],
    ],
    [["Explique como a densidade pode ser usada para detectar adulteração de combustíveis.", "Cada combustível tem uma faixa de densidade padrão; se ele for misturado com água ou outra substância, sua densidade muda, e o densímetro na bomba mostra que está fora do padrão."]],
  ),
  aula(
    "Oxirredução: ferrugem, número de oxidação e corrosão",
    `## Perder e ganhar elétrons

Reações de **oxirredução (redox)** envolvem **transferência de elétrons**.

- **Oxidação:** **perda** de elétrons → o número de oxidação (Nox) **aumenta**.
- **Redução:** **ganho** de elétrons → o Nox **diminui**.
- Elas sempre acontecem **juntas**: quem perde elétrons dá para quem ganha.

Dica: "**PERDEU, OXIDOU**".

- **Agente redutor:** a espécie que **se oxida** (e provoca a redução do outro).
- **Agente oxidante:** a espécie que **se reduz** (e provoca a oxidação do outro).

## Número de oxidação (Nox) — regras básicas

- Substâncias simples (O₂, Fe, H₂): Nox = **0**.
- Hidrogênio em compostos: **+1**. Oxigênio: geralmente **−2**.
- Metais alcalinos (Na, K): **+1**; alcalino-terrosos (Ca, Mg): **+2**.
- A soma dos Nox em uma molécula neutra é **zero**.

**Exemplo:** no H₂SO₄: 2(+1) + S + 4(−2) = 0 → **S = +6**.

## A ferrugem

- O **ferro** se oxida na presença de **oxigênio e água**: Fe (Nox 0) → Fe³⁺ (+3), formando óxido de ferro hidratado (a ferrugem).
- Locais **úmidos** e com **sal** (litoral) aceleram a corrosão.

## Como proteger os metais

- **Pintura**, graxa, óleo: isolam do ar e da água.
- **Galvanização:** cobrir o ferro com **zinco** (o zinco oxida no lugar do ferro).
- **Metal de sacrifício:** placas de **magnésio** ou zinco presas a cascos de navios e tubulações se oxidam primeiro, protegendo o ferro (são metais **mais reativos**, que se oxidam com mais facilidade).
- **Ligas** como o **aço inoxidável** (ferro + cromo + níquel).

## Outras oxirreduções do dia a dia

- **Combustão** (queima): o combustível se oxida.
- **Respiração celular**: a glicose é oxidada.
- **Fotossíntese**.
- **Pilhas e baterias**.
- **Alvejantes** (água sanitária) e a **maçã escurecendo** depois de cortada.
- **Bafômetro** antigo: o álcool reduz o dicromato (laranja → verde).

## Resumindo

Oxidação é perder elétrons (Nox sobe); redução é ganhar (Nox desce). A ferrugem é a oxidação do ferro. Pintura, galvanização e metal de sacrifício protegem contra a corrosão.`,
    [
      "Oxidação: perde elétrons, Nox aumenta.",
      "Redução: ganha elétrons, Nox diminui.",
      "Ferrugem: oxidação do ferro com oxigênio e água.",
      "Metal de sacrifício (Zn, Mg) oxida no lugar do ferro.",
    ],
    [
      ["Oxidação", "Perda de elétrons, com aumento do número de oxidação."],
      ["Agente redutor", "Espécie que se oxida e provoca a redução de outra."],
      ["Galvanização", "Revestimento do ferro com zinco para evitar a corrosão."],
    ],
    [
      ["Na oxidação, uma espécie química:", ["ganha elétrons", "perde elétrons", "ganha prótons", "perde nêutrons", "não muda"], 1, "Perdeu, oxidou."],
      ["O Nox do enxofre no H₂SO₄ é:", ["+2", "+4", "+6", "−2", "0"], 2, "2 + S − 8 = 0."],
      ["Placas de magnésio presas ao casco de navios servem para:", ["aumentar a velocidade", "oxidar no lugar do ferro, protegendo o casco", "atrair peixes", "dar peso", "conduzir eletricidade para o motor"], 1, "Metal de sacrifício."],
      ["A ferrugem se forma mais rápido:", ["em ambientes secos e frios", "em ambientes úmidos e salinos", "no vácuo", "em geladeiras", "sem oxigênio"], 1, "Água e sal aceleram."],
      ["O agente oxidante é a espécie que:", ["se oxida", "se reduz", "não participa", "perde elétrons", "é sempre um metal"], 1, "Recebe elétrons."],
    ],
    [["Explique como funciona a proteção por \"metal de sacrifício\".", "Um metal mais reativo, como zinco ou magnésio, é ligado ao ferro; por ter maior tendência a perder elétrons, ele se oxida primeiro e protege o ferro da corrosão, precisando ser trocado de tempos em tempos."]],
  ),
  aula(
    "Pilhas, baterias e eletrólise",
    `## Pilhas: química que vira eletricidade

Uma **pilha** transforma **energia química** em **energia elétrica** por meio de uma **reação de oxirredução espontânea**.

## Pilha de Daniell (zinco e cobre)

- **Ânodo (polo negativo):** onde ocorre **oxidação**. O **zinco** perde elétrons e a placa se **desgasta** (corrói).
- **Cátodo (polo positivo):** onde ocorre **redução**. Íons Cu²⁺ ganham elétrons e o **cobre se deposita** (a placa aumenta).
- Os elétrons fluem pelo fio **do ânodo para o cátodo**.
- A **ponte salina** mantém o equilíbrio de cargas.

Dica: "**Â**nodo = **O**xidação" (vogais); "**C**átodo = **R**edução" (consoantes).

## Potencial de redução

- Quanto **maior** o potencial de redução, maior a tendência de **receber** elétrons (ser o cátodo).
- A diferença de potencial (ddp) da pilha = E(cátodo) − E(ânodo).

## Baterias e o meio ambiente

- **Pilhas alcalinas**, **baterias de chumbo** (carros), **íon-lítio** (celulares, carros elétricos).
- Contêm **metais pesados** (chumbo, cádmio, mercúrio) que contaminam solo e água.
- **Não devem ir para o lixo comum**: devem ser levadas a **pontos de coleta** (logística reversa, Política Nacional de Resíduos Sólidos).
- A demanda por **lítio** cresce com os carros elétricos.

## Eletrólise: eletricidade que provoca reação

É o processo **inverso** da pilha: usa **energia elétrica** para provocar uma reação **não espontânea**.

- **Ânodo (+):** oxidação. **Cátodo (−):** redução.
- **Eletrólise ígnea:** com a substância **fundida** (sem água). Ex.: produção de **alumínio** a partir da **bauxita** (alumina, Al₂O₃) — processo que consome **muita eletricidade**. Por isso **reciclar latinhas** economiza muita energia.
- **Eletrólise aquosa:** em solução. Ex.: produção de **cloro** e **soda cáustica** a partir de salmoura; obtenção de **hidrogênio** (hidrogênio verde, com energia renovável).
- **Galvanoplastia:** revestir objetos com uma camada de metal (**cromagem**, **niquelação**, **douração** de bijuterias).

## Resumindo

Pilha: reação espontânea gera eletricidade; ânodo oxida (corrói), cátodo reduz (deposita). Eletrólise: eletricidade força uma reação; usada para produzir alumínio e na galvanoplastia. Pilhas devem ir para pontos de coleta.`,
    [
      "Pilha: energia química → elétrica (reação espontânea).",
      "Ânodo: oxidação (corrói); cátodo: redução (deposita).",
      "Eletrólise: energia elétrica força uma reação (alumínio, galvanoplastia).",
      "Pilhas e baterias vão para pontos de coleta.",
    ],
    [
      ["Ânodo", "Eletrodo onde ocorre a oxidação."],
      ["Cátodo", "Eletrodo onde ocorre a redução."],
      ["Galvanoplastia", "Revestimento de objetos com metal por eletrólise."],
    ],
    [
      ["Na pilha de Daniell, a placa de zinco:", ["aumenta de massa", "se desgasta, pois sofre oxidação", "não muda", "recebe cobre", "vira cátodo"], 1, "Zn → Zn²⁺ + 2e⁻."],
      ["Na eletrólise, ocorre:", ["produção espontânea de eletricidade", "uso de eletricidade para provocar uma reação não espontânea", "apenas fusão", "fotossíntese", "combustão"], 1, "Processo inverso da pilha."],
      ["Reciclar latinhas de alumínio economiza muita energia porque:", ["o alumínio é raro", "a produção a partir da bauxita usa eletrólise, que consome muita eletricidade", "as latas são leves", "o alumínio não enferruja", "é mais barato pintar"], 1, "Eletrólise ígnea."],
      ["Pilhas e baterias usadas devem ser:", ["jogadas no lixo comum", "enterradas no quintal", "levadas a pontos de coleta", "queimadas", "jogadas no rio"], 2, "Metais pesados."],
      ["O processo de recobrir uma bijuteria com ouro por eletrólise chama-se:", ["destilação", "galvanoplastia", "fusão", "calcinação", "fermentação"], 1, "Douração."],
    ],
    [["Qual a diferença entre uma pilha e a eletrólise?", "Na pilha, uma reação de oxirredução espontânea gera energia elétrica; na eletrólise, usa-se energia elétrica para provocar uma reação de oxirredução que não aconteceria sozinha."]],
  ),
  aula(
    "Radioatividade: meia-vida e aplicações",
    `## O que é radioatividade

Alguns núcleos atômicos são **instáveis** e emitem **radiação** espontaneamente para se estabilizar. Isso foi estudado por **Becquerel** e pelo casal **Marie e Pierre Curie** (Marie descobriu o polônio e o rádio e ganhou dois prêmios Nobel).

## Tipos de radiação

- **Alfa (α):** 2 prótons + 2 nêutrons (núcleo de hélio). **Pouco penetrante** (barrada por uma folha de papel ou pela pele), mas perigosa se ingerida.
- **Beta (β):** elétron emitido do núcleo. Penetração **média** (barrada por alumínio).
- **Gama (γ):** onda eletromagnética de alta energia. **Muito penetrante** (barrada por chumbo grosso ou concreto).

## Meia-vida

É o tempo para que **metade** dos núcleos radioativos de uma amostra se desintegre.

- Após 1 meia-vida: resta **1/2**; após 2: **1/4**; após 3: **1/8**; após n: **(1/2)ⁿ**.
- **Exemplo:** 80 g de um isótopo com meia-vida de 5 dias. Após 15 dias (3 meias-vidas): 80 → 40 → 20 → **10 g**.
- Meias-vidas variam de frações de segundo a bilhões de anos.

## Aplicações

- **Datação por carbono-14** (meia-vida ≈ 5.730 anos): estima a idade de fósseis, múmias e objetos orgânicos de até cerca de 50 mil anos.
- **Medicina:** **radioterapia** (cobalto-60 contra tumores), **diagnóstico** com radioisótopos (iodo-131 para a tireoide; tecnécio-99m em exames).
- **Energia nuclear:** **fissão** do urânio-235 em usinas (Angra).
- **Esterilização** de alimentos e materiais hospitalares (irradiação: o alimento **não fica radioativo**).
- **Agricultura e indústria:** controle de pragas, medição de espessura.

## Fissão x fusão

- **Fissão:** núcleo pesado (urânio) se **divide**, liberando energia e nêutrons (reação em cadeia). Usinas e bomba atômica.
- **Fusão:** núcleos leves (hidrogênio) se **unem**, formando hélio. É o que ocorre no **Sol**. Libera ainda mais energia.

## Riscos

- Radiação ionizante pode causar **queimaduras**, **câncer** e mutações.
- **Acidente com césio-137 em Goiânia (1987):** uma cápsula de equipamento de radioterapia abandonado foi aberta; o pó brilhante azul se espalhou, contaminou centenas de pessoas e matou algumas. Um dos maiores acidentes radiológicos do mundo.
- **Chernobyl (1986)** e **Fukushima (2011)**.
- **Lixo radioativo** exige armazenamento seguro por milhares de anos.

## Resumindo

Alfa é pouco penetrante; gama, muito. Meia-vida: tempo para a massa cair à metade (após n meias-vidas, resta (1/2)ⁿ). Usos: datação por C-14, radioterapia, energia. Riscos: Goiânia, Chernobyl.`,
    [
      "Alfa: pouco penetrante; beta: média; gama: muito penetrante.",
      "Meia-vida: tempo para metade da amostra se desintegrar.",
      "Carbono-14 data fósseis; cobalto-60 trata câncer.",
      "Fissão divide núcleos (usinas); fusão une (Sol).",
    ],
    [
      ["Meia-vida", "Tempo para a quantidade de um isótopo radioativo cair à metade."],
      ["Fissão nuclear", "Divisão de um núcleo pesado com liberação de energia."],
      ["Radioisótopo", "Isótopo radioativo usado em medicina, indústria ou pesquisa."],
    ],
    [
      ["Uma amostra de 120 g de um isótopo com meia-vida de 10 anos terá, após 30 anos:", ["60 g", "40 g", "30 g", "15 g", "0 g"], 3, "120 → 60 → 30 → 15."],
      ["A radiação mais penetrante é a:", ["alfa", "beta", "gama", "luz visível", "infravermelha"], 2, "Exige chumbo ou concreto."],
      ["A datação de fósseis usa o isótopo:", ["urânio-235", "carbono-14", "césio-137", "iodo-131", "cobalto-60"], 1, "Meia-vida de ~5.730 anos."],
      ["A energia do Sol vem da:", ["fissão do urânio", "fusão de núcleos de hidrogênio", "combustão do carvão", "eletrólise", "radiação alfa"], 1, "Forma hélio."],
      ["O acidente radiológico de Goiânia (1987) envolveu:", ["urânio de uma usina", "césio-137 de um aparelho de radioterapia abandonado", "plutônio de uma bomba", "radônio natural", "lixo de Chernobyl"], 1, "Cápsula aberta."],
    ],
    [["O que é meia-vida? Dê um exemplo de cálculo.", "É o tempo necessário para que metade dos núcleos radioativos de uma amostra se desintegre; por exemplo, 100 g de um isótopo com meia-vida de 2 dias viram 50 g em 2 dias, 25 g em 4 dias e 12,5 g em 6 dias."]],
  ),
  aula(
    "Ácidos e bases no dia a dia: pH e indicadores",
    `## Ácidos e bases (Arrhenius)

- **Ácidos:** em água, liberam **íons H⁺** (H₃O⁺). Sabor **azedo**, conduzem corrente em solução, reagem com metais. Ex.: **vinagre** (ácido acético), **suco de limão** (ácido cítrico), ácido **clorídrico** no **estômago**, ácido **sulfúrico** em baterias.
- **Bases:** em água, liberam **íons OH⁻**. Sabor **adstringente** ("amarra" a boca), sensação escorregadia. Ex.: **soda cáustica** (NaOH, desentupidor), **leite de magnésia** (Mg(OH)₂), **amônia**, sabão.

## Escala de pH

- **pH < 7:** ácido. **pH = 7:** neutro (água pura a 25 °C). **pH > 7:** básico (alcalino).
- Cada unidade a menos = **10 vezes mais ácido**.
- Exemplos: suco gástrico (≈ 1,5–2), limão (≈ 2), refrigerante (≈ 3), café (≈ 5), chuva normal (≈ 5,6), sangue (≈ 7,4), água do mar (≈ 8), sabão (≈ 10), soda cáustica (≈ 14).

## Indicadores ácido-base

Substâncias que **mudam de cor** conforme o pH:

- **Fenolftaleína:** incolor em ácido, **rosa** em base.
- **Papel de tornassol:** azul fica vermelho em ácido; vermelho fica azul em base.
- **Indicadores naturais:** **repolho roxo** (vermelho em ácido, verde/amarelo em base), flores de hortênsia (azuis em solo ácido, rosas em solo básico), beterraba, uva.

## Neutralização

**Ácido + base → sal + água**

- **Antiácidos** (leite de magnésia, bicarbonato de sódio) neutralizam o excesso de ácido no estômago (azia).
- **Calagem:** aplicar **calcário** em solos ácidos (como os do Cerrado) para corrigir o pH e torná-los produtivos.
- Picada de formiga (ácido fórmico) aliviada com substância levemente básica.

## pH e saúde

- Refrigerantes e doces ácidos favorecem a **erosão do esmalte** dos dentes; o flúor ajuda a proteger.
- O **sangue** precisa manter pH próximo de 7,4 (sistemas-tampão).

## Chuva ácida

Gases de óxidos de **enxofre** e **nitrogênio** (queima de combustíveis fósseis) reagem com a água e formam ácidos. A chuva ácida corrói monumentos de mármore, acidifica lagos e prejudica florestas.

## Resumindo

Ácidos liberam H⁺ (pH < 7); bases liberam OH⁻ (pH > 7). Indicadores como fenolftaleína e repolho roxo mudam de cor. Neutralização forma sal e água (antiácidos, calagem).`,
    [
      "Ácidos liberam H⁺ (pH < 7); bases liberam OH⁻ (pH > 7).",
      "Cada unidade de pH a menos = 10 vezes mais ácido.",
      "Fenolftaleína fica rosa em base; repolho roxo é indicador natural.",
      "Neutralização: ácido + base → sal + água (antiácidos, calagem).",
    ],
    [
      ["pH", "Escala que indica a acidez ou basicidade de uma solução."],
      ["Indicador ácido-base", "Substância que muda de cor conforme o pH."],
      ["Calagem", "Aplicação de calcário para corrigir solos ácidos."],
    ],
    [
      ["Uma solução com pH 3 é:", ["básica", "neutra", "ácida", "salina neutra", "alcalina forte"], 2, "pH < 7."],
      ["A fenolftaleína, em meio básico, fica:", ["incolor", "rosa", "azul", "amarela", "verde"], 1, "Indicador clássico."],
      ["O leite de magnésia alivia a azia porque:", ["é ácido", "é uma base que neutraliza o excesso de ácido estomacal", "é neutro", "aumenta o ácido", "é um sal ácido"], 1, "Neutralização."],
      ["A calagem dos solos do Cerrado serve para:", ["aumentar a acidez", "corrigir a acidez do solo", "salinizar o solo", "retirar nutrientes", "impermeabilizar"], 1, "Calcário eleva o pH."],
      ["A chuva ácida é causada principalmente por:", ["oxigênio", "óxidos de enxofre e nitrogênio da queima de combustíveis", "vapor de água puro", "gás hélio", "ozônio"], 1, "Poluentes que formam ácidos."],
    ],
    [["Como o repolho roxo pode ser usado para identificar se uma substância é ácida ou básica?", "O suco de repolho roxo contém pigmentos que mudam de cor conforme o pH: fica avermelhado em meio ácido e esverdeado ou amarelado em meio básico, funcionando como indicador natural."]],
  ),
  aula(
    "Combustíveis, combustão e biocombustíveis",
    `## Combustão

É a reação de um **combustível** com o **comburente** (geralmente o **oxigênio**), liberando **energia** (calor e luz). Precisa de três elementos — o **triângulo do fogo**: combustível, comburente e **calor** (energia de ativação). Tirar um deles apaga o fogo (abafar retira o oxigênio; água retira o calor).

- **Combustão completa:** com oxigênio suficiente → **CO₂ + H₂O**. Chama **azul**.
  Ex.: CH₄ + 2 O₂ → CO₂ + 2 H₂O
- **Combustão incompleta:** com pouco oxigênio → **monóxido de carbono (CO)** e/ou **fuligem (C)**. Chama **amarelada**.
  - O **CO** é **tóxico**: liga-se à hemoglobina e impede o transporte de oxigênio. Por isso é perigoso usar aquecedores a gás ou braseiros em ambientes **fechados**.

## Combustíveis fósseis

- **Petróleo:** separado em frações por **destilação fracionada** (gás, gasolina, querosene, diesel, óleos, asfalto).
- **Gás natural** (principalmente metano), **carvão mineral**.
- Emitem **CO₂** (efeito estufa) e, alguns, **enxofre** (chuva ácida).

## Biocombustíveis

Produzidos a partir de **biomassa** (matéria orgânica recente). São **renováveis**.

- **Etanol:** feito da **fermentação** da cana-de-açúcar (no Brasil) ou do milho. O Brasil é pioneiro com o **Proálcool** (1975) e os carros **flex**.
- **Biodiesel:** produzido por **transesterificação** de óleos vegetais (soja, palma) ou gordura animal com álcool. Misturado ao diesel.
- **Biogás:** metano da decomposição de lixo e esterco em **biodigestores**.
- **Etanol de segunda geração:** feito do **bagaço** e da palha da cana.

## Por que dizem que o etanol é "mais limpo"?

O CO₂ liberado na queima foi **absorvido** pela cana durante a **fotossíntese**: o **balanço de carbono** é menor que o dos fósseis. Críticas: monocultura, uso de terras, queimadas em canaviais (proibidas em muitos lugares), condições de trabalho.

## Poder calorífico e octanagem

- **Poder calorífico:** energia liberada por grama de combustível. A gasolina libera mais energia por litro que o etanol (por isso o carro consome mais etanol; vale a pena abastecer com etanol se ele custar até cerca de **70%** do preço da gasolina).
- **Octanagem:** resistência da gasolina à detonação precoce no motor.

## Resumindo

Combustão completa gera CO₂ e água; a incompleta gera CO (tóxico) e fuligem. Biocombustíveis (etanol, biodiesel, biogás) são renováveis e têm menor balanço de carbono que os fósseis.`,
    [
      "Triângulo do fogo: combustível, comburente e calor.",
      "Combustão incompleta gera CO, gás tóxico.",
      "Etanol, biodiesel e biogás são renováveis.",
      "O CO₂ do etanol foi absorvido pela cana na fotossíntese.",
    ],
    [
      ["Comburente", "Substância que alimenta a combustão, geralmente o oxigênio."],
      ["Biocombustível", "Combustível renovável produzido a partir de biomassa."],
      ["Poder calorífico", "Energia liberada na queima de uma quantidade de combustível."],
    ],
    [
      ["Os produtos da combustão completa de um hidrocarboneto são:", ["CO e fuligem", "CO₂ e água", "O₂ e H₂", "metano e água", "SO₂ apenas"], 1, "Oxigênio suficiente."],
      ["Usar braseiro em quarto fechado é perigoso porque:", ["libera oxigênio demais", "a combustão incompleta produz monóxido de carbono", "produz água", "resfria o ambiente", "gera ozônio"], 1, "CO é tóxico."],
      ["O etanol brasileiro é produzido principalmente pela:", ["destilação do petróleo", "fermentação da cana-de-açúcar", "eletrólise da água", "queima de carvão", "transesterificação da soja"], 1, "Fermentação."],
      ["O biodiesel é produzido por:", ["fermentação do milho", "transesterificação de óleos vegetais ou gorduras", "destilação do carvão", "fissão nuclear", "eletrólise"], 1, "Reação com álcool."],
      ["Jogar areia sobre uma fogueira apaga o fogo porque:", ["aumenta o calor", "retira o comburente (oxigênio)", "adiciona combustível", "reage com a lenha", "esfria o ar"], 1, "Abafamento."],
    ],
    [["Por que o etanol é considerado menos poluente que a gasolina em relação ao efeito estufa?", "Porque o CO₂ liberado na queima do etanol foi absorvido pela cana-de-açúcar durante a fotossíntese, tornando o balanço de carbono menor; a gasolina libera carbono que estava preso no subsolo há milhões de anos."]],
  ),
  aula(
    "Tratamento de água e de esgoto",
    `## Da represa à torneira

A água de rios e represas precisa ser **tratada** antes do consumo. As etapas numa **Estação de Tratamento de Água (ETA)** são:

1. **Captação** e **gradeamento:** retira objetos grandes.
2. **Coagulação:** adição de **sulfato de alumínio** (ou cloreto férrico) e **cal**; as impurezas se juntam.
3. **Floculação:** a água é agitada lentamente e as partículas formam **flocos** maiores.
4. **Decantação (sedimentação):** os flocos, mais densos, **descem** para o fundo.
5. **Filtração:** a água passa por camadas de **areia, cascalho e carvão**, retendo partículas menores.
6. **Desinfecção (cloração):** adição de **cloro**, que mata micro-organismos.
7. **Fluoretação:** adição de **flúor**, que ajuda a prevenir **cáries**.
8. **Correção do pH:** com cal.

A água tratada é **potável**, mas não é **pura** (tem sais dissolvidos, cloro).

## Métodos de separação envolvidos

Decantação, filtração e, em casa, **fervura** (mata micro-organismos) e **filtro de barro** (filtração).

## Tratamento de esgoto (ETE)

O esgoto doméstico tem **matéria orgânica**, micro-organismos e nutrientes.

1. **Tratamento preliminar:** grades e caixas de areia.
2. **Primário:** decantação dos sólidos.
3. **Secundário (biológico):** **bactérias** decompõem a matéria orgânica (lodo ativado, lagoas de estabilização), em processos **aeróbios** ou anaeróbios.
4. **Terciário:** remove nutrientes (nitrogênio, fósforo) e desinfeta.

O **lodo** pode virar adubo e o **biogás** pode gerar energia.

## Por que isso importa

- Cerca de **metade** dos brasileiros não tem esgoto **tratado**.
- Esgoto lançado nos rios causa **eutrofização**: excesso de nutrientes → proliferação de algas → menos oxigênio → morte de peixes.
- Falta de saneamento espalha doenças: **diarreias, hepatite A, cólera, leptospirose, verminoses**.
- **Marco Legal do Saneamento (2020):** meta de universalizar água e esgoto até 2033.
- Cada real investido em saneamento economiza gastos com saúde.

## DBO

A **Demanda Bioquímica de Oxigênio** mede quanto oxigênio as bactérias consomem para decompor a matéria orgânica. **DBO alta = água muito poluída** por matéria orgânica.

## Resumindo

ETA: coagulação, floculação, decantação, filtração, cloração e fluoretação. ETE: decantação e tratamento biológico com bactérias. Esgoto sem tratamento causa eutrofização e doenças.`,
    [
      "ETA: coagulação, floculação, decantação, filtração, cloro e flúor.",
      "Cloro desinfeta; flúor previne cáries.",
      "ETE: bactérias decompõem a matéria orgânica do esgoto.",
      "Esgoto nos rios causa eutrofização; DBO alta indica poluição.",
    ],
    [
      ["Floculação", "Formação de flocos de impurezas que depois decantam."],
      ["Eutrofização", "Excesso de nutrientes na água que leva à proliferação de algas e à falta de oxigênio."],
      ["DBO", "Demanda Bioquímica de Oxigênio: indica a quantidade de matéria orgânica na água."],
    ],
    [
      ["A etapa do tratamento de água que elimina micro-organismos é a:", ["decantação", "floculação", "cloração", "filtração", "captação"], 2, "Cloro desinfeta."],
      ["O sulfato de alumínio é adicionado à água para:", ["matar bactérias", "aglomerar impurezas em flocos", "prevenir cáries", "dar sabor", "aumentar o pH"], 1, "Coagulação/floculação."],
      ["O flúor é adicionado à água tratada para:", ["eliminar vírus", "prevenir cáries", "tirar a cor", "aumentar a densidade", "evitar a ferrugem"], 1, "Saúde bucal."],
      ["No tratamento secundário do esgoto, a matéria orgânica é decomposta por:", ["cloro", "bactérias", "areia", "sulfato de alumínio", "raios UV apenas"], 1, "Tratamento biológico."],
      ["Uma DBO muito alta indica que a água:", ["está pura", "tem muita matéria orgânica e pouco oxigênio disponível", "tem muito flúor", "é salgada", "está congelada"], 1, "Poluição orgânica."],
    ],
    [["Por que a falta de tratamento de esgoto provoca a morte de peixes nos rios?", "Porque o esgoto lança matéria orgânica e nutrientes; bactérias consomem muito oxigênio para decompô-la e há proliferação de algas (eutrofização), o oxigênio da água acaba e os peixes morrem."]],
  ),
  aula(
    "Forças intermoleculares, solubilidade e sabões",
    `## O que mantém as moléculas unidas

As **forças intermoleculares** atuam **entre** as moléculas e explicam pontos de ebulição, estados físicos e a solubilidade.

## Polaridade

- **Molécula polar:** tem distribuição desigual de cargas (um lado mais negativo, outro mais positivo). Ex.: **água**, álcool.
- **Molécula apolar:** cargas equilibradas. Ex.: **óleos, gorduras**, gasolina, CO₂.

## Tipos de forças (da mais fraca à mais forte)

1. **Dipolo induzido (London):** entre moléculas **apolares**. Fraca.
2. **Dipolo-dipolo (permanente):** entre moléculas **polares**.
3. **Ligação de hidrogênio:** quando o **H** está ligado a **F, O ou N**. A mais forte. Ex.: **água**, álcool, DNA.

Por causa das **ligações de hidrogênio**, a água tem ponto de ebulição **alto** para uma molécula tão pequena, e alta **tensão superficial** (insetos andam sobre a água).

## Solubilidade: "semelhante dissolve semelhante"

- Substâncias **polares** dissolvem-se em **polares** (açúcar e sal na água).
- **Apolares** dissolvem-se em **apolares** (graxa na gasolina, esmalte na acetona).
- Por isso **óleo e água não se misturam**.
- O **álcool** tem uma parte polar e uma apolar, por isso se mistura com água e com gasolina (o teor de álcool na gasolina é medido com água).

## Sabões e detergentes

- A molécula de sabão tem uma **"cabeça" polar** (hidrofílica, atraída pela água) e uma **"cauda" apolar** longa (hidrofóbica, atraída pela gordura).
- Na lavagem, as caudas envolvem a gordura e as cabeças ficam voltadas para a água, formando **micelas**: a gordura é "arrastada" pela água.
- **Sabão:** produzido pela **saponificação** (gordura + base forte, como NaOH).
- **Detergentes sintéticos:** derivados do petróleo; alguns **não biodegradáveis** causam espuma em rios. Hoje, prefere-se **detergente biodegradável** (cadeia linear).
- Óleo de cozinha usado **não deve ir para a pia**: entope canos e polui rios; pode ser **reciclado** em sabão.

## Pontos de ebulição

Quanto **mais fortes** as forças intermoleculares e **maior** a molécula, **maior** o ponto de ebulição.

## Resumindo

Polar dissolve polar; apolar dissolve apolar. Ligação de hidrogênio (H com F, O, N) é a força mais forte e explica as propriedades da água. O sabão tem cabeça polar e cauda apolar e forma micelas com a gordura.`,
    [
      "Semelhante dissolve semelhante: polar com polar, apolar com apolar.",
      "Ligação de hidrogênio (H com F, O ou N) é a mais forte.",
      "Sabão: cabeça polar + cauda apolar = micelas que removem gordura.",
      "Óleo usado não vai na pia: pode virar sabão.",
    ],
    [
      ["Polaridade", "Distribuição desigual de cargas elétricas numa molécula."],
      ["Ligação de hidrogênio", "Forte atração entre moléculas em que H está ligado a F, O ou N."],
      ["Micela", "Agrupamento de moléculas de sabão em torno da gordura."],
    ],
    [
      ["Óleo e água não se misturam porque:", ["ambos são polares", "o óleo é apolar e a água é polar", "ambos são apolares", "o óleo é mais denso", "a água é apolar"], 1, "Polaridades diferentes."],
      ["A remoção de esmalte com acetona é explicada porque:", ["ambos são apolares ou pouco polares", "a acetona é um ácido forte", "o esmalte é iônico", "a acetona evapora", "o esmalte é polar e a acetona apolar"], 0, "Semelhante dissolve semelhante."],
      ["A ligação de hidrogênio ocorre quando o H está ligado a:", ["C, S ou P", "F, O ou N", "Na, K ou Ca", "He, Ne ou Ar", "Fe, Cu ou Zn"], 1, "Átomos muito eletronegativos."],
      ["Na molécula de sabão, a parte que se liga à gordura é:", ["a cabeça polar", "a cauda apolar", "o sódio", "a água", "nenhuma"], 1, "Cauda hidrofóbica."],
      ["A saponificação é a reação entre:", ["ácido e metal", "gordura e base forte", "água e sal", "álcool e gasolina", "oxigênio e ferro"], 1, "Produz sabão."],
    ],
    [["Explique como o sabão remove a gordura de um prato.", "A molécula de sabão tem uma cauda apolar que se prende à gordura e uma cabeça polar que se liga à água; as moléculas envolvem a gordura formando micelas, que são levadas pela água do enxágue."]],
  ),
  aula(
    "Concentração e diluição de soluções",
    `## Soluções no cotidiano

**Solução** é uma mistura homogênea de **soluto** (o que se dissolve) e **solvente** (o que dissolve, geralmente a água). Ex.: soro fisiológico, água sanitária, café adoçado.

## Formas de expressar a concentração

- **Concentração comum (g/L):** C = massa do soluto (g) ÷ volume da solução (L).
  Ex.: 20 g de açúcar em 0,5 L → C = **40 g/L**.
- **Concentração em quantidade de matéria (mol/L):** M = n (mol) ÷ V (L).
- **Porcentagem (título):** soro fisiológico **0,9%** = 0,9 g de NaCl em 100 mL. Álcool **70%** (melhor desinfetante que o 96%, porque a água ajuda a penetrar nos micro-organismos).
- **ppm (partes por milhão):** para quantidades muito pequenas (flúor na água, poluentes). 1 ppm = 1 mg por litro de água (aproximadamente).

## Diluição

Adicionar **solvente** a uma solução: a **quantidade de soluto não muda**, o volume aumenta e a concentração **diminui**.

**C₁ · V₁ = C₂ · V₂**

**Exemplo:** um suco concentrado de 200 g/L, 0,5 L, é diluído até 2 L. C₂ = (200 · 0,5) ÷ 2 = **50 g/L**.

Aplicações: preparar **sucos** e produtos de limpeza (seguir o rótulo), **medicamentos** e soro na medicina.

## Mistura de soluções do mesmo soluto

C_final = (C₁·V₁ + C₂·V₂) ÷ (V₁ + V₂).

## Solubilidade e saturação

- **Coeficiente de solubilidade:** quantidade máxima de soluto que se dissolve numa quantidade de solvente a certa temperatura.
- **Insaturada:** abaixo do limite. **Saturada:** no limite. **Supersaturada:** acima (instável).
- Para a maioria dos **sólidos**, a solubilidade **aumenta** com a temperatura (açúcar dissolve melhor no chá quente).
- Para os **gases**, a solubilidade **diminui** com a temperatura (refrigerante quente perde gás; aquecimento dos rios reduz o oxigênio dissolvido, prejudicando os peixes) e **aumenta** com a pressão.

## Resumindo

C = massa ÷ volume. Na diluição, o soluto se mantém: C₁V₁ = C₂V₂. Sólidos dissolvem mais no calor; gases dissolvem menos no calor e mais sob pressão.`,
    [
      "Concentração comum: C = massa de soluto ÷ volume.",
      "Diluição: C₁ · V₁ = C₂ · V₂ (soluto constante).",
      "Soro fisiológico 0,9%: 0,9 g de sal em 100 mL.",
      "Gases dissolvem menos no calor e mais sob pressão.",
    ],
    [
      ["Soluto", "Substância dissolvida numa solução."],
      ["Diluição", "Adição de solvente que reduz a concentração."],
      ["Solução saturada", "Solução com a quantidade máxima de soluto dissolvida."],
    ],
    [
      ["Dissolvem-se 30 g de sal em água até 1,5 L de solução. A concentração é:", ["45 g/L", "20 g/L", "30 g/L", "2 g/L", "50 g/L"], 1, "30 ÷ 1,5."],
      ["100 mL de uma solução de 80 g/L são diluídos até 400 mL. A nova concentração é:", ["20 g/L", "40 g/L", "320 g/L", "80 g/L", "10 g/L"], 0, "80 · 100 = C₂ · 400."],
      ["Quantos gramas de NaCl há em 500 mL de soro fisiológico a 0,9%?", ["0,9 g", "4,5 g", "9 g", "45 g", "0,45 g"], 1, "0,9 g por 100 mL × 5."],
      ["Um refrigerante quente perde gás mais rápido porque:", ["a solubilidade dos gases aumenta com o calor", "a solubilidade dos gases diminui com o aumento da temperatura", "o açúcar evapora", "a pressão aumenta", "o gás vira líquido"], 1, "Gases são menos solúveis no calor."],
      ["Na diluição de uma solução, permanece constante:", ["o volume", "a concentração", "a massa de soluto", "a quantidade de solvente", "a densidade"], 2, "Só se adiciona solvente."],
    ],
    [["Por que o aquecimento das águas de um rio (poluição térmica) pode matar peixes?", "Porque a solubilidade dos gases diminui com o aumento da temperatura; a água mais quente dissolve menos oxigênio, e os peixes ficam sem oxigênio suficiente para respirar."]],
  ),
];
