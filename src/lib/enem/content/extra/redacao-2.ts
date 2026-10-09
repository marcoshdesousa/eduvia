import { essayInstructions } from "../redacao";
import { aula } from "./build";

const essay = (theme: string) => ({ theme, instructions: essayInstructions(theme) });

/** Redação, lote 2: mais temas reais do ENEM e temas prováveis, cada um com redação para escrever. */
export const REDACAO_2 = [
  aula(
    "Tema ENEM 2014: publicidade infantil",
    `## O tema

Em 2014 o ENEM pediu: **"Publicidade infantil em questão no Brasil"**.

## Entendendo o recorte

- A palavra **"em questão"** pede que você **discuta** o problema: a publicidade dirigida às **crianças** deve ser permitida, limitada ou proibida?
- Foco: crianças são mais **vulneráveis** à persuasão, pois ainda não distinguem bem fantasia e realidade nem percebem a intenção de venda.

## Repertório útil

- **Resolução 163/2014 do Conanda:** considera **abusiva** a publicidade dirigida a crianças.
- **Código de Defesa do Consumidor (art. 37):** proíbe publicidade que se aproveite da "deficiência de julgamento e experiência da criança".
- **Estatuto da Criança e do Adolescente (ECA)** e **Constituição (art. 227):** proteção integral e prioridade absoluta.
- **Zygmunt Bauman:** sociedade de consumidores.
- **Adorno e Horkheimer:** indústria cultural.
- Influenciadores mirins e "unboxing" no YouTube como nova forma de publicidade.
- Obesidade infantil associada à propaganda de alimentos ultraprocessados.

## Duas linhas de argumento

1. **Vulnerabilidade infantil e consumismo:** a criança é persuadida facilmente, o que estimula consumismo precoce, frustração e conflitos familiares.
2. **Saúde e valores:** a propaganda de alimentos ultraprocessados contribui para a **obesidade infantil**; além disso, associa felicidade e aceitação social à posse de produtos.

## Proposta de intervenção (modelo)

O **Conanda**, em parceria com o **Ministério Público**, deve **fiscalizar e punir** propagandas abusivas dirigidas a crianças, inclusive em **plataformas digitais** e canais de influenciadores mirins, **por meio de** denúncias e multas, **a fim de** proteger a infância. As **escolas** devem promover **educação para o consumo** consciente.

## Resumindo

Discuta a vulnerabilidade infantil diante da publicidade, use o CDC, o ECA e o Conanda, argumente com consumismo e saúde e proponha fiscalização (inclusive digital) e educação para o consumo.`,
    [
      "Crianças são mais vulneráveis à persuasão publicitária.",
      "Repertório: Conanda (2014), CDC art. 37, ECA, Bauman.",
      "Argumentos: consumismo precoce e obesidade infantil.",
      "Proposta: fiscalização (inclusive digital) e educação para o consumo.",
    ],
    [
      ["Publicidade abusiva", "Propaganda que se aproveita da vulnerabilidade do público."],
      ["Proteção integral", "Princípio do ECA que garante prioridade aos direitos de crianças e adolescentes."],
      ["Consumismo", "Consumo excessivo, por impulso ou pressão social."],
    ],
    [
      ["O principal argumento para limitar a publicidade infantil é que as crianças:", ["têm muito dinheiro", "são mais vulneráveis à persuasão", "não assistem TV", "não consomem", "decidem tudo sozinhas"], 1, "Vulnerabilidade."],
      ["O ECA estabelece para crianças e adolescentes:", ["o direito de trabalhar", "proteção integral e prioridade absoluta", "voto obrigatório", "maioridade penal aos 12", "fim da escola"], 1, "Princípio central."],
      ["Um dado de saúde ligado ao tema é:", ["o aumento da obesidade infantil", "o fim das cáries", "a erradicação do sarampo", "a queda do sedentarismo", "o aumento da altura média"], 0, "Propaganda de ultraprocessados."],
      ["Influenciadores mirins que mostram brinquedos em vídeos representam:", ["uma forma nova de publicidade infantil", "um conteúdo sem relação com o tema", "educação formal", "propaganda proibida em todo o mundo", "jornalismo"], 0, "Publicidade disfarçada."],
      ["Uma proposta coerente com o tema é:", ["liberar toda publicidade", "fiscalizar propagandas abusivas e promover educação para o consumo", "proibir a TV", "fechar escolas", "estimular o consumo infantil"], 1, "Proteção + educação."],
    ],
    [["Por que a publicidade dirigida às crianças é considerada abusiva por muitos especialistas?", "Porque as crianças ainda não têm maturidade para perceber a intenção de venda nem distinguir fantasia e realidade, ficando vulneráveis à persuasão, o que estimula o consumismo precoce e hábitos prejudiciais, como a má alimentação."]],
    essay("Publicidade infantil em questão no Brasil"),
  ),
  aula(
    "Tema ENEM 2013: Lei Seca e álcool no trânsito",
    `## O tema

Em 2013 o ENEM pediu: **"Efeitos da implantação da Lei Seca no Brasil"**.

## Entendendo o recorte

- A **Lei Seca** (Lei 11.705/2008, endurecida em 2012) estabeleceu **tolerância zero** para álcool ao volante, com multas pesadas, suspensão da carteira e prisão em casos mais graves.
- O tema pede os **efeitos**: o que mudou? Funcionou? Quais limites?

## Repertório útil

- Dados do Ministério da Saúde mostraram **redução de mortes e internações** após a lei, especialmente nas capitais com fiscalização intensa.
- O **álcool** diminui reflexos, atenção e coordenação; aumenta a autoconfiança.
- **Blitz** e **bafômetro**; campanhas "Se beber, não dirija".
- **Kant:** agir de modo que a ação possa ser lei universal (responsabilidade com a vida dos outros).
- O trânsito brasileiro mata dezenas de milhares de pessoas por ano.
- Aplicativos de transporte facilitaram alternativas ao volante.

## Duas linhas de argumento

1. **Efeitos positivos:** a fiscalização e as punições rigorosas reduziram mortes e mudaram comportamentos, sobretudo nas grandes cidades.
2. **Limites:** fiscalização **desigual** (menor em cidades pequenas e rodovias), sensação de **impunidade**, uso de aplicativos para fugir das blitze e a **cultura** que associa lazer a beber e dirigir.

## Proposta de intervenção (modelo)

Os **Detrans** e as **Polícias Rodoviárias** devem **ampliar as blitze** com bafômetro em cidades menores e rodovias, **além de** o **Ministério da Saúde** e as **autoescolas** promoverem **campanhas** e aulas com relatos de vítimas, **a fim de** consolidar a mudança cultural e reduzir as mortes no trânsito.

## Resumindo

Mostre os efeitos (menos mortes) e os limites (fiscalização desigual e cultura do álcool). Use dados do Ministério da Saúde e o conceito de responsabilidade. Proponha mais fiscalização e educação para o trânsito.`,
    [
      "Lei Seca: tolerância zero para álcool ao volante.",
      "Efeito positivo: redução de mortes onde há fiscalização.",
      "Limites: fiscalização desigual e cultura do álcool.",
      "Proposta: mais blitze e educação para o trânsito.",
    ],
    [
      ["Lei Seca", "Lei que proíbe dirigir após consumir bebida alcoólica."],
      ["Tolerância zero", "Proibição de qualquer quantidade de álcool para motoristas."],
      ["Impunidade", "Sensação de que não haverá punição por um crime ou infração."],
    ],
    [
      ["O tema de 2013 pedia que o candidato discutisse:", ["a história do álcool", "os efeitos da implantação da Lei Seca", "a proibição de bebidas no país", "o preço da cerveja", "a indústria automobilística"], 1, "Foco nos efeitos."],
      ["Um efeito positivo da Lei Seca apontado por dados oficiais foi:", ["aumento de acidentes", "redução de mortes e internações", "fim do consumo de álcool", "aumento do preço dos carros", "fim das multas"], 1, "Dados do Ministério da Saúde."],
      ["Um limite da Lei Seca é:", ["a fiscalização igual em todo o país", "a fiscalização desigual, menor em cidades pequenas", "o excesso de blitze em todas as estradas", "a falta de leis", "a proibição de bafômetros"], 1, "Desigualdade na aplicação."],
      ["O álcool aumenta o risco no trânsito porque:", ["melhora os reflexos", "reduz a atenção e os reflexos", "deixa o motorista mais cuidadoso", "aumenta a visão", "não tem efeito"], 1, "Efeito depressor."],
      ["Uma proposta adequada é:", ["acabar com a Lei Seca", "ampliar a fiscalização e as campanhas educativas", "liberar o álcool para motoristas experientes", "proibir carros", "reduzir as multas"], 1, "Fiscalização + educação."],
    ],
    [["Cite um efeito positivo e um limite da Lei Seca no Brasil.", "Um efeito positivo foi a redução de mortes e internações por acidentes onde houve fiscalização; um limite é a fiscalização desigual, menor em cidades pequenas e rodovias, somada à cultura que associa lazer a beber e dirigir."]],
    essay("Efeitos da implantação da Lei Seca no Brasil"),
  ),
  aula(
    "Tema ENEM 2012: imigração para o Brasil",
    `## O tema

Em 2012 o ENEM pediu: **"O movimento imigratório para o Brasil no século XXI"**.

## Entendendo o recorte

- Foco nos **imigrantes que chegam** ao Brasil **atualmente**: haitianos (após o terremoto de 2010), bolivianos, venezuelanos (crise a partir de 2015), sírios, africanos, entre outros.
- Discutir os **desafios** de acolhimento e integração, e as **contribuições** dos imigrantes.

## Repertório útil

- **Lei de Migração (13.445/2017):** substituiu o Estatuto do Estrangeiro (da ditadura, que via o imigrante como ameaça) e trata o migrante como **sujeito de direitos**.
- **Operação Acolhida** (Roraima): recepção e interiorização de venezuelanos.
- **Declaração Universal dos Direitos Humanos** (art. 13 e 14: direito de migrar e de buscar asilo).
- Histórico: o Brasil foi formado por imigrantes (italianos, japoneses, alemães, sírio-libaneses) — mas também por africanos trazidos à força.
- **Xenofobia** e **trabalho análogo à escravidão** (bolivianos em oficinas de costura em São Paulo).
- **Zygmunt Bauman:** "estranhos à nossa porta".

## Duas linhas de argumento

1. **Falta de políticas de integração:** barreiras de **idioma**, de **validação de diplomas** e de acesso a documentos levam muitos imigrantes à informalidade e à exploração.
2. **Xenofobia e preconceito:** imigrantes, sobretudo negros e pobres, sofrem discriminação, vista como "concorrência" por empregos, apesar de contribuírem para a economia e a cultura.

## Proposta de intervenção (modelo)

O **Governo Federal**, em parceria com **prefeituras e universidades**, deve criar **centros de acolhimento** com **cursos gratuitos de português**, orientação para **documentos** e **validação de diplomas**, **a fim de** integrar os imigrantes ao mercado formal e à sociedade. Campanhas contra a xenofobia devem ser promovidas nas escolas e na mídia.

## Resumindo

Trate dos imigrantes atuais (haitianos, venezuelanos), use a Lei de Migração e a DUDH, argumente com falta de integração e xenofobia e proponha centros de acolhimento, cursos de português e validação de diplomas.`,
    [
      "Foco: imigrantes atuais (haitianos, venezuelanos, bolivianos).",
      "Lei de Migração (2017): migrante como sujeito de direitos.",
      "Argumentos: falta de integração e xenofobia.",
      "Proposta: acolhimento, cursos de português e validação de diplomas.",
    ],
    [
      ["Imigrante", "Pessoa que chega a um país para viver nele."],
      ["Interiorização", "Transferência de migrantes de áreas de fronteira para outras cidades com mais oportunidades."],
      ["Xenofobia", "Aversão ou preconceito contra estrangeiros."],
    ],
    [
      ["O tema de 2012 trata principalmente:", ["dos brasileiros que emigram", "dos imigrantes que chegam ao Brasil no século XXI", "da imigração europeia do século XIX", "do êxodo rural", "do turismo"], 1, "Recorte temporal."],
      ["A Lei de Migração de 2017 se diferencia do antigo Estatuto do Estrangeiro por:", ["ver o imigrante como ameaça", "tratar o migrante como sujeito de direitos", "proibir a imigração", "exigir visto para todos", "acabar com o refúgio"], 1, "Mudança de perspectiva."],
      ["A Operação Acolhida, em Roraima, é voltada a:", ["haitianos", "venezuelanos", "japoneses", "italianos", "chineses"], 1, "Crise venezuelana."],
      ["Um obstáculo à integração dos imigrantes é:", ["o excesso de cursos de português", "a dificuldade de validar diplomas e de aprender o idioma", "a facilidade de conseguir documentos", "a ausência de leis", "o turismo"], 1, "Barreiras práticas."],
      ["A exploração de bolivianos em oficinas de costura em São Paulo é exemplo de:", ["integração bem-sucedida", "trabalho análogo à escravidão", "intercâmbio cultural", "turismo de negócios", "política pública"], 1, "Violação de direitos."],
    ],
    [["Cite dois desafios enfrentados pelos imigrantes que chegam ao Brasil hoje.", "A barreira do idioma e a dificuldade de validar diplomas e obter documentos, que os empurram para a informalidade e a exploração, além da xenofobia e do preconceito, especialmente contra imigrantes negros e pobres."]],
    essay("O movimento imigratório para o Brasil no século XXI"),
  ),
  aula(
    "Tema provável: saúde mental dos jovens",
    `## O tema

Um tema possível: **"Desafios para a promoção da saúde mental entre os jovens brasileiros"**.

## Contexto

- Aumento de casos de **ansiedade**, **depressão**, **automutilação** e **suicídio** entre jovens.
- A **pandemia** (isolamento) agravou o quadro.
- **Redes sociais**: comparação constante, padrões irreais de beleza e sucesso, **cyberbullying**, uso excessivo à noite (prejudica o sono).
- Pressão por **desempenho** escolar e incerteza sobre o futuro (desemprego juvenil).

## Repertório útil

- **OMS:** a depressão está entre as principais causas de incapacidade no mundo; o suicídio é uma das principais causas de morte de jovens.
- **Byung-Chul Han**, *Sociedade do Cansaço*: cobrança por desempenho leva ao esgotamento.
- **Zygmunt Bauman**: relações líquidas e insegurança.
- **Setembro Amarelo** e o **CVV** (Centro de Valorização da Vida, telefone 188).
- **Lei 13.935/2019:** prevê **psicólogos e assistentes sociais** nas escolas públicas (ainda pouco implementada).
- **CAPS** e **CAPSi** (infantojuvenil) no SUS.

## Duas linhas de argumento

1. **Pressões da era digital:** redes sociais e a cultura do desempenho geram comparação, ansiedade e isolamento.
2. **Falta de acesso e estigma:** poucos psicólogos no SUS e nas escolas, além do preconceito ("é frescura"), dificultam pedir ajuda.

## Proposta de intervenção (modelo)

O **Ministério da Educação**, em parceria com o **Ministério da Saúde**, deve **efetivar a Lei 13.935/2019**, garantindo **psicólogos em todas as escolas públicas**, **por meio de** concursos e verbas específicas, **a fim de** identificar precocemente sofrimentos e encaminhar os jovens à rede de atenção psicossocial. As escolas também devem realizar **rodas de conversa** e **educação digital**.

## Resumindo

Contextualize o aumento de transtornos entre jovens, use OMS, Byung-Chul Han e a Lei 13.935, argumente com pressões digitais e falta de acesso, e proponha psicólogos nas escolas e educação digital.`,
    [
      "Aumento de ansiedade e depressão entre jovens.",
      "Redes sociais, comparação e cultura do desempenho.",
      "Lei 13.935/2019: psicólogos nas escolas públicas.",
      "Proposta: efetivar a lei e promover educação digital.",
    ],
    [
      ["Saúde mental", "Estado de bem-estar emocional e psicológico."],
      ["Cyberbullying", "Agressões e humilhações repetidas pela internet."],
      ["CVV", "Centro de Valorização da Vida, apoio emocional gratuito pelo 188."],
    ],
    [
      ["Um fator associado ao aumento da ansiedade entre jovens é:", ["o excesso de sono", "a comparação constante nas redes sociais", "a redução das redes sociais", "a diminuição da pressão escolar", "o fim das provas"], 1, "Padrões irreais."],
      ["A Lei 13.935/2019 prevê:", ["proibição de celulares", "psicólogos e assistentes sociais nas escolas públicas", "fim das provas", "internet gratuita", "CAPS em todas as casas"], 1, "Ainda pouco implementada."],
      ["A obra \"Sociedade do Cansaço\" é de:", ["Byung-Chul Han", "Marx", "Platão", "Freud", "Machado de Assis"], 0, "Cobrança por desempenho."],
      ["O estigma em relação à saúde mental:", ["facilita pedir ajuda", "faz as pessoas esconderem o sofrimento e não buscarem tratamento", "não existe", "acaba com a depressão", "é recomendado pela OMS"], 1, "Barreira ao cuidado."],
      ["O telefone do CVV para apoio emocional é:", ["190", "188", "192", "193", "180"], 1, "Ligação gratuita."],
    ],
    [["Explique como as redes sociais podem afetar a saúde mental dos jovens.", "Elas estimulam a comparação constante com vidas e corpos idealizados, expõem ao cyberbullying, criam dependência de curtidas e prejudicam o sono pelo uso noturno, o que pode gerar ansiedade, baixa autoestima e depressão."]],
    essay("Desafios para a promoção da saúde mental entre os jovens brasileiros"),
  ),
  aula(
    "Tema provável: fome e insegurança alimentar",
    `## O tema

Tema possível: **"O desafio de combater a insegurança alimentar no Brasil"**.

## Contexto

- O Brasil é um dos **maiores produtores de alimentos** do mundo, mas milhões de pessoas vivem em **insegurança alimentar** (não têm acesso regular a comida suficiente e de qualidade).
- O país saiu do **Mapa da Fome da ONU** em 2014, voltou anos depois e voltou a sair em 2025, mostrando que o problema depende de **políticas públicas**.
- **Desperdício:** grande quantidade de alimentos é perdida entre a colheita e o consumo.

## Repertório útil

- **Josué de Castro**, *Geografia da Fome* (1946): a fome é um problema **social e político**, não natural.
- **Constituição (art. 6º):** a **alimentação** é direito social (incluída em 2010).
- **Amartya Sen:** as fomes resultam da falta de **acesso** (renda), não da falta de comida.
- **Programas:** Bolsa Família, **PNAE** (merenda escolar, com compra da agricultura familiar), **PAA** (Programa de Aquisição de Alimentos), restaurantes populares, cozinhas solidárias.
- **Betinho** e a campanha "Ação da Cidadania contra a Fome" (1993).

## Duas linhas de argumento

1. **Desigualdade de renda:** a fome não vem da falta de produção, mas da falta de **renda** e do **desemprego**; a alta dos preços dos alimentos atinge mais os pobres.
2. **Modelo agrícola e desperdício:** o agronegócio exportador prioriza commodities, enquanto a **agricultura familiar** (que produz grande parte dos alimentos) recebe menos apoio; além disso, há muito desperdício.

## Proposta de intervenção (modelo)

O **Governo Federal** deve **ampliar o PAA e o PNAE**, comprando mais alimentos da **agricultura familiar** para distribuir a escolas, restaurantes populares e famílias vulneráveis, **por meio de** aumento do orçamento e parcerias com os municípios, **a fim de** garantir o direito à alimentação e fortalecer pequenos produtores. Também deve incentivar **bancos de alimentos** contra o desperdício.

## Resumindo

Mostre o paradoxo (grande produtor com fome), use Josué de Castro, Amartya Sen e a Constituição, argumente com desigualdade de renda e modelo agrícola, e proponha PAA, PNAE, restaurantes populares e combate ao desperdício.`,
    [
      "Paradoxo: grande produtor de alimentos com pessoas passando fome.",
      "Josué de Castro: a fome é problema social e político.",
      "Amartya Sen: fome vem da falta de acesso (renda).",
      "Proposta: PAA, PNAE, agricultura familiar e bancos de alimentos.",
    ],
    [
      ["Insegurança alimentar", "Falta de acesso regular a alimentos suficientes e de qualidade."],
      ["Mapa da Fome", "Lista da ONU de países com parte significativa da população subalimentada."],
      ["PNAE", "Programa Nacional de Alimentação Escolar."],
    ],
    [
      ["A obra \"Geografia da Fome\", que trata a fome como problema social, é de:", ["Josué de Castro", "Gilberto Freyre", "Darcy Ribeiro", "Machado de Assis", "Paulo Freire"], 0, "Livro de 1946 de Josué de Castro."],
      ["Para Amartya Sen, a fome resulta principalmente:", ["da falta de produção mundial", "da falta de acesso, ligada à renda", "do clima apenas", "da superpopulação", "da tecnologia"], 1, "Teoria dos intitulamentos."],
      ["O paradoxo da fome no Brasil é que:", ["o país não produz alimentos", "o país é grande produtor de alimentos, mas há pessoas com fome", "não há desigualdade", "todos comem bem", "só falta comida no campo"], 1, "Problema de distribuição."],
      ["A alimentação é direito social previsto:", ["no Código Penal", "na Constituição Federal, art. 6º", "apenas na DUDH", "na CLT", "em nenhuma lei"], 1, "Incluída em 2010."],
      ["Uma proposta que une combate à fome e apoio ao pequeno produtor é:", ["importar todos os alimentos", "ampliar compras públicas da agricultura familiar (PAA e PNAE)", "acabar com a merenda escolar", "exportar mais commodities apenas", "fechar restaurantes populares"], 1, "Duplo efeito."],
    ],
    [["Por que se diz que a fome no Brasil é um problema de acesso, e não de produção?", "Porque o país produz alimentos suficientes e é grande exportador; a fome existe porque muitas famílias não têm renda para comprar comida, devido à desigualdade, ao desemprego e à alta dos preços."]],
    essay("O desafio de combater a insegurança alimentar no Brasil"),
  ),
  aula(
    "Tema provável: desinformação e democracia",
    `## O tema

Tema possível: **"Os impactos da desinformação na democracia brasileira"**.

## Contexto

- **Fake news** e **desinformação** se espalham rapidamente por redes sociais e aplicativos de mensagem.
- Afetam **eleições**, a confiança nas **instituições**, a **saúde pública** (movimentos antivacina) e a vida de pessoas (linchamentos virtuais e reais).
- **Deepfakes** feitos com inteligência artificial tornam mais difícil distinguir o real do falso.

## Repertório útil

- **Pós-verdade** (palavra do ano do Dicionário Oxford em 2016): emoções e crenças pesam mais que fatos.
- **Hannah Arendt:** a mentira sistemática destrói o espaço comum necessário à política.
- **Eli Pariser:** filtros-bolha.
- **Umberto Eco:** as redes deram voz a "legiões de imbecis" (citação polêmica sobre o fim da mediação).
- **Marco Civil da Internet** (2014), **LGPD** e debates sobre a **regulação das plataformas**.
- Agências de **checagem** (Lupa, Aos Fatos) e o TSE no combate à desinformação eleitoral.
- **Queda das coberturas vacinais** associada à desinformação.

## Duas linhas de argumento

1. **Modelo de negócio das plataformas:** algoritmos premiam conteúdos que geram engajamento, e notícias falsas e chocantes circulam mais, criando bolhas e polarização.
2. **Baixa educação midiática:** muitas pessoas não sabem checar fontes e compartilham por impulso, especialmente em grupos de mensagens.

## Proposta de intervenção (modelo)

O **Ministério da Educação** deve incluir a **educação midiática** na Base Nacional Comum Curricular de forma efetiva, **por meio de** oficinas de checagem de fontes e análise de algoritmos, **a fim de** formar cidadãos críticos. **Paralelamente**, o **Congresso Nacional** deve aprovar regras de **transparência** e responsabilidade das plataformas digitais sobre conteúdos falsos impulsionados.

## Resumindo

Mostre como a desinformação afeta eleições, instituições e saúde, use pós-verdade, Arendt e filtros-bolha, argumente com o modelo das plataformas e a falta de educação midiática e proponha educação midiática e regulação das plataformas.`,
    [
      "Desinformação afeta eleições, instituições e saúde pública.",
      "Pós-verdade: emoções valem mais que fatos.",
      "Algoritmos premiam engajamento, e notícias falsas circulam mais.",
      "Proposta: educação midiática e transparência das plataformas.",
    ],
    [
      ["Desinformação", "Informação falsa ou distorcida espalhada, muitas vezes de propósito."],
      ["Deepfake", "Vídeo ou áudio falso produzido com inteligência artificial."],
      ["Educação midiática", "Formação para ler, avaliar e produzir informação de forma crítica."],
    ],
    [
      ["\"Pós-verdade\" foi escolhida palavra do ano pelo Dicionário Oxford em:", ["2000", "2008", "2016", "2022", "1990"], 2, "Contexto de eleições e Brexit."],
      ["Um efeito da desinformação na saúde pública foi:", ["aumento da vacinação", "queda das coberturas vacinais", "fim das epidemias", "melhora do saneamento", "fim dos remédios"], 1, "Movimento antivacina."],
      ["Os algoritmos das plataformas favorecem a desinformação porque:", ["verificam todas as notícias", "premiam conteúdos que geram muito engajamento", "proíbem compartilhamentos", "mostram só fontes oficiais", "são controlados pelo TSE"], 1, "Modelo de negócio."],
      ["Para Hannah Arendt, a mentira sistemática na política:", ["fortalece a democracia", "destrói o espaço comum necessário ao debate", "é irrelevante", "é necessária", "não existe"], 1, "Repertório filosófico."],
      ["Uma proposta de longo prazo contra a desinformação é:", ["proibir a internet", "investir em educação midiática nas escolas", "acabar com o jornalismo", "liberar deepfakes", "fechar as agências de checagem"], 1, "Formação crítica."],
    ],
    [["Por que a desinformação é uma ameaça à democracia?", "Porque a democracia depende de cidadãos bem informados para escolher e debater; notícias falsas manipulam eleições, aumentam a polarização, destroem a confiança nas instituições e na ciência e dificultam o diálogo baseado em fatos."]],
    essay("Os impactos da desinformação na democracia brasileira"),
  ),
  aula(
    "Tema provável: envelhecimento da população",
    `## O tema

Tema possível: **"Desafios para garantir uma velhice digna no Brasil"**.

## Contexto

- O Brasil **envelhece rapidamente**: a fecundidade caiu e a expectativa de vida aumentou. O número de idosos (60+) cresce mais rápido que o de jovens.
- Desafios: **previdência**, **saúde** (doenças crônicas), **cuidado** (quem cuida dos idosos?), **solidão**, **violência** e **etarismo** (preconceito contra idosos).

## Repertório útil

- **Estatuto da Pessoa Idosa (Lei 10.741/2003):** direitos à saúde, transporte gratuito, prioridade, proteção contra violência e abandono.
- **Constituição (art. 230):** dever da família, da sociedade e do Estado de amparar os idosos.
- **IBGE:** projeções mostram aumento acelerado da população idosa.
- **Simone de Beauvoir**, *A Velhice*: a sociedade descarta os velhos quando deixam de ser produtivos.
- **Etarismo/idadismo**.
- **Disque 100**: denúncia de violência contra idosos (a maior parte ocorre dentro da família).

## Duas linhas de argumento

1. **Estrutura insuficiente de cuidado:** faltam geriatras, centros-dia, instituições de longa permanência públicas e cuidadores formados; o cuidado recai sobre famílias, principalmente mulheres.
2. **Etarismo e exclusão:** a sociedade associa velhice a inutilidade, o que gera exclusão do mercado de trabalho, isolamento e violência, muitas vezes dentro da própria família.

## Proposta de intervenção (modelo)

O **Ministério da Saúde**, com os **municípios**, deve **ampliar centros-dia e a atenção domiciliar** a idosos, **além de** formar **cuidadores** e geriatras pelo SUS, **a fim de** garantir cuidado digno e apoiar as famílias. Campanhas contra o **etarismo** e de incentivo ao **convívio entre gerações** devem ser promovidas nas escolas e na mídia.

## Resumindo

Contextualize o envelhecimento acelerado, use o Estatuto da Pessoa Idosa, a Constituição e Beauvoir, argumente com falta de estrutura de cuidado e etarismo, e proponha centros-dia, cuidadores e campanhas contra o preconceito.`,
    [
      "O Brasil envelhece rápido: menos filhos e vida mais longa.",
      "Estatuto da Pessoa Idosa (2003) e art. 230 da Constituição.",
      "Argumentos: falta de estrutura de cuidado e etarismo.",
      "Proposta: centros-dia, cuidadores e campanhas intergeracionais.",
    ],
    [
      ["Etarismo", "Preconceito ou discriminação por causa da idade."],
      ["Centro-dia", "Espaço que acolhe idosos durante o dia, com cuidados e atividades."],
      ["Expectativa de vida", "Número médio de anos que uma pessoa deve viver."],
    ],
    [
      ["O envelhecimento da população brasileira se deve:", ["ao aumento da natalidade", "à queda da fecundidade e ao aumento da expectativa de vida", "à imigração de idosos", "ao fim das vacinas", "ao êxodo rural apenas"], 1, "Transição demográfica."],
      ["A lei que garante direitos às pessoas com 60 anos ou mais é:", ["o ECA", "o Estatuto da Pessoa Idosa", "a Lei Maria da Penha", "a LGPD", "a CLT"], 1, "Lei 10.741/2003."],
      ["Etarismo é:", ["respeito aos idosos", "preconceito por causa da idade", "uma doença", "uma aposentadoria", "um programa de saúde"], 1, "Também chamado idadismo."],
      ["A obra \"A Velhice\", que critica o descarte social dos idosos, é de:", ["Simone de Beauvoir", "Paulo Freire", "Bauman", "Maquiavel", "Montesquieu"], 0, "Filósofa francesa."],
      ["Uma proposta adequada ao tema é:", ["reduzir o atendimento a idosos", "ampliar centros-dia e formar cuidadores", "proibir idosos de trabalhar", "acabar com a gratuidade no transporte", "isolar os idosos"], 1, "Estrutura de cuidado."],
    ],
    [["Cite dois desafios trazidos pelo envelhecimento da população brasileira.", "A falta de estrutura de cuidado, como geriatras, centros-dia e cuidadores, que sobrecarrega as famílias, e o etarismo, que exclui os idosos do trabalho e da convivência e favorece a violência e o abandono."]],
    essay("Desafios para garantir uma velhice digna no Brasil"),
  ),
  aula(
    "Tema provável: saneamento básico",
    `## O tema

Tema possível: **"Caminhos para universalizar o saneamento básico no Brasil"**.

## Contexto

- **Saneamento básico:** abastecimento de **água potável**, coleta e **tratamento de esgoto**, manejo de **lixo** e **drenagem** da chuva.
- Milhões de brasileiros **não têm água tratada**, e cerca de **metade** não tem **esgoto tratado**.
- Desigualdade: o problema é maior no **Norte e Nordeste**, nas **periferias** e em áreas **rurais**.

## Repertório útil

- **Marco Legal do Saneamento (Lei 14.026/2020):** meta de garantir **99% da população com água** e **90% com coleta e tratamento de esgoto** até **2033**.
- **ONU (2010):** acesso à água e ao saneamento é **direito humano**.
- **Objetivos de Desenvolvimento Sustentável (ODS 6)**.
- **OMS:** cada real investido em saneamento economiza gastos com saúde.
- Doenças ligadas à falta de saneamento: **diarreias**, hepatite A, leptospirose, verminoses, cólera.
- **Oswaldo Cruz** e a **Revolta da Vacina** (1904) mostram a ligação entre saneamento e saúde pública.

## Duas linhas de argumento

1. **Saúde e desigualdade:** a falta de saneamento causa doenças que atingem principalmente crianças pobres, afetando a frequência escolar e perpetuando a desigualdade.
2. **Investimento insuficiente e urbanização desordenada:** obras de esgoto são caras e "invisíveis" (rendem pouca visibilidade política), e o crescimento desordenado das cidades criou áreas irregulares sem infraestrutura.

## Proposta de intervenção (modelo)

O **Governo Federal**, em parceria com **estados e municípios**, deve **priorizar investimentos em saneamento** nas regiões e periferias mais carentes, **por meio de** recursos do orçamento e parcerias reguladas, com **metas fiscalizadas** pelas agências reguladoras, **a fim de** cumprir o Marco Legal até 2033 e reduzir doenças. A **sociedade civil** deve acompanhar os indicadores.

## Resumindo

Defina saneamento, mostre a desigualdade no acesso, use o Marco Legal, a ONU e a OMS, argumente com saúde e falta de investimento e proponha investimento prioritário com metas fiscalizadas.`,
    [
      "Saneamento: água, esgoto, lixo e drenagem.",
      "Cerca de metade dos brasileiros não tem esgoto tratado.",
      "Marco Legal (2020): universalizar até 2033.",
      "Saneamento previne doenças e reduz gastos com saúde.",
    ],
    [
      ["Saneamento básico", "Conjunto de serviços de água, esgoto, resíduos sólidos e drenagem."],
      ["Universalização", "Garantia de que o serviço chegue a toda a população."],
      ["ODS", "Objetivos de Desenvolvimento Sustentável da ONU."],
    ],
    [
      ["O Marco Legal do Saneamento (2020) estabeleceu a meta de universalização até:", ["2025", "2030", "2033", "2050", "2100"], 2, "99% água e 90% esgoto."],
      ["Uma doença associada à falta de saneamento é:", ["diabetes", "leptospirose", "hipertensão", "miopia", "gripe"], 1, "Contato com água contaminada."],
      ["A ONU reconheceu em 2010 que o acesso à água e ao saneamento é:", ["um luxo", "um direito humano", "responsabilidade só individual", "um serviço opcional", "um problema só rural"], 1, "Direito humano."],
      ["Um motivo para o atraso do saneamento é que essas obras:", ["são baratas e visíveis", "são caras e pouco visíveis politicamente", "não trazem benefícios", "são proibidas", "já foram concluídas"], 1, "Argumento político."],
      ["Investir em saneamento ajuda a educação porque:", ["aumenta o número de provas", "reduz doenças que afastam crianças da escola", "substitui professores", "aumenta o preço da água", "não tem relação"], 1, "Menos faltas por doença."],
    ],
    [["Explique a relação entre saneamento básico e saúde pública.", "Sem água tratada e esgoto, a população fica exposta a doenças como diarreias, hepatite A e leptospirose; investir em saneamento previne essas doenças, reduz internações e economiza gastos com saúde."]],
    essay("Caminhos para universalizar o saneamento básico no Brasil"),
  ),
  aula(
    "Tema provável: inclusão de pessoas com deficiência",
    `## O tema

Tema possível: **"Desafios para a inclusão de pessoas com deficiência no mercado de trabalho brasileiro"**.

## Contexto

- Milhões de brasileiros têm algum tipo de deficiência (física, visual, auditiva, intelectual).
- A taxa de **ocupação** das pessoas com deficiência é muito menor que a do restante da população, e os salários tendem a ser mais baixos.
- Barreiras **arquitetônicas**, **comunicacionais**, **tecnológicas** e, sobretudo, **atitudinais** (preconceito).

## Repertório útil

- **Lei de Cotas (8.213/1991, art. 93):** empresas com **100 ou mais empregados** devem reservar de **2% a 5%** das vagas para pessoas com deficiência ou reabilitadas.
- **Lei Brasileira de Inclusão (13.146/2015)** — Estatuto da Pessoa com Deficiência.
- **Convenção da ONU sobre os Direitos das Pessoas com Deficiência** (com status de emenda constitucional no Brasil).
- **Modelo social da deficiência:** a deficiência resulta da interação com **barreiras** do ambiente, não só da condição da pessoa.
- **Capacitismo:** preconceito que considera a pessoa com deficiência incapaz.
- Exemplos de superação devem ser usados com cuidado, para não reforçar a ideia de que inclusão depende só de esforço individual.

## Duas linhas de argumento

1. **Capacitismo e barreiras atitudinais:** empregadores subestimam a capacidade das pessoas com deficiência e contratam apenas para cumprir a cota, em funções sem crescimento.
2. **Falta de acessibilidade e qualificação:** transporte, prédios e sistemas digitais inacessíveis, além do acesso desigual à educação, dificultam a formação e a permanência no emprego.

## Proposta de intervenção (modelo)

O **Ministério do Trabalho** deve **intensificar a fiscalização** da Lei de Cotas e **criar incentivos** a empresas que promovam **acessibilidade** e planos de carreira inclusivos, **além de** oferecer, com o **Sistema S**, **cursos de qualificação acessíveis**, **a fim de** garantir inclusão real, e não apenas formal.

## Resumindo

Mostre as barreiras (sobretudo o capacitismo), use a Lei de Cotas, a LBI e o modelo social da deficiência, argumente com preconceito e falta de acessibilidade e proponha fiscalização, incentivos e qualificação acessível.`,
    [
      "Lei de Cotas: empresas com 100+ funcionários reservam 2% a 5% das vagas.",
      "Lei Brasileira de Inclusão (2015).",
      "Modelo social: as barreiras do ambiente geram a deficiência.",
      "Capacitismo é a principal barreira atitudinal.",
    ],
    [
      ["Capacitismo", "Preconceito que considera pessoas com deficiência incapazes."],
      ["Acessibilidade", "Condição de uso de espaços, serviços e informações por todas as pessoas."],
      ["Modelo social da deficiência", "Visão de que a deficiência resulta da interação com barreiras do ambiente."],
    ],
    [
      ["A Lei de Cotas para pessoas com deficiência obriga empresas com:", ["10 empregados", "50 empregados", "100 ou mais empregados", "1.000 empregados", "qualquer número"], 2, "Reserva de 2% a 5%."],
      ["Segundo o modelo social, a deficiência:", ["é apenas uma condição médica", "resulta da interação da pessoa com barreiras do ambiente", "não existe", "é culpa da pessoa", "é sempre temporária"], 1, "Foco nas barreiras."],
      ["Barreiras atitudinais são:", ["escadas sem rampa", "preconceitos e estereótipos", "sites sem leitor de tela", "ônibus sem elevador", "portas estreitas"], 1, "Atitudes das pessoas."],
      ["Contratar apenas para cumprir a cota, sem oferecer crescimento, revela:", ["inclusão plena", "inclusão apenas formal", "acessibilidade total", "igualdade salarial", "cumprimento do espírito da lei"], 1, "Problema a ser discutido."],
      ["Uma proposta coerente com o tema é:", ["acabar com a Lei de Cotas", "fiscalizar a lei e oferecer qualificação acessível", "proibir pessoas com deficiência de trabalhar", "reduzir a acessibilidade", "pagar menos"], 1, "Inclusão real."],
    ],
    [["Explique o que é capacitismo e como ele dificulta a inclusão no mercado de trabalho.", "Capacitismo é o preconceito que vê a pessoa com deficiência como incapaz; ele faz empregadores subestimarem essas pessoas, contratarem só para cumprir cota e não oferecerem promoções, limitando sua participação real no trabalho."]],
    essay("Desafios para a inclusão de pessoas com deficiência no mercado de trabalho brasileiro"),
  ),
  aula(
    "Tema provável: crise climática e eventos extremos",
    `## O tema

Tema possível: **"Caminhos para enfrentar os impactos dos eventos climáticos extremos no Brasil"**.

## Contexto

- Eventos extremos estão mais **frequentes e intensos**: **enchentes no Rio Grande do Sul (2024)**, **secas** históricas na Amazônia, **ondas de calor**, **deslizamentos** no litoral paulista (2023), **incêndios** no Pantanal.
- As populações **mais pobres** são as mais atingidas: moram em encostas e margens de rios, têm menos recursos para se recuperar (**injustiça climática**).

## Repertório útil

- **IPCC:** o aquecimento global é causado pelas atividades humanas e intensifica eventos extremos.
- **Acordo de Paris (2015):** limitar o aquecimento a 1,5 °C.
- **COP30** em **Belém** (2025).
- **Ailton Krenak**, *Ideias para Adiar o Fim do Mundo*.
- **Hans Jonas:** ética da responsabilidade com as gerações futuras.
- **Plano Nacional de Adaptação** e **Defesa Civil**; sistemas de **alerta** por celular.
- Conceito de **"refugiado climático"**.

## Duas linhas de argumento

1. **Urbanização desordenada e desigualdade:** a ocupação de áreas de risco por falta de moradia digna torna os pobres mais vulneráveis a enchentes e deslizamentos.
2. **Falta de prevenção e de adaptação:** o poder público costuma agir **depois** da tragédia; faltam investimentos em drenagem, contenção de encostas, sistemas de alerta e planos de evacuação.

## Proposta de intervenção (modelo)

O **Governo Federal**, com **estados e municípios**, deve **ampliar investimentos em prevenção e adaptação**, como **mapeamento de áreas de risco**, obras de drenagem e **sistemas de alerta** com treinamento da população, **além de** realocar famílias de áreas de risco para **moradias dignas e próximas**, **a fim de** reduzir mortes e prejuízos. Paralelamente, deve cumprir as metas de **redução do desmatamento** e de emissões.

## Resumindo

Mostre que eventos extremos estão mais frequentes e atingem mais os pobres, use IPCC, Acordo de Paris e Krenak, argumente com urbanização desordenada e falta de prevenção, e proponha mapeamento de risco, alertas, moradia digna e redução de emissões.`,
    [
      "Eventos extremos mais frequentes: enchentes no RS, secas na Amazônia.",
      "Injustiça climática: os pobres são os mais atingidos.",
      "Repertório: IPCC, Acordo de Paris, COP30 em Belém, Krenak.",
      "Proposta: prevenção, alertas, moradia digna e menos desmatamento.",
    ],
    [
      ["Evento climático extremo", "Fenômeno do tempo muito intenso, como enchente, seca ou onda de calor."],
      ["Adaptação climática", "Medidas para reduzir os danos das mudanças climáticas."],
      ["Injustiça climática", "Desigualdade na forma como os impactos do clima atingem os grupos sociais."],
    ],
    [
      ["Um exemplo recente de evento extremo no Brasil foram:", ["as enchentes no Rio Grande do Sul em 2024", "a neve em Salvador", "o terremoto em Brasília", "o tsunami no Rio", "o vulcão em Minas"], 0, "Grande tragédia climática."],
      ["Injustiça climática significa que:", ["todos sofrem igual", "os mais pobres sofrem mais, embora poluam menos", "só os ricos são atingidos", "o clima não muda", "não há responsáveis"], 1, "Desigualdade nos impactos."],
      ["O órgão científico da ONU que estuda as mudanças climáticas é o:", ["IPCC", "OMC", "FMI", "OTAN", "UNESCO"], 0, "Painel Intergovernamental."],
      ["A COP30 foi realizada em:", ["São Paulo", "Belém", "Brasília", "Rio de Janeiro", "Manaus"], 1, "Em 2025, na Amazônia."],
      ["Uma medida de adaptação é:", ["aumentar o desmatamento", "criar sistemas de alerta e mapear áreas de risco", "construir em encostas", "impermeabilizar mais o solo", "ignorar as previsões"], 1, "Prevenção."],
    ],
    [["Por que os eventos climáticos extremos atingem mais a população pobre?", "Porque, sem acesso a moradia digna, muitas famílias pobres vivem em encostas e margens de rios, áreas de risco, e têm menos recursos para se proteger e se recuperar dos danos."]],
    essay("Caminhos para enfrentar os impactos dos eventos climáticos extremos no Brasil"),
  ),
];
