import { NextResponse, type NextRequest } from "next/server";

/** Passa o caminho da página para o layout (disponível em headers() como x-pathname). */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon|icon|apple-icon|manifest|sw.js|avatars|pdf.worker).*)"],
};
