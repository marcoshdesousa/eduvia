import type { Metadata } from "next";
import { PageTitle } from "@/components/bits";
import { InstallSteps } from "./install-steps";

export const metadata: Metadata = { title: "Instalar o app" };

export default function InstallPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <PageTitle title="Instale o app" subtitle="O Diária Paga funciona como aplicativo no seu celular, sem precisar de loja. Leva 10 segundos." />
      <InstallSteps />
    </div>
  );
}
