import { redirect } from "next/navigation";

/** Simulados agora são só do ENEM (questões reais e o tempo da prova). */
export default function Page() {
  redirect("/simulados/enem");
}
