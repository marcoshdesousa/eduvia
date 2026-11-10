"use server";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/components/action-form";
import { AccountError, checkCpf, checkName, checkPassword, createAccount, signInWithCpf } from "@/lib/accounts";
import { homeOf } from "@/lib/session";
import { notify } from "@/lib/notifications";

const str = (d: FormData, k: string) => String(d.get(k) ?? "");

/** Só volta para páginas do próprio site (nunca para outro endereço). */
const safeNext = (n: string) => (/^\/(?!\/)[\w\-/?=&%.]*$/.test(n) ? n : null);

export async function loginAction(_: ActionResult, d: FormData): Promise<ActionResult> {
  let to: string;
  try {
    const user = await signInWithCpf(str(d, "cpf"), str(d, "password"));
    to = safeNext(str(d, "voltar")) ?? homeOf(user);
  } catch (e) {
    if (e instanceof AccountError) return { error: e.message };
    throw e;
  }
  redirect(to);
}

export async function signupClientAction(_: ActionResult, d: FormData): Promise<ActionResult> {
  let next: string;
  try {
    if (d.get("terms") !== "on") throw new AccountError("Para criar a conta, aceite os Termos de uso e a Política de privacidade.");
    const name = checkName(str(d, "name"));
    const cpf = checkCpf(str(d, "cpf"));
    checkPassword(str(d, "password"), str(d, "passwordConfirm"));
    const id = await createAccount({ name, cpf, password: str(d, "password"), role: "CLIENT" });
    await signInWithCpf(cpf, str(d, "password"));
    await notify(id, { title: "Cadastro concluído 🎉", body: "Agora é só escolher a cidade e encontrar um profissional.", href: "/buscar" });
    next = safeNext(str(d, "voltar")) ?? "/buscar";
  } catch (e) {
    if (e instanceof AccountError) return { error: e.message };
    throw e;
  }
  redirect(next);
}
