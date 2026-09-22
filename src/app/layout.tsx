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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
