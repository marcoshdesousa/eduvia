import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function BackLink({ href = "/painel", label = "Painel" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
      <ChevronLeft size={16} /> {label}
    </Link>
  );
}
