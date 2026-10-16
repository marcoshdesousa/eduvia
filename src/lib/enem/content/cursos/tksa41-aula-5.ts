import { aula } from "../extra/build";

const IMG = "/cursos/tksa41";

/** Aula 5: relatórios (exportar em PDF), exemplo de relatório e pé manco (slides 27 a 30). */
export const TKSA_AULA_5 = aula(
  "Relatórios e pé manco",
  `## Relatórios

Os relatórios podem ser **exibidos no display** ou **exportados como PDF em um pen drive**.

Na tela **Report** você preenche:

- **Machine ID**: a identificação da máquina (no exemplo, "My Machine");
- **Report Name**: o nome do relatório (no exemplo, "My Report");
- **Operator**: o operador (no exemplo, "Julien Meunier");
- **Photo**: até **3 fotos**, tiradas pelos botões de câmera;
- **Comments**: comentários (no exemplo, "Machines aligned within tolerance", ou seja, máquinas alinhadas dentro da tolerância).

![Tela de relatório: máquina, nome, operador, fotos e comentários](${IMG}/relatorio-tela.webp)

## Como exportar o relatório em PDF

1. Selecione o **ícone Relatório** na página **Home**.
2. Selecione o **relatório a ser exportado**.
3. Insira um **pen drive** em **qualquer porta USB do display**.
4. Selecione o **ícone USB** no **canto inferior direito**. O ícone **fica azul** assim que o pen drive é inserido.
5. O relatório será **gerado como PDF** e **exportado no pen drive**.

Observação:

- Os relatórios ficam na pasta **"Relatórios de alinhamento"** no pen drive.
- Os relatórios em PDF são **nomeados com o nome do relatório e a data**.
- Se o **ícone USB não ficar ativo**, use **outro pen drive**.

## Exemplo de relatório

O relatório (**Shaft Alignment Report**) tem quatro partes:

- **Cabeçalho**: nome do relatório, Machine ID, operador, data (no exemplo, 24-11-2014), alinhamento anterior, instrumento (**TKSA-41**), **números de série** das unidades M e S (no exemplo, TKSA41-M-1433-0019 e TKSA41-S-1433-0013), **temperatura da unidade de medição** (no exemplo, 32,0 °C), comentários e fotos.
- **Soft Foot** (pé manco): mostra se o pé manco foi **verificado** e se foi **corrigido**, nas situações **As Found** (como encontrado) e **As Corrected** (como corrigido).
- **Dimensions** (dimensões): as tolerâncias (no exemplo, **0,08 mm/100 mm** e **0,10 mm**) e as distâncias **A, D, B e C** (no exemplo, 210 mm, 105 mm, 50 mm e 80 mm).
- **Alignment Results** (resultados do alinhamento): vista **horizontal (de cima)** e **vertical (lateral)**, cada uma **As Found** (antes da correção) e **As Corrected** (depois), com os símbolos de tolerância. Traz também a **assinatura**, a **data** e se a **folga (backlash) está dentro da tolerância**.

![Exemplo de relatório: cabeçalho, pé manco, dimensões e resultados](${IMG}/exemplo-relatorio.webp)

## Pé manco: o que é e como ativar

**Pé manco** é quando um dos pés da máquina **não apoia direito na base**: ao apertar o parafuso, a carcaça da máquina se deforma e isso atrapalha o alinhamento.

- O pé manco pode ser ativado em **Configurações → Configurações de medição → Verificação de pé manco**.
- Coloque a **UM na posição de 12 horas (0°)**.
- O pé manco deve ser verificado em **todos os pés**.
- Escolha a **tolerância** clicando no **botão de tolerância** (no exemplo, **0,05 mm**).

## Medição do pé manco

1. **Solte** o parafuso do pé e clique em **OK**.
2. **Aperte** o parafuso do pé e clique em **OK**.
3. **Repita** esse procedimento nos **4 pés**.

Na tela **Check Soft-Foot** os pés aparecem como **F1** e **F2** (pés da frente) e **R1** e **R2** (pés de trás). Cada pé medido mostra o valor e o **visto verde** quando está dentro da tolerância.

![Medição do pé manco: soltar e apertar o parafuso de cada pé](${IMG}/pe-manco-1.webp)

## Correção do pé manco

4. **Corrija o pé manco**, se houver, **adicionando calços**.
5. Clique na **marca de verificação** ou no **botão avançar** para **sair** da função pé manco.
6. **Meça novamente** o pé manco e clique em **avançar** para sair da função pé manco.

No exemplo, os quatro pés (F1, F2, R1 e R2) ficaram com **0,00** e o visto verde, dentro da tolerância de **0,05 mm**.

![Correção do pé manco com calços: todos os pés dentro da tolerância](${IMG}/pe-manco-2.webp)

## Resumindo

Os relatórios aparecem no display ou vão para um pen drive em PDF: ícone Relatório, escolher o relatório, colocar o pen drive e tocar no ícone USB, que fica azul. Os PDFs ficam na pasta "Relatórios de alinhamento", com nome e data. O pé manco é ativado nas Configurações de medição, com a UM em 12 horas: solte e aperte o parafuso de cada um dos 4 pés, corrija com calços e meça de novo.`,
  [
    "Relatórios: no display ou em PDF num pen drive, na pasta \"Relatórios de alinhamento\", com o nome do relatório e a data.",
    "Exportar: ícone Relatório → escolher o relatório → pen drive na USB → ícone USB (fica azul).",
    "Se o ícone USB não ficar ativo, use outro pen drive.",
    "Pé manco: Configurações → Configurações de medição → Verificação de pé manco, com a UM em 12 horas (0°).",
    "Medição do pé manco: soltar e apertar o parafuso de cada um dos 4 pés; corrigir com calços e medir de novo.",
  ],
  [
    ["Pé manco", "Pé da máquina que não apoia direito na base; ao apertar, deforma a carcaça e atrapalha o alinhamento."],
    ["As Found / As Corrected", "No relatório: como a máquina estava antes da correção e como ficou depois."],
    ["Pasta \"Relatórios de alinhamento\"", "Pasta do pen drive onde ficam os PDFs exportados."],
    ["F1, F2, R1, R2", "Os quatro pés na tela do pé manco: os da frente (F) e os de trás (R)."],
    ["Backlash", "Folga; o relatório mostra se ela está dentro da tolerância."],
  ],
  [
    ["De que formas os relatórios podem ser vistos ou guardados?", ["Só impressos na hora", "Exibidos no display ou exportados como PDF em um pen drive", "Só enviados por e-mail", "Só pelo Bluetooth para o celular", "Não é possível ver relatórios"], 1, "Os relatórios podem ser exibidos no display ou exportados como PDF em um pen drive."],
    ["Qual é o primeiro passo para exportar um relatório em PDF?", ["Inserir o pen drive e desligar o display", "Selecionar o ícone Relatório na página Home", "Girar a UM para 12 horas", "Abrir as Configurações de medição", "Ler o código QR"], 1, "Primeiro: selecionar o ícone Relatório na página Home; depois escolher o relatório e inserir o pen drive."],
    ["Ao inserir o pen drive no display, o que acontece com o ícone USB?", ["Fica vermelho", "Some da tela", "Fica azul", "Fica piscando em laranja", "Vira uma bandeira"], 2, "O ícone USB, no canto inferior direito, fica azul assim que o pen drive é inserido."],
    ["Em que pasta do pen drive os relatórios ficam?", ["Documentos", "Relatórios de alinhamento", "SKF", "Downloads", "TKSA41"], 1, "Os relatórios ficam na pasta \"Relatórios de alinhamento\"."],
    ["Como são nomeados os relatórios em PDF?", ["Com o número de série", "Com o nome do relatório e a data", "Com o nome do operador", "Com a hora da medição apenas", "Com um código aleatório"], 1, "Os PDFs são nomeados com o nome do relatório e a data."],
    ["O que fazer se o ícone USB não ficar ativo?", ["Reiniciar a máquina", "Usar outro pen drive", "Refazer o alinhamento", "Trocar o cabo da unidade S", "Desligar o laser"], 1, "Se o ícone USB não ficar ativo, use outro pen drive."],
    ["Onde a verificação de pé manco é ativada?", ["Na tela de dimensões", "Configurações → Configurações de medição → Verificação de pé manco", "No menu Tutorial", "Na Biblioteca de máquinas", "No botão vermelho do display"], 1, "O pé manco é ativado em Configurações → Configurações de medição → Verificação de pé manco."],
    ["Em que posição a UM deve estar para medir o pé manco?", ["9 horas (−90°)", "12 horas (0°)", "3 horas (+90°)", "6 horas (180°)", "Qualquer posição"], 1, "Para o pé manco, coloque a UM na posição de 12 horas (0°)."],
    ["Qual é a sequência da medição do pé manco em cada pé?", ["Apertar, soltar e retirar o calço", "Soltar o parafuso e clicar em OK; apertar o parafuso e clicar em OK", "Girar o eixo 180° e clicar em OK", "Medir a distância C com a fita", "Trocar o parafuso por um maior"], 1, "Em cada pé: solte o parafuso e clique em OK, depois aperte o parafuso e clique em OK. Repita nos 4 pés."],
    ["Se houver pé manco, como ele é corrigido?", ["Apertando mais o parafuso", "Adicionando calços", "Movendo o motor para a direita", "Trocando a unidade M de lugar", "Diminuindo a rotação"], 1, "O pé manco é corrigido adicionando calços; depois, mede-se novamente."],
  ],
  [],
);
