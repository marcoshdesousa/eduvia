"use client";
/** Último recurso: até se o layout falhar, aparece uma página simples com "tentar de novo". */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#0b0f17", color: "#f1f5f9", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center", padding: 24, maxWidth: 420 }}>
          <div style={{ fontSize: 48 }}>🦊</div>
          <h1 style={{ fontSize: 20 }}>O Eduvia está voltando</h1>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Seus dados estão salvos. Tente de novo em alguns segundos.</p>
          <button onClick={reset} style={{ marginTop: 12, background: "#f97316", color: "#fff", border: 0, borderRadius: 10, padding: "10px 18px", fontWeight: 600 }}>
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
