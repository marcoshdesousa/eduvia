"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle, BellRing, Check, Copy, Download, EllipsisVertical, Loader2, Monitor, PlusSquare, Share, Smartphone } from "lucide-react";
import { LogoMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { ensurePushSubscribed, pushSupported } from "@/lib/push-client";
import { cn } from "@/lib/utils";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
type Device = "iphone" | "android" | "computador";

/** Páginas que abrem mesmo fora do app (textos legais). */
const OPEN = ["/termos", "/privacidade", "/cancelamento"];

const standalone = () => window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
const inAppBrowser = () => /Instagram|FBAN|FBAV|FB_IAB|Line\/|TikTok|Snapchat|; wv\)/i.test(navigator.userAgent);
const detect = (): Device => (/iPhone|iPad|iPod/i.test(navigator.userAgent) ? "iphone" : /Android/i.test(navigator.userAgent) ? "android" : "computador");

/**
 * O Diária Paga só funciona como aplicativo: no navegador aparece só a logo e o passo a passo para baixar.
 * Depois de instalado, pede para ativar as notificações (sem elas não dá para usar).
 */
export function AppGate({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [step, setStep] = useState<"checking" | "install" | "notify" | "ok">("checking");
  useEffect(() => {
    // testes automáticos e textos legais passam direto
    if (navigator.webdriver || OPEN.some((p) => path.startsWith(p))) return setStep("ok");
    if (!standalone()) return setStep("install");
    if (pushSupported() && Notification.permission !== "granted") return setStep("notify");
    setStep("ok");
  }, [path]);
  useEffect(() => {
    if ("serviceWorker" in navigator) void navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  if (step === "ok") return <>{children}</>;
  return (
    <div className="min-h-dvh bg-background">
      {step === "checking" ? (
        <div className="grid min-h-dvh place-items-center"><LogoMark className="h-20 w-20 animate-pulse" /></div>
      ) : step === "install" ? (
        <InstallScreen />
      ) : (
        <NotifyScreen onDone={() => setStep("ok")} />
      )}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center gap-5 px-5 py-10 text-center">
      <LogoMark className="h-24 w-24 drop-shadow-lg" />
      <p className="text-3xl font-extrabold text-brand-ink" style={{ fontFamily: "var(--font-display)" }}>Diária<span className="text-primary">Paga</span></p>
      {children}
      <p className="mt-auto pt-6 text-xs text-muted">
        <a href="/termos" className="underline">Termos</a> · <a href="/privacidade" className="underline">Privacidade</a>
      </p>
    </div>
  );
}

function InstallScreen() {
  const [device, setDevice] = useState<Device>("android");
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [inApp, setInApp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    setDevice(detect());
    setInApp(inAppBrowser());
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const steps: Record<Device, { icon: React.ReactNode; text: React.ReactNode }[]> = {
    iphone: [
      { icon: <Smartphone size={18} />, text: <>Abra este link no <strong>Safari</strong> (a bússola azul). Pelo Instagram ou Facebook não funciona.</> },
      { icon: <Share size={18} />, text: <>Toque no botão <strong>Compartilhar</strong> <Share size={14} className="inline" /> na barra de baixo (no iPad, fica em cima).</> },
      { icon: <PlusSquare size={18} />, text: <>Role a lista para baixo e toque em <strong>Adicionar à Tela de Início</strong>. Depois, toque em <strong>Adicionar</strong>.</> },
      { icon: <Check size={18} />, text: <>Feche o Safari e abra o <strong>Diária Paga</strong> pelo ícone verde que apareceu na tela do celular.</> },
    ],
    android: [
      { icon: <Smartphone size={18} />, text: <>Abra este link no <strong>Chrome</strong>. Pelo Instagram ou Facebook não funciona.</> },
      { icon: <Download size={18} />, text: <>Toque no botão verde <strong>Baixar o app</strong> aqui em cima. Se ele não aparecer, toque nos <strong>3 pontinhos</strong> <EllipsisVertical size={14} className="inline" /> do Chrome.</> },
      { icon: <PlusSquare size={18} />, text: <>Escolha <strong>Instalar app</strong> (ou “Adicionar à tela inicial”) e confirme em <strong>Instalar</strong>.</> },
      { icon: <Check size={18} />, text: <>Abra o <strong>Diária Paga</strong> pelo ícone verde na tela do celular.</> },
    ],
    computador: [
      { icon: <Monitor size={18} />, text: <>Use o <strong>Google Chrome</strong> ou o <strong>Microsoft Edge</strong>.</> },
      { icon: <Download size={18} />, text: <>Clique em <strong>Baixar o app</strong> aqui em cima, ou no ícone de instalar <Download size={14} className="inline" /> no canto direito da barra de endereço.</> },
      { icon: <Check size={18} />, text: <>Confirme em <strong>Instalar</strong>. O Diária Paga abre na própria janela e fica no menu Iniciar / na Dock.</> },
    ],
  };

  return (
    <Shell>
      <div className="space-y-1">
        <h1 className="text-xl font-bold">Baixe o app para usar</h1>
        <p className="text-sm text-muted">O Diária Paga funciona como aplicativo no seu celular. É grátis, leva 10 segundos e não precisa de loja.</p>
      </div>

      {inApp && (
        <div className="w-full space-y-2 rounded-2xl border border-warning/50 bg-warning/10 p-3 text-left text-sm">
          <p className="flex items-center gap-2 font-semibold"><AlertTriangle size={16} className="text-warning" /> Você abriu dentro de outro app</p>
          <p>Para baixar, abra este link no <strong>{device === "iphone" ? "Safari" : "Chrome"}</strong>. Toque nos 3 pontinhos e escolha “Abrir no navegador”, ou copie o link:</p>
          <Button type="button" variant="secondary" size="sm" onClick={async () => { await navigator.clipboard.writeText(location.href).catch(() => {}); setCopied(true); }}>
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Link copiado" : "Copiar link"}
          </Button>
        </div>
      )}

      {installed ? (
        <p className="w-full rounded-2xl bg-success/10 p-3 text-sm font-medium text-success">App instalado! Agora abra o Diária Paga pelo ícone na tela do {device === "computador" ? "computador" : "celular"}.</p>
      ) : evt ? (
        <Button size="lg" className="dp-ring w-full" onClick={async () => { await evt.prompt(); const r = await evt.userChoice; if (r.outcome === "accepted") setInstalled(true); }}>
          <Download size={20} /> Baixar o app
        </Button>
      ) : null}

      <div className="w-full space-y-3 text-left">
        <div className="grid grid-cols-3 rounded-xl bg-surface-2 p-1 text-sm font-semibold">
          {(["iphone", "android", "computador"] as Device[]).map((d) => (
            <button key={d} type="button" onClick={() => setDevice(d)} className={cn("rounded-lg py-2", device === d ? "bg-surface shadow-sm" : "text-muted")}>
              {d === "iphone" ? "iPhone" : d === "android" ? "Android" : "Computador"}
            </button>
          ))}
        </div>
        <ol className="space-y-2">
          {steps[device].map((s, i) => (
            <li key={i} className="flex gap-3 rounded-2xl border border-border bg-surface p-3 text-sm">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground">{i + 1}</span>
              <span className="pt-1">{s.text}</span>
            </li>
          ))}
        </ol>
        <details className="rounded-2xl border border-border bg-surface p-3 text-sm">
          <summary className="cursor-pointer font-semibold">Não deu certo? Erros comuns</summary>
          <ul className="mt-2 list-inside list-disc space-y-1 text-muted">
            <li>Abriu pelo Instagram, Facebook ou TikTok: abra no {device === "iphone" ? "Safari" : "Chrome"}.</li>
            <li>No iPhone, “Adicionar à Tela de Início” só aparece no Safari (e no Chrome do iOS 16.4 ou mais novo).</li>
            <li>Já instalou? Não abra pelo navegador: abra pelo <strong>ícone verde</strong> na tela do celular.</li>
            <li>No Android, se não aparecer “Instalar app”, atualize o Chrome na Play Store.</li>
          </ul>
        </details>
      </div>
    </Shell>
  );
}

function NotifyScreen({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<"idle" | "busy" | "denied">("idle");
  const [device, setDevice] = useState<Device>("android");
  useEffect(() => {
    setDevice(detect());
    if (Notification.permission === "denied") setState("denied");
  }, []);
  return (
    <Shell>
      <div className="grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary"><BellRing size={40} /></div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold">Ative as notificações</h1>
        <p className="text-sm text-muted">É assim que você fica sabendo de mensagens, pedidos aceitos e chamados na hora. Sem notificações o app não funciona.</p>
      </div>
      {state === "denied" ? (
        <div className="w-full space-y-2 rounded-2xl border border-warning/50 bg-warning/10 p-4 text-left text-sm">
          <p className="font-semibold">As notificações estão bloqueadas</p>
          {device === "iphone" ? (
            <p>Abra <strong>Ajustes</strong> do iPhone → <strong>Notificações</strong> → <strong>Diária Paga</strong> → ligue <strong>Permitir Notificações</strong>. Depois volte aqui.</p>
          ) : device === "android" ? (
            <p>Toque e segure o ícone do <strong>Diária Paga</strong> → <strong>Informações do app</strong> → <strong>Notificações</strong> → ligue. Depois volte aqui.</p>
          ) : (
            <p>Clique no cadeado ao lado do endereço → <strong>Notificações</strong> → <strong>Permitir</strong>. Depois recarregue.</p>
          )}
          <Button type="button" variant="secondary" className="w-full" onClick={() => location.reload()}>Já liberei</Button>
        </div>
      ) : (
        <Button
          size="lg"
          className="dp-ring w-full"
          disabled={state === "busy"}
          onClick={async () => {
            setState("busy");
            const perm = await Notification.requestPermission().catch(() => "denied" as NotificationPermission);
            if (perm !== "granted") return setState("denied");
            await ensurePushSubscribed().catch(() => false); // se ainda não entrou na conta, inscreve depois do login
            onDone();
          }}
        >
          {state === "busy" ? <Loader2 size={20} className="animate-spin" /> : <BellRing size={20} />} Ativar notificações
        </Button>
      )}
    </Shell>
  );
}

/** Depois do login, garante que este aparelho recebe as notificações da conta. */
export function PushAutoSubscribe() {
  useEffect(() => {
    void ensurePushSubscribed().catch(() => {});
  }, []);
  return null;
}
