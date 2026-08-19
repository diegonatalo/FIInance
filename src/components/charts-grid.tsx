import { PieChartCard } from "./pie-chart";
import {
  distribuicaoPorAtivo,
  distribuicaoPorTipo,
  distribuicaoSegmentoPapel,
  distribuicaoSegmentoTijolo,
} from "../lib/distribuicao";
import type { Fii } from "../models/fii";

interface ChartsGridProps {
  ativos: Fii[];
  theme: "light" | "dark";
}

export function ChartsGrid({ ativos, theme }: ChartsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PieChartCard
        title="Distribuição por ativo"
        data={distribuicaoPorAtivo(ativos)}
        theme={theme}
      />
      <PieChartCard
        title="Papel vs. Tijolo"
        data={distribuicaoPorTipo(ativos)}
        theme={theme}
      />
      <PieChartCard
        title="Segmentos · Papel"
        data={distribuicaoSegmentoPapel(ativos)}
        theme={theme}
      />
      <PieChartCard
        title="Segmentos · Tijolo"
        data={distribuicaoSegmentoTijolo(ativos)}
        theme={theme}
      />
    </div>
  );
}
