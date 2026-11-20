"use server";
import type { ActionResult } from "@/components/action-form";
import { db } from "@/lib/db";
import { cpfHash } from "@/lib/cpf";
import { isValidCpf, onlyDigits } from "@/lib/core/cpf";
import { allowAttempt } from "@/lib/rate-limit";
import { headers } from "next/headers";

/** Pedido de nova senha: vira um chamado no suporte (a resposta é sempre a mesma, exista ou não a conta). */
export async function requestReset(_: ActionResult, d: FormData): Promise<ActionResult> {
  const cpf = onlyDigits(String(d.get("cpf") ?? ""));
  const name = String(d.get("name") ?? "").trim().slice(0, 120);
  const contact = String(d.get("contact") ?? "").trim().slice(0, 120);
  if (!isValidCpf(cpf)) return { error: "CPF inválido. Confira os números." };
  if (name.length < 5) return { error: "Informe o nome completo." };
  if (contact.length < 8) return { error: "Informe um telefone ou WhatsApp para o suporte falar com você." };
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!(await allowAttempt(`reset:${ip}`, 5, 60))) return { error: "Muitos pedidos. Tente de novo em 1 hora." };
  const user = await db.user.findUnique({ where: { cpfHash: cpfHash(cpf) }, select: { id: true } });
  if (user) {
    await db.supportTicket.create({
      data: {
        userId: user.id,
        subject: "Recuperar senha",
        messages: { create: { authorId: user.id, text: `Pedido de nova senha.\nNome informado: ${name}\nContato informado: ${contact}` } },
      },
    });
  }
  return { ok: "Pedido recebido. O suporte vai confirmar seus dados pelo contato informado e enviar um link para criar uma nova senha." };
}
