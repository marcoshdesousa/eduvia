import { aula } from "./build";

/** Filosofia, lote 2: estética, ciência, liberdade, ética aplicada e outras tradições. */
export const FILOSOFIA_2 = [
  aula(
    "Estética: o que é belo e o que é arte?",
    `## A filosofia da arte

**Estética** é a área da filosofia que reflete sobre o **belo**, a **arte** e a **experiência sensível**.

## Platão: a arte como imitação

- A arte é **mímesis** (imitação) do mundo sensível, que já é uma cópia das Ideias. Portanto, a arte seria uma **cópia da cópia**, afastada da verdade.
- Desconfiava dos poetas, que despertam emoções e podem enganar.

## Aristóteles: a arte que ensina

- A imitação é **natural** ao ser humano e uma forma de **aprender**.
- A **tragédia** provoca **catarse**: purifica as emoções (medo e compaixão) do público.

## Idade Média

A beleza estava ligada a **Deus**, à ordem e à harmonia; a arte servia à **religião**.

## Kant: o juízo de gosto

- O belo agrada de forma **desinteressada** (sem desejo de possuir ou usar o objeto).
- O juízo de gosto é **subjetivo**, mas pretende **universalidade** ("isto é belo" espera a concordância dos outros).
- Distinguiu o **belo** (harmonia) do **sublime** (o grandioso que nos assusta e fascina, como uma tempestade no mar).

## Hegel

A arte é uma manifestação do **espírito** na história; cada época tem sua forma de arte.

## Século XX

- **Walter Benjamin** (*A obra de arte na era de sua reprodutibilidade técnica*): com a fotografia e o cinema, a obra perde a **"aura"** (o caráter único e original), mas a arte se **democratiza** e ganha função **política**.
- **Adorno e Horkheimer:** a **indústria cultural** transforma a arte em mercadoria padronizada.
- **Duchamp** e o ready-made: **o que torna algo arte?** O contexto, a instituição (museu), a intenção do artista?
- **Arthur Danto:** "**mundo da arte**" — algo vira arte por uma teoria e um contexto que o legitimam.

## Gosto e sociedade

**Bourdieu** mostrou que o **gosto** também é **social**: a classe dominante define o que é "bom gosto" e usa isso para se distinguir.

## Resumindo

Platão: arte como cópia da cópia. Aristóteles: catarse. Kant: belo desinteressado e universal; sublime. Benjamin: perda da aura com a reprodução técnica. Arte contemporânea questiona o que é arte.`,
    [
      "Platão: arte como cópia da cópia (mímesis).",
      "Aristóteles: a tragédia provoca catarse.",
      "Kant: o belo agrada de forma desinteressada.",
      "Benjamin: a reprodução técnica faz a obra perder a aura.",
    ],
    [
      ["Estética", "Área da filosofia que estuda o belo, a arte e a sensibilidade."],
      ["Mímesis", "Imitação; para Platão e Aristóteles, a arte imita a realidade."],
      ["Aura", "Para Benjamin, o caráter único e original da obra de arte."],
    ],
    [
      ["Para Platão, a arte é:", ["a verdade suprema", "uma cópia da cópia, afastada da verdade", "a forma de chegar às Ideias", "uma ciência", "inútil para todos"], 1, "Imitação do sensível."],
      ["Para Aristóteles, a tragédia provoca:", ["alienação", "catarse", "aura", "sublime", "distanciamento"], 1, "Purificação das emoções."],
      ["Para Kant, o belo agrada de forma:", ["interessada", "desinteressada", "útil", "comercial", "obrigatória"], 1, "Sem desejo de posse."],
      ["Walter Benjamin afirmou que a reprodução técnica (foto, cinema) faz a obra:", ["ganhar aura", "perder a aura", "virar mercadoria proibida", "ficar mais cara", "desaparecer"], 1, "Perde a unicidade."],
      ["O ready-made de Duchamp levanta a questão:", ["do preço das obras", "do que torna algo arte", "da técnica da pintura a óleo", "da religião", "da perspectiva"], 1, "Contexto e intenção."],
    ],
    [["Explique a ideia de \"perda da aura\" de Walter Benjamin.", "Com técnicas de reprodução como a fotografia e o cinema, a obra de arte deixa de ser única e ligada a um lugar e tempo específicos, perdendo sua aura; por outro lado, a arte se democratiza e passa a ter função política."]],
  ),
  aula(
    "Popper e Kuhn: como a ciência muda",
    `## O que torna uma teoria científica?

## O método indutivo e seus problemas

Muitos pensavam que a ciência parte da **observação** de casos e chega a **leis gerais** (**indução**). Mas **Hume** já mostrava que nenhuma quantidade de casos garante uma lei universal: ver mil cisnes brancos não prova que **todos** são brancos.

## Karl Popper: falseabilidade

- Uma teoria é **científica** se puder ser **falseada**, ou seja, se for possível imaginar um teste que a mostre **falsa**.
- "Todos os cisnes são brancos" é científica: basta encontrar **um cisne negro** para refutá-la.
- Teorias que explicam **tudo** e não podem ser testadas (como astrologia) **não** são científicas.
- A ciência avança por **conjecturas e refutações**: propomos hipóteses ousadas e tentamos derrubá-las; as que resistem são aceitas **provisoriamente**.
- O conhecimento científico é sempre **provisório**, nunca uma verdade definitiva.

## Thomas Kuhn: paradigmas e revoluções

Em *A Estrutura das Revoluções Científicas* (1962):

- **Paradigma:** conjunto de teorias, métodos e valores aceitos pela comunidade científica numa época.
- **Ciência normal:** cientistas resolvem problemas **dentro** do paradigma.
- **Anomalias:** fatos que o paradigma não consegue explicar se acumulam e geram **crise**.
- **Revolução científica:** um novo paradigma substitui o antigo. Ex.: do **geocentrismo** (Ptolomeu) ao **heliocentrismo** (Copérnico, Galileu); da física de **Newton** à **relatividade** de Einstein.
- A mudança de paradigma envolve também fatores **históricos e sociais**, não só lógicos.

## A Revolução Científica (séculos XVI e XVII)

- **Copérnico:** heliocentrismo.
- **Galileu:** uso do **telescópio** e da **experimentação**; condenado pela Inquisição.
- **Francis Bacon:** método experimental e indutivo; "**saber é poder**".
- **Descartes:** método racional.
- **Newton:** síntese da física (gravitação universal).

## Ciência e sociedade

- A ciência não é neutra: é influenciada por interesses econômicos, políticos e culturais.
- O **negacionismo** científico (negar vacinas, mudanças climáticas) ignora o método e o consenso científico.

## Resumindo

Popper: uma teoria é científica se for falseável; o conhecimento é provisório. Kuhn: a ciência muda por revoluções que substituem paradigmas. A Revolução Científica trouxe heliocentrismo e experimentação.`,
    [
      "Popper: teoria científica precisa ser falseável.",
      "O conhecimento científico é sempre provisório.",
      "Kuhn: ciência normal, anomalias, crise e revolução de paradigma.",
      "Do geocentrismo ao heliocentrismo: exemplo de revolução científica.",
    ],
    [
      ["Falseabilidade", "Possibilidade de uma teoria ser testada e mostrada falsa."],
      ["Paradigma", "Conjunto de teorias e métodos aceitos pela comunidade científica numa época."],
      ["Revolução científica", "Substituição de um paradigma por outro."],
    ],
    [
      ["Para Popper, uma teoria é científica quando:", ["explica tudo", "pode ser falseada por testes", "é aceita pela maioria", "é antiga", "foi revelada"], 1, "Critério de demarcação."],
      ["Encontrar um cisne negro refuta a afirmação \"todos os cisnes são brancos\". Isso ilustra:", ["a indução", "a falseabilidade", "o paradigma", "a dedução religiosa", "o dogmatismo"], 1, "Um caso contrário basta."],
      ["Para Kuhn, a passagem do geocentrismo ao heliocentrismo foi:", ["ciência normal", "uma revolução científica (mudança de paradigma)", "uma anomalia sem efeito", "um erro", "um mito"], 1, "Novo paradigma."],
      ["\"Saber é poder\" é frase de:", ["Francis Bacon", "Popper", "Kuhn", "Platão", "Nietzsche"], 0, "Método experimental."],
      ["Para Kuhn, as crises na ciência surgem quando:", ["não há cientistas", "se acumulam anomalias que o paradigma não explica", "o paradigma explica tudo", "a sociedade aprova", "há muitas verdades"], 1, "Anomalias."],
    ],
    [["Explique o critério de falseabilidade de Karl Popper.", "Para Popper, uma teoria só é científica se puder ser testada e, em princípio, mostrada falsa por algum experimento ou observação; teorias que explicam tudo e não podem ser refutadas não são científicas, e as aceitas são sempre provisórias."]],
  ),
  aula(
    "Hegel e a dialética",
    `## Georg W. F. Hegel (1770–1831)

Filósofo alemão do **idealismo**, um dos mais influentes da filosofia moderna. Para ele, a **realidade** e a **história** são um processo em constante **movimento** e **transformação**, guiado pela **razão** (o **Espírito**).

## A dialética

**Dialética** é o movimento pelo qual a realidade e o pensamento se desenvolvem por meio de **contradições**:

1. **Tese:** uma afirmação ou situação.
2. **Antítese:** sua negação ou oposição.
3. **Síntese:** a superação da contradição, que conserva elementos das duas e cria algo novo — que se torna uma nova tese.

(Hegel usava o termo **Aufhebung**, "superação", que significa ao mesmo tempo negar, conservar e elevar.)

Ex.: o botão de uma flor é negado pela flor, que é negada pelo fruto; cada etapa supera e conserva a anterior.

## A história como progresso da liberdade

- A história tem um **sentido**: o desenvolvimento da **consciência da liberdade**.
- Cada época e cada povo expressam um momento desse desenvolvimento.
- "**Tudo o que é real é racional, e tudo o que é racional é real.**"

## A dialética do senhor e do escravo

- Na *Fenomenologia do Espírito*, Hegel descreve a luta entre duas consciências por **reconhecimento**.
- O **senhor** domina, mas depende do trabalho do **escravo**.
- O escravo, pelo **trabalho**, transforma a natureza e a si mesmo, ganhando **consciência**; o senhor fica dependente.
- Essa ideia influenciou muito **Marx** e teorias sobre reconhecimento e opressão.

## Marx e a dialética materialista

- **Marx** usou a dialética, mas a "**inverteu**": em vez de as ideias moverem a história, são as **condições materiais** (economia, luta de classes) que a movem — o **materialismo histórico e dialético**.

## Dialética hoje

O termo é usado para pensar **contradições** sociais e históricas: progresso e destruição, liberdade e dominação, tecnologia que aproxima e isola.

## Resumindo

Para Hegel, a realidade se move por contradições (tese, antítese, síntese) e a história é o progresso da consciência da liberdade. A dialética do senhor e do escravo influenciou Marx, que criou a dialética materialista.`,
    [
      "Dialética: tese, antítese e síntese.",
      "A história é o progresso da consciência da liberdade.",
      "Senhor e escravo: o trabalho gera consciência.",
      "Marx inverteu Hegel: dialética materialista.",
    ],
    [
      ["Dialética", "Movimento de transformação por meio de contradições e sua superação."],
      ["Idealismo", "Corrente que vê as ideias ou o espírito como base da realidade."],
      ["Síntese", "Superação de uma contradição, que conserva e transforma os opostos."],
    ],
    [
      ["Na dialética hegeliana, a superação da contradição entre tese e antítese gera a:", ["anomia", "síntese", "mímesis", "catarse", "aura"], 1, "Novo momento."],
      ["Para Hegel, a história é:", ["um ciclo sem sentido", "o progresso da consciência da liberdade", "obra do acaso", "repetição eterna", "a vontade dos reis apenas"], 1, "Sentido racional."],
      ["Na dialética do senhor e do escravo, o escravo ganha consciência por meio:", ["da guerra", "do trabalho", "da religião", "da riqueza", "do ócio"], 1, "Transforma a natureza e a si."],
      ["Marx \"inverteu\" Hegel ao afirmar que a história é movida:", ["pelas ideias", "pelas condições materiais e pela luta de classes", "pelos deuses", "pelos heróis", "pela natureza apenas"], 1, "Materialismo histórico."],
      ["\"Tudo o que é real é racional\" é uma frase de:", ["Hegel", "Hume", "Sartre", "Maquiavel", "Popper"], 0, "Idealismo alemão."],
    ],
    [["Explique a dialética com um exemplo do cotidiano ou da história.", "A dialética é o movimento em que uma situação (tese) gera sua oposição (antítese) e o conflito é superado numa síntese nova; por exemplo, o feudalismo gerou a burguesia, que entrou em conflito com a nobreza e levou à sociedade capitalista."]],
  ),
  aula(
    "Liberdade e determinismo",
    `## Somos realmente livres?

Uma das questões mais antigas da filosofia: nossas escolhas são **livres** ou são **determinadas** por causas que não controlamos (natureza, genes, sociedade, Deus)?

## Determinismo

- Tudo o que acontece tem uma **causa**, e as mesmas causas produzem os mesmos efeitos.
- **Espinosa:** os seres humanos se julgam livres porque **conhecem suas ações**, mas **ignoram as causas** que as determinam (como uma pedra que, se tivesse consciência, acharia que cai porque quer).
- **Determinismo biológico:** genes e cérebro explicariam o comportamento.
- **Determinismo social:** classe, cultura e educação moldam as escolhas (a sociologia mostra **condicionamentos**).
- O **Naturalismo** literário (O Cortiço) expressava uma visão determinista.

## Livre-arbítrio

- **Santo Agostinho:** Deus deu ao ser humano o **livre-arbítrio**, a capacidade de escolher entre o bem e o mal; o mal moral vem do mau uso dessa liberdade.
- **Kant:** a liberdade é a **autonomia** da razão, que dá a lei a si mesma; sem liberdade, não haveria **responsabilidade moral**.

## Existencialismo: liberdade radical

- **Sartre:** "**O homem está condenado a ser livre**." Não temos essência prévia; somos aquilo que fazemos de nós. Somos **responsáveis** por todas as escolhas, e culpar as circunstâncias é **má-fé**.
- "Não importa o que fizeram de nós, mas o que fazemos com o que fizeram de nós."

## Compatibilismo

- Liberdade e determinação podem **conviver**: somos livres quando agimos conforme nossa vontade, **sem coação externa**, mesmo que essa vontade tenha causas.
- **Hume** e outros defendem algo assim.

## Liberdade política

- **Liberdade negativa:** ausência de impedimentos (ninguém me proíbe).
- **Liberdade positiva:** ter **condições reais** de realizar escolhas (educação, renda, saúde).
- **Rousseau:** "O homem nasce livre, e por toda parte encontra-se a ferros."

## Por que isso importa

Se não houvesse liberdade, **elogio, culpa, punição** e **responsabilidade** perderiam sentido. Mas reconhecer os **condicionamentos sociais** ajuda a entender desigualdades e a pensar políticas públicas.

## Resumindo

O determinismo diz que tudo tem causas (Espinosa). O livre-arbítrio afirma a capacidade de escolher (Agostinho, Kant). Sartre defende liberdade radical e responsabilidade. O compatibilismo une liberdade e causalidade.`,
    [
      "Determinismo: tudo tem causas (Espinosa).",
      "Livre-arbítrio: escolher entre o bem e o mal (Agostinho).",
      "Sartre: condenados a ser livres e responsáveis.",
      "Liberdade negativa (sem impedimentos) x positiva (condições reais).",
    ],
    [
      ["Determinismo", "Visão de que todos os acontecimentos são causados por fatores anteriores."],
      ["Livre-arbítrio", "Capacidade de escolher livremente entre alternativas."],
      ["Compatibilismo", "Posição de que liberdade e determinismo podem coexistir."],
    ],
    [
      ["Para Espinosa, os seres humanos se julgam livres porque:", ["são realmente livres", "conhecem suas ações, mas ignoram as causas que as determinam", "Deus os fez livres", "não têm desejos", "são racionais"], 1, "Ignorância das causas."],
      ["Para Sartre, culpar as circunstâncias pelas próprias escolhas é:", ["autenticidade", "má-fé", "virtude", "determinismo científico", "catarse"], 1, "Fuga da responsabilidade."],
      ["Santo Agostinho explica o mal moral como resultado:", ["da vontade de Deus", "do mau uso do livre-arbítrio", "da natureza", "do destino", "da sociedade apenas"], 1, "Escolha humana."],
      ["Ter condições reais (educação, renda) para fazer escolhas corresponde à liberdade:", ["negativa", "positiva", "determinista", "absoluta", "natural"], 1, "Capacidade efetiva."],
      ["\"O homem nasce livre, e por toda parte encontra-se a ferros\" é de:", ["Rousseau", "Hobbes", "Espinosa", "Hume", "Agostinho"], 0, "Contrato Social."],
    ],
    [["Explique a frase de Sartre: \"não importa o que fizeram de nós, mas o que fazemos com o que fizeram de nós\".", "Ela reconhece que sofremos influências e condicionamentos, mas afirma que continuamos livres para escolher como reagir a eles; por isso somos responsáveis pelo que nos tornamos."]],
  ),
  aula(
    "Bioética: vida, morte e tecnologia",
    `## O que é bioética

A **bioética** reflete sobre as questões **morais** ligadas à **vida** e à **saúde**, especialmente diante dos avanços da **medicina** e da **biotecnologia**.

## Princípios da bioética

1. **Autonomia:** respeitar a decisão da pessoa sobre seu próprio corpo e tratamento (**consentimento livre e esclarecido**).
2. **Beneficência:** agir para fazer o bem ao paciente.
3. **Não maleficência:** não causar dano ("primeiro, não prejudicar").
4. **Justiça:** distribuir de forma justa os recursos e os riscos.

## Origem

Após os **experimentos nazistas** em prisioneiros, o **Código de Nuremberg** (1947) estabeleceu que pesquisas com seres humanos exigem **consentimento** voluntário. Também houve abusos como o **estudo de Tuskegee** (EUA), em que homens negros com sífilis ficaram sem tratamento.

## Grandes debates

- **Eutanásia:** abreviar a vida de um doente terminal a pedido dele (proibida no Brasil). **Ortotanásia:** não prolongar artificialmente a vida, permitindo a morte natural com **cuidados paliativos** (aceita pelo Conselho Federal de Medicina). **Distanásia:** prolongar a vida a qualquer custo, com sofrimento.
- **Aborto:** no Brasil, permitido em caso de **estupro**, **risco de vida** para a gestante e **anencefalia** (decisão do STF, 2012). Debate entre direito à vida do feto e autonomia da mulher.
- **Células-tronco embrionárias:** pesquisas autorizadas pela Lei de Biossegurança (2005) e confirmadas pelo STF.
- **Clonagem**, **edição genética** (técnica **CRISPR**): curar doenças x riscos e "eugenia".
- **Transgênicos:** produtividade x riscos ambientais e à saúde.
- **Doação de órgãos** e o comércio ilegal.
- **Testes em animais.**
- **Reprodução assistida** e barriga solidária.

## Ética e animais

- **Peter Singer** (*Libertação Animal*): critica o **especismo** (discriminar seres por sua espécie) e defende considerar o **sofrimento** dos animais.

## Hans Jonas

A **ética da responsabilidade**: o poder da tecnologia exige pensar nas **consequências** para as **gerações futuras** — "Age de tal forma que os efeitos de tua ação sejam compatíveis com a permanência de uma vida humana autêntica na Terra."

## Resumindo

Bioética: autonomia, beneficência, não maleficência e justiça. Nasceu após os abusos nazistas (Código de Nuremberg). Debates: eutanásia x ortotanásia, aborto, células-tronco, edição genética e direitos dos animais.`,
    [
      "Princípios: autonomia, beneficência, não maleficência e justiça.",
      "Código de Nuremberg (1947): consentimento em pesquisas.",
      "Ortotanásia é aceita; eutanásia é proibida no Brasil.",
      "Singer critica o especismo; Jonas propõe a ética da responsabilidade.",
    ],
    [
      ["Bioética", "Reflexão ética sobre questões da vida, da saúde e das biotecnologias."],
      ["Ortotanásia", "Não prolongar artificialmente a vida, garantindo cuidados paliativos."],
      ["Especismo", "Discriminação de seres com base em sua espécie."],
    ],
    [
      ["O princípio da autonomia, na bioética, garante:", ["que o médico decida tudo", "o respeito à decisão do paciente sobre seu tratamento", "a punição de pacientes", "o lucro dos hospitais", "a pesquisa sem consentimento"], 1, "Consentimento informado."],
      ["O Código de Nuremberg (1947) surgiu como reação:", ["à Revolução Francesa", "aos experimentos nazistas com prisioneiros", "à descoberta do DNA", "à clonagem da ovelha Dolly", "à Guerra Fria"], 1, "Abusos médicos."],
      ["Não prolongar artificialmente a vida de um doente terminal, oferecendo cuidados paliativos, é:", ["eutanásia", "ortotanásia", "distanásia", "clonagem", "eugenia"], 1, "Morte natural digna."],
      ["Peter Singer é conhecido por criticar:", ["o racismo científico apenas", "o especismo", "a democracia", "a medicina", "a arte"], 1, "Libertação Animal."],
      ["A ética da responsabilidade de Hans Jonas se preocupa principalmente com:", ["o prazer imediato", "as consequências da tecnologia para as gerações futuras", "a vontade de Deus", "o lucro", "a tradição"], 1, "Futuro da humanidade."],
    ],
    [["Explique a diferença entre eutanásia, ortotanásia e distanásia.", "Eutanásia é abreviar a vida de um doente a pedido dele; ortotanásia é não prolongar artificialmente a vida, permitindo a morte natural com cuidados paliativos; distanásia é prolongar a vida a qualquer custo, mesmo com sofrimento."]],
  ),
  aula(
    "Ética e inteligência artificial",
    `## Uma tecnologia que muda tudo

A **inteligência artificial (IA)** está em assistentes virtuais, buscadores, redes sociais, carros, diagnósticos médicos, seleção de currículos e na criação de textos e imagens. Ela traz benefícios, mas também **questões éticas** novas.

## Principais questões

### Vieses e discriminação

- Sistemas de IA aprendem com **dados do passado**, que podem conter **preconceitos**.
- Ex.: reconhecimento facial que erra mais com pessoas **negras**; algoritmos de seleção que desfavorecem mulheres.
- Isso pode **automatizar a discriminação** (o chamado **racismo algorítmico**).

### Privacidade e vigilância

- A IA depende de enormes quantidades de **dados pessoais**.
- Riscos de **vigilância** em massa (lembre de *1984*, de Orwell, e do **panóptico** de Foucault/Bentham).
- No Brasil, a **LGPD** protege os dados pessoais.

### Desinformação

- **Deepfakes** e textos falsos convincentes podem manipular eleições e destruir reputações.

### Trabalho

- **Automação** pode eliminar empregos e aumentar a **desigualdade**, exigindo requalificação e políticas sociais.

### Responsabilidade

- Se um carro autônomo causa um acidente ou uma IA erra um diagnóstico, **quem é responsável**? O programador, a empresa, o usuário?

### Autonomia e decisões

- Devemos deixar máquinas decidirem sobre **vida e morte** (armas autônomas)?
- **Transparência:** muitos sistemas são "**caixas-pretas**", difíceis de explicar.

## Contribuições filosóficas

- **Kant:** tratar as pessoas sempre como **fins**, nunca só como meios — dados e algoritmos não podem reduzir pessoas a números.
- **Utilitarismo:** avaliar as **consequências** (benefícios x danos) da IA.
- **Hans Jonas:** responsabilidade com o futuro diante do poder tecnológico.
- **Teste de Turing** (Alan Turing, 1950): uma máquina "pensa" se não conseguimos distingui-la de um humano numa conversa. Mas **imitar** a inteligência é o mesmo que **compreender**? (O filósofo **John Searle** argumentou que não, com o experimento do "quarto chinês".)

## Caminhos

**Regulação** (leis sobre IA, como as da União Europeia), auditoria de algoritmos, transparência, diversidade nas equipes que criam a IA e **educação digital**.

## Resumindo

A IA traz vieses (racismo algorítmico), riscos à privacidade, deepfakes e impactos no trabalho. Quem responde pelos erros? Kant, o utilitarismo e Jonas ajudam a pensar. Regulação e transparência são caminhos.`,
    [
      "IA pode reproduzir preconceitos dos dados (racismo algorítmico).",
      "Riscos à privacidade e à vigilância; LGPD protege dados.",
      "Deepfakes ameaçam a informação e a democracia.",
      "Teste de Turing e a pergunta: imitar é compreender?",
    ],
    [
      ["Viés algorítmico", "Tendência de um sistema de IA a produzir resultados injustos por causa dos dados ou do projeto."],
      ["Teste de Turing", "Teste que avalia se uma máquina se comporta de forma indistinguível de um humano."],
      ["Caixa-preta", "Sistema cujo funcionamento interno é difícil de explicar."],
    ],
    [
      ["O \"racismo algorítmico\" ocorre quando:", ["a IA é criada por pessoas negras", "sistemas reproduzem preconceitos presentes nos dados", "computadores são proibidos", "não há dados", "a IA é transparente"], 1, "Dados enviesados."],
      ["A lei brasileira de proteção de dados pessoais é a:", ["CLT", "LGPD", "Lei Áurea", "Lei Seca", "Lei de Cotas"], 1, "Lei 13.709/2018."],
      ["O Teste de Turing avalia se uma máquina:", ["é rápida", "se comporta de forma indistinguível de um humano numa conversa", "tem sentimentos verdadeiros", "consome pouca energia", "é barata"], 1, "Alan Turing, 1950."],
      ["Aplicando Kant à IA, conclui-se que:", ["pessoas podem ser tratadas só como dados", "pessoas devem ser tratadas como fins, não apenas como meios", "o lucro justifica tudo", "a IA deve decidir sozinha", "a ética não se aplica à tecnologia"], 1, "Dignidade humana."],
      ["Um caminho para reduzir os riscos da IA é:", ["proibir toda tecnologia", "regulação, transparência e auditoria de algoritmos", "esconder como os sistemas funcionam", "usar só dados enviesados", "eliminar leis"], 1, "Governança."],
    ],
    [["Explique como a inteligência artificial pode reproduzir discriminações.", "Os sistemas de IA aprendem com dados do passado; se esses dados refletem preconceitos sociais, como o racismo ou o machismo, a IA reproduz essas desigualdades em decisões como seleção de empregos ou reconhecimento facial."]],
  ),
  aula(
    "A felicidade na filosofia",
    `## O que é ser feliz?

Desde a Antiguidade, a felicidade é um tema central da filosofia. As respostas variam muito.

## Aristóteles: eudaimonia

- A **felicidade** (**eudaimonia**) é o **fim último** da vida humana: tudo o mais buscamos por causa dela.
- Não é um prazer passageiro, mas uma **vida plena**, realizada pela prática das **virtudes** (justo meio) e da **razão**, ao longo de toda a vida.
- Depende também da vida em comunidade (**animal político**) e de algumas condições (amigos, saúde).

## Epicuro: o prazer moderado

- A felicidade é o **prazer**, entendido como **ausência de dor** no corpo (**aponia**) e de perturbação na alma (**ataraxia**).
- Valoriza **prazeres simples**, a **amizade** e a **moderação**; evita excessos que trazem dor depois.
- Não teme a morte: "Quando ela está, nós não estamos; quando estamos, ela não está."

## Estoicos: aceitar o que não depende de nós

- **Sêneca, Epicteto, Marco Aurélio.**
- A felicidade está em viver de acordo com a **razão** e a **natureza**, controlando as **paixões**.
- Distinguir o que **depende de nós** (nossos juízos e ações) do que **não depende** (riqueza, fama, opinião alheia).
- Serenidade diante das adversidades (**apatia** = ausência de perturbação).

## Pensamento cristão medieval

- **Santo Agostinho:** a felicidade plena só se encontra em **Deus**; os bens terrenos são passageiros.

## Modernidade e contemporaneidade

- **Utilitaristas (Bentham, Mill):** a ação correta promove a **maior felicidade** para o maior número.
- **Schopenhauer:** pessimista; a vida oscila entre o **sofrimento** do desejo e o **tédio** da satisfação.
- **Nietzsche:** critica a busca de conforto; valoriza a **afirmação da vida**, inclusive da dor.
- **Sociedade de consumo:** associa felicidade à posse de bens — o que Bauman e outros criticam.
- **Byung-Chul Han:** a obrigação de ser feliz e produtivo o tempo todo gera **cansaço** e depressão.

## Resumindo

Aristóteles: felicidade como vida virtuosa (eudaimonia). Epicuro: ausência de dor e perturbação. Estoicos: aceitar o que não depende de nós. Agostinho: felicidade em Deus. Hoje, critica-se a felicidade ligada ao consumo.`,
    [
      "Aristóteles: eudaimonia, vida virtuosa e plena.",
      "Epicuro: prazer moderado, ausência de dor e de perturbação.",
      "Estoicos: aceitar o que não depende de nós.",
      "Crítica atual: felicidade ligada ao consumo e ao desempenho.",
    ],
    [
      ["Eudaimonia", "Para Aristóteles, a felicidade como vida plena e virtuosa."],
      ["Ataraxia", "Tranquilidade da alma, ausência de perturbação."],
      ["Estoicismo", "Escola que ensina a viver segundo a razão e aceitar o que não depende de nós."],
    ],
    [
      ["Para Aristóteles, a felicidade é:", ["um prazer passageiro", "o fim último, alcançado pela vida virtuosa", "a riqueza", "a fama", "impossível"], 1, "Eudaimonia."],
      ["Para Epicuro, o verdadeiro prazer é:", ["a busca de excessos", "a ausência de dor e de perturbação", "o poder político", "a dor física", "a riqueza"], 1, "Aponia e ataraxia."],
      ["\"Não sofra pelo que não depende de você\" é uma ideia:", ["epicurista", "estoica", "sofista", "utilitarista", "marxista"], 1, "Epicteto."],
      ["Para Santo Agostinho, a felicidade plena está:", ["nos bens materiais", "em Deus", "no prazer físico", "no poder", "na política"], 1, "Pensamento cristão."],
      ["Uma crítica contemporânea à busca da felicidade é que ela:", ["não existe", "foi associada ao consumo e à obrigação de desempenho", "é sempre religiosa", "é proibida", "só depende de genes"], 1, "Bauman e Byung-Chul Han."],
    ],
    [["Compare a ideia de felicidade de Epicuro com a dos estoicos.", "Para Epicuro, a felicidade é o prazer moderado, entendido como ausência de dor e de perturbação, com prazeres simples e amizade; para os estoicos, é viver segundo a razão, controlar as paixões e aceitar com serenidade o que não depende de nós."]],
  ),
  aula(
    "Filosofias africanas e latino-americanas",
    `## Para além da Europa

Por muito tempo, a história da filosofia foi contada como se só a **Europa** pensasse. Hoje, valoriza-se o pensamento de **outros povos e continentes**, combatendo o **eurocentrismo**.

## Filosofia africana

- O **Egito Antigo** já produzia reflexões éticas e cosmológicas (os ensinamentos de **Ptah-Hotep**).
- **Ubuntu** (povos bantos do sul da África): "**Eu sou porque nós somos.**" A pessoa só se realiza na **comunidade**; valoriza a solidariedade, a partilha e a dignidade de todos. Inspirou **Nelson Mandela** e **Desmond Tutu** na reconciliação após o **apartheid**.
- **Oralidade** e provérbios como forma de transmitir saberes (os **griôs**, guardiões da memória).
- Pensadores modernos: **Frantz Fanon** (*Pele Negra, Máscaras Brancas*, *Os Condenados da Terra*), que analisou os efeitos psicológicos do **colonialismo** e do racismo; **Kwame Nkrumah** e o pan-africanismo.

## Pensamento indígena

- **Bem viver** (*sumak kawsay*, *suma qamaña*, nos Andes): vida em **harmonia** com a natureza e a comunidade, em vez do acúmulo de bens. Foi incorporado às Constituições do **Equador** e da **Bolívia**, que reconhecem **direitos da natureza** (Pachamama).
- **Ailton Krenak:** critica a ideia de que a "humanidade" está separada da natureza ("Ideias para adiar o fim do mundo").
- **Davi Kopenawa** (*A Queda do Céu*): o xamã yanomami alerta para a destruição causada pelo "povo da mercadoria".

## Filosofia latino-americana

- **Enrique Dussel:** **filosofia da libertação**; a modernidade europeia teve um lado oculto, a **colonização** e a exploração da América (a "**colonialidade**").
- **Paulo Freire:** *Pedagogia do Oprimido* — educação como prática da liberdade.
- **Aníbal Quijano:** **colonialidade do poder** — a ideia de **raça** foi criada para classificar e hierarquizar os povos colonizados, e essa lógica continua após as independências.
- **Pensamento decolonial:** busca reconhecer saberes silenciados pela colonização.

## No Brasil

- **Lélia Gonzalez:** "**amefricanidade**", valorizando as raízes africanas e indígenas da cultura brasileira.
- **Sueli Carneiro:** o **epistemicídio** — a destruição ou desvalorização dos saberes de povos dominados.

## Resumindo

Ubuntu: "eu sou porque nós somos". Fanon analisou o colonialismo. O bem viver propõe harmonia com a natureza. Dussel e Quijano criticam a colonialidade. Lélia Gonzalez e Sueli Carneiro valorizam saberes negros e indígenas.`,
    [
      "Ubuntu: \"eu sou porque nós somos\".",
      "Fanon: efeitos psicológicos do colonialismo e do racismo.",
      "Bem viver: harmonia com a natureza e a comunidade.",
      "Decolonialidade: Dussel, Quijano, Lélia Gonzalez, Sueli Carneiro.",
    ],
    [
      ["Ubuntu", "Filosofia africana que afirma que a pessoa se realiza na comunidade."],
      ["Bem viver", "Ideal andino de vida em harmonia com a natureza e a comunidade."],
      ["Epistemicídio", "Destruição ou desvalorização dos saberes de povos dominados."],
    ],
    [
      ["A expressão \"eu sou porque nós somos\" resume a filosofia:", ["estoica", "Ubuntu", "cartesiana", "utilitarista", "sofista"], 1, "Povos bantos."],
      ["Frantz Fanon analisou principalmente:", ["a física quântica", "os efeitos do colonialismo e do racismo", "a democracia ateniense", "o feudalismo", "a arte renascentista"], 1, "Pele Negra, Máscaras Brancas."],
      ["O \"bem viver\" andino propõe:", ["o acúmulo de riquezas", "a harmonia com a natureza e a comunidade", "a industrialização máxima", "o individualismo", "o fim das comunidades"], 1, "Sumak kawsay."],
      ["O conceito de \"colonialidade do poder\" é de:", ["Aníbal Quijano", "Descartes", "Kant", "Platão", "Hobbes"], 0, "Pensamento decolonial."],
      ["Epistemicídio, termo usado por Sueli Carneiro, significa:", ["morte de animais", "destruição ou desvalorização dos saberes de povos dominados", "fim das escolas", "um tipo de doença", "uma lei"], 1, "Saberes silenciados."],
    ],
    [["O que é a filosofia Ubuntu e como ela foi usada na África do Sul?", "Ubuntu é uma filosofia africana que afirma que a pessoa só se realiza na comunidade (\"eu sou porque nós somos\"), valorizando solidariedade e dignidade; ela inspirou Mandela e Desmond Tutu no processo de reconciliação após o apartheid."]],
  ),
  aula(
    "Freud, o inconsciente e a crise da razão",
    `## O ser humano não é só razão

A filosofia moderna confiava na **razão consciente** (Descartes: "penso, logo existo"). No fim do século XIX e início do XX, alguns pensadores mostraram que somos movidos por forças que **não controlamos**. Paul Ricoeur chamou **Marx, Nietzsche e Freud** de "**mestres da suspeita**".

## Sigmund Freud (1856–1939)

Médico austríaco, criador da **psicanálise**.

### O inconsciente

- Grande parte da vida mental é **inconsciente**: desejos, medos e lembranças **reprimidos** que influenciam o comportamento sem que percebamos.
- O inconsciente se manifesta em **sonhos** ("a via régia para o inconsciente"), **atos falhos** (trocar palavras), **lapsos**, sintomas e chistes (piadas).

### Estrutura do psiquismo

- **Id:** desejos e **pulsões** instintivas (sexuais e agressivas); busca o **prazer** imediato.
- **Superego:** as **normas morais** e proibições internalizadas da sociedade e dos pais (a "consciência moral").
- **Ego:** media entre os desejos do id, as exigências do superego e a **realidade**.

### Mecanismos de defesa

O ego se protege da angústia: **repressão**, **projeção** (atribuir a outros o que é nosso), **racionalização** (justificativas aparentemente lógicas), **negação**, **sublimação** (transformar impulsos em atividades valorizadas, como arte e ciência).

### O mal-estar na civilização

Em *O Mal-Estar na Civilização* (1930), Freud diz que a **civilização** exige a **repressão** de muitos desejos e da agressividade, o que gera **sofrimento** e **culpa**: há um conflito permanente entre os desejos individuais e as exigências sociais.

## A "terceira ferida narcísica"

Freud disse que a humanidade sofreu três golpes no orgulho:

1. **Copérnico:** a Terra não é o centro do universo.
2. **Darwin:** o ser humano descende de outros animais.
3. **Freud:** "o ego **não é senhor em sua própria casa**" — não controlamos totalmente nossa mente.

## Influências

A psicanálise influenciou o **Surrealismo** (Dalí), a literatura (fluxo de consciência), a **Escola de Frankfurt** e a crítica da cultura.

## Resumindo

Freud mostrou que o inconsciente influencia nossos atos (sonhos, atos falhos). O psiquismo tem id, ego e superego. A civilização exige repressão e gera mal-estar. Freud foi a "terceira ferida" no orgulho humano.`,
    [
      "Inconsciente: desejos reprimidos que influenciam o comportamento.",
      "Id (desejos), superego (normas) e ego (mediador).",
      "Mecanismos de defesa: repressão, projeção, sublimação.",
      "\"O ego não é senhor em sua própria casa.\"",
    ],
    [
      ["Inconsciente", "Parte da mente com conteúdos reprimidos que não percebemos diretamente."],
      ["Superego", "Instância psíquica das normas morais internalizadas."],
      ["Sublimação", "Transformação de impulsos em atividades socialmente valorizadas."],
    ],
    [
      ["Para Freud, os sonhos são:", ["sem significado", "a via régia para o inconsciente", "mensagens dos deuses", "apenas atividade cerebral aleatória", "lembranças do futuro"], 1, "Revelam desejos."],
      ["A instância psíquica que representa as normas morais é o:", ["id", "ego", "superego", "inconsciente coletivo", "corpo"], 2, "Consciência moral."],
      ["Trocar sem querer o nome de alguém por outro, para Freud, é um:", ["ato falho", "silogismo", "fato social", "paradigma", "imperativo"], 0, "Manifestação do inconsciente."],
      ["Transformar a agressividade em prática esportiva ou arte é:", ["projeção", "sublimação", "negação", "regressão", "repressão"], 1, "Canal valorizado."],
      ["A \"terceira ferida narcísica\" da humanidade, segundo Freud, foi:", ["o heliocentrismo", "a evolução", "a descoberta de que o ego não controla totalmente a mente", "a Revolução Industrial", "a imprensa"], 2, "Psicanálise."],
    ],
    [["Explique a relação entre id, ego e superego na teoria de Freud.", "O id é a fonte dos desejos e impulsos que buscam prazer imediato; o superego representa as normas morais internalizadas; o ego faz a mediação entre os desejos do id, as exigências do superego e a realidade."]],
  ),
  aula(
    "Ética, política e corrupção: o público e o privado",
    `## A coisa pública

**República** vem do latim *res publica*: "**coisa pública**", aquilo que pertence a **todos**. A ética na política exige separar o **interesse público** do **interesse privado**.

## Corrupção

- Uso do **poder público** para obter **vantagens privadas**: propina, desvio de dinheiro, nepotismo, tráfico de influência, compra de votos.
- Prejudica serviços públicos (saúde, educação), aumenta a **desigualdade** e corrói a **confiança** nas instituições e na democracia.

## Raízes no pensamento brasileiro

- **Patrimonialismo** (Raymundo Faoro, *Os Donos do Poder*; Sérgio Buarque): tratar o Estado como **propriedade** de quem governa.
- **Homem cordial** (Sérgio Buarque): mistura de público e privado, relações pessoais acima das regras impessoais.
- **"Jeitinho brasileiro"** e "**Lei de Gérson**" ("levar vantagem em tudo"): pequenas transgressões cotidianas que normalizam o desrespeito às regras.

## Contribuições filosóficas

- **Platão** (*A República*, mito do **anel de Giges**): se pudéssemos ficar invisíveis, agiríamos com justiça? Discute se somos justos por **convicção** ou por **medo da punição**.
- **Aristóteles:** a política deve visar o **bem comum**; governos que servem a interesses particulares são **degenerados**.
- **Maquiavel:** separou política e moral, analisando o poder como ele é.
- **Kant:** agir por dever e de modo **universalizável**; a corrupção não pode ser lei universal.
- **Max Weber** (*A Política como Vocação*): distingue a **ética da convicção** (agir por princípios, sem olhar consequências) e a **ética da responsabilidade** (responder pelas consequências previsíveis dos atos). O político deve combinar as duas.
- **Hannah Arendt:** a política é o espaço da **ação** e do **diálogo** entre iguais; a mentira destrói esse espaço.

## Combate à corrupção

- **Transparência** (Lei de Acesso à Informação, 2011; Portal da Transparência).
- **Lei da Ficha Limpa** (2010), por iniciativa popular.
- Órgãos de controle: **Tribunais de Contas**, **Controladoria-Geral da União**, **Ministério Público**, imprensa livre.
- **Participação cidadã** e educação para a ética.

## Resumindo

Corrupção é usar o público para fins privados. No Brasil, liga-se ao patrimonialismo e ao "jeitinho". Weber distingue ética da convicção e da responsabilidade. Transparência, Ficha Limpa e participação combatem a corrupção.`,
    [
      "República = coisa pública; corrupção = público usado para fins privados.",
      "Patrimonialismo e \"jeitinho\" normalizam desvios.",
      "Weber: ética da convicção e ética da responsabilidade.",
      "Transparência, Ficha Limpa e participação combatem a corrupção.",
    ],
    [
      ["Patrimonialismo", "Uso do Estado como se fosse propriedade privada de quem governa."],
      ["Nepotismo", "Favorecimento de parentes em cargos públicos."],
      ["Ética da responsabilidade", "Para Weber, agir considerando as consequências previsíveis dos atos."],
    ],
    [
      ["A palavra \"república\" significa:", ["governo de um rei", "coisa pública", "governo dos ricos", "poder divino", "ditadura"], 1, "Res publica."],
      ["Nomear parentes para cargos públicos sem critério técnico é:", ["meritocracia", "nepotismo", "transparência", "burocracia legal", "democracia direta"], 1, "Favorecimento familiar."],
      ["O mito do anel de Giges, de Platão, discute:", ["a origem do universo", "se seríamos justos se pudéssemos agir sem ser vistos", "a beleza", "a imortalidade da alma apenas", "a origem do fogo"], 1, "Justiça por convicção ou medo."],
      ["Para Weber, agir pensando nas consequências previsíveis é seguir a ética:", ["da convicção", "da responsabilidade", "do dever kantiano puro", "religiosa", "estoica"], 1, "A Política como Vocação."],
      ["A Lei da Ficha Limpa (2010):", ["foi imposta por militares", "surgiu de iniciativa popular e torna inelegíveis condenados", "liberou candidatos condenados", "acabou com as eleições", "criou o voto censitário"], 1, "Participação cidadã."],
    ],
    [["Como o conceito de patrimonialismo ajuda a explicar a corrupção no Brasil?", "O patrimonialismo descreve o hábito histórico de tratar o Estado como propriedade particular de quem governa, misturando público e privado; isso favorece práticas como desvio de recursos, nepotismo e uso do cargo para vantagens pessoais."]],
  ),
];
