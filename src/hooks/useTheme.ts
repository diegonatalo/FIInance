import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { CHAVE_TEMA } from "../lib/migracao";

export type Theme = "light" | "dark";

function sanitizarTema(raw: unknown): Theme | null {
  return raw === "dark" || raw === "light" ? raw : null;
}

function temaDoSistema(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [stored, setTheme] = useLocalStorage<Theme | null>(
    CHAVE_TEMA,
    null,
    sanitizarTema,
  );
  const theme = stored ?? temaDoSistema();

  // O script inline do index.html aplica a classe antes do primeiro paint;
  // aqui só mantemos sincronizado quando o usuário alterna.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return { theme, toggle };
}
