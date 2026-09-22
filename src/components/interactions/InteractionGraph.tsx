"use client";

import { Drug, DrugInteraction } from "@/lib/types";
import { severityClasses, severityLabel } from "@/lib/severity";
import { Surface } from "@/components/ui/Surface";

const severityStroke: Record<string, string> = {
  contraindicated: "var(--severity-contraindicated)",
  major: "var(--severity-major)",
  moderate: "var(--severity-moderate)",
  minor: "var(--severity-minor)",
};

interface Props {
  drugs: Drug[];
  interactions: DrugInteraction[];
}

const SIZE = 420;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 70;

export function InteractionGraph({ drugs, interactions }: Props) {
  if (drugs.length < 2) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-dashed border-border bg-surface text-sm text-text-muted">
        Add at least two medications to visualize their interaction network.
      </div>
    );
  }

  const positions = new Map<string, { x: number; y: number }>();
  drugs.forEach((drug, i) => {
    const angle = (2 * Math.PI * i) / drugs.length - Math.PI / 2;
    positions.set(drug.rxcui, {
      x: CENTER + RADIUS * Math.cos(angle),
      y: CENTER + RADIUS * Math.sin(angle),
    });
  });

  return (
    <Surface level="elevated" className="p-4">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto h-auto w-full max-w-md"
        role="img"
        aria-label="Drug interaction network graph"
      >
        {interactions.map((interaction) => {
          const a = positions.get(interaction.drugA);
          const b = positions.get(interaction.drugB);
          if (!a || !b) return null;
          return (
            <line
              key={interaction.id}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={severityStroke[interaction.severity]}
              strokeWidth={interaction.severity === "contraindicated" ? 3 : 2}
              strokeOpacity={0.75}
            >
              <title>{`${interaction.severity} interaction`}</title>
            </line>
          );
        })}

        {drugs.map((drug) => {
          const pos = positions.get(drug.rxcui)!;
          return (
            <g key={drug.rxcui}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={22}
                fill="var(--surface)"
                stroke="var(--brand)"
                strokeWidth={2}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fontWeight={600}
                fill="var(--brand-dark)"
              >
                {drug.name.slice(0, 3).toUpperCase()}
              </text>
              <text
                x={pos.x}
                y={pos.y + 36}
                textAnchor="middle"
                fontSize={11}
                fill="var(--text-secondary)"
              >
                {drug.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-3">
        {(["contraindicated", "major", "moderate", "minor"] as const).map(
          (level) => (
            <div key={level} className="flex items-center gap-1.5 text-xs">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: severityStroke[level] }}
              />
              <span className={severityClasses[level].text}>
                {severityLabel[level]}
              </span>
            </div>
          )
        )}
      </div>
    </Surface>
  );
}
