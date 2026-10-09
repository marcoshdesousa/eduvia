import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { cn } from "@/lib/utils";

/** Questões do ENEM (id "enem-..."): o enunciado vem em markdown, com imagens (gráficos, mapas, tirinhas). */
export const isRichQuestion = (id: string) => id.startsWith("enem-");

/** Endereços das imagens de um texto de questão (para já ir carregando as da próxima questão). */
export const imageUrls = (text: string) => [...text.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1]);

// Fixos (fora do componente): se fossem recriados a cada atualização da tela (o cronômetro do simulado
// atualiza a cada segundo), as imagens seriam apagadas e carregadas de novo o tempo todo, "piscando".
const COMPONENTS: Components = {
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ src, alt }) => {
    // o texto alternativo traz "largura x altura": a tela reserva o espaço e nada "pula" quando a imagem chega
    const size = /^(\d+)x(\d+)$/.exec(alt ?? "");
    return (
      <img
        src={typeof src === "string" ? src : undefined}
        alt="Imagem da questão"
        width={size ? Number(size[1]) : undefined}
        height={size ? Number(size[2]) : undefined}
        decoding="async"
        className="my-2 block h-auto max-w-full rounded-md bg-white p-1"
      />
    );
  },
  p: ({ children }) => <span className="block">{children}</span>,
  a: ({ children }) => <span>{children}</span>,
};

/**
 * Texto de questão: simples (como sempre foi) ou, nas questões do ENEM, com imagens e negrito/itálico.
 * As imagens ficam sobre fundo branco para ler bem também no tema escuro.
 */
export const QuestionText = memo(function QuestionText({ text, rich, className }: { text: string; rich: boolean; className?: string }) {
  if (!rich) return <span className={cn("whitespace-pre-line", className)}>{text}</span>;
  return (
    <span className={cn("question-rich block space-y-2", className)}>
      <ReactMarkdown components={COMPONENTS}>{text}</ReactMarkdown>
    </span>
  );
});
