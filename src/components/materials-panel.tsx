"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ClipboardPaste, ExternalLink, FileText, Loader2, Lock, RotateCw, Trash2, Upload } from "lucide-react";
import type { LessonsState, MaterialRow } from "@/lib/materials/list";
import { Button } from "@/components/ui/button";
import { Badge, Progress } from "@/components/ui/badge";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { ACCEPT } from "@/lib/materials/kinds";
import { cn } from "@/lib/utils";

type Uploading = { key: string; name: string; progress: number; error?: string };
type Role = "CONTENT" | "EDITAL" | "EMENTA";

const STATUS: Record<string, { label: string; tone: "neutral" | "primary" | "success" | "danger" }> = {
  UPLOADING: { label: "Enviando", tone: "neutral" },
  QUEUED: { label: "Na fila", tone: "neutral" },
  PROCESSING: { label: "Processando", tone: "primary" },
  READY: { label: "Pronto", tone: "success" },
  ERROR: { label: "Erro", tone: "danger" },
};
const ROLE_LABEL: Record<string, string> = { CONTENT: "Conteúdo", EDITAL: "Edital", EMENTA: "Ementa/programa" };

function putWithProgress(url: string, file: File, contentType: string, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("content-type", contentType);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Falha no envio (${xhr.status})`)));
    xhr.onerror = () => reject(new Error("Falha de conexão no envio"));
    xhr.send(file);
  });
}

export function MaterialsPanel({
  preparationId,
  initial,
  subjects,
  syllabusRole,
  syllabusRequired,
  lockedMessage,
  initialLessons,
}: {
  preparationId: string;
  initial: MaterialRow[];
  initialLessons: LessonsState;
  subjects: { id: string; name: string }[];
  syllabusRole: "EDITAL" | "EMENTA" | null;
  syllabusRequired: boolean;
  /** Modo limitado: envio bloqueado com esta mensagem. */
  lockedMessage?: string | null;
}) {
  const router = useRouter();
  const [materials, setMaterials] = useState(initial);
  const [lessons, setLessons] = useState(initialLessons);
  const [uploads, setUploads] = useState<Uploading[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [dragging, setDragging] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const syllabusRef = useRef<HTMLInputElement>(null);
  const hasSyllabus = materials.some((m) => m.role !== "CONTENT");

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/preparations/${preparationId}/materials`, { cache: "no-store" });
    if (res.ok) {
      const json = (await res.json()) as { materials: MaterialRow[]; lessons: LessonsState };
      setLessons((prev) => {
        if (prev.status === "RUNNING" && json.lessons.status === "DONE") router.refresh();
        return json.lessons;
      });
      setMaterials((prev) => {
        const becameReady = json.materials.some((m) => m.status === "READY" && prev.find((p) => p.id === m.id)?.status !== "READY");
        if (becameReady) router.refresh();
        return json.materials;
      });
    }
  }, [preparationId, router]);

  const loading = uploads.length > 0 || materials.some((m) => ["UPLOADING", "QUEUED", "PROCESSING"].includes(m.status));
  const busy = loading || lessons.status === "RUNNING";
  useEffect(() => {
    if (!busy) return;
    const t = setInterval(refresh, 3000);
    return () => clearInterval(t);
  }, [busy, refresh]);

  async function uploadFiles(files: FileList | File[], role: Role) {
    setError(null);
    const list = Array.from(files);
    await Promise.all(
      list.map(async (file) => {
        const key = `${file.name}-${file.size}-${Math.random()}`;
        setUploads((u) => [...u, { key, name: file.name, progress: 0 }]);
        const update = (patch: Partial<Uploading>) => setUploads((u) => u.map((x) => (x.key === key ? { ...x, ...patch } : x)));
        try {
          const init = await fetch("/api/materials", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ preparationId, filename: file.name, size: file.size, type: file.type, role, subjectId: role === "CONTENT" && subjectId ? subjectId : null }),
          });
          const json = await init.json();
          if (!init.ok) throw new Error(json.error ?? "Não foi possível enviar");
          await refresh();
          await putWithProgress(json.uploadUrl, file, json.contentType, (p) => update({ progress: p }));
          await fetch(`/api/materials/${json.materialId}/complete`, { method: "POST" });
          setUploads((u) => u.filter((x) => x.key !== key));
          await refresh();
        } catch (e) {
          update({ error: e instanceof Error ? e.message : "Erro no envio" });
          setTimeout(() => setUploads((u) => u.filter((x) => x.key !== key)), 8000);
        }
      }),
    );
  }

  async function retry(id: string) {
    await fetch(`/api/materials/${id}/complete`, { method: "POST" });
    refresh();
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Remover "${title}"? Os assuntos criados a partir dele saem do plano.`)) return;
    await fetch(`/api/materials/${id}`, { method: "DELETE" });
    await refresh();
    router.refresh();
  }

  async function submitPaste(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/materials/text", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ preparationId, title: f.get("title"), text: f.get("text"), role: "CONTENT", subjectId: subjectId || null }),
    });
    const json = await res.json();
    if (!res.ok) return setError(json.error ?? "Não foi possível salvar o texto");
    setPasteOpen(false);
    refresh();
  }

  if (lockedMessage) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm">
          <span className="inline-flex items-center gap-2"><Lock size={16} className="text-danger" />{lockedMessage}</span>
          <Link href="/assinatura" className="font-semibold text-primary">Assinar plano</Link>
        </div>
        <MaterialList materials={materials} onRemove={remove} onRetry={retry} />
      </div>
    );
  }

  async function generate() {
    setError(null);
    const res = await fetch(`/api/preparations/${preparationId}/lessons`, { method: "POST" });
    if (!res.ok) return setError(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "Não foi possível gerar as aulas agora.");
    setLessons((l) => ({ ...l, status: "RUNNING", step: "Começando...", progress: 1, startedAt: new Date().toISOString() }));
  }

  return (
    <div className="space-y-4">
      <GenerateLessons lessons={lessons} loading={loading} ready={materials.filter((m) => m.status === "READY").length} onGenerate={generate} />
      {syllabusRole && (
        <div className={cn("rounded-xl border p-4", syllabusRequired && !hasSyllabus ? "border-warning/50 bg-warning/10" : "border-border bg-surface")}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-medium">{syllabusRole === "EDITAL" ? "Edital do concurso" : "Ementa / programa (opcional)"}</div>
              <p className="text-sm text-muted">
                {syllabusRole === "EDITAL"
                  ? "Obrigatório. A IA identifica disciplinas, assuntos, pesos e banca e organiza o plano por prioridade."
                  : "Se tiver a ementa, conteúdo programático ou matriz de referência, envie: o plano segue a ordem e os assuntos dela."}
              </p>
            </div>
            <Button type="button" variant={syllabusRequired && !hasSyllabus ? "primary" : "outline"} onClick={() => syllabusRef.current?.click()}>
              <Upload size={16} /> {hasSyllabus ? "Enviar outro" : "Enviar"}
            </Button>
            <input ref={syllabusRef} type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg" className="hidden" onChange={(e) => e.target.files && uploadFiles(e.target.files, syllabusRole)} />
          </div>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          uploadFiles(e.dataTransfer.files, "CONTENT");
        }}
        className={cn("rounded-xl border-2 border-dashed p-6 text-center transition-colors", dragging ? "border-primary bg-primary/10" : "border-border")}
      >
        <Upload className="mx-auto text-muted" />
        <p className="mt-2 font-medium">Arraste seus materiais aqui</p>
        <p className="text-sm text-muted">PDF (inclusive escaneado), DOCX, imagens ou texto. Quantos arquivos quiser.</p>
        <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
          {subjects.length > 0 && (
            <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-auto" aria-label="Disciplina do material">
              <option value="">Disciplina: detectar automaticamente</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>Disciplina: {s.name}</option>)}
            </Select>
          )}
          <Button type="button" onClick={() => fileRef.current?.click()}><FileText size={16} /> Escolher arquivos</Button>
          <Button type="button" variant="outline" onClick={() => setPasteOpen((v) => !v)}><ClipboardPaste size={16} /> Colar texto</Button>
        </div>
        <input ref={fileRef} type="file" multiple accept={ACCEPT} className="hidden" onChange={(e) => e.target.files && uploadFiles(e.target.files, "CONTENT")} />
      </div>

      {pasteOpen && (
        <form onSubmit={submitPaste} className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <Field label="Título" htmlFor="paste-title"><Input id="paste-title" name="title" required /></Field>
          <Field label="Texto" htmlFor="paste-text"><Textarea id="paste-text" name="text" rows={8} required /></Field>
          <Button>Salvar texto</Button>
        </form>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {uploads.length > 0 && (
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {uploads.map((u) => (
            <li key={u.key} className="p-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate">{u.name}</span>
                <span className={u.error ? "text-danger" : "text-muted"}>{u.error ?? `${Math.round(u.progress * 100)}%`}</span>
              </div>
              {!u.error && <Progress value={u.progress} className="mt-2" />}
            </li>
          ))}
        </ul>
      )}
      <MaterialList materials={materials} onRemove={remove} onRetry={retry} />
    </div>
  );
}

/**
 * Botão "Gerar aulas", em cima da lista: cinza-alaranjado enquanto os arquivos carregam; quando todos
 * estão prontos, fica laranja. Gerando: cronômetro, etapa e porcentagem.
 */
function GenerateLessons({ lessons, loading, ready, onGenerate }: { lessons: LessonsState; loading: boolean; ready: number; onGenerate: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  const running = lessons.status === "RUNNING";
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [running]);
  if (!ready && !loading) return null;
  if (running) {
    const secs = lessons.startedAt ? Math.max(0, Math.floor((now - Date.parse(lessons.startedAt)) / 1000)) : 0;
    return (
      <div className="space-y-2 rounded-xl border border-primary/50 bg-primary/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-semibold"><Loader2 size={18} className="animate-spin text-primary" /> Gerando suas aulas</p>
          <span className="font-mono text-lg tabular-nums" aria-label="Tempo">{String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}</span>
        </div>
        <p className="text-sm text-muted">{lessons.step ?? "Lendo seus materiais..."}</p>
        <MaterialProgress target={lessons.progress} />
        <p className="text-xs text-muted">As IAs leem todos os seus arquivos e dividem TODO o conteúdo em aulas, na ordem do material. Pode sair da tela: continuamos sozinhos.</p>
      </div>
    );
  }
  const done = lessons.status === "DONE" && lessons.pending === 0;
  const canGenerate = !loading && ready > 0 && !done;
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold transition",
          canGenerate ? "bg-primary text-primary-foreground hover:brightness-110" : done ? "bg-success/15 text-success" : "cursor-not-allowed bg-primary/35 text-primary-foreground/70 saturate-50",
        )}
      >
        {done ? <><CheckCircle2 size={18} /> Aulas geradas</> : loading ? <><Loader2 size={18} className="animate-spin" /> Carregando os arquivos...</> : <>✨ Gerar aulas{lessons.status === "DONE" && lessons.pending ? ` (${lessons.pending} arquivo${lessons.pending > 1 ? "s" : ""} novo${lessons.pending > 1 ? "s" : ""})` : ""}</>}
      </button>
      {lessons.status === "ERROR" && <p className="text-sm text-danger">{lessons.step}</p>}
      {loading && <p className="text-center text-xs text-muted">O botão libera quando todos os arquivos estiverem prontos.</p>}
    </div>
  );
}

/**
 * Porcentagem do processamento: conta de 1 em 1 até a etapa atual e continua andando devagar
 * (cada vez mais devagar) até a próxima, sem ficar parada e sem chegar a 100% antes de terminar.
 */
function MaterialProgress({ target }: { target: number }) {
  const [shown, setShown] = useState(0);
  const next = target >= 88 ? 99 : target >= 48 ? 87 : target >= 40 ? 47 : target >= 36 ? 39 : target >= 8 ? 35 : 7;
  useEffect(() => {
    let ticks = 0;
    const id = setInterval(() => {
      ticks++;
      setShown((s) => {
        if (s < target) return s + 1; // etapa concluída: alcança rápido, de 1 em 1
        if (s >= 98) return s;
        const near = Math.min(1, (s - target) / Math.max(1, next - target));
        // vai desacelerando perto do fim da etapa; passou dela, continua bem devagar (nunca fica parada)
        const every = s >= next ? 50 : 1 + Math.floor(near * near * 40);
        return ticks % every === 0 ? s + 1 : s;
      });
    }, 120);
    return () => clearInterval(id);
  }, [target, next]);
  return (
    <div className="mt-1 flex items-center gap-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={shown}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-primary transition-[width] duration-150" style={{ width: `${shown}%` }} />
      </div>
      <span className="w-9 text-right text-xs tabular-nums text-muted">{shown}%</span>
    </div>
  );
}

function MaterialList({ materials, onRemove, onRetry }: { materials: MaterialRow[]; onRemove: (id: string, title: string) => void; onRetry: (id: string) => void }) {
  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
      {materials.map((m) => {
        const s = STATUS[m.status];
        return (
          <li key={m.id} className="flex items-center gap-3 p-3">
            <div className="shrink-0">
              {m.status === "READY" ? <CheckCircle2 size={18} className="text-success" /> : m.status === "ERROR" ? <AlertCircle size={18} className="text-danger" /> : <Loader2 size={18} className="animate-spin text-primary" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-medium">{m.title}</span>
                {m.role !== "CONTENT" && <Badge tone="primary">{ROLE_LABEL[m.role]}</Badge>}
                <Badge tone={s.tone}>{s.label}</Badge>
              </div>
              <div className="truncate text-xs text-muted">
                {m.status === "ERROR"
                  ? m.errorMessage
                  : m.status === "READY"
                    ? [m.subjectName, m.pageCount && `${m.pageCount} pág.`].filter(Boolean).join(" · ") || m.kind
                    : m.status === "QUEUED" && !m.progressStep && m.ahead
                      ? `Na fila: ${m.ahead} arquivo${m.ahead > 1 ? "s" : ""} na frente. Pode sair da tela.`
                      : m.progressStep ?? "Aguardando"}
              </div>
              {m.status === "PROCESSING" && <MaterialProgress target={m.progress} />}
            </div>
            <div className="flex shrink-0 gap-1">
              {m.status === "ERROR" && <Button size="sm" variant="ghost" onClick={() => onRetry(m.id)} aria-label="Tentar de novo"><RotateCw size={15} /></Button>}
              {m.status === "READY" && (
                <a href={`/fonte/${m.id}?p=1`} data-title={m.title} className="inline-flex h-8 items-center rounded-lg px-2 text-muted hover:bg-surface-2" aria-label="Abrir arquivo"><ExternalLink size={15} /></a>
              )}
              <Button size="sm" variant="ghost" onClick={() => onRemove(m.id, m.title)} aria-label="Remover"><Trash2 size={15} /></Button>
            </div>
          </li>
        );
      })}
      {!materials.length && <li className="p-4 text-center text-sm text-muted">Nenhum material ainda.</li>}
    </ul>
  );
}
