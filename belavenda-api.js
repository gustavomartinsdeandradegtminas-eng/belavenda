/**
 * ════════════════════════════════════════════════════════════
 *  BELAVENDA — SERVICE LAYER  (belavenda-api.js)
 *  Versão: 1.0.0  |  Modo atual: LOCAL (localStorage)
 * ════════════════════════════════════════════════════════════
 *
 *  Este arquivo é a ÚNICA camada entre o frontend e serviços
 *  externos. Cada módulo tem implementação LOCAL (funciona
 *  agora, sem backend) e uma implementação REAL comentada
 *  logo abaixo (pronta para ativar quando o backend existir).
 *
 *  COMO MIGRAR PARA PRODUÇÃO:
 *  ─────────────────────────────────────────────────────────
 *  1. Suba o backend (veja /backend/README.md)
 *  2. Ajuste BV_CONFIG abaixo
 *  3. Em cada função, comente o bloco LOCAL e descomente REAL
 *  4. Rode os testes: npm test (ou abra o app e teste)
 *
 *  MÓDULOS:
 *  ─────────────────────────────────────────────────────────
 *  BV.config    → feature flags e endpoints
 *  BV.db        → persistência (localStorage → REST API)
 *  BV.auth      → autenticação (localStorage → JWT/OAuth)
 *  BV.geo       → geocoding (Nominatim → Google Maps)
 *  BV.payments  → pagamentos (fake → Mercado Pago / Stripe)
 * ════════════════════════════════════════════════════════════
 */

