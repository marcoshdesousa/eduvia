import { aula } from "../extra/build";

const IMG = "/cursos/tksa41";

/** Aula 1: o que é o alinhamento, como a TKSA 41 funciona, o estojo e as partes do produto (slides 1 a 6). */
export const TKSA_AULA_1 = aula(
  "Fundamentos: o que é a TKSA 41 e como ela funciona",
  `## Alinhamento convencional e a laser

Este curso é sobre **alinhamento convencional e a laser aplicados a máquinas rotativas**, com foco nos **procedimentos de alinhamento a laser com o modelo TKSA 41**, da SKF.

Instrutor: **Geonilson Costa** (e-mail: geonilsonmecanica@senaipa.org.br).

![Ferramenta de alinhamento a laser TKSA 41](${IMG}/capa-tksa41.webp)

## Definição

Em suma, o objetivo do alinhamento é ter **uma linha reta através dos centros de todos os eixos das máquinas**.

A ferramenta para alinhamento de eixo **SKF TKSA 41** é uma ferramenta de **alinhamento de eixo a laser** que permite um método **fácil e preciso** de alinhar os eixos de:

- uma **máquina de condução**, ou seja, a que gira a outra (por exemplo, um **motor elétrico**);
- uma **máquina acionada**, ou seja, a que é girada (por exemplo, uma **bomba**).

![Alinhamento entre a máquina de condução e a máquina acionada](${IMG}/definicao-motor-bomba.webp)

## Princípio de operação

A TKSA 41 usa **duas unidades de medição (UM)**. As duas são equipadas com um **diodo de laser** e um **detector CCD**.

Quando os eixos **giram 180°**, qualquer **desalinhamento paralelo ou angular** faz com que as duas linhas do laser **inclinem** em relação à sua posição relativa inicial.

As medições dos **dois detectores** são usadas para **calcular automaticamente o desalinhamento** e orientar o usuário nas etapas de correção:

- correção **vertical**, feita com **calçamento**;
- correção **horizontal**.

![Técnico usando a TKSA 41 numa máquina](${IMG}/principio-operacao.webp)

## Métodos de medição

As medições podem ser feitas de dois jeitos na TKSA 41:

- pelo **método 9-12-3**;
- por um **método de medição livre**.

As medições também podem ser feitas **automaticamente**, **sem ações por parte do usuário no display**.

## Conteúdo do estojo

O estojo da TKSA 41 traz 13 itens:

1. 1 **display** TKSA 31/41.
2. 1 **unidade de medição TKSA 31/41 S**.
3. 1 **unidade de medição TKSA 31/41 M**.
4. 2 **suportes de eixo em V com correntes**.
5. **Hastes de extensão de 90 mm** (TKSA 41 somente).
6. 1 **haste de aperto de corrente**.
7. 1 **fita de medição** métrica e imperial de **5 m (16 ft)**.
8. 1 **fonte de alimentação de 12 V CC 3 A**.
9. **Adaptadores de país** (EUA, Reino Unido, UE, Austrália).
10. 2 **cabos USB para USB** (não exibidos na foto).
11. **Guia impresso de início rápido**, em inglês (não exibido).
12. **Certificado impresso de calibração e conformidade** (não exibido).
13. 2 **folhas A5 com 6 adesivos de código QR** por folha, TKSA 41 somente, total de **12 adesivos** (não exibido).

![Conteúdo do estojo da TKSA 41, com os itens numerados](${IMG}/conteudo-estojo.webp)

## Descrição do produto

As **unidades de medição** têm:

- **detector CCD grande, de 29 mm**;
- **inclinômetros eletrônicos**;
- **Bluetooth 4.0 LE** (TKSA 41);
- **laser vermelho em linha**.

Cada **suporte em V** tem **2 hastes roscadas de 150 mm**, e há **múltiplas posições para a porca da corrente**.

O **display** tem:

- **grande tela sensível ao toque e resistente**;
- **modelo robusto**;
- **função de giro de orientação da tela** (TKSA 41).

![Descrição do produto: unidades de medição, suportes em V e display](${IMG}/descricao-produto.webp)

## Resumindo

O alinhamento busca uma linha reta pelos centros dos eixos. A TKSA 41 usa duas unidades de medição, cada uma com laser e detector CCD, e calcula sozinha o desalinhamento paralelo e angular quando os eixos giram. Mede pelo método 9-12-3, pelo método livre ou automaticamente, e orienta a correção vertical (calços) e horizontal.`,
  [
    "Objetivo do alinhamento: uma linha reta através dos centros de todos os eixos das máquinas.",
    "Duas unidades de medição (S e M), cada uma com diodo de laser e detector CCD.",
    "Ao girar os eixos 180°, o desalinhamento paralelo ou angular inclina as linhas do laser.",
    "Métodos: 9-12-3, medição livre ou automático (sem tocar no display).",
    "Detector CCD de 29 mm, inclinômetros eletrônicos, Bluetooth 4.0 LE e laser vermelho em linha.",
  ],
  [
    ["Máquina de condução", "A que gira a outra, como o motor elétrico."],
    ["Máquina acionada", "A que é girada, como a bomba."],
    ["Unidade de medição (UM)", "Peça com diodo de laser e detector CCD presa em cada eixo; são duas: S e M."],
    ["Detector CCD", "Sensor que recebe a linha do laser; na TKSA 41 ele é grande, de 29 mm."],
    ["Desalinhamento paralelo e angular", "Os dois tipos de erro que fazem as linhas do laser inclinarem quando os eixos giram 180°."],
  ],
  [
    ["Qual é, em suma, o objetivo do alinhamento de eixos?", ["Deixar os eixos com a mesma rotação", "Ter uma linha reta através dos centros de todos os eixos das máquinas", "Aumentar a velocidade do motor", "Diminuir a temperatura do acoplamento", "Trocar o acoplamento por um mais rígido"], 1, "A definição do material: o objetivo é uma linha reta passando pelos centros de todos os eixos."],
    ["No exemplo do material, qual é a máquina de condução e qual é a máquina acionada?", ["Bomba de condução e motor acionado", "Motor elétrico de condução e bomba acionada", "Os dois são máquinas de condução", "Display de condução e unidade M acionada", "Compressor de condução e ventilador acionado"], 1, "A máquina de condução gira a outra (motor elétrico); a acionada é girada (bomba)."],
    ["Quantas unidades de medição (UM) a TKSA 41 usa?", ["Uma", "Duas", "Três", "Quatro", "Seis"], 1, "São duas unidades de medição, a S e a M."],
    ["Cada unidade de medição da TKSA 41 é equipada com:", ["Um termômetro e um relógio comparador", "Um diodo de laser e um detector CCD", "Uma câmera e um microfone", "Um imã e uma régua", "Uma bateria e um alto-falante"], 1, "As duas UMs têm um diodo de laser e um detector CCD."],
    ["O que acontece com as linhas do laser quando os eixos giram 180° e há desalinhamento paralelo ou angular?", ["Elas desligam", "Elas mudam de cor", "Elas inclinam em relação à posição relativa inicial", "Elas ficam paradas no centro", "Elas piscam"], 2, "O desalinhamento faz as duas linhas do laser inclinarem em relação à posição inicial."],
    ["Por quais métodos as medições podem ser feitas na TKSA 41?", ["Só pelo relógio comparador", "Pelo método 9-12-3 ou por um método de medição livre", "Só pelo método 3-6-9", "Só com régua e calibre de folga", "Só pelo método das 6 horas"], 1, "O material cita o método 9-12-3 e o método de medição livre, além do modo automático."],
    ["Qual é o tamanho do detector CCD das unidades de medição?", ["9 mm", "12 mm", "29 mm", "90 mm", "150 mm"], 2, "As unidades de medição têm um detector CCD grande, de 29 mm."],
    ["Qual é a tecnologia sem fio da TKSA 41 citada na descrição do produto?", ["Wi-Fi 6", "Bluetooth 4.0 LE", "Infravermelho", "Rádio AM", "NFC"], 1, "A descrição do produto cita Bluetooth 4.0 LE (TKSA 41)."],
    ["Quantos adesivos de código QR vêm no estojo da TKSA 41?", ["6", "8", "10", "12", "13"], 3, "São 2 folhas A5 com 6 adesivos cada: 12 adesivos ao todo."],
    ["Qual é a fonte de alimentação que vem no estojo?", ["5 V CC 1 A", "12 V CC 3 A", "24 V CA 2 A", "110 V CA", "9 V CC 500 mA"], 1, "O item 8 do estojo é uma fonte de alimentação de 12 V CC 3 A."],
  ],
  [],
);

