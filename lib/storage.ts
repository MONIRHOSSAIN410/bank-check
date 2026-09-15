import { CalibrationConfig, DEFAULT_CONFIG } from "./types";

const LAST_CONFIG_KEY = "bcp:last-config";
const PRESETS_KEY = "bcp:presets";
const ACCENT_KEY = "bcp:accent";
const THEME_KEY = "bcp:theme";

export type PresetMap = Record<string, CalibrationConfig>;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

export function loadLastConfig(): CalibrationConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  return safeParse(localStorage.getItem(LAST_CONFIG_KEY), DEFAULT_CONFIG);
}

export function saveLastConfig(config: CalibrationConfig) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // best-effort; ignore quota/private-mode errors
  }
}

export function loadPresets(): PresetMap {
  if (typeof window === "undefined") return {};
  return safeParse(localStorage.getItem(PRESETS_KEY), {});
}

export function savePreset(name: string, config: CalibrationConfig) {
  if (typeof window === "undefined") return;
  const presets = loadPresets();
  presets[name] = config;
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  } catch {
    // ignore
  }
}

export function deletePreset(name: string) {
  if (typeof window === "undefined") return;
  const presets = loadPresets();
  delete presets[name];
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  } catch {
    // ignore
  }
}

export function loadAccent(): string {
  if (typeof window === "undefined") return "blue";
  return localStorage.getItem(ACCENT_KEY) ?? "blue";
}

export function saveAccent(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCENT_KEY, id);
}

export function loadTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem(THEME_KEY) as "light" | "dark") ?? "light";
}

export function saveTheme(theme: "light" | "dark") {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
}
