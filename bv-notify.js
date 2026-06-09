/**
 * BelaVenda — Central de notificações (bv-notify.js)
 * ─────────────────────────────────────────────────────────
 * App estático: as notificações são DERIVADAS do estado (localStorage).
 * Cada evento tem um id estável; "não lida" = id ainda não visto.
 * "Marcar como lidas" salva os ids atuais. Novos eventos → reaparecem.
 *
 * Uso:
 *   BVNotify.mount({
 *     mountSel:'#bv-notify-slot',
 *     storageKey:'bv_notif_seen_<id>',
 *     compute:function(){ return [{id,ic,title,text,ts}] },
 *     emptyText:'Sem novidades.'
 *   })
 *   BVNotify.refresh()   // recalcula (ex.: após mudança de dados)
 */
;(function (w, d) {
  'use strict';
  var CFG = null, seen = new Set();

  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function ago(ts){
    if(!ts)return'';
    var diff=(Date.now()-new Date(ts).getTime())/1000;
    if(diff<0)return'agora';
    if(diff<60)return'agora';
    if(diff<3600)return Math.floor(diff/60)+' min';
    if(diff<86400)return Math.floor(diff/3600)+' h';
    var dd=Math.floor(diff/86400);
    if(dd<30)return dd+'d';
    try{return new Date(ts).toLocaleDateString('pt-BR');}catch(e){return'';}
  }
  var BELL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" width="21" height="21"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>';

  function loadSeen(){try{return new Set(JSON.parse(localStorage.getItem(CFG.storageKey)||'[]'));}catch(e){return new Set();}}
  function saveSeen(){try{localStorage.setItem(CFG.storageKey,JSON.stringify(Array.from(seen)));}catch(e){}}
  function items(){var a=[];try{a=CFG.compute()||[];}catch(e){a=[];}return a;}

  function render(){
    if(!CFG)return;
    var list=items();
    var unread=list.filter(function(n){return !seen.has(n.id);});
    var b=d.getElementById('bvn-badge');
    if(b){ if(unread.length){b.textContent=unread.length>9?'9+':String(unread.length);b.style.display='flex';} else b.style.display='none'; }
    var body=d.getElementById('bvn-list');
    if(body){
      if(!list.length){
        body.innerHTML='<div class="bvn-empty">'+BELL+'<p>'+esc(CFG.emptyText||'Sem notificações por enquanto.')+'</p></div>';
      } else {
        body.innerHTML=list.map(function(n){
          var u=!seen.has(n.id);
          return '<div class="bvn-item'+(u?' unread':'')+'">'+
            '<span class="bvn-ic">'+(n.ic||BELL)+'</span>'+
            '<span class="bvn-tx"><span class="bvn-t">'+esc(n.title)+'</span>'+(n.text?'<span class="bvn-d">'+esc(n.text)+'</span>':'')+'</span>'+
            (n.ts?'<span class="bvn-time">'+ago(n.ts)+'</span>':'')+
          '</div>';
        }).join('');
      }
    }
    var mk=d.getElementById('bvn-mark');
    if(mk)mk.style.visibility=unread.length?'visible':'hidden';
  }
  function openPanel(){render();var p=d.getElementById('bvn-panel');if(p)p.classList.add('open');}
  function closePanel(){var p=d.getElementById('bvn-panel');if(p)p.classList.remove('open');}
  function toggle(){var p=d.getElementById('bvn-panel');if(p&&p.classList.contains('open'))closePanel();else openPanel();}
  function markAll(){items().forEach(function(n){seen.add(n.id);});saveSeen();render();}

  function injectCss(){
    if(d.getElementById('bvn-css'))return;
    var s=d.createElement('style');s.id='bvn-css';
    s.textContent=
      '#bv-notify-slot{position:relative;display:inline-flex}'+
      '.bvn-bell{position:relative;width:40px;height:40px;border-radius:50%;border:none;cursor:pointer;background:rgba(255,255,255,.16);color:#fff;display:grid;place-items:center;transition:background .2s;padding:0}'+
      '.bvn-bell:hover{background:rgba(255,255,255,.28)}'+
      '.bvn-bell:focus-visible{outline:2px solid rgba(255,255,255,.7);outline-offset:2px}'+
      '.bvn-badge{position:absolute;top:-3px;right:-3px;min-width:18px;height:18px;padding:0 5px;border-radius:10px;background:#ef4444;color:#fff;font-size:.66rem;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px rgba(0,0,0,.15);font-family:Inter,system-ui,sans-serif}'+
      '.bvn-panel{position:absolute;top:calc(100% + 10px);right:0;width:340px;max-width:88vw;background:var(--surface,#fff);border:1px solid var(--border,#eee);border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.28);opacity:0;visibility:hidden;transform:translateY(-8px);transition:opacity .2s,transform .2s;z-index:300;overflow:hidden}'+
      '.bvn-panel.open{opacity:1;visibility:visible;transform:translateY(0)}'+
      '.bvn-head{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid var(--border,#eee);font-weight:800;font-size:.95rem;color:var(--text,#111);font-family:"Playfair Display",Georgia,serif}'+
      '.bvn-mark{background:none;border:none;cursor:pointer;color:var(--primary,#c2185b);font-size:.76rem;font-weight:700;font-family:inherit}'+
      '.bvn-mark:hover{text-decoration:underline}'+
      '.bvn-list{max-height:min(420px,70vh);overflow-y:auto}'+
      '.bvn-item{display:flex;gap:11px;align-items:flex-start;padding:12px 16px;border-bottom:1px solid var(--border,#f3f3f3);position:relative}'+
      '.bvn-item:last-child{border-bottom:none}'+
      '.bvn-item.unread{background:var(--primary-l,#fce4ec)}'+
      '.bvn-item.unread::before{content:"";position:absolute;left:6px;top:50%;transform:translateY(-50%);width:5px;height:5px;border-radius:50%;background:var(--primary,#c2185b)}'+
      '.bvn-ic{flex:none;width:34px;height:34px;border-radius:10px;background:var(--primary-l,#fce4ec);color:var(--primary,#c2185b);display:grid;place-items:center}'+
      '.bvn-ic .ic{width:1rem;height:1rem}'+
      '.bvn-tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}'+
      '.bvn-t{font-size:.85rem;font-weight:700;color:var(--text,#111);line-height:1.25}'+
      '.bvn-d{font-size:.78rem;color:var(--muted,#777);line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
      '.bvn-time{flex:none;font-size:.68rem;color:var(--muted-l,#aaa);font-weight:600;white-space:nowrap;padding-top:2px}'+
      '.bvn-empty{text-align:center;padding:38px 20px;color:var(--muted,#999)}'+
      '.bvn-empty svg{width:34px;height:34px;opacity:.4;margin-bottom:8px}'+
      '.bvn-empty p{font-size:.85rem}'+
      '@media(max-width:560px){.bvn-panel{position:fixed;top:60px;right:8px;left:8px;width:auto;max-width:none}}';
    (d.head||d.documentElement).appendChild(s);
  }

  w.BVNotify = {
    mount:function(cfg){
      CFG=cfg; seen=loadSeen();
      var slot=d.querySelector(cfg.mountSel);
      if(!slot)return;
      injectCss();
      slot.innerHTML='<button id="bvn-bell" class="bvn-bell" type="button" aria-label="Notificações">'+BELL+'<span id="bvn-badge" class="bvn-badge" style="display:none"></span></button>'+
        '<div id="bvn-panel" class="bvn-panel" role="dialog" aria-label="Notificações"><div class="bvn-head"><span>Notificações</span><button id="bvn-mark" class="bvn-mark" type="button">Marcar lidas</button></div><div id="bvn-list" class="bvn-list"></div></div>';
      d.getElementById('bvn-bell').addEventListener('click',function(e){e.stopPropagation();toggle();});
      d.getElementById('bvn-mark').addEventListener('click',function(e){e.stopPropagation();markAll();});
      d.addEventListener('click',function(e){
        var p=d.getElementById('bvn-panel'), bell=d.getElementById('bvn-bell');
        if(p&&p.classList.contains('open')&&!p.contains(e.target)&&bell&&!bell.contains(e.target))closePanel();
      });
      d.addEventListener('keydown',function(e){if(e.key==='Escape')closePanel();});
      render();
    },
    refresh:render
  };
})(window, document);
