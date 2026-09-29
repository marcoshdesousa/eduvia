// Autorização centralizada: todo acesso a preparação/material passa por aqui.
// Fase 3 (grupos) estende estas funções para membros de grupos com o recurso compartilhado.
import { db } from "@/lib/db";

export function getOwnedPreparation(preparationId: string, userId: string) {
  return db.preparation.findFirst({ where: { id: preparationId, userId } });
}

export function getOwnedMaterial(materialId: string, userId: string) {
  return db.material.findFirst({ where: { id: materialId, preparation: { userId } }, include: { blob: true } });
}
