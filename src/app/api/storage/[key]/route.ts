// Armazenamento local (desenvolvimento): recebe e serve arquivos com assinatura temporária.
import { NextResponse } from "next/server";
import { MAX_UPLOAD_BYTES, readObject, verifyLocalSignature, writeObject } from "@/lib/storage";

function check(req: Request, key: string, action: "put" | "get") {
  const url = new URL(req.url);
  return verifyLocalSignature(key, action, Number(url.searchParams.get("exp")), url.searchParams.get("sig") ?? "");
}

export async function PUT(req: Request, { params }: { params: Promise<{ key: string }> }) {
  if (process.env.STORAGE_DRIVER === "s3") return new NextResponse(null, { status: 404 });
  const key = decodeURIComponent((await params).key);
  if (!check(req, key, "put")) return NextResponse.json({ error: "Assinatura inválida" }, { status: 403 });
  const data = Buffer.from(await req.arrayBuffer());
  if (data.length > MAX_UPLOAD_BYTES) return NextResponse.json({ error: "Arquivo grande demais" }, { status: 413 });
  await writeObject(key, data, req.headers.get("content-type") ?? "application/octet-stream");
  return new NextResponse(null, { status: 200 });
}

export async function GET(req: Request, { params }: { params: Promise<{ key: string }> }) {
  if (process.env.STORAGE_DRIVER === "s3") return new NextResponse(null, { status: 404 });
  const key = decodeURIComponent((await params).key);
  if (!check(req, key, "get")) return NextResponse.json({ error: "Link expirado" }, { status: 403 });
  try {
    const data = await readObject(key);
    const type = key.endsWith(".pdf") ? "application/pdf" : key.match(/\.(png|jpe?g|webp)$/) ? `image/${key.split(".").pop()!.replace("jpg", "jpeg")}` : "application/octet-stream";
    return new NextResponse(new Uint8Array(data), { headers: { "content-type": type, "content-disposition": "inline", "cache-control": "private, max-age=300" } });
  } catch {
    return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
  }
}
