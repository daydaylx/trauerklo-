import type { PaletteId } from "../../types/core";

/** zentrale Farbzuordnung (Base-Ton des Blobs) */
export const PALETTES: Record<PaletteId, string> = {
  "pastel-mint": "#7dd3fc",
  "pastel-peach": "#f9c8b8",
  "lavender": "#c4b5fd",
  "sage": "#a7f3d0",
  "night-sky": "#93c5fd",
  "sand": "#fcd9a4",
  "candy": "#fba1d0",
  "slate": "#94a3b8"
};

export function applyPalette(palette: PaletteId) {
  const hex = PALETTES[palette] ?? "#7dd3fc";
  document.documentElement.style.setProperty("--kl-blob", hex);
  // Option: Accent anpassen
  document.documentElement.style.setProperty("--kl-accent", hex);
}
