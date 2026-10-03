import { onlyDigits } from "./cpf";

/** Normaliza telefone brasileiro para DDD + número (10 ou 11 dígitos). Retorna null se inválido. */
export function normalizePhone(raw: string): string | null {
  let d = onlyDigits(raw);
  if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2);
  if (d.length !== 10 && d.length !== 11) return null;
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99) return null;
  if (d.length === 11 && d[2] !== "9") return null;
  return d;
}

export function formatPhone(d: string) {
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
}

export function formatCpf(d: string) {
  return d.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

/** CPF parcialmente oculto para exibição: ***.456.789-** */
export function maskCpf(d: string) {
  return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
}
