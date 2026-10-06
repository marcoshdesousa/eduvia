import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

/** Questões do ENEM (id "enem-..."): o enunciado vem em markdown, com imagens (gráficos, mapas, tirinhas). */
export const isRichQuestion = (id: string) => id.startsWith("enem-");

/**
 * Texto de questão: simples (como sempre foi) ou, nas questões do ENEM, com imagens e negrito/itálico.
 * As imagens ficam sobre fundo branco para ler bem também no tema escuro.
 */
export function QuestionText({ text, rich, className }: { text: string; rich: boolean; className?: string }) {
  if (!rich) return <span className={cn("whitespace-pre-line", className)}>{text}</span>;
  return (
    <span className={cn("question-rich block space-y-2", className)}>
      <ReactMarkdown
        components={{
          // eslint-disable-next-line @next/next/no-img-element
          img: ({ src, alt }) => <img src={typeof src === "string" ? src : undefined} alt={alt || "Imagem da questão"} loading="lazy" className="my-2 block h-auto max-w-full rounded-md bg-white p-1" />,
          p: ({ children }) => <span className="block">{children}</span>,
          a: ({ children }) => <span>{children}</span>,
        }}
      >
        {text}
      </ReactMarkdown>
    </span>
  );
}
