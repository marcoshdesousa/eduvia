"use client";
import { useEffect, useState } from "react";
import { autoReload, isStaleDeployError } from "@/lib/recover";

/** Último recurso: tenta voltar sozinho (recarrega) e mostra uma página simples enquanto isso. */
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  const [tries, setTries] = useState(0);
  useEffect(() => {
    if (isStaleDeployError(error) && autoReload()) return;
    if (tries >= 4) return;
    const t = setTimeout(() => {
      setTries((n) => n + 1);
      if (tries >= 1) autoReload();
      else reset();
    }, 3000 * (tries + 1));
    return () => clearTimeout(t);
  }, [error, reset, tries]);
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#0b0f17", color: "#f1f5f9", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center", padding: 24, maxWidth: 420 }}>
          <div style={{ fontSize: 48 }}>🦊</div>
          <h1 style={{ fontSize: 20 }}>Só um instante…</h1>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Estamos reconectando. Seus dados estão salvos e a página volta sozinha.</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: 12, background: "#f97316", color: "#fff", border: 0, borderRadius: 10, padding: "10px 18px", fontWeight: 600 }}>
            Recarregar agora
          </button>
        </div>
      </body>
    </html>
  );
}
