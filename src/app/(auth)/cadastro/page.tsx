import Link from "next/link";
import type { Metadata } from "next";
import { Home, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SUBSCRIPTION_CENTS, formatBRL } from "@/lib/domain";

export const metadata: Metadata = { title: "Criar conta" };

export default async function SignupChoice({ searchParams }: { searchParams: Promise<{ voltar?: string }> }) {
  const { voltar } = await searchParams;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Criar conta</h1>
      <p className="text-muted">Como você quer usar a HoraLimp?</p>
      <Link href={`/cadastro/cliente${voltar ? `?voltar=${encodeURIComponent(voltar)}` : ""}`} className="block">
        <Card className="flex items-start gap-4 transition hover:border-primary">
          <Home className="mt-1 shrink-0 text-primary" />
          <div>
            <p className="font-semibold">Quero contratar limpeza</p>
            <p className="text-sm text-muted">Grátis. Só nome, CPF e senha.</p>
          </div>
        </Card>
      </Link>
      <Link href="/cadastro/profissional" className="block">
        <Card className="flex items-start gap-4 transition hover:border-primary">
          <Sparkles className="mt-1 shrink-0 text-accent" />
          <div>
            <p className="font-semibold">Sou profissional de limpeza</p>
            <p className="text-sm text-muted">Apareça para clientes da sua cidade. Assinatura de {formatBRL(SUBSCRIPTION_CENTS)}/mês, sem comissão. Precisa ter 18 anos ou mais.</p>
          </div>
        </Card>
      </Link>
      <p className="text-center text-sm text-muted">Já tem conta? <Link href="/entrar" className="text-primary hover:underline">Entrar</Link></p>
    </div>
  );
}
