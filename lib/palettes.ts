export interface AccentPalette {
  id: string;
  label: string;
  swatch: string; // representative hex for the color picker chip
  shades: Record<
    "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
    string
  >;
}

export const ACCENT_PALETTES: AccentPalette[] = [
  {
    id: "blue",
    label: "Blue",
    swatch: "#2563eb",
    shades: {
      "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd",
      "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8",
      "800": "#1e40af", "900": "#1e3a8a",
    },
  },
  {
    id: "emerald",
    label: "Emerald",
    swatch: "#059669",
    shades: {
      "50": "#ecfdf5", "100": "#d1fae5", "200": "#a7f3d0", "300": "#6ee7b7",
      "400": "#34d399", "500": "#10b981", "600": "#059669", "700": "#047857",
      "800": "#065f46", "900": "#064e3b",
    },
  },
  {
    id: "violet",
    label: "Violet",
    swatch: "#7c3aed",
    shades: {
      "50": "#f5f3ff", "100": "#ede9fe", "200": "#ddd6fe", "300": "#c4b5fd",
      "400": "#a78bfa", "500": "#8b5cf6", "600": "#7c3aed", "700": "#6d28d9",
      "800": "#5b21b6", "900": "#4c1d95",
    },
  },
  {
    id: "rose",
    label: "Rose",
    swatch: "#e11d48",
    shades: {
      "50": "#fff1f2", "100": "#ffe4e6", "200": "#fecdd3", "300": "#fda4af",
      "400": "#fb7185", "500": "#f43f5e", "600": "#e11d48", "700": "#be123c",
      "800": "#9f1239", "900": "#881337",
    },
  },
  {
    id: "amber",
    label: "Amber",
    swatch: "#d97706",
    shades: {
      "50": "#fffbeb", "100": "#fef3c7", "200": "#fde68a", "300": "#fcd34d",
      "400": "#fbbf24", "500": "#f59e0b", "600": "#d97706", "700": "#b45309",
      "800": "#92400e", "900": "#78350f",
    },
  },
  {
    id: "teal",
    label: "Teal",
    swatch: "#0d9488",
    shades: {
      "50": "#f0fdfa", "100": "#ccfbf1", "200": "#99f6e4", "300": "#5eead4",
      "400": "#2dd4bf", "500": "#14b8a6", "600": "#0d9488", "700": "#0f766e",
      "800": "#115e59", "900": "#134e4a",
    },
  },
];

export function applyAccentPalette(paletteId: string) {
  const palette = ACCENT_PALETTES.find((p) => p.id === paletteId) ?? ACCENT_PALETTES[0];
  const root = document.documentElement;
  (Object.keys(palette.shades) as Array<keyof AccentPalette["shades"]>).forEach((shade) => {
    root.style.setProperty(`--accent-${shade}`, palette.shades[shade]);
  });
}
