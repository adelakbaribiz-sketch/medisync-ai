import { SeverityLevel } from "@/lib/types";
import { severityClasses, severityLabel } from "@/lib/severity";

export function SeverityBadge({
  severity,
  size = "md",
}: {
  severity: SeverityLevel;
  size?: "sm" | "md";
}) {
  const classes = severityClasses[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${classes.text} ${classes.bg} ${classes.border} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
      }`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: "currentColor" }}
        aria-hidden
      />
      {severityLabel[severity]}
    </span>
  );
}
