import { redirect } from "next/navigation";
import { AuthShell } from "@/components/brand";
import { requireUser } from "@/lib/session";
import { suggestHandle } from "@/lib/core/handle";
import { OnboardingForm } from "./onboarding-form";

export const metadata = { title: "Complete seu cadastro" };

export default async function Page() {
  const user = await requireUser();
  if (user.handle && user.termsAcceptedAt && user.cpf && user.phone) redirect("/inicio");
  return (
    <AuthShell title={`Olá, ${user.name.split(" ")[0]}!`} subtitle="Complete seu cadastro para continuar.">
      <OnboardingForm suggested={user.handle ?? suggestHandle(user.name)} phone={user.phone ?? ""} />
    </AuthShell>
  );
}
