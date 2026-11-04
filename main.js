/* =====================================================================
   ESCAPE ROOM — MULHERES DA CIÊNCIA · PÁGINA PRINCIPAL DO PACOTE
   Este arquivo desenha as três páginas do pacote para download:
     #/            → página inicial com as cinco salas
     #/sala1 ...   → cada sala dentro da moldura da Jornada Completa
     #/memorial    → Memorial das Pioneiras ("Museu Delas")
   As salas continuam independentes, cada uma em sua pasta (salaN/).
   Aqui fica apenas a Jornada: o cronômetro único de 30 minutos, as
   chaves e as janelas de transição, derrota e vitória.
   ===================================================================== */

/* Banco de dados: as cinco salas */
const SALAS = [
  {
    numero: 1,
    fase: "FASE 01",
    titulo: "O escritório de Emmy Noether",
    lugar: "Göttingen, 1925",
    cientista: "Emmy Noether",
    chave: { simbolo: "◆", nome: "Chave da Simetria" },
    tituloPagina: "O Escritório de Emmy Noether — Escape Room · Sala 1",
  },
  {
    numero: 2,
    fase: "FASE 02",
    titulo: "O gabinete de Ada Lovelace",
    lugar: "Londres, 1843",
    cientista: "Ada Lovelace",
    chave: { simbolo: "⚙", nome: "Chave do Algoritmo" },
    tituloPagina: "O Gabinete de Ada Lovelace — Escape Room · Sala 2",
  },
  {
    numero: 3,
    fase: "FASE 03",
    titulo: "O laboratório de Marie Curie",
    lugar: "Paris, 1902",
    cientista: "Marie Curie",
    chave: { simbolo: "☢", nome: "Chave da Radioatividade" },
    tituloPagina: "O Laboratório de Marie Curie — Escape Room · Sala 3",
  },
  {
    numero: 4,
    fase: "FASE 04",
    titulo: "A sala de cálculos de Katherine Johnson",
    lugar: "NASA Langley, 1962",
    cientista: "Katherine Johnson",
    chave: { simbolo: "◉", nome: "Chave da Órbita" },
    tituloPagina: "A Sala de Cálculos de Katherine Johnson — Escape Room · Sala 4",
  },
  {
    numero: 5,
    fase: "FASE 05",
    titulo: "O observatório de Caroline Herschel",
    lugar: "Slough / Bath, Inglaterra, 1788",
    cientista: "Caroline Herschel",
    chave: { simbolo: "☄", nome: "Chave dos Cometas" },
    tituloPagina: "O Observatório de Caroline Herschel — Escape Room · Sala 5",
  },
];

