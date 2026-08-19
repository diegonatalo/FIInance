import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Fii } from "../models/fii";

const STORAGE_KEY = "fiinance:carteira";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useCarteira() {
  const [ativos, setAtivos] = useLocalStorage<Fii[]>(STORAGE_KEY, []);

  const adicionar = useCallback(
    (fii: Omit<Fii, "id">) => {
      setAtivos((prev) => [...prev, { ...fii, id: uid() }]);
    },
    [setAtivos],
  );

  const atualizar = useCallback(
    (id: string, patch: Omit<Fii, "id">) => {
      setAtivos((prev) =>
        prev.map((a) => (a.id === id ? { ...patch, id } : a)),
      );
    },
    [setAtivos],
  );

  const remover = useCallback(
    (id: string) => {
      setAtivos((prev) => prev.filter((a) => a.id !== id));
    },
    [setAtivos],
  );

  const totalInvestido = useMemo(
    () => ativos.reduce((acc, a) => acc + a.cotas * a.precoMedio, 0),
    [ativos],
  );

  const totalCotas = useMemo(
    () => ativos.reduce((acc, a) => acc + a.cotas, 0),
    [ativos],
  );

  return { ativos, adicionar, atualizar, remover, totalInvestido, totalCotas };
}
