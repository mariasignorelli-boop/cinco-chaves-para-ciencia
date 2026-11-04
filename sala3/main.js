/* Banco de dados */
const PUZZLES = [
  {
    id: "desk",
    label: "Escrivaninha e caderno",
    eyebrow: "DESAFIO 01 · CADERNO CIFRADO",
    title: "A palavra escondida no caderno",
    description:
      "No caderno aberto sobre a escrivaninha há apenas números: 16 - 15 - 12 - 15 - 14 - 9 - 15. Ao lado, Marie escreveu: “A = 1”. Qual palavra está anotada?",
    hint: "Se A vale 1, B vale 2 e assim por diante, troque cada número pela letra da mesma posição do alfabeto (sem acentos).",
    symbol: "☢",
    answer: "POLONIO",
    hotspot: "hotspot-desk",
  },
  {
    id: "table",
    label: "Tabela e nota dos frascos",
    eyebrow: "DESAFIO 02 · FRASCOS DO RÁDIO",
    title: "Em qual frasco está o rádio?",
    description:
      "Numa estante, cinco frascos lacrados guardam rádio, polônio, urânio, tório e água destilada, um em cada. Em cima ficam os frascos I, II e III; embaixo, IV e V. A nota de Marie diz: (1) “O urânio está no frasco do meio da prateleira de cima.” (2) “O rádio não divide a prateleira com o urânio.” (3) “O polônio está num frasco de número par.” (4) “O tório não está no frasco I.” Em qual frasco está o rádio?",
    hint: "Descubra primeiro onde está o urânio. Depois veja em qual prateleira o rádio pode estar e quem ocupa o frasco par.",
    symbol: "◎",
    options: ["Frasco I", "Frasco II", "Frasco III", "Frasco IV", "Frasco V"],
    layout: "shelf",
    answer: "Frasco V",
    hotspot: "hotspot-table",
  },
  {
    id: "geiger",
    label: "Frascos e contador",
    eyebrow: "DESAFIO 03 · MEIA-VIDA",
    title: "O brilho que some pela metade",
    description:
      "O contador marca 80 unidades no frasco recém-preparado. O registro diz que a cada 4 anos a amostra perde metade da sua intensidade. Quanto o contador vai marcar depois de 16 anos?",
    hint: "Em 16 anos cabem quatro períodos de 4 anos. Divida 80 por 2 uma vez para cada período.",
    symbol: "✦",
    answer: "5",
    hotspot: "hotspot-geiger",
  },
  {
    id: "apparatus",
    label: "Bancada de instrumentos",
    eyebrow: "DESAFIO 04 · BLINDAGEM",
    title: "Qual raio atravessou o chumbo?",
    description:
      "Na bancada, um feixe foi testado com três barreiras: passou pela folha de papel, passou pela placa de alumínio e só foi barrado pela parede de chumbo. Que tipo de radiação é essa?",
    hint: "Quanto maior o poder de penetração, mais grossa precisa ser a blindagem. Papel segura a mais fraca; o chumbo é reservado à mais penetrante.",
    symbol: "◆",
    options: ["Radiação alfa", "Radiação beta", "Radiação gama", "Som"],
    answer: "Radiação gama",
    hotspot: "hotspot-apparatus",
  },
  {
    id: "safe",
    label: "Cofre",
    eyebrow: "MECANISMO FINAL",
    title: "O cofre do caderno",
    description:
      "O teclado do cofre tem quatro símbolos. Insira-os na ordem em que os desafios foram numerados.",
    hint: "Cada desafio resolvido te deu um símbolo. A ordem é a mesma em que os desafios foram numerados.",
    symbol: "★",
    answer: "☢◎✦◆",
    hotspot: "hotspot-safe",
  },
];

/* Símbolos no teclado do cofre. */
const SAFE_SYMBOLS = ["✦", "☢", "◆", "◎"];

/* Estado da partida: desafio atual, respostas, dica e cronômetro. */
const state = {
  activeId: null,
  solved: [],
  input: "",
  feedback: null,
  showHint: false,
  seconds: 0,
  running: false,
};

/* Guarda o intervalo do cronômetro para poder interrompê-lo. */
let timerId = null;

/* Atalho para localizar elementos HTML pelo id. */
const el = (id) => document.getElementById(id);

/* Escapa caracteres especiais antes de inserir textos no HTML. */
const escapeHtml = (s) =>
  s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

/* Converte segundos para MM:SS. */
const formatTime = (t) =>
  String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0");

/* Conta os quatro desafios principais já resolvidos. */
const solvedCore = () => state.solved.filter((id) => id !== "safe").length;

