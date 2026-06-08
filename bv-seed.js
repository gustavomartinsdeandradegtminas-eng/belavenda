/**
 * BelaVenda — Dados de demonstração (bv-seed.js)
 * ─────────────────────────────────────────────────────────
 * Popula o localStorage com revendedoras, produtos e avaliações
 * de exemplo na PRIMEIRA visita (apenas se ainda não houver dados).
 * Assim o grupo vê a plataforma "cheia" para avaliar.
 *
 * Login de revendedora demo:  qualquer e-mail abaixo  ·  senha: demo1234
 *   camila@belavenda.app · renata@belavenda.app · julia@belavenda.app
 *   aline@belavenda.app · bella@belavenda.app · renascer@belavenda.app
 *
 * Para limpar e repovoar: localStorage.clear() e recarregue.
 * Em produção (com backend real) basta NÃO incluir este script.
 */
;(function () {
  'use strict';
  try {
    var SEED_VERSION = '1';
    // Já populado ou já existe revendedora real? Não mexe.
    if (localStorage.getItem('bv_demo_seeded') === SEED_VERSION) return;
    var existing = JSON.parse(localStorage.getItem('bv_revendedoras') || '[]');
    if (existing.length > 0) { localStorage.setItem('bv_demo_seeded', SEED_VERSION); return; }

    // Mesmo algoritmo de hash do belavenda-api.js (_hashLocal)
    function hashLocal(p) { var h = 0; for (var i = 0; i < p.length; i++) { h = ((h << 5) - h) + p.charCodeAt(i); h |= 0; } return h.toString(36); }
    var PW = hashLocal('demo1234');
    function daysAgo(d) { return new Date(Date.now() - d * 86400000).toISOString(); }

    function R(id, slug, nome, email, tel, cep, cidade, uf, lat, lng, aberta) {
      return { id: id, nome: nome, email: email, telefone: tel, cep: cep, cidade: cidade, estado: uf,
        lat: lat, lng: lng, slugLoja: slug, senhaHash: PW, lojaAberta: aberta, criadoEm: daysAgo(75) };
    }
    function P(id, rev, nome, marca, cat, custo, venda, img) {
      return { id: id, revendedoraId: rev, nome: nome, marca: marca, categoria: cat,
        precoCusto: custo, precoVenda: venda, visivelCatalogo: true, imagem: img, criadoEm: daysAgo(50) };
    }
    function A(rev, n, nome, estrelas, comentario, d) {
      return { id: rev + '-av' + n, pedidoId: rev + '-ped' + n, clienteNome: nome,
        estrelas: estrelas, comentario: comentario, data: daysAgo(d) };
    }

    var revs = [
      R('r1', 'camila-beauty',       'Camila Beauty',            'camila@belavenda.app',   '5511987650001', '04101000', 'São Paulo',        'SP', -23.5893, -46.6345, true),
      R('r2', 'espaco-renata',        'Espaço Renata Cosméticos', 'renata@belavenda.app',   '5511987650002', '05422000', 'São Paulo',        'SP', -23.5670, -46.7020, true),
      R('r3', 'julia-make-skin',      'Júlia Make & Skin',        'julia@belavenda.app',    '5521987650003', '22070000', 'Rio de Janeiro',   'RJ', -22.9710, -43.1820, true),
      R('r4', 'boutique-aline',       'Boutique Aline',           'aline@belavenda.app',    '5541987650004', '80420000', 'Curitiba',         'PR', -25.4410, -49.2880, true),
      R('r5', 'studio-bella-pele',    'Studio Bella Pele',        'bella@belavenda.app',    '5531987650005', '30112000', 'Belo Horizonte',   'MG', -19.9390, -43.9330, true),
      R('r6', 'renascer-cosmeticos',  'Renascer Cosméticos',      'renascer@belavenda.app', '5551987650006', '90450000', 'Porto Alegre',     'RS', -30.0240, -51.2030, false)
    ];

    var prods = {
      r1: [
        P('r1p1', 'r1', 'Batom Líquido Matte Vermelho', 'Ruby Rose', 'Maquiagem',  9.90, 22.90, 'lipstick'),
        P('r1p2', 'r1', 'Base Líquida HD',              'Vult',      'Maquiagem', 24.00, 49.90, 'palette'),
        P('r1p3', 'r1', 'Paleta de Sombras Nude',       'Dailus',    'Maquiagem', 29.00, 59.90, 'paintbrush'),
        P('r1p4', 'r1', 'Máscara para Cílios Volume',   'Ruby Rose', 'Maquiagem', 12.00, 27.90, 'sparkles'),
        P('r1p5', 'r1', 'Iluminador Facial',            'Vult',      'Maquiagem', 18.00, 36.90, 'sparkle')
      ],
      r2: [
        P('r2p1', 'r2', 'Perfume Floral Essencial',     'Natura',      'Perfumaria', 79.00, 149.90, 'perfume'),
        P('r2p2', 'r2', 'Body Splash Cuide-se Bem',     'O Boticário', 'Perfumaria', 34.00,  64.90, 'perfume'),
        P('r2p3', 'r2', 'Hidratante Corporal Tododia',  'Natura',      'Corpo',      29.00,  54.90, 'lotion'),
        P('r2p4', 'r2', 'Sabonete Líquido Nativa SPA',  'O Boticário', 'Corpo',      19.00,  39.90, 'soap'),
        P('r2p5', 'r2', 'Perfume Amadeirado Eudora',    'Eudora',      'Perfumaria', 89.00, 169.90, 'perfume')
      ],
      r3: [
        P('r3p1', 'r3', 'Sérum Facial Vitamina C',      'Payot',  'Skincare',        45.00,  89.90, 'dropper'),
        P('r3p2', 'r3', 'Protetor Solar FPS 50',        'Avon',   'Proteção Solar',  32.00,  62.90, 'sun'),
        P('r3p3', 'r3', 'Creme Anti-idade Noturno',     'Payot',  'Skincare',        55.00, 109.90, 'droplet'),
        P('r3p4', 'r3', 'Água Micelar 5 em 1',          'Avon',   'Skincare',        18.00,  36.90, 'droplet')
      ],
      r4: [
        P('r4p1', 'r4', 'Esmalte Cremoso Rosa',         'Dailus',    'Unhas',   4.50, 11.90, 'nail-polish'),
        P('r4p2', 'r4', 'Kit Manicure Completo',        'Vult',      'Unhas',  22.00, 44.90, 'nail-polish'),
        P('r4p3', 'r4', 'Shampoo Reparador',            'Natura',    'Cabelos', 21.00, 42.90, 'droplet'),
        P('r4p4', 'r4', 'Óleo Capilar Nutritivo',       'O Boticário','Cabelos',28.00, 56.90, 'dropper'),
        P('r4p5', 'r4', 'Máscara Capilar Hidratação',   'Natura',    'Cabelos', 30.00, 59.90, 'lotion')
      ],
      r5: [
        P('r5p1', 'r5', 'Perfume Importado Premium',    'Eudora',              'Perfumaria', 99.00, 189.90, 'perfume'),
        P('r5p2', 'r5', 'Batom Cremoso Rosé',           'Mary Kay',            'Maquiagem',  19.00,  42.90, 'lipstick'),
        P('r5p3', 'r5', 'Pó Compacto Matte',            'Mary Kay',            'Maquiagem',  26.00,  52.90, 'palette'),
        P('r5p4', 'r5', 'Gloss Labial Brilho',          'Quem Disse Berenice', 'Maquiagem',  15.00,  32.90, 'lipstick')
      ],
      r6: [
        P('r6p1', 'r6', 'Creme Hidratante Corporal',    'Natura',      'Corpo',    27.00, 54.90, 'lotion'),
        P('r6p2', 'r6', 'Esfoliante Corporal',          'O Boticário', 'Corpo',    23.00, 46.90, 'bubbles'),
        P('r6p3', 'r6', 'Óleo Corporal Relaxante',      'Natura',      'Corpo',    31.00, 62.90, 'dropper')
      ]
    };

    var avs = {
      r1: [
        A('r1', 1, 'Mariana S.',  5, 'Produtos maravilhosos e entrega super rápida pela motoboy!', 4),
        A('r1', 2, 'Patrícia L.', 5, 'O batom matte é lindo e dura o dia todo. Recomendo!', 11),
        A('r1', 3, 'Bianca R.',   4, 'Amei a base, cobertura ótima. Voltarei a comprar.', 20)
      ],
      r2: [
        A('r2', 1, 'Fernanda M.', 5, 'Perfume cheiroso demais, chegou rapidinho.', 6),
        A('r2', 2, 'Carla T.',    5, 'Atendimento impecável da Renata!', 15)
      ],
      r3: [
        A('r3', 1, 'Juliana P.',  5, 'Minha pele mudou com o sérum de vitamina C.', 3),
        A('r3', 2, 'Aline F.',    4, 'Bom protetor solar, não deixa a pele oleosa.', 9),
        A('r3', 3, 'Renata G.',   5, 'Entrega no mesmo dia, amei!', 18)
      ],
      r4: [
        A('r4', 1, 'Sandra V.',   5, 'Esmaltes lindos e variados.', 8),
        A('r4', 2, 'Luana B.',    4, 'Óleo capilar excelente, cabelo macio.', 14)
      ],
      r5: [
        A('r5', 1, 'Débora N.',   5, 'Perfume importado com preço justo!', 5),
        A('r5', 2, 'Tatiane O.',  5, 'Batom Mary Kay maravilhoso.', 12),
        A('r5', 3, 'Helena C.',   4, 'Pó compacto de qualidade.', 25)
      ],
      r6: [
        A('r6', 1, 'Cristina A.', 5, 'Creme hidratante incrível, pele sedosa.', 10),
        A('r6', 2, 'Vanessa D.',  4, 'Óleo corporal com cheiro ótimo.', 22)
      ]
    };

    localStorage.setItem('bv_revendedoras', JSON.stringify(revs));
    Object.keys(prods).forEach(function (id) { localStorage.setItem('bv_produtos_' + id, JSON.stringify(prods[id])); });
    Object.keys(avs).forEach(function (id) { localStorage.setItem('bv_avaliacoes_' + id, JSON.stringify(avs[id])); });
    localStorage.setItem('bv_demo_seeded', SEED_VERSION);
  } catch (e) { /* nunca quebra a página */ }
})();
