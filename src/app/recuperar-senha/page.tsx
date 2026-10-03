import Link from "next/link";
import { AuthShell } from "@/components/brand";
import { ResetForm } from "./reset-form";

export const metadata = { title: "Esqueci a senha" };

export default function Page() {
  return (
    <AuthShell title="Esqueci a senha" subtitle="Ninguém consegue ver a senha antiga (nem a gente), mas você cria uma nova agora.">
      <ResetForm />
      <p className="mt-6 text-sm"><Link href="/entrar" className="text-primary">Voltar para entrar</Link></p>
    </AuthShell>
  );
}
