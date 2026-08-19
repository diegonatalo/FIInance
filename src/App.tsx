import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./layout";
import { PainelPage } from "./pages/painel-page";
import { CarteiraPage } from "./pages/carteira-page";
import { CalculadorasPage } from "./pages/calculadoras-page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<PainelPage />} />
          <Route path="carteira" element={<CarteiraPage />} />
          <Route path="calculadoras" element={<CalculadorasPage />} />
          <Route path="*" element={<PainelPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
