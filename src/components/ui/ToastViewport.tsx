"use client";

import { useToast } from "@/state/app-state";

const variantClasses = {
  info: "border-border bg-surface text-text-primary",
  success: "border-success/30 bg-success-bg text-success",
  error: "border-severity-contraindicated-border bg-severity-contraindicated-bg text-severity-contraindicated",
};

export function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-sm ${variantClasses[toast.variant]}`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="focus-ring rounded text-text-muted hover:text-text-primary"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
