import { useMemo, useState } from "react";
import { Card, CardTitle } from "./ui/card";
import { cn, formatBRL, formatNumber } from "../lib/format";
import type { Fii } from "../models/fii";
import {
  ArrowRightIcon,
  CalculatorIcon,
  TrendDownIcon,
  TrendUpIcon,
} from "@phosphor-icons/react";

interface PrecoMedioCalcProps {
  ativos: Fii[];
}

export function PrecoMedioCalc({ ativos }: PrecoMedioCalcProps) {
  const [ativoId, setAtivoId] = useState<string>("");
  const [cotasAtuaisManuais, setCotasAtuaisManuais] = useState("");
  const [precoAtualManual, setPrecoAtualManual] = useState("");
  const [novasCotas, setNovasCotas] = useState("");
  const [precoNovo, setPrecoNovo] = useState("");

  const ativoSelecionado = ativos.find((a) => a.id === ativoId) ?? null;

  const cotasAtuais = ativoSelecionado
    ? ativoSelecionado.cotas
    : Number(cotasAtuaisManuais) || 0;
  const precoAtual = ativoSelecionado
    ? ativoSelecionado.precoMedio
    : Number(precoAtualManual) || 0;

  const resultado = useMemo(() => {
    const qtdNova = Number(novasCotas);
    const pNovo = Number(precoNovo);
    if (
      !Number.isFinite(cotasAtuais) ||
      cotasAtuais < 0 ||
      !Number.isFinite(precoAtual) ||
      precoAtual <= 0 ||
      !Number.isFinite(qtdNova) ||
      qtdNova <= 0 ||
      !Number.isFinite(pNovo) ||
      pNovo <= 0
    ) {
      return null;
    }
    const totalAtual = cotasAtuais * precoAtual;
    const totalNovo = qtdNova * pNovo;
    const totalCotas = cotasAtuais + qtdNova;
    const novoPrecoMedio = (totalAtual + totalNovo) / totalCotas;
    const variacao = novoPrecoMedio - precoAtual;
    const variacaoPct = precoAtual > 0 ? (variacao / precoAtual) * 100 : 0;
    return {
      novoPrecoMedio,
      totalCotas,
      aporte: totalNovo,
      novoTotalInvestido: totalAtual + totalNovo,
      variacao,
      variacaoPct,
    };
  }, [cotasAtuais, precoAtual, novasCotas, precoNovo]);

  const inputClass =
    "w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 border-zinc-300 dark:border-zinc-700";

  function handleAtivo(id: string) {
    setAtivoId(id);
    if (id) {
      setCotasAtuaisManuais("");
      setPrecoAtualManual("");
    }
  }

  // baixou o preço médio = bom (verde), subiu = laranja/vermelho
  const baixou = resultado ? resultado.variacao <= 0 : false;

  return (
    <Card>
      <div className="mb-1 flex items-center gap-2">
        <CalculatorIcon size={16} className="text-emerald-500" />
        <CardTitle className="text-zinc-900 dark:text-zinc-100">
          Calculadora de Preço Médio
        </CardTitle>
      </div>
      <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
        Simule um novo aporte e veja qual seria o seu novo preço médio. Nada é
        salvo — é só uma simulação.
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
              <option value="">Informar posição manualmente</option>
              {ativos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.ticker} — {formatNumber(a.cotas)} cotas a{" "}
                  {formatBRL(a.precoMedio)}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Cotas atuais
              </span>
              <input
                type="number"
                min="0"
                step="1"
                disabled={!!ativoSelecionado}
                value={
                  ativoSelecionado ? ativoSelecionado.cotas : cotasAtuaisManuais
                }
                onChange={(e) => setCotasAtuaisManuais(e.target.value)}
                placeholder="0"
                className={cn(inputClass, ativoSelecionado && "opacity-60")}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Preço médio atual (R$)
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                disabled={!!ativoSelecionado}
                value={
                  ativoSelecionado
                    ? ativoSelecionado.precoMedio
                    : precoAtualManual
                }
                onChange={(e) => setPrecoAtualManual(e.target.value)}
                placeholder="0,00"
                className={cn(inputClass, ativoSelecionado && "opacity-60")}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Novas cotas compradas
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={novasCotas}
                onChange={(e) => setNovasCotas(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Preço pago por cota (R$)
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={precoNovo}
                onChange={(e) => setPrecoNovo(e.target.value)}
                placeholder="0,00"
                className={inputClass}
              />
            </label>
          </div>
        </div>

        {/* Resultado */}
        <div className="flex min-h-40 flex-col justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/50">
          {!resultado ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <CalculatorIcon
                size={22}
                className="text-zinc-300 dark:text-zinc-600"
              />
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Preencha sua posição atual e o novo aporte para ver o novo preço
                médio.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Preço médio atual
                  </p>
                  <p className="text-xl font-semibold tabular-nums text-zinc-500 dark:text-zinc-400">
                    {formatBRL(precoAtual)}
                  </p>
                </div>
                <ArrowRightIcon
                  size={18}
                  className="shrink-0 text-zinc-400 dark:text-zinc-600"
                />
                <div className="text-right">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Novo preço médio
                  </p>
                  <p className="text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatBRL(resultado.novoPrecoMedio)}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                  baixou
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-orange-500/10 text-orange-600 dark:text-orange-400",
                )}
              >
                {baixou ? (
                  <TrendDownIcon size={16} />
                ) : (
                  <TrendUpIcon size={16} />
                )}
                Preço médio {baixou ? "cai" : "sobe"}{" "}
                {formatBRL(Math.abs(resultado.variacao))} (
                {resultado.variacaoPct >= 0 ? "+" : ""}
                {resultado.variacaoPct.toFixed(2)}%)
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800/60">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Total de cotas
                  </p>
                  <p className="font-semibold tabular-nums">
                    {formatNumber(resultado.totalCotas)}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800/60">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Aporte
                  </p>
                  <p className="font-semibold tabular-nums">
                    {formatBRL(resultado.aporte)}
                  </p>
                </div>
                <div className="col-span-2 rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800/60">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Novo total investido
                  </p>
                  <p className="font-semibold tabular-nums">
                    {formatBRL(resultado.novoTotalInvestido)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
