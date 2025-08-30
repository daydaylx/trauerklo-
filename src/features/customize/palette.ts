import type { PaletteId } from "../../types/core";

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

function hexToRgb(h:string){ const m=h.replace("#",""); return { r:parseInt(m.slice(0,2),16), g:parseInt(m.slice(2,4),16), b:parseInt(m.slice(4,6),16) }; }
function rgbToHex(r:number,g:number,b:number){ const to=(n:number)=>n.toString(16).padStart(2,"0"); return "#"+to(r)+to(g)+to(b); }
function mix(hex:string, amt:number){
  const {r,g,b}=hexToRgb(hex);
  if (amt>=0){ const t=amt; return rgbToHex(Math.round(r+(255-r)*t), Math.round(g+(255-g)*t), Math.round(b+(255-b)*t)); }
  const t=-amt; return rgbToHex(Math.round(r*(1-t)), Math.round(g*(1-t)), Math.round(b*(1-t)));
}

export function applyPalette(palette: PaletteId){
  const base = PALETTES[palette] ?? "#7dd3fc";
  const light = mix(base, 0.18);
  const dark  = mix(base, -0.14);
  const glow  = mix(base, 0.28);
  const root = document.documentElement.style;
  root.setProperty("--kl-blob", base);
  root.setProperty("--kl-blob-light", light);
  root.setProperty("--kl-blob-dark", dark);
  root.setProperty("--kl-blob-glow", glow);
  root.setProperty("--kl-accent", base);
}
