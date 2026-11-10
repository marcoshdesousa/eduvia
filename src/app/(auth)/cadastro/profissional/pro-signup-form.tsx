"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CityPicker } from "@/components/city-picker";
import { CpfInput, PasswordPair, PhoneInput } from "@/components/masked-inputs";
import { PhotoCropper } from "@/components/photo-cropper";
import { Button } from "@/components/ui/button";
import { FormError, Input, Label } from "@/components/ui/form";

export function ProSignupForm({ ufs, maxBirth }: { ufs: { uf: string; name: string }[]; maxBirth: string }) {
  const router = useRouter();
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        if (!photo) return setError("Adicione uma foto do seu rosto.");
        const data = new FormData(e.currentTarget);
        data.set("photo", photo, "foto.jpg");
        setBusy(true);
        try {
          const res = await fetch("/api/cadastro/profissional", { method: "POST", body: data });
          const body = (await res.json().catch(() => ({}))) as { error?: string; next?: string };
          if (!res.ok) throw new Error(body.error || "Não foi possível criar a conta. Tente de novo.");
          router.replace(body.next ?? "/painel");
          router.refresh();
        } catch (err) {
          setError((err as Error).message);
          setBusy(false);
        }
      }}
    >
      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Seus dados</legend>
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" name="name" autoComplete="name" required minLength={5} maxLength={120} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="birthDate">Data de nascimento</Label>
            <Input id="birthDate" name="birthDate" type="date" max={maxBirth} min="1920-01-01" required />
          </div>
          <div>
            <Label htmlFor="cpf">CPF</Label>
            <CpfInput />
          </div>
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <PhoneInput name="whatsapp" />
          <p className="mt-1 text-xs text-muted">Para verificação e avisos importantes. Não aparece para os clientes.</p>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Foto do rosto</legend>
        <p className="text-sm text-muted">Uma foto nítida, de frente, ajuda os clientes a confiar em você.</p>
        <PhotoCropper onDone={(b) => setPhoto(b)} />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Onde você atende</legend>
        <CityPicker ufs={ufs} />
        <p className="text-xs text-muted">Depois você pode incluir outros municípios no seu perfil. Não pedimos o seu endereço.</p>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Senha</legend>
        <PasswordPair />
      </fieldset>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="terms" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
        <span>
          Tenho 18 anos ou mais e aceito os <Link href="/termos" target="_blank" className="text-primary underline">Termos de uso</Link> e a{" "}
          <Link href="/privacidade" target="_blank" className="text-primary underline">Política de privacidade</Link>.
        </span>
      </label>
      <FormError message={error} />
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy && <Loader2 size={16} className="animate-spin" />} {busy ? "Criando conta…" : "Criar conta de profissional"}
      </Button>
    </form>
  );
}
