import { PDFDocument, StandardFonts } from "pdf-lib";

const PARAGRAPHS = [
  "Capítulo 1 — A fotossíntese",
  "A fotossíntese é o processo pelo qual plantas, algas e algumas bactérias transformam energia luminosa em energia química. Ela ocorre principalmente nos cloroplastos, organelas presentes nas células das folhas. O pigmento clorofila absorve a luz, principalmente nas faixas do azul e do vermelho.",
  "Na etapa fotoquímica, que acontece nos tilacoides, a energia da luz quebra moléculas de água em um processo chamado fotólise. Esse processo libera oxigênio para a atmosfera e produz ATP e NADPH, moléculas que armazenam energia.",
  "Na etapa química, também chamada de ciclo de Calvin, que acontece no estroma do cloroplasto, o gás carbônico é fixado e transformado em glicose com o uso do ATP e do NADPH produzidos anteriormente. A enzima rubisco é a responsável pela fixação do carbono.",
  "Capítulo 2 — A respiração celular",
  "A respiração celular é o processo que libera a energia armazenada na glicose. Ela começa no citoplasma com a glicólise, que quebra a glicose em duas moléculas de piruvato e gera um pequeno saldo de ATP.",
  "Em seguida, nas mitocôndrias, o piruvato entra no ciclo de Krebs, que libera gás carbônico e produz transportadores de elétrons. Na cadeia respiratória, o oxigênio é o aceptor final de elétrons e forma água, gerando a maior parte do ATP da célula.",
  "Quando não há oxigênio disponível, algumas células realizam fermentação. A fermentação alcoólica, feita por leveduras, produz etanol e gás carbônico; a fermentação lática, que ocorre nos músculos durante esforço intenso, produz ácido lático.",
];

export async function makeStudyPdf(pages = 6): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let p = 0; p < pages; p++) {
    const page = doc.addPage([595, 842]);
    let y = 800;
    for (const para of PARAGRAPHS.slice((p % 2) * 4, (p % 2) * 4 + 4)) {
      const words = para.split(" ");
      let line = "";
      for (const w of words) {
        if (font.widthOfTextAtSize(line + w, 11) > 500) {
          page.drawText(line, { x: 48, y, size: 11, font });
          y -= 16;
          line = "";
        }
        line += w + " ";
      }
      page.drawText(line, { x: 48, y, size: 11, font });
      y -= 26;
    }
  }
  return Buffer.from(await doc.save());
}

export const EDITAL = `EDITAL Nº 1/2026 — CONCURSO PÚBLICO
A prova será organizada pela banca FGV.
CONHECIMENTOS BÁSICOS:
LÍNGUA PORTUGUESA: 1. Compreensão e interpretação de textos. 2. Ortografia oficial. 3. Concordância verbal e nominal.
CONHECIMENTOS ESPECÍFICOS:
BIOLOGIA: 1. Fotossíntese: etapas fotoquímica e química. 2. Respiração celular e fermentação. 3. Citologia.
`;
