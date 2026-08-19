import { Button } from "./ui/button";
import { formatBRL, formatNumber } from "../lib/format";
import type { Fii } from "../models/fii";
import {
  PencilSimpleIcon,
  TrashSimpleIcon,
  WalletIcon,
} from "@phosphor-icons/react";

interface FiiTableProps {
  ativos: Fii[];
  total: number;
  onEdit: (fii: Fii) => void;
  onDelete: (id: string) => void;
}

export function FiiTable({ ativos, total, onEdit, onDelete }: FiiTableProps) {
  if (ativos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <WalletIcon size={22} />
        </div>
        <div>
          <p className="font-medium text-zinc-700 dark:text-zinc-200">
            Carteira vazia
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Adicione seu primeiro FII no formulário acima.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <th className="px-3 py-3 font-medium">Ticker</th>
            <th className="px-3 py-3 font-medium">Tipo</th>
            <th className="px-3 py-3 font-medium">Segmento</th>
            <th className="px-3 py-3 text-right font-medium">Cotas</th>
            <th className="px-3 py-3 text-right font-medium">Preço médio</th>
            <th className="px-3 py-3 text-right font-medium">Total</th>
            <th className="px-3 py-3 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {ativos.map((a) => {
            const totalAtivo = a.cotas * a.precoMedio;
            return (
              <tr
                key={a.id}
                className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-zinc-800/40"
              >
                <td className="px-3 py-3 font-semibold text-zinc-900 dark:text-zinc-50">
                  {a.ticker}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={
                      a.tipo === "papel"
                        ? "rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium capitalize text-emerald-600 dark:text-emerald-400"
                        : "rounded-md bg-zinc-200/70 px-2 py-0.5 text-xs font-medium capitalize text-zinc-700 dark:bg-zinc-700/50 dark:text-zinc-300"
                    }
                  >
                    {a.tipo}
                  </span>
                </td>
                <td className="px-3 py-3 capitalize text-zinc-600 dark:text-zinc-300">
                  {a.segmento}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-300">
                  {formatNumber(a.cotas)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-300">
                  {formatBRL(a.precoMedio)}
                </td>
                <td className="px-3 py-3 text-right font-medium tabular-nums text-zinc-900 dark:text-zinc-50">
                  {formatBRL(totalAtivo)}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      onClick={() => onEdit(a)}
                      className="px-2!"
                      aria-label={`Editar ${a.ticker}`}
                    >
                      <PencilSimpleIcon size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => onDelete(a.id)}
                      className="px-2!"
                      aria-label={`Excluir ${a.ticker}`}
                    >
                      <TrashSimpleIcon size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-zinc-200 dark:border-zinc-700">
            <td
              colSpan={5}
              className="px-3 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400"
            >
              Total investido
            </td>
            <td className="px-3 py-3 text-right text-base font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {formatBRL(total)}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
