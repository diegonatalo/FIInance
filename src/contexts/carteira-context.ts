import { useOutletContext } from "react-router";
import type { Fii } from "../models/fii";

export interface CarteiraContext {
  ativos: Fii[];
  totalInvestido: number;
  totalCotas: number;
  onAdd: (data: Omit<Fii, "id">) => void;
  onEdit: (fii: Fii) => void;
  onDelete: (id: string) => void;
}

export function useCarteiraContext() {
  return useOutletContext<CarteiraContext>();
}
