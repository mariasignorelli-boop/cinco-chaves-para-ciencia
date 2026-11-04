/* Banco de dados */
const PUZZLES = [
  {
    id: "diary",
    label: "Mesa com o diário de observações Anno 1788",
    eyebrow: "DESAFIO 01 · DIÁRIO DE OBSERVAÇÕES",
    title: "A noite do cometa",
    description:
      "No diário Anno 1788, Caroline anotou as noites de dezembro em que vigiou o céu: 1, 3, 6, 10, 15... Na noite seguinte dessa sequência, o cometa apareceu na ocular. Em que noite ela registrou o trânsito do cometa?",
    hint: "Observe quanto cada noite avança em relação à anterior: +2, +3, +4, +5... A próxima diferença é +6.",
    symbol: "☉",
    options: ["19 de dezembro", "20 de dezembro", "21 de dezembro", "24 de dezembro"],
    answer: "21 de dezembro",
    hotspot: "hotspot-diary",
  },
  {
    id: "clock",
    label: "Relógio de pêndulo astronômico",
    eyebrow: "DESAFIO 02 · TEMPO SIDERAL",
    title: "A passagem da estrela",
    description:
      "O relógio de pêndulo marca o tempo das estrelas. Na primeira noite, a estrela Vega passou pelo centro da ocular às 22:00. Como o dia sideral é 4 minutos mais curto que o dia solar, ela passa 4 minutos mais cedo a cada noite. A que horas Vega passará pela ocular 15 noites depois?",
    hint: "Multiplique 15 noites por 4 minutos e subtraia o resultado de 22:00. Responda no formato HH:MM.",
    symbol: "☽",
    answer: "21:00",
    accept: ["21H00", "21H", "21", "2100", "21HORAS", "21HS"],
    hotspot: "hotspot-clock",
  },
  {
    id: "chart",
    label: "Carta celeste Hemisphaerium Coeleste",
    eyebrow: "DESAFIO 03 · CARTA CELESTE",
    title: "Ligue as estrelas",
    description:
      "O cometa foi avistado perto do “W” de Cassiopeia, a constelação-guia de Caroline. Na carta celeste, ligue as cinco estrelas na ordem β → α → γ → δ → ε para traçar as linhas douradas. Cuidado: há estrelas soltas que não fazem parte do desenho.",
    hint: "O W começa em β (Caph), no alto à esquerda, e alterna entre estrelas mais baixas e mais altas até terminar em ε (Segin), à direita. Se errar, as linhas se apagam e você recomeça por β.",
    symbol: "✧",
    type: "stars",
    answer: "CASSIOPEIA",
    hotspot: "hotspot-chart",
  },
  {
    id: "telescope",
    label: "Telescópio refletor e janela com o cometa",
    eyebrow: "DESAFIO 04 · COMET SEEKER",
    title: "Centralize o cometa",
    description:
      "Na ocular do telescópio, o cometa aparece fora da mira. Gire os parafusos micrométricos do tripé com os botões ▲ ▼ ◄ ► até o núcleo do cometa ficar no centro do retículo. Atenção: como todo telescópio astronômico, o refletor inverte a imagem.",
    hint: "Por causa da inversão, cada parafuso move o cometa no mesmo sentido da seta. Ele está acima e à direita: aperte ▼ duas vezes e ◄ três vezes.",
    symbol: "☄",
    type: "scope",
    answer: "COMETA CENTRALIZADO",
    hotspot: "hotspot-telescope",
  },
  {
    id: "sphere",
    label: "Esfera armilar e console de latão",
    eyebrow: "MECANISMO FINAL",
    title: "A esfera armilar",
    description:
      "O console de latão tem quatro mostradores numerados I, II, III e IV. Gire cada um até o símbolo certo, na ordem em que os desafios foram numerados.",
    hint: "Cada desafio resolvido te deu um símbolo. O mostrador I recebe o símbolo do Desafio 01, o II o do Desafio 02, e assim por diante.",
    symbol: "★",
    answer: "☉☽✧☄",
    hotspot: "hotspot-sphere",
  },
];

