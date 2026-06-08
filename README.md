# BelaVenda 💄

Marketplace de beleza que conecta **revendedoras** independentes a **clientes** próximos —
com match por proximidade, catálogo, pedidos, entrega por motoboy e pagamento.

> **Versão de demonstração.** O site é 100% estático (HTML + CSS + JavaScript) e guarda os
> dados no navegador de cada visitante (`localStorage`). Ainda **não há servidor compartilhado**,
> então cada pessoa que abrir o link tem seus próprios dados de teste — perfeito para avaliar a
> experiência, ainda não para uso real entre várias pessoas.

## Como avaliar

**Como cliente** (descobrir revendedoras e comprar)
1. Abra o site e clique em **Sou Cliente**.
2. Informe um nome e um CEP qualquer (ex.: `01310-100` — São Paulo).
3. Use o **Match** (deslize as revendedoras), o **Explorar**, abra uma loja, monte um pedido e
   finalize o checkout (escolha entrega por motoboy e forma de pagamento).

**Como revendedora** (painel de gestão)
- Em **Sou Revendedora → Entrar**, use uma conta de demonstração:
  - E-mail: `camila@belavenda.app` (ou `renata@`, `julia@`, `aline@`, `bella@`)
  - Senha: `demo1234`
- Veja o painel de vendas/lucro, gerencie produtos (com seletor de ícones), abra/feche a loja e
  acompanhe pedidos.

> Já vem pré-populado com revendedoras, produtos e avaliações de exemplo em várias cidades.
> Para zerar tudo: abra o console do navegador e rode `localStorage.clear()`, depois recarregue.

## Tecnologia

- HTML + CSS + JavaScript puro (sem framework, sem build).
- `belavenda-api.js` — camada de serviço com adaptadores prontos para um backend real
  (autenticação, banco, geocoding, pagamentos, entrega via Lalamove/Loggi).
- `bv-icons.js` — sistema de ícones SVG compartilhado.
- `bv-seed.js` — dados de demonstração (remover em produção).

## Rodar localmente

Abra `index.html` no navegador, ou rode o servidor incluído:

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
# http://localhost:5500
```