/* Banco de dados: as cinco pioneiras homenageadas no Memorial */
const PIONEIRAS = [
  {
    sala: 1,
    nome: "Emmy Noether",
    anos: "1882–1935",
    area: "Álgebra abstrata · Teorema de Noether · Simetrias da física",
    retrato: "retratos/noether.jpg",
    bio: "Nascida em Erlangen, na Alemanha, Emmy Noether estudou numa época em que mulheres só podiam assistir às aulas como ouvintes. Convidada por David Hilbert e Felix Klein para Göttingen, lecionou anos sem salário, muitas vezes sob o nome de Hilbert. Ali criou as bases da álgebra abstrata moderna.",
    marcos: [
      { ano: "1907", texto: "Doutorado em matemática pela Universidade de Erlangen." },
      { ano: "1915", texto: "Chega a Göttingen para ajudar Hilbert e Klein com a relatividade geral." },
      { ano: "1918", texto: "Publica o Teorema de Noether: cada simetria da natureza corresponde a uma lei de conservação." },
      { ano: "1921", texto: "Lança a teoria dos ideais em anéis; os “anéis noetherianos” levam seu nome." },
      { ano: "1932", texto: "Palestra plenária no Congresso Internacional de Matemáticos, em Zurique." },
      { ano: "1933", texto: "Afastada pelo regime nazista, emigra para o Bryn Mawr College, nos EUA." },
    ],
    citacao: "“Meus métodos são, na verdade, maneiras de trabalhar e de pensar; por isso se infiltraram anonimamente por toda parte.”",
    legado: "Einstein a chamou de o gênio matemático criativo mais significativo desde que as mulheres passaram a ter acesso ao ensino superior. Seu teorema é usado em toda a física moderna, da mecânica clássica às partículas elementares.",
  },
  {
    sala: 2,
    nome: "Ada Lovelace",
    anos: "1815–1852",
    area: "Primeira programadora · Algoritmo da Máquina Analítica",
    retrato: "retratos/lovelace.jpg",
    bio: "Filha do poeta Lord Byron, Augusta Ada King, condessa de Lovelace, foi educada em matemática desde criança. Aos 17 anos conheceu Charles Babbage e sua máquina de calcular, iniciando uma parceria que mudaria a história da computação.",
    marcos: [
      { ano: "1833", texto: "Conhece Charles Babbage e a Máquina Diferencial." },
      { ano: "1842", texto: "Traduz o artigo de Luigi Menabrea sobre a Máquina Analítica." },
      { ano: "1843", texto: "Acrescenta as Notas A a G; a Nota G traz um algoritmo para calcular números de Bernoulli." },
      { ano: "1843", texto: "Prevê que máquinas poderiam manipular símbolos e até compor música." },
      { ano: "1980", texto: "O Departamento de Defesa dos EUA batiza a linguagem de programação Ada em sua homenagem." },
    ],
    citacao: "“A Máquina Analítica tece padrões algébricos, assim como o tear de Jacquard tece flores e folhas.”",
    legado: "Considerada a primeira pessoa a publicar um programa de computador, Ada enxergou um século antes que computadores iriam além dos números. O Ada Lovelace Day celebra mulheres na ciência todo mês de outubro.",
  },
  {
    sala: 3,
    nome: "Marie Curie",
    anos: "1867–1934",
    area: "Radioatividade · Polônio e Rádio · Dois prêmios Nobel",
    retrato: "retratos/curie.jpg",
    bio: "Maria Skłodowska nasceu em Varsóvia, na Polônia, e mudou-se para Paris para estudar na Sorbonne. Com Pierre Curie, investigou a misteriosa radiação do urânio e cunhou o termo “radioatividade”.",
    marcos: [
      { ano: "1891", texto: "Muda-se para Paris e estuda física e matemática na Sorbonne." },
      { ano: "1898", texto: "Descobre, com Pierre Curie, os elementos polônio e rádio." },
      { ano: "1903", texto: "Primeira mulher a receber um Nobel (Física, com Pierre Curie e Henri Becquerel)." },
      { ano: "1906", texto: "Primeira mulher professora da Sorbonne." },
      { ano: "1911", texto: "Nobel de Química: única pessoa premiada em duas ciências diferentes." },
      { ano: "1914", texto: "Cria unidades móveis de raio X, as “pequenas Curies”, para a Primeira Guerra." },
    ],
    citacao: "“Na vida, nada deve ser temido, apenas compreendido. Agora é hora de compreender mais, para temermos menos.”",
    legado: "Seu trabalho abriu caminho para a física nuclear e para a radioterapia contra o câncer. O Instituto Curie, em Paris, segue pesquisando e tratando pacientes até hoje.",
  },
  {
    sala: 4,
    nome: "Katherine Johnson",
    anos: "1918–2020",
    area: "Trajetórias espaciais da NASA · Mercury e Apollo 11",
    retrato: "retratos/johnson.jpg",
    bio: "Nascida em White Sulphur Springs, na Virgínia Ocidental, Katherine se formou na faculdade aos 18 anos. Em 1953 entrou para o grupo de “computadoras humanas” do centro Langley, onde mulheres negras trabalhavam segregadas, e conquistou espaço com cálculos impecáveis.",
    marcos: [
      { ano: "1953", texto: "Entra no grupo de computação da NACA (futura NASA) em Langley." },
      { ano: "1961", texto: "Calcula a trajetória do voo de Alan Shepard, primeiro americano no espaço." },
      { ano: "1962", texto: "John Glenn pede que “a moça” confira à mão os números do computador antes de orbitar a Terra." },
      { ano: "1969", texto: "Seus cálculos ajudam a sincronizar o módulo lunar da Apollo 11 com o módulo de comando." },
      { ano: "2015", texto: "Recebe a Medalha Presidencial da Liberdade." },
      { ano: "2016", texto: "Sua história chega ao cinema em “Estrelas Além do Tempo”." },
    ],
    citacao: "“Goste do que você faz, e então fará o seu melhor.”",
    legado: "Katherine trabalhou 33 anos na NASA e foi coautora de 26 relatórios científicos. Um prédio de pesquisa em Langley leva seu nome, e ela inspira gerações de mulheres negras na ciência.",
  },
  {
    sala: 5,
    nome: "Caroline Herschel",
    anos: "1750–1848",
    area: "Descoberta de 8 cometas · Catalogação astronômica",
    retrato: "retratos/herschel.jpg",
    bio: "Nascida em Hanôver, Caroline foi tratada pela família como empregada doméstica. Em 1772 mudou-se para Bath, na Inglaterra, para viver com o irmão William; começou como cantora e assistente e tornou-se uma das astrônomas mais respeitadas da Europa.",
    marcos: [
      { ano: "1783", texto: "Descobre suas primeiras nebulosas com um pequeno telescópio próprio." },
      { ano: "1786", texto: "Primeira mulher a descobrir um cometa." },
      { ano: "1787", texto: "Recebe salário do rei George III: primeira mulher paga para trabalhar como cientista." },
      { ano: "1797", texto: "Completa a descoberta de oito cometas." },
      { ano: "1798", texto: "Publica correções ao catálogo de Flamsteed, acrescentando 561 estrelas." },
      { ano: "1828", texto: "Recebe a Medalha de Ouro da Royal Astronomical Society pelo catálogo de nebulosas." },
    ],
    citacao: "“Aqui na Terra, o olhar da glorificada voltava-se para o céu estrelado.” — epitáfio que escreveu para si",
    legado: "Em 1835 tornou-se, com Mary Somerville, uma das primeiras mulheres membros honorárias da Royal Astronomical Society. O cometa 35P/Herschel–Rigollet e uma cratera na Lua levam seu nome.",
  },
];