/* Símbolos gravados nos mostradores do console (inclui um símbolo falso: ♄). */
const DIAL_SYMBOLS = ["☉", "☽", "✧", "☄", "♄"];
const DIAL_NUMERALS = ["I", "II", "III", "IV"];

/* Carta celeste (Desafio 3): estrelas em % da área do céu. As 5 primeiras formam o W. */
const STARS = [
  { id: "beta", letter: "β", name: "Caph", x: 12, y: 26 },
  { id: "alpha", letter: "α", name: "Schedar", x: 31, y: 62 },
  { id: "gamma", letter: "γ", name: "Navi", x: 50, y: 34 },
  { id: "delta", letter: "δ", name: "Ruchbah", x: 69, y: 64 },
  { id: "epsilon", letter: "ε", name: "Segin", x: 88, y: 30 },
  { id: "eta", letter: "η", name: "estrela solta", x: 40, y: 14 },
  { id: "kappa", letter: "κ", name: "estrela solta", x: 22, y: 84 },
  { id: "iota", letter: "ι", name: "estrela solta", x: 80, y: 84 },
];
const STAR_ORDER = ["beta", "alpha", "gamma", "delta", "epsilon"];

/* Ocular (Desafio 4): posição inicial do cometa, limite e tamanho de cada passo. */
const SCOPE = { START_X: 3, START_Y: -2, LIMIT: 5, STEP: 9 };

/* Movimento de cada parafuso: a imagem invertida faz o cometa andar no sentido da seta. */
const AIM = {
  up: { dx: 0, dy: -1, label: "Girar parafuso para cima" },
  down: { dx: 0, dy: 1, label: "Girar parafuso para baixo" },
  left: { dx: -1, dy: 0, label: "Girar parafuso para a esquerda" },
  right: { dx: 1, dy: 0, label: "Girar parafuso para a direita" },
};
const AIM_KEYS = { arrowup: "up", arrowdown: "down", arrowleft: "left", arrowright: "right", w: "up", s: "down", a: "left", d: "right" };

/* Estado da partida: desafio atual, respostas, dica e cronômetro. */
const state = {
  activeId: null,
  solved: [],
  input: "",
  feedback: null,
  showHint: false,
  seconds: 0,
  running: false,
  round: 0,
  linked: [],
  starsLocked: false,
  scope: { x: SCOPE.START_X, y: SCOPE.START_Y, moves: 0 },
  scopeLocked: false,
  dials: [-1, -1, -1, -1],
  focusSel: null,
};

/* Guarda o intervalo do cronômetro para poder interrompê-lo. */
let timerId = null;

/* Atalho para localizar elementos HTML pelo id. */
const el = (id) => document.getElementById(id);

/* Busca um desafio pelo identificador. */
const findPuzzle = (id) => PUZZLES.find((x) => x.id === id);

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
const solvedCore = () => state.solved.filter((id) => id !== "sphere").length;

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
  state.focusSel = null;
  /* A janela abre antes de renderizar para que o foco do teclado funcione. */
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

/* Marca um minigame como resolvido após uma pausa, mesmo se a janela tiver sido fechada. */
function finishMinigame(id) {
  const round = state.round;
  setTimeout(() => {
    if (round !== state.round) return;
    if (state.activeId === id) submitAnswer(findPuzzle(id).answer);
    else if (!state.solved.includes(id)) {
      state.solved.push(id);
      renderProgress();
    }
  }, 700);
}

/* ===== Desafio 3 · Ligar as estrelas da carta celeste ===== */

/* Apaga as linhas e recomeça a constelação. */
function resetStars() {
  state.linked = [];
  state.starsLocked = false;
}

