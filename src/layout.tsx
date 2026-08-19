import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { useTheme } from "./hooks/useTheme";
import { useCarteira } from "./hooks/useCarteira";
import { ThemeToggle } from "./components/theme-toggle";
import { FiiForm } from "./components/fii-form";
import { Modal } from "./components/ui/modal";
import { Toast } from "./components/toast";
import type { Fii } from "./models/fii";
import type { CarteiraContext } from "./contexts/carteira-context";
import { BuildingsIcon } from "@phosphor-icons/react";

const navItems = [
  { to: "/", label: "Painel", end: true },
  { to: "/carteira", label: "Carteira", end: false },
  { to: "/calculadoras", label: "Calculadoras", end: false },
];

export function Layout() {
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

  const context: CarteiraContext = {
    ativos,
    totalInvestido,
    totalCotas,
    onAdd: handleAdd,
    onEdit: setEditing,
    onDelete: handleDelete,
  };

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white">
              <BuildingsIcon size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight">
                FIInance
              </h1>
              <p className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
                transforme dados em decisões
              </p>
            </div>
          </div>
          <ThemeToggle theme={theme} onToggle={toggle} />
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `-mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-6 *:min-w-0">
        <Outlet context={context} />
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
