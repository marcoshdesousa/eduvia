import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { canAccessMaterial } from "@/lib/groups";
import { PdfPageViewer } from "@/components/pdf-viewer";

export const metadata = { title: "Fonte" };

/** Página da fonte (quando o link é aberto direto): o PDF na página citada, com o trecho grifado. */
export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ p?: string; q?: string }> }) {
  const user = await requireReadyUser();
  const { id } = await params;
  const { p, q } = await searchParams;
  if (!(await canAccessMaterial(user.id, id))) notFound();
  const material = await db.material.findUnique({ where: { id }, select: { title: true, preparationId: true } });
  if (!material) notFound();
  return (
    <div className="space-y-4">
      <div>
        <Link href={`/preparacoes/${material.preparationId}?aba=materiais`} className="text-sm text-muted hover:text-foreground">← Materiais</Link>
        <h1 className="mt-2 text-xl font-bold">{material.title}</h1>
      </div>
      <PdfPageViewer materialId={id} page={Number(p) || 1} quote={q ?? null} />
    </div>
  );
}
