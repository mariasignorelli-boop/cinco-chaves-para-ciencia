// ===== ENIGMAS =====
// Textos, dicas e respostas de cada enigma.
const puzzles = {
  books: {
    kicker: "DESAFIO 01 · CIÊNCIA POÉTICA",
    title: "A estante de quatro mundos",
    description:
      "Quatro livros devem ficar na ordem correta. Lógica fica imediatamente antes de Matemática. Poesia não fica nas pontas. Música fica depois de Matemática. Qual é a ordem?",
    hint: "Comece pelo par que precisa ficar junto. Depois verifique qual livro não pode ocupar uma ponta.",
    type: "options",
    options: [
      "Música · Lógica · Matemática · Poesia",
      "Lógica · Matemática · Poesia · Música",
      "Lógica · Poesia · Matemática · Música",
      "Poesia · Lógica · Matemática · Música",
    ],
    answer: "Lógica · Matemática · Poesia · Música",
  },
  portrait: {
    kicker: "DESAFIO 03 · HISTÓRIA",
    title: "A nota mais importante",
    description:
      "Ao traduzir um artigo sobre a Máquina Analítica, a autora do retrato acrescentou notas próprias. Por que uma dessas notas se tornou histórica?",
    hint: "Pense em instruções organizadas para uma máquina realizar uma tarefa, não na construção física da máquina.",
    type: "options",
    options: [
      "Descobriu a eletricidade",
      "Construiu o primeiro computador elétrico",
      "Inventou o relógio mecânico",
      "Descreveu um algoritmo para a máquina",
    ],
    answer: "Descreveu um algoritmo para a máquina",
  },
  computer: {
    kicker: "DESAFIO 04 · PRIMEIRO PROGRAMA",
    title: "O computador mecânico",
    description:
      "A fita de instruções diz: LEIA X → MULTIPLIQUE POR 3 → SOME 6 → RESULTADO 27. Qual valor foi lido no início?",
    hint: "Comece pelo resultado e desfaça as operações na ordem inversa.",
    type: "input",
    answer: "7",
  },
  cards: {
    kicker: "DESAFIO 05 · ALGORITMO",
    title: "Os cartões perfurados",
    description:
      "Os cartões devem instruir a máquina a calcular o quadrado de um número. Qual ordem faz sentido?",
    hint: "A máquina precisa receber o valor antes de calculá-lo, e calcular antes de mostrar.",
    type: "options",
    options: [
      "MOSTRAR · LER N · INICIAR · CALCULAR N×N",
      "INICIAR · CALCULAR N×N · LER N · MOSTRAR",
      "INICIAR · LER N · CALCULAR N×N · MOSTRAR",
      "LER N · MOSTRAR · CALCULAR N×N · INICIAR",
    ],
    answer: "INICIAR · LER N · CALCULAR N×N · MOSTRAR",
  },
  note: {
    kicker: "DESAFIO 02 · TINTA INVISÍVEL",
    title: "O ano escondido",
    description:
      "A luz azul desperta o ano escondido. Procure quatro algarismos pela sala e siga a ordem das marcas.",
    hint: "Mova a luz por superfícies diferentes. Os números aparecem perto das marcas I, II, III e IV.",
    type: "input",
    answer: "1843",
  },
  engine: {
    kicker: "MECANISMO FINAL",
    title: "Execute o programa",
    description:
      "As cinco engrenagens estão instaladas. Gire cada uma e observe a linha de energia. Quando o caminho estiver completo, acione a alavanca.",
    hint: "Cada trecho acende sozinho quando sua engrenagem alcança a posição certa.",
    type: "engine",
  },
};

// ===== ESTADO DA PARTIDA =====
let solved = new Set(); // enigmas já resolvidos nesta sala
let activeId = null; // enigma aberto no momento
let seconds = 0; // cronômetro em segundos
let timerHandle = null; // referência do intervalo do cronômetro
let rotations = [0, 0, 0, 0, 0]; // giros atuais de cada engrenagem (cada giro = 90°)
let hasFlashlight = false; // a lanterna azul já foi encontrada?
const targets = [1, 3, 2, 0, 3]; // giros corretos de cada engrenagem (solução do mecanismo final)

