"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { normalizeSocial, saveSocialLinks, SOCIALS, type SocialKey } from "@/lib/site";
import type { FormState } from "./account";

export async function saveSocialAction(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const values = {} as Record<SocialKey, string>;
  for (const s of SOCIALS) {
    const v = normalizeSocial(s.key, String(f.get(s.key) ?? ""));
    if (v === null) return { error: `Link do ${s.label} inválido.` };
    values[s.key] = v;
  }
  await saveSocialLinks(values);
  revalidatePath("/", "layout");
  return { ok: true, message: "Redes sociais salvas. Já aparecem no rodapé do site." };
}
