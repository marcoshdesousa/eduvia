"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import {
  deleteGroupAction,
  importMaterialAction,
  leaveGroupAction,
  removeMemberAction,
  setRoleAction,
  shareAction,
  transferAction,
  unshareAction,
} from "@/app/actions/groups";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/form";

type ShareType = "MATERIAL" | "SUMMARY" | "QUESTION_SET" | "EXAM";
const TYPE_LABEL: Record<ShareType, string> = { MATERIAL: "Material (PDF)", SUMMARY: "Resumo (texto de estudo)", QUESTION_SET: "Lista de questões", EXAM: "Simulado" };

export function ShareForm({ groupId, resources }: { groupId: string; resources: Record<ShareType, { id: string; label: string }[]> }) {
  const [type, setType] = useState<ShareType>("MATERIAL");
  const [resourceId, setResourceId] = useState("");
  const [result, setResult] = useState<{ error?: string; message?: string } | null>(null);
  const [pending, start] = useTransition();
  const options = resources[type];
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Select value={type} onChange={(e) => { setType(e.target.value as ShareType); setResourceId(""); setResult(null); }} className="sm:w-56" aria-label="Tipo">
          {(Object.keys(TYPE_LABEL) as ShareType[]).map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
        </Select>
        <Select value={resourceId} onChange={(e) => { setResourceId(e.target.value); setResult(null); }} aria-label="O que compartilhar">
          <option value="">{options.length ? "Escolha..." : "Nada disponível deste tipo"}</option>
          {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </Select>
        <Button disabled={pending || !resourceId} onClick={() => start(async () => { setResult(await shareAction(groupId, type, resourceId)); setResourceId(""); })}>Compartilhar</Button>
      </div>
      {result?.error && <p className="text-sm text-danger">{result.error}</p>}
      {result?.message && <p className="text-sm text-success">{result.message}</p>}
    </div>
  );
}

export function SharedItemActions({
  groupId,
  share,
  canRemove,
  isMine,
  preparations,
}: {
  groupId: string;
  share: { id: string; type: ShareType; resourceId: string };
  canRemove: boolean;
  isMine: boolean;
  preparations: { id: string; title: string }[];
}) {
  const [pending, start] = useTransition();
  const [prepId, setPrepId] = useState(preparations[0]?.id ?? "");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ error?: string; message?: string } | null>(null);
  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <div className="flex flex-wrap gap-2">
        {share.type === "MATERIAL" && (
          <>
            <a href={`/api/materials/${share.resourceId}/file`} target="_blank" rel="noreferrer" className={buttonClass("outline", "sm")}>Abrir</a>
            {!isMine && preparations.length > 0 && <Button size="sm" onClick={() => setImporting((v) => !v)}>Adicionar à minha preparação</Button>}
          </>
        )}
        {(share.type === "SUMMARY" || share.type === "QUESTION_SET") && (
          <Link href={`/grupos/${groupId}/compartilhado/${share.id}`} className={buttonClass("primary", "sm")}>{share.type === "SUMMARY" ? "Ler" : "Praticar"}</Link>
        )}
        {share.type === "EXAM" && <Link href={`/simulados/${share.resourceId}`} className={buttonClass("primary", "sm")}>Fazer simulado</Link>}
        {canRemove && (
          <Button size="sm" variant="ghost" disabled={pending} onClick={() => confirm("Remover do grupo?") && start(async () => void (await unshareAction(share.id, groupId)))}>Remover</Button>
        )}
      </div>
      {importing && (
        <div className="flex gap-2">
          <Select value={prepId} onChange={(e) => setPrepId(e.target.value)} className="h-8" aria-label="Preparação de destino">
            {preparations.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </Select>
          <Button size="sm" disabled={pending} onClick={() => start(async () => { setResult(await importMaterialAction(share.id, prepId)); setImporting(false); })}>Adicionar</Button>
        </div>
      )}
      {result?.error && <p className="text-xs text-danger">{result.error}</p>}
      {result?.message && <p className="text-xs text-success">{result.message}</p>}
    </div>
  );
}

export function MemberActions({ groupId, target, myRole }: { groupId: string; target: { id: string; role: string; handle: string }; myRole: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const act = (fn: () => Promise<{ error?: string } | undefined>) => start(async () => setError((await fn())?.error ?? null));
  if (target.role === "OWNER") return null;
  const isOwner = myRole === "OWNER";
  const canRemove = isOwner || (myRole === "ADMIN" && target.role === "MEMBER");
  return (
    <div className="flex flex-wrap items-center gap-1">
      {isOwner && (
        target.role === "MEMBER" ? (
          <Button size="sm" variant="ghost" disabled={pending} onClick={() => act(() => setRoleAction(groupId, target.id, "ADMIN"))}>Tornar admin</Button>
        ) : (
          <Button size="sm" variant="ghost" disabled={pending} onClick={() => act(() => setRoleAction(groupId, target.id, "MEMBER"))}>Tirar admin</Button>
        )
      )}
      {isOwner && (
        <Button size="sm" variant="ghost" disabled={pending} onClick={() => confirm(`Passar a posse do grupo para @${target.handle}? Você vira administrador.`) && act(() => transferAction(groupId, target.id))}>Passar posse</Button>
      )}
      {canRemove && (
        <Button size="sm" variant="ghost" className="text-danger" disabled={pending} onClick={() => confirm(`Remover @${target.handle} do grupo?`) && act(() => removeMemberAction(groupId, target.id))}>Remover</Button>
      )}
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}

export function DangerZone({ groupId, isOwner, groupName }: { groupId: string; isOwner: boolean; groupName: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <Card className="space-y-2">
      <CardTitle>{isOwner ? "Excluir grupo" : "Sair do grupo"}</CardTitle>
      {error && <p className="text-sm text-danger">{error}</p>}
      {isOwner ? (
        <>
          <p className="text-sm text-muted">Para sair, passe a posse para outro membro. Excluir apaga o mural e os compartilhamentos (os materiais continuam com seus donos).</p>
          <Button variant="danger" disabled={pending} onClick={() => confirm(`Excluir o grupo "${groupName}"? Não dá para desfazer.`) && start(async () => setError((await deleteGroupAction(groupId))?.error ?? null))}>Excluir grupo</Button>
        </>
      ) : (
        <Button variant="outline" disabled={pending} onClick={() => confirm("Sair do grupo?") && start(async () => setError((await leaveGroupAction(groupId))?.error ?? null))}>Sair do grupo</Button>
      )}
    </Card>
  );
}