// ===== ATALHOS PARA ELEMENTOS DA TELA =====
const introModal = document.querySelector("#introModal");
const puzzleModal = document.querySelector("#puzzleModal");
const victoryModal = document.querySelector("#victoryModal");
const body = document.querySelector("#puzzleBody");
const feedback = document.querySelector("#feedback");
const hintText = document.querySelector("#hintText");
const hintButton = document.querySelector("#hintButton");
const roomStage = document.querySelector("#roomStage");

// ===== CRONÔMETRO =====
// Converte segundos para o formato "MM:SS".
function formatTime(value) {
  return (
    String(Math.floor(value / 60)).padStart(2, "0") +
    ":" +
    String(value % 60).padStart(2, "0")
  );
}

// Começa a contar (ignora se já estiver contando).
function startTimer() {
  if (timerHandle) return;
  timerHandle = setInterval(() => {
    seconds += 1;
    document.querySelector("#timer").textContent = "◷ " + formatTime(seconds);
  }, 1000);
}

// Para o cronômetro (vitória ou reinício).
function stopTimer() {
  clearInterval(timerHandle);
  timerHandle = null;
}

// ===== PROGRESSO =====
// Atualiza o contador "X/5" no topo da tela.
function updateProgress() {
  document.querySelector("#progress").textContent =
    Math.min(solved.size, 5) + "/5";
}

// Compara respostas sem se importar com maiúsculas, minúsculas ou espaços extras.
function normalize(value) {
  return value.trim().toLocaleUpperCase("pt-BR").replace(/\s+/g, " ");
}

// ===== ACERTO DE ENIGMA =====
// Marca o enigma como resolvido e mostra a mensagem de engrenagem liberada.
// Se for o bilhete (note), a lanterna azul é desligada: o brilho some da sala, os números escondidos desaparecem e a luz não responde mais.
function markSolved(id) {
  solved.add(id);
  updateProgress();
  if (id === "note") {
    roomStage.classList.remove("flashlight-ready");
    roomStage.style.removeProperty("--light-x");
    roomStage.style.removeProperty("--light-y");
    document
      .querySelectorAll(".secret-number")
      .forEach((secret) => secret.classList.remove("revealed"));
    document.querySelector("#roomPrompt").textContent =
      "A luz azul apagou-se. O bilhete guardou o que precisava.";
  }
  body.innerHTML =
    '<div class="success"><span class="piece">⚙</span><div><strong>ENGRENAGEM LIBERADA</strong><p>A Máquina Analítica recebeu mais uma engrenagem.</p></div></div>';
  feedback.textContent = "";
  hintButton.hidden = true;
  hintText.hidden = true;
}

// Confere a resposta do jogador com a resposta do enigma aberto.
function checkAnswer(value) {
  const puzzle = puzzles[activeId];
  if (normalize(value) === normalize(puzzle.answer)) markSolved(activeId);
  else feedback.textContent = "Ainda não. Releia as pistas e tente novamente.";
}

// ===== TELAS DE RESPOSTA =====
// Monta os botões de múltipla escolha.
function renderOptions(puzzle) {
  const grid = document.createElement("div");
  grid.className = "option-grid";
  puzzle.options.forEach((text) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = text;
    button.addEventListener("click", () => checkAnswer(text));
    grid.appendChild(button);
  });
  body.appendChild(grid);
}

// Monta o campo de resposta digitada.
function renderInput() {
  body.innerHTML =
    '<form class="word-form"><label for="answerInput">Sua resposta</label><input id="answerInput" autocomplete="off" inputmode="numeric" placeholder="Digite sua resposta"><button class="primary" type="submit">CONFIRMAR</button></form>';
  body.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    checkAnswer(body.querySelector("input").value);
  });
  setTimeout(() => body.querySelector("input")?.focus(), 50);
}

