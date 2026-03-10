import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function show(message, type = "info") {
    const id = Date.now() + Math.random();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 2600);
  }

  const value = useMemo(() => ({ show }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-4 right-4 z-[100] space-y-3 w-[min(92vw,360px)]">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const styles = {
    success: {
      border: "rgba(22,163,74,0.25)",
      bg: "rgba(22,163,74,0.10)",
      text: "#166534",
      icon: "✓",
    },
    error: {
      border: "rgba(239,68,68,0.25)",
      bg: "rgba(239,68,68,0.10)",
      text: "#b91c1c",
      icon: "✕",
    },
    info: {
      border: "rgba(37,99,235,0.25)",
      bg: "rgba(37,99,235,0.10)",
      text: "#1d4ed8",
      icon: "i",
    },
  };

  const ui = styles[toast.type] || styles.info;

  return (
    <div
      className="border rounded-2xl px-4 py-3 shadow-lg backdrop-blur animate-[slideIn_.2s_ease-out]"
      style={{
        borderColor: ui.border,
        background: `linear-gradient(180deg, ${ui.bg}, rgba(var(--card),0.96))`,
        color: ui.text,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0"
          style={{ background: ui.bg, color: ui.text }}
        >
          {ui.icon}
        </div>

        <div className="flex-1 text-sm font-semibold leading-5">{toast.message}</div>

        <button
          onClick={onClose}
          className="text-sm font-bold hover:opacity-80"
          style={{ color: ui.text }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}