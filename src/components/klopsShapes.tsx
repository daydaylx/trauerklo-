import React from "react";
import type {
  BaseShape, Eyes as EyesT, Mouth as MouthT,
  AccessoryHead, AccessoryFace, AccessoryNeck
} from "../types/core";

/** Base Shape als Path – Fill via CSS-Var --kl-blob */
export function Shape({ type }: { type: BaseShape }) {
  const fill = "var(--kl-blob)";
  switch (type) {
    case "classic":
      return <path fill={fill} d="M58,120c0-39,29-70,70-70s70,31,70,70-29,78-70,78S58,159,58,120Z" />;
    case "squish":
      return <path fill={fill} d="M52,128c0-37,34-76,86-66s66,43,66,66-18,78-86,78S52,165,52,128Z" />;
    case "ripple":
      return <path fill={fill} d="M64,120c0-36,33-68,74-68s54,14,62,30c9,17,6,36,6,54s-18,60-68,68S64,156,64,120Z" />;
    case "stardrop":
      return <path fill={fill} d="M128,44c22,28,42,40,42,72s-18,82-42,82-42-50-42-82,20-44,42-72Z" />;
    case "bean":
      return <path fill={fill} d="M76,116c0-28,24-52,54-52s50,22,50,50-14,84-68,88S76,144,76,116Z" />;
    case "drip":
      return <path fill={fill} d="M84,116c0-28,24-52,54-52s42,18,42,38-10,26-10,44-14,48-44,50-42-28-42-80Z" />;
  }
}

export function Eyes({ type }: { type: EyesT }) {
  const c = "#0f0f12";
  switch (type) {
    case "simple":
      return <>
        <circle cx="102" cy="118" r="8" fill={c}/>
        <circle cx="154" cy="118" r="8" fill={c}/>
      </>;
    case "sleepy":
      return <>
        <path d="M92 118 q10 -6 20 0" stroke={c} strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M144 118 q10 -6 20 0" stroke={c} strokeWidth="6" fill="none" strokeLinecap="round"/>
      </>;
    case "shiny":
      return <>
        <circle cx="104" cy="118" r="10" fill={c}/><circle cx="104" cy="114" r="3" fill="var(--kl-blob)"/>
        <circle cx="152" cy="118" r="10" fill={c}/><circle cx="152" cy="114" r="3" fill="var(--kl-blob)"/>
      </>;
  }
}

export function Mouth({ type }: { type: MouthT }) {
  const c = "#0f0f12";
  switch (type) {
    case "neutral": return <path d="M102 160 h52" stroke={c} strokeWidth="6" strokeLinecap="round" fill="none"/>;
    case "smile": return <path d="M96 154 q32 24 64 0" stroke={c} strokeWidth="6" strokeLinecap="round" fill="none"/>;
    case "pout": return <path d="M108 160 q20 -12 40 0" stroke={c} strokeWidth="6" strokeLinecap="round" fill="none"/>;
  }
}

export function AccHead({ kind }: { kind?: AccessoryHead }) {
  if (!kind) return null;
  switch (kind) {
    case "beanie": return <path d="M84 96 q44 -36 88 0" fill="#111827" />;
    case "hat": return <>
      <rect x="86" y="92" width="84" height="12" fill="#111827"/>
      <rect x="104" y="80" width="48" height="12" fill="#111827"/>
    </>;
  }
}

export function AccFace({ kind }: { kind?: AccessoryFace }) {
  if (!kind) return null;
  switch (kind) {
    case "plaster": return <rect x="116" y="128" width="24" height="8" rx="3" fill="#fbbf24"/>;
    case "tear": return <path d="M150 130 q-6 10 -2 16 q6 6 10 0 q2 -6 -8 -16 z" fill="#60a5fa"/>;
  }
}

export function AccNeck({ kind }: { kind?: AccessoryNeck }) {
  if (!kind) return null;
  return <path d="M102 172 h52 q-12 10 -26 12 q-16 -2 -26 -12 z" fill="#1f2937"/>;
}
