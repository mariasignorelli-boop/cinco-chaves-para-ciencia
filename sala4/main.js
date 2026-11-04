/* Banco de dados */
const PUZZLES = [
  {
    id: "plotter",
    label: "Painel de trajetórias da Terra",
    eyebrow: "DESAFIO 01 · ÓRBITA",
    title: "Quanto dura a missão?",
    description:
      "No painel iluminado, Katherine anotou que cada volta da cápsula Mercury ao redor da Terra dura 88,5 minutos. Quanto tempo a cápsula leva para completar 4 órbitas?",
    hint: "Multiplique 88,5 por 4 e depois transforme os minutos em horas: cada 60 minutos formam 1 hora.",
    symbol: "◉",
    options: ["3h 32min", "4h 25min", "5h 54min", "6h 14min"],
    answer: "5h 54min",
    hotspot: "hotspot-plotter",
  },
  {
    id: "mainframe",
    label: "Mainframe IBM 7090",
    eyebrow: "DESAFIO 02 · PAINEL DE CHAVES",
    title: "Religue o mainframe",
    description:
      "O mainframe IBM travou no meio do cálculo. No painel, cada chave alterna a própria luz e as luzes vizinhas (acima, abaixo, à esquerda e à direita). Deixe todas as 9 luzes verdes acesas.",
    hint: "A ordem dos toques não importa, e tocar duas vezes na mesma chave desfaz o movimento. Bastam 3 toques, e um deles é a chave do centro.",
    symbol: "☾",
    type: "lights",
    answer: "PAINEL ESTAVEL",
    hotspot: "hotspot-mainframe",
  },
  {
    id: "teletype",
    label: "Mesa com caderno e máquina de escrever",
    eyebrow: "DESAFIO 03 · CÓDIGO BINÁRIO",
    title: "A mensagem do teletipo",
    description:
      "O teletipo imprimiu cinco números em binário: 00111 · 01100 · 00101 · 01110 · 01110. No pé da fita está escrito: “Converta para decimal e use A = 1.” Qual nome aparece na mensagem?",
    hint: "Em binário, as posições valem, da direita para a esquerda, 1, 2, 4, 8 e 16. Some as posições que têm 1 e troque o número pela letra do alfabeto (A = 1, B = 2...).",
    symbol: "▲",
    answer: "GLENN",
    hotspot: "hotspot-teletype",
  },
  {
    id: "crt",
    label: "Terminal CRT móvel",
    eyebrow: "DESAFIO 04 · TRAJETÓRIA",
    title: "Atravesse a chuva de meteoritos",
    description:
      "O radar do terminal mostra a rota da cápsula cruzando uma chuva de meteoritos. Pilote a nave e desvie de 20 meteoritos para provar que a trajetória calculada é segura.",
    hint: "Use as setas ← → (ou A e D), arraste o dedo sobre o radar ou segure os botões abaixo dele. Fique perto do centro para ter espaço de fuga para os dois lados.",
    symbol: "✦",
    type: "flight",
    answer: "ROTA SEGURA",
    hotspot: "hotspot-crt",
  },
  {
    id: "safe",
    label: "Porta blindada",
    eyebrow: "MECANISMO FINAL",
    title: "A porta blindada",
    description:
      "O teclado da porta blindada tem quatro símbolos. Insira-os na ordem em que os desafios foram numerados.",
    hint: "Cada desafio resolvido te deu um símbolo. A ordem é a mesma em que os desafios foram numerados.",
    symbol: "★",
    answer: "◉☾▲✦",
    hotspot: "hotspot-safe",
  },
];

/* Símbolos no teclado da porta blindada. */
const SAFE_SYMBOLS = ["✦", "◉", "▲", "☾"];

/* Painel de chaves (Desafio 2): grade 3x3 e chaves usadas para embaralhar. */
const LIGHTS_SIZE = 3;
const LIGHTS_SCRAMBLE = [1, 4, 6];

/* Configuração do minigame (Desafio 4): tamanho do radar, meta e escudos. */
const FLIGHT = { W: 320, H: 360, GOAL: 20, SHIELDS: 3, SHIP_Y: 322, SPEED: 230 };

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
  lights: [],
  moves: 0,
  lightsLocked: false,
  focusIndex: null,
};