/* Inicia o cronômetro da partida. */
function startTimer() {
  state.running = true;
  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => {
    state.seconds += 1;
    el("timer").textContent = formatTime(state.seconds);
  }, 1000);
}

/* Para o cronômetro e limpa o intervalo. */
function stopTimer() {
  state.running = false;
  if (timerId) clearInterval(timerId);
  timerId = null;
}

/* Cria as áreas invisíveis clicáveis sobre os objetos da sala. */
function buildHotspots() {
  el("hotspots").innerHTML = PUZZLES.map(
    (p) =>
      `<button class="object-hotspot ${p.hotspot}" data-id="${p.id}" aria-label="${escapeHtml(p.label)}"></button>`,
  ).join("");
  el("hotspots")
    .querySelectorAll("button")
    .forEach((btn) => {
      btn.addEventListener("click", () => openPuzzle(btn.dataset.id));
    });
}

/* Abre um desafio e limpa os dados temporários da tentativa. */
function openPuzzle(id) {
  state.activeId = id;
  state.feedback = null;
  state.showHint = false;
  state.input = "";
  /* Abre a janela antes de desenhar o conteúdo, para o campo de resposta receber o foco. */
  el("puzzle-overlay").classList.add("open");
  renderPuzzle();
}

/* Fecha a janela do desafio. */
function closePuzzle() {
  state.activeId = null;
  el("puzzle-overlay").classList.remove("open");
}

/* Atualiza o contador de progresso. */
function renderProgress() {
  el("progress").textContent = solvedCore() + "/4";
}

/* Renderiza o conteúdo do modal conforme o estado atual do desafio. */
function renderPuzzle() {
  const p = PUZZLES.find((x) => x.id === state.activeId);
  if (!p) return;
  const ready = solvedCore() === 4;
  const dialog = el("puzzle-dialog");
  let body = "";

  if (p.id === "safe" && !ready) {
    const left = 4 - solvedCore();
    body = `<div class="locked-message">
      <span class="pixel-lock" aria-hidden="true">▣</span>
      <p>O mecanismo ainda está travado.</p>
      <small>Resolva os ${left} desafio${left === 1 ? "" : "s"} restante${left === 1 ? "" : "s"}.</small>
    </div>`;
  } else if (state.solved.includes(p.id)) {
    body = `<div class="success-panel">
      <span class="reward-symbol">${p.symbol}</span>
      <div>
        <strong>${p.id === "safe" ? "COFRE ABERTO" : "PISTA ENCONTRADA"}</strong>
        <p>${p.id === "safe" ? "Você concluiu a sala!" : "O símbolo deste desafio é " + p.symbol}</p>
      </div>
    </div>`;
  } else {
    if (p.options) {
      body +=
        `<div class="answer-grid${p.layout === "shelf" ? " shelf" : ""}">` +
        p.options
          .map(
            (o) =>
              `<button type="button" data-option="${escapeHtml(o)}">${escapeHtml(o)}</button>`,
          )
          .join("") +
        `</div>`;
    } else if (p.id === "safe") {
      body += `<div class="safe-keypad">
        <div class="safe-display" aria-live="polite">${[0, 1, 2, 3].map((i) => `<span>${[...state.input][i] || "·"}</span>`).join("")}</div>
        <div class="symbol-pad">${SAFE_SYMBOLS.map((s) => `<button type="button" data-symbol="${s}" aria-label="Inserir símbolo ${s}">${s}</button>`).join("")}</div>
        <div class="safe-controls">
          <button type="button" class="erase-btn" id="btn-erase">APAGAR</button>
          <button type="button" class="pixel-primary" id="btn-unlock" ${[...state.input].length !== 4 ? "disabled" : ""}>DESTRAVAR</button>
        </div>
      </div>`;
    } else {
      body += `<form class="word-form" id="word-form">
        <label for="puzzle-answer">Sua resposta</label>
        <input id="puzzle-answer" autocomplete="off" placeholder="Digite sua resposta" value="${escapeHtml(state.input)}" />
        <button type="submit" class="pixel-primary">CONFIRMAR</button>
      </form>`;
    }
    body += `<div class="feedback-row" aria-live="polite">
      ${state.feedback === "wrong" ? `<p class="wrong-answer">Ainda não. Observe a pista e tente outra vez.</p>` : ""}
      <button type="button" class="ghost-btn" id="btn-hint">? ${state.showHint ? "Ocultar dica" : "Ver dica"}</button>
    </div>`;
    if (state.showHint) body += `<p class="hint-box">${escapeHtml(p.hint)}</p>`;
  }

  dialog.innerHTML = `<button class="dialog-corner-close" id="btn-close-puzzle" aria-label="Fechar">✕</button>
    <div><span class="dialog-kicker">${p.eyebrow}</span><h2>${escapeHtml(p.title)}</h2></div>
    <p class="dialog-desc">${escapeHtml(p.description)}</p>${body}`;

  el("btn-close-puzzle").addEventListener("click", closePuzzle);
  const hintBtn = el("btn-hint");
  if (hintBtn)
    hintBtn.addEventListener("click", () => {
      state.showHint = !state.showHint;
      renderPuzzle();
    });
  dialog
    .querySelectorAll("[data-option]")
    .forEach((b) =>
      b.addEventListener("click", () => submitAnswer(b.dataset.option)),
    );
  dialog.querySelectorAll("[data-symbol]").forEach((b) =>
    b.addEventListener("click", () => {
      state.feedback = null;
      if ([...state.input].length < 4) state.input += b.dataset.symbol;
      renderPuzzle();
    }),
  );
  const erase = el("btn-erase");
  if (erase)
    erase.addEventListener("click", () => {
      state.input = "";
      state.feedback = null;
      renderPuzzle();
    });
  const unlock = el("btn-unlock");
  if (unlock) unlock.addEventListener("click", () => submitAnswer());
  const form = el("word-form");
  if (form) {
    const field = el("puzzle-answer");
    field.addEventListener("input", () => {
      state.input = field.value;
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitAnswer();
    });
    field.focus();
  }
}