// Monta as três gavetas do gaveteiro. A gaveta do meio esconde a lanterna azul; as outras duas estão vazias.
function renderDrawers() {
  body.innerHTML =
    '<div class="drawer-list"><button class="drawer-choice" data-drawer="1" aria-label="Abrir gaveta superior"><img src="gaveta.jpg" alt="" width="1536" height="512"></button><button class="drawer-choice" data-drawer="2" aria-label="Abrir gaveta central"><img src="gaveta.jpg" alt="" width="1536" height="512"></button><button class="drawer-choice" data-drawer="3" aria-label="Abrir gaveta inferior"><img src="gaveta.jpg" alt="" width="1536" height="512"></button></div>';
  body.querySelectorAll(".drawer-choice").forEach((button) =>
    button.addEventListener("click", () => {
      if (button.dataset.drawer === "2") {
        hasFlashlight = true;
        document.querySelector("#inventory").hidden = false;
        roomStage.classList.add("flashlight-ready");
        document.querySelector("#roomPrompt").textContent =
          "Mova a lanterna azul pela sala e procure as marcas.";
        body.innerHTML =
          '<div class="success lantern-found"><span class="piece">▣</span><div><strong>LANTERNA AZUL ENCONTRADA</strong><p>Agora o bilhete sobre o móvel pode ser lido.</p></div></div>';
        feedback.textContent = "";
        hintButton.hidden = true;
      } else feedback.textContent = "A gaveta está vazia.";
    }),
  );
}

// ===== LINHA DE ENERGIA =====
// Acende cada trecho da linha cuja engrenagem está na posição certa;
// se todas estiverem certas, a linha brilha inteira e a alavanca é liberada.
function updateEnergy() {
  const segments = body.querySelectorAll(".energy-segment");
  rotations.forEach((rotation, index) =>
    segments[index]?.classList.toggle("active", rotation === targets[index]),
  );
  const aligned = rotations.every(
    (rotation, index) => rotation === targets[index],
  );
  body.querySelector(".energy-line")?.classList.toggle("complete", aligned);
  const lever = body.querySelector(".lever-assembly");
  if (lever) lever.disabled = !aligned;
  feedback.classList.toggle("is-ready", aligned);
  feedback.textContent = aligned
    ? "Caminho completo. A alavanca está pronta."
    : "";
}

// ===== MECANISMO FINAL (MÁQUINA ANALÍTICA) =====
// Só abre de verdade depois dos 5 enigmas resolvidos; 
// antes disso mostra quantas engrenagens ainda faltam. 
// Com as 5 instaladas, monta a alavanca à esquerda e a linha de energia com uma engrenagem giratória por trecho.
function renderEngine() {
  if (solved.size < 5) {
    body.innerHTML =
      '<div class="locked"><strong>A MÁQUINA ESTÁ INCOMPLETA</strong><p>Faltam ' +
      (5 - solved.size) +
      " engrenagem(ns). Explore os outros objetos do gabinete.</p></div>";
    return;
  }
  body.innerHTML =
    '<div class="engine-panel"><div class="machine"><button class="lever-assembly" aria-label="Acionar alavanca"><span class="lever-arm"><span class="lever-shaft"></span><span class="lever-knob"></span></span><span class="lever-base"></span></button><div class="energy-line" aria-label="Linha de energia e cinco engrenagens giratórias"></div></div></div>';
  const bank = body.querySelector(".energy-line");

  // Cria um espaço (slot) para cada engrenagem: trecho da linha + botão giratório.
  rotations.forEach((rotation, index) => {
    const slot = document.createElement("div");
    slot.className = "gear-slot";
    const segment = document.createElement("i");
    segment.className = "energy-segment";
    const gear = document.createElement("button");
    gear.className = "gear";
    gear.setAttribute("aria-label", "Girar engrenagem " + (index + 1));
    gear.innerHTML = "<span></span><b>" + (index + 1) + "</b>";
    gear.style.setProperty("--turn", rotation * 90 + "deg");

    // Cada clique gira 90° e atualiza a linha de energia na hora.
    gear.addEventListener("click", () => {
      if (body.querySelector(".lever-assembly.pulled")) return;
      rotations[index] = (rotations[index] + 1) % 4;
      gear.style.setProperty("--turn", rotations[index] * 90 + "deg");
      updateEnergy();
    });
    slot.append(segment, gear);
    bank.appendChild(slot);
  });

  // A alavanca só funciona com o caminho completo; ao clicar, ela desce (classe "pulled") e a vitória aparece após a animação.
  const lever = body.querySelector(".lever-assembly");
  lever.addEventListener("click", () => {
    if (!rotations.every((rotation, index) => rotation === targets[index]))
      return;
    if (lever.classList.contains("pulled")) return;
    lever.classList.add("pulled");
    setTimeout(finishGame, 800);
  });
  updateEnergy();
}

