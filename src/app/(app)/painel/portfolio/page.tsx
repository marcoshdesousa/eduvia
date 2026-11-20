import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { PageTitle } from "@/components/bits";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { MAX_POSTS } from "@/lib/domain";
import { postImageUrl } from "@/lib/providers";
import { requireProvider } from "@/lib/session";
import { BackLink } from "../back-link";
import { deletePostAction } from "../actions";
import { PostUploader } from "./post-uploader";

export const metadata: Metadata = { title: "Portfólio" };

export default async function PortfolioPage() {
  const user = await requireProvider();
  const posts = await db.post.findMany({ where: { proId: user.provider.id }, orderBy: { createdAt: "desc" } });
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink />
      <PageTitle title="Portfólio" subtitle={`Até ${MAX_POSTS} fotos dos seus trabalhos. As 4 mais novas aparecem primeiro no seu perfil.`} />
      <Card>
        <PostUploader left={MAX_POSTS - posts.length} />
      </Card>
      <div className="grid grid-cols-2 gap-2">
        {posts.map((p) => (
          <figure key={p.id} className="overflow-hidden rounded-xl border border-border bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={postImageUrl(p)} alt={p.caption ?? "Foto do portfólio"} className="aspect-square w-full object-cover" loading="lazy" />
            <figcaption className="flex items-center gap-1 p-2">
              <span className="min-w-0 flex-1 truncate text-xs text-muted">{p.caption ?? "Sem legenda"}</span>
              <ActionButton action={deletePostAction.bind(null, p.id)} variant="ghost" size="sm" confirm="Apagar esta foto?" aria-label="Apagar foto" quiet>
                <Trash2 size={14} />
              </ActionButton>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
