import Link from "next/link";
import { AuthShell } from "@/components/brand";
import { ResetForm } from "./reset-form";

export const metadata = { title: "Esqueci a senha" };

export default function Page() {
  return (
    <AuthShell title="Esqueci a senha" subtitle="Crie uma nova senha com seu CPF.">
      <ResetForm />
      <p className="mt-6 text-sm"><Link href="/entrar" className="text-primary">Voltar para entrar</Link></p>
    </AuthShell>
  );
}
