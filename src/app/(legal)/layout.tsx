import { Logo } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-16 max-w-3xl items-center px-4"><Logo /></header>
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6 text-[15px] leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_li]:text-muted [&_p]:text-muted">
        <p className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">Texto-base para começar. Deve ser revisado por advogado antes do lançamento oficial.</p>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
