"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Check, CheckCheck, Clock, Loader2, Mic, Send, Square, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { id: string; mine: boolean; kind: "TEXT" | "AUDIO" | "IMAGE"; text: string | null; url: string | null; durationSec: number | null; createdAt: string; read: boolean; state?: "sending" | "error"; localUrl?: string };

const time = (iso: string) => new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const MAX_REC = 180;

/** Diminui a foto no aparelho antes de enviar (lado maior até 1600 px, JPEG). */
async function shrinkImage(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((ok, fail) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = fail;
      i.src = url;
    });
    const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return await new Promise((ok, fail) => c.toBlob((b) => (b ? ok(b) : fail(new Error("foto"))), "image/jpeg", 0.85));
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function ChatBox({ bookingId, otherName, initialWrite }: { bookingId: string; otherName: string; initialWrite: boolean }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [write, setWrite] = useState(initialWrite);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<{ blob: Blob; url: string } | null>(null);
  const [rec, setRec] = useState<{ recorder: MediaRecorder; started: number; secs: number } | null>(null);
  const chunks = useRef<Blob[]>([]);
  const cancelRec = useRef(false);
  const last = useRef<string | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const scrollDown = () => requestAnimationFrame(() => list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" }));

  const poll = useCallback(async () => {
    const r = await fetch(`/api/pedidos/${bookingId}/mensagens${last.current ? `?after=${encodeURIComponent(last.current)}` : ""}`).then((x) => (x.ok ? x.json() : null)).catch(() => null);
    if (!r) return;
    setWrite(r.write);
    setLoaded(true);
    const incoming = r.messages as Msg[];
    if (incoming.length) {
      last.current = incoming[incoming.length - 1].createdAt;
      setMsgs((cur) => {
        const ids = new Set(cur.map((m) => m.id));
        return [...cur, ...incoming.filter((m) => !ids.has(m.id))];
      });
      scrollDown();
    }
    const readIds = new Set(r.readIds as string[]);
    setMsgs((cur) => cur.map((m) => (m.mine && readIds.has(m.id) ? { ...m, read: true } : m)));
  }, [bookingId]);

  useEffect(() => {
    void poll();
    const t = setInterval(() => document.visibilityState === "visible" && void poll(), 4000);
    return () => clearInterval(t);
  }, [poll]);

  const send = async (form: FormData, optimistic: Omit<Msg, "id" | "createdAt" | "read" | "mine">) => {
    const tmp = `tmp-${Date.now()}`;
    setMsgs((cur) => [...cur, { ...optimistic, id: tmp, mine: true, read: false, createdAt: new Date().toISOString(), state: "sending" }]);
    scrollDown();
    setError(null);
    const r = await fetch(`/api/pedidos/${bookingId}/mensagens`, { method: "POST", body: form }).catch(() => null);
    const body = (await r?.json().catch(() => null)) as { message?: Msg; error?: string } | null;
    if (!r?.ok || !body?.message) {
      setMsgs((cur) => cur.map((m) => (m.id === tmp ? { ...m, state: "error" } : m)));
      setError(body?.error ?? "Não foi possível enviar. Confira a internet e tente de novo.");
      return;
    }
    setMsgs((cur) => cur.map((m) => (m.id === tmp ? { ...body.message!, localUrl: m.localUrl } : m)));
    last.current = body.message.createdAt > (last.current ?? "") ? body.message.createdAt : last.current;
  };

  const sendText = async () => {
    const t = text.trim();
    if (!t) return;
    setText("");
    const f = new FormData();
    f.set("kind", "TEXT");
    f.set("text", t);
    await send(f, { kind: "TEXT", text: t, url: null, durationSec: null });
  };

  const sendPhoto = async () => {
    if (!photo) return;
    const f = new FormData();
    f.set("kind", "IMAGE");
    f.set("file", photo.blob, "foto.jpg");
    if (text.trim()) f.set("text", text.trim());
    const p = photo;
    setPhoto(null);
    setText("");
    await send(f, { kind: "IMAGE", text: text.trim() || null, url: null, durationSec: null, localUrl: p.url });
  };

  const startRec = async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return setError("Este aparelho não grava áudio pelo navegador.");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const type = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg"].find((t) => MediaRecorder.isTypeSupported(t));
      const recorder = new MediaRecorder(stream, type ? { mimeType: type, audioBitsPerSecond: 32_000 } : undefined);
      chunks.current = [];
      cancelRec.current = false;
      recorder.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const secs = Math.max(1, Math.round((Date.now() - started) / 1000));
        setRec(null);
        if (cancelRec.current || !chunks.current.length) return;
        const blob = new Blob(chunks.current, { type: recorder.mimeType || "audio/webm" });
        const f = new FormData();
        f.set("kind", "AUDIO");
        f.set("file", blob, "audio");
        f.set("durationSec", String(secs));
        await send(f, { kind: "AUDIO", text: null, url: null, durationSec: secs, localUrl: URL.createObjectURL(blob) });
      };
      const started = Date.now();
      recorder.start();
      setRec({ recorder, started, secs: 0 });
    } catch {
      setError("Não foi possível usar o microfone. Confira a permissão do navegador.");
    }
  };

  useEffect(() => {
    if (!rec) return;
    const t = setInterval(() => {
      const secs = Math.round((Date.now() - rec.started) / 1000);
      setRec((r) => (r ? { ...r, secs } : r));
      if (secs >= MAX_REC) rec.recorder.stop();
    }, 250);
    return () => clearInterval(t);
  }, [rec?.started]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface" id="chat">
      <div className="border-b border-border px-4 py-2">
        <p className="font-semibold">Conversa com {otherName}</p>
        <p className="text-xs text-muted">Combine detalhes e extras aqui. Fotos podem mostrar dados pessoais: envie só o necessário.</p>
      </div>
      <div ref={list} className="h-[55vh] max-h-[520px] space-y-2 overflow-y-auto bg-surface-2/50 p-3" aria-live="polite">
        {!loaded && <p className="text-center text-sm text-muted"><Loader2 className="mr-1 inline animate-spin" size={14} /> Carregando…</p>}
        {loaded && !msgs.length && <p className="py-8 text-center text-sm text-muted">Nenhuma mensagem ainda. Diga olá! 👋</p>}
        {msgs.map((m) => (
          <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm", m.mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-surface")}>
              {m.kind === "IMAGE" && (m.localUrl || m.url) && (
                <a href={m.url ?? m.localUrl} target="_blank" rel="noreferrer" className="mb-1 block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.localUrl ?? m.url!} alt="Foto enviada no chat" className="max-h-64 rounded-lg" loading="lazy" />
                </a>
              )}
              {m.kind === "AUDIO" && (m.localUrl || m.url) && (
                <div className="flex items-center gap-2">
                  <audio controls preload="metadata" src={m.localUrl ?? m.url!} className="h-9 max-w-[220px]" />
                  {m.durationSec != null && <span className="text-xs opacity-80">{mmss(m.durationSec)}</span>}
                </div>
              )}
              {m.text && <p className="whitespace-pre-wrap break-words">{m.text}</p>}
              <p className={cn("mt-0.5 flex items-center justify-end gap-1 text-[10px]", m.mine ? "text-primary-foreground/80" : "text-muted")}>
                {time(m.createdAt)}
                {m.mine && (m.state === "sending" ? <Clock size={11} aria-label="Enviando" /> : m.state === "error" ? <X size={11} aria-label="Não enviada" /> : m.read ? <CheckCheck size={12} aria-label="Lida" /> : <Check size={12} aria-label="Enviada" />)}
              </p>
            </div>
          </div>
        ))}
      </div>
      {error && <p className="bg-danger/10 px-3 py-1.5 text-xs text-danger">{error}</p>}
      {write ? (
        <div className="space-y-2 border-t border-border p-2">
          {photo && (
            <div className="flex items-center gap-2 rounded-lg bg-surface-2 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="Prévia da foto" className="h-16 w-16 rounded object-cover" />
              <span className="flex-1 text-xs text-muted">Prévia da foto. Adicione uma legenda se quiser.</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => setPhoto(null)} aria-label="Remover foto"><X size={16} /></Button>
            </div>
          )}
          {rec ? (
            <div className="flex items-center gap-2">
              <span className="flex flex-1 items-center gap-2 text-sm"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-danger" /> Gravando… {mmss(rec.secs)} <span className="text-xs text-muted">(máx. 3 min)</span></span>
              <Button type="button" variant="ghost" size="sm" onClick={() => { cancelRec.current = true; rec.recorder.stop(); }} aria-label="Cancelar gravação"><Trash2 size={18} /></Button>
              <Button type="button" size="sm" onClick={() => rec.recorder.stop()} aria-label="Parar e enviar"><Square size={14} /> Enviar</Button>
            </div>
          ) : (
            <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); void (photo ? sendPhoto() : sendText()); }}>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (!f) return;
                  try {
                    const blob = await shrinkImage(f);
                    setPhoto({ blob, url: URL.createObjectURL(blob) });
                  } catch {
                    setError("Não foi possível abrir esta foto.");
                  }
                }}
              />
              <Button type="button" variant="ghost" size="sm" className="h-10" onClick={() => fileInput.current?.click()} aria-label="Enviar foto"><Camera size={20} /></Button>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && window.matchMedia("(pointer: fine)").matches) {
                    e.preventDefault();
                    void (photo ? sendPhoto() : sendText());
                  }
                }}
                rows={1}
                maxLength={2000}
                placeholder="Escreva uma mensagem"
                aria-label="Mensagem"
                className="max-h-32 min-h-10 flex-1 resize-none rounded-2xl border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {text.trim() || photo ? (
                <Button type="submit" size="sm" className="h-10 w-10 rounded-full p-0" aria-label="Enviar"><Send size={18} /></Button>
              ) : (
                <Button type="button" size="sm" className="h-10 w-10 rounded-full p-0" onClick={startRec} aria-label="Gravar áudio"><Mic size={18} /></Button>
              )}
            </form>
          )}
        </div>
      ) : (
        <p className="border-t border-border px-3 py-2 text-center text-xs text-muted">O chat está fechado para novas mensagens. O histórico continua aqui.</p>
      )}
    </div>
  );
}
