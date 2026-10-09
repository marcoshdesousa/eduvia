import { essayInstructions } from "../redacao";
import { aula } from "./build";

const essay = (theme: string) => ({ theme, instructions: essayInstructions(theme) });

/** Redação, lote 1: os temas reais do ENEM, com recorte, repertório, argumentos e proposta — e a redação para escrever. */
export const REDACAO_1 = [
  aula(
    "Tema ENEM 2024: a herança africana no Brasil",
    `## O tema

Em 2024 o ENEM pediu: **"Desafios para a valorização da herança africana no Brasil"**.

## Entendendo o recorte

- **Desafios:** o texto deve mostrar **o que impede** a valorização (não só elogiar a cultura africana).
- **Valorização:** reconhecer, respeitar, proteger e dar visibilidade.
- **Herança africana:** culturas, religiões, línguas, saberes, culinária, música, estética e também as **pessoas** negras que carregam essa herança.

Fugir do recorte seria falar só da escravidão, ou só do racismo em geral, sem ligar à **herança cultural**.

## Repertório útil

- **Lei 10.639/2003:** obriga o ensino de história e cultura afro-brasileira nas escolas — mas sua aplicação ainda é falha.
- **Gilberto Freyre** e o **mito da democracia racial**, criticado por **Florestan Fernandes**.
- **Lélia Gonzalez** e a "amefricanidade"; **Abdias Nascimento**.
- **Racismo estrutural** (**Silvio Almeida**).
- **Intolerância religiosa** contra Candomblé e Umbanda (Dia 21 de janeiro, Mãe Gilda).
- Capoeira, samba de roda e frevo como patrimônios; **Constituição de 1988**, art. 215 (proteção das manifestações afro-brasileiras).

## Duas linhas de argumento

1. **Educação eurocêntrica:** a escola ainda ensina a África apenas pela escravidão e pouco aplica a Lei 10.639, o que forma cidadãos que desconhecem e desvalorizam essa herança.
2. **Racismo religioso e estrutural:** terreiros são atacados e manifestações afro são estigmatizadas, herança de um processo histórico de marginalização da população negra após a abolição.

## Proposta de intervenção (modelo)

O **Ministério da Educação** (agente) deve **fiscalizar a aplicação da Lei 10.639** e **formar professores** (ação), **por meio de** cursos de capacitação e materiais didáticos produzidos com intelectuais negros (meio), **a fim de** que os estudantes reconheçam a contribuição africana para a identidade nacional (finalidade). Detalhamento: incluir visitas a terreiros, quilombos e museus afro-brasileiros.

## Erros comuns

- Tratar a herança africana como "folclore" do passado.
- Não apresentar **desafios** concretos.
- Proposta vaga ("o governo deve conscientizar").

## Resumindo

Mostre os desafios (educação eurocêntrica, racismo religioso e estrutural), use repertório (Lei 10.639, democracia racial) e proponha uma intervenção completa com os cinco elementos.`,
    [
      "Recorte: os desafios para valorizar a herança africana, não só a escravidão.",
      "Repertório: Lei 10.639, mito da democracia racial, racismo estrutural.",
      "Argumentos: escola eurocêntrica e racismo religioso.",
      "Proposta com agente, ação, meio, finalidade e detalhamento.",
    ],
    [
      ["Recorte temático", "Aspecto específico do assunto que o tema pede para discutir."],
      ["Racismo religioso", "Discriminação contra religiões de matriz africana ligada ao racismo."],
      ["Eurocentrismo", "Visão que coloca a Europa como centro e modelo de cultura."],
    ],
    [
      ["Fugir do recorte do tema de 2024 seria:", ["discutir desafios para valorizar a herança africana", "falar apenas sobre racismo em geral, sem ligar à herança cultural", "citar a Lei 10.639", "falar de religiões de matriz africana", "propor formação de professores"], 1, "O tema pede a herança africana e seus desafios."],
      ["A Lei 10.639/2003 é um bom repertório porque:", ["proíbe religiões africanas", "obriga o ensino de história e cultura afro-brasileira nas escolas", "criou o feriado de Natal", "trata do trânsito", "acabou com o racismo"], 1, "Relaciona educação e valorização."],
      ["Em uma proposta de intervenção completa, \"por meio de cursos de capacitação\" corresponde ao:", ["agente", "meio/modo", "finalidade", "detalhamento", "tema"], 1, "Como a ação será feita."],
      ["O \"mito da democracia racial\" pode ser usado para argumentar que:", ["no Brasil não há racismo", "a ideia de harmonia racial esconde desigualdades e a desvalorização da herança negra", "a escravidão foi positiva", "a cultura africana não existe", "todos são iguais na prática"], 1, "Crítica de Florestan Fernandes."],
      ["Uma proposta vaga, que deve ser evitada, é:", ["\"o MEC deve formar professores por meio de cursos\"", "\"o governo deve conscientizar a população\"", "\"ONGs devem promover visitas a terreiros\"", "\"escolas devem incluir autores negros\"", "\"o IPHAN deve registrar patrimônios\""], 1, "Sem meio, finalidade nem detalhamento."],
    ],
    [
      ["Escreva uma tese possível para o tema \"Desafios para a valorização da herança africana no Brasil\".", "Uma tese como: a valorização da herança africana é dificultada por uma educação eurocêntrica, que pouco aplica a Lei 10.639, e pelo racismo estrutural e religioso, herdado de uma abolição sem integração."],
    ],
    essay("Desafios para a valorização da herança africana no Brasil"),
  ),
  aula(
    "Tema ENEM 2023: o trabalho de cuidado feito pela mulher",
    `## O tema

Em 2023 o ENEM pediu: **"Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil"**.

## Entendendo o recorte

- **Trabalho de cuidado:** cuidar de filhos, idosos, doentes e pessoas com deficiência, além das tarefas domésticas (limpar, cozinhar, organizar).
- **Invisibilidade:** esse trabalho **não é pago**, **não é contado** como trabalho e **não é reconhecido** socialmente.
- **Realizado pela mulher:** recai principalmente sobre mulheres, sobretudo **negras e pobres**.
- **Desafios para o enfrentamento:** o que impede que essa invisibilidade acabe.

## Dados e repertório

- Segundo o **IBGE**, as mulheres dedicam quase **o dobro de horas** semanais aos afazeres domésticos e ao cuidado em relação aos homens.
- **Dupla (ou tripla) jornada:** trabalho remunerado + trabalho doméstico.
- **Simone de Beauvoir:** "Ninguém nasce mulher, torna-se mulher" — os papéis de gênero são construções sociais.
- **Divisão sexual do trabalho:** homens no espaço público e produtivo; mulheres no privado e reprodutivo.
- Filme **"Que Horas Ela Volta?"** (2015): trabalhadora doméstica que cuida do filho dos patrões.
- **PEC das Domésticas (2013):** ampliou direitos das trabalhadoras domésticas.
- Economia do cuidado: estudos estimam que esse trabalho, se fosse pago, representaria uma parte grande do PIB.

## Duas linhas de argumento

1. **Cultura machista e papéis de gênero:** desde a infância, meninas são ensinadas a cuidar (bonecas, tarefas de casa) e meninos não, naturalizando a sobrecarga feminina.
2. **Falta de políticas públicas:** poucas **creches** e centros de cuidado para idosos, e licença-paternidade curta (5 dias), o que obriga as mulheres a deixar o emprego ou reduzir a carreira.

## Proposta de intervenção (modelo)

O **Governo Federal**, em parceria com os municípios, deve **ampliar a rede de creches e de centros-dia para idosos**, **por meio de** investimentos previstos em uma Política Nacional de Cuidados, **para que** as mulheres possam conciliar trabalho e vida pessoal e o cuidado deixe de ser responsabilidade exclusiva delas. Além disso, o Congresso deve ampliar a licença-paternidade.

## Resumindo

Explique o que é trabalho de cuidado e por que é invisível; use dados do IBGE, Beauvoir e a dupla jornada; argumente com papéis de gênero e falta de políticas; proponha creches, cuidado público e licença-paternidade.`,
    [
      "Trabalho de cuidado: cuidar de pessoas e da casa, sem pagamento.",
      "Mulheres fazem quase o dobro de horas desse trabalho (IBGE).",
      "Argumentos: papéis de gênero e falta de creches e licença-paternidade.",
      "Repertório: Beauvoir, dupla jornada, \"Que Horas Ela Volta?\".",
    ],
    [
      ["Dupla jornada", "Acúmulo do trabalho remunerado com o trabalho doméstico e de cuidado."],
      ["Divisão sexual do trabalho", "Distribuição de tarefas conforme o gênero, com sobrecarga feminina."],
      ["Licença-paternidade", "Período em que o pai pode se afastar do trabalho após o nascimento do filho."],
    ],
    [
      ["No tema de 2023, \"invisibilidade\" significa que o trabalho de cuidado:", ["é muito valorizado", "não é pago nem reconhecido como trabalho", "é feito só por homens", "é proibido", "é bem distribuído"], 1, "Trabalho não contado nem valorizado."],
      ["A expressão \"dupla jornada\" refere-se a:", ["trabalhar em dois empregos pagos", "somar o trabalho remunerado ao trabalho doméstico e de cuidado", "estudar e dormir", "trabalhar de dia e de noite no mesmo emprego", "fazer horas extras"], 1, "Sobrecarga feminina."],
      ["Um argumento ligado a políticas públicas para esse tema é:", ["a falta de creches e a licença-paternidade curta", "o excesso de creches", "a proibição do trabalho feminino", "a alta do dólar", "a falta de estradas"], 0, "Ausência do Estado no cuidado."],
      ["A frase de Beauvoir \"Ninguém nasce mulher, torna-se mulher\" ajuda a argumentar que:", ["o cuidado é natural da mulher", "os papéis de gênero são construídos socialmente", "as mulheres não trabalham", "os homens não podem cuidar", "a biologia define as tarefas"], 1, "Construção social."],
      ["Uma proposta de intervenção adequada ao tema é:", ["proibir as mulheres de trabalhar fora", "ampliar creches e centros de cuidado e a licença-paternidade", "cortar direitos das domésticas", "reduzir escolas", "não fazer nada"], 1, "Redistribui o cuidado."],
    ],
    [
      ["Por que o trabalho de cuidado realizado pelas mulheres é considerado invisível?", "Porque não é remunerado, não entra nas estatísticas como trabalho e é visto como obrigação natural da mulher, por causa dos papéis de gênero construídos socialmente."],
    ],
    essay("Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil"),
  ),
  aula(
    "Tema ENEM 2022: povos e comunidades tradicionais",
    `## O tema

Em 2022 o ENEM pediu: **"Desafios para a valorização de comunidades e povos tradicionais no Brasil"**.

## Entendendo o recorte

- **Povos e comunidades tradicionais:** grupos com modos de vida próprios, ligados ao **território** e transmitidos entre gerações: **indígenas, quilombolas, ribeirinhos, caiçaras, quebradeiras de coco, pescadores artesanais, seringueiros, ciganos**, entre outros.
- **Valorização:** respeitar, proteger direitos, reconhecer saberes.
- **Desafios:** o que impede essa valorização.

Atenção: falar **só de indígenas** é aceito, mas é bom mostrar que o tema é **mais amplo**.

## Repertório útil

- **Constituição de 1988:** reconhece os direitos dos indígenas às terras que tradicionalmente ocupam (art. 231) e a propriedade dos quilombolas (ADCT, art. 68).
- **Decreto 6.040/2007:** Política Nacional dos Povos e Comunidades Tradicionais.
- **Ailton Krenak** (*Ideias para Adiar o Fim do Mundo*): crítica ao modo de vida consumista que destrói a natureza.
- **Etnocentrismo** e a visão desses povos como "atrasados".
- Terras indígenas como áreas **mais preservadas** da Amazônia.
- Crise humanitária **Yanomami** (garimpo ilegal).

## Duas linhas de argumento

1. **Conflitos por território:** avanço do agronegócio, do garimpo e da grilagem, além da lentidão na demarcação e titulação, ameaçam a sobrevivência física e cultural desses grupos.
2. **Preconceito e invisibilidade:** a visão etnocêntrica, reforçada pela escola e pela mídia, trata esses povos como "atraso", desvalorizando seus saberes, inclusive os ambientais.

## Proposta de intervenção (modelo)

O **Poder Executivo Federal**, por meio da **FUNAI** e do **INCRA**, deve **acelerar a demarcação e a titulação** de terras tradicionais, **com** fiscalização por satélite e operações contra invasores, **a fim de** garantir a sobrevivência e a autonomia desses povos. Paralelamente, o MEC deve incluir saberes tradicionais nos currículos.

## Resumindo

Mostre a diversidade dos povos tradicionais, os desafios (território e preconceito), use a Constituição, Krenak e o etnocentrismo, e proponha demarcação, fiscalização e educação.`,
    [
      "Povos tradicionais vão além dos indígenas: quilombolas, ribeirinhos, caiçaras...",
      "Repertório: Constituição de 1988, Krenak, etnocentrismo.",
      "Argumentos: conflitos por território e preconceito.",
      "Proposta: demarcação, fiscalização e educação.",
    ],
    [
      ["Comunidade tradicional", "Grupo com modo de vida próprio ligado ao território e transmitido entre gerações."],
      ["Titulação", "Reconhecimento oficial da propriedade da terra para comunidades quilombolas."],
      ["Grilagem", "Apropriação ilegal de terras com documentos falsos."],
    ],
    [
      ["São exemplos de povos e comunidades tradicionais:", ["apenas indígenas", "indígenas, quilombolas, ribeirinhos e caiçaras", "só moradores de grandes cidades", "empresários do agronegócio", "imigrantes recentes"], 1, "Grupo amplo."],
      ["Um bom repertório filosófico para o tema é:", ["Maquiavel", "Ailton Krenak", "Descartes", "Newton", "Adam Smith"], 1, "Pensador indígena."],
      ["Um desafio territorial para esses povos é:", ["o excesso de demarcações", "o avanço do garimpo, da grilagem e do agronegócio", "a falta de turistas", "o excesso de proteção", "o fim da Constituição"], 1, "Conflitos por terra."],
      ["Ver os povos tradicionais como \"atrasados\" é exemplo de:", ["relativismo", "etnocentrismo", "multiculturalismo", "sustentabilidade", "laicidade"], 1, "Julgamento pela própria cultura."],
      ["Um agente adequado para a demarcação de terras indígenas é:", ["a FUNAI, no Poder Executivo Federal", "as empresas de mineração", "os bancos", "as redes sociais", "os turistas"], 0, "Órgão responsável."],
    ],
    [
      ["Cite dois desafios para a valorização dos povos tradicionais no Brasil.", "Os conflitos por território, com garimpo, grilagem e demora na demarcação, e o preconceito etnocêntrico que trata esses povos e seus saberes como atrasados."],
    ],
    essay("Desafios para a valorização de comunidades e povos tradicionais no Brasil"),
  ),
  aula(
    "Tema ENEM 2021: invisibilidade e registro civil",
    `## O tema

Em 2021 o ENEM pediu: **"Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil"**.

## Entendendo o recorte

- **Registro civil:** a **certidão de nascimento** é o primeiro documento e a base para todos os outros (RG, CPF, título de eleitor, carteira de trabalho).
- **Invisibilidade:** quem não tem registro "não existe" para o Estado: não acessa **escola, saúde, benefícios sociais, emprego formal, voto**.
- **Garantia de acesso à cidadania:** o registro é a porta de entrada dos direitos.

## Quem fica sem registro

- Populações **pobres** e de regiões **remotas** (Norte e Nordeste, zonas rurais).
- **Indígenas**, ribeirinhos, pessoas em situação de rua.
- Crianças nascidas em casa, longe de cartórios; mães sem documentos (o problema se repete entre gerações).

## Repertório útil

- **Constituição de 1988:** cidadania e dignidade da pessoa humana; o registro de nascimento e a primeira certidão são **gratuitos** (Lei 9.534/1997).
- **Declaração Universal dos Direitos Humanos** (art. 6º): toda pessoa tem direito a ser reconhecida como pessoa perante a lei.
- **Hannah Arendt:** cidadania como "**direito a ter direitos**".
- **Sub-registro:** nascimentos não registrados no prazo legal (dados do IBGE).
- **Cartórios em maternidades** (Unidades Interligadas).

## Duas linhas de argumento

1. **Exclusão de direitos:** sem documento, a pessoa não acessa políticas públicas, o que perpetua a pobreza e a marginalização.
2. **Dificuldade de acesso:** distância dos cartórios, desinformação e burocracia afastam justamente os mais vulneráveis.

## Proposta de intervenção (modelo)

O **Poder Judiciário**, por meio do **CNJ**, em parceria com as **prefeituras**, deve **ampliar os cartórios em maternidades e realizar mutirões itinerantes** de registro em áreas remotas, **com** barcos e unidades móveis, **a fim de** garantir que todo brasileiro tenha acesso à cidadania desde o nascimento.

## Resumindo

O registro civil é a porta dos direitos. Sem ele, há invisibilidade e exclusão. Use Arendt ("direito a ter direitos"), a Constituição e a DUDH, e proponha cartórios em maternidades e mutirões itinerantes.`,
    [
      "Certidão de nascimento: base de todos os outros documentos.",
      "Sem registro, a pessoa não acessa saúde, escola e benefícios.",
      "Arendt: cidadania é o \"direito a ter direitos\".",
      "Proposta: cartórios em maternidades e mutirões itinerantes.",
    ],
    [
      ["Registro civil", "Registro oficial do nascimento, que dá existência legal à pessoa."],
      ["Sub-registro", "Nascimentos não registrados no prazo previsto em lei."],
      ["Cidadania", "Conjunto de direitos e deveres de quem pertence a um Estado."],
    ],
    [
      ["Por que a falta de registro civil gera \"invisibilidade\"?", ["porque a pessoa fica escondida fisicamente", "porque a pessoa não existe oficialmente para o Estado e não acessa direitos", "porque não tem celular", "porque não usa redes sociais", "porque mora em cidade grande"], 1, "Exclusão dos direitos."],
      ["A frase \"direito a ter direitos\" é de:", ["Hannah Arendt", "Maquiavel", "Platão", "Darwin", "Adam Smith"], 0, "Cidadania como base."],
      ["Os grupos mais afetados pelo sub-registro são:", ["moradores ricos das capitais", "populações pobres, rurais, remotas e indígenas", "empresários", "estrangeiros em turismo", "servidores públicos"], 1, "Vulnerabilidade e distância."],
      ["Uma proposta adequada ao tema é:", ["cobrar mais pelo registro", "criar cartórios em maternidades e mutirões itinerantes", "fechar cartórios rurais", "exigir advogado para registrar", "acabar com a certidão"], 1, "Facilita o acesso."],
      ["A primeira certidão de nascimento no Brasil é:", ["paga e cara", "gratuita por lei", "emitida só aos 18 anos", "opcional", "feita só pela internet"], 1, "Gratuidade garantida."],
    ],
    [
      ["Explique por que o registro civil é considerado a porta de entrada da cidadania.", "Porque a certidão de nascimento é a base de todos os outros documentos; sem ela, a pessoa não existe para o Estado e não consegue acessar escola, saúde, benefícios sociais, emprego formal e voto."],
    ],
    essay("Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil"),
  ),
  aula(
    "Tema ENEM 2020: o estigma das doenças mentais",
    `## O tema

Em 2020 o ENEM pediu: **"O estigma associado às doenças mentais na sociedade brasileira"**.

## Entendendo o recorte

- **Estigma:** marca negativa, **preconceito** que faz a pessoa ser vista como "louca", "fraca", "perigosa" ou "preguiçosa".
- **Doenças mentais:** depressão, ansiedade, transtorno bipolar, esquizofrenia, entre outras.
- O foco não é só a doença, mas o **preconceito** e suas consequências: vergonha de procurar ajuda, isolamento, exclusão.

## Repertório útil

- **OMS:** o Brasil está entre os países com mais casos de **ansiedade** e depressão.
- **Michel Foucault** (*História da Loucura*): a sociedade excluiu e trancou os "loucos".
- **Holocausto Brasileiro** (Daniela Arbex): mortes no hospício de **Barbacena** (MG), símbolo do tratamento desumano.
- **Reforma Psiquiátrica** e **Lei 10.216/2001** (Lei Paulo Delgado): substituiu manicômios pelos **CAPS** (Centros de Atenção Psicossocial).
- **Nise da Silveira:** psiquiatra que humanizou o tratamento com arte.
- **Setembro Amarelo:** prevenção ao suicídio.
- **Erving Goffman:** conceito de **estigma**.

## Duas linhas de argumento

1. **Herança histórica e desinformação:** a ideia de que doença mental é "frescura" ou "falta de fé" vem da exclusão histórica dos doentes e da falta de informação, o que impede as pessoas de buscar tratamento.
2. **Falta de estrutura:** os CAPS são insuficientes e há poucos psicólogos no SUS, o que agrava o sofrimento e reforça a exclusão.

## Proposta de intervenção (modelo)

O **Ministério da Saúde** deve **ampliar a rede de CAPS e a presença de psicólogos nas Unidades Básicas de Saúde e nas escolas**, **além de** promover **campanhas** em mídias e redes sociais com relatos de pessoas em tratamento, **a fim de** combater o estigma e facilitar o acesso ao cuidado.

## Erros comuns

- Escrever só sobre "doenças mentais" sem falar do **estigma**.
- Usar termos preconceituosos ("loucos", "doidos").

## Resumindo

Foque no preconceito e em suas consequências. Use Foucault, Barbacena, a Reforma Psiquiátrica e Goffman. Argumente com desinformação e falta de estrutura; proponha CAPS, psicólogos e campanhas.`,
    [
      "Foco: o estigma (preconceito), não só a doença.",
      "Repertório: Foucault, Barbacena, Lei 10.216, Nise da Silveira.",
      "Argumentos: desinformação histórica e falta de estrutura (CAPS).",
      "Proposta: mais CAPS e psicólogos + campanhas com relatos.",
    ],
    [
      ["Estigma", "Marca social negativa que leva ao preconceito e à exclusão."],
      ["CAPS", "Centro de Atenção Psicossocial, serviço do SUS para saúde mental."],
      ["Reforma Psiquiátrica", "Movimento que substituiu os manicômios por cuidado em liberdade."],
    ],
    [
      ["O recorte do tema de 2020 exige discutir principalmente:", ["os sintomas de cada doença", "o preconceito associado às doenças mentais", "a cura das doenças", "a história da medicina", "os remédios mais caros"], 1, "Estigma é o centro."],
      ["A Lei 10.216/2001 está ligada:", ["à criação de manicômios", "à Reforma Psiquiátrica e aos CAPS", "ao trânsito", "ao meio ambiente", "à educação infantil"], 1, "Cuidado em liberdade."],
      ["\"Holocausto Brasileiro\", de Daniela Arbex, retrata:", ["a Segunda Guerra na Europa", "as mortes no hospício de Barbacena", "a escravidão", "a ditadura", "a pandemia"], 1, "Tratamento desumano."],
      ["Um argumento sobre o estigma é que ele:", ["incentiva a busca por ajuda", "faz as pessoas terem vergonha de procurar tratamento", "não tem consequências", "acaba com as doenças", "é sempre positivo"], 1, "Barreira ao cuidado."],
      ["Nise da Silveira é conhecida por:", ["defender o eletrochoque", "humanizar o tratamento psiquiátrico com arte", "criar manicômios", "negar as doenças mentais", "ser política"], 1, "Psiquiatra humanista."],
    ],
    [
      ["Explique como o estigma dificulta o tratamento das doenças mentais.", "O estigma faz as pessoas verem a doença mental como fraqueza, frescura ou loucura; assim, quem sofre sente vergonha, esconde o problema e não procura ajuda, o que agrava a doença e o isolamento."],
    ],
    essay("O estigma associado às doenças mentais na sociedade brasileira"),
  ),
  aula(
    "Tema ENEM 2019: acesso ao cinema",
    `## O tema

Em 2019 o ENEM pediu: **"Democratização do acesso ao cinema no Brasil"**.

## Entendendo o recorte

- **Democratização:** tornar acessível a **todos**, independentemente de renda, região, deficiência.
- **Acesso ao cinema:** ir às salas, mas também assistir, conhecer e **produzir** filmes.
- Atenção: o tema **não** é "a importância do cinema", e sim **por que nem todos têm acesso** e como mudar isso.

## O problema

- Grande parte dos **municípios brasileiros não tem sala de cinema**; as salas se concentram em **shoppings** de cidades grandes e bairros ricos.
- **Preço** dos ingressos alto para os mais pobres.
- Pouco acesso de pessoas com **deficiência** (falta de audiodescrição e Libras).
- Pouca exibição de **filmes nacionais**.

## Repertório útil

- **Constituição de 1988, art. 215:** o Estado garante a todos o pleno exercício dos **direitos culturais** e o acesso às fontes da cultura nacional.
- **Adorno e Horkheimer:** indústria cultural e padronização (domínio de blockbusters estrangeiros).
- **Cinema Novo** e **Glauber Rocha**: "uma câmera na mão e uma ideia na cabeça".
- **Cinema de rua** que fechou nas cidades; cineclubes; **Lei do Audiovisual**; **cota de tela** para filmes nacionais.
- **Antonio Candido:** "O direito à literatura" — a arte como direito humano (pode ser estendido ao cinema).

## Duas linhas de argumento

1. **Concentração geográfica e econômica:** salas em shoppings de bairros ricos e ingressos caros excluem os pobres e moradores de cidades pequenas e periferias.
2. **Pouca valorização da produção nacional e da diversidade:** o mercado é dominado por filmes estrangeiros, e o cinema não é visto como direito cultural e ferramenta educativa.

## Proposta de intervenção (modelo)

O **Ministério da Cultura**, em parceria com as **escolas públicas**, deve **criar cineclubes e sessões itinerantes gratuitas** em periferias e cidades sem cinema, **com** filmes nacionais, audiodescrição e Libras, **a fim de** garantir o direito à cultura e formar novos públicos.

## Resumindo

Mostre a exclusão (poucas salas, concentradas e caras), use o art. 215 da Constituição e a indústria cultural, e proponha cinema itinerante, cineclubes nas escolas e acessibilidade.`,
    [
      "Recorte: por que nem todos têm acesso ao cinema e como mudar.",
      "Salas concentradas em shoppings e cidades grandes; ingressos caros.",
      "Repertório: art. 215 da Constituição, indústria cultural, Cinema Novo.",
      "Proposta: cineclubes nas escolas e sessões itinerantes acessíveis.",
    ],
    [
      ["Democratização", "Tornar algo acessível a todas as pessoas."],
      ["Direitos culturais", "Direito de acessar, participar e produzir cultura."],
      ["Cota de tela", "Obrigação de exibir uma quantidade mínima de filmes nacionais."],
    ],
    [
      ["Um desvio do tema de 2019 seria escrever apenas sobre:", ["a falta de salas em cidades pequenas", "a história do cinema mundial e sua importância, sem discutir o acesso", "o preço dos ingressos", "a acessibilidade para pessoas com deficiência", "o cinema itinerante"], 1, "O foco é a democratização do acesso."],
      ["O artigo 215 da Constituição garante:", ["o direito ao voto", "o pleno exercício dos direitos culturais", "o direito à moradia", "o serviço militar", "a liberdade religiosa"], 1, "Base legal do tema."],
      ["Um argumento sobre a exclusão do acesso ao cinema é:", ["há salas em todos os municípios", "as salas se concentram em shoppings de bairros ricos", "os ingressos são gratuitos", "só existem filmes nacionais", "o cinema é obrigatório"], 1, "Concentração geográfica."],
      ["Uma proposta adequada ao tema é:", ["fechar cinemas de rua", "criar sessões itinerantes gratuitas e cineclubes nas escolas", "aumentar o preço dos ingressos", "proibir filmes nacionais", "exibir só filmes estrangeiros"], 1, "Amplia o acesso."],
      ["A crítica à padronização da cultura e ao domínio de grandes produções vem de:", ["Adorno e Horkheimer", "Aristóteles", "Darwin", "Kant", "Montesquieu"], 0, "Indústria cultural."],
    ],
    [
      ["Por que o acesso ao cinema no Brasil não é democrático?", "Porque muitas cidades não têm salas de cinema, as salas se concentram em shoppings de bairros ricos, os ingressos são caros e há pouca acessibilidade para pessoas com deficiência."],
    ],
    essay("Democratização do acesso ao cinema no Brasil"),
  ),
  aula(
    "Tema ENEM 2018: controle de dados na internet",
    `## O tema

Em 2018 o ENEM pediu: **"Manipulação do comportamento do usuário pelo controle de dados na internet"**.

## Entendendo o recorte

- **Controle de dados:** empresas coletam informações sobre o que pesquisamos, curtimos, compramos e onde estamos.
- **Manipulação do comportamento:** esses dados são usados por **algoritmos** para direcionar o que vemos e influenciar o que **compramos**, **pensamos** e até em quem **votamos**.
- Não basta falar de "internet" ou "fake news" em geral: é preciso ligar **dados → algoritmo → manipulação**.

## Repertório útil

- **Bolhas (filtros-bolha)**, conceito de **Eli Pariser**: o algoritmo mostra só o que confirma nossas opiniões.
- Escândalo **Cambridge Analytica** (2018): dados de milhões de usuários do Facebook usados para influenciar eleições.
- Documentário **"O Dilema das Redes"** (2020).
- **Zygmunt Bauman:** modernidade líquida e o indivíduo como consumidor.
- **George Orwell, *1984*:** vigilância constante ("O Grande Irmão está de olho em você").
- **LGPD** (Lei 13.709/2018): Lei Geral de Proteção de Dados.
- **Marco Civil da Internet** (2014).

## Duas linhas de argumento

1. **Manipulação do consumo:** a publicidade direcionada explora desejos e fragilidades, estimulando o **consumismo** e o endividamento.
2. **Manipulação de opiniões e bolhas:** os algoritmos criam bolhas que **polarizam** a sociedade e facilitam a desinformação, ameaçando a democracia.

Muitos usuários aceitam os **termos de uso** sem ler e não sabem como seus dados são usados — falta **educação digital**.

## Proposta de intervenção (modelo)

A **Autoridade Nacional de Proteção de Dados (ANPD)** deve **fiscalizar** o cumprimento da LGPD e **multar** empresas que usem dados sem consentimento claro; **além disso**, o **MEC** deve incluir a **educação midiática e digital** no currículo, **por meio de** oficinas sobre algoritmos e privacidade, **a fim de** formar usuários críticos e conscientes.

## Resumindo

Ligue coleta de dados, algoritmos e manipulação. Use Cambridge Analytica, bolhas, 1984 e a LGPD. Argumente com consumo e polarização. Proponha fiscalização da LGPD e educação digital.`,
    [
      "Ligue dados → algoritmos → manipulação do comportamento.",
      "Repertório: Cambridge Analytica, bolhas, 1984, LGPD.",
      "Argumentos: consumismo direcionado e polarização.",
      "Proposta: fiscalização da ANPD e educação digital nas escolas.",
    ],
    [
      ["Filtro-bolha", "Isolamento em que o algoritmo só mostra conteúdos que confirmam nossas ideias."],
      ["LGPD", "Lei Geral de Proteção de Dados Pessoais (2018)."],
      ["Publicidade direcionada", "Anúncio escolhido com base nos dados e no perfil do usuário."],
    ],
    [
      ["O recorte do tema de 2018 exige relacionar:", ["internet e lazer", "coleta de dados, algoritmos e manipulação do comportamento", "celulares e saúde ocular", "redes sociais e amizade", "jogos e violência"], 1, "Cadeia central do tema."],
      ["O escândalo Cambridge Analytica envolveu:", ["vazamento de senhas bancárias", "uso de dados do Facebook para influenciar eleições", "venda de celulares falsificados", "um vírus de computador", "censura governamental"], 1, "Repertório clássico."],
      ["A obra \"1984\", de Orwell, é repertório porque trata de:", ["viagens espaciais", "vigilância constante sobre as pessoas", "receitas", "futebol", "amor romântico"], 1, "O Grande Irmão."],
      ["A lei brasileira que regula o uso de dados pessoais é a:", ["Lei Maria da Penha", "LGPD", "Lei Áurea", "CLT", "Lei de Cotas"], 1, "Lei 13.709/2018."],
      ["Uma proposta de intervenção coerente com o tema é:", ["proibir a internet", "fiscalizar a LGPD e promover educação digital", "acabar com as escolas", "liberar a venda de dados", "não fazer nada"], 1, "Regulação + conscientização."],
    ],
    [
      ["Explique como os algoritmos podem manipular o comportamento dos usuários.", "Eles usam os dados coletados sobre gostos e hábitos para escolher o que cada pessoa vê, direcionando anúncios que estimulam o consumo e criando bolhas de opinião que reforçam crenças e aumentam a polarização."],
    ],
    essay("Manipulação do comportamento do usuário pelo controle de dados na internet"),
  ),
  aula(
    "Tema ENEM 2017: formação educacional de surdos",
    `## O tema

Em 2017 o ENEM pediu: **"Desafios para a formação educacional de surdos no Brasil"**.

## Entendendo o recorte

- **Formação educacional:** acesso à escola, permanência, aprendizagem, ensino superior.
- **Surdos:** pessoas com perda auditiva, muitas das quais têm a **Libras** como primeira língua.
- **Desafios:** o que dificulta essa formação.

## Repertório útil

- **Lei 10.436/2002:** reconhece a **Libras** (Língua Brasileira de Sinais) como meio legal de comunicação e expressão.
- **Decreto 5.626/2005:** regulamenta a lei e prevê a formação de professores e intérpretes e a **educação bilíngue** (Libras como primeira língua e português escrito como segunda).
- **Lei Brasileira de Inclusão** (Lei 13.146/2015): Estatuto da Pessoa com Deficiência.
- **Constituição:** educação como direito de todos.
- **Censo do IBGE:** milhões de brasileiros com algum grau de deficiência auditiva.
- **Paulo Freire:** educação como prática da liberdade (não há liberdade sem comunicação).
- **Capacitismo:** preconceito contra pessoas com deficiência.

## Duas linhas de argumento

1. **Falta de profissionais e de escolas bilíngues:** há poucos professores fluentes em Libras e poucos intérpretes; muitos surdos ficam em salas onde não entendem as aulas, o que leva à evasão.
2. **Preconceito e falta de difusão da Libras:** a sociedade desconhece a Libras e trata a surdez como incapacidade, isolando os surdos e limitando suas oportunidades.

## Proposta de intervenção (modelo)

O **Ministério da Educação** deve **ampliar a formação de professores bilíngues e a contratação de intérpretes de Libras** nas escolas públicas, **por meio de** cursos gratuitos e concursos específicos, **a fim de** garantir o aprendizado dos estudantes surdos. **Além disso**, deve incluir o ensino básico de Libras para **todos** os alunos, promovendo a inclusão.

## Erros comuns

- Usar termos como "surdo-mudo" (incorreto: surdos podem falar; o termo é estigmatizante).
- Tratar a Libras como "mímica": ela é uma **língua** completa, com gramática própria.

## Resumindo

Mostre a falta de profissionais bilíngues e o preconceito. Use a Lei 10.436 e o Decreto 5.626. Proponha formação de professores, intérpretes e ensino de Libras para todos.`,
    [
      "Libras é uma língua oficial (Lei 10.436/2002), não mímica.",
      "Educação bilíngue: Libras como 1ª língua e português escrito como 2ª.",
      "Argumentos: falta de professores/intérpretes e preconceito.",
      "Proposta: formar professores bilíngues e ensinar Libras a todos.",
    ],
    [
      ["Libras", "Língua Brasileira de Sinais, língua com gramática própria."],
      ["Educação bilíngue", "Ensino com Libras como primeira língua e português escrito como segunda."],
      ["Capacitismo", "Preconceito contra pessoas com deficiência."],
    ],
    [
      ["A Libras foi reconhecida como meio legal de comunicação pela:", ["Lei Áurea", "Lei 10.436/2002", "Lei Maria da Penha", "LGPD", "CLT"], 1, "Marco legal."],
      ["Um termo inadequado, que deve ser evitado na redação, é:", ["pessoa surda", "surdo-mudo", "estudante surdo", "comunidade surda", "usuário de Libras"], 1, "Termo incorreto e estigmatizante."],
      ["A educação bilíngue para surdos propõe:", ["só português oral", "Libras como primeira língua e português escrito como segunda", "inglês e espanhol", "proibir a Libras", "só leitura labial"], 1, "Decreto 5.626/2005."],
      ["Um desafio para a formação educacional de surdos é:", ["o excesso de intérpretes", "a falta de professores fluentes em Libras e de intérpretes", "a Libras ser obrigatória para todos", "o excesso de escolas bilíngues", "a falta de alunos"], 1, "Escassez de profissionais."],
      ["Considerar a Libras uma \"mímica\" é um erro porque:", ["ela é uma língua completa, com gramática própria", "ela só tem gestos aleatórios", "ela é igual ao português", "ela não é usada no Brasil", "ela é escrita"], 0, "É uma língua."],
    ],
    [
      ["Cite dois desafios para a formação educacional de surdos no Brasil.", "A falta de professores bilíngues e de intérpretes de Libras nas escolas, que impede o aprendizado, e o preconceito e o desconhecimento da Libras pela sociedade, que isolam os surdos."],
    ],
    essay("Desafios para a formação educacional de surdos no Brasil"),
  ),
  aula(
    "Tema ENEM 2016: intolerância religiosa",
    `## O tema

Em 2016 o ENEM pediu: **"Caminhos para combater a intolerância religiosa no Brasil"**.

## Entendendo o recorte

- **Caminhos para combater:** o foco é também em **soluções** — a proposta precisa ser forte.
- **Intolerância religiosa:** discriminação, ofensa, agressão ou ataque contra pessoas, templos ou símbolos por causa da religião (ou da falta dela).

## Dados e contexto

- As **religiões de matriz africana** (Candomblé, Umbanda) são as principais vítimas: depredação de **terreiros**, agressões a praticantes, ofensas.
- Isso se liga ao **racismo** (fala-se em **racismo religioso**).
- O **Disque 100** registra denúncias que crescem ano a ano.

## Repertório útil

- **Constituição de 1988:** Estado **laico** e **liberdade de crença** (art. 5º, VI).
- **Lei 7.716/1989:** crime de discriminação por religião.
- **Dia Nacional de Combate à Intolerância Religiosa: 21 de janeiro**, em memória de **Mãe Gilda**, ialorixá baiana que morreu após ataques.
- **Voltaire**, *Tratado sobre a Tolerância*; **John Locke**, *Carta sobre a Tolerância*.
- **Declaração Universal dos Direitos Humanos**, art. 18 (liberdade de religião).
- **Etnocentrismo** e herança colonial que demonizou as religiões africanas.

## Duas linhas de argumento

1. **Herança histórica e racismo:** desde a colonização, as religiões africanas foram perseguidas e associadas ao "mal", visão que permanece no preconceito atual.
2. **Falta de educação para a diversidade e impunidade:** a escola pouco discute a pluralidade religiosa, e muitos casos não são denunciados ou punidos.

## Proposta de intervenção (modelo)

O **Ministério da Educação** deve incluir nos currículos o **estudo da diversidade religiosa** de forma **laica**, **por meio de** aulas e visitas a diferentes templos, **a fim de** formar cidadãos tolerantes. **Paralelamente**, as **Secretarias de Segurança** devem criar **delegacias especializadas** em crimes de intolerância, garantindo a punição dos agressores.

## Resumindo

Destaque o racismo religioso contra matrizes africanas. Use a Constituição (laicidade), Lei 7.716, Mãe Gilda e Voltaire. Proponha educação para a diversidade e delegacias especializadas.`,
    [
      "Religiões de matriz africana são as principais vítimas.",
      "Repertório: Estado laico, Lei 7.716, Mãe Gilda, Voltaire.",
      "Argumentos: herança colonial/racismo e falta de educação e punição.",
      "Proposta: ensino da diversidade religiosa + delegacias especializadas.",
    ],
    [
      ["Intolerância religiosa", "Discriminação ou violência contra pessoas por causa de sua religião ou da falta dela."],
      ["Racismo religioso", "Intolerância contra religiões de matriz africana ligada ao racismo."],
      ["Estado laico", "Estado sem religião oficial que garante a liberdade de crença."],
    ],
    [
      ["O tema de 2016 pede principalmente:", ["a história de cada religião", "caminhos para combater a intolerância religiosa", "qual religião é a correta", "a defesa de uma religião oficial", "o fim das religiões"], 1, "Foco em soluções."],
      ["O Dia Nacional de Combate à Intolerância Religiosa homenageia:", ["Zumbi dos Palmares", "Mãe Gilda", "Chico Xavier", "Padre Anchieta", "Irmã Dulce"], 1, "21 de janeiro."],
      ["O \"Tratado sobre a Tolerância\" é de:", ["Voltaire", "Maquiavel", "Marx", "Platão", "Hobbes"], 0, "Iluminismo."],
      ["Um argumento histórico para o tema é:", ["as religiões africanas sempre foram valorizadas", "desde a colonização, religiões africanas foram perseguidas e demonizadas", "não existe intolerância no Brasil", "o Brasil tem religião oficial", "a intolerância surgiu com a internet"], 1, "Herança colonial."],
      ["Uma proposta coerente com a laicidade do Estado é:", ["ensinar uma única religião nas escolas", "estudar a diversidade religiosa de forma laica", "proibir religiões minoritárias", "fechar terreiros", "criar religião oficial"], 1, "Respeita todas as crenças."],
    ],
    [
      ["Por que se fala em \"racismo religioso\" ao tratar da intolerância no Brasil?", "Porque as principais vítimas são as religiões de matriz africana, perseguidas desde a colonização por estarem ligadas à população negra; o preconceito religioso se mistura ao racismo."],
    ],
    essay("Caminhos para combater a intolerância religiosa no Brasil"),
  ),
  aula(
    "Tema ENEM 2015: violência contra a mulher",
    `## O tema

Em 2015 o ENEM pediu: **"A persistência da violência contra a mulher na sociedade brasileira"**.

## Entendendo o recorte

- **Persistência:** o foco é explicar **por que a violência continua**, mesmo com leis e avanços.
- **Violência contra a mulher:** física, psicológica, sexual, patrimonial e moral (as cinco formas da Lei Maria da Penha).

## Dados e contexto

- O Brasil tem índices altíssimos de **feminicídio** (assassinato de mulheres por serem mulheres) e de violência doméstica.
- A maior parte das agressões ocorre **dentro de casa**, praticada por parceiros ou ex-parceiros.
- **Mulheres negras** são as maiores vítimas.

## Repertório útil

- **Lei Maria da Penha (11.340/2006):** cria mecanismos contra a violência doméstica e familiar; homenageia **Maria da Penha Maia Fernandes**, que ficou paraplégica após tentativa de homicídio pelo marido.
- **Lei do Feminicídio (13.104/2015).**
- **Simone de Beauvoir:** "Ninguém nasce mulher, torna-se mulher."
- **Pierre Bourdieu:** **dominação masculina** e violência simbólica.
- **Patriarcado:** organização social que coloca o homem como autoridade.
- **Ligue 180** (Central de Atendimento à Mulher).
- Ditado "**em briga de marido e mulher, ninguém mete a colher**" como exemplo de naturalização.

## Duas linhas de argumento

1. **Cultura patriarcal e machista:** a mulher ainda é vista como propriedade do homem; a violência é naturalizada em ditados, piadas e na mídia.
2. **Falhas na aplicação das leis:** poucas **Delegacias da Mulher** (muitas fecham à noite e nos fins de semana), medidas protetivas descumpridas e dependência financeira que dificulta a denúncia.

## Proposta de intervenção (modelo)

Os **governos estaduais** devem **ampliar as Delegacias da Mulher com funcionamento 24 horas** e casas-abrigo, **por meio de** verbas do Fundo Nacional de Segurança Pública, **a fim de** proteger as vítimas e garantir a aplicação da Lei Maria da Penha. **Além disso**, as **escolas** devem promover debates sobre igualdade de gênero desde o ensino fundamental.

## Resumindo

Explique por que a violência persiste: cultura patriarcal e falhas na aplicação das leis. Use a Lei Maria da Penha, o feminicídio, Beauvoir e Bourdieu. Proponha delegacias 24h e educação para a igualdade.`,
    [
      "Foco: por que a violência persiste apesar das leis.",
      "Repertório: Lei Maria da Penha, feminicídio, Beauvoir, Bourdieu.",
      "Argumentos: cultura patriarcal e falhas na aplicação das leis.",
      "Proposta: delegacias 24h, abrigos e educação para a igualdade.",
    ],
    [
      ["Feminicídio", "Assassinato de uma mulher motivado por ela ser mulher."],
      ["Patriarcado", "Organização social em que o homem tem autoridade sobre a mulher."],
      ["Medida protetiva", "Ordem judicial que afasta o agressor da vítima."],
    ],
    [
      ["A palavra \"persistência\" no tema de 2015 indica que o texto deve:", ["contar a história de uma vítima", "explicar por que a violência continua existindo", "negar a violência", "falar só das leis", "tratar de violência urbana em geral"], 1, "Recorte central."],
      ["A Lei Maria da Penha trata de:", ["violência doméstica e familiar contra a mulher", "crimes ambientais", "trânsito", "direitos do consumidor", "imposto de renda"], 0, "Lei 11.340/2006."],
      ["O ditado \"em briga de marido e mulher, ninguém mete a colher\" serve como exemplo de:", ["solução para a violência", "naturalização da violência doméstica", "lei federal", "direito humano", "política pública"], 1, "Cultura que silencia."],
      ["Um argumento sobre falhas na aplicação da lei é:", ["há delegacias da mulher abertas 24h em todo o país", "muitas delegacias da mulher fecham à noite e nos fins de semana", "não existe lei sobre o tema", "as vítimas não sofrem", "as leis são perfeitas"], 1, "Estrutura insuficiente."],
      ["O conceito de \"dominação masculina\" é de:", ["Pierre Bourdieu", "Aristóteles", "Newton", "Adam Smith", "Darwin"], 0, "Sociólogo francês."],
    ],
    [
      ["Por que a violência contra a mulher persiste no Brasil, mesmo com a Lei Maria da Penha?", "Porque a cultura patriarcal e machista ainda naturaliza a violência e vê a mulher como propriedade, e porque há falhas na aplicação da lei, como poucas delegacias especializadas, medidas protetivas descumpridas e dependência financeira das vítimas."],
    ],
    essay("A persistência da violência contra a mulher na sociedade brasileira"),
  ),
];