/* Estado do minigame: posição da nave, meteoritos, escudos e controles. */
const flight = {
  status: "idle",
  x: FLIGHT.W / 2,
  dodged: 0,
  shields: FLIGHT.SHIELDS,
  meteors: [],
  stars: [],
  spawnTimer: 0,
  left: false,
  right: false,
  pointerX: null,
  hitFlash: 0,
  lastTime: 0,
  frameId: null,
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

/* Sorteia um número entre min e max. */
const rand = (min, max) => min + Math.random() * (max - min);

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
  state.focusIndex = null;
  /* A janela abre antes de renderizar para que o foco do teclado funcione. */
  el("puzzle-overlay").classList.add("open");
  renderPuzzle();
}

/* Fecha a janela do desafio. */
function closePuzzle() {
  if (flight.status === "running" || flight.status === "crashed") stopFlight();
  state.activeId = null;
  el("puzzle-overlay").classList.remove("open");
}

/* Atualiza o contador de progresso. */
function renderProgress() {
  el("progress").textContent = solvedCore() + "/4";
}

/* ===== Desafio 2 · Painel de chaves (Lights Out) ===== */

/* Lista a chave escolhida e suas vizinhas (acima, abaixo, esquerda e direita). */
function lightNeighbors(i) {
  const r = Math.floor(i / LIGHTS_SIZE);
  const c = i % LIGHTS_SIZE;
  const list = [i];
  if (r > 0) list.push(i - LIGHTS_SIZE);
  if (r < LIGHTS_SIZE - 1) list.push(i + LIGHTS_SIZE);
  if (c > 0) list.push(i - 1);
  if (c < LIGHTS_SIZE - 1) list.push(i + 1);
  return list;
}

/* Monta o painel inicial: parte de tudo aceso e aplica os toques de embaralhamento. */
function scrambledLights() {
  const lights = Array(LIGHTS_SIZE * LIGHTS_SIZE).fill(true);
  LIGHTS_SCRAMBLE.forEach((i) => lightNeighbors(i).forEach((n) => (lights[n] = !lights[n])));
  return lights;
}

/* Restaura o painel ao estado inicial. */
function resetLights() {
  state.lights = scrambledLights();
  state.moves = 0;
  state.lightsLocked = false;
}

/* Alterna uma chave e verifica se todas as luzes ficaram acesas. */
function toggleLight(i) {
  if (state.lightsLocked) return;
  lightNeighbors(i).forEach((n) => (state.lights[n] = !state.lights[n]));
  state.moves += 1;
  state.focusIndex = i;
  if (state.lights.every(Boolean)) {
    state.lightsLocked = true;
    const round = state.round;
    /* Pequena pausa para o jogador ver o painel todo verde antes da recompensa. */
    setTimeout(() => {
      if (round !== state.round) return;
      if (state.activeId === "mainframe") submitAnswer(PUZZLES[1].answer);
      else if (!state.solved.includes("mainframe")) {
        state.solved.push("mainframe");
        renderProgress();
      }
    }, 700);
  }
  renderPuzzle();
}

/* Gera o HTML do painel de chaves. */
function lightsHtml() {
  const lit = state.lights.filter(Boolean).length;
  const total = state.lights.length;
  const switches = state.lights
    .map((on, i) => {
      const r = Math.floor(i / LIGHTS_SIZE) + 1;
      const c = (i % LIGHTS_SIZE) + 1;
      return `<button type="button" class="light-switch ${on ? "on" : "off"}" data-light="${i}" aria-pressed="${on}" aria-label="Chave da linha ${r}, coluna ${c}: luz ${on ? "acesa" : "apagada"}" ${state.lightsLocked ? "disabled" : ""}>
        <span class="lamp" aria-hidden="true"></span><span class="lever" aria-hidden="true"></span>
      </button>`;
    })
    .join("");
  return `<div class="lights-panel">
    <div class="lights-grid" role="group" aria-label="Painel de chaves 3 por 3. Use as setas para navegar e Enter ou Espaço para alternar.">${switches}</div>
    <div class="lights-info" aria-live="polite">
      <span>MOVIMENTOS: <strong>${state.moves}</strong></span>
      <span>LUZES ACESAS: <strong>${lit}/${total}</strong></span>
    </div>
    ${state.lightsLocked ? `<p class="lights-ok">SISTEMA ESTÁVEL · CÁLCULO RETOMADO</p>` : `<button type="button" class="erase-btn" id="btn-lights-reset">REINICIAR PAINEL</button>`}
  </div>`;
}

