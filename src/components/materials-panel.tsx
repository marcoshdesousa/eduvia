"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ClipboardPaste, ExternalLink, FileText, Loader2, RotateCw, Trash2, Upload } from "lucide-react";
import type { MaterialRow } from "@/lib/materials/list";
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
}: {
  preparationId: string;
  initial: MaterialRow[];
  subjects: { id: string; name: string }[];
  syllabusRole: "EDITAL" | "EMENTA" | null;
  syllabusRequired: boolean;
}) {
  const router = useRouter();
  const [materials, setMaterials] = useState(initial);
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
      const json = (await res.json()) as { materials: MaterialRow[] };
      setMaterials((prev) => {
        const becameReady = json.materials.some((m) => m.status === "READY" && prev.find((p) => p.id === m.id)?.status !== "READY");
        if (becameReady) router.refresh();
        return json.materials;
      });
    }
  }, [preparationId, router]);

  const busy = uploads.length > 0 || materials.some((m) => ["UPLOADING", "QUEUED", "PROCESSING"].includes(m.status));
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

  return (
    <div className="space-y-4">
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
                  {m.status === "ERROR" ? m.errorMessage : m.status === "READY" ? [m.subjectName, m.pageCount && `${m.pageCount} pág.`].filter(Boolean).join(" · ") || m.kind : m.progressStep ?? "Aguardando"}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                {m.status === "ERROR" && <Button size="sm" variant="ghost" onClick={() => retry(m.id)} aria-label="Tentar de novo"><RotateCw size={15} /></Button>}
                {m.status === "READY" && (
                  <a href={`/api/materials/${m.id}/file`} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center rounded-lg px-2 text-muted hover:bg-surface-2" aria-label="Abrir arquivo"><ExternalLink size={15} /></a>
                )}
                <Button size="sm" variant="ghost" onClick={() => remove(m.id, m.title)} aria-label="Remover"><Trash2 size={15} /></Button>
              </div>
            </li>
          );
        })}
        {!materials.length && !uploads.length && <li className="p-4 text-center text-sm text-muted">Nenhum material ainda.</li>}
      </ul>
    </div>
  );
}