/* Regras da Jornada Completa */
const TOTAL_SALAS = 5;
/* Duração total da jornada: 30 minutos. */
const DURACAO_MS = 30 * 60 * 1000;
/* Alerta visual nos últimos 5 minutos. */
const ALERTA_MS = 5 * 60 * 1000;
/* Nome usado para guardar a jornada no navegador (o mesmo do site). */
const CHAVE_ARMAZENAMENTO = "escape-room:jornada";

/* Estado da tela: página aberta, sala exibida e janelas fechadas pelo jogador. */
const tela = {
  pagina: null,
  sala: null,
  chaveIframe: null,
  janela: null,
  vitoriaFechada: false,
};

/* Guarda o intervalo do relógio para poder interrompê-lo. */
let relogioId = null;

/* Observador que mostra o botão de retorno ao índice no Memorial. */
let observadorIndice = null;

/* Atalho para localizar elementos HTML pelo id. */
const el = (id) => document.getElementById(id);

/* Escapa caracteres especiais antes de inserir textos no HTML. */
const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

/* Devolve os dados de uma sala pelo número (1 a 5). */
const salaPorNumero = (n) => SALAS[Math.min(Math.max(n, 1), SALAS.length) - 1];

/* Endereço interno de cada sala e arquivo do jogo dentro do pacote. */
const rotaDaSala = (n) => "#/sala" + n;
const arquivoDaSala = (n) => "sala" + n + "/index.html";
const cenarioDaSala = (n) => "sala" + n + "/cenario.png";

/* Converte milissegundos em MM:SS, arredondando para cima (00:01 até o último instante). */
function formatarTempo(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return String(Math.floor(total / 60)).padStart(2, "0") + ":" + String(total % 60).padStart(2, "0");
}

/* Cria uma jornada nova: Sala 1, nenhuma chave e 30 minutos a partir de agora. */
function novaJornada(agora) {
  return {
    id: agora + "-" + Math.random().toString(36).slice(2, 7),
    prazo: agora + DURACAO_MS,
    salaAtual: 1,
    chaves: [],
    aguardando: null,
    status: "jogando",
    restanteFinal: null,
  };
}

/* Tempo que falta no cronômetro (na vitória, fica congelado no tempo final). */
function tempoRestante(j, agora) {
  if (j.status === "vitoria") return j.restanteFinal || 0;
  return Math.max(0, j.prazo - agora);
}

/* Indica se o cronômetro entrou nos últimos 5 minutos. */
const emAlerta = (ms) => ms > 0 && ms <= ALERTA_MS;

/* Marca derrota quando o cronômetro zerou durante a partida. */
function verificarTempo(j, agora) {
  if (j.status === "jogando" && agora >= j.prazo) return Object.assign({}, j, { status: "derrota", aguardando: null });
  return j;
}

/* Registra a conclusão do mecanismo final da sala atual. Outras salas não contam. */
function concluirSala(j, sala, agora) {
  const atual = verificarTempo(j, agora);
  if (atual.status !== "jogando" || sala !== atual.salaAtual || atual.chaves.includes(sala)) return atual;
  const chaves = atual.chaves.concat(sala);
  if (sala === TOTAL_SALAS) {
    return Object.assign({}, atual, { chaves, aguardando: null, status: "vitoria", restanteFinal: atual.prazo - agora });
  }
  return Object.assign({}, atual, { chaves, salaAtual: sala + 1, aguardando: sala });
}

/* Armazenamento no navegador */

/* Lê a jornada salva, descartando dados corrompidos ou de outra versão. */
function lerJornada() {
  let texto = null;
  try {
    texto = window.localStorage.getItem(CHAVE_ARMAZENAMENTO);
  } catch (e) {
    return memoria;
  }
  if (!texto) return null;
  try {
    const j = JSON.parse(texto);
    const valida =
      typeof j.id === "string" &&
      typeof j.prazo === "number" &&
      typeof j.salaAtual === "number" &&
      Array.isArray(j.chaves) &&
      ["jogando", "derrota", "vitoria"].includes(j.status);
    return valida ? Object.assign({ aguardando: null, restanteFinal: null }, j) : null;
  } catch (e) {
    return null;
  }
}

/* Cópia em memória, usada se o navegador bloquear o armazenamento local. */
let memoria = null;

/* Salva (ou apaga) a jornada e atualiza a tela. */
function salvarJornada(j) {
  memoria = j;
  try {
    if (j) window.localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(j));
    else window.localStorage.removeItem(CHAVE_ARMAZENAMENTO);
  } catch (e) {
    /* Sem armazenamento: a jornada vale só enquanto a página estiver aberta. */
  }
  atualizarTela();
}

/* Começa (ou recomeça) a jornada e leva o jogador à Sala 1. */
function iniciarJornada() {
  tela.vitoriaFechada = false;
  salvarJornada(novaJornada(Date.now()));
  irPara("#/sala1");
}

/* Navegação */

