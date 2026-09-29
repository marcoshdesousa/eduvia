import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { getOwnedPreparation } from "@/lib/authz";
import { listMaterials } from "@/lib/materials/list";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser({ requireAccess: false });
  if (error) return error;
  const { id } = await params;
  if (!(await getOwnedPreparation(id, user.id))) return jsonError("Preparação não encontrada", 404);
  return NextResponse.json({ materials: await listMaterials(id) });
}
