"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { Drug, PatientProfile, emptyPatientProfile } from "@/lib/types";

const MEDICATION_LIST_KEY = "medisync_demo_medication_list";
const PATIENT_PROFILE_KEY = "medisync_demo_patient_profile";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — demo state
    // simply won't persist across reloads. Non-fatal by design.
  }
}

// ---------------------------------------------------------------------------
// Medication list
// ---------------------------------------------------------------------------

interface MedicationListContextValue {
  medications: Drug[];
  addDrug: (drug: Drug) => void;
  removeDrug: (rxcui: string) => void;
  clearAll: () => void;
  isLoaded: boolean;
}

const MedicationListContext = createContext<MedicationListContextValue | null>(
  null
);

export function MedicationListProvider({ children }: { children: ReactNode }) {
  const [medications, setMedications] = useState<Drug[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Deliberately deferred to an effect: localStorage doesn't exist during
    // SSR, so state must start empty (matching the server-rendered HTML)
    // and hydrate from storage only after mount to avoid a hydration
    // mismatch. A lazy useState initializer would run during client
    // hydration too and read a different value than the server saw.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMedications(readStorage(MEDICATION_LIST_KEY, [] as Drug[]));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) writeStorage(MEDICATION_LIST_KEY, medications);
  }, [medications, isLoaded]);

  const addDrug = useCallback((drug: Drug) => {
    setMedications((prev) =>
      prev.some((d) => d.rxcui === drug.rxcui) ? prev : [...prev, drug]
    );
  }, []);

  const removeDrug = useCallback((rxcui: string) => {
    setMedications((prev) => prev.filter((d) => d.rxcui !== rxcui));
  }, []);

  const clearAll = useCallback(() => setMedications([]), []);

  const value = useMemo(
    () => ({ medications, addDrug, removeDrug, clearAll, isLoaded }),
    [medications, addDrug, removeDrug, clearAll, isLoaded]
  );

  return (
    <MedicationListContext.Provider value={value}>
      {children}
    </MedicationListContext.Provider>
  );
}

export function useMedicationList() {
  const ctx = useContext(MedicationListContext);
  if (!ctx)
    throw new Error(
      "useMedicationList must be used within MedicationListProvider"
    );
  return ctx;
}

// ---------------------------------------------------------------------------
// Patient profile
// ---------------------------------------------------------------------------

interface PatientProfileContextValue {
  profile: PatientProfile;
  updateProfile: (patch: Partial<PatientProfile>) => void;
  resetProfile: () => void;
}

const PatientProfileContext = createContext<PatientProfileContextValue | null>(
  null
);

export function PatientProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PatientProfile>(emptyPatientProfile);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // See the matching comment in MedicationListProvider above: deferred
    // deliberately to avoid an SSR/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(readStorage(PATIENT_PROFILE_KEY, emptyPatientProfile));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) writeStorage(PATIENT_PROFILE_KEY, profile);
  }, [profile, isLoaded]);

  const updateProfile = useCallback((patch: Partial<PatientProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetProfile = useCallback(() => setProfile(emptyPatientProfile), []);

  const value = useMemo(
    () => ({ profile, updateProfile, resetProfile }),
    [profile, updateProfile, resetProfile]
  );

  return (
    <PatientProfileContext.Provider value={value}>
      {children}
    </PatientProfileContext.Provider>
  );
}

export function usePatientProfile() {
  const ctx = useContext(PatientProfileContext);
  if (!ctx)
    throw new Error(
      "usePatientProfile must be used within PatientProfileProvider"
    );
  return ctx;
}

// ---------------------------------------------------------------------------
// Toast notifications
// ---------------------------------------------------------------------------

export type ToastVariant = "info" | "success" | "error";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toasts: Toast[];
  pushToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismissToast(id), 4000);
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({ toasts, pushToast, dismissToast }),
    [toasts, pushToast, dismissToast]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ---------------------------------------------------------------------------
// Combined provider
// ---------------------------------------------------------------------------

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <MedicationListProvider>
        <PatientProfileProvider>{children}</PatientProfileProvider>
      </MedicationListProvider>
    </ToastProvider>
  );
}
