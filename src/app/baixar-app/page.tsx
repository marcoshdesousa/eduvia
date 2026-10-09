import Link from "next/link";
import { Smartphone } from "lucide-react";
import { AuthShell } from "@/components/brand";
import { InstallSteps } from "@/components/install-app";
import { RegisterServiceWorker } from "@/components/push-settings";
import { buttonClass } from "@/components/ui/button";

export const metadata = { title: "Baixar o app" };

/** Passo a passo para instalar o app (aberto para todo mundo, sem precisar entrar). */
export default function Page() {
  return (
    <AuthShell title="Baixe o app do Eduvia" subtitle="Direto pelo navegador, sem loja. Leva menos de 1 minuto.">
      <div className="space-y-4">
        <p className="flex items-center gap-2 text-sm text-muted"><Smartphone size={16} className="text-primary" /> O app abre mais rápido e avisa a hora de estudar.</p>
        <InstallSteps />
        <Link href="/cadastro" className={buttonClass("primary", "md", "w-full")}>Criar conta grátis</Link>
        <p className="text-center text-sm text-muted">Já tem conta? <Link href="/entrar" className="font-medium text-primary">Entrar</Link></p>
      </div>
      <RegisterServiceWorker />
    </AuthShell>
  );
}
