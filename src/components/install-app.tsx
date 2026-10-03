"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Share, Smartphone, X } from "lucide-react";
import { Button, buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
type Platform = "ios" | "android" | "desktop";

function detect(): { platform: Platform; installed: boolean } {
  const ua = navigator.userAgent;
  const ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const installed = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
  return { platform: ios ? "ios" : /android/i.test(ua) ? "android" : "desktop", installed };
}

function useInstall() {
  const [info, setInfo] = useState<{ platform: Platform; installed: boolean } | null>(null);
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  useEffect(() => {
    setInfo(detect());
    const read = () => setPrompt(((window as unknown as { __eduviaInstall?: InstallEvent }).__eduviaInstall) ?? null);
    read();
    window.addEventListener("eduvia-install-ready", read);
    const installed = () => setInfo((i) => (i ? { ...i, installed: true } : i));
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("eduvia-install-ready", read);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);
  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice.catch(() => null);
    setPrompt(null);
  };
  return { info, prompt, install };
}

/** Passo a passo para instalar o Eduvia como app (sem loja: direto pelo navegador). */
export function InstallSteps() {
  const { info, prompt, install } = useInstall();
  if (!info) return null;
  if (info.installed) {
    return <p className="rounded-lg border border-success/40 bg-success/10 p-3 text-sm">✅ O app já está instalado neste aparelho. Agora é só ativar as notificações abaixo.</p>;
  }
  return (
    <div className="space-y-3 text-sm">
      {prompt && (
        <Button onClick={install}><Download size={16} /> Instalar o app agora</Button>
      )}
      {info.platform === "ios" ? (
        <ol className="list-decimal space-y-2 pl-5">
          <li>Abra o Eduvia no <strong>Safari</strong> (no iPhone, a instalação só funciona pelo Safari).</li>
          <li>Toque no botão <strong>Compartilhar</strong> <Share size={14} className="inline" /> (quadrado com seta, na barra de baixo).</li>
          <li>Role e toque em <strong>&quot;Adicionar à Tela de Início&quot;</strong> e depois em <strong>Adicionar</strong>.</li>
          <li>Abra o Eduvia pelo ícone da raposa na tela inicial e ative as notificações abaixo.</li>
        </ol>
      ) : info.platform === "android" ? (
        <ol className="list-decimal space-y-2 pl-5">
          <li>Abra o Eduvia no <strong>Chrome</strong>.</li>
          <li>{prompt ? "Toque no botão \"Instalar o app agora\" acima" : <>Toque no menu <strong>⋮</strong> (três pontinhos, no canto de cima) e em <strong>&quot;Instalar app&quot;</strong> ou <strong>&quot;Adicionar à tela inicial&quot;</strong></>}.</li>
          <li>Confirme em <strong>Instalar</strong>. O ícone da raposa aparece junto com seus apps.</li>
          <li>Abra pelo ícone e ative as notificações abaixo.</li>
        </ol>
      ) : (
        <ol className="list-decimal space-y-2 pl-5">
          <li>No <strong>Chrome</strong> ou <strong>Edge</strong>, clique no ícone de instalar na barra de endereço (um monitor com uma seta) {prompt ? "ou no botão acima" : ""}.</li>
          <li>Confirme em <strong>Instalar</strong>: o Eduvia abre numa janela própria, como um programa.</li>
          <li>No celular é ainda melhor: abra este mesmo endereço no celular e siga o passo a passo.</li>
        </ol>
      )}
    </div>
  );
}

const DISMISS_KEY = "eduvia-install-dismissed";

/** Convite para instalar o app: aparece em toda visita até instalar (fechar esconde só nesta visita). */
export function InstallAppBanner() {
  const { info, prompt, install } = useInstall();
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    try {
      setHidden(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setHidden(false);
    }
  }, []);
  if (!info || info.installed || hidden || info.platform === "desktop") return null;
  return (
    <Card className="flex items-start gap-3 border-primary/40 bg-primary/5">
      <Smartphone className="mt-0.5 shrink-0 text-primary" />
      <div className="flex-1 text-sm">
        <p className="font-semibold">Instale o app do Eduvia</p>
        <p className="text-muted">Fica na tela do celular, abre mais rápido e avisa a hora de estudar.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {prompt ? <Button size="sm" onClick={install}><Download size={14} /> Instalar</Button> : null}
          <Link href="/instalar" className={buttonClass(prompt ? "ghost" : "primary", "sm")}>Ver como instalar</Link>
        </div>
      </div>
      <button
        type="button"
        aria-label="Fechar"
        className="text-muted hover:text-foreground"
        onClick={() => {
          setHidden(true);
          try {
            sessionStorage.setItem(DISMISS_KEY, "1"); // volta na próxima visita até instalar
          } catch {}
        }}
      >
        <X size={16} />
      </button>
    </Card>
  );
}
