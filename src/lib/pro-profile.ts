import { db } from "@/lib/db";

/** O que falta para poder enviar o perfil para verificação. */
export async function missingForReview(proId: string) {
  const p = await db.professionalProfile.findUniqueOrThrow({ where: { id: proId }, include: { areas: true } });
  const missing: string[] = [];
  if (!p.photoKey) missing.push("foto do rosto");
  if (!p.hourlyCents) missing.push("preço por hora");
  if (!p.services.length) missing.push("serviços oferecidos");
  if (!p.areas.length) missing.push("município de atendimento");
  return missing;
}

