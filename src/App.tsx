import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./layout";
import { PainelPage } from "./pages/painel-page";
import { CarteiraPage } from "./pages/carteira-page";
import { ProventosPage } from "./pages/proventos-page";
import { CalculadorasPage } from "./pages/calculadoras-page";
import { NotFoundPage } from "./pages/not-found-page";
import { CarteiraProvider } from "./contexts/carteira-provider";
import { ToastProvider } from "./contexts/toast-provider";

export default function App() {
  return (
    <ToastProvider>
      <CarteiraProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<PainelPage />} />
              <Route path="carteira" element={<CarteiraPage />} />
              <Route path="proventos" element={<ProventosPage />} />
              <Route path="calculadoras" element={<CalculadorasPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CarteiraProvider>
    </ToastProvider>
  );
}