/** Aula 2: montagem dos suportes em V, ligar o display, conexão USB e ajuste dos lasers (slides 7 a 13). */
export const TKSA_AULA_2 = aula(
  "Montagem: suportes em V, display, cabos USB e lasers",
  `## Montagem dos suportes em V

Use os **suportes em V** para conectar as **unidades de medição (UM)** aos eixos.

Certifique-se de que:

- a unidade marcada **"M"** esteja conectada à **máquina móvel** (a que vai ser movida na correção);
- a unidade marcada **"S"** esteja conectada à **máquina estacionária** (a que fica parada).

Se **não for possível** conectar os suportes em V **diretamente aos eixos**, por exemplo em caso de **problemas de espaço**, os acessórios poderão ser conectados ao **acoplamento**.

![Unidades de medição montadas nos eixos com os suportes em V](${IMG}/suportes-em-v.webp)

![Suporte em V preso no acoplamento](${IMG}/suporte-acoplamento.webp)

## Como prender a corrente

- Para eixos com **diâmetro menor que 40 mm** (menor que 1,5 polegada), prenda a corrente na âncora do suporte em V **a partir do lado de dentro**.
- O **botão de aperto** deve usar o espaço **mais próximo da haste**.
- Para **diâmetros maiores**, engate a corrente **pelo lado externo**.
- **Remova a folga** da corrente e **aperte-a com firmeza** com os **botões de tensionamento**, usando a **barra de tensionamento da haste**.

![Suporte em V com a corrente](${IMG}/corrente-suporte-v.webp)

## Ativação do display

Pressione o **botão Liga/Desliga vermelho** do display por **mais de 1 segundo**. A unidade está **totalmente iniciada** quando chega na **tela inicial**.

![Botão Liga/Desliga vermelho do display](${IMG}/botao-liga-desliga.webp)

Um **toque rápido** no botão Liga/Desliga vermelho serve para:

- **iniciar** o display;
- colocar o display no **modo de espera**;
- **despertar** o display do modo de espera.

![Tela inicial do display](${IMG}/tela-inicial-display.webp)

## Conexão da unidade de medição com fio

Na TKSA 41, a UM pode ser conectada ao display por um **cabo USB**.

1. Certifique-se de que as **duas UMs estejam desligadas** (TKSA 41 somente).
2. Conecte os **cabos USB ao display**. O **símbolo USB** no cabo deve ficar **voltado para cima**.
3. Conecte os cabos USB às **unidades de medição**.

![Cabos USB conectados ao display, nas entradas S e M](${IMG}/cabos-usb-display.webp)

A UM é **conectada automaticamente** ao display, e o **símbolo USB** aparece ao lado das letras **"S"** e **"M"**.

![Unidade de medição com o cabo USB](${IMG}/um-cabo-usb.webp)

Observação:

- **Desligue a UM antes de desconectar** os cabos USB.
- Consulte a seção **Solução de problemas** se houver algum problema de conexão.
- As **portas USB da UM são vedadas** pela parte de dentro e **protegidas contra a entrada de poeira e sujeira**.

## Ajuste dos lasers

- Ajuste a **altura da unidade "S"** de modo que a linha do laser atinja a **UM "M" no centro do detector, na marca vermelha**.
- **Prenda firmemente** a unidade "S" na posição.
- Use o **botão em cima da unidade "M"** para ajustar **verticalmente** a posição do laser na unidade "S".

![Linha do laser no centro do detector, na marca vermelha](${IMG}/ajuste-lasers.webp)

![Botão de ajuste do laser em cima da unidade M](${IMG}/botao-ajuste-laser.webp)

## Resumindo

A unidade M vai na máquina móvel e a S na máquina estacionária; sem espaço, os suportes podem ir no acoplamento. Abaixo de 40 mm a corrente entra por dentro; acima, por fora, sem folga e bem apertada. O display liga com mais de 1 segundo no botão vermelho. Com cabo USB, as UMs ficam desligadas ao conectar, o símbolo USB fica para cima, e elas se conectam sozinhas. Por fim, os lasers são ajustados para bater no centro do detector, na marca vermelha.`,
  [
    "Unidade M na máquina móvel; unidade S na máquina estacionária.",
    "Sem espaço no eixo: os suportes em V podem ir no acoplamento.",
    "Eixo menor que 40 mm (1,5 in): corrente por dentro; maior: por fora, sem folga e bem apertada.",
    "Ligar o display: botão vermelho por mais de 1 segundo; toque rápido inicia, põe em espera ou desperta.",
    "Laser da S no centro do detector da M, na marca vermelha; o botão em cima da M ajusta o laser na S.",
  ],
  [
    ["Máquina móvel", "A que será movida na correção; recebe a unidade M."],
    ["Máquina estacionária", "A que fica parada; recebe a unidade S."],
    ["Suporte em V", "Peça que prende a unidade de medição no eixo com uma corrente; tem 2 hastes roscadas de 150 mm."],
    ["Barra de tensionamento", "Usada com os botões de tensionamento para apertar a corrente com firmeza."],
    ["Marca vermelha", "Centro do detector, onde a linha do laser deve bater no ajuste."],
  ],
  [
    ["A unidade de medição marcada \"M\" deve ser conectada em qual máquina?", ["Na máquina estacionária", "Na máquina móvel", "No display", "Na fonte de alimentação", "Tanto faz"], 1, "A unidade M vai na máquina móvel e a S na máquina estacionária."],
    ["A unidade de medição marcada \"S\" deve ser conectada em qual máquina?", ["Na máquina móvel", "Na máquina estacionária", "No acoplamento sempre", "No pen drive", "Na bomba de calços"], 1, "A unidade S vai na máquina estacionária."],
    ["Se não for possível conectar os suportes em V diretamente nos eixos, por falta de espaço, o que fazer?", ["Desistir do alinhamento", "Conectar os acessórios ao acoplamento", "Usar só uma unidade de medição", "Prender as unidades com fita", "Segurar as unidades com a mão"], 1, "O material diz que, em caso de problemas de espaço, os acessórios podem ser conectados ao acoplamento."],
    ["Para eixos com diâmetro menor que 40 mm (1,5 in), como a corrente deve ser presa no suporte em V?", ["Pelo lado externo", "Na âncora do suporte em V, a partir do lado de dentro", "Sem corrente", "Com duas correntes cruzadas", "Na haste de extensão de 90 mm"], 1, "Abaixo de 40 mm, a corrente é presa na âncora a partir do lado de dentro."],
    ["Para eixos de diâmetro maior, a corrente deve ser engatada:", ["Pelo lado de dentro", "Pelo lado externo", "Só no acoplamento", "Na fita de medição", "No display"], 1, "Para diâmetros maiores, a corrente é engatada pelo lado externo."],
    ["Depois de engatar a corrente, o que deve ser feito?", ["Deixar a corrente frouxa para não forçar o eixo", "Remover a folga e apertar com firmeza com os botões de tensionamento e a barra de tensionamento", "Lubrificar a corrente", "Girar o eixo com a corrente", "Soltar o botão de aperto"], 1, "A corrente deve ficar sem folga, bem apertada com os botões e a barra de tensionamento."],
    ["Como ligar o display da TKSA 41?", ["Tocar na tela por 10 segundos", "Pressionar o botão Liga/Desliga vermelho por mais de 1 segundo", "Conectar o pen drive", "Girar o eixo 180°", "Apertar o botão em cima da unidade M"], 1, "O display liga pressionando o botão vermelho por mais de 1 segundo; está pronto ao chegar na tela inicial."],
    ["O que deve ser feito antes de conectar os cabos USB na TKSA 41?", ["Ligar as duas UMs", "Deixar as duas UMs desligadas", "Retirar o display do estojo", "Calibrar os inclinômetros", "Desligar o motor da máquina"], 1, "O material pede que as duas UMs estejam desligadas antes de conectar os cabos USB."],
    ["Ao conectar o cabo USB no display, como deve ficar o símbolo USB do cabo?", ["Voltado para baixo", "Voltado para cima", "Virado para a esquerda", "Tapado com fita", "Tanto faz"], 1, "O símbolo USB no cabo deve ficar voltado para cima."],
    ["No ajuste dos lasers, onde a linha do laser da unidade S deve atingir a unidade M?", ["Na borda do detector", "No centro do detector, na marca vermelha", "No botão de aperto", "Na corrente", "Na tela do display"], 1, "A altura da S é ajustada para o laser bater no centro do detector da M, na marca vermelha."],
  ],
  [],
);
