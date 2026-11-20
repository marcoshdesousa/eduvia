"use server";
import { requireUser } from "@/lib/session";
import { PaymentError, startUnlockPix } from "@/lib/subscription";

export async function unlockPixAction(phoneRaw: string): Promise<{ paymentId?: string; error?: string }> {
  const user = await requireUser();
  const phone = phoneRaw.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (!user.provider && !/^\d{10,11}$/.test(phone)) return { error: "Informe o seu celular com DDD (o banco pede para gerar o Pix)." };
  try {
    return { paymentId: (await startUnlockPix(user.id, /^\d{10,11}$/.test(phone) ? phone : undefined)).id };
  } catch (e) {
    if (e instanceof PaymentError) return { error: e.message };
    throw e;
  }
}
