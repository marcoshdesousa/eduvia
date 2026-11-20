import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { InputError, readPlace, readProfile } from "@/lib/provider-input";
import { workerPaid } from "@/lib/session";
import { deleteObject } from "@/lib/storage";
import { saveImage } from "@/lib/upload";

/** Cria um perfil novo (uma profissão) com foto, valor e apresentação. */
export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  if (!user.provider) return jsonError("Turbine a conta para trabalhador primeiro.", 403);
  if (!(await workerPaid(user.provider.id))) return jsonError("Seu plano está vencido. Pague para continuar.", 402);
  const f = await req.formData().catch(() => null);
  if (!f) return jsonError("Formulário inválido.");
  let key: string | null = null;
  try {
    const data = readProfile(f, true);
    // primeiro perfil sem endereço: o formulário já pede onde ele atende
    const needPlace = !(await db.providerPlace.count({ where: { proId: user.provider.id } }));
    const place = needPlace ? readPlace(f) : null;
    if ((await db.providerService.count({ where: { proId: user.provider.id } })) >= 20) throw new InputError("Você pode ter até 20 perfis.");
    const photo = await saveImage(f.get("photo"), "perfil");
    if ("error" in photo) throw new InputError(photo.error === "Envie a foto." ? "Adicione uma foto para este perfil." : photo.error);
    key = photo.key;
    const svc = await db.providerService.create({ data: { ...data, category: data.category!, proId: user.provider.id, photoKey: key } });
    if (place) await db.providerPlace.create({ data: { ...place, label: "Principal", proId: user.provider.id } });
    return NextResponse.json({ id: svc.id });
  } catch (e) {
    if (key) await deleteObject(key).catch(() => {});
    if (e instanceof InputError) return jsonError(e.message);
    if ((e as { code?: string }).code === "P2002") return jsonError("Você já tem um perfil desta profissão.");
    throw e;
  }
}
