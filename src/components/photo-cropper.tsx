"use client";
import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Camera, ImagePlus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Recorta a área escolhida num quadrado de 640 px (JPEG). */
async function cropToBlob(src: string, area: Area): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((ok, fail) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = fail;
    i.src = src;
  });
  const size = 640;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, size, size);
  return new Promise((ok, fail) => canvas.toBlob((b) => (b ? ok(b) : fail(new Error("Não foi possível recortar a foto."))), "image/jpeg", 0.88));
}

/**
 * Foto de perfil: tirar com a câmera ou escolher da galeria, ajustar (arrastar e zoom) e ver a prévia redonda.
 * Chama onDone com a foto recortada.
 */
export function PhotoCropper({ initialUrl, onDone }: { initialUrl?: string | null; onDone: (blob: Blob | null, previewUrl: string | null) => void }) {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const camera = useRef<HTMLInputElement>(null);
  const gallery = useRef<HTMLInputElement>(null);

  const pick = (f: File | undefined) => {
    setError(null);
    if (!f) return;
    if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(f.type) && !/\.(jpe?g|png|webp|heic)$/i.test(f.name)) return setError("Escolha uma foto (JPG, PNG ou WebP).");
    if (f.size > 15 * 1024 * 1024) return setError("Foto grande demais (máximo 15 MB).");
    setSrc(URL.createObjectURL(f));
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };
  const onComplete = useCallback((_: Area, px: Area) => setArea(px), []);

  const confirm = async () => {
    if (!src || !area) return;
    try {
      const blob = await cropToBlob(src, area);
      const url = URL.createObjectURL(blob);
      setPreview(url);
      setSrc(null);
      onDone(blob, url);
    } catch (e) {
      setError((e as Error).message || "Não foi possível usar esta foto. Tente outra.");
    }
  };

  return (
    <div className="space-y-3">
      <input ref={camera} type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      <input ref={gallery} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      {src ? (
        <div className="space-y-3">
          <div className="relative h-72 overflow-hidden rounded-xl bg-black">
            <Cropper image={src} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onComplete} />
          </div>
          <label className="flex items-center gap-3 text-sm">
            Zoom
            <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 accent-[var(--primary)]" aria-label="Zoom da foto" />
          </label>
          <p className="text-xs text-muted">Arraste para enquadrar o rosto no círculo.</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setSrc(null)}>
              <RotateCcw size={16} /> Cancelar
            </Button>
            <Button type="button" className="flex-1" onClick={confirm}>
              Usar esta foto
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-border bg-surface-2">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Prévia da foto de perfil" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted">
                <Camera />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => camera.current?.click()}>
              <Camera size={16} /> Tirar foto
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => gallery.current?.click()}>
              <ImagePlus size={16} /> Escolher da galeria
            </Button>
          </div>
        </div>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
