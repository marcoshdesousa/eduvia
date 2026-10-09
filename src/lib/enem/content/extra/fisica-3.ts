import { aula } from "./build";

/** Física, lote 3: vetores, movimento circular, ondas, termodinâmica, óptica da visão e segurança. */
export const FISICA_3 = [
  aula(
    "Vetores e velocidade relativa",
    `## Grandezas escalares e vetoriais

- **Escalares:** ficam definidas só com **valor e unidade**: massa (5 kg), tempo (10 s), temperatura (30 °C), energia.
- **Vetoriais:** precisam de **valor (módulo)**, **direção** e **sentido**: velocidade, aceleração, **força**, deslocamento.

Ex.: "um carro a 60 km/h" não basta para dizer onde ele vai chegar: é preciso saber **para onde** (norte, sul...).

## Soma de vetores

- **Mesma direção e sentido:** somam-se os módulos. Empurrar um carro com 2 pessoas (100 N + 100 N) = **200 N**.
- **Sentidos opostos:** subtraem-se. Cabo de guerra com 300 N e 200 N → resultante de **100 N** para o lado mais forte.
- **Perpendiculares:** usa-se o **Teorema de Pitágoras**. Forças de 3 N e 4 N formando 90° → resultante de **5 N**.

## Deslocamento x distância percorrida

- **Distância:** todo o caminho percorrido (escalar).
- **Deslocamento:** a "linha reta" do ponto inicial ao final (vetor).
- Ex.: dar uma volta completa numa pista de 400 m → distância 400 m, deslocamento **zero**.

## Velocidade relativa

A velocidade depende do **referencial** (de quem observa).

- **Mesmo sentido:** v relativa = **diferença** das velocidades. Dois carros a 100 km/h e 80 km/h no mesmo sentido: um se afasta do outro a **20 km/h**.
- **Sentidos opostos:** v relativa = **soma**. Dois carros a 60 km/h e 40 km/h em sentidos contrários se aproximam a **100 km/h** (por isso batidas de frente são tão graves).
- Para um passageiro sentado no ônibus, o colega ao lado está **parado**; para quem está na calçada, ambos se movem.

## Composição de movimentos

- **Barco atravessando um rio:** a velocidade do barco e a da correnteza se combinam. Se o barco aponta perpendicularmente à margem, ele **chega mais abaixo** (é arrastado pela correnteza), mas o **tempo de travessia** não muda.
- **Avião com vento:** a favor, chega mais rápido; contra, mais devagar.
- **Esteira rolante:** andar sobre ela soma as velocidades.

## Encontro de móveis

Dois móveis em sentidos opostos, separados por uma distância **d**, encontram-se no tempo **t = d ÷ (v₁ + v₂)**.

Ex.: duas cidades a 300 km; carros partindo ao mesmo tempo a 80 e 70 km/h um em direção ao outro → t = 300 ÷ 150 = **2 h**.

## Resumindo

Vetores têm módulo, direção e sentido. Mesma direção: soma; opostos: subtração; perpendiculares: Pitágoras. Velocidade relativa: diferença (mesmo sentido) ou soma (opostos). Encontro: t = d ÷ (v₁ + v₂).`,
    [
      "Vetoriais: módulo, direção e sentido (força, velocidade).",
      "Forças perpendiculares: resultante por Pitágoras.",
      "Velocidade relativa: subtrai no mesmo sentido, soma em opostos.",
      "Encontro em sentidos opostos: t = d ÷ (v₁ + v₂).",
    ],
    [
      ["Grandeza vetorial", "Grandeza que precisa de módulo, direção e sentido."],
      ["Referencial", "Ponto de vista a partir do qual se descreve o movimento."],
      ["Deslocamento", "Vetor que liga a posição inicial à final."],
    ],
    [
      ["É uma grandeza vetorial:", ["massa", "tempo", "força", "temperatura", "energia"], 2, "Tem direção e sentido."],
      ["Duas forças perpendiculares de 6 N e 8 N têm resultante de:", ["14 N", "2 N", "10 N", "48 N", "7 N"], 2, "√(36 + 64)."],
      ["Dois carros vão em sentidos opostos a 50 e 70 km/h. A velocidade de aproximação entre eles é:", ["20 km/h", "120 km/h", "60 km/h", "50 km/h", "70 km/h"], 1, "Dica: Soma."],
      ["Ao completar uma volta inteira numa pista circular, o deslocamento é:", ["igual ao comprimento da pista", "zero", "o dobro do raio", "infinito", "igual ao raio"], 1, "Volta ao ponto inicial."],
      ["Duas cidades distam 240 km; dois ônibus partem ao mesmo tempo um em direção ao outro a 60 e 60 km/h. Encontram-se após:", ["1 h", "2 h", "4 h", "3 h", "6 h"], 1, "240 ÷ 120."],
    ],
    [["Explique por que uma colisão frontal entre dois carros costuma ser mais grave do que uma batida traseira com as mesmas velocidades.", "Porque, em sentidos opostos, a velocidade relativa é a soma das velocidades dos carros, enquanto no mesmo sentido é a diferença; assim, no choque frontal a velocidade de impacto é muito maior."]],
  ),
  aula(
    "Movimento circular: período, frequência, polias e engrenagens",
    `## Movimento circular uniforme (MCU)

Um corpo que gira em círculo com **velocidade constante em módulo** (ventilador, roda, satélite, ponteiro do relógio).

## Período e frequência

- **Período (T):** tempo para dar **uma volta completa** (em segundos).
- **Frequência (f):** número de **voltas por segundo** (em **hertz, Hz**), ou por minuto (**rpm**).
- **f = 1 / T**.
- Ex.: um ventilador que dá 10 voltas por segundo tem f = 10 Hz e T = 0,1 s.
- 60 rpm = 1 Hz.

## Velocidades

- **Velocidade angular (ω):** ângulo percorrido por tempo: ω = 2π / T = 2πf (rad/s).
- **Velocidade linear (escalar) (v):** distância percorrida por tempo: **v = 2πR / T = ω · R**.
- Pontos **mais distantes do centro** têm **maior velocidade linear** (na roda-gigante, num disco), embora todos tenham o **mesmo período**.

## Aceleração centrípeta

Mesmo com velocidade constante em módulo, a **direção** muda o tempo todo, então há aceleração apontando para o **centro**: a = v² / R. A força que a provoca é a **força centrípeta** (atrito dos pneus numa curva, tração da corda, gravidade num satélite). Sem ela, o corpo seguiria em linha **reta** (inércia) — por isso o carro "sai pela tangente" numa curva com pista molhada.

## Polias e engrenagens (transmissão)

### Ligadas por correia ou em contato (bicicleta: coroa e catraca ligadas pela corrente)

- Os pontos da borda têm a **mesma velocidade linear**: v₁ = v₂.
- Logo: **f₁ · R₁ = f₂ · R₂**.
- A polia **menor gira mais rápido** (maior frequência).

### No mesmo eixo (catraca e roda traseira da bicicleta)

- Têm a **mesma frequência** (e mesmo período).
- A maior tem maior velocidade linear na borda.

## Exemplo: bicicleta

Coroa (pedal) com raio 10 cm; catraca com raio 5 cm. Se o ciclista pedala a 1 volta por segundo:

- Pela corrente: f_coroa · R_coroa = f_catraca · R_catraca → 1 · 10 = f · 5 → **f_catraca = 2 Hz**.
- A roda traseira (no mesmo eixo da catraca) também gira a **2 voltas por segundo**.
- Por isso, **coroa grande com catraca pequena** dá mais velocidade (mas exige mais força).

## Resumindo

Período é o tempo de uma volta; frequência é voltas por segundo (f = 1/T). v = 2πR/T. Há aceleração centrípeta para o centro. Polias ligadas por correia têm mesma velocidade linear (f₁R₁ = f₂R₂); no mesmo eixo, mesma frequência.`,
    [
      "f = 1/T; 60 rpm = 1 Hz.",
      "v = 2πR/T: pontos mais afastados do centro são mais rápidos.",
      "Força centrípeta aponta para o centro da curva.",
      "Polias por correia: f₁R₁ = f₂R₂; mesmo eixo: mesma frequência.",
    ],
    [
      ["Período", "Tempo para completar uma volta."],
      ["Frequência", "Número de voltas por unidade de tempo (Hz ou rpm)."],
      ["Força centrípeta", "Força dirigida ao centro que mantém o movimento circular."],
    ],
    [
      ["Uma roda que dá 5 voltas por segundo tem período de:", ["5 s", "0,2 s", "0,5 s", "2 s", "25 s"], 1, "T = 1/f."],
      ["120 rpm corresponde a:", ["1 Hz", "2 Hz", "120 Hz", "60 Hz", "0,5 Hz"], 1, "120 ÷ 60."],
      ["Numa roda-gigante, um ponto mais distante do centro tem, em relação a um mais próximo:", ["menor velocidade linear", "maior velocidade linear e mesmo período", "maior período", "menor frequência", "velocidade nula"], 1, "v = ωR."],
      ["Duas polias ligadas por correia têm raios 20 cm e 10 cm. Se a maior gira a 3 Hz, a menor gira a:", ["1,5 Hz", "3 Hz", "6 Hz", "30 Hz", "9 Hz"], 2, "3 · 20 = f · 10."],
      ["Um carro sai da curva numa pista molhada porque:", ["a força centrípeta aumenta", "o atrito (força centrípeta) é insuficiente e, por inércia, ele segue em linha reta", "a gravidade some", "a velocidade linear zera", "o raio da curva aumenta sozinho"], 1, "Inércia."],
    ],
    [["Explique por que, numa bicicleta, usar uma coroa grande com uma catraca pequena aumenta a velocidade.", "A coroa e a catraca estão ligadas pela corrente e têm a mesma velocidade linear; como f × R é igual nas duas, a catraca menor gira mais vezes por volta do pedal, e a roda traseira, no mesmo eixo da catraca, gira mais rápido."]],
  ),
  aula(
    "Fenômenos ondulatórios: difração, interferência e ressonância",
    `## Ondas: revisão rápida

- **Mecânicas** (precisam de meio: som, ondas no mar) e **eletromagnéticas** (não precisam: luz, rádio).
- **v = λ · f** (velocidade = comprimento de onda × frequência).
- Ao mudar de meio, a **frequência não muda**; mudam a velocidade e o comprimento de onda.

## Reflexão

A onda **bate** num obstáculo e **volta**.

- **Eco:** reflexão do som (percebido se o obstáculo estiver a mais de cerca de **17 m**).
- **Sonar** e **ecolocalização** de morcegos e golfinhos.
- **Ultrassonografia** na medicina.

## Refração

Mudança de **velocidade** (e muitas vezes de direção) ao passar para outro meio: luz da água para o ar; ondas do mar que mudam de direção ao chegar à praia.

## Difração

A onda **contorna obstáculos** ou se espalha ao passar por **fendas**. É mais intensa quando o obstáculo ou a fenda tem tamanho **parecido com o comprimento de onda**.

- Ouvimos alguém **atrás de um muro** (o som tem λ de centímetros a metros), mas não o vemos (a luz tem λ muito pequeno).
- Ondas de **rádio AM** (λ grande) contornam montanhas melhor que as **FM**.

## Interferência

Quando duas ondas se encontram, elas se **somam**:

- **Construtiva:** crista com crista → onda **maior**.
- **Destrutiva:** crista com vale → as ondas se **anulam** (total ou parcialmente).
- Aplicação: **fones com cancelamento de ruído** produzem uma onda "invertida" que anula o barulho externo.
- As cores numa **bolha de sabão** ou numa mancha de óleo vêm da interferência da luz.

## Ressonância

Quando um corpo recebe estímulos na sua **frequência natural** de vibração, ele passa a vibrar com **amplitude muito grande**.

- Uma cantora que **quebra uma taça** com a voz.
- **Balanço**: empurrar no momento certo aumenta a altura.
- Soldados quebram o passo ao atravessar pontes para evitar ressonância.
- **Ponte de Tacoma** (EUA, 1940): o vento provocou oscilações enormes e a ponte desabou.
- **Sintonizar** um rádio é ajustar o circuito para ressoar na frequência da emissora.
- O **forno de micro-ondas** usa uma frequência que agita as moléculas de água.

## Efeito Doppler

Mudança da frequência percebida quando a fonte e o observador se **aproximam** (som mais **agudo**) ou se **afastam** (mais **grave**) — a sirene da ambulância.

## Resumindo

Reflexão: eco e sonar. Difração: a onda contorna obstáculos (ouvimos atrás do muro). Interferência: construtiva soma, destrutiva anula (fones com cancelamento). Ressonância: vibração na frequência natural gera grande amplitude (taça que quebra).`,
    [
      "Eco é reflexão do som; sonar e ultrassom usam reflexão.",
      "Difração: ouvimos atrás do muro, mas não vemos.",
      "Interferência destrutiva: fones com cancelamento de ruído.",
      "Ressonância: frequência natural gera vibração enorme.",
    ],
    [
      ["Difração", "Capacidade da onda de contornar obstáculos e se espalhar após fendas."],
      ["Interferência", "Superposição de ondas que se somam ou se anulam."],
      ["Ressonância", "Vibração intensa quando o estímulo coincide com a frequência natural."],
    ],
    [
      ["Conseguimos ouvir uma pessoa atrás de um muro, mas não vê-la, por causa da:", ["reflexão da luz", "difração do som", "refração do som", "polarização", "ressonância"], 1, "λ do som é grande."],
      ["Fones de ouvido com cancelamento de ruído funcionam por:", ["reflexão", "interferência destrutiva", "difração", "refração", "ressonância"], 1, "Onda invertida anula o ruído."],
      ["Uma cantora quebra uma taça de cristal com a voz por causa da:", ["difração", "ressonância", "refração", "dispersão", "absorção"], 1, "Frequência natural."],
      ["O som de uma ambulância parece mais agudo quando ela se aproxima por causa do:", ["eco", "efeito Doppler", "efeito estufa", "efeito Joule", "efeito fotoelétrico"], 1, "Frequência percebida maior."],
      ["Quando uma onda muda de meio, permanece constante:", ["a velocidade", "o comprimento de onda", "a frequência", "a amplitude sempre", "a direção sempre"], 2, "Depende da fonte."],
    ],
    [["Explique o fenômeno da ressonância com um exemplo do cotidiano.", "Ressonância ocorre quando um corpo é estimulado na sua frequência natural e passa a vibrar com grande amplitude; por exemplo, ao empurrar um balanço sempre no momento certo, ele sobe cada vez mais."]],
  ),
  aula(
    "Primeira lei da termodinâmica: calor, trabalho e energia interna",
    `## Energia interna

**Energia interna (U)** é a energia associada à **agitação** das partículas de um corpo. Num gás ideal, depende da **temperatura**: aquecer → mais agitação → mais energia interna.

## A Primeira Lei

É o **princípio da conservação da energia** aplicado ao calor:

**Q = τ + ΔU**

- **Q:** calor trocado (positivo se o sistema **recebe** calor).
- **τ (trabalho):** energia trocada por meio de força e deslocamento (positivo se o gás se **expande** e realiza trabalho).
- **ΔU:** variação da energia interna.

Ou seja: o calor recebido serve para **realizar trabalho** e/ou **aumentar a energia interna**.

## Exemplo

Um gás recebe 500 J de calor e realiza 200 J de trabalho ao se expandir. ΔU = 500 − 200 = **300 J** (o gás esquenta).

## Transformações gasosas

- **Isotérmica** (temperatura constante): ΔU = 0 → **Q = τ**.
- **Isobárica** (pressão constante): o gás expande ao ser aquecido (balão ao sol).
- **Isovolumétrica (isocórica)** (volume constante): τ = 0 → **Q = ΔU** (panela de pressão fechada).
- **Adiabática** (sem troca de calor, Q = 0): ΔU = −τ.
  - **Expansão adiabática:** o gás **esfria** (o spray/desodorante sai gelado; o ar que sobe na atmosfera se expande e esfria, formando nuvens).
  - **Compressão adiabática:** o gás **esquenta** (a bomba de encher pneu fica quente).

## Segunda Lei da Termodinâmica

- O calor flui **espontaneamente** do corpo **quente** para o **frio**, nunca o contrário.
- Para levar calor do frio para o quente, é preciso **gastar energia** (geladeira e ar-condicionado usam um compressor).
- **Nenhuma máquina térmica** transforma **todo** o calor em trabalho: sempre há perdas. Rendimento: η = τ / Q (sempre menor que 100%).
- **Entropia:** medida da **desordem**; em processos naturais, a entropia do universo tende a **aumentar**.

## Geladeira

Retira calor do interior (frio) e o joga para fora (pela grade traseira), usando trabalho do compressor. Por isso a parte de trás esquenta e **não se deve** encostar a geladeira na parede nem usá-la para secar roupas.

## Resumindo

1ª Lei: Q = τ + ΔU (conservação da energia). Isotérmica: Q = τ; isocórica: Q = ΔU; adiabática: Q = 0 (expansão esfria, compressão esquenta). 2ª Lei: o calor vai do quente para o frio e nenhuma máquina tem 100% de rendimento.`,
    [
      "1ª Lei: Q = τ + ΔU (conservação da energia).",
      "Expansão adiabática esfria (spray gelado); compressão esquenta.",
      "2ª Lei: calor flui do quente para o frio espontaneamente.",
      "Nenhuma máquina térmica tem 100% de rendimento.",
    ],
    [
      ["Energia interna", "Energia associada à agitação das partículas de um corpo."],
      ["Transformação adiabática", "Transformação sem troca de calor com o ambiente."],
      ["Entropia", "Medida da desordem de um sistema."],
    ],
    [
      ["Um gás recebe 800 J de calor e realiza 300 J de trabalho. Sua energia interna varia:", ["1.100 J", "500 J", "300 J", "800 J", "−500 J"], 1, "800 − 300."],
      ["O desodorante spray sai gelado porque o gás sofre:", ["compressão adiabática", "expansão adiabática", "fusão", "transformação isocórica com aquecimento", "condensação"], 1, "Expansão esfria."],
      ["Numa transformação isotérmica de um gás ideal:", ["τ = 0", "ΔU = 0, então Q = τ", "Q = 0", "a pressão é constante", "a temperatura aumenta"], 1, "Temperatura constante."],
      ["A Segunda Lei da Termodinâmica afirma que:", ["o calor flui do frio para o quente sozinho", "nenhuma máquina térmica converte todo o calor em trabalho", "a energia pode ser criada", "a entropia sempre diminui", "o rendimento pode ser 100%"], 1, "Sempre há perdas."],
      ["A geladeira consegue retirar calor do interior frio porque:", ["o calor flui naturalmente do frio para o quente", "usa o trabalho do compressor", "o gelo produz frio", "a porta isola tudo", "não troca calor"], 1, "Exige energia."],
    ],
    [["Explique, com a Primeira Lei da Termodinâmica, por que a bomba de encher pneu esquenta.", "Ao comprimir o ar rapidamente, quase não há troca de calor (processo adiabático); o trabalho realizado sobre o gás aumenta sua energia interna, elevando a temperatura do ar e da bomba."]],
  ),
  aula(
    "Motores elétricos, ímãs e o campo magnético da Terra",
    `## Ímãs e campo magnético

- Todo ímã tem dois **polos**: **norte** e **sul**. Polos **iguais se repelem**; **opostos se atraem**.
- Não existe polo isolado: ao quebrar um ímã, cada pedaço tem norte e sul.
- O **campo magnético** é a região de influência do ímã, representada por **linhas** que saem do polo norte e entram no polo sul.
- Materiais **ferromagnéticos** (ferro, níquel, cobalto) são fortemente atraídos.

## A Terra é um grande ímã

- O movimento do **ferro líquido** no núcleo externo gera o campo magnético terrestre.
- A **bússola** aponta para o **norte geográfico**, que corresponde aproximadamente ao **polo sul magnético** da Terra (por isso o norte da agulha é atraído para lá).
- O campo magnético nos **protege** do **vento solar** (partículas do Sol); nos polos, essas partículas formam as **auroras boreais e austrais**.
- Animais como aves migratórias e tartarugas usam o campo para se **orientar**.

## Eletricidade e magnetismo estão ligados

- **Oersted (1820):** uma **corrente elétrica** cria um **campo magnético** (a agulha de uma bússola se move perto de um fio com corrente).
- **Eletroímã:** fio enrolado (bobina) em torno de um núcleo de ferro; com corrente, vira um ímã que pode ser **ligado e desligado**. Usado em guindastes de ferro-velho, campainhas, fechaduras, alto-falantes, ressonância magnética.
- **Faraday:** um campo magnético **variável** gera corrente (indução) → **geradores**.

## Motor elétrico

Transforma **energia elétrica** em **energia mecânica** (movimento):

- Uma **bobina** com corrente fica dentro de um campo magnético (de ímãs).
- A corrente na bobina sofre **forças magnéticas** que a fazem **girar**.
- Usado em ventiladores, liquidificadores, máquinas de lavar, carros elétricos, elevadores.

**Gerador x motor:** o gerador transforma movimento em eletricidade (indução); o motor faz o inverso. São basicamente o **mesmo dispositivo** funcionando em sentidos opostos (carros elétricos recuperam energia na frenagem usando o motor como gerador).

## Outras aplicações

- **Cartões magnéticos**, HDs antigos, **trens de levitação magnética (maglev)**.
- **Ressonância magnética** na medicina.
- Cuidado: ímãs fortes podem danificar aparelhos eletrônicos e marca-passos.

## Resumindo

Polos iguais se repelem e opostos se atraem. A Terra tem campo magnético que orienta a bússola e nos protege do vento solar (auroras). Corrente gera campo (Oersted, eletroímã). O motor elétrico transforma eletricidade em movimento; o gerador, o contrário.`,
    [
      "Polos iguais se repelem; opostos se atraem; não há polo isolado.",
      "A Terra é um ímã: bússola e proteção contra o vento solar.",
      "Corrente elétrica gera campo magnético (Oersted, eletroímã).",
      "Motor: eletricidade → movimento; gerador: movimento → eletricidade.",
    ],
    [
      ["Campo magnético", "Região de influência de um ímã ou de uma corrente elétrica."],
      ["Eletroímã", "Bobina com núcleo de ferro que vira ímã quando passa corrente."],
      ["Aurora polar", "Luzes no céu dos polos causadas por partículas do vento solar."],
    ],
    [
      ["Ao quebrar um ímã ao meio, obtêm-se:", ["um polo norte e um polo sul separados", "dois ímãs, cada um com norte e sul", "dois pedaços sem magnetismo", "só polos norte", "um ímã e um pedaço de ferro"], 1, "Não há monopolo."],
      ["A bússola funciona porque:", ["a Terra tem campo magnético", "o Sol atrai a agulha", "a gravidade orienta a agulha", "o ar é magnético", "a Lua puxa o ferro"], 0, "Campo terrestre."],
      ["O experimento de Oersted mostrou que:", ["ímãs geram calor", "a corrente elétrica cria campo magnético", "a luz é uma onda", "o calor gera eletricidade", "o som é eletromagnético"], 1, "Agulha desviada."],
      ["O motor elétrico transforma:", ["energia mecânica em elétrica", "energia elétrica em mecânica", "calor em luz", "energia química em nuclear", "som em eletricidade"], 1, "Ventilador, liquidificador."],
      ["As auroras polares são causadas:", ["pela reflexão da neve", "por partículas do vento solar desviadas pelo campo magnético", "por vulcões", "pela Lua cheia", "por relâmpagos"], 1, "Interação com a atmosfera."],
    ],
    [["Qual a diferença entre um gerador e um motor elétrico?", "O motor recebe energia elétrica e a transforma em movimento, usando a força magnética sobre uma bobina com corrente; o gerador faz o contrário, transformando movimento em energia elétrica por indução eletromagnética."]],
  ),
  aula(
    "Efeito fotoelétrico e energia solar",
    `## Um fenômeno que mudou a física

O **efeito fotoelétrico** é a emissão de **elétrons** por uma superfície metálica quando ela é iluminada por **luz** de frequência adequada.

## O que intrigava os cientistas

- Pela física clássica, uma luz **mais intensa** (mais forte) deveria sempre arrancar elétrons.
- Mas os experimentos mostraram que:
  - Luz de **baixa frequência** (vermelha, por exemplo) **não arranca** elétrons, mesmo muito intensa.
  - Luz de **alta frequência** (ultravioleta) arranca elétrons, mesmo fraca.
  - A **intensidade** só altera a **quantidade** de elétrons emitidos, não a energia de cada um.

## A explicação de Einstein (1905)

- A luz é formada por "**pacotes**" de energia chamados **fótons**.
- A energia de cada fóton depende da **frequência**: **E = h · f** (h é a constante de Planck).
- Um elétron só é arrancado se **um fóton** tiver energia **suficiente** (maior que a energia mínima do metal, a função trabalho).
- Isso mostrou a **natureza corpuscular** da luz: ela se comporta como **onda** e também como **partícula** (**dualidade onda-partícula**).
- Einstein ganhou o **Nobel de 1921** por isso (e não pela relatividade).

## Aplicações

- **Células fotovoltaicas (painéis solares):** a luz libera elétrons em materiais semicondutores (como o **silício**), gerando **corrente elétrica** diretamente, sem turbinas.
- **Sensores de luz:** portas automáticas, iluminação pública que acende ao anoitecer, controles e câmeras digitais (sensores CCD/CMOS).
- **Fotômetros** e alarmes.

## Energia solar no Brasil

- O Brasil tem **alta incidência solar** o ano todo, especialmente no **Nordeste**.
- Crescimento rápido da **geração distribuída**: painéis em telhados de casas e empresas, que podem **injetar** o excedente na rede (créditos na conta de luz).
- Vantagens: **renovável**, não emite gases na geração, silenciosa, de manutenção simples.
- Desvantagens: só gera durante o **dia** (depende de baterias ou da rede à noite), produção cai com nuvens, custo inicial, descarte de painéis.

## Energia solar térmica (diferente!)

**Aquecedores solares** de água usam o calor do Sol (placas escuras e tubos), sem gerar eletricidade.

## Resumindo

No efeito fotoelétrico, a luz arranca elétrons de metais apenas se a frequência for suficiente. Einstein explicou com os fótons (E = h·f) e a dualidade onda-partícula. Painéis fotovoltaicos usam esse efeito para gerar eletricidade.`,
    [
      "Efeito fotoelétrico: luz arranca elétrons de metais.",
      "Depende da frequência, não da intensidade (E = h·f).",
      "Einstein: luz feita de fótons; Nobel de 1921.",
      "Painéis fotovoltaicos geram eletricidade sem turbinas.",
    ],
    [
      ["Fóton", "Pacote (quantum) de energia luminosa."],
      ["Dualidade onda-partícula", "Comportamento da luz ora como onda, ora como partícula."],
      ["Célula fotovoltaica", "Dispositivo que transforma luz diretamente em eletricidade."],
    ],
    [
      ["No efeito fotoelétrico, a emissão de elétrons depende principalmente:", ["da intensidade da luz", "da frequência da luz", "da cor do metal apenas", "da temperatura do ar", "do tamanho da placa"], 1, "E = h·f."],
      ["Einstein recebeu o Nobel de 1921 por explicar:", ["a relatividade geral", "o efeito fotoelétrico", "a gravitação", "a radioatividade", "o átomo de Bohr"], 1, "Fótons."],
      ["Os painéis solares fotovoltaicos geram eletricidade:", ["com turbinas a vapor", "diretamente a partir da luz, liberando elétrons", "queimando silício", "pelo vento", "por fissão nuclear"], 1, "Efeito fotovoltaico."],
      ["Uma desvantagem da energia solar fotovoltaica é:", ["emitir muito CO₂", "não gerar energia à noite", "ser barulhenta", "exigir combustível", "produzir lixo radioativo"], 1, "Depende do Sol."],
      ["O aquecedor solar de água se diferencia do painel fotovoltaico porque:", ["gera eletricidade", "usa o calor do Sol para aquecer a água, sem gerar eletricidade", "funciona com vento", "usa gás natural", "não precisa de Sol"], 1, "Solar térmica."],
    ],
    [["Por que uma luz vermelha muito forte pode não arrancar elétrons de um metal, enquanto uma luz ultravioleta fraca consegue?", "Porque a energia de cada fóton depende da frequência (E = h·f); a luz vermelha tem baixa frequência e seus fótons não têm energia suficiente, enquanto os do ultravioleta, de alta frequência, têm energia para arrancar elétrons, mesmo em pouca quantidade."]],
  ),
  aula(
    "O olho humano e os defeitos da visão",
    `## Como enxergamos

O olho funciona como uma **câmera**:

- **Córnea** e **cristalino** funcionam como **lentes convergentes**, que desviam a luz.
- A **íris** (parte colorida) controla a abertura da **pupila**, regulando a quantidade de luz (como o diafragma da câmera).
- A imagem se forma na **retina**, no fundo do olho, **invertida** e **menor**. As células da retina (**cones**, para cores, e **bastonetes**, para pouca luz) enviam sinais pelo **nervo óptico** ao **cérebro**, que "desvira" a imagem.

## Acomodação visual

Para focar objetos a distâncias diferentes, os músculos ciliares mudam a **curvatura do cristalino**:

- Objeto **perto:** cristalino mais **curvo** (mais convergente).
- Objeto **longe:** cristalino mais **achatado**.

## Defeitos da visão e correções

### Miopia

- Dificuldade para ver **de longe**.
- O olho é **alongado** (ou muito convergente): a imagem se forma **antes** da retina.
- Correção: lente **divergente** (côncava, bordas grossas).

### Hipermetropia

- Dificuldade para ver **de perto**.
- O olho é **curto**: a imagem se formaria **depois** da retina.
- Correção: lente **convergente** (convexa, centro grosso).

### Astigmatismo

- Visão **distorcida** ou embaçada, por irregularidade na curvatura da **córnea**.
- Correção: lentes **cilíndricas**.

### Presbiopia ("vista cansada")

- Com a **idade** (por volta dos 40 anos), o cristalino perde elasticidade e fica difícil ver **de perto**.
- Correção: lente **convergente** (óculos de leitura) ou multifocais.

### Catarata

- O cristalino fica **opaco** (esbranquiçado). Tratada com **cirurgia** que substitui o cristalino por uma lente artificial.

## Grau dos óculos

- **Vergência (dioptria, "grau"):** V = 1/f (f em metros).
- Grau **negativo** → lente divergente (miopia). Grau **positivo** → convergente (hipermetropia, presbiopia).

## Daltonismo

Não é um problema óptico, mas **genético**, ligado aos cones da retina (dificuldade de distinguir cores, como vermelho e verde).

## Resumindo

O olho forma imagens invertidas na retina por meio da córnea e do cristalino. Miopia: imagem antes da retina, lente divergente. Hipermetropia e presbiopia: lente convergente. Astigmatismo: lente cilíndrica. Grau negativo = divergente.`,
    [
      "Córnea e cristalino focam a imagem na retina (invertida).",
      "Miopia: vê mal de longe; lente divergente.",
      "Hipermetropia e presbiopia: veem mal de perto; lente convergente.",
      "Astigmatismo: lente cilíndrica; grau negativo = divergente.",
    ],
    [
      ["Retina", "Camada do fundo do olho onde a imagem se forma."],
      ["Cristalino", "Lente natural do olho, que muda de curvatura para focar."],
      ["Dioptria", "Unidade de vergência das lentes, o \"grau\" dos óculos."],
    ],
    [
      ["Na miopia, a imagem de objetos distantes se forma:", ["sobre a retina", "antes da retina", "depois da retina", "no nervo óptico", "na íris"], 1, "Olho alongado."],
      ["Para corrigir a miopia, usa-se lente:", ["convergente", "divergente", "cilíndrica apenas", "plana", "bifocal sempre"], 1, "Côncava."],
      ["A presbiopia (vista cansada) ocorre porque:", ["a córnea fica irregular", "o cristalino perde elasticidade com a idade", "o olho é muito longo", "a retina se descola", "falta vitamina C"], 1, "Envelhecimento."],
      ["Óculos com grau +2,5 têm lentes:", ["divergentes", "convergentes", "cilíndricas", "planas", "negativas"], 1, "Grau positivo."],
      ["A catarata é tratada com:", ["óculos escuros", "cirurgia que troca o cristalino opaco por lente artificial", "colírio de vitamina", "lente divergente", "exercícios"], 1, "Cristalino opaco."],
    ],
    [["Explique a diferença entre miopia e hipermetropia e como cada uma é corrigida.", "Na miopia, o olho é alongado e a imagem se forma antes da retina, dificultando ver de longe; corrige-se com lente divergente. Na hipermetropia, o olho é curto e a imagem se formaria depois da retina, dificultando ver de perto; corrige-se com lente convergente."]],
  ),
  aula(
    "Física e segurança no trânsito",
    `## Inércia: o motivo do cinto

Pela **1ª Lei de Newton (inércia)**, um corpo em movimento tende a **continuar em movimento**. Numa freada brusca ou batida, o carro para, mas o corpo do passageiro **continua indo para a frente** — e pode bater no painel ou ser lançado para fora.

- O **cinto de segurança** aplica a força necessária para frear o corpo junto com o carro.
- O **encosto de cabeça** protege o pescoço em batidas traseiras (quando o carro é empurrado para a frente e a cabeça "fica para trás").
- **Cadeirinhas** para crianças são obrigatórias: elas não seguram o próprio peso numa batida.

## Impulso e o airbag

**Impulso = força × tempo = variação da quantidade de movimento (m · Δv)**

Numa batida, a variação da quantidade de movimento é a mesma; mas se o **tempo** de parada **aumenta**, a **força** sobre o corpo **diminui**.

- **Airbag:** se enche em milissegundos e **aumenta o tempo** de desaceleração da cabeça, reduzindo a força do impacto.
- **Zonas de deformação programada** (para-choques e lataria que amassam): absorvem energia e aumentam o tempo da colisão.
- Pelo mesmo motivo, dobramos os joelhos ao saltar.

## Energia cinética e velocidade

**Ec = m · v² / 2**: a energia depende do **quadrado** da velocidade.

- Dobrar a velocidade (de 40 para 80 km/h) **quadruplica** a energia do impacto.
- Por isso pequenos aumentos de velocidade aumentam muito o risco de **morte**, inclusive para pedestres.

## Distância de parada

**Distância de parada = distância de reação + distância de frenagem**

- **Tempo de reação:** cerca de **1 segundo** (maior com celular, sono ou álcool). Nesse tempo, o carro anda **sem frear**: a 72 km/h (20 m/s), percorre **20 m**.
- **Distância de frenagem:** proporcional ao **quadrado** da velocidade; aumenta com pista **molhada** (menos atrito) e pneus gastos.
- Por isso é preciso manter **distância segura** do veículo da frente.

## Atrito e freios ABS

- O freio funciona pelo **atrito**. Se as rodas **travam**, o atrito passa a ser **cinético** (menor que o estático) e o carro desliza, perdendo o controle.
- O **ABS** evita o travamento, mantendo o atrito estático e a dirigibilidade.

## Celular e álcool

Olhar o celular por 2 segundos a 60 km/h significa percorrer cerca de **33 m** "às cegas". O álcool aumenta o tempo de reação (por isso a **Lei Seca**).

## Resumindo

O cinto age contra a inércia. O airbag aumenta o tempo do impacto e reduz a força (impulso). Energia do impacto cresce com o quadrado da velocidade. Distância de parada = reação + frenagem; celular e álcool aumentam a reação. O ABS evita o travamento das rodas.`,
    [
      "Inércia: o corpo continua indo para a frente; o cinto segura.",
      "Airbag aumenta o tempo do impacto e reduz a força.",
      "Dobrar a velocidade quadruplica a energia do impacto.",
      "Distância de parada = reação + frenagem.",
    ],
    [
      ["Inércia", "Tendência de um corpo manter seu estado de movimento ou repouso."],
      ["Impulso", "Produto da força pelo tempo de atuação, igual à variação da quantidade de movimento."],
      ["Tempo de reação", "Intervalo entre perceber o perigo e começar a frear."],
    ],
    [
      ["O cinto de segurança é necessário por causa:", ["da gravidade", "da inércia", "do atrito do ar", "da força centrípeta apenas", "do magnetismo"], 1, "1ª Lei de Newton."],
      ["O airbag reduz os danos porque:", ["aumenta a velocidade", "aumenta o tempo de desaceleração e reduz a força", "elimina a inércia", "diminui a massa", "aumenta o atrito com a pista"], 1, "Impulso."],
      ["Se a velocidade dobra, a energia cinética do carro:", ["dobra", "triplica", "quadruplica", "fica igual", "cai pela metade"], 2, "Dica: v²."],
      ["A 20 m/s, com tempo de reação de 1,5 s, o carro percorre antes de começar a frear:", ["20 m", "30 m", "15 m", "40 m", "10 m"], 1, "20 × 1,5."],
      ["O freio ABS melhora a segurança porque:", ["trava as rodas mais rápido", "evita o travamento das rodas e mantém o controle", "aumenta a velocidade", "elimina o atrito", "aumenta o tempo de reação"], 1, "Atrito estático."],
    ],
    [["Explique, usando o conceito de impulso, como o airbag protege os passageiros.", "Numa batida, a variação da quantidade de movimento do corpo é a mesma; o airbag aumenta o tempo que a cabeça leva para parar e, como o impulso é força vezes tempo, a força sobre o corpo fica menor, reduzindo as lesões."]],
  ),
  aula(
    "Hidrodinâmica: vazão e princípio de Bernoulli",
    `## Fluidos em movimento

A **hidrodinâmica** estuda líquidos e gases **em movimento**: água nos canos, sangue nas artérias, ar em volta das asas.

## Vazão

**Vazão (Q)** é o volume de fluido que passa por uma seção por unidade de tempo:

**Q = V / t** (m³/s, L/s, L/min)

Também: **Q = A · v** (área da seção × velocidade do fluido).

**Exemplo:** uma torneira enche um balde de 12 L em 2 minutos → Q = **6 L/min**. Para encher uma caixa d'água de 1.000 L: 1.000 ÷ 6 ≈ **167 min**.

## Equação da continuidade

Num cano, a vazão se **mantém**: **A₁ · v₁ = A₂ · v₂**.

- Onde o cano fica **mais estreito**, a água anda **mais rápido**.
- Por isso, ao **apertar a ponta da mangueira**, o jato sai mais rápido e vai mais longe.
- Nas artérias com placas de gordura (estreitadas), o sangue acelera.
- Rios ficam mais rápidos nos trechos estreitos.

## Princípio de Bernoulli

Em um fluido em movimento, **onde a velocidade é maior, a pressão é menor**.

## Aplicações de Bernoulli

- **Asa do avião:** seu formato faz o ar passar **mais rápido por cima** do que por baixo; a pressão em cima fica **menor**, gerando uma força para cima: a **sustentação**.
- **Telhados arrancados por ventanias:** o vento forte acima do telhado reduz a pressão externa; a pressão maior dentro da casa "empurra" o telhado para cima.
- **Caminhão passando perto:** o ar acelerado entre o caminhão e o carro reduz a pressão, e o carro é "puxado" para o lado.
- **Chuveiro com cortina:** o jato de água acelera o ar, e a cortina se aproxima do corpo.
- **Bola com efeito** (folha seca, curva): a rotação muda a velocidade do ar em cada lado (efeito Magnus).
- **Borrifadores e perfumes**, **chaminés** (o vento acima "puxa" a fumaça).

## Hidrostática x hidrodinâmica

- **Hidrostática:** fluidos **parados** (pressão aumenta com a profundidade, empuxo, Pascal).
- **Hidrodinâmica:** fluidos **em movimento** (vazão, continuidade, Bernoulli).

## Resumindo

Vazão = volume ÷ tempo = área × velocidade. Continuidade: cano mais estreito, fluido mais rápido (A₁v₁ = A₂v₂). Bernoulli: maior velocidade, menor pressão — explica a sustentação do avião e telhados arrancados pelo vento.`,
    [
      "Vazão: Q = V/t = A · v.",
      "Continuidade: cano estreito, fluido mais rápido.",
      "Bernoulli: maior velocidade, menor pressão.",
      "Sustentação do avião: ar mais rápido em cima da asa.",
    ],
    [
      ["Vazão", "Volume de fluido que passa por uma seção por unidade de tempo."],
      ["Equação da continuidade", "A vazão é constante: A₁v₁ = A₂v₂."],
      ["Sustentação", "Força para cima nas asas do avião, explicada por Bernoulli."],
    ],
    [
      ["Uma torneira enche 20 L em 4 minutos. A vazão é:", ["80 L/min", "5 L/min", "4 L/min", "24 L/min", "16 L/min"], 1, "20 ÷ 4."],
      ["Ao apertar a ponta da mangueira, a água sai mais rápido por causa:", ["do aumento da vazão", "da equação da continuidade (área menor, velocidade maior)", "da diminuição da pressão da caixa", "do efeito Doppler", "da gravidade"], 1, "A₁v₁ = A₂v₂."],
      ["Pelo princípio de Bernoulli, onde a velocidade do fluido é maior:", ["a pressão é maior", "a pressão é menor", "a pressão não muda", "a temperatura dobra", "a vazão some"], 1, "Relação inversa."],
      ["Telhados são arrancados em ventanias porque:", ["o vento empurra o telhado para baixo", "o vento rápido reduz a pressão acima do telhado", "a chuva pesa demais", "a casa esquenta", "o telhado dilata"], 1, "Bernoulli."],
      ["Num cano, se a área da seção cai à metade, a velocidade da água:", ["cai à metade", "dobra", "fica igual", "quadruplica", "zera"], 1, "Vazão constante."],
    ],
    [["Explique, com o princípio de Bernoulli, como surge a força de sustentação nas asas de um avião.", "O formato da asa faz o ar passar mais rápido por cima do que por baixo; onde a velocidade é maior a pressão é menor, então a pressão embaixo da asa fica maior que em cima, gerando uma força resultante para cima."]],
  ),
  aula(
    "Física do clima: efeito estufa, albedo e balanço de energia",
    `## A Terra e o Sol

A Terra recebe energia do **Sol** principalmente na forma de **luz visível** e **ultravioleta**. Parte é **refletida** de volta ao espaço; parte é **absorvida** pela superfície, que esquenta e **emite radiação infravermelha** (calor).

## Albedo

- **Albedo** é a fração da luz que uma superfície **reflete**.
- Superfícies **claras** (neve, gelo, nuvens, desertos claros) têm **albedo alto**: refletem muito e esquentam pouco.
- Superfícies **escuras** (oceano, florestas, asfalto) têm **albedo baixo**: absorvem mais e esquentam mais.
- **Retroalimentação do gelo:** com o aquecimento, o gelo dos polos derrete, expondo o mar escuro, que absorve mais calor, acelerando o derretimento (um ciclo que se reforça).

## Efeito estufa (visão física)

- A atmosfera é **transparente** à luz visível, mas gases como **CO₂**, **metano (CH₄)**, **vapor de água** e **óxido nitroso** **absorvem** a radiação **infravermelha** emitida pela superfície e a **reemitem** em todas as direções, inclusive de volta ao solo.
- Isso mantém a temperatura média da Terra em cerca de **15 °C**; sem o efeito estufa natural, seria cerca de **−18 °C**.
- O aumento da concentração desses gases pelas atividades humanas (queima de combustíveis fósseis, desmatamento, pecuária) **intensifica** o efeito e provoca o **aquecimento global**.

## Balanço de energia

- Em equilíbrio, a energia que **entra** é igual à que **sai**.
- Com mais gases-estufa, sai **menos** energia do que entra: o sistema **acumula** energia e a temperatura sobe até um novo equilíbrio.
- Grande parte do calor extra é absorvida pelos **oceanos** (que se aquecem e se expandem: **dilatação térmica** que eleva o nível do mar).

## A estufa de plantas e o carro fechado

O vidro deixa entrar a luz visível, mas dificulta a saída do infravermelho e impede a convecção do ar quente. Por isso um carro fechado ao sol fica muito quente — **nunca** deixe crianças ou animais dentro.

## Não confundir

- **Efeito estufa:** retenção de calor (aquecimento global).
- **Camada de ozônio:** filtra o **ultravioleta**; foi danificada pelos **CFCs** (Protocolo de Montreal, 1987, em recuperação).

## Resumindo

A Terra absorve luz e emite infravermelho. Albedo alto (gelo, nuvens) reflete; baixo (mar, asfalto) absorve. Gases-estufa retêm o infravermelho; sem eles, a Terra teria −18 °C. O excesso desequilibra o balanço de energia e aquece o planeta.`,
    [
      "Albedo: superfícies claras refletem; escuras absorvem.",
      "Gases-estufa absorvem e reemitem o infravermelho.",
      "Sem efeito estufa natural, a Terra teria cerca de −18 °C.",
      "Derretimento do gelo reduz o albedo e acelera o aquecimento.",
    ],
    [
      ["Albedo", "Fração da luz solar refletida por uma superfície."],
      ["Radiação infravermelha", "Radiação térmica emitida pelos corpos aquecidos."],
      ["Retroalimentação", "Processo que reforça a si mesmo, como o derretimento do gelo que aquece mais."],
    ],
    [
      ["A superfície com maior albedo é:", ["oceano", "floresta", "neve", "asfalto", "solo escuro"], 2, "Reflete muito."],
      ["Os gases de efeito estufa retêm calor porque:", ["refletem a luz visível", "absorvem e reemitem a radiação infravermelha", "bloqueiam o ultravioleta", "produzem calor por combustão", "são opacos à luz visível"], 1, "Infravermelho."],
      ["Sem o efeito estufa natural, a temperatura média da Terra seria de cerca de:", ["15 °C", "−18 °C", "30 °C", "0 °C", "100 °C"], 1, "Planeta congelado."],
      ["O derretimento do gelo polar acelera o aquecimento porque:", ["aumenta o albedo", "expõe o mar escuro, que absorve mais calor", "esfria os oceanos", "aumenta o ozônio", "reduz o CO₂"], 1, "Retroalimentação."],
      ["O buraco na camada de ozônio é causado por:", ["CO₂", "CFCs", "vapor de água", "metano", "oxigênio"], 1, "Protocolo de Montreal."],
    ],
    [["Explique por que um carro fechado ao sol fica muito quente, relacionando com o efeito estufa.", "A luz visível atravessa os vidros e aquece o interior, que emite radiação infravermelha; o vidro dificulta a saída dessa radiação e o ar quente não circula, então a energia se acumula e a temperatura sobe muito, como numa estufa."]],
  ),
];