/* Troca de página; se o endereço já for o mesmo, apenas redesenha. */
function irPara(rota) {
  if (window.location.hash === rota) desenharPagina();
  else window.location.hash = rota;
}

/* Lê o endereço (#/...) e escolhe a página a desenhar. */
function lerRota() {
  const caminho = window.location.hash.replace(/^#/, "") || "/";
  if (caminho === "/") return { pagina: "inicio" };
  if (caminho === "/memorial") return { pagina: "memorial" };
  const sala = caminho.match(/^\/sala([1-5])$/);
  if (sala) return { pagina: "sala", sala: Number(sala[1]) };
  return { pagina: "nao-encontrada" };
}

/* Desenha a página do endereço atual do zero. */
function desenharPagina() {
  const rota = lerRota();
  tela.pagina = rota.pagina;
  tela.sala = rota.sala || null;
  tela.chaveIframe = null;
  tela.janela = null;
  tela.vitoriaFechada = false;

  /* Para de observar os atalhos do Memorial ao trocar de página. */
  if (observadorIndice) {
    observadorIndice.disconnect();
    observadorIndice = null;
  }

  if (rota.pagina === "inicio") desenharInicio();
  else if (rota.pagina === "memorial") desenharMemorial();
  else if (rota.pagina === "sala") desenharSala(rota.sala);
  else desenharNaoEncontrada();

  window.scrollTo(0, 0);
  atualizarTela();
  ligarRelogio();
}

/* Peças reaproveitadas */

/* Fileira com as cinco chaves: preenchidas as conquistadas, "·" as bloqueadas. */
function fileiraChaves(chaves, grande) {
  return (
    `<ol class="chaves${grande ? " chaves-grandes" : ""}" aria-label="${chaves.length} de ${TOTAL_SALAS} chaves">` +
    SALAS.map((s) => {
      const tem = chaves.includes(s.numero);
      const dica = tem ? `${s.chave.nome} — ${s.cientista}` : `Chave ${s.numero} bloqueada`;
      return `<li class="${tem ? "tem" : ""}" title="${escapeHtml(dica)}">${tem ? s.chave.simbolo : "·"}</li>`;
    }).join("") +
    `</ol>`
  );
}

/* Transforma "Emmy Noether" em "emmy-noether" para usar como âncora. */
function idDe(nome) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/* Rodapé de créditos da página inicial e do Memorial. */
function rodape() {
  return `<footer class="rodape">
    <p class="rodape-titulo">© MTEC 2026 - IFTM - Ciência Delas</p>
    <p>Desenvolvido por: Lucas Mamede - Maria Lúcia Signorelli</p>
  </footer>`;
}

/* Página inicial */
function desenharInicio() {
  document.title = "Escape Room — Mulheres da Ciência · Jornada pelas 5 salas";
  el("app").innerHTML = `<main class="pagina">
    <section class="abertura">
      <div class="abertura-mosaico" aria-hidden="true">
        ${SALAS.map((s) => `<img src="${cenarioDaSala(s.numero)}" alt="" />`).join("")}
      </div>
      <div class="abertura-veu" aria-hidden="true"></div>
      <div class="abertura-conteudo">
        <div>
          <p class="sobretitulo">Escape Room · 5 fases</p>
          <h1 class="titulo-principal">Mulheres da Ciência</h1>
          <p class="abertura-texto">A linha do tempo da ciência está se desfazendo. Atravesse as salas de cinco pioneiras, resolva seus enigmas e reúna as Cinco Chaves da Ciência antes que o cronômetro de 30 minutos chegue a zero.</p>
          <div class="abertura-acoes">
            <button type="button" class="botao-destaque" id="btn-iniciar">INICIAR JORNADA COMPLETA (30 MIN)</button>
            <a class="botao-contorno" id="btn-continuar" href="#/sala1" hidden></a>
            <a class="link-forte" href="#/memorial">Memorial das Pioneiras →</a>
          </div>
          <div class="abertura-status" id="status-jornada" hidden></div>
        </div>
        <!-- Logo "Cinco Chaves para a Ciência", à direita do texto e dos botões. -->
        <img class="abertura-logo" src="logo.png" alt="Logo Cinco Chaves para a Ciência" width="530" height="530" />
      </div>
    </section>

    <section class="secao-salas" aria-labelledby="titulo-salas">
      <div>
        <p class="sobretitulo">As fases</p>
        <h2 id="titulo-salas" class="titulo-secao">Cinco salas, cinco chaves</h2>
      </div>
      <ol class="grade-salas">
        ${SALAS.map(
          (s) => `<li class="cartao-sala">
          <a class="cartao-imagem" href="${rotaDaSala(s.numero)}">
            <img src="${cenarioDaSala(s.numero)}" alt="${escapeHtml("Cenário: " + s.titulo)}" loading="lazy" />
            <span class="selo-chave" data-chave="${s.numero}" title="${escapeHtml(s.chave.nome)}">${s.chave.simbolo}</span>
          </a>
          <div class="cartao-corpo">
            <span class="etiqueta-fase">${s.fase}</span>
            <h3>${escapeHtml(s.titulo)}</h3>
            <p class="lugar">${escapeHtml(s.lugar)}</p>
            <div class="cartao-acoes"><a class="botao-pequeno" href="${rotaDaSala(s.numero)}">JOGAR</a></div>
          </div>
        </li>`,
        ).join("")}
        <li class="cartao-memorial">
          <div>
            <p class="sobretitulo">Museu Delas</p>
            <h3>Memorial das Pioneiras</h3>
            <p>Retratos, biografias, marcos históricos e citações das cinco cientistas que inspiram as salas.</p>
          </div>
          <a class="botao-pequeno" href="#/memorial">VISITAR O MEMORIAL</a>
        </li>
      </ol>
      <p class="nota">Cada sala também funciona sozinha: abra a pasta da sala (sala1 a sala5) e o arquivo index.html no navegador.</p>
    </section>
    ${rodape()}
  </main>`;

  el("btn-iniciar").addEventListener("click", iniciarJornada);
}

/* Atualiza na página inicial o que depende da jornada (botões, chaves e tempo). */
function atualizarInicio(j, restante) {
  const emAndamento = !!j && j.status === "jogando";
  el("btn-iniciar").textContent = emAndamento ? "RECOMEÇAR JORNADA (30 MIN)" : "INICIAR JORNADA COMPLETA (30 MIN)";

  const continuar = el("btn-continuar");
  continuar.hidden = !emAndamento;
  if (emAndamento) {
    const sala = j.aguardando ? j.aguardando : j.salaAtual;
    continuar.href = rotaDaSala(sala);
    continuar.textContent = `CONTINUAR · SALA ${sala} · ${formatarTempo(restante)}`;
  }

  document.querySelectorAll("[data-chave]").forEach((selo) => {
    selo.classList.toggle("tem", !!j && j.chaves.includes(Number(selo.dataset.chave)));
  });

  const status = el("status-jornada");
  status.hidden = !j;
  if (!j) return;
  let texto = `${j.chaves.length} de 5 chaves reunidas`;
  if (j.status === "vitoria") texto = `Jornada concluída com ${formatarTempo(j.restanteFinal || 0)} de sobra!`;
  else if (j.status === "derrota") texto = "Linha temporal rompida — o tempo se esgotou na última tentativa.";
  const conteudo = fileiraChaves(j.chaves) + `<span>${texto}</span>`;
  if (status.innerHTML !== conteudo) status.innerHTML = conteudo;
}

/* Memorial das Pioneiras */
function desenharMemorial() {
  document.title = "Memorial das Pioneiras — Museu Delas · Escape Room Mulheres da Ciência";
  el("app").innerHTML = `<main class="pagina">
    <nav class="barra-simples">
      <a class="link-forte" href="#/">← Início</a>
      <span class="fonte-pixel">MUSEU DELAS</span>
    </nav>

    <header class="memorial-topo">
      <p class="sobretitulo">Museu Delas</p>
      <h1 class="titulo-memorial">Memorial das Pioneiras</h1>
      <p class="memorial-texto">Cinco mulheres que mudaram a matemática, a computação, a física, a exploração espacial e a astronomia — muitas vezes trabalhando sem salário, sem reconhecimento ou contra as regras do seu tempo.</p>
      <div class="memorial-vitoria" id="memorial-vitoria" hidden></div>
      <nav class="atalhos-pioneiras" id="indice-pioneiras" aria-label="Pioneiras">
        ${PIONEIRAS.map((p) => `<button type="button" data-alvo="${idDe(p.nome)}">${salaPorNumero(p.sala).chave.simbolo} ${escapeHtml(p.nome)}</button>`).join("")}
      </nav>
    </header>

    <div class="memorial-lista">
      ${PIONEIRAS.map((p, i) => fichaPioneira(p, i)).join("")}

      <section aria-labelledby="titulo-galeria">
        <p class="sobretitulo">Galeria</p>
        <h2 id="titulo-galeria" class="titulo-secao">Os cenários em pixel art</h2>
        <div class="galeria">
          ${SALAS.map(
            (s) => `<figure>
            <a href="${cenarioDaSala(s.numero)}" target="_blank" rel="noreferrer">
              <img src="${cenarioDaSala(s.numero)}" alt="${escapeHtml("Cenário em pixel art: " + s.titulo)}" loading="lazy" />
            </a>
            <figcaption><strong>${s.fase}</strong> · ${escapeHtml(s.titulo)}<br /><span>${escapeHtml(s.lugar)}</span></figcaption>
          </figure>`,
          ).join("")}
        </div>
      </section>

      <div class="memorial-fim">
        <p>Pronta para mais uma travessia?</p>
        <button type="button" class="botao-destaque" id="btn-reiniciar">REINICIAR PARTIDA (30 MIN)</button>
        <a class="link-forte" href="#/">Voltar ao início</a>
      </div>
    </div>

    <!-- Botão fixo de retorno ao índice das pioneiras (aparece ao rolar a página). -->
    <button type="button" class="botao-indice" id="btn-indice" hidden>↑ ÍNDICE DAS PIONEIRAS</button>
    ${rodape()}
  </main>`;

  /* Rola até a pioneira sem mexer no endereço (o pacote usa "#/" para as páginas). */
  document.querySelectorAll("[data-alvo]").forEach((b) =>
    b.addEventListener("click", () => el(b.dataset.alvo).scrollIntoView({ behavior: "smooth" })),
  );
  el("btn-reiniciar").addEventListener("click", iniciarJornada);

  /* Botão de retorno: leva de volta aos atalhos das pioneiras. */
  const indice = el("indice-pioneiras");
  const voltar = el("btn-indice");
  voltar.addEventListener("click", () => indice.scrollIntoView({ behavior: "smooth", block: "center" }));

  /* Mostra o botão só quando os atalhos já ficaram acima da tela. */
  if ("IntersectionObserver" in window) {
    observadorIndice = new IntersectionObserver(([item]) => {
      voltar.hidden = item.isIntersecting || item.boundingClientRect.top >= 0;
    });
    observadorIndice.observe(indice);
  }
}

/* Ficha de uma pioneira: retrato, biografia, citação, marcos e legado. */
function fichaPioneira(p, indice) {
  const sala = salaPorNumero(p.sala);
  return `<article class="ficha" id="${idDe(p.nome)}">
    <div class="ficha-topo${indice % 2 ? " invertida" : ""}">
      <figure class="ficha-retrato">
        <img src="${p.retrato}" alt="${escapeHtml("Retrato em pixel art de " + p.nome)}" width="640" height="640" loading="lazy" />
        <figcaption><span>${sala.chave.simbolo}</span> ${escapeHtml(sala.chave.nome)} · ${sala.fase}</figcaption>
      </figure>
      <div class="ficha-texto">
        <p class="fonte-pixel destaque">${p.anos}</p>
        <h2>${escapeHtml(p.nome)}</h2>
        <p class="area">${escapeHtml(p.area)}</p>
        <p class="bio">${escapeHtml(p.bio)}</p>
        <blockquote>${escapeHtml(p.citacao)}</blockquote>
      </div>
    </div>
    <div class="ficha-rodape">
      <section>
        <h3>Marcos históricos</h3>
        <ol class="linha-tempo">
          ${p.marcos.map((m) => `<li><strong>${m.ano}</strong>${escapeHtml(m.texto)}</li>`).join("")}
        </ol>
      </section>
      <section>
        <h3>Legado científico</h3>
        <p class="legado">${escapeHtml(p.legado)}</p>
        <a class="botao-contorno-pequeno" href="${rotaDaSala(sala.numero)}">Visitar ${escapeHtml(sala.titulo.toLowerCase())} →</a>
      </section>
    </div>
  </article>`;
}

/* Mostra no topo do Memorial o tempo da vitória, quando a jornada foi vencida. */
function atualizarMemorial(j) {
  const caixa = el("memorial-vitoria");
  const venceu = !!j && j.status === "vitoria";
  caixa.hidden = !venceu;
  if (!venceu) return;
  const conteudo =
    fileiraChaves(j.chaves) +
    `<span>Fio da história restaurado com <strong>${formatarTempo(j.restanteFinal || 0)}</strong> de sobra.</span>`;
  if (caixa.innerHTML !== conteudo) caixa.innerHTML = conteudo;
}

/* Sala dentro da moldura da Jornada */
function desenharSala(n) {
  const info = salaPorNumero(n);
  document.title = info.tituloPagina;
  el("app").innerHTML = `<div class="moldura" id="moldura">
    <nav class="barra-salas" id="barra-salas" aria-label="Salas do escape room">
      <a class="barra-link forte" href="#/">← <span class="so-tablet">Início</span></a>
      <span class="separador" aria-hidden="true">|</span>
      ${SALAS.map(
        (s) => `<a class="barra-link${s.numero === n ? " ativo" : ""}" href="${rotaDaSala(s.numero)}" title="${escapeHtml(s.fase + " · " + s.cientista)}">
          <span class="so-desktop">Sala </span>${s.numero}<span class="chave-barra" data-chave-barra="${s.numero}"></span>
        </a>`,
      ).join("")}
      <a class="barra-link so-tablet" href="#/memorial">Memorial</a>
      <div class="barra-direita">
        <a class="link-jornada" id="link-jornada" hidden></a>
        <div class="so-tablet" id="chaves-barra"></div>
        <div class="cronometro" id="cronometro" role="timer" hidden></div>
        <button type="button" class="botao-jornada" id="btn-jornada" hidden>Jornada (30 min)</button>
      </div>
    </nav>
    <p class="aviso-alerta" id="aviso-alerta" role="status" hidden></p>
    <div class="area-jogo" id="area-jogo"></div>
    <div id="janelas"></div>
  </div>`;

  el("btn-jornada").addEventListener("click", iniciarJornada);
}

/* Atualiza a moldura da sala: cronômetro, chaves, alerta, jogo e janelas. */
function atualizarSala(j, restante) {
  const n = tela.sala;
  const info = salaPorNumero(n);

  /* A sala só conta para a jornada quando é a fase atual (ou a recém-concluída). */
  const modoJornada = !!j && (j.salaAtual === n || j.aguardando === n);
  const chave = modoJornada ? n + "-" + j.id : n + "-livre";
  if (chave !== tela.chaveIframe) {
    /* Recarrega o jogo só quando muda o modo (livre ou jornada) ou a partida. */
    tela.chaveIframe = chave;
    el("area-jogo").innerHTML = `<iframe id="jogo" src="${arquivoDaSala(n)}${modoJornada ? "?jornada=1" : ""}" title="${escapeHtml("Sala " + n + " — " + info.titulo)}"></iframe>`;
  }

  const jogando = !!j && j.status === "jogando";
  const alerta = jogando && emAlerta(restante);
  el("moldura").classList.toggle("em-alerta", alerta);

  /* Símbolos das chaves já conquistadas ao lado do número de cada sala. */
  document.querySelectorAll("[data-chave-barra]").forEach((span) => {
    const s = Number(span.dataset.chaveBarra);
    span.textContent = j && j.chaves.includes(s) ? " " + salaPorNumero(s).chave.simbolo : "";
  });

  /* Atalho de volta para a sala da vez quando o jogador visita outra. */
  const link = el("link-jornada");
  link.hidden = !(jogando && !modoJornada);
  if (!link.hidden) {
    link.href = rotaDaSala(j.salaAtual);
    link.textContent = `Jornada na Sala ${j.salaAtual} →`;
  }

  /* Cronômetro global e fileira de chaves. */
  const cronometro = el("cronometro");
  const chavesBarra = el("chaves-barra");
  cronometro.hidden = !j;
  chavesBarra.hidden = !j;
  el("btn-jornada").hidden = !!j;
  if (j) {
    const conteudoChaves = fileiraChaves(j.chaves);
    if (chavesBarra.innerHTML !== conteudoChaves) chavesBarra.innerHTML = conteudoChaves;
    cronometro.innerHTML = `<span aria-hidden="true">⏳</span>${formatarTempo(restante)}`;
    cronometro.setAttribute("aria-label", "Tempo restante da jornada: " + formatarTempo(restante));
    cronometro.classList.toggle("alerta", alerta);
    cronometro.classList.toggle("esgotado", j.status === "derrota");
  }

  /* Faixa de aviso dos últimos 5 minutos. */
  const aviso = el("aviso-alerta");
  aviso.hidden = !alerta;
  if (alerta) aviso.textContent = `⚠ Últimos 5 minutos! A linha temporal está se rompendo — Sala ${j.salaAtual} de ${TOTAL_SALAS}.`;

  /* Janela que deve aparecer agora (ou nenhuma). */
  let janela = null;
  if (jogando && j.aguardando !== null) janela = "transicao-" + j.aguardando;
  else if (j && j.status === "derrota") janela = "derrota";
  else if (j && j.status === "vitoria" && n === TOTAL_SALAS && !tela.vitoriaFechada) janela = "vitoria";
  if (janela !== tela.janela) {
    tela.janela = janela;
    desenharJanela(janela, j);
  }
  const tempoJanela = el("tempo-janela");
  if (tempoJanela && janela && janela.startsWith("transicao")) tempoJanela.textContent = formatarTempo(restante);
}

/* Janelas da Jornada */

/* Desenha a janela de transição, derrota ou vitória (ou fecha todas). */
function desenharJanela(tipo, j) {
  const caixa = el("janelas");
  if (!tipo) {
    caixa.innerHTML = "";
    return;
  }

  let titulo = "";
  let conteudo = "";
  let alerta = false;

  if (tipo.startsWith("transicao")) {
    const sala = salaPorNumero(j.aguardando);
    const proxima = salaPorNumero(sala.numero + 1);
    titulo = `Chave ${sala.numero} de ${TOTAL_SALAS} desbloqueada`;
    conteudo = `<p class="janela-sobretitulo">${sala.fase} concluída</p>
      <div class="chave-conquistada">${sala.chave.simbolo}</div>
      <h2>Chave ${sala.numero} de ${TOTAL_SALAS} Desbloqueada — ${escapeHtml(sala.cientista)}</h2>
      <p class="janela-suave">${escapeHtml(sala.chave.nome)}</p>
      <div class="janela-chaves">${fileiraChaves(j.chaves, true)}</div>
      <p>Tempo restante no cronômetro: <strong class="tempo-destaque" id="tempo-janela"></strong></p>
      <p class="janela-suave pequena">Próxima parada: ${escapeHtml(proxima.titulo)} · ${escapeHtml(proxima.lugar)}</p>
      <button type="button" class="botao-janela" id="btn-avancar">AVANÇAR PARA A PRÓXIMA SALA ►</button>`;
  } else if (tipo === "derrota") {
    titulo = "Linha Temporal Rompida";
    alerta = true;
    conteudo = `<div class="icone-derrota" aria-hidden="true">⌛</div>
      <p class="janela-sobretitulo">00:00 · Fim do tempo</p>
      <h2>Linha Temporal Rompida! O tempo se esgotou.</h2>
      <p class="janela-suave texto">As memórias e descobertas fundamentais dessas pioneiras correm o risco de se perderem no tecido do tempo. Recalibre seus instrumentos e tente novamente para resgatar a história da ciência!</p>
      <button type="button" class="botao-janela" id="btn-recalibrar">RECALIBRAR CRONÔMETRO E TENTAR NOVAMENTE</button>`;
  } else {
    titulo = "Missão Cumprida";
    conteudo = `<div class="janela-fechar"><button type="button" id="btn-fechar-vitoria" aria-label="Fechar">✕</button></div>
      <div class="icone-vitoria" aria-hidden="true">★</div>
      <p class="janela-sobretitulo">Jornada completa · 5 de 5 chaves</p>
      <h2>Missão Cumprida! Você restaurou o fio da história.</h2>
      <div class="janela-chaves">${fileiraChaves(j.chaves, true)}</div>
      <p class="janela-suave texto">Você reuniu as Cinco Chaves da Ciência, honrando o brilhantismo, a coragem e as descobertas inestimáveis de Emmy Noether, Ada Lovelace, Marie Curie, Katherine Johnson e Caroline Herschel. O legado dessas pioneiras agora brilha para sempre.</p>
      <p>Tempo restante: <strong class="tempo-destaque">${formatarTempo(j.restanteFinal || 0)}</strong></p>
      <div class="janela-botoes">
        <button type="button" class="botao-janela" id="btn-memorial">ENTRAR NO MEMORIAL DAS PIONEIRAS</button>
        <button type="button" class="botao-janela-secundario" id="btn-jogar-novamente">JOGAR NOVAMENTE</button>
      </div>`;
  }

  caixa.innerHTML = `<div class="fundo-janela">
    <div class="janela${alerta ? " alerta" : ""}" role="dialog" aria-modal="true" aria-label="${escapeHtml(titulo)}">${conteudo}</div>
  </div>`;

  /* Liga os botões da janela aberta e coloca o foco no botão principal. */
  const ligar = (id, acao) => {
    const botao = el(id);
    if (botao) botao.addEventListener("click", acao);
  };
  ligar("btn-avancar", avancarParaProxima);
  ligar("btn-recalibrar", iniciarJornada);
  ligar("btn-memorial", () => irPara("#/memorial"));
  ligar("btn-jogar-novamente", iniciarJornada);
  ligar("btn-fechar-vitoria", () => {
    tela.vitoriaFechada = true;
    atualizarTela();
  });
  const principal = caixa.querySelector(".botao-janela");
  if (principal) principal.focus();
}

/* Fecha a janela de transição e leva o jogador à próxima sala. */
function avancarParaProxima() {
  const j = lerJornada();
  if (!j) return;
  const proxima = (j.aguardando || tela.sala) + 1;
  salvarJornada(Object.assign({}, j, { aguardando: null }));
  irPara(rotaDaSala(proxima));
}

/* Página não encontrada */
function desenharNaoEncontrada() {
  document.title = "Página não encontrada — Escape Room Mulheres da Ciência";
  el("app").innerHTML = `<main class="nao-encontrada">
    <div>
      <h1>404</h1>
      <p>Esta sala não existe ou mudou de lugar.</p>
      <a class="botao-pequeno" href="#/">Voltar ao início</a>
    </div>
  </main>`;
}

/* Relógio da tela */

/* Atualiza a página aberta com o estado atual da jornada. */
function atualizarTela() {
  let j = lerJornada();
  const agora = Date.now();
  /* Marca derrota assim que o cronômetro zera. */
  if (j && verificarTempo(j, agora) !== j) {
    j = verificarTempo(j, agora);
    salvarJornada(j);
    return;
  }
  const restante = j ? tempoRestante(j, agora) : 0;
  if (tela.pagina === "inicio") atualizarInicio(j, restante);
  else if (tela.pagina === "memorial") atualizarMemorial(j);
  else if (tela.pagina === "sala") atualizarSala(j, restante);
}

/* Atualiza a tela 4 vezes por segundo (o cronômetro nunca "pula" um segundo). */
function ligarRelogio() {
  if (relogioId) clearInterval(relogioId);
  relogioId = setInterval(atualizarTela, 250);
}

/* Avisos das salas */

/* Cada sala avisa (postMessage) quando o mecanismo final é destravado.
   Aberto do computador (file:), a origem da sala chega como "null". */
window.addEventListener("message", (e) => {
  const origemOk =
    e.origin === window.location.origin || (window.location.protocol === "file:" && e.origin === "null");
  const jogo = el("jogo");
  if (!origemOk || tela.pagina !== "sala" || !jogo || e.source !== jogo.contentWindow) return;
  const dados = e.data || {};
  if (dados.tipo !== "escape-room:sala-concluida" || dados.sala !== tela.sala) return;
  const j = lerJornada();
  if (j) salvarJornada(concluirSala(j, tela.sala, Date.now()));
});

/* Mantém várias abas do navegador sincronizadas com a mesma jornada. */
window.addEventListener("storage", (e) => {
  if (e.key === CHAVE_ARMAZENAMENTO) atualizarTela();
});

/* Troca de página ao mudar o endereço (links "#/..."). */
window.addEventListener("hashchange", desenharPagina);

/* Inicialização da aplicação. */
desenharPagina();
