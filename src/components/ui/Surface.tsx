import { ElementType, HTMLAttributes } from "react";

/**
 * Shared surface primitive — consolidates the "rounded-xl border bg-surface"
 * card pattern that was previously repeated across 9 files with slightly
 * inconsistent spelling. Encodes the app's small elevation hierarchy:
 *
 *   flat      — default. Tables, forms, list rows, settings sections.
 *               Fast and quiet on purpose (see docs/DECISIONS.md).
 *   elevated  — the Dashboard's KPI cards and the interaction graph panel:
 *               the two places worth a deliberate, semantic lift.
 *   floating  — dropdowns, the mobile nav drawer (already used ad hoc;
 *               kept here for future consistency).
 *
 * `interactive` adds the single hover-lift pattern used app-wide
 * (see `.lift-on-hover` in globals.css) — reserved for elements that are
 * genuinely a focal point, not applied blanket-wide to every card.
 */
type SurfaceLevel = "flat" | "elevated" | "floating";

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  level?: SurfaceLevel;
  interactive?: boolean;
}

const levelClasses: Record<SurfaceLevel, string> = {
  flat: "border border-border bg-surface",
  elevated: "border border-border bg-surface shadow-md",
  floating: "border border-border bg-surface shadow-lg",
};

export function Surface({
  as: Tag = "div",
  level = "flat",
  interactive = false,
  className = "",
  ...props
}: SurfaceProps) {
  const classes = [
    "rounded-xl",
    levelClasses[level],
    interactive ? "lift-on-hover" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes} {...props} />;
}
