import { aula } from "./build";

/** Química, lote 1: misturas, reações, energia, velocidade, equilíbrio e orgânica. */
export const QUIMICA_1 = [
  aula(
    "Separação de misturas",
    `## Substâncias e misturas

Uma **substância pura** tem composição fixa (água destilada, ouro). Uma **mistura** junta duas ou mais substâncias.

- **Homogênea:** uma só fase, aspecto uniforme (água com sal dissolvido, ar, álcool 70%).
- **Heterogênea:** duas ou mais fases visíveis (água e óleo, areia e água).

## Misturas heterogêneas

- **Filtração:** separa sólido de líquido (coar o café, filtros de água).
- **Decantação:** espera o sólido assentar ou separa líquidos que não se misturam com o **funil de decantação** (água e óleo).
- **Centrifugação:** acelera a decantação girando (separar componentes do sangue, secar roupa na máquina).
- **Separação magnética:** ímã separa ferro de outros materiais (reciclagem).
- **Catação** e **peneiração**: escolher feijão, peneirar areia.
- **Levigação:** água corrente arrasta o material mais leve (garimpo de ouro).

## Misturas homogêneas

- **Evaporação:** a água evapora e o sólido fica (salinas produzindo sal marinho).
- **Destilação simples:** separa sólido dissolvido de líquido, evaporando e condensando o líquido (dessalinização da água do mar).
- **Destilação fracionada:** separa líquidos com pontos de ebulição diferentes (refino do **petróleo**, produção de bebidas destiladas, separação dos gases do ar).

## Tratamento de água

Nas estações de tratamento: **floculação** (adição de sulfato de alumínio para juntar as sujeiras), **decantação**, **filtração** (areia e cascalho), **cloração** (mata micro-organismos) e **fluoretação** (previne cáries).

## Resumindo

Heterogêneas: filtração, decantação, centrifugação, ímã. Homogêneas: evaporação e destilação (simples para sólido + líquido; fracionada para líquidos). O tratamento de água combina vários métodos.`,
    [
      "Mistura homogênea tem uma fase; heterogênea tem duas ou mais.",
      "Filtração e decantação separam misturas heterogêneas.",
      "Destilação fracionada separa líquidos com pontos de ebulição diferentes (petróleo).",
      "Tratamento de água: floculação, decantação, filtração, cloração e fluoretação.",
    ],
    [
      ["Fase", "Cada porção de aspecto uniforme de uma mistura."],
      ["Destilação", "Separação por evaporação e condensação de um líquido."],
      ["Floculação", "Agrupamento de impurezas em flocos que depois decantam."],
    ],
    [
      ["Para separar água e óleo, o mais indicado é:", ["filtração", "funil de decantação", "destilação simples", "evaporação", "imantação"], 1, "Os líquidos não se misturam e ficam em camadas."],
      ["O refino do petróleo usa principalmente:", ["filtração", "catação", "destilação fracionada", "centrifugação", "peneiração"], 2, "Os componentes têm pontos de ebulição diferentes."],
      ["As salinas obtêm sal do mar por:", ["evaporação", "filtração", "centrifugação", "decantação", "destilação fracionada"], 0, "O sol evapora a água e o sal fica."],
      ["Na estação de tratamento, a etapa que mata micro-organismos é a:", ["floculação", "decantação", "filtração", "cloração", "fluoretação"], 3, "O cloro desinfeta a água."],
      ["Água com sal totalmente dissolvido é uma mistura:", ["heterogênea", "homogênea", "substância pura", "com duas fases", "coloidal sempre"], 1, "Tem uma única fase."],
    ],
    [["Explique as etapas do tratamento da água que chega às casas.", "A água recebe um produto que junta as impurezas em flocos (floculação), os flocos se depositam (decantação), a água passa por filtros de areia e cascalho (filtração), recebe cloro para matar micro-organismos e flúor para prevenir cáries."]],
  ),
  aula(
    "Reações químicas e balanceamento",
    `## O que é uma reação química

Numa **reação química**, substâncias (**reagentes**) se transformam em outras (**produtos**), com novas propriedades. Sinais: mudança de cor, liberação de gás, formação de sólido (precipitado), liberação ou absorção de calor e luz.

Exemplos: a queima de combustível, a ferrugem, o cozimento de um ovo, a digestão.

## Lei de Lavoisier

"Na natureza nada se cria, nada se perde, tudo se transforma." Num sistema fechado, a **massa dos reagentes é igual à massa dos produtos**. Os átomos só se reorganizam.

## Balanceamento

A equação precisa ter o **mesmo número de cada átomo** dos dois lados. Ajustamos os **coeficientes** (números na frente das fórmulas), nunca os índices.

Ex.: combustão do metano:

CH₄ + O₂ → CO₂ + H₂O (não balanceada)

CH₄ + **2** O₂ → CO₂ + **2** H₂O

Confira: 1 C, 4 H e 4 O de cada lado.

## Tipos de reação

- **Síntese:** A + B → AB.
- **Decomposição (análise):** AB → A + B. Ex.: água oxigenada se decompondo em água e oxigênio.
- **Simples troca:** A + BC → AC + B. Ex.: ferro em solução de cobre.
- **Dupla troca:** AB + CD → AD + CB. Ex.: neutralização ácido + base.
- **Combustão:** combustível + O₂ → CO₂ + H₂O (completa). Com pouco oxigênio, forma **monóxido de carbono (CO)**, tóxico, ou fuligem.

## Por que balancear importa

As proporções da equação mostram quanto de cada substância reage e forma. É a base da **estequiometria**: calcular quanto CO₂ um carro emite ou quanto reagente uma indústria precisa.

## Resumindo

Reagentes viram produtos; a massa se conserva (Lavoisier). Balanceie ajustando coeficientes. Combustão incompleta forma CO, tóxico.`,
    [
      "Numa reação, reagentes se transformam em produtos com novas propriedades.",
      "Lei de Lavoisier: a massa total se conserva num sistema fechado.",
      "Balanceia-se ajustando coeficientes, nunca os índices.",
      "Combustão incompleta produz monóxido de carbono (CO), tóxico.",
    ],
    [
      ["Reagente", "Substância que se transforma durante a reação."],
      ["Coeficiente", "Número na frente da fórmula que indica a proporção na reação."],
      ["Combustão", "Reação de um combustível com oxigênio que libera energia."],
    ],
    [
      ["Qual destes é sinal de reação química?", ["gelo derretendo", "liberação de gás ao misturar vinagre e bicarbonato", "água fervendo", "açúcar dissolvendo", "vidro quebrando"], 1, "Forma-se uma nova substância (CO₂)."],
      ["Balanceando H₂ + O₂ → H₂O, os coeficientes são:", ["1, 1, 1", "2, 1, 2", "1, 2, 1", "2, 2, 2", "1, 1, 2"], 1, "2 H₂ + O₂ → 2 H₂O: 4 H e 2 O de cada lado."],
      ["Em um sistema fechado, 10 g de reagentes formam:", ["menos de 10 g de produtos", "10 g de produtos", "mais de 10 g", "depende da cor", "0 g"], 1, "Lei de Lavoisier: a massa se conserva."],
      ["A combustão incompleta de um combustível pode produzir:", ["apenas água", "monóxido de carbono", "oxigênio", "nitrogênio puro", "ozônio"], 1, "Com pouco O₂, forma-se CO, tóxico."],
      ["A reação A + BC → AC + B é de:", ["síntese", "decomposição", "simples troca", "dupla troca", "combustão"], 2, "Um elemento substitui outro no composto."],
    ],
    [["Explique a Lei de Lavoisier usando a queima de uma vela.", "Na queima, a vela parece desaparecer, mas a massa não some: a parafina reage com o oxigênio formando gás carbônico e vapor d'água que vão para o ar; num sistema fechado, a massa total antes e depois seria a mesma."]],
  ),
  aula(
    "Termoquímica: reações que liberam ou absorvem calor",
    `## Energia nas reações

Toda reação química envolve **energia**. A **entalpia (H)** é o conteúdo de energia das substâncias, e a **variação de entalpia (ΔH)** mostra se a reação libera ou absorve calor.

## Exotérmicas

**Liberam calor** para o ambiente. **ΔH < 0** (negativo).

- Combustão (gás de cozinha, gasolina, madeira).
- Respiração celular.
- Bolsas térmicas quentes.
- Formação de ligações químicas.

## Endotérmicas

**Absorvem calor** do ambiente. **ΔH > 0** (positivo).

- Fotossíntese (absorve energia da luz).
- Cozimento de alimentos.
- **Bolsas de gelo instantâneo**, que esfriam ao serem amassadas.
- Quebra de ligações químicas.

## Mudanças de estado

Também envolvem energia: fusão e evaporação **absorvem** calor (endotérmicas); condensação e solidificação **liberam** (exotérmicas).

## Poder calorífico dos combustíveis

Diferentes combustíveis liberam diferentes quantidades de energia por grama. O **hidrogênio** tem o maior poder calorífico e só produz água ao queimar; o **etanol** libera menos energia por litro que a gasolina, por isso o carro faz menos km por litro com etanol.

## Lei de Hess

O ΔH de uma reação depende só do estado inicial e final, não do caminho. Dá para somar reações conhecidas para achar o ΔH de outra.

## Resumindo

Exotérmica libera calor (ΔH negativo): combustão, respiração. Endotérmica absorve (ΔH positivo): fotossíntese, bolsa de gelo instantâneo. Combustíveis diferentes liberam energias diferentes.`,
    [
      "Exotérmica libera calor: ΔH < 0 (combustão, respiração).",
      "Endotérmica absorve calor: ΔH > 0 (fotossíntese, bolsa de gelo instantâneo).",
      "Quebrar ligações absorve energia; formar ligações libera.",
      "O etanol libera menos energia por litro que a gasolina.",
    ],
    [
      ["Entalpia", "Conteúdo de energia de uma substância."],
      ["Reação exotérmica", "Reação que libera calor para o ambiente."],
      ["Poder calorífico", "Energia liberada na queima de uma quantidade de combustível."],
    ],
    [
      ["A queima do gás de cozinha é uma reação:", ["endotérmica", "exotérmica", "sem energia", "nuclear", "de fusão"], 1, "Libera calor: exotérmica."],
      ["A fotossíntese é uma reação:", ["exotérmica", "endotérmica", "de combustão", "de neutralização", "de oxidação do ferro"], 1, "Absorve energia luminosa."],
      ["Uma reação com ΔH = −890 kJ:", ["absorve calor", "libera calor", "não troca calor", "é sempre lenta", "só acontece no gelo"], 1, "ΔH negativo indica liberação de calor."],
      ["Uma bolsa que esfria quando amassada usa uma reação:", ["exotérmica", "endotérmica", "de combustão", "nuclear", "explosiva"], 1, "Ela absorve calor do ambiente."],
      ["Um carro roda menos quilômetros por litro com etanol porque o etanol:", ["polui mais", "libera menos energia por litro que a gasolina", "não queima", "é mais denso", "é importado"], 1, "Tem menor poder calorífico por volume."],
    ],
    [["Explique a diferença entre reação exotérmica e endotérmica com um exemplo de cada.", "A exotérmica libera calor para o ambiente, como a queima do gás de cozinha; a endotérmica absorve calor do ambiente, como a fotossíntese ou a bolsa de gelo instantâneo."]],
  ),
  aula(
    "Cinética química: a velocidade das reações",
    `## Rápidas e lentas

Algumas reações são quase instantâneas (explosão de fogos), outras levam anos (formação da ferrugem). A **cinética química** estuda a **velocidade** das reações e o que a influencia.

## Teoria das colisões

Para reagir, as partículas precisam **colidir** com **energia suficiente** (a **energia de ativação**) e na posição certa. Tudo o que aumenta as colisões eficazes acelera a reação.

## Fatores que aumentam a velocidade

- **Temperatura:** partículas mais agitadas colidem mais e com mais energia. Por isso a **geladeira conserva** os alimentos (desacelera reações e micro-organismos) e a panela de pressão cozinha mais rápido.
- **Concentração:** mais partículas, mais colisões. Lenha queima mais em oxigênio puro.
- **Superfície de contato:** sólidos em pedaços menores reagem mais rápido. Um comprimido efervescente **triturado** dissolve mais rápido; a **serragem** queima mais rápido que o tronco; poeira de farinha pode explodir.
- **Catalisador:** substância que **acelera** a reação **sem ser consumida**, porque diminui a energia de ativação. Ex.: **enzimas** do corpo e o **catalisador** dos escapamentos de carros, que transforma gases tóxicos em menos tóxicos.

## Fatores que diminuem

- Baixa temperatura (geladeira, congelador).
- Conservantes e embalagens a vácuo (menos oxigênio).
- Inibidores.

## Resumindo

Reagir exige colisões com energia de ativação. Temperatura, concentração, superfície de contato e catalisadores aumentam a velocidade. Geladeira e conservantes a diminuem.`,
    [
      "Reações exigem colisões eficazes com energia de ativação.",
      "Mais temperatura, concentração e superfície de contato aceleram a reação.",
      "Catalisadores aceleram sem ser consumidos, diminuindo a energia de ativação.",
      "Geladeira desacelera reações e conserva alimentos.",
    ],
    [
      ["Energia de ativação", "Energia mínima para que uma reação comece."],
      ["Catalisador", "Substância que acelera uma reação sem ser consumida."],
      ["Superfície de contato", "Área exposta de um sólido que pode reagir."],
    ],
    [
      ["Um comprimido efervescente dissolve mais rápido quando:", ["inteiro em água fria", "triturado em água morna", "inteiro em água gelada", "em óleo", "guardado na geladeira"], 1, "Mais superfície de contato e mais temperatura aceleram a reação."],
      ["Guardar alimentos na geladeira os conserva porque:", ["mata todos os micro-organismos", "diminui a velocidade das reações", "aumenta a concentração de oxigênio", "funciona como catalisador", "aumenta a superfície de contato"], 1, "Temperatura baixa desacelera reações e micro-organismos."],
      ["As enzimas do corpo humano funcionam como:", ["reagentes consumidos", "catalisadores biológicos", "inibidores de todas as reações", "produtos finais", "combustíveis"], 1, "Elas aceleram reações sem ser consumidas."],
      ["Um catalisador acelera a reação porque:", ["aumenta a temperatura", "diminui a energia de ativação", "é consumido rapidamente", "aumenta a massa", "muda os produtos"], 1, "Oferece um caminho com menor energia de ativação."],
      ["Serragem queima mais rápido que um tronco por causa da:", ["menor temperatura", "maior superfície de contato", "menor concentração de oxigênio", "presença de catalisador", "cor da madeira"], 1, "Pedaços pequenos expõem mais área ao oxigênio."],
    ],
    [["Explique, usando a teoria das colisões, por que aumentar a temperatura acelera uma reação.", "Com temperatura maior, as partículas ficam mais agitadas, colidem com mais frequência e com mais energia, e assim mais colisões atingem a energia de ativação, aumentando a velocidade da reação."]],
  ),
  aula(
    "Equilíbrio químico e o princípio de Le Chatelier",
    `## Reações que vão e voltam

Muitas reações são **reversíveis**: ao mesmo tempo que os reagentes formam produtos, os produtos voltam a formar reagentes. Quando as duas velocidades se igualam, o sistema chega ao **equilíbrio químico**: as concentrações ficam **constantes** (mas a reação não parou; ela continua nos dois sentidos).

## Princípio de Le Chatelier

Quando um sistema em equilíbrio sofre uma perturbação, ele **se desloca para diminuir essa perturbação**.

- **Concentração:** adicionando um reagente, o equilíbrio vai no sentido de **consumi-lo** (forma mais produto). Retirando um produto, também se forma mais produto.
- **Temperatura:** aumentar a temperatura favorece o sentido **endotérmico**; diminuir favorece o **exotérmico**.
- **Pressão (gases):** aumentar a pressão favorece o lado com **menos moléculas de gás**.
- **Catalisador:** **não desloca** o equilíbrio; só faz chegar mais rápido.

## Exemplos do cotidiano

- **Refrigerante:** o CO₂ fica dissolvido sob pressão. Ao abrir a garrafa, a pressão cai e o gás escapa (bolhas). Refrigerante quente perde gás mais rápido.
- **Síntese da amônia (Haber-Bosch):** N₂ + 3 H₂ ⇌ 2 NH₃. Alta pressão favorece a amônia (4 moléculas de gás viram 2). Base dos fertilizantes do mundo.
- **Sangue e altitude:** em lugares altos, com menos oxigênio, o corpo produz mais hemácias para compensar.
- **Esmalte dos dentes:** ácidos de alimentos deslocam o equilíbrio e dissolvem o esmalte, causando cáries.

## Resumindo

No equilíbrio, as velocidades se igualam e as concentrações ficam constantes. Le Chatelier: o sistema reage contra a perturbação. Catalisador não desloca o equilíbrio.`,
    [
      "No equilíbrio, as reações direta e inversa têm a mesma velocidade.",
      "Le Chatelier: o sistema se desloca para reduzir a perturbação.",
      "Aumentar a temperatura favorece o sentido endotérmico.",
      "Catalisador não desloca o equilíbrio, só o faz chegar mais rápido.",
    ],
    [
      ["Reação reversível", "Reação que ocorre nos dois sentidos."],
      ["Equilíbrio químico", "Estado em que as velocidades nos dois sentidos se igualam."],
      ["Princípio de Le Chatelier", "Um sistema em equilíbrio se ajusta para compensar uma perturbação."],
    ],
    [
      ["Ao abrir uma garrafa de refrigerante, formam-se bolhas porque:", ["a temperatura sobe", "a pressão diminui e o CO₂ sai da solução", "o açúcar reage", "entra oxigênio", "a concentração de água aumenta"], 1, "Com menos pressão, o equilíbrio favorece o gás."],
      ["Num equilíbrio, adicionar mais reagente faz:", ["formar mais reagente", "formar mais produto", "parar a reação", "nada mudar", "quebrar o catalisador"], 1, "O sistema consome o excesso de reagente."],
      ["Adicionar um catalisador a um sistema em equilíbrio:", ["desloca para os produtos", "desloca para os reagentes", "não desloca o equilíbrio", "para a reação", "aumenta a temperatura"], 2, "O catalisador acelera os dois sentidos igualmente."],
      ["Em N₂ + 3 H₂ ⇌ 2 NH₃ (gases), aumentar a pressão favorece:", ["os reagentes", "a amônia", "nenhum lado", "a decomposição da amônia", "a formação de N₂"], 1, "O lado dos produtos tem menos moléculas de gás."],
      ["No equilíbrio químico:", ["a reação parou", "as concentrações ficam constantes, mas a reação continua nos dois sentidos", "só há produtos", "só há reagentes", "a temperatura é zero"], 1, "É um equilíbrio dinâmico."],
    ],
    [["Explique, usando Le Chatelier, por que um refrigerante quente perde o gás mais rápido.", "A dissolução do gás carbônico na água libera calor; aumentar a temperatura favorece o sentido que absorve calor, que é o gás saindo da solução, então o refrigerante quente perde o gás mais rápido."]],
  ),
  aula(
    "Funções orgânicas: álcoois, ácidos, ésteres e mais",
    `## Grupos funcionais

Na química orgânica, os compostos são agrupados em **funções** pelo **grupo funcional**, um conjunto de átomos que define suas propriedades.

## Principais funções

- **Hidrocarbonetos:** só C e H. Ex.: metano (gás natural), butano (gás de cozinha), octano (gasolina).
- **Álcoois:** têm o grupo **–OH** ligado a carbono. Ex.: **etanol** (combustível, bebidas), metanol (tóxico).
- **Fenóis:** –OH ligado a anel aromático. Usados em desinfetantes.
- **Aldeídos:** grupo –CHO. Ex.: formaldeído (formol).
- **Cetonas:** C=O entre carbonos. Ex.: **acetona** (removedor de esmalte).
- **Ácidos carboxílicos:** grupo **–COOH**. Ex.: **ácido acético** (vinagre), ácido cítrico (limão).
- **Ésteres:** formados de ácido + álcool. Têm **cheiros de frutas** (aromas artificiais) e formam **gorduras e óleos**.
- **Éteres:** oxigênio entre carbonos. Ex.: éter etílico (antigo anestésico).
- **Aminas e amidas:** têm nitrogênio. Aminas dão cheiro de peixe; amidas formam as ligações das proteínas e a ureia.

## Reações importantes

- **Esterificação:** ácido + álcool → éster + água.
- **Saponificação:** gordura + base forte → **sabão** + glicerol. É assim que se faz sabão caseiro com óleo usado e soda cáustica.
- **Fermentação:** açúcar → etanol + CO₂.

## Como o sabão limpa

A molécula de sabão tem uma ponta que gosta de água (**polar**) e outra que gosta de gordura (**apolar**). Ela envolve a gordura e permite que a água a leve embora.

## Resumindo

Álcool (–OH), ácido carboxílico (–COOH), éster (aromas, gorduras), cetona (acetona). Saponificação faz sabão; o sabão une água e gordura.`,
    [
      "O grupo funcional define a função orgânica.",
      "Álcoois têm –OH; ácidos carboxílicos têm –COOH (vinagre).",
      "Ésteres dão aromas de frutas e formam óleos e gorduras.",
      "Saponificação: gordura + base forte → sabão.",
    ],
    [
      ["Grupo funcional", "Conjunto de átomos que dá propriedades características a uma função orgânica."],
      ["Saponificação", "Reação de gordura com base forte que produz sabão."],
      ["Esterificação", "Reação entre ácido carboxílico e álcool que forma éster e água."],
    ],
    [
      ["O vinagre contém principalmente:", ["etanol", "ácido acético", "acetona", "metano", "glicerol"], 1, "Ácido acético, um ácido carboxílico."],
      ["O etanol pertence à função:", ["cetona", "álcool", "éster", "aldeído", "amina"], 1, "Tem o grupo –OH ligado a carbono."],
      ["Os aromas artificiais de frutas costumam ser:", ["ésteres", "ácidos fortes", "hidrocarbonetos", "fenóis", "aminas"], 0, "Ésteres têm cheiros agradáveis de frutas."],
      ["O sabão é produzido pela reação entre:", ["álcool e ácido", "gordura e base forte", "açúcar e levedura", "metano e oxigênio", "água e sal"], 1, "É a saponificação."],
      ["O sabão consegue remover gordura porque sua molécula:", ["é apenas polar", "tem uma parte polar e outra apolar", "dissolve só água", "é um ácido forte", "evapora a gordura"], 1, "Uma ponta se liga à gordura e a outra à água."],
    ],
    [["Explique como o sabão remove a gordura de um prato.", "A molécula de sabão tem uma parte apolar que se liga à gordura e uma parte polar que se liga à água; assim ela envolve a gordura em pequenas gotas, que são levadas pela água."]],
  ),
  aula(
    "Gases: pressão, volume e temperatura",
    `## O comportamento dos gases

As partículas de um gás se movem livremente e ocupam todo o recipiente. Três grandezas descrevem um gás: **pressão (P)**, **volume (V)** e **temperatura (T)**, sempre em **kelvin** (K = °C + 273).

## Transformações gasosas

- **Isotérmica (T constante):** P × V = constante. Se o volume diminui pela metade, a pressão dobra (Boyle). Ex.: apertar uma seringa tampada.
- **Isobárica (P constante):** V ÷ T = constante. Esquentando, o gás se expande. Ex.: balão que murcha no frio.
- **Isocórica (V constante):** P ÷ T = constante. Esquentando, a pressão sobe. Ex.: por isso não se deve aquecer latas de aerossol (podem explodir) e os pneus devem ser calibrados frios.

Equação geral: P₁V₁/T₁ = P₂V₂/T₂.

## Equação de Clapeyron

P · V = n · R · T

Relaciona a quantidade de gás (n, em mols) com P, V e T.

## Pressão atmosférica

É o peso do ar sobre nós. Ao **nível do mar** é maior; em **lugares altos**, menor. Por isso:
- a água ferve abaixo de 100 °C nas montanhas;
- os ouvidos "entopem" ao subir a serra ou num avião;
- o canudinho funciona: você diminui a pressão dentro dele e a pressão do ar empurra o líquido para cima.

## Balões e airbags

- O ar quente é menos denso: **balões de ar quente** sobem.
- O **airbag** enche em milissegundos com o gás produzido por uma reação química rápida.

## Resumindo

Temperatura sempre em kelvin. PV/T constante. Mais calor, mais pressão (volume fixo) ou mais volume (pressão fixa). Pressão atmosférica diminui com a altitude.`,
    [
      "Use temperatura em kelvin: K = °C + 273.",
      "Isotérmica: PV constante; isobárica: V/T constante; isocórica: P/T constante.",
      "Aquecer gás em volume fixo aumenta a pressão (latas de aerossol).",
      "A pressão atmosférica diminui com a altitude.",
    ],
    [
      ["Pressão", "Força exercida por unidade de área."],
      ["Kelvin", "Escala absoluta de temperatura; 0 K é o zero absoluto."],
      ["Transformação isotérmica", "Transformação de um gás com temperatura constante."],
    ],
    [
      ["Um gás ocupa 10 L a 2 atm. Mantendo a temperatura, se a pressão for para 4 atm, o volume será:", ["2,5 L", "5 L", "10 L", "20 L", "40 L"], 1, "P·V constante: 2 × 10 = 4 × V → V = 5 L."],
      ["27 °C correspondem a:", ["27 K", "246 K", "273 K", "300 K", "327 K"], 3, "27 + 273 = 300 K."],
      ["Não se deve aquecer uma lata de aerossol porque:", ["o volume diminui", "a pressão interna aumenta e ela pode explodir", "o gás vira sólido", "a lata congela", "o gás perde massa"], 1, "Volume fixo: temperatura maior, pressão maior."],
      ["Em uma cidade a 3.000 m de altitude, a água ferve:", ["acima de 100 °C", "a 100 °C exatamente", "abaixo de 100 °C", "a 0 °C", "não ferve"], 2, "A pressão atmosférica menor reduz o ponto de ebulição."],
      ["Um balão de ar quente sobe porque o ar quente é:", ["mais denso", "menos denso que o ar frio", "mais pesado", "um líquido", "sem pressão"], 1, "Ao aquecer, o ar se expande e fica menos denso."],
    ],
    [["Explique por que os pneus devem ser calibrados quando estão frios.", "Porque, ao rodar, o pneu esquenta e a pressão do ar dentro dele aumenta; calibrar quente daria uma leitura maior que a real em condições normais, deixando o pneu com pressão errada."]],
  ),
  aula(
    "Propriedades coligativas: o efeito do soluto",
    `## Quando se dissolve algo na água

Adicionar um **soluto não volátil** (como sal ou açúcar) a um solvente muda algumas propriedades. Essas mudanças dependem da **quantidade de partículas** dissolvidas, não do tipo delas. São as **propriedades coligativas**.

## Ebulioscopia

A solução ferve a uma temperatura **maior** que o solvente puro. Água com sal ferve um pouco acima de 100 °C.

## Crioscopia

A solução congela a uma temperatura **menor**. Por isso:
- em países frios, joga-se **sal nas estradas** para derreter o gelo;
- radiadores usam **aditivos anticongelantes**;
- a água do mar congela abaixo de 0 °C.

## Tonoscopia

O soluto **diminui a pressão de vapor**: a solução evapora mais devagar que o solvente puro.

## Osmose (osmometria)

A água passa da solução **menos concentrada** para a **mais concentrada** através de uma membrana semipermeável. A **pressão osmótica** é a pressão necessária para impedir essa passagem. Aplicações:
- **Dessalinização por osmose reversa:** aplica-se pressão para forçar a água do mar a passar pela membrana, deixando o sal para trás.
- **Conservação de alimentos** com sal ou açúcar (charque, doces em calda).
- **Soro caseiro e soro fisiológico.**

## Mais partículas, maior efeito

O sal de cozinha (NaCl) se separa em **dois íons** (Na⁺ e Cl⁻) na água, então tem efeito maior que a mesma quantidade de mols de açúcar, que não se separa.

## Resumindo

Soluto não volátil: aumenta o ponto de ebulição, diminui o de congelamento, diminui a pressão de vapor e gera pressão osmótica. Depende do número de partículas.`,
    [
      "Propriedades coligativas dependem do número de partículas de soluto.",
      "Ebulioscopia: a solução ferve a temperatura maior.",
      "Crioscopia: a solução congela a temperatura menor (sal nas estradas).",
      "Osmose reversa dessaliniza a água do mar.",
    ],
    [
      ["Propriedade coligativa", "Propriedade que depende só da quantidade de partículas dissolvidas."],
      ["Crioscopia", "Diminuição da temperatura de congelamento pela adição de soluto."],
      ["Osmose reversa", "Aplicação de pressão para fazer a água passar pela membrana e deixar o sal."],
    ],
    [
      ["Jogar sal em estradas congeladas ajuda porque:", ["aumenta a temperatura do ar", "diminui a temperatura de congelamento da água", "aumenta o ponto de fusão do gelo", "faz o gelo evaporar", "funciona como catalisador"], 1, "É a crioscopia."],
      ["Água com açúcar dissolvido, comparada à água pura, ferve a uma temperatura:", ["menor", "maior", "igual", "de 0 °C", "imprevisível"], 1, "É a ebulioscopia."],
      ["A dessalinização da água do mar por membranas usa:", ["destilação fracionada", "osmose reversa", "crioscopia", "filtração comum", "centrifugação"], 1, "Pressão força a água pela membrana, deixando o sal."],
      ["Comparando 1 mol de sal (NaCl) e 1 mol de açúcar em água, o maior efeito coligativo é do:", ["açúcar", "sal, que se separa em mais partículas", "os dois iguais", "nenhum", "depende da cor"], 1, "O NaCl forma dois íons, dobrando o número de partículas."],
      ["Conservar carne com muito sal (charque) funciona porque:", ["o sal é um antibiótico", "a água sai dos micro-organismos por osmose", "o sal aquece a carne", "o sal é um catalisador", "o sal fornece oxigênio"], 1, "Sem água, os micro-organismos não se multiplicam."],
    ],
    [["Explique por que o sal ajuda a derreter o gelo das estradas em países frios.", "O sal dissolvido na água forma uma solução que congela a uma temperatura menor que zero grau; assim, a água não volta a congelar e o gelo derrete, efeito chamado crioscopia."]],
  ),
  aula(
    "Isomeria e química dos alimentos e medicamentos",
    `## Mesma fórmula, substâncias diferentes

**Isômeros** são compostos com a **mesma fórmula molecular**, mas **estruturas diferentes** e, portanto, propriedades diferentes.

## Isomeria plana

As estruturas diferem no "desenho" da molécula:

- **De cadeia:** cadeia reta ou ramificada (butano e isobutano).
- **De posição:** o grupo funcional muda de lugar.
- **De função:** pertencem a funções diferentes. Ex.: **etanol** (álcool) e **éter dimetílico** (éter) têm a mesma fórmula C₂H₆O, mas o etanol é líquido e o éter é gás à temperatura ambiente.

## Isomeria espacial

As moléculas têm a mesma ligação entre os átomos, mas diferem na **posição no espaço**.

- **Geométrica (cis e trans):** acontece em ligações duplas. As **gorduras trans**, comuns em alimentos ultraprocessados, aumentam o colesterol ruim e o risco de doenças cardíacas.
- **Óptica:** moléculas que são **imagens no espelho** uma da outra, como as mãos direita e esquerda (moléculas **quirais**). O corpo pode reagir de forma muito diferente a cada uma.

## O caso da talidomida

Nos anos 1950 e 1960, a **talidomida** foi vendida para enjoo de grávidas. Uma de suas formas ópticas tinha o efeito desejado; a outra causava **malformações** nos bebês. O caso mudou as regras de testes de medicamentos.

## Na alimentação

- A **frutose** e a **glicose** são isômeras (C₆H₁₂O₆), com doçura diferente.
- O **aspartame** e outros adoçantes dependem da forma espacial para ter gosto doce.

## Resumindo

Isômeros: mesma fórmula, estruturas e propriedades diferentes. Plana (cadeia, posição, função) e espacial (cis-trans, óptica). Gorduras trans fazem mal; a talidomida mostrou a importância da isomeria óptica.`,
    [
      "Isômeros têm a mesma fórmula molecular e estruturas diferentes.",
      "Etanol e éter dimetílico são isômeros de função (C₂H₆O).",
      "Gorduras trans (isomeria geométrica) fazem mal ao coração.",
      "Na isomeria óptica, as moléculas são imagens no espelho (caso da talidomida).",
    ],
    [
      ["Isômeros", "Compostos com a mesma fórmula molecular e estruturas diferentes."],
      ["Molécula quiral", "Molécula que não se sobrepõe à sua imagem no espelho."],
      ["Gordura trans", "Gordura com ligações duplas na forma trans, ligada a doenças do coração."],
    ],
    [
      ["Isômeros são compostos que têm:", ["a mesma estrutura e fórmulas diferentes", "a mesma fórmula molecular e estruturas diferentes", "a mesma massa e cor", "os mesmos átomos em quantidades diferentes", "propriedades sempre iguais"], 1, "Mesma fórmula, arranjos diferentes."],
      ["Etanol e éter dimetílico (ambos C₂H₆O) são isômeros de:", ["cadeia", "posição", "função", "óptica", "nenhum tipo"], 2, "Pertencem a funções diferentes: álcool e éter."],
      ["O consumo de gordura trans está associado a:", ["melhora da memória", "aumento do risco de doenças cardíacas", "crescimento dos ossos", "melhor digestão", "fortalecimento dos dentes"], 1, "Aumenta o colesterol ruim."],
      ["O caso da talidomida está ligado à isomeria:", ["de cadeia", "de posição", "óptica", "de função", "de compensação"], 2, "Uma forma óptica causava malformações."],
      ["Glicose e frutose têm a mesma fórmula C₆H₁₂O₆. Elas são:", ["a mesma substância", "isômeros", "polímeros", "sais", "gases"], 1, "Mesma fórmula, estruturas diferentes."],
    ],
    [["Explique por que o caso da talidomida tornou mais rigorosos os testes de medicamentos.", "Porque a talidomida tinha duas formas ópticas: uma combatia o enjoo e a outra causava malformações nos bebês; isso mostrou que formas espaciais diferentes da mesma substância precisam ser testadas separadamente."]],
  ),
  aula(
    "Polímeros, plásticos e reciclagem",
    `## Moléculas gigantes

**Polímeros** são moléculas enormes formadas pela repetição de unidades menores, os **monômeros**, como contas de um colar. Existem polímeros **naturais** (amido, celulose, proteínas, borracha natural, DNA) e **sintéticos** (plásticos, náilon).

## Tipos de plásticos

- **Polietileno (PE):** sacolas e garrafas de produtos de limpeza.
- **PET:** garrafas de refrigerante.
- **PVC:** canos e tubos.
- **Poliestireno (PS):** copos descartáveis e isopor.
- **Polipropileno (PP):** potes e tampas.

O símbolo de reciclagem com um número dentro indica o tipo de plástico.

## Termoplásticos e termofixos

- **Termoplásticos:** amolecem com o calor e podem ser **remoldados** (PET, PE). São recicláveis.
- **Termofixos:** não amolecem depois de prontos (baquelite das tomadas, resinas). Difíceis de reciclar.

## O problema ambiental

Plásticos comuns demoram **centenas de anos** para se decompor. Acumulam-se nos oceanos, prejudicam tartarugas e aves e se quebram em **microplásticos**, que chegam à nossa alimentação.

## Soluções

- **Os 3 Rs:** reduzir, reutilizar, reciclar (nessa ordem de importância).
- **Reciclagem mecânica:** o plástico é triturado e remoldado.
- **Plásticos biodegradáveis** e de fontes renováveis (como o "plástico verde" de cana-de-açúcar, que é renovável mas não necessariamente biodegradável).
- **Coleta seletiva** e valorização dos catadores.

## Resumindo

Polímeros são repetições de monômeros. Termoplásticos podem ser reciclados; termofixos, não. Plásticos poluem por séculos: reduzir vem antes de reciclar.`,
    [
      "Polímeros são formados pela repetição de monômeros.",
      "Termoplásticos podem ser remoldados e reciclados; termofixos, não.",
      "Plásticos levam centenas de anos para se decompor e geram microplásticos.",
      "Os 3 Rs: reduzir, reutilizar e reciclar, nessa ordem.",
    ],
    [
      ["Polímero", "Macromolécula formada pela repetição de unidades chamadas monômeros."],
      ["Termoplástico", "Plástico que amolece com o calor e pode ser remoldado."],
      ["Microplástico", "Fragmento minúsculo de plástico que se espalha no ambiente."],
    ],
    [
      ["Garrafas de refrigerante costumam ser feitas de:", ["PVC", "PET", "baquelite", "isopor", "náilon"], 1, "O PET é usado em garrafas."],
      ["Um exemplo de polímero natural é:", ["PVC", "celulose", "PET", "isopor", "polietileno"], 1, "A celulose forma a parede das células vegetais."],
      ["O plástico que pode ser derretido e remoldado na reciclagem é o:", ["termofixo", "termoplástico", "cerâmico", "metálico", "vidro"], 1, "Termoplásticos amolecem com o calor."],
      ["Qual ação tem maior prioridade entre os 3 Rs?", ["Reciclar", "Reutilizar", "Reduzir", "Queimar", "Enterrar"], 2, "Reduzir evita que o resíduo exista."],
      ["Os microplásticos preocupam porque:", ["somem rápido", "chegam à cadeia alimentar e à nossa comida", "são todos biodegradáveis", "aumentam o oxigênio dos mares", "são usados como adubo"], 1, "Entram nos seres vivos e na alimentação humana."],
    ],
    [["Explique por que reduzir o consumo de plástico é mais importante do que reciclar.", "Porque reduzir evita que o resíduo seja produzido; a reciclagem gasta energia, não recupera todo o plástico e parte dele acaba no ambiente, onde leva séculos para se decompor."]],
  ),
];
