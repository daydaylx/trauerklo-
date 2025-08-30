import React from "react";
import type { KlossConfig } from "../types/core";
import { Shape, Eyes, Mouth, AccHead, AccFace, AccNeck } from "./klopsShapes";

type Props = { cfg: KlossConfig; emotion: "happy"|"meh"|"concerned"|"idle"|"talk" };

export function KlopsView({ cfg, emotion }: Props) {
  const anim =
    emotion === "happy" ? "animate-wobble-fast" :
    emotion === "talk" ? "animate-wobble-slow" :
    emotion === "concerned" ? "animate-float" : "animate-blink";

  return (
    <div className={`mx-auto w-72 h-72 relative glass-heavy rounded-3xl p-4 ${anim}`}>
      <svg viewBox="0 0 256 256" className="w-full h-full">
        <Shape type={cfg.baseShape} />
        <Eyes type={cfg.eyes} />
        <Mouth type={cfg.mouth} />
        <AccHead kind={cfg.accessories.head} />
        <AccFace kind={cfg.accessories.face} />
        <AccNeck kind={cfg.accessories.neck} />
      </svg>
    </div>
  );
}