// ===== ABERTURA DOS ENIGMAS =====
// Decide o que mostrar na janela conforme o objeto clicado:
// Gaveteiro: as três gavetas (ou aviso de lanterna já em uso);
// Bilhete sem lanterna: conteúdo embaçado + "Necessário: lanterna azul";
// Demais: o enigma correspondente (ou a tela de engrenagem liberada, se o jogador abrir de novo um enigma já resolvido).
function openPuzzle(id) {
  activeId = id;
  feedback.classList.remove("is-ready");
  feedback.textContent = "";
  if (id === "drawers") {
    document.querySelector("#puzzleKicker").textContent = "OBJETO · GAVETEIRO";
    document.querySelector("#puzzleTitle").textContent = "Três gavetas";
    document.querySelector("#puzzleDescription").textContent = hasFlashlight
      ? "A gaveta central está aberta. A lanterna já está com você."
      : "Uma das gavetas esconde uma ferramenta útil.";
    hintText.textContent = "Examine as gavetas.";
    hintText.hidden = true;
    hintButton.hidden = hasFlashlight;
    if (hasFlashlight && !solved.has("note"))
      body.innerHTML =
        '<div class="success"><span class="piece">▣</span><div><strong>LANTERNA EM USO</strong><p>Passe-a pelas superfícies da sala.</p></div></div>';
    else renderDrawers();
  } else if (id === "note" && !hasFlashlight) {
    document.querySelector("#puzzleKicker").textContent =
      "BILHETE · TINTA INVISÍVEL";
    document.querySelector("#puzzleTitle").textContent = "Mensagem oculta";
    document.querySelector("#puzzleDescription").textContent = "";
    body.innerHTML =
      '<div class="blurred-note" aria-hidden="true">A luz desperta o ano escondido. Procure quatro algarismos...</div><div class="lantern-required">Necessário: lanterna azul</div>';
    hintText.hidden = true;
    hintButton.hidden = true;
  } else {
    const puzzle = puzzles[id];
    document.querySelector("#puzzleKicker").textContent = puzzle.kicker;
    document.querySelector("#puzzleTitle").textContent = puzzle.title;
    document.querySelector("#puzzleDescription").textContent =
      puzzle.description;
    hintText.textContent = puzzle.hint;
    hintText.hidden = true;
    hintButton.textContent = "Ver dica";
    hintButton.hidden = false;
    body.innerHTML = "";
    if (solved.has(id) && id !== "engine") markSolved(id);
    else if (puzzle.type === "options") renderOptions(puzzle);
    else if (puzzle.type === "input") renderInput();
    else renderEngine();
  }
  puzzleModal.classList.add("open");
}

// ===== LANTERNA AZUL =====
// Move o brilho azul pela sala e revela cada número escondido quando a luz chega perto dele.
// Não faz nada sem a lanterna, depois de resolver o bilhete, ou com uma janela de enigma aberta.
function moveFlashlight(clientX, clientY) {
  if (
    !hasFlashlight ||
    solved.has("note") ||
    puzzleModal.classList.contains("open")
  )
    return;
  const rect = roomStage.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  roomStage.style.setProperty("--light-x", x + "px");
  roomStage.style.setProperty("--light-y", y + "px");
  document.querySelectorAll(".secret-number").forEach((secret) => {
    const box = secret.getBoundingClientRect();
    const distance = Math.hypot(
      clientX - (box.left + box.width / 2),
      clientY - (box.top + box.height / 2),
    );
    secret.classList.toggle(
      "revealed",
      distance < Math.max(54, rect.width * 0.075),
    );
  });
}

