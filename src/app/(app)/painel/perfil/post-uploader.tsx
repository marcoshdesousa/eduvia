"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError, Input } from "@/components/ui/form";

/** Reduz a foto no aparelho (lado maior 1600 px, JPEG) antes de enviar. */
async function shrink(file: File): Promise<Blob> {
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
    return await new Promise((ok, fail) => c.toBlob((b) => (b ? ok(b) : fail(new Error("Não foi possível ler a foto."))), "image/jpeg", 0.85));
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function PostUploader({ left, serviceId }: { left: number; serviceId: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (left <= 0) return <p className="text-center text-sm text-muted">Este perfil já tem 8 fotos. Apague uma para pôr outra.</p>;
  return (
    <div className="space-y-3">
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          setFile(f);
          setPreview(f ? URL.createObjectURL(f) : null);
          setError(null);
        }}
      />
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Prévia" className="max-h-72 w-full rounded-xl object-cover" />
      ) : (
        <button type="button" onClick={() => input.current?.click()} className="flex h-32 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-sm text-muted hover:border-primary">
          <ImagePlus size={24} /> Escolher foto de um trabalho
        </button>
      )}
      {file && (
        <>
          <Input value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={300} placeholder="Legenda (opcional). Ex.: Limpeza pós-obra em apartamento" aria-label="Legenda" />
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => { setFile(null); setPreview(null); }}>Trocar</Button>
            <Button
              type="button"
              className="flex-1"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError(null);
                try {
                  const data = new FormData();
                  data.set("image", await shrink(file), "foto.jpg");
                  data.set("caption", caption);
                  data.set("serviceId", serviceId);
                  const r = await fetch("/api/painel/post", { method: "POST", body: data });
                  const body = (await r.json().catch(() => ({}))) as { error?: string };
                  if (!r.ok) throw new Error(body.error ?? "Não foi possível publicar.");
                  setFile(null);
                  setPreview(null);
                  setCaption("");
                  router.refresh();
                } catch (e) {
                  setError((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy && <Loader2 size={16} className="animate-spin" />} Publicar
            </Button>
          </div>
        </>
      )}
      <FormError message={error} />
    </div>
  );
}