/* Liga uma estrela: se for a próxima da ordem, desenha a linha; se não, apaga tudo. */
function linkStar(id) {
  if (state.starsLocked) return;
  state.focusSel = `[data-star="${id}"]`;
  const expected = STAR_ORDER[state.linked.length];
  if (id === expected) {
    state.linked.push(id);
    state.feedback = null;
    if (state.linked.length === STAR_ORDER.length) {
      state.starsLocked = true;
      finishMinigame("chart");
    }
  } else if (!state.linked.includes(id)) {
    state.linked = [];
    state.feedback = "wrong";
  }
  renderPuzzle();
}

/* Gera o HTML da carta celeste com as estrelas e as linhas já traçadas. */
function starsHtml() {
  const pos = Object.fromEntries(STARS.map((s) => [s.id, s]));
  const lines = state.linked
    .slice(1)
    .map((id, k) => {
      const a = pos[state.linked[k]];
      const b = pos[id];
      return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" vector-effect="non-scaling-stroke" />`;
    })
    .join("");
  const stars = STARS.map((s) => {
    const on = state.linked.includes(s.id);
    return `<button type="button" class="star-btn ${on ? "linked" : ""}" data-star="${s.id}" style="left:${s.x}%;top:${s.y}%" aria-pressed="${on}" aria-label="Estrela ${s.letter} (${escapeHtml(s.name)})${on ? ", ligada" : ""}" ${state.starsLocked ? "disabled" : ""}>
      <span class="star-dot" aria-hidden="true"></span><span class="star-name" aria-hidden="true">${s.letter}</span>
    </button>`;
  }).join("");
  return `<div class="sky-chart">
    <div class="sky-field" role="group" aria-label="Carta celeste. Use Tab para escolher uma estrela e Enter ou Espaço para ligá-la.">
      <svg class="sky-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>
      ${stars}
    </div>
    <p class="sky-info" aria-live="polite">ESTRELAS LIGADAS: <strong>${state.linked.length}/${STAR_ORDER.length}</strong></p>
    ${state.starsLocked ? `<p class="sky-ok">CASSIOPEIA TRAÇADA · O COMETA ESTÁ AO LADO DO W</p>` : ""}
  </div>`;
}

/* ===== Desafio 4 · Ocular do telescópio (Comet Seeker) ===== */

/* Restaura a ocular à posição inicial. */
function resetScope() {
  state.scope = { x: SCOPE.START_X, y: SCOPE.START_Y, moves: 0 };
  state.scopeLocked = false;
}

/* Gira um parafuso: move o cometa um passo e verifica se ficou centralizado. */
function aimScope(dir) {
  if (state.scopeLocked || !AIM[dir]) return;
  const s = state.scope;
  const clamp = (v) => Math.max(-SCOPE.LIMIT, Math.min(SCOPE.LIMIT, v));
  s.x = clamp(s.x + AIM[dir].dx);
  s.y = clamp(s.y + AIM[dir].dy);
  s.moves += 1;
  if (s.x === 0 && s.y === 0) {
    state.scopeLocked = true;
    finishMinigame("telescope");
  }
  renderPuzzle();
}

/* Formata a leitura dos parafusos com sinal (+2, 0, -1). */
const signed = (v) => (v > 0 ? "+" + v : String(v));

