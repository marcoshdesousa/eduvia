"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PhotoCropper } from "@/components/photo-cropper";
import { PlacePicker } from "@/components/place-picker";
import { ServiceFields } from "@/components/service-fields";
import { Button } from "@/components/ui/button";
import { FormError, Label, Textarea } from "@/components/ui/form";

export function NewProfileForm({ exclude, needPlace }: { exclude: string[]; needPlace: boolean }) {
  const router = useRouter();
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        if (!photo) return setError("Adicione uma foto para este perfil.");
        const data = new FormData(e.currentTarget);
        if (needPlace && !data.get("lat")) return setError("Marque no mapa a região onde você atende.");
        data.set("photo", photo, "foto.jpg");
        setBusy(true);
        const r = await fetch("/api/painel/perfil", { method: "POST", body: data }).catch(() => null);
        const body = (await r?.json().catch(() => ({}))) as { id?: string; error?: string } | undefined;
        if (!r?.ok || !body?.id) {
          setBusy(false);
          return setError(body?.error ?? "Não foi possível criar o perfil.");
        }
        router.replace(`/painel/perfil?p=${body.id}`);
        router.refresh();
      }}
    >
      <ServiceFields exclude={exclude} />
      <div className="space-y-2">
        <Label>Foto do perfil</Label>
        <p className="text-xs text-muted">Uma foto nítida sua (pode ser trabalhando). Passa confiança.</p>
        <PhotoCropper onDone={(b) => setPhoto(b)} />
      </div>
      {needPlace && (
        <div className="space-y-2">
          <Label>Onde você atende</Label>
          <p className="text-xs text-muted">Marque a região de onde você sai (pode ser o bairro). Os clientes veem só o bairro e a distância. Depois você pode incluir mais endereços.</p>
          <PlacePicker />
        </div>
      )}
      <div>
        <Label htmlFor="bio">Sobre você nesta profissão (opcional)</Label>
        <Textarea id="bio" name="bio" rows={3} maxLength={700} placeholder="Experiência, o que você faz de melhor…" />
      </div>
      <FormError message={error} />
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy && <Loader2 size={16} className="animate-spin" />} Criar perfil
      </Button>
    </form>
  );
}
