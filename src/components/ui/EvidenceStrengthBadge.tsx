import { EvidenceRef } from "@/lib/types";

/**
 * A small, honest "trust layer" cue for evidence strength — three visually
 * distinct treatments (solid / outlined / dotted) so the UI never presents
 * a "Theoretical" data point with the same visual confidence as an
 * "Established" one. Deliberately not a numeric confidence score: no such
 * score was computed, and inventing one would be false precision.
 * See docs/DECISIONS.md and docs/LIMITATIONS.md.
 */
const strengthStyles: Record<
  EvidenceRef["strength"],
  { dot: string; text: string; border: string }
> = {
  Established: {
    dot: "bg-brand",
    text: "text-brand-dark",
    border: "border-brand",
  },
  Probable: {
    dot: "bg-text-secondary",
    text: "text-text-secondary",
    border: "border-border-strong",
  },
  Theoretical: {
    dot: "bg-text-muted",
    text: "text-text-muted",
    border: "border-border border-dashed",
  },
};

export function EvidenceStrengthBadge({
  strength,
}: {
  strength: EvidenceRef["strength"];
}) {
  const style = strengthStyles[strength];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${style.border} px-1.5 py-0.5 text-[11px] font-medium ${style.text}`}
      title={
        strength === "Established"
          ? "Consistently documented across standard references"
          : strength === "Probable"
            ? "Reported, but with less consensus than an established interaction"
            : "Plausible from mechanism, thin direct documentation"
      }
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden />
      {strength}
    </span>
  );
}
