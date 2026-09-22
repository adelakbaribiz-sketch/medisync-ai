"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconDashboard,
  IconInteraction,
  IconPatient,
  IconEvidence,
  IconSettings,
  IconClose,
} from "@/components/ui/icons";

const navItems = [
  { href: "/", label: "Dashboard", icon: IconDashboard },
  { href: "/interactions", label: "Interactions", icon: IconInteraction },
  { href: "/patient", label: "Patient Profile", icon: IconPatient },
  { href: "/evidence", label: "Evidence Library", icon: IconEvidence },
  { href: "/settings", label: "Settings", icon: IconSettings },
];

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-text-on-brand font-semibold">
          M
        </div>
        <div className="leading-tight">
          <p className="font-semibold text-text-primary">MediSync AI</p>
          <p className="text-xs text-text-muted">Prototype workspace</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-light text-brand-dark"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              }`}
            >
              <Icon
                className={active ? "text-brand-dark" : "text-text-muted"}
                width={18}
                height={18}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-4 rounded-lg border border-border-strong bg-surface-muted p-3 text-xs text-text-secondary">
        <p className="font-medium text-text-primary">Prototype status</p>
        <p className="mt-1">
          All interaction and evidence data on this workspace is demo content.
          No real patient data is stored or transmitted.
        </p>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden h-full w-64 shrink-0 overflow-y-auto border-r border-border bg-surface lg:block">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-y-0 left-0 w-72 bg-surface shadow-xl">
        <div className="flex justify-end px-3 pt-3">
          <button
            onClick={onClose}
            className="focus-ring rounded p-1 text-text-muted hover:text-text-primary"
            aria-label="Close menu"
          >
            <IconClose width={20} height={20} />
          </button>
        </div>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  );
}
