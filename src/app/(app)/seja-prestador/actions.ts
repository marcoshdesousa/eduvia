"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/components/action-form";
import { MODE_COOKIE, requireUser } from "@/lib/session";
import { WorkerError, becomeWorker, checkPhone } from "@/lib/workers";

/** "Turbinar a conta": quem é cliente vira trabalhador (WhatsApp + 18 anos). */
export async function becomeWorkerAction(_: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requireUser();
  if (user.role === "ADMIN") return { error: "A conta de administração não pode ser trabalhador." };
  let next: string;
  try {
    if (d.get("adult") !== "on") throw new WorkerError("Para trabalhar pelo app é preciso ter 18 anos ou mais.");
    if (d.get("terms") !== "on") throw new WorkerError("Aceite os Termos de uso para continuar.");
    const { trial } = await becomeWorker(user, checkPhone(String(d.get("phone") ?? "")));
    next = trial ? "/painel/perfil/novo" : "/painel/plano";
  } catch (e) {
    if (e instanceof WorkerError) return { error: e.message };
    throw e;
  }
  (await cookies()).set(MODE_COOKIE, "trabalho", { path: "/", maxAge: 365 * 86_400, sameSite: "lax" });
  redirect(next);
}
