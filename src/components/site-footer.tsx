import Link from "next/link";
import { LogoMark } from "@/components/brand";

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl space-y-3 px-4 py-10 text-sm text-muted">
      <div className="flex items-center gap-2">
        <LogoMark className="h-7 w-7" />
        <span className="font-semibold text-foreground">Diária Paga</span>
      </div>
      <p>O Diária Paga conecta clientes e prestadores de serviço autônomos. O pagamento do serviço é feito diretamente ao prestador; a plataforma não recebe nem processa esse valor.</p>
      <nav className="flex flex-wrap gap-x-4 gap-y-1">
        <Link href="/termos" className="hover:text-foreground">Termos de uso</Link>
        <Link href="/privacidade" className="hover:text-foreground">Privacidade</Link>
        <Link href="/cancelamento" className="hover:text-foreground">Cancelamento e penalidades</Link>
        <Link href="/baixar" className="hover:text-foreground">Instalar o app</Link>
        <Link href="/suporte" className="hover:text-foreground">Suporte</Link>
      </nav>
      <p>© {new Date().getFullYear()} Diária Paga</p>
    </footer>
  );
}
