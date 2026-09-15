"use client";

import { ACCENT_PALETTES } from "@/lib/palettes";

interface Props {
  accent: string;
  onAccentChange: (id: string) => void;
  theme: "light" | "dark";
  onThemeChange: (t: "light" | "dark") => void;
}

export default function ThemeAccentPicker({ accent, onAccentChange, theme, onThemeChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        {ACCENT_PALETTES.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-label={p.label}
            title={p.label}
            onClick={() => onAccentChange(p.id)}
            className={`h-6 w-6 rounded-full ring-offset-2 ring-offset-white dark:ring-offset-slate-950 transition-transform ${
              accent === p.id ? "ring-2 ring-slate-900 dark:ring-white scale-110" : "hover:scale-105"
            }`}
            style={{ backgroundColor: p.swatch }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
        className="rounded-full border border-slate-300 dark:border-slate-700 h-8 w-8 flex items-center justify-center text-sm bg-white dark:bg-slate-900"
        title="Toggle light / dark"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}
