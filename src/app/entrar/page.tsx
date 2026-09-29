import { redirect } from "next/navigation";
import { AuthShell } from "@/components/brand";
import { googleEnabled } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "./login-form";

export const metadata = { title: "Entrar" };

export default async function Page() {
  if (await getCurrentUser()) redirect("/inicio");
  return (
    <AuthShell title="Entrar" subtitle="Bom te ver de novo!">
      <LoginForm google={googleEnabled} />
    </AuthShell>
  );
}
