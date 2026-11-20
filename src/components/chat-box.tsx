"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarPlus, Camera, Check, CheckCheck, Clock, CreditCard, LayoutGrid, Loader2, Mic, Pencil, Send, Square, Trash2, Video, X, Zap } from "lucide-react";
import { ActionForm, type ActionResult } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/form";
import { BOOKING_LABEL, UNIT_LABEL, categoryLabel, formatBRL, qtyLabel } from "@/lib/domain";
import type { BookingStatus, PriceUnit } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

type Schedule = { status: BookingStatus; at: string; category: string; quantity: number; unit: PriceUnit; cents: number | null };
type Msg = {
  id: string;
  mine: boolean;
  kind: "TEXT" | "AUDIO" | "IMAGE" | "VIDEO" | "SCHEDULE";
  text: string | null;
  url: string | null;
  durationSec: number | null;
  createdAt: string;
  read: boolean;
  edited?: boolean;
  bookingId?: string | null;
  schedule?: Schedule | null;
  state?: "sending" | "error";
  localUrl?: string;
};
type Extras = { as: "CLIENT" | "PRO"; quickReplies: string[]; payText: string | null; services: { category: string; label: string; unit: PriceUnit; units: PriceUnit[]; priceCents: number }[] };

const time = (iso: string) => new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const MAX_REC = 180;
const MAX_VIDEO = 40 * 1024 * 1024;
/** Marca d'água discreta no fundo da conversa (aparece em prints). */
const WATERMARK = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="140"><text x="10" y="80" transform="rotate(-24 110 70)" font-family="Arial" font-size="17" font-weight="700" fill="#0a7d55" fill-opacity="0.07">Diária Paga</text></svg>')}")`;

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

