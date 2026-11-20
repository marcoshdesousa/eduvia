"use client";
import { useState } from "react";
import { Input, Label } from "@/components/ui/form";
import { isValidCpf } from "@/lib/core/cpf";

function maskCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** CPF com máscara e verificação na hora: CPF inválido não deixa o formulário seguir. */
export function CpfInput({ name = "cpf", defaultValue = "" }: { name?: string; defaultValue?: string }) {
  const [v, setV] = useState(maskCpf(defaultValue));
  const digits = v.replace(/\D/g, "");
  const invalid = digits.length === 11 && !isValidCpf(digits);
  return (
    <>
      <Input
        id={name}
        name={name}
        inputMode="numeric"
        autoComplete="off"
        placeholder="000.000.000-00"
        value={v}
        aria-invalid={invalid || undefined}
        onChange={(e) => {
          const masked = maskCpf(e.target.value);
          setV(masked);
          const d = masked.replace(/\D/g, "");
          e.target.setCustomValidity(d.length === 11 && !isValidCpf(d) ? "CPF inválido. Confira os números." : d.length > 0 && d.length < 11 ? "O CPF tem 11 números." : "");
        }}
        required
      />
      {invalid && <p className="mt-1 text-xs text-danger">CPF inválido. Confira os números.</p>}
    </>
  );
}

export function PhoneInput({ name = "phone", defaultValue = "" }: { name?: string; defaultValue?: string }) {
  const [v, setV] = useState(maskPhone(defaultValue));
  return <Input id={name} name={name} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(11) 98765-4321" value={v} onChange={(e) => setV(maskPhone(e.target.value))} required />;
}

/** Senha + confirmação: as duas precisam ser iguais (o navegador bloqueia o envio se não forem). */
export function PasswordPair({ name = "password", label = "Senha", autoComplete = "new-password" }: { name?: string; label?: string; autoComplete?: string }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const mismatch = b.length > 0 && a !== b;
  const check = (el: HTMLInputElement | null, pwd: string, confirm: string) => el?.setCustomValidity(confirm && pwd !== confirm ? "As senhas não são iguais." : "");
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          name={name}
          type="password"
          autoComplete={autoComplete}
          minLength={8}
          required
          value={a}
          onChange={(e) => {
            setA(e.target.value);
            check(document.getElementById(`${name}Confirm`) as HTMLInputElement | null, e.target.value, b);
          }}
        />
        <p className="mt-1 text-xs text-muted">Mínimo de 8 caracteres.</p>
      </div>
      <div>
        <Label htmlFor={`${name}Confirm`}>Confirme a senha</Label>
        <Input
          id={`${name}Confirm`}
          name={`${name}Confirm`}
          type="password"
          autoComplete={autoComplete}
          minLength={8}
          required
          value={b}
          aria-invalid={mismatch || undefined}
          onChange={(e) => {
            setB(e.target.value);
            check(e.target, a, e.target.value);
          }}
        />
        {mismatch ? <p className="mt-1 text-xs text-danger">As senhas não são iguais.</p> : <p className="mt-1 text-xs text-muted">Digite a mesma senha de novo.</p>}
      </div>
    </div>
  );
}
