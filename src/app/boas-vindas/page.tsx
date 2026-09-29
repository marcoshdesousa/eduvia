import { redirect } from "next/navigation";
import { AuthShell } from "@/components/brand";
import { requireUser } from "@/lib/session";
import { suggestHandle } from "@/lib/core/handle";
import { OnboardingForm } from "./onboarding-form";

export const metadata = { title: "Boas-vindas" };

export default async function Page({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const user = await requireUser();
  if (user.handle && user.termsAcceptedAt && user.birthDate) redirect("/inicio");
  const { erro } = await searchParams;
  return (
    <AuthShell title={`Boas-vindas, ${user.name.split(" ")[0]}!`} subtitle="Só faltam alguns dados para começar.">
      <OnboardingForm suggested={user.handle ?? suggestHandle(user.name)} initialError={erro} />
    </AuthShell>
  );
}
