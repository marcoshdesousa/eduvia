import { Logo } from "@/components/brand";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Logo />
      <h1 className="mt-8 text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-muted">Última atualização: {updated}</p>
      <div className="prose-study mt-6 text-[15px]">{children}</div>
      <p className="mt-10 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
        Modelo inicial para revisão jurídica antes do lançamento.
      </p>
    </main>
  );
}
