import { useState } from "react";
import { useTheme } from "./hooks/useTheme";
import { useCarteira } from "./hooks/useCarteira";
import { ThemeToggle } from "./components/theme-toggle";
import { SummaryCards } from "./components/summary-card";
import { FiiForm } from "./components/fii-form";
import { FiiTable } from "./components/fii-table";
import { ChartsGrid } from "./components/charts-grid";
import { Modal } from "./components/ui/modal";
import { Toast } from "./components/toast";
import { Card, CardTitle } from "./components/ui/card";
import type { Fii } from "./models/fii";
import { BuildingsIcon } from "@phosphor-icons/react";
import { MagicNumberCalc } from "./components/magic-number-calculator";
import { PrecoMedioCalc } from "./components/preco-medio-calculator";

export default function App() {
  const { theme, toggle } = useTheme();
  const { ativos, adicionar, atualizar, remover, totalInvestido, totalCotas } =
    useCarteira();

  const [editing, setEditing] = useState<Fii | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function handleAdd(data: Omit<Fii, "id">) {
    adicionar(data);
    setToast(`${data.ticker} adicionado à carteira`);
  }

  function handleUpdate(data: Omit<Fii, "id">) {
    if (!editing) return;
    atualizar(editing.id, data);
    setToast(`${data.ticker} atualizado`);
    setEditing(null);
  }

  function handleDelete(id: string) {
    const alvo = ativos.find((a) => a.id === id);
    remover(id);
    setToast(alvo ? `${alvo.ticker} removido` : "Ativo removido");
  }

  return (
    <div className="min-h-full overflow-x-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white">
              <BuildingsIcon size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight">
                FIInance
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                transforme dados em decisões
              </p>
            </div>
          </div>
          <ThemeToggle theme={theme} onToggle={toggle} />
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6">
        <SummaryCards
          totalInvestido={totalInvestido}
          totalCotas={totalCotas}
          quantidadeAtivos={ativos.length}
        />

        <Card>
          <CardTitle className="mb-4">Adicionar ativo</CardTitle>
          <FiiForm onSubmit={handleAdd} />
        </Card>

        <section className="grid gap-3">
          <h2 className="text-sm font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
            Alocação
          </h2>
          <ChartsGrid ativos={ativos} theme={theme} />
        </section>

        <MagicNumberCalc ativos={ativos} />

        <PrecoMedioCalc ativos={ativos} />

        <Card>
          <CardTitle className="mb-4">Meus ativos</CardTitle>
          <FiiTable
            ativos={ativos}
            total={totalInvestido}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        </Card>
      </main>

      <Modal
        open={!!editing}
        title="Editar ativo"
        onClose={() => setEditing(null)}
      >
        <FiiForm
          initial={editing}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}
