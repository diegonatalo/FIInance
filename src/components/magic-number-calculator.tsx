import { useMemo, useState } from "react";
import { Card, CardTitle } from "./ui/card";
import { cn, formatBRL, formatNumber } from "../lib/format";
import type { Fii } from "../models/fii";
import { SparkleIcon, TargetIcon, TrendUpIcon } from "@phosphor-icons/react";

interface MagicNumberCalcProps {
  ativos: Fii[];
}

export function MagicNumberCalc({ ativos }: MagicNumberCalcProps) {
  const [ativoId, setAtivoId] = useState<string>("");
  const [dividendo, setDividendo] = useState("");
  const [cotacao, setCotacao] = useState("");
  const [cotasManuais, setCotasManuais] = useState("");

  const ativoSelecionado = ativos.find((a) => a.id === ativoId) ?? null;

  // cotas atuais: do ativo selecionado ou do campo manual
  const cotasAtuais = ativoSelecionado
    ? ativoSelecionado.cotas
    : Number(cotasManuais) || 0;

  const resultado = useMemo(() => {
    const div = Number(dividendo);
    const cot = Number(cotacao);
    if (
      !Number.isFinite(div) ||
      div <= 0 ||
      !Number.isFinite(cot) ||
      cot <= 0
    ) {
      return null;
    }
    // magic number = cotação / dividendo por cota (arredondado para cima)
    const magicNumber = Math.ceil(cot / div);
    const faltam = Math.max(0, magicNumber - cotasAtuais);
    const progresso =
      magicNumber > 0 ? Math.min(100, (cotasAtuais / magicNumber) * 100) : 0;
    const atingiu = cotasAtuais >= magicNumber;
    // quanto de aporte ainda falta, ao preço da cotação atual
    const aporteFaltante = faltam * cot;
    return { magicNumber, faltam, progresso, atingiu, aporteFaltante };
  }, [dividendo, cotacao, cotasAtuais]);

  const inputClass =
    "w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 border-zinc-300 dark:border-zinc-700";

  function handleAtivo(id: string) {
    setAtivoId(id);
    if (id) setCotasManuais("");
  }

  return (
    <Card>
      <div className="mb-1 flex items-center gap-2">
        <SparkleIcon size={16} className="text-emerald-500" />
        <CardTitle className="text-zinc-900 dark:text-zinc-100">
          Calculadora de Magic Number
        </CardTitle>
      </div>
      <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
        Descubra quantas cotas você precisa para que os dividendos comprem uma
        nova cota todo mês.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Usar ativo da carteira (opcional)
            </span>
            <select
              value={ativoId}
              onChange={(e) => handleAtivo(e.target.value)}
              className={cn(inputClass, "capitalize")}
            >
              <option value="">Informar cotas manualmente</option>
              {ativos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.ticker} — {formatNumber(a.cotas)} cotas
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Dividendo por cota (R$)
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={dividendo}
                onChange={(e) => setDividendo(e.target.value)}
                placeholder="0,90"
                className={inputClass}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Cotação atual (R$)
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={cotacao}
                onChange={(e) => setCotacao(e.target.value)}
                placeholder="10,30"
                className={inputClass}
              />
            </label>
          </div>

          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Cotas que você já possui
            </span>
            <input
              type="number"
              min="0"
              step="1"
              disabled={!!ativoSelecionado}
              value={ativoSelecionado ? ativoSelecionado.cotas : cotasManuais}
              onChange={(e) => setCotasManuais(e.target.value)}
              placeholder="0"
              className={cn(inputClass, ativoSelecionado && "opacity-60")}
            />
          </label>
        </div>

        {/* Resultado */}
        <div className="flex min-h-40 flex-col justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/50">
          {!resultado ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <TargetIcon
                size={22}
                className="text-zinc-300 dark:text-zinc-600"
              />
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Preencha o dividendo e a cotação para ver o resultado.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Magic Number
                  </p>
                  <p className="text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatNumber(resultado.magicNumber)}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    cotas necessárias
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Você tem
                  </p>
                  <p className="text-2xl font-semibold tabular-nums">
                    {formatNumber(cotasAtuais)}
                  </p>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="grid gap-1.5">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      resultado.atingiu ? "bg-emerald-500" : "bg-emerald-400",
                    )}
                    style={{ width: `${resultado.progresso}%` }}
                  />
                </div>
                <p className="text-right text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
                  {resultado.progresso.toFixed(1)}%
                </p>
              </div>

              {resultado.atingiu ? (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendUpIcon size={16} />
                  Meta atingida! Os dividendos já compram uma nova cota.
                </div>
              ) : (
                <div className="rounded-lg bg-zinc-100 px-3 py-2.5 dark:bg-zinc-800/60">
                  <p className="text-sm text-zinc-700 dark:text-zinc-200">
                    Faltam{" "}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatNumber(resultado.faltam)}
                    </span>{" "}
                    cotas — cerca de{" "}
                    <span className="font-semibold">
                      {formatBRL(resultado.aporteFaltante)}
                    </span>{" "}
                    em aportes.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
