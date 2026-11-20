import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Eye, Plus, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { ActionForm } from "@/components/action-form";
import { PageTitle, ProPhoto } from "@/components/bits";
import { ServiceFields } from "@/components/service-fields";
import { SubmitButton } from "@/components/submit-button";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/form";
import { db } from "@/lib/db";
import { MAX_POSTS, UNIT_LABEL, category, formatBRL, whatsappLabel } from "@/lib/domain";
import { postImageUrl, profilePhotoUrl } from "@/lib/providers";
import { requireProvider } from "@/lib/session";
import { cn } from "@/lib/utils";
import { BackLink } from "../back-link";
import { deletePostAction, deleteProfileAction, updateProfileAction } from "../actions";
import { PhotoEditor } from "./photo-editor";
import { PostUploader } from "./post-uploader";

export const metadata: Metadata = { title: "Meu perfil" };

const brl = (c: number) => (c / 100).toFixed(2).replace(".", ",");

/** Meu perfil: um perfil por profissão (troca como contas do Instagram). Cada um tem foto, bio, fotos, links e valor. */
export default async function ProfilesPage({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const user = await requireProvider();
  const { p } = await searchParams;
  const profiles = await db.providerService.findMany({ where: { proId: user.provider.id }, orderBy: { createdAt: "asc" }, include: { posts: { orderBy: { createdAt: "desc" } } } });
  if (!profiles.length) redirect("/painel/perfil/novo");
  const cur = profiles.find((x) => x.id === p) ?? profiles[0];
  const c = category(cur.category);
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink />
      <PageTitle title="Meu perfil" subtitle="Um perfil para cada profissão que você faz. Toque para trocar." />

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {profiles.map((x) => {
          const xc = category(x.category);
          const on = x.id === cur.id;
          return (
            <Link key={x.id} href={`/painel/perfil?p=${x.id}`} className="flex w-20 shrink-0 flex-col items-center gap-1 text-center" aria-current={on ? "true" : undefined}>
              <span className={cn("rounded-full p-0.5", on ? "bg-gradient-to-tr from-amber-400 to-primary" : "bg-border")}>
                <span className="block rounded-full bg-surface p-0.5"><ProPhoto url={profilePhotoUrl(x)} name={xc?.label ?? x.category} size={60} /></span>
              </span>
              <span className={cn("text-[11px] leading-tight", on ? "font-bold" : "text-muted")}>{xc?.emoji} {xc?.label}</span>
            </Link>
          );
        })}
        <Link href="/painel/perfil/novo" className="flex w-20 shrink-0 flex-col items-center gap-1 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-primary text-primary"><Plus /></span>
          <span className="text-[11px] font-medium text-primary">Novo perfil</span>
        </Link>
      </div>

      <Card className="flex items-center justify-between gap-2">
        <div>
          <p className="font-bold">{c?.emoji} {c?.label}</p>
          <p className="text-sm text-muted">{formatBRL(cur.priceCents)} / {UNIT_LABEL[cur.unit].one}{cur.hourCents ? ` · ${formatBRL(cur.hourCents)} / hora` : ""}</p>
        </div>
        <Link href={`/prestador/${user.provider.id}?perfil=${cur.category}`} className={buttonClass("outline", "sm")}><Eye size={14} /> Ver como cliente</Link>
      </Card>

      <Card className="space-y-3">
        <CardTitle>Foto deste perfil</CardTitle>
        <PhotoEditor url={profilePhotoUrl(cur)} endpoint={`/api/painel/perfil/${cur.id}/foto`} />
      </Card>

      <Card>
        <ActionForm action={updateProfileAction.bind(null, cur.id)} className="space-y-4">
          <ServiceFields lockCategory defaults={{ category: cur.category, price: brl(cur.priceCents), unit: cur.unit, description: cur.description ?? "", hourPrice: cur.hourCents ? brl(cur.hourCents) : "" }} />
          <div>
            <Label htmlFor="bio">Sobre você nesta profissão</Label>
            <Textarea id="bio" name="bio" rows={4} maxLength={700} defaultValue={cur.bio ?? ""} placeholder="Experiência, o que você faz de melhor, como trabalha…" />
          </div>
          <p className="text-sm font-semibold">Contato e redes sociais <span className="font-normal text-muted">(opcional, aparecem no seu perfil)</span></p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" name="whatsapp" inputMode="tel" defaultValue={cur.whatsapp ? whatsappLabel(cur.whatsapp) : ""} placeholder="(91) 98888-7777" maxLength={20} />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" name="instagram" defaultValue={cur.instagram ? `@${cur.instagram}` : ""} placeholder="@seu.perfil" maxLength={60} />
            </div>
            <div>
              <Label htmlFor="website">Site ou página da empresa</Label>
              <Input id="website" name="website" defaultValue={cur.website ?? ""} placeholder="www.suaempresa.com.br" maxLength={200} />
            </div>
            <div>
              <Label htmlFor="tiktok">TikTok</Label>
              <Input id="tiktok" name="tiktok" defaultValue={cur.tiktok ? `@${cur.tiktok}` : ""} placeholder="@seu.perfil" maxLength={60} />
            </div>
            <div>
              <Label htmlFor="youtube">YouTube</Label>
              <Input id="youtube" name="youtube" defaultValue={cur.youtube ?? ""} placeholder="@seucanal ou link" maxLength={200} />
            </div>
          </div>
          <p className="text-xs text-muted">No Instagram e no TikTok, basta o @. O WhatsApp vira um botão para o cliente te chamar. Só nas legendas das fotos é que não pode ter telefone.</p>
          <SubmitButton className="w-full" pendingText="Salvando…">Salvar perfil</SubmitButton>
        </ActionForm>
      </Card>

      <Card className="space-y-3">
        <CardTitle>Fotos dos trabalhos ({cur.posts.length}/{MAX_POSTS})</CardTitle>
        <p className="text-xs text-muted">As 4 mais novas aparecem primeiro; o cliente toca em “Ver mais” para ver todas.</p>
        <PostUploader left={MAX_POSTS - cur.posts.length} serviceId={cur.id} />
        <div className="grid grid-cols-2 gap-2">
          {cur.posts.map((post) => (
            <figure key={post.id} className="overflow-hidden rounded-xl border border-border bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={postImageUrl(post)} alt={post.caption ?? "Foto do trabalho"} className="aspect-square w-full object-cover" loading="lazy" />
              <figcaption className="flex items-center gap-1 p-2">
                <span className="min-w-0 flex-1 truncate text-xs text-muted">{post.caption ?? "Sem legenda"}</span>
                <ActionButton action={deletePostAction.bind(null, post.id)} variant="ghost" size="sm" confirm="Apagar esta foto?" aria-label="Apagar foto" quiet><Trash2 size={14} /></ActionButton>
              </figcaption>
            </figure>
          ))}
        </div>
      </Card>

      <ActionButton action={deleteProfileAction.bind(null, cur.id)} variant="ghost" className="w-full text-danger" confirm={`Apagar o perfil de ${c?.label}? As fotos dele também são apagadas.`}>
        <Trash2 size={16} /> Apagar este perfil
      </ActionButton>
    </div>
  );
}
