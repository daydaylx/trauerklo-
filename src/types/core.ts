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
