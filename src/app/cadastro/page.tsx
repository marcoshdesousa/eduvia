import { redirect } from "next/navigation";
import { AuthShell } from "@/components/brand";
import { getCurrentUser } from "@/lib/session";
import { SignupForm } from "./signup-form";

export const metadata = { title: "Criar conta" };

export default async function Page() {
  if (await getCurrentUser()) redirect("/inicio");
  return (
    <AuthShell title="Criar conta" subtitle="Comece grátis. Leva 2 minutos.">
      <SignupForm />
    </AuthShell>
  );
}
