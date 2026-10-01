"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FormError } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Brain, HelpCircle, ListChecks, Send, Target } from "lucide-react";
import { linkSources, type SourceRef } from "@/lib/sources";
import { SourceLinks } from "@/components/question-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, Textarea } from "@/components/ui/form";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "user" | "assistant"; content: string; refs: SourceRef[] };
type Shortcut = "explicar" | "testar" | "questoes" | "erros";

const SHORTCUTS: { key: Shortcut; label: string; icon: typeof Brain; prompt: string; send?: boolean }[] = [
  { key: "explicar", label: "Explicar", icon: HelpCircle, prompt: "Explique de forma simples: " },
  { key: "testar", label: "Me testar", icon: Target, prompt: "Me teste sobre o que estudei recentemente, uma pergunta por vez.", send: true },
  { key: "questoes", label: "Criar questões", icon: ListChecks, prompt: "Crie 5 questões com gabarito comentado sobre: " },
  { key: "erros", label: "Analisar meus erros", icon: Brain, prompt: "Analise meus erros e me diga o que revisar.", send: true },
];

export function TutorChat({
  threadId: initialThread,
  preparations,
  initialMessages,
  blocked,
  recentThreads,
}: {
  threadId: string | null;
  preparations: { id: string; title: string }[];
  initialMessages: Msg[];
  blocked: string | null;
  recentThreads: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [threadId, setThreadId] = useState(initialThread);
  const [prepId, setPrepId] = useState(preparations[0]?.id ?? "");
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [shortcut, setShortcut] = useState<Shortcut | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), [messages]);

  async function send(content: string, sc: Shortcut | null) {
    const text = content.trim();
    if (!text || streaming) return;
    setError(null);
    setInput("");
    setShortcut(null);
    const pendingId = `a-${Date.now()}`;
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", content: text, refs: [] }, { id: pendingId, role: "assistant", content: "", refs: [] }]);
    setStreaming(true);
    try {
      const res = await fetch("/api/professor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ threadId, preparationId: prepId, content: text, shortcut: sc }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Não consegui responder agora.");
      }
      const newThread = res.headers.get("x-thread-id");
      if (newThread && newThread !== threadId) setThreadId(newThread);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const [visible] = acc.split("\u0000");
        setMessages((m) => m.map((x) => (x.id === pendingId ? { ...x, content: visible } : x)));
      }
      const [visible, meta] = acc.split("\u0000");
      const info = meta ? (JSON.parse(meta) as { messageId?: string; refs?: SourceRef[]; error?: string }) : {};
      if (info.error) throw new Error(info.error);
      setMessages((m) => m.map((x) => (x.id === pendingId ? { ...x, id: info.messageId ?? pendingId, content: visible, refs: info.refs ?? [] } : x)));
      if (newThread && !initialThread) router.replace(`/professor?t=${newThread}`, { scroll: false });
    } catch (e) {
      setMessages((m) => m.filter((x) => x.id !== pendingId || x.content));
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setStreaming(false);
    }
  }

  if (!preparations.length && !threadId) {
    return <Card className="text-sm text-muted">Crie uma preparação e envie seus materiais para conversar com o Professor IA.</Card>;
  }

  return (
    <Card className="flex min-h-[70vh] min-w-0 flex-col p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-3">
        <div className="font-semibold">Professor IA</div>
        {!threadId && preparations.length > 0 && (
          <Select value={prepId} onChange={(e) => setPrepId(e.target.value)} className="h-9 w-auto" aria-label="Preparação">
            {preparations.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </Select>
        )}
        {threadId && <Link href="/professor" className="text-sm text-primary lg:hidden">Nova conversa</Link>}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {!messages.length && (
          <div className="py-8 text-center">
            <p className="text-lg font-semibold">Tire suas dúvidas</p>
            <p className="mt-1 text-sm text-muted">Respondo com base nos seus materiais e mostro de qual página veio.</p>
            {recentThreads.length > 0 && (
              <div className="mt-6 space-y-1 lg:hidden">
                <p className="text-xs text-muted">Conversas recentes</p>
                {recentThreads.map((t) => <Link key={t.id} href={`/professor?t=${t.id}`} className="block truncate text-sm text-primary">{t.title}</Link>)}
              </div>
            )}
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[90%] rounded-2xl px-4 py-2.5 text-sm", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-surface-2")}>
              {m.role === "assistant" ? (
                m.content ? (
                  <div className="prose-study text-sm">
                    <ReactMarkdown components={{ a: (p) => <a {...p} target="_blank" rel="noreferrer" className="text-xs text-primary no-underline hover:underline" /> }}>
                      {linkSources(m.content, m.refs.length ? m.refs : [])}
                    </ReactMarkdown>
                    {m.refs.length > 0 && <div className="mt-2 border-t border-border pt-2"><SourceLinks refs={m.refs} /></div>}
                  </div>
                ) : (
                  <Thinking />
                )
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="space-y-2 border-t border-border p-3">
        {blocked ? (
          <div className="space-y-1">
            <FormError message={blocked} />
            {/Assine|não faz parte/.test(blocked) && <Link href="/assinatura" className="text-sm font-semibold text-primary">Assinar plano</Link>}
          </div>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {SHORTCUTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  disabled={streaming}
                  onClick={() => (s.send ? send(s.prompt, s.key) : (setInput(s.prompt), setShortcut(s.key)))}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  <s.icon size={14} /> {s.label}
                </button>
              ))}
            </div>
            <FormError message={error} />
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input, shortcut);
              }}
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input, shortcut);
                  }
                }}
                rows={2}
                placeholder="Pergunte qualquer coisa sobre o seu material..."
                className="min-h-12 resize-none"
                aria-label="Mensagem"
              />
              <Button disabled={streaming || !input.trim()} aria-label="Enviar"><Send size={16} /></Button>
            </form>
          </>
        )}
      </div>
    </Card>
  );
}

const THINKING = [
  "Pensando…",
  "Lendo o seu material…",
  "Não saia dessa tela, já estou respondendo.",
  "Organizando a explicação…",
  "Quase terminando…",
];

/** Enquanto a resposta não chega: mensagens que mudam e um cérebro pulsando. */
function Thinking() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => Math.min(x + 1, THINKING.length - 1)), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-flex items-center gap-2 text-muted" role="status" aria-live="polite">
      <Brain size={16} className="animate-pulse text-primary" />
      <span key={i} className="thinking-msg">{THINKING[i]}</span>
      <span className="inline-flex gap-1" aria-hidden>
        <span className="size-1.5 animate-bounce rounded-full bg-primary/70" />
        <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:120ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:240ms]" />
      </span>
    </span>
  );
}
