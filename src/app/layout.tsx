import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { AppGate } from "@/components/app-gate";
import { ThemeProvider } from "@/components/theme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = Sora({ subsets: ["latin"], variable: "--font-jakarta", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "Diária Paga — contrate diaristas, pedreiros, cuidadores e mais", template: "%s · Diária Paga" },
  description: "Encontre quem faz o serviço perto de você: diarista, pedreiro, eletricista, cuidador, babá, encanador e muito mais. Grátis para quem contrata.",
  applicationName: "Diária Paga",
};

export const viewport: Viewport = { themeColor: "#04140f", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-dvh">
        <ThemeProvider>
          <AppGate>{children}</AppGate>
        </ThemeProvider>
      </body>
    </html>
  );
}