;(function (global) {
  'use strict'

  // ══════════════════════════════════════════════════════════
  //  CONFIGURAÇÃO
  //  ─────────────────────────────────────────────────────────
  //  Mude aqui para ativar o modo de produção.
  //  Não coloque chaves secretas neste arquivo — use variáveis
  //  de ambiente no backend.
  // ══════════════════════════════════════════════════════════

  const BV_CONFIG = {
    // ── MODO GERAL ──────────────────────────────────────────
    // 'local'  → localStorage, sem backend (padrão)
    // 'api'    → REST API (produção)
    mode: 'local',
    apiBase: 'https://api.belavenda.app/v1',  // URL do seu backend
    apiVersion: 'v1',

    // ── AUTENTICAÇÃO ────────────────────────────────────────
    // 'local'  → hash simples + localStorage session
    // 'jwt'    → JWT + refresh token (backend necessário)
    authProvider: 'local',

    // ── GEOCODING ───────────────────────────────────────────
    // 'nominatim' → OpenStreetMap — gratuito, 1 req/s
    //   Docs: https://nominatim.org/release-docs/develop/api/Search/
    // 'google'    → Google Maps Geocoding API — pago, mais preciso
    //   Docs: https://developers.google.com/maps/documentation/geocoding
    // 'mapbox'    → Mapbox Geocoding API — pago, boa cobertura BR
    //   Docs: https://docs.mapbox.com/api/search/geocoding/
    geoProvider: 'nominatim',
    googleMapsKey: '',   // AIzaSy...
    mapboxToken: '',     // pk.eyJ1...

    // ── PAGAMENTOS ──────────────────────────────────────────
    // 'fake'        → simulação (desenvolvimento / demo)
    // 'mercadopago' → Mercado Pago (recomendado Brasil)
    //   Docs: https://www.mercadopago.com.br/developers/pt/docs
    //   SDKs: https://github.com/mercadopago/sdk-js
    // 'pagseguro'   → PagSeguro
    //   Docs: https://dev.pagbank.uol.com.br/reference
    // 'stripe'      → Stripe (internacional / cartão global)
    //   Docs: https://stripe.com/docs/payments/payment-intents
    paymentProvider: 'fake',
    mercadoPagoPublicKey: '',  // TEST-xxx (dev) ou APP_USR-xxx (prod)
    pagSeguroPublicKey: '',
    stripePK: '',              // pk_test_... ou pk_live_...

    // ── STORAGE (banco de dados) ─────────────────────────────
    // Local: localStorage (prefixo 'bv_')
    // Real:  PostgreSQL via backend REST
    //   Schema: /backend/migrations/*.sql
    localPrefix: 'bv_',

    // ── ENTREGA LOCAL (motoboy) ──────────────────────────────
    // 'fake'      → simulação realista por distância em km (padrão)
    // 'lalamove'  → Lalamove API (motoboy urbano, recomendado)
    //               Docs: https://developers.lalamove.com/
    //               Cidades BR: SP, RJ, BH, Curitiba, Porto Alegre, Fortaleza...
    // 'loggi'     → Loggi API (alternativa, foco em SP e capitais)
    //               Docs: https://api.loggi.com/
    deliveryProvider: 'fake',
    lalamoveKey: '',          // API key do Lalamove (configurar no backend!)
    lalamoveSandbox: true,    // true = sandbox, false = produção
  }

  // ══════════════════════════════════════════════════════════
  //  UTILITÁRIOS INTERNOS
  // ══════════════════════════════════════════════════════════

  /** Gera UUID v4 */
  const _uid = () => crypto.randomUUID()

  /** Timestamp ISO 8601 */
  const _now = () => new Date().toISOString()

  /**
   * Hash de senha simples para armazenamento local.
   * PRODUÇÃO: use bcrypt no servidor — NUNCA envie senhas em
   * texto plano para o backend; faça hash antes de salvar.
   * Backend: const hash = await bcrypt.hash(password, 12)
   */
  const _hashLocal = (p) => {
    let h = 0
    for (let i = 0; i < p.length; i++) { h = ((h << 5) - h) + p.charCodeAt(i); h |= 0 }
    return h.toString(36)
  }

  /**
   * Helper HTTP genérico para o modo API.
   * Inclui Bearer token, JSON parse e tratamento de erro.
   */
  const _http = {
    _token: () => localStorage.getItem('bv_jwt') || '',

    async request(method, path, body) {
      const res = await fetch(`${BV_CONFIG.apiBase}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this._token()}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      })
      if (res.status === 401) {
        await BV.auth._refreshToken()
        return this.request(method, path, body) // retry once
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `HTTP ${res.status}`)
      }
      return res.json()
    },

    get: (path) => _http.request('GET', path),
    post: (path, body) => _http.request('POST', path, body),
    put: (path, body) => _http.request('PUT', path, body),
    patch: (path, body) => _http.request('PATCH', path, body),
    del: (path) => _http.request('DELETE', path),
  }

  /** Lê/escreve localStorage com prefixo */
  const _ls = {
    get: (key) => JSON.parse(localStorage.getItem(BV_CONFIG.localPrefix + key) || 'null'),
    set: (key, val) => localStorage.setItem(BV_CONFIG.localPrefix + key, JSON.stringify(val)),
    getArr: (key) => JSON.parse(localStorage.getItem(BV_CONFIG.localPrefix + key) || '[]'),
    push: (key, item) => {
      const arr = _ls.getArr(key); arr.push(item)
      localStorage.setItem(BV_CONFIG.localPrefix + key, JSON.stringify(arr))
      return arr
    },
    update: (key, id, patch) => {
      const arr = _ls.getArr(key)
      const i = arr.findIndex(x => x.id === id)
      if (i >= 0) arr[i] = { ...arr[i], ...patch }
      localStorage.setItem(BV_CONFIG.localPrefix + key, JSON.stringify(arr))
      return arr[i]
    },
  }

  const _isLocal = () => BV_CONFIG.mode === 'local'


  // ══════════════════════════════════════════════════════════
  //  MÓDULO: DATABASE (db)
  //  Todos os métodos retornam Promise para compatibilidade
  //  futura com fetch. Use await em todos os chamadores.
  //
  //  ENDPOINTS REST necessários (backend):
  //  GET    /revendedoras
  //  GET    /revendedoras/:id
  //  POST   /revendedoras
  //  GET    /revendedoras/:id/produtos
  //  POST   /revendedoras/:id/produtos
  //  GET    /revendedoras/:id/pedidos
  //  POST   /revendedoras/:id/pedidos
  //  PATCH  /revendedoras/:id/pedidos/:pedidoId
  //  GET    /revendedoras/:id/avaliacoes
  //  POST   /revendedoras/:id/avaliacoes
  //  GET    /revendedoras/:id/clientes
  //  POST   /revendedoras/:id/clientes
  // ══════════════════════════════════════════════════════════

  const db = {

    // ─── REVENDEDORAS ──────────────────────────────────────

    async getRevs() {
      // LOCAL ─────────────────────────────────────────────
      if (_isLocal()) return _ls.getArr('revendedoras')
      // REAL ──────────────────────────────────────────────
      // const res = await _http.get('/revendedoras')
      // return res.data
    },

    async getRevBySlug(slug) {
      // LOCAL
      if (_isLocal()) return _ls.getArr('revendedoras').find(r => r.slugLoja === slug) || null
      // REAL
      // const res = await _http.get(`/revendedoras?slug=${slug}`)
      // return res.data[0] || null
    },

    async getRevById(id) {
      // LOCAL
      if (_isLocal()) return _ls.getArr('revendedoras').find(r => r.id === id) || null
      // REAL
      // const res = await _http.get(`/revendedoras/${id}`)
      // return res.data
    },

    async saveRev(rev) {
      // LOCAL
      if (_isLocal()) {
        const revs = _ls.getArr('revendedoras')
        const i = revs.findIndex(r => r.id === rev.id)
        if (i >= 0) revs[i] = rev; else revs.push(rev)
        _ls.set('revendedoras', revs)
        return rev
      }
      // REAL
      // return (await _http.post('/revendedoras', rev)).data
    },

    // ─── PRODUTOS ──────────────────────────────────────────

    async getProds(revId, { visivelOnly = false } = {}) {
      // LOCAL
      if (_isLocal()) {
        const all = _ls.getArr(`produtos_${revId}`)
        return visivelOnly ? all.filter(p => p.visivelCatalogo) : all
      }
      // REAL
      // const qs = visivelOnly ? '?visivelCatalogo=true' : ''
      // return (await _http.get(`/revendedoras/${revId}/produtos${qs}`)).data
    },

    async saveProd(revId, prod) {
      // LOCAL
      if (_isLocal()) {
        const prods = _ls.getArr(`produtos_${revId}`)
        const i = prods.findIndex(p => p.id === prod.id)
        if (i >= 0) prods[i] = prod; else prods.push(prod)
        _ls.set(`produtos_${revId}`, prods)
        return prod
      }
      // REAL
      // if (prod.id) return (await _http.put(`/revendedoras/${revId}/produtos/${prod.id}`, prod)).data
      // return (await _http.post(`/revendedoras/${revId}/produtos`, prod)).data
    },

    async deleteProd(revId, prodId) {
      // LOCAL
      if (_isLocal()) {
        const prods = _ls.getArr(`produtos_${revId}`).filter(p => p.id !== prodId)
        _ls.set(`produtos_${revId}`, prods)
        return true
      }
      // REAL
      // await _http.del(`/revendedoras/${revId}/produtos/${prodId}`)
    },

    // ─── PEDIDOS ───────────────────────────────────────────

    async getPedidos(revId) {
      // LOCAL
      if (_isLocal()) return _ls.getArr(`pedidos_${revId}`)
      // REAL
      // return (await _http.get(`/revendedoras/${revId}/pedidos`)).data
    },

    async savePedido(revId, pedido) {
      // LOCAL
      if (_isLocal()) {
        const pedidos = _ls.getArr(`pedidos_${revId}`)
        const i = pedidos.findIndex(p => p.id === pedido.id)
        if (i >= 0) pedidos[i] = pedido; else pedidos.push(pedido)
        _ls.set(`pedidos_${revId}`, pedidos)
        return pedido
      }
      // REAL
      // if (pedido.id) return (await _http.put(`/revendedoras/${revId}/pedidos/${pedido.id}`, pedido)).data
      // return (await _http.post(`/revendedoras/${revId}/pedidos`, pedido)).data
    },

    async updatePedidoStatus(revId, pedidoId, status) {
      // LOCAL
      if (_isLocal()) return _ls.update(`pedidos_${revId}`, pedidoId, { status })
      // REAL
      // return (await _http.patch(`/revendedoras/${revId}/pedidos/${pedidoId}`, { status })).data
    },

    // ─── AVALIAÇÕES ────────────────────────────────────────

    async getAvaliacoes(revId) {
      // LOCAL
      if (_isLocal()) return _ls.getArr(`avaliacoes_${revId}`)
      // REAL
      // return (await _http.get(`/revendedoras/${revId}/avaliacoes`)).data
    },

    async saveAvaliacao(revId, avaliacao) {
      // LOCAL
      if (_isLocal()) {
        const avs = _ls.getArr(`avaliacoes_${revId}`)
        if (avs.find(a => a.pedidoId === avaliacao.pedidoId)) throw new Error('Pedido já avaliado')
        const nova = { id: _uid(), ...avaliacao, data: _now() }
        avs.push(nova)
        _ls.set(`avaliacoes_${revId}`, avs)
        // Marcar pedido como avaliado
        await db.updatePedido(revId, avaliacao.pedidoId, { avaliado: true })
        return nova
      }
      // REAL
      // return (await _http.post(`/revendedoras/${revId}/avaliacoes`, avaliacao)).data
    },

    async updatePedido(revId, pedidoId, patch) {
      // LOCAL
      if (_isLocal()) return _ls.update(`pedidos_${revId}`, pedidoId, patch)
      // REAL
      // return (await _http.patch(`/revendedoras/${revId}/pedidos/${pedidoId}`, patch)).data
    },

    // ─── CLIENTES ──────────────────────────────────────────

    async getClientes(revId) {
      // LOCAL
      if (_isLocal()) return _ls.getArr(`clientes_${revId}`)
      // REAL
      // return (await _http.get(`/revendedoras/${revId}/clientes`)).data
    },

    async upsertCliente(revId, cliente) {
      // LOCAL
      if (_isLocal()) {
        const clientes = _ls.getArr(`clientes_${revId}`)
        const i = clientes.findIndex(c => c.telefone === cliente.telefone)
        if (i >= 0) { clientes[i] = { ...clientes[i], ...cliente }; _ls.set(`clientes_${revId}`, clientes); return clientes[i] }
        const novo = { id: _uid(), criadoEm: _now(), ...cliente }
        _ls.push(`clientes_${revId}`, novo)
        return novo
      }
      // REAL
      // return (await _http.post(`/revendedoras/${revId}/clientes`, cliente)).data
    },
  }

  // ══════════════════════════════════════════════════════════
  //  MÓDULO: AUTENTICAÇÃO (auth)
  //
  //  MIGRAÇÃO PARA JWT:
  //  1. Backend: POST /auth/register, POST /auth/login, POST /auth/refresh
  //  2. Retorno: { token, refreshToken, expiresIn, user }
  //  3. Armazene token em memória (não localStorage!) para XSS
  //  4. Armazene refreshToken em HttpOnly cookie (backend)
  //  5. Use _http.request que renova o token automaticamente
  // ══════════════════════════════════════════════════════════

  const auth = {

    // ─── REVENDEDORA ───────────────────────────────────────

    async loginRev(email, password) {
      // LOCAL
      if (_isLocal()) {
        const revs = _ls.getArr('revendedoras')
        const rev = revs.find(r => r.email === email.toLowerCase() && r.senhaHash === _hashLocal(password))
        if (!rev) throw new Error('E-mail ou senha incorretos.')
        const session = { revendedoraId: rev.id, nome: rev.nome, slugLoja: rev.slugLoja, email: rev.email }
        _ls.set('session', session)
        return { user: session }
      }
      // REAL
      // const res = await _http.post('/auth/login', { email, password })
      // BV_CONFIG.apiKey = res.token  // salva em memória
      // _ls.set('jwt', res.token)     // ou use HttpOnly cookie no backend
      // _ls.set('session', res.user)
      // return res
    },

    async registerRev(data) {
      // data: { nome, email, password, telefone, cep, cidade, estado, lat, lng }
      // LOCAL
      if (_isLocal()) {
        const revs = _ls.getArr('revendedoras')
        if (revs.find(r => r.email === data.email.toLowerCase())) throw new Error('E-mail já cadastrado.')
        const slug = _slugify(data.nome)
        let s = slug; let n = 2; while (revs.find(r => r.slugLoja === s)) s = slug + '-' + n++
        const rev = {
          id: _uid(), nome: data.nome, email: data.email.toLowerCase(),
          telefone: data.telefone, cep: data.cep, cidade: data.cidade,
          estado: data.estado, lat: data.lat, lng: data.lng,
          slugLoja: s, senhaHash: _hashLocal(data.password),
          lojaAberta: true,  // loja sempre começa aberta
          criadoEm: _now(),
        }
        revs.push(rev); _ls.set('revendedoras', revs)
        const session = { revendedoraId: rev.id, nome: rev.nome, slugLoja: rev.slugLoja, email: rev.email }
        _ls.set('session', session)
        return { user: session, rev }
      }
      // REAL
      // const { password, ...rest } = data
      // const res = await _http.post('/auth/register', { ...rest, password }) // bcrypt no backend
      // BV_CONFIG.apiKey = res.token
      // _ls.set('session', res.user)
      // return res
    },

    getRevSession() {
      // LOCAL + REAL (session sempre local após login)
      return _ls.get('session')
    },

    setRevSession(session) {
      _ls.set('session', session)
    },

    // ─── CLIENTE ───────────────────────────────────────────

    async loginCliente(dados) {
      // dados: { nome, whatsapp, cep, cidade, estado, lat, lng }
      // LOCAL: clientes não têm senha — sessão por dados simples
      if (_isLocal()) {
        _ls.set('cliente_session', { ...dados, criadoEm: _now() })
        return dados
      }
      // REAL
      // Opção A: magic link por WhatsApp (recomendado para UX)
      // const res = await _http.post('/auth/cliente/login', { whatsapp: dados.whatsapp })
      // aguardar código de verificação via WhatsApp...
      //
      // Opção B: OTP simples
      // const res = await _http.post('/auth/cliente/session', dados)
      // _ls.set('cliente_session', res.user)
      // return res.user
    },

    getClienteSession() {
      return _ls.get('cliente_session')
    },

    setClienteSession(session) {
      _ls.set('cliente_session', session)
    },

    logoutRev() {
      _ls.set('session', null)
      localStorage.removeItem(`${BV_CONFIG.localPrefix}session`)
      localStorage.removeItem(`${BV_CONFIG.localPrefix}jwt`)
      // REAL: await _http.post('/auth/logout')
    },

    logoutCliente() {
      localStorage.removeItem(`${BV_CONFIG.localPrefix}cliente_session`)
    },

    // Renovação de JWT (chamada automaticamente pelo _http)
    async _refreshToken() {
      // REAL
      // const refresh = localStorage.getItem('bv_refresh_token')
      // if (!refresh) throw new Error('Session expirada')
      // const res = await fetch(`${BV_CONFIG.apiBase}/auth/refresh`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${refresh}` }
      // })
      // const { token } = await res.json()
      // BV_CONFIG.apiKey = token
      // localStorage.setItem('bv_jwt', token)
    },
  }

  // ══════════════════════════════════════════════════════════
  //  MÓDULO: GEOCODING (geo)
  //
  //  MIGRAÇÃO PARA GOOGLE MAPS:
  //  1. BV_CONFIG.geoProvider = 'google'
  //  2. BV_CONFIG.googleMapsKey = 'AIzaSy...'
  //  3. Adicione no HTML: <script src="https://maps.googleapis.com/maps/api/js?key=...">
  //  4. Custo: ~USD 0.005 por request (5.000 grátis/mês)
  //
  //  IMPORTANTE: coloque a API key no backend para evitar
  //  exposição. O frontend chama /api/geocode?cep=xxx e o
  //  backend chama o Google com a key secreta.
  // ══════════════════════════════════════════════════════════

  const geo = {

    /**
     * CEP → coordenadas geográficas
     * @param {string} cep - 8 dígitos sem hífen
     * @param {string} cidade
     * @param {string} uf - 2 letras (ex: 'PR')
     * @returns {Promise<{lat, lng, cidade, estado, cep}>}
     */
    async cepToCoords(cep, cidade, uf) {
      // NOMINATIM (gratuito, use com moderação) ────────────
      if (BV_CONFIG.geoProvider === 'nominatim') {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/search?postalcode=${cep}&country=BR&format=json&limit=1`,
            { headers: { 'Accept-Language': 'pt-BR', 'User-Agent': 'BelaVenda/1.0' } }
          )
          const d = await r.json()
          if (d.length) return { lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon), cidade, estado: uf, cep }
        } catch (_) {}
        // Fallback: busca por cidade/estado
        const r2 = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${cidade}, ${uf}, Brasil`)}&format=json&limit=1`,
          { headers: { 'Accept-Language': 'pt-BR', 'User-Agent': 'BelaVenda/1.0' } }
        )
        const d2 = await r2.json()
        if (!d2.length) throw new Error('Localização não encontrada para este CEP.')
        return { lat: parseFloat(d2[0].lat), lng: parseFloat(d2[0].lon), cidade, estado: uf, cep }
      }

      // GOOGLE MAPS ─────────────────────────────────────────
      // if (BV_CONFIG.geoProvider === 'google') {
      //   // Aviso: prefira chamar pelo backend para não expor a key
      //   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cep},BR&key=${BV_CONFIG.googleMapsKey}`
      //   const res = await fetch(url)
      //   const data = await res.json()
      //   if (data.status !== 'OK') throw new Error('CEP não encontrado pelo Google Maps')
      //   const loc = data.results[0].geometry.location
      //   return { lat: loc.lat, lng: loc.lng, cidade, estado: uf, cep }
      // }

      // MAPBOX ──────────────────────────────────────────────
      // if (BV_CONFIG.geoProvider === 'mapbox') {
      //   const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${cep}.json?country=BR&access_token=${BV_CONFIG.mapboxToken}`
      //   const res = await fetch(url)
      //   const data = await res.json()
      //   if (!data.features.length) throw new Error('CEP não encontrado')
      //   const [lng, lat] = data.features[0].center
      //   return { lat, lng, cidade, estado: uf, cep }
      // }

      // VIA BACKEND (recomendado em produção) ───────────────
      // if (BV_CONFIG.mode === 'api') {
      //   return (await _http.get(`/geo/cep/${cep}`)).data
      //   // Backend faz a chamada com a key secreta e retorna {lat, lng, cidade, estado, cep}
      // }

      throw new Error(`Provedor geo não configurado: ${BV_CONFIG.geoProvider}`)
    },

    /**
     * Valida e busca endereço por CEP (retorna dados do ViaCEP)
     * ViaCEP é público e pode ficar — não precisa de backend.
     */
    async lookupCEP(cep) {
      // ViaCEP — API pública brasileira, sem key
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const d = await r.json()
      if (d.erro) throw new Error('CEP não encontrado. Verifique o número.')
      return { cidade: d.localidade, estado: d.uf, logradouro: d.logradouro, bairro: d.bairro, cep: d.cep }
    },

    /** Distância em km entre dois pontos (Haversine) */
    distance(lat1, lon1, lat2, lon2) {
      const R = 6371
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLon = (lon2 - lon1) * Math.PI / 180
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    },
  }

  // ══════════════════════════════════════════════════════════
  //  MÓDULO: PAGAMENTOS (payments)
  //
  //  Todas as funções retornam um objeto normalizado:
  //
  //  PIX:    { txId, copyPaste, qrCodeSVG, amount, expiresAt, status:'PENDING' }
  //  CARTÃO: { txId, status:'APPROVED'|'REJECTED', authCode, last4, installments }
  //  BOLETO: { txId, barcode, barcodeNum, dueDate, amount, status:'PENDING' }
  //
  //  MIGRAÇÃO PARA MERCADO PAGO:
  //  1. BV_CONFIG.paymentProvider = 'mercadopago'
  //  2. BV_CONFIG.mercadoPagoPublicKey = 'TEST-...' (ou APP_USR-... em prod)
  //  3. No HTML: <script src="https://sdk.mercadopago.com/js/v2"></script>
  //  4. Crie o backend com a SDK server-side:
  //     npm install mercadopago
  //     Veja: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/landing
  //
  //  ENDPOINTS DE BACKEND NECESSÁRIOS:
  //  POST /payments/pix     → MP: payment.create({ payment_method_id: 'pix', ... })
  //  POST /payments/card    → MP: payment.create({ payment_method_id: 'credit_card', token, ... })
  //  POST /payments/boleto  → MP: payment.create({ payment_method_id: 'bolbradesco', ... })
  //  GET  /payments/:txId   → MP: payment.get(id)  — para checar status
  //  POST /payments/webhook → MP: receber notificações IPN (ativar no painel MP)
  // ══════════════════════════════════════════════════════════

  const payments = {

    /**
     * Cria pagamento PIX
     * @param {{ amount, revId, orderId, payerName, payerEmail }} params
     * @returns {Promise<{txId, copyPaste, qrCodeSVG, amount, expiresAt, status}>}
     */
    async createPIX({ amount, revId, orderId, payerName, payerEmail }) {

      // FAKE (desenvolvimento/demo) ─────────────────────────
      if (BV_CONFIG.paymentProvider === 'fake') {
        const txId = 'PIX' + _uid().replace(/-/g, '').slice(0, 12).toUpperCase()
        const copyPaste = `00020126580014br.gov.bcb.pix0136${_uid()}5204000053039865406${(amount * 100).toFixed(0).padStart(10, '0')}5802BR5913BelaVenda6009CURITIBA6304${txId.slice(-4)}`
        return {
          txId, copyPaste,
          qrCodeSVG: _fakeQRSVG(),
          amount,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          status: 'PENDING',
        }
      }

      // MERCADO PAGO ────────────────────────────────────────
      // if (BV_CONFIG.paymentProvider === 'mercadopago') {
      //   // Backend: POST /payments/pix
      //   // SDK Server: const mp = new MercadoPagoConfig({ accessToken })
      //   //             const payment = new Payment(mp)
      //   //             const res = await payment.create({ body: {
      //   //               transaction_amount: amount,
      //   //               description: `Pedido BelaVenda #${orderId}`,
      //   //               payment_method_id: 'pix',
      //   //               payer: { email: payerEmail, first_name: payerName }
      //   //             }})
      //   const res = await _http.post('/payments/pix', { amount, orderId, payerName, payerEmail })
      //   return {
      //     txId: String(res.id),
      //     copyPaste: res.point_of_interaction.transaction_data.qr_code,
      //     qrCodeSVG: null, // usar res.point_of_interaction.transaction_data.qr_code_base64
      //     qrCodeBase64: res.point_of_interaction.transaction_data.qr_code_base64,
      //     amount,
      //     expiresAt: res.date_of_expiration,
      //     status: 'PENDING',
      //   }
      // }

      // STRIPE (PIX via boleto/local) ───────────────────────
      // Stripe não suporta PIX nativo no BR ainda (2024).
      // Use Mercado Pago ou PagSeguro para PIX.

      throw new Error(`Payment provider não configurado: ${BV_CONFIG.paymentProvider}`)
    },

    /**
     * Cria pagamento com cartão
     * @param {{ amount, revId, orderId, cardToken, installments, payerEmail }} params
     * @returns {Promise<{txId, status, authCode, last4, installments}>}
     */
    async createCard({ amount, orderId, cardToken, cardData, installments = 1, payerEmail }) {

      // FAKE ─────────────────────────────────────────────────
      if (BV_CONFIG.paymentProvider === 'fake') {
        await new Promise(r => setTimeout(r, 2500)) // simula processamento
        const txId = 'CC' + _uid().replace(/-/g, '').slice(0, 12).toUpperCase()
        const last4 = (cardData?.number || '0000').replace(/\D/g, '').slice(-4)
        return { txId, status: 'APPROVED', authCode: Math.random().toString(36).slice(2, 8).toUpperCase(), last4, installments, amount }
      }

      // MERCADO PAGO ────────────────────────────────────────
      // PASSO 1 (frontend): Tokenize o cartão com o SDK MP
      //   const mp = new MercadoPago(BV_CONFIG.mercadoPagoPublicKey)
      //   const cardToken = await mp.createCardToken({
      //     cardNumber, cardholderName, cardExpirationMonth,
      //     cardExpirationYear, securityCode, identificationType, identificationNumber
      //   })
      // PASSO 2 (backend): POST /payments/card
      //   SDK Server: payment.create({ body: {
      //     transaction_amount: amount,
      //     token: cardToken.id,
      //     installments,
      //     payment_method_id: 'visa', // ou 'master', 'elo', etc.
      //     payer: { email: payerEmail }
      //   }})
      // if (BV_CONFIG.paymentProvider === 'mercadopago') {
      //   const res = await _http.post('/payments/card', { amount, orderId, cardToken, installments, payerEmail })
      //   return {
      //     txId: String(res.id),
      //     status: res.status === 'approved' ? 'APPROVED' : res.status === 'rejected' ? 'REJECTED' : 'PENDING',
      //     authCode: res.authorization_code,
      //     last4: res.card?.last_four_digits,
      //     installments,
      //     amount,
      //   }
      // }

      // STRIPE ──────────────────────────────────────────────
      // PASSO 1 (frontend): Stripe Elements cria PaymentMethod
      //   const stripe = Stripe(BV_CONFIG.stripePK)
      //   const { paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card })
      // PASSO 2 (backend): POST /payments/card
      //   stripe.paymentIntents.create({ amount: amount * 100, currency: 'brl', payment_method: paymentMethod.id, confirm: true })
      // if (BV_CONFIG.paymentProvider === 'stripe') {
      //   const res = await _http.post('/payments/card', { amount, orderId, paymentMethodId: cardToken, payerEmail })
      //   return { txId: res.id, status: res.status === 'succeeded' ? 'APPROVED' : 'REJECTED', amount }
      // }

      throw new Error(`Payment provider não configurado: ${BV_CONFIG.paymentProvider}`)
    },

    /**
     * Cria boleto bancário
     * @param {{ amount, revId, orderId, payerName, payerCPF, payerEmail }} params
     * @returns {Promise<{txId, barcode, barcodeNum, dueDate, pdf, amount, status}>}
     */
    async createBoleto({ amount, orderId, payerName, payerEmail, payerCPF }) {

      // FAKE ─────────────────────────────────────────────────
      if (BV_CONFIG.paymentProvider === 'fake') {
        const txId = 'BOL' + _uid().replace(/-/g, '').slice(0, 12).toUpperCase()
        const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        const rnd = () => Math.floor(Math.random() * 1e10).toString().padStart(10, '0')
        const barcodeNum = `3399${rnd()} 0001${rnd().slice(0, 5)} ${rnd()} 0000${rnd().slice(0, 6)} 00000000 ${Math.round(amount * 100).toString().padStart(10, '0')}`
        return { txId, barcodeNum, dueDate, amount, status: 'PENDING', pdf: null }
      }

      // MERCADO PAGO ────────────────────────────────────────
      // if (BV_CONFIG.paymentProvider === 'mercadopago') {
      //   // Backend: POST /payments/boleto
      //   //   payment.create({ body: {
      //   //     transaction_amount: amount,
      //   //     description: `Pedido BelaVenda #${orderId}`,
      //   //     payment_method_id: 'bolbradesco', // ou 'pec'
      //   //     payer: {
      //   //       email: payerEmail, first_name: payerName,
      //   //       identification: { type: 'CPF', number: payerCPF }
      //   //     }
      //   //   }})
      //   const res = await _http.post('/payments/boleto', { amount, orderId, payerName, payerEmail, payerCPF })
      //   return {
      //     txId: String(res.id),
      //     barcodeNum: res.barcode.content,
      //     pdf: res.transaction_details.external_resource_url,
      //     dueDate: res.date_of_expiration,
      //     amount,
      //     status: 'PENDING',
      //   }
      // }

      throw new Error(`Payment provider não configurado: ${BV_CONFIG.paymentProvider}`)
    },

    /**
     * Consulta status de um pagamento
     * @param {string} txId
     * @returns {Promise<'APPROVED'|'PENDING'|'REJECTED'|'CANCELLED'>}
     */
    async getStatus(txId) {
      // FAKE
      if (BV_CONFIG.paymentProvider === 'fake') return 'APPROVED'
      // REAL
      // const res = await _http.get(`/payments/${txId}`)
      // const map = { approved: 'APPROVED', pending: 'PENDING', rejected: 'REJECTED', cancelled: 'CANCELLED' }
      // return map[res.status] || 'PENDING'
    },

    /**
     * Processa webhook de pagamento (chame no backend)
     * Não tem implementação frontend — apenas documentação.
     *
     * Backend Express:
     *   app.post('/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
     *     // Mercado Pago
     *     const body = JSON.parse(req.body)
     *     if (body.type === 'payment') {
     *       const paymentId = body.data.id
     *       const payment = await mp.payment.get(paymentId)
     *       if (payment.status === 'approved') {
     *         await db.updateOrderPaymentStatus(payment.external_reference, 'PAGO')
     *         // Notificar cliente via WhatsApp Business API (opcional)
     *       }
     *     }
     *     res.sendStatus(200)
     *   })
     */
    webhook: null,
  }

  // ══════════════════════════════════════════════════════════
  //  UTILITÁRIOS EXPORTADOS
  // ══════════════════════════════════════════════════════════

  const utils = {
    uid: _uid,
    now: _now,
    hashLocal: _hashLocal,
    slugify: _slugify,

    formatMoeda: (v) => 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
    formatData: (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '—',
    formatDist: (km) => km < 1 ? Math.round(km * 1000) + 'm' : km < 10 ? km.toFixed(1) + ' km' : Math.round(km) + ' km',
    starsHTML: (n, max = 5) => {
      const r = Math.round(n)
      return `<span style="color:#ffc107">${icon('rating-star').repeat(r)}</span><span style="color:#e0e0e0">${icon('rating-star').repeat(max - r)}</span>`
    },
    avgRating: (avs) => avs.length ? avs.reduce((s, a) => s + a.estrelas, 0) / avs.length : 0,
    haversine: (lat1, lon1, lat2, lon2) => geo.distance(lat1, lon1, lat2, lon2),
  }

  // ── HELPERS PRIVADOS ─────────────────────────────────────

  function _slugify(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  /** QR code fake em SVG para simular PIX */
  function _fakeQRSVG() {
    const S = 4, N = 21, cells = []
    const finder = (ox, oy) => {
      for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
        const border = r === 0 || r === 6 || c === 0 || c === 6
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4
        if (border || inner) cells.push(`<rect x="${(ox + c) * S}" y="${(oy + r) * S}" width="${S - 1}" height="${S - 1}" fill="#000"/>`)
      }
    }
    finder(0, 0); finder(14, 0); finder(0, 14)
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= 13) || (r >= 13 && c < 8)) continue
      if (Math.abs(Math.sin(r * 17 + c * 31 + r * c * 7)) > 0.45)
        cells.push(`<rect x="${c * S}" y="${r * S}" width="${S - 1}" height="${S - 1}" fill="#000"/>`)
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${N * S} ${N * S}" width="150" height="150" style="border-radius:8px;border:8px solid #fff;background:#fff">${cells.join('')}</svg>`
  }

  // ══════════════════════════════════════════════════════════
  //  MÓDULO: ENTREGA LOCAL (delivery)
  //
  //  Contexto: BelaVenda faz entregas CURTAS e URBANAS —
  //  geralmente dentro da mesma cidade, por motoboy.
  //  O cálculo é baseado em DISTÂNCIA EM KM, não em região.
  //
  //  OPÇÕES DISPONÍVEIS:
  //  ─ Motoboy Expresso    → mesmo dia, 30min–3h (até ~25 km)
  //  ─ Motoboy Econômico   → agendado, mais barato (até ~25 km)
  //  ─ Retirada no Local   → sempre disponível, gratuito
  //  ─ Entrega Revendedora → a própria revendedora entrega
  //
  //  TABELA DE PREÇOS (motoboy urbano, referência 2024):
  //  Até 3 km  → R$ 10 (expresso) / R$ 7 (econômico)
  //  3–6 km    → R$ 14 / R$ 10
  //  6–10 km   → R$ 18 / R$ 13
  //  10–15 km  → R$ 23 / R$ 17
  //  15–20 km  → R$ 29 / R$ 22
  //  20–25 km  → R$ 36 / R$ 28
  //  > 25 km   → motoboy indisponível
  //
  //  MIGRAÇÃO PARA API REAL — LALAMOVE (recomendado):
  //  1. Crie conta em https://www.lalamove.com/pt-br/
  //  2. API Docs: https://developers.lalamove.com/
  //  3. BV_CONFIG.deliveryProvider = 'lalamove'
  //  4. BV_CONFIG.lalamoveKey = 'sua-api-key' (backend)
  //  5. Backend: POST /api/delivery/quote
  //     → repassa: POST https://rest.lalamove.com/v3/quotations
  //     Body: { serviceType:'MOTORCYCLE', stops:[{coordinates},...] }
  //
  //  ALTERNATIVA — LOGGI:
  //  Cobre SP, RJ, BH, Curitiba, Porto Alegre e outras capitais
  //  https://api.loggi.com/
  //
  //  RESPOSTA NORMALIZADA (igual para todos os providers):
  //  Array<{ id, name, price, etaMinutes, etaLabel, logo, desc, free, distKm }>
  // ══════════════════════════════════════════════════════════

  const delivery = {
    // Cache de geocoding CEP → {lat, lng}
    _geoCache: {},

    // Tabela de preços por faixa de distância
    // [kmMax, precoExpresso, precoEconomico]
    _faixas: [
      [3,  10.0,  7.0],
      [6,  14.0, 10.0],
      [10, 18.0, 13.0],
      [15, 23.0, 17.0],
      [20, 29.0, 22.0],
      [25, 36.0, 28.0],
    ],

    /**
     * Geocodifica CEP → {lat, lng} via ViaCEP + Nominatim (com cache)
     */
    async _cepToLatLng(cep) {
      const c = cep.replace(/\D/g, '').slice(0, 8)
      if (this._geoCache[c]) return this._geoCache[c]
      try {
        const rv = await fetch(`https://viacep.com.br/ws/${c}/json/`)
        const dv = await rv.json()
        if (dv.erro) return null
        const q = encodeURIComponent(`${c}, ${dv.localidade}, ${dv.uf}, Brasil`)
        const rn = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
          { headers: { 'Accept-Language': 'pt-BR', 'User-Agent': 'BelaVenda/1.0' } }
        )
        const dn = await rn.json()
        if (!dn.length) return null
        const coords = { lat: parseFloat(dn[0].lat), lng: parseFloat(dn[0].lon) }
        this._geoCache[c] = coords
        return coords
      } catch { return null }
    },

    /** Retorna preços pelo bucket de distância */
    _calcPreco(distKm) {
      for (const [max, exp, eco] of this._faixas) {
        if (distKm <= max) return { expresso: exp, economico: eco }
      }
      return null // além de 25 km
    },

    /** Haversine rápido em km */
    _dist(a, b) {
      const R = 6371, toR = d => d * Math.PI / 180
      const dLat = toR(b.lat - a.lat), dLon = toR(b.lng - a.lng)
      const x = Math.sin(dLat/2)**2 +
                Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) *
                Math.sin(dLon/2)**2
      return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x)) * 10) / 10
    },

    /**
     * Calcula opções de entrega locais por motoboy
     *
     * @param {{
     *   fromCEP?: string,       CEP da revendedora
     *   toCEP?: string,         CEP do cliente
     *   fromCoords?: {lat,lng}, coordenadas da revendedora (evita geocoding)
     *   toCoords?: {lat,lng},   coordenadas do cliente
     *   items?: Array
     * }} params
     * @returns {Promise<Array>} opções ordenadas por preço
     */
    async quote({ fromCEP, toCEP, fromCoords, toCoords, items = [] }) {

      // ── SIMULADO (provider 'fake') ─────────────────────────
      if (BV_CONFIG.deliveryProvider === 'fake') {

        // Obtém coordenadas — prioriza coords já conhecidas para evitar chamadas
        let cFrom = fromCoords || null
        let cTo   = toCoords   || null
        if (!cFrom && fromCEP) cFrom = await this._cepToLatLng(fromCEP)
        if (!cTo   && toCEP)   cTo   = await this._cepToLatLng(toCEP)

        const distKm = (cFrom && cTo) ? this._dist(cFrom, cTo) : null
        const precos = distKm !== null ? this._calcPreco(distKm) : null
        const distLabel = distKm !== null ? `${distKm} km` : ''
        const opts = []

        // Retirada — sempre disponível e gratuita
        opts.push({
          id: 'retirada',
          name: 'Retirada no Local',
          logo: 'handshake-pickup',
          price: 0, free: true,
          etaMinutes: 0,
          etaLabel: 'Combinar horário',
          desc: 'Retire pessoalmente com a revendedora — sem custo!',
          distKm,
        })

        if (precos) {
          // ETA realista por distância
          const etaExp = distKm <= 5 ? '30–50 min' : distKm <= 12 ? '50–90 min' : '1,5–3h'
          const etaExpMin = distKm <= 5 ? 40 : distKm <= 12 ? 70 : 130

          opts.push({
            id: 'motoboy_expresso',
            name: 'Motoboy Expresso',
            logo: 'motorcycle-express',
            price: precos.expresso,
            free: false,
            etaMinutes: etaExpMin,
            etaLabel: `Hoje • ${etaExp}`,
            desc: `Entrega rápida pelo motoboy${distLabel ? ' · ' + distLabel : ''}`,
            distKm,
          })

          opts.push({
            id: 'motoboy_economico',
            name: 'Motoboy Econômico',
            logo: 'scooter-economy',
            price: precos.economico,
            free: false,
            etaMinutes: 1440,
            etaLabel: 'Agendado • combinar horário',
            desc: `Entrega agendada com a revendedora${distLabel ? ' · ' + distLabel : ''}`,
            distKm,
          })
        } else if (distKm !== null && distKm > 25) {
          // Fora do alcance — informa mas não bloqueia (ainda tem retirada)
          opts.push({
            id: 'motoboy_indisponivel',
            name: 'Motoboy indisponível',
            logo: 'alert-triangle',
            price: null, free: false,
            etaMinutes: null,
            etaLabel: `${distKm} km — fora do alcance`,
            desc: 'Distância acima de 25 km. Opte por retirada ou entrega pela revendedora.',
            distKm,
            unavailable: true,
          })
        }

        // Entrega pela própria revendedora — sempre disponível
        opts.push({
          id: 'revendedora',
          name: 'Entrega pela Revendedora',
          logo: 'lipstick',
          price: 0, free: true,
          etaMinutes: null,
          etaLabel: 'A combinar',
          desc: 'A revendedora entrega pessoalmente no horário que você combinar',
          distKm,
        })

        return opts.sort((a, b) => {
          if (a.unavailable) return 1
          if (b.unavailable) return -1
          return (a.price || 0) - (b.price || 0)
        })
      }

      // ── LALAMOVE (motoboy API real) ────────────────────────
      // 1. BV_CONFIG.deliveryProvider = 'lalamove'
      // 2. BV_CONFIG.lalamoveKey = 'sua-key' (configurar no backend)
      //
      // const [cFrom, cTo] = await Promise.all([
      //   fromCoords || this._cepToLatLng(fromCEP),
      //   toCoords   || this._cepToLatLng(toCEP),
      // ])
      // const res = await _http.post('/delivery/quote', {
      //   provider: 'lalamove',
      //   serviceType: 'MOTORCYCLE',
      //   stops: [
      //     { coordinates: { lat: String(cFrom.lat), lng: String(cFrom.lng) } },
      //     { coordinates: { lat: String(cTo.lat),   lng: String(cTo.lng)   } },
      //   ],
      // })
      // // Lalamove retorna preço em centavos
      // const price = parseFloat(res.priceBreakdown.total) / 100
      // const distKm = parseFloat(res.distance?.value || 0)
      // return [
      //   {
      //     id: 'lalamove_moto', name: 'Motoboy Lalamove', logo: 'motorcycle-express',
      //     price, free: false,
      //     etaMinutes: res.estimatedTimeline?.pickup?.from || 30,
      //     etaLabel: `Hoje • ~${res.estimatedTimeline?.pickup?.from || 30} min`,
      //     desc: `Entrega via Lalamove · ${distKm} km`,
      //     distKm,
      //   },
      //   { id:'retirada', name:'Retirada no Local', logo:'handshake-pickup', price:0, free:true,
      //     etaMinutes:0, etaLabel:'Combinar horário',
      //     desc:'Retire pessoalmente com a revendedora — sem custo!', distKm },
      // ]

      // ── LOGGI (alternativa) ───────────────────────────────
      // https://api.loggi.com/graphql
      // const res = await _http.post('/delivery/quote', { provider:'loggi', from_cep:fromCEP, to_cep:toCEP })
      // return res.map(o => ({ id:o.pk, name:o.label, price:o.price, ... }))
    },

    /**
     * Cria corrida de motoboy (pós-pagamento)
     * REAL: Lalamove POST /v3/orders ou Loggi createOrder
     */
    async createRide({ orderId, fromCEP, toCEP, fromCoords, toCoords }) {
      if (BV_CONFIG.deliveryProvider === 'fake') {
        return {
          rideId: 'BV' + (orderId || '').slice(-6).toUpperCase(),
          status: 'AGUARDANDO_MOTOBOY',
          trackingUrl: null,
        }
      }
      // REAL: return await _http.post('/delivery/create', { provider:'lalamove', orderId, ... })
    },

    /**
     * Rastreamento em tempo real
     * REAL: Lalamove GET /v3/orders/:id ou Loggi tracking
     */
    async track(rideId) {
      if (!rideId) return null
      if (BV_CONFIG.deliveryProvider === 'fake') {
        return {
          rideId,
          status: 'A_CAMINHO',
          statusLabel: 'Motoboy a caminho',
          driverName: 'Carlos M.',
          etaMinutes: 12,
          events: [
            { time: new Date().toISOString(), label: 'Motoboy a caminho — ETA ~12 min' },
            { time: new Date(Date.now() - 600000).toISOString(), label: 'Pedido coletado com a revendedora' },
            { time: new Date(Date.now() - 1200000).toISOString(), label: 'Motoboy alocado para a corrida' },
          ],
        }
      }
      // REAL: return await _http.get(`/delivery/track/${rideId}`)
    },
  }

  // ── EXPORTA ──────────────────────────────────────────────

  global.BV = { config: BV_CONFIG, db, auth, geo, payments, delivery, utils, _http }

  // Atalhos globais retrocompatíveis (remover após migração total dos HTMLs)
  global.BV_fmtM = utils.formatMoeda
  global.BV_uid = _uid
  global.BV_now = _now

})(window)
