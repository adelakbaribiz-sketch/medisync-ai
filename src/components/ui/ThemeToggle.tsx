"use client";

import { useTheme, ThemeMode } from "@/state/app-state";
import { IconSun, IconMoon, IconMonitor } from "@/components/ui/icons";

const modeConfig: Record<ThemeMode, { label: string; Icon: typeof IconSun }> = {
  light: { label: "Light", Icon: IconSun },
  dark: { label: "Dark", Icon: IconMoon },
  system: { label: "System", Icon: IconMonitor },
};

/**
 * Single control for the app's theme, cycling light -> dark -> system.
 * One source of truth (ThemeProvider) with one place to change it — see
 * docs/DECISIONS.md #10 for why this isn't duplicated into Settings too.
 */
export function ThemeToggle() {
  const { mode, cycleMode } = useTheme();
  const { label, Icon } = modeConfig[mode];

  return (
    <button
      type="button"
      onClick={cycleMode}
      className="focus-ring flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
      aria-label={`Theme: ${label}. Click to change.`}
      title={`Theme: ${label} — click to cycle`}
    >
      <Icon width={18} height={18} className="text-text-muted" />
      <span>{label} theme</span>
    </button>
  );
}
