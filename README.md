# HoraLimp

**Sua casa em boas mãos, no seu tempo.** Marketplace que conecta clientes a profissionais autônomos de limpeza residencial.

- **Cliente**: cadastro e uso grátis (nome, CPF e senha). Busca por município, compara perfis, pede limpeza por hora (1 a 12 h) com data, horário e endereço, conversa no chat e avalia.
- **Profissional** (18+): nome, nascimento, CPF, WhatsApp (privado), foto do rosto (com corte e prévia redonda), estado e município. Define o próprio preço por hora, serviços, municípios e agenda; aceita ou recusa cada pedido; pode pausar.
- **Assinatura do profissional**: R$ 15,85/mês (R$ 15,00 + R$ 0,85), por Pix (SyncPay). Sem comissão, sem taxa por hora ou por serviço. Só aparece na vitrine quem está **aprovado** e com **assinatura em dia**.
- **O pagamento da limpeza** é feito direto ao profissional (dinheiro ou Pix). A HoraLimp não recebe nem processa esse valor.
- **Admin**: verificação de profissionais (aprovar, pedir correção, suspender), usuários (bloquear, link de nova senha), solicitações, assinaturas (inclusive liberar 30 dias), denúncias, suporte, configurações, indicadores e auditoria.

> A HoraLimp substituiu a Eduvia neste repositório. A migração `37_horalimp` **apaga todas as tabelas e dados da Eduvia** (pedido do dono) e cria as da HoraLimp.

## Como funciona a contratação

1. Cliente escolhe o município → vê profissionais aprovados, com assinatura ativa e sem pausa.
2. Escolhe serviços, horas, data/horário e endereço (localização atual com permissão, CEP, endereço salvo ou ponto no mapa).
3. Vê o **valor estimado = preço por hora × horas** e envia. Nada é cobrado do cliente.
4. O profissional **aceita ou recusa**. Sem resposta no prazo (padrão 12 h, ajustável no admin), a solicitação expira.
5. Só depois do aceite: **chat** (texto, áudio e foto) e **endereço completo** para o profissional.
6. Andamento: a caminho → chegou → iniciado → concluído. Cada mudança fica no histórico (quem, quando, motivo).
7. Concluído: cliente e profissional se avaliam (1 a 5 estrelas). Só quem participou pode avaliar.

## Segurança e privacidade (LGPD)

- Login por **CPF + senha** (hash forte do Better Auth). O CPF é guardado como código (HMAC) e criptografado (AES-GCM); nunca aparece publicamente. O cadastro direto pela API de login fica desligado.
- WhatsApp do profissional criptografado e visível só para o admin (cada visualização fica na auditoria).
- Endereço visível só para o cliente, para o profissional que aceitou (enquanto a contratação está ativa) e para o admin. Depois de 90 dias do fim, o endereço exato é apagado.
- Fotos e áudios do chat só abrem para as partes da contratação; o tipo do arquivo é conferido pelo conteúdo. Admin só abre conversa com justificativa registrada.
- Webhook da SyncPay autenticado por token secreto e idempotente; a assinatura só é liberada depois de o servidor conferir o Pix direto na API.
- Limite de tentativas no login, no chat, nas denúncias e nos pedidos. Denunciar e bloquear em perfis, contratações e avaliações.
- Senha esquecida: a conta não tem e-mail, então o pedido vira um chamado; o admin confirma a identidade e gera um **link de uso único** (24 h).

## Rodar localmente

```bash
docker compose up -d          # ou um Postgres 16 seu
cp .env.example .env          # ajuste DATABASE_URL, BETTER_AUTH_SECRET e ADMIN_CPF
npm install
npx prisma migrate deploy
npm run dev                   # http://localhost:3000
```

Crie uma conta de **cliente** com o CPF de `ADMIN_CPF` para entrar como administrador.

## Testes

```bash
npm test                      # regras do negócio (Vitest)
npm run build && npm start    # em outro terminal
npx playwright test           # fluxo completo no navegador (celular)
```

## Deploy no Render

O `render.yaml` descreve o serviço web (com disco em `/var/data` para fotos e áudios) e o banco. No painel do serviço → **Environment**, preencha:

| Variável | Para quê |
|---|---|
| `ADMIN_CPF` | CPF do dono. A conta de cliente criada com ele vira admin. |
| `SYNCPAY_CLIENT_ID` / `SYNCPAY_CLIENT_SECRET` | Pix da assinatura do profissional. Sem elas, o admin libera a assinatura manualmente. |
| `BETTER_AUTH_SECRET` | Gerada sozinha. Não troque depois de ter contas (protege CPF e WhatsApp). |

As rotinas (expirar pedidos, lembretes, conferir Pix, aviso de vencimento, apagar endereços antigos) rodam no próprio servidor a cada 5 minutos.

## Mapas

Mapa do **OpenStreetMap** (grátis, sem chave), CEP pelo **ViaCEP** e busca de endereço pelo **Nominatim**, chamados pelo navegador. Para muito volume, troque por um provedor pago no `src/lib/geo-client.ts` e `src/components/map-picker.tsx`.

## Antes de lançar oficialmente

- Termos de uso, privacidade e cancelamento são **texto-base**: revisar com advogado.
- Classificação contábil/tributária dos R$ 0,85 da assinatura: validar com contador.
- Lista de municípios: `src/data/municipios.json` (27 UFs; o DF inclui as regiões administrativas).