/* Permite navegar entre as chaves usando as setas do teclado. */
function onLightsKeydown(e) {
  const i = Number(e.currentTarget.dataset.light);
  const r = Math.floor(i / LIGHTS_SIZE);
  const c = i % LIGHTS_SIZE;
  let next = null;
  if (e.key === "ArrowUp" && r > 0) next = i - LIGHTS_SIZE;
  if (e.key === "ArrowDown" && r < LIGHTS_SIZE - 1) next = i + LIGHTS_SIZE;
  if (e.key === "ArrowLeft" && c > 0) next = i - 1;
  if (e.key === "ArrowRight" && c < LIGHTS_SIZE - 1) next = i + 1;
  if (e.key.startsWith("Arrow")) e.preventDefault();
  if (next === null) return;
  state.focusIndex = next;
  const target = el("puzzle-dialog").querySelector(`[data-light="${next}"]`);
  if (target) target.focus();
}

/* ===== Desafio 4 · Minigame dos meteoritos ===== */

/* Cria o campo de estrelas do fundo do radar. */
function createStars() {
  flight.stars = Array.from({ length: 40 }, () => ({
    x: rand(0, FLIGHT.W),
    y: rand(0, FLIGHT.H),
    s: rand(0.6, 1.8),
    v: rand(18, 50),
  }));
}

/* Cria um meteorito com contorno irregular, tamanho e velocidade sorteados. */
function spawnMeteor() {
  const r = rand(10, 18);
  const points = Array.from({ length: 8 }, (_, k) => ({
    a: (k / 8) * Math.PI * 2,
    d: r * rand(0.75, 1.1),
  }));
  flight.meteors.push({
    x: rand(r, FLIGHT.W - r),
    y: -r,
    r,
    vy: 120 + flight.dodged * 6 + rand(0, 50),
    vx: rand(-25, 25),
    rot: rand(0, Math.PI * 2),
    spin: rand(-2, 2),
    points,
  });
}

/* Começa (ou recomeça) o voo com escudos cheios e contador zerado. */
function startFlight() {
  flight.status = "running";
  flight.x = FLIGHT.W / 2;
  flight.dodged = 0;
  flight.shields = FLIGHT.SHIELDS;
  flight.meteors = [];
  flight.spawnTimer = 0.4;
  flight.hitFlash = 0;
  flight.lastTime = 0;
  flight.left = false;
  flight.right = false;
  flight.pointerX = null;
  if (!flight.stars.length) createStars();
  updateFlightUi("Voo iniciado. Desvie dos meteoritos!");
  const canvas = el("flight-canvas");
  if (canvas) canvas.focus();
  if (flight.frameId) cancelAnimationFrame(flight.frameId);
  flight.frameId = requestAnimationFrame(flightLoop);
}

/* Interrompe o voo e volta o minigame ao estado inicial. */
function stopFlight() {
  if (flight.frameId) cancelAnimationFrame(flight.frameId);
  flight.frameId = null;
  flight.status = "idle";
  flight.left = false;
  flight.right = false;
  flight.pointerX = null;
}

/* Laço de animação: calcula o tempo entre quadros, atualiza e desenha. */
function flightLoop(time) {
  const canvas = el("flight-canvas");
  if (!canvas || flight.status !== "running") {
    flight.frameId = null;
    return;
  }
  const dt = flight.lastTime ? Math.min((time - flight.lastTime) / 1000, 0.05) : 0;
  flight.lastTime = time;
  updateFlight(dt);
  drawFlight();
  if (flight.status === "running") flight.frameId = requestAnimationFrame(flightLoop);
  else flight.frameId = null;
}

