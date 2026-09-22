"use client";

import { ReactNode, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { useMedicationList, usePatientProfile, useToast } from "@/state/app-state";
import { Surface } from "@/components/ui/Surface";

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`focus-ring relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-brand" : "bg-border-strong"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SettingsRow({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
      </div>
      {control}
    </div>
  );
}

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [voiceAlerts, setVoiceAlerts] = useState(false);
  const { clearAll } = useMedicationList();
  const { resetProfile } = usePatientProfile();
  const { pushToast } = useToast();

  return (
    <>
      <Topbar title="Settings" description="Workspace preferences for this demo session." />
      <main className="flex-1 space-y-6 px-4 py-6 sm:px-6">
        <Surface as="section" className="p-5">
          <h2 className="text-sm font-semibold text-text-primary">Notifications</h2>
          <div className="divide-y divide-border">
            <SettingsRow
              title="Email alerts for major/contraindicated interactions"
              description="Demo toggle only — no email is sent in this prototype."
              control={<Toggle checked={emailAlerts} onChange={setEmailAlerts} />}
            />
            <SettingsRow
              title="Voice alerts (accessibility)"
              description="Read severity warnings aloud using the browser's speech synthesis."
              control={<Toggle checked={voiceAlerts} onChange={setVoiceAlerts} />}
            />
          </div>
        </Surface>

        <Surface as="section" className="p-5">
          <h2 className="text-sm font-semibold text-text-primary">Data sources</h2>
          <p className="mt-1 text-sm text-text-secondary">
            In a production deployment these would be live connections. In this
            prototype all data is served from a static demo dataset regardless
            of toggle state.
          </p>
          <div className="divide-y divide-border">
            <SettingsRow
              title="RxNorm (NLM)"
              description="Drug name normalization — free public API."
              control={<Toggle checked={true} onChange={() => {}} disabled />}
            />
            <SettingsRow
              title="openFDA labels"
              description="FDA structured product labeling — free public API."
              control={<Toggle checked={true} onChange={() => {}} disabled />}
            />
            <SettingsRow
              title="DrugBank (licensed)"
              description="Requires a commercial DrugBank license — not connected in this prototype."
              control={<Toggle checked={false} onChange={() => {}} disabled />}
            />
          </div>
        </Surface>

        <Surface as="section" className="p-5">
          <h2 className="text-sm font-semibold text-text-primary">Language</h2>
          <select
            disabled
            className="focus-ring mt-2 w-full max-w-xs rounded-lg border border-border-strong bg-surface-muted px-3 py-2 text-sm text-text-muted"
          >
            <option>English (default)</option>
            <option>Additional languages — planned, see ROADMAP.md</option>
          </select>
        </Surface>

        <section className="rounded-xl border border-severity-contraindicated-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-text-primary">Reset demo session</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Clears the medication list and patient profile stored in this
            browser&apos;s local storage. This cannot be undone.
          </p>
          <button
            onClick={() => {
              clearAll();
              resetProfile();
              pushToast("Demo session data cleared.", "success");
            }}
            className="focus-ring mt-3 rounded-lg border border-severity-contraindicated px-4 py-2 text-sm font-medium text-severity-contraindicated hover:bg-severity-contraindicated-bg"
          >
            Clear all local demo data
          </button>
        </section>
      </main>
    </>
  );
}
