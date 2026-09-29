import { NextResponse } from "next/server";
import { checkHandleAvailable } from "@/lib/handles";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  const h = new URL(req.url).searchParams.get("h") ?? "";
  const user = await getCurrentUser().catch(() => null);
  const result = await checkHandleAvailable(h, user?.id);
  return NextResponse.json(result);
}
