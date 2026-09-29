"use client";
import Link from "next/link";
import { HandleInput } from "@/components/handle-input";
import { CpfInput, PhoneInput } from "@/components/masked-inputs";
import { Field } from "@/components/ui/form";

/** CPF, WhatsApp, @ e aceite dos termos — usado no cadastro e ao completar o cadastro. */
export function ProfileFields({ defaultHandle = "", defaultPhone = "" }: { defaultHandle?: string; defaultPhone?: string }) {
  return (
    <>
      <Field label="CPF" htmlFor="cpf" hint="Usado para entrar e para recuperar a senha.">
        <CpfInput />
      </Field>
      <Field label="Telefone (WhatsApp)" htmlFor="phone">
        <PhoneInput defaultValue={defaultPhone} />
      </Field>
      <Field label="Seu @ (nome de usuário)" htmlFor="handle">
        <HandleInput defaultValue={defaultHandle} />
      </Field>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="terms" required className="mt-1 accent-[var(--primary)]" />
        <span className="text-muted">
          Li e aceito os <Link href="/termos" target="_blank" className="text-primary underline">termos de uso</Link> e a{" "}
          <Link href="/privacidade" target="_blank" className="text-primary underline">política de privacidade</Link>. Sou responsável pelos materiais que envio. Se tenho menos de 18
          anos, meu responsável autorizou o uso.
        </span>
      </label>
    </>
  );
}
