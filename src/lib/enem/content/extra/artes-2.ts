import { aula } from "./build";

/** Artes, lote 2: linguagem visual, arquitetura, quadrinhos, arte e sociedade e práticas corporais. */
export const ARTES_2 = [
  aula(
    "Elementos da linguagem visual: ponto, linha, cor e composição",
    `## Ler imagens

Assim como um texto, uma imagem tem **elementos** que produzem sentido. O ENEM pede que você **leia** pinturas, fotos, cartazes e anúncios.

## Elementos básicos

- **Ponto:** o elemento mínimo; muitos pontos formam figuras (o **pontilhismo** de Seurat).
- **Linha:** contorno, direção e movimento.
  - Horizontais: **calma**, estabilidade.
  - Verticais: **força**, elevação.
  - Diagonais: **movimento**, tensão, dinamismo.
  - Curvas: suavidade, fluidez.
- **Forma:** geométrica (quadrados, círculos) ou orgânica (formas da natureza).
- **Textura:** a sensação de superfície (lisa, áspera), real ou visual.
- **Volume e luz/sombra:** criam a ilusão de profundidade (claro-escuro).

## Cor

- **Primárias** (pigmento): **vermelho (magenta), amarelo e azul (ciano)**. Misturadas, formam as **secundárias**: laranja, verde e roxo.
- **Cores quentes** (vermelho, laranja, amarelo): energia, calor, alegria, urgência — por isso aparecem em promoções e fast-food.
- **Cores frias** (azul, verde, violeta): calma, frescor, tristeza, confiança — comuns em bancos e hospitais.
- **Complementares** (opostas no círculo cromático: azul e laranja, vermelho e verde): criam **contraste** forte.
- **Luz** (cores-luz RGB: vermelho, verde e azul) é diferente de **pigmento**: na tela do celular, a soma das cores forma o **branco**.
- Cores também têm **significados culturais** (o branco é luto em algumas culturas orientais).

## Composição

É a **organização** dos elementos no espaço:

- **Simetria** (equilíbrio, ordem) x **assimetria** (dinamismo).
- **Ponto focal:** para onde o olhar vai primeiro.
- **Regra dos terços:** dividir a imagem em 9 partes e colocar os elementos importantes nas linhas ou cruzamentos.
- **Perspectiva** e **profundidade**: primeiro plano, plano médio e fundo.
- **Proporção** e **escala**: tamanhos relativos (no Egito, os importantes eram maiores).

## Figurativo x abstrato

- **Figurativo:** representa algo reconhecível (pessoas, paisagens).
- **Abstrato:** não representa objetos do mundo real; trabalha com cores e formas (Kandinsky, Mondrian, Tomie Ohtake).

## Resumindo

Linhas diagonais dão movimento; horizontais, calma. Cores quentes transmitem energia; frias, calma. Complementares criam contraste. Composição organiza os elementos (simetria, ponto focal, regra dos terços).`,
    [
      "Linhas: horizontais (calma), verticais (força), diagonais (movimento).",
      "Cores quentes = energia; frias = calma.",
      "Complementares (azul/laranja) criam contraste forte.",
      "Composição: simetria, ponto focal, regra dos terços.",
    ],
    [
      ["Cores complementares", "Cores opostas no círculo cromático, que criam contraste."],
      ["Composição", "Organização dos elementos visuais no espaço da imagem."],
      ["Arte abstrata", "Arte que não representa objetos reconhecíveis do mundo real."],
    ],
    [
      ["Linhas diagonais numa imagem costumam transmitir:", ["calma", "movimento e tensão", "silêncio", "estabilidade total", "tristeza sempre"], 1, "Dinamismo."],
      ["Redes de fast-food usam vermelho e amarelo porque são cores:", ["frias, que acalmam", "quentes, que transmitem energia e estimulam", "neutras", "complementares do azul", "tristes"], 1, "Cores quentes."],
      ["São cores complementares:", ["azul e verde", "azul e laranja", "vermelho e laranja", "amarelo e laranja", "verde e azul-claro"], 1, "Opostas no círculo."],
      ["Uma obra composta apenas de formas e cores, sem representar objetos reais, é:", ["figurativa", "abstrata", "realista", "renascentista", "fotográfica"], 1, "Abstracionismo."],
      ["As cores primárias de pigmento são:", ["verde, laranja e roxo", "vermelho/magenta, amarelo e azul/ciano", "preto, branco e cinza", "vermelho, verde e azul-luz", "rosa, azul e marrom"], 1, "Base das misturas."],
    ],
    [["Explique como a escolha das cores pode influenciar a mensagem de um anúncio publicitário.", "Cores quentes, como vermelho e amarelo, transmitem energia e urgência e são usadas em promoções e comida; cores frias, como azul e verde, transmitem calma e confiança, usadas por bancos e marcas de saúde; assim, a cor reforça a mensagem pretendida."]],
  ),
  aula(
    "Arte medieval: românico e gótico",
    `## Arte a serviço da fé

Na **Idade Média** (séculos V a XV), a **Igreja** era a instituição mais poderosa da Europa, e a arte servia principalmente para **ensinar a fé** a uma população que, em sua maioria, **não sabia ler**. As imagens funcionavam como uma "**Bíblia dos iletrados**".

## Arte bizantina

- No Império Bizantino (Constantinopla).
- **Mosaicos** dourados, figuras **rígidas** e frontais, sem perspectiva, com fundo dourado que simboliza o **divino**.
- Ex.: Igreja de **Santa Sofia** (Istambul); mosaicos de Ravena.
- **Ícones:** pinturas religiosas em madeira.

## Estilo românico (séculos XI e XII)

- Igrejas com **paredes grossas**, **arcos redondos** (de volta inteira), **poucas janelas** e interior **escuro**.
- Aparência de **fortaleza**: solidez e proteção, num tempo de insegurança.
- Esculturas e pinturas com figuras **simplificadas**, para ensinar passagens bíblicas.

## Estilo gótico (séculos XII a XV)

Surgiu com o crescimento das **cidades** (renascimento urbano e comercial).

- **Verticalidade**: catedrais altíssimas, que apontam para o **céu** (Deus).
- **Arcos ogivais** (pontudos) e **abóbadas** de nervuras.
- **Arcobotantes**: estruturas externas que sustentam as paredes, permitindo paredes **mais finas** e com grandes aberturas.
- **Vitrais** coloridos enormes e **rosáceas**: muita **luz**, simbolizando a presença divina.
- **Gárgulas**: esculturas de monstros que escoam a água da chuva.
- Exemplos: **Notre-Dame de Paris**, Catedral de **Chartres**, Catedral de Colônia.

## Comparando

| Românico | Gótico |
|---|---|
| Paredes grossas | Paredes finas com arcobotantes |
| Arco redondo | Arco ogival |
| Interior escuro | Interior iluminado por vitrais |
| Horizontalidade, peso | Verticalidade, leveza |

## Outras artes

- **Iluminuras:** ilustrações em manuscritos feitos por monges.
- **Canto gregoriano:** música religiosa em uníssono.
- **Tapeçaria de Bayeux:** narrativa bordada da conquista normanda da Inglaterra.

## Resumindo

A arte medieval ensinava a fé. Bizantina: mosaicos dourados. Românico: paredes grossas, arcos redondos, interior escuro. Gótico: verticalidade, arcos ogivais, arcobotantes e vitrais coloridos (Notre-Dame).`,
    [
      "Arte medieval servia para ensinar a fé aos iletrados.",
      "Bizantina: mosaicos dourados e figuras rígidas.",
      "Românico: paredes grossas, arcos redondos, pouca luz.",
      "Gótico: verticalidade, arcos ogivais, vitrais e arcobotantes.",
    ],
    [
      ["Vitral", "Composição de vidros coloridos que forma imagens em janelas."],
      ["Arcobotante", "Estrutura externa que sustenta as paredes das catedrais góticas."],
      ["Iluminura", "Ilustração pintada à mão em manuscritos medievais."],
    ],
    [
      ["Uma característica do estilo gótico é:", ["paredes grossas e escuras", "verticalidade e vitrais coloridos", "arcos redondos", "ausência de esculturas", "construções baixas"], 1, "Luz e elevação."],
      ["O estilo românico tem aparência de fortaleza por causa:", ["dos vitrais", "das paredes grossas e poucas janelas", "das torres de vidro", "dos arcobotantes", "das cúpulas douradas"], 1, "Solidez."],
      ["A função principal da arte medieval era:", ["decorar palácios", "ensinar a fé a uma população em grande parte iletrada", "vender obras", "retratar a natureza com realismo", "criticar a Igreja"], 1, "Bíblia dos iletrados."],
      ["Os arcobotantes permitiram às catedrais góticas:", ["ter paredes mais finas e grandes janelas", "ficar mais escuras", "ser mais baixas", "dispensar telhados", "usar só madeira"], 0, "Sustentação externa."],
      ["Os mosaicos dourados com figuras rígidas são típicos da arte:", ["renascentista", "bizantina", "barroca", "impressionista", "cubista"], 1, "Constantinopla."],
    ],
    [["Compare o estilo românico com o gótico.", "O românico tem paredes grossas, arcos redondos, poucas janelas e interior escuro, com aparência de fortaleza; o gótico tem verticalidade, arcos ogivais, arcobotantes que permitem paredes finas e grandes vitrais que enchem o interior de luz."]],
  ),
  aula(
    "Arte no Brasil do século XIX: academia, Missão Francesa e pintura histórica",
    `## A Missão Artística Francesa (1816)

Trazida por **Dom João VI**, reuniu artistas franceses como **Jean-Baptiste Debret**, **Nicolas Taunay** e o arquiteto **Grandjean de Montigny**. Ela levou à criação da **Academia Imperial de Belas Artes** (1826), no Rio de Janeiro.

## Neoclassicismo e academicismo

- Inspirado na Antiguidade clássica: **equilíbrio**, **ordem**, desenho preciso e temas **nobres** (história, mitologia).
- A **Academia** ensinava regras rígidas e formava artistas que serviam ao **Império**.

## Debret: o registro do cotidiano

- Em ***Viagem Pitoresca e Histórica ao Brasil***, Debret retratou o **cotidiano** do Rio: mercados, festas, vestimentas e, especialmente, o trabalho e os **castigos** dos **escravizados** (*Feitor castigando negros*, *Jantar no Brasil*).
- Suas imagens são importantes **fontes históricas**, mas também refletem o **olhar europeu** do artista.
- Outros viajantes: **Johann Moritz Rugendas** e o desenhista da expedição Langsdorff.

## Pintura histórica e Romantismo

O Império queria construir uma **identidade nacional** e uma **memória heroica** por meio da arte.

- **Pedro Américo:** ***Independência ou Morte!*** (*O Grito do Ipiranga*, 1888) — cena **idealizada**: Dom Pedro heroico, a cavalo, com soldados em uniforme de gala, num momento que na realidade foi bem menos grandioso. Também *Batalha do Avaí* (Guerra do Paraguai).
- **Victor Meirelles:** ***A Primeira Missa no Brasil*** (1860) — indígenas observando pacificamente a missa, imagem de harmonia na colonização; *Moema* (indianismo); *Batalha dos Guararapes*.
- **Indianismo** na pintura: o indígena idealizado, como na literatura de Alencar.

## Leitura crítica

O ENEM cobra a ideia de que essas pinturas **não são registros fiéis**: são **construções** que exaltam o poder imperial e escondem conflitos (a violência da colonização, a participação popular). Compare com obras **modernistas** e **contemporâneas** que releem esses temas (por exemplo, paródias da *Primeira Missa* com olhar crítico).

## Almeida Júnior: o caipira

No fim do século, **Almeida Júnior** pintou o **caipira paulista** de forma realista (*Caipira Picando Fumo*, *O Violeiro*), antecipando a valorização do brasileiro comum.

## Resumindo

A Missão Francesa (1816) criou a Academia. Debret registrou o cotidiano e a escravidão. Pedro Américo (O Grito do Ipiranga) e Victor Meirelles (A Primeira Missa) idealizaram a história para construir a identidade nacional. Almeida Júnior retratou o caipira.`,
    [
      "Missão Francesa (1816) e Academia Imperial de Belas Artes.",
      "Debret retratou o cotidiano e a escravidão no Rio.",
      "Pedro Américo e Victor Meirelles idealizaram a história nacional.",
      "Pinturas históricas são construções, não registros fiéis.",
    ],
    [
      ["Academicismo", "Arte que segue as regras e modelos ensinados nas academias."],
      ["Pintura histórica", "Pintura que representa acontecimentos históricos, muitas vezes de forma idealizada."],
      ["Fonte histórica", "Registro do passado usado para estudar a história."],
    ],
    [
      ["O quadro \"Independência ou Morte!\" é de:", ["Debret", "Pedro Américo", "Victor Meirelles", "Portinari", "Tarsila"], 1, "Dica: 1888."],
      ["\"A Primeira Missa no Brasil\" (1860) apresenta:", ["a violência da colonização", "uma imagem de harmonia entre indígenas e portugueses", "uma cena de batalha", "a Semana de 22", "a abolição"], 1, "Visão idealizada."],
      ["As imagens de Debret são importantes porque:", ["mostram a corte francesa", "registram o cotidiano e a escravidão no Rio, sendo fontes históricas", "são abstratas", "foram feitas por indígenas", "retratam a Europa"], 1, "Viagem Pitoresca."],
      ["A leitura crítica das pinturas históricas do Império mostra que elas:", ["são fotografias fiéis", "idealizam os fatos para exaltar o poder e a nação", "não têm valor", "foram feitas no século XX", "criticam o imperador"], 1, "Construção de memória."],
      ["Almeida Júnior ficou conhecido por pintar:", ["batalhas", "o caipira paulista de forma realista", "santos barrocos", "paisagens europeias", "abstrações"], 1, "Caipira Picando Fumo."],
    ],
    [["Por que se diz que o quadro \"Independência ou Morte!\" não é um registro fiel do acontecimento?", "Porque Pedro Américo pintou a cena décadas depois, de forma idealizada e heroica, com Dom Pedro e soldados em trajes de gala, para exaltar o Império e construir uma memória nacional, e não para mostrar como o fato realmente ocorreu."]],
  ),
  aula(
    "Arquitetura moderna brasileira: Niemeyer, Lúcio Costa e Lina Bo Bardi",
    `## Arquitetura moderna

No século XX, a arquitetura moderna rompeu com os enfeites do passado e valorizou a **função**, as **formas simples**, o **concreto armado**, o **vidro** e a **planta livre**. O suíço-francês **Le Corbusier** foi uma grande referência, com seus "cinco pontos": **pilotis** (colunas que elevam o prédio), planta livre, fachada livre, janelas em fita e terraço-jardim.

## O Brasil na vanguarda

- **Ministério da Educação e Saúde** (Rio, 1936–1945): projeto de **Lúcio Costa**, **Oscar Niemeyer** e equipe, com consultoria de Le Corbusier; marco da arquitetura moderna no país, com painéis de azulejos de **Portinari** e jardins de **Burle Marx**.

## Oscar Niemeyer (1907–2012)

- Famoso pelas **curvas** do concreto: "Não é o ângulo reto que me atrai... O que me atrai é a **curva livre e sensual**", inspirada nas montanhas e no corpo da mulher brasileira.
- **Conjunto da Pampulha** (Belo Horizonte, anos 1940): Igreja de São Francisco de Assis.
- **Brasília:** Congresso Nacional (cúpulas invertida e normal), **Catedral**, Palácio da Alvorada, Palácio do Planalto.
- **Museu de Arte Contemporânea de Niterói** (o "disco voador").
- Recebeu o **Prêmio Pritzker** (1988).

## Brasília (1960)

- Construída no governo **Juscelino Kubitschek** (Plano de Metas, "50 anos em 5").
- **Plano Piloto** de **Lúcio Costa**: em forma de **avião** (ou cruz), com o **Eixo Monumental** e as **superquadras** residenciais.
- **Patrimônio Mundial da UNESCO**.
- Críticas: cidade feita para o **carro**, segregação (trabalhadores — os **candangos** — foram morar nas **cidades-satélites**, longe do centro).

## Lina Bo Bardi (1914–1992)

- Arquiteta italiana naturalizada brasileira.
- **MASP** (Museu de Arte de São Paulo, 1968): bloco suspenso por **pilares**, criando um **vão livre** de 74 m na Avenida Paulista, um espaço **público** para encontros e manifestações. Os quadros ficavam em **cavaletes de vidro**.
- **SESC Pompeia:** antiga fábrica transformada em centro de cultura e lazer.
- Valorizou a **cultura popular** e o design do Nordeste.

## Burle Marx

Paisagista que valorizou a **flora brasileira** em jardins modernos (calçadão de **Copacabana**, com ondas em pedras portuguesas; Aterro do Flamengo).

## Resumindo

A arquitetura moderna valoriza função, concreto, vidro e pilotis. Niemeyer criou curvas em Pampulha e Brasília. Lúcio Costa fez o Plano Piloto. Lina Bo Bardi projetou o MASP com vão livre. Burle Marx valorizou a flora nativa.`,
    [
      "Arquitetura moderna: função, concreto, vidro e pilotis.",
      "Niemeyer: curvas livres; Pampulha e Brasília.",
      "Brasília (1960): Plano Piloto de Lúcio Costa, patrimônio da UNESCO.",
      "Lina Bo Bardi: MASP com vão livre; SESC Pompeia.",
    ],
    [
      ["Pilotis", "Colunas que elevam o edifício e liberam o térreo."],
      ["Plano Piloto", "Projeto urbanístico de Brasília, criado por Lúcio Costa."],
      ["Vão livre", "Espaço aberto sem colunas, como o do MASP."],
    ],
    [
      ["O arquiteto famoso pelas curvas no concreto é:", ["Lúcio Costa", "Oscar Niemeyer", "Burle Marx", "Le Corbusier", "Grandjean de Montigny"], 1, "Curva livre e sensual."],
      ["O Plano Piloto de Brasília foi elaborado por:", ["Niemeyer", "Lúcio Costa", "Lina Bo Bardi", "JK", "Burle Marx"], 1, "Forma de avião."],
      ["O MASP, com seu vão livre na Avenida Paulista, foi projetado por:", ["Lina Bo Bardi", "Niemeyer", "Tarsila do Amaral", "Paulo Mendes da Rocha", "Lúcio Costa"], 0, "Dica: 1968."],
      ["Uma crítica feita a Brasília é que ela:", ["não tem prédios modernos", "foi pensada para o carro e afastou os trabalhadores para as cidades-satélites", "não é patrimônio", "tem ruas estreitas coloniais", "não tem planejamento"], 1, "Segregação."],
      ["O paisagista que valorizou a flora brasileira, autor do calçadão de Copacabana, é:", ["Burle Marx", "Debret", "Portinari", "Di Cavalcanti", "Aleijadinho"], 0, "Jardins modernos."],
    ],
    [["Explique a importância do vão livre do MASP projetado por Lina Bo Bardi.", "O vão livre de 74 metros, criado ao suspender o museu sobre pilares, transformou o espaço sob o prédio num lugar público na Avenida Paulista, usado para encontros, feiras e manifestações, unindo arquitetura e vida urbana."]],
  ),
  aula(
    "Histórias em quadrinhos: linguagem e recursos",
    `## A nona arte

As **histórias em quadrinhos (HQs)** combinam **imagem** e **texto** em sequência para contar histórias. São chamadas de "**nona arte**" e aparecem muito no ENEM (tirinhas, charges, graphic novels).

## Elementos da linguagem dos quadrinhos

- **Quadro (vinheta):** cada cena; a sequência cria o tempo da narrativa.
- **Sarjeta:** o espaço entre os quadros, onde o leitor imagina o que aconteceu (**elipse**).
- **Balões:** indicam o tipo de fala:
  - Contorno normal: **fala**.
  - Em forma de **nuvem** (com bolinhas): **pensamento**.
  - Contorno **pontilhado**: **sussurro**.
  - Contorno **serrilhado/espinhoso**: **grito**, raiva ou som de aparelhos (rádio, telefone).
  - Rabicho apontando para fora do quadro: alguém falando que não aparece.
- **Legenda (recordatório):** caixa de texto com a voz do **narrador** (tempo, lugar).
- **Onomatopeias:** palavras que imitam sons (*BUM!*, *POW!*, *TOC TOC*, *ZZZ*), muitas vezes com letras grandes e coloridas.
- **Linhas cinéticas:** traços que indicam **movimento** (velocidade, impacto).
- **Metáforas visuais:** lâmpada (ideia), estrelas (dor), coração (amor), serrote cortando um tronco (sono), nuvem escura (mau humor).
- **Enquadramento e planos:** como no cinema (close para emoção; plano geral para o cenário).

## Gêneros

- **Tirinha:** curta, 1 a 4 quadros, humor com desfecho surpreendente.
- **Charge:** um quadro, crítica a fato atual.
- **Graphic novel / romance gráfico:** narrativa longa e complexa (*Maus*, de Art Spiegelman, sobre o Holocausto, com judeus como ratos e nazistas como gatos; *Persépolis*, de Marjane Satrapi, sobre o Irã).
- **Mangá** (Japão): lido da direita para a esquerda.

## Quadrinhos brasileiros

**Maurício de Sousa** (Turma da Mônica), **Ziraldo** (Turma do Pererê, O Menino Maluquinho), **Angeli**, **Laerte**, **Henfil**, **Armandinho** (Alexandre Beck), irmãos **Fábio Moon e Gabriel Bá** (*Daytripper*), **Marcelo D'Salete** (*Angola Janga*, sobre Palmares; ganhou o Eisner).

## Resumindo

HQs combinam imagem e texto em quadros. Balões indicam fala, pensamento, sussurro ou grito. Onomatopeias, linhas cinéticas e metáforas visuais criam sentido. Gêneros: tirinha, charge, graphic novel e mangá.`,
    [
      "Balão de nuvem = pensamento; serrilhado = grito.",
      "Onomatopeias imitam sons; linhas cinéticas, movimento.",
      "Metáforas visuais: lâmpada = ideia; estrelas = dor.",
      "Graphic novels: Maus, Persépolis, Angola Janga.",
    ],
    [
      ["Balão", "Espaço que contém a fala ou o pensamento do personagem."],
      ["Onomatopeia", "Palavra que imita um som."],
      ["Linhas cinéticas", "Traços que indicam movimento nos quadrinhos."],
    ],
    [
      ["Nos quadrinhos, o balão em forma de nuvem indica:", ["grito", "pensamento", "sussurro", "fala de rádio", "narração"], 1, "Pensamento."],
      ["Uma lâmpada acesa sobre a cabeça do personagem representa:", ["sono", "uma ideia", "dor", "raiva", "medo"], 1, "Metáfora visual."],
      ["\"Maus\", de Art Spiegelman, trata:", ["de super-heróis", "do Holocausto, com judeus como ratos e nazistas como gatos", "da vida no Japão", "de futebol", "da Turma da Mônica"], 1, "Graphic novel premiada."],
      ["O espaço entre os quadros, onde o leitor imagina a ação, chama-se:", ["balão", "sarjeta", "legenda", "onomatopeia", "vinheta"], 1, "Elipse narrativa."],
      ["Os traços que indicam que um personagem está correndo são:", ["onomatopeias", "linhas cinéticas", "balões", "legendas", "sarjetas"], 1, "Movimento."],
    ],
    [["Como os diferentes formatos de balão ajudam a construir o sentido nos quadrinhos?", "O formato do balão mostra como a fala acontece: contorno normal indica fala comum, nuvem indica pensamento, pontilhado indica sussurro e serrilhado indica grito ou som de aparelho, permitindo ao leitor entender o tom sem precisar de explicação."]],
  ),
  aula(
    "Arte e política: muralismo, cartazes e arte engajada",
    `## A arte como ferramenta política

A arte sempre teve relação com o **poder**: pode **exaltar** governos, **denunciar** injustiças ou **mobilizar** a população.

## Muralismo mexicano

- Após a **Revolução Mexicana** (1910–1920), o governo encomendou **murais** em prédios públicos para contar a **história do México** ao povo (muitos analfabetos).
- Artistas: **Diego Rivera**, **David Alfaro Siqueiros**, **José Clemente Orozco**.
- Temas: o **povo indígena e mestiço**, os trabalhadores, a revolução, a crítica ao colonialismo e ao capitalismo.
- **Frida Kahlo**, esposa de Rivera, fez autorretratos com elementos da cultura mexicana, da dor física e da identidade.
- Influenciou artistas brasileiros como **Portinari** (painéis *Guerra e Paz*).

## Propaganda política

- **Regimes totalitários** usaram a arte como **propaganda**:
  - **Nazismo:** cartazes, filmes de **Leni Riefenstahl**, exaltação da "raça ariana". A arte moderna foi chamada de "**arte degenerada**" e perseguida.
  - **Realismo socialista** (URSS): obras que exaltavam trabalhadores, o partido e Stálin.
- **Estado Novo** (Vargas): o **DIP** controlava a imprensa e a cultura.
- Cartazes de guerra (*We Can Do It!*, com a "Rosie the Riveter", incentivando mulheres a trabalhar nas fábricas americanas).

## Arte engajada e de protesto

- **Picasso, *Guernica*** (1937): denúncia do bombardeio.
- **Goya, *O Três de Maio de 1808***: execução de civis espanhóis pelas tropas francesas.
- **Cartazes** do Maio de 1968 em Paris.
- No Brasil, durante a **ditadura**: **Cildo Meireles** (*Inserções em Circuitos Ideológicos*, frases como "Quem matou Herzog?" carimbadas em cédulas), **Antonio Manuel**, canções e teatro de protesto.
- **Arte urbana** atual: **grafites** e **lambe-lambes** com críticas sociais; o artista britânico **Banksy**.
- **Artivismo**: união de arte e ativismo (movimentos feministas, antirracistas, ambientais).

## Censura

Regimes autoritários **censuram** obras que os criticam. A liberdade artística é um **direito** garantido pela Constituição de 1988.

## Resumindo

O muralismo mexicano (Rivera, Siqueiros, Orozco) levou a história ao povo em murais públicos. Regimes totalitários usaram a arte como propaganda e perseguiram a arte moderna. Guernica, Cildo Meireles e Banksy mostram a arte como denúncia.`,
    [
      "Muralismo mexicano: Rivera, Siqueiros e Orozco.",
      "Totalitarismos usaram a arte como propaganda.",
      "Nazismo chamou a arte moderna de \"arte degenerada\".",
      "Arte de protesto: Guernica, Cildo Meireles, Banksy.",
    ],
    [
      ["Muralismo", "Movimento de pinturas em grandes murais públicos, como no México."],
      ["Propaganda política", "Uso de imagens e mensagens para difundir ideias de um governo ou grupo."],
      ["Artivismo", "União de arte e ativismo político e social."],
    ],
    [
      ["O muralismo mexicano surgiu após:", ["a Segunda Guerra", "a Revolução Mexicana", "a independência dos EUA", "a Guerra Fria", "a chegada de Colombo"], 1, "Arte para o povo."],
      ["Diego Rivera é um dos principais nomes do:", ["Impressionismo", "muralismo mexicano", "Barroco", "Cubismo", "Renascimento"], 1, "Murais públicos."],
      ["O nazismo chamou a arte moderna de:", ["arte heroica", "arte degenerada", "arte oficial", "arte clássica", "arte popular"], 1, "Perseguição."],
      ["As \"Inserções em Circuitos Ideológicos\" de Cildo Meireles consistiam em:", ["murais em igrejas", "frases críticas carimbadas em cédulas e garrafas durante a ditadura", "esculturas de bronze", "filmes de propaganda", "fotos de moda"], 1, "Arte de protesto."],
      ["Um exemplo de cartaz que incentivou mulheres a trabalhar nas fábricas durante a guerra é:", ["Guernica", "We Can Do It!", "O Grito", "Abaporu", "Mona Lisa"], 1, "Rosie the Riveter."],
    ],
    [["Por que o governo mexicano incentivou o muralismo após a Revolução?", "Porque queria levar a história e os valores da revolução a um povo em grande parte analfabeto; os murais em prédios públicos eram acessíveis a todos e valorizavam os indígenas, os trabalhadores e a identidade nacional."]],
  ),
  aula(
    "Arte e tecnologia: arte digital, games e inteligência artificial",
    `## Novas tecnologias, novas artes

Cada nova tecnologia transforma a arte: a **fotografia** (século XIX) libertou a pintura de copiar o real; o **cinema** criou uma nova linguagem; hoje, o **digital** e a **IA** levantam novas perguntas.

## Arte digital

- Obras criadas com **computadores**, softwares, tablets e programação.
- **Videoarte** (pioneiro: **Nam June Paik**), **instalações interativas**, **realidade virtual**, **projeções mapeadas** (projection mapping em prédios).
- **Arte generativa:** obras criadas por algoritmos.
- **Memes**, **GIFs** e **remix**: criação coletiva e intertextual na internet.

## Games como linguagem artística

- Combinam **narrativa**, **música**, **artes visuais**, **design** e **interatividade**.
- O jogador **participa** da história (agência).
- Debates: games são arte? Muitos museus (como o MoMA) já incluem games em seus acervos.
- **Gamificação:** uso de elementos de jogos em educação e trabalho (pontos, níveis, desafios).

## Inteligência artificial e criação

- Programas de IA geram **imagens**, **músicas** e **textos** a partir de comandos.
- Debates:
  - **Autoria:** quem é o autor — a pessoa, o programa ou os artistas cujas obras treinaram a IA?
  - **Direitos autorais:** uso de obras sem autorização no treinamento.
  - **Trabalho dos artistas:** ameaça a ilustradores, dubladores, músicos.
  - **Deepfakes** e desinformação.
  - O que torna algo **arte**: técnica, intenção, emoção, contexto?

## Reprodutibilidade e aura (de novo)

**Walter Benjamin** já discutia como a reprodução técnica tira a "**aura**" da obra única, mas democratiza o acesso. No digital, a cópia é perfeita e infinita. Tecnologias como os **NFTs** tentaram criar "originais" digitais.

## Democratização x desigualdade

- A tecnologia permite que mais pessoas **criem** e **divulguem** arte (celular, redes sociais).
- Mas há **exclusão digital**: nem todos têm acesso a internet e equipamentos.
- Os **algoritmos** das plataformas influenciam o que fica visível.

## Resumindo

A tecnologia sempre transformou a arte. Arte digital, videoarte, games e memes são novas linguagens. A IA gera imagens e textos e levanta debates sobre autoria, direitos autorais e trabalho. Benjamin ajuda a pensar a reprodução digital.`,
    [
      "Fotografia, cinema e digital transformaram a arte.",
      "Games unem narrativa, música, artes visuais e interatividade.",
      "IA levanta debates sobre autoria, direitos e trabalho.",
      "Exclusão digital limita a democratização da criação.",
    ],
    [
      ["Arte digital", "Arte criada ou apresentada com tecnologias digitais."],
      ["Arte generativa", "Arte produzida por algoritmos ou sistemas autônomos."],
      ["Direito autoral", "Direito do criador sobre o uso de sua obra."],
    ],
    [
      ["O pioneiro da videoarte é:", ["Picasso", "Nam June Paik", "Leonardo da Vinci", "Debret", "Monet"], 1, "Arte com vídeo e TV."],
      ["Um debate sobre imagens geradas por IA envolve:", ["a cor das tintas", "a autoria e os direitos autorais", "o peso das molduras", "a técnica do afresco", "a perspectiva renascentista"], 1, "Quem é o autor?"],
      ["Os games podem ser considerados linguagem artística porque:", ["não têm narrativa", "combinam narrativa, música, visual e interatividade", "são só esporte", "não usam imagens", "são feitos à mão"], 1, "Arte interativa."],
      ["Para Walter Benjamin, a reprodução técnica:", ["aumenta a aura da obra", "faz a obra perder a aura, mas democratiza o acesso", "proíbe a arte", "não muda nada", "só vale para pinturas"], 1, "Perda da aura."],
      ["Um limite à democratização da arte digital é:", ["o excesso de museus", "a exclusão digital", "a falta de artistas", "o fim da internet", "a proibição de celulares"], 1, "Acesso desigual."],
    ],
    [["Quais questões éticas a criação de imagens por inteligência artificial levanta?", "Questões sobre quem é o autor da obra, sobre o uso sem autorização de obras de artistas para treinar os sistemas (direitos autorais), sobre os impactos no trabalho de ilustradores e músicos e sobre o risco de deepfakes e desinformação."]],
  ),
  aula(
    "Práticas corporais: jogos, ginástica, esporte e saúde",
    `## A Educação Física no ENEM

A área de **Linguagens** inclui a **Educação Física**, que estuda as **práticas corporais** como **cultura** — formas de expressão, lazer, saúde e convivência.

## Tipos de práticas corporais

- **Jogos e brincadeiras:** pega-pega, queimada, amarelinha, pipa; regras flexíveis e combinadas pelos participantes; transmitidos entre gerações (jogos tradicionais e indígenas, como a **peteca**, de origem tupi).
- **Esportes:** regras **oficiais** e universais, competição, federações (futebol, vôlei, basquete).
- **Ginásticas:** de condicionamento, artística, rítmica, **ginástica laboral** (no trabalho, para prevenir lesões).
- **Danças:** expressão cultural (frevo, forró, samba, hip-hop).
- **Lutas:** capoeira, judô, jiu-jítsu, **huka-huka** (luta indígena do Xingu).
- **Práticas de aventura:** skate, surfe, escalada, parkour, trilhas.

## Jogo x esporte

- **Jogo:** regras **adaptáveis**, foco no **prazer** e na participação.
- **Esporte:** regras **oficiais**, competição, **rendimento**, profissionalização.
- O esporte pode ser praticado de forma **educativa** e de **lazer** (inclusiva), não só de alto rendimento.

## Saúde e atividade física

- A **OMS** recomenda cerca de **150 a 300 minutos** por semana de atividade moderada para adultos e **60 minutos por dia** para crianças e adolescentes.
- Benefícios: prevenção de **doenças cardiovasculares**, **diabetes**, **obesidade**, melhora da **saúde mental**, do sono e da autoestima.
- **Sedentarismo** é um fator de risco crescente (telas, trabalho sentado).
- **Exercício físico** (planejado e sistemático) x **atividade física** (qualquer movimento, como caminhar até a escola).

## Corpo, mídia e esporte

- A mídia **espetaculariza** o esporte e cria ídolos; também difunde padrões de corpo.
- Uso de **anabolizantes** e **doping**: riscos à saúde e à ética esportiva.
- Desigualdades: menor visibilidade e salário do **esporte feminino**; **racismo** nos estádios; acesso desigual a espaços de lazer.

## Inclusão

- **Esporte paralímpico** (o Brasil é potência), adaptações para pessoas com deficiência.
- Direito ao **lazer** previsto na Constituição.

## Resumindo

Práticas corporais incluem jogos, esportes, ginásticas, danças, lutas e aventura. Jogo tem regras flexíveis; esporte, regras oficiais. Atividade física previne doenças e melhora a saúde mental. A mídia espetaculariza o esporte e há desigualdades de gênero e raça.`,
    [
      "Práticas corporais: jogos, esportes, ginásticas, danças, lutas, aventura.",
      "Jogo: regras flexíveis; esporte: regras oficiais e competição.",
      "OMS: 150–300 min/semana para adultos; 60 min/dia para jovens.",
      "Desigualdades no esporte: gênero, raça e acesso.",
    ],
    [
      ["Práticas corporais", "Manifestações culturais que envolvem o movimento do corpo."],
      ["Sedentarismo", "Falta de atividade física regular."],
      ["Ginástica laboral", "Exercícios feitos no ambiente de trabalho para prevenir lesões."],
    ],
    [
      ["A principal diferença entre jogo e esporte é que o esporte:", ["não tem regras", "tem regras oficiais e institucionalizadas", "é sempre para crianças", "não tem competição", "não usa o corpo"], 1, "Federações e regras universais."],
      ["A peteca é um jogo de origem:", ["japonesa", "indígena (tupi)", "inglesa", "africana do norte", "grega"], 1, "Tradição brasileira."],
      ["A OMS recomenda para crianças e adolescentes cerca de:", ["10 minutos por semana", "60 minutos de atividade por dia", "nenhuma atividade", "5 horas por dia", "uma vez por mês"], 1, "Atividade diária."],
      ["A ginástica laboral tem como objetivo:", ["competir em olimpíadas", "prevenir lesões e melhorar o bem-estar no trabalho", "substituir o trabalho", "aumentar a jornada", "vender produtos"], 1, "Saúde do trabalhador."],
      ["Uma desigualdade presente no esporte é:", ["igualdade salarial entre homens e mulheres", "menor visibilidade e remuneração do esporte feminino", "ausência de ídolos", "falta de regras", "excesso de espaços públicos para todos"], 1, "Questão de gênero."],
    ],
    [["Diferencie atividade física de exercício físico e cite benefícios de praticá-los.", "Atividade física é qualquer movimento corporal, como caminhar ou subir escadas; exercício físico é a atividade planejada e regular para melhorar o condicionamento. Ambos previnem doenças cardiovasculares, diabetes e obesidade e melhoram a saúde mental e o sono."]],
  ),
  aula(
    "Arte africana e sua influência na arte moderna",
    `## Uma arte milenar e diversa

A África tem **54 países** e centenas de povos, com tradições artísticas **muito diversas** e **antigas**. Não existe uma única "arte africana".

## Características gerais da arte tradicional

- Muitas vezes ligada a **rituais**, à **religião**, à **ancestralidade** e à vida em comunidade — não feita apenas para contemplação em museus.
- **Máscaras** usadas em cerimônias, danças e ritos de passagem (como as dos povos **dogon**, **iorubá** e **fang**).
- **Esculturas** em madeira, marfim e metal.
- Os **Bronzes do Benin** (Nigéria), obras-primas em metal; muitos foram **saqueados** pelos britânicos em 1897 e hoje há campanhas pela **repatriação** desses objetos.
- **Estilização:** formas geométricas, proporções expressivas (cabeças maiores, olhos amendoados), não buscando imitar o real.
- **Tecidos** (kente de Gana), **pinturas corporais** e **arquitetura** (mesquitas de barro de Djenné, no Mali).

## Influência nas vanguardas europeias

- No início do século XX, artistas europeus viram máscaras e esculturas africanas em museus etnográficos (muitas levadas durante o **colonialismo**).
- **Picasso**, em ***Les Demoiselles d'Avignon*** (1907), deformou rostos com traços inspirados em **máscaras africanas** — obra que abriu caminho para o **Cubismo**.
- **Matisse**, **Modigliani** e os expressionistas alemães também se inspiraram.
- Crítica: durante muito tempo, essas obras foram vistas como "**primitivas**", numa visão **eurocêntrica**, e seus criadores ficaram **anônimos**, enquanto os europeus foram celebrados.

## Herança africana no Brasil

- Arte sacra das **religiões de matriz africana** (ferramentas e símbolos dos **orixás**).
- **Rubem Valentim:** transformou símbolos dos orixás em formas geométricas modernas.
- **Mestre Didi**, **Heitor dos Prazeres**, **Emanoel Araujo** (fundador do **Museu Afro Brasil**), **Rosana Paulino**.

## Arte africana contemporânea

Artistas como **El Anatsui** (Gana: grandes painéis feitos com tampinhas de garrafa), **Chéri Samba** (Congo) e fotógrafos como **Seydou Keïta** (Mali) mostram uma produção atual e global.

## Resumindo

A arte africana é diversa e ligada a rituais e à ancestralidade (máscaras, Bronzes do Benin). Inspirou Picasso e o Cubismo, mas foi vista de forma eurocêntrica como "primitiva". No Brasil, influencia a arte afro-brasileira (Rubem Valentim, Museu Afro Brasil).`,
    [
      "Arte africana é diversa e ligada a rituais e à ancestralidade.",
      "Bronzes do Benin: saqueados em 1897; debate sobre repatriação.",
      "Máscaras africanas inspiraram Picasso e o Cubismo.",
      "Visão eurocêntrica chamou essa arte de \"primitiva\".",
    ],
    [
      ["Repatriação", "Devolução de bens culturais ao país ou povo de origem."],
      ["Estilização", "Representação simplificada e expressiva, sem imitar o real."],
      ["Eurocentrismo", "Visão que toma a Europa como padrão e centro."],
    ],
    [
      ["A obra que mostra a influência das máscaras africanas e abriu caminho ao Cubismo é:", ["Mona Lisa", "Les Demoiselles d'Avignon", "O Grito", "Abaporu", "Guernica"], 1, "Picasso, 1907."],
      ["Os Bronzes do Benin são exemplo de:", ["arte europeia", "obras africanas saqueadas na época colonial", "arte renascentista", "pintura impressionista", "arte digital"], 1, "Debate sobre repatriação."],
      ["Uma característica da arte tradicional africana é:", ["ser feita apenas para museus", "estar ligada a rituais, religião e ancestralidade", "imitar fielmente a realidade", "ser exclusivamente pintura a óleo", "não ter significado"], 1, "Função social e sagrada."],
      ["Chamar a arte africana de \"primitiva\" revela:", ["respeito", "uma visão eurocêntrica", "análise científica", "valorização", "neutralidade"], 1, "Preconceito colonial."],
      ["O artista brasileiro que transformou símbolos dos orixás em formas geométricas é:", ["Rubem Valentim", "Pedro Américo", "Debret", "Portinari", "Aleijadinho"], 0, "Arte afro-brasileira moderna."],
    ],
    [["Explique a relação entre a arte africana e o Cubismo e por que essa relação é vista hoje de forma crítica.", "Picasso e outros artistas se inspiraram em máscaras e esculturas africanas para deformar e geometrizar as figuras, o que levou ao Cubismo; a crítica é que essas obras chegaram à Europa pelo colonialismo, foram chamadas de primitivas e seus criadores ficaram anônimos."]],
  ),
  aula(
    "Música e tecnologia: do disco ao streaming",
    `## Como ouvimos música mudou muito

A forma de **produzir**, **gravar**, **distribuir** e **ouvir** música se transformou com a tecnologia, e isso mudou a própria música e a sociedade.

## Linha do tempo

- **Antes da gravação:** música só ao vivo (concertos, festas, partituras tocadas em casa).
- **Fonógrafo e gramofone** (fim do século XIX): primeiras gravações. "**Pelo Telefone**" (1917), considerado o primeiro samba gravado.
- **Rádio** (anos 1920–1950): a **Era do Rádio** no Brasil, com **Rádio Nacional**, cantoras como **Carmen Miranda**, programas de auditório; o rádio ajudou a **unificar** culturalmente o país e a popularizar o samba.
- **Disco de vinil (LP)**, **fita cassete** e **walkman** (ouvir música sozinho, em movimento).
- **Televisão:** festivais da canção (anos 1960), videoclipes (MTV, anos 1980).
- **CD** (anos 1980–90): som digital.
- **MP3** e **internet** (fim dos anos 1990): compartilhamento de arquivos (Napster), crise das gravadoras e da pirataria.
- **Streaming** (anos 2010): acesso a milhões de músicas por assinatura ou gratuitamente com anúncios.

## Efeitos do streaming

- **Acesso** muito maior e **democratização** da produção (artistas independentes publicam sem gravadora).
- **Algoritmos** e **playlists** influenciam o que se ouve e podem criar **bolhas** de gosto.
- **Remuneração baixa** para a maioria dos artistas (frações de centavo por execução).
- Músicas **mais curtas**, com refrão no início, para prender a atenção.
- Sucesso ligado a **redes sociais** e vídeos curtos (dancinhas virais).

## Tecnologia na criação

- **Instrumentos eletrônicos**, sintetizadores, sampler (uso de trechos de outras músicas, base do **hip-hop**).
- **Home studio**: gravar em casa com computador.
- **Auto-tune** e produção digital.
- **Inteligência artificial** que compõe e imita vozes: debates sobre autoria e direitos.

## Indústria cultural (de novo)

Adorno e Horkheimer criticaram a **padronização** da música popular pela indústria. Hoje, discute-se se o streaming aumenta a **diversidade** ou reforça os **mesmos sucessos** de sempre.

## Resumindo

A música passou do ao vivo ao fonógrafo, rádio, vinil, CD, MP3 e streaming. O rádio unificou culturalmente o Brasil. O streaming democratizou o acesso e a produção, mas paga pouco aos artistas e é guiado por algoritmos.`,
    [
      "Do fonógrafo ao streaming: tecnologia mudou a música.",
      "Era do Rádio: unificação cultural e popularização do samba.",
      "Streaming democratiza o acesso, mas paga pouco aos artistas.",
      "Algoritmos e playlists influenciam o gosto (bolhas).",
    ],
    [
      ["Streaming", "Transmissão de música ou vídeo pela internet, sem baixar o arquivo."],
      ["Sampler", "Recurso que usa trechos de gravações em novas músicas."],
      ["Era do Rádio", "Período em que o rádio foi o principal meio de comunicação e entretenimento no Brasil."],
    ],
    [
      ["No Brasil, a Era do Rádio (anos 1930–1950) ajudou a:", ["acabar com o samba", "unificar culturalmente o país e popularizar o samba", "proibir a música popular", "criar o streaming", "eliminar os cantores"], 1, "Rádio Nacional."],
      ["Uma crítica ao streaming é:", ["acesso muito restrito", "baixa remuneração para a maioria dos artistas", "falta de músicas", "impossibilidade de ouvir no celular", "só tocar música clássica"], 1, "Frações de centavo."],
      ["O sampler, base do hip-hop, consiste em:", ["tocar ao vivo sem gravação", "usar trechos de outras gravações em novas músicas", "cantar sem instrumentos", "imprimir partituras", "gravar em vinil"], 1, "Reutilização criativa."],
      ["\"Pelo Telefone\" (1917) é considerado:", ["o primeiro rock brasileiro", "o primeiro samba gravado", "o hino nacional", "a primeira música eletrônica", "uma ópera"], 1, "Marco do samba."],
      ["As playlists geradas por algoritmos podem:", ["eliminar todas as bolhas", "criar bolhas de gosto, mostrando mais do mesmo", "proibir artistas", "aumentar o pagamento dos artistas", "acabar com a música"], 1, "Personalização."],
    ],
    [["Cite um aspecto positivo e um negativo do streaming para a música.", "Positivo: democratizou o acesso a milhões de músicas e permitiu que artistas independentes publicassem sem gravadora; negativo: paga muito pouco à maioria dos artistas e seus algoritmos podem criar bolhas e reforçar sempre os mesmos sucessos."]],
  ),
];