/* Move a nave, cria e move meteoritos, detecta colisões e conta os desvios. */
function updateFlight(dt) {
  /* Movimento da nave pelo teclado/botões ou seguindo o dedo/mouse. */
  let dir = (flight.right ? 1 : 0) - (flight.left ? 1 : 0);
  if (flight.pointerX !== null && dir === 0) {
    const diff = flight.pointerX - flight.x;
    if (Math.abs(diff) > 3) dir = Math.sign(diff) * Math.min(1, Math.abs(diff) / 24);
  }
  flight.x = Math.max(16, Math.min(FLIGHT.W - 16, flight.x + dir * FLIGHT.SPEED * dt));

  /* Estrelas descem devagar para dar sensação de movimento. */
  flight.stars.forEach((s) => {
    s.y += s.v * dt;
    if (s.y > FLIGHT.H) {
      s.y = 0;
      s.x = rand(0, FLIGHT.W);
    }
  });

  /* Novos meteoritos só aparecem até completar a meta de 20. */
  flight.spawnTimer -= dt;
  if (flight.spawnTimer <= 0 && flight.dodged + flight.meteors.length < FLIGHT.GOAL) {
    spawnMeteor();
    flight.spawnTimer = Math.max(0.4, 0.9 - flight.dodged * 0.025);
  }

  if (flight.hitFlash > 0) flight.hitFlash -= dt;

  /* Atualiza cada meteorito e verifica colisão com a nave. */
  for (let i = flight.meteors.length - 1; i >= 0; i--) {
    const m = flight.meteors[i];
    m.y += m.vy * dt;
    m.x += m.vx * dt;
    m.rot += m.spin * dt;
    if (m.x < m.r || m.x > FLIGHT.W - m.r) m.vx *= -1;

    const dx = m.x - flight.x;
    const dy = m.y - FLIGHT.SHIP_Y;
    if (Math.hypot(dx, dy) < m.r * 0.85 + 11) {
      flight.meteors.splice(i, 1);
      flight.shields -= 1;
      flight.hitFlash = 0.3;
      if (flight.shields <= 0) {
        flight.status = "crashed";
        updateFlightUi("A nave foi atingida 3 vezes. Recalcule a rota e tente de novo!");
        return;
      }
      updateFlightUi("Impacto! O escudo absorveu o choque.");
      continue;
    }
    if (m.y - m.r > FLIGHT.H) {
      flight.meteors.splice(i, 1);
      flight.dodged += 1;
      updateFlightUi();
    }
  }

  /* Meta atingida: a trajetória está confirmada. */
  if (flight.dodged >= FLIGHT.GOAL) {
    flight.status = "done";
    updateFlightUi("20 meteoritos desviados. Trajetória segura!");
    const round = state.round;
    setTimeout(() => {
      if (round !== state.round) return;
      if (state.activeId === "crt") submitAnswer(PUZZLES[3].answer);
      else if (!state.solved.includes("crt")) {
        state.solved.push("crt");
        renderProgress();
      }
    }, 700);
  }
}

