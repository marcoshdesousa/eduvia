"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/components/action-form";
import { AccountError, checkCpf, checkName, checkPassword, createAccount, signInWithCpf } from "@/lib/accounts";
import { db } from "@/lib/db";
import { MODE_COOKIE, homeOf } from "@/lib/session";
import { notify } from "@/lib/notifications";
import { WorkerError, becomeWorker, checkPhone } from "@/lib/workers";

const str = (d: FormData, k: string) => String(d.get(k) ?? "");

/** Só volta para páginas do próprio site (nunca para outro endereço). */
const safeNext = (n: string) => (/^\/(?!\/)[\w\-/?=&%.]*$/.test(n) ? n : null);

export async function loginAction(_: ActionResult, d: FormData): Promise<ActionResult> {
  let to: string;
  try {
    const user = await signInWithCpf(str(d, "cpf"), str(d, "password"));
    const pro = await db.providerProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
    to = safeNext(str(d, "voltar")) ?? (pro && user.role !== "ADMIN" ? "/painel" : homeOf(user));
  } catch (e) {
    if (e instanceof AccountError) return { error: e.message };
    throw e;
  }
  redirect(to);
}

/** Cadastro: cliente (nome, CPF e senha) ou trabalhador (+ WhatsApp). Quem entrou por um convite fica ligado a quem convidou. */
export async function signupAction(_: ActionResult, d: FormData): Promise<ActionResult> {
  let next: string;
  try {
    if (d.get("terms") !== "on") throw new AccountError("Para criar a conta, aceite os Termos de uso e a Política de privacidade.");
    const worker = str(d, "quero") === "trabalhar";
    const name = checkName(str(d, "name"));
    const cpf = checkCpf(str(d, "cpf"));
    checkPassword(str(d, "password"), str(d, "passwordConfirm"));
    const phone = worker ? checkPhone(str(d, "phone")) : null;
    if (worker && d.get("adult") !== "on") throw new AccountError("Para trabalhar pelo app é preciso ter 18 anos ou mais.");
    const jar = await cookies();
    const ref = jar.get("dp_ref")?.value;
    const inviter = ref ? await db.user.findUnique({ where: { refCode: ref.toUpperCase() }, select: { id: true } }) : null;
    const id = await createAccount({ name, cpf, password: str(d, "password"), role: "USER", referredById: inviter?.id ?? null });
    const user = await signInWithCpf(cpf, str(d, "password"));
    if (inviter) jar.delete("dp_ref");
    if (worker && phone) {
      const { trial } = await becomeWorker({ id, cpfHash: user.cpfHash }, phone);
      jar.set(MODE_COOKIE, "trabalho", { path: "/", maxAge: 365 * 86_400, sameSite: "lax" });
      next = trial ? "/painel/perfil/novo" : "/painel/plano";
    } else {
      await notify(id, { title: "Conta criada 🎉", body: "Encontre quem faz o serviço perto de você.", href: "/inicio" });
      next = safeNext(str(d, "voltar")) ?? homeOf(user);
    }
  } catch (e) {
    if (e instanceof AccountError || e instanceof WorkerError) return { error: e.message };
    throw e;
  }
  redirect(next);
}
