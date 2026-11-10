import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HoraLimp — limpeza residencial",
    short_name: "HoraLimp",
    description: "Contrate profissionais de limpeza na sua cidade, por hora.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6fc",
    theme_color: "#5b3cc4",
    lang: "pt-BR",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
