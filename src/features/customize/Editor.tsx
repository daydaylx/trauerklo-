import { useEffect, useMemo, useState } from "react";
import type {
  KlossConfig, BaseShape, Eyes, Mouth, PaletteId,
  AccessoryHead, AccessoryFace, AccessoryNeck
} from "../../types/core";
import { db } from "../../db/dexie";
import { KlopsView } from "../../components/KlopsView";
import { applyPalette, PALETTES } from "./palette";

const SHAPES: BaseShape[] = ["classic","squish","ripple","stardrop","bean","drip"];
const EYES: Eyes[] = ["simple","sleepy","shiny"];
const MOUTHS: Mouth[] = ["neutral","smile","pout"];
const HEAD: AccessoryHead[] = ["beanie","hat"];
const FACE: AccessoryFace[] = ["plaster","tear"];
const NECK: AccessoryNeck[] = ["scarf"];
const PAL: PaletteId[] = ["pastel-mint","pastel-peach","lavender","sage","night-sky","sand","candy","slate"];

const DEFAULT: KlossConfig = {
  id: "current", label: "Aktuell",
  baseShape: "classic", eyes: "shiny", mouth: "smile",
  accessories: {}, palette: "pastel-mint"
};

export function Editor() {
  const [cfg, setCfg] = useState<KlossConfig>(DEFAULT);
  const [presets, setPresets] = useState<KlossConfig[]>([]);

  useEffect(() => {
    db.presets.get("current").then(p => {
      const base = p ?? DEFAULT;
      setCfg(base);
      applyPalette(base.palette);
    });
    db.presets.toArray().then(setPresets);
  }, []);

  function update<K extends keyof KlossConfig>(k: K, v: KlossConfig[K]) {
    const next = { ...cfg, [k]: v };
    setCfg(next);
    if (k === "palette") applyPalette(v as PaletteId);
    db.presets.put(next);
  }

  function setAcc(slot: "head"|"face"|"neck", v?: string) {
    const next = { ...cfg, accessories: { ...cfg.accessories, [slot]: v } };
    setCfg(next);
    db.presets.put(next);
  }

  async function savePreset() {
    const p = { ...cfg, id: crypto.randomUUID(), label: `Preset ${presets.length+1}` };
    await db.presets.add(p);
    setPresets(await db.presets.toArray());
  }

  async function loadPreset(id: string) {
    const p = await db.presets.get(id);
    if (!p) return;
    const next = { ...p, id: "current", label: "Aktuell" };
    setCfg(next);
    applyPalette(next.palette);
    await db.presets.put(next);
  }

  function randomize() {
    const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random()*arr.length)];
    const next: KlossConfig = {
      id: "current", label: "Aktuell",
      baseShape: pick(SHAPES), eyes: pick(EYES), mouth: pick(MOUTHS),
      accessories: {
        head: Math.random() < 0.5 ? pick(HEAD) : undefined,
        face: Math.random() < 0.3 ? pick(FACE) : undefined,
        neck: Math.random() < 0.4 ? pick(NECK) : undefined,
      },
      palette: pick(PAL)
    };
    setCfg(next);
    applyPalette(next.palette);
    db.presets.put(next);
  }

  const paletteList = useMemo(() => PAL.map(p => ({ id: p, hex: PALETTES[p] })), []);

  return (
    <div className="max-w-5xl mx-auto p-4 flex flex-col gap-6">
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-semibold">Avatar-Editor</h1>
        <div className="flex gap-3">
          <button onClick={savePreset} className="btn-accent">Preset speichern</button>
          <button onClick={randomize} className="btn glass">🎲 Zufall</button>
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        {/* Preview Panel */}
        <div className="rounded-3xl p-6 glass-heavy relative overflow-hidden">
          <div className="absolute inset-0 -z-10 animate-float"
               style={{ background: "radial-gradient(60% 60% at 20% 20%, rgba(125,211,252,0.15), transparent 60%), radial-gradient(60% 60% at 80% 30%, rgba(255,255,255,0.06), transparent 60%)" }} />
          <KlopsView cfg={cfg} emotion="idle" />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3 items-start">
          <Select label="Form" value={cfg.baseShape} options={SHAPES} onChange={v=>update("baseShape", v as BaseShape)} />
          <Select label="Palette" value={cfg.palette} options={PAL} onChange={v=>update("palette", v as PaletteId)} />
          <Select label="Augen" value={cfg.eyes} options={EYES} onChange={v=>update("eyes", v as Eyes)} />
          <Select label="Mund" value={cfg.mouth} options={MOUTHS} onChange={v=>update("mouth", v as Mouth)} />
          <Select label="Head" value={cfg.accessories.head ?? ""} options={["",...HEAD]} onChange={v=>setAcc("head", v || undefined)} />
          <Select label="Face" value={cfg.accessories.face ?? ""} options={["",...FACE]} onChange={v=>setAcc("face", v || undefined)} />
          <Select label="Neck" value={cfg.accessories.neck ?? ""} options={["",...NECK]} onChange={v=>setAcc("neck", v || undefined)} />

          {/* Palette Swatches */}
          <div className="col-span-2">
            <div className="text-sm text-kl-muted mb-1">Farbwelten</div>
            <div className="flex flex-wrap gap-2">
              {paletteList.map(p => (
                <button key={p.id}
                        title={p.id}
                        onClick={()=>update("palette", p.id as PaletteId)}
                        className={`w-8 h-8 rounded-full border ${cfg.palette===p.id?"ring-2 ring-[var(--kl-accent)]":""}`}
                        style={{ background: p.hex }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Presets */}
      <section>
        <h2 className="font-medium mb-2">Presets</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presets.filter(p=>p.id!=="current").map(p => (
            <button key={p.id} onClick={()=>loadPreset(p.id)} className="glass rounded-2xl p-3 hover:bg-white/12 transition">
              <div className="w-full aspect-square">
                {/* Mini-Preview */}
                <div className="scale-75 origin-top">
                  <KlopsView cfg={p} emotion="idle" />
                </div>
              </div>
              <div className="text-sm mt-2">{p.label}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function Select<T extends string>({ label, value, options, onChange }:{
  label: string; value: string; options: readonly T[]; onChange: (v:string)=>void
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-kl-muted">{label}</span>
      <select className="seg" value={value} onChange={(e)=>onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o||"—"}</option>)}
      </select>
    </label>
  );
}
