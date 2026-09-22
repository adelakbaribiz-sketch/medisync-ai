export function StatCard({
  label,
  value,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: string | number;
  tone?: "neutral" | "danger" | "warning" | "caution" | "info";
  hint?: string;
}) {
  const toneClasses: Record<string, string> = {
    neutral: "text-text-primary",
    danger: "text-severity-contraindicated",
    warning: "text-severity-major",
    caution: "text-severity-moderate",
    info: "text-severity-minor",
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
        {label}
      </p>
      <p className={`mt-1.5 text-2xl font-semibold ${toneClasses[tone]}`}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
    </div>
  );
}
