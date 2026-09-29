import { requireReadyUser } from "@/lib/session";
import { NewPreparationForm } from "./new-preparation-form";

export const metadata = { title: "Nova preparação" };

export default async function Page() {
  await requireReadyUser();
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Nova preparação</h1>
      <p className="mt-1 text-sm text-muted">Você pode ter várias preparações ao mesmo tempo — um concurso e uma matéria da faculdade, por exemplo.</p>
      <div className="mt-6">
        <NewPreparationForm />
      </div>
    </div>
  );
}
