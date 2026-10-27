```text
src/
├── models/       tipos do domínio: Ativo, Transacao, Provento, Dados
├── lib/          lógica pura, sem React: posição, resumo, proventos, metas,
│                 calculadoras, validação e migração dos dados, exportação
├── hooks/        useCarteira (estado e ações), useLocalStorage, useTheme
├── contexts/     CarteiraProvider e ToastProvider
├── components/   interface (ui/: Button, Card, Modal, Field, Input)
└── pages/        uma tela por rota: Painel, Carteira, Proventos, Calculadoras e 404
```

> [!NOTE]
> A lógica de negócio fica em `lib/`, sem dependência de React. Os componentes só chamam essas funções.

<details>
<summary><b>Como adicionar uma página nova</b></summary>

<br />

1. Crie `src/pages/nome-page.tsx` exportando o componente da tela.
2. Registre a rota em `src/App.tsx`, dentro do `<Route element={<Layout />}>`.
3. Inclua o item em `navItems`, no `src/layout.tsx`, para aparecer no menu.
4. Adicione o caminho em `ROTAS`, no `vite.config.ts`, para entrar no `sitemap.xml`.

</details>
