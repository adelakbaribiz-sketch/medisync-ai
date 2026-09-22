"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { InteractionTable } from "@/components/interactions/InteractionTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconAlert, IconInteraction } from "@/components/ui/icons";
import { useMedicationList, usePatientProfile } from "@/state/app-state";
import { useInteractions } from "@/lib/hooks/useInteractions";

export default function InteractionsPage() {
  const { medications, isLoaded } = useMedicationList();
  const { profile } = usePatientProfile();
  const rxcuis = useMemo(() => medications.map((d) => d.rxcui), [medications]);
  const { interactions, status } = useInteractions(rxcuis, isLoaded);

  return (
    <>
      <Topbar
        title="Interaction Analysis"
        description="Full pairwise interaction detail for the current medication list."
      />
      <main className="flex-1 space-y-4 px-4 py-6 sm:px-6">
        {medications.length < 2 ? (
          <EmptyState
            icon={<IconInteraction width={22} height={22} />}
            title="Add at least two medications"
            description="Interaction analysis compares every pair of drugs in the current medication list."
            action={
              <Link
                href="/"
                className="focus-ring rounded-lg bg-brand px-4 py-2 text-sm font-medium text-text-on-brand hover:bg-brand-dark"
              >
                Go to Dashboard
              </Link>
            }
          />
        ) : status === "loading" ? (
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl border border-border bg-surface-muted"
              />
            ))}
          </div>
        ) : status === "error" ? (
          <div className="flex items-start gap-3 rounded-xl border border-severity-contraindicated-border bg-severity-contraindicated-bg p-6">
            <IconAlert className="mt-0.5 shrink-0 text-severity-contraindicated" />
            <p className="text-sm text-severity-contraindicated">
              Couldn&apos;t load interaction data. Please try again.
            </p>
          </div>
        ) : (
          <InteractionTable
            interactions={interactions}
            drugs={medications}
            patient={profile}
          />
        )}
      </main>
    </>
  );
}
