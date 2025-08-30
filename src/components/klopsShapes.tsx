import React from "react";
import type {
  BaseShape, Eyes as EyesT, Mouth as MouthT,
  AccessoryHead, AccessoryFace, AccessoryNeck, FaceParams
} from "../types/core";

/** Frischere Standard-Proportionen */
export const FACE_DEFAULT: FaceParams = {
  eyeOffsetX: 30,   // weiter auseinander -> weniger "Knopfaugen"
  eyeY: 116,        // minimal höher
  eyeScale: 1.05,   // etwas größer
  mouthY: 160,
  mouthWidth: 60,
};

/** Körperform – Füllung/Stroke von außen */
export function Shape({ type, fill, stroke, strokeWidth = 0 }: {
  type: BaseShape; fill?: string; stroke?: string; strokeWidth?: number;
}) {
  const d = (() => {
    switch (type) {
      case "classic":  return "M58,120c0-39,29-70,70-70s70,31,70,70-29,78-70,78S58,159,58,120Z";
      case "squish":   return "M52,128c0-37,34-76,86-66s66,43,66,66-18,78-86,78S52,165,52,128Z";
      case "ripple":   return "M64,120c0-36,33-68,74-68s54,14,62,30c9,17,6,36,6,54s-18,60-68,68S64,156,64,120Z";
      case "stardrop": return "M128,44c22,28,42,40,42,72s-18,82-42,82-42-50-42-82,20-44,42-72Z";
      case "bean":     return "M76,116c0-28,24-52,54-52s50,22,50,50-14,84-68,88S76,144,76,116Z";
      case "drip":     return "M84,116c0-28,24-52,54-52s42,18,42,38-10,26-10,44-14,48-44,50-42-28-42-80Z";
    }
  })();
  return <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />;
}

/** Augen: Sclera + Pupille + Glanz + hauchdünnes Lid (tint = --kl-blob-dark) */
export function Eyes({ type, face = FACE_DEFAULT }: { type: EyesT; face?: FaceParams }) {
  const k = "#0f0f12";
  const cxL = 128 - face.eyeOffsetX;
  const cxR = 128 + face.eyeOffsetX;
  const cy  = face.eyeY;
  const rx  = 10.5 * face.eyeScale;
  const ry  = 8.8  * face.eyeScale;
  const pupil = 6.4 * face.eyeScale;
  const sparkle = 2.2 * face.eyeScale;

  if (type === "sleepy") {
    const w = 26 * face.eyeScale;
    const h = 7  * face.eyeScale;
    return (
      <>
        <path d={`M ${cxL - w/2} ${cy} q ${w/2} ${-h} ${w} 0`} stroke={k} strokeWidth={6} fill="none" strokeLinecap="round"/>
        <path d={`M ${cxR - w/2} ${cy} q ${w/2} ${-h} ${w} 0`} stroke={k} strokeWidth={6} fill="none" strokeLinecap="round"/>
      </>
    );
  }

  return (
    <>
      {/* links */}
      <ellipse cx={cxL} cy={cy} rx={rx} ry={ry} fill="white" opacity="0.98" />
      <circle  cx={cxL} cy={cy} r={pupil} fill={k} />
      <circle  cx={cxL - rx*0.32} cy={cy - ry*0.32} r={sparkle} fill="white" opacity="0.9" />
      {/* hauchdünnes Lid */}
      <path d={`M ${cxL-rx} ${cy-ry*0.6} q ${rx} ${-ry*0.6} ${2*rx} 0`} stroke="var(--kl-blob-dark)" strokeOpacity="0.25" strokeWidth="2" fill="none" />

      {/* rechts */}
      <ellipse cx={cxR} cy={cy} rx={rx} ry={ry} fill="white" opacity="0.98" />
      <circle  cx={cxR} cy={cy} r={pupil} fill={k} />
      <circle  cx={cxR - rx*0.32} cy={cy - ry*0.32} r={sparkle} fill="white" opacity="0.9" />
      <path d={`M ${cxR-rx} ${cy-ry*0.6} q ${rx} ${-ry*0.6} ${2*rx} 0`} stroke="var(--kl-blob-dark)" strokeOpacity="0.25" strokeWidth="2" fill="none" />
    </>
  );
}

/** Mund: dicker, leicht glänzender Stroke (Gradient per ID kl-mouth) */
export function Mouth({ type, face = FACE_DEFAULT }: { type: MouthT; face?: FaceParams }) {
  const x0 = 128 - face.mouthWidth/2;
  const x1 = 128 + face.mouthWidth/2;
  const y  = face.mouthY;
  const w  = face.mouthWidth;
  const amp = 12 * Math.max(0.9, face.eyeScale);

  const stroke = "url(#kl-mouth)";
  const sw = 7; // dicker für Lesbarkeit

  if (type === "neutral") return <path d={`M ${x0} ${y} H ${x1}`} stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />;
  if (type === "smile")   return <path d={`M ${x0} ${y} Q 128 ${y+amp} ${x1} ${y}`} stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />;
  return                    <path d={`M ${x0} ${y} Q 128 ${y-amp} ${x1} ${y}`} stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />;
}

export function AccHead({ kind }: { kind?: AccessoryHead }) {
  if (!kind) return null;
  switch (kind) {
    case "beanie": return <path d="M84 96 q44 -36 88 0" fill="#111827" />;
    case "hat":    return <>
      <rect x="86" y="92" width="84" height="12" fill="#111827"/><rect x="104" y="80" width="48" height="12" fill="#111827"/>
    </>;
  }
}
export function AccFace({ kind }: { kind?: AccessoryFace }) {
  if (!kind) return null;
  switch (kind) {
    case "plaster": return <rect x="116" y="128" width="24" height="8" rx="3" fill="#fbbf24"/>;
    case "tear":    return <path d="M150 130 q-6 10 -2 16 q6 6 10 0 q2 -6 -8 -16 z" fill="#60a5fa"/>;
  }
}
export function AccNeck({ kind }: { kind?: AccessoryNeck }) {
  if (!kind) return null;
  return <path d="M102 172 h52 q-12 10 -26 12 q-16 -2 -26 -12 z" fill="#1f2937"/>;
}
