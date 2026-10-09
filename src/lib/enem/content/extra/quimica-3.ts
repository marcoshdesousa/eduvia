import { aula } from "./build";

/** Química, lote 3: tabela periódica, orgânica, metais, cotidiano e sustentabilidade. */
export const QUIMICA_3 = [
  aula(
    "Propriedades periódicas: raio, eletronegatividade e reatividade",
    `## A tabela periódica organizada

Os elementos estão em ordem crescente de **número atômico** (Z). As **linhas** são **períodos** (número de camadas eletrônicas) e as **colunas** são **grupos/famílias** (mesmo número de elétrons na última camada → propriedades parecidas).

## Famílias importantes

- **Grupo 1 – metais alcalinos** (Li, Na, K): 1 elétron na última camada; muito **reativos**, reagem violentamente com água.
- **Grupo 2 – alcalino-terrosos** (Mg, Ca).
- **Grupo 17 – halogênios** (F, Cl, Br, I): muito reativos; formam sais com metais.
- **Grupo 18 – gases nobres** (He, Ne, Ar): camada completa, **quase não reagem** (usados em letreiros, lâmpadas, balões).
- **Metais de transição** no centro (Fe, Cu, Zn, Au, Ag).

## Metais, ametais

- **Metais** (maioria, à esquerda): brilho, conduzem calor e eletricidade, maleáveis; tendem a **perder** elétrons (formam cátions).
- **Ametais** (à direita): tendem a **ganhar** elétrons (formam ânions).

## Propriedades periódicas

### Raio atômico

- **Aumenta** de cima para baixo no grupo (mais camadas).
- **Diminui** da esquerda para a direita no período (mais prótons atraem mais os elétrons).
- Maior raio: canto **inferior esquerdo** (césio, frâncio).

### Eletronegatividade

- Tendência de **atrair elétrons** numa ligação.
- **Aumenta** para a **direita** e para **cima**.
- O **flúor** é o mais eletronegativo. Ordem útil: **F > O > N > Cl > Br > I > S > C > P > H**.
- Gases nobres geralmente não entram nessa comparação.

### Energia de ionização

- Energia para **retirar** um elétron. Tem tendência **oposta** ao raio: maior para a direita e para cima.

### Reatividade

- **Metais:** mais reativos **embaixo à esquerda** (perdem elétrons com facilidade).
- **Ametais:** mais reativos **em cima à direita** (flúor).

## Aplicação

- Ligação entre elementos com **grande diferença de eletronegatividade** (metal + ametal, como Na e Cl) → **ligação iônica** (sal de cozinha).
- Entre ametais → **covalente** (água, CO₂).
- Polaridade das moléculas depende da eletronegatividade (a água é polar porque o O atrai mais os elétrons que o H).

## Resumindo

Períodos = camadas; grupos = propriedades semelhantes. Raio aumenta para baixo e para a esquerda. Eletronegatividade aumenta para cima e para a direita (flúor é o maior). Metais perdem elétrons; ametais ganham. Gases nobres quase não reagem.`,
    [
      "Períodos = camadas; grupos = propriedades semelhantes.",
      "Raio atômico cresce para baixo e para a esquerda.",
      "Eletronegatividade cresce para cima e para a direita (flúor).",
      "Gases nobres têm camada completa e quase não reagem.",
    ],
    [
      ["Eletronegatividade", "Tendência de um átomo atrair elétrons numa ligação."],
      ["Período", "Linha da tabela; indica o número de camadas eletrônicas."],
      ["Gás nobre", "Elemento do grupo 18, com camada completa e pouca reatividade."],
    ],
    [
      ["O elemento mais eletronegativo da tabela é o:", ["oxigênio", "flúor", "cloro", "sódio", "hidrogênio"], 1, "Canto superior direito."],
      ["Em um mesmo grupo, o raio atômico:", ["diminui de cima para baixo", "aumenta de cima para baixo", "não varia", "é sempre igual a 1", "depende só da massa"], 1, "Mais camadas."],
      ["Os gases nobres quase não reagem porque:", ["são metais", "têm a camada de valência completa", "são radioativos", "não têm elétrons", "são muito pesados"], 1, "Estabilidade."],
      ["Os metais alcalinos (grupo 1) têm na última camada:", ["1 elétron", "2 elétrons", "7 elétrons", "8 elétrons", "nenhum elétron"], 0, "Muito reativos."],
      ["A ligação entre sódio (metal) e cloro (ametal) é:", ["covalente apolar", "iônica", "metálica", "de hidrogênio", "nenhuma"], 1, "Grande diferença de eletronegatividade."],
    ],
    [["Explique por que o raio atômico diminui da esquerda para a direita num mesmo período.", "Porque, no mesmo período, o número de camadas é igual, mas o número de prótons aumenta; o núcleo mais carregado atrai os elétrons com mais força, puxando-os para perto e diminuindo o tamanho do átomo."]],
  ),
  aula(
    "Hidrocarbonetos e nomenclatura orgânica básica",
    `## O que são hidrocarbonetos

Compostos formados **apenas por carbono e hidrogênio**. São a base do **petróleo**, do **gás natural** e de muitos materiais.

## O carbono

- Faz **4 ligações** (tetravalente).
- Forma **cadeias** longas, ramificadas, fechadas (cíclicas).
- Ligações **simples**, **duplas** ou **triplas**.

## Classes de hidrocarbonetos

- **Alcanos:** só ligações **simples** (CₙH₂ₙ₊₂). Ex.: metano (CH₄), propano, butano (gás de cozinha — GLP), octano (gasolina).
- **Alcenos:** uma ligação **dupla** (CₙH₂ₙ). Ex.: **eteno (etileno)**, matéria-prima do **polietileno** e hormônio vegetal que **amadurece frutas**.
- **Alcinos:** uma ligação **tripla**. Ex.: **etino (acetileno)**, usado em maçaricos de solda.
- **Cicloalcanos:** cadeia fechada.
- **Aromáticos:** com **anel benzênico** (benzeno, tolueno); o benzeno é tóxico e cancerígeno.

## Nomenclatura (IUPAC) básica

Nome = **prefixo** (número de carbonos) + **infixo** (tipo de ligação) + **sufixo** (função).

**Prefixos:** 1 C = **met**; 2 = **et**; 3 = **prop**; 4 = **but**; 5 = **pent**; 6 = **hex**; 7 = **hept**; 8 = **oct**.

**Infixos:** **an** (simples), **en** (dupla), **in** (tripla).

**Sufixo** dos hidrocarbonetos: **o**.

Exemplos:

- CH₄ → **met + an + o = metano**.
- CH₃–CH₃ → **etano**.
- CH₂=CH₂ → **eteno**.
- CH≡CH → **etino**.
- CH₃–CH₂–CH₃ → **propano**.

Outras funções trocam o sufixo: **-ol** (álcool: **etanol**), **-al** (aldeído: metanal/formol), **-ona** (cetona: propanona/acetona), **ácido -oico** (ácido etanoico/acético).

## Propriedades

- Hidrocarbonetos são **apolares**: **insolúveis** em água e menos densos (o petróleo flutua no mar).
- Quanto **maior a cadeia**, maior o **ponto de ebulição** (metano é gás; gasolina, líquida; parafina, sólida). Ramificações **diminuem** o ponto de ebulição.
- São **combustíveis**: na combustão completa liberam CO₂ e água.

## Resumindo

Hidrocarbonetos têm só C e H. Alcanos (simples), alcenos (dupla), alcinos (tripla), aromáticos (anel benzênico). Nome = prefixo (met, et, prop, but...) + infixo (an, en, in) + sufixo. São apolares e combustíveis.`,
    [
      "Hidrocarbonetos: só carbono e hidrogênio.",
      "Alcano (simples), alceno (dupla), alcino (tripla).",
      "Prefixos: met (1), et (2), prop (3), but (4), pent (5).",
      "Apolares, insolúveis em água e combustíveis.",
    ],
    [
      ["Hidrocarboneto", "Composto formado apenas por carbono e hidrogênio."],
      ["Alceno", "Hidrocarboneto com uma ligação dupla entre carbonos."],
      ["Anel benzênico", "Estrutura cíclica de seis carbonos típica dos aromáticos."],
    ],
    [
      ["O nome do hidrocarboneto CH₃–CH₂–CH₂–CH₃ é:", ["propano", "butano", "buteno", "pentano", "etano"], 1, "4 carbonos, ligações simples."],
      ["O eteno (etileno) é conhecido por:", ["ser o gás de cozinha", "acelerar o amadurecimento de frutas e originar o polietileno", "ser usado em maçaricos", "ser um álcool", "ser o principal componente da gasolina"], 1, "Hormônio vegetal."],
      ["Uma ligação tripla entre carbonos caracteriza os:", ["alcanos", "alcenos", "alcinos", "aromáticos", "álcoois"], 2, "Infixo \"in\"."],
      ["O petróleo derramado flutua no mar porque:", ["é polar e mais denso", "é apolar, insolúvel e menos denso que a água", "evapora rápido", "reage com o sal", "é um sal"], 1, "Hidrocarbonetos."],
      ["O sufixo \"-ol\" indica a função:", ["cetona", "álcool", "ácido carboxílico", "aldeído", "éster"], 1, "Ex.: etanol."],
    ],
    [["Explique como se forma o nome \"propeno\" pela nomenclatura oficial.", "\"Prop\" indica 3 carbonos, \"en\" indica uma ligação dupla e \"o\" indica que é um hidrocarboneto; portanto propeno é um hidrocarboneto de 3 carbonos com uma ligação dupla."]],
  ),
  aula(
    "Petróleo: destilação fracionada e derivados",
    `## O que é o petróleo

O **petróleo** é uma **mistura** complexa de **hidrocarbonetos**, formada ao longo de **milhões de anos** pela decomposição de matéria orgânica (principalmente plâncton) soterrada em **bacias sedimentares**, sob pressão e calor. É um recurso **não renovável**.

## Refino: destilação fracionada

Como é uma mistura de substâncias com **pontos de ebulição diferentes**, o petróleo é separado por **destilação fracionada** numa **torre** de refinaria:

1. O petróleo é aquecido (cerca de 400 °C) e vaporizado.
2. Os vapores sobem pela torre, que é **mais quente embaixo** e **mais fria em cima**.
3. Cada fração se **condensa** na altura em que a temperatura corresponde ao seu ponto de ebulição.

**Do topo para a base (cadeias menores para maiores):**

- **Gases:** metano, etano, **GLP** (propano e butano, o gás de cozinha).
- **Gasolina** (5 a 10 carbonos).
- **Nafta** (matéria-prima da **petroquímica**: plásticos).
- **Querosene** (combustível de **aviões**).
- **Óleo diesel** (caminhões, ônibus).
- **Óleos lubrificantes**.
- **Parafina**, **óleo combustível**.
- **Resíduo: asfalto (betume)**.

Quanto **maior** a cadeia carbônica, **maior** o ponto de ebulição: frações leves saem em cima; pesadas, embaixo.

## Craqueamento

Processo que **quebra** moléculas grandes (de frações pesadas) em menores, para obter **mais gasolina** e gás. Pode ser térmico ou catalítico.

## Gasolina e octanagem

- **Octanagem** indica a resistência da gasolina à **detonação** antecipada no motor ("batida de pino").
- No Brasil, a gasolina recebe **etanol anidro** (cerca de 27–30%), que aumenta a octanagem e reduz a importação de petróleo.

## Petroquímica

A partir da nafta e do gás, produz-se **plásticos** (polietileno, PVC, PET), **borracha sintética**, **fibras** (náilon, poliéster), **fertilizantes**, **solventes**, **medicamentos** e **cosméticos**.

## Impactos

- Emissão de **CO₂** (aquecimento global) e de poluentes (enxofre → **chuva ácida**; o **diesel S10** tem menos enxofre).
- **Derramamentos** no mar (asfixiam e envenenam a vida marinha).
- Dependência econômica e conflitos geopolíticos.

## Resumindo

O petróleo é uma mistura de hidrocarbonetos separada por destilação fracionada: gases e gasolina no topo, diesel e lubrificantes no meio, asfalto na base. O craqueamento quebra moléculas grandes. A nafta origina plásticos. A queima libera CO₂ e poluentes.`,
    [
      "Petróleo: mistura de hidrocarbonetos, não renovável.",
      "Destilação fracionada separa por ponto de ebulição.",
      "Topo: gases e gasolina; base: asfalto.",
      "Craqueamento quebra moléculas grandes; nafta gera plásticos.",
    ],
    [
      ["Destilação fracionada", "Separação de líquidos com pontos de ebulição diferentes, em etapas."],
      ["Craqueamento", "Quebra de moléculas grandes de hidrocarbonetos em menores."],
      ["Octanagem", "Resistência da gasolina à detonação antecipada no motor."],
    ],
    [
      ["O petróleo é separado em frações por:", ["filtração", "destilação fracionada", "decantação", "centrifugação", "eletrólise"], 1, "Pontos de ebulição diferentes."],
      ["Na torre de destilação, o asfalto é obtido:", ["no topo", "na base", "no meio", "fora da torre", "junto com o GLP"], 1, "Fração mais pesada."],
      ["O querosene é usado principalmente como combustível de:", ["carros de passeio", "aviões", "fogões domésticos", "caminhões", "navios a vela"], 1, "Aviação."],
      ["O craqueamento serve para:", ["unir moléculas pequenas", "quebrar moléculas grandes para obter mais gasolina", "filtrar o petróleo", "retirar o sal", "produzir asfalto"], 1, "Aumenta frações leves."],
      ["A fração do petróleo que serve de matéria-prima para os plásticos é a:", ["nafta", "parafina", "asfalto", "querosene", "diesel"], 0, "Petroquímica."],
    ],
    [["Explique por que a destilação fracionada consegue separar os componentes do petróleo.", "Porque o petróleo é uma mistura de hidrocarbonetos com pontos de ebulição diferentes; na torre, quente embaixo e fria em cima, cada fração se condensa numa altura diferente, conforme sua temperatura de ebulição."]],
  ),
  aula(
    "Metais e ligas: metalurgia, aço e reciclagem",
    `## Propriedades dos metais

- **Brilho** metálico.
- Bons **condutores** de **calor** e **eletricidade** (elétrons livres: "mar de elétrons" da **ligação metálica**).
- **Maleabilidade** (viram chapas) e **ductilidade** (viram fios).
- Em geral sólidos (exceção: o **mercúrio**, líquido).

## Metalurgia: do minério ao metal

Os metais raramente são encontrados puros: estão em **minérios** (óxidos, sulfetos). A **metalurgia** os extrai, geralmente por **redução**.

- **Ferro:** o minério (**hematita**, Fe₂O₃) é aquecido em **altos-fornos** com **carvão** (coque), que retira o oxigênio. Obtém-se o **ferro-gusa**, que vira **aço**.
- **Alumínio:** obtido da **bauxita** por **eletrólise** (consome muita energia elétrica).
- **Cobre:** de minérios sulfetados; usado em **fios elétricos**.
- **Ouro:** encontrado puro; no garimpo, usa-se **mercúrio** para separá-lo (contaminação).

## Ligas metálicas

**Misturas** de metais (ou de metal com outro elemento) com propriedades **melhores** que as dos componentes:

- **Aço:** ferro + **carbono** (até cerca de 2%). Mais **resistente** que o ferro. Usado em construção, carros, ferramentas.
- **Aço inoxidável:** ferro + carbono + **cromo** + níquel. **Resiste à corrosão** (talheres, pias, equipamentos médicos).
- **Bronze:** cobre + **estanho**. Estátuas, sinos, medalhas.
- **Latão:** cobre + **zinco**. Instrumentos musicais, torneiras, chaves.
- **Ouro 18 quilates:** 75% ouro + outros metais (prata, cobre), mais duro que o ouro puro (24 quilates).
- **Amálgama:** mercúrio + outros metais (antigamente usado em restaurações dentárias).
- **Solda:** estanho + chumbo (mistura eutética).

## Corrosão

Metais **oxidam** em contato com ar e água (ferrugem). Proteção: pintura, galvanização (zinco), metal de sacrifício, ligas inoxidáveis.

## Reciclagem de metais

- O **alumínio** é **100% reciclável** e pode ser reciclado infinitas vezes; reciclar uma lata gasta cerca de **5%** da energia necessária para produzi-la a partir da bauxita.
- O Brasil é um dos líderes mundiais em reciclagem de **latas de alumínio**, graças em parte ao trabalho dos **catadores**.
- Reciclar aço e cobre também economiza energia, água e evita a mineração.

## Metais pesados

**Mercúrio**, **chumbo** e **cádmio** são tóxicos e se **acumulam** nos seres vivos (biomagnificação). Pilhas e baterias devem ir para coleta especial.

## Resumindo

Metais conduzem calor e eletricidade e são maleáveis. A metalurgia extrai metais por redução (ferro em altos-fornos) ou eletrólise (alumínio). Ligas: aço (Fe + C), inox (+ Cr), bronze (Cu + Sn), latão (Cu + Zn). Reciclar alumínio economiza ~95% da energia.`,
    [
      "Metais: brilho, condutividade, maleabilidade (mar de elétrons).",
      "Ferro: altos-fornos com carvão; alumínio: eletrólise da bauxita.",
      "Aço = Fe + C; bronze = Cu + Sn; latão = Cu + Zn.",
      "Reciclar alumínio gasta só ~5% da energia.",
    ],
    [
      ["Liga metálica", "Mistura de metais ou de metal com outro elemento."],
      ["Metalurgia", "Conjunto de processos para extrair e trabalhar metais."],
      ["Ductilidade", "Capacidade de um metal ser transformado em fios."],
    ],
    [
      ["O aço é uma liga formada principalmente por:", ["cobre e zinco", "ferro e carbono", "cobre e estanho", "alumínio e cromo", "ouro e prata"], 1, "Mais resistente que o ferro."],
      ["O bronze é formado por:", ["cobre e estanho", "ferro e níquel", "cobre e zinco", "chumbo e mercúrio", "alumínio e cobre"], 0, "Estátuas e sinos."],
      ["Os metais conduzem bem eletricidade por causa:", ["das ligações iônicas", "dos elétrons livres da ligação metálica", "dos nêutrons", "da sua cor", "da densidade baixa"], 1, "Mar de elétrons."],
      ["Reciclar latas de alumínio é muito vantajoso porque:", ["o alumínio é raro", "economiza grande parte da energia gasta na eletrólise da bauxita", "as latas são pesadas", "o alumínio enferruja", "não há bauxita no Brasil"], 1, "Cerca de 95% de economia."],
      ["O aço inoxidável resiste à corrosão por conter:", ["chumbo", "cromo e níquel", "enxofre", "estanho apenas", "mercúrio"], 1, "Camada protetora."],
    ],
    [["Por que as ligas metálicas são tão usadas no lugar dos metais puros? Dê um exemplo.", "Porque as ligas têm propriedades melhores que os metais puros, como mais resistência ou resistência à corrosão; o aço inoxidável, por exemplo, une ferro, carbono, cromo e níquel e não enferruja, sendo usado em talheres e pias."]],
  ),
  aula(
    "Produtos de limpeza: química e segurança em casa",
    `## A química da faxina

Produtos de limpeza são **soluções** de substâncias com funções específicas. Conhecer sua química evita **acidentes**.

## Principais produtos

- **Água sanitária:** solução de **hipoclorito de sódio** (NaClO); **desinfeta** (mata micro-organismos) e **alveja** (branqueia), por ser **oxidante**.
- **Detergente** e **sabão:** **tensoativos** que removem gordura (moléculas com parte polar e parte apolar formando micelas).
- **Desengordurantes e limpa-forno:** **bases fortes** como a **soda cáustica** (NaOH), que reagem com gorduras (saponificação). Corrosivos para a pele.
- **Limpa-vidros:** geralmente com **amônia** ou álcool.
- **Vinagre** (ácido acético) e **bicarbonato de sódio** (base fraca): removem manchas e odores; juntos produzem **CO₂** (efervescência).
- **Álcool 70%:** desinfetante; mais eficiente que o 96% porque a água ajuda a penetrar nas células dos micro-organismos (e evapora mais devagar).
- **Removedores de ferrugem:** ácidos (como ácido muriático, HCl diluído).

## Misturas perigosas — NUNCA faça

- **Água sanitária + amônia** (alguns limpa-vidros, urina): forma **cloraminas**, gases tóxicos que irritam os pulmões.
- **Água sanitária + ácidos** (vinagre, removedores de ferrugem, alguns limpadores de vaso): libera **gás cloro (Cl₂)**, muito tóxico (já foi usado como arma química).
- **Água sanitária + álcool:** pode formar **clorofórmio** e outros compostos tóxicos.
- **Produtos diferentes no mesmo recipiente** ou "misturinhas caseiras" para "potencializar": arriscado.

## Cuidados

- Ler o **rótulo** e os **símbolos de risco** (corrosivo, inflamável, tóxico).
- Usar **luvas** e ambientes **ventilados**.
- Guardar fora do alcance de **crianças** e nunca em garrafas de bebida.
- Não reaproveitar embalagens.
- Em caso de acidente: lavar com água corrente e procurar o **CIATox** ou atendimento médico.

## Impacto ambiental

- Detergentes **não biodegradáveis** e com **fosfatos** contribuem para a **espuma** e a **eutrofização** dos rios.
- Preferir produtos **biodegradáveis** e usar a quantidade indicada.
- **Óleo de cozinha** usado não deve ir para a pia: pode ser reciclado em **sabão**.

## Resumindo

Água sanitária (hipoclorito) desinfeta e alveja; soda cáustica é base forte; detergentes removem gordura. Nunca misture água sanitária com amônia, ácidos ou álcool (gases tóxicos). Use luvas, ventilação e leia o rótulo. Prefira produtos biodegradáveis.`,
    [
      "Água sanitária = hipoclorito de sódio: desinfeta e alveja.",
      "Nunca misture água sanitária com amônia, ácidos ou álcool.",
      "Álcool 70% desinfeta melhor que o 96%.",
      "Leia o rótulo, use luvas e prefira produtos biodegradáveis.",
    ],
    [
      ["Hipoclorito de sódio", "Substância ativa da água sanitária, oxidante e desinfetante."],
      ["Tensoativo", "Substância que reduz a tensão superficial e remove gordura, como o detergente."],
      ["Cloramina", "Gás tóxico formado pela mistura de água sanitária com amônia."],
    ],
    [
      ["O componente ativo da água sanitária é o:", ["cloreto de sódio", "hipoclorito de sódio", "hidróxido de sódio", "ácido acético", "bicarbonato de sódio"], 1, "NaClO."],
      ["Misturar água sanitária com um produto ácido é perigoso porque:", ["forma sabão", "libera gás cloro, muito tóxico", "neutraliza tudo sem risco", "produz água pura", "aumenta o perfume"], 1, "Dica: Cl₂."],
      ["O álcool 70% é mais eficiente como desinfetante que o 96% porque:", ["é mais forte", "a água ajuda a penetrar nos micro-organismos e evapora mais devagar", "é mais barato", "não evapora", "tem mais álcool"], 1, "Ação prolongada."],
      ["A soda cáustica (NaOH) é:", ["um ácido fraco", "uma base forte e corrosiva", "um sal neutro", "um gás", "um detergente biodegradável"], 1, "Usada em desentupidores."],
      ["Vinagre com bicarbonato produz efervescência por causa da liberação de:", ["oxigênio", "gás carbônico", "cloro", "hidrogênio", "amônia"], 1, "Reação ácido-base."],
    ],
    [["Por que é perigoso misturar produtos de limpeza diferentes \"para limpar melhor\"?", "Porque algumas misturas reagem e liberam gases tóxicos: água sanitária com amônia forma cloraminas e com ácidos libera gás cloro, que podem causar graves problemas respiratórios e até intoxicações fatais."]],
  ),
  aula(
    "Estequiometria aplicada: pureza, rendimento e reagente limitante",
    `## Cálculos com reações reais

Na vida real (indústria, laboratório), os reagentes **não são 100% puros** e as reações **não rendem 100%**. A estequiometria precisa levar isso em conta.

## Revisão: proporção em mols

A equação balanceada indica a **proporção** entre as quantidades:

**2 H₂ + O₂ → 2 H₂O** → 2 mol de H₂ reagem com 1 mol de O₂ e formam 2 mol de água.

Use as **massas molares** para passar de mol para gramas (H₂ = 2 g/mol; O₂ = 32 g/mol; H₂O = 18 g/mol).

## Pureza

Se uma amostra tem **80% de pureza**, só 80% da massa é a substância que reage.

**Exemplo:** 100 g de calcário com 80% de CaCO₃ → apenas **80 g** de CaCO₃ participam da reação.

CaCO₃ → CaO + CO₂ (100 g/mol → 56 g/mol + 44 g/mol)

80 g de CaCO₃ produzem: 80 × 56/100 = **44,8 g de CaO** (cal).

## Rendimento

**Rendimento = (quantidade obtida ÷ quantidade teórica) × 100**

Se a teoria previa 44,8 g de CaO, mas a reação rendeu **90%**: 44,8 × 0,9 ≈ **40,3 g**.

Perdas ocorrem por reações paralelas, reagentes que não reagem completamente, perdas no processo.

## Reagente limitante e em excesso

Quando os reagentes não estão na proporção exata:

- **Reagente limitante:** o que **acaba primeiro** e determina quanto produto se forma.
- **Reagente em excesso:** sobra.

**Exemplo:** 4 mol de H₂ e 1 mol de O₂ (proporção necessária 2 : 1).

- 1 mol de O₂ precisa de 2 mol de H₂. Temos 4 → **sobram 2 mol de H₂** (excesso).
- O **O₂ é o limitante**. Formam-se **2 mol de H₂O**.

Analogia: com 10 pães e 4 fatias de queijo, fazendo sanduíches de 2 pães + 1 queijo, você faz só **4** sanduíches (o queijo limita) e sobram 2 pães.

## Volume de gases

Nas CNTP, **1 mol** de qualquer gás ocupa cerca de **22,4 L** (útil em questões sobre CO₂ liberado).

## Aplicações

- Quanto CO₂ um carro emite por litro de gasolina.
- Quanto adubo ou calcário aplicar.
- Quanto medicamento produzir.
- Quanto minério é necessário para obter certa massa de metal.

## Resumindo

Considere a pureza (só a parte pura reage) e o rendimento (obtido ÷ teórico). O reagente limitante acaba primeiro e define o produto; o outro fica em excesso. 1 mol de gás nas CNTP ≈ 22,4 L.`,
    [
      "Pureza: só a parte pura da amostra reage.",
      "Rendimento = obtido ÷ teórico × 100.",
      "Reagente limitante acaba primeiro e define o produto.",
      "1 mol de gás nas CNTP ≈ 22,4 L.",
    ],
    [
      ["Grau de pureza", "Porcentagem da amostra que corresponde à substância de interesse."],
      ["Rendimento", "Relação entre o produto obtido e o previsto pela teoria."],
      ["Reagente limitante", "Reagente que é totalmente consumido e limita a reação."],
    ],
    [
      ["200 g de um minério com 60% de pureza contêm da substância de interesse:", ["60 g", "120 g", "200 g", "140 g", "80 g"], 1, "0,6 × 200."],
      ["Uma reação deveria produzir 50 g, mas produziu 40 g. O rendimento foi:", ["40%", "80%", "90%", "125%", "50%"], 1, "40 ÷ 50."],
      ["Na reação 2 H₂ + O₂ → 2 H₂O, com 6 mol de H₂ e 2 mol de O₂, o reagente limitante é:", ["H₂", "O₂", "H₂O", "nenhum", "ambos igualmente"], 1, "2 mol de O₂ precisam de 4 de H₂."],
      ["No mesmo caso, sobram de H₂:", ["0 mol", "2 mol", "4 mol", "1 mol", "6 mol"], 1, "6 − 4."],
      ["Nas CNTP, 2 mol de CO₂ ocupam cerca de:", ["22,4 L", "44,8 L", "11,2 L", "2 L", "88 L"], 1, "2 × 22,4."],
    ],
    [["Explique o que é reagente limitante usando uma analogia do cotidiano.", "É o reagente que acaba primeiro e determina quanto produto pode ser formado; como ao fazer sanduíches com 2 pães e 1 fatia de queijo: com 10 pães e 4 fatias, só se fazem 4 sanduíches, porque o queijo acaba primeiro, e sobram pães."]],
  ),
  aula(
    "Fertilizantes, agrotóxicos e química do solo",
    `## Nutrientes para as plantas

As plantas precisam de **macronutrientes** em maior quantidade:

- **N (nitrogênio):** crescimento das folhas, proteínas e clorofila.
- **P (fósforo):** raízes, flores, frutos, energia (ATP).
- **K (potássio):** resistência, qualidade dos frutos, controle da água.

Os **fertilizantes NPK** trazem esses três elementos (o rótulo "10-10-10" indica as porcentagens). Também há **micronutrientes** (ferro, zinco, boro) e Ca, Mg e S.

## Fertilizantes químicos e orgânicos

- **Químicos (minerais):** ureia, nitrato de amônio, superfosfato, cloreto de potássio. Agem rápido, mas o excesso **escorre** para rios e lagos.
- **Orgânicos:** esterco, **compostagem** (restos de alimentos decompostos), adubação verde (plantas que fixam nitrogênio, como o **feijão** e outras leguminosas, com bactérias nas raízes).

## O processo Haber-Bosch

A produção industrial de **amônia** (N₂ + 3 H₂ → 2 NH₃), a partir do nitrogênio do ar, permitiu fabricar fertilizantes em larga escala e alimentar bilhões de pessoas — mas consome muita energia (gás natural).

O Brasil **importa** grande parte dos fertilizantes que usa (dependência externa).

## Problemas do excesso de fertilizantes

- **Eutrofização:** nitrogênio e fósforo nos rios causam proliferação de **algas**, falta de **oxigênio** e morte de peixes.
- **Contaminação** de águas subterrâneas por nitrato.
- Emissão de **óxido nitroso** (gás de efeito estufa).

## Agrotóxicos (defensivos agrícolas)

- Substâncias para combater **pragas** (inseticidas), **plantas daninhas** (herbicidas) e **fungos** (fungicidas).
- O Brasil é um dos **maiores consumidores** de agrotóxicos do mundo.
- Riscos: **intoxicação** de trabalhadores rurais, resíduos em **alimentos** e na **água**, morte de **abelhas** e outros polinizadores, **bioacumulação** (como o antigo **DDT**, hoje proibido).
- Alguns são proibidos em outros países e ainda usados no Brasil (debate frequente).

## Alternativas

- **Controle biológico** (inimigos naturais das pragas).
- **Agroecologia** e produção **orgânica**.
- **Manejo integrado de pragas** (usar agrotóxico só quando necessário).
- Rotação de culturas, adubação verde, compostagem.
- Uso de **EPI** (equipamento de proteção individual) e respeito ao período de carência antes da colheita.

## Resumindo

N, P e K são macronutrientes (fertilizantes NPK). Leguminosas fixam nitrogênio. O processo Haber-Bosch produz amônia. O excesso de fertilizantes causa eutrofização. Agrotóxicos combatem pragas, mas intoxicam pessoas e matam polinizadores; controle biológico e agroecologia são alternativas.`,
    [
      "Macronutrientes: N (folhas), P (raízes/flores), K (resistência).",
      "Leguminosas fixam nitrogênio com bactérias das raízes.",
      "Excesso de fertilizantes causa eutrofização.",
      "Agrotóxicos intoxicam e matam abelhas; controle biológico é alternativa.",
    ],
    [
      ["Fertilizante NPK", "Adubo que fornece nitrogênio, fósforo e potássio."],
      ["Compostagem", "Decomposição controlada de restos orgânicos para produzir adubo."],
      ["Agrotóxico", "Produto químico usado para combater pragas, doenças e plantas daninhas."],
    ],
    [
      ["As letras NPK nos fertilizantes significam:", ["nitrogênio, potássio e cálcio", "nitrogênio, fósforo e potássio", "níquel, prata e potássio", "nitrato, fosfato e carbono", "neônio, fósforo e criptônio"], 1, "Macronutrientes."],
      ["Plantas como o feijão enriquecem o solo com nitrogênio porque:", ["absorvem nitrogênio do solo e o destroem", "têm bactérias nas raízes que fixam o nitrogênio do ar", "produzem fósforo", "liberam potássio", "não precisam de água"], 1, "Leguminosas."],
      ["O excesso de fertilizantes que chega aos rios provoca:", ["aumento do oxigênio", "eutrofização", "chuva ácida", "inversão térmica", "salinização marinha"], 1, "Algas e falta de O₂."],
      ["Um impacto dos agrotóxicos sobre a biodiversidade é:", ["aumento das abelhas", "morte de polinizadores como as abelhas", "melhora da água", "fim das pragas para sempre", "aumento dos peixes"], 1, "Polinizadores ameaçados."],
      ["O processo Haber-Bosch produz:", ["petróleo", "amônia para fertilizantes", "aço", "etanol", "plástico"], 1, "N₂ + 3 H₂ → 2 NH₃."],
    ],
    [["Explique como o uso excessivo de fertilizantes pode causar a morte de peixes em lagos.", "O excesso de nitrogênio e fósforo é levado pela chuva aos lagos e provoca proliferação de algas; quando elas morrem, bactérias as decompõem consumindo muito oxigênio da água, e os peixes morrem por falta de oxigênio (eutrofização)."]],
  ),
  aula(
    "Fermentação e conservação de alimentos",
    `## Fermentação

A **fermentação** é um processo **anaeróbio** (sem oxigênio) em que **micro-organismos** (leveduras, bactérias) transformam açúcares em outras substâncias, liberando energia.

## Tipos

- **Fermentação alcoólica:** **leveduras** (fungos, como *Saccharomyces cerevisiae*) transformam açúcar em **etanol** e **CO₂**:
  C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂
  - **Pão:** o **CO₂** forma bolhas que fazem a massa **crescer**; o álcool evapora no forno.
  - **Bebidas alcoólicas** (cerveja, vinho, cachaça) e **etanol combustível** (da cana-de-açúcar).
- **Fermentação lática:** **bactérias** (lactobacilos) transformam açúcar em **ácido lático**.
  - **Iogurte**, **queijos**, **coalhada**, picles, chucrute.
  - Também ocorre nos **músculos** humanos em exercício intenso, com falta de oxigênio.
- **Fermentação acética:** bactérias transformam o etanol em **ácido acético** → **vinagre** (por isso vinho aberto vira vinagre).

## Por que os alimentos estragam

Micro-organismos (bactérias e fungos) e **enzimas** do próprio alimento degradam nutrientes. Eles precisam de **água**, **temperatura adequada**, **nutrientes** e, muitos, de **oxigênio**.

## Métodos de conservação

A conservação atua **retirando** algo de que os micro-organismos precisam:

- **Frio (geladeira e congelador):** **reduz** a atividade de micro-organismos e enzimas (não os mata).
- **Calor:**
  - **Pasteurização:** aquecimento moderado e resfriamento rápido (leite, sucos); elimina a maioria dos micro-organismos sem alterar muito o sabor.
  - **Esterilização / UHT (longa vida):** temperatura alta por pouco tempo.
  - **Cozimento.**
- **Retirada de água:**
  - **Desidratação** (frutas secas, leite em pó).
  - **Salga** (carne-seca, bacalhau) e **açúcar** em excesso (doces em calda, geleias): por **osmose**, retiram água das células dos micro-organismos.
- **Defumação.**
- **Acidificação:** vinagre (picles), o pH baixo inibe micro-organismos.
- **Embalagem a vácuo** ou com atmosfera modificada (sem oxigênio).
- **Aditivos químicos (conservantes):** como nitritos em embutidos, sorbatos; devem ser usados dentro dos limites legais.
- **Irradiação:** com radiação gama (o alimento **não fica radioativo**).

## Segurança alimentar

- **Botulismo:** toxina produzida por bactéria anaeróbia em conservas mal feitas (latas **estufadas** devem ser descartadas).
- Respeitar a **validade** e a **cadeia do frio**.

## Resumindo

Fermentação alcoólica (leveduras: etanol + CO₂) faz o pão crescer e produz bebidas e etanol. Lática (bactérias: ácido lático) faz iogurte. Acética faz vinagre. Conservar = tirar o que os micro-organismos precisam: frio, calor (pasteurização), retirar água (sal, açúcar), acidificar, vácuo.`,
    [
      "Fermentação alcoólica: leveduras produzem etanol e CO₂ (pão cresce).",
      "Fermentação lática: bactérias produzem ácido lático (iogurte).",
      "Fermentação acética: etanol vira vinagre.",
      "Conservar: frio, pasteurização, sal/açúcar (osmose), vácuo, acidez.",
    ],
    [
      ["Fermentação", "Processo anaeróbio em que micro-organismos transformam açúcares em outras substâncias."],
      ["Pasteurização", "Aquecimento moderado seguido de resfriamento para eliminar micro-organismos."],
      ["Osmose", "Passagem de água através de membrana para o meio mais concentrado."],
    ],
    [
      ["O pão cresce durante a fermentação por causa da liberação de:", ["oxigênio", "gás carbônico", "ácido lático", "vapor de álcool apenas", "nitrogênio"], 1, "Bolhas na massa."],
      ["O iogurte é produzido por fermentação:", ["alcoólica", "lática", "acética", "aeróbia completa", "nuclear"], 1, "Lactobacilos."],
      ["Um vinho deixado aberto vira vinagre por causa da fermentação:", ["lática", "acética", "alcoólica", "anaeróbia do pão", "da levedura do pão"], 1, "Etanol → ácido acético."],
      ["A carne-seca se conserva porque o sal:", ["mata as bactérias por calor", "retira água das células dos micro-organismos por osmose", "adiciona oxigênio", "aumenta a umidade", "torna a carne radioativa"], 1, "Desidratação."],
      ["A geladeira conserva os alimentos porque:", ["mata todos os micro-organismos", "reduz a atividade dos micro-organismos e das enzimas", "esteriliza", "remove a água", "acidifica"], 1, "Não os elimina."],
    ],
    [["Explique como a adição de sal ou de açúcar em grande quantidade ajuda a conservar alimentos.", "O sal ou o açúcar deixam o meio muito concentrado; por osmose, a água sai das células dos micro-organismos, que ficam desidratados e não conseguem se multiplicar, conservando o alimento."]],
  ),
  aula(
    "Química verde e sustentabilidade",
    `## O que é química verde

A **química verde** (ou química sustentável) propõe **planejar** produtos e processos químicos que **reduzam ou eliminem** substâncias perigosas e o desperdício, desde a origem.

A ideia central: é melhor **prevenir** a poluição do que tratá-la depois.

## Alguns dos 12 princípios

1. **Prevenção:** evitar a formação de resíduos.
2. **Economia de átomos:** aproveitar ao máximo os átomos dos reagentes no produto final (menos subprodutos).
3. **Síntese menos perigosa:** usar e gerar substâncias pouco tóxicas.
4. **Produtos mais seguros**, eficientes e pouco tóxicos.
5. **Solventes mais seguros:** preferir **água** ou solventes não tóxicos.
6. **Eficiência energética:** reações em temperatura e pressão ambientes.
7. **Matérias-primas renováveis:** biomassa em vez de petróleo.
8. **Catálise:** catalisadores aceleram reações e reduzem energia e resíduos.
9. **Produtos degradáveis:** que se decomponham sem prejudicar o ambiente.
10. **Monitoramento em tempo real** para evitar poluição.
11. **Prevenção de acidentes** (explosões, vazamentos, incêndios).

## Exemplos práticos

- **Bioplásticos** de cana-de-açúcar ou milho (o **"plástico verde"** de etanol de cana produzido no Brasil — renovável, mas não necessariamente biodegradável).
- **Biocombustíveis** (etanol, biodiesel).
- Uso de **CO₂ supercrítico** como solvente (descafeinação do café).
- **Enzimas** em processos industriais (menos energia).
- **Detergentes biodegradáveis**.
- Reaproveitamento de **resíduos agroindustriais** (bagaço de cana gerando energia e etanol de 2ª geração).

## Economia circular

Em vez do modelo **linear** (extrair → produzir → descartar), a **economia circular** busca **reutilizar**, **reparar**, **reciclar** e transformar resíduos em recursos.

## Política Nacional de Resíduos Sólidos (2010)

- Ordem de prioridade: **não gerar → reduzir → reutilizar → reciclar → tratar → disposição final** adequada.
- **Logística reversa:** fabricantes devem recolher produtos como pilhas, baterias, pneus, eletrônicos, embalagens de agrotóxicos e lâmpadas.
- Fim dos **lixões** e inclusão dos **catadores**.

## Resumindo

A química verde previne a poluição desde o planejamento: economia de átomos, solventes seguros, matérias-primas renováveis, catalisadores e produtos degradáveis. A economia circular reaproveita recursos. A PNRS prioriza não gerar e reduzir resíduos e criou a logística reversa.`,
    [
      "Química verde: prevenir a poluição desde a origem.",
      "Economia de átomos, solventes seguros e matérias-primas renováveis.",
      "Economia circular: reutilizar, reparar e reciclar.",
      "PNRS (2010): não gerar → reduzir → reutilizar → reciclar; logística reversa.",
    ],
    [
      ["Química verde", "Planejamento de processos químicos que reduzem resíduos e substâncias perigosas."],
      ["Economia de átomos", "Aproveitamento máximo dos átomos dos reagentes no produto desejado."],
      ["Logística reversa", "Retorno de produtos usados ao fabricante para reaproveitamento ou descarte correto."],
    ],
    [
      ["O princípio central da química verde é:", ["tratar a poluição depois", "prevenir a formação de resíduos e substâncias perigosas", "usar mais solventes tóxicos", "aumentar o consumo de petróleo", "eliminar a reciclagem"], 1, "Prevenção."],
      ["Usar matéria-prima renovável, como a cana, para produzir plástico é exemplo de:", ["química verde", "economia linear", "obsolescência programada", "biomagnificação", "eutrofização"], 0, "Plástico verde."],
      ["Na ordem de prioridade da PNRS, a primeira opção é:", ["reciclar", "não gerar resíduos", "queimar", "enterrar", "exportar o lixo"], 1, "Prevenção."],
      ["A logística reversa obriga fabricantes a:", ["vender mais produtos", "recolher produtos como pilhas e pneus após o uso", "fechar fábricas", "aumentar os preços", "usar só plástico"], 1, "Responsabilidade compartilhada."],
      ["Catalisadores são valorizados pela química verde porque:", ["aumentam o desperdício", "aceleram reações reduzindo energia e resíduos", "são tóxicos", "consomem os reagentes", "geram mais subprodutos"], 1, "Eficiência."],
    ],
    [["Qual a diferença entre a economia linear e a economia circular?", "Na economia linear, extraem-se recursos, fabricam-se produtos e eles são descartados depois do uso; na circular, os produtos e materiais são reutilizados, reparados e reciclados, transformando resíduos em novos recursos e reduzindo a extração."]],
  ),
  aula(
    "Gorduras, colesterol e a química dos alimentos",
    `## Lipídios na alimentação

As **gorduras** e os **óleos** são **triglicerídeos**: ésteres formados por **glicerol** e **três ácidos graxos**.

- **Gorduras** (sólidas à temperatura ambiente): geralmente de origem **animal**, ricas em ácidos graxos **saturados** (só ligações simples). Ex.: banha, manteiga.
- **Óleos** (líquidos): geralmente **vegetais**, ricos em ácidos graxos **insaturados** (com ligações **duplas**). Ex.: óleo de soja, azeite.

**Por que essa diferença de estado?** As cadeias **saturadas** são **retas** e se empilham bem (mais interações → sólidas); as **insaturadas** têm "**dobras**" nas duplas ligações (forma *cis*) e se encaixam mal (líquidas).

## Hidrogenação e gordura trans

- A **hidrogenação** adiciona **hidrogênio** às duplas ligações dos óleos vegetais, transformando-os em gorduras sólidas (**margarina**, gordura vegetal hidrogenada).
- Na hidrogenação **parcial**, formam-se **gorduras trans** (duplas ligações na forma *trans*, cadeia mais reta).
- As **gorduras trans** aumentam o **LDL** ("colesterol ruim"), reduzem o **HDL** ("bom") e elevam o risco de **doenças cardiovasculares**. No Brasil, a ANVISA **restringiu** e proibiu progressivamente seu uso industrial.

## Colesterol

- Lipídio essencial: forma **membranas** celulares, **hormônios** (como os sexuais) e a **vitamina D**.
- É produzido pelo **fígado** e também vem de alimentos de origem **animal**.
- Transportado no sangue por lipoproteínas:
  - **LDL:** leva colesterol aos tecidos; em excesso, deposita-se nas artérias (**aterosclerose**), podendo causar **infarto** e **AVC**.
  - **HDL:** retira o excesso e leva ao fígado (protetor).

## Ômega-3 e gorduras boas

Ácidos graxos **poli-insaturados** como o **ômega-3** (peixes, linhaça, castanhas) e **monoinsaturados** (azeite, abacate) estão associados à saúde cardiovascular.

## Outros conceitos de química dos alimentos

- **Rancificação:** oxidação das gorduras (sabor e cheiro ruins); antioxidantes retardam.
- **Saponificação:** gordura + base → **sabão** (reciclagem de óleo de cozinha).
- **Rótulos:** informam gorduras totais, saturadas e trans, sódio, açúcares. O Brasil adotou a **rotulagem frontal** com lupa ("alto em açúcar adicionado, gordura saturada, sódio").

## Resumindo

Gorduras saturadas (retas) são sólidas; óleos insaturados (com dobras) são líquidos. A hidrogenação parcial forma gorduras trans, que aumentam o LDL. LDL deposita colesterol nas artérias; HDL remove. Ômega-3 e azeite são gorduras benéficas.`,
    [
      "Saturadas (cadeias retas) são sólidas; insaturadas, líquidas.",
      "Hidrogenação parcial forma gordura trans, prejudicial ao coração.",
      "LDL deposita colesterol nas artérias; HDL remove.",
      "Ômega-3 e azeite são gorduras benéficas.",
    ],
    [
      ["Triglicerídeo", "Éster de glicerol com três ácidos graxos; forma óleos e gorduras."],
      ["Hidrogenação", "Adição de hidrogênio às duplas ligações dos óleos, tornando-os sólidos."],
      ["Gordura trans", "Gordura com duplas ligações na forma trans, ligada a doenças cardíacas."],
    ],
    [
      ["Óleos vegetais são líquidos à temperatura ambiente porque:", ["são saturados", "são insaturados, com dobras que dificultam o empilhamento das cadeias", "não têm carbono", "são iônicos", "são polares"], 1, "Duplas ligações cis."],
      ["A margarina pode ser produzida a partir de óleos vegetais por:", ["saponificação", "hidrogenação", "fermentação", "destilação", "eletrólise"], 1, "Adição de H₂."],
      ["As gorduras trans são prejudiciais porque:", ["aumentam o HDL", "aumentam o LDL e reduzem o HDL", "não são absorvidas", "são vitaminas", "previnem o infarto"], 1, "Risco cardiovascular."],
      ["O LDL em excesso no sangue pode causar:", ["anemia", "aterosclerose (placas nas artérias)", "escorbuto", "bócio", "raquitismo"], 1, "Infarto e AVC."],
      ["É uma fonte de ômega-3:", ["banha de porco", "peixes como sardinha e salmão", "margarina", "açúcar refinado", "refrigerante"], 1, "Gordura poli-insaturada."],
    ],
    [["Explique por que a gordura trans faz mal à saúde e por que ela aparece em alimentos industrializados.", "A gordura trans aumenta o colesterol LDL e diminui o HDL, favorecendo placas nas artérias, infarto e AVC; ela aparece porque a hidrogenação parcial de óleos vegetais dá textura e maior durabilidade aos produtos industrializados."]],
  ),
];
