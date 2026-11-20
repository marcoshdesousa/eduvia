import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-20 text-center">
      <div className="text-5xl" aria-hidden>🧹</div>
      <h1 className="text-xl font-bold">Página não encontrada</h1>
      <p className="text-sm text-muted">O endereço pode ter mudado ou o conteúdo não está mais disponível.</p>
      <Link href="/" className={buttonClass("primary")}>Voltar ao início</Link>
    </div>
  );
}
