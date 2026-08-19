import { useTheme } from "../hooks/useTheme";
import { SummaryCards } from "../components/summary-card";
import { ChartsGrid } from "../components/charts-grid";
import { useCarteiraContext } from "../contexts/carteira-context";

export function PainelPage() {
  const { theme } = useTheme();
  const { ativos, totalInvestido, totalCotas } = useCarteiraContext();

  return (
    <>
      <SummaryCards
        totalInvestido={totalInvestido}
        totalCotas={totalCotas}
        quantidadeAtivos={ativos.length}
      />

      <section className="grid gap-3">
        <h2 className="text-sm font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
          Alocação
        </h2>
        <ChartsGrid ativos={ativos} theme={theme} />
      </section>
    </>
  );
}
