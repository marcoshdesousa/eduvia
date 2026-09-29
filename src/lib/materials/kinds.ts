import type { MaterialKind } from "@/generated/prisma/enums";

export const ACCEPT = ".pdf,.docx,.png,.jpg,.jpeg,.webp,.txt,.md";

export function kindFor(filename: string, mime: string): MaterialKind | null {
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  if (ext === "pdf" || mime === "application/pdf") return "PDF";
  if (ext === "docx" || mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "DOCX";
  if (["png", "jpg", "jpeg", "webp"].includes(ext) || mime.startsWith("image/")) return "IMAGE";
  if (["txt", "md"].includes(ext) || mime.startsWith("text/")) return "TEXT";
  return null;
}

export function mimeFor(kind: MaterialKind, mime: string) {
  if (mime) return mime;
  return { PDF: "application/pdf", DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", IMAGE: "image/jpeg", TEXT: "text/plain" }[kind];
}
