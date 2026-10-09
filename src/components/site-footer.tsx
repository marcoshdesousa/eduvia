import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/brand";
import { SocialIcon } from "@/components/social-icons";
import { getSocialLinks } from "@/lib/site";

/** Rodapé das páginas públicas. As redes sociais aparecem quando o admin cadastra os links. */
export async function SiteFooter() {
  const socials = await getSocialLinks();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-border bg-surface/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2 text-xl"><LogoMark /><Wordmark /></Link>
          <p className="max-w-sm text-sm text-muted">Seu material, no seu ritmo. O Eduvia transforma seus PDFs em plano de estudo, sessões, revisões e simulados.</p>
          {socials.length > 0 && (
            <ul className="flex gap-2 pt-1" aria-label="Redes sociais">
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label} className="grid size-10 place-items-center rounded-full border border-border text-muted transition hover:border-primary hover:text-primary">
                    <SocialIcon name={s.key} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <nav className="space-y-2 text-sm" aria-label="Eduvia">
          <p className="font-semibold">Eduvia</p>
          <ul className="space-y-2 text-muted">
            <li><Link href="/#como-funciona" className="hover:text-foreground">Como funciona</Link></li>
            <li><Link href="/#preco" className="hover:text-foreground">Preço</Link></li>
            <li><Link href="/cadastro" className="hover:text-foreground">Criar conta</Link></li>
            <li><Link href="/entrar" className="hover:text-foreground">Entrar</Link></li>
          </ul>
        </nav>
        <nav className="space-y-2 text-sm" aria-label="Ajuda">
          <p className="font-semibold">Ajuda</p>
          <ul className="space-y-2 text-muted">
            <li><Link href="/#duvidas" className="hover:text-foreground">Perguntas frequentes</Link></li>
            <li><Link href="/suporte" className="hover:text-foreground">Fale com o suporte</Link></li>
            <li><Link href="/termos" className="hover:text-foreground">Termos de uso</Link></li>
            <li><Link href="/privacidade" className="hover:text-foreground">Privacidade</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted">© {year} Eduvia. Feito no Brasil para quem estuda.</div>
    </footer>
  );
}
