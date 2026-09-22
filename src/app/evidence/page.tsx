"use client";

import { useMemo, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconEvidence, IconSearch, IconExternalLink } from "@/components/ui/icons";
import { drugs, interactions, demoDataDisclaimer } from "@/lib/mock-data";
import { sortBySeverity } from "@/lib/severity";

function drugName(rxcui: string) {
  return drugs.find((d) => d.rxcui === rxcui)?.name ?? rxcui;
}

export default function EvidencePage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = sortBySeverity(interactions);
    if (!q) return list;
    return list.filter(
      (i) =>
        drugName(i.drugA).toLowerCase().includes(q) ||
        drugName(i.drugB).toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <>
      <Topbar
        title="Evidence Library"
        description="Sourcing behind each interaction in the demo dataset — every entry cites its source type and evidence strength."
      />
      <main className="flex-1 space-y-4 px-4 py-6 sm:px-6">
        <div className="rounded-lg border border-brand-light bg-brand-light px-4 py-2.5 text-sm text-brand-dark">
          {demoDataDisclaimer} Evidence summaries below are paraphrased for
          this prototype, not live citations pulled from FDA/PubMed feeds. See{" "}
          <span className="font-medium">docs/LIMITATIONS.md</span> in the
          repository.
        </div>

        <div className="relative max-w-md">
          <IconSearch
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            width={18}
            height={18}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by drug name…"
            className="focus-ring w-full rounded-lg border border-border-strong bg-surface py-2.5 pl-10 pr-4 text-sm"
            aria-label="Filter evidence library by drug name"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<IconEvidence width={22} height={22} />}
            title="No matching interactions"
            description="Try a different drug name."
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((interaction) => (
              <div
                key={interaction.id}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-text-primary">
                    {drugName(interaction.drugA)} + {drugName(interaction.drugB)}
                  </p>
                  <SeverityBadge severity={interaction.severity} size="sm" />
                </div>
                <ul className="mt-3 space-y-2">
                  {interaction.evidence.map((ev, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <IconExternalLink
                        width={14}
                        height={14}
                        className="mt-0.5 shrink-0 text-text-muted"
                      />
                      <span className="text-text-secondary">
                        <span className="font-medium text-text-primary">
                          {ev.sourceType}
                        </span>{" "}
                        <span className="text-xs text-text-muted">
                          ({ev.strength})
                        </span>{" "}
                        — {ev.summary}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
