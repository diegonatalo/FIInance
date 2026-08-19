import { Card } from "./ui/card";
import { formatBRL, formatNumber } from "../lib/format";
import { CoinsIcon, StackIcon, WalletIcon } from "@phosphor-icons/react";

interface SummaryCardsProps {
  totalInvestido: number;
  totalCotas: number;
  quantidadeAtivos: number;
}

export function SummaryCards({
  totalInvestido,
  totalCotas,
  quantidadeAtivos,
}: SummaryCardsProps) {
  const items = [
    {
      label: "Total investido",
      value: formatBRL(totalInvestido),
      icon: WalletIcon,
      highlight: true,
    },
    {
      label: "Ativos na carteira",
      value: formatNumber(quantidadeAtivos),
      icon: StackIcon,
      highlight: false,
    },
    {
      label: "Total de cotas",
      value: formatNumber(totalCotas),
      icon: CoinsIcon,
      highlight: false,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ label, value, icon: Icon, highlight }) => (
        <Card key={label} className="flex items-center gap-4">
          <div
            className={
              highlight
                ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white"
                : "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            }
          >
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {label}
            </p>
            <p
              className={
                highlight
                  ? "truncate text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400"
                  : "truncate text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50"
              }
            >
              {value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
