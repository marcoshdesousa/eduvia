"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoCropper } from "@/components/photo-cropper";
import { FormError } from "@/components/ui/form";

export function PhotoEditor({ url }: { url: string | null }) {
  const router = useRouter();
  const [state, setState] = useState<{ error?: string; ok?: string; busy?: boolean }>({});
  return (
    <div className="space-y-2">
      <PhotoCropper
        initialUrl={url}
        onDone={async (blob) => {
          if (!blob) return;
          setState({ busy: true });
          const data = new FormData();
          data.set("photo", blob, "foto.jpg");
          const res = await fetch("/api/painel/foto", { method: "POST", body: data }).catch(() => null);
          const body = (await res?.json().catch(() => ({}))) as { error?: string } | undefined;
          if (!res?.ok) return setState({ error: body?.error || "Não foi possível salvar a foto." });
          setState({ ok: "Foto atualizada." });
          router.refresh();
        }}
      />
      {state.busy && <p className="text-sm text-muted">Salvando a foto…</p>}
      <FormError message={state.error} />
      {state.ok && <p className="text-sm text-success">{state.ok}</p>}
    </div>
  );
}
