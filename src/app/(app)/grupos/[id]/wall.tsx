"use client";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Send, Trash2 } from "lucide-react";
import { deleteMessageAction, postMessageAction } from "@/app/actions/groups";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/form";
import { cn } from "@/lib/utils";

type Msg = { id: string; content: string | null; createdAt: string; author: { id: string; name: string; handle: string | null } };

export function GroupWall({ groupId, meId, canModerate }: { groupId: string; meId: string; canModerate: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);
  const last = useRef<string | null>(null);

  const load = useCallback(async (full = false) => {
    const q = !full && last.current ? `?after=${encodeURIComponent(last.current)}` : "";
    const res = await fetch(`/api/grupos/${groupId}/mensagens${q}`, { cache: "no-store" });
    if (!res.ok) return;
    const { messages: incoming } = (await res.json()) as { messages: Msg[] };
    if (incoming.length) {
      last.current = incoming[incoming.length - 1].createdAt;
      setMessages((prev) => (full ? incoming : [...prev, ...incoming.filter((m) => !prev.some((p) => p.id === m.id))]));
    }
    setLoaded(true);
  }, [groupId]);

  useEffect(() => {
    load(true);
    const t = setInterval(() => load(), 5000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [messages.length]);

  const send = () =>
    start(async () => {
      setError(null);
      const r = await postMessageAction(groupId, text);
      if (r.error) return setError(r.error);
      setText("");
      await load();
    });

  const time = (iso: string) => new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <Card className="flex min-h-[60vh] flex-col p-0">
      <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {loaded && !messages.length && <p className="py-10 text-center text-sm text-muted">Nenhuma mensagem ainda. Diga oi para o grupo! 👋</p>}
        {messages.map((m) => {
          const mine = m.author.id === meId;
          return (
            <div key={m.id} className={cn("group flex flex-col", mine ? "items-end" : "items-start")}>
              <div className="mb-0.5 text-xs text-muted">
                {!mine && <Link href={`/u/${m.author.handle}`} className="font-medium hover:text-primary">@{m.author.handle}</Link>} {time(m.createdAt)}
              </div>
              <div className={cn("flex max-w-[85%] items-start gap-1", mine && "flex-row-reverse")}>
                <p className={cn("whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm", m.content === null ? "italic text-muted" : mine ? "bg-primary text-primary-foreground" : "bg-surface-2")}>
                  {m.content ?? "mensagem apagada"}
                </p>
                {m.content !== null && (mine || canModerate) && (
                  <button
                    type="button"
                    aria-label="Apagar mensagem"
                    className="p-1 text-muted opacity-0 transition-opacity hover:text-danger group-hover:opacity-100 focus:opacity-100"
                    onClick={() => start(async () => { await deleteMessageAction(m.id); setMessages((ms) => ms.map((x) => (x.id === m.id ? { ...x, content: null } : x))); })}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <form className="flex items-end gap-2 border-t border-border p-3" onSubmit={(e) => { e.preventDefault(); if (text.trim()) send(); }}>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (text.trim()) send(); } }}
          rows={1}
          maxLength={1000}
          placeholder="Escreva no mural..."
          className="min-h-10 resize-none"
          aria-label="Mensagem para o grupo"
        />
        <Button disabled={pending || !text.trim()} aria-label="Enviar mensagem"><Send size={16} /></Button>
      </form>
      {error && <p className="px-3 pb-3 text-sm text-danger">{error}</p>}
    </Card>
  );
}
