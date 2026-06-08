/**
 * BelaVenda — Dados de demonstração (bv-seed.js)
 * ─────────────────────────────────────────────────────────
 * Popula o localStorage com revendedoras, produtos e avaliações de exemplo,
 * para o grupo ver a plataforma "cheia". As imagens dos produtos usam as
 * ilustrações coloridas de bv-art.js (chaves como 'lipstick', 'perfume'...).
 *
 * Login de revendedora demo: qualquer e-mail abaixo · senha: demo1234
 * Para zerar tudo: localStorage.clear() e recarregue.
 * Em produção (backend real): basta NÃO incluir este script.
 */
;(function () {
  'use strict';
  try {
    var SEED_VERSION = '2';
    if (localStorage.getItem('bv_demo_seeded') === SEED_VERSION) return;

    // IDs das revendedoras de demonstração (não mexemos em contas reais)
    var demoIds = ['r1','r2','r3','r4','r5','r6','r7','r8','r9','r10','r11'];

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
      // ── São Paulo (capital) — várias revendedoras ──
      R('r1',  'camila-beauty',     'Camila Beauty',            'camila@belavenda.app',   '5511987650001', '04101000', 'São Paulo', 'SP', -23.5893, -46.6345, true),
      R('r2',  'espaco-renata',      'Espaço Renata Cosméticos', 'renata@belavenda.app',   '5511987650002', '05422000', 'São Paulo', 'SP', -23.5670, -46.7020, true),
      R('r7',  'glamour-paula',      'Glamour by Paula',         'paula@belavenda.app',    '5511987650007', '04077000', 'São Paulo', 'SP', -23.6000, -46.6650, true),
      R('r8',  'essencia-carla',     'Essência Carla',           'carla@belavenda.app',    '5511987650008', '03309000', 'São Paulo', 'SP', -23.5400, -46.5760, true),
      R('r9',  'pele-viva-aline',    'Pele Viva by Aline',       'alinesp@belavenda.app',  '5511987650009', '02401000', 'São Paulo', 'SP', -23.5020, -46.6250, true),
      R('r10', 'studio-make-bruna',  'Studio Make Bruna',        'bruna@belavenda.app',    '5511987650010', '04534000', 'São Paulo', 'SP', -23.5850, -46.6770, true),
      R('r11', 'doce-beleza-leticia','Doce Beleza Letícia',      'leticia@belavenda.app',  '5511987650011', '05014000', 'São Paulo', 'SP', -23.5370, -46.6770, false),
      // ── Outras capitais ──
      R('r3',  'julia-make-skin',    'Júlia Make & Skin',        'julia@belavenda.app',    '5521987650003', '22070000', 'Rio de Janeiro', 'RJ', -22.9710, -43.1820, true),
      R('r4',  'boutique-aline',     'Boutique Aline',           'aline@belavenda.app',    '5541987650004', '80420000', 'Curitiba',       'PR', -25.4410, -49.2880, true),
      R('r5',  'studio-bella-pele',  'Studio Bella Pele',        'bella@belavenda.app',    '5531987650005', '30112000', 'Belo Horizonte', 'MG', -19.9390, -43.9330, true),
      R('r6',  'renascer-cosmeticos','Renascer Cosméticos',      'renascer@belavenda.app', '5551987650006', '90450000', 'Porto Alegre',   'RS', -30.0240, -51.2030, false)
    ];

    var prods = {
      r1: [
        P('r1p1','r1','Batom Líquido Matte Vermelho','Ruby Rose','Maquiagem', 9.90, 22.90,'lipstick'),
        P('r1p2','r1','Base Líquida HD',             'Vult',     'Maquiagem',24.00, 49.90,'foundation'),
        P('r1p3','r1','Paleta de Sombras Nude',      'Dailus',   'Maquiagem',29.00, 59.90,'palette'),
        P('r1p4','r1','Máscara para Cílios Volume',  'Ruby Rose','Maquiagem',12.00, 27.90,'mascara'),
        P('r1p5','r1','Iluminador Facial',           'Vult',     'Maquiagem',18.00, 36.90,'powder')
      ],
      r2: [
        P('r2p1','r2','Perfume Floral Essencial',    'Natura',     'Perfumaria',79.00,149.90,'perfume'),
        P('r2p2','r2','Body Splash Cuide-se Bem',    'O Boticário','Perfumaria',34.00, 64.90,'perfume'),
        P('r2p3','r2','Hidratante Corporal Tododia', 'Natura',     'Corpo',     29.00, 54.90,'lotion'),
        P('r2p4','r2','Sabonete Líquido Nativa SPA', 'O Boticário','Corpo',     19.00, 39.90,'soap'),
        P('r2p5','r2','Perfume Amadeirado Eudora',   'Eudora',     'Perfumaria',89.00,169.90,'perfumeWood')
      ],
      r7: [
        P('r7p1','r7','Batom Bullet Nude','Mary Kay','Maquiagem',17.00,38.90,'lipstick'),
        P('r7p2','r7','Gloss Volumão',     'Dailus',  'Maquiagem',11.00,24.90,'gloss'),
        P('r7p3','r7','Pó Compacto Matte', 'Vult',    'Maquiagem',22.00,44.90,'powder'),
        P('r7p4','r7','Blush Compacto Pêssego','Ruby Rose','Maquiagem',13.00,28.90,'blush'),
        P('r7p5','r7','Delineador Líquido','Dailus',  'Maquiagem',10.00,21.90,'mascara')
      ],
      r8: [
        P('r8p1','r8','Perfume Floratta Blue', 'O Boticário','Perfumaria',69.00,129.90,'perfume'),
        P('r8p2','r8','Perfume Egeo Dolce',    'O Boticário','Perfumaria',75.00,139.90,'perfume'),
        P('r8p3','r8','Colônia Masculina Malbec','O Boticário','Masculino',95.00,179.90,'perfumeWood'),
        P('r8p4','r8','Desodorante Body Spray','Natura',     'Corpo',     15.00, 32.90,'lotion')
      ],
      r9: [
        P('r9p1','r9','Sérum Facial Ácido Hialurônico','Payot','Skincare',55.00,109.90,'serum'),
        P('r9p2','r9','Gel de Limpeza Facial','Payot','Skincare',32.00,64.90,'toner'),
        P('r9p3','r9','Creme Hidratante Facial','Natura','Skincare',38.00,74.90,'cream'),
        P('r9p4','r9','Protetor Solar FPS 60 Toque Seco','Avon','Proteção Solar',39.00,76.90,'sunscreen'),
        P('r9p5','r9','Água Termal Calmante','Payot','Skincare',28.00,54.90,'toner')
      ],
      r10: [
        P('r10p1','r10','Base Mate Soft','Mary Kay','Maquiagem',45.00,89.90,'foundation'),
        P('r10p2','r10','Paleta de Contorno','Vult','Maquiagem',30.00,62.90,'palette'),
        P('r10p3','r10','Shampoo a Seco','Quem Disse Berenice','Cabelos',24.00,46.90,'shampoo'),
        P('r10p4','r10','Óleo Capilar Reparador','Natura','Cabelos',28.00,56.90,'hairoil'),
        P('r10p5','r10','Batom Líquido Fosco','Quem Disse Berenice','Maquiagem',19.00,42.90,'lipstick')
      ],
      r11: [
        P('r11p1','r11','Kit Esmaltes Coleção','Dailus','Unhas',18.00,39.90,'nail'),
        P('r11p2','r11','Esmalte Vermelho Clássico','Risqué','Unhas',4.50,11.90,'nailRed'),
        P('r11p3','r11','Creme para as Mãos','Natura','Corpo',16.00,32.90,'cream'),
        P('r11p4','r11','Sabonete em Barra Floral','O Boticário','Corpo',8.00,18.90,'soap')
      ],
      r3: [
        P('r3p1','r3','Sérum Facial Vitamina C','Payot','Skincare',45.00,89.90,'serum'),
        P('r3p2','r3','Protetor Solar FPS 50','Avon','Proteção Solar',32.00,62.90,'sunscreen'),
        P('r3p3','r3','Creme Anti-idade Noturno','Payot','Skincare',55.00,109.90,'cream'),
        P('r3p4','r3','Água Micelar 5 em 1','Avon','Skincare',18.00,36.90,'toner')
      ],
      r4: [
        P('r4p1','r4','Esmalte Cremoso Rosa','Dailus','Unhas',4.50,11.90,'nail'),
        P('r4p2','r4','Kit Manicure Completo','Vult','Unhas',22.00,44.90,'nail'),
        P('r4p3','r4','Shampoo Reparador','Natura','Cabelos',21.00,42.90,'shampoo'),
        P('r4p4','r4','Óleo Capilar Nutritivo','O Boticário','Cabelos',28.00,56.90,'hairoil'),
        P('r4p5','r4','Máscara Capilar Hidratação','Natura','Cabelos',30.00,59.90,'cream')
      ],
      r5: [
        P('r5p1','r5','Perfume Importado Premium','Eudora','Perfumaria',99.00,189.90,'perfumeWood'),
        P('r5p2','r5','Batom Cremoso Rosé','Mary Kay','Maquiagem',19.00,42.90,'lipstick'),
        P('r5p3','r5','Pó Compacto Matte','Mary Kay','Maquiagem',26.00,52.90,'powder'),
        P('r5p4','r5','Gloss Labial Brilho','Quem Disse Berenice','Maquiagem',15.00,32.90,'gloss')
      ],
      r6: [
        P('r6p1','r6','Creme Hidratante Corporal','Natura','Corpo',27.00,54.90,'lotion'),
        P('r6p2','r6','Esfoliante Corporal','O Boticário','Corpo',23.00,46.90,'cream'),
        P('r6p3','r6','Óleo Corporal Relaxante','Natura','Corpo',31.00,62.90,'hairoil')
      ]
    };

    var avs = {
      r1: [ A('r1',1,'Mariana S.',5,'Produtos maravilhosos e entrega super rápida pela motoboy!',4), A('r1',2,'Patrícia L.',5,'O batom matte é lindo e dura o dia todo. Recomendo!',11), A('r1',3,'Bianca R.',4,'Amei a base, cobertura ótima.',20) ],
      r2: [ A('r2',1,'Fernanda M.',5,'Perfume cheiroso demais, chegou rapidinho.',6), A('r2',2,'Carla T.',5,'Atendimento impecável da Renata!',15) ],
      r7: [ A('r7',1,'Júlia A.',5,'Maquiagem top e preço justo.',3), A('r7',2,'Rafaela P.',4,'Gloss maravilhoso!',9), A('r7',3,'Sabrina M.',5,'Entrega no mesmo dia em Moema.',16) ],
      r8: [ A('r8',1,'Marcos V.',5,'Comprei o Malbec, chegou super rápido.',5), A('r8',2,'Larissa F.',5,'Perfumes originais e baratos.',13) ],
      r9: [ A('r9',1,'Camila T.',5,'O sérom transformou minha pele!',2), A('r9',2,'Beatriz L.',4,'Ótimos produtos de skincare.',10), A('r9',3,'Natália R.',5,'Recomendo o protetor solar.',19) ],
      r10:[ A('r10',1,'Vanessa C.',5,'Base perfeita, cobertura linda.',7), A('r10',2,'Priscila D.',4,'Óleo capilar deixou meu cabelo macio.',14) ],
      r11:[ A('r11',1,'Aline G.',5,'Esmaltes lindos e variados.',8), A('r11',2,'Tatiane S.',4,'Creme de mãos delicioso.',17) ],
      r3: [ A('r3',1,'Juliana P.',5,'Minha pele mudou com o sérum de vitamina C.',3), A('r3',2,'Aline F.',4,'Bom protetor solar.',9), A('r3',3,'Renata G.',5,'Entrega no mesmo dia, amei!',18) ],
      r4: [ A('r4',1,'Sandra V.',5,'Esmaltes lindos e variados.',8), A('r4',2,'Luana B.',4,'Óleo capilar excelente.',14) ],
      r5: [ A('r5',1,'Débora N.',5,'Perfume importado com preço justo!',5), A('r5',2,'Tatiane O.',5,'Batom Mary Kay maravilhoso.',12), A('r5',3,'Helena C.',4,'Pó compacto de qualidade.',25) ],
      r6: [ A('r6',1,'Cristina A.',5,'Creme hidratante incrível.',10), A('r6',2,'Vanessa D.',4,'Óleo corporal com cheiro ótimo.',22) ]
    };

    // Remove dados demo antigos (preserva revendedoras reais criadas por usuários)
    var existing = JSON.parse(localStorage.getItem('bv_revendedoras') || '[]');
    existing.forEach(function (r) {
      if (demoIds.indexOf(r.id) >= 0) {
        localStorage.removeItem('bv_produtos_' + r.id);
        localStorage.removeItem('bv_avaliacoes_' + r.id);
      }
    });
    var realRevs = existing.filter(function (r) { return demoIds.indexOf(r.id) < 0; });

    localStorage.setItem('bv_revendedoras', JSON.stringify(realRevs.concat(revs)));
    Object.keys(prods).forEach(function (id) { localStorage.setItem('bv_produtos_' + id, JSON.stringify(prods[id])); });
    Object.keys(avs).forEach(function (id) { localStorage.setItem('bv_avaliacoes_' + id, JSON.stringify(avs[id])); });
    localStorage.setItem('bv_demo_seeded', SEED_VERSION);
  } catch (e) { /* nunca quebra a página */ }
})();
