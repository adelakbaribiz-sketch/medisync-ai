"use client";

import { useEffect, useRef, useState } from "react";
import { Drug } from "@/lib/types";
import { searchDrugs } from "@/lib/api";
import { useMedicationList, useToast } from "@/state/app-state";
import { IconSearch, IconPlus } from "@/components/ui/icons";

export function DrugSearchCombobox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addDrug, medications } = useMedicationList();
  const { pushToast } = useToast();

  const trimmedQuery = query.trim();
  const visibleResults = trimmedQuery ? results : [];

  useEffect(() => {
    if (!trimmedQuery) return;
    let cancelled = false;
    const handle = setTimeout(() => {
      void (async () => {
        setLoading(true);
        const res = await searchDrugs(query);
        if (!cancelled) {
          setResults(res);
          setLoading(false);
          setOpen(true);
        }
      })();
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [trimmedQuery, query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(drug: Drug) {
    const alreadyAdded = medications.some((d) => d.rxcui === drug.rxcui);
    addDrug(drug);
    setQuery("");
    setResults([]);
    setOpen(false);
    pushToast(
      alreadyAdded
        ? `${drug.name} is already in the medication list.`
        : `${drug.name} added to the medication list.`,
      alreadyAdded ? "info" : "success"
    );
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <IconSearch
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          width={18}
          height={18}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="Search by drug name, generic name, or class…"
          className="focus-ring w-full rounded-lg border border-border-strong bg-surface py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted"
          aria-label="Search for a drug to add"
        />
      </div>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          {loading && (
            <div className="px-4 py-3 text-sm text-text-muted">Searching…</div>
          )}
          {!loading && visibleResults.length === 0 && (
            <div className="px-4 py-3 text-sm text-text-muted">
              No drugs found in the demo catalog for &ldquo;{query}&rdquo;.
            </div>
          )}
          {!loading &&
            visibleResults.map((drug) => (
              <button
                key={drug.rxcui}
                onClick={() => handleSelect(drug)}
                className="focus-ring flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm hover:bg-surface-muted"
              >
                <span>
                  <span className="font-medium text-text-primary">
                    {drug.name}
                  </span>
                  <span className="ml-2 text-text-muted">{drug.drugClass}</span>
                </span>
                <IconPlus className="text-text-muted" width={16} height={16} />
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
