"use client";
import { useTransition } from "react";
import { cancelSubscriptionAction } from "@/app/actions/billing";
import { Button } from "@/components/ui/button";

export function CancelButton({ until }: { until: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={() => confirm(`Cancelar a renovação? Você continua com acesso até ${until}.`) && start(() => cancelSubscriptionAction())}
    >
      {pending ? "Cancelando..." : "Cancelar assinatura"}
    </Button>
  );
}