export function ChatBox({
  conversationId,
  otherName,
  initialWrite,
  scheduleAction,
  height = "h-[60vh] max-h-[560px]",
}: {
  conversationId: string;
  otherName: string;
  initialWrite: boolean;
  /** só para o trabalhador: agendar pela conversa */
  scheduleAction?: (p: ActionResult, d: FormData) => Promise<ActionResult>;
  height?: string;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [write, setWrite] = useState(initialWrite);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<{ blob: Blob; url: string } | null>(null);
  const [rec, setRec] = useState<{ recorder: MediaRecorder; started: number; secs: number } | null>(null);
  const [menu, setMenu] = useState<null | "grid" | "replies" | "schedule">(null);
  const [extras, setExtras] = useState<Extras | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState<Msg | null>(null);
  const chunks = useRef<Blob[]>([]);
  const cancelRec = useRef(false);
  const last = useRef<string | null>(null);
  const changed = useRef<string | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const base = `/api/conversas/${conversationId}/mensagens`;

  const scrollDown = () => requestAnimationFrame(() => list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" }));

  const poll = useCallback(async () => {
    const q = new URLSearchParams();
    if (last.current) q.set("after", last.current);
    if (changed.current) q.set("changed", changed.current);
    const r = await fetch(`${base}?${q}`).then((x) => (x.ok ? x.json() : null)).catch(() => null);
    if (!r) return;
    setWrite(r.write);
    setLoaded(true);
    changed.current = r.now;
    const incoming = r.messages as Msg[];
    if (incoming.length) {
      last.current = incoming[incoming.length - 1].createdAt;
      setMsgs((cur) => {
        const ids = new Set(cur.map((m) => m.id));
        return [...cur, ...incoming.filter((m) => !ids.has(m.id))];
      });
      scrollDown();
    }
    const changes = r.changes as ({ id: string; deleted: true } | (Msg & { deleted: false }))[];
    if (changes.length) {
      setMsgs((cur) => cur.flatMap((m) => {
        const c = changes.find((x) => x.id === m.id);
        if (!c) return [m];
        if (c.deleted) return [];
        return [{ ...m, text: c.text, edited: c.edited, schedule: c.schedule ?? m.schedule }];
      }));
    }
    const readIds = new Set(r.readIds as string[]);
    setMsgs((cur) => cur.map((m) => (m.mine && readIds.has(m.id) ? { ...m, read: true } : m)));
  }, [base]);

  useEffect(() => {
    void poll();
    const t = setInterval(() => document.visibilityState === "visible" && void poll(), 3500);
    return () => clearInterval(t);
  }, [poll]);

  const loadExtras = async () => {
    if (extras) return extras;
    const e = (await fetch(`/api/conversas/${conversationId}/extras`).then((x) => (x.ok ? x.json() : null)).catch(() => null)) as Extras | null;
    setExtras(e);
    return e;
  };

  const send = async (form: FormData, optimistic: Omit<Msg, "id" | "createdAt" | "read" | "mine">) => {
    const tmp = `tmp-${Date.now()}`;
    setMsgs((cur) => [...cur, { ...optimistic, id: tmp, mine: true, read: false, createdAt: new Date().toISOString(), state: "sending" }]);
    scrollDown();
    setError(null);
    const r = await fetch(base, { method: "POST", body: form }).catch(() => null);
    const body = (await r?.json().catch(() => null)) as { message?: Msg; error?: string } | null;
    if (!r?.ok || !body?.message) {
      setMsgs((cur) => cur.filter((m) => m.id !== tmp));
      setError(body?.error ?? "Não foi possível enviar. Confira a internet e tente de novo.");
      return;
    }
    setMsgs((cur) => cur.map((m) => (m.id === tmp ? { ...body.message!, localUrl: m.localUrl } : m)));
    last.current = body.message.createdAt > (last.current ?? "") ? body.message.createdAt : last.current;
  };

  const sendText = async (preset?: string) => {
    const t = (preset ?? text).trim();
    if (!t) return;
    if (!preset) setText("");
    const f = new FormData();
    f.set("kind", "TEXT");
    f.set("text", t);
    await send(f, { kind: "TEXT", text: t, url: null, durationSec: null });
  };

  const saveEdit = async () => {
    if (!editing) return;
    const t = text.trim();
    const m = editing;
    const r = await fetch(`${base}/${m.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: t }) }).catch(() => null);
    const body = (await r?.json().catch(() => null)) as { text?: string | null; error?: string } | null;
    if (!r?.ok) return setError(body?.error ?? "Não foi possível editar.");
    setMsgs((cur) => cur.map((x) => (x.id === m.id ? { ...x, text: body?.text ?? null, edited: true } : x)));
    setEditing(null);
    setText("");
  };

  const remove = async (m: Msg) => {
    if (!window.confirm("Apagar esta mensagem para você e para a outra pessoa?")) return;
    setSelected(null);
    const r = await fetch(`${base}/${m.id}`, { method: "DELETE" }).catch(() => null);
    if (!r?.ok) return setError(((await r?.json().catch(() => null)) as { error?: string } | null)?.error ?? "Não foi possível apagar.");
    setMsgs((cur) => cur.filter((x) => x.id !== m.id));
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

  const sendVideo = async (file: File) => {
    if (file.size > MAX_VIDEO) return setError("Vídeo grande demais (máximo 40 MB, cerca de 1 minuto).");
    const f = new FormData();
    f.set("kind", "VIDEO");
    f.set("file", file, file.name || "video.mp4");
    await send(f, { kind: "VIDEO", text: null, url: null, durationSec: null, localUrl: URL.createObjectURL(file) });
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

  const submit = () => void (editing ? saveEdit() : photo ? sendPhoto() : sendText());
  const tile = "flex flex-col items-center gap-1 rounded-xl bg-surface p-3 text-xs font-medium shadow-sm hover:bg-primary/5";

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface" id="chat">
      <div ref={list} className={cn("space-y-2 overflow-y-auto bg-surface-2/60 p-3", height)} style={{ backgroundImage: WATERMARK }} aria-live="polite" onClick={() => setSelected(null)}>
        {!loaded && <p className="text-center text-sm text-muted"><Loader2 className="mr-1 inline animate-spin" size={14} /> Carregando…</p>}
        {loaded && !msgs.length && <p className="py-8 text-center text-sm text-muted">Nenhuma mensagem ainda. Diga olá para {otherName}! 👋</p>}
        {msgs.map((m) =>
          m.kind === "SCHEDULE" && m.schedule ? (
            <div key={m.id} className="flex justify-center">
              <div className="w-full max-w-xs rounded-2xl border-2 border-primary/40 bg-surface p-3 text-sm shadow-sm">
                <p className="text-xs font-bold uppercase text-primary">📅 Agendamento</p>
                <p className="mt-1 font-semibold">{categoryLabel(m.schedule.category)} · {qtyLabel(m.schedule.unit, m.schedule.quantity)}</p>
                <p>{new Date(m.schedule.at).toLocaleString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                {m.schedule.cents != null && <p className="font-bold">{formatBRL(m.schedule.cents)}</p>}
                {m.text && <p className="mt-1 text-xs text-muted">{m.text}</p>}
                <p className="mt-1 text-xs">{BOOKING_LABEL[m.schedule.status]}</p>
                {m.bookingId && (
                  <Link href={`/pedidos/${m.bookingId}`} className="mt-2 block rounded-lg bg-primary py-1.5 text-center text-xs font-semibold text-primary-foreground">
                    {m.schedule.status === "PROPOSED" && !m.mine ? "Confirmar com o endereço" : "Ver pedido"}
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
              <div
                className={cn("relative max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm", m.mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-surface", selected === m.id && "ring-2 ring-accent")}
                onClick={(e) => {
                  if (!m.mine || m.state) return;
                  e.stopPropagation();
                  setSelected(selected === m.id ? null : m.id);
                }}
              >
                {m.kind === "IMAGE" && (m.localUrl || m.url) && (
                  <a href={m.url ?? m.localUrl} target="_blank" rel="noreferrer" className="mb-1 block" onClick={(e) => m.mine && e.preventDefault()}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.localUrl ?? m.url!} alt="Foto enviada na conversa" className="max-h-64 rounded-lg" loading="lazy" />
                  </a>
                )}
                {m.kind === "VIDEO" && (m.localUrl || m.url) && <video controls playsInline preload="metadata" src={m.localUrl ?? m.url!} className="mb-1 max-h-72 max-w-full rounded-lg" />}
                {m.kind === "AUDIO" && (m.localUrl || m.url) && (
                  <div className="flex items-center gap-2">
                    <audio controls preload="metadata" src={m.localUrl ?? m.url!} className="h-9 max-w-[220px]" />
                    {m.durationSec != null && <span className="text-xs opacity-80">{mmss(m.durationSec)}</span>}
                  </div>
                )}
                {m.text && <p className="whitespace-pre-wrap break-words">{m.text}</p>}
                <p className={cn("mt-0.5 flex items-center justify-end gap-1 text-[10px]", m.mine ? "text-primary-foreground/80" : "text-muted")}>
                  {m.edited && "editada · "}
                  {time(m.createdAt)}
                  {m.mine && (m.state === "sending" ? <Clock size={11} aria-label="Enviando" /> : m.state === "error" ? <X size={11} aria-label="Não enviada" /> : m.read ? <CheckCheck size={12} aria-label="Lida" /> : <Check size={12} aria-label="Enviada" />)}
                </p>
                {selected === m.id && (
                  <div className="mt-1 flex justify-end gap-1 rounded-xl border border-border bg-surface p-1 text-foreground shadow-lg">
                    {m.kind !== "AUDIO" && (
                      <button type="button" className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs hover:bg-surface-2" onClick={(e) => { e.stopPropagation(); setEditing(m); setText(m.text ?? ""); setSelected(null); }}>
                        <Pencil size={13} /> Editar
                      </button>
                    )}
                    <button type="button" className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-danger hover:bg-surface-2" onClick={(e) => { e.stopPropagation(); void remove(m); }}>
                      <Trash2 size={13} /> Apagar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ),
        )}
      </div>
      {error && <p className="bg-danger/10 px-3 py-1.5 text-xs text-danger">{error}</p>}
      {write ? (
        <div className="space-y-2 border-t border-border p-2">
          {menu === "grid" && (
            <div className="grid grid-cols-4 gap-2 rounded-xl bg-surface-2 p-2">
              <button type="button" className={tile} onClick={() => { setMenu(null); fileInput.current?.click(); }}><Camera size={20} className="text-primary" /> Foto</button>
              <button type="button" className={tile} onClick={() => { setMenu(null); videoInput.current?.click(); }}><Video size={20} className="text-primary" /> Vídeo</button>
              <button type="button" className={tile} onClick={async () => { await loadExtras(); setMenu("replies"); }}><Zap size={20} className="text-accent" /> Rápidas</button>
              {extras?.as !== "CLIENT" && scheduleAction && (
                <>
                  <button
                    type="button"
                    className={tile}
                    onClick={async () => {
                      const e = await loadExtras();
                      setMenu(null);
                      if (e?.payText) await sendText(e.payText);
                      else setError("Cadastre as suas formas de pagamento em Minha área → Pagamento e agendamento.");
                    }}
                  >
                    <CreditCard size={20} className="text-primary" /> Pagamento
                  </button>
                  <button type="button" className={tile} onClick={async () => { await loadExtras(); setMenu("schedule"); }}><CalendarPlus size={20} className="text-primary" /> Agendar</button>
                </>
              )}
            </div>
          )}
          {menu === "replies" && extras && (
            <div className="space-y-1 rounded-xl bg-surface-2 p-2">
              <div className="flex items-center justify-between px-1 text-xs font-semibold text-muted">Mensagens rápidas <button type="button" onClick={() => setMenu(null)} aria-label="Fechar"><X size={14} /></button></div>
              <div className="flex flex-wrap gap-2">
                {extras.quickReplies.map((q) => (
                  <button key={q} type="button" onClick={() => { setMenu(null); void sendText(q); }} className="rounded-full border border-primary/40 bg-surface px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10">{q}</button>
                ))}
                {!extras.quickReplies.length && <p className="text-xs text-muted">Cadastre em Minha área → Mensagens rápidas.</p>}
              </div>
            </div>
          )}
          {menu === "schedule" && extras && scheduleAction && (
            <ScheduleForm services={extras.services} action={scheduleAction} onClose={() => setMenu(null)} onDone={() => { setMenu(null); void poll(); }} />
          )}
          {editing && (
            <div className="flex items-center gap-2 rounded-lg bg-accent-soft px-3 py-1.5 text-xs">
              <Pencil size={13} className="text-accent" /> <span className="flex-1">Editando a mensagem</span>
              <button type="button" onClick={() => { setEditing(null); setText(""); }} aria-label="Cancelar edição"><X size={14} /></button>
            </div>
          )}
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
            <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); submit(); }}>
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
              <input ref={videoInput} type="file" accept="video/mp4,video/quicktime,video/webm,video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) void sendVideo(f); }} />
              <Button type="button" variant={menu ? "secondary" : "ghost"} size="sm" className="h-10 px-2" onClick={async () => { if (menu) setMenu(null); else { setMenu("grid"); void loadExtras(); } }} aria-label="Mais opções (foto, vídeo, mensagens rápidas, pagamento, agendar)">
                <LayoutGrid size={20} />
              </Button>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && window.matchMedia("(pointer: fine)").matches) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={1}
                maxLength={2000}
                placeholder={editing ? "Novo texto" : "Mensagem"}
                aria-label="Mensagem"
                className="max-h-32 min-h-10 flex-1 resize-none rounded-2xl border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {text.trim() || photo || editing ? (
                <Button type="submit" size="sm" className="h-10 w-10 rounded-full p-0" aria-label={editing ? "Salvar edição" : "Enviar"}>{editing ? <Check size={18} /> : <Send size={18} />}</Button>
              ) : (
                <Button type="button" size="sm" className="h-10 w-10 rounded-full p-0" onClick={startRec} aria-label="Gravar áudio"><Mic size={18} /></Button>
              )}
            </form>
          )}
        </div>
      ) : (
        <p className="border-t border-border px-3 py-2 text-center text-xs text-muted">Não é possível mandar mensagens nesta conversa.</p>
      )}
    </div>
  );
}

/** Formulário de agendamento (trabalhador): serviço, dia, hora, quantidade e valor. */
function ScheduleForm({ services, action, onClose, onDone }: { services: Extras["services"]; action: (p: ActionResult, d: FormData) => Promise<ActionResult>; onClose: () => void; onDone: () => void }) {
  const [cat, setCat] = useState(services[0]?.category ?? "");
  const s = services.find((x) => x.category === cat);
  const [unit, setUnit] = useState<PriceUnit>(s?.unit ?? "DIARIA");
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  if (!services.length) return <p className="rounded-xl bg-surface-2 p-3 text-xs text-muted">Crie um perfil (profissão) em Meu perfil para poder agendar.</p>;
  return (
    <div className="space-y-2 rounded-xl border border-primary/40 bg-surface-2 p-3">
      <div className="flex items-center justify-between text-sm font-semibold">📅 Agendar com o cliente <button type="button" onClick={onClose} aria-label="Fechar"><X size={16} /></button></div>
      <ActionForm
        action={async (p, d) => {
          const r = await action(p, d);
          if (r?.ok) setTimeout(onDone, 600);
          return r;
        }}
        className="space-y-2"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <Label htmlFor="sc-cat">Serviço</Label>
            <Select id="sc-cat" name="category" value={cat} onChange={(e) => { setCat(e.target.value); const n = services.find((x) => x.category === e.target.value); if (n) setUnit(n.unit); }}>
              {services.map((x) => <option key={x.category} value={x.category}>{x.label}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="sc-date">Dia</Label>
            <Input id="sc-date" name="date" type="date" min={today} defaultValue={today} required />
          </div>
          <div>
            <Label htmlFor="sc-time">Horário</Label>
            <Input id="sc-time" name="time" type="time" step={900} defaultValue="08:00" required />
          </div>
          <div>
            <Label htmlFor="sc-qty">Quantidade</Label>
            <Input id="sc-qty" name="quantity" type="number" min={1} max={30} defaultValue={1} required />
          </div>
          <div>
            <Label htmlFor="sc-unit">Cobrança</Label>
            <Select id="sc-unit" name="unit" value={unit} onChange={(e) => setUnit(e.target.value as PriceUnit)}>
              {(s?.units ?? [unit]).map((u) => <option key={u} value={u}>/ {UNIT_LABEL[u].one}</option>)}
            </Select>
          </div>
          <div className="col-span-2">
            <Label htmlFor="sc-price">Valor por {UNIT_LABEL[unit].one} (R$)</Label>
            <Input key={cat} id="sc-price" name="price" inputMode="decimal" defaultValue={s ? (s.priceCents / 100).toFixed(2).replace(".", ",") : ""} required />
          </div>
          <Input name="notes" maxLength={600} placeholder="Anotação para o cliente (opcional)" aria-label="Anotação" className="col-span-2" />
        </div>
        <SubmitButton className="w-full" pendingText="Agendando…">Agendar e reservar o horário</SubmitButton>
      </ActionForm>
    </div>
  );
}
