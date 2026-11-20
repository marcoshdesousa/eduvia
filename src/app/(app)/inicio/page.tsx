import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ChevronRight, Search, Zap } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { ACTIVE_STATUSES, CATEGORIES, CATEGORY_GROUPS, category } from "@/lib/domain";
import { feedPosts } from "@/lib/feed";
import { postImageUrl } from "@/lib/providers";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Início" };

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user?.role === "ADMIN") redirect("/admin");
  const [posts, open] = await Promise.all([
    feedPosts({ take: 6 }),
    user ? db.booking.findMany({ where: { clientId: user.id, status: { in: ["SEARCHING", "WAITING_PRO", ...ACTIVE_STATUSES] } }, orderBy: { createdAt: "desc" }, take: 3 }) : [],
  ]);
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted">{user ? `Olá, ${user.name.split(" ")[0]} 👋` : "Bem-vindo 👋"}</p>
        <h1 className="text-2xl font-extrabold">Do que você precisa hoje?</h1>
      </div>

      <Link href="/rapido" className="block">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-brand-ink p-5 text-white shadow-lg">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 right-10 h-24 w-24 rounded-full bg-amber-400/20" />
          <p className="flex items-center gap-2 text-lg font-extrabold"><Zap className="text-amber-300" /> Contrate rápido</p>
          <p className="mt-1 max-w-xs text-sm text-white/85">Chame agora quem está perto. O primeiro que aceitar chega em até 2 horas.</p>
          <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-ink">Chamar agora <ChevronRight size={16} /></span>
        </div>
      </Link>

      <Link href="/buscar" className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-muted">
        <Search size={18} /> Buscar prestador por serviço e cidade
      </Link>

      {open.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold">Seus pedidos em andamento</h2>
          {open.map((b) => (
            <Link key={b.id} href={`/pedidos/${b.id}`}>
              <Card className="flex items-center justify-between p-3 text-sm">
                <span>{category(b.category)?.emoji} {category(b.category)?.label} {b.mode === "QUICK" && "· ⚡"}</span>
                <ChevronRight size={16} />
              </Card>
            </Link>
          ))}
        </div>
      )}

      {CATEGORY_GROUPS.map((g) => (
        <section key={g} className="space-y-2">
          <h2 className="font-bold">{g}</h2>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {CATEGORIES.filter((c) => c.group === g).map((c) => (
              <Link key={c.slug} href={`/buscar?servico=${c.slug}`} className="flex w-24 shrink-0 flex-col items-center gap-1 rounded-2xl border border-border bg-surface p-3 text-center text-xs font-medium transition hover:border-primary">
                <span className="text-3xl">{c.emoji}</span>
                <span className="leading-tight">{c.label}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {posts.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Trabalhos recentes</h2>
            <Link href="/feed" className="text-sm text-primary">Ver todos</Link>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {posts.map((p) => (
              <Link key={p.id} href={`/prestador/${p.pro.id}`} className="overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={postImageUrl(p)} alt={p.caption ?? "Trabalho"} className="aspect-square w-full object-cover" loading="lazy" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {!user?.provider && (
        <Card className="flex items-center justify-between gap-3 border-accent/40 bg-accent-soft">
          <div>
            <p className="font-bold">Você presta serviço?</p>
            <p className="text-sm text-muted">Receba clientes perto de você. 3 dias grátis.</p>
          </div>
          <Link href={user ? "/seja-prestador" : "/cadastro?quero=trabalhar"} className={buttonClass("primary", "sm", "shrink-0 whitespace-nowrap")}>Quero trabalhar</Link>
        </Card>
      )}
    </div>
  );
}
