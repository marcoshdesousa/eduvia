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
import { getCurrentUser, getMode } from "@/lib/session";

export const metadata: Metadata = { title: "Início" };

/** Cor suave de cada grupo de profissões. */
const TILE = [
  "from-emerald-50 to-teal-100 dark:from-emerald-950/50 dark:to-teal-900/40",
  "from-orange-50 to-amber-100 dark:from-orange-950/50 dark:to-amber-900/40",
  "from-sky-50 to-blue-100 dark:from-sky-950/50 dark:to-blue-900/40",
  "from-violet-50 to-purple-100 dark:from-violet-950/50 dark:to-purple-900/40",
  "from-pink-50 to-rose-100 dark:from-pink-950/50 dark:to-rose-900/40",
  "from-lime-50 to-green-100 dark:from-lime-950/50 dark:to-green-900/40",
];

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user?.role === "ADMIN") redirect("/admin");
  if ((await getMode(user)) === "trabalho") redirect("/painel");
  const [posts, open] = await Promise.all([
    feedPosts({ take: 6 }),
    user ? db.booking.findMany({ where: { clientId: user.id, status: { in: ["SEARCHING", "WAITING_PRO", ...ACTIVE_STATUSES] } }, orderBy: { createdAt: "desc" }, take: 3 }) : [],
  ]);
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted">{user ? `Olá, ${user.name.split(" ")[0]} 👋` : "Bem-vindo 👋"}</p>
        <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-brand-ink">Do que você precisa hoje?</h1>
      </div>

      <Link href="/rapido" className="block">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#12a273] via-primary to-brand-ink p-5 text-white shadow-xl shadow-primary/30 transition active:scale-[0.99]">
          <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-[1px]" />
          <div className="absolute -bottom-14 right-16 h-32 w-32 rounded-full bg-amber-300/25 blur-sm" />
          <div className="absolute right-5 top-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
            <Zap size={28} className="fill-amber-300 text-amber-300" />
          </div>
          <p className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ring-white/20">Novo</p>
          <p className="mt-2 text-xl font-extrabold tracking-tight">Contrate rápido</p>
          <p className="mt-1 max-w-[16rem] text-sm text-white/85">Chame agora quem está perto. O primeiro que aceitar chega em até 2 horas.</p>
          <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-brand-ink shadow-lg">Chamar agora <ChevronRight size={16} /></span>
        </div>
      </Link>

      <Link href="/buscar" className="flex items-center gap-3 rounded-full border border-border/70 bg-surface px-5 py-3.5 text-muted shadow-[0_8px_24px_-16px_rgba(8,57,43,0.35)] transition hover:border-primary/40">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary"><Search size={16} /></span> Buscar prestador por serviço e cidade
      </Link>

      {open.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-extrabold tracking-tight">Seus pedidos em andamento</h2>
          {open.map((b) => (
            <Link key={b.id} href={`/pedidos/${b.id}`} className="block">
              <Card className="flex items-center gap-3 p-3 text-sm">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-2xl">{category(b.category)?.emoji}</span>
                <span className="flex-1 font-semibold">{category(b.category)?.label} {b.mode === "QUICK" && <span className="text-accent">· ⚡ rápido</span>}</span>
                <ChevronRight size={18} className="text-muted" />
              </Card>
            </Link>
          ))}
        </div>
      )}

      {CATEGORY_GROUPS.map((g, gi) => (
        <section key={g} className="space-y-3">
          <h2 className="text-lg font-extrabold tracking-tight">{g}</h2>
          <div className="grid grid-cols-4 gap-x-2 gap-y-3 sm:grid-cols-6">
            {CATEGORIES.filter((c) => c.group === g).map((c) => (
              <Link key={c.slug} href={`/buscar?servico=${c.slug}`} className="group flex flex-col items-center gap-1.5 text-center text-[11px] font-semibold leading-tight text-foreground/85">
                <span className={`grid aspect-square w-full max-w-[4.5rem] place-items-center rounded-[22px] bg-gradient-to-br text-[2rem] shadow-sm ring-1 ring-black/5 transition group-hover:-translate-y-0.5 group-hover:shadow-md group-active:scale-95 ${TILE[gi % TILE.length]}`}>
                  {c.emoji}
                </span>
                <span className="leading-tight">{c.label}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {posts.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight">Trabalhos recentes</h2>
            <Link href="/feed" className="text-sm text-primary">Ver todos</Link>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {posts.map((p) => (
              <Link key={p.id} href={`/prestador/${p.pro.id}`} className="overflow-hidden rounded-2xl shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={postImageUrl(p)} alt={p.caption ?? "Trabalho"} className="aspect-square w-full object-cover" loading="lazy" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {!user?.provider && (
        <Card className="flex items-center justify-between gap-3 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100 dark:border-amber-900 dark:from-amber-950/40 dark:to-orange-950/40">
          <div>
            <p className="font-bold">Você presta serviço?</p>
            <p className="text-sm text-muted">Receba clientes perto de você. 3 dias grátis.</p>
          </div>
          <Link href={user ? "/seja-prestador" : "/cadastro?quero=trabalhar"} className={buttonClass("primary", "sm", "shrink-0 whitespace-nowrap")}>Turbinar conta</Link>
        </Card>
      )}
    </div>
  );
}
