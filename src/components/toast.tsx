import { CheckCircleIcon } from "@phosphor-icons/react";
import { useEffect } from "react";

interface ToastProps {
  message: string | null;
  onDone: () => void;
}

export function Toast({ message, onDone }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-emerald-500/30 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-lg dark:bg-zinc-900 dark:text-zinc-50"
    >
      <CheckCircleIcon size={18} className="text-emerald-500" />
      {message}
    </div>
  );
}
