import { db } from "@/lib/db";
import type { SavedAddress } from "@/components/address-fields";

export async function savedAddresses(userId: string): Promise<SavedAddress[]> {
  const rows = await db.address.findMany({ where: { clientId: userId }, orderBy: { lastUsedAt: "desc" }, take: 10 });
  return rows.map((a) => ({ id: a.id, label: a.label, street: a.street, number: a.number ?? "", complement: a.complement ?? "", district: a.district ?? "", city: a.city, uf: a.uf, cep: a.cep ?? "", lat: a.lat, lng: a.lng }));
}
