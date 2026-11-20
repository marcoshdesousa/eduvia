import Link from "next/link";
import { ProPhoto, RecommendedBadge } from "@/components/bits";
import { category, shortName } from "@/lib/domain";
import type { feedPosts } from "@/lib/feed";
import { postImageUrl, profilePhotoUrl } from "@/lib/providers";

type FeedPost = Awaited<ReturnType<typeof feedPosts>>[number];

export function PostCard({ post }: { post: FeedPost }) {
  const pro = post.pro;
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <Link href={`/prestador/${pro.id}${post.service ? `?perfil=${post.service.category}` : ""}`} className="flex items-center gap-2 p-3">
        <ProPhoto url={post.service ? profilePhotoUrl(post.service) : null} name={pro.user.name} size={36} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold">{shortName(pro.user.name)} {pro.subscription?.plan === "FULL" && <RecommendedBadge />}</p>
          <p className="truncate text-xs text-muted">{post.service ? category(post.service.category)?.label : ""}{pro.places[0] && ` · ${pro.places[0].city}/${pro.places[0].uf}`}</p>
        </div>
      </Link>
      <Link href={`/prestador/${pro.id}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={postImageUrl(post)} alt={post.caption ?? "Trabalho do prestador"} className="aspect-square w-full object-cover" loading="lazy" />
      </Link>
      {post.caption && <p className="p-3 text-sm">{post.caption}</p>}
    </article>
  );
}
