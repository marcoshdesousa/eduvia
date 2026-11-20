import Link from "next/link";
import type { Metadata } from "next";
import { Images } from "lucide-react";
import { Empty, PageTitle } from "@/components/bits";
import { buttonClass } from "@/components/ui/button";
import { feedPosts } from "@/lib/feed";
import { PostCard } from "./post-card";

export const metadata: Metadata = { title: "Trabalhos" };

export default async function FeedPage({ searchParams }: { searchParams: Promise<{ antes?: string }> }) {
  const { antes } = await searchParams;
  const before = antes && !Number.isNaN(Date.parse(antes)) ? new Date(antes) : null;
  const posts = await feedPosts({ take: 20, before });
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <PageTitle title="Trabalhos" subtitle="Fotos reais dos serviços feitos pelos prestadores do Diária Paga." />
      {posts.length ? posts.map((p) => <PostCard key={p.id} post={p} />) : <Empty icon={<Images />} title="Ainda não há fotos">Os trabalhos dos prestadores aparecem aqui.</Empty>}
      {posts.length === 20 && <Link href={`/feed?antes=${posts[posts.length - 1].createdAt.toISOString()}`} className={buttonClass("outline", "md", "w-full")}>Ver mais</Link>}
    </div>
  );
}
