import { redirect } from "next/navigation";
import { AuthShell } from "@/components/brand";
import { getCurrentUser } from "@/lib/session";
import { SignupForm } from "./signup-form";

export const metadata = { title: "Criar conta" };

export default async function Page({ searchParams }: { searchParams: Promise<{ cupom?: string }> }) {
  if (await getCurrentUser()) redirect("/inicio");
  const cupom = String((await searchParams).cupom ?? "").replace(/\D/g, "").slice(0, 6);
  return (
    <AuthShell title="Criar conta" subtitle="Estude para o ENEM de graça. Leva 2 minutos.">
      <SignupForm coupon={cupom} />
    </AuthShell>
  );
}
