import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "../lib/format";
import {
  SEGMENTOS_PAPEL,
  SEGMENTOS_TIJOLO,
  type Fii,
  type FiiTipo,
  type Segmento,
} from "../models/fii";
import { FloppyDiskIcon, PlusIcon } from "@phosphor-icons/react";

interface FiiFormProps {
  onSubmit: (fii: Omit<Fii, "id">) => void;
  initial?: Fii | null;
  onCancel?: () => void;
}

interface FormErrors {
  ticker?: string;
  cotas?: string;
  precoMedio?: string;
}

const emptyForm = {
  ticker: "",
  tipo: "tijolo" as FiiTipo,
  segmento: "lajes" as Segmento,
  cotas: "",
  precoMedio: "",
};

export function FiiForm({ onSubmit, initial, onCancel }: FiiFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initial) {
      setForm({
        ticker: initial.ticker,
        tipo: initial.tipo,
        segmento: initial.segmento,
        cotas: String(initial.cotas),
        precoMedio: String(initial.precoMedio),
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initial]);

  const segmentos = form.tipo === "papel" ? SEGMENTOS_PAPEL : SEGMENTOS_TIJOLO;

  function handleTipo(tipo: FiiTipo) {
    setForm((f) => ({
      ...f,
      tipo,
      segmento: tipo === "papel" ? "IPCA" : "lajes",
    }));
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.ticker.trim()) e.ticker = "Informe o ticker";
    else if (form.ticker.trim().length < 4) e.ticker = "Ticker muito curto";

    const cotas = Number(form.cotas);
    if (!form.cotas.trim()) e.cotas = "Informe a quantidade";
    else if (!Number.isFinite(cotas) || cotas <= 0)
      e.cotas = "Deve ser maior que 0";

    const preco = Number(form.precoMedio);
    if (!form.precoMedio.trim()) e.precoMedio = "Informe o preço";
    else if (!Number.isFinite(preco) || preco <= 0)
      e.precoMedio = "Deve ser maior que 0";

    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    onSubmit({
      ticker: form.ticker.trim().toUpperCase(),
      tipo: form.tipo,
      segmento: form.segmento,
      cotas: Number(form.cotas),
      precoMedio: Number(form.precoMedio),
    });

    if (!initial) setForm(emptyForm);
  }

  const inputClass =
    "w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ticker" error={errors.ticker}>
          <input
            value={form.ticker}
            onChange={(e) => setForm((f) => ({ ...f, ticker: e.target.value }))}
            placeholder="HGLG11"
            className={cn(
              inputClass,
              errors.ticker
                ? "border-red-400 dark:border-red-500"
                : "border-zinc-300 dark:border-zinc-700",
            )}
          />
        </Field>

        <Field label="Tipo">
          <div className="grid grid-cols-2 gap-2">
            {(["tijolo", "papel"] as FiiTipo[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTipo(t)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors",
                  form.tipo === t
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Segmento">
          <select
            value={form.segmento}
            onChange={(e) =>
              setForm((f) => ({ ...f, segmento: e.target.value as Segmento }))
            }
            className={cn(
              inputClass,
              "border-zinc-300 capitalize dark:border-zinc-700",
            )}
          >
            {segmentos.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Qtd. de cotas" error={errors.cotas}>
          <input
            type="number"
            min="0"
            step="1"
            value={form.cotas}
            onChange={(e) => setForm((f) => ({ ...f, cotas: e.target.value }))}
            placeholder="100"
            className={cn(
              inputClass,
              errors.cotas
                ? "border-red-400 dark:border-red-500"
                : "border-zinc-300 dark:border-zinc-700",
            )}
          />
        </Field>

        <Field label="Preço médio (R$)" error={errors.precoMedio}>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.precoMedio}
            onChange={(e) =>
              setForm((f) => ({ ...f, precoMedio: e.target.value }))
            }
            placeholder="150,00"
            className={cn(
              inputClass,
              errors.precoMedio
                ? "border-red-400 dark:border-red-500"
                : "border-zinc-300 dark:border-zinc-700",
            )}
          />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-2">
        {initial && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">
          {initial ? (
            <>
              <FloppyDiskIcon size={16} /> Salvar alterações
            </>
          ) : (
            <>
              <PlusIcon size={16} /> Adicionar FII
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
