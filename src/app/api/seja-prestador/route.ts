import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { MIN_AGE, ageOn, parseDateOnly } from "@/lib/domain";
import { MAX_IMAGE_BYTES, imageType, newKey } from "@/lib/files";
import { notify } from "@/lib/notifications";
import { InputError, readBio, readPlace, readService } from "@/lib/provider-input";
import { sealSecret } from "@/lib/secret-box";
import { startTrialIfEligible } from "@/lib/subscription";
import { deleteObject, writeObject } from "@/lib/storage";

/** Cria o perfil de prestador da conta (foto, 1º serviço, 1º endereço) e começa o teste grátis, se o CPF ainda não usou. */
export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  if (user.role === "ADMIN") return jsonError("A conta de administração não pode ser prestador.", 403);
  if (user.provider) return NextResponse.json({ next: "/painel" });
  const f = await req.formData().catch(() => null);
  if (!f) return jsonError("Formulário inválido.");
  let key: string | null = null;
  try {
    if (f.get("terms") !== "on") throw new InputError("Aceite os Termos de uso para continuar.");
    const birth = parseDateOnly(String(f.get("birthDate") ?? ""));
    if (!birth || birth.getUTCFullYear() < 1920) throw new InputError("Informe a sua data de nascimento.");
    if (ageOn(birth) < MIN_AGE) throw new InputError(`É preciso ter ${MIN_AGE} anos ou mais para oferecer serviços.`);
    const phone = String(f.get("phone") ?? "").replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
    if (!/^\d{10,11}$/.test(phone)) throw new InputError("Informe o seu celular com DDD.");
    const service = readService(f);
    const place = readPlace(f);
    const bio = readBio(f);
    const photo = f.get("photo");
    if (!(photo instanceof Blob) || !photo.size) throw new InputError("Adicione uma foto do seu rosto.");
    if (photo.size > MAX_IMAGE_BYTES) throw new InputError("Foto grande demais.");
    const bytes = Buffer.from(await photo.arrayBuffer());
    const type = imageType(bytes);
    if (!type) throw new InputError("A foto precisa ser JPG, PNG ou WebP.");
    key = newKey("perfil", type.ext);
    await writeObject(key, bytes, type.mime);
    const pro = await db.providerProfile.create({
      data: {
        userId: user.id,
        birthDate: birth,
        phoneSealed: sealSecret(phone),
        photoKey: key,
        bio,
        services: { create: service },
        places: { create: place },
        // horário padrão: segunda a sábado, 7h às 18h (o prestador muda na agenda)
        availability: { create: [1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, startMin: 7 * 60, endMin: 18 * 60 })) },
      },
    });
    const trial = await startTrialIfEligible(pro.id, user.cpfHash);
    await notify(user.id, trial
      ? { title: "Seu perfil está no ar 🎉", body: "Você ganhou 3 dias grátis do plano Completo. Ligue o botão Disponível para receber chamados do Contrate rápido.", href: "/painel" }
      : { title: "Perfil criado", body: "Este CPF já usou o teste grátis. Escolha um plano para aparecer para os clientes.", href: "/painel/plano" });
    return NextResponse.json({ next: trial ? "/painel?novo=1" : "/painel/plano" });
  } catch (e) {
    if (key) await deleteObject(key).catch(() => {});
    if (e instanceof InputError) return jsonError(e.message);
    if ((e as { code?: string }).code === "P2002") return NextResponse.json({ next: "/painel" });
    throw e;
  }
}
