import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/state/app-state";
import { Sidebar } from "@/components/layout/Sidebar";
import { ToastViewport } from "@/components/ui/ToastViewport";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediSync AI — Drug Interaction Prototype",
  description:
    "Portfolio prototype: an AI-assisted drug interaction and clinical decision support workspace. Demo data only.",
};

// Runs before React hydrates so the correct theme class is on <html> for the
// very first paint — without this, the page would render light, then flash
// to dark a moment later for users who'd chosen dark. Reads the same
// localStorage key ThemeProvider (src/state/app-state.tsx) owns; kept as a
// tiny inline string (not an imported function) because Next.js needs it
// as literal, blocking, pre-hydration script content.
//
// The stored value is JSON-encoded (writeStorage in app-state.tsx calls
// JSON.stringify for every key, including this one, to stay one generic
// helper for both primitives and objects) — so the raw string in
// localStorage is literally `"dark"` (with quote characters), not `dark`.
// JSON.parse here, not a raw string comparison, or this silently never
// matches and every reload falls back to the system preference.
const THEME_INIT_SCRIPT = `(function(){try{var raw=localStorage.getItem("medisync_demo_theme");var m=raw?JSON.parse(raw):"system";var d=m==="dark"||(m!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="h-full bg-canvas text-text-primary">
        <AppProviders>
          <div className="flex h-full">
            <Sidebar />
            <div className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto">
              {children}
            </div>
          </div>
          <ToastViewport />
        </AppProviders>
      </body>
    </html>
  );
}
