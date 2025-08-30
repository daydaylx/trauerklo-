import React from "react";
import type { KlossConfig, Material } from "../types/core";
import { Shape, Eyes, Mouth, AccHead, AccFace, AccNeck, FACE_DEFAULT } from "./klopsShapes";

type Props = { cfg: KlossConfig; emotion: "happy"|"meh"|"concerned"|"idle"|"talk" };

function mat(m: Material|undefined){
  switch (m) {
    case "matte": return { gloss: 0.12, rim: 0.18, ao: 0.18, noise: 0.05, drop: 0.18 };
    case "paper": return { gloss: 0.06, rim: 0.10, ao: 0.14, noise: 0.09, drop: 0.12 };
    default:      return { gloss: 0.38, rim: 0.32, ao: 0.22, noise: 0.03, drop: 0.25 }; // jelly
  }
}

export function KlopsView({ cfg, emotion }: Props) {
  const p = cfg.face ?? FACE_DEFAULT;
  const m = mat(cfg.material);
  const anim =
    emotion === "happy"     ? "animate-wobble-fast" :
    emotion === "talk"      ? "animate-wobble-slow" :
    emotion === "concerned" ? "animate-float" :
                               "animate-breath";

  return (
    <div className={`mx-auto w-72 h-72 relative glass-heavy rounded-3xl p-4 ${anim}`}>
      <svg viewBox="0 0 256 256" className="w-full h-full">
        <defs>
          {/* Körper: 3-Ton */}
          <radialGradient id="kl-body" cx="30%" cy="30%" r="80%">
            <stop offset="0%"   stopColor="var(--kl-blob-light)" />
            <stop offset="62%"  stopColor="var(--kl-blob)" />
            <stop offset="100%" stopColor="var(--kl-blob-dark)" />
          </radialGradient>

          {/* Rimlight: hauchdünn */}
          <linearGradient id="kl-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`rgba(255,255,255,${m.rim})`} />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Gloss oben links */}
          <radialGradient id="kl-gloss" cx="36%" cy="26%" r="32%">
            <stop offset="0%"   stopColor="white" stopOpacity={m.gloss}/>
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Ambient-Occlusion am Bauch */}
          <linearGradient id="kl-ao" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor={`rgba(0,0,0,${m.ao})`} />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>

          {/* Mund-Gradient (leicht glänzend) */}
          <linearGradient id="kl-mouth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.85)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.65)" />
          </linearGradient>

          {/* Boden-Schatten separat (gibt „Kontakt“ zur Fläche) */}
          <radialGradient id="ground" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.35)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>

          {/* Drop Shadow */}
          <filter id="kl-drop" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#000" floodOpacity={m.drop} />
          </filter>

          {/* Eye Shadow dezent */}
          <filter id="eye-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000" floodOpacity="0.25"/>
          </filter>

          {/* Soft Noise – nur Hauch von Material */}
          <filter id="kl-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="7" />
            <feColorMatrix type="matrix"
              values={`0 0 0 0 0
                       0 0 0 0 0
                       0 0 0 0 0
                       0 0 0 ${m.noise} 0`} />
          </filter>

          {/* Clip auf Körper */}
          <clipPath id="clip-body">
            <Shape type={cfg.baseShape} />
          </clipPath>
        </defs>

        {/* Bodenschatten */}
        <ellipse cx="128" cy="196" rx="56" ry="16" fill="url(#ground)" opacity="0.45" />

        <g filter="url(#kl-drop)">
          {/* Körper */}
          <Shape type={cfg.baseShape} fill="url(#kl-body)" />
          {/* feines Rimlight */}
          <Shape type={cfg.baseShape} fill="none" stroke="url(#kl-rim)" strokeWidth={1.4} />
          {/* AO */}
          <path d="M56 168 C 96 196 160 196 200 168" fill="none" stroke="url(#kl-ao)" strokeWidth="12" opacity="0.35" strokeLinecap="round" />
          {/* Gloss */}
          <ellipse cx="98" cy="84" rx="58" ry="36" fill="url(#kl-gloss)" />
        </g>

        {/* Material-Noise + Blush im Clip */}
        <g clipPath="url(#clip-body)">
          <rect x="0" y="0" width="256" height="256" filter="url(#kl-noise)" />
          {/* Blush zarter und weiter außen → natürlicher */}
          <ellipse cx={128 - (p.eyeOffsetX)} cy={p.eyeY + 20} rx="16" ry="10" fill="rgba(255,120,140,0.10)"/>
          <ellipse cx={128 + (p.eyeOffsetX)} cy={p.eyeY + 20} rx="16" ry="10" fill="rgba(255,120,140,0.10)"/>
        </g>

        {/* Gesicht */}
        <g filter="url(#eye-shadow)" className="origin-center animate-blink">
          <Eyes type={cfg.eyes} face={p} />
        </g>
        <Mouth type={cfg.mouth} face={p} />

        {/* Accessoires */}
        <AccHead kind={cfg.accessories.head} />
        <AccFace kind={cfg.accessories.face} />
        <AccNeck kind={cfg.accessories.neck} />
      </svg>
    </div>
  );
}
