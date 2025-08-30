export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  text: string;
  ts: number;
}

export interface Summary {
  ts: number;
  text: string;
}

export type BaseShape = "classic"|"squish"|"ripple"|"stardrop"|"bean"|"drip";
export type Eyes = "simple"|"sleepy"|"shiny";
export type Mouth = "neutral"|"smile"|"pout";

export type AccessoryHead = "beanie"|"hat";
export type AccessoryFace = "plaster"|"tear";
export type AccessoryNeck = "scarf";

export type PaletteId =
  | "pastel-mint" | "pastel-peach" | "lavender" | "sage"
  | "night-sky" | "sand" | "candy" | "slate";

export type Material = "jelly" | "matte" | "paper";

export interface FaceParams {
  /** halber Augenabstand ab Center (px) */
  eyeOffsetX: number; // 16..36
  /** Augenhöhe (px) */
  eyeY: number;       // 110..126
  /** Augen-Skalierung (1 = Standard) */
  eyeScale: number;   // 0.8..1.2
  /** Mundhöhe (px) */
  mouthY: number;     // 148..172
  /** Mundbreite (px) */
  mouthWidth: number; // 40..84
}

export interface KlossConfig {
  id: string;
  label: string;
  baseShape: BaseShape;
  eyes: Eyes;
  mouth: Mouth;
  accessories: Partial<{
    head: AccessoryHead;
    face: AccessoryFace;
    neck: AccessoryNeck;
  }>;
  palette: PaletteId;
  /** visuelle Materialart (neu) */
  material?: Material;
  /** Gesichts-Geometrie (neu) */
  face?: FaceParams;
}

export interface Settings {
  apiKey: string;
  modelId: string;
  streaming: boolean;
  tokenCapPerMsg: number;
  dailyTokenCap: number;
  language: "de"|"en";
  theme: "system"|"light"|"dark";
  resetDaily: boolean;
  haptics: boolean;
}
