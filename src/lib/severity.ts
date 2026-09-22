import { SeverityLevel } from "./types";

export const severityOrder: SeverityLevel[] = [
  "contraindicated",
  "major",
  "moderate",
  "minor",
];

export const severityLabel: Record<SeverityLevel, string> = {
  contraindicated: "Contraindicated",
  major: "Major",
  moderate: "Moderate",
  minor: "Minor",
};

export const severityDescription: Record<SeverityLevel, string> = {
  contraindicated: "Do not co-prescribe under any circumstance.",
  major: "Avoid combination; use only with close monitoring if unavoidable.",
  moderate: "May be used with monitoring or dose adjustment.",
  minor: "Usually clinically insignificant; be aware.",
};

export const severityClasses: Record<
  SeverityLevel,
  { text: string; bg: string; border: string }
> = {
  contraindicated: {
    text: "text-severity-contraindicated",
    bg: "bg-severity-contraindicated-bg",
    border: "border-severity-contraindicated-border",
  },
  major: {
    text: "text-severity-major",
    bg: "bg-severity-major-bg",
    border: "border-severity-major-border",
  },
  moderate: {
    text: "text-severity-moderate",
    bg: "bg-severity-moderate-bg",
    border: "border-severity-moderate-border",
  },
  minor: {
    text: "text-severity-minor",
    bg: "bg-severity-minor-bg",
    border: "border-severity-minor-border",
  },
};

export function sortBySeverity<T extends { severity: SeverityLevel }>(
  items: T[]
): T[] {
  return [...items].sort(
    (a, b) =>
      severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );
}
