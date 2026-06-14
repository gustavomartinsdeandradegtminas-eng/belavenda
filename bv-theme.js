/**
 * reVENDE.aí — Tema claro/escuro (bv-theme.js)
 * ─────────────────────────────────────────────────────────
 * • Aplica o tema salvo imediatamente (sem flash) em <html data-theme>.
 * • Injeta os overrides de modo escuro — vencem por ESPECIFICIDADE
 *   (:root[data-theme=dark] e [data-theme=dark] .classe), então a ordem
 *   em relação ao <style> inline da página não importa.
 * • Cria um botão flutuante de alternância (sol/lua) em todas as páginas.
 *
 * Carregue em qualquer ponto do <head>. Persistência: localStorage bv_theme.
 */
;(function (w, d) {
  'use strict';
  var KEY = 'bv_theme';
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function cur() { return d.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function apply(t) {
    d.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
    // tinge o chrome do navegador junto com o tema (imersão no mobile)
    try {
      var m = d.querySelector('meta[name="theme-color"]');
      if (!m) { m = d.createElement('meta'); m.name = 'theme-color'; (d.head || d.documentElement).appendChild(m); }
      m.content = t === 'dark' ? '#140811' : '#c2185b';
    } catch (e) {}
  }

  // 1) Aplica ASAP (antes do body pintar) — evita flash
  apply(saved() || 'light');

  // 2) Injeta CSS do modo escuro
  var css =
    ':root[data-theme=dark]{' +
      '--bg:#140811;--cream:#180b14;--surface:#20101b;--surface-2:#2a1524;' +
      '--text:#f6e8f0;--text2:#e7d3df;--ink:#0e0610;' +
      '--muted:#bd8ea6;--muted-l:#8f667c;' +
      '--border:#3a2030;--border2:#3a2030;' +
      '--primary-l:#3c1430;--rose-l:#3c1430;--rose-xl:#2c0f20;--violet-l:#241b3a;--champagne-l:#2b2418;' +
      '--grad-card:linear-gradient(145deg,#20101b,#2a1524);' +
      '--grad-surface:linear-gradient(180deg,#2a1524,#20101b);' +
      '--shadow-sm:0 1px 3px rgba(0,0,0,.4);' +
      '--shadow:0 8px 30px rgba(0,0,0,.5),0 2px 8px rgba(0,0,0,.4);' +
      '--shadow-md:0 8px 32px rgba(0,0,0,.55);' +
      '--shadow-lg:0 24px 60px rgba(0,0,0,.6);' +
    '}' +
    '[data-theme=dark] body{background:var(--bg);color:var(--text)}' +
    // superfícies brancas/hardcoded → superfície escura
    '[data-theme=dark] .kpi-card{background:linear-gradient(160deg,#20101b,#2a1524)!important;border-color:var(--border)}' +
    '[data-theme=dark] .card-header{background:linear-gradient(180deg,#241324,#20101b)}' +
    '[data-theme=dark] .insight{background:linear-gradient(160deg,#20101b,#2a1524);border-color:var(--border)}' +
    '[data-theme=dark] .card,[data-theme=dark] .prod-card,[data-theme=dark] .filter-box,' +
      '[data-theme=dark] .modal,[data-theme=dark] .cart-drawer,[data-theme=dark] .review-card,' +
      '[data-theme=dark] .pedido-card,[data-theme=dark] .auth-card,[data-theme=dark] .step,' +
      '[data-theme=dark] .feat-card,[data-theme=dark] .testi,[data-theme=dark] .faq-item,' +
      '[data-theme=dark] .loja-fechada-card{background:var(--surface);border-color:var(--border)}' +
    '[data-theme=dark] .loja-card{background:linear-gradient(145deg,#20101b,#2a1524);border-color:var(--border)}' +
    '[data-theme=dark] .prod-img{background:linear-gradient(135deg,#2c0f20,#20101b)}' +
    // campos de formulário
    '[data-theme=dark] input,[data-theme=dark] select,[data-theme=dark] textarea{background:var(--surface-2)!important;color:var(--text)!important;border-color:var(--border)!important}' +
    '[data-theme=dark] input::placeholder,[data-theme=dark] textarea::placeholder{color:var(--muted-l)}' +
    '[data-theme=dark] .search-box,[data-theme=dark] .sort-select{background:var(--surface-2)!important}' +
    // tabelas
    '[data-theme=dark] th{background:var(--surface-2);color:var(--muted);border-color:var(--border)}' +
    '[data-theme=dark] td{border-color:var(--border);color:var(--text)}' +
    '[data-theme=dark] tr:hover td{background:var(--surface-2)}' +
    // navegação inferior / chips claros
    '[data-theme=dark] .tabs{background:rgba(32,16,27,.85);border-color:var(--border)}' +
    '[data-theme=dark] .filter-chip,[data-theme=dark] .cat-chip,[data-theme=dark] .filter-btn{background:var(--surface-2);border-color:var(--border);color:var(--muted)}' +
    '[data-theme=dark] .btn-secondary{background:var(--surface-2);color:var(--text);border-color:var(--border)}' +
    '[data-theme=dark] .btn-ghost,[data-theme=dark] .back-btn{background:var(--surface-2);color:var(--text);border-color:var(--border)}' +
    '[data-theme=dark] .calc-result,[data-theme=dark] .order-info-item,[data-theme=dark] .hc-item{background:var(--surface-2)}' +
    '[data-theme=dark] nav.scrolled{background:rgba(20,8,17,.85)!important}' +
    // loja: checkout/modal/avaliações que tinham cores claras fixas
    '[data-theme=dark] .modal-hd{background:var(--surface);border-color:var(--border)}' +
    '[data-theme=dark] .review-card,[data-theme=dark] .loja-fechada-card{background:var(--surface);border-color:var(--border)}' +
    '[data-theme=dark] .bar-track{background:var(--surface-2)}' +
    '[data-theme=dark] .cart-item{border-color:var(--border)}' +
    '[data-theme=dark] .pay-method{background:var(--surface-2);border-color:var(--border)}' +
    '[data-theme=dark] .cstep-circle{background:var(--surface-2)}' +
    '[data-theme=dark] .boleto-box{background:var(--surface-2);border-color:var(--border)}' +
    '[data-theme=dark] .delivery-opt{background:var(--surface-2)!important;border-color:var(--border)!important}' +
    '[data-theme=dark] .pix-key-wrap{background:var(--surface)}' +
    // loja: notas de status e cartao PIX harmonizados ao dark (mantem identidade verde/laranja)
    '[data-theme=dark] .tx-badge{background:rgba(16,185,129,.16);color:#6ee7b7}' +
    '[data-theme=dark] .bv-note.ok{background:rgba(16,185,129,.14);border-color:rgba(16,185,129,.32);color:#6ee7b7}' +
    '[data-theme=dark] .bv-note.warn{background:rgba(245,158,11,.15);border-color:rgba(245,158,11,.34);color:#fcd34d}' +
    '[data-theme=dark] .cupom-applied{background:rgba(16,185,129,.14);border-color:rgba(16,185,129,.32);color:#6ee7b7}' +
    '[data-theme=dark] .pix-box{background:linear-gradient(135deg,#11271c,#0f2417);border-color:#2f6f43}' +
    '[data-theme=dark] .pix-title,[data-theme=dark] .pix-amount,[data-theme=dark] .pix-key-text,[data-theme=dark] .pix-timer,[data-theme=dark] .pix-tip{color:#6ee7b7}' +
    // preco do produto: gradiente clipado perde contraste no dark -> rosa claro solido
    '[data-theme=dark] .prod-price{background:none!important;-webkit-text-fill-color:#f9a8d4;color:#f9a8d4}' +
    // cliente: badges de status legiveis no dark
    '[data-theme=dark] .badge-fechada{background:rgba(239,68,68,.16);color:#fca5a5}' +
    '[data-theme=dark] .txt-aberta{color:#6ee7a8}' +
    '[data-theme=dark] .cep-resultado.loading{background:rgba(233,30,140,.14);color:#f9a8d4}' +
    // landing: contraste no dark
    '[data-theme=dark] .vit-btn{background:rgba(233,30,140,.18);color:#f9a8d4}' +
    '[data-theme=dark] .vit-btn:hover{background:rgba(233,30,140,.3)}' +
    '[data-theme=dark] .eyebrow{color:#f9a8d4}' +
    // botão de tema
    '#bv-theme-btn{position:fixed;right:18px;bottom:18px;width:48px;height:48px;border-radius:50%;border:1px solid rgba(0,0,0,.06);cursor:pointer;z-index:150;background:#fff;color:#c2185b;box-shadow:0 6px 22px rgba(136,14,79,.28);display:grid;place-items:center;transition:transform .2s,background .3s,color .3s;padding:0;view-transition-name:bv-fab}' +
    '#bv-theme-btn:hover{transform:scale(1.1) rotate(-8deg)}' +
    '#bv-theme-btn:focus-visible{outline:3px solid rgba(194,24,91,.5);outline-offset:2px}' +
    '[data-theme=dark] #bv-theme-btn{background:#2a1524;color:#fbcfe8;border-color:var(--border);box-shadow:0 6px 22px rgba(0,0,0,.55)}' +
    '@media(max-width:640px){#bv-theme-btn{width:44px;height:44px;right:14px;bottom:14px}}' +
    // skeletons de carregamento (compartilhado)
    '.skel{position:relative;overflow:hidden;background:#efe2ea;border-radius:8px}' +
    '.skel::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(100deg,transparent 20%,rgba(255,255,255,.65) 50%,transparent 80%);animation:bv-skel 1.2s infinite}' +
    '@keyframes bv-skel{100%{transform:translateX(100%)}}' +
    '[data-theme=dark] .skel{background:#2a1524}' +
    '[data-theme=dark] .skel::after{background:linear-gradient(100deg,transparent 20%,rgba(255,255,255,.08) 50%,transparent 80%)}' +
    '[data-theme=dark] .prod-photo:not(.bvloaded){background:linear-gradient(100deg,#2a1524 25%,#3a2030 50%,#2a1524 75%);background-size:200% 100%}' +
    // micro-interações: fade-in de conteúdo ao trocar de aba/seção
    '@keyframes bv-fade-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
    '.bv-anim{animation:bv-fade-up .34s cubic-bezier(.2,.7,.3,1) both}' +
    // acessibilidade: foco visível por teclado
    ':focus-visible{outline:2.5px solid var(--primary,#c2185b);outline-offset:2px;border-radius:6px}' +
    'button:focus:not(:focus-visible),a:focus:not(:focus-visible){outline:none}' +
    // ── Travessia de Seda: transição suave entre páginas (View Transitions) ──
    // Navegadores sem suporte ignoram o at-rule (fallback = navegação normal).
    '@view-transition{navigation:auto}' +
    '::view-transition-old(root){animation:bv-vt-out .25s ease both}' +
    '::view-transition-new(root){animation:bv-vt-in .42s cubic-bezier(.2,.7,.3,1) both}' +
    '@keyframes bv-vt-out{to{opacity:0;transform:translateY(-10px)}}' +
    '@keyframes bv-vt-in{from{opacity:0;transform:translateY(12px)}}' +
    // troca de tema: revelação circular (o JS anima o clip-path do snapshot novo)
    'html.bv-theming::view-transition-old(root),html.bv-theming::view-transition-new(root){animation:none;mix-blend-mode:normal;display:block}' +
    'html.bv-theming::view-transition-image-pair(root){isolation:auto}' +
    // entradas escalonadas: filhos do container surgem em cascata (opt-in via bvAnimate(el,true))
    '.bv-stagger>*{animation:bv-fade-up .4s cubic-bezier(.2,.7,.3,1) backwards}' +
    '.bv-stagger>*:nth-child(2){animation-delay:.05s}.bv-stagger>*:nth-child(3){animation-delay:.1s}' +
    '.bv-stagger>*:nth-child(4){animation-delay:.15s}.bv-stagger>*:nth-child(5){animation-delay:.2s}' +
    '.bv-stagger>*:nth-child(6){animation-delay:.25s}.bv-stagger>*:nth-child(7){animation-delay:.3s}' +
    '.bv-stagger>*:nth-child(n+8){animation-delay:.34s}' +
    // ── Couture Rosé · acabamento fino global ──
    // seleção de texto na cor da marca
    '::selection{background:rgba(233,30,140,.22);color:inherit;text-shadow:none}' +
    '[data-theme=dark] ::selection{background:rgba(233,30,140,.40)}' +
    // rolagem suave para âncoras
    'html{scroll-behavior:smooth}' +
    // scrollbar tingida na marca
    '*{scrollbar-width:thin;scrollbar-color:var(--primary,#c2185b) transparent}' +
    '::-webkit-scrollbar{width:11px;height:11px}' +
    '::-webkit-scrollbar-track{background:transparent}' +
    '::-webkit-scrollbar-thumb{background:linear-gradient(var(--primary,#c2185b),var(--primary-d,#880e4f));border-radius:10px;border:3px solid transparent;background-clip:padding-box}' +
    '::-webkit-scrollbar-thumb:hover{background:var(--primary-d,#880e4f);background-clip:padding-box;border:3px solid transparent}' +
    // transição suave ao alternar entre claro/escuro
    'body{transition:background-color .55s ease,color .45s ease}' +
    // brilho especular deslizante em botões primários (apenas no hover)
    '.btn-primary{position:relative;overflow:hidden;isolation:isolate}' +
    '.btn-primary::after{content:"";position:absolute;top:0;left:-70%;width:45%;height:100%;z-index:-1;background:linear-gradient(100deg,transparent,rgba(255,255,255,.38),transparent);transform:skewX(-18deg);opacity:0}' +
    '.btn-primary:hover::after{opacity:1;animation:bv-sheen .85s cubic-bezier(.4,0,.2,1)}' +
    '@keyframes bv-sheen{from{left:-70%}to{left:140%}}' +
    // ── Logo "reVENDE.aí": acento dourado vivo + lustre no monograma ──
    // o ".aí" pulsa um brilho dourado (usa a própria cor de cada contexto)
    '.ai{animation:bv-ai-glow 4.6s ease-in-out infinite}' +
    '@keyframes bv-ai-glow{0%,100%{filter:brightness(1) drop-shadow(0 0 0 transparent)}50%{filter:brightness(1.24) drop-shadow(0 0 7px currentColor)}}' +
    // logo clicável (nav): realce sutil no hover
    '.nav-logo{transition:transform .25s cubic-bezier(.2,.7,.3,1)}' +
    '.nav-logo:hover{transform:scale(1.04)}' +
    '.nav-logo:hover .ai{filter:brightness(1.4) drop-shadow(0 0 10px currentColor)}' +
    // monograma "r": lustre diagonal periódico (joia pegando luz)
    '.auth-mark,.brand-mark,.sidebar-logo-mark,.tb-mark,.quiz-mark,.quiz-cta-mark{position:relative;overflow:hidden}' +
    '.auth-mark::after,.brand-mark::after,.sidebar-logo-mark::after,.tb-mark::after,.quiz-mark::after,.quiz-cta-mark::after{content:"";position:absolute;top:0;left:-130%;width:55%;height:100%;transform:skewX(-20deg);pointer-events:none;animation:bv-mono-sheen 5.5s ease-in-out infinite}' +
    // badges em gradiente: glint branco
    '.sidebar-logo-mark::after,.tb-mark::after,.quiz-mark::after,.quiz-cta-mark::after{background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent)}' +
    // badges brancos: glint dourado (champagne)
    '.auth-mark::after,.brand-mark::after{background:linear-gradient(100deg,transparent,rgba(230,184,120,.55),transparent)}' +
    '@keyframes bv-mono-sheen{0%,72%{left:-130%}100%{left:170%}}' +
    // ── Nome "reVENDE.aí" com degradê fluido rosa→dourado→magenta (igual ao "pertinho de você") ──
    // .bv-name = fundos claros · .bv-name-d = fundos escuros/plum (tons mais claros p/ contraste)
    // gradiente simétrico que desliza continuamente da esquerda p/ direita (sem pulso)
    '.bv-name,.bv-name-d{background-size:200% 100%;background-repeat:repeat;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:bv-name-slide 7s linear infinite}' +
    '.bv-name{background-image:linear-gradient(90deg,#c2185b 0%,#e0a96b 25%,#e91e8c 50%,#e0a96b 75%,#c2185b 100%)}' +
    '.bv-name-d{background-image:linear-gradient(90deg,#f9a8d4 0%,#f6dca8 25%,#ff8fcf 50%,#f6dca8 75%,#f9a8d4 100%)}' +
    '[data-theme=dark] .bv-name{background-image:linear-gradient(90deg,#f9a8d4 0%,#f6dca8 25%,#ff8fcf 50%,#f6dca8 75%,#f9a8d4 100%)}' +
    // filhos (reVENDE / .aí) ficam transparentes p/ o degradê do container fluir por cima de tudo
    '.bv-name *,.bv-name-d *{-webkit-text-fill-color:transparent!important;color:transparent!important;background:none!important}' +
    '.bv-name .ai,.bv-name-d .ai{animation:none}' +
    '@keyframes bv-name-slide{from{background-position:0% 50%}to{background-position:200% 50%}}' +
    // elevação tingida na marca + halo ao passar o mouse nos cards de vitrine
    '.feat-card,.vit-card,.loja-card,.prod-card{position:relative;transition:box-shadow .38s ease,transform .35s cubic-bezier(.2,.7,.3,1),border-color .3s ease}' +
    // Lustre Líquido: verniz radial que segue o cursor dentro do card (compõe com o tilt)
    '.feat-card::after,.vit-card::after,.loja-card::after,.prod-card::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:1;opacity:0;transition:opacity .4s ease;mix-blend-mode:soft-light;background:radial-gradient(340px circle at var(--bv-mx,50%) var(--bv-my,38%),rgba(255,255,255,.85),rgba(201,168,106,.35) 42%,transparent 65%)}' +
    '.feat-card:hover::after,.vit-card:hover::after,.loja-card:hover::after,.prod-card:hover::after{opacity:1}' +
    '[data-theme=dark] .feat-card::after,[data-theme=dark] .vit-card::after,[data-theme=dark] .loja-card::after,[data-theme=dark] .prod-card::after{mix-blend-mode:screen;background:radial-gradient(340px circle at var(--bv-mx,50%) var(--bv-my,38%),rgba(255,236,246,.14),rgba(201,168,106,.06) 42%,transparent 65%)}' +
    '.feat-card:hover,.vit-card:hover,.loja-card:hover,.prod-card:hover{box-shadow:0 24px 52px -18px rgba(136,14,79,.32),0 8px 22px -12px rgba(194,24,91,.22)}' +
    '[data-theme=dark] .feat-card:hover,[data-theme=dark] .vit-card:hover,[data-theme=dark] .loja-card:hover,[data-theme=dark] .prod-card:hover{box-shadow:0 26px 60px -16px rgba(0,0,0,.62),0 0 0 1px rgba(233,30,140,.20),0 12px 36px -10px rgba(233,30,140,.20)}' +
    // ── Vidro de Boudoir: modais em cristal fumê rosado (fallback = sólido atual) ──
    '@supports ((backdrop-filter:blur(2px)) or (-webkit-backdrop-filter:blur(2px))){' +
      '.modal-overlay{backdrop-filter:blur(10px) saturate(1.25);-webkit-backdrop-filter:blur(10px) saturate(1.25)}' +
      '.modal-overlay .modal{background:rgba(255,255,255,.88);backdrop-filter:blur(20px) saturate(1.3);-webkit-backdrop-filter:blur(20px) saturate(1.3);border:1px solid rgba(255,255,255,.65);box-shadow:0 24px 70px rgba(136,14,79,.26),inset 0 1px 0 rgba(255,255,255,.8)}' +
      '[data-theme=dark] .modal-overlay .modal{background:rgba(32,16,27,.86);border-color:rgba(244,143,177,.15);box-shadow:0 24px 70px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.06)}' +
    '}' +
    // respeita preferência de menos movimento
    '@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.001ms!important;animation-delay:0s!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}.reveal{opacity:1!important;transform:none!important}.marquee-track{animation:none!important}::view-transition-old(root),::view-transition-new(root){animation:none!important}}';

  var st = d.createElement('style');
  st.id = 'bv-theme-css';
  st.textContent = css;
  (d.head || d.documentElement).appendChild(st);

  // re-dispara a animação de entrada num elemento (troca de aba/seção).
  // stagger=true: filhos diretos surgem em cascata (não usar em containers
  // cujos filhos dependem de transform posicional, ex. deck do Match).
  w.bvAnimate = function (el, stagger) {
    if (!el) return;
    el.classList.remove('bv-anim'); el.classList.remove('bv-stagger');
    void el.offsetWidth;
    el.classList.add('bv-anim');
    if (stagger) el.classList.add('bv-stagger');
  };

  // 3) Botão flutuante
  var MOON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var SUN = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>';

  function label() { return cur() === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'; }
  function refresh() {
    var b = d.getElementById('bv-theme-btn');
    if (!b) return;
    b.innerHTML = cur() === 'dark' ? SUN : MOON;
    b.setAttribute('aria-label', label());
    b.setAttribute('title', label());
  }
  w.bvToggleTheme = function () {
    var t = cur() === 'dark' ? 'light' : 'dark';
    var done = function () {
      try { localStorage.setItem(KEY, t); } catch (e) {}
      apply(t);
      refresh();
    };
    var calm = false;
    try { calm = w.matchMedia('(prefers-reduced-motion:reduce)').matches; } catch (e) {}
    // toggle no meio de uma transição: troca direta (sem empilhar transições)
    if (d.documentElement.classList.contains('bv-theming')) { done(); return; }
    // Revelação circular: o novo tema "nasce" do botão e toma a tela (View Transition)
    if (!calm && d.startViewTransition) {
      var b = d.getElementById('bv-theme-btn');
      var r = b ? b.getBoundingClientRect() : null;
      var x = r ? r.left + r.width / 2 : w.innerWidth - 40;
      var y = r ? r.top + r.height / 2 : w.innerHeight - 40;
      var endR = Math.hypot(Math.max(x, w.innerWidth - x), Math.max(y, w.innerHeight - y));
      d.documentElement.classList.add('bv-theming');
      try {
        var vt = d.startViewTransition(done);
        vt.ready.then(function () {
          d.documentElement.animate(
            { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + endR + 'px at ' + x + 'px ' + y + 'px)'] },
            { duration: 520, easing: 'cubic-bezier(.2,.7,.3,1)', pseudoElement: '::view-transition-new(root)' }
          );
        }).catch(function () {});
        var limpar = function () { d.documentElement.classList.remove('bv-theming'); };
        vt.finished.then(limpar, limpar);
      } catch (e) {
        d.documentElement.classList.remove('bv-theming');
        done();
      }
    } else done();
  };
  function mount() {
    if (d.getElementById('bv-theme-btn')) return;
    var b = d.createElement('button');
    b.id = 'bv-theme-btn';
    b.type = 'button';
    b.setAttribute('aria-label', label());
    b.onclick = w.bvToggleTheme;
    (d.body || d.documentElement).appendChild(b);
    refresh();
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mount);
  else mount();

  // ── Micro-tilt premium em cards de vitrine (segue o cursor em 3D) ──
  // Seguro: só altera transform inline; sem injeção de DOM, sem mudar layout.
  // Funciona com conteúdo dinâmico (delegação por seletor) e respeita preferências.
  (function () {
    var SEL = '.feat-card, .vit-card, .loja-card, .prod-card';
    var fine, calm;
    try {
      fine = w.matchMedia('(hover:hover) and (pointer:fine)').matches;
      calm = w.matchMedia('(prefers-reduced-motion:reduce)').matches;
    } catch (e) { fine = false; calm = true; }
    if (!fine || calm) return;

    var active = null, raf = 0, lastX = 0, lastY = 0;
    function frame() {
      raf = 0;
      if (!active) return;
      var r = active.getBoundingClientRect();
      var px = (lastX - r.left) / r.width;  // 0..1
      var py = (lastY - r.top) / r.height;
      var ry = (px - 0.5) * 9;              // rotação Y (graus) — máx ±4.5
      var rx = (0.5 - py) * 9;              // rotação X
      active.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-5px)';
      active.style.setProperty('--bv-mx', (px * 100).toFixed(1) + '%');
      active.style.setProperty('--bv-my', (py * 100).toFixed(1) + '%');
    }
    d.addEventListener('pointermove', function (e) {
      var card = e.target && e.target.closest ? e.target.closest(SEL) : null;
      if (card !== active) {
        if (active) reset(active);
        active = card;
        if (active) { active.style.transition = 'transform .14s cubic-bezier(.2,.7,.3,1)'; active.style.transformStyle = 'preserve-3d'; }
      }
      if (!active) return;
      lastX = e.clientX; lastY = e.clientY;
      if (!raf) raf = w.requestAnimationFrame(frame);
    }, { passive: true });
    function reset(el) {
      el.style.transition = 'transform .45s cubic-bezier(.2,.7,.3,1)';
      el.style.transform = '';
      w.setTimeout(function () { if (el !== active) { el.style.transition = ''; el.style.transformStyle = ''; } }, 460);
    }
    d.addEventListener('pointerout', function (e) {
      if (active && (!e.relatedTarget || !active.contains(e.relatedTarget))) {
        var was = active; active = null; reset(was);
      }
    }, { passive: true });
  })();
})(window, document);
