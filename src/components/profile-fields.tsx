"use client";
import { useState } from "react";
import Link from "next/link";
import { HandleInput } from "@/components/handle-input";
import { Field, Input } from "@/components/ui/form";

function ageFrom(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const b = new Date(`${value}T00:00:00Z`);
  const now = new Date();
  let age = now.getUTCFullYear() - b.getUTCFullYear();
  const m = now.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < b.getUTCDate())) age--;
  return age;
}

/** @, data de nascimento, responsável (se menor) e aceite dos termos — usado no cadastro e no onboarding. */
export function ProfileFields({ defaultHandle = "" }: { defaultHandle?: string }) {
  const [birth, setBirth] = useState("");
  const age = ageFrom(birth);
  const minor = age !== null && age < 18;
  return (
    <>
      <Field label="Seu @ (nome de usuário)" htmlFor="handle">
        <HandleInput defaultValue={defaultHandle} />
      </Field>
      <Field label="Data de nascimento" htmlFor="birthDate">
        <Input id="birthDate" name="birthDate" type="date" required value={birth} onChange={(e) => setBirth(e.target.value)} max={new Date().toISOString().slice(0, 10)} />
      </Field>
      {minor && (
        <div className="space-y-3 rounded-lg border border-warning/40 bg-warning/10 p-3">
          <p className="text-sm">
            Como você tem menos de 18 anos, a LGPD exige a <strong>autorização de um dos pais ou responsável</strong>. Vamos enviar um e-mail para ele(a) autorizar.
          </p>
          <Field label="Nome do responsável" htmlFor="guardianName">
            <Input id="guardianName" name="guardianName" required />
          </Field>
          <Field label="E-mail do responsável" htmlFor="guardianEmail">
            <Input id="guardianEmail" name="guardianEmail" type="email" required />
          </Field>
        </div>
      )}
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="terms" required className="mt-1 accent-[var(--primary)]" />
        <span className="text-muted">
          Li e aceito os <Link href="/termos" target="_blank" className="text-primary underline">termos de uso</Link> e a{" "}
          <Link href="/privacidade" target="_blank" className="text-primary underline">política de privacidade</Link>. Sou responsável pelos materiais que envio e compartilho.
        </span>
      </label>
    </>
  );
}
