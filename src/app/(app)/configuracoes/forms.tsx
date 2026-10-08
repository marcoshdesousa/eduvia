"use client";
import { ActionForm } from "@/components/action-form";
import { useActionState } from "react";
import { changePasswordAction, deleteAccountAction, updateProfileAction } from "@/app/actions/settings";
import { AvatarPicker } from "@/components/avatar-picker";
import { PasswordPair, PhoneInput } from "@/components/masked-inputs";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input, Select } from "@/components/ui/form";

const TIMEZONES = ["America/Sao_Paulo", "America/Manaus", "America/Cuiaba", "America/Belem", "America/Fortaleza", "America/Recife", "America/Bahia", "America/Porto_Velho", "America/Rio_Branco", "America/Noronha"];

export function ProfileForm({ name, handle, phone, visibility, timezone, avatar, subscriber }: { name: string; handle: string; phone: string; visibility: string; timezone: string; avatar: string | null; subscriber: boolean }) {
  const [state, action, pending] = useActionState(updateProfileAction, undefined);
  return (
    <ActionForm action={action} className="space-y-4">
      <FormError message={state?.error} />
      {state?.message && <p className="text-sm text-success">{state.message}</p>}
      <AvatarPicker current={avatar} subscriber={subscriber} />
      <Field label="Nome" htmlFor="name"><Input id="name" name="name" defaultValue={name} /></Field>
      <Field label="@ de usuário" htmlFor="handle" hint="O @ é a sua identidade no Eduvia e não pode ser trocado.">
        <Input id="handle" value={`@${handle}`} readOnly disabled />
      </Field>
      <Field label="Telefone (WhatsApp)" htmlFor="phone" hint="Usado para confirmar a conta ao criar uma nova senha."><PhoneInput defaultValue={phone} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Perfil" htmlFor="profileVisibility" hint="Privado: outras pessoas não veem suas estatísticas.">
          <Select id="profileVisibility" name="profileVisibility" defaultValue={visibility}>
            <option value="PUBLIC">Público</option>
            <option value="PRIVATE">Privado</option>
          </Select>
        </Field>
        <Field label="Fuso horário" htmlFor="timezone">
          <Select id="timezone" name="timezone" defaultValue={timezone}>
            {TIMEZONES.map((t) => <option key={t} value={t}>{t.replace("America/", "").replace("_", " ")}</option>)}
          </Select>
        </Field>
      </div>
      <Button disabled={pending}>Salvar</Button>
    </ActionForm>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, undefined);
  return (
    <ActionForm action={action} className="space-y-4">
      <FormError message={state?.error} />
      {state?.message && <p className="text-sm text-success">{state.message}</p>}
      <Field label="Senha atual" htmlFor="currentPassword"><Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required /></Field>
      <PasswordPair name="newPassword" label="Nova senha" />
      <Button variant="secondary" disabled={pending}>Alterar senha</Button>
    </ActionForm>
  );
}

export function DeleteAccountForm({ handle }: { handle: string }) {
  const [state, action, pending] = useActionState(deleteAccountAction, undefined);
  return (
    <ActionForm action={action} className="space-y-3">
      <FormError message={state?.error} />
      <p className="text-sm text-muted">Apaga sua conta e todo o seu histórico de estudo. Não dá para desfazer. Digite <strong>@{handle}</strong> para confirmar.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input name="confirm" placeholder={`@${handle}`} className="sm:max-w-xs" />
        <Button variant="danger" disabled={pending}>Excluir minha conta</Button>
      </div>
    </ActionForm>
  );
}
