"use client";
import { startTransition, type FormHTMLAttributes } from "react";

/**
 * Formulário para server actions que NÃO limpa os campos após o envio
 * (o <form action> do React 19 reseta o formulário, o que apaga o que o aluno digitou quando há erro).
 */
export function ActionForm({
  action,
  beforeSubmit,
  ...props
}: {
  action: (formData: FormData) => void;
  /** Devolve false para não enviar (ex.: formulário em etapas, indo para a próxima). */
  beforeSubmit?: () => boolean;
  ref?: React.Ref<HTMLFormElement>;
} & Omit<FormHTMLAttributes<HTMLFormElement>, "action" | "onSubmit">) {
  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        if (beforeSubmit && !beforeSubmit()) return;
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
    />
  );
}
