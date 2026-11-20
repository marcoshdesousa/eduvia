"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PhoneInput } from "@/components/masked-inputs";
import { PhotoCropper } from "@/components/photo-cropper";
import { PlacePicker } from "@/components/place-picker";
import { ServiceFields } from "@/components/service-fields";
import { Button } from "@/components/ui/button";
import { FormError, Input, Label, Textarea } from "@/components/ui/form";

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <fieldset className="space-y-3 rounded-2xl border border-border bg-surface p-4">
    <legend className="flex items-center gap-2 px-1 text-sm font-semibold">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs text-primary-foreground">{n}</span> {title}
    </legend>
    {children}
  </fieldset>
);

export function OnboardingForm({ maxBirth, trial }: { maxBirth: string; trial: boolean }) {
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
        const data = new FormData(e.currentTarget);
        if (!photo) return setError("Adicione uma foto do seu rosto.");
        if (!data.get("lat")) return setError("Marque no mapa onde você atende.");
        data.set("photo", photo, "foto.jpg");
        setBusy(true);
        const res = await fetch("/api/seja-prestador", { method: "POST", body: data }).catch(() => null);
        const body = (await res?.json().catch(() => ({}))) as { error?: string; next?: string } | undefined;
        if (!res?.ok) {
          setBusy(false);
          return setError(body?.error || "Não foi possível criar o perfil. Tente de novo.");
        }
        router.replace(body?.next ?? "/painel");
        router.refresh();
      }}
    >
      <Step n={1} title="Seus dados">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="birthDate">Data de nascimento</Label>
            <Input id="birthDate" name="birthDate" type="date" max={maxBirth} min="1920-01-01" required />
          </div>
          <div>
            <Label htmlFor="phone">Celular</Label>
            <PhoneInput />
          </div>
        </div>
        <p className="text-xs text-muted">O celular é só para a plataforma (segurança e Pix). Ele nunca aparece para os clientes.</p>
      </Step>

      <Step n={2} title="Foto do rosto">
        <p className="text-sm text-muted">Uma foto nítida, de frente, passa confiança.</p>
        <PhotoCropper onDone={(b) => setPhoto(b)} />
      </Step>

      <Step n={3} title="Seu primeiro serviço">
        <ServiceFields />
        <p className="text-xs text-muted">Depois você inclui outros serviços no painel.</p>
      </Step>

      <Step n={4} title="Onde você atende">
        <p className="text-sm text-muted">Marque a região de onde você sai (pode ser o bairro). Os clientes veem só o bairro e a distância, nunca o endereço.</p>
        <input type="hidden" name="label" value="Principal" />
        <PlacePicker />
      </Step>

      <Step n={5} title="Sobre você (opcional)">
        <Textarea name="bio" rows={3} maxLength={700} placeholder="Conte sua experiência, há quanto tempo trabalha, o que você faz de melhor…" aria-label="Bio" />
      </Step>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="terms" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
        <span>
          Tenho 18 anos ou mais, li os <Link href="/termos" target="_blank" className="text-primary underline">Termos de uso</Link> e sei que não posso passar telefone nem WhatsApp para os clientes.
        </span>
      </label>
      <FormError message={error} />
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy && <Loader2 size={16} className="animate-spin" />} {busy ? "Criando perfil…" : trial ? "Criar perfil e ganhar 3 dias grátis" : "Criar perfil"}
      </Button>
    </form>
  );
}
