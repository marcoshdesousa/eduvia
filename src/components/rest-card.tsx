import Link from "next/link";
import { BookOpen, FileText, Leaf, RotateCcw, Timer } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RestSuggestions } from "@/lib/rest";

function until(d: Date) {
  const min = Math.max(1, Math.round((d.getTime() - Date.now()) / 60_000));
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  return `${h}h${min % 60 ? ` ${String(min % 60).padStart(2, "0")}min` : ""}`;
}

/** Convite para descansar, com sugestões que não gastam a IA do aluno. */
export function RestCard({
  title = "Você estudou bastante hoje. Descanse um pouco! 🌿",
  message = "Seu cérebro fixa melhor o conteúdo com pausas. Enquanto isso, que tal:",
  suggestions: s,
  rechargeAt,
  children,
}: {
  title?: string;
  message?: string;
  suggestions: RestSuggestions;
  /** Quando a IA/limite volta (se a pausa foi por limite). */
  rechargeAt?: Date | null;
  children?: React.ReactNode;
}) {
  return (
    <Card className="space-y-4 border-success/40 bg-success/5">
      <div className="flex items-start gap-3">
        <Leaf className="mt-0.5 shrink-0 text-success" />
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted">{message}</p>
        </div>
      </div>
      <ul className="space-y-3 text-sm">
        {s.pdf && (
          <li className="flex items-start gap-2">
            <FileText size={18} className="mt-0.5 shrink-0 text-primary" />
            <span>
              <strong>Ler o seu PDF</strong>{s.topic ? <> sobre <em>{s.topic}</em></> : null}:{" "}
              <a href={s.pdf.href} target="_blank" rel="noreferrer" className="text-primary underline">{s.pdf.title}, página {s.pdf.page}</a>
            </span>
          </li>
        )}
        {s.books.length > 0 && (
          <li className="flex items-start gap-2">
            <BookOpen size={18} className="mt-0.5 shrink-0 text-primary" />
            <span>
              <strong>Livro{s.books.length > 1 ? "s" : ""} recomendado{s.books.length > 1 ? "s" : ""}{s.subject ? ` de ${s.subject}` : ""}:</strong>{" "}
              {s.books.map((b, i) => (
                <span key={b.title}>{i > 0 && "; "}<em>{b.title}</em>{b.author ? ` (${b.author})` : ""}</span>
              ))}
            </span>
          </li>
        )}
        {!s.pdf && !s.books.length && (
          <li className="flex items-start gap-2">
            <BookOpen size={18} className="mt-0.5 shrink-0 text-primary" />
            <span><strong>Ler um livro</strong>{s.subject ? ` de ${s.subject}` : " sobre o que você está estudando"}, sem pressa, para fixar o assunto.</span>
          </li>
        )}
        <li className="flex items-start gap-2">
          <RotateCcw size={18} className="mt-0.5 shrink-0 text-primary" />
          <span><strong>Fazer revisões</strong> e o banco de erros: não gastam a sua IA. <Link href="/revisoes" className="text-primary underline">Ir para revisões</Link></span>
        </li>
        {rechargeAt && (
          <li className="flex items-start gap-2">
            <Timer size={18} className="mt-0.5 shrink-0 text-warning" />
            <span>Sua IA recarrega em <strong>{until(rechargeAt)}</strong>.</span>
          </li>
        )}
      </ul>
      {children ?? <Link href="/inicio" className={buttonClass("outline")}>Voltar ao início</Link>}
    </Card>
  );
}
