import { NextResponse } from "next/server";
import { AccountError, checkCpf, checkName, checkPassword, createAccount, signInWithCpf } from "@/lib/accounts";
import { db } from "@/lib/db";
import { MIN_AGE, ageOn, parseDateOnly } from "@/lib/domain";
import { MAX_IMAGE_BYTES, imageType, newKey } from "@/lib/files";
import { normalizePhone } from "@/lib/core/phone";
import { notify } from "@/lib/notifications";
import { officialCity, citiesOf } from "@/lib/places";
import { sealSecret } from "@/lib/secret-box";
import { writeObject } from "@/lib/storage";

const err = (message: string, status = 400) => NextResponse.json({ error: message }, { status });

/** Cadastro do profissional: tudo conferido aqui no servidor (idade calculada aqui, CPF, foto, município). */
export async function POST(req: Request) {
  const d = await req.formData().catch(() => null);
  if (!d) return err("Envie o formulário completo.");
  const s = (k: string) => String(d.get(k) ?? "");
  try {
    if (d.get("terms") !== "on") throw new AccountError("Aceite os Termos de uso e a Política de privacidade.");
    const name = checkName(s("name"));
    const cpf = checkCpf(s("cpf"));
    const birth = parseDateOnly(s("birthDate"));
    if (!birth || birth.getUTCFullYear() < 1920) throw new AccountError("Informe a data de nascimento.");
    if (ageOn(birth) < MIN_AGE) throw new AccountError("O cadastro de profissional é só para maiores de 18 anos.");
    const whatsapp = normalizePhone(s("whatsapp"));
    if (!whatsapp) throw new AccountError("WhatsApp inválido. Use DDD + número.");
    const uf = s("uf").toUpperCase();
    if (!citiesOf(uf).length) throw new AccountError("Escolha o estado.");
    const city = officialCity(uf, s("cidade"));
    if (!city) throw new AccountError("Escolha um município da lista.");
    checkPassword(s("password"), s("passwordConfirm"));
    const photo = d.get("photo");
    if (!(photo instanceof Blob) || !photo.size) throw new AccountError("Adicione uma foto do seu rosto.");
    if (photo.size > MAX_IMAGE_BYTES) throw new AccountError("Foto grande demais.");
    const bytes = Buffer.from(await photo.arrayBuffer());
    const type = imageType(bytes);
    if (!type) throw new AccountError("A foto precisa ser JPG, PNG ou WebP.");

    let proId = "";
    const key = newKey("perfil", type.ext);
    const userId = await createAccount({ name, cpf, password: s("password"), role: "PRO" }, async (tx, id) => {
      const pro = await tx.professionalProfile.create({
        data: { userId: id, birthDate: birth, whatsappSealed: sealSecret(whatsapp), photoKey: key, status: "INCOMPLETE", areas: { create: { uf, city } } },
      });
      proId = pro.id;
    });
    try {
      await writeObject(key, bytes, type.mime);
    } catch (e) {
      console.error("[cadastro] foto", e);
      await db.professionalProfile.update({ where: { id: proId }, data: { photoKey: null } });
    }
    await signInWithCpf(cpf, s("password"));
    await notify(userId, {
      title: "Bem-vindo(a) à HoraLimp!",
      body: "Complete o perfil (preço por hora e serviços) e envie para verificação.",
      href: "/painel/perfil",
    });
    return NextResponse.json({ next: "/painel" });
  } catch (e) {
    if (e instanceof AccountError) return err(e.message);
    console.error("[cadastro profissional]", e);
    return err("Não foi possível criar a conta agora. Tente de novo em instantes.", 500);
  }
}
