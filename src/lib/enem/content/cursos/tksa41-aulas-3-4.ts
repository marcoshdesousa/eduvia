import { aula } from "../extra/build";

const IMG = "/cursos/tksa41";

/** Aula 3: tela inicial, três maneiras de iniciar, dimensões e tolerâncias, medições 9-12-3 (slides 14 a 19). */
export const TKSA_AULA_3 = aula(
  "Telas, dimensões e a medição 9-12-3",
  `## Tela inicial

A tela inicial (**Home**) do display tem estes botões:

- **Menu SKF**: o logotipo SKF, no canto de cima à esquerda.
- **New Alignment** (Novo alinhamento): **iniciar um novo alinhamento**.
- **QR Code** (Código QR): **ler um código QR** para **reconhecer uma máquina existente** ou **criar uma nova máquina**.
- **Machine Library** (Biblioteca de máquinas): **abrir a biblioteca de máquinas**, **verificar alinhamentos anteriores** e **iniciar novos**.
- **Report** (Relatório): **abrir relatórios**.
- **Settings** (Configurações): **abrir configurações**.
- **Tutorial**: **abrir a Ajuda**.

No topo da tela aparecem também a bateria, a hora e as letras **S** e **M**, das duas unidades de medição.

![Tela inicial e a função de cada botão](${IMG}/tela-inicial-funcoes.webp)

## Três maneiras de iniciar um alinhamento

Na tela inicial, o alinhamento pode começar de três jeitos:

1. Clique em **"Novo alinhamento"** (New Alignment).
2. Clique em **"Código QR"** (QR Code).
3. Clique em **"Biblioteca de máquinas"** (Machine Library). Na tela **Select machine** (Selecionar máquina), toque na máquina na lista, que mostra **Machine ID**, **Operator** e **Last Alignment**. Depois, na tela **Machine Details** (Detalhes da máquina), toque em **New Alignment**.

![Três maneiras de iniciar um alinhamento](${IMG}/tres-maneiras-iniciar.webp)

## Tela de dimensões

Na tela **Enter Distances & Tolerances** (Inserir distâncias e tolerâncias), você mede com a **fita métrica** e digita as distâncias, uma de cada vez, avançando com a seta:

- **A**: distância entre as duas **unidades de medição** (S e M). No exemplo, **250 mm**.
- **D**: distância do **centro do acoplamento** até a unidade **M**. No exemplo, **125 mm**.
- **B**: distância da unidade **M** até o **primeiro par de pés** do motor. No exemplo, **45 mm**.
- **C**: distância **entre o primeiro e o segundo par de pés** do motor. No exemplo, **80 mm**.

Depois aparece a tabela **Tolerance Range** (faixa de tolerância), escolhida pela **rotação (Speed RPM)**. Para cada faixa há duas tolerâncias: a **angular** (em **mm/100 mm**) e a de **deslocamento paralelo** (em **mm**):

- Faixa **I**, de **0 a 2000 rpm**: **0,08 mm/100 mm** e **0,10 mm**.
- Faixa **II**, de **2000 a 3000 rpm**: **0,07 mm/100 mm** e **0,07 mm**.
- Faixa **III**, de **3000 a 4000 rpm**: **0,06 mm/100 mm** e **0,04 mm**.
- Faixa **IV**, de **4000 a 6000 rpm**: **0,05 mm/100 mm** e **0,03 mm**.
- Há ainda **duas faixas definidas pelo usuário**, que no exemplo estão com **0,01** e **0,01**.

Quanto **maior a rotação**, **menor (mais apertada)** é a tolerância.

![Tela de dimensões: A, D, B e C, e a tabela de tolerâncias](${IMG}/tela-dimensoes.webp)

## Medições 9-12-3

A analogia de uma **face do relógio** é usada para descrever as diferentes posições de medição.

- A **primeira posição de medição** é a de **9 horas**, ao visualizar **de trás da máquina móvel**.
- As medições devem ser feitas **sucessivamente em três posições** diferentes: **9 horas (−90°)**, **12 horas (0°)** e **3 horas (+90°)**.
- A tela mostra as unidades de medição **vistas da máquina móvel**.
- Uma **cunha triangular** indica a **posição necessária** das unidades de medição em cada etapa.

![Sequência das medições 9-12-3 na tela](${IMG}/medicoes-9-12-3.webp)

## Passo a passo da medição 9-12-3

1. Gire os eixos para a **cunha azul** na posição de **9 horas (−90°)**.
2. Quando estiver posicionado na cunha azul, **a cunha fica verde**.
3. Clique na **seta de avançar** para fazer uma medição.
4. Gire os eixos para a cunha azul na posição de **12 horas (0°)**.
5. Clique na seta de avançar para fazer uma medição.
6. Gire os eixos para a cunha azul na posição de **3 horas (+90°)**.
7. Clique na seta de avançar para fazer uma medição.

No canto da tela aparecem os ângulos das unidades **S** e **M** (por exemplo, S: 0,1° e M: 0,2° na posição inicial, e cerca de −90° na posição de 9 horas).

## Cuidados durante a medição

Observação:

- **Não mova nem toque** nas unidades de medição, nos suportes em V da corrente ou nas suas hastes **durante a medição**.
- **Não use o equipamento de medição como alça** para girar os eixos.
- Certifique-se de que os **parafusos do motor estejam apertados** antes de iniciar as medições.
- A tarefa de alinhamento pode ser **cancelada a qualquer momento**: **SKF → Concluir alinhamento**.
- A **diferença de ângulo entre a UM S e a UM M deve ser inferior a 2°**.

## Resumindo

Da tela inicial, o alinhamento começa por Novo alinhamento, Código QR ou Biblioteca de máquinas. Na tela de dimensões entram A, D, B e C e a faixa de tolerância pela rotação. Depois vêm as medições 9-12-3: 9 horas, 12 horas e 3 horas, girando até a cunha ficar verde e avançando. Não toque nas unidades durante a medição, aperte os parafusos do motor antes, e a diferença de ângulo entre S e M deve ser menor que 2°.`,
  [
    "Três maneiras de iniciar: Novo alinhamento, Código QR ou Biblioteca de máquinas.",
    "Dimensões: A (entre S e M), D (acoplamento até M), B (M até o 1º par de pés), C (entre os pares de pés).",
    "Tolerâncias por rotação: faixa I (0–2000 rpm) 0,08 mm/100 mm e 0,10 mm, ficando mais apertadas até a faixa IV (4000–6000 rpm).",
    "9-12-3: medir em 9 h (−90°), 12 h (0°) e 3 h (+90°), vistas de trás da máquina móvel.",
    "A cunha azul fica verde na posição certa; a diferença de ângulo entre S e M deve ser menor que 2°.",
  ],
  [
    ["Biblioteca de máquinas", "Guarda as máquinas cadastradas; mostra alinhamentos anteriores e permite iniciar novos."],
    ["Código QR", "Adesivo colado na máquina; o display lê e reconhece a máquina ou cria uma nova."],
    ["Faixa de tolerância", "Limite aceitável de desalinhamento, escolhido pela rotação (rpm) da máquina."],
    ["Cunha triangular", "Indicação na tela da posição em que as unidades de medição precisam estar; azul até chegar, verde na posição."],
    ["mm/100 mm", "Unidade do desalinhamento angular: quantos milímetros a cada 100 mm."],
  ],
  [
    ["Qual botão da tela inicial serve para ler um código QR e reconhecer uma máquina existente ou criar uma nova?", ["New Alignment", "QR Code", "Report", "Settings", "Tutorial"], 1, "O botão QR Code lê o código QR para reconhecer uma máquina existente ou criar uma nova."],
    ["Qual botão da tela inicial abre a Ajuda?", ["Machine Library", "Settings", "Tutorial", "Report", "Menu SKF"], 2, "O botão Tutorial abre a Ajuda."],
    ["Quais são as três maneiras de iniciar um alinhamento a partir da tela inicial?", ["Report, Settings e Tutorial", "Novo alinhamento, Código QR e Biblioteca de máquinas", "Menu SKF, Settings e Report", "Pen drive, cabo USB e Bluetooth", "Só pelo Novo alinhamento"], 1, "As três maneiras são: Novo alinhamento, Código QR e Biblioteca de máquinas."],
    ["Na tela de dimensões, o que é a distância A?", ["Entre os pés dianteiros e traseiros", "Entre as duas unidades de medição (S e M)", "Do acoplamento até a parede", "Do motor até a bomba inteira", "A altura do eixo"], 1, "A é a distância entre as duas unidades de medição."],
    ["Na tela de dimensões, o que é a distância C?", ["Entre as unidades S e M", "Do centro do acoplamento até a unidade M", "Entre o primeiro e o segundo par de pés do motor", "Da unidade M até o display", "O comprimento da corrente"], 2, "C é a distância entre o primeiro e o segundo par de pés do motor."],
    ["Na tabela de tolerâncias, para uma máquina de 1750 rpm (faixa I, 0–2000 rpm), quais são as tolerâncias?", ["0,05 mm/100 mm e 0,03 mm", "0,06 mm/100 mm e 0,04 mm", "0,07 mm/100 mm e 0,07 mm", "0,08 mm/100 mm e 0,10 mm", "0,01 mm/100 mm e 0,01 mm"], 3, "A faixa I (0 a 2000 rpm) tem 0,08 mm/100 mm (angular) e 0,10 mm (paralelo)."],
    ["No método 9-12-3, qual é a primeira posição de medição?", ["12 horas (0°)", "3 horas (+90°)", "9 horas (−90°), vista de trás da máquina móvel", "6 horas (180°)", "Qualquer posição"], 2, "A primeira posição é a de 9 horas (−90°), olhando de trás da máquina móvel."],
    ["Durante a medição 9-12-3, o que indica que as unidades estão na posição certa?", ["A tela apaga", "A cunha azul fica verde", "O laser fica vermelho", "O display apita três vezes", "O ícone USB fica azul"], 1, "Quando posicionado na cunha azul, a cunha fica verde; aí é só clicar na seta de avançar."],
    ["Qual destes é um cuidado correto durante as medições?", ["Usar o equipamento de medição como alça para girar o eixo", "Soltar os parafusos do motor antes de medir", "Não mover nem tocar nas unidades de medição e nos suportes durante a medição", "Segurar a unidade S com a mão", "Medir com a corrente frouxa"], 2, "Não se deve tocar nas unidades, nos suportes nem nas hastes durante a medição, nem usá-los como alça."],
    ["Qual deve ser a diferença máxima de ângulo entre a UM S e a UM M?", ["Inferior a 2°", "Inferior a 10°", "Exatamente 90°", "Superior a 5°", "180°"], 0, "A diferença de ângulo entre a UM S e a UM M deve ser inferior a 2°."],
  ],
  [],
);

