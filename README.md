# FIInance

Acompanhe sua carteira de Fundos Imobiliários (FIIs): posição e preço médio calculados a partir das suas operações, cotações, proventos, meta de alocação e calculadoras de Magic Number e Preço Médio.

Os dados ficam apenas no `localStorage` do navegador. Use **Carteira → Backup dos dados** para exportar/importar um JSON (e um CSV das operações).

## Rodando

```bash
pnpm install
pnpm dev      # servidor de desenvolvimento
pnpm build    # checagem de tipos + build de produção
pnpm lint
```

## Estrutura

- `src/models` — tipos do domínio (`Ativo`, `Transacao`, `Provento`, `Dados`).
- `src/lib` — lógica pura, sem React: posição/preço médio (`posicao`), resumo, proventos, metas, calculadoras, validação/migração dos dados.
- `src/hooks` — `useCarteira` (estado e ações), `useLocalStorage` (persistência sincronizada entre componentes e abas), `useTheme`.
- `src/contexts` — `CarteiraProvider` e `ToastProvider`.
- `src/components`, `src/pages` — interface.

## Modelo de dados

O app guarda **operações** (compras e vendas), não posições. Cotas e preço médio de cada ativo são derivados delas: compras recalculam o preço médio; vendas reduzem as cotas e mantêm o preço médio. A carteira no formato antigo (`fiinance:carteira`) é convertida automaticamente na primeira abertura, com uma compra inicial por ativo datada de hoje.

## Cotações

Podem ser digitadas manualmente ou buscadas na [brapi](https://brapi.dev). FIIs exigem um token gratuito, informado em **Carteira → Cotações** e guardado só no navegador (fora do backup).

## Deploy

O app usa `BrowserRouter`, então o host precisa redirecionar qualquer rota para o `index.html` (SPA fallback); sem isso, atualizar a página em `/carteira` retorna 404.

## SEO (robots, sitemap, Open Graph)

`robots.txt` e `sitemap.xml` são gerados no `pnpm build` a partir de `VITE_SITE_URL` (veja `.env.example`), que também torna absolutas as URLs de `og:image`/`twitter:image`. Defina-a no ambiente de build do seu host (ou em `.env.production`). Sem ela, o `robots.txt` sai sem a linha `Sitemap` e o `sitemap.xml` não é gerado. Ao criar uma rota nova, adicione-a em `ROTAS` no `vite.config.ts`.
