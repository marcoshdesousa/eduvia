# Diária Paga

**Quem faz o serviço, perto de você. Hoje.** Plataforma (site com cara de aplicativo, instalável no celular) que conecta clientes a prestadores autônomos: diarista, pedreiro, pintor, eletricista, encanador, cuidador de idoso, babá, motorista, compras de supermercado e mais (37 serviços).

- **Cliente**: grátis, sem taxa nenhuma. Conta com nome, CPF e senha. Busca por serviço e cidade (ou "perto de mim"), vê perfil, fotos dos trabalhos, preços e avaliações, contrata com data marcada **ou** chama na hora pelo **Contrate rápido**.
- **Prestador** (18+): a mesma conta vira prestador em "Seja prestador": foto do rosto, celular (privado), serviços com preço por diária/hora/serviço e especificações, endereços de atendimento no mapa, bio, Instagram, portfólio de 8 fotos (4 aparecem e "ver mais"), horários, painel financeiro (semana, mês, 6 meses).
- **Planos do prestador** (Pix via SyncPay, sem comissão):
  - **Completo R$ 15,85/mês** (R$ 10,00 plataforma + R$ 5,85 impostos e taxas): 3 endereços, aparece primeiro, selo ★ Recomendado, pacotes de **+2 endereços por R$ 3,85/mês** (até 11). O pacote libera na hora, entra na próxima mensalidade e pode ser retirado.
  - **Básico R$ 6,85/mês** (R$ 3,00 + R$ 3,85): 1 endereço, aparece depois do Completo.
  - **3 dias grátis do Completo uma única vez por CPF** — o CPF fica guardado (só o código, sem nome) mesmo se a conta for apagada.
- **Sem telefone/WhatsApp**: bio, legendas, serviços e chat bloqueiam números de telefone e palavras como "zap". Toda contratação fica no app.
- **Chat** estilo WhatsApp: texto, áudio, foto e vídeo, com respostas rápidas ("Chego em 30 min").
- **Pagamento do serviço** é direto ao prestador (Pix, dinheiro ou cartão se ele tiver maquininha).

> O Diária Paga substituiu a HoraLimp no mesmo serviço do Render. A migração `38_diaria_paga` **apaga todas as tabelas e dados da HoraLimp** e cria as novas.

## Contrate rápido (estilo app de corrida)

1. Cliente escolhe o serviço e a quantidade, **descreve o que precisa** (obrigatório, aparece no toque) e a localização vem do aparelho (com permissão).
2. **Valor fixo por profissão** (ex.: pedreiro R$ 180 a diária), um pouco abaixo do mercado, o mesmo para todos. O prestador recebe tudo. O admin muda os valores em **Admin → Configurações**.
3. Só recebe chamado quem está no **plano Completo em dia**, marcou a **caixinha** aceitando as regras do Contrate rápido, ligou o **Disponível**, oferece o serviço e está no horário. Terminou um serviço, volta a tocar.
4. O servidor toca em rodadas (padrão: 3 prestadores por vez, 45 s cada, até 40 km, por 8 min). Ordem: **quem aceita mais primeiro** (taxa de aceite dos últimos 30 dias; recusar ou deixar tocar sem responder conta contra; quem aceita menos de 40% quase não toca), depois quem está mais perto.
5. Toque: com o app aberto, som de chamado + vibração e tela de Aceitar/Recusar; com o app fechado, notificação com vibração forte que fica na tela (som personalizado não é possível em notificação web).
6. **O primeiro que aceita leva** e tem **2 horas para chegar**. Endereço e chat liberam no aceite.
7. Penalidades:
   - Prestador não chegou em 2 h → cancelado automaticamente e **7 dias fora do Contrate rápido**.
   - Cliente não estava (o prestador marca "Cheguei" e só depois de 15 min pode registrar) → cliente fica **30 dias sem contratar** ou paga **R$ 2,85** para liberar na hora.
   - O admin pode retirar penalidades em **Admin → Penalidades**.

## Admin

Resumo (planos, rápido, receita), prestadores (suspender, liberar dias de plano, tirar penalidade, ver CPF/celular com registro), usuários (bloquear, link de nova senha), pedidos, pagamentos, penalidades, denúncias (inclui fotos do portfólio), suporte, configurações do Contrate rápido e auditoria. Não há fila de aprovação: quem paga aparece; quem descumpre as regras é suspenso.

## Rodar localmente

```bash
docker compose up -d          # ou um Postgres 16 seu
cp .env.example .env          # ajuste DATABASE_URL, BETTER_AUTH_SECRET e ADMIN_CPF
npm install
npx prisma migrate deploy
npm run dev                   # http://localhost:3000
```

Crie uma conta com o CPF de `ADMIN_CPF` para entrar como administrador.

## Testes

```bash
npm test                      # regras (Vitest) — com DATABASE_URL também testa no banco: teste grátis, rápido, penalidades, pacotes
npm run build && npm start    # em outro terminal
npx playwright test           # fluxo completo no navegador de celular (prestador + cliente + admin)
```

## Deploy no Render

O `render.yaml` descreve o serviço web (disco em `/var/data` para fotos, áudios e vídeos) e o banco. No painel do serviço → **Environment**, preencha:

| Variável | Para quê |
|---|---|
| `ADMIN_CPF` | CPF do dono. A conta criada com ele vira admin. |
| `SYNCPAY_CLIENT_ID` / `SYNCPAY_CLIENT_SECRET` | Pix dos planos e da taxa de desbloqueio. Sem elas, o admin libera planos manualmente. |
| `BETTER_AUTH_SECRET` | Gerada sozinha. Não troque depois de ter contas (protege CPF e celular). |

Rotinas no próprio servidor: Contrate rápido a cada 10 s; expirar pedidos, lembretes, conferir Pix, vencimentos e apagar endereços antigos a cada 5 min.

## Antes de lançar oficialmente

- Termos, privacidade e cancelamento são **texto-base**: revisar com advogado.
- Divisão "plataforma + impostos e taxas" dos planos: validar com contador.
- Mapas grátis (OpenStreetMap/ViaCEP/Nominatim, pelo navegador). Para muito volume, troque por um provedor pago em `src/lib/geo-client.ts`.
