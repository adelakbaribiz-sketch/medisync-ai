"use client";

import { ReactNode, useState } from "react";
import { usePatientProfile, useToast } from "@/state/app-state";
import { HepaticImpairment } from "@/lib/types";

const hepaticOptions: { value: HepaticImpairment; label: string }[] = [
  { value: "none", label: "None" },
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
];

export function PatientProfileForm() {
  const { profile, updateProfile, resetProfile } = usePatientProfile();
  const { pushToast } = useToast();
  const [allergyInput, setAllergyInput] = useState("");

  function addAllergy() {
    const value = allergyInput.trim();
    if (!value) return;
    if (profile.allergies.includes(value)) {
      setAllergyInput("");
      return;
    }
    updateProfile({ allergies: [...profile.allergies, value] });
    setAllergyInput("");
  }

  function removeAllergy(allergy: string) {
    updateProfile({
      allergies: profile.allergies.filter((a) => a !== allergy),
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        pushToast("Patient profile saved for this session.", "success");
      }}
      className="space-y-6 rounded-xl border border-border bg-surface p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Age (years)">
          <input
            type="number"
            min={0}
            max={120}
            value={profile.age ?? ""}
            onChange={(e) =>
              updateProfile({
                age: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="focus-ring w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm"
            placeholder="e.g. 68"
          />
        </Field>

        <Field label="Weight (kg)">
          <input
            type="number"
            min={0}
            max={400}
            value={profile.weightKg ?? ""}
            onChange={(e) =>
              updateProfile({
                weightKg: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="focus-ring w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm"
            placeholder="e.g. 72"
          />
        </Field>

        <Field
          label="eGFR (mL/min/1.73m²)"
          hint="Estimated glomerular filtration rate — used to flag renally cleared drugs."
        >
          <input
            type="number"
            min={0}
            max={200}
            value={profile.egfr ?? ""}
            onChange={(e) =>
              updateProfile({
                egfr: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="focus-ring w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm"
            placeholder="e.g. 45"
          />
        </Field>

        <Field label="Hepatic impairment">
          <select
            value={profile.hepaticImpairment}
            onChange={(e) =>
              updateProfile({
                hepaticImpairment: e.target.value as HepaticImpairment,
              })
            }
            className="focus-ring w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm"
          >
            {hepaticOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={profile.pregnant}
          onChange={(e) => updateProfile({ pregnant: e.target.checked })}
          className="focus-ring h-4 w-4 rounded border-border-strong"
        />
        Patient is pregnant
      </label>

      <Field label="Known allergies">
        <div className="flex gap-2">
          <input
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAllergy();
              }
            }}
            placeholder="e.g. Penicillin"
            className="focus-ring w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addAllergy}
            className="focus-ring shrink-0 rounded-lg border border-border-strong px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-muted"
          >
            Add
          </button>
        </div>
        {profile.allergies.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.allergies.map((a) => (
              <span
                key={a}
                className="flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-xs text-text-secondary"
              >
                {a}
                <button
                  type="button"
                  onClick={() => removeAllergy(a)}
                  aria-label={`Remove allergy ${a}`}
                  className="text-text-muted hover:text-severity-contraindicated"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </Field>

      <div className="flex gap-3 border-t border-border pt-4">
        <button
          type="submit"
          className="focus-ring rounded-lg bg-brand px-4 py-2 text-sm font-medium text-text-on-brand hover:bg-brand-dark"
        >
          Save profile
        </button>
        <button
          type="button"
          onClick={() => {
            resetProfile();
            pushToast("Patient profile reset.", "info");
          }}
          className="focus-ring rounded-lg border border-border-strong px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-muted"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-primary">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
    </div>
  );
}
