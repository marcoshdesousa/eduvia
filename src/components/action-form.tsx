"use client";
import { startTransition, type FormHTMLAttributes } from "react";

/**
 * Formulário para server actions que NÃO limpa os campos após o envio
 * (o <form action> do React 19 reseta o formulário, o que apaga o que o aluno digitou quando há erro).
 */
export function ActionForm({ action, ...props }: { action: (formData: FormData) => void } & Omit<FormHTMLAttributes<HTMLFormElement>, "action" | "onSubmit">) {
  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
    />
  );
}
