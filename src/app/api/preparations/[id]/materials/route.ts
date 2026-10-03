import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { getOwnedPreparation } from "@/lib/authz";
import { lessonsState, listMaterials } from "@/lib/materials/list";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const prep = await getOwnedPreparation(id, user.id);
  if (!prep) return jsonError("Preparação não encontrada", 404);
  const materials = await listMaterials(id);
  return NextResponse.json({ materials, lessons: lessonsState(prep, materials.filter((m) => m.status === "READY" && !m.organized).length) });
}