// ===== FIM =====
// Vitória: para o cronômetro, mostra o tempo final e abre a tela de conclusão.
function finishGame() {
  solved.add("engine");
  stopTimer();
  puzzleModal.classList.remove("open");
  document.querySelector("#finalTime").textContent =
    "TEMPO: " + formatTime(seconds);
  victoryModal.classList.add("open");
  avisarJornada();
}

// ===== REINÍCIO =====
// Zera tudo (enigmas, cronômetro, engrenagens, lanterna) e volta para a tela de introdução.
function resetGame() {
  stopTimer();
  solved = new Set();
  activeId = null;
  seconds = 0;
  rotations = [0, 0, 0, 0, 0];
  hasFlashlight = false;
  updateProgress();
  document.querySelector("#timer").textContent = "◷ 00:00";
  document.querySelector("#inventory").hidden = true;
  document.querySelector("#roomPrompt").textContent =
    "Explore a sala e examine os objetos.";
  roomStage.classList.remove("flashlight-ready");
  document
    .querySelectorAll(".secret-number")
    .forEach((secret) => secret.classList.remove("revealed"));
  puzzleModal.classList.remove("open");
  victoryModal.classList.remove("open");
  introModal.classList.add("open");
}

// ===== LIGAÇÃO DOS BOTÕES E EVENTOS =====
// Cada ponto invisível da sala abre o enigma correspondente.
document
  .querySelectorAll(".hotspot")
  .forEach((button) =>
    button.addEventListener("click", () => openPuzzle(button.dataset.puzzle)),
  );

// Botão "COMEÇAR INVESTIGAÇÃO": fecha a introdução e inicia o cronômetro.
document.querySelector("#startButton").addEventListener("click", () => {
  introModal.classList.remove("open");
  startTimer();
});

// Botão "?": reabre as instruções. Botão "↻": reinicia a partida.
document
  .querySelector("#helpButton")
  .addEventListener("click", () => introModal.classList.add("open"));
document.querySelector("#resetButton").addEventListener("click", resetGame);
document.querySelector("#playAgainButton").addEventListener("click", resetGame);

// "×" e a tecla Escape fecham a janela de enigma.
document
  .querySelector("#closePuzzle")
  .addEventListener("click", () => puzzleModal.classList.remove("open"));

// Botão "Ver dica": mostra ou esconde a dica do enigma aberto.
hintButton.addEventListener("click", () => {
  hintText.hidden = !hintText.hidden;
  hintButton.textContent = hintText.hidden ? "Ver dica" : "Ocultar dica";
});

// A lanterna segue o mouse (ou o dedo, no celular) pela sala.
roomStage.addEventListener("pointermove", (event) =>
  moveFlashlight(event.clientX, event.clientY),
);
roomStage.addEventListener("pointerdown", (event) =>
  moveFlashlight(event.clientX, event.clientY),
);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") puzzleModal.classList.remove("open");
});

/* ===== INTEGRAÇÃO COM A JORNADA COMPLETA =====
   Quando esta sala é aberta dentro da Jornada Completa (página principal, com
   "?jornada" no endereço), o cronômetro global de 30 minutos fica na barra do
   site. Por isso o cronômetro próprio da sala é escondido e, ao destravar o
   mecanismo final, a sala avisa a página principal para liberar a próxima fase.
   Aberta sozinha (fora do site), nada disso acontece. */
const MODO_JORNADA = new URLSearchParams(window.location.search).has("jornada");

/* Avisa a página principal que a Sala 2 foi concluída.
   Aberta do computador (file:), a origem não tem nome, então o aviso usa "*";
   ele só leva o número da sala, nada privado. */
function avisarJornada() {
  if (MODO_JORNADA && window.parent !== window) {
    window.parent.postMessage({ tipo: "escape-room:sala-concluida", sala: 2 }, window.location.protocol === "file:" ? "*" : window.location.origin);
  }
}

/* Esconde o cronômetro próprio da sala durante a jornada. */
if (MODO_JORNADA) {
  const relogio = document.getElementById("timer");
  if (relogio) relogio.style.display = "none";
}
