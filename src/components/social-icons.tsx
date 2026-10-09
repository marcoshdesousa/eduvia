import type { SocialKey } from "@/lib/site-config";

/** Ícones simples das redes sociais (desenhados em SVG, herdam a cor do texto). */
export function SocialIcon({ name, className = "size-5" }: { name: SocialKey; className?: string }) {
  switch (name) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path
            d="M8.6 7.4c.3-.5.8-.5 1.1 0l.8 1.7c.1.3.1.6-.2.8l-.6.6a6.6 6.6 0 0 0 3.4 3.4l.6-.6c.2-.3.5-.3.8-.2l1.7.8c.5.3.5.8 0 1.1-1.3.9-2.9.9-4.7-.3a9.4 9.4 0 0 1-3.2-3.2c-1.2-1.8-1.2-3.4-.3-4.7z"
            fill="currentColor"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M15.6 2.5c.4 2.4 2 4.1 4.4 4.3v3.3c-1.6 0-3.1-.5-4.4-1.4v6.6a6.2 6.2 0 1 1-6.2-6.2v3.4a2.9 2.9 0 1 0 2.9 2.9V2.5z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
        </svg>
      );
  }
}