/* Gera o HTML da ocular, das leituras e da cruz de botões. */
function scopeHtml() {
  const { x, y, moves } = state.scope;
  /* Cada passo desloca o cometa 9% do visor; o céu (180% do visor) anda o mesmo tanto. */
  const cometPos = `left:calc(50% + ${x * SCOPE.STEP}%);top:calc(50% + ${y * SCOPE.STEP}%)`;
  const skyShift = `translate(${(x * SCOPE.STEP) / 1.8}%, ${(y * SCOPE.STEP) / 1.8}%)`;
  const pads = Object.entries(AIM)
    .map(
      ([dir, a]) =>
        `<button type="button" data-aim="${dir}" aria-label="${a.label}" ${state.scopeLocked ? "disabled" : ""}>${{ up: "▲", down: "▼", left: "◄", right: "►" }[dir]}</button>`,
    )
    .join("");
  return `<div class="scope-game ${state.scopeLocked ? "centered" : ""}">
    <div class="scope-view" id="scope-view" tabindex="0" role="img" aria-label="Ocular do telescópio. Cometa ${x === 0 && y === 0 ? "centralizado" : "fora da mira"}. Use as setas do teclado para girar os parafusos.">
      <div class="scope-sky" style="transform:${skyShift}"></div>
      <div class="scope-comet" style="${cometPos}">
        <svg viewBox="0 0 90 20" aria-hidden="true">
          <defs><linearGradient id="tail" x1="0" x2="1"><stop offset="0" stop-color="#9fc7ff" stop-opacity="0"/><stop offset="1" stop-color="#e8f2ff" stop-opacity="0.9"/></linearGradient></defs>
          <path d="M0 10 L78 4 L78 16 Z" fill="url(#tail)"/>
          <circle cx="78" cy="10" r="6" fill="#fff6d8"/>
          <circle cx="78" cy="10" r="9" fill="#fff6d8" opacity="0.25"/>
        </svg>
      </div>
      <span class="scope-ring" aria-hidden="true"></span>
    </div>
    <div class="scope-readout" aria-live="polite">
      <span>PARAFUSO AR: <strong>${signed(x)}</strong></span>
      <span>PARAFUSO DEC: <strong>${signed(-y)}</strong></span>
      <span>GIROS: <strong>${moves}</strong></span>
    </div>
    ${state.scopeLocked ? `<p class="sky-ok">COMETA NA MIRA · POSIÇÃO REGISTRADA</p>` : ""}
    <div class="scope-pad" role="group" aria-label="Parafusos micrométricos do tripé">${pads}<span class="scope-center" aria-hidden="true">✛</span></div>
    ${state.scopeLocked ? "" : `<button type="button" class="erase-btn" id="btn-scope-reset">REAPONTAR TELESCÓPIO</button>`}
  </div>`;
}

/* Liga os eventos da ocular: botões e setas do teclado. */
function bindScope() {
  const view = el("scope-view");
  view.addEventListener("keydown", (e) => {
    const dir = AIM_KEYS[e.key.toLowerCase()];
    if (!dir) return;
    e.preventDefault();
    state.focusSel = "#scope-view";
    aimScope(dir);
  });
  view.addEventListener("click", () => view.focus());
  el("puzzle-dialog")
    .querySelectorAll("[data-aim]")
    .forEach((b) =>
      b.addEventListener("click", () => {
        state.focusSel = `[data-aim="${b.dataset.aim}"]`;
        aimScope(b.dataset.aim);
      }),
    );
  const reset = el("btn-scope-reset");
  if (reset)
    reset.addEventListener("click", () => {
      resetScope();
      state.focusSel = "#scope-view";
      renderPuzzle();
    });
}

/* ===== Mecanismo final · Mostradores I, II, III e IV ===== */

/* Gira um mostrador para o próximo (+1) ou anterior (-1) símbolo. */
function turnDial(i, step) {
  const n = DIAL_SYMBOLS.length;
  const cur = state.dials[i];
  state.dials[i] = cur < 0 ? (step > 0 ? 0 : n - 1) : (cur + step + n) % n;
  state.feedback = null;
}

/* Sequência atualmente formada pelos quatro mostradores. */
const dialSequence = () => state.dials.map((d) => (d < 0 ? "" : DIAL_SYMBOLS[d])).join("");

