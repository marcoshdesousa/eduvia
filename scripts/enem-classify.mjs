// Matéria de cada questão do ENEM a partir do texto (usado por build-enem.mjs e add-enem-recentes.mjs).
// Matéria de cada questão (o ENEM só informa a área): palavras-chave; empate fica com a primeira da lista.
export const KEYWORDS = {
  humanas: {
    "História": ["século", "império", "imperial", "colônia", "colonial", "colonização", "escrav", "ditadura", "república", "revolução", "guerra", "medieval", "feudal", "vargas", "getúlio", "monarquia", "idade média", "antiguidade", "grécia antiga", "romano", "independência", "abolição", "cristandade", "reforma protestante", "absolutismo", "iluminismo", "nazis", "fascis", "regime militar", "historiador", "brasil colônia", "jesuít", "quilombo", "indígena", "1964", "golpe", "constituição de"],
    "Geografia": ["clima", "relevo", "solo", "urbaniza", "população", "migra", "agricult", "agropecu", "agronegócio", "indústria", "industrial", "globaliza", "bacia", "chuva", "vegeta", "bioma", "mapa", "cartogra", "territór", "região", "fronteira", "desmatamento", "geográf", "latitude", "longitude", "erosão", "climát", "aquífero", "fuso", "metrópole", "espaço geográfico", "paisagem", "hidrel", "matriz energética", "êxodo"],
    "Filosofia": ["justiça", "liberdade", "conhecimento", "verdade", "moral", "estado de natureza", "contrato social", "pensamento", "pensador", "existência", "sabedoria", "filósof", "filosof", "platão", "aristóteles", "kant", "descartes", "sócrates", "nietzsche", "rousseau", "hobbes", "locke", "maquiavel", "ética", "metafísic", "epicuro", "hume", "hegel", "sartre", "agostinho", "tomás de aquino", "espinosa", "virtude", "pré-socrát", "foucault", "arendt", "estoic"],
    "Sociologia": ["sociedade", "social", "trabalho", "consumo", "democracia", "mídia", "identidade", "cultural", "étnic", "sociolog", "durkheim", "weber", "marx", "bauman", "bourdieu", "movimentos sociais", "movimento social", "cidadania", "desigualdade social", "classe social", "cultura de massa", "indústria cultural", "adorno", "gênero", "racismo", "preconceito", "direitos humanos", "redes sociais", "identidade"],
  },
  natureza: {
    "Biologia": ["doenças", "doença", "saúde", "organismos", "plantas", "animais", "populações", "nutriente", "intestin", "pulmão", "rim", "neurônio", "câncer", "tecido", "dengue", "zika", "malária", "esquistossom", "soro", "veneno", "peçonha", "ecológic", "polinização", "semente", "flor", "folha", "raiz", "célula", "celular", "gene", "genétic", "dna", "rna", "espécie", "ecossistema", "proteína", "vírus", "bactéria", "vegetal", "evolução", "fotossíntese", "enzima", "sangue", "hormônio", "vacina", "cromossomo", "mutação", "seleção natural", "cadeia alimentar", "bioma", "parasita", "infecção", "fungo", "sistema imun", "anticorpo", "glicose", "metabolismo", "mosquito", "inseto", "reprodução", "embrião", "biodiversidade", "transgênic"],
    "Química": ["organoclor", "tóxic", "poluente", "agrotóxic", "solubilidade", "solvente", "mols", "molar", "soluto", "corrosão", "combustível", "biodiesel", "petróleo", "gasolina", "nitrog", "carbono", "oxigênio", "hidrogênio", "sódio", "cálcio", "ferro", "cloro", "enxofre", "dióxido", "monóxido", "reação", "molécula", "átomo", "íon", "ácido", "básico", "ph", "concentração", "combustão", "oxidação", "composto", "químic", "orgânic", "polímero", "substância", "hidrocarboneto", "eletrólise", "pilha", "catalis", "estequio", "isômer", "radioativ", "álcool", "éster", "funções orgânicas", "cátion", "ânion", "neutraliza", "titulação"],
    "Física": ["m/s", "km/h", "joule", "newton", "ohm", "hertz", "intensidade da corrente", "energia elétrica", "usina", "lâmpada", "chuveiro", "aquecedor", "termômetro", "radiação", "satélite", "órbita", "queda", "lançad", "veículo", "freio", "polia", "alavanca", "carga elétrica", "ondas", "comprimento de onda", "espectro", "eco", "decibel", "velocidade", "força", "energia cinética", "energia potencial", "corrente elétrica", "resistor", "resistência elétrica", "frequência", "lente", "espelho", "calor", "aceleração", "circuito", "campo magnético", "refração", "reflexão", "newton", "atrito", "gravidade", "watt", "volt", "ampère", "dilatação", "termodinâm", "óptic", "elétric", "magnét", "colisão", "empuxo", "densidade"],
  },
  linguagens: {
    "Literatura": ["poema", "poeta", "poesia", "romance", "literár", "modernis", "romantis", "verso", "estrofe", "barroco", "realismo", "naturalismo", "parnasian", "simbolis", "arcadismo", "narrador", "machado de assis", "drummond", "clarice", "guimarães rosa", "graciliano", "lírico", "soneto", "cordel", "crônica"],
    "Artes e Educação Física": ["arte", "pintura", "obra de arte", "artista", "música", "dança", "teatro", "escultura", "museu", "grafite", "exposição", "esporte", "atividade física", "exercício físico", "ginástica", "futebol", "capoeira", "olímpi", "atleta", "performance", "cinema", "fotografia", "arquitetura", "instalação artística"],
    "Língua Portuguesa": [],
  },
};

export function classify(area, lang, text) {
  if (area === "matematica") return "Matemática";
  if (area === "linguagens" && lang === "ingles") return "Inglês";
  if (area === "linguagens" && lang === "espanhol") return "Espanhol";
  const t = ` ${text.toLowerCase()} `;
  const table = KEYWORDS[area];
  let best = null;
  let bestScore = 0;
  for (const [name, words] of Object.entries(table)) {
    // começo de palavra (evita "som" em "somente"); conta cada ocorrência, até 3 por palavra
    const score = words.reduce((s, w) => s + Math.min(3, (t.match(new RegExp(`(?<![a-zà-ü])${w.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g")) ?? []).length), 0);
    if (score > bestScore) [best, bestScore] = [name, score];
  }
  if (area === "linguagens") return bestScore >= 2 ? best : "Língua Portuguesa";
  return best ?? Object.keys(table)[0];
}
