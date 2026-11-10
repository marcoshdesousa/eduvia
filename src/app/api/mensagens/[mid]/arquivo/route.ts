import { NextResponse } from "next/server";
import { apiUser } from "@/lib/api";
import { chatAccess } from "@/lib/chat";
import { db } from "@/lib/db";
import { readObject } from "@/lib/storage";

/** Foto ou áudio do chat: só as duas partes da contratação (e o admin) abrem. Aceita Range (áudio no iPhone). */
export async function GET(req: Request, { params }: { params: Promise<{ mid: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { mid } = await params;
  const m = await db.message.findUnique({ where: { id: mid } });
  if (!m?.fileKey) return new NextResponse(null, { status: 404 });
  const access = await chatAccess(m.bookingId, user);
  if (!access?.read) return new NextResponse(null, { status: 404 });
  let data: Buffer;
  try {
    data = await readObject(m.fileKey);
  } catch {
    return new NextResponse(null, { status: 404 });
  }
  const headers: Record<string, string> = { "content-type": m.mime ?? "application/octet-stream", "accept-ranges": "bytes", "cache-control": "private, max-age=3600", "x-content-type-options": "nosniff" };
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.get("range") ?? "");
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), data.length - 1) : data.length - 1;
    if (start >= data.length || start > end) return new NextResponse(null, { status: 416, headers: { "content-range": `bytes */${data.length}` } });
    return new NextResponse(new Uint8Array(data.subarray(start, end + 1)), { status: 206, headers: { ...headers, "content-range": `bytes ${start}-${end}/${data.length}`, "content-length": String(end - start + 1) } });
  }
  return new NextResponse(new Uint8Array(data), { headers: { ...headers, "content-length": String(data.length) } });
}
