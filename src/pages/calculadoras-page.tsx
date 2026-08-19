import { MagicNumberCalc } from "../components/magic-number-calculator";
import { PrecoMedioCalc } from "../components/preco-medio-calculator";
import { useCarteiraContext } from "../contexts/carteira-context";

export function CalculadorasPage() {
  const { ativos } = useCarteiraContext();

  return (
    <>
      <MagicNumberCalc ativos={ativos} />
      <PrecoMedioCalc ativos={ativos} />
    </>
  );
}
