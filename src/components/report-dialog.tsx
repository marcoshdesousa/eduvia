"use client";
import { useState } from "react";
import { Flag } from "lucide-react";
import { ActionForm, type ActionResult } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/form";

/** Botão "Denunciar" que abre um formulário curto (motivo + detalhes). */
export function ReportButton({
  action,
  reasons,
  targetId,
  bookingId,
  messageId,
  reviewId,
  label = "Denunciar",
  small,
}: {
  action: (p: ActionResult, d: FormData) => Promise<ActionResult>;
  reasons: readonly string[];
  targetId?: string;
  bookingId?: string;
  messageId?: string;
  reviewId?: string;
  label?: string;
  small?: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <Button type="button" variant="ghost" size="sm" className={small ? "h-7 px-2 text-xs text-muted" : "text-muted"} onClick={() => setOpen(true)}>
        <Flag size={14} /> {label}
      </Button>
    );
  return (
    <div className="w-full rounded-lg border border-border bg-surface-2 p-3">
      <ActionForm action={action} className="space-y-2">
        {targetId && <input type="hidden" name="targetId" value={targetId} />}
        {bookingId && <input type="hidden" name="bookingId" value={bookingId} />}
        {messageId && <input type="hidden" name="messageId" value={messageId} />}
        {reviewId && <input type="hidden" name="reviewId" value={reviewId} />}
        <Select name="reason" required defaultValue="" aria-label="Motivo da denúncia">
          <option value="" disabled>Escolha o motivo</option>
          {reasons.map((r) => <option key={r}>{r}</option>)}
        </Select>
        <Textarea name="details" maxLength={1000} placeholder="Conte o que aconteceu (opcional)" className="min-h-16" />
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Fechar</Button>
          <SubmitButton size="sm" variant="danger" pendingText="Enviando…">Enviar denúncia</SubmitButton>
        </div>
      </ActionForm>
    </div>
  );
}
