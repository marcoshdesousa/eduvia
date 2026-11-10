import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { SUBSCRIPTION_CENTS, formatBRL } from "@/lib/domain";
import { UFS } from "@/lib/places";
import { ProSignupForm } from "./pro-signup-form";

export const metadata: Metadata = { title: "Cadastro de profissional" };

export default function ProSignup() {
  const max = new Date();
  max.setFullYear(max.getFullYear() - 18);
  return (
    <Card className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Cadastro de profissional</h1>
        <p className="text-sm text-muted">
          Precisa ter 18 anos ou mais. Depois do cadastro, você define preço e serviços, passa pela verificação e assina ({formatBRL(SUBSCRIPTION_CENTS)}/mês, sem comissão) para aparecer na vitrine.
        </p>
      </div>
      <ProSignupForm ufs={UFS} maxBirth={max.toISOString().slice(0, 10)} />
    </Card>
  );
}
