"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PhotoCropper } from "@/components/photo-cropper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form";

export function PhotoEditor({ url, endpoint }: { url: string | null; endpoint: string }) {
  const router = useRouter();
  const [blob, setBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ error?: string; ok?: string } | null>(null);
  return (
    <div className="space-y-3">
      <PhotoCropper initialUrl={url} onDone={(b) => { setBlob(b); setMsg(null); }} />
      {blob && (
        <Button
          type="button"
          className="w-full"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            const data = new FormData();
            data.set("photo", blob, "foto.jpg");
            const r = await fetch(endpoint, { method: "POST", body: data }).catch(() => null);
            const body = (await r?.json().catch(() => ({}))) as { error?: string };
            setBusy(false);
            if (!r?.ok) return setMsg({ error: body?.error ?? "Não foi possível salvar a foto." });
            setBlob(null);
            setMsg({ ok: "Foto atualizada." });
            router.refresh();
          }}
        >
          {busy && <Loader2 size={16} className="animate-spin" />} Salvar foto
        </Button>
      )}
      <FormError message={msg?.error} />
      {msg?.ok && <p className="text-sm text-success">{msg.ok}</p>}
    </div>
  );
}
