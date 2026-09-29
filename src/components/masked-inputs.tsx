"use client";
import { useState } from "react";
import { Input } from "@/components/ui/form";

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

export function CpfInput({ name = "cpf", defaultValue = "" }: { name?: string; defaultValue?: string }) {
  const [v, setV] = useState(maskCpf(defaultValue));
  return <Input id={name} name={name} inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" value={v} onChange={(e) => setV(maskCpf(e.target.value))} required />;
}

export function PhoneInput({ name = "phone", defaultValue = "" }: { name?: string; defaultValue?: string }) {
  const [v, setV] = useState(maskPhone(defaultValue));
  return <Input id={name} name={name} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(11) 98765-4321" value={v} onChange={(e) => setV(maskPhone(e.target.value))} required />;
}
