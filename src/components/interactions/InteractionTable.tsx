"use client";

import { Fragment, useMemo, useState } from "react";
import { Drug, DrugInteraction, PatientProfile, SeverityLevel } from "@/lib/types";
import { severityLabel, sortBySeverity } from "@/lib/severity";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconAlert, IconExternalLink } from "@/components/ui/icons";
import { adjustedSeverityNote } from "@/lib/api";
import { Surface } from "@/components/ui/Surface";
import { EvidenceStrengthBadge } from "@/components/ui/EvidenceStrengthBadge";

const ALL_SEVERITIES: SeverityLevel[] = [
  "contraindicated",
  "major",
  "moderate",
  "minor",
];

function drugName(drugs: Drug[], rxcui: string) {
  return drugs.find((d) => d.rxcui === rxcui)?.name ?? rxcui;
}

function drugClass(drugs: Drug[], rxcui: string) {
  return drugs.find((d) => d.rxcui === rxcui)?.drugClass ?? "";
}

export function InteractionTable({
  interactions,
  drugs,
  patient,
}: {
  interactions: DrugInteraction[];
  drugs: Drug[];
  patient: PatientProfile;
}) {
  const [activeFilters, setActiveFilters] = useState<Set<SeverityLevel>>(
    new Set(ALL_SEVERITIES)
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleFilter(level: SeverityLevel) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  }

  const filtered = useMemo(
    () =>
      sortBySeverity(interactions.filter((i) => activeFilters.has(i.severity))),
    [interactions, activeFilters]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {ALL_SEVERITIES.map((level) => {
          const active = activeFilters.has(level);
          return (
            <button
              key={level}
              onClick={() => toggleFilter(level)}
              className={`focus-ring rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border-brand bg-brand-light text-brand-dark"
                  : "border-border text-text-muted hover:border-border-strong"
              }`}
            >
              {severityLabel[level]}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No interactions match the current filters"
          description={
            interactions.length === 0
              ? "No known interactions were found among the drugs currently in the medication list."
              : "Try enabling more severity levels above."
          }
        />
      ) : (
        <Surface className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-muted text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Drug pair</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">
                  Mechanism
                </th>
                <th className="px-4 py-3 font-medium text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((interaction) => {
                const isOpen = expandedId === interaction.id;
                const note = adjustedSeverityNote(
                  interaction,
                  patient,
                  drugName(drugs, interaction.drugA),
                  drugName(drugs, interaction.drugB),
                  drugClass(drugs, interaction.drugA),
                  drugClass(drugs, interaction.drugB)
                );
                return (
                  <Fragment key={interaction.id}>
                    <tr className="align-top">
                      <td className="px-4 py-3 font-medium text-text-primary">
                        {drugName(drugs, interaction.drugA)} +{" "}
                        {drugName(drugs, interaction.drugB)}
                      </td>
                      <td className="px-4 py-3">
                        <SeverityBadge severity={interaction.severity} size="sm" />
                      </td>
                      <td className="hidden max-w-sm px-4 py-3 text-text-secondary md:table-cell">
                        {interaction.mechanism}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() =>
                            setExpandedId(isOpen ? null : interaction.id)
                          }
                          className="focus-ring rounded-md px-2 py-1 text-xs font-medium text-brand hover:bg-brand-light"
                        >
                          {isOpen ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={4} className="bg-surface-muted px-4 py-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                                Clinical effect
                              </p>
                              <p className="mt-1 text-sm text-text-secondary">
                                {interaction.clinicalEffect}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                                Recommendation
                              </p>
                              <p className="mt-1 text-sm text-text-secondary">
                                {interaction.recommendation}
                              </p>
                            </div>
                            {interaction.alternatives && (
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                                  Suggested alternatives
                                </p>
                                <ul className="mt-1 list-inside list-disc text-sm text-text-secondary">
                                  {interaction.alternatives.map((alt) => (
                                    <li key={alt}>{alt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                                Evidence
                              </p>
                              <ul className="mt-1 space-y-1.5">
                                {interaction.evidence.map((ev, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-1.5 text-sm text-text-secondary"
                                  >
                                    <IconExternalLink
                                      width={14}
                                      height={14}
                                      className="mt-0.5 shrink-0 text-text-muted"
                                    />
                                    <span>
                                      <span className="font-medium text-text-primary">
                                        {ev.sourceType}
                                      </span>{" "}
                                      <EvidenceStrengthBadge strength={ev.strength} />{" "}
                                      — {ev.summary}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          {note && (
                            <div className="mt-4 flex items-start gap-2 rounded-lg border border-severity-major-border bg-severity-major-bg px-3 py-2.5 text-sm text-severity-major">
                              <IconAlert
                                width={16}
                                height={16}
                                className="mt-0.5 shrink-0"
                              />
                              <span>
                                <span className="font-semibold">
                                  Patient-context note:
                                </span>{" "}
                                {note}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </Surface>
      )}
    </div>
  );
}
