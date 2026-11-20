import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Diária Paga — serviços perto de você",
    short_name: "Diária Paga",
    description: "Contrate diaristas, pedreiros, cuidadores, motoristas e muito mais.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f8f6",
    theme_color: "#0a7d55",
    lang: "pt-BR",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