/* Gera o HTML do console de latão com os quatro mostradores. */
function dialsHtml() {
  const complete = state.dials.every((d) => d >= 0);
  const dials = state.dials
    .map((d, i) => {
      const sym = d < 0 ? "·" : DIAL_SYMBOLS[d];
      const n = DIAL_NUMERALS[i];
      return `<div class="dial">
        <button type="button" class="dial-step" data-dial="${i}" data-step="-1" aria-label="Mostrador ${n}: símbolo anterior">▲</button>
        <button type="button" class="dial-face" data-dial="${i}" data-step="1" aria-label="Mostrador ${n}: ${d < 0 ? "vazio" : "símbolo " + sym}. Clique para girar.">${sym}</button>
        <button type="button" class="dial-step" data-dial="${i}" data-step="1" aria-label="Mostrador ${n}: próximo símbolo">▼</button>
        <span class="dial-label" aria-hidden="true">${n}</span>
      </div>`;
    })
    .join("");
  return `<div class="dial-console">
    <div class="dial-row" role="group" aria-label="Mostradores do console">${dials}</div>
    <div class="safe-controls">
      <button type="button" class="erase-btn" id="btn-erase">ZERAR</button>
      <button type="button" class="pixel-primary" id="btn-unlock" ${complete ? "" : "disabled"}>DESTRAVAR</button>
    </div>
  </div>`;
}

/* ===== Janela dos desafios ===== */

