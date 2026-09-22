import { Surface } from "./Surface";

type StatTone = "neutral" | "danger" | "warning" | "caution" | "info";

const toneTextClasses: Record<StatTone, string> = {
  neutral: "text-text-primary",
  danger: "text-severity-contraindicated",
  warning: "text-severity-major",
  caution: "text-severity-moderate",
  info: "text-severity-minor",
};

// The accent bar reads the severity straight from CSS variables rather than
// duplicating hex values here — one source of truth in globals.css.
const toneAccentVar: Record<StatTone, string> = {
  neutral: "var(--border-strong)",
  danger: "var(--severity-contraindicated)",
  warning: "var(--severity-major)",
  caution: "var(--severity-moderate)",
  info: "var(--severity-minor)",
};

export function StatCard({
  label,
  value,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: string | number;
  tone?: StatTone;
  hint?: string;
}) {
  return (
    <Surface level="elevated" className="overflow-hidden">
      <div
        className="h-1 w-full"
        style={{ background: toneAccentVar[tone] }}
        aria-hidden
      />
      <div className="p-4">
        <p className="text-xs font-medium tracking-wide text-text-muted">
          {label}
        </p>
        <p className={`mt-1.5 text-2xl font-semibold ${toneTextClasses[tone]}`}>
          {value}
        </p>
        {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
      </div>
    </Surface>
  );
}
