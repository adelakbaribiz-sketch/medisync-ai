"use client";

import { useEffect, useState } from "react";
import { getInteractionsForList } from "@/lib/api";
import { DrugInteraction } from "@/lib/types";

export type InteractionQueryStatus = "idle" | "loading" | "error" | "ready";

/**
 * `rxcuis` must be a referentially stable array (e.g. produced with
 * `useMemo`) for the fetch to only re-run when the medication list
 * actually changes.
 */
export function useInteractions(
  rxcuis: string[],
  isReady: boolean,
  simulateError = false
) {
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [status, setStatus] = useState<InteractionQueryStatus>("idle");

  const hasEnoughDrugs = rxcuis.length >= 2;

  useEffect(() => {
    if (!isReady || !hasEnoughDrugs) return;
    let cancelled = false;
    void (async () => {
      setStatus("loading");
      try {
        const res = await getInteractionsForList(rxcuis, { simulateError });
        if (!cancelled) {
          setInteractions(res);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [rxcuis, isReady, hasEnoughDrugs, simulateError]);

  if (!isReady) return { interactions: [], status: "idle" as const };
  if (!hasEnoughDrugs) return { interactions: [], status: "ready" as const };
  return { interactions, status };
}
