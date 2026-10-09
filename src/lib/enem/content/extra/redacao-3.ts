import { essayInstructions } from "../redacao";
import { aula } from "./build";

const essay = (theme: string) => ({ theme, instructions: essayInstructions(theme) });

/** Redação, lote 3: o que zera a nota, técnicas de argumentação e mais temas prováveis com redação para escrever. */
export const REDACAO_3 = [
  aula(
    "O que zera a redação (e como evitar)",
    `## Nota zero: as situações

A redação do ENEM recebe **nota zero** quando o texto:

1. **Foge totalmente ao tema** proposto.
2. **Não obedece ao tipo dissertativo-argumentativo** (ex.: escreve um poema, uma narrativa ou uma carta).
3. Tem **até 7 linhas** escritas (texto insuficiente).
4. Tem **parte deliberadamente desconectada** do tema (ex.: receita, hino, letra de música, recados).
5. Apresenta **impropérios**, desenhos ou outras formas de anulação.
6. Está em **branco** ou com **assinatura**/nome em local indevido (identificação).
7. Está escrito **predominantemente em língua estrangeira**.
8. É **cópia** dos textos motivadores (as linhas copiadas são desconsideradas; se sobrar pouco, pode zerar).

## Desrespeito aos direitos humanos

Hoje, desrespeitar os direitos humanos **não zera** a redação inteira, mas faz a **Competência 5** (proposta de intervenção) receber **nota zero**. Exemplos a evitar: propor **pena de morte**, **tortura**, **linchamento**, "fazer justiça com as próprias mãos", **castração química**, censura, discriminação de grupos.

## Fuga x tangenciamento

- **Fuga total:** falar de outro assunto → **zero**.
- **Tangenciamento:** falar do **assunto geral**, mas sem o **recorte** do tema (ex.: tema sobre "invisibilidade do trabalho de cuidado feito pela mulher" e o texto fala só de "machismo" em geral) → nota **muito baixa** nas Competências 2, 3 e 5.

## Como evitar

- **Leia o tema várias vezes** e destaque as **palavras-chave** e o **recorte**.
- Retome as palavras-chave na **introdução**, nos **argumentos** e na **conclusão**.
- Escreva **no mínimo** cerca de **20 linhas** (até 30).
- **Não copie** os textos motivadores: use-os só como inspiração.
- **Não assine** nem escreva seu nome.
- Faça um **rascunho**, mas passe a limpo com **caneta preta**.
- Proponha intervenções **respeitosas** e **viáveis**.

## Outras perdas graves (sem zerar)

- Não apresentar **proposta de intervenção** → Competência 5 baixa.
- Texto sem **tese** clara.
- Uso de **gírias** e linguagem informal.
- **Repertório** genérico ou não relacionado ao tema ("de bolso" mal usado).

## Resumindo

Zera: fuga ao tema, texto não dissertativo, até 7 linhas, parte desconectada, identificação, cópia dos motivadores. Desrespeitar direitos humanos zera a Competência 5. Tangenciar o tema derruba a nota. Leia o recorte e retome as palavras-chave.`,
    [
      "Zera: fuga ao tema, tipo textual errado, até 7 linhas, parte desconectada.",
      "Identificação (nome/assinatura) também zera.",
      "Desrespeitar direitos humanos zera a Competência 5.",
      "Tangenciar o tema não zera, mas derruba a nota.",
    ],
    [
      ["Fuga ao tema", "Escrever sobre outro assunto, o que zera a redação."],
      ["Tangenciamento", "Abordar só o assunto geral, sem o recorte do tema."],
      ["Texto insuficiente", "Redação com até 7 linhas, que recebe zero."],
    ],
    [
      ["Recebe nota zero a redação que:", ["tem 25 linhas", "foge totalmente ao tema", "usa dois repertórios", "tem quatro parágrafos", "cita a Constituição"], 1, "Fuga total."],
      ["Uma redação com apenas 6 linhas:", ["recebe nota máxima", "é considerada texto insuficiente e zera", "perde só 40 pontos", "é corrigida normalmente", "ganha bônus"], 1, "Até 7 linhas."],
      ["Propor pena de morte para criminosos na redação faz com que:", ["a redação inteira zere", "a Competência 5 receba zero", "a nota aumente", "nada aconteça", "a Competência 1 zere"], 1, "Desrespeito aos direitos humanos."],
      ["Escrever uma narrativa em vez de um texto dissertativo-argumentativo:", ["é aceito", "zera a redação", "ganha pontos extras", "só perde na Competência 1", "não tem consequência"], 1, "Tipo textual errado."],
      ["Tangenciar o tema significa:", ["escrever sobre outro assunto totalmente", "abordar o assunto geral sem o recorte específico", "usar muitos repertórios", "escrever mais de 30 linhas", "assinar a redação"], 1, "Perde nota sem zerar."],
    ],
    [
      ["Explique a diferença entre fugir do tema e tangenciar o tema na redação do ENEM.", "Fugir do tema é escrever sobre outro assunto, o que zera a redação; tangenciar é tratar apenas do assunto geral sem abordar o recorte específico pedido, o que não zera, mas reduz muito a nota."],
    ],
  ),
  aula(
    "Usando dados, estatísticas e exemplos na argumentação",
    `## Argumentos fortes precisam de provas

Na redação, cada **argumento** precisa ser **desenvolvido** com explicações e **evidências**. Dados, estatísticas e exemplos dão **credibilidade**.

## Tipos de evidências

- **Dados estatísticos:** de fontes confiáveis (**IBGE**, **IPEA**, **OMS**, **ONU**, **Fiocruz**, **Atlas da Violência**, **INEP**). Ex.: "Segundo o IBGE, as mulheres dedicam quase o dobro de horas por semana aos afazeres domésticos."
- **Leis e documentos:** Constituição, ECA, Estatuto da Pessoa Idosa, Lei Maria da Penha, DUDH.
- **Fatos históricos:** abolição sem integração, ditadura, Revolta da Vacina.
- **Exemplos concretos:** casos conhecidos, situações do cotidiano.
- **Citações de autoridades:** pensadores, cientistas, especialistas.
- **Obras culturais:** livros, filmes, músicas (repertório sociocultural).

## Cuidados com dados

- **Não invente números.** Se não lembrar o dado exato, use expressões **gerais e seguras**: "pesquisas do IBGE indicam que **grande parte** da população...", "segundo a OMS, o Brasil está **entre os países** com mais casos de ansiedade".
- Cite a **fonte**: dado sem fonte perde força.
- **Explique** o dado: não basta jogá-lo; mostre **o que ele prova** sobre sua tese.

## Estrutura de um parágrafo de desenvolvimento

1. **Tópico frasal:** a ideia principal do parágrafo (o argumento).
2. **Fundamentação:** explicação + evidência (dado, lei, fato, autor).
3. **Análise:** relação entre a evidência e o tema ("isso mostra que...").
4. **Fechamento:** retomada da tese ou ligação com o próximo parágrafo.

## Exemplo

"Em primeiro lugar, a falta de saneamento compromete a saúde da população mais pobre. **De acordo com o Instituto Trata Brasil, quase metade dos brasileiros não tem acesso à coleta de esgoto**, o que favorece doenças como diarreias e hepatite A. **Desse modo**, crianças de periferias faltam mais às aulas, o que perpetua a desigualdade social e educacional."

## Argumento x repertório

- **Repertório** é a **informação** (dado, autor, fato).
- **Argumento** é o **raciocínio** que usa essa informação para defender a tese.
- Um repertório "solto", sem relação com o tema, **não** garante nota alta.

## Resumindo

Use dados de fontes confiáveis (IBGE, OMS), leis, fatos e exemplos. Não invente números: prefira expressões gerais seguras. Explique o que a evidência prova. Estruture o parágrafo: tópico, fundamentação, análise e fechamento.`,
    [
      "Fontes confiáveis: IBGE, IPEA, OMS, ONU, INEP.",
      "Não invente números; use expressões gerais seguras.",
      "Explique o que a evidência prova sobre a tese.",
      "Parágrafo: tópico frasal, fundamentação, análise e fechamento.",
    ],
    [
      ["Tópico frasal", "Frase que apresenta a ideia principal do parágrafo."],
      ["Evidência", "Dado, fato ou exemplo que comprova um argumento."],
      ["Repertório produtivo", "Informação usada de forma pertinente e ligada à discussão."],
    ],
    [
      ["Uma fonte confiável para dados sobre a população brasileira é o:", ["IBGE", "perfil de uma rede social", "um meme", "uma corrente de WhatsApp", "um anúncio"], 0, "Instituto oficial."],
      ["Se você não lembrar o número exato de um dado, o ideal é:", ["inventar um número", "usar uma expressão geral segura, citando a fonte", "não argumentar", "copiar o texto motivador", "deixar em branco"], 1, "Evita informações falsas."],
      ["No parágrafo de desenvolvimento, a análise serve para:", ["repetir o tema", "mostrar como a evidência sustenta a tese", "apresentar a proposta", "concluir o texto", "citar o título"], 1, "Ligação com o argumento."],
      ["A diferença entre repertório e argumento é que:", ["são iguais", "repertório é a informação; argumento é o raciocínio que a usa", "argumento é sempre um dado", "repertório é a conclusão", "argumento é a introdução"], 1, "Conceitos distintos."],
      ["Um repertório sem relação com o tema:", ["garante nota mil", "não contribui para a argumentação e pode reduzir a nota", "é obrigatório", "zera a redação", "vale mais que dados"], 1, "Precisa ser pertinente."],
    ],
    [
      ["Por que não basta citar um dado estatístico na redação, sem explicá-lo?", "Porque o dado sozinho não argumenta; é preciso explicar o que ele revela sobre o problema e como comprova a tese, relacionando a evidência ao tema para mostrar raciocínio próprio."],
    ],
  ),
  aula(
    "Tema provável: exclusão digital",
    `## O tema

Tema possível: **"Desafios para a inclusão digital da população brasileira"**.

## Contexto

- A internet tornou-se essencial para **estudar**, **trabalhar**, acessar **serviços públicos** (gov.br, benefícios), **bancos** e **saúde** (telemedicina).
- Mas milhões de brasileiros têm acesso **precário** (só pelo celular, com pacote de dados limitado) ou **nenhum**.
- A **pandemia** escancarou o problema: muitos estudantes não conseguiram acompanhar o **ensino remoto**.
- Exclusão digital não é só falta de **conexão**: inclui falta de **equipamentos** e de **habilidades** (letramento digital), sobretudo entre **idosos**, população **rural** e **pobre**.

## Repertório útil

- **Pesquisa TIC Domicílios** (Cetic.br): mostra desigualdades de acesso por renda, região e área urbana/rural.
- **Marco Civil da Internet** (2014): reconhece o acesso à internet como **essencial ao exercício da cidadania**.
- **ONU:** considera o acesso à internet relevante para os direitos humanos.
- **Manuel Castells:** **sociedade em rede**.
- **Zygmunt Bauman:** modernidade líquida.
- **Paulo Freire:** educação como prática da liberdade (a exclusão digital limita o acesso ao conhecimento).

## Duas linhas de argumento

1. **Desigualdade socioeconômica e regional:** a infraestrutura de internet se concentra em áreas urbanas e ricas; famílias pobres não podem pagar planos e aparelhos, o que aprofunda as desigualdades na educação e no trabalho.
2. **Falta de letramento digital:** mesmo com acesso, muitas pessoas (especialmente idosos) não sabem usar serviços online com segurança, ficando expostas a **golpes** e excluídas de direitos.

## Proposta de intervenção (modelo)

O **Ministério das Comunicações**, em parceria com estados e municípios, deve **ampliar a conectividade gratuita** em escolas, praças e zonas rurais, **por meio de** investimentos públicos e metas para operadoras, **além de** oferecer, com escolas e centros comunitários, **cursos de letramento digital** para idosos e adultos, **a fim de** garantir o acesso pleno à cidadania no mundo digital.

## Resumindo

Mostre que a internet virou essencial e que a exclusão envolve conexão, equipamentos e habilidades. Use TIC Domicílios, Marco Civil e Castells. Argumente com desigualdade e falta de letramento. Proponha conectividade pública e cursos de letramento digital.`,
    [
      "Internet essencial para estudo, trabalho e serviços públicos.",
      "Exclusão digital: falta de conexão, aparelhos e habilidades.",
      "Repertório: TIC Domicílios, Marco Civil da Internet, Castells.",
      "Proposta: conectividade pública e letramento digital.",
    ],
    [
      ["Exclusão digital", "Falta de acesso à internet, a equipamentos ou às habilidades para usá-los."],
      ["Letramento digital", "Capacidade de usar as tecnologias digitais de forma crítica e segura."],
      ["Sociedade em rede", "Conceito de Castells para a sociedade organizada pelas redes de informação."],
    ],
    [
      ["A exclusão digital envolve:", ["só a falta de cabos de internet", "falta de conexão, de equipamentos e de habilidades", "excesso de redes sociais", "apenas idosos", "só a zona urbana"], 1, "Várias dimensões."],
      ["A lei brasileira que reconhece o acesso à internet como essencial à cidadania é o:", ["ECA", "Marco Civil da Internet", "Código Penal", "Estatuto da Cidade", "CLT"], 1, "Lei de 2014."],
      ["A pandemia evidenciou a exclusão digital porque:", ["todos tinham internet", "muitos estudantes não conseguiram acompanhar o ensino remoto", "as escolas ficaram abertas", "não houve aulas online", "os celulares acabaram"], 1, "Ensino remoto."],
      ["O conceito de \"sociedade em rede\" é de:", ["Manuel Castells", "Maquiavel", "Platão", "Durkheim", "Darwin"], 0, "Sociólogo espanhol."],
      ["Uma proposta adequada ao tema é:", ["proibir celulares", "ampliar a conectividade pública e oferecer cursos de letramento digital", "acabar com a internet gratuita", "taxar a internet nas escolas", "fechar centros comunitários"], 1, "Acesso + habilidades."],
    ],
    [
      ["Por que a exclusão digital aprofunda as desigualdades sociais no Brasil?", "Porque hoje estudo, trabalho, serviços públicos e bancos dependem da internet; quem não tem conexão, aparelho ou habilidade fica sem acesso a oportunidades e direitos, ampliando a distância em relação a quem tem."],
    ],
    essay("Desafios para a inclusão digital da população brasileira"),
  ),
  aula(
    "Tema provável: trabalho infantil",
    `## O tema

Tema possível: **"Caminhos para erradicar o trabalho infantil no Brasil"**.

## Contexto

- **Trabalho infantil** é toda forma de trabalho realizado por crianças e adolescentes **abaixo da idade mínima** permitida.
- No Brasil: proibido para **menores de 16 anos**, exceto como **aprendiz** a partir dos **14**. Trabalhos **perigosos, insalubres e noturnos** são proibidos para **menores de 18**.
- Ainda há **milhões** de crianças e adolescentes trabalhando, sobretudo em **agricultura**, **trabalho doméstico**, comércio informal, **lixões** e até no tráfico.
- Atinge principalmente crianças **pobres** e **negras**.

## Consequências

- **Evasão escolar** e baixo desempenho.
- Danos à **saúde** física e mental, acidentes.
- **Ciclo da pobreza**: sem estudo, o adulto terá empregos piores e os filhos tenderão a trabalhar cedo.

## Repertório útil

- **Constituição (art. 7º, XXXIII)** e **ECA (1990):** proteção integral e prioridade absoluta.
- **OIT** (Organização Internacional do Trabalho): Convenções 138 e 182 (piores formas de trabalho infantil).
- **12 de junho:** Dia Mundial contra o Trabalho Infantil.
- **Programa de Erradicação do Trabalho Infantil (PETI)** e **Bolsa Família** (condicionado à frequência escolar).
- Ideia equivocada de que "**trabalho infantil forma o caráter**" ("é melhor trabalhar do que estar na rua").
- **Charles Dickens** (*Oliver Twist*) e a Revolução Industrial.

## Duas linhas de argumento

1. **Pobreza e desigualdade:** famílias em situação de vulnerabilidade dependem da renda das crianças para sobreviver, perpetuando o ciclo da pobreza.
2. **Naturalização cultural:** a ideia de que trabalhar cedo "dignifica" faz a sociedade tolerar a exploração, especialmente no trabalho doméstico e rural, menos visível e menos fiscalizado.

## Proposta de intervenção (modelo)

O **Ministério do Trabalho**, em parceria com os **Conselhos Tutelares**, deve **intensificar a fiscalização**, especialmente no campo e no trabalho doméstico, **além de** o **Governo Federal** ampliar programas de **transferência de renda** condicionados à frequência escolar e a **educação em tempo integral**, **a fim de** romper o ciclo da pobreza e garantir o direito à infância.

## Resumindo

Defina trabalho infantil e a idade mínima (16, aprendiz aos 14). Use ECA, OIT e o 12 de junho. Argumente com pobreza e naturalização cultural. Proponha fiscalização, transferência de renda e escola integral.`,
    [
      "Proibido para menores de 16 (aprendiz a partir dos 14).",
      "Atinge sobretudo crianças pobres e negras; causa evasão escolar.",
      "Repertório: ECA, OIT, 12 de junho, PETI.",
      "Proposta: fiscalização, renda condicionada à escola e tempo integral.",
    ],
    [
      ["Trabalho infantil", "Trabalho de crianças e adolescentes abaixo da idade mínima permitida."],
      ["Jovem aprendiz", "Adolescente a partir de 14 anos em programa de aprendizagem profissional."],
      ["Ciclo da pobreza", "Situação em que a pobreza se reproduz entre gerações."],
    ],
    [
      ["No Brasil, o trabalho é proibido para menores de:", ["12 anos", "14 anos, sem exceções", "16 anos, exceto como aprendiz a partir dos 14", "18 anos em qualquer caso", "10 anos"], 2, "Constituição."],
      ["O Dia Mundial contra o Trabalho Infantil é:", ["1º de maio", "12 de junho", "20 de novembro", "8 de março", "12 de outubro"], 1, "Dica: OIT."],
      ["Uma consequência do trabalho infantil é:", ["melhor desempenho escolar", "evasão escolar e perpetuação da pobreza", "aumento da renda futura", "mais lazer", "nenhuma"], 1, "Ciclo da pobreza."],
      ["A frase \"é melhor trabalhar do que ficar na rua\" revela:", ["uma lei", "a naturalização do trabalho infantil", "um dado estatístico", "uma proposta de intervenção", "um direito"], 1, "Argumento cultural."],
      ["Uma medida que combate o trabalho infantil é:", ["reduzir a fiscalização", "transferência de renda condicionada à frequência escolar", "fechar escolas", "baixar a idade mínima", "proibir conselhos tutelares"], 1, "Ataca a causa econômica."],
    ],
    [
      ["Explique como o trabalho infantil contribui para o ciclo da pobreza.", "A criança que trabalha tende a abandonar ou ter baixo desempenho na escola; adulta, consegue empregos piores e mal pagos, e seus filhos, por necessidade, também tendem a trabalhar cedo, repetindo a pobreza entre gerações."],
    ],
    essay("Caminhos para erradicar o trabalho infantil no Brasil"),
  ),
  aula(
    "Tema provável: formação de leitores no Brasil",
    `## O tema

Tema possível: **"Desafios para a formação de leitores no Brasil"**.

## Contexto

- A pesquisa **Retratos da Leitura no Brasil** mostra que grande parte dos brasileiros **não leu** nenhum livro (inteiro ou em partes) nos meses anteriores à pesquisa, e o número de leitores tem **caído**.
- O **analfabetismo funcional** atinge parcela significativa dos adultos (ler sem compreender bem).
- Muitos municípios não têm **bibliotecas públicas** ou **livrarias**; o livro é **caro** para muitas famílias.
- **Telas** e redes sociais competem pela atenção com textos curtos e rápidos.

## Repertório útil

- **Antonio Candido**, "**O direito à literatura**": a literatura é um **direito humano**, pois humaniza e organiza nossa visão do mundo.
- **Monteiro Lobato:** "Um país se faz com homens e livros."
- **Paulo Freire:** "A leitura do mundo precede a leitura da palavra."
- **Carolina Maria de Jesus**, leitora e escritora que superou a exclusão.
- **Lei do Livro** (2003) e **Política Nacional de Leitura e Escrita** (2018).
- **Bibliotecas comunitárias** e **saraus** nas periferias (Cooperifa).
- **Fahrenheit 451** (Ray Bradbury): uma sociedade que queima livros.

## Duas linhas de argumento

1. **Desigualdade de acesso:** livros caros, poucas bibliotecas e famílias sem hábito de leitura (por baixa escolaridade) dificultam o contato das crianças com os livros.
2. **Ensino e cultura digital:** a escola muitas vezes trata a leitura como **obrigação** (só para provas), sem estimular o prazer; além disso, a cultura das telas privilegia textos curtos e fragmentados.

## Proposta de intervenção (modelo)

O **Ministério da Educação**, com as **secretarias municipais**, deve **ampliar e modernizar as bibliotecas escolares e comunitárias**, com acervo diversificado e mediadores de leitura, **por meio de** verbas da Política Nacional de Leitura, **além de** promover **clubes de leitura** e saraus nas escolas, **a fim de** estimular o prazer de ler e formar leitores críticos.

## Resumindo

Mostre a queda no número de leitores e o analfabetismo funcional. Use Antonio Candido, Lobato e Freire. Argumente com desigualdade de acesso e ensino desestimulante. Proponha bibliotecas com mediadores, clubes de leitura e saraus.`,
    [
      "Retratos da Leitura: muitos brasileiros não leem livros.",
      "Antonio Candido: a literatura é um direito humano.",
      "Argumentos: acesso desigual e leitura como obrigação escolar.",
      "Proposta: bibliotecas com mediadores e clubes de leitura.",
    ],
    [
      ["Analfabetismo funcional", "Saber ler e escrever, mas sem compreender bem textos."],
      ["Mediador de leitura", "Pessoa que aproxima leitores dos livros e estimula a leitura."],
      ["Biblioteca comunitária", "Biblioteca criada e mantida pela própria comunidade."],
    ],
    [
      ["O ensaio \"O direito à literatura\" é de:", ["Antonio Candido", "Machado de Assis", "Gilberto Freyre", "Darcy Ribeiro", "Monteiro Lobato"], 0, "Literatura como direito."],
      ["\"Um país se faz com homens e livros\" é atribuída a:", ["Monteiro Lobato", "Paulo Freire", "Vargas", "Rui Barbosa", "Castro Alves"], 0, "Frase famosa."],
      ["Um obstáculo à formação de leitores é:", ["o excesso de bibliotecas", "o preço dos livros e a falta de bibliotecas", "a leitura por prazer", "os saraus", "os mediadores de leitura"], 1, "Desigualdade de acesso."],
      ["O analfabetismo funcional significa:", ["não saber ler nada", "ler sem compreender bem o texto", "ler muito rápido", "ler apenas em inglês", "ser escritor"], 1, "Compreensão limitada."],
      ["Uma proposta coerente com o tema é:", ["fechar bibliotecas", "criar clubes de leitura e ampliar bibliotecas com mediadores", "proibir livros digitais", "acabar com a literatura na escola", "aumentar o preço dos livros"], 1, "Estímulo à leitura."],
    ],
    [
      ["Por que a escola pode, às vezes, afastar os alunos da leitura?", "Porque muitas vezes trata a leitura apenas como obrigação para provas, com livros impostos e sem diálogo, sem estimular o prazer de ler e sem relacionar os textos à realidade e aos interesses dos estudantes."],
    ],
    essay("Desafios para a formação de leitores no Brasil"),
  ),
  aula(
    "Tema provável: mobilidade urbana",
    `## O tema

Tema possível: **"Desafios para a mobilidade urbana nas grandes cidades brasileiras"**.

## Contexto

- As cidades brasileiras cresceram de forma **rápida e desordenada**, com trabalhadores morando em **periferias distantes** dos empregos.
- Modelo centrado no **automóvel**: congestionamentos, poluição, acidentes.
- **Transporte público** muitas vezes caro, lotado, demorado e com pouca integração.
- Milhões passam **horas por dia** no deslocamento (**migração pendular**), perdendo tempo de descanso, estudo e lazer.
- Pessoas com **deficiência** e idosos enfrentam falta de **acessibilidade** (calçadas ruins, ônibus sem elevador).

## Repertório útil

- **Constituição (art. 6º):** o **transporte** é **direito social** (incluído em 2015).
- **Política Nacional de Mobilidade Urbana (Lei 12.587/2012):** prioridade ao transporte **coletivo** e aos meios **não motorizados** (a pé, bicicleta).
- **Estatuto da Cidade** (2001) e o **plano diretor**.
- **Henri Lefebvre:** **direito à cidade**.
- **Jornadas de Junho de 2013:** protestos que começaram contra o **aumento das passagens**.
- Exemplos: BRT de **Curitiba**, ciclovias, metrô.

## Duas linhas de argumento

1. **Segregação socioespacial:** os mais pobres moram longe e dependem de um transporte público caro e precário, o que limita o acesso a emprego, educação e lazer.
2. **Prioridade ao carro:** investimentos em viadutos e avenidas favorecem o transporte individual, aumentando congestionamentos, poluição e acidentes, em vez de priorizar o coletivo.

## Proposta de intervenção (modelo)

As **prefeituras**, com apoio do **Governo Federal**, devem **priorizar investimentos em transporte coletivo** (corredores de ônibus, BRT, metrô) e em **ciclovias e calçadas acessíveis**, **por meio de** recursos do Programa de Mobilidade e integração tarifária, **a fim de** reduzir o tempo de deslocamento e garantir o direito à cidade.

## Resumindo

Mostre a urbanização desordenada e o modelo centrado no carro. Use a Constituição (transporte como direito social), a Lei de Mobilidade e Lefebvre. Argumente com segregação e prioridade ao carro. Proponha transporte coletivo, ciclovias e integração tarifária.`,
    [
      "Periferias distantes e modelo centrado no carro.",
      "Transporte é direito social (Constituição, art. 6º).",
      "Lei de Mobilidade (2012): prioridade ao coletivo e não motorizado.",
      "Proposta: BRT, metrô, ciclovias e integração tarifária.",
    ],
    [
      ["Mobilidade urbana", "Condições de deslocamento das pessoas e cargas na cidade."],
      ["Migração pendular", "Deslocamento diário entre a casa e o trabalho em outra área ou cidade."],
      ["Integração tarifária", "Pagar uma só passagem para usar mais de um meio de transporte."],
    ],
    [
      ["A Política Nacional de Mobilidade Urbana prioriza:", ["o carro particular", "o transporte coletivo e os meios não motorizados", "os aviões", "os caminhões", "os táxis"], 1, "Lei 12.587/2012."],
      ["O transporte foi incluído como direito social na Constituição em:", ["1988", "2015", "1964", "2001", "1934"], 1, "Emenda constitucional."],
      ["As Jornadas de Junho de 2013 começaram como protesto contra:", ["a Copa do Mundo apenas", "o aumento das passagens de ônibus", "a ditadura", "a reforma agrária", "o preço da gasolina"], 1, "Mobilidade urbana."],
      ["O conceito de \"direito à cidade\" é de:", ["Henri Lefebvre", "Weber", "Platão", "Adam Smith", "Montesquieu"], 0, "Filósofo francês."],
      ["Uma proposta coerente com o tema é:", ["construir mais viadutos para carros", "investir em corredores de ônibus, metrô e ciclovias", "aumentar as tarifas", "reduzir as linhas de ônibus", "proibir bicicletas"], 1, "Transporte coletivo."],
    ],
    [
      ["Explique como a segregação socioespacial se relaciona com os problemas de mobilidade urbana.", "Os mais pobres são empurrados para periferias distantes dos empregos e serviços e dependem de um transporte público caro e precário; assim, gastam horas e dinheiro nos deslocamentos, o que limita seu acesso a oportunidades."],
    ],
    essay("Desafios para a mobilidade urbana nas grandes cidades brasileiras"),
  ),
  aula(
    "Tema provável: apostas online e endividamento",
    `## O tema

Tema possível: **"Os impactos das apostas online na saúde financeira e mental dos brasileiros"**.

## Contexto

- As **apostas esportivas** e os **jogos de cassino online** ("bets") cresceram rapidamente no Brasil, com forte **publicidade** (patrocínio de times, influenciadores).
- A atividade foi **regulamentada** (Lei 14.790/2023), mas há muitas plataformas ilegais.
- Muitas pessoas, inclusive de **baixa renda**, gastam parte significativa do orçamento em apostas, às vezes até usando dinheiro de **benefícios sociais**.
- Associação com **endividamento**, **ansiedade**, **depressão** e **dependência** (ludopatia).

## Repertório útil

- **Ludopatia:** jogo patológico, reconhecido pela **OMS** como transtorno.
- Mecanismo de **recompensa** do cérebro (dopamina), como em outras dependências.
- **Byung-Chul Han:** sociedade do desempenho e da busca por sucesso rápido.
- **Zygmunt Bauman:** sociedade de consumo e promessa de felicidade imediata.
- **Lei do Superendividamento** (2021).
- **Fiódor Dostoiévski**, *O Jogador*, romance sobre a compulsão pelo jogo.
- A ideia de "**dinheiro fácil**" e o papel dos **influenciadores**.

## Duas linhas de argumento

1. **Publicidade e falsa promessa de enriquecimento:** a propaganda massiva e influenciadores apresentam a aposta como forma de ganhar dinheiro rápido, atraindo principalmente jovens e pessoas em situação financeira difícil.
2. **Dependência e saúde mental:** as plataformas usam mecanismos que estimulam o jogo compulsivo, levando ao vício, ao endividamento e a problemas emocionais e familiares.

## Proposta de intervenção (modelo)

O **Ministério da Fazenda**, em parceria com o **Ministério da Saúde**, deve **restringir a publicidade** de apostas (horários, influenciadores e patrocínios) e **fiscalizar** plataformas ilegais, **além de** ampliar o **atendimento a pessoas com ludopatia** nos **CAPS** e promover **educação financeira** nas escolas, **a fim de** proteger a população do endividamento e da dependência.

## Resumindo

Contextualize o crescimento das bets e sua publicidade. Use ludopatia (OMS), Bauman, Byung-Chul Han e a regulamentação. Argumente com publicidade enganosa e dependência. Proponha restrição da publicidade, fiscalização, atendimento em saúde mental e educação financeira.`,
    [
      "Bets cresceram com publicidade massiva e influenciadores.",
      "Ludopatia: jogo patológico reconhecido pela OMS.",
      "Argumentos: promessa de dinheiro fácil e dependência.",
      "Proposta: restringir publicidade, tratar a ludopatia e educação financeira.",
    ],
    [
      ["Ludopatia", "Dependência patológica de jogos de azar e apostas."],
      ["Superendividamento", "Situação em que as dívidas superam a capacidade de pagamento."],
      ["Educação financeira", "Ensino de como planejar, poupar e usar bem o dinheiro."],
    ],
    [
      ["A ludopatia é:", ["um tipo de investimento", "a dependência patológica de jogos e apostas", "um esporte", "uma lei", "um aplicativo"], 1, "Transtorno reconhecido."],
      ["Um fator que estimula as apostas online é:", ["a ausência total de propaganda", "a publicidade massiva e o uso de influenciadores", "a proibição dos jogos", "o fim dos celulares", "o aumento da poupança"], 1, "Marketing agressivo."],
      ["As apostas podem levar à dependência porque:", ["são sempre lucrativas", "ativam o sistema de recompensa do cérebro", "não envolvem dinheiro", "são proibidas", "são fáceis de entender"], 1, "Dopamina."],
      ["O romance \"O Jogador\", sobre a compulsão pelo jogo, é de:", ["Machado de Assis", "Dostoiévski", "Cervantes", "José de Alencar", "Kafka"], 1, "Escritor russo."],
      ["Uma proposta coerente com o tema é:", ["liberar a publicidade sem limites", "restringir a publicidade e oferecer tratamento para a ludopatia", "proibir a educação financeira", "incentivar apostas com benefícios sociais", "acabar com os CAPS"], 1, "Prevenção e cuidado."],
    ],
    [
      ["Explique por que as apostas online podem prejudicar especialmente as famílias de baixa renda.", "Porque a propaganda promete dinheiro fácil a quem está em dificuldade financeira; ao apostar parte do orçamento, inclusive de benefícios, essas famílias se endividam, e o risco de dependência agrava os problemas financeiros e emocionais."],
    ],
    essay("Os impactos das apostas online na saúde financeira e mental dos brasileiros"),
  ),
  aula(
    "Tema provável: preservação da Amazônia",
    `## O tema

Tema possível: **"Caminhos para conciliar desenvolvimento e preservação da Amazônia"**.

## Contexto

- A **Amazônia** é a maior floresta tropical do mundo, com enorme **biodiversidade**, papel no **clima** (rios voadores, estoque de carbono) e é território de **povos indígenas** e comunidades tradicionais.
- **Desmatamento** causado por **pecuária**, **grilagem**, **garimpo ilegal**, extração de madeira e expansão agrícola.
- Cientistas alertam para o risco de "**ponto de não retorno**": partes da floresta poderiam virar **savana** se o desmatamento passar de certo limite.
- A região tem **baixos indicadores sociais**: o desafio é gerar **renda** sem destruir.

## Repertório útil

- **Constituição (art. 225):** direito ao **meio ambiente ecologicamente equilibrado**, para as presentes e futuras gerações.
- **Código Florestal** e **Reserva Legal**.
- **Chico Mendes** e as **reservas extrativistas**.
- **Ailton Krenak** e **Davi Kopenawa** (*A Queda do Céu*).
- **Acordo de Paris** e a **COP30** em **Belém** (2025).
- Monitoramento por satélite do **INPE** (PRODES e DETER).
- **Bioeconomia**: açaí, castanha, cacau, óleos, cosméticos e fármacos da floresta em pé.
- **Desenvolvimento sustentável** (Relatório Brundtland).

## Duas linhas de argumento

1. **Impunidade e fiscalização insuficiente:** a grilagem e o garimpo ilegal avançam pela falta de fiscalização e de punição, ameaçando a floresta e os povos indígenas.
2. **Falta de alternativas econômicas sustentáveis:** sem incentivo à **bioeconomia**, a população local vê na derrubada da floresta a principal fonte de renda.

## Proposta de intervenção (modelo)

O **Governo Federal**, por meio do **IBAMA** e da **Polícia Federal**, deve **intensificar a fiscalização** com monitoramento por satélite e punição de crimes ambientais, **além de** o **BNDES** e o **Ministério do Meio Ambiente** financiarem **cadeias da bioeconomia** com cooperativas locais e povos tradicionais, **a fim de** gerar renda com a floresta em pé e reduzir o desmatamento.

## Resumindo

Mostre a importância da Amazônia e as causas do desmatamento. Use o art. 225, Chico Mendes, Krenak, INPE e a COP30. Argumente com impunidade e falta de alternativas econômicas. Proponha fiscalização e bioeconomia com comunidades locais.`,
    [
      "Amazônia: biodiversidade, clima (rios voadores) e povos tradicionais.",
      "Causas do desmatamento: pecuária, grilagem, garimpo ilegal.",
      "Repertório: art. 225, Chico Mendes, Krenak, INPE, COP30.",
      "Proposta: fiscalização e bioeconomia da floresta em pé.",
    ],
    [
      ["Bioeconomia", "Economia baseada no uso sustentável dos recursos biológicos da floresta."],
      ["Ponto de não retorno", "Limite a partir do qual a floresta poderia se degradar de forma irreversível."],
      ["Reserva extrativista", "Área protegida onde populações tradicionais vivem do extrativismo sustentável."],
    ],
    [
      ["O artigo 225 da Constituição garante:", ["o direito ao voto", "o direito ao meio ambiente ecologicamente equilibrado", "a liberdade religiosa", "o direito à moradia", "a reforma agrária"], 1, "Base ambiental."],
      ["A principal causa do desmatamento da Amazônia é:", ["o turismo", "a pecuária e a grilagem de terras", "a pesca artesanal", "as hidrovias", "a coleta de castanhas"], 1, "Abertura de pastos."],
      ["O \"ponto de não retorno\" da Amazônia refere-se:", ["a uma estrada", "ao risco de partes da floresta virarem savana", "ao fim do turismo", "à volta dos bandeirantes", "a um rio"], 1, "Alerta científico."],
      ["A bioeconomia propõe:", ["derrubar a floresta para plantar soja", "gerar renda com produtos da floresta em pé", "proibir qualquer atividade econômica", "importar madeira", "liberar o garimpo"], 1, "Açaí, castanha, cacau."],
      ["O monitoramento do desmatamento por satélite é feito pelo:", ["IBGE", "INPE", "INEP", "IPHAN", "IPEA"], 1, "PRODES e DETER."],
    ],
    [
      ["Por que conciliar desenvolvimento econômico e preservação é um desafio na Amazônia?", "Porque a região tem baixos indicadores sociais e muitas pessoas dependem de atividades que destroem a floresta, como pecuária e garimpo; é preciso gerar renda por meio da bioeconomia e, ao mesmo tempo, fiscalizar e punir os crimes ambientais."],
    ],
    essay("Caminhos para conciliar desenvolvimento e preservação da Amazônia"),
  ),
  aula(
    "Tema provável: combate ao bullying e à violência nas escolas",
    `## O tema

Tema possível: **"Caminhos para combater o bullying e a violência nas escolas brasileiras"**.

## Contexto

- **Bullying:** agressões **intencionais** e **repetitivas** (físicas, verbais, psicológicas) contra alguém, numa relação de **desequilíbrio de poder**.
- **Cyberbullying:** a mesma violência pela **internet** (redes sociais, grupos de mensagens), que acompanha a vítima o tempo todo e se espalha rapidamente.
- Vítimas costumam ser alvo por **aparência**, **raça**, **gênero**, **orientação sexual**, **deficiência** ou desempenho escolar.
- Consequências: **baixa autoestima**, ansiedade, depressão, **evasão escolar**, automutilação e, em casos extremos, suicídio.
- Casos de **ataques violentos** a escolas no Brasil aumentaram a preocupação com o clima escolar.

## Repertório útil

- **Lei 13.185/2015:** Programa de Combate à Intimidação Sistemática (bullying).
- **Lei 14.811/2024:** tornou **crime** o bullying e o cyberbullying.
- **ECA:** proteção integral.
- **Hannah Arendt:** banalidade do mal (agressões naturalizadas como "brincadeira").
- **Paulo Freire:** educação dialógica e para a convivência.
- Filme ***Extraordinário*** (Wonder) e a série ***13 Reasons Why***.

## Duas linhas de argumento

1. **Naturalização da violência:** agressões são tratadas como "brincadeira" ou "coisa de criança", e a falta de reação de colegas, famílias e escola perpetua o problema.
2. **Falta de preparo das escolas:** poucos psicólogos, professores sem formação em mediação de conflitos e ausência de canais de denúncia dificultam a prevenção.

## Proposta de intervenção (modelo)

O **Ministério da Educação**, com as **secretarias estaduais**, deve **implementar programas permanentes de convivência e cultura de paz**, com **psicólogos** e **formação de professores** em mediação de conflitos, **além de** criar **canais anônimos de denúncia** e campanhas sobre **cyberbullying** com as famílias, **a fim de** proteger os estudantes e prevenir a violência escolar.

## Resumindo

Defina bullying e cyberbullying e mostre suas consequências. Use as Leis 13.185/2015 e 14.811/2024, o ECA e Arendt. Argumente com naturalização da violência e falta de preparo das escolas. Proponha psicólogos, mediação de conflitos e canais de denúncia.`,
    [
      "Bullying: agressão intencional, repetitiva, com desequilíbrio de poder.",
      "Cyberbullying acompanha a vítima o tempo todo.",
      "Lei 14.811/2024 tornou o bullying crime.",
      "Proposta: psicólogos, mediação de conflitos e canais de denúncia.",
    ],
    [
      ["Bullying", "Agressão intencional e repetida contra alguém em posição de desvantagem."],
      ["Cyberbullying", "Bullying praticado por meios digitais."],
      ["Cultura de paz", "Conjunto de valores e práticas que previnem a violência e valorizam o diálogo."],
    ],
    [
      ["Uma característica do bullying é:", ["ser um conflito isolado entre iguais", "ser intencional, repetitivo e com desequilíbrio de poder", "ser sempre físico", "acontecer só fora da escola", "ser uma brincadeira saudável"], 1, "Definição."],
      ["O cyberbullying é especialmente grave porque:", ["acontece só uma vez", "se espalha rapidamente e acompanha a vítima o tempo todo", "não tem consequências", "é sempre anônimo e inofensivo", "só ocorre em jogos"], 1, "Alcance digital."],
      ["A lei que tornou o bullying e o cyberbullying crime no Brasil é de:", ["1990", "2015", "2024", "1988", "2006"], 2, "Lei 14.811/2024."],
      ["Tratar agressões como \"brincadeira de criança\" é exemplo de:", ["prevenção", "naturalização da violência", "mediação de conflitos", "cultura de paz", "lei"], 1, "Argumento."],
      ["Uma proposta adequada ao tema é:", ["expulsar todas as vítimas", "criar programas de convivência com psicólogos e canais de denúncia", "proibir o uso de uniformes", "ignorar os conflitos", "aumentar a punição física"], 1, "Prevenção."],
    ],
    [
      ["Por que a naturalização do bullying como \"brincadeira\" dificulta seu combate?", "Porque, ao ser visto como algo normal, o bullying deixa de ser denunciado e combatido por colegas, famílias e escola; as vítimas se sentem sozinhas e os agressores continuam, perpetuando a violência e seus danos emocionais."],
    ],
    essay("Caminhos para combater o bullying e a violência nas escolas brasileiras"),
  ),
  aula(
    "Revisão final: checklist da redação nota mil",
    `## Antes de começar

1. **Leia o tema** com calma, várias vezes; sublinhe as **palavras-chave** e o **recorte**.
2. Leia os **textos motivadores** para entender o contexto (sem copiar).
3. Defina sua **tese** (a resposta ao problema) em uma frase.
4. Escolha **dois argumentos** e um **repertório** para cada um.
5. Planeje a **proposta de intervenção** com os **cinco elementos**.

## Estrutura (4 parágrafos)

- **Introdução:** contextualização (repertório) + **tese** + anúncio dos dois argumentos.
- **Desenvolvimento 1:** tópico frasal + repertório + explicação + ligação com a tese.
- **Desenvolvimento 2:** idem, com outro argumento.
- **Conclusão:** retomada da tese + **proposta de intervenção completa**.

## As 5 competências (200 pontos cada)

1. **Norma-padrão:** ortografia, concordância, regência, pontuação, crase.
2. **Compreender a proposta:** tema, tipo dissertativo-argumentativo, repertório **legitimado, pertinente e produtivo**.
3. **Selecionar e organizar argumentos:** projeto de texto claro, sem contradições.
4. **Coesão:** conectivos variados entre e dentro dos parágrafos (além disso, ademais, contudo, portanto, desse modo).
5. **Proposta de intervenção:** **agente + ação + meio/modo + finalidade + detalhamento**, respeitando os direitos humanos.

## Proposta completa (fórmula)

**Agente** (quem?) + **ação** (o quê?) + **meio/modo** (como?) + **finalidade** (para quê?) + **detalhamento** (mais informação sobre um dos elementos).

Ex.: "**O Ministério da Educação** (agente) deve **ampliar a formação de professores** (ação) **por meio de cursos gratuitos e contínuos** (meio), **a fim de** melhorar a qualidade do ensino (finalidade). **Esses cursos devem ser oferecidos online e presencialmente**, para alcançar todo o país (detalhamento)."

## Revisão final (5 minutos)

- O tema e as palavras-chave aparecem em todos os parágrafos?
- A tese está clara na introdução?
- Cada argumento tem repertório e explicação?
- Há conectivos entre os parágrafos?
- A proposta tem os 5 elementos?
- Não há gírias, "eu acho", "a gente", abreviações?
- Concordância, crase e pontuação revisadas?
- Entre 20 e 30 linhas, letra legível, caneta preta, **sem nome**?

## Gestão do tempo

Reserve cerca de **1 hora** para a redação: 10–15 min de planejamento, 30–35 min de rascunho, 15 min para passar a limpo e revisar.

## Resumindo

Planeje (tema, tese, argumentos, repertórios, proposta). Use 4 parágrafos. Conheça as 5 competências. Faça a proposta com agente, ação, meio, finalidade e detalhamento. Revise norma, coesão e o recorte do tema antes de entregar.`,
    [
      "Planeje: tema, tese, dois argumentos, repertórios e proposta.",
      "4 parágrafos: introdução, dois desenvolvimentos e conclusão.",
      "Proposta: agente, ação, meio, finalidade e detalhamento.",
      "Revise norma, coesão, recorte do tema e não assine.",
    ],
    [
      ["Projeto de texto", "Planejamento claro da organização dos argumentos."],
      ["Detalhamento", "Informação extra sobre um dos elementos da proposta."],
      ["Competência 5", "Avaliação da proposta de intervenção da redação."],
    ],
    [
      ["Os cinco elementos da proposta de intervenção são:", ["título, tese, argumento, conclusão e assinatura", "agente, ação, meio/modo, finalidade e detalhamento", "introdução, desenvolvimento, conclusão, repertório e dados", "sujeito, verbo, objeto, adjunto e aposto", "tema, recorte, tese, título e rascunho"], 1, "Competência 5."],
      ["A tese deve aparecer preferencialmente:", ["só na conclusão", "na introdução", "no título", "em nenhum lugar", "apenas no rascunho"], 1, "Ponto de vista claro."],
      ["A Competência 4 avalia:", ["a proposta de intervenção", "a coesão (uso de conectivos)", "a ortografia", "o repertório", "o título"], 1, "Mecanismos linguísticos."],
      ["Um tempo razoável para a redação no ENEM é de cerca de:", ["10 minutos", "1 hora", "3 horas", "5 minutos", "toda a prova"], 1, "Planejar, escrever e revisar."],
      ["Na revisão final, deve-se verificar se:", ["há assinatura no final", "as palavras-chave do tema aparecem nos parágrafos", "há gírias", "o texto tem 7 linhas", "o rascunho foi entregue"], 1, "Evita tangenciamento."],
    ],
    [
      ["Monte uma proposta de intervenção completa, com os cinco elementos, para um problema à sua escolha.", "Uma resposta completa indica um agente (como o Ministério da Saúde), uma ação (ampliar os CAPS), um meio (por meio de verbas e concursos), uma finalidade (a fim de garantir atendimento em saúde mental) e um detalhamento (com prioridade às periferias)."],
    ],
    essay("Desafios para garantir a qualidade da educação pública no Brasil"),
  ),
];
