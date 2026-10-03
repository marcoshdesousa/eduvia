"use client";
import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { regeneratePlanAction } from "@/app/actions/preparations";
import { Button } from "@/components/ui/button";

export function RegenerateButton({ preparationId }: { preparationId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button size="sm" variant="outline" disabled={pending} onClick={() => start(() => regeneratePlanAction(preparationId))}>
      <RefreshCw size={14} className={pending ? "animate-spin" : ""} /> Refazer plano
    </Button>
  );
}
