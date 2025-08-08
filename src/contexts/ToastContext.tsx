import { createContext, type ReactNode, useContext, useState } from "react";
import { Toast } from "../components/atoms";

type ToastContextValue = {
  showToast: (msg: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {message && <Toast message={message} />}
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}