/** Aula 4: página de resultados, correção vertical (calços), correção horizontal e nova verificação (slides 20 a 26). */
export const TKSA_AULA_4 = aula(
  "Resultados e correções: calçamento e ajuste horizontal",
  `## Página de resultados

A **página de resultados** mostra os **valores de ajuste do acoplamento e do pé**.

- Os **símbolos** comparam os resultados à **tolerância selecionada**:
  - **visto verde**: **dentro da tolerância**;
  - **duas ondinhas laranja (≈)**: **perto da tolerância**;
  - **X vermelho**: **fora da tolerância**.
- O **movimento dos motores** representa graficamente os resultados (**visualização gráfica**).
- A **linha preta** é **onde o motor deveria estar**, e a **linha azul** é **onde o motor realmente está**.

A tela mostra duas vistas, cada uma com o valor **angular** (mm/100 mm) e o **paralelo/deslocamento** (mm):

- **Horizontal: Top View** (vista de cima), que gera a **correção horizontal**. No exemplo: **−0,12 mm/100 mm** (perto da tolerância) e **0,23 mm** (fora da tolerância).
- **Vertical: Side View** (vista lateral). No exemplo: **−0,03 mm/100 mm** e **0,10 mm**, os dois dentro da tolerância.

Botões da parte de baixo:

- **redo**: **fazer as medições novamente**;
- botão de tolerância: **alterar tolerância**;
- **bandeira quadriculada**: **concluir e criar relatório**;
- **seta de avançar**: seguir para a correção.

![Página de resultados com os símbolos e os botões](${IMG}/pagina-resultados.webp)

## Correção vertical: vista lateral e calçamento

Se os resultados **verticais** estiverem **fora da tolerância**, você precisa corrigir o valor **adicionando ou removendo calços**. O sistema **calcula os valores de correção no pé**.

![Colocando calço no pé do motor](${IMG}/calcamento-foto.webp)

Como fazer:

- Comece **girando a UM** para a posição de **12 horas (0°)** ou **6 horas (180°)** e **confirme**.
- As **setas** indicam a direção que o motor deve seguir:
  - **seta para cima**: o motor deve **ir para cima**;
  - **seta para baixo**: o motor deve **ir para baixo**.
- Os **valores de pés** são calculados usando as **distâncias fornecidas anteriormente** (A, D, B e C).
- Os valores de acoplamento e de pés são **atualizados em tempo real** na tela.
- **PARE** quando os valores de acoplamento estiverem **dentro da tolerância** e as **duas marcas verdes** forem exibidas.

![Tela de rotação das unidades para a correção](${IMG}/correcao-vertical-tela.webp)

Na tela de calçamento (**Shim**) aparecem:

- a **linha-alvo**;
- o **desalinhamento angular**, no exemplo **−0,04 mm/100 mm** (dentro da tolerância);
- o **paralelo/deslocamento**, no exemplo **0,12 mm** (perto da tolerância);
- os **valores dos pés**, no exemplo **0,05** e **0,02**, com setas para baixo.

No exemplo, **este motor tem que descer!**

![Tela de calçamento: linha-alvo, desalinhamentos e valores dos pés](${IMG}/calcamento-tela.webp)

## Correção horizontal: vista superior

Se os resultados **horizontais** estiverem **fora da tolerância**, é preciso corrigir o valor **movimentando a máquina móvel**. O sistema **calcula os valores de correção no pé**.

O motor é empurrado de lado usando o **parafuso para movimentação no plano horizontal**.

![Parafuso para movimentação no plano horizontal](${IMG}/parafuso-movimentacao-horizontal.webp)

- As **setas** indicam a direção que o motor deve seguir:
  - **seta para cima**: o motor deve ir para a **direita**;
  - **seta para baixo**: o motor deve ir para a **esquerda**.
- Os **valores de acoplamento** são uma **medição direta**.
- Os **valores de pés** são **calculados** com as distâncias fornecidas anteriormente.
- Os valores de acoplamento e de pés são **atualizados em tempo real** na tela.
- **PARE** quando os valores de acoplamento estiverem **dentro da tolerância** e as **duas marcas verdes** forem exibidas.

Na tela **Horizontal Correction**, no exemplo: **linha perfeita/alvo**, desalinhamento angular de **−0,12 mm/100 mm** (perto da tolerância), paralelo/deslocamento de **0,24 mm** (fora da tolerância) e valores dos pés **0,06** e **0,04**.

![Tela de correção horizontal](${IMG}/correcao-horizontal-tela.webp)

## Nova verificação: medir novamente

Após a correção horizontal, **recomenda-se medir novamente** o alinhamento. Aparece a pergunta **Remeasure Alignment?** (medir de novo?):

- responda **Sim** para **medir novamente**;
- responda **Não** para **criar um relatório**.

Ao medir novamente:

- faça as **três medições**;
- verifique a **tela de resultados**:
  1. clique no **botão de calço** para **corrigir o alinhamento**;
  2. clique no **botão de bandeira** para **concluir o alinhamento e criar um relatório**.

![Nova verificação: medir novamente](${IMG}/nova-verificacao.webp)

## Resumindo

A página de resultados mostra acoplamento e pés, com visto verde (dentro), ondinhas laranja (perto) e X vermelho (fora). A linha preta é onde o motor deveria estar; a azul, onde está. Fora da tolerância na vertical, corrige com calços (UM em 12 h ou 6 h, seta para cima sobe, para baixo desce). Na horizontal, move a máquina móvel pelos parafusos (seta para cima vai para a direita, para baixo para a esquerda). Pare com as duas marcas verdes e meça de novo.`,
  [
    "Visto verde: dentro da tolerância; ondinhas laranja: perto; X vermelho: fora.",
    "Linha preta: onde o motor deveria estar; linha azul: onde o motor realmente está.",
    "Vertical (vista lateral): corrige com calços; comece com a UM em 12 h (0°) ou 6 h (180°).",
    "Horizontal (vista superior): move a máquina móvel; seta para cima = direita, seta para baixo = esquerda.",
    "PARE quando o acoplamento estiver dentro da tolerância com as duas marcas verdes; depois, meça novamente.",
  ],
  [
    ["Calço", "Chapinha colocada ou tirada embaixo do pé do motor para corrigir a altura (correção vertical)."],
    ["Linha-alvo", "Linha preta da tela: onde o motor deveria estar."],
    ["Valores de pés", "Quanto mexer em cada pé, calculado com as distâncias A, D, B e C."],
    ["Valores de acoplamento", "Desalinhamento angular e paralelo no acoplamento; na correção horizontal são medição direta."],
    ["Bandeira quadriculada", "Botão que conclui o alinhamento e cria o relatório."],
  ],
  [
    ["Na página de resultados, o que significa o visto verde?", ["Fora da tolerância", "Perto da tolerância", "Dentro da tolerância", "Medição cancelada", "Bateria cheia"], 2, "Visto verde: dentro da tolerância; ondinhas laranja: perto; X vermelho: fora."],
    ["Na página de resultados, o que significa o X vermelho?", ["Dentro da tolerância", "Perto da tolerância", "Fora da tolerância", "Sem conexão USB", "Pé manco corrigido"], 2, "O X vermelho indica resultado fora da tolerância."],
    ["Na representação gráfica dos resultados, o que é a linha preta?", ["Onde o motor realmente está", "Onde o motor deveria estar", "A linha do laser", "O limite da corrente", "O eixo da bomba quebrado"], 1, "A linha preta é onde o motor deveria estar; a azul é onde ele realmente está."],
    ["Se os resultados verticais estão fora da tolerância, como se corrige?", ["Movendo o motor para os lados com os parafusos", "Adicionando ou removendo calços", "Trocando o acoplamento", "Girando o display", "Apertando a corrente"], 1, "A correção vertical é o calçamento: adicionar ou remover calços."],
    ["Na correção vertical, em que posição a UM deve ser girada no começo?", ["9 horas (−90°)", "3 horas (+90°)", "12 horas (0°) ou 6 horas (180°)", "Qualquer posição, sem confirmar", "1 hora (30°)"], 2, "Comece girando a UM para 12 horas (0°) ou 6 horas (180°) e confirme."],
    ["Na correção vertical, a seta para baixo indica que:", ["O motor deve ir para a esquerda", "O motor deve ir para baixo", "O motor deve ir para cima", "A medição acabou", "É preciso trocar o calço por um maior"], 1, "Na correção vertical, seta para cima = subir e seta para baixo = descer."],
    ["Na correção horizontal, a seta para cima indica que o motor deve ir para:", ["Cima", "Baixo", "A direita", "A esquerda", "Trás"], 2, "Na vista superior, seta para cima = direita e seta para baixo = esquerda."],
    ["Na correção horizontal, como a máquina é corrigida?", ["Com calços", "Movimentando a máquina móvel, com os parafusos de movimentação no plano horizontal", "Movendo a máquina estacionária com uma marreta", "Trocando o laser", "Só refazendo a medição"], 1, "Na horizontal corrige-se movimentando a máquina móvel, pelos parafusos de movimentação no plano horizontal."],
    ["Quando parar a correção?", ["Quando os valores de pés chegarem a zero", "Quando os valores de acoplamento estiverem dentro da tolerância e as duas marcas verdes aparecerem", "Depois de 5 minutos", "Quando a bateria acabar", "Quando a seta ficar vermelha"], 1, "PARE quando os valores de acoplamento estiverem dentro da tolerância e as duas marcas verdes forem exibidas."],
    ["Após a correção horizontal, se você responder \"Não\" à pergunta de medir novamente, o que acontece?", ["Mede de novo", "Cria um relatório", "Apaga a medição", "Desliga o display", "Volta para a tela de dimensões"], 1, "Responder Sim mede novamente; responder Não cria um relatório."],
  ],
  [],
);