/* Desenha o radar, as estrelas, os meteoritos e a nave no canvas. */
function drawFlight() {
  const canvas = el("flight-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const { W, H, SHIP_Y } = FLIGHT;

  /* Cores do canvas em hexadecimal para manter compatibilidade entre navegadores. */
  ctx.fillStyle = "#031410";
  ctx.fillRect(0, 0, W, H);

  /* Anéis e eixos do radar, como no terminal CRT da sala. */
  ctx.strokeStyle = "rgba(70, 230, 140, 0.16)";
  ctx.lineWidth = 1;
  [60, 120, 180].forEach((r) => {
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.moveTo(W / 2, 0);
  ctx.lineTo(W / 2, H);
  ctx.moveTo(0, H / 2);
  ctx.lineTo(W, H / 2);
  ctx.stroke();

  /* Estrelas. */
  ctx.fillStyle = "rgba(180, 255, 210, 0.7)";
  flight.stars.forEach((s) => ctx.fillRect(s.x, s.y, s.s, s.s));

  /* Meteoritos com contorno irregular. */
  flight.meteors.forEach((m) => {
    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.rotate(m.rot);
    ctx.beginPath();
    m.points.forEach((p, k) => {
      const px = Math.cos(p.a) * p.d;
      const py = Math.sin(p.a) * p.d;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = "#8a6a3c";
    ctx.fill();
    ctx.strokeStyle = "#f2b84b";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  });

  /* Nave: chama do motor e corpo triangular. */
  const x = flight.x;
  if (flight.status === "running") {
    ctx.fillStyle = Math.random() > 0.5 ? "#f2b84b" : "#ff7a3d";
    ctx.beginPath();
    ctx.moveTo(x - 5, SHIP_Y + 12);
    ctx.lineTo(x, SHIP_Y + 20 + Math.random() * 6);
    ctx.lineTo(x + 5, SHIP_Y + 12);
    ctx.fill();
  }
  ctx.fillStyle = "#5dff9c";
  ctx.beginPath();
  ctx.moveTo(x, SHIP_Y - 16);
  ctx.lineTo(x + 12, SHIP_Y + 12);
  ctx.lineTo(x, SHIP_Y + 6);
  ctx.lineTo(x - 12, SHIP_Y + 12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#031410";
  ctx.fillRect(x - 2, SHIP_Y - 4, 4, 5);

  /* Clarão vermelho quando a nave é atingida. */
  if (flight.hitFlash > 0) {
    ctx.fillStyle = `rgba(255, 60, 60, ${flight.hitFlash})`;
    ctx.fillRect(0, 0, W, H);
  }

  /* Linhas horizontais do monitor antigo. */
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
}

/* Atualiza o placar, os escudos, a mensagem e o botão de iniciar. */
function updateFlightUi(message) {
  const count = el("flight-count");
  if (!count) return;
  count.textContent = flight.dodged + "/" + FLIGHT.GOAL;
  const shields = Math.max(0, Math.min(FLIGHT.SHIELDS, flight.shields));
  el("flight-shields").textContent = "▮".repeat(shields) + "▯".repeat(FLIGHT.SHIELDS - shields);
  if (message !== undefined) el("flight-status").textContent = message;
  const btn = el("btn-flight");
  btn.hidden = flight.status === "running" || flight.status === "done";
  btn.textContent = flight.status === "crashed" ? "TENTAR DE NOVO" : "INICIAR VOO";
}

/* Gera o HTML do minigame (radar, placar e controles de toque). */
function flightHtml() {
  return `<div class="flight-game">
    <div class="flight-hud">
      <span>DESVIADOS <strong id="flight-count">0/${FLIGHT.GOAL}</strong></span>
      <span>ESCUDOS <strong id="flight-shields">▮▮▮</strong></span>
    </div>
    <div class="flight-screen">
      <canvas id="flight-canvas" width="${FLIGHT.W}" height="${FLIGHT.H}" tabindex="0" aria-label="Radar do terminal. Use as setas esquerda e direita, ou A e D, para pilotar a nave."></canvas>
      <button type="button" class="pixel-primary flight-start" id="btn-flight">INICIAR VOO</button>
    </div>
    <p class="flight-status" id="flight-status" aria-live="polite">Teclado: ← → ou A D · Toque: arraste no radar ou segure os botões.</p>
    <div class="flight-controls">
      <button type="button" data-steer="left" aria-label="Mover a nave para a esquerda">◀</button>
      <button type="button" data-steer="right" aria-label="Mover a nave para a direita">▶</button>
    </div>
  </div>`;
}

/* Liga os eventos de toque, mouse e botões do minigame. */
function bindFlightControls() {
  const canvas = el("flight-canvas");
  const toLocalX = (e) => {
    const rect = canvas.getBoundingClientRect();
    return ((e.clientX - rect.left) / rect.width) * FLIGHT.W;
  };
  canvas.addEventListener("pointerdown", (e) => {
    canvas.setPointerCapture(e.pointerId);
    flight.pointerX = toLocalX(e);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (flight.pointerX !== null) flight.pointerX = toLocalX(e);
  });
  ["pointerup", "pointercancel"].forEach((type) =>
    canvas.addEventListener(type, () => (flight.pointerX = null)),
  );

  /* Botões ◀ ▶: a nave se move enquanto o botão estiver pressionado. */
  el("puzzle-dialog")
    .querySelectorAll("[data-steer]")
    .forEach((b) => {
      const dir = b.dataset.steer;
      const press = (e) => {
        e.preventDefault();
        flight[dir] = true;
      };
      const release = () => (flight[dir] = false);
      b.addEventListener("pointerdown", press);
      ["pointerup", "pointerleave", "pointercancel"].forEach((type) =>
        b.addEventListener(type, release),
      );
      b.addEventListener("contextmenu", (e) => e.preventDefault());
    });

  el("btn-flight").addEventListener("click", startFlight);
  updateFlightUi();
  drawFlight();
  if (flight.status !== "running") el("btn-flight").focus();
}

/* ===== Janela dos desafios ===== */

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
        <strong>${p.id === "safe" ? "PORTA ABERTA" : "PISTA ENCONTRADA"}</strong>
        <p>${p.id === "safe" ? "Você concluiu a sala!" : "O símbolo deste desafio é " + p.symbol}</p>
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
    } else if (p.type === "lights") {
      body += lightsHtml();
    } else if (p.type === "flight") {
      body += flightHtml();
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

  /* Eventos do painel de chaves (Desafio 2). */
  dialog.querySelectorAll("[data-light]").forEach((b) => {
    b.addEventListener("click", () => toggleLight(Number(b.dataset.light)));
    b.addEventListener("keydown", onLightsKeydown);
  });
  const lightsReset = el("btn-lights-reset");
  if (lightsReset)
    lightsReset.addEventListener("click", () => {
      resetLights();
      state.focusIndex = 0;
      renderPuzzle();
    });
  if (state.focusIndex !== null) {
    const focused = dialog.querySelector(`[data-light="${state.focusIndex}"]`);
    if (focused && !focused.disabled) focused.focus();
  }

  /* Eventos do minigame (Desafio 4). */
  if (el("flight-canvas")) bindFlightControls();

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
  state.round += 1;
  state.solved = [];
  state.activeId = null;
  state.feedback = null;
  state.input = "";
  state.showHint = false;
  state.seconds = 0;
  resetLights();
  stopFlight();
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

/* Controles de teclado do minigame: setas ou A/D movem a nave. */
const STEER_KEYS = { arrowleft: "left", a: "left", arrowright: "right", d: "right" };
document.addEventListener("keydown", (e) => {
  if (state.activeId !== "crt" || flight.status !== "running") return;
  const dir = STEER_KEYS[e.key.toLowerCase()];
  if (!dir) return;
  e.preventDefault();
  flight[dir] = true;
});
document.addEventListener("keyup", (e) => {
  const dir = STEER_KEYS[e.key.toLowerCase()];
  if (dir) flight[dir] = false;
});

/* Inicialização da aplicação. */
buildHotspots();
resetLights();
renderProgress();
el("intro-overlay").classList.add("open");

/* ===== INTEGRAÇÃO COM A JORNADA COMPLETA =====
   Quando esta sala é aberta dentro da Jornada Completa (página principal, com
   "?jornada" no endereço), o cronômetro global de 30 minutos fica na barra do
   site. Por isso o cronômetro próprio da sala é escondido e, ao destravar o
   mecanismo final, a sala avisa a página principal para liberar a próxima fase.
   Aberta sozinha (fora do site), nada disso acontece. */
const MODO_JORNADA = new URLSearchParams(window.location.search).has("jornada");

/* Avisa a página principal que a Sala 4 foi concluída.
   Aberta do computador (file:), a origem não tem nome, então o aviso usa "*";
   ele só leva o número da sala, nada privado. */
function avisarJornada() {
  if (MODO_JORNADA && window.parent !== window) {
    window.parent.postMessage({ tipo: "escape-room:sala-concluida", sala: 4 }, window.location.protocol === "file:" ? "*" : window.location.origin);
  }
}

/* Esconde o cronômetro próprio da sala durante a jornada. */
if (MODO_JORNADA) {
  const relogio = document.getElementById("timer");
  if (relogio) relogio.parentElement.style.display = "none";
}
