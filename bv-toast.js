/**
 * BelaVenda — Toasts + diálogos elegantes (bv-toast.js)
 * ─────────────────────────────────────────────────────────
 * Substitui alert()/confirm()/prompt() nativos por componentes próprios,
 * coerentes com a identidade e o modo escuro (usa variáveis de tema).
 *
 *   bvToast('Salvo!', 'success'|'error'|'info')
 *   await bvConfirm('Excluir?', {okText:'Excluir', danger:true})  -> boolean
 *   await bvPrompt({title, label, value, type, prefix})           -> string|null
 */
;(function (w, d) {
  'use strict';
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  var IC={
    success:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M20 6 9 17l-5-5"/></svg>',
    error:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
    info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/></svg>'
  };

  function injectCss(){
    if(d.getElementById('bv-toast-css'))return;
    var s=d.createElement('style');s.id='bv-toast-css';
    s.textContent=
      '#bv-toasts{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:99998;display:flex;flex-direction:column;gap:9px;align-items:center;pointer-events:none}'+
      '.bv-toast{display:flex;align-items:center;gap:10px;background:var(--surface,#fff);color:var(--text,#111);border:1px solid var(--border,#eee);border-left:4px solid var(--primary,#c2185b);border-radius:12px;padding:12px 16px;box-shadow:0 12px 34px rgba(0,0,0,.2);font-size:.88rem;font-weight:600;max-width:92vw;opacity:0;transform:translateY(14px) scale(.98);transition:opacity .25s,transform .25s;pointer-events:auto}'+
      '.bv-toast.show{opacity:1;transform:none}'+
      '.bv-toast.success{border-left-color:#10b981}.bv-toast.success .ti{color:#10b981}'+
      '.bv-toast.error{border-left-color:#ef4444}.bv-toast.error .ti{color:#ef4444}'+
      '.bv-toast.info{border-left-color:var(--primary,#c2185b)}.bv-toast.info .ti{color:var(--primary,#c2185b)}'+
      '.bv-toast .ti{flex:none;display:flex}'+
      '.bv-dlg-ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;visibility:hidden;transition:opacity .2s,visibility .2s;backdrop-filter:blur(3px)}'+
      '.bv-dlg-ov.open{opacity:1;visibility:visible}'+
      '.bv-dlg{background:var(--surface,#fff);color:var(--text,#111);border:1px solid var(--border,#eee);border-radius:18px;max-width:380px;width:100%;padding:24px;box-shadow:0 24px 64px rgba(0,0,0,.35);transform:translateY(16px) scale(.97);transition:transform .22s cubic-bezier(.2,.7,.3,1)}'+
      '.bv-dlg-ov.open .bv-dlg{transform:none}'+
      '.bv-dlg-ic{width:46px;height:46px;border-radius:13px;display:grid;place-items:center;margin-bottom:14px;background:var(--primary-l,#fce4ec);color:var(--primary,#c2185b)}'+
      '.bv-dlg-ic.danger{background:#fee2e2;color:#ef4444}'+
      '.bv-dlg h3{font-family:"Playfair Display",Georgia,serif;font-size:1.18rem;font-weight:800;margin-bottom:6px;color:var(--text,#111)}'+
      '.bv-dlg p{font-size:.88rem;color:var(--muted,#666);margin-bottom:18px;line-height:1.55}'+
      '.bv-dlg label{display:block;font-size:.76rem;font-weight:700;color:var(--text,#111);margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px}'+
      '.bv-dlg-inwrap{display:flex;align-items:center;gap:8px;border:1.5px solid var(--border2,#e5e7eb);border-radius:11px;padding:0 13px;margin-bottom:18px;background:var(--bg,#fff);transition:border-color .2s,box-shadow .2s}'+
      '.bv-dlg-inwrap:focus-within{border-color:var(--primary,#c2185b);box-shadow:0 0 0 3px rgba(194,24,91,.13)}'+
      '.bv-dlg-inwrap .pf{font-weight:800;color:var(--primary,#c2185b)}'+
      '.bv-dlg-inwrap input{flex:1;min-width:0;border:none;background:transparent;outline:none;padding:12px 0;font-size:1rem;color:var(--text,#111);font-family:inherit}'+
      '.bv-dlg-actions{display:flex;gap:10px;justify-content:flex-end}'+
      '.bv-dlg-btn{padding:10px 18px;border-radius:10px;font-weight:700;font-size:.88rem;cursor:pointer;border:none;font-family:inherit;transition:filter .2s,transform .15s}'+
      '.bv-dlg-btn:active{transform:translateY(1px)}'+
      '.bv-dlg-cancel{background:var(--bg,#f5f5f5);color:var(--text,#111);border:1px solid var(--border2,#e5e7eb)}'+
      '.bv-dlg-ok{background:var(--grad,linear-gradient(135deg,#880e4f,#c2185b,#e91e8c));color:#fff;box-shadow:0 4px 14px rgba(194,24,91,.3)}'+
      '.bv-dlg-ok:hover{filter:brightness(1.07)}'+
      '.bv-dlg-ok.danger{background:linear-gradient(135deg,#b91c1c,#ef4444);box-shadow:0 4px 14px rgba(239,68,68,.3)}';
    (d.head||d.documentElement).appendChild(s);
  }

  function layer(){var l=d.getElementById('bv-toasts');if(!l){l=d.createElement('div');l.id='bv-toasts';(d.body||d.documentElement).appendChild(l);}return l;}

  w.bvToast=function(msg,type){
    injectCss(); type=(type==='success'||type==='error')?type:'info';
    var t=d.createElement('div'); t.className='bv-toast '+type;
    t.innerHTML='<span class="ti">'+(IC[type]||IC.info)+'</span><span>'+esc(msg)+'</span>';
    layer().appendChild(t);
    requestAnimationFrame(function(){t.classList.add('show');});
    setTimeout(function(){t.classList.remove('show');setTimeout(function(){t.remove();},320);},2600);
  };

  // diálogo genérico; resolve com o valor passado por btnOk()
  function dialog(html, wire){
    injectCss();
    return new Promise(function(resolve){
      var ov=d.createElement('div'); ov.className='bv-dlg-ov';
      ov.innerHTML='<div class="bv-dlg" role="dialog" aria-modal="true">'+html+'</div>';
      d.body.appendChild(ov);
      var done=false;
      function close(val){ if(done)return; done=true; ov.classList.remove('open'); setTimeout(function(){ov.remove();},220); resolve(val); }
      ov.addEventListener('click',function(e){if(e.target===ov)close(wire.cancelVal);});
      d.addEventListener('keydown',function esc(e){if(e.key==='Escape'){close(wire.cancelVal);d.removeEventListener('keydown',esc);}});
      requestAnimationFrame(function(){ov.classList.add('open'); wire.init(ov,close);});
    });
  }

  w.bvConfirm=function(msg,opts){
    opts=opts||{};
    var html=
      '<div class="bv-dlg-ic'+(opts.danger?' danger':'')+'">'+(opts.danger?IC.error:IC.info)+'</div>'+
      '<h3>'+esc(opts.title||'Confirmar')+'</h3>'+
      '<p>'+esc(msg||'')+'</p>'+
      '<div class="bv-dlg-actions"><button class="bv-dlg-btn bv-dlg-cancel">'+esc(opts.cancelText||'Cancelar')+'</button>'+
      '<button class="bv-dlg-btn bv-dlg-ok'+(opts.danger?' danger':'')+'">'+esc(opts.okText||'Confirmar')+'</button></div>';
    return dialog(html,{cancelVal:false,init:function(ov,close){
      ov.querySelector('.bv-dlg-cancel').onclick=function(){close(false);};
      ov.querySelector('.bv-dlg-ok').onclick=function(){close(true);};
      ov.querySelector('.bv-dlg-ok').focus();
    }});
  };

  w.bvPrompt=function(opts){
    opts=opts||{};
    var html=
      '<h3>'+esc(opts.title||'')+'</h3>'+
      (opts.label?'<label>'+esc(opts.label)+'</label>':'')+
      '<div class="bv-dlg-inwrap">'+(opts.prefix?'<span class="pf">'+esc(opts.prefix)+'</span>':'')+
        '<input id="bv-dlg-input" type="'+(opts.type||'text')+'" value="'+esc(opts.value==null?'':opts.value)+'" '+(opts.placeholder?'placeholder="'+esc(opts.placeholder)+'"':'')+'></div>'+
      '<div class="bv-dlg-actions"><button class="bv-dlg-btn bv-dlg-cancel">'+esc(opts.cancelText||'Cancelar')+'</button>'+
      '<button class="bv-dlg-btn bv-dlg-ok">'+esc(opts.okText||'Salvar')+'</button></div>';
    return dialog(html,{cancelVal:null,init:function(ov,close){
      var inp=ov.querySelector('#bv-dlg-input');
      inp.focus(); try{inp.select();}catch(e){}
      ov.querySelector('.bv-dlg-cancel').onclick=function(){close(null);};
      ov.querySelector('.bv-dlg-ok').onclick=function(){close(inp.value);};
      inp.addEventListener('keydown',function(e){if(e.key==='Enter')close(inp.value);});
    }});
  };
})(window, document);
