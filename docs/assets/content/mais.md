### 🔒 Seus dados ficam com você

Não há servidor nem conta. Tudo é salvo no `localStorage` do navegador, na chave `fiinance:dados`.

Limpar os dados do navegador apaga a carteira, então use **Carteira → Backup dos dados** de vez em quando.
Ao ler, o app valida o conteúdo, e um backup corrompido não derruba a tela.

Para buscar cotações, o app consulta a [brapi](https://brapi.dev), que exige um token para FIIs.
Sem ele a API responde 401, e dá para digitar a cotação à mão. O token fica só no navegador e não entra no backup.

### 🧠 Como os cálculos funcionam

O app guarda **operações**, e a posição de cada fundo é sempre derivada delas.

| Conceito | Regra |
|---|---|
| **Compra** | Soma as cotas e recalcula o preço médio ponderado. |
| **Venda** | Reduz as cotas e mantém o preço médio. Não deixa vender mais do que havia na data. |
| **Provento** | `valor por cota × cotas em carteira na data do pagamento`. |
| **Yield on cost (12m)** | Proventos dos últimos 12 meses ÷ total investido. |
| **Magic Number** | `⌈cotação ÷ dividendo por cota⌉`: cotas para os dividendos comprarem uma nova por mês. |
| **Aporte para a meta** | Menor compra em uma só classe que leva à proporção desejada: `(A + x) / (T + x) = alvo`. |

> Os valores servem para acompanhamento e não substituem a nota de corretagem nem o informe de
> rendimentos. O app não calcula imposto de renda.

### 🌐 Deploy

O app é publicado na [Vercel](https://vercel.com). O `vercel.json` redireciona qualquer rota para o
`index.html`, porque o app usa `BrowserRouter`. Em outro host, configure o mesmo *SPA fallback*;
sem ele, atualizar a página em `/carteira` retorna 404.

Ao mudar de domínio, atualize `VITE_SITE_URL` em `.env.production`. É ela que gera o `sitemap.xml`,
o `robots.txt` e as URLs absolutas de `og:image` e `twitter:image` usadas nos previews de links.

### 🧭 Próximos passos

- [ ] Testes automatizados e CI, que ainda não existem.
- [ ] Importar cotações e proventos sem token, o que pede um proxy próprio por causa do CORS.
- [ ] Lucro realizado e imposto de renda sobre vendas.
- [ ] Paginação do histórico de operações e de proventos, que cresce com o tempo.
- [ ] Sincronização entre dispositivos. Hoje o caminho é o backup em JSON.

### 🙏 Créditos

Ícones do [Phosphor Icons](https://phosphoricons.com), gráficos com [Recharts](https://recharts.org)
e cotações opcionais pela [brapi](https://brapi.dev).
