// components/ui/Toast.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Provider component
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toastData: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      duration: 5000,
      persistent: false,
      ...toastData,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    if (!newToast.persistent && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, clearToasts }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// Toast container component
function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

// Individual toast component
function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case "error":
        return <ExclamationCircleIcon className="w-6 h-6 text-red-600" />;
      case "warning":
        return <ExclamationCircleIcon className="w-6 h-6 text-yellow-600" />;
      case "info":
      default:
        return <InformationCircleIcon className="w-6 h-6 text-blue-600" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "border-l-4 shadow-lg";

    switch (toast.type) {
      case "success":
        return cn(baseStyles, "bg-green-50 border-green-400");
      case "error":
        return cn(baseStyles, "bg-red-50 border-red-400");
      case "warning":
        return cn(baseStyles, "bg-yellow-50 border-yellow-400");
      case "info":
      default:
        return cn(baseStyles, "bg-blue-50 border-blue-400");
    }
  };

  return (
    <div
      className={cn(
        "transform transition-all duration-300 ease-in-out",
        "bg-white rounded-lg p-4 shadow-lg border",
        getStyles(),
        isVisible && !isExiting
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0",
        isExiting && "translate-x-full opacity-0"
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>

        <div className="ml-3 flex-1">
          <h4 className="text-sm font-semibold text-gray-900">{toast.title}</h4>
          {toast.message && (
            <p className="mt-1 text-sm text-gray-700">{toast.message}</p>
          )}
        </div>

        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleRemove}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
            aria-label="Cerrar notificación"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook helpers for common toast types
export function useToastHelpers() {
  const { addToast } = useToast();

  return {
    success: (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: "success", title, message, ...options }),

    error: (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: "error", title, message, persistent: true, ...options }),

    info: (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: "info", title, message, ...options }),

    warning: (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: "warning", title, message, ...options }),
  };
}
