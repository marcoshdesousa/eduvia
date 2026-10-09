import { aula } from "./build";

/** Espanhol, lote 1: diferenças com o português, leitura e cultura hispânica. */
export const ESPANHOL_1 = [
  aula(
    "Heterogenéricos, heterotônicos e heterossemânticos",
    `## Parecido, mas diferente

Espanhol e português são línguas próximas, o que ajuda muito. Mas algumas palavras **parecem iguais** e têm diferenças de **gênero**, de **acento** ou de **sentido**. O ENEM gosta de cobrar isso.

## Heterogenéricos: muda o gênero

A palavra é parecida, mas o **gênero** (masculino/feminino) é diferente.

- **el** viaje (a viagem), **el** paisaje (a paisagem), **el** mensaje (a mensagem), **el** garaje
  → em espanhol, palavras terminadas em **-aje** são **masculinas**.
- **el** puente (a ponte), **el** árbol (a árvore), **el** color (a cor), **el** dolor (a dor), **el** origen, **el** equipo.
- **la** sangre (o sangue), **la** leche (o leite), **la** sal (o sal), **la** nariz (o nariz), **la** miel (o mel), **la** costumbre (o costume), **la** señal (o sinal).

## Heterotônicos: muda a sílaba tônica

A escrita é parecida, mas a **sílaba forte** muda.

- **a**cademia → aca**de**mia; dem**o**cracia → democra**ci**a; burocra**ci**a.
- teléfono (te-**lé**-fo-no), océano (o-**cé**-a-no), nivel (ni-**vel**), cerebro (ce-**re**-bro), alcohol (al-**co**-hol), imán.

## Heterossemânticos (falsos amigos)

Mesma forma, **sentido diferente**. Os mais cobrados:

- **exquisito** = delicioso (não "esquisito").
- **embarazada** = grávida.
- **oficina** = escritório.
- **polvo** = pó (polvo é *pulpo*).
- **rato** = momento, instante (rato é *ratón*).
- **borrar** = apagar.
- **cena** = jantar.
- **apellido** = sobrenome.
- **largo** = comprido (largo é *ancho*).
- **pelado** = careca; **pelo** = cabelo.
- **sitio** = lugar.
- **todavía** = ainda.
- **zurdo** = canhoto.
- **escoba** = vassoura; **cepillo** = escova.
- **salada** = salgada (a comida); salada é *ensalada*.

## Resumindo

Heterogenéricos mudam o gênero (el viaje, la leche). Heterotônicos mudam a sílaba forte (democracia, teléfono). Heterossemânticos são falsos amigos: exquisito = delicioso; embarazada = grávida; oficina = escritório.`,
    [
      "Palavras em -aje são masculinas: el viaje, el mensaje.",
      "la leche, la sangre, la sal, la nariz são femininas.",
      "Heterotônicos mudam a sílaba forte: democracia.",
      "Falsos amigos: exquisito = delicioso; oficina = escritório.",
    ],
    [
      ["Heterogenérico", "Palavra com gênero diferente nas duas línguas."],
      ["Heterotônico", "Palavra com sílaba tônica diferente nas duas línguas."],
      ["Heterossemântico", "Palavra parecida com sentido diferente (falso amigo)."],
    ],
    [
      ["\"La comida estaba exquisita\" significa que a comida estava:", ["estranha", "deliciosa", "fria", "estragada", "salgada"], 1, "exquisito = delicioso."],
      ["\"Ella está embarazada\" significa que ela está:", ["envergonhada", "grávida", "atrasada", "embaraçada", "cansada"], 1, "Falso amigo clássico."],
      ["Em espanhol, \"viaje\" é:", ["feminino: la viaje", "masculino: el viaje", "neutro: lo viaje", "plural", "verbo"], 1, "Palavras em -aje são masculinas."],
      ["\"Trabajo en una oficina\" significa:", ["Trabalho numa oficina mecânica.", "Trabalho num escritório.", "Trabalho numa fábrica.", "Trabalho num hospital.", "Trabalho numa escola."], 1, "oficina = escritório."],
      ["\"Todavía no terminé\" significa:", ["Todavia, terminei.", "Ainda não terminei.", "Já terminei.", "Nunca terminei.", "Sempre termino."], 1, "todavía = ainda."],
    ],
    [["O que são palavras heterossemânticas? Dê dois exemplos.", "São palavras parecidas nas duas línguas mas com significados diferentes, os falsos amigos; por exemplo, exquisito significa delicioso e embarazada significa grávida."]],
  ),
  aula(
    "Artigos e o neutro \"lo\"",
    `## Artigos definidos

- **el** (masculino singular): *el libro*.
- **la** (feminino singular): *la casa*.
- **los** (masculino plural): *los libros*.
- **las** (feminino plural): *las casas*.

## Contrações

Em espanhol só existem duas:

- **a + el = al**: *Voy **al** cine.* (Vou ao cinema.)
- **de + el = del**: *El libro **del** profesor.*

Não existem contrações como "na", "no", "pelo": *en la casa* (na casa), *en el parque* (no parque), *por el camino* (pelo caminho).

## O artigo neutro "lo"

**Lo** não acompanha substantivos. Ele **substantiva** adjetivos, advérbios e orações, com sentido de "**o que é**", "**a parte**", "**o fato de**".

- ***Lo** bueno de la vida...* = O bom da vida / O que é bom da vida.
- ***Lo** importante es estudiar.* = O importante é estudar.
- ***Lo** que dijiste es verdad.* = O que você disse é verdade.
- ***Lo** mejor / **lo** peor.*
- Intensidade: *No sabes **lo** difícil que es.* = Você não sabe **quão** difícil é.

Nunca se diz "*el importante es...*" com sentido abstrato: usa-se **lo**.

## Artigo "el" diante de feminino com "a" tônico

Palavras **femininas** que começam com **a** ou **ha** tônico usam **el** no singular, para evitar o som repetido, mas continuam femininas:

- ***el** agua fría*, ***el** águila*, ***el** hambre*, ***el** aula*, ***el** arma*.
- No plural voltam a usar **las**: *las aguas*, *las aulas*.

## Artigos indefinidos

**un, una, unos, unas**. Atenção: *unos* pode significar "**cerca de**": *unos veinte alumnos* = uns/cerca de vinte alunos.

## Resumindo

Só existem duas contrações: al e del. Lo é neutro e substantiva adjetivos e orações (lo importante, lo que). Femininos com a tônico usam el no singular: el agua.`,
    [
      "Só duas contrações: al (a + el) e del (de + el).",
      "\"Lo\" substantiva adjetivos: lo bueno, lo importante.",
      "\"Lo que\" = o que.",
      "Femininos com \"a\" tônico usam \"el\": el agua, el aula.",
    ],
    [
      ["Artigo neutro", "\"Lo\": não acompanha substantivo e expressa ideias abstratas."],
      ["Contração", "Junção de preposição e artigo: al, del."],
      ["A tônico", "Primeira sílaba forte começando com a, como em agua."],
    ],
    [
      ["\"Lo importante es participar\" significa:", ["O importante é participar.", "Ele é importante participar.", "Os importantes participam.", "A importante participação.", "Importa o participar dele."], 0, "lo + adjetivo."],
      ["Qual frase está correta em espanhol?", ["Voy a el parque.", "Voy al parque.", "Voy no parque.", "Voy ao parque.", "Voy del parque."], 1, "a + el = al."],
      ["\"El agua\" usa \"el\" porque:", ["agua é masculina", "agua é feminina com a tônico", "é um erro", "agua é neutra", "é plural"], 1, "Evita la + a tônico."],
      ["\"Lo que dijo el profesor\" significa:", ["Ele disse ao professor", "O que o professor disse", "O professor o disse", "Quem disse ao professor", "Onde o professor disse"], 1, "lo que = o que."],
      ["\"Unos treinta estudiantes\" significa:", ["exatamente trinta", "cerca de trinta", "um de trinta", "trinta e um", "nenhum"], 1, "unos = aproximadamente."],
    ],
    [["Explique o uso do artigo neutro \"lo\" em espanhol, com exemplos.", "\"Lo\" não acompanha substantivos; ele transforma adjetivos e orações em ideias abstratas, como em \"lo importante\" (o importante), \"lo bueno\" (o bom) e \"lo que dijiste\" (o que você disse)."]],
  ),
  aula(
    "Muy x mucho e palavras de quantidade",
    `## Uma dúvida clássica

Em português usamos "muito" para tudo. Em espanhol há **muy** e **mucho**, e o ENEM pode cobrar a diferença.

## Muy

Usa-se **antes de adjetivos e advérbios**:

- *Es **muy** inteligente.* (adjetivo)
- *Habla **muy** rápido.* (advérbio)
- *Está **muy** lejos.*

## Mucho

- **Antes de substantivos**, concordando em gênero e número: ***mucho** dinero, **mucha** gente, **muchos** libros, **muchas** personas*.
- **Depois de verbos**: *Estudia **mucho**.* / *Te quiero **mucho**.*
- **Sozinho**, como resposta: *¿Te gusta? — Sí, **mucho**.*

## Exceções (usa-se mucho antes delas)

Antes de **mejor, peor, mayor, menor, más, menos, antes, después**, usa-se **mucho**, mesmo sendo adjetivos/advérbios:

- *Es **mucho mejor**.* / ***Mucho más** caro.* / ***Mucho antes**.*

## Outras palavras de quantidade

- **poco / poca / pocos / pocas**: pouco. *Hay **poca** agua.*
- **bastante(s)**: bastante. *Hay **bastantes** problemas.*
- **demasiado**: demais, excessivo. *Comes **demasiado**.*
- **tan** (tão) e **tanto** (tanto): *Es **tan** alto como su padre.* / *Tiene **tanto** dinero como tú.*
- **más** (mais) e **menos**: *Es **más** caro que el otro.*

## Cuidado: "mas" sem acento

- **más** (com acento) = mais.
- **mas** (sem acento) = mas, porém (uso literário). O comum é **pero**.

## Resumindo

Muy vem antes de adjetivo e advérbio (muy bonito). Mucho vem antes de substantivo, depois de verbo e antes de mejor, peor, más, menos (mucho mejor). Más = mais; pero = mas.`,
    [
      "Muy + adjetivo/advérbio: muy bonito, muy lejos.",
      "Mucho + substantivo (concorda) ou depois de verbo.",
      "Mucho antes de mejor, peor, más, menos.",
      "Más = mais; pero = mas.",
    ],
    [
      ["Muy", "Muito, antes de adjetivos e advérbios."],
      ["Mucho", "Muito, antes de substantivos ou depois de verbos."],
      ["Pero", "Mas, porém."],
    ],
    [
      ["Complete: \"La película es ___ interesante.\"", ["mucho", "muy", "mucha", "muchos", "más mucho"], 1, "Antes de adjetivo: muy."],
      ["Complete: \"Hay ___ personas en la fila.\"", ["muy", "mucho", "muchas", "mucha", "muys"], 2, "Concorda com personas (fem. plural)."],
      ["Complete: \"Este celular es ___ mejor.\"", ["muy", "mucho", "mucha", "muchos", "tan"], 1, "Antes de mejor: mucho."],
      ["\"Él trabaja mucho\" está correto porque \"mucho\" vem:", ["antes de adjetivo", "depois de verbo", "antes de advérbio", "antes de substantivo feminino", "no lugar de muy"], 1, "Depois de verbo."],
      ["\"Quería ir, pero estaba cansado\" — \"pero\" significa:", ["mais", "mas/porém", "porque", "para", "pelo"], 1, "Conjunção adversativa."],
    ],
    [["Explique quando se usa \"muy\" e quando se usa \"mucho\" em espanhol.", "\"Muy\" vem antes de adjetivos e advérbios (muy bonito, muy lejos); \"mucho\" vem antes de substantivos, concordando com eles (mucha gente), depois de verbos (estudia mucho) e antes de mejor, peor, más e menos."]],
  ),
  aula(
    "Conectivos em espanhol",
    `## Os conectores mostram a lógica do texto

Entender os **conectivos (conectores)** é essencial para saber se o texto está **opondo**, **explicando**, **concluindo** ou **acrescentando** ideias.

## Oposição e contraste

- **pero** = mas.
- **sin embargo** = no entanto, contudo.
- **no obstante** = não obstante.
- **aunque** = embora, ainda que. *Aunque llueva, iré.*
- **a pesar de (que)** = apesar de.
- **sino** = mas sim (depois de negação). *No es rojo, **sino** azul.*
- **en cambio** = por outro lado, em compensação.
- **mientras que** = enquanto (contraste).

## Causa

- **porque** = porque.
- **ya que / puesto que / dado que** = já que, visto que.
- **como** (no início) = como. *Como no vino, empezamos.*
- **debido a** = devido a.

## Consecuencia y conclusión

- **por eso / por lo tanto / por consiguiente** = por isso, portanto.
- **así que** = então, de modo que.
- **entonces** = então.
- **en conclusión / en resumen** = em conclusão.

## Adición

- **y / e** (antes de palavras com "i"): *padre **e** hijo*.
- **o / u** (antes de palavras com "o"): *siete **u** ocho*.
- **además** = além disso.
- **incluso** = inclusive, até.
- **también** = também; **tampoco** = também não.

## Tiempo

- **cuando** = quando; **mientras** = enquanto; **luego / después** = depois; **antes** = antes; **todavía / aún** = ainda; **ya** = já.

## Atenção: falsos amigos

- **pues** = pois (explicação) ou "então".
- **luego** = depois (não "logo, imediatamente").
- **apenas** = mal, quase não. *Apenas dormí* = quase não dormi.

## Resumindo

Sin embargo e aunque indicam oposição; ya que e debido a, causa; por eso e por lo tanto, conclusão; además, adição. Luego = depois; apenas = quase não.`,
    [
      "Sin embargo / aunque / pero: oposição.",
      "Ya que / puesto que / debido a: causa.",
      "Por eso / por lo tanto: conclusão.",
      "Luego = depois; apenas = quase não.",
    ],
    [
      ["Sin embargo", "No entanto, contudo."],
      ["Aunque", "Embora, ainda que."],
      ["Sino", "Mas sim, usado após negação."],
    ],
    [
      ["\"Sin embargo\" expressa:", ["causa", "oposição", "adição", "tempo", "finalidade"], 1, "No entanto."],
      ["\"No quiero café, ___ té.\" Complete:", ["pero", "sino", "aunque", "porque", "pues"], 1, "Depois de negação, sino."],
      ["\"Aunque estaba lloviendo, salimos\" significa:", ["Porque chovia, saímos.", "Embora estivesse chovendo, saímos.", "Quando chovia, ficamos.", "Choveu e não saímos.", "Saímos e depois choveu."], 1, "aunque = embora."],
      ["\"Llegó tarde, por eso perdió el tren\" — \"por eso\" indica:", ["oposição", "consequência", "adição", "dúvida", "comparação"], 1, "Por isso."],
      ["\"Apenas comí hoy\" significa:", ["Só comi hoje.", "Quase não comi hoje.", "Comi muito hoje.", "Comi agora.", "Comi depois."], 1, "Falso amigo: apenas = quase não."],
    ],
    [["Qual é a diferença de sentido entre \"pero\" e \"sino\" em espanhol?", "\"Pero\" é \"mas\" de oposição comum (Es caro, pero bueno); \"sino\" significa \"mas sim\" e aparece depois de uma negação, corrigindo a ideia (No es rojo, sino azul)."]],
  ),
  aula(
    "Tratamento: tú, usted e vos",
    `## Formalidade em espanhol

O espanhol diferencia o tratamento **informal** e o **formal**, o que aparece em textos como e-mails, anúncios e diálogos.

## Tú (informal)

- Usado com amigos, família, crianças, colegas.
- Verbo na 2ª pessoa: ***Tú** hablas, **tú** eres, **tú** tienes.*
- Pronomes: *te*, *tu* (seu/teu), *contigo*.

## Usted (formal)

- Usado com desconhecidos, idosos, autoridades, clientes, em situações profissionais.
- **Verbo na 3ª pessoa**, como "você/o senhor" em português: ***Usted** habla, **usted** es, **usted** tiene.*
- Abreviado como **Ud.** ou **Vd.**
- Pronomes: *le*, *su* (seu, do senhor).

## Plural

- **Vosotros/vosotras** (informal): usado na **Espanha**. *Vosotros habláis.*
- **Ustedes** (formal na Espanha; **formal e informal na América Latina**). *Ustedes hablan.*

## Vos (voseo)

- Em países como **Argentina, Uruguai** e partes da América Central, usa-se **vos** no lugar de **tú**.
- O verbo muda: ***Vos** hablás, **vos** sos, **vos** tenés, **vos** querés.*
- Muito comum nas tirinhas de **Mafalda** e em letras de tango.
- É uma **variedade legítima**, não um erro.

## Para que serve no ENEM

- Identificar o **grau de formalidade** de um texto e a **relação** entre os interlocutores.
- Reconhecer a **origem** de um texto (vos → Rio da Prata; vosotros → Espanha).
- Entender que as diferenças regionais são **variedades**, assim como no português.

## Resumindo

Tú é informal; usted é formal e usa o verbo na 3ª pessoa. Vosotros é o plural informal da Espanha; ustedes é o plural na América. Vos (hablás, sos) é usado na Argentina e no Uruguai.`,
    [
      "Tú = informal; usted = formal (verbo na 3ª pessoa).",
      "Vosotros: plural informal usado na Espanha.",
      "Ustedes: plural formal e informal na América Latina.",
      "Vos (vos sos, vos tenés): Argentina e Uruguai.",
    ],
    [
      ["Usted", "Pronome formal de tratamento, equivalente a \"o senhor/a senhora\"."],
      ["Voseo", "Uso de \"vos\" no lugar de \"tú\", comum no Rio da Prata."],
      ["Vosotros", "\"Vocês\" informal, usado na Espanha."],
    ],
    [
      ["Num e-mail a um cliente desconhecido, o tratamento adequado é:", ["tú", "usted", "vos", "vosotros", "che"], 1, "Formalidade."],
      ["\"Vos sos muy inteligente\" indica um falante provavelmente:", ["da Espanha", "da Argentina ou do Uruguai", "do México", "do Brasil", "dos EUA"], 1, "Voseo rioplatense."],
      ["Com \"usted\", o verbo fica na:", ["1ª pessoa", "2ª pessoa", "3ª pessoa", "forma infinitiva", "forma neutra"], 2, "Usted habla."],
      ["\"Vosotros\" é usado principalmente:", ["na Argentina", "na Espanha", "no México", "na Colômbia", "no Chile"], 1, "Plural informal espanhol."],
      ["Considerar o \"vos\" um erro é:", ["correto", "preconceito linguístico; é uma variedade legítima", "regra da RAE", "uso antigo proibido", "erro de digitação"], 1, "Variação regional."],
    ],
    [["Explique a diferença entre tú e usted e o que é o voseo.", "Tú é o tratamento informal, usado com amigos e família; usted é formal, usado com desconhecidos e autoridades, com o verbo na 3ª pessoa; voseo é o uso de vos no lugar de tú, com formas como vos sos, típico da Argentina e do Uruguai."]],
  ),
  aula(
    "Mafalda, Quino e as tirinhas em espanhol",
    `## A menina que questiona o mundo

**Mafalda** é a personagem criada pelo cartunista argentino **Quino** (Joaquín Lavado), publicada entre **1964 e 1973**. É uma das tirinhas mais cobradas no ENEM de espanhol.

## Quem é Mafalda

- Uma menina de classe média de **Buenos Aires**, inteligente e crítica.
- Preocupa-se com a **paz mundial**, a **humanidade**, a **injustiça** e a **pobreza**.
- Odeia **sopa** (que pode simbolizar o autoritarismo, aquilo que é imposto).
- Ama os Beatles e trata o globo terrestre como um paciente doente.

## Outros personagens

- **Felipe:** sonhador e preguiçoso para os deveres.
- **Manolito:** filho do dono do armazém, obcecado por **dinheiro e negócios** (crítica ao capitalismo).
- **Susanita:** sonha em casar e ter filhos; representa valores **tradicionais**.
- **Miguelito:** ingênuo e egocêntrico.
- **Libertad:** pequena, intelectual e com ideias **revolucionárias**.
- **Guille:** irmão menor de Mafalda.

## Contexto

A Argentina e a América Latina viviam **instabilidade política**, **ditaduras**, a **Guerra Fria** e a Guerra do Vietnã. As tirinhas usam o olhar infantil para fazer **crítica social e política** com humor.

## Como interpretar

1. Observe a **linguagem**: Mafalda usa o **voseo** (*vos sabés*, *vos tenés*) e expressões argentinas (*che*).
2. Identifique o **alvo da crítica**: a guerra, a desigualdade, o consumismo, a mídia, os adultos.
3. Perceba o contraste entre a **inocência** da criança e a **profundidade** da reflexão.
4. O humor vem da **quebra de expectativa** no último quadro.

## Palavras úteis

*mundo*, *paz*, *guerra*, *pobreza*, *gobierno*, *sopa*, *escuela*, *mamá*, *papá*, *chico/a*, *¡Qué horror!*, *¿Viste?*

## Resumindo

Mafalda, de Quino, critica com humor a guerra, a injustiça e o autoritarismo. Seus amigos representam diferentes visões de mundo. O voseo e o contexto argentino aparecem nas falas.`,
    [
      "Mafalda: criação de Quino, Argentina, 1964–1973.",
      "Critica guerra, injustiça, pobreza e autoritarismo.",
      "Manolito: dinheiro; Susanita: valores tradicionais.",
      "As falas usam o voseo argentino.",
    ],
    [
      ["Quino", "Cartunista argentino criador de Mafalda."],
      ["Che", "Expressão argentina para chamar alguém, como \"ei\"."],
      ["Crítica social", "Questionamento de problemas da sociedade, comum em tirinhas."],
    ],
    [
      ["Mafalda foi criada pelo cartunista:", ["Charles Schulz", "Quino", "Maurício de Sousa", "Bill Watterson", "Ziraldo"], 1, "Argentino Joaquín Lavado."],
      ["O personagem obcecado por dinheiro e negócios é:", ["Felipe", "Manolito", "Susanita", "Guille", "Libertad"], 1, "Crítica ao capitalismo."],
      ["Mafalda costuma se preocupar com:", ["moda e beleza", "a paz mundial e as injustiças", "futebol", "videogames", "receitas de sopa"], 1, "Consciência social."],
      ["\"Vos sabés\" nas falas de Mafalda é exemplo de:", ["erro de grafia", "voseo argentino", "português", "inglês", "espanhol da Espanha"], 1, "Variedade rioplatense."],
      ["Susanita representa:", ["ideias revolucionárias", "valores tradicionais, como casar e ter filhos", "o amor pelo dinheiro", "a preguiça", "o militarismo"], 1, "Sonho de ser mãe e esposa."],
    ],
    [["Por que as tirinhas de Mafalda são usadas para discutir crítica social?", "Porque Quino usa o olhar de uma criança inteligente para questionar a guerra, a injustiça, a pobreza, o consumismo e o autoritarismo, e o contraste entre inocência e profundidade gera humor e reflexão."]],
  ),
  aula(
    "Poesia e música hispânica",
    `## Vozes da América Latina e da Espanha

O ENEM traz **poemas** e **letras de música** em espanhol, geralmente com temas de **identidade latino-americana**, **amor**, **resistência** e **crítica social**.

## Autores e artistas importantes

- **Pablo Neruda** (Chile, Nobel de 1971): poemas de amor (*Veinte poemas de amor y una canción desesperada*: "Puedo escribir los versos más tristes esta noche") e poesia política (*Canto General*, sobre a história da América).
- **Gabriela Mistral** (Chile): primeira latino-americana a ganhar o **Nobel** (1945); temas de infância, maternidade e educação.
- **Federico García Lorca** (Espanha): poesia e teatro com cultura popular andaluza; assassinado na Guerra Civil Espanhola.
- **Mario Benedetti** (Uruguai): poemas simples e engajados ("No te salves").
- **Eduardo Galeano** (Uruguai): *As Veias Abertas da América Latina*, sobre a exploração do continente; textos curtos e poéticos.
- **Mercedes Sosa** (Argentina): cantora de "**Gracias a la vida**" (de **Violeta Parra**, Chile) e "Todo cambia", símbolos da **Nova Canção** latino-americana, contra as ditaduras.
- **Gabriel García Márquez** (Colômbia): **realismo mágico** em *Cien años de soledad*.
- **Julio Cortázar** e **Jorge Luis Borges** (Argentina): contos e jogos com a realidade.

## Temas frequentes

- **Identidade latino-americana** e herança indígena.
- **Exílio** e memória das **ditaduras**.
- **Desigualdade** e exploração.
- **Amor** e passagem do tempo.

## Como interpretar

1. Leia o **título**, o autor e a origem.
2. Identifique o **tema** e o **tom** (saudade, revolta, gratidão).
3. Procure palavras repetidas e **metáforas**.
4. Relacione ao **contexto histórico** (ditaduras, colonização).

## Exemplo

"**Gracias a la vida**, que me ha dado tanto" — o eu lírico agradece à vida pelos sentidos, pelas palavras e pelo amor. Tom de **gratidão**, apesar das dores.

## Resumindo

Neruda, Mistral, Benedetti, Galeano e Mercedes Sosa estão entre as vozes mais cobradas. Os temas giram em torno de identidade, amor, ditaduras e desigualdade.`,
    [
      "Neruda: amor e história da América (Canto General).",
      "Gabriela Mistral: primeira latino-americana Nobel.",
      "Mercedes Sosa: \"Gracias a la vida\" e a Nova Canção.",
      "Realismo mágico: García Márquez, Cien años de soledad.",
    ],
    [
      ["Realismo mágico", "Estilo que mistura o real e o fantástico com naturalidade."],
      ["Nova Canção", "Movimento musical latino-americano engajado, contra as ditaduras."],
      ["Exílio", "Afastamento forçado do próprio país, comum nas ditaduras."],
    ],
    [
      ["\"Cien años de soledad\" é de:", ["Pablo Neruda", "Gabriel García Márquez", "Jorge Luis Borges", "Mario Benedetti", "Quino"], 1, "Colombiano, realismo mágico."],
      ["\"Gracias a la vida\" expressa principalmente:", ["revolta", "gratidão", "medo", "ódio", "tédio"], 1, "Agradecimento à vida."],
      ["A primeira latino-americana a ganhar o Nobel de Literatura foi:", ["Frida Kahlo", "Gabriela Mistral", "Mercedes Sosa", "Isabel Allende", "Violeta Parra"], 1, "Em 1945."],
      ["\"As Veias Abertas da América Latina\", de Galeano, trata:", ["de receitas", "da exploração histórica do continente", "de futebol", "de astronomia", "de romance policial"], 1, "Crítica à exploração."],
      ["O realismo mágico caracteriza-se por:", ["descrever só fatos científicos", "misturar o real e o fantástico com naturalidade", "usar apenas sonetos", "ser exclusivamente religioso", "não ter enredo"], 1, "Marca de García Márquez."],
    ],
    [["Quais temas aparecem com frequência na poesia e na música latino-americanas cobradas no ENEM?", "Temas como identidade latino-americana e herança indígena, memória das ditaduras e do exílio, desigualdade e exploração do continente, além do amor e da passagem do tempo."]],
  ),
  aula(
    "Pretérito indefinido e pretérito perfecto",
    `## Dois passados em espanhol

O espanhol tem dois tempos muito usados para falar do passado, e entender a diferença ajuda a interpretar textos.

## Pretérito perfecto simple (indefinido)

Ação **concluída** num tempo **já terminado**: *ayer, la semana pasada, en 2010, hace dos años*.

- ***Ayer comí** pizza.* (Ontem comi pizza.)
- *Colón **llegó** a América en 1492.*

Formação (verbos regulares):

- **-ar** (hablar): hablé, hablaste, **habló**, hablamos, hablasteis, hablaron.
- **-er / -ir** (comer/vivir): comí, comiste, **comió**, comimos, comisteis, comieron.

Irregulares importantes: **ser/ir** → fui, fue, fueron; **tener** → tuve, tuvo; **hacer** → hice, hizo; **estar** → estuve; **poder** → pude; **decir** → dije, dijo.

Atenção: **fue** pode ser de *ser* (foi) ou de *ir* (foi = ir a algum lugar); o contexto decide.

## Pretérito perfecto compuesto

**haber** (no presente) + **particípio**. Ação passada **ligada ao presente**, num tempo **ainda não terminado**: *hoy, esta semana, este año, alguna vez, nunca, ya, todavía no*.

- ***Hoy he comido** pizza.* (Hoje comi pizza.)
- *¿**Has estado** en México alguna vez?* (Você já esteve no México?)

Formação: he, has, **ha**, hemos, habéis, han + particípio (*hablado, comido, vivido*).

Particípios irregulares: *hecho* (feito), *dicho* (dito), *escrito*, *visto*, *puesto*, *vuelto*, *roto*, *abierto*, *muerto*.

## Diferença regional

Na **Espanha**, usa-se muito o *perfecto compuesto* para o passado recente. Em grande parte da **América Latina**, prefere-se o *indefinido* mesmo para ações de hoje (*Hoy comí*).

## Pretérito imperfecto

Para ações **habituais** ou descrições no passado (como o "-ava/-ia" do português): *Cuando era niño, **jugaba** al fútbol.*

## Resumindo

Indefinido: passado concluído em tempo terminado (ayer comí). Perfecto compuesto: haber + particípio, passado ligado ao presente (hoy he comido). Imperfecto: hábitos e descrições (jugaba).`,
    [
      "Indefinido: ação concluída em tempo terminado (ayer comí).",
      "Perfecto compuesto: haber + particípio (hoy he comido).",
      "\"Fue\" pode ser de ser ou de ir: veja o contexto.",
      "Imperfecto: hábitos no passado (jugaba, comía).",
    ],
    [
      ["Pretérito indefinido", "Passado simples para ações concluídas: hablé, comió."],
      ["Pretérito perfecto compuesto", "Haber + particípio: he hablado."],
      ["Particípio", "Forma verbal como hablado, comido, hecho."],
    ],
    [
      ["\"Ayer fui al cine\" significa:", ["Amanhã vou ao cinema.", "Ontem fui ao cinema.", "Hoje fui ao cinema.", "Eu era o cinema.", "Sempre vou ao cinema."], 1, "fui (ir), passado."],
      ["\"Este año he viajado mucho\" usa o pretérito:", ["indefinido", "perfecto compuesto", "imperfecto", "futuro", "condicional"], 1, "haber + particípio."],
      ["O particípio de \"hacer\" é:", ["hacido", "hecho", "hizo", "haciendo", "hago"], 1, "Irregular."],
      ["\"Cuando era niño, vivía en el campo\" expressa:", ["ação única e pontual", "hábito/descrição no passado", "futuro", "ordem", "hipótese"], 1, "Imperfecto."],
      ["\"Colón llegó a América en 1492\" usa o indefinido porque:", ["é uma ação ligada ao presente", "é uma ação concluída em tempo terminado", "é um hábito", "é futuro", "é uma ordem"], 1, "1492 é tempo encerrado."],
    ],
    [["Explique a diferença entre \"Ayer comí paella\" e \"Hoy he comido paella\".", "A primeira usa o pretérito indefinido, para uma ação concluída num tempo já terminado (ontem); a segunda usa o perfecto compuesto, com haber + particípio, para uma ação passada num tempo que ainda não terminou (hoje)."]],
  ),
  aula(
    "América Latina em textos: identidade, desigualdade e migração",
    `## Os temas sociais dos textos em espanhol

Muitos textos do ENEM de espanhol tratam da **realidade latino-americana**. Conhecer o contexto ajuda a interpretar.

## Povos originários

- A América hispânica tem forte presença de **povos indígenas (pueblos originarios)**: **quéchuas** e **aimarás** (Andes: Peru, Bolívia, Equador), **maias** (México, Guatemala), **mapuches** (Chile, Argentina), **guaranis** (Paraguai, onde o guarani é língua oficial junto ao espanhol).
- Temas: valorização das **línguas indígenas**, luta por **terras**, discriminação.
- A **Bolívia** se define como **Estado Plurinacional** e reconhece dezenas de línguas.

## Colonização e herança

- Conquista espanhola a partir de 1492; exploração da **prata** (Potosí) e de mão de obra indígena (**mita** e **encomienda**).
- **Mestiçagem** e diversidade cultural.

## Desigualdade e pobreza

- A América Latina é uma das regiões **mais desiguais** do mundo.
- Textos sobre **trabalho infantil**, **educação**, **moradia** e **exclusão** são comuns.

## Migração

- Migração para os **Estados Unidos** e a Espanha; **venezuelanos** espalhados pela América do Sul.
- Palavras: *migrante*, *frontera*, *refugiado*, *exilio*, *papeles* (documentos), *ilegal / indocumentado*.

## Memória e ditaduras

- Ditaduras na **Argentina**, **Chile** (Pinochet), Uruguai e outros, com **desaparecidos políticos**.
- **Madres de Plaza de Mayo** (Argentina): mães que buscam os filhos desaparecidos, símbolo de resistência.

## Cultura e festas

- **Día de Muertos** (México): celebração alegre para lembrar os mortos, patrimônio da UNESCO.
- Tango (Argentina e Uruguai), cumbia, salsa, flamenco (Espanha).
- Muralismo mexicano (**Diego Rivera**) e **Frida Kahlo**.

## Vocabulário útil

*pueblo* (povo, povoado), *tierra*, *derechos*, *desigualdad*, *pobreza*, *trabajo*, *niños*, *escuela*, *memoria*, *dictadura*, *frontera*.

## Resumindo

Textos em espanhol abordam povos originários, colonização, desigualdade, migração e memória das ditaduras. Conhecer esse contexto é tão importante quanto a gramática.`,
    [
      "Povos originários: quéchuas, aimarás, maias, mapuches, guaranis.",
      "A Bolívia é um Estado Plurinacional.",
      "Madres de Plaza de Mayo: memória das ditaduras.",
      "Día de Muertos: celebração mexicana dos mortos.",
    ],
    [
      ["Pueblos originarios", "Povos indígenas que habitavam a América antes da colonização."],
      ["Desaparecidos", "Pessoas sequestradas e mortas pelas ditaduras sem que os corpos fossem entregues."],
      ["Estado Plurinacional", "Estado que reconhece várias nações e povos em seu território."],
    ],
    [
      ["O país sul-americano em que o guarani é língua oficial ao lado do espanhol é:", ["Chile", "Paraguai", "Argentina", "Colômbia", "Venezuela"], 1, "Bilinguismo oficial."],
      ["As Madres de Plaza de Mayo são símbolo:", ["do futebol argentino", "da busca pelos desaparecidos da ditadura", "do tango", "da independência", "do turismo"], 1, "Memória e resistência."],
      ["O Día de Muertos, no México, é:", ["um dia de luto silencioso", "uma celebração para lembrar os mortos com festa e altares", "uma data esportiva", "um feriado religioso proibido", "uma festa de Ano-Novo"], 1, "Patrimônio da UNESCO."],
      ["\"Frontera\" significa:", ["fronteira", "frente", "frota", "fruta", "fraternidade"], 0, "Cognato."],
      ["A Bolívia se define como Estado Plurinacional porque:", ["tem só um povo", "reconhece vários povos e línguas indígenas", "é governada por estrangeiros", "não tem idioma oficial", "é uma monarquia"], 1, "Diversidade reconhecida."],
    ],
    [["Por que conhecer a história e a realidade da América Latina ajuda na prova de espanhol?", "Porque muitos textos tratam de povos originários, colonização, desigualdade, migração e ditaduras; conhecendo esse contexto, o aluno entende melhor a intenção e a crítica dos textos."]],
  ),
  aula(
    "Gêneros textuais em espanhol: notícias, anúncios e campanhas",
    `## Reconhecer o gênero ajuda a interpretar

Saber se o texto é uma **notícia**, um **anúncio**, uma **campanha**, uma **receita** ou uma **carta** já indica o **objetivo** dele e o tipo de pergunta que pode aparecer.

## Noticia (notícia)

- Relata um **fato recente** de forma objetiva.
- Tem **titular** (manchete), **entradilla** (lide, o primeiro parágrafo com o essencial) e **cuerpo**.
- Responde: *¿qué?, ¿quién?, ¿cuándo?, ¿dónde?, ¿cómo?, ¿por qué?*

## Anuncio publicitario

- Busca **vender** ou promover uma marca.
- Usa **imperativo** (*¡Compra!*, *¡Prueba!*, *¡Descubre!*), adjetivos positivos, slogans e jogos de palavras.

## Campaña social

- Busca **conscientizar** (saúde, trânsito, meio ambiente, violência).
- Imperativo e negativo: ***No*** *tires basura* (não jogue lixo), ***Cuida*** *el agua*, ***Vacúnate***.
- Assinada por governos, ONGs ou organismos (OMS, UNICEF).

## Imperativo em espanhol

- Tú (afirmativo): ***Lee***, ***Come***, ***Escribe***.
- Usted: ***Lea***, ***Coma***.
- Negativo: ***No*** *fumes*, ***No*** *corras*.
- Com pronome: ***Cuídate***, ***Vacúnate*** (o pronome vai colado ao verbo).

## Outros gêneros

- **Receta:** ingredientes e modo de preparo, com imperativo ou infinitivo.
- **Carta / correo electrónico:** saudação (*Estimado/a*, *Querido/a*), despedida (*Atentamente*, *Saludos*, *Un abrazo*).
- **Artículo de opinión:** defende um ponto de vista (*creo que*, *en mi opinión*, *es necesario*).
- **Infografía:** dados, gráficos e ícones.
- **Biografía:** vida de uma pessoa, com verbos no passado.

## Como resolver

1. Identifique o **gênero** (formato, fonte, imagem).
2. Descubra o **objetivo** (informar, vender, convencer, alertar).
3. Encontre o **público-alvo**.
4. Procure as **palavras-chave** e o **verbo no imperativo**.

## Resumindo

Notícia informa; anúncio vende; campanha conscientiza. O imperativo (Cuida, No tires, Vacúnate) revela a ação pedida. Identificar o gênero orienta a leitura.`,
    [
      "Notícia informa; anúncio vende; campanha conscientiza.",
      "Imperativo: Lee, Cuida, No tires, Vacúnate.",
      "Titular e entradilla trazem o essencial da notícia.",
      "Identifique gênero, objetivo e público-alvo.",
    ],
    [
      ["Titular", "Título de uma notícia (manchete)."],
      ["Entradilla", "Primeiro parágrafo da notícia, com as informações principais."],
      ["Campaña social", "Texto que busca conscientizar e mudar comportamentos."],
    ],
    [
      ["Um cartaz com \"No tires basura en la playa\" é:", ["um anúncio de venda", "uma campanha social", "uma receita", "uma biografia", "um poema"], 1, "Conscientização ambiental."],
      ["\"No tires basura\" significa:", ["Não tire o lixo.", "Não jogue lixo.", "Não compre lixo.", "Não recicle.", "Não limpe."], 1, "tirar = jogar/atirar."],
      ["\"Vacúnate\" é:", ["um substantivo", "um verbo no imperativo com pronome", "um adjetivo", "um verbo no passado", "um advérbio"], 1, "Vacine-se: imperativo com o pronome colado."],
      ["O primeiro parágrafo de uma notícia, com o essencial, chama-se:", ["titular", "entradilla", "cuerpo", "firma", "slogan"], 1, "É o lide da notícia."],
      ["\"Atentamente\" no fim de um e-mail indica:", ["informalidade", "uma despedida formal", "uma pergunta", "uma ordem", "um erro"], 1, "Fecho formal."],
    ],
    [["Qual a diferença entre um anúncio publicitário e uma campanha social?", "O anúncio publicitário busca vender um produto ou promover uma marca; a campanha social busca conscientizar o público e mudar comportamentos, como cuidar da água ou se vacinar."]],
  ),
];
