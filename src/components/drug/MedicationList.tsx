"use client";

import { useMedicationList } from "@/state/app-state";
import { IconTrash } from "@/components/ui/icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconPatient } from "@/components/ui/icons";

export function MedicationList() {
  const { medications, removeDrug, isLoaded } = useMedicationList();

  if (isLoaded && medications.length === 0) {
    return (
      <EmptyState
        icon={<IconPatient width={22} height={22} />}
        title="No medications added yet"
        description="Search for a drug above and add it to build the patient's current medication list."
      />
    );
  }

  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
      {medications.map((drug) => (
        <li
          key={drug.rxcui}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <div>
            <p className="text-sm font-medium text-text-primary">{drug.name}</p>
            <p className="text-xs text-text-muted">
              {drug.drugClass} · {drug.route}
            </p>
          </div>
          <button
            onClick={() => removeDrug(drug.rxcui)}
            className="focus-ring rounded-lg p-1.5 text-text-muted hover:bg-severity-contraindicated-bg hover:text-severity-contraindicated"
            aria-label={`Remove ${drug.name}`}
          >
            <IconTrash width={16} height={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}
