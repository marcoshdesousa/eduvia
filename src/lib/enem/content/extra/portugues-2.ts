import { aula } from "./build";

/** Português, lote 2: gramática em uso, tipos e gêneros textuais. */
export const PORTUGUES_2 = [
  aula(
    "Concordância verbal e nominal sem medo",
    `## O que é concordância

É a **harmonia** entre as palavras da frase. O ENEM cobra os casos que mais aparecem na escrita e na redação.

## Concordância verbal: o verbo concorda com o sujeito

- Regra geral: verbo concorda em **número e pessoa** com o sujeito. "Os alunos **estudaram**."
- **Sujeito depois do verbo** (posposto) continua mandando: "**Chegaram** as encomendas." / "**Faltam** dois dias."
- **Sujeito composto** antes do verbo → plural: "Maria e João **saíram**."
- **"A maioria de / grande parte de"** + plural: o verbo pode ficar no singular ou plural. "A maioria dos alunos **passou/passaram**."
- **Porcentagem:** concorda com o numeral ou com o termo seguinte. "30% da turma **faltou**" / "30% dos alunos **faltaram**."
- **"Um dos que":** verbo geralmente no plural. "Ele é um dos que mais **estudam**."
- **Haver** no sentido de **existir** e **fazer** indicando **tempo**: **sempre no singular**. "**Havia** muitos problemas." / "**Faz** dez anos." (E o auxiliar também: "**Deve haver** soluções.")
- **Existir, acontecer, ocorrer** concordam normalmente: "**Existem** muitos problemas."
- **Pronome relativo "que":** concorda com o antecedente. "Fui eu que **fiz**." / "Fomos nós que **fizemos**."
- **"Quem":** verbo na 3ª pessoa. "Fui eu quem **fez**."

## Concordância nominal: adjetivos, artigos e numerais concordam com o substantivo

- "Os **livros** **novos**." / "As **provas** **difíceis**."
- **Adjetivo após vários substantivos:** concorda com o mais próximo ou vai para o plural. "Comprou camisa e calça **nova/novas**."
- **"Meio":** como advérbio (= um pouco) é **invariável**: "Ela está **meio** cansada." Como numeral (= metade) concorda: "**meia** hora".
- **"Bastante":** advérbio invariável ("estudaram **bastante**"); adjetivo varia ("**bastantes** livros").
- **"Anexo", "obrigado", "mesmo", "próprio", "quite":** concordam. "Seguem **anexas** as fotos." / "Ela disse: **obrigada**."
- **"É proibido / é necessário / é bom":** invariáveis se o substantivo não tiver artigo. "**É proibido** entrada." / "**É proibida a** entrada."
- **"Menos"** e **"alerta"**: invariáveis. "Havia **menos** pessoas."

## Resumindo

O verbo concorda com o sujeito, mesmo posposto. Haver (existir) e fazer (tempo) ficam no singular. "Meio" advérbio não varia. "Anexo" e "obrigado" concordam. "É proibido" varia só com artigo.`,
    [
      "Sujeito posposto também manda no verbo: \"Chegaram as cartas\".",
      "Haver (existir) e fazer (tempo) ficam no singular.",
      "\"Meio\" advérbio é invariável: \"meio cansada\".",
      "\"Anexo\", \"obrigado\" e \"mesmo\" concordam com o termo.",
    ],
    [
      ["Concordância verbal", "Ajuste do verbo à pessoa e ao número do sujeito."],
      ["Concordância nominal", "Ajuste de artigos, adjetivos e numerais ao substantivo."],
      ["Sujeito posposto", "Sujeito colocado depois do verbo."],
    ],
    [
      ["Qual frase segue a norma-padrão?", ["Haviam muitos candidatos.", "Fazem três anos que mudei.", "Existem muitas dúvidas.", "Houveram problemas.", "Deve haverem soluções."], 2, "Existir concorda normalmente."],
      ["Complete: \"___ as inscrições para o ENEM.\"", ["Abriu-se", "Abriram", "Abriu", "Abre", "Foi aberto"], 1, "Sujeito posposto plural."],
      ["Qual frase está correta?", ["Ela ficou meia nervosa.", "Ela ficou meio nervosa.", "Ela ficou meios nervosa.", "Ela ficou meias nervosas.", "Ela ficou meiamente nervosa."], 1, "Advérbio invariável."],
      ["\"Seguem ___ os documentos.\" Complete:", ["anexo", "anexos", "anexa", "anexas", "em anexos"], 1, "Concorda com documentos."],
      ["Qual frase está correta?", ["É proibida entrada.", "É proibido a entrada.", "É proibida a entrada.", "São proibido entradas.", "É proibidas a entrada."], 2, "Com artigo, concorda."],
    ],
    [["Explique por que se diz \"Havia muitas pessoas\" e não \"Haviam muitas pessoas\".", "Porque o verbo haver, no sentido de existir, é impessoal, não tem sujeito e por isso fica sempre no singular; \"muitas pessoas\" é objeto direto, e não sujeito."]],
  ),
  aula(
    "Regência verbal e nominal e o uso da crase",
    `## Regência: quem pede o quê

**Regência** é a relação entre um termo (verbo ou nome) e seus complementos: se pede **preposição** e qual.

## Verbos que mais caem

- **Assistir:**
  - = **ver**: pede **"a"**. "Assistimos **ao** filme." (Não "assistimos o filme" na norma-padrão.)
  - = **ajudar**: sem preposição. "O médico assistiu **o** paciente."
- **Visar:**
  - = **ter como objetivo**: pede "a". "Ele visa **ao** sucesso."
  - = **mirar / dar visto**: sem preposição. "Visou o alvo." / "Visou o cheque."
- **Aspirar:** = **desejar**: pede "a" ("aspira **ao** cargo"); = **respirar**: direto.
- **Preferir:** pede **"a"** e **não** usa "do que" nem "mais". "Prefiro café **a** chá." (Errado: "prefiro mais café do que chá".)
- **Ir, chegar, voltar** (movimento): pedem **"a"** na norma-padrão. "Vou **ao** cinema." / "Cheguei **à** escola." (Na fala, é comum "cheguei na escola".)
- **Obedecer / desobedecer:** pedem "a". "Obedeça **às** regras."
- **Implicar** (= acarretar): direto. "A decisão implica **mudanças**." (Não "implica em".)
- **Esquecer / lembrar:** sem pronome, direto ("esqueci o livro"); com pronome, pede "de" ("esqueci-**me do** livro").
- **Namorar:** direto. "Ela namora **o** João." (Não "namora com".)
- **Pagar / perdoar:** coisa sem preposição; pessoa com "a". "Paguei a conta **ao** garçom."

## Regência nominal

Nomes também pedem preposições: **acessível a**, **apto a/para**, **contrário a**, **favorável a**, **necessário a**, **obediente a**, **preferível a**, **residente em**, **satisfeito com**.

## Crase: a + a

**Crase** é a fusão da **preposição "a"** com o **artigo "a"** (ou com "aquele", "aquela", "aquilo"). Marca-se com o **acento grave (à)**.

**Teste rápido:** troque por uma palavra **masculina**. Se aparecer **"ao"**, há crase.

- "Fui **à** escola." → "Fui **ao** colégio." ✔
- "Refiro-me **àquela** aluna."

**Casos obrigatórios:** locuções femininas (**às vezes**, **à noite**, **à medida que**, **à procura de**), horas ("**às** 10h"), "à moda de" ("bife **à** milanesa").

**Proibida:** antes de **palavras masculinas** ("a pé", "a cavalo"), **verbos** ("começou **a** estudar"), a maioria dos **pronomes** ("a ela", "a você"), entre **palavras repetidas** ("cara a cara") e com "a" no **singular** antes de plural ("a pessoas").

## Resumindo

Assistir (ver) pede "a"; preferir é "a" sem "do que"; implicar é direto. Crase = preposição + artigo; teste trocando por masculino ("ao"). Não há crase antes de masculino, verbo e a maioria dos pronomes.`,
    [
      "Assistir (= ver) pede \"a\": assistir ao jogo.",
      "Preferir uma coisa a outra (sem \"mais\" e sem \"do que\").",
      "Crase: troque por masculino; se virar \"ao\", tem crase.",
      "Sem crase antes de masculino, verbo e a maioria dos pronomes.",
    ],
    [
      ["Regência", "Relação de dependência entre um termo e seu complemento, com ou sem preposição."],
      ["Crase", "Fusão da preposição \"a\" com o artigo \"a\", marcada pelo acento grave."],
      ["Locução adverbial", "Expressão com valor de advérbio, como \"às vezes\"."],
    ],
    [
      ["Qual frase segue a norma-padrão?", ["Assisti o jogo ontem.", "Assisti ao jogo ontem.", "Assisti no jogo ontem.", "Assisti do jogo ontem.", "Assisti com o jogo ontem."], 1, "Assistir = ver pede \"a\"."],
      ["Qual frase está correta?", ["Prefiro mais estudar do que dormir.", "Prefiro estudar do que dormir.", "Prefiro estudar a dormir.", "Prefiro mais estudar a dormir.", "Prefiro estudar que dormir."], 2, "Preferir algo a algo."],
      ["Em qual frase o acento de crase está correto?", ["Fui à pé.", "Começou à chover.", "Entreguei o livro à professora.", "Disse à ele.", "Chegou à um acordo."], 2, "\"Ao professor\" → crase."],
      ["\"A medida implica ___ cortes.\" Complete:", ["em", "nos", "—(sem preposição)", "de", "com"], 2, "Implicar (acarretar) é direto."],
      ["Qual frase está correta?", ["Ela chegou as 8h.", "Ela chegou às 8h.", "Ela chegou à 8h.", "Ela chegou há 8h da manhã.", "Ela chegou ás 8h."], 1, "Horas determinadas: crase."],
    ],
    [["Explique o teste para saber se há crase antes de uma palavra feminina.", "Troca-se a palavra feminina por uma masculina equivalente; se aparecer \"ao\" (preposição + artigo), há crase. Exemplo: \"fui à escola\" vira \"fui ao colégio\", então a crase está correta."]],
  ),
  aula(
    "Tipos textuais: narrar, descrever, expor, argumentar e instruir",
    `## Tipo x gênero

- **Tipo textual:** a **estrutura** e a forma de organizar o texto. São poucos: narração, descrição, dissertação (expositiva e argumentativa), injunção e diálogo.
- **Gênero textual:** o texto **concreto** que circula na sociedade, com função social: notícia, receita, conto, bula, artigo de opinião, meme, e-mail. São **inúmeros**.

Um gênero pode misturar tipos (um romance tem narração, descrição e diálogos).

## Narração

- Conta **fatos** que acontecem no **tempo**, com **personagens**, **espaço**, **enredo** (situação inicial, conflito, clímax, desfecho) e **narrador**.
- Verbos de ação, geralmente no **passado**.
- Gêneros: conto, romance, crônica, fábula, notícia (relato), piada.

## Descrição

- Mostra **características** de pessoas, lugares, objetos, como um "retrato".
- Muitos **adjetivos**, verbos de estado (ser, estar, parecer) e comparações.
- Pode ser **objetiva** (anúncio de imóvel, laudo) ou **subjetiva** (com impressões pessoais, em textos literários).

## Dissertação expositiva

- **Explica** ou **informa** sobre um tema, **sem defender** uma opinião.
- Linguagem objetiva, conceitos, definições, dados.
- Gêneros: verbete de enciclopédia, texto didático, reportagem, seminário.

## Dissertação argumentativa

- **Defende uma tese** e tenta **convencer**.
- Argumentos, exemplos, dados, contra-argumentação.
- Gêneros: **redação do ENEM**, artigo de opinião, editorial, resenha crítica, carta aberta.

## Injunção (instrucional)

- **Orienta** o leitor a **fazer algo**.
- Verbos no **imperativo** ou infinitivo, passos em sequência.
- Gêneros: **receita**, **manual**, **bula**, regulamento, tutorial, propaganda (em parte).

## Como identificar no ENEM

Pergunte: o texto **conta** (narração), **mostra** (descrição), **explica** (exposição), **convence** (argumentação) ou **orienta** (injunção)? Depois, veja o **gênero** pelo suporte, pela função e pelo público.

## Resumindo

Tipos são estruturas (narrar, descrever, expor, argumentar, instruir); gêneros são textos concretos com função social. A redação do ENEM é do tipo dissertativo-argumentativo.`,
    [
      "Tipo: estrutura do texto; gênero: texto concreto com função social.",
      "Narração conta; descrição mostra; exposição explica.",
      "Argumentação defende tese; injunção orienta (imperativo).",
      "A redação do ENEM é dissertativo-argumentativa.",
    ],
    [
      ["Tipo textual", "Modo de organização do texto: narrar, descrever, expor, argumentar, instruir."],
      ["Gênero textual", "Forma concreta de texto que circula socialmente, como receita ou notícia."],
      ["Injunção", "Tipo textual que orienta o leitor a realizar uma ação."],
    ],
    [
      ["Uma receita de bolo é predominantemente:", ["narrativa", "descritiva", "injuntiva", "argumentativa", "expositiva"], 2, "Orienta a fazer."],
      ["Um verbete de enciclopédia sobre fotossíntese é predominantemente:", ["argumentativo", "expositivo", "narrativo", "injuntivo", "poético"], 1, "Explica sem opinar."],
      ["A redação do ENEM é do tipo:", ["narrativo", "descritivo", "dissertativo-argumentativo", "injuntivo", "expositivo puro"], 2, "Defende uma tese."],
      ["\"A casa tinha janelas azuis, um jardim florido e um portão antigo\" é um trecho:", ["narrativo", "descritivo", "injuntivo", "argumentativo", "expositivo"], 1, "Características."],
      ["A diferença entre tipo e gênero textual é que:", ["são a mesma coisa", "tipo é a estrutura; gênero é o texto concreto com função social", "gênero é sempre literário", "tipo só existe na escola", "gênero não tem função"], 1, "Conceitos distintos."],
    ],
    [["Diferencie tipo textual de gênero textual, com exemplos.", "Tipo textual é o modo de organização do texto, como narração, descrição ou argumentação; gênero textual é o texto concreto que circula na sociedade com uma função, como a notícia, a receita ou o artigo de opinião."]],
  ),
  aula(
    "Crônica e conto",
    `## Crônica: o cotidiano em poucas linhas

- Texto **curto**, publicado originalmente em **jornais e revistas**.
- Parte de **fatos do dia a dia** (uma cena no ônibus, uma conversa, uma notícia) para fazer **reflexão**, **humor** ou **crítica**.
- Linguagem leve, próxima da **oralidade**, muitas vezes em **1ª pessoa**.
- Mistura **literatura e jornalismo**.
- Pode ser **humorística**, **lírica** (poética), **reflexiva** ou **crítica**.

**Cronistas brasileiros:** **Rubem Braga** (o maior cronista, lírico), **Fernando Sabino**, **Luis Fernando Verissimo** (humor), **Carlos Drummond**, **Clarice Lispector**, **Machado de Assis**, **Lima Barreto**, **Antonio Prata**, **Martha Medeiros**.

**Antonio Candido** escreveu que a crônica é um gênero "**ao rés do chão**": fala das coisas miúdas e, por isso, nos aproxima da vida.

## Conto: uma história concentrada

- Narrativa **curta**, com **um único conflito** central, poucos personagens e espaço e tempo reduzidos.
- Busca um **efeito** único no leitor (surpresa, tensão, emoção).
- Muitas vezes tem **final surpreendente** ou aberto.

**Contistas:** **Machado de Assis** ("A Cartomante", "Missa do Galo"), **Guimarães Rosa** ("A Terceira Margem do Rio"), **Clarice Lispector** ("Amor", "Feliz Aniversário"), **Lygia Fagundes Telles**, **Rubem Fonseca**, **Dalton Trevisan**, **Conceição Evaristo** (*Olhos d'Água*), **Marina Colasanti** (contos de fadas para adultos).

## Elementos da narrativa

- **Narrador:** em **1ª pessoa** (personagem, visão limitada) ou **3ª pessoa** (observador ou **onisciente**, que sabe tudo, até pensamentos).
- **Personagens:** protagonista, antagonista, secundários; **planas** (simples) ou **redondas** (complexas).
- **Tempo:** cronológico (sequência dos fatos) ou **psicológico** (memórias, fluxo de consciência).
- **Espaço** e **enredo**.

## Crônica x conto

- **Crônica:** parte de um **fato do cotidiano**, tom de **conversa**, pode ter pouca ação e mais reflexão.
- **Conto:** história **ficcional** construída em torno de **um conflito**, com estrutura narrativa mais definida.

## Resumindo

Crônica: texto curto do jornal sobre o cotidiano, com humor ou reflexão (Rubem Braga, Verissimo). Conto: narrativa curta com um conflito e efeito único (Machado, Clarice, Conceição Evaristo).`,
    [
      "Crônica: cotidiano, jornal, tom leve, reflexão ou humor.",
      "Conto: narrativa curta com um conflito e um efeito único.",
      "Narrador em 1ª pessoa (limitado) ou 3ª (pode ser onisciente).",
      "Tempo cronológico ou psicológico.",
    ],
    [
      ["Crônica", "Texto curto, ligado ao jornal, que reflete sobre o cotidiano."],
      ["Narrador onisciente", "Narrador em 3ª pessoa que sabe tudo, inclusive os pensamentos dos personagens."],
      ["Tempo psicológico", "Tempo das memórias e sensações dos personagens, fora da ordem cronológica."],
    ],
    [
      ["A crônica tem como característica:", ["ser sempre longa", "partir de fatos do cotidiano com tom leve e reflexivo", "ter vários conflitos e centenas de personagens", "ser escrita só em versos", "não ter relação com o jornal"], 1, "Gênero do cotidiano."],
      ["O conto caracteriza-se por:", ["muitos conflitos paralelos", "um conflito central e brevidade", "ser um texto científico", "não ter narrador", "ter sempre final feliz"], 1, "Concentração."],
      ["Um narrador que conhece os pensamentos de todos os personagens é:", ["personagem", "onisciente", "observador limitado", "protagonista", "ausente"], 1, "Sabe tudo."],
      ["O maior cronista brasileiro, conhecido pelo lirismo, é:", ["Rubem Braga", "Graciliano Ramos", "Gonçalves Dias", "Aluísio Azevedo", "Castro Alves"], 0, "Cronista por excelência."],
      ["Quando a narrativa segue as memórias do personagem, fora da ordem dos fatos, o tempo é:", ["cronológico", "psicológico", "histórico", "linear", "futuro"], 1, "Fluxo de lembranças."],
    ],
    [["Explique a diferença entre crônica e conto.", "A crônica parte de um fato do cotidiano, com tom de conversa, e busca reflexão ou humor, nascendo no jornal; o conto é uma história ficcional curta construída em torno de um conflito central para provocar um efeito único no leitor."]],
  ),
  aula(
    "Homônimos e parônimos: os porquês, mal/mau, há/a",
    `## Palavras que confundem

Algumas palavras são parecidas na **forma** ou no **som**, mas têm **sentidos diferentes**. Errar pode mudar o sentido ou prejudicar a redação.

## Os quatro porquês

- **Por que** (separado, sem acento): **perguntas** e quando equivale a "**pelo qual / pela qual**". "**Por que** você faltou?" / "Os caminhos **por que** passei."
- **Por quê** (separado, com acento): no **fim da frase** ou antes de pausa forte. "Você faltou **por quê**?"
- **Porque** (junto, sem acento): **explicação ou causa** (= pois). "Faltei **porque** estava doente."
- **Porquê** (junto, com acento): **substantivo** (= o motivo), vem com artigo. "Não sei **o porquê** da briga."

## Mal x mau

- **Mal:** oposto de **bem**. "Ele dormiu **mal**." / "O **mal** venceu."
- **Mau:** oposto de **bom**. "Ele é um **mau** aluno."
- Teste: troque por bem/bom.

## Há x a

- **Há** (verbo haver): tempo **passado** ou existir. "Saí **há** dez minutos." / "**Há** vagas."
- **A:** tempo **futuro** ou distância. "Daqui **a** dois dias." / "Fica **a** 5 km."
- Não use "**há** dez anos **atrás**" (redundância).

## Outros pares frequentes

- **Mas** (porém) x **mais** (quantidade).
- **Onde** (lugar fixo) x **aonde** (movimento, com verbos como "ir"). "**Onde** você mora?" / "**Aonde** você vai?"
- **A fim de** (finalidade) x **afim** (semelhante). "Estudo **a fim de** passar." / "Temas **afins**."
- **Senão** (caso contrário, exceto) x **se não** (caso não). "Estude, **senão** reprovará." / "**Se não** chover, iremos."
- **Acerca de** (sobre) x **há cerca de** (faz aproximadamente). "Falamos **acerca do** tema." / "Mudei **há cerca de** um ano."
- **Ao invés de** (ao contrário) x **em vez de** (no lugar de).
- **Afim / a fim**, **traz** (verbo trazer) x **trás** (atrás).
- **Sessão / seção / cessão**; **comprimento / cumprimento**; **descrição / discrição**; **eminente / iminente**; **ratificar** (confirmar) / **retificar** (corrigir); **infligir** (aplicar pena) / **infringir** (violar).

## Resumindo

Por que (pergunta), por quê (fim de frase), porque (causa), porquê (substantivo). Mal/bem, mau/bom. Há (passado), a (futuro/distância). Onde (lugar) x aonde (movimento).`,
    [
      "Por que (pergunta); porque (causa); por quê (fim); o porquê (motivo).",
      "Mal é oposto de bem; mau é oposto de bom.",
      "Há = passado; a = futuro ou distância.",
      "Onde = lugar; aonde = movimento (ir a).",
    ],
    [
      ["Homônimos", "Palavras com mesma pronúncia ou grafia e sentidos diferentes."],
      ["Parônimos", "Palavras parecidas na forma e no som, com sentidos diferentes."],
      ["Redundância", "Repetição desnecessária de uma ideia, como \"há anos atrás\"."],
    ],
    [
      ["Complete: \"Ele não veio ___ estava doente.\"", ["por que", "por quê", "porque", "porquê", "pôr que"], 2, "Explicação."],
      ["Complete: \"Ninguém entendeu o ___ da decisão.\"", ["por que", "porque", "por quê", "porquê", "porquê de"], 3, "Substantivo com artigo."],
      ["Qual frase está correta?", ["Ele é um mal exemplo.", "Ele se comportou mau.", "Ele é um mau exemplo.", "Ele dormiu mau.", "O mau-estar passou."], 2, "Mau = oposto de bom."],
      ["Complete: \"Ela se mudou ___ cinco anos.\"", ["a", "há", "à", "ah", "á"], 1, "Tempo passado."],
      ["Complete: \"___ você vai com tanta pressa?\"", ["Onde", "Aonde", "Donde", "Em onde", "Que onde"], 1, "Movimento: ir a."],
    ],
    [["Explique a diferença entre \"mal\" e \"mau\" e dê uma dica para não errar.", "\"Mal\" é o contrário de \"bem\" e \"mau\" é o contrário de \"bom\"; a dica é trocar pela palavra oposta: se couber \"bem\", usa-se \"mal\"; se couber \"bom\", usa-se \"mau\"."]],
  ),
  aula(
    "Colocação pronominal e pontuação na redação",
    `## Onde colocar o pronome oblíquo

Os pronomes átonos (**me, te, se, o, a, lhe, nos, vos**) podem ficar:

- **Próclise:** antes do verbo. "Não **me** chame."
- **Ênclise:** depois do verbo, com hífen. "Chame-**me** amanhã."
- **Mesóclise:** no meio do verbo (futuro do presente e do pretérito). "Dar-**te**-ei." (Rara, soa muito formal.)

## Quando usar próclise (palavras "atrativas")

- **Palavras negativas:** não, nunca, ninguém, jamais. "**Nunca** se esqueça."
- **Pronomes relativos e interrogativos:** que, quem, onde. "O livro **que** me deram."
- **Conjunções subordinativas:** quando, se, porque, embora. "**Quando** se trata de..."
- **Advérbios** (sem vírgula depois): "**Aqui** se vive bem."
- **Pronomes indefinidos:** tudo, alguém. "**Tudo** se resolve."

## Quando usar ênclise

- **No início da frase** (na norma-padrão não se começa frase com pronome oblíquo): "**Sabe-se** que..." e não "Se sabe que...".
- Com verbo no **imperativo afirmativo**: "Sente-**se**."
- Após vírgula, quando não há palavra atrativa.

Na fala brasileira, a próclise é muito comum ("Me empresta?") e é uma **variedade legítima**; mas na **redação**, siga a norma-padrão.

## Pontuação que mais importa

- **Não se separa com vírgula:** sujeito do verbo ("**Os alunos, estudaram**" ✘) nem verbo do complemento.
- **Use vírgula:**
  - Para separar itens de uma **enumeração**.
  - Para isolar **aposto** e **vocativo**. "Paulo Freire, **o patrono da educação**, defendia..."
  - Depois de **adjuntos adverbiais deslocados** longos. "**No Brasil contemporâneo**, a desigualdade..."
  - Antes de **mas, porém, contudo** e conjunções adversativas.
  - Para isolar **conectivos** intercalados: "A medida, **contudo**, não resolveu."
  - Antes de orações **explicativas** ("que" com vírgula) — diferente das **restritivas** (sem vírgula).
- **Ponto e vírgula:** separa itens longos ou orações já com vírgulas.
- **Dois-pontos:** anunciam enumeração, explicação ou citação.

## Vírgula muda o sentido

- "Os alunos **que estudaram** passaram." (só alguns estudaram — restritiva)
- "Os alunos, **que estudaram**, passaram." (todos estudaram — explicativa)

## Resumindo

Próclise com palavras atrativas (não, que, quando); ênclise no início da frase. Nunca separe sujeito e verbo com vírgula. Isole apostos, conectivos intercalados e adjuntos deslocados. A vírgula pode mudar o sentido.`,
    [
      "Próclise com palavras atrativas: não, que, quando, nunca.",
      "Não começar frase com pronome oblíquo na norma-padrão.",
      "Nunca separar sujeito e verbo com vírgula.",
      "Oração com vírgula (explicativa) muda o sentido da sem vírgula (restritiva).",
    ],
    [
      ["Próclise", "Pronome oblíquo antes do verbo."],
      ["Ênclise", "Pronome oblíquo depois do verbo, ligado por hífen."],
      ["Aposto", "Termo que explica outro, geralmente entre vírgulas."],
    ],
    [
      ["Qual frase segue a norma-padrão?", ["Me disseram que choveu.", "Disseram-me que choveu.", "Não disseram-me nada.", "Quando falaram-me, saí.", "Nunca esqueça-se disso."], 1, "Não se inicia com oblíquo."],
      ["Em qual frase a próclise é obrigatória?", ["Diga-me a verdade.", "Não me diga isso.", "Sente-se aqui.", "Entregou-lhe o livro.", "Chamaram-no cedo."], 1, "\"Não\" atrai o pronome."],
      ["Qual frase está corretamente pontuada?", ["Os candidatos, fizeram a prova.", "Os candidatos fizeram, a prova.", "Os candidatos fizeram a prova.", "Os, candidatos fizeram a prova.", "Os candidatos fizeram a, prova."], 2, "Sem vírgula entre sujeito e verbo."],
      ["Em \"Os moradores que reclamaram foram atendidos\", entende-se que:", ["todos reclamaram", "só os que reclamaram foram atendidos", "ninguém reclamou", "todos foram atendidos sem reclamar", "a frase está errada"], 1, "Oração restritiva."],
      ["A vírgula está correta em:", ["A medida contudo, falhou.", "A medida, contudo, falhou.", "A medida, contudo falhou.", "A, medida contudo falhou.", "A medida contudo falhou,."], 1, "Conectivo intercalado entre vírgulas."],
    ],
    [["Explique a diferença de sentido entre \"Os alunos que faltaram perderam a prova\" e \"Os alunos, que faltaram, perderam a prova\".", "Sem vírgulas, a oração é restritiva: só os alunos que faltaram perderam a prova; com vírgulas, é explicativa: todos os alunos faltaram e todos perderam a prova."]],
  ),
  aula(
    "Textos de divulgação científica e infográficos",
    `## Ciência para todos

A **divulgação científica** traduz o conhecimento produzido por pesquisadores para o **público geral**. Aparece em revistas (Superinteressante, Pesquisa FAPESP), sites, vídeos e podcasts. O ENEM traz muitos desses textos em todas as áreas.

## Características

- Linguagem **acessível**, mas precisa.
- **Explica termos técnicos** com definições, **exemplos** e **comparações** ("o vírus é mil vezes menor que um fio de cabelo").
- Cita **fontes**: universidades, pesquisadores, revistas científicas ("segundo estudo publicado na revista *Nature*...").
- Usa **dados** e porcentagens.
- **Modalização** cautelosa: "**pode**", "**sugere**", "**provavelmente**", "os resultados **indicam**" — a ciência raramente fala em certeza absoluta.
- Títulos chamativos para atrair o leitor.

## Artigo científico x divulgação

- **Artigo científico:** escrito por cientistas para cientistas; linguagem técnica, metodologia detalhada, revisão por pares.
- **Divulgação:** para o público leigo; simplifica sem distorcer.

## Infográficos

Combinam **texto, números, ícones, gráficos e mapas** para explicar algo de forma visual.

Como ler:

1. Leia o **título** e a **fonte**.
2. Veja a **legenda** e as **unidades** (%, milhões, km²).
3. Observe a **escala** do gráfico (eixos que não começam no zero podem exagerar diferenças).
4. Relacione as partes: o que está sendo **comparado**?

## Cuidados (leitura crítica)

- **Correlação não é causalidade**: duas coisas acontecerem juntas não prova que uma causa a outra.
- Um único estudo não é prova definitiva.
- Desconfie de manchetes **sensacionalistas** que transformam "pode reduzir" em "cura".
- Verifique quem **financiou** a pesquisa e se a fonte é confiável.

## No ENEM

As perguntas costumam pedir:

- A **função** de um recurso (a comparação serve para facilitar a compreensão).
- O **objetivo** do texto (informar, alertar, explicar um fenômeno).
- A **interpretação** de dados de um gráfico ou infográfico.

## Resumindo

A divulgação científica explica a ciência ao público com linguagem acessível, exemplos, comparações e fontes, usando modalização cautelosa. Infográficos unem texto e imagem; leia título, fonte, legenda e escala.`,
    [
      "Divulgação científica: ciência explicada ao público leigo.",
      "Usa definições, exemplos, comparações e fontes.",
      "\"Pode\", \"sugere\", \"indica\": cautela científica.",
      "Infográficos: leia título, fonte, legenda e escala.",
    ],
    [
      ["Divulgação científica", "Comunicação de conhecimentos científicos ao público geral."],
      ["Infográfico", "Texto que combina imagens, números e palavras para explicar algo."],
      ["Revisão por pares", "Avaliação de um artigo científico por outros especialistas antes da publicação."],
    ],
    [
      ["Em um texto de divulgação científica, a comparação \"o vírus é mil vezes menor que um fio de cabelo\" serve para:", ["enganar o leitor", "facilitar a compreensão de um dado técnico", "substituir a fonte", "mostrar opinião pessoal", "fazer humor"], 1, "Aproxima do cotidiano."],
      ["A expressão \"os resultados sugerem\" indica:", ["certeza absoluta", "cautela, sem afirmar definitivamente", "erro", "opinião sem base", "ordem"], 1, "Modalização."],
      ["Uma diferença entre artigo científico e divulgação científica é que o artigo:", ["é escrito para o público leigo", "é técnico, voltado a especialistas", "não usa dados", "não tem metodologia", "é sempre humorístico"], 1, "Público diferente."],
      ["Ao ler um gráfico cujo eixo vertical não começa no zero, deve-se:", ["ignorar", "ter cuidado, pois as diferenças podem parecer maiores", "concluir que os dados são falsos", "multiplicar tudo por 10", "ler só o título"], 1, "Escala pode exagerar."],
      ["Uma manchete que transforma \"pode reduzir o risco\" em \"cura a doença\":", ["é fiel ao estudo", "distorce o resultado científico", "é científica", "é neutra", "é uma citação"], 1, "Sensacionalismo."],
    ],
    [["Quais recursos os textos de divulgação científica usam para aproximar a ciência do público?", "Usam linguagem acessível, definições de termos técnicos, exemplos e comparações com o cotidiano, dados e citações de fontes confiáveis, além de títulos atrativos e, muitas vezes, imagens e infográficos."]],
  ),
  aula(
    "Gêneros digitais: e-mail, post, comentário e tutorial",
    `## Ler e escrever no mundo digital

A internet criou ou transformou muitos **gêneros textuais**. O ENEM cobra sua **função**, sua **linguagem** e os **efeitos** que produzem.

## E-mail

- Pode ser **formal** (trabalho, instituições) ou **informal** (amigos).
- Formal: **assunto** claro, saudação ("Prezado(a)"), texto objetivo, despedida ("Atenciosamente"), assinatura.

## Post e publicação em redes sociais

- Texto curto, muitas vezes com **imagem**, **vídeo**, **hashtags** (#) e **emojis**.
- Busca **engajamento** (curtidas, compartilhamentos, comentários).
- Pode informar, divertir, vender, mobilizar.

## Comentário

- Resposta do leitor a uma publicação ou notícia.
- Espaço de **debate**, mas também de **discurso de ódio** e desinformação.

## Tutorial e vídeos explicativos

- Gênero **injuntivo**: ensina passo a passo (como fazer, como usar).
- Linguagem direta, verbos no imperativo, numeração de etapas.

## Blog e vlog

- Diários pessoais ou temáticos na internet, em texto (blog) ou vídeo (vlog).

## Meme

- Imagem ou vídeo com frase curta, que circula e é **recriado** pelos usuários.
- Depende de **referências compartilhadas** e de **intertextualidade**.
- Pode ter humor, crítica social ou política.

## Mensagens instantâneas

- Linguagem **informal**, abreviações (vc, tb, pq), áudio, figurinhas.
- O **internetês** é adequado nesse contexto, mas **inadequado** em textos formais (como a redação do ENEM).

## Características gerais

- **Multimodalidade:** texto + imagem + som + vídeo.
- **Hipertexto:** links que levam a outros textos; leitura **não linear**.
- **Interatividade:** o leitor também produz.
- **Velocidade** e alcance, o que favorece também as **fake news**.

## Adequação

O ENEM valoriza a ideia de que **não há linguagem certa ou errada em si**, mas **adequada ou inadequada** à situação: o "vc" do WhatsApp é adequado; na redação, não.

## Resumindo

E-mail pode ser formal ou informal; posts buscam engajamento com hashtags e imagens; tutoriais são injuntivos; memes dependem de referências. Gêneros digitais são multimodais, hipertextuais e interativos. Adeque a linguagem ao contexto.`,
    [
      "Gêneros digitais são multimodais, hipertextuais e interativos.",
      "Tutorial é injuntivo: passo a passo com imperativo.",
      "Internetês é adequado em mensagens, não na redação.",
      "Linguagem adequada ou inadequada, conforme a situação.",
    ],
    [
      ["Hipertexto", "Texto com links que levam a outros textos, permitindo leitura não linear."],
      ["Multimodalidade", "Combinação de linguagens: texto, imagem, som e vídeo."],
      ["Engajamento", "Interação do público com uma publicação: curtidas, comentários, compartilhamentos."],
    ],
    [
      ["Um vídeo que ensina, passo a passo, a montar um móvel é do gênero:", ["crônica", "tutorial", "editorial", "poema", "notícia"], 1, "Instrucional."],
      ["Uma característica do hipertexto é:", ["leitura sempre linear", "links que permitem leitura não linear", "ausência de imagens", "ser impresso", "ser exclusivamente literário"], 1, "Navegação entre textos."],
      ["Usar \"vc\" e \"pq\" em uma mensagem para um amigo é:", ["sempre errado", "adequado ao contexto informal", "obrigatório em e-mails formais", "aceito na redação do ENEM", "proibido por lei"], 1, "Adequação."],
      ["As hashtags (#) em posts servem para:", ["corrigir erros", "agrupar publicações por tema e ampliar o alcance", "substituir imagens", "indicar autoria", "bloquear comentários"], 1, "Organização e alcance."],
      ["Para entender um meme, geralmente é preciso:", ["conhecer as referências compartilhadas que ele retoma", "ler um manual", "ter formação técnica", "ignorar o contexto", "traduzir do latim"], 0, "Intertextualidade."],
    ],
    [["Por que o internetês é adequado em mensagens instantâneas, mas não na redação do ENEM?", "Porque a adequação depende do contexto: em mensagens entre amigos a linguagem informal e rápida é apropriada; na redação, situação formal e avaliada pela norma-padrão, exige-se linguagem formal, sem abreviações."]],
  ),
  aula(
    "Termos da oração: sujeito, predicado e complementos",
    `## Para que estudar análise sintática

O ENEM não pede classificação decorada, mas entender a **função** das palavras ajuda a **interpretar**, a **pontuar** e a fazer **concordância** e **regência** corretamente.

## Sujeito e predicado

- **Sujeito:** o termo sobre o qual se declara algo; concorda com o verbo.
- **Predicado:** o que se declara sobre o sujeito (contém o verbo).

**Tipos de sujeito:**

- **Simples:** um núcleo. "**A chuva** alagou a rua."
- **Composto:** dois ou mais núcleos. "**Pais e professores** se reuniram."
- **Oculto (desinencial):** identificado pela terminação do verbo. "Estudamos ontem." (nós)
- **Indeterminado:** existe, mas não se identifica. "**Falaram** de você." / "**Precisa-se** de vendedores."
- **Oração sem sujeito:** fenômenos da natureza, haver (existir), fazer (tempo). "**Choveu**." / "**Há** vagas."

## Predicado

- **Nominal:** verbo de **ligação** (ser, estar, parecer, ficar, permanecer) + **predicativo** (característica do sujeito). "O aluno **está cansado**."
- **Verbal:** verbo de **ação** (núcleo é o verbo). "O aluno **leu o livro**."

## Complementos verbais

- **Objeto direto:** completa o verbo **sem preposição**. "Comprei **um livro**."
- **Objeto indireto:** completa o verbo **com preposição** obrigatória. "Gosto **de música**." / "Obedeça **às leis**."

## Outros termos

- **Adjunto adverbial:** circunstância de tempo, lugar, modo, causa... "**Ontem**, **no parque**, corremos **muito**."
- **Adjunto adnominal:** caracteriza um substantivo (artigos, adjetivos). "**O** carro **novo**."
- **Complemento nominal:** completa um nome com preposição. "A leitura **do texto** é necessária."
- **Agente da passiva:** quem pratica a ação na voz passiva. "O bolo foi feito **pela avó**."
- **Aposto:** explica outro termo. "Brasília, **a capital**, ..."
- **Vocativo:** chamamento. "**Maria**, venha cá!"

## Aplicação prática

- Encontrar o **sujeito** resolve a concordância: "**A falta** de recursos **prejudica**..." (o núcleo é "falta", singular).
- Adjuntos adverbiais **deslocados** costumam vir entre vírgulas.

## Resumindo

Sujeito pode ser simples, composto, oculto, indeterminado ou inexistente. Predicado nominal tem verbo de ligação; verbal, verbo de ação. Objeto direto sem preposição; indireto com preposição. Achar o núcleo do sujeito resolve a concordância.`,
    [
      "Sujeito: simples, composto, oculto, indeterminado ou inexistente.",
      "Predicado nominal: verbo de ligação + predicativo.",
      "Objeto direto sem preposição; indireto com preposição.",
      "Ache o núcleo do sujeito para acertar a concordância.",
    ],
    [
      ["Sujeito", "Termo sobre o qual se declara algo e com o qual o verbo concorda."],
      ["Predicativo do sujeito", "Característica atribuída ao sujeito por meio de verbo de ligação."],
      ["Objeto indireto", "Complemento do verbo ligado por preposição obrigatória."],
    ],
    [
      ["Em \"Choveu muito ontem\", o sujeito é:", ["muito", "ontem", "oculto", "inexistente (oração sem sujeito)", "indeterminado"], 3, "Fenômeno da natureza."],
      ["Em \"A professora parece preocupada\", o predicado é:", ["verbal", "nominal", "verbo-nominal", "inexistente", "indeterminado"], 1, "Verbo de ligação + predicativo."],
      ["Em \"Ele gosta de futebol\", \"de futebol\" é:", ["objeto direto", "objeto indireto", "adjunto adverbial", "sujeito", "aposto"], 1, "Preposição obrigatória."],
      ["Em \"A falta de investimentos ___ a educação\", o verbo correto é:", ["prejudicam", "prejudica", "prejudicaram", "prejudiquem", "prejudicamos"], 1, "Núcleo: falta (singular)."],
      ["Em \"Alugam-se casas\", o sujeito é:", ["indeterminado", "casas", "oculto", "inexistente", "se"], 1, "Voz passiva sintética."],
    ],
    [["Por que identificar o núcleo do sujeito ajuda a evitar erros de concordância na redação?", "Porque o verbo concorda com o núcleo do sujeito; em frases longas, como \"a falta de recursos nas escolas prejudica\", o núcleo é \"falta\", singular, e o verbo deve ficar no singular, mesmo com palavras no plural por perto."]],
  ),
  aula(
    "Linguagem formal e informal: registro e adequação",
    `## Uma língua, muitos usos

Todos nós mudamos o jeito de falar conforme a **situação**: conversamos com amigos de um modo e falamos numa entrevista de emprego de outro. Isso é **adequação linguística**.

## Registro formal

- Usado em situações **oficiais**, profissionais, acadêmicas: redação do ENEM, documentos, discursos, entrevistas, artigos.
- Segue a **norma-padrão**: concordância, regência, colocação pronominal.
- Vocabulário mais **preciso**, sem gírias.
- Impessoalidade.

## Registro informal

- Usado em situações **familiares** e descontraídas: conversa com amigos, mensagens, redes sociais.
- Gírias, abreviações, contrações ("tá", "pra", "né"), expressões populares.
- **Não é "errado"**: é **adequado** ao seu contexto.

## Norma-padrão x norma culta x variedades

- **Norma-padrão:** o modelo idealizado presente em gramáticas e dicionários.
- **Norma culta:** como falam e escrevem, de fato, as pessoas mais escolarizadas em situações formais.
- **Variedades** populares e regionais: todas são **sistemas completos** e legítimos.

## Preconceito linguístico

- É julgar uma pessoa como "ignorante" pela forma como fala.
- **Marcos Bagno** (*Preconceito Linguístico*) mostra que esse preconceito é, na verdade, **preconceito social**: atinge grupos pobres, rurais e de certas regiões.
- O ENEM valoriza o **respeito** às variedades, mas também cobra o **domínio da norma-padrão** na redação.

## Monitoramento

O grau de **atenção** que damos à fala:

- Mais monitorado: palestra, entrevista, redação.
- Menos monitorado: conversa entre amigos.

## Na redação do ENEM

- Evite: **gírias**, **"a gente"** (prefira "nós" ou impessoalidade), **"tipo"**, **"aí"**, **"né"**, abreviações, **"eu acho"**.
- Prefira: linguagem **impessoal**, vocabulário **variado**, conectivos formais (contudo, portanto, além disso).
- Cuidado com o **excesso de formalidade** (palavras rebuscadas sem necessidade podem prejudicar a clareza).

## Exemplos de adequação

- "Galera, bora estudar?" → adequado num grupo de amigos.
- "Prezados estudantes, convidamos todos para o mutirão de estudos." → adequado num comunicado da escola.

## Resumindo

Linguagem formal e informal são adequadas a contextos diferentes. Variedades populares são legítimas; julgá-las é preconceito linguístico (Bagno). Na redação do ENEM, use a norma-padrão e evite gírias e marcas de oralidade.`,
    [
      "Adequação: o jeito de falar muda conforme a situação.",
      "Informal não é errado; é adequado a contextos descontraídos.",
      "Preconceito linguístico é preconceito social (Marcos Bagno).",
      "Na redação, norma-padrão e impessoalidade; sem gírias.",
    ],
    [
      ["Adequação linguística", "Uso da linguagem apropriada à situação de comunicação."],
      ["Norma-padrão", "Modelo de língua descrito nas gramáticas, usado em situações formais."],
      ["Preconceito linguístico", "Discriminação de pessoas pela forma como falam."],
    ],
    [
      ["Usar gírias numa conversa entre amigos é:", ["um erro grave", "adequado ao contexto", "proibido", "sinal de ignorância", "norma-padrão"], 1, "Adequação."],
      ["Para Marcos Bagno, o preconceito linguístico é, no fundo:", ["uma regra gramatical", "um preconceito social", "uma forma de ensino", "inexistente", "positivo"], 1, "Atinge grupos sociais."],
      ["Qual trecho é adequado a uma redação do ENEM?", ["A gente tem que mudar isso aí, né?", "Tipo, o governo devia agir.", "Portanto, é necessário que o Estado amplie os investimentos.", "Eu acho que tá tudo errado.", "Bora resolver isso, galera."], 2, "Formal e impessoal."],
      ["A norma culta refere-se:", ["ao modo de falar de uma região rural", "à língua usada por pessoas mais escolarizadas em situações formais", "às gírias da internet", "a uma língua estrangeira", "à língua dos livros antigos apenas"], 1, "Uso real formal."],
      ["As variedades populares e regionais da língua são:", ["erros a serem eliminados", "sistemas legítimos, adequados a seus contextos", "inexistentes", "proibidas na fala", "iguais à norma-padrão"], 1, "Respeito à diversidade."],
    ],
    [["Explique por que não é correto dizer que uma variedade popular da língua é \"errada\".", "Porque todas as variedades são sistemas completos, com regras próprias, adequados aos contextos em que são usadas; o que existe é adequação ou inadequação à situação, e chamar de errado é preconceito linguístico, que é também social."]],
  ),
];
