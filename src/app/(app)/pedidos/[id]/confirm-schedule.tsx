"use client";
import { AddressFields, type SavedAddress } from "@/components/address-fields";
import { ActionForm } from "@/components/action-form";
import { ShoppingPhone } from "@/components/shopping-fields";
import { SubmitButton } from "@/components/submit-button";
import { PAY_METHODS, isPayMethod } from "@/lib/domain";
import { confirmScheduleAction } from "./actions";

export function ConfirmSchedule({ bookingId, saved, ufs, payMethods, shopping }: { bookingId: string; saved: SavedAddress[]; ufs: { uf: string; name: string }[]; payMethods: string[]; shopping?: boolean }) {
  const methods = payMethods.filter(isPayMethod);
  return (
    <ActionForm action={confirmScheduleAction.bind(null, bookingId)} className="space-y-3">
      <AddressFields saved={saved} ufs={ufs} />
      {shopping && <ShoppingPhone />}
      {methods.length > 0 && (
        <fieldset className="flex flex-wrap items-center gap-4 text-sm">
          <legend className="mb-1 w-full text-sm font-medium">Como vai pagar (o prestador aceita)</legend>
          {methods.map((m, i) => (
            <label key={m} className="flex items-center gap-2"><input type="radio" name="payMethod" value={m} defaultChecked={i === 0} className="accent-[var(--primary)]" /> {PAY_METHODS[m]}</label>
          ))}
        </fieldset>
      )}
      <SubmitButton size="lg" className="w-full" pendingText="Confirmando…">Confirmar agendamento</SubmitButton>
    </ActionForm>
  );
}
