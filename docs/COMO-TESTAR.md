# Como colocar o Diária Paga no ar para teste (de graça, pelo GitHub)

O site de teste roda no **GitHub Codespaces** (um computador na nuvem do próprio GitHub). Ele já vem com o banco de dados
e com **79 contas de teste em Parauapebas/PA** (1 administrador, 6 clientes e 2 trabalhadores de cada profissão).
A lista de contas está em [`CONTAS-DE-TESTE.md`](CONTAS-DE-TESTE.md). A senha de todas é **teste1234**.

## Ligar o site (primeira vez: uns 5 a 10 minutos)

1. Abra o repositório no GitHub (de preferência num computador).
2. Clique em **Branch** e escolha **`claude/exciting-cori-sn38rf`**.
3. Clique no botão verde **Code** → aba **Codespaces** → **Create codespace on claude/exciting-cori-sn38rf**.
4. Espere. Ele instala tudo, cria o banco, compila o site e cria as contas de teste.
5. Quando terminar, aparece no terminal: **✅ Diária Paga (teste) no ar: https://…app.github.dev**. Esse é o link.
   Ele também aparece na aba **PORTAS** (porta 3000) — clique no globinho 🌐 para abrir.
6. Mande esse link para quem vai testar. Na primeira vez o GitHub mostra um aviso: é só clicar em **Continuar**.

## No celular de quem testa

- O link abre na tela de "Baixe o app". Na versão de teste tem o botão **🧪 Testar no navegador** (não precisa instalar).
  Também dá para instalar como app, igual vai ser no lançamento.
- Entre com o CPF de uma conta de teste e a senha **teste1234**, ou crie uma conta nova.

## Testar o Contrate rápido

1. Num celular, entre como **cliente** (ex.: Cliente Teste Ana Paula) → botão **⚡ Rápido** → escolha **Diarista**,
   use o endereço salvo **Casa** (é em Parauapebas) e toque em **Chamar agora**.
2. Em outro celular (ou janela anônima), entre como uma **diarista de teste** (ex.: Maria Silva Souza) e deixe na **Minha área**.
3. O chamado toca para ela com a distância. Ela aceita e o cliente vê "chega em até 2 horas".

## Importante saber

- **O link só funciona enquanto o Codespace estiver ligado.** O GitHub desliga sozinho depois de 30 minutos sem ninguém
  mexer *no Codespace* (o uso do site não conta). Para durar mais: github.com → **Settings** → **Codespaces** →
  **Default idle timeout** → coloque **240 minutos**. Para ligar de novo: github.com/codespaces → clique no codespace.
  O link continua o mesmo.
- **Grátis até um limite**: contas pessoais do GitHub têm 120 horas-núcleo por mês (cerca de 60 horas com este
  computador de 2 núcleos). Depois de testar, desligue em github.com/codespaces → **⋯** → **Stop codespace**.
- Pix de verdade não funciona no teste (não tem as chaves da SyncPay). As contas de teste já estão com plano pago por 1 ano.
  Quem criar conta nova de trabalhador ganha os 3 dias grátis normalmente.
- Notificações com o celular bloqueado só funcionam com o app instalado (no navegador, só com a página aberta).
- Para apagar e criar as contas de teste de novo: no terminal do Codespace, `npm run demo:seed`.
