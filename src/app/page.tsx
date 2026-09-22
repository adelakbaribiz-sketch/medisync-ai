"use client";

import { useMemo, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { DrugSearchCombobox } from "@/components/drug/DrugSearchCombobox";
import { MedicationList } from "@/components/drug/MedicationList";
import { InteractionGraph } from "@/components/interactions/InteractionGraph";
import { StatCard } from "@/components/ui/StatCard";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useMedicationList, usePatientProfile } from "@/state/app-state";
import { useInteractions } from "@/lib/hooks/useInteractions";
import { sortBySeverity } from "@/lib/severity";
import { demoDataDisclaimer } from "@/lib/mock-data";
import { IconAlert } from "@/components/ui/icons";
import { Surface } from "@/components/ui/Surface";
import Link from "next/link";

export default function DashboardPage() {
  const { medications, isLoaded } = useMedicationList();
  const { profile } = usePatientProfile();
  const [simulateError, setSimulateError] = useState(false);
  const rxcuis = useMemo(() => medications.map((d) => d.rxcui), [medications]);
  const { interactions, status } = useInteractions(rxcuis, isLoaded, simulateError);

  const counts = {
    contraindicated: interactions.filter((i) => i.severity === "contraindicated").length,
    major: interactions.filter((i) => i.severity === "major").length,
    moderate: interactions.filter((i) => i.severity === "moderate").length,
    minor: interactions.filter((i) => i.severity === "minor").length,
  };

  const topInteractions = sortBySeverity(interactions).slice(0, 3);

  return (
    <>
      <Topbar
        title="Dashboard"
        description="Build a medication list and see potential interactions at a glance."
      />
      <main className="flex-1 space-y-6 px-4 py-6 sm:px-6">
        <div className="rounded-lg border border-brand-light bg-brand-light px-4 py-2.5 text-sm text-brand-dark">
          {demoDataDisclaimer}
        </div>

        <Surface className="p-5">
          <h2 className="mb-3 text-sm font-semibold text-text-primary">
            Current medication list
          </h2>
          <DrugSearchCombobox />
          <div className="mt-4">
            <MedicationList />
          </div>
        </Surface>

        {status === "error" ? (
          <div className="rounded-xl border border-severity-contraindicated-border bg-severity-contraindicated-bg p-6">
            <div className="flex items-start gap-3">
              <IconAlert className="mt-0.5 shrink-0 text-severity-contraindicated" />
              <div className="flex-1">
                <p className="font-medium text-severity-contraindicated">
                  Couldn&apos;t reach the Interaction Engine
                </p>
                <p className="mt-1 text-sm text-severity-contraindicated">
                  This is a simulated network failure for demonstrating the
                  application&apos;s error state.
                </p>
                <button
                  onClick={() => setSimulateError(false)}
                  className="focus-ring mt-3 rounded-lg border border-severity-contraindicated bg-surface px-3 py-1.5 text-sm font-medium text-severity-contraindicated hover:bg-severity-contraindicated-bg"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Contraindicated" value={counts.contraindicated} tone="danger" />
              <StatCard label="Major" value={counts.major} tone="warning" />
              <StatCard label="Moderate" value={counts.moderate} tone="caution" />
              <StatCard label="Minor" value={counts.minor} tone="info" />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,380px)]">
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-text-primary">
                  Highest-priority interactions
                </h2>
                {status === "loading" ? (
                  <SkeletonRows />
                ) : topInteractions.length === 0 ? (
                  <EmptyState
                    title="No interactions detected"
                    description={
                      medications.length < 2
                        ? "Add at least two medications to check for interactions."
                        : "No known interactions were found among the current medication list in the demo catalog."
                    }
                  />
                ) : (
                  <ul className="space-y-2">
                    {topInteractions.map((interaction) => {
                      const a = medications.find((d) => d.rxcui === interaction.drugA);
                      const b = medications.find((d) => d.rxcui === interaction.drugB);
                      return (
                        <Surface
                          as="li"
                          key={interaction.id}
                          className="p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-text-primary">
                              {a?.name} + {b?.name}
                            </p>
                            <SeverityBadge severity={interaction.severity} size="sm" />
                          </div>
                          <p className="mt-1.5 text-sm text-text-secondary">
                            {interaction.clinicalEffect}
                          </p>
                        </Surface>
                      );
                    })}
                    <Link
                      href="/interactions"
                      className="focus-ring block rounded-lg py-2 text-center text-sm font-medium text-brand hover:underline"
                    >
                      View all {interactions.length} interaction
                      {interactions.length === 1 ? "" : "s"} →
                    </Link>
                  </ul>
                )}
              </div>

              <div>
                <h2 className="mb-3 text-sm font-semibold text-text-primary">
                  Interaction network
                </h2>
                <InteractionGraph drugs={medications} interactions={interactions} />
              </div>
            </div>
          </>
        )}

        <div className="border-t border-border pt-4">
          <button
            onClick={() => setSimulateError(true)}
            className="focus-ring text-xs text-text-muted underline decoration-dotted hover:text-text-secondary"
          >
            Demo utility: simulate a backend connection error
          </button>
        </div>

        {profile.age === null && (
          <p className="text-xs text-text-muted">
            Tip: add a{" "}
            <Link href="/patient" className="text-brand hover:underline">
              patient profile
            </Link>{" "}
            to see how renal function, hepatic status, and pregnancy adjust
            interaction guidance.
          </p>
        )}
      </main>
    </>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-xl border border-border bg-surface-muted"
        />
      ))}
    </div>
  );
}
