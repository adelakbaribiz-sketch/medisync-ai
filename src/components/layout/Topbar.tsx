"use client";

import { useState } from "react";
import { IconMenu } from "@/components/ui/icons";
import { MobileSidebar } from "@/components/layout/Sidebar";

export function Topbar({ title, description }: { title: string; description?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/95 px-4 py-4 backdrop-blur sm:px-6">
        <button
          onClick={() => setMobileOpen(true)}
          className="focus-ring rounded-lg p-1.5 text-text-secondary hover:bg-surface-muted lg:hidden"
          aria-label="Open menu"
        >
          <IconMenu />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
          {description && (
            <p className="text-sm text-text-secondary">{description}</p>
          )}
        </div>
      </header>
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
