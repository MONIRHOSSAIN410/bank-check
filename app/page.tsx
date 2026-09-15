"use client";

import { useEffect, useState } from "react";
import CheckForm from "@/components/CheckForm";
import CheckPreview from "@/components/CheckPreview";
import CalibrationPanel from "@/components/CalibrationPanel";
import ThemeAccentPicker from "@/components/ThemeAccentPicker";
import { CalibrationConfig, CheckData, DEFAULT_CHECK_DATA, DEFAULT_CONFIG } from "@/lib/types";
import { applyAccentPalette } from "@/lib/palettes";
import {
  loadAccent,
  loadLastConfig,
  loadTheme,
  saveAccent,
  saveLastConfig,
  saveTheme,
} from "@/lib/storage";

const PRINT_STYLE_ID = "bcp-dynamic-page-size";

function setPrintPageSize(widthMm: number, heightMm: number) {
  let styleEl = document.getElementById(PRINT_STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = PRINT_STYLE_ID;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `@page { size: ${widthMm}mm ${heightMm}mm; margin: 0; }`;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<CheckData>(DEFAULT_CHECK_DATA);
  const [config, setConfig] = useState<CalibrationConfig>(DEFAULT_CONFIG);
  const [showGuides, setShowGuides] = useState(true);
  const [accent, setAccent] = useState("blue");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load persisted state on mount (client-only; avoids SSR/localStorage mismatch).
  useEffect(() => {
    setConfig(loadLastConfig());
    setAccent(loadAccent());
    setTheme(loadTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyAccentPalette(accent);
    saveAccent(accent);
  }, [accent, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    saveTheme(theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    saveLastConfig(config);
    setPrintPageSize(config.paper.widthMm, config.paper.heightMm);
  }, [config, mounted]);

  function handlePrint() {
    setPrintPageSize(config.paper.widthMm, config.paper.heightMm);
    window.print();
  }

  return (
    <main className="min-h-screen">
      <header className="no-print border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              Bank Check Printer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Feed your bank's check paper into the printer, fill this in, and print — date &amp;
              amount land exactly where they belong.
            </p>
          </div>
          <ThemeAccentPicker
            accent={accent}
            onAccentChange={setAccent}
            theme={theme}
            onThemeChange={setTheme}
          />
        </div>
      </header>

      <div className="no-print max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        <div className="space-y-5 order-2 lg:order-1">
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Check details
            </h2>
            <CheckForm data={data} onChange={setData} onPrint={handlePrint} />
          </section>

          <CalibrationPanel
            config={config}
            onChange={setConfig}
            showGuides={showGuides}
            onToggleGuides={setShowGuides}
          />
        </div>

        <div className="order-1 lg:order-2">
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Live preview
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {config.paper.widthMm}mm × {config.paper.heightMm}mm
              </span>
            </div>
            <CheckPreview config={config} data={data} showGuides={showGuides} />
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              এই preview সঠিক না লাগলে বাম দিকের Calibration প্যানেল খুলে X/Y/pitch বদলান, একটা test
              print নিন, ধাপে ধাপে মেলান — position localStorage-এ auto-save হয়।
            </p>
          </section>
        </div>
      </div>

      {/* Print-only render: identical preview, isolated from the screen layout so
          nothing but the check itself reaches paper. */}
      <div className="hidden print:block">
        <CheckPreview config={config} data={data} showGuides={false} forPrint />
      </div>
    </main>
  );
}
