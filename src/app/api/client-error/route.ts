/** Recebe erros do navegador (ex.: leitor de PDF) e registra no log do servidor. */
export async function POST(req: Request) {
  const text = (await req.text().catch(() => "")).slice(0, 1000);
  console.error("[navegador]", text);
  return new Response(null, { status: 204 });
}
