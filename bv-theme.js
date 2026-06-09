/**
 * BelaVenda — Tema claro/escuro (bv-theme.js)
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
  function apply(t) { d.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light'); }

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
    // botão de tema
    '#bv-theme-btn{position:fixed;right:18px;bottom:18px;width:48px;height:48px;border-radius:50%;border:1px solid rgba(0,0,0,.06);cursor:pointer;z-index:150;background:#fff;color:#c2185b;box-shadow:0 6px 22px rgba(136,14,79,.28);display:grid;place-items:center;transition:transform .2s,background .3s,color .3s;padding:0}' +
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
    // respeita preferência de menos movimento
    '@media(prefers-reduced-motion:reduce){.bv-anim,.prod-photo,.skel::after,.dot-aberta{animation:none!important}*{scroll-behavior:auto!important}}';

  var st = d.createElement('style');
  st.id = 'bv-theme-css';
  st.textContent = css;
  (d.head || d.documentElement).appendChild(st);

  // re-dispara a animação de entrada num elemento (troca de aba/seção)
  w.bvAnimate = function (el) { if (!el) return; el.classList.remove('bv-anim'); void el.offsetWidth; el.classList.add('bv-anim'); };

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
    try { localStorage.setItem(KEY, t); } catch (e) {}
    apply(t);
    refresh();
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
})(window, document);
