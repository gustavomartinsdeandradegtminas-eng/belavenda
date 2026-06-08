/**
 * BelaVenda — Ilustrações de produto (bv-art.js)
 * ─────────────────────────────────────────────────────────
 * Ilustrações coloridas (SVG, sem dependência externa) que representam
 * cada tipo de produto, para um catálogo mais bonito.
 *
 * API global:
 *   prodArt(key)              -> string SVG da ilustração
 *   prodImg(imagem, categoria)-> HTML pronto: <img> (se URL/base64) ou ilustração
 *
 * "imagem" do produto pode ser: URL, data URI, uma CHAVE de ilustração
 * (ex.: 'lipstick', 'perfume') ou uma chave antiga de ícone (mapeada por ALIAS).
 */
;(function (w, d) {
  'use strict';

  // ── Ilustrações (viewBox 0 0 48 48, cores planas) ───────────────
  var ART = {
    lipstick: '<rect x="19" y="23" width="11" height="19" rx="2" fill="#d4a24e"/><rect x="19" y="22" width="11" height="3" fill="#9c7636"/><path d="M20 23 v-7 a4 4 0 0 1 8 0 v7 z" fill="#e91e8c"/><rect x="22" y="12" width="2" height="9" rx="1" fill="#f8bbd0" opacity=".7"/>',
    gloss: '<rect x="20" y="20" width="8" height="22" rx="3" fill="#f48fb1"/><rect x="21.5" y="23" width="5" height="13" rx="2" fill="#ec407a" opacity=".55"/><rect x="21" y="12" width="6" height="9" rx="1" fill="#c2185b"/><rect x="22.5" y="6" width="3" height="7" rx="1.5" fill="#880e4f"/>',
    foundation: '<rect x="17" y="18" width="14" height="23" rx="3" fill="#e8c39e"/><rect x="19" y="27" width="10" height="12" rx="2" fill="#d2a877"/><rect x="20" y="12" width="8" height="7" fill="#caa074"/><rect x="19" y="9" width="10" height="4" rx="1" fill="#7c5c3a"/><rect x="27" y="6" width="6" height="3" rx="1.5" fill="#7c5c3a"/>',
    palette: '<rect x="8" y="16" width="32" height="17" rx="3" fill="#5b3b8c"/><rect x="8" y="16" width="32" height="5" rx="3" fill="#7c3aed"/><rect x="11" y="24" width="6" height="6" rx="1" fill="#e91e8c"/><rect x="19" y="24" width="6" height="6" rx="1" fill="#f0b429"/><rect x="27" y="24" width="6" height="6" rx="1" fill="#14b8a6"/><rect x="33.5" y="24" width="4" height="6" rx="1" fill="#fce4ec"/>',
    powder: '<path d="M13 27 a11 11 0 0 1 22 0 z" fill="#f48fb1"/><path d="M13 27 a11 11 0 0 0 22 0 z" fill="#fce4ec"/><circle cx="24" cy="27" r="6" fill="#f8bbd0"/><circle cx="24" cy="16" r="2" fill="#c2185b"/>',
    mascara: '<rect x="21" y="20" width="7" height="22" rx="3" fill="#1f2937"/><rect x="22" y="11" width="5" height="10" rx="1" fill="#374151"/><path d="M24.5 4 v7" stroke="#1f2937" stroke-width="1.4"/><path d="M22.5 6 h4 M22.5 8 h4 M22.5 10 h4" stroke="#1f2937" stroke-width="1.3"/>',
    blush: '<circle cx="20" cy="28" r="9" fill="#f48fb1"/><circle cx="20" cy="28" r="5" fill="#ec407a" opacity=".5"/><rect x="28" y="9" width="3" height="15" rx="1.5" fill="#9c7636"/><path d="M27.5 22 h4 l-1 7 h-2 z" fill="#e8c39e"/>',
    perfume: '<rect x="16" y="19" width="16" height="22" rx="4" fill="#f48fb1"/><rect x="18" y="24" width="12" height="13" rx="2" fill="#f8bbd0" opacity=".55"/><rect x="21" y="13" width="6" height="7" fill="#c2185b"/><rect x="20" y="8" width="8" height="5" rx="1.5" fill="#880e4f"/><rect x="23" y="5" width="2" height="4" fill="#880e4f"/>',
    perfumeWood: '<rect x="16" y="19" width="16" height="22" rx="4" fill="#d9a066"/><rect x="18" y="24" width="12" height="13" rx="2" fill="#f0d2a8" opacity=".5"/><rect x="21" y="13" width="6" height="7" fill="#6b4423"/><rect x="20" y="8" width="8" height="5" rx="1.5" fill="#4a2f17"/><rect x="23" y="5" width="2" height="4" fill="#4a2f17"/>',
    serum: '<rect x="18" y="20" width="12" height="21" rx="3" fill="#d9a066"/><rect x="20" y="26" width="8" height="12" rx="2" fill="#b5651d" opacity=".5"/><rect x="19" y="14" width="10" height="6" rx="1" fill="#374151"/><rect x="22" y="6" width="4" height="9" rx="2" fill="#475569"/><rect x="23" y="4" width="2" height="3" rx="1" fill="#1f2937"/>',
    cream: '<rect x="14" y="24" width="20" height="15" rx="4" fill="#fce4ec"/><rect x="13" y="18" width="22" height="8" rx="3" fill="#f48fb1"/><rect x="16" y="20" width="16" height="3" rx="1.5" fill="#f8bbd0"/>',
    toner: '<rect x="18" y="16" width="12" height="25" rx="3" fill="#bfe3ef"/><rect x="20" y="24" width="8" height="14" rx="2" fill="#8fd0e3" opacity=".6"/><rect x="21" y="10" width="6" height="6" fill="#0ea5e9"/><rect x="20" y="7" width="8" height="4" rx="1" fill="#0369a1"/>',
    sunscreen: '<rect x="19" y="18" width="11" height="24" rx="4" fill="#ffd23f"/><rect x="21" y="13" width="7" height="6" fill="#f0a800"/><rect x="20" y="10" width="9" height="4" rx="1" fill="#d98c00"/><circle cx="24.5" cy="31" r="5" fill="#fff4cc"/><path d="M24.5 23.5 v2 M24.5 36.5 v-2 M17 31 h2 M32 31 h-2" stroke="#f0a800" stroke-width="1.3"/>',
    nail: '<rect x="18" y="22" width="12" height="18" rx="2" fill="#e91e8c"/><rect x="19" y="31" width="10" height="8" rx="1" fill="#c2185b" opacity=".55"/><rect x="21" y="14" width="6" height="8" fill="#1f2937"/><rect x="20" y="7" width="8" height="8" rx="2" fill="#111827"/>',
    nailRed: '<rect x="18" y="22" width="12" height="18" rx="2" fill="#ef4444"/><rect x="19" y="31" width="10" height="8" rx="1" fill="#b91c1c" opacity=".55"/><rect x="21" y="14" width="6" height="8" fill="#1f2937"/><rect x="20" y="7" width="8" height="8" rx="2" fill="#111827"/>',
    shampoo: '<path d="M18 20 h12 v20 a2 2 0 0 1-2 2 h-8 a2 2 0 0 1-2-2 z" fill="#38bdf8"/><rect x="20" y="26" width="8" height="13" rx="1" fill="#7dd3fc" opacity=".55"/><rect x="19" y="15" width="10" height="5" rx="1" fill="#0ea5e9"/><path d="M19 15 l2-4 h6 l2 4 z" fill="#0369a1"/>',
    hairoil: '<rect x="18" y="22" width="12" height="19" rx="3" fill="#86b049"/><rect x="20" y="27" width="8" height="11" rx="2" fill="#6e9438" opacity=".5"/><rect x="19" y="15" width="10" height="7" rx="1" fill="#374151"/><rect x="22" y="7" width="4" height="9" rx="2" fill="#475569"/><path d="M30 17 q4-1 4 3 q-4 1-4-3z" fill="#34c759"/>',
    lotion: '<rect x="17" y="19" width="14" height="22" rx="3" fill="#fde7f1"/><rect x="17" y="27" width="14" height="8" fill="#f48fb1"/><rect x="20" y="13" width="6" height="6" fill="#c2185b"/><path d="M20 13 v-2 h6 v-2 h4" stroke="#880e4f" stroke-width="2" fill="none"/>',
    soap: '<rect x="18" y="20" width="13" height="21" rx="3" fill="#a7f3d0"/><rect x="18" y="28" width="13" height="8" fill="#34d399"/><rect x="21" y="13" width="6" height="7" fill="#059669"/><path d="M21 13 v-2 h6 v-2 h4" stroke="#047857" stroke-width="2" fill="none"/><circle cx="34" cy="14" r="2" fill="#a7f3d0"/><circle cx="37" cy="18" r="1.3" fill="#a7f3d0"/>',
    men: '<rect x="17" y="20" width="14" height="21" rx="3" fill="#334155"/><rect x="19" y="26" width="10" height="12" rx="2" fill="#1e293b"/><rect x="20" y="13" width="8" height="7" fill="#475569"/><rect x="19" y="9" width="10" height="5" rx="1" fill="#0f172a"/><path d="M21 31 q3 3 6 0" stroke="#94a3b8" stroke-width="1.4" fill="none"/>',
    gift: '<rect x="13" y="22" width="22" height="16" rx="2" fill="#e91e8c"/><rect x="13" y="22" width="22" height="6" fill="#c2185b"/><rect x="22" y="16" width="4" height="22" fill="#f0b429"/><path d="M24 17 q-7-7-9 0 q5 3 9 0 q4 3 9 0 q-2-7-9 0z" fill="#f0b429"/>',
    cosmetic: '<rect x="18" y="18" width="12" height="23" rx="3" fill="#c4b5fd"/><rect x="20" y="11" width="8" height="7" fill="#7c3aed"/><path d="M24 4 l1.4 3.3 L29 8.7 l-3.4 1.4 L24 13.5 l-1.4-3.4 L19 8.7 l3.4-1.4z" fill="#f0b429"/>'
  };

  // chaves antigas (ícones) ou sinônimos -> ilustração
  var ALIAS = {
    batom: 'lipstick', base: 'foundation', sombra: 'palette', paleta: 'palette',
    eye: 'mascara', 'lips-kiss': 'gloss', paintbrush: 'blush', mouth: 'lipstick',
    sparkles: 'cosmetic', sparkle: 'cosmetic', 'glowing-star': 'cosmetic', star: 'cosmetic',
    ribbon: 'cosmetic', 'theater-masks': 'mascara', 'nail-polish': 'nail', pencil: 'mascara',
    droplet: 'serum', dropper: 'serum', 'lotion-bottle': 'serum', bubbles: 'soap',
    sun: 'sunscreen', 'crescent-moon': 'cream', herb: 'hairoil', clover: 'cream',
    'test-tube': 'toner', pill: 'cream', hibiscus: 'perfume', 'wood-log': 'perfumeWood',
    citrus: 'perfume', rose: 'perfume', gem: 'perfume', bamboo: 'toner', candle: 'perfume',
    strawberry: 'perfume', 'lightning-bolt': 'perfumeWood', 'face-massage': 'cream',
    'oil-lamp': 'hairoil', fire: 'shampoo', 'flexed-bicep': 'men', bathtub: 'soap',
    'honey-pot': 'cream', lemon: 'soap', beard: 'men', 'person-beard': 'men', scissors: 'men',
    trophy: 'gift', 'hair-comb': 'shampoo', lotion: 'lotion', 'cherry-blossom': 'perfume',
    'circle-red': 'nailRed', 'circle-purple': 'nail', 'circle-white': 'cream', 'heart-black': 'nail',
    wave: 'toner', soap: 'soap', gift: 'gift', perfume: 'perfume', lipstick: 'lipstick',
    nail: 'nail', cream: 'cream', serum: 'serum', shampoo: 'shampoo', men: 'men'
  };

  // fallback por categoria (quando não há imagem)
  var CAT_ART = {
    'Maquiagem': 'lipstick', 'Perfumaria': 'perfume', 'Skincare': 'serum',
    'Cabelos': 'shampoo', 'Corpo': 'lotion', 'Corpo e Banho': 'lotion',
    'Unhas': 'nail', 'Proteção Solar': 'sunscreen', 'Solar': 'sunscreen',
    'Sobrancelhas e Cílios': 'mascara', 'Masculino': 'men', 'Cuidados': 'cosmetic', 'Outros': 'gift'
  };

  function resolveKey(imagem, categoria) {
    if (imagem && ART[imagem]) return imagem;
    if (imagem && ALIAS[imagem]) return ALIAS[imagem];
    if (categoria && CAT_ART[categoria]) return CAT_ART[categoria];
    return 'cosmetic';
  }

  w.prodArt = function (key) {
    var inner = ART[key] || ART[ALIAS[key]] || ART.cosmetic;
    return '<svg class="prod-art" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + inner + '</svg>';
  };

  // ── Fotos reais (Pexels CDN) por tipo de produto ───────────────
  // Todas as fotos foram verificadas: sem nomes ou logotipos de marcas visíveis.
  // Fallback automático para a ilustração SVG se a foto não carregar.
  var PHOTO = {
    // Maquiagem — batons, pós, sombras (close-ups sem embalagem com marca)
    lipstick:    [7256093, 6648498, 7810570],
    gloss:       [6648488, 34321279, 7810573],
    foundation:  [7256108, 7290632, 7256082],
    palette:     [4889720, 32388555, 7290640],
    powder:      [15657763, 14801435, 7290206],
    mascara:     [6473740, 3951888, 7588587],
    blush:       [2533266, 7290627, 4889720],
    // Fragrâncias — frascos genéricos/artísticos sem rótulo de marca
    perfume:     [7670692, 1666404, 20895893],
    perfumeWood: [7405394, 30263576, 9221913],
    // Skincare — gotejadores, potes e texturas sem embalagem com marca
    serum:       [4735937, 16038186, 6914613],
    toner:       [3762879, 8102129, 7321654],
    cream:       [10221858, 6690232, 36339062],
    sunscreen:   [7466763, 8157696, 16378487],
    // Unhas — aplicação e frascos genéricos
    nail:        [6954960, 2281695, 6954964],
    nailRed:     [10609757, 6954960, 1373748],
    // Cabelos e corpo — frascos minimalistas / ingredientes naturais
    shampoo:     [4154194, 13516802, 8167172],
    hairoil:     [8131568, 9775170, 4735937],
    lotion:      [14788377, 6847856, 27742135],
    soap:        [7789606, 7032151, 7797117],
    // Masculino — acessórios de grooming e frasco de colônia sem marca
    men:         [8789601, 30263576, 5828579],
    // Presentes e cosméticos em geral
    gift:        [5632335, 1327689, 12969358],
    cosmetic:    [5632335, 7290627, 12969358]
  };
  function photoUrl(id){ return 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=500&h=500'; }
  function hashStr(s){ s = String(s == null ? '' : s); var h = 0; for (var i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; } return Math.abs(h); }

  // se a foto falhar, troca pela ilustração
  w.bvImgFallback = function (img, key) { try { img.parentNode.innerHTML = w.prodArt(key); } catch (e) {} };

  function prodPhoto(key, seed) {
    var arr = PHOTO[key];
    if (!arr || !arr.length) return w.prodArt(key);
    var id = arr[hashStr(seed) % arr.length];
    return '<img src="' + photoUrl(id) + '" class="prod-photo" loading="lazy" alt="" onerror="bvImgFallback(this,\'' + key + '\')">';
  }

  w.prodImg = function (imagem, categoria, seed) {
    if (imagem && /^(https?:|data:)/.test(imagem)) {
      return '<img src="' + imagem + '" class="prod-photo" loading="lazy" alt="">';
    }
    var key = resolveKey(imagem, categoria);
    if (PHOTO[key]) return prodPhoto(key, seed != null ? seed : (imagem || key));
    return w.prodArt(key);
  };

  // chaves disponíveis (para montar seletores no painel)
  w.PROD_ART_KEYS = Object.keys(ART);

  // CSS
  function injectCss() {
    if (d.getElementById('bv-art-css')) return;
    var s = d.createElement('style');
    s.id = 'bv-art-css';
    s.textContent =
      '.prod-art{display:block;width:auto;height:78%;max-width:80%;margin:auto}' +
      '.prod-photo{width:100%;height:100%;object-fit:cover}' +
      '.prod-img-cell .prod-art,.img-opt .prod-art{height:100%;width:100%;max-width:100%}' +
      '.img-opt .prod-art{padding:4px}' +
      '.img-opt .prod-photo,.prod-img-cell .prod-photo{border-radius:6px}';
    (d.head || d.documentElement).appendChild(s);
  }
  injectCss();
})(window, document);
