// Recebe uma imagem enviada pelo app, confere o tipo pelo conteúdo e grava no armazenamento.
import { MAX_IMAGE_BYTES, imageType, newKey } from "@/lib/files";
import { writeObject } from "@/lib/storage";

export async function saveImage(file: FormDataEntryValue | null, folder: string): Promise<{ key: string } | { error: string }> {
  if (!(file instanceof Blob) || !file.size) return { error: "Envie a foto." };
  if (file.size > MAX_IMAGE_BYTES) return { error: "Foto grande demais (máximo 6 MB)." };
  const bytes = Buffer.from(await file.arrayBuffer());
  const type = imageType(bytes);
  if (!type) return { error: "A foto precisa ser JPG, PNG ou WebP." };
  const key = newKey(folder, type.ext);
  await writeObject(key, bytes, type.mime);
  return { key };
}