/* Remove acentos para aceitar respostas escritas de qualquer forma. */
const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleUpperCase("pt-BR");

/* Valida a resposta e registra o desafio como resolvido quando correta. */
function submitAnswer(value) {
  const p = PUZZLES.find((x) => x.id === state.activeId);
  if (!p) return;
  const submitted = normalize(String(value !== undefined ? value : state.input));
  const expected = normalize(p.answer || "");
  if (submitted === expected) {
    state.feedback = "correct";
    if (!state.solved.includes(p.id)) state.solved.push(p.id);
    renderProgress();
    if (p.id === "safe") {
      closePuzzle();
      stopTimer();
      el("victory-time").textContent = formatTime(state.seconds);
      el("victory-overlay").classList.add("open");
      avisarJornada();
      return;
    }
  } else {
    state.feedback = "wrong";
  }
  renderPuzzle();
}

/* Reinicia todos os dados da partida. */
function resetGame() {
  state.solved = [];
  state.activeId = null;
  state.feedback = null;
  state.input = "";
  state.showHint = false;
  state.seconds = 0;
  stopTimer();
  el("timer").textContent = "00:00";
  renderProgress();
  closePuzzle();
  el("victory-overlay").classList.remove("open");
  el("intro-overlay").classList.add("open");
}

/* Eventos dos botões principais da interface. */
el("btn-start").addEventListener("click", () => {
  el("intro-overlay").classList.remove("open");
  startTimer();
});
el("btn-help").addEventListener("click", () =>
  el("intro-overlay").classList.add("open"),
);
el("btn-reset").addEventListener("click", resetGame);
el("btn-again").addEventListener("click", resetGame);
el("btn-close-victory").addEventListener("click", () =>
  el("victory-overlay").classList.remove("open"),
);

/* Permite fechar os modais usando a tecla Esc. */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (el("puzzle-overlay").classList.contains("open")) closePuzzle();
  else if (el("victory-overlay").classList.contains("open"))
    el("victory-overlay").classList.remove("open");
});

/* Inicialização da aplicação. */
buildHotspots();
renderProgress();
el("intro-overlay").classList.add("open");

/* ===== INTEGRAÇÃO COM A JORNADA COMPLETA =====
   Quando esta sala é aberta dentro da Jornada Completa (página principal, com
   "?jornada" no endereço), o cronômetro global de 30 minutos fica na barra do
   site. Por isso o cronômetro próprio da sala é escondido e, ao destravar o
   mecanismo final, a sala avisa a página principal para liberar a próxima fase.
   Aberta sozinha (fora do site), nada disso acontece. */
const MODO_JORNADA = new URLSearchParams(window.location.search).has("jornada");

/* Avisa a página principal que a Sala 3 foi concluída.
   Aberta do computador (file:), a origem não tem nome, então o aviso usa "*";
   ele só leva o número da sala, nada privado. */
function avisarJornada() {
  if (MODO_JORNADA && window.parent !== window) {
    window.parent.postMessage({ tipo: "escape-room:sala-concluida", sala: 3 }, window.location.protocol === "file:" ? "*" : window.location.origin);
  }
}

/* Esconde o cronômetro próprio da sala durante a jornada. */
if (MODO_JORNADA) {
  const relogio = document.getElementById("timer");
  if (relogio) relogio.parentElement.style.display = "none";
}