/* Renderiza o conteúdo do modal conforme o estado atual do desafio. */
function renderPuzzle() {
  const p = findPuzzle(state.activeId);
  if (!p) return;
  const ready = solvedCore() === 4;
  const dialog = el("puzzle-dialog");
  let body = "";

  if (p.id === "sphere" && !ready) {
    const left = 4 - solvedCore();
    body = `<div class="locked-message">
      <span class="pixel-lock" aria-hidden="true">▣</span>
      <p>A esfera armilar ainda está travada.</p>
      <small>Resolva os ${left} desafio${left === 1 ? "" : "s"} restante${left === 1 ? "" : "s"}.</small>
    </div>`;
  } else if (state.solved.includes(p.id)) {
    body = `<div class="success-panel">
      <span class="reward-symbol">${p.symbol}</span>
      <div>
        <strong>${p.id === "sphere" ? "ESFERA DESTRAVADA" : "PISTA ENCONTRADA"}</strong>
        <p>${p.id === "sphere" ? "Você concluiu a sala!" : "O símbolo deste desafio é " + p.symbol}</p>
      </div>
    </div>`;
  } else {
    if (p.options) {
      body +=
        `<div class="answer-grid">` +
        p.options
          .map(
            (o) =>
              `<button type="button" data-option="${escapeHtml(o)}">${escapeHtml(o)}</button>`,
          )
          .join("") +
        `</div>`;
    } else if (p.type === "stars") {
      body += starsHtml();
    } else if (p.type === "scope") {
      body += scopeHtml();
    } else if (p.id === "sphere") {
      body += dialsHtml();
    } else {
      body += `<form class="word-form" id="word-form">
        <label for="puzzle-answer">Sua resposta</label>
        <input id="puzzle-answer" autocomplete="off" placeholder="HH:MM" value="${escapeHtml(state.input)}" />
        <button type="submit" class="pixel-primary">CONFIRMAR</button>
      </form>`;
    }
    const wrongText =
      p.type === "stars"
        ? "Essa estrela não segue a ordem. As linhas se apagaram, recomece por β."
        : "Ainda não. Observe a pista e tente outra vez.";
    body += `<div class="feedback-row" aria-live="polite">
      ${state.feedback === "wrong" ? `<p class="wrong-answer">${wrongText}</p>` : ""}
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
      state.focusSel = "#btn-hint";
      renderPuzzle();
    });
  dialog
    .querySelectorAll("[data-option]")
    .forEach((b) =>
      b.addEventListener("click", () => submitAnswer(b.dataset.option)),
    );

  /* Eventos da carta celeste (Desafio 3). */
  dialog
    .querySelectorAll("[data-star]")
    .forEach((b) => b.addEventListener("click", () => linkStar(b.dataset.star)));

  /* Eventos da ocular do telescópio (Desafio 4). */
  if (el("scope-view")) bindScope();

  /* Eventos dos mostradores do mecanismo final. */
  dialog.querySelectorAll("[data-dial]").forEach((b) =>
    b.addEventListener("click", () => {
      turnDial(Number(b.dataset.dial), Number(b.dataset.step));
      state.focusSel = `.${b.className}[data-dial="${b.dataset.dial}"][data-step="${b.dataset.step}"]`;
      renderPuzzle();
    }),
  );
  const erase = el("btn-erase");
  if (erase)
    erase.addEventListener("click", () => {
      state.dials = [-1, -1, -1, -1];
      state.feedback = null;
      state.focusSel = '.dial-face[data-dial="0"]';
      renderPuzzle();
    });
  const unlock = el("btn-unlock");
  if (unlock) unlock.addEventListener("click", () => submitAnswer(dialSequence()));

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
    if (!state.focusSel) field.focus();
  }

  /* Devolve o foco ao controle usado, para o teclado continuar de onde parou. */
  if (state.focusSel) {
    const target = dialog.querySelector(state.focusSel);
    if (target && !target.disabled) target.focus();
  }
}

/* Remove acentos e espaços para aceitar respostas escritas de qualquer forma. */
const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toLocaleUpperCase("pt-BR");

/* Valida a resposta e registra o desafio como resolvido quando correta. */
function submitAnswer(value) {
  const p = findPuzzle(state.activeId);
  if (!p) return;
  const submitted = normalize(String(value !== undefined ? value : state.input));
  const accepted = [p.answer, ...(p.accept || [])].map(normalize);
  if (accepted.includes(submitted)) {
    state.feedback = "correct";
    if (!state.solved.includes(p.id)) state.solved.push(p.id);
    renderProgress();
    if (p.id === "sphere") {
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
  state.round += 1;
  state.solved = [];
  state.activeId = null;
  state.feedback = null;
  state.input = "";
  state.showHint = false;
  state.seconds = 0;
  state.dials = [-1, -1, -1, -1];
  resetStars();
  resetScope();
  stopTimer();
  el("timer").textContent = "00:00";
  renderProgress();
  closePuzzle();
  el("victory-overlay").classList.remove("open");
  el("intro-overlay").classList.add("open");
  el("btn-start").focus();
}

/* Eventos dos botões principais da interface. */
el("btn-start").addEventListener("click", () => {
  el("intro-overlay").classList.remove("open");
  if (!state.running) startTimer();
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
el("btn-start").focus();

/* ===== INTEGRAÇÃO COM A JORNADA COMPLETA =====
   Quando esta sala é aberta dentro da Jornada Completa (página principal, com
   "?jornada" no endereço), o cronômetro global de 30 minutos fica na barra do
   site. Por isso o cronômetro próprio da sala é escondido e, ao destravar o
   mecanismo final, a sala avisa a página principal para liberar a próxima fase.
   Aberta sozinha (fora do site), nada disso acontece. */
const MODO_JORNADA = new URLSearchParams(window.location.search).has("jornada");

/* Avisa a página principal que a Sala 5 foi concluída.
   Aberta do computador (file:), a origem não tem nome, então o aviso usa "*";
   ele só leva o número da sala, nada privado. */
function avisarJornada() {
  if (MODO_JORNADA && window.parent !== window) {
    window.parent.postMessage({ tipo: "escape-room:sala-concluida", sala: 5 }, window.location.protocol === "file:" ? "*" : window.location.origin);
  }
}

/* Esconde o cronômetro próprio da sala durante a jornada. */
if (MODO_JORNADA) {
  const relogio = document.getElementById("timer");
  if (relogio) relogio.parentElement.style.display = "none";
}
