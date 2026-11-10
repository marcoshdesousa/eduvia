import Link from "next/link";
import { LogoMark } from "@/components/brand";

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl space-y-3 px-4 py-10 text-sm text-muted">
      <div className="flex items-center gap-2">
        <LogoMark className="h-7 w-7" />
        <span className="font-semibold text-foreground">HoraLimp</span>
      </div>
      <p>A HoraLimp conecta clientes e profissionais autônomos de limpeza. O pagamento do serviço é feito diretamente ao profissional; a HoraLimp não recebe nem processa esse valor.</p>
      <nav className="flex flex-wrap gap-x-4 gap-y-1">
        <Link href="/termos" className="hover:text-foreground">Termos de uso</Link>
        <Link href="/privacidade" className="hover:text-foreground">Privacidade</Link>
        <Link href="/cancelamento" className="hover:text-foreground">Cancelamento</Link>
        <Link href="/suporte" className="hover:text-foreground">Suporte</Link>
      </nav>
      <p>© {new Date().getFullYear()} HoraLimp</p>
    </footer>
  );
}
