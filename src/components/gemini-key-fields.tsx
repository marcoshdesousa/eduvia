import { ExternalLink, KeyRound } from "lucide-react";
import { Field, Input } from "@/components/ui/form";

export const AI_STUDIO_URL = "https://aistudio.google.com/apikey";

/** Passo a passo + campo da chave do Gemini (cadastro, conectar IA e Perfil → Minha IA). */
export function GeminiKeyFields({ hint, required = !hint }: { hint?: string | null; required?: boolean }) {
  return (
    <div className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-center gap-2 font-semibold">
        <KeyRound size={18} className="text-primary" /> Conecte sua IA (Google Gemini)
      </div>
      <p className="text-sm text-muted">
        O Eduvia usa a IA do Google com a <strong className="text-foreground">sua própria chave</strong>. É grátis, não pede cartão e leva 2 minutos:
      </p>
      <ol className="list-decimal space-y-1.5 pl-5 text-sm">
        <li>
          Abra o{" "}
          <a href={AI_STUDIO_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-primary underline">
            Google AI Studio <ExternalLink size={12} />
          </a>{" "}
          e entre com sua conta Google (a mesma do Gmail/YouTube).
        </li>
        <li>Toque em <strong>&quot;Create API key&quot;</strong> (Criar chave de API). Se pedir, aceite os termos e escolha ou crie um projeto.</li>
        <li>Copie a chave (começa com <code className="rounded bg-surface px-1">AIza</code>) e cole aqui embaixo.</li>
      </ol>
      <Field label="Chave da API do Gemini" htmlFor="geminiKey" hint={hint ? `Chave atual termina em …${hint}. Cole uma nova para trocar.` : "Guardamos a chave criptografada. Ninguém vê, nem a equipe do Eduvia."}>
        <Input id="geminiKey" name="geminiKey" autoComplete="off" spellCheck={false} placeholder="AIza..." required={required} className="font-mono" />
      </Field>
    </div>
  );
}
