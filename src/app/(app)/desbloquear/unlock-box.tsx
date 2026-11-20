"use client";
import { useState } from "react";
import { PixBox } from "@/components/pix-box";
import { Input, Label } from "@/components/ui/form";
import { unlockPixAction } from "./actions";

export function UnlockBox({ label, askPhone }: { label: string; askPhone: boolean }) {
  const [phone, setPhone] = useState("");
  return (
    <div className="space-y-3">
      {askPhone && (
        <div>
          <Label htmlFor="phone">Seu celular (o banco pede para gerar o Pix)</Label>
          <Input id="phone" type="tel" inputMode="tel" placeholder="(11) 98765-4321" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      )}
      <PixBox start={() => unlockPixAction(phone)} label={label} paidText="Pronto! Sua conta está liberada." />
    </div>
  );
}
